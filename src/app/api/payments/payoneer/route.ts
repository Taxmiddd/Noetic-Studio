/**
 * POST /api/payments/payoneer
 * handlePayoneer — Generates a Payoneer LIST (Long ID Secure Token) for embedded checkout.
 *
 * Body: { invoiceId: string }
 * Returns: { longId: string, programId: string }
 *
 * The longId is a short-lived session token that the Payoneer Web SDK uses
 * to mount its embedded credit card fields into your DOM — no redirects.
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

    // 2. Validate Payoneer credentials
    const apiUser = process.env.PAYONEER_API_USER;
    const apiPassword = process.env.PAYONEER_API_PASSWORD;
    const programId = process.env.PAYONEER_PROGRAM_ID;

    if (!apiUser || !apiPassword || !programId) {
      console.error('[Payoneer] Missing environment variables');
      return NextResponse.json({ error: 'Payoneer not configured' }, { status: 503 });
    }

    // 3. Call Payoneer LIST API to generate a longId (session token)
    // Payoneer uses Basic Auth for their REST API
    const basicAuth = Buffer.from(`${apiUser}:${apiPassword}`).toString('base64');

    // Amount must be in major currency units (e.g., 150.00 for USD)
    const amount = Number(invoice.amount).toFixed(2);
    const currency = invoice.currency || 'USD';

    // Payoneer GWMerchantService: Generate a Long ID (Secure Checkout Token)
    // Documentation: https://payoneer.com/integration/checkout/embedded
    const payoneerPayload = {
      requestHeader: {
        version: '4.0',
        commandName: 'GetExtendedPaymentPageParameters',
        userName: apiUser,
        password: apiPassword,
      },
      requestBody: {
        clientReferenceId: invoiceId,
        description: `${invoice.project_name} — NOÉTIC Studio`,
        amount,
        currency,
        productList: [
          {
            productName: invoice.project_name,
            description: invoice.notes || `Invoice for ${invoice.project_name}`,
            productCode: invoiceId,
            quantity: 1,
            unitPrice: amount,
            totalPrice: amount,
          },
        ],
        cssUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pay.noeticstudio.net'}/payoneer-matte.css`,
        language: 'en',
        customerDetails: {
          customerEmail: invoice.client_email,
          customerName: invoice.client_name,
        },
      },
    };

    const payoneerEndpoint = `https://api.payoneer.com/v2/programs/${programId}/orders`;

    const payoneerResponse = await fetch(payoneerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(payoneerPayload),
    });

    if (!payoneerResponse.ok) {
      const errBody = await payoneerResponse.text().catch(() => '');
      console.error('[Payoneer] API error:', payoneerResponse.status, errBody);
      return NextResponse.json(
        { error: 'Failed to create Payoneer session' },
        { status: 502 },
      );
    }

    const payoneerData = await payoneerResponse.json();

    // The longId is the session token for the embedded SDK
    // Exact field name may vary depending on Payoneer API version and program type
    const longId: string =
      payoneerData?.longId ||
      payoneerData?.data?.longId ||
      payoneerData?.paymentId ||
      payoneerData?.orderId;

    if (!longId) {
      console.error('[Payoneer] No longId in response:', JSON.stringify(payoneerData));
      return NextResponse.json(
        { error: 'Invalid response from Payoneer', details: payoneerData },
        { status: 502 },
      );
    }

    // 4. Update the invoice to mark gateway as payoneer
    await supabase
      .from('invoices')
      .update({
        gateway: 'payoneer',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    return NextResponse.json({ longId, programId });
  } catch (error) {
    console.error('[handlePayoneer] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
