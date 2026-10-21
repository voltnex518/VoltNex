-- VoltNex Storage Buckets and Policies
-- Migration: 20261021000003_storage_buckets.sql
-- Description: Sets up storage buckets for images, circuit schematics, and downloadable code/firmware archives

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'project-media',
    'project-media',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
  ),
  (
    'project-downloads',
    'project-downloads',
    true,
    52428800, -- 50MB limit
    ARRAY[
      'application/zip',
      'application/x-zip-compressed',
      'application/pdf',
      'text/plain',
      'text/x-c',
      'text/x-c++',
      'text/x-python',
      'application/json',
      'application/octet-stream'
    ]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Objects RLS Policies

-- Public can view files in public buckets
CREATE POLICY "Public Read Access for Media"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('project-media', 'project-downloads'));

-- Admin upload policy
CREATE POLICY "Admin Insert Files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('project-media', 'project-downloads')
    AND public.is_admin()
  );

-- Admin update policy
CREATE POLICY "Admin Update Files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('project-media', 'project-downloads')
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('project-media', 'project-downloads')
    AND public.is_admin()
  );

-- Admin delete policy
CREATE POLICY "Admin Delete Files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('project-media', 'project-downloads')
    AND public.is_admin()
  );
