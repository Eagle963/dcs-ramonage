import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Cergy (95000) | Ramoneur Certifié',
  description: 'Ramoneur à Cergy : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Cergy', 'ramoneur Cergy', 'ramonage 95000', 'ramonage cheminée Cergy'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-cergy` },
};

export default function RamonageCergyPage() {
  return (
    <LocalPageTemplate
      city="Cergy"
      department="Val-d'Oise (95)"
      postalCodes={['95000', '95800']}
      nearbyAreas={['Pontoise', 'Osny', 'Vauréal', 'Éragny', 'Saint-Ouen-l\'Aumône']}
      specificContent="Ville nouvelle et préfecture du Val-d'Oise, Cergy compte de nombreux logements équipés de systèmes de chauffage nécessitant un ramonage régulier. Nous intervenons à Cergy et ses environs."
    />
  );
}
