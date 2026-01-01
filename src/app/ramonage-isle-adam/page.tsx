import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à L\'Isle-Adam (95290) | Ramoneur Certifié',
  description: 'Ramoneur à L\'Isle-Adam : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage L\'Isle-Adam', 'ramoneur L\'Isle-Adam', 'ramonage 95290', 'ramonage cheminée L\'Isle-Adam'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-isle-adam` },
};

export default function RamonageIsleAdamPage() {
  return (
    <LocalPageTemplate
      city="L'Isle-Adam"
      department="Val-d'Oise (95)"
      postalCodes={['95290']}
      nearbyAreas={['Parmain', 'Presles', 'Nerville-la-Forêt', 'Mours', 'Butry-sur-Oise']}
      specificContent="Station touristique au bord de l'Oise, L'Isle-Adam et ses environs comptent de nombreuses résidences avec cheminées. Nous intervenons pour l'entretien de tous types de conduits."
    />
  );
}
