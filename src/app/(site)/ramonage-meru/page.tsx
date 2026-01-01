import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Méru (60110) | Ramoneur Certifié',
  description: 'Ramoneur à Méru : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Méru', 'ramoneur Méru', 'ramonage 60110', 'ramonage cheminée Méru'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-meru` },
};

export default function RamonageMeruPage() {
  return (
    <LocalPageTemplate
      city="Méru"
      department="Oise (60)"
      postalCodes={['60110']}
      nearbyAreas={['Esches', 'Lormaison', 'Amblainville', 'Hénonville', 'Ivry-le-Temple']}
      specificContent="Située dans le sud de l'Oise, Méru est une commune où le chauffage au bois reste très répandu. Notre équipe intervient rapidement pour tous vos besoins de ramonage."
    />
  );
}
