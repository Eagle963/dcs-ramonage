import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Clermont (60600) | Ramoneur Certifié',
  description: 'Ramoneur à Clermont : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Clermont', 'ramoneur Clermont', 'ramonage 60600', 'ramonage cheminée Clermont Oise'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-clermont` },
};

export default function RamonageClermontPage() {
  return (
    <LocalPageTemplate
      city="Clermont"
      department="Oise (60)"
      postalCodes={['60600']}
      nearbyAreas={['Breuil-le-Sec', 'Fitz-James', 'Agnetz', 'Nointel', 'Breuil-le-Vert']}
      specificContent="Sous-préfecture de l'Oise, Clermont et ses environs comptent de nombreuses maisons individuelles avec chauffage au bois. Nous intervenons rapidement pour le ramonage de vos conduits."
    />
  );
}
