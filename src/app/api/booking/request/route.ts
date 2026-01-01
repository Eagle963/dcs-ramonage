import { NextRequest, NextResponse } from 'next/server';

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

// Simulation stockage (à remplacer par Prisma)
const bookingRequests: any[] = [];

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
    if (!serviceType || !VALID_SERVICES.includes(serviceType)) {
      errors.push('Le type de service est requis');
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
    const bookingRequest = {
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
      serviceType,
      equipmentType: equipmentType || null,
      message: message?.trim() || null,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Sauvegarder (simulation - à remplacer par Prisma)
    bookingRequests.push(bookingRequest);

    // TODO: Envoyer email de notification à l'admin
    // TODO: Envoyer email de confirmation au client

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
