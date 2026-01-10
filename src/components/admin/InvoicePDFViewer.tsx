'use client';

import { useState, useEffect, useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';

interface InvoicePDFViewerProps {
  documentColor: string;
  documentStyle: 'classique' | 'moderne';
  phoneInternational: boolean;
  companyName?: string;
  companyAddress?: string;
  companyCity?: string;
  companyEmail?: string;
  companyPhone?: string;
}

// Create styles factory
const createStyles = (color: string, isModerne: boolean) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: isModerne ? 8 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color,
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  companySection: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: color,
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 2,
  },
  clientBox: {
    border: '1px solid #e5e7eb',
    borderRadius: isModerne ? 8 : 0,
    padding: 12,
    marginBottom: 20,
  },
  clientTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
  },
  clientDetail: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: color,
    marginBottom: 12,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: isModerne ? 6 : 0,
    borderTopRightRadius: isModerne ? 6 : 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #d1d5db',
    borderLeft: '1px solid #d1d5db',
    borderRight: '1px solid #d1d5db',
  },
  tableCell: {
    padding: 8,
    fontSize: 8,
    borderRight: '1px solid #d1d5db',
  },
  tableCellLast: {
    padding: 8,
    fontSize: 8,
  },
  cellDesignation: {
    width: '40%',
  },
  cellQty: {
    width: '10%',
    textAlign: 'center',
  },
  cellPrice: {
    width: '20%',
    textAlign: 'right',
  },
  cellTva: {
    width: '10%',
    textAlign: 'center',
  },
  cellTotal: {
    width: '20%',
    textAlign: 'right',
  },
  totals: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginRight: 20,
    width: 100,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 9,
    color: '#374151',
    width: 80,
    textAlign: 'right',
  },
  totalTTC: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#9ca3af',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

// PDF Document Component
const InvoicePDFDocument = ({
  documentColor = '#3b82f6',
  documentStyle = 'classique',
  phoneInternational = false,
  companyName = 'Dcs Ramonage Oise & Val d\'Oise',
  companyAddress = '58 RUE de Monceau',
  companyCity = '75008 Paris 8e Arrondissement',
  companyEmail = 'contact@dcs-ramonage.fr',
  companyPhone = '09 80 80 10 61',
}: InvoicePDFViewerProps) => {
  const isModerne = documentStyle === 'moderne';
  const styles = useMemo(() => createStyles(documentColor, isModerne), [documentColor, isModerne]);

  const formatPhone = (phone: string) => {
    if (phoneInternational) {
      return '+33 ' + phone.substring(1).replace(/(.{1})(.{2})(.{2})(.{2})(.{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>DCS RAMONAGE</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>Facture F0000</Text>
            <Text style={styles.invoiceDate}>Date émission : 10/01/2026</Text>
            <Text style={styles.invoiceDate}>Date échéance : 10/01/2026</Text>
          </View>
        </View>

        {/* Company Info */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{companyName}</Text>
          <Text style={styles.companyDetail}>{companyAddress}</Text>
          <Text style={styles.companyDetail}>{companyCity}</Text>
          <Text style={styles.companyDetail}>{companyEmail}</Text>
          <Text style={styles.companyDetail}>{formatPhone(companyPhone || '')}</Text>
        </View>

        {/* Client Box */}
        <View style={styles.clientBox}>
          <Text style={styles.clientTitle}>Client</Text>
          <Text style={styles.clientDetail}>Hedi Maronier</Text>
          <Text style={styles.clientDetail}>6 rue d'Armaillé</Text>
          <Text style={styles.clientDetail}>75017 Paris</Text>
        </View>

        {/* Order Number */}
        <Text style={styles.orderNumber}>N° de bon de commande : XXXXXXZZZ</Text>

        {/* Service Title */}
        <Text style={styles.serviceTitle}>Installation climatisation</Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableHeader, styles.tableRow]}>
            <Text style={[styles.tableCell, styles.cellDesignation]}>Désignation</Text>
            <Text style={[styles.tableCell, styles.cellQty]}>Qté</Text>
            <Text style={[styles.tableCell, styles.cellPrice]}>Prix U.HT</Text>
            <Text style={[styles.tableCell, styles.cellTva]}>TVA</Text>
            <Text style={[styles.tableCellLast, styles.cellTotal]}>Total HT</Text>
          </View>
          {/* Body */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cellDesignation]}>Installation climatisation</Text>
            <Text style={[styles.tableCell, styles.cellQty]}>1</Text>
            <Text style={[styles.tableCell, styles.cellPrice]}>120,00€</Text>
            <Text style={[styles.tableCell, styles.cellTva]}>10%</Text>
            <Text style={[styles.tableCellLast, styles.cellTotal]}>600,00€</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total :</Text>
            <Text style={styles.totalValue}>600,00 €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (10%) :</Text>
            <Text style={styles.totalValue}>60,00 €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.totalTTC]}>Total TTC :</Text>
            <Text style={[styles.totalValue, styles.totalTTC]}>660,00 €</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>DCS Ramonage - SIRET: 123 456 789 00012 - TVA: FR12345678901</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Viewer Component
const InvoicePDFViewer = (props: InvoicePDFViewerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary-50 rounded-lg">
        <div className="text-secondary-400 text-sm">Chargement de l'aperçu...</div>
      </div>
    );
  }

  return (
    <PDFViewer
      width="100%"
      height="100%"
      showToolbar={false}
      style={{ border: 'none', borderRadius: '8px' }}
    >
      <InvoicePDFDocument {...props} />
    </PDFViewer>
  );
};

export default InvoicePDFViewer;
