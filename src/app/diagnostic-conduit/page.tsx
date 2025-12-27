import { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Diagnostic Conduit de Cheminée | Inspection Vidéo',
  description: 'Diagnostic et inspection vidéo de conduits de cheminée dans l\'Oise et Val-d\'Oise. Détection de fissures, bistre, obstructions. Rapport détaillé.',
  keywords: ['diagnostic conduit', 'inspection cheminée', 'caméra cheminée', 'inspection vidéo', 'Beauvais', 'Oise', 'Val-d\'Oise'],
  alternates: {
    canonical: `${siteConfig.urls.website}/diagnostic-conduit`,
  },
};

export default function DiagnosticPage() {
  return (
    <ServicePageTemplate
      badge="Diagnostic"
      title="Diagnostic de"
      titleHighlight="conduit"
      description="Inspection complète de vos conduits de fumée par caméra endoscopique. Identifiez les problèmes avant qu'ils ne deviennent critiques."
      intro="Un diagnostic de conduit permet d'évaluer précisément l'état de votre cheminée : fissures, joints défaillants, dépôts de bistre, obstructions ou défauts de construction. Cette inspection est recommandée avant l'achat d'une maison avec cheminée, avant l'installation d'un insert, ou en cas de problème de tirage. Notre caméra endoscopique filme l'intérieur du conduit et vous recevez un rapport détaillé."
      features={[
        {
          title: 'Caméra endoscopique',
          description: 'Inspection vidéo haute définition de l\'intérieur du conduit.',
        },
        {
          title: 'Rapport détaillé',
          description: 'Document avec photos/vidéos des anomalies détectées et recommandations.',
        },
        {
          title: 'Test d\'étanchéité',
          description: 'Vérification de l\'étanchéité du conduit par test de fumée.',
        },
        {
          title: 'Conseils personnalisés',
          description: 'Recommandations adaptées : ramonage, débistrage, tubage ou réparation.',
        },
      ]}
      processSteps={[
        'Échange préalable sur l\'historique du conduit et les problèmes constatés.',
        'Inspection visuelle extérieure : souche, solin, chapeau de cheminée.',
        'Introduction de la caméra endoscopique dans le conduit.',
        'Inspection complète du conduit de bas en haut (ou inversement).',
        'Enregistrement vidéo et capture d\'images des zones problématiques.',
        'Test de tirage et/ou test fumigène si nécessaire.',
        'Analyse des résultats et explication sur place.',
        'Remise d\'un rapport écrit avec photos et recommandations.',
      ]}
      priceItems={[
        { label: 'Diagnostic vidéo complet', price: '200 €', note: 'Inspection caméra + rapport détaillé' },
        { label: 'Diagnostic simple', price: '80 €', note: 'Inspection visuelle + test tirage' },
        { label: 'Test d\'étanchéité fumigène', price: '130 €', note: 'Vérification des fuites du conduit' },
      ]}
      priceNote="* Tarifs TTC. Professionnels : tarifs HT. Le coût du diagnostic est déduit si vous réalisez les travaux avec nous."
      faqs={[
        {
          question: 'Quand faut-il faire diagnostiquer son conduit ?',
          answer: 'Un diagnostic est recommandé avant l\'achat d\'une maison avec cheminée, avant l\'installation d\'un insert ou poêle, en cas de problème de tirage, après un feu de cheminée, ou si votre conduit a plus de 30 ans et n\'a jamais été inspecté.',
        },
        {
          question: 'Que peut révéler un diagnostic de conduit ?',
          answer: 'Le diagnostic peut révéler : des fissures ou des joints dégradés, une accumulation de bistre, des obstructions (nids d\'oiseaux, débris), des défauts de construction, une usure du tubage existant, ou des problèmes d\'étanchéité.',
        },
        {
          question: 'Combien de temps dure un diagnostic ?',
          answer: 'Comptez entre 45 minutes et 1h30 selon la longueur du conduit et les anomalies rencontrées. Le temps inclut l\'inspection, les tests et l\'explication des résultats.',
        },
        {
          question: 'Le diagnostic est-il obligatoire ?',
          answer: 'Non, le diagnostic n\'est pas obligatoire légalement. Cependant, il est vivement recommandé dans certaines situations et peut être exigé par votre assurance après un sinistre ou avant une mise aux normes.',
        },
        {
          question: 'Recevrai-je un document écrit ?',
          answer: 'Oui, vous recevez un rapport détaillé comprenant : les caractéristiques du conduit, les photos/captures des anomalies, notre évaluation de l\'état général, et nos recommandations de travaux avec estimation.',
        },
      ]}
      relatedServices={[
        {
          name: 'Débistrage',
          slug: 'debistrage',
          description: 'Solution si le diagnostic révèle une accumulation de bistre.',
        },
        {
          name: 'Tubage',
          slug: 'tubage-cheminee',
          description: 'Rénovation du conduit si des fissures ou défauts sont détectés.',
        },
        {
          name: 'Fumisterie',
          slug: 'fumisterie',
          description: 'Travaux de réparation ou création de conduit.',
        },
      ]}
    />
  );
}
