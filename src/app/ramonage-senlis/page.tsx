import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Senlis (60300) | Ramoneur Certifié',
  description: 'Ramoneur à Senlis : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Senlis', 'ramoneur Senlis', 'ramonage 60300', 'ramonage cheminée Senlis'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-senlis` },
};

export default function RamonageSenlisPage() {
  return (
    <LocalPageTemplate
      city="Senlis"
      department="Oise (60)"
      postalCodes={['60300']}
      nearbyAreas={['Courteuil', 'Chamant', 'Aumont-en-Halatte', 'Fleurines', 'Pontarmé']}
      specificContent="Cité médiévale au riche patrimoine, Senlis possède de nombreuses maisons anciennes avec cheminées d'époque. Nous sommes habitués à intervenir sur ce type de conduits avec le plus grand soin."
    />
  );
}
