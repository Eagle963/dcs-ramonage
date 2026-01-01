import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Taverny (95150) | Ramoneur Certifié',
  description: 'Ramoneur à Taverny : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Taverny', 'ramoneur Taverny', 'ramonage 95150', 'ramonage cheminée Taverny'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-taverny` },
};

export default function RamonageTavernyPage() {
  return (
    <LocalPageTemplate
      city="Taverny"
      department="Val-d'Oise (95)"
      postalCodes={['95150']}
      nearbyAreas={['Saint-Leu-la-Forêt', 'Beauchamp', 'Bessancourt', 'Le Plessis-Bouchard', 'Franconville']}
      specificContent="Grande commune du Val-d'Oise en lisière de la forêt de Montmorency, Taverny dispose d'un habitat diversifié où le chauffage au bois reste apprécié. Intervention rapide garantie."
    />
  );
}
