import { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Tubage de Cheminée | Installation & Rénovation',
  description: 'Installation et rénovation de tubage de cheminée dans l\'Oise et Val-d\'Oise. Tubage inox rigide ou flexible aux normes. Devis gratuit, intervention rapide.',
  keywords: ['tubage cheminée', 'tubage inox', 'gainer cheminée', 'rénovation conduit', 'tubage Beauvais', 'Oise', 'Val-d\'Oise'],
  alternates: {
    canonical: `${siteConfig.urls.website}/tubage-cheminee`,
  },
};

export default function TubagePage() {
  return (
    <ServicePageTemplate
      badge="Tubage"
      title="Tubage de cheminée"
      titleHighlight="aux normes"
      color="blue"
      description="Installation et rénovation de tubage inox pour sécuriser et optimiser vos conduits de fumée. Solution durable pour cheminées, inserts et poêles."
      intro="Le tubage consiste à insérer un conduit en inox à l'intérieur de votre cheminée existante. Cette technique permet de rénover un conduit vétuste, d'améliorer le tirage, de réduire les risques d'incendie et de condensation. Le tubage est souvent obligatoire lors de l'installation d'un insert ou d'un poêle pour garantir la conformité aux normes en vigueur."
      features={[
        {
          title: 'Tubage inox double peau',
          description: 'Inox de qualité supérieure, résistant à la corrosion et aux hautes températures.',
        },
        {
          title: 'Rigide ou flexible',
          description: 'Adaptation à la configuration de votre conduit : droit, avec coudes ou désaxé.',
        },
        {
          title: 'Conforme DTU 24.1',
          description: 'Installation respectant les normes en vigueur avec certificat de conformité.',
        },
        {
          title: 'Étude personnalisée',
          description: 'Analyse de votre équipement et environnement pour la solution optimale.',
        },
      ]}
      processSteps={[
        'Visite technique pour mesurer le conduit et évaluer les travaux nécessaires.',
        'Débistrage du conduit si présence de bistre (obligatoire avant tubage).',
        'Passage d\'un test de fumée pour vérifier l\'étanchéité initiale.',
        'Introduction du tubage depuis le haut de la cheminée.',
        'Raccordement aux extrémités (plaque d\'étanchéité, té de purge, etc.).',
        'Isolation du conduit si nécessaire (laine de roche).',
        'Test de tirage et vérification de l\'étanchéité finale.',
        'Remise du certificat de conformité et des documents de garantie.',
      ]}
      priceItems={[
        { label: 'Tubage flexible ou rigide', price: 'Sur devis', note: 'En fonction de l\'équipement et de l\'environnement' },
        { label: 'Conduit double paroi / isolé', price: 'Sur devis', note: 'Installation complète avec sortie toiture' },
        { label: 'Chapeau de cheminée inox', price: 'À partir de 100 €', note: 'Pose uniquement, fourniture non incluse' },
        { label: 'Plaque d\'étanchéité', price: 'À partir de 100 €', note: 'Pose uniquement, fourniture non incluse' },
      ]}
      priceNote="* Tarifs TTC. Professionnels : tarifs HT. Le tubage nécessite une étude préalable. Devis gratuit."
      faqs={[
        {
          question: 'Quand faut-il tuber une cheminée ?',
          answer: 'Le tubage est recommandé ou obligatoire dans plusieurs cas : conduit fissuré ou poreux, installation d\'un insert ou poêle, mauvais tirage, problèmes de condensation, ou mise aux normes pour l\'assurance. Un diagnostic permet de déterminer si le tubage est nécessaire.',
        },
        {
          question: 'Quelle est la différence entre tubage rigide et flexible ?',
          answer: 'Le tubage rigide (éléments emboîtés) offre une meilleure performance et durabilité, idéal pour les conduits droits. Le tubage flexible (gaine annelée) s\'adapte aux conduits avec coudes ou désaxés. Nous vous conseillerons la solution adaptée à votre configuration.',
        },
        {
          question: 'Combien de temps dure l\'installation d\'un tubage ?',
          answer: 'Comptez une demi-journée à une journée complète selon la complexité. Si un débistrage est nécessaire au préalable, prévoyez une journée supplémentaire.',
        },
        {
          question: 'Le tubage nécessite-t-il un entretien particulier ?',
          answer: 'Un conduit tubé doit être ramoné comme un conduit classique : 2 fois par an pour le bois. L\'avantage est que le ramonage est plus facile et plus efficace sur un tubage lisse en inox.',
        },
        {
          question: 'Peut-on tuber soi-même sa cheminée ?',
          answer: 'Techniquement possible, mais fortement déconseillé. Une mauvaise installation peut provoquer des incendies ou des intoxications au CO. De plus, seule une pose par un professionnel donne droit à la garantie et à la couverture par l\'assurance.',
        },
      ]}
      relatedServices={[
        {
          name: 'Débistrage',
          slug: 'debistrage',
          description: 'Préparation obligatoire du conduit avant la pose du tubage.',
        },
        {
          name: 'Ramonage',
          slug: 'ramonage',
          description: 'Entretien annuel de votre conduit tubé.',
        },
        {
          name: 'Fumisterie',
          slug: 'fumisterie',
          description: 'Création de conduit ou travaux de rénovation importants.',
        },
      ]}
    />
  );
}
