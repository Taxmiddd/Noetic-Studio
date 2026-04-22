import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_name, client_email, project_name, notes, amount, currency } = body;

    // Basic validation
    if (!client_name || !client_email || !project_name || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to Supabase (initial status: pending)
    const { data: invoice, error: dbError } = await supabase
      .from('invoices')
      .insert({
        client_name,
        client_email,
        project_name,
        notes,
        amount: parseFloat(amount),
        currency,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to create invoice record' }, { status: 500 });
    }

    // 2. Call Lemon Squeezy API
    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!lsApiKey || !storeId || !variantId) {
      // In development/test mode, if LS isn't configured, we just return the local URL
      console.warn('Lemon Squeezy API keys are missing. Skipping checkout URL generation.');
      return NextResponse.json({ 
        success: true, 
        invoice,
        url: `https://pay.noeticstudio.net/${invoice.id}`
      });
    }

    // Convert amount to cents
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Map currency to Lemon Squeezy supported formats if needed, 
    // LS defaults to USD, but setting custom price is in cents (USD cents for the variant).
    // Note: To force display currency, you typically pass it in the URL or the customer selects it. 
    // However, if the variant is in USD, the custom_price must be in USD cents.
    // We'll pass the custom price directly and rely on LS multi-currency to display it.
    
    // Determine locale based on currency (basic mapping)
    const currencyLocaleMap: Record<string, string> = {
      EUR: 'fr',
      GBP: 'en-GB',
      USD: 'en',
      CAD: 'en',
      JPY: 'ja',
      BDT: 'en',
      INR: 'en',
    };
    const locale = currencyLocaleMap[currency] || 'en';

    const lsResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${lsApiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: amountInCents,
            checkout_options: {
              embed: false,
              media: true,
              logo: true,
              desc: true,
              dark: true,
              button_color: '#0D7377',
            },
            checkout_data: {
              email: client_email,
              name: client_name,
              custom: {
                invoice_id: invoice.id,
              },
            },
            product_options: {
              name: `Invoice: ${project_name}`,
              description: notes ? `Notes: ${notes}` : 'NOÉTIC Studio Invoice',
              receipt_button_text: 'Back to NOÉTIC Studio',
              receipt_link_url: 'https://noeticstudio.net',
            }
          },
          relationships: {
            store: { data: { type: 'stores', id: storeId } },
            variant: { data: { type: 'variants', id: variantId } },
          },
        },
      }),
    });

    if (!lsResponse.ok) {
      const lsError = await lsResponse.text();
      console.error('Lemon Squeezy API Error:', lsError);
      return NextResponse.json({ error: 'Failed to create Lemon Squeezy checkout' }, { status: 500 });
    }

    const lsData = await lsResponse.json();
    const checkoutUrl = lsData.data.attributes.url;

    // 3. Update invoice with checkout URL
    await supabase
      .from('invoices')
      .update({ checkout_url: checkoutUrl })
      .eq('id', invoice.id);

    // 4. Return the custom subdomain URL
    return NextResponse.json({ 
      success: true, 
      invoice,
      url: `https://pay.noeticstudio.net/${invoice.id}`
    });

  } catch (error) {
    console.error('Create Invoice Exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
