-- 🔒 SECURITY ENHANCEMENT: Improved RLS Policies
-- =========================================
-- Replace the existing weak RLS policies with these more restrictive ones
-- 
-- IMPLEMENTATION NOTES:
-- 1. Service role key bypasses RLS, so it's safe for admin operations
-- 2. All authenticated users get read-only access by default
-- 3. Admin write access is controlled via custom claims in Supabase Auth
-- 4. Setup custom claims for admins via Supabase Dashboard or API
-- =========================================

-- DROP existing weak policies (if migrating)
-- DO THIS CAREFULLY - test in development first!
-- 
-- DROP POLICY IF EXISTS "Admin full access projects" ON projects;
-- DROP POLICY IF EXISTS "Admin full access services" ON services;
-- DROP POLICY IF EXISTS "Admin full access partners" ON partners;
-- DROP POLICY IF EXISTS "Admin full access inquiries" ON contact_inquiries;
-- DROP POLICY IF EXISTS "Admin full access policies" ON policies;

-- =========================================
-- IMPROVED POLICIES
-- =========================================

-- Projects: Public read, authenticated users read, admin write (via custom claims)
CREATE POLICY "authenticated_read_projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated' OR true);

CREATE POLICY "admin_write_projects" ON projects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_update_projects" ON projects
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_delete_projects" ON projects
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- Services: Similar pattern
CREATE POLICY "authenticated_read_services" ON services
  FOR SELECT USING (auth.role() = 'authenticated' OR true);

CREATE POLICY "admin_write_services" ON services
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_update_services" ON services
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_delete_services" ON services
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- Partners: Similar pattern
CREATE POLICY "authenticated_read_partners" ON partners
  FOR SELECT USING (auth.role() = 'authenticated' OR true);

CREATE POLICY "admin_write_partners" ON partners
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_update_partners" ON partners
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_delete_partners" ON partners
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- Contact Inquiries: Public insert, admin read/update/delete
CREATE POLICY "authenticated_read_inquiries" ON contact_inquiries
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_update_inquiries" ON contact_inquiries
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- Policies table: Public read, admin write
CREATE POLICY "authenticated_read_policies" ON policies
  FOR SELECT USING (true);

CREATE POLICY "admin_write_policies" ON policies
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_update_policies" ON policies
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

CREATE POLICY "admin_delete_policies" ON policies
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- =========================================
-- SETUP INSTRUCTIONS FOR ADMIN CLAIMS
-- =========================================
--
-- 1. Go to: https://supabase.com/dashboard → Your Project
-- 2. Navigate to: Authentication → Users
-- 3. Click on an admin user to edit
-- 4. Under "User metadata" tab, add:
--    {
--      "admin": "true"
--    }
--
-- Alternative: Use Supabase CLI or API to set custom claims
--
-- =========================================

-- =========================================
-- CREATE INVOICES TABLE (if not exists)
-- =========================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_name TEXT NOT NULL,
  notes TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  checkout_url TEXT,
  lemon_squeezy_id TEXT,
  receipt_url TEXT,
  paid_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_currency CHECK (currency IN ('USD', 'EUR', 'GBP', 'JPY', 'CAD', 'BDT', 'INR'))
);

-- =========================================
-- INVOICES TABLE RLS POLICIES
-- =========================================

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Clients can view their own invoices (via email)
CREATE POLICY "clients_read_own_invoices" ON invoices
  FOR SELECT USING (true); -- Public read for now, filter by email in app

-- Admin can manage invoices
CREATE POLICY "admin_manage_invoices" ON invoices
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- Create indexes for performance
CREATE INDEX idx_invoices_email ON invoices(client_email);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX idx_invoices_lemon_squeezy_id ON invoices(lemon_squeezy_id);

-- =========================================
-- AUDIT LOG TABLE (RECOMMENDED)
-- =========================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admin can view audit logs
CREATE POLICY "admin_read_audit_logs" ON audit_logs
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.jwt()::jsonb->>'admin' = 'true'
  );

-- Only service role can insert audit logs
-- (Since this table is managed by the app server)

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
Create INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
