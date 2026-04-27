import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Circle, Path, Line, Image } from '@react-pdf/renderer';

// Exact Colors from the Reference Image
const COLORS = {
  navy: '#0B0E1E',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#666666',
  border: '#E0E0E0',
  accent: '#B8860B', // Gold-ish for signature line
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    color: COLORS.text,
    padding: 0, // We'll use internal padding
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: COLORS.navy,
    color: COLORS.white,
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 180,
  },
  logoSection: {
    flexDirection: 'column',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 10,
  },
  agencyType: {
    fontSize: 9,
    color: '#A0AEC0',
    marginLeft: 10,
    marginTop: -2,
  },
  addressInfo: {
    marginTop: 20,
    fontSize: 9,
    lineHeight: 1.5,
    color: '#CBD5E0',
  },
  invoiceTitleSection: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 40,
    fontFamily: 'Times-Roman', // Using built-in serif
    letterSpacing: 2,
    marginBottom: 10,
  },
  invoiceMeta: {
    fontSize: 9,
    textAlign: 'right',
    color: '#CBD5E0',
    lineHeight: 1.6,
  },
  content: {
    padding: 40,
  },
  billedToSection: {
    marginBottom: 40,
  },
  billedToLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  billedToInfo: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text,
    borderTopWidth: 1,
    borderTopColor: COLORS.text,
    paddingVertical: 8,
    marginBottom: 10,
  },
  tableHeaderLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  tableCell: {
    fontSize: 10,
  },
  itemDescription: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemSub: {
    fontSize: 7,
    color: COLORS.textMuted,
    marginTop: 3,
    fontStyle: 'italic',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    width: '40%',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 20,
    width: '50%',
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 10,
    width: '50%',
    textAlign: 'right',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 20,
    width: '50%',
    textAlign: 'right',
    paddingTop: 10,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'right',
    paddingTop: 10,
  },
  footer: {
    marginTop: 60,
    paddingHorizontal: 40,
  },
  signatureSection: {
    width: 150,
    alignItems: 'center',
  },
  signatureName: {
    fontSize: 18,
    fontFamily: 'Times-Italic', // Script-like fallback
    marginBottom: 2,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.accent,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  thankYou: {
    marginTop: 40,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

interface InvoiceItem {
  description: string;
  subDescription?: string;
  quantity: number;
  unitPrice: number;
}

interface MatteInvoicePDFProps {
  invoice: {
    id: string;
    client_name: string;
    client_email: string;
    client_address?: string;
    client_phone?: string;
    project_name: string;
    amount: number;
    currency: string;
    created_at: string;
    display_id?: number;
    items?: InvoiceItem[];
  };
  payLink: string;
}

export function MatteInvoicePDF({ invoice, payLink }: MatteInvoicePDFProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoice.currency,
  });

  const displayDate = new Date(invoice.created_at).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const generateInvoiceNo = () => {
    // If invoice ID is just "DRAFT-ID", generate a preview one
    if (invoice.id === "DRAFT-ID") {
      return `. #NS-${new Date().getFullYear()}-XXX-00001`;
    }
    // Otherwise, use a stable hash/random for the 3 alphabets and the count
    // Note: In a real production system, this should be stored in the DB
    const year = new Date(invoice.created_at).getFullYear();
    const randomAlpha = invoice.id.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X').padEnd(3, 'A');
    const displayNum = (invoice.display_id || 1).toString().padStart(5, '0');
    return `. #NS-${year}-${randomAlpha}-${displayNum}`;
  };

  const invoiceNo = generateInvoiceNo();

  // Fallback to single item if no item list provided
  const items = invoice.items || [
    {
      description: invoice.project_name,
      subDescription: "(100% Upon Completion)",
      quantity: 1,
      unitPrice: invoice.amount,
    }
  ];

  return (
    <Document title={`Invoice-${invoice.id}`}>
      <Page size="A4" style={styles.page}>
        {/* Header Block */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logoRow}>
              {/* Use official logo7.svg from public folder */}
              <Image src="/logo7.svg" style={{ width: 40, height: 40 }} />
              <View>
                <Text style={styles.logoText}>NOÉTIC Studio</Text>
                <Text style={styles.agencyType}>Digital Creative Agency</Text>
              </View>
            </View>
            <View style={styles.addressInfo}>
              <Text>Uttara, Dhaka 1230, Bangladesh</Text>
              <Text>+880 175 583 1289</Text>
              <Text>thenoeticstudio@gmail.com</Text>
            </View>
          </View>

          <View style={styles.invoiceTitleSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.invoiceMeta}>
              <Text>{invoiceNo}</Text>
              <Text>{displayDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Billed To */}
          <View style={styles.billedToSection}>
            <Text style={styles.billedToLabel}>BILLED TO:</Text>
            <View style={styles.billedToInfo}>
              <Text style={{ fontWeight: 'bold' }}>{invoice.client_name}</Text>
              {invoice.client_phone && <Text>{invoice.client_phone}</Text>}
              <Text>{invoice.client_address || invoice.client_email}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderLabel, { flex: 4 }]}>Item Description:</Text>
              <Text style={[styles.tableHeaderLabel, { flex: 1, textAlign: 'center' }]}>Quantity</Text>
              <Text style={[styles.tableHeaderLabel, { flex: 1.5, textAlign: 'right' }]}>Unit Price</Text>
              <Text style={[styles.tableHeaderLabel, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
            </View>

            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={{ flex: 4 }}>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  {item.subDescription && <Text style={styles.itemSub}>{item.subDescription}</Text>}
                </View>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>{formatter.format(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>{formatter.format(item.unitPrice * item.quantity)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatter.format(invoice.amount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (0%)</Text>
              <Text style={styles.totalValue}>N/A</Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: COLORS.text, width: '40%', marginTop: 5 }} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{invoice.currency} {invoice.amount}</Text>
            </View>
          </View>
        </View>

        {/* Footer / Signature */}
        <View style={styles.footer}>
          <View style={styles.signatureSection}>
            <Text style={styles.signatureName}>Tahmid Ashfaque</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authorized Signed</Text>
          </View>

          <Text style={styles.thankYou}>Thank you for your business.</Text>
        </View>
      </Page>
    </Document>
  );
}
