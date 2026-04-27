import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { renderToBuffer } from '@react-pdf/renderer';
import { MatteInvoicePDF } from '@/components/payment/MatteInvoicePDF';
import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Explicitly set the runtime to nodejs to allow stream module for react-pdf and nodemailer
export const runtime = 'nodejs';

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { invoiceId, subject, body } = await request.json();

    if (!invoiceId || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch invoice from Supabase
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (fetchError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // 2. Generate PDF Buffer
    const payLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pay.noeticstudio.net'}/${invoice.id}`;
    
    // We call MatteInvoicePDF directly so it returns the <Document> element
    const pdfBuffer = await renderToBuffer(
      MatteInvoicePDF({ invoice, payLink })
    );

    // 3. Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Send Email
    const info = await transporter.sendMail({
      from: `"NOÉTIC Studio" <${process.env.SMTP_USER}>`,
      to: invoice.client_email,
      subject: subject,
      html: body, // body is rich text HTML from the frontend quill editor
      attachments: [
        {
          filename: `Invoice_${invoice.id.split('-')[0].toUpperCase()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('[Email Sending Error]:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Check SMTP credentials.' },
      { status: 500 }
    );
  }
}
