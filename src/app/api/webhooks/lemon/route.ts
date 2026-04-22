import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    // Verify signature using Web Crypto API (Edge-compatible)
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const mac = await crypto.subtle.sign(
      'HMAC',
      secretKey,
      encoder.encode(rawBody)
    );

    // Convert ArrayBuffer to Hex String
    const digestHex = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Secure string comparison to prevent timing attacks
    let isMatch = true;
    if (digestHex.length !== signature.length) {
      isMatch = false;
    }
    for (let i = 0; i < Math.max(digestHex.length, signature.length); i++) {
      if (digestHex[i] !== signature[i]) {
        isMatch = false;
      }
    }

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;

    if (eventName === 'order_created') {
      const customData = payload.meta.custom_data;
      const orderId = payload.data.id;
      const attributes = payload.data.attributes;
      const receiptUrl = attributes?.urls?.receipt || null;
      const paidAt = attributes?.created_at || new Date().toISOString();
      
      if (!customData || !customData.invoice_id) {
        console.error('Missing invoice_id in custom_data');
        return NextResponse.json({ error: 'Missing custom data' }, { status: 400 });
      }

      const invoiceId = customData.invoice_id;

      // 1. Update Supabase
      const { data: invoice, error: dbError } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          lemon_squeezy_id: orderId,
          receipt_url: receiptUrl,
          paid_at: paidAt
        })
        .eq('id', invoiceId)
        .select()
        .single();

      if (dbError || !invoice) {
        console.error('Failed to update invoice:', dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Acknowledge other events without processing
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
