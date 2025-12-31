import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Ermont (95120) | Ramoneur Certifié',
  description: 'Ramoneur à Ermont : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Ermont', 'ramoneur Ermont', 'ramonage 95120', 'ramonage cheminée Ermont'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-ermont` },
};

export default function RamonageErmontPage() {
  return (
    <LocalPageTemplate
      city="Ermont"
      department="Val-d'Oise (95)"
      postalCodes={['95120']}
      nearbyAreas={['Eaubonne', 'Sannois', 'Saint-Gratien', 'Franconville', 'Le Plessis-Bouchard']}
      specificContent="Commune bien desservie du Val-d'Oise, Ermont et ses environs comptent de nombreux pavillons équipés de cheminées et poêles. Notre équipe intervient rapidement pour vos besoins de ramonage."
    />
  );
}
