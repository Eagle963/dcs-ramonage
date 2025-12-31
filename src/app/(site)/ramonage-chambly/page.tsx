import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Chambly (60230) | Ramoneur Certifié',
  description: 'Ramoneur à Chambly : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Chambly', 'ramoneur Chambly', 'ramonage 60230', 'ramonage cheminée Chambly'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-chambly` },
};

export default function RamonageChamblyPage() {
  return (
    <LocalPageTemplate
      city="Chambly"
      department="Oise (60)"
      postalCodes={['60230']}
      nearbyAreas={['Persan', 'Belle-Église', 'Neuilly-en-Thelle', 'Crouy-en-Thelle', 'Mesnil-en-Thelle']}
      specificContent="Commune dynamique à la frontière du Val-d'Oise, Chambly dispose d'un parc immobilier varié avec de nombreux équipements de chauffage au bois nécessitant un entretien régulier."
    />
  );
}
