export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  client_name: string;
  year: number;
  category: ProjectCategory;
  services: string[];
  thumbnail_url: string;
  images: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectCategory = 'logo' | 'brand' | 'web' | 'campaign' | 'direction' | 'uiux';

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  display_order: number;
  is_active: boolean;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service_interest: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NavLink {
  label: string;
  href: string;
}
