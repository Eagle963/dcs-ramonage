import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Persan (95340) | Ramoneur Certifié',
  description: 'Ramoneur à Persan : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Persan', 'ramoneur Persan', 'ramonage 95340', 'ramonage cheminée Persan'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-persan` },
};

export default function RamonagePersanPage() {
  return (
    <LocalPageTemplate
      city="Persan"
      department="Val-d'Oise (95)"
      postalCodes={['95340']}
      nearbyAreas={['Beaumont-sur-Oise', 'Chambly', 'Bernes-sur-Oise', 'Bruyères-sur-Oise', 'Mours']}
      specificContent="Située au nord du Val-d'Oise, Persan est proche de notre zone d'intervention principale. Nous assurons des délais rapides pour le ramonage de vos installations."
    />
  );
}
