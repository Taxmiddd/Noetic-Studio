import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    // 🔒 Verify webhook secret is configured
    if (!secret) {
      console.error('[Webhook] Secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // 🔒 Verify signature using Web Crypto API (Edge-compatible)
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

    // 🔒 Secure constant-time comparison to prevent timing attacks
    if (!constantTimeCompare(digestHex, signature)) {
      console.warn('[Webhook] Invalid signature received');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse payload
    let payload: Record<string, any>;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error('[Webhook] Invalid JSON payload');
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const eventName = payload?.meta?.event_name;

    console.log(`[Webhook] Processing event: ${eventName}`);

    // Handle order_created event
    if (eventName === 'order_created') {
      const customData = payload.meta?.custom_data;
      const orderId = payload.data?.id;
      const attributes = payload.data?.attributes;
      const receiptUrl = attributes?.urls?.receipt || null;
      const paidAt = attributes?.created_at || new Date().toISOString();

      // 🔒 Validate required data
      if (!customData || !customData.invoice_id) {
        console.error('[Webhook] Missing invoice_id in custom_data');
        return NextResponse.json(
          { error: 'Missing custom data' },
          { status: 400 }
        );
      }

      if (!orderId) {
        console.error('[Webhook] Missing order ID');
        return NextResponse.json(
          { error: 'Missing order ID' },
          { status: 400 }
        );
      }

      const invoiceId = customData.invoice_id;

      console.log(`[Webhook] Updating invoice ${invoiceId} with order ${orderId}`);

      // 1. Update Supabase
      const { data: invoice, error: dbError } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          lemon_squeezy_id: orderId,
          receipt_url: receiptUrl,
          paid_at: paidAt,
        })
        .eq('id', invoiceId)
        .select()
        .single();

      if (dbError) {
        console.error('[Webhook DB Error] Failed to update invoice:', dbError.message);
        // Return 200 to acknowledge receipt (don't retry)
        return NextResponse.json({ received: true, error: 'DB error' });
      }

      if (!invoice) {
        console.warn(`[Webhook] Invoice ${invoiceId} not found`);
        // Return 200 to acknowledge receipt (don't retry)
        return NextResponse.json({ received: true, warning: 'Invoice not found' });
      }

      console.log(`[Webhook] Successfully updated invoice ${invoiceId}`);
      return NextResponse.json({ success: true, invoiceId });
    }

    // Log unhandled events
    console.log(`[Webhook] Unhandled event: ${eventName}`);

    // Acknowledge other events without processing
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook Error]:', error instanceof Error ? error.message : 'Unknown error');
    // Return 500 to indicate failure (Lemon Squeezy will retry)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
