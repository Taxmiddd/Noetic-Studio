import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid invoice ID format' }, { status: 400 });
    }

    // Fetch invoice using service role (server-side only)
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[Invoice API] Database error:', error.message);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Return sanitized invoice data (don't expose sensitive fields)
    return NextResponse.json({
      id: invoice.id,
      client_name: invoice.client_name,
      client_email: invoice.client_email,
      project_name: invoice.project_name,
      notes: invoice.notes,
      amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
      gateway: invoice.gateway ?? 'lemon_squeezy',
      checkout_url: invoice.checkout_url,
      receipt_url: invoice.receipt_url,
      paid_at: invoice.paid_at,
      created_at: invoice.created_at,
    });
  } catch (error) {
    console.error('[Invoice API] Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}