"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { MatteInvoicePDF } from "@/components/payment/MatteInvoicePDF";

interface InvoicePreviewProps {
  invoiceData: {
    id: string;
    client_name: string;
    client_email: string;
    project_name: string;
    amount: number;
    currency: string;
    created_at: string;
    notes?: string;
    items?: any[];
    display_id?: number;
  };
  payLink: string;
}

export default function InvoicePreview({ invoiceData, payLink }: InvoicePreviewProps) {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[#040D0C]">
      <PDFViewer style={{ width: "100%", height: "100%", border: "none" }}>
        <MatteInvoicePDF invoice={invoiceData} payLink={payLink} />
      </PDFViewer>
    </div>
  );
}
