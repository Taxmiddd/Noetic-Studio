import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up invoices table...');

  // Since we cannot run raw SQL easily via the JS client without a custom RPC function,
  // we will print the SQL for the user to run in the Supabase SQL Editor.
  
  const sql = `
-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    project_name TEXT NOT NULL,
    notes TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    checkout_url TEXT,
    lemon_squeezy_id TEXT,
    payment_method TEXT,
    receipt_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    invoice_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to invoices (so clients can view their invoice)
CREATE POLICY "Allow public read access to invoices" ON public.invoices
    FOR SELECT USING (true);

-- Allow service role full access (we manage writes via server API using service role)
-- Service role bypasses RLS automatically, but we can explicitly allow if needed.
  `;

  console.log('\n--- PLEASE RUN THE FOLLOWING SQL IN YOUR SUPABASE DASHBOARD (SQL EDITOR) ---\n');
  console.log(sql);
  console.log('--------------------------------------------------------------------------------\n');
  console.log('This is required because raw SQL execution is restricted via the JS client for security.');
}

setupDatabase().catch(console.error);
