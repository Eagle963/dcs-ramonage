import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Chantilly (60500) | Ramoneur Certifié',
  description: 'Ramoneur à Chantilly : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Chantilly', 'ramoneur Chantilly', 'ramonage 60500', 'ramonage cheminée Chantilly'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-chantilly` },
};

export default function RamonageChantillyPage() {
  return (
    <LocalPageTemplate
      city="Chantilly"
      department="Oise (60)"
      postalCodes={['60500']}
      nearbyAreas={['Gouvieux', 'Lamorlaye', 'Apremont', 'Vineuil-Saint-Firmin', 'Avilly-Saint-Léonard']}
      specificContent="Ville prestigieuse connue pour son château, Chantilly compte de nombreuses demeures avec cheminées traditionnelles. Notre expertise nous permet d'intervenir sur tous types de conduits, y compris les plus anciens."
    />
  );
}
