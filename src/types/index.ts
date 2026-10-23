export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  display_order: number;
  created_at?: string;
}

export interface ProjectComponent {
  id?: string;
  name: string;
  quantity: string;
  notes?: string;
  display_order?: number;
}

export interface ProjectStep {
  id?: string;
  step_number: number;
  title: string;
  content: string;
  image_url?: string;
}

export interface ProjectCodeSnippet {
  id?: string;
  title: string;
  filename: string;
  language: string;
  code: string;
  display_order?: number;
}

export interface ProjectFile {
  id?: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size_bytes?: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image: string;
  difficulty: DifficultyLevel;
  estimated_time: string;
  status: ContentStatus;
  featured: boolean;
  circuit_diagram_url?: string;
  wiring_notes?: string;
  troubleshooting_notes?: string;
  safety_notes?: string;
  seo_title?: string;
  seo_description?: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  tags?: string[];
  components?: ProjectComponent[];
  steps?: ProjectStep[];
  code_snippets?: ProjectCodeSnippet[];
  files?: ProjectFile[];
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  difficulty: DifficultyLevel;
  read_time: string;
  category_id?: string;
  category?: Category;
  status: ContentStatus;
  featured: boolean;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size_bytes?: number;
  technology: string;
  category_id?: string;
  category?: Category;
  status: ContentStatus;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  description: string;
  creator_name: string;
  creator_instagram: string;
  contact_email: string;
  announcement_banner?: string;
  featured_project_ids?: string[];
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

export interface ProjectFilterState {
  search: string;
  category: string;
  difficulty: string;
  technology: string;
  sortBy: 'newest' | 'oldest' | 'title' | 'time';
}

export * from './circuit';

