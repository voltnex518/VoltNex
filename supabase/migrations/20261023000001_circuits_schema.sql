-- VoltNex Circuit Studio Schema
-- Migration: 20261023000001_circuits_schema.sql
-- Description: Table, indexes, RLS policies, and seed data for interactive circuits

CREATE TABLE IF NOT EXISTS public.circuits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Arduino',
    difficulty TEXT NOT NULL DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_build_minutes INTEGER NOT NULL DEFAULT 30,
    cover_image_path TEXT,
    circuit_data JSONB NOT NULL DEFAULT '{"version": 1, "components": [], "wires": [], "viewport": {"x": 0, "y": 0, "zoom": 1}}'::jsonb,
    instructions TEXT,
    safety_notes TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indexes for efficient filtering and discovery
CREATE INDEX IF NOT EXISTS idx_circuits_status ON public.circuits(status);
CREATE INDEX IF NOT EXISTS idx_circuits_slug ON public.circuits(slug);
CREATE INDEX IF NOT EXISTS idx_circuits_category ON public.circuits(category);
CREATE INDEX IF NOT EXISTS idx_circuits_difficulty ON public.circuits(difficulty);
CREATE INDEX IF NOT EXISTS idx_circuits_featured ON public.circuits(featured);
CREATE INDEX IF NOT EXISTS idx_circuits_created_at ON public.circuits(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.circuits ENABLE ROW LEVEL SECURITY;

-- 1. Public can view published circuits only; admins can view all
CREATE POLICY "Public can view published circuits"
  ON public.circuits FOR SELECT
  USING (status = 'published' OR public.is_admin());

-- 2. Only authenticated admins can insert circuits
CREATE POLICY "Only admins can insert circuits"
  ON public.circuits FOR INSERT
  WITH CHECK (public.is_admin());

-- 3. Only authenticated admins can update circuits
CREATE POLICY "Only admins can update circuits"
  ON public.circuits FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Only authenticated admins can delete circuits
CREATE POLICY "Only admins can delete circuits"
  ON public.circuits FOR DELETE
  USING (public.is_admin());
