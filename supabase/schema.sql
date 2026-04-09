-- =========================================
-- NOÉTIC Studio — Supabase Schema
-- =========================================

-- Projects / Portfolio
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  client_name TEXT,
  year INTEGER,
  category TEXT NOT NULL CHECK (category IN ('logo', 'brand', 'web', 'campaign', 'direction', 'uiux')),
  services TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  long_description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Partners / Clients
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Contact Inquiries
CREATE TABLE contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service_interest TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- Row Level Security
-- =========================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can insert inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Admin (authenticated) full access
CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access partners" ON partners
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access inquiries" ON contact_inquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- Indexes
-- =========================================

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(is_featured) WHERE is_featured = true;
CREATE INDEX idx_inquiries_unread ON contact_inquiries(is_read) WHERE is_read = false;

-- =========================================
-- Updated_at trigger
-- =========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =========================================
-- Seed Data (Demo)
-- =========================================

INSERT INTO projects (title, slug, description, long_description, client_name, year, category, services, is_featured, display_order) VALUES
  ('Meridian Financial', 'meridian-financial', 'Complete brand identity for a next-gen fintech platform.', 'A comprehensive brand identity for a next-generation fintech platform transforming personal banking.', 'Meridian Group', 2025, 'brand', ARRAY['Brand Strategy', 'Visual Identity', 'Brand Guidelines'], true, 1),
  ('Apex Athletics', 'apex-athletics', 'Dynamic logo system for a premium fitness brand.', 'A dynamic logo system for a premium fitness brand that embodies peak performance.', 'Apex Athletics Inc.', 2025, 'logo', ARRAY['Logo Design', 'Icon System', 'Brand Guidelines'], true, 2),
  ('Prism Gallery', 'prism-gallery', 'Immersive web platform for contemporary art curation.', 'An immersive web platform for contemporary art curation and gallery management.', 'Prism Contemporary', 2024, 'web', ARRAY['UI/UX Design', 'Full-stack Development', 'CMS Integration'], true, 3),
  ('Volta Festival', 'volta-festival', 'Multi-channel event campaign for an electronic music festival.', 'A multi-channel campaign for an electronic music festival that reached 2M+ impressions.', 'Volta Events Ltd.', 2024, 'campaign', ARRAY['Creative Direction', 'Campaign Design', 'Digital Strategy'], true, 4),
  ('Zenith Labs', 'zenith-labs', 'Enterprise SaaS dashboard redesign with data-rich interfaces.', 'Complete UX overhaul for a rapidly growing SaaS platform.', 'Zenith Labs', 2024, 'uiux', ARRAY['UX Research', 'UI Design', 'Design System'], false, 5),
  ('Aether Wellness', 'aether-wellness', 'Holistic brand system for a luxury wellness retreat.', 'A serene brand system for a luxury wellness retreat and spa.', 'Aether Group', 2024, 'brand', ARRAY['Brand Strategy', 'Visual Identity', 'Packaging'], false, 6);

INSERT INTO services (title, slug, short_description, icon_name, display_order) VALUES
  ('Logo Design', 'logo-design', 'Distilled brand marks that command recognition and resonate across every medium.', 'Palette', 1),
  ('Brand Identity', 'brand-identity', 'Complete identity systems — from visual language to tone — that position you at the frontier.', 'Fingerprint', 2),
  ('Event Campaigns', 'event-campaigns', 'Campaign architectures that synthesize narrative, design, and strategy into cultural impact.', 'Megaphone', 3),
  ('Creative Direction', 'creative-direction', 'Strategic vision that unifies creative output and ensures every touchpoint speaks with authority.', 'Compass', 4),
  ('UI/UX Design', 'ui-ux-design', 'Interfaces designed with intent — where clarity meets engagement and friction disappears.', 'Layout', 5),
  ('Web Development', 'web-development', 'Full-stack engineering with modern frameworks, delivering performant, scalable digital products.', 'Code2', 6);

INSERT INTO partners (name, display_order) VALUES
  ('MERIDIAN', 1),
  ('APEX', 2),
  ('PRISM', 3),
  ('VOLTA', 4),
  ('HELIOS', 5),
  ('AETHER', 6),
  ('LUMINAR', 7),
  ('ZENITH', 8);
