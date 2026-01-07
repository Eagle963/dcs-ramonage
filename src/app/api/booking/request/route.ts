import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  generateAdminNotificationHtml,
  generateAdminNotificationText,
  generateCustomerConfirmationHtml,
  generateCustomerConfirmationText,
  type BookingRequestData,
} from '@/lib/email/booking-templates';

// Initialize Resend only if API key exists
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email configuration
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || 'contact@dcs-ramonage.fr';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@dcs-ramonage.fr';

// Codes postaux desservis (Oise 60 + Val-d'Oise 95)
const isValidPostalCode = (postalCode: string): boolean => {
  return postalCode.startsWith('60') || postalCode.startsWith('95');
};

// Types de services
const VALID_SERVICES = [
  'RAMONAGE',
  'DEBISTRAGE', 
  'TUBAGE',
  'ENTRETIEN',
  'DIAGNOSTIC',
  'FUMISTERIE',
  'DEPANNAGE',
  'OTHER',
];

// Types d'équipements
const VALID_EQUIPMENT = [
  'CHIMNEY_OPEN',
  'CHIMNEY_INSERT',
  'WOOD_STOVE',
  'PELLET_STOVE',
  'OIL_BOILER',
  'GAS_BOILER',
  'WOOD_BOILER',
  'OTHER',
];

// Extended booking type for storage (includes status and timestamps)
interface StoredBookingRequest extends BookingRequestData {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// Simulation stockage (à remplacer par Prisma)
const bookingRequests: StoredBookingRequest[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      date,
      slot,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      serviceType,
      equipmentType,
      brand,
      model,
      exhaustType,
      message,
    } = body;

    // Validations
    const errors: string[] = [];

    if (!date) errors.push('La date est requise');
    if (!slot || !['MORNING', 'AFTERNOON'].includes(slot)) {
      errors.push('Le créneau (matin ou après-midi) est requis');
    }
    if (!firstName?.trim()) errors.push('Le prénom est requis');
    if (!lastName?.trim()) errors.push('Le nom est requis');
    if (!email?.trim() || !email.includes('@')) errors.push('L\'email est invalide');
    if (!phone?.trim() || phone.replace(/\D/g, '').length < 10) {
      errors.push('Le numéro de téléphone est invalide');
    }
    if (!address?.trim()) errors.push('L\'adresse est requise');
    if (!city?.trim()) errors.push('La ville est requise');
    if (!postalCode?.trim()) errors.push('Le code postal est requis');
    if (!equipmentType) {
      errors.push('Le type d\'équipement est requis');
    }

    // Vérification zone d'intervention
    if (postalCode && !isValidPostalCode(postalCode)) {
      return NextResponse.json({
        success: false,
        error: 'Zone non desservie',
        message: 'Désolé, nous n\'intervenons pas dans votre secteur. Notre zone d\'intervention couvre l\'Oise (60) et le Val-d\'Oise (95).',
      }, { status: 400 });
    }

    // Vérification date pas dans le passé
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      errors.push('La date ne peut pas être dans le passé');
    }

    // Vérification pas le weekend
    const dayOfWeek = requestedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      errors.push('Nous n\'intervenons pas le weekend');
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation échouée',
        errors,
      }, { status: 400 });
    }

    // Créer la demande de réservation
    const bookingRequest: BookingRequestData = {
      id: `br_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date,
      slot,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      serviceType: serviceType || 'RAMONAGE',
      equipmentType: equipmentType || null,
      brand: brand?.trim() || null,
      model: model?.trim() || null,
      exhaustType: exhaustType || null,
      message: message?.trim() || null,
    };

    // Create stored version with status and timestamps
    const storedBooking: StoredBookingRequest = {
      ...bookingRequest,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Sauvegarder (simulation - à remplacer par Prisma)
    bookingRequests.push(storedBooking);

    // Send email notifications (non-blocking - we don't want email errors to fail the booking)
    if (resend) {
      // Send admin notification email
      try {
        await resend.emails.send({
          from: `DCS Ramonage <${FROM_EMAIL}>`,
          to: [ADMIN_EMAIL],
          replyTo: bookingRequest.email,
          subject: `[Nouvelle Réservation] ${bookingRequest.firstName} ${bookingRequest.lastName} - ${new Date(bookingRequest.date).toLocaleDateString('fr-FR')}`,
          html: generateAdminNotificationHtml(bookingRequest),
          text: generateAdminNotificationText(bookingRequest),
        });
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('Erreur envoi email admin:', emailError);
      }

      // Send customer confirmation email
      try {
        await resend.emails.send({
          from: `DCS Ramonage <${FROM_EMAIL}>`,
          to: [bookingRequest.email],
          subject: `Confirmation de votre demande de rendez-vous - DCS Ramonage`,
          html: generateCustomerConfirmationHtml(bookingRequest),
          text: generateCustomerConfirmationText(bookingRequest),
        });
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('Erreur envoi email client:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Votre demande de rendez-vous a bien été enregistrée. Nous vous contacterons rapidement pour confirmer.',
      bookingId: bookingRequest.id,
      data: {
        date,
        slot: slot === 'MORNING' ? 'Matin' : 'Après-midi',
        service: serviceType,
      },
    });

  } catch (error) {
    console.error('Erreur booking request:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur',
      message: 'Une erreur est survenue. Veuillez réessayer.',
    }, { status: 500 });
  }
}

// Récupérer les demandes (pour l'admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  let filtered = bookingRequests;
  
  if (status) {
    filtered = bookingRequests.filter(b => b.status === status);
  }
  
  // Tri par date de création décroissante
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    success: true,
    count: filtered.length,
    bookings: filtered,
  });
}
