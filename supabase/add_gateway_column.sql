-- =========================================
-- NOÉTIC Studio — Add gateway column to invoices
-- Run this in the Supabase SQL editor
-- =========================================

-- 1. Add the gateway column with a safe default
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS gateway TEXT NOT NULL DEFAULT 'lemon_squeezy'
  CHECK (gateway IN ('lemon_squeezy', 'payoneer'));

-- 2. Index for filtering by gateway in admin dashboard
CREATE INDEX IF NOT EXISTS idx_invoices_gateway ON invoices(gateway);

-- 3. (Optional) Verify the column was added
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'invoices' AND column_name = 'gateway';
