import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Zones d\'intervention | Ramonage Oise et Val-d\'Oise',
  description: 'DCS Ramonage intervient dans l\'Oise (60) et le Val-d\'Oise (95) : Beauvais, Creil, Chantilly, Senlis, Cergy, Pontoise, Argenteuil.',
  keywords: ['ramonage Oise', 'ramonage Val-d\'Oise', 'ramoneur 60', 'ramoneur 95', 'zone intervention ramonage'],
  alternates: { canonical: `${siteConfig.urls.website}/zones-intervention` },
};

export default function ZonesInterventionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
