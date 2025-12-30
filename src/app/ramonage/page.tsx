import { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Ramonage de Cheminée & Poêle | Certificat Officiel',
  description: 'Ramonage certifié de cheminées, inserts et poêles à bois dans l\'Oise et Val-d\'Oise. Certificat officiel pour assurance. Intervention sous 24-48h. Devis gratuit.',
  keywords: ['ramonage', 'ramonage cheminée', 'ramonage poêle', 'ramoneur Beauvais', 'certificat ramonage', 'Oise', 'Val-d\'Oise'],
  alternates: {
    canonical: `${siteConfig.urls.website}/ramonage`,
  },
};

export default function RamonagePage() {
  return (
    <ServicePageTemplate
      badge="Ramonage"
      title="Ramonage de cheminée"
      titleHighlight="certifié"
      color="orange"
      description="Service de ramonage professionnel pour cheminées, inserts et poêles à bois. Certificat officiel remis après chaque intervention, valable pour votre assurance."
      intro="Le ramonage est une obligation légale en France. Il permet d'éliminer les dépôts de suie et de créosote qui s'accumulent dans vos conduits, réduisant ainsi les risques d'incendie et d'intoxication au monoxyde de carbone. Notre intervention professionnelle garantit un nettoyage complet et vous assure la délivrance d'un certificat conforme aux exigences de votre assurance."
      features={[
        {
          title: 'Ramonage',
          description: 'Nettoyage complet avec hérisson adapté à votre conduit pour éliminer tous les dépôts.',
        },
        {
          title: 'Certificat officiel',
          description: 'Attestation conforme remise après intervention, indispensable pour votre assurance.',
        },
        {
          title: 'Tous types de conduits',
          description: 'Cheminées ouvertes, inserts, poêles à bois, conduits gainés ou maçonnés.',
        },
        {
          title: 'Vérification complète',
          description: 'Contrôle de l\'état du conduit, du tirage et détection d\'éventuelles anomalies.',
        },
      ]}
      processSteps={[
        'Protection de votre intérieur avec des bâches et draps de protection.',
        'Inspection visuelle du conduit et de l\'appareil de chauffage.',
        'Ramonage mécanique du conduit avec hérisson adapté par le bas.',
        'Aspiration des suies et résidus avec centrale d\'aspiration professionnelle.',
        'Vérification du tirage et de l\'étanchéité du conduit.',
        'Nettoyage complet de la zone de travail.',
        'Remise du certificat de ramonage officiel.',
      ]}
      priceItems={[
        { label: 'Ramonage chaudière à gaz', price: '60 €', note: 'Conduit gaz, certificat inclus' },
        { label: 'Ramonage cheminée ouverte ou insert', price: '70 €', note: 'Foyer ouvert ou insert bois' },
        { label: 'Ramonage poêle à bois', price: '80 €', note: 'Poêle à bûches, certificat inclus' },
        { label: 'Ramonage chaudière à fioul', price: '80 €', note: 'Conduit fioul, certificat inclus' },
        { label: 'Ramonage cheminée Polyflam', price: '90 €', note: 'Cheminée Polyflam, certificat inclus' },
        { label: 'Ramonage conduit difficile', price: '100 €', note: 'Abbaye, château, manoir, accès complexe ou conduit > 10m' },
      ]}
      priceNote="* Tarifs TTC, déplacement inclus (Oise 60 et Val-d'Oise 95). Professionnels : tarifs HT."
      faqs={[
        {
          question: 'Le ramonage est-il obligatoire ?',
          answer: 'Oui, le ramonage est obligatoire en France selon le Règlement Sanitaire Départemental. Pour les conduits bois/charbon, il doit être effectué 2 fois par an dont 1 fois pendant la période de chauffe. Pour le gaz et le fioul, 1 fois par an suffit.',
        },
        {
          question: 'Pourquoi ai-je besoin d\'un certificat de ramonage ?',
          answer: 'Le certificat de ramonage prouve que votre installation a été entretenue par un professionnel. En cas de sinistre (incendie, intoxication au CO), votre assurance l\'exigera. Sans ce document, vous risquez un refus d\'indemnisation.',
        },
        {
          question: 'Combien de temps dure l\'intervention ?',
          answer: 'Un ramonage standard dure entre 30 et 45 minutes. Ce temps peut varier selon l\'accessibilité du conduit et son état d\'encrassement.',
        },
        {
          question: 'Dois-je être présent pendant le ramonage ?',
          answer: 'Oui, votre présence est nécessaire pour nous donner accès à votre logement et pour signer le certificat de ramonage à la fin de l\'intervention.',
        },
        {
          question: 'Quelle est la meilleure période pour faire ramoner ?',
          answer: 'Idéalement avant la saison de chauffe (septembre-octobre) et pendant (janvier-février). Nous intervenons toute l\'année mais les délais sont plus courts hors saison.',
        },
      ]}
      relatedServices={[
        {
          name: 'Débistrage',
          slug: 'debistrage',
          description: 'Élimination du bistre durci dans vos conduits pour un tirage optimal.',
        },
        {
          name: 'Tubage',
          slug: 'tubage-cheminee',
          description: 'Installation d\'un tubage pour sécuriser et optimiser votre conduit.',
        },
        {
          name: 'Entretien Poêles',
          slug: 'entretien-poele-granules',
          description: 'Entretien complet de votre poêle à bois ou à granulés.',
        },
      ]}
    />
  );
}
