import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Bessancourt (95550) | Ramoneur Certifié',
  description: 'Ramoneur à Bessancourt : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Bessancourt', 'ramoneur Bessancourt', 'ramonage 95550', 'ramonage cheminée Bessancourt'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-bessancourt` },
};

export default function RamonageBessancourtPage() {
  return (
    <LocalPageTemplate
      city="Bessancourt"
      department="Val-d'Oise (95)"
      postalCodes={['95550']}
      nearbyAreas={['Taverny', 'Frépillon', 'Herblay', 'Pierrelaye', 'Saint-Leu-la-Forêt']}
      specificContent="Commune résidentielle du Val-d'Oise, Bessancourt compte de nombreuses maisons individuelles avec cheminées et poêles. Nous assurons un service de proximité pour l'entretien de vos conduits."
    />
  );
}
