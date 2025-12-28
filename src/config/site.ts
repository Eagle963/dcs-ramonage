// Configuration globale du site DCS Ramonage
// Ce fichier centralise toutes les informations de l'entreprise

export const siteConfig = {
  // Informations de l'entreprise
  company: {
    name: 'DCS Ramonage',
    legalName: 'DCS RAMONAGE SAS',
    tagline: 'Votre expert ramonage dans l\'Oise et le Val-d\'Oise',
    description: 'Artisan ramoneur certifié à Beauvais. Ramonage, débistrage, tubage et entretien de cheminées, poêles à bois et granulés. Intervention rapide dans l\'Oise (60) et Val-d\'Oise (95).',
    foundedYear: 2024,
    siret: '93182690300015',
    siren: '931826903',
    tva: 'FR00931826903',
    capital: '1000',
  },

  // Contact
  contact: {
    phone: '09 80 80 10 61',
    phoneFormatted: '+33 9 80 80 10 61',
    // Email protégé - séparé pour éviter le scraping par les bots
    // Utiliser le composant ProtectedEmail ou reconstruire côté client
    emailUser: 'contact',
    emailDomain: 'dcs-ramonage.fr',
  },

  // Adresses
  addresses: {
    administrative: {
      street: '58 rue de Monceau',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
    },
    intervention: {
      city: 'Beauvais',
      department: 'Oise',
      region: 'Hauts-de-France',
    },
  },

  // Zones d'intervention
  serviceAreas: {
    departments: [
      { code: '60', name: 'Oise' },
      { code: '95', name: 'Val-d\'Oise' },
    ],
    mainCities: [
      'Beauvais',
      'Clermont',
      'Creil',
      'Chantilly',
      'Senlis',
      'Gouvieux',
      'Méru',
      'L\'Isle-Adam',
      'Chambly',
      'Persan',
      'Cergy',
      'Pontoise',
      'Bessancourt',
      'Taverny',
      'Ermont',
      'Argenteuil',
    ],
  },

  // Horaires
  hours: {
    weekdays: '9h00 - 17h00',
    saturday: 'Urgences uniquement',
    sunday: 'Fermé',
  },

  // URLs
  urls: {
    website: 'https://dcs-ramonage.fr',
    booking: 'https://cal.com/dcs-ramonage',
    googleMaps: 'https://maps.google.com/?q=DCS+Ramonage+Beauvais',
    googleBusiness: 'https://share.google/t0sDSjWHOgewnkfDR',
  },

  // Réseaux sociaux
  social: {
    facebook: 'https://www.facebook.com/dcsramonage',
    instagram: 'https://www.instagram.com/dcsramonage/',
    linkedin: 'https://www.linkedin.com/company/104959213',
  },

  // SEO
  seo: {
    defaultTitle: 'DCS Ramonage | Ramoneur Certifié Beauvais, Oise & Val-d\'Oise',
    titleTemplate: '%s | DCS Ramonage',
    defaultDescription: 'Artisan ramoneur certifié à Beauvais. Ramonage de cheminées, poêles à bois et granulés, débistrage, tubage. Intervention rapide dans l\'Oise (60) et Val-d\'Oise (95). Devis gratuit.',
    keywords: [
      'ramonage',
      'ramoneur',
      'Beauvais',
      'Oise',
      'Val-d\'Oise',
      'cheminée',
      'poêle à bois',
      'poêle à granulés',
      'débistrage',
      'tubage',
      'entretien cheminée',
      'certificat ramonage',
    ] as string[],
    locale: 'fr_FR',
    type: 'website',
  },

  // Services proposés
  services: [
    {
      id: 'ramonage',
      name: 'Ramonage',
      slug: 'ramonage',
      shortDescription: 'Ramonage certifié de cheminées, inserts et conduits',
      icon: 'Flame',
      featured: true,
    },
    {
      id: 'debistrage',
      name: 'Débistrage',
      slug: 'debistrage',
      shortDescription: 'Élimination professionnelle du bistre dans vos conduits',
      icon: 'Hammer',
      featured: true,
    },
    {
      id: 'tubage',
      name: 'Tubage',
      slug: 'tubage-cheminee',
      shortDescription: 'Installation et rénovation de tubage aux normes',
      icon: 'Wrench',
      featured: true,
    },
    {
      id: 'entretien-poele',
      name: 'Entretien Poêles',
      slug: 'entretien-poele-granules',
      shortDescription: 'Entretien et dépannage de poêles à bois et granulés',
      icon: 'Settings',
      featured: true,
    },
    {
      id: 'diagnostic',
      name: 'Diagnostic',
      slug: 'diagnostic-conduit',
      shortDescription: 'Inspection vidéo et diagnostic complet de vos conduits',
      icon: 'Search',
      featured: false,
    },
    {
      id: 'fumisterie',
      name: 'Fumisterie',
      slug: 'fumisterie',
      shortDescription: 'Travaux de fumisterie et installation de conduits',
      icon: 'Hammer',
      featured: false,
    },
    {
      id: 'nettoyage',
      name: 'Nettoyage',
      slug: 'nettoyage-demoussage',
      shortDescription: 'Démoussage et nettoyage de toitures, murs, sols et vérandas',
      icon: 'Droplets',
      featured: false,
    },
  ],

  // Avantages / Arguments de vente
  benefits: [
    {
      title: 'Intervention Rapide',
      description: 'Disponible sous 24 à 48h',
      icon: 'Clock',
    },
    {
      title: 'Certificat Officiel',
      description: 'Attestation conforme pour assurance',
      icon: 'FileCheck',
    },
    {
      title: 'Devis Gratuit',
      description: 'Estimation sans engagement',
      icon: 'FileText',
    },
    {
      title: 'Artisan Certifié',
      description: 'Qualification professionnelle',
      icon: 'Award',
    },
  ],

  // Stats / Preuves sociales
  stats: [
    { value: '500+', label: 'Interventions réalisées' },
    { value: '5/5', label: 'Note Google' },
    { value: '24-48h', label: 'Délai d\'intervention' },
    { value: '100%', label: 'Clients satisfaits' },
  ],
} as const;

// Types pour TypeScript
export type Service = typeof siteConfig.services[number];
export type Benefit = typeof siteConfig.benefits[number];
export type Stat = typeof siteConfig.stats[number];
