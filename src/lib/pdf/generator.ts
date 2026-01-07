// Générateur PDF côté serveur
// Utilise une approche basée sur HTML pour une meilleure compatibilité

export interface CompanyInfo {
  name: string;
  legalName?: string;
  siret?: string;
  tva?: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  company?: {
    name: string;
    siret?: string;
    tva?: string;
  };
}

export interface DocumentLine {
  description: string;
  quantity: number;
  unitPriceHT: number;
  vatRate: number;
  totalHT: number;
}

export interface QuoteData {
  number: string;
  date: Date;
  validUntil: Date;
  customer: CustomerInfo;
  lines: DocumentLine[];
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  notes?: string;
  conditions?: string;
}

export interface InvoiceData {
  number: string;
  issueDate: Date;
  dueDate: Date;
  customer: CustomerInfo;
  lines: DocumentLine[];
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  amountPaid: number;
  notes?: string;
  paymentTerms?: string;
  quoteNumber?: string;
}

export interface CertificateData {
  number: string;
  date: Date;
  customer: CustomerInfo;
  technician: {
    name: string;
    qualification?: string;
  };
  equipment: {
    type: string;
    brand?: string;
    model?: string;
    location?: string;
  };
  intervention: {
    type: string;
    observations?: string;
    recommendations?: string;
    nextServiceDate?: Date;
  };
  signatureData?: string;
}

// Formater une date en français
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Formater un montant en euros
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Informations par défaut de l'entreprise
export const defaultCompanyInfo: CompanyInfo = {
  name: 'DCS Ramonage',
  legalName: 'DCS RAMONAGE',
  siret: '123 456 789 00010',
  tva: 'FR12345678900',
  address: '123 Rue du Commerce',
  city: 'Beauvais',
  postalCode: '60000',
  phone: '03 44 XX XX XX',
  email: 'contact@dcs-ramonage.fr',
  website: 'www.dcs-ramonage.fr',
};

