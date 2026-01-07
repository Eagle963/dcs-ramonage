// Email templates for booking notifications
// Uses the same pattern as the contact form

import { siteConfig } from '@/config/site';

// Booking request data interface
export interface BookingRequestData {
  id: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  serviceType: string;
  equipmentType: string | null;
  brand: string | null;
  model: string | null;
  exhaustType: string | null;
  message: string | null;
}

// Service type labels
const SERVICE_LABELS: Record<string, string> = {
  RAMONAGE: 'Ramonage',
  DEBISTRAGE: 'Débistrage',
  TUBAGE: 'Tubage',
  ENTRETIEN: 'Entretien',
  DIAGNOSTIC: 'Diagnostic',
  FUMISTERIE: 'Fumisterie',
  DEPANNAGE: 'Dépannage',
  OTHER: 'Autre',
};

// Equipment type labels
const EQUIPMENT_LABELS: Record<string, string> = {
  CHIMNEY_OPEN: 'Cheminée ouverte',
  CHIMNEY_INSERT: 'Insert de cheminée',
  WOOD_STOVE: 'Poêle à bois',
  PELLET_STOVE: 'Poêle à granulés',
  OIL_BOILER: 'Chaudière fioul',
  GAS_BOILER: 'Chaudière gaz',
  WOOD_BOILER: 'Chaudière bois',
  OTHER: 'Autre',
};

// Exhaust type labels
const EXHAUST_LABELS: Record<string, string> = {
  ROOF: 'Sortie en toiture',
  FACADE: 'Sortie en façade',
  UNKNOWN: 'Je ne sais pas',
};

// Escape HTML for security
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Get slot label
function getSlotLabel(slot: string): string {
  return slot === 'MORNING' ? 'Matin (9h-12h)' : 'Après-midi (14h-17h)';
}

/**
 * Generate admin notification email HTML
 */
