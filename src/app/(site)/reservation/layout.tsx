import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Réservation en ligne | DCS Ramonage',
  description: 'Prenez rendez-vous en ligne pour votre ramonage, entretien de poêle ou débistrage. Intervention rapide dans l\'Oise (60) et le Val-d\'Oise (95).',
  keywords: ['réservation ramonage', 'rendez-vous ramoneur', 'prendre rdv ramonage', 'ramonage en ligne'],
  alternates: { canonical: `${siteConfig.urls.website}/reservation` },
};

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