// Générer le HTML pour un devis
export function generateQuoteHTML(data: QuoteData, company: CompanyInfo = defaultCompanyInfo): string {
  const linesHTML = data.lines.map(line => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${line.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${line.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatMoney(line.unitPriceHT)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${line.vatRate}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${formatMoney(line.totalHT)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Devis ${data.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1f2937; line-height: 1.5; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #f97316; }
    .document-info { text-align: right; }
    .document-title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
    .document-number { font-size: 16px; color: #6b7280; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party { width: 45%; }
    .party-title { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
    .party-name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .table-container { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; }
    th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #6b7280; }
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .total-row.final { border-bottom: none; background-color: #1f2937; color: white; padding: 16px; margin-top: 8px; font-size: 18px; font-weight: bold; }
    .notes { margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
    .notes-title { font-weight: 600; margin-bottom: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    .validity { margin-top: 20px; padding: 16px; background-color: #fef3c7; border-radius: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${company.name}</div>
      <div class="document-info">
        <div class="document-title">DEVIS</div>
        <div class="document-number">${data.number}</div>
        <div style="margin-top: 8px; color: #6b7280;">Date : ${formatDate(data.date)}</div>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <div class="party-title">Émetteur</div>
        <div class="party-name">${company.legalName || company.name}</div>
        <div>${company.address}</div>
        <div>${company.postalCode} ${company.city}</div>
        <div style="margin-top: 8px;">Tél : ${company.phone}</div>
        <div>Email : ${company.email}</div>
        ${company.siret ? `<div style="margin-top: 8px; font-size: 12px; color: #6b7280;">SIRET : ${company.siret}</div>` : ''}
        ${company.tva ? `<div style="font-size: 12px; color: #6b7280;">TVA : ${company.tva}</div>` : ''}
      </div>
      <div class="party">
        <div class="party-title">Client</div>
        <div class="party-name">${data.customer.firstName} ${data.customer.lastName}</div>
        ${data.customer.company ? `<div>${data.customer.company.name}</div>` : ''}
        <div>${data.customer.address}</div>
        <div>${data.customer.postalCode} ${data.customer.city}</div>
        <div style="margin-top: 8px;">Tél : ${data.customer.phone}</div>
        ${data.customer.email ? `<div>Email : ${data.customer.email}</div>` : ''}
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 40%;">Description</th>
            <th style="width: 10%; text-align: center;">Qté</th>
            <th style="width: 18%; text-align: right;">Prix unit. HT</th>
            <th style="width: 12%; text-align: center;">TVA</th>
            <th style="width: 20%; text-align: right;">Total HT</th>
          </tr>
        </thead>
        <tbody>
          ${linesHTML}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="total-row">
        <span>Total HT</span>
        <span>${formatMoney(data.totalHT)}</span>
      </div>
      <div class="total-row">
        <span>TVA</span>
        <span>${formatMoney(data.totalVAT)}</span>
      </div>
      <div class="total-row final">
        <span>Total TTC</span>
        <span>${formatMoney(data.totalTTC)}</span>
      </div>
    </div>

    <div class="validity">
      <strong>Devis valable jusqu'au ${formatDate(data.validUntil)}</strong>
    </div>

    ${data.notes ? `
    <div class="notes">
      <div class="notes-title">Notes :</div>
      <div>${data.notes}</div>
    </div>
    ` : ''}

    ${data.conditions ? `
    <div class="notes" style="margin-top: 16px;">
      <div class="notes-title">Conditions de paiement :</div>
      <div>${data.conditions}</div>
    </div>
    ` : ''}

    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
      <div style="width: 45%;">
        <div style="font-weight: 600; margin-bottom: 8px;">Signature du client</div>
        <div style="border: 1px dashed #d1d5db; height: 100px; border-radius: 4px;"></div>
        <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">Bon pour accord - Date :</div>
      </div>
      <div style="width: 45%;">
        <div style="font-weight: 600; margin-bottom: 8px;">Cachet de l'entreprise</div>
        <div style="border: 1px dashed #d1d5db; height: 100px; border-radius: 4px;"></div>
      </div>
    </div>

    <div class="footer">
      <div>${company.legalName || company.name} - ${company.address}, ${company.postalCode} ${company.city}</div>
      <div>Tél : ${company.phone} - Email : ${company.email}${company.website ? ` - ${company.website}` : ''}</div>
      ${company.siret ? `<div style="margin-top: 8px;">SIRET : ${company.siret}${company.tva ? ` - TVA Intra : ${company.tva}` : ''}</div>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

// Générer le HTML pour une facture
export function generateInvoiceHTML(data: InvoiceData, company: CompanyInfo = defaultCompanyInfo): string {
  const linesHTML = data.lines.map(line => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${line.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${line.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatMoney(line.unitPriceHT)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${line.vatRate}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${formatMoney(line.totalHT)}</td>
    </tr>
  `).join('');

  const resteDu = data.totalTTC - data.amountPaid;
  const isPaid = resteDu <= 0;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture ${data.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1f2937; line-height: 1.5; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #f97316; }
    .document-info { text-align: right; }
    .document-title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
    .document-number { font-size: 16px; color: #6b7280; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; }
    .status-paid { background-color: #dcfce7; color: #166534; }
    .status-pending { background-color: #fef3c7; color: #92400e; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party { width: 45%; }
    .party-title { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
    .party-name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .table-container { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; }
    th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #6b7280; }
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .total-row.final { border-bottom: none; background-color: #1f2937; color: white; padding: 16px; margin-top: 8px; font-size: 18px; font-weight: bold; }
    .total-row.due { background-color: #dc2626; }
    .notes { margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
    .notes-title { font-weight: 600; margin-bottom: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    .payment-info { margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${company.name}</div>
      <div class="document-info">
        <div class="document-title">FACTURE</div>
        <div class="document-number">${data.number}</div>
        <div style="margin-top: 8px; color: #6b7280;">Date : ${formatDate(data.issueDate)}</div>
        <div style="color: #6b7280;">Échéance : ${formatDate(data.dueDate)}</div>
        <span class="status-badge ${isPaid ? 'status-paid' : 'status-pending'}">${isPaid ? 'PAYÉE' : 'EN ATTENTE'}</span>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <div class="party-title">Émetteur</div>
        <div class="party-name">${company.legalName || company.name}</div>
        <div>${company.address}</div>
        <div>${company.postalCode} ${company.city}</div>
        <div style="margin-top: 8px;">Tél : ${company.phone}</div>
        <div>Email : ${company.email}</div>
        ${company.siret ? `<div style="margin-top: 8px; font-size: 12px; color: #6b7280;">SIRET : ${company.siret}</div>` : ''}
        ${company.tva ? `<div style="font-size: 12px; color: #6b7280;">TVA : ${company.tva}</div>` : ''}
      </div>
      <div class="party">
        <div class="party-title">Client</div>
        <div class="party-name">${data.customer.firstName} ${data.customer.lastName}</div>
        ${data.customer.company ? `<div>${data.customer.company.name}</div>` : ''}
        <div>${data.customer.address}</div>
        <div>${data.customer.postalCode} ${data.customer.city}</div>
        <div style="margin-top: 8px;">Tél : ${data.customer.phone}</div>
        ${data.customer.email ? `<div>Email : ${data.customer.email}</div>` : ''}
      </div>
    </div>

    ${data.quoteNumber ? `<div style="margin-bottom: 20px; color: #6b7280;">Référence devis : ${data.quoteNumber}</div>` : ''}

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 40%;">Description</th>
            <th style="width: 10%; text-align: center;">Qté</th>
            <th style="width: 18%; text-align: right;">Prix unit. HT</th>
            <th style="width: 12%; text-align: center;">TVA</th>
            <th style="width: 20%; text-align: right;">Total HT</th>
          </tr>
        </thead>
        <tbody>
          ${linesHTML}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="total-row">
        <span>Total HT</span>
        <span>${formatMoney(data.totalHT)}</span>
      </div>
      <div class="total-row">
        <span>TVA</span>
        <span>${formatMoney(data.totalVAT)}</span>
      </div>
      <div class="total-row final">
        <span>Total TTC</span>
        <span>${formatMoney(data.totalTTC)}</span>
      </div>
      ${data.amountPaid > 0 ? `
      <div class="total-row" style="margin-top: 16px;">
        <span>Déjà payé</span>
        <span style="color: #16a34a;">- ${formatMoney(data.amountPaid)}</span>
      </div>
      ` : ''}
      ${!isPaid ? `
      <div class="total-row final due">
        <span>Reste à payer</span>
        <span>${formatMoney(resteDu)}</span>
      </div>
      ` : ''}
    </div>

    <div class="payment-info">
      <div style="font-weight: 600; margin-bottom: 8px;">Modalités de paiement</div>
      <div>${data.paymentTerms || 'Paiement à réception'}</div>
      <div style="margin-top: 12px;">
        <strong>Modes de paiement acceptés :</strong> Espèces, Chèque, Carte bancaire, Virement
      </div>
      <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
        En cas de retard de paiement, des pénalités de retard seront appliquées conformément à la loi.
      </div>
    </div>

    ${data.notes ? `
    <div class="notes">
      <div class="notes-title">Notes :</div>
      <div>${data.notes}</div>
    </div>
    ` : ''}

    <div class="footer">
      <div>${company.legalName || company.name} - ${company.address}, ${company.postalCode} ${company.city}</div>
      <div>Tél : ${company.phone} - Email : ${company.email}${company.website ? ` - ${company.website}` : ''}</div>
      ${company.siret ? `<div style="margin-top: 8px;">SIRET : ${company.siret}${company.tva ? ` - TVA Intra : ${company.tva}` : ''}</div>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

// Générer le HTML pour un certificat de ramonage
export function generateCertificateHTML(data: CertificateData, company: CompanyInfo = defaultCompanyInfo): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Certificat de ramonage ${data.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1f2937; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #f97316; }
    .logo { font-size: 28px; font-weight: bold; color: #f97316; margin-bottom: 8px; }
    .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-top: 16px; }
    .subtitle { color: #6b7280; }
    .section { margin-bottom: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item { }
    .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
    .info-value { font-weight: 500; }
    .attestation { margin: 40px 0; padding: 24px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981; }
    .attestation-title { font-weight: 600; color: #065f46; margin-bottom: 12px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
    .signature-box { width: 45%; }
    .signature-title { font-weight: 600; margin-bottom: 8px; }
    .signature-area { border: 1px dashed #d1d5db; height: 100px; border-radius: 4px; margin-bottom: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    .legal { margin-top: 30px; padding: 16px; background-color: #fef3c7; border-radius: 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${company.name}</div>
      <div class="subtitle">${company.address}, ${company.postalCode} ${company.city}</div>
      <div class="subtitle">Tél : ${company.phone} - ${company.email}</div>
      <div class="title">CERTIFICAT DE RAMONAGE</div>
      <div class="subtitle">N° ${data.number} - ${formatDate(data.date)}</div>
    </div>

    <div class="section">
      <div class="section-title">Client</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nom</div>
          <div class="info-value">${data.customer.firstName} ${data.customer.lastName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Téléphone</div>
          <div class="info-value">${data.customer.phone}</div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
          <div class="info-label">Adresse d'intervention</div>
          <div class="info-value">${data.customer.address}, ${data.customer.postalCode} ${data.customer.city}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Équipement</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Type d'appareil</div>
          <div class="info-value">${data.equipment.type}</div>
        </div>
        ${data.equipment.brand ? `
        <div class="info-item">
          <div class="info-label">Marque / Modèle</div>
          <div class="info-value">${data.equipment.brand}${data.equipment.model ? ` ${data.equipment.model}` : ''}</div>
        </div>
        ` : ''}
        ${data.equipment.location ? `
        <div class="info-item">
          <div class="info-label">Emplacement</div>
          <div class="info-value">${data.equipment.location}</div>
        </div>
        ` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Intervention réalisée</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Type d'intervention</div>
          <div class="info-value">${data.intervention.type}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date</div>
          <div class="info-value">${formatDate(data.date)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Technicien</div>
          <div class="info-value">${data.technician.name}${data.technician.qualification ? ` - ${data.technician.qualification}` : ''}</div>
        </div>
        ${data.intervention.nextServiceDate ? `
        <div class="info-item">
          <div class="info-label">Prochain ramonage recommandé</div>
          <div class="info-value">${formatDate(data.intervention.nextServiceDate)}</div>
        </div>
        ` : ''}
      </div>
      ${data.intervention.observations ? `
      <div style="margin-top: 16px;">
        <div class="info-label">Observations</div>
        <div class="info-value">${data.intervention.observations}</div>
      </div>
      ` : ''}
      ${data.intervention.recommendations ? `
      <div style="margin-top: 16px;">
        <div class="info-label">Recommandations</div>
        <div class="info-value">${data.intervention.recommendations}</div>
      </div>
      ` : ''}
    </div>

    <div class="attestation">
      <div class="attestation-title">ATTESTATION</div>
      <p>Je soussigné, ${data.technician.name}, technicien qualifié de l'entreprise ${company.name}, certifie avoir effectué le ramonage du conduit de fumée ci-dessus mentionné conformément aux règles de l'art et aux normes en vigueur.</p>
      <p style="margin-top: 12px;">Le conduit a été trouvé en bon état de fonctionnement et de sécurité à l'issue de l'intervention.</p>
    </div>

    <div class="signatures">
      <div class="signature-box">
        <div class="signature-title">Signature du client</div>
        <div class="signature-area">${data.signatureData ? `<img src="${data.signatureData}" alt="Signature" style="max-width: 100%; max-height: 100%;">` : ''}</div>
        <div style="font-size: 12px; color: #6b7280;">Lu et approuvé</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Signature du technicien</div>
        <div class="signature-area"></div>
        <div style="font-size: 12px; color: #6b7280;">${data.technician.name}</div>
      </div>
    </div>

    <div class="legal">
      <strong>Rappel réglementaire :</strong> Conformément au Règlement Sanitaire Départemental Type (RSDT), le ramonage des conduits de fumée doit être effectué au moins une fois par an pour les appareils utilisant des combustibles gazeux et au moins deux fois par an pour ceux utilisant des combustibles solides ou liquides (dont une fois pendant la période de chauffe). Ce certificat constitue une preuve de l'entretien régulier de votre installation, exigée par les compagnies d'assurance.
    </div>

    <div class="footer">
      <div>${company.legalName || company.name} - ${company.address}, ${company.postalCode} ${company.city}</div>
      <div>Tél : ${company.phone} - Email : ${company.email}${company.website ? ` - ${company.website}` : ''}</div>
      ${company.siret ? `<div style="margin-top: 8px;">SIRET : ${company.siret}</div>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}
