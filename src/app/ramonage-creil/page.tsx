import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Creil (60100) | Ramoneur Certifié',
  description: 'Ramoneur à Creil : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Creil', 'ramoneur Creil', 'ramonage 60100', 'ramonage cheminée Creil'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-creil` },
};

export default function RamonageCreilPage() {
  return (
    <LocalPageTemplate
      city="Creil"
      department="Oise (60)"
      postalCodes={['60100']}
      nearbyAreas={['Nogent-sur-Oise', 'Montataire', 'Villers-Saint-Paul', 'Saint-Maximin', 'Thiverny']}
      specificContent="Creil et son agglomération représentent un bassin important de l'Oise. Nos ramoneurs interviennent dans toute la ville et les communes limitrophes pour l'entretien de vos appareils de chauffage."
    />
  );
}
