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

-- =========================================
-- Legal Policies
-- =========================================
CREATE TABLE policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('terms', 'privacy')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view policies" ON policies
  FOR SELECT USING (true);

CREATE POLICY "Admin full access policies" ON policies
  FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_policies_type ON policies(type);

-- Trigger
CREATE TRIGGER policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Seed Policies
INSERT INTO policies (type, title, content, display_order) VALUES
  ('terms', 'Scope & Deliverables', 'NOÉTIC Studio provides comprehensive creative and technical solutions across Brand Identity, UI/UX, Component Ecosystems, and Strategic Direction. The exact parameters, deliverables, and operational requirements of your initiative will be defined exclusively within your customized Project Specification Document prior to commencement.', 1),
  ('terms', 'Timelines & Execution', 'Project deployment timelines and iterations commence officially on the date the initial deposit clears. We operate on algorithmic efficiency, but timelines remain strictly subject to adjustments based on the cadence of Client feedback, asset provisioning, and predetermined milestone approvals.', 2),
  ('terms', 'Intellectual Property & Licensing', 'Upon settlement of the final invoice, the Client assumes full ownership of all finalized, front-facing branding, visual assets, and agreed deliverables. NOÉTIC Studio retains proprietary rights to our underlying operational frameworks, native code engines, or generative tools used to construct the product, as well as the irrevocable right to showcase the finalized project within our public portfolios.', 3),
  ('terms', 'Deposits & Financials', 'Preliminary project deposits are strictly non-refundable, as they are instantly deployed toward resource allocation, strategic blueprinting, and necessary commercial asset acquisition (typography licenses, environmental setups, etc). The aggregate final balance is contractually due prior to the final handover of source files, brand guidelines, or live production environments.', 4),
  ('terms', 'Revisions & Scope Guardrails', 'To maintain project velocity and structural integrity, we require revision requests to be submitted in organized batches at predetermined milestones. Ad-hoc, unstructured revisions, or retroactive structural deviations outside the agreed Scope of Work are subject to a scope-adjustment consultation and subsequent billing.', 5),
  ('terms', 'Asset Archiving & Transfer', 'Following the final project handover, NOÉTIC Studio is under no inherent obligation to maintain archives of raw source files or preliminary concepts unless explicitly established in an ongoing Management Agreement. Clients are expected to securely archive their finalized deliverables upon receipt.', 6),
  ('terms', 'Absolute Confidentiality', 'All operational workflows, architectural models, and proprietary business data disclosed to NOÉTIC Studio during the discovery and blueprinting sequence remain under strict confidentiality protocols. We act as an extension of your team and will never syndicate or leverage your internal data.', 7),
  
  ('privacy', 'Data Collection & Analytics', 'When you interact with NOÉTIC Studio, we may collect identifiable information such as your organizational details, direct contact vectors, and operational requirements. This data is sequestered exclusively for the purpose of formulating accurate project scopes, returning inquiries, and delivering high-fidelity creative solutions. We deploy minimal, non-invasive analytics strictly to measure our own platform''s structural performance.', 1),
  ('privacy', 'Utilization of Internal Intelligence', 'Any proprietary information, architectural diagrams, or internal business metrics shared during our discovery and blueprinting phases are treated as highly classified. We do not aggregate your data into macroscopic datasets, and we emphatically do not sell, rent, or syndicate client information to third-party data brokers.', 2),
  ('privacy', 'Third-Party Infrastructure', 'Deploying our digital products occasionally necessitates interactions with third-party infrastructure (e.g., Supabase, Vercel, Stripe, or specialized APIs). These sub-processors are bound by stringent independent privacy shields. While we architect these integrations to minimize data leakage, client interactions with secondary infrastructures may fall under their respective terms of processing.', 3),
  ('privacy', 'Asset Storage & Retention', 'Following the successful deployment and final handover of a project, the responsibility of data and asset ownership is transferred to the Client. NOÉTIC Studio may retain encrypted backups of source code engines or generative files for our own internal audits or potential future expansions, unless a strict data-destruction sequence is explicitly requested in writing.', 4),
  ('privacy', 'Telemetry & Cookies', 'Our public-facing interface employs highly restricted telemetry frameworks. We use essential session tokens and strictly necessary functional cookies to preserve interface stability and security. We do not deploy aggressive third-party marketing pixels or cross-site tracking mechanics on our corporate website.', 5),
  ('privacy', 'Your Data Rights', 'Under applicable digital jurisdictions, you retain the absolute right to request an audit of the data NOÉTIC Studio currently holds regarding your organization, prompt the correction of misaligned records, or invoke a right to erasure of your contact vectors from our CRM ecosystems.', 6);