export function generateAdminNotificationHtml(data: BookingRequestData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: white; padding: 25px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
        .content { background: #ffffff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; }
        .badge { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
        .section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
        .section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .section-title { font-size: 14px; font-weight: bold; color: #6B7280; text-transform: uppercase; margin-bottom: 10px; }
        .field { margin-bottom: 12px; }
        .label { font-weight: 600; color: #374151; display: inline-block; min-width: 130px; }
        .value { color: #111827; }
        .highlight { background: #FFF7ED; padding: 15px; border-radius: 8px; border-left: 4px solid #F97316; }
        .message-box { background: #F9FAFB; padding: 15px; border-radius: 8px; margin-top: 10px; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; background: #F9FAFB; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
        .cta-button { display: inline-block; background: #F97316; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle demande de rendez-vous</h1>
          <p>Demande #${escapeHtml(data.id)}</p>
        </div>
        <div class="content">
          <span class="badge">EN ATTENTE DE CONFIRMATION</span>

          <div class="section highlight">
            <div class="section-title">Date souhaitee</div>
            <div class="field">
              <span class="value" style="font-size: 18px; font-weight: bold;">${escapeHtml(formatDate(data.date))}</span>
            </div>
            <div class="field">
              <span class="label">Creneau:</span>
              <span class="value">${escapeHtml(getSlotLabel(data.slot))}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Client</div>
            <div class="field">
              <span class="label">Nom:</span>
              <span class="value">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</span>
            </div>
            <div class="field">
              <span class="label">Telephone:</span>
              <span class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Adresse d'intervention</div>
            <div class="field">
              <span class="value">${escapeHtml(data.address)}<br>${escapeHtml(data.postalCode)} ${escapeHtml(data.city)}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Prestation demandee</div>
            <div class="field">
              <span class="label">Service:</span>
              <span class="value">${escapeHtml(SERVICE_LABELS[data.serviceType] || data.serviceType)}</span>
            </div>
            ${data.equipmentType ? `
            <div class="field">
              <span class="label">Equipement:</span>
              <span class="value">${escapeHtml(EQUIPMENT_LABELS[data.equipmentType] || data.equipmentType)}</span>
            </div>
            ` : ''}
            ${data.brand ? `
            <div class="field">
              <span class="label">Marque:</span>
              <span class="value">${escapeHtml(data.brand)}</span>
            </div>
            ` : ''}
            ${data.model ? `
            <div class="field">
              <span class="label">Modele:</span>
              <span class="value">${escapeHtml(data.model)}</span>
            </div>
            ` : ''}
            ${data.exhaustType ? `
            <div class="field">
              <span class="label">Type de sortie:</span>
              <span class="value">${escapeHtml(EXHAUST_LABELS[data.exhaustType] || data.exhaustType)}</span>
            </div>
            ` : ''}
          </div>

          ${data.message ? `
          <div class="section">
            <div class="section-title">Message du client</div>
            <div class="message-box">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          Cette demande a ete envoyee depuis le formulaire de reservation de ${siteConfig.urls.website}
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate admin notification email text (fallback)
 */
export function generateAdminNotificationText(data: BookingRequestData): string {
  return `
NOUVELLE DEMANDE DE RENDEZ-VOUS
================================
Demande #${data.id}

DATE SOUHAITEE
--------------
Date: ${formatDate(data.date)}
Creneau: ${getSlotLabel(data.slot)}

CLIENT
------
Nom: ${data.firstName} ${data.lastName}
Telephone: ${data.phone}
Email: ${data.email}

ADRESSE D'INTERVENTION
----------------------
${data.address}
${data.postalCode} ${data.city}

PRESTATION DEMANDEE
-------------------
Service: ${SERVICE_LABELS[data.serviceType] || data.serviceType}
${data.equipmentType ? `Equipement: ${EQUIPMENT_LABELS[data.equipmentType] || data.equipmentType}` : ''}
${data.brand ? `Marque: ${data.brand}` : ''}
${data.model ? `Modele: ${data.model}` : ''}
${data.exhaustType ? `Type de sortie: ${EXHAUST_LABELS[data.exhaustType] || data.exhaustType}` : ''}

${data.message ? `MESSAGE DU CLIENT\n-----------------\n${data.message}` : ''}

---
Cette demande a ete envoyee depuis le formulaire de reservation de ${siteConfig.urls.website}
  `.trim();
}

/**
 * Generate customer confirmation email HTML
 */
export function generateCustomerConfirmationHtml(data: BookingRequestData): string {
  const { company, contact, urls } = siteConfig;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
        .wrapper { padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0 0 8px 0; font-size: 24px; }
        .header p { margin: 0; opacity: 0.9; }
        .content { padding: 30px; }
        .success-icon { text-align: center; margin-bottom: 20px; }
        .success-icon span { display: inline-block; width: 60px; height: 60px; background: #D1FAE5; border-radius: 50%; line-height: 60px; font-size: 30px; }
        .intro { text-align: center; margin-bottom: 25px; }
        .intro h2 { color: #111827; margin: 0 0 10px 0; }
        .intro p { color: #6B7280; margin: 0; }
        .recap-box { background: #FFF7ED; border: 1px solid #FDBA74; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .recap-title { font-weight: bold; color: #9A3412; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; }
        .recap-item { display: flex; margin-bottom: 10px; }
        .recap-label { color: #78350F; min-width: 100px; }
        .recap-value { color: #111827; font-weight: 500; }
        .info-box { background: #EFF6FF; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
        .info-box h3 { color: #1E40AF; margin: 0 0 10px 0; font-size: 16px; }
        .info-box p { color: #1E3A8A; margin: 0; font-size: 14px; }
        .contact-section { text-align: center; padding: 25px; background: #F9FAFB; border-top: 1px solid #E5E7EB; }
        .contact-section h3 { color: #374151; margin: 0 0 15px 0; }
        .contact-info { color: #6B7280; font-size: 14px; }
        .contact-info a { color: #F97316; text-decoration: none; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #9CA3AF; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>${escapeHtml(company.name)}</h1>
            <p>${escapeHtml(company.tagline)}</p>
          </div>
          <div class="content">
            <div class="success-icon">
              <span>&#10003;</span>
            </div>
            <div class="intro">
              <h2>Demande de rendez-vous recue !</h2>
              <p>Bonjour ${escapeHtml(data.firstName)}, nous avons bien recu votre demande.</p>
            </div>

            <div class="recap-box">
              <div class="recap-title">Recapitulatif de votre demande</div>
              <div class="recap-item">
                <span class="recap-label">Date:</span>
                <span class="recap-value">${escapeHtml(formatDate(data.date))}</span>
              </div>
              <div class="recap-item">
                <span class="recap-label">Creneau:</span>
                <span class="recap-value">${escapeHtml(getSlotLabel(data.slot))}</span>
              </div>
              <div class="recap-item">
                <span class="recap-label">Service:</span>
                <span class="recap-value">${escapeHtml(SERVICE_LABELS[data.serviceType] || data.serviceType)}</span>
              </div>
              <div class="recap-item">
                <span class="recap-label">Adresse:</span>
                <span class="recap-value">${escapeHtml(data.address)}, ${escapeHtml(data.postalCode)} ${escapeHtml(data.city)}</span>
              </div>
              <div class="recap-item">
                <span class="recap-label">Reference:</span>
                <span class="recap-value">${escapeHtml(data.id)}</span>
              </div>
            </div>

            <div class="info-box">
              <h3>Prochaine etape</h3>
              <p>Notre equipe va examiner votre demande et vous contacter dans les plus brefs delais (sous 24-48h) pour confirmer le rendez-vous ou vous proposer un creneau alternatif si necessaire.</p>
            </div>
          </div>

          <div class="contact-section">
            <h3>Une question ?</h3>
            <div class="contact-info">
              <p>Appelez-nous au <a href="tel:${escapeHtml(contact.phoneFormatted)}">${escapeHtml(contact.phone)}</a></p>
              <p>Du lundi au vendredi, 9h - 17h</p>
            </div>
          </div>

          <div class="footer">
            <p>${escapeHtml(company.legalName)} - SIRET ${escapeHtml(company.siret)}</p>
            <p>Cet email a ete envoye automatiquement suite a votre demande sur ${escapeHtml(urls.website)}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate customer confirmation email text (fallback)
 */
export function generateCustomerConfirmationText(data: BookingRequestData): string {
  const { company, contact, urls } = siteConfig;

  return `
${company.name}
${company.tagline}

=====================================
DEMANDE DE RENDEZ-VOUS BIEN RECUE !
=====================================

Bonjour ${data.firstName},

Nous avons bien recu votre demande de rendez-vous. Merci de votre confiance !

RECAPITULATIF DE VOTRE DEMANDE
------------------------------
Date souhaitee: ${formatDate(data.date)}
Creneau: ${getSlotLabel(data.slot)}
Service: ${SERVICE_LABELS[data.serviceType] || data.serviceType}
Adresse: ${data.address}, ${data.postalCode} ${data.city}
Reference: ${data.id}

PROCHAINE ETAPE
---------------
Notre equipe va examiner votre demande et vous contacter dans les plus brefs delais (sous 24-48h) pour confirmer le rendez-vous ou vous proposer un creneau alternatif si necessaire.

UNE QUESTION ?
--------------
Appelez-nous au ${contact.phone}
Du lundi au vendredi, 9h - 17h

---
${company.legalName} - SIRET ${company.siret}
Cet email a ete envoye automatiquement suite a votre demande sur ${urls.website}
  `.trim();
}
