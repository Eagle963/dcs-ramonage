import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.urls.website;
  const currentDate = new Date().toISOString();

  // Pages statiques principales
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/reservation', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/tarifs', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/zones-intervention', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/a-propos', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/politique-confidentialite', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/cgv', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Pages services
  const servicePages = siteConfig.services.map((service) => ({
    url: `/${service.slug}`,
    priority: 0.9,
    changeFrequency: 'monthly' as const,
  }));

  // Page Dielle (spécialiste)
  const specialPages = [
    { url: '/poele-granules-dielle', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  // Pages villes SEO
  const cityPages = [
    'beauvais', 'clermont', 'creil', 'chantilly', 'senlis', 'gouvieux', 'meru',
    'chambly', 'persan', 'isle-adam', 'cergy', 'pontoise', 'bessancourt',
    'taverny', 'ermont', 'argenteuil'
  ].map((city) => ({
    url: `/ramonage-${city}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  // Combiner toutes les pages
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...specialPages,
    ...cityPages,
  ];

  return allPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
