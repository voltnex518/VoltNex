import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Project, Category, Tutorial, Resource, SiteSettings, ContactSubmission } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_TUTORIALS,
  INITIAL_RESOURCES,
  INITIAL_SITE_SETTINGS,
  INITIAL_MESSAGES,
} from '../data/mockData';

interface DataContextType {
  projects: Project[];
  categories: Category[];
  tutorials: Tutorial[];
  resources: Resource[];
  settings: SiteSettings;
  messages: ContactSubmission[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

  // Project CRUD
  getProjectBySlug: (slug: string) => Project | undefined;
  saveProject: (project: Partial<Project>) => Promise<{ success: boolean; data?: Project; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleProjectPublish: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Category CRUD
  saveCategory: (category: Partial<Category>) => Promise<{ success: boolean; data?: Category; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Tutorial CRUD
  getTutorialBySlug: (slug: string) => Tutorial | undefined;
  saveTutorial: (tutorial: Partial<Tutorial>) => Promise<{ success: boolean; data?: Tutorial; error?: string }>;
  deleteTutorial: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleTutorialPublish: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Resource CRUD
  saveResource: (resource: Partial<Resource>) => Promise<{ success: boolean; data?: Resource; error?: string }>;
  deleteResource: (id: string) => Promise<{ success: boolean; error?: string }>;
  recordDownload: (id: string) => void;

  // Settings & Contact Form
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
  submitContactForm: (submission: Omit<ContactSubmission, 'id' | 'status' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Local storage cache keys for persistent state when testing offline or demo
const STORAGE_KEYS = {
  PROJECTS: 'voltnex_db_projects',
  CATEGORIES: 'voltnex_db_categories',
  TUTORIALS: 'voltnex_db_tutorials',
  RESOURCES: 'voltnex_db_resources',
  SETTINGS: 'voltnex_db_settings',
  MESSAGES: 'voltnex_db_messages',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data from Supabase or localStorage / Seed
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured() && supabase) {
      try {
        // Live Supabase query
        const [
          projectsRes,
          categoriesRes,
          tutorialsRes,
          resourcesRes,
          settingsRes,
          messagesRes,
        ] = await Promise.allSettled([
          supabase
            .from('projects')
            .select(`
              *,
              categories:project_categories(category:categories(*)),
              components:project_components(*),
              steps:project_steps(*),
              code_snippets:project_code_snippets(*),
              files:project_files(*)
            `)
            .order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('display_order', { ascending: true }),
          supabase.from('tutorials').select('*').order('created_at', { ascending: false }),
          supabase.from('resources').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 'global').maybeSingle(),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        ]);

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data) {
          setCategories(categoriesRes.value.data);
        }
        if (projectsRes.status === 'fulfilled' && projectsRes.value.data) {
          // Flatten nested categories from junction table
          const formatted = (projectsRes.value.data as any[]).map((p) => ({
            ...p,
            categories: p.categories?.map((c: any) => c.category).filter(Boolean) || [],
          }));
          setProjects(formatted);
        }
        if (tutorialsRes.status === 'fulfilled' && tutorialsRes.value.data) {
          setTutorials(tutorialsRes.value.data);
        }
        if (resourcesRes.status === 'fulfilled' && resourcesRes.value.data) {
          setResources(resourcesRes.value.data);
        }
        if (settingsRes.status === 'fulfilled' && settingsRes.value.data) {
          setSettings(settingsRes.value.data);
        }
        if (messagesRes.status === 'fulfilled' && messagesRes.value.data) {
          setMessages(messagesRes.value.data);
        }

        setIsLoading(false);
        return;
      } catch (err: unknown) {
        console.warn('Supabase fetch failed, falling back to local dataset:', err);
      }
    }

    // Local / Offline demo store fallback
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const storedTutorials = localStorage.getItem(STORAGE_KEYS.TUTORIALS);
      const storedResources = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);

      setCategories(storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES);
      setProjects(storedProjects ? JSON.parse(storedProjects) : INITIAL_PROJECTS);
      setTutorials(storedTutorials ? JSON.parse(storedTutorials) : INITIAL_TUTORIALS);
      setResources(storedResources ? JSON.parse(storedResources) : INITIAL_RESOURCES);
      setSettings(storedSettings ? JSON.parse(storedSettings) : INITIAL_SITE_SETTINGS);
      setMessages(storedMessages ? JSON.parse(storedMessages) : INITIAL_MESSAGES);
    } catch {
      setCategories(INITIAL_CATEGORIES);
      setProjects(INITIAL_PROJECTS);
      setTutorials(INITIAL_TUTORIALS);
      setResources(INITIAL_RESOURCES);
      setSettings(INITIAL_SITE_SETTINGS);
      setMessages(INITIAL_MESSAGES);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persist helper for local mode
  const syncLocal = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // --- PROJECTS ---
  const getProjectBySlug = useCallback(
    (slug: string) => {
      return projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    },
    [projects]
  );

  const saveProject = async (projectData: Partial<Project>): Promise<{ success: boolean; data?: Project; error?: string }> => {
    const isNew = !projectData.id;
    const now = new Date().toISOString();
    const id = projectData.id || `p_${Date.now()}`;
    const slug = (projectData.slug || projectData.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const fullProject: Project = {
      id,
      title: projectData.title || 'Untitled Project',
      slug,
      summary: projectData.summary || '',
      description: projectData.description || '',
      cover_image: projectData.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      difficulty: projectData.difficulty || 'Beginner',
      estimated_time: projectData.estimated_time || '2-3 Hours',
      status: projectData.status || 'draft',
      featured: projectData.featured ?? false,
      circuit_diagram_url: projectData.circuit_diagram_url || '',
      wiring_notes: projectData.wiring_notes || '',
      troubleshooting_notes: projectData.troubleshooting_notes || '',
      safety_notes: projectData.safety_notes || '',
      seo_title: projectData.seo_title || `${projectData.title} | VoltNex Labs`,
      seo_description: projectData.seo_description || projectData.summary || '',
      categories: projectData.categories || [],
      tags: projectData.tags || [],
      components: projectData.components || [],
      steps: projectData.steps || [],
      code_snippets: projectData.code_snippets || [],
      files: projectData.files || [],
      created_at: projectData.created_at || now,
      updated_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: upsertErr } = await supabase.from('projects').upsert({
          id: isNew ? undefined : fullProject.id,
          title: fullProject.title,
          slug: fullProject.slug,
          summary: fullProject.summary,
          description: fullProject.description,
          cover_image: fullProject.cover_image,
          difficulty: fullProject.difficulty,
          estimated_time: fullProject.estimated_time,
          status: fullProject.status,
          featured: fullProject.featured,
          circuit_diagram_url: fullProject.circuit_diagram_url,
          wiring_notes: fullProject.wiring_notes,
          troubleshooting_notes: fullProject.troubleshooting_notes,
          safety_notes: fullProject.safety_notes,
          seo_title: fullProject.seo_title,
          seo_description: fullProject.seo_description,
          updated_at: now,
        });

        if (upsertErr) return { success: false, error: upsertErr.message };

        // Save components, steps, snippets
        if (fullProject.components && fullProject.components.length > 0) {
          await supabase.from('project_components').delete().eq('project_id', fullProject.id);
          await supabase.from('project_components').insert(
            fullProject.components.map((c, idx) => ({
              project_id: fullProject.id,
              name: c.name,
              quantity: c.quantity,
              notes: c.notes,
              display_order: idx + 1,
            }))
          );
        }

        if (fullProject.steps && fullProject.steps.length > 0) {
          await supabase.from('project_steps').delete().eq('project_id', fullProject.id);
          await supabase.from('project_steps').insert(
            fullProject.steps.map((s, idx) => ({
              project_id: fullProject.id,
              step_number: idx + 1,
              title: s.title,
              content: s.content,
              image_url: s.image_url,
            }))
          );
        }

        if (fullProject.code_snippets && fullProject.code_snippets.length > 0) {
          await supabase.from('project_code_snippets').delete().eq('project_id', fullProject.id);
          await supabase.from('project_code_snippets').insert(
            fullProject.code_snippets.map((cs, idx) => ({
              project_id: fullProject.id,
              title: cs.title,
              filename: cs.filename,
              language: cs.language,
              code: cs.code,
              display_order: idx + 1,
            }))
          );
        }

        await loadData();
        return { success: true, data: fullProject };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save project to Supabase';
        return { success: false, error: msg };
      }
    }

    // Local state fallback
    const updated = isNew
      ? [fullProject, ...projects]
      : projects.map((p) => (p.id === fullProject.id ? fullProject : p));

    setProjects(updated);
    syncLocal(STORAGE_KEYS.PROJECTS, updated);
    return { success: true, data: fullProject };
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: delErr } = await supabase.from('projects').delete().eq('id', id);
        if (delErr) return { success: false, error: delErr.message };
        await loadData();
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete project';
        return { success: false, error: msg };
      }
    }

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    syncLocal(STORAGE_KEYS.PROJECTS, updated);
    return { success: true };
  };

  const toggleProjectPublish = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return { success: false, error: 'Project not found' };
    const newStatus = proj.status === 'published' ? 'draft' : 'published';
    return saveProject({ ...proj, status: newStatus });
  };

  // --- CATEGORIES ---
  const saveCategory = async (catData: Partial<Category>): Promise<{ success: boolean; data?: Category; error?: string }> => {
    const isNew = !catData.id;
    const id = catData.id || `c_${Date.now()}`;
    const slug = (catData.slug || catData.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const fullCat: Category = {
      id,
      name: catData.name || 'New Category',
      slug,
      description: catData.description || '',
      icon: catData.icon || 'Cpu',
      display_order: catData.display_order ?? categories.length + 1,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: upsertErr } = await supabase.from('categories').upsert(fullCat);
        if (upsertErr) return { success: false, error: upsertErr.message };
        await loadData();
        return { success: true, data: fullCat };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save category';
        return { success: false, error: msg };
      }
    }

    const updated = isNew
      ? [...categories, fullCat]
      : categories.map((c) => (c.id === fullCat.id ? fullCat : c));

    setCategories(updated);
    syncLocal(STORAGE_KEYS.CATEGORIES, updated);
    return { success: true, data: fullCat };
  };

  const deleteCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    // Reference safety check: Check if projects use this category
    const isUsed = projects.some((p) => p.categories?.some((c) => c.id === id));
    if (isUsed) {
      return {
        success: false,
        error: 'Cannot delete category: It is currently assigned to existing projects. Reassign them first.',
      };
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: delErr } = await supabase.from('categories').delete().eq('id', id);
        if (delErr) return { success: false, error: delErr.message };
        await loadData();
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete category';
        return { success: false, error: msg };
      }
    }

    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    syncLocal(STORAGE_KEYS.CATEGORIES, updated);
    return { success: true };
  };

  // --- TUTORIALS ---
  const getTutorialBySlug = useCallback(
    (slug: string) => {
      return tutorials.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
    },
    [tutorials]
  );

  const saveTutorial = async (tutorialData: Partial<Tutorial>): Promise<{ success: boolean; data?: Tutorial; error?: string }> => {
    const isNew = !tutorialData.id;
    const now = new Date().toISOString();
    const id = tutorialData.id || `t_${Date.now()}`;
    const slug = (tutorialData.slug || tutorialData.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const fullTutorial: Tutorial = {
      id,
      title: tutorialData.title || 'Untitled Tutorial',
      slug,
      summary: tutorialData.summary || '',
      content: tutorialData.content || '',
      cover_image: tutorialData.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      difficulty: tutorialData.difficulty || 'Intermediate',
      read_time: tutorialData.read_time || '10 min read',
      status: tutorialData.status || 'draft',
      featured: tutorialData.featured ?? false,
      tags: tutorialData.tags || [],
      category_id: tutorialData.category_id,
      seo_title: tutorialData.seo_title || `${tutorialData.title} | VoltNex Labs`,
      seo_description: tutorialData.seo_description || tutorialData.summary || '',
      created_at: tutorialData.created_at || now,
      updated_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: upsertErr } = await supabase.from('tutorials').upsert({
          id: isNew ? undefined : fullTutorial.id,
          title: fullTutorial.title,
          slug: fullTutorial.slug,
          summary: fullTutorial.summary,
          content: fullTutorial.content,
          cover_image: fullTutorial.cover_image,
          difficulty: fullTutorial.difficulty,
          read_time: fullTutorial.read_time,
          status: fullTutorial.status,
          featured: fullTutorial.featured,
          tags: fullTutorial.tags,
          category_id: fullTutorial.category_id,
          seo_title: fullTutorial.seo_title,
          seo_description: fullTutorial.seo_description,
          updated_at: now,
        });

        if (upsertErr) return { success: false, error: upsertErr.message };
        await loadData();
        return { success: true, data: fullTutorial };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save tutorial';
        return { success: false, error: msg };
      }
    }

    const updated = isNew
      ? [fullTutorial, ...tutorials]
      : tutorials.map((t) => (t.id === fullTutorial.id ? fullTutorial : t));

    setTutorials(updated);
    syncLocal(STORAGE_KEYS.TUTORIALS, updated);
    return { success: true, data: fullTutorial };
  };

  const deleteTutorial = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: delErr } = await supabase.from('tutorials').delete().eq('id', id);
        if (delErr) return { success: false, error: delErr.message };
        await loadData();
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete tutorial';
        return { success: false, error: msg };
      }
    }

    const updated = tutorials.filter((t) => t.id !== id);
    setTutorials(updated);
    syncLocal(STORAGE_KEYS.TUTORIALS, updated);
    return { success: true };
  };

  const toggleTutorialPublish = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const tut = tutorials.find((t) => t.id === id);
    if (!tut) return { success: false, error: 'Tutorial not found' };
    const newStatus = tut.status === 'published' ? 'draft' : 'published';
    return saveTutorial({ ...tut, status: newStatus });
  };

  // --- RESOURCES ---
  const saveResource = async (resData: Partial<Resource>): Promise<{ success: boolean; data?: Resource; error?: string }> => {
    const isNew = !resData.id;
    const now = new Date().toISOString();
    const id = resData.id || `r_${Date.now()}`;
    const slug = (resData.slug || resData.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const fullResource: Resource = {
      id,
      title: resData.title || 'Untitled Resource',
      slug,
      description: resData.description || '',
      file_url: resData.file_url || '',
      file_name: resData.file_name || 'download.zip',
      file_type: resData.file_type || 'zip',
      file_size_bytes: resData.file_size_bytes || 0,
      technology: resData.technology || 'General',
      status: resData.status || 'published',
      download_count: resData.download_count ?? 0,
      created_at: resData.created_at || now,
      updated_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: upsertErr } = await supabase.from('resources').upsert(fullResource);
        if (upsertErr) return { success: false, error: upsertErr.message };
        await loadData();
        return { success: true, data: fullResource };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save resource';
        return { success: false, error: msg };
      }
    }

    const updated = isNew
      ? [fullResource, ...resources]
      : resources.map((r) => (r.id === fullResource.id ? fullResource : r));

    setResources(updated);
    syncLocal(STORAGE_KEYS.RESOURCES, updated);
    return { success: true, data: fullResource };
  };

  const deleteResource = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: delErr } = await supabase.from('resources').delete().eq('id', id);
        if (delErr) return { success: false, error: delErr.message };
        await loadData();
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete resource';
        return { success: false, error: msg };
      }
    }

    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    syncLocal(STORAGE_KEYS.RESOURCES, updated);
    return { success: true };
  };

  const recordDownload = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, download_count: r.download_count + 1 } : r))
    );
    if (isSupabaseConfigured() && supabase) {
      supabase.rpc('increment_resource_download', { resource_id: id }).then();
    }
  };

  // --- SETTINGS ---
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    const updated: SiteSettings = {
      ...settings,
      ...newSettings,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: upsertErr } = await supabase
          .from('site_settings')
          .upsert(updated);
        if (upsertErr) return { success: false, error: upsertErr.message };
        setSettings(updated);
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update settings';
        return { success: false, error: msg };
      }
    }

    setSettings(updated);
    syncLocal(STORAGE_KEYS.SETTINGS, updated);
    return { success: true };
  };

  // --- CONTACT FORM ---
  const submitContactForm = async (
    submission: Omit<ContactSubmission, 'id' | 'status' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newMsg: ContactSubmission = {
      id: `msg_${Date.now()}`,
      ...submission,
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: insErr } = await supabase.from('contact_submissions').insert(newMsg);
        if (insErr) return { success: false, error: insErr.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send message';
        return { success: false, error: msg };
      }
    }

    const updated = [newMsg, ...messages];
    setMessages(updated);
    syncLocal(STORAGE_KEYS.MESSAGES, updated);
    return { success: true };
  };

  const markMessageRead = async (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status: 'read' as const } : m));
    setMessages(updated);
    syncLocal(STORAGE_KEYS.MESSAGES, updated);
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('contact_submissions').update({ status: 'read' }).eq('id', id);
    }
  };

  const deleteMessage = async (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    syncLocal(STORAGE_KEYS.MESSAGES, updated);
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('contact_submissions').delete().eq('id', id);
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        categories,
        tutorials,
        resources,
        settings,
        messages,
        isLoading,
        error,
        refreshData: loadData,
        getProjectBySlug,
        saveProject,
        deleteProject,
        toggleProjectPublish,
        saveCategory,
        deleteCategory,
        getTutorialBySlug,
        saveTutorial,
        deleteTutorial,
        toggleTutorialPublish,
        saveResource,
        deleteResource,
        recordDownload,
        updateSettings,
        submitContactForm,
        markMessageRead,
        deleteMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
