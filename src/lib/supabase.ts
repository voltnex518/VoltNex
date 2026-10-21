import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks if real, non-placeholder Supabase credentials have been configured
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('placeholder')) {
    return false;
  }
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
}

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (e) {
    console.warn('Could not initialize Supabase client:', e);
    client = null;
  }
}

export const supabase = client;

/**
 * Health check helper to test active Supabase connection
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      ok: false,
      message: 'Supabase credentials are not configured. Currently running in local offline demo mode.',
    };
  }

  try {
    const { error } = await supabase.from('site_settings').select('id').limit(1);
    if (error) {
      return { ok: false, message: `Database query error: ${error.message}` };
    }
    return { ok: true, message: 'Successfully connected to Supabase PostgreSQL database.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown connection error';
    return { ok: false, message: `Connection failed: ${msg}` };
  }
}
