import { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Débistrage de Cheminée | Élimination du Bistre',
  description: 'Débistrage professionnel de conduits de cheminée dans l\'Oise et Val-d\'Oise. Élimination du bistre durci avec équipement spécialisé. Intervention rapide.',
  keywords: ['débistrage', 'bistre cheminée', 'débistrage conduit', 'débistrage mécanique', 'ramoneur Beauvais', 'Oise', 'Val-d\'Oise'],
  alternates: {
    canonical: `${siteConfig.urls.website}/debistrage`,
  },
};

export default function DebistragePage() {
  return (
    <ServicePageTemplate
      badge="Débistrage"
      title="Débistrage de"
      titleHighlight="cheminée"
      description="Élimination professionnelle du bistre dans vos conduits avec équipement spécialisé. Le bistre est un dépôt dangereux qui nécessite une intervention experte."
      intro="Le bistre est un dépôt noir et goudronné qui se forme dans les conduits de cheminée lorsque la combustion est incomplète ou que le bois est trop humide. Contrairement à la suie, le bistre est dur, inflammable et ne peut pas être éliminé par un simple ramonage. Notre équipement spécialisé pour le débistrage permet de retirer ces dépôts dangereux et de restaurer un tirage optimal."
      features={[
        {
          title: 'Débistrage mécanique',
          description: 'Équipement spécialisé pour éliminer le bistre le plus tenace.',
        },
        {
          title: 'Diagnostic préalable',
          description: 'Inspection du conduit pour évaluer l\'épaisseur du bistre et adapter l\'intervention.',
        },
        {
          title: 'Sécurité renforcée',
          description: 'Élimination d\'un dépôt hautement inflammable qui représente un risque d\'incendie.',
        },
        {
          title: 'Préparation au tubage',
          description: 'Le débistrage est obligatoire avant la pose d\'un tubage pour garantir l\'adhérence.',
        },
      ]}
      processSteps={[
        'Inspection vidéo ou visuelle du conduit pour évaluer le niveau d\'encrassement.',
        'Protection complète de votre intérieur (bâches, aspirateur branché en continu).',
        'Débistrage mécanique du conduit avec équipement spécialisé.',
        'Plusieurs passages si nécessaire jusqu\'à élimination complète du bistre.',
        'Aspiration de tous les résidus tombés.',
        'Ramonage de finition pour un conduit parfaitement propre.',
        'Vérification du tirage et remise du certificat.',
      ]}
      priceItems={[
        { label: 'Débistrage cheminée', price: 'Sur devis', note: 'Tarif au mètre selon épaisseur du bistre' },
      ]}
      priceNote="* Tarif au mètre selon épaisseur du bistre et longueur du conduit. Professionnels : tarifs HT. Devis gratuit sur place."
      faqs={[
        {
          question: 'Comment savoir si j\'ai du bistre dans ma cheminée ?',
          answer: 'Les signes révélateurs sont : des dépôts noirs et brillants sur les parois visibles, un mauvais tirage, des odeurs désagréables, ou des traces de goudron autour de l\'insert. En cas de doute, nous pouvons réaliser un diagnostic.',
        },
        {
          question: 'Quelle est la différence entre ramonage et débistrage ?',
          answer: 'Le ramonage élimine la suie (dépôt léger et poudreux) avec un hérisson. Le débistrage élimine le bistre (dépôt dur et goudronné) avec un équipement spécialisé pour débistrage mécanique. Le débistrage est plus long et plus coûteux car il nécessite un équipement spécial.',
        },
        {
          question: 'Le débistrage est-il obligatoire avant un tubage ?',
          answer: 'Oui, absolument. Le tubage ne peut pas adhérer correctement sur une paroi couverte de bistre. De plus, le bistre restant pourrait continuer à chauffer et détériorer le tubage. Tout professionnel sérieux exigera un débistrage préalable.',
        },
        {
          question: 'Combien de temps dure un débistrage ?',
          answer: 'Comptez entre 1h30 et 3h selon l\'état du conduit. C\'est plus long qu\'un ramonage classique car plusieurs passages sont souvent nécessaires.',
        },
        {
          question: 'Comment éviter la formation de bistre ?',
          answer: 'Utilisez du bois bien sec (moins de 20% d\'humidité), évitez les feux couvants, assurez une bonne arrivée d\'air et faites ramoner régulièrement. Un bon tirage et une combustion vive limitent la formation de bistre.',
        },
      ]}
      relatedServices={[
        {
          name: 'Ramonage',
          slug: 'ramonage',
          description: 'Ramonage certifié de vos conduits avec certificat officiel.',
        },
        {
          name: 'Tubage',
          slug: 'tubage-cheminee',
          description: 'Installation d\'un tubage après débistrage pour un conduit comme neuf.',
        },
        {
          name: 'Diagnostic',
          slug: 'diagnostic-conduit',
          description: 'Inspection vidéo pour évaluer l\'état de votre conduit.',
        },
      ]}
    />
  );
}
