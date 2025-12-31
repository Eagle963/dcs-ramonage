import { siteConfig } from '@/config/site';

// Types pour les schémas
interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    '@type': string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  areaServed: {
    '@type': string;
    name: string;
  }[];
  openingHoursSpecification: {
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  priceRange: string;
  image?: string;
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
  sameAs?: string[];
}

interface ServiceSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
  };
  areaServed: {
    '@type': string;
    name: string;
  }[];
  serviceType: string;
}

interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item: string;
  }[];
}

// Schéma LocalBusiness principal
export function LocalBusinessJsonLd() {
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.company.name,
    description: siteConfig.company.description,
    url: siteConfig.urls.website,
    telephone: siteConfig.contact.phone,
    email: `${siteConfig.contact.emailUser}@${siteConfig.contact.emailDomain}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.addresses.intervention.city,
      addressRegion: siteConfig.addresses.intervention.region,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.4295,
      longitude: 2.0807,
    },
    areaServed: [
      { '@type': 'State', name: 'Oise' },
      { '@type': 'State', name: "Val-d'Oise" },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    priceRange: '€€',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '50',
    },
    sameAs: [
      siteConfig.urls.googleBusiness,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schéma Service
export function ServiceJsonLd({ 
  name, 
  description, 
  serviceType 
}: { 
  name: string; 
  description: string; 
  serviceType: string;
}) {
  const schema: ServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: siteConfig.company.name,
    },
    areaServed: [
      { '@type': 'State', name: 'Oise' },
      { '@type': 'State', name: "Val-d'Oise" },
    ],
    serviceType,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schéma Breadcrumb
export function BreadcrumbJsonLd({ 
  items 
}: { 
  items: { name: string; url: string }[] 
}) {
  const schema: BreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.urls.website}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schéma FAQ
export function FAQJsonLd({ 
  faqs 
}: { 
  faqs: { question: string; answer: string }[] 
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schéma Organization (pour la page À propos)
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.company.name,
    legalName: siteConfig.company.legalName,
    url: siteConfig.urls.website,
    telephone: siteConfig.contact.phone,
    email: `${siteConfig.contact.emailUser}@${siteConfig.contact.emailDomain}`,
    foundingDate: siteConfig.company.foundedYear.toString(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.addresses.administrative.street,
      addressLocality: siteConfig.addresses.administrative.city,
      postalCode: siteConfig.addresses.administrative.postalCode,
      addressCountry: 'FR',
    },
    sameAs: [
      siteConfig.urls.googleBusiness,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
