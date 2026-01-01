import { Metadata } from 'next';
import { LocalPageTemplate } from '@/components/sections/LocalPageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage à Beauvais (60000) | Ramoneur Certifié',
  description: 'Ramoneur à Beauvais : ramonage de cheminées, poêles à bois et granulés. Certificat officiel, intervention rapide. Devis gratuit ☎ ' + siteConfig.contact.phone,
  keywords: ['ramonage Beauvais', 'ramoneur Beauvais', 'ramonage 60000', 'ramonage cheminée Beauvais'],
  alternates: { canonical: `${siteConfig.urls.website}/ramonage-beauvais` },
};

export default function RamonageBeauvaisPage() {
  return (
    <LocalPageTemplate
      city="Beauvais"
      department="Oise (60)"
      postalCodes={['60000']}
      nearbyAreas={['Tillé', 'Allonne', 'Aux Marais', 'Goincourt', 'Saint-Just-des-Marais', 'Therdonne']}
      specificContent="Préfecture de l'Oise, Beauvais est une ville où de nombreuses habitations sont équipées de cheminées et poêles. Notre équipe intervient à Beauvais et ses environs pour l'entretien de vos conduits de fumée."
    />
  );
}
