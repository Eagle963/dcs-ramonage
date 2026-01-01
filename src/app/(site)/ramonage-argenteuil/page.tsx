import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Argenteuil (95100) | Ramoneur Certifié',
  description: 'Ramoneur à Argenteuil : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Argenteuil', 'ramoneur Argenteuil', 'ramonage 95100', 'ramonage cheminée Argenteuil'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-argenteuil` },
};

export default function RamonageArgenteuil() {
  return (
    <LocalPageTemplate
      city="Argenteuil"
      department="Val-d'Oise (95)"
      postalCodes={['95100']}
      nearbyAreas={['Bezons', 'Cormeilles-en-Parisis', 'Sannois', 'Colombes', 'Sartrouville']}
      specificContent="Plus grande ville du Val-d'Oise, Argenteuil possède un parc immobilier important avec de nombreux équipements de chauffage. Nous intervenons à Argenteuil et ses environs."
    />
  );
}
