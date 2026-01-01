import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Gouvieux (60270) | Ramoneur Certifié',
  description: 'Ramoneur à Gouvieux : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Gouvieux', 'ramoneur Gouvieux', 'ramonage 60270', 'ramonage cheminée Gouvieux'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-gouvieux` },
};

export default function RamonageGouvieuxPage() {
  return (
    <LocalPageTemplate
      city="Gouvieux"
      department="Oise (60)"
      postalCodes={['60270']}
      nearbyAreas={['Chantilly', 'Lamorlaye', 'Précy-sur-Oise', 'Saint-Maximin', 'Toutevoie']}
      specificContent="Commune résidentielle proche de Chantilly, Gouvieux dispose de nombreuses maisons avec systèmes de chauffage au bois. Nous assurons l'entretien régulier de vos installations."
    />
  );
}
