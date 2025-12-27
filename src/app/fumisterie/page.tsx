import { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Fumisterie | Pose & Installation d\'Accessoires',
  description: 'Travaux de fumisterie dans l\'Oise et Val-d\'Oise. Pose de chapeaux, plaques d\'étanchéité, accessoires de cheminée. Artisan qualifié.',
  keywords: ['fumisterie', 'chapeau cheminée', 'plaque étanchéité', 'accessoires cheminée', 'Beauvais', 'Oise', 'Val-d\'Oise'],
  alternates: {
    canonical: `${siteConfig.urls.website}/fumisterie`,
  },
};

export default function FumisteriePage() {
  return (
    <ServicePageTemplate
      badge="Fumisterie"
      title="Travaux de"
      titleHighlight="fumisterie"
      description="Pose et installation d'accessoires pour conduits de fumée : chapeaux, plaques d'étanchéité, aspirateurs statiques, trappes de visite."
      intro="La fumisterie regroupe les travaux de pose et d'installation d'accessoires liés aux conduits de fumée. Que ce soit pour installer un chapeau anti-pluie, remplacer une plaque d'étanchéité ou poser un aspirateur statique pour améliorer le tirage, nous réalisons ces interventions dans les règles de l'art et en conformité avec le DTU 24.1."
      features={[
        {
          title: 'Pose de chapeaux',
          description: 'Installation de chapeaux inox, anti-pluie, anti-refoulement selon vos besoins.',
        },
        {
          title: 'Plaques d\'étanchéité',
          description: 'Pose de plaques pour garantir l\'étanchéité entre le conduit et la toiture.',
        },
        {
          title: 'Aspirateurs statiques',
          description: 'Installation d\'aspirateurs pour améliorer le tirage de votre conduit.',
        },
        {
          title: 'Conformité DTU',
          description: 'Travaux réalisés selon les normes en vigueur.',
        },
      ]}
      processSteps={[
        'Visite technique pour évaluer les travaux et prendre les mesures.',
        'Établissement d\'un devis détaillé.',
        'Intervention de pose par notre technicien qualifié.',
        'Tests de fonctionnement : tirage, étanchéité.',
        'Nettoyage de la zone de travail.',
        'Remise des documents et conseils d\'entretien.',
      ]}
      priceItems={[
        { label: 'Chapeau de cheminée inox', price: 'À partir de 100 €', note: 'Pose uniquement, sans fourniture' },
        { label: 'Plaque d\'étanchéité', price: 'À partir de 100 €', note: 'Pose uniquement, sans fourniture' },
        { label: 'Conduit double paroi / isolé', price: 'Sur devis' },
        { label: 'Traitement de toiture', price: 'Sur devis', note: 'Nettoyage et démoussage' },
      ]}
      priceNote="* Tarifs TTC (pose uniquement). Professionnels : tarifs HT. Fourniture des accessoires en supplément ou par vos soins."
      faqs={[
        {
          question: 'Mon chapeau de cheminée est rouillé, faut-il le changer ?',
          answer: 'Un chapeau rouillé ou percé doit être remplacé. Il protège votre conduit de la pluie et empêche les oiseaux de nicher. Un chapeau inox durera plus longtemps qu\'un chapeau en acier galvanisé.',
        },
        {
          question: 'Qu\'est-ce qu\'un aspirateur de fumée ?',
          answer: 'C\'est un chapeau spécial qui utilise le vent pour créer une dépression et améliorer le tirage. Il est recommandé pour les conduits avec un tirage insuffisant, notamment dans les zones venteuses ou pour les conduits courts.',
        },
        {
          question: 'Puis-je fournir moi-même les accessoires ?',
          answer: 'Oui, vous pouvez acheter vos accessoires (chapeau, plaque, etc.) et nous les posons. Nous pouvons également vous conseiller sur le choix du matériel adapté à votre installation.',
        },
        {
          question: 'Intervenez-vous en hauteur ?',
          answer: 'Oui, nous sommes équipés pour intervenir en toiture en toute sécurité. L\'accès au toit doit cependant être possible (échelle, velux, trappe).',
        },
      ]}
      relatedServices={[
        {
          name: 'Tubage',
          slug: 'tubage-cheminee',
          description: 'Rénovation de l\'intérieur du conduit avec un tubage inox.',
        },
        {
          name: 'Diagnostic',
          slug: 'diagnostic-conduit',
          description: 'Inspection pour évaluer l\'état de votre installation.',
        },
        {
          name: 'Ramonage',
          slug: 'ramonage',
          description: 'Entretien régulier de votre conduit.',
        },
      ]}
    />
  );
}
