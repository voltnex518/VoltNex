// Safe file storage validation and upload helper for VoltNex
import { supabase, isSupabaseConfigured } from './supabase';

export const MAX_MEDIA_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DOWNLOAD_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
export const ALLOWED_IMAGE_MIMES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

export const ALLOWED_RESOURCE_EXTENSIONS = [
  'ino',
  'c',
  'cpp',
  'h',
  'hpp',
  'py',
  'zip',
  'pdf',
  'json',
  'txt',
  'hex',
  'bin',
  'png',
  'jpg'
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
  extension?: string;
}

/**
 * Validates untrusted browser-provided file metadata
 */
export function validateUploadFile(
  file: File,
  type: 'media' | 'download'
): FileValidationResult {
  if (!file || !file.name) {
    return { isValid: false, error: 'No file provided.' };
  }

  const parts = file.name.split('.');
  if (parts.length < 2) {
    return { isValid: false, error: 'File must have an explicit extension.' };
  }

  const rawExt = parts.pop()?.toLowerCase() || '';
  // Sanitize filename to prevent directory traversal
  const rawBase = parts.join('.').replace(/[^a-zA-Z0-9_-]/g, '_');
  const sanitizedName = `${rawBase}.${rawExt}`;

  if (type === 'media') {
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(rawExt)) {
      return {
        isValid: false,
        error: `Invalid image type .${rawExt}. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
      };
    }
    if (file.type && !ALLOWED_IMAGE_MIMES.includes(file.type)) {
      return {
        isValid: false,
        error: `MIME type "${file.type}" is not an accepted image format.`
      };
    }
    if (file.size > MAX_MEDIA_FILE_SIZE) {
      return {
        isValid: false,
        error: `Image exceeds maximum allowed size of 10MB (Current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      };
    }
  } else {
    // Downloadable project resources (.ino, .c, .cpp, .py, .zip, .pdf, etc.)
    if (!ALLOWED_RESOURCE_EXTENSIONS.includes(rawExt)) {
      return {
        isValid: false,
        error: `File type .${rawExt} is prohibited. Allowed: ${ALLOWED_RESOURCE_EXTENSIONS.join(', ')}`
      };
    }
    // Block executable extensions (.exe, .bat, .cmd, .sh, .js, .vbs, .ps1, .msi, etc.)
    const dangerousExtensions = ['exe', 'bat', 'cmd', 'sh', 'vbs', 'ps1', 'msi', 'com', 'scr', 'html', 'htm', 'php'];
    if (dangerousExtensions.includes(rawExt)) {
      return {
        isValid: false,
        error: `Executable file .${rawExt} is strictly blocked for security.`
      };
    }
    if (file.size > MAX_DOWNLOAD_FILE_SIZE) {
      return {
        isValid: false,
        error: `File exceeds maximum allowed size of 50MB (Current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      };
    }
  }

  return {
    isValid: true,
    sanitizedName,
    extension: rawExt
  };
}

/**
 * Uploads a validated file to Supabase Storage or demo storage
 */
export async function uploadFile(
  file: File,
  bucket: 'project-media' | 'project-downloads',
  folderPrefix: string = 'uploads'
): Promise<{ url: string; error?: string }> {
  const type = bucket === 'project-media' ? 'media' : 'download';
  const validation = validateUploadFile(file, type);
  if (!validation.isValid) {
    return { url: '', error: validation.error };
  }

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const safeFilename = `${folderPrefix}/${timestamp}_${randomSuffix}_${validation.sanitizedName}`;

  if (!isSupabaseConfigured() || !supabase) {
    // Demo fallback: Return a simulated object URL for preview and testing
    const demoUrl = URL.createObjectURL(file);
    return { url: demoUrl };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(safeFilename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return { url: '', error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown storage upload error';
    return { url: '', error: msg };
  }
}
