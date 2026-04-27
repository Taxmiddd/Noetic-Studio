import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { MatteInvoicePDF } from '@/components/payment/MatteInvoicePDF';

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
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
    }

    // Fetch invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Parse line items from notes JSON if available
    let items;
    let displayId = 1;
    try {
      if (invoice.notes && invoice.notes.startsWith('{')) {
        const parsed = JSON.parse(invoice.notes);
        items = parsed.items;
        displayId = parsed.display_id || 1;
      }
    } catch {
      // notes is plain text, not JSON — that's fine
    }

    const payLink = `https://pay.noeticstudio.net/${invoice.id}`;

    // Generate PDF buffer
    // Cast required: renderToBuffer expects ReactElement<DocumentProps> but
    // createElement returns FunctionComponentElement — safe because MatteInvoicePDF
    // returns a <Document> as its root.
    const pdfBuffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(MatteInvoicePDF, {
        invoice: {
          id: invoice.id,
          client_name: invoice.client_name,
          client_email: invoice.client_email,
          project_name: invoice.project_name,
          amount: invoice.amount,
          currency: invoice.currency,
          created_at: invoice.created_at,
          display_id: displayId,
          items: items,
        },
        payLink,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );

    // Build a friendly filename
    const clientSlug = invoice.client_name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();
    const dateStr = new Date(invoice.created_at).toISOString().split('T')[0];
    const filename = `NOETIC_Invoice_${clientSlug}_${dateStr}.pdf`;

    // Convert Buffer to Uint8Array — required for NextResponse BodyInit compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store',
      },
    });
  } catch (error) {
    console.error('[PDF API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
