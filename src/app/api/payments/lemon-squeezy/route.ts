/**
 * POST /api/payments/lemon-squeezy
 * handleLemonSqueezy — Creates a Lemon Squeezy checkout session for an invoice.
 *
 * Body: { invoiceId: string }
 * Returns: { checkoutUrl: string }
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId } = body as { invoiceId: string };

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(invoiceId)) {
      return NextResponse.json({ error: 'Invalid invoice ID format' }, { status: 400 });
    }

    // 1. Fetch the invoice
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (fetchError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice is already paid' }, { status: 409 });
    }

    // 2. If checkout URL already exists and is fresh, return it
    if (invoice.checkout_url) {
      return NextResponse.json({ checkoutUrl: invoice.checkout_url });
    }

    // 3. Create Lemon Squeezy checkout session
    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const lsStoreId = process.env.LEMON_SQUEEZY_STORE_ID;
    const lsVariantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!lsApiKey || !lsStoreId || !lsVariantId) {
      console.error('[Lemon Squeezy] Missing environment variables');
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 503 });
    }

    // Convert amount to cents (Lemon Squeezy uses cents for USD)
    const amountInCents = Math.round(invoice.amount * 100);

    const checkoutPayload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: invoice.client_email,
            name: invoice.client_name,
            custom: {
              invoice_id: invoice.id,
            },
          },
          checkout_options: {
            embed: true,
            media: false,
            logo: true,
          },
          product_options: {
            name: invoice.project_name,
            description: invoice.notes || `Invoice for ${invoice.project_name}`,
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pay.noeticstudio.net'}/pay/${invoice.id}?paid=true`,
          },
          // Override price for this checkout session
          custom_price: amountInCents,
          expires_at: null, // No expiry
        },
        relationships: {
          store: {
            data: { type: 'stores', id: lsStoreId },
          },
          variant: {
            data: { type: 'variants', id: lsVariantId },
          },
        },
      },
    };

    const lsResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${lsApiKey}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!lsResponse.ok) {
      const errBody = await lsResponse.json().catch(() => ({}));
      console.error('[Lemon Squeezy] API error:', lsResponse.status, errBody);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 502 },
      );
    }

    const lsData = await lsResponse.json();
    const checkoutUrl: string = lsData?.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error('[Lemon Squeezy] No checkout URL in response:', lsData);
      return NextResponse.json({ error: 'Invalid response from payment provider' }, { status: 502 });
    }

    // 4. Store the checkout URL on the invoice
    await supabase
      .from('invoices')
      .update({
        checkout_url: checkoutUrl,
        gateway: 'lemon_squeezy',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('[handleLemonSqueezy] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
