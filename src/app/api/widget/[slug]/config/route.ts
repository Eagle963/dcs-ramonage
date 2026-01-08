import { NextRequest, NextResponse } from 'next/server';

// Interfaces pour la configuration du widget
interface ServiceConfig {
  id: string;
  name: string;
  tarif: string;
}

interface EquipmentConfig {
  id: string;
  name: string;
  tarif: string;
}

interface ZoneConfig {
  id: string;
  code: string;
  name: string;
}

interface WidgetConfig {
  organization: {
    slug: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    postalCode: string;
  };
  booking: {
    mode: 'creneaux' | 'horaires';
    morningStart: string;
    morningEnd: string;
    afternoonStart: string;
    afternoonEnd: string;
    workDays: { [key: string]: boolean };
    minDelayHours: number | null;
    maxDelayDays: number | null;
  };
  services: ServiceConfig[];
  equipments: EquipmentConfig[];
  zones: ZoneConfig[];
  widget: {
    color: string;
    showLogo: boolean;
    headerBadge: string;
    headerTitle: string;
    headerSubtitle: string;
  };
}

// TODO: Remplacer par une vraie requête Prisma quand la DB sera connectée
const MOCK_CONFIGS: { [slug: string]: WidgetConfig } = {
  'dcs-ramonage': {
    organization: {
      slug: 'dcs-ramonage',
      name: 'DCS Ramonage Oise & Val d\'Oise',
      email: 'contact@dcs-ramonage.fr',
      phone: '06 12 34 56 78',
      website: 'dcs-ramonage.fr',
      address: '15 Rue de la Gare',
      city: 'Beauvais',
      postalCode: '60000',
    },
    booking: {
      mode: 'creneaux',
      morningStart: '08:00',
      morningEnd: '12:00',
      afternoonStart: '14:00',
      afternoonEnd: '18:00',
      workDays: {
        lundi: true,
        mardi: true,
        mercredi: true,
        jeudi: true,
        vendredi: true,
        samedi: false,
        dimanche: false,
      },
      minDelayHours: 24,
      maxDelayDays: 60,
    },
    services: [
      { id: 'ramonage', name: 'Ramonage / Entretien', tarif: 'À partir de 60€' },
      { id: 'debistrage', name: 'Débistrage', tarif: 'À partir de 90€' },
      { id: 'tubage', name: 'Tubage', tarif: 'Sur devis' },
      { id: 'depannage', name: 'Dépannage', tarif: 'À partir de 90€' },
      { id: 'devis', name: 'Devis', tarif: 'Gratuit' },
    ],
    equipments: [
      { id: 'gas_boiler', name: 'Chaudière gaz', tarif: '60€' },
      { id: 'chimney_open', name: 'Cheminée ouverte', tarif: '70€' },
      { id: 'chimney_insert', name: 'Insert', tarif: '70€' },
      { id: 'wood_stove', name: 'Poêle à bois', tarif: '80€' },
      { id: 'oil_boiler', name: 'Chaudière fioul', tarif: '80€' },
      { id: 'pellet_stove', name: 'Poêle à granulés', tarif: 'Dès 80€' },
      { id: 'wood_boiler', name: 'Chaudière bois', tarif: '80€' },
      { id: 'polyflam', name: 'Cheminée Polyflam', tarif: '90€' },
      { id: 'conduit_difficile', name: 'Conduit difficile', tarif: '110€' },
    ],
    zones: [
      { id: 'zone_60', code: '60', name: 'Oise' },
      { id: 'zone_95', code: '95', name: 'Val-d\'Oise' },
    ],
    widget: {
      color: '#f97316',
      showLogo: true,
      headerBadge: 'Réservation en ligne',
      headerTitle: 'Prenez rendez-vous',
      headerSubtitle: 'Choisissez votre créneau et nous vous recontactons pour confirmer.',
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validation du slug
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json(
      { error: 'Slug invalide' },
      { status: 400 }
    );
  }

  // TODO: Remplacer par une requête Prisma
  // const config = await prisma.organization.findUnique({
  //   where: { slug },
  //   include: { services: true, equipments: true, zones: true }
  // });

  const config = MOCK_CONFIGS[slug];

  if (!config) {
    return NextResponse.json(
      { error: 'Organisation non trouvée' },
      { status: 404 }
    );
  }

  // Ajouter des headers CORS pour permettre l'intégration iframe
  const response = NextResponse.json(config);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
