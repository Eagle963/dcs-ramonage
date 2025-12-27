import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Email de destination
const TO_EMAIL = process.env.CONTACT_EMAIL || 'contact@dcs-ramonage.fr';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@dcs-ramonage.fr';

// Types
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
}

// Validation côté serveur
function validateFormData(data: ContactFormData): string | null {
  if (!data.name?.trim()) {
    return 'Le nom est requis';
  }
  
  if (!data.email?.trim()) {
    return 'L\'email est requis';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return 'Email invalide';
  }
  
  if (!data.subject?.trim()) {
    return 'Le sujet est requis';
  }
  
  if (!data.message?.trim()) {
    return 'Le message est requis';
  }
  
  if (data.message.trim().length < 20) {
    return 'Le message doit contenir au moins 20 caractères';
  }
  
  if (!data.consent) {
    return 'Vous devez accepter la politique de confidentialité';
  }
  
  return null;
}

// Template email HTML
function generateEmailHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; }
        .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .footer { text-align: center; padding: 15px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📧 Nouveau message - DCS Ramonage</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Nom</div>
            <div class="value">${escapeHtml(data.name)}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email</div>
            <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
          </div>
          ${data.phone ? `
          <div class="field">
            <div class="label">📞 Téléphone</div>
            <div class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">📋 Sujet</div>
            <div class="value">${escapeHtml(data.subject)}</div>
          </div>
          <div class="field">
            <div class="label">💬 Message</div>
            <div class="message-box">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          Ce message a été envoyé depuis le formulaire de contact de dcs-ramonage.fr
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template email texte (fallback)
function generateEmailText(data: ContactFormData): string {
  return `
Nouveau message depuis le site DCS Ramonage
============================================

Nom: ${data.name}
Email: ${data.email}
${data.phone ? `Téléphone: ${data.phone}` : ''}
Sujet: ${data.subject}

Message:
${data.message}

---
Ce message a été envoyé depuis le formulaire de contact de dcs-ramonage.fr
  `.trim();
}

// Échapper le HTML pour éviter les injections
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Handler POST
export async function POST(request: NextRequest) {
  try {
    // Vérifier la clé API Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY non configurée');
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    // Parser le body
    const body = await request.json();
    const data: ContactFormData = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      subject: body.subject || '',
      message: body.message || '',
      consent: body.consent || false,
    };

    // Validation
    const validationError = validateFormData(data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Envoyer l'email avec Resend
    const { data: emailData, error } = await resend.emails.send({
      from: `DCS Ramonage <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: data.email,
      subject: `[Contact Site] ${data.subject}`,
      html: generateEmailHtml(data),
      text: generateEmailText(data),
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      );
    }

    // Succès
    return NextResponse.json(
      { success: true, messageId: emailData?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Bloquer les autres méthodes
export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  );
}
