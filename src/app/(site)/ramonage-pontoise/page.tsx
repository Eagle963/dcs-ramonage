import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Pontoise (95300) | Ramoneur Certifié',
  description: 'Ramoneur à Pontoise : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Pontoise', 'ramoneur Pontoise', 'ramonage 95300', 'ramonage cheminée Pontoise'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-pontoise` },
};

export default function RamonagePontoisePage() {
  return (
    <LocalPageTemplate
      city="Pontoise"
      department="Val-d'Oise (95)"
      postalCodes={['95300']}
      nearbyAreas={['Cergy', 'Saint-Ouen-l\'Aumône', 'Auvers-sur-Oise', 'Osny', 'Éragny']}
      specificContent="Ville historique et sous-préfecture du Val-d'Oise, Pontoise possède un centre ancien avec de nombreuses cheminées traditionnelles. Notre savoir-faire nous permet d'intervenir sur tout type de conduit."
    />
  );
}
