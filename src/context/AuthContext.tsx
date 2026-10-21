import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_KEY = 'voltnex_demo_admin_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDemo = !isSupabaseConfigured();

  // Helper to query profiles table for server-enforced role
  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('Profile fetch error or non-existent:', error);
        return null;
      }
      return data as Profile;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    if (isDemo) {
      // Local demo mode: check if demo session exists in localStorage
      const savedDemo = localStorage.getItem(DEMO_ADMIN_KEY);
      if (savedDemo === 'true') {
        setUser({
          id: 'demo-admin-id',
          email: 'voltnex518@gmail.com',
          app_metadata: {},
          user_metadata: { full_name: 'Pradeep (Owner Demo)' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User);
        setProfile({
          id: 'demo-admin-id',
          email: 'voltnex518@gmail.com',
          role: 'admin',
          full_name: 'Pradeep',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Initialize Supabase Auth session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const userProfile = await fetchUserProfile(currentSession.user.id);
        if (mounted) setProfile(userProfile);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const userProfile = await fetchUserProfile(newSession.user.id);
        if (mounted) setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemo]);

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isDemo) {
      // In demo mode without configured Supabase credentials, allow logging in as owner
      if (email.toLowerCase().trim() === 'voltnex518@gmail.com') {
        localStorage.setItem(DEMO_ADMIN_KEY, 'true');
        setUser({
          id: 'demo-admin-id',
          email: 'voltnex518@gmail.com',
          app_metadata: {},
          user_metadata: { full_name: 'Pradeep (Owner Demo)' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User);
        setProfile({
          id: 'demo-admin-id',
          email: 'voltnex518@gmail.com',
          role: 'admin',
          full_name: 'Pradeep',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsLoading(false);
        return {};
      } else {
        setIsLoading(false);
        return {
          error: 'Demo sign-in is reserved for the owner account (voltnex518@gmail.com). Enter this email or configure live Supabase credentials.',
        };
      }
    }

    if (!supabase) {
      setIsLoading(false);
      return { error: 'Supabase client is not available.' };
    }

    if (!password) {
      setIsLoading(false);
      return { error: 'Password is required for live authentication.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        setProfile(userProfile);

        if (userProfile?.role !== 'admin') {
          // If authenticated but not granted admin role in database profiles table
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsLoading(false);
          return {
            error: 'Access restricted: Your account does not have administrator privileges.',
          };
        }
      }

      setIsLoading(false);
      return {};
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      return { error: msg };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isDemo) {
      localStorage.removeItem(DEMO_ADMIN_KEY);
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }

    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ error?: string; message?: string }> => {
    if (isDemo) {
      return {
        message: 'Password reset request received. (In demo mode, direct login is enabled).',
      };
    }
    if (!supabase) {
      return { error: 'Supabase is not configured.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) return { error: error.message };
      return { message: 'Password reset email sent successfully. Check your inbox.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email';
      return { error: msg };
    }
  };

  const isAdmin = useMemo(() => {
    if (isDemo) {
      return !!user && profile?.role === 'admin';
    }
    return !!user && profile?.role === 'admin';
  }, [user, profile, isDemo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        isDemoMode: isDemo,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
