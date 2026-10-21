-- VoltNex Row Level Security (RLS) Policies
-- Migration: 20261021000002_rls_policies.sql
-- Description: Enforce database authorization, public published-only visibility, and admin write access

-- Helper function: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Automatically create public.profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    -- Automatically designate the owner email as admin upon creation
    CASE WHEN LOWER(NEW.email) = LOWER('voltnex518@gmail.com') THEN 'admin' ELSE 'user' END,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Administrative promotion procedure (callable only by service role or superuser)
CREATE OR REPLACE FUNCTION public.set_user_admin(target_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin', updated_at = timezone('utc'::text, now())
  WHERE LOWER(email) = LOWER(target_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are readable by self and admins"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile details"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent non-admins from changing their own role to admin
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- 2. CATEGORIES POLICIES
CREATE POLICY "Categories are readable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- 3. PROJECTS POLICIES
CREATE POLICY "Public can view published projects only"
  ON public.projects FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_admin());

-- 4. PROJECT SUB-TABLES (Components, Steps, Snippets, Files, Categories, Tags)
-- Public can read if parent project is published; admin can read and edit all
CREATE POLICY "Public read published project categories"
  ON public.project_categories FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );
CREATE POLICY "Admin write project categories"
  ON public.project_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public read published project tags"
  ON public.project_tags FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );
CREATE POLICY "Admin write project tags"
  ON public.project_tags FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public read published project components"
  ON public.project_components FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );
CREATE POLICY "Admin write project components"
  ON public.project_components FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public read published project steps"
  ON public.project_steps FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );
CREATE POLICY "Admin write project steps"
  ON public.project_steps FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public read published project code snippets"
  ON public.project_code_snippets FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );
CREATE POLICY "Admin write project code snippets"
  ON public.project_code_snippets FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public read published project files"
  ON public.project_files FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.status = 'published' OR public.is_admin()))
  );
CREATE POLICY "Admin write project files"
  ON public.project_files FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. TUTORIALS POLICIES
CREATE POLICY "Public can view published tutorials only"
  ON public.tutorials FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can insert tutorials"
  ON public.tutorials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update tutorials"
  ON public.tutorials FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete tutorials"
  ON public.tutorials FOR DELETE
  USING (public.is_admin());

-- 6. RESOURCES POLICIES
CREATE POLICY "Public can view published resources only"
  ON public.resources FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can insert resources"
  ON public.resources FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update resources"
  ON public.resources FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete resources"
  ON public.resources FOR DELETE
  USING (public.is_admin());

-- 7. SITE SETTINGS POLICIES
CREATE POLICY "Site settings readable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. CONTACT SUBMISSIONS POLICIES
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can update or delete contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin());
