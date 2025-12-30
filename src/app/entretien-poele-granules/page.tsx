import { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Entretien Poêle à Granulés | Nettoyage & Dépannage',
  description: 'Entretien et dépannage de poêles à granulés (pellets) dans l\'Oise et Val-d\'Oise. Nettoyage complet, vérification, réglages. Toutes marques.',
  keywords: ['entretien poêle granulés', 'entretien poêle pellets', 'nettoyage poêle', 'dépannage poêle', 'Beauvais', 'Oise', 'Val-d\'Oise'],
  alternates: {
    canonical: `${siteConfig.urls.website}/entretien-poele-granules`,
  },
};

export default function EntretienPoelePage() {
  return (
    <ServicePageTemplate
      badge="Entretien Poêles"
      title="Entretien poêle à"
      titleHighlight="granulés"
      color="green"
      description="Entretien complet et dépannage de votre poêle à granulés. Nettoyage, vérifications, réglages pour des performances optimales et une durée de vie prolongée."
      intro="Un poêle à granulés nécessite un entretien annuel professionnel en plus du ramonage obligatoire. Cet entretien permet de maintenir les performances de chauffe, de réduire la consommation de pellets et d'éviter les pannes coûteuses. Nous intervenons sur toutes les marques : MCZ, Piazzetta, Palazzetti, Ravelli, Edilkamin, Invicta, Dielle, et bien d'autres."
      features={[
        {
          title: 'Nettoyage complet',
          description: 'Chambre de combustion, creuset, échangeur, ventilateurs et circuits d\'air.',
        },
        {
          title: 'Toutes marques',
          description: 'MCZ, Piazzetta, Palazzetti, Ravelli, Edilkamin, Invicta, Cadel, Dielle, Extraflame...',
        },
        {
          title: 'Diagnostic électronique',
          description: 'Lecture des codes erreur, vérification des paramètres et réglages.',
        },
        {
          title: 'Pièces détachées',
          description: 'Remplacement des pièces d\'usure : joints, bougies, sondes si nécessaire.',
        },
      ]}
      processSteps={[
        'Vérifications préalables : état général, codes erreur, historique d\'utilisation.',
        'Démontage et nettoyage du creuset (brasier) et de la chambre de combustion.',
        'Nettoyage de l\'échangeur thermique et des déflecteurs.',
        'Aspiration du circuit de fumée et du cendrier.',
        'Nettoyage des ventilateurs (extraction et convection).',
        'Vérification des joints de porte et du tiroir à cendres.',
        'Contrôle et nettoyage de la bougie d\'allumage.',
        'Test de fonctionnement complet et ajustement des paramètres si nécessaire.',
        'Ramonage du conduit d\'évacuation des fumées.',
      ]}
      priceItems={[
        { label: 'Ramonage + Entretien poêle à granulés', price: '180 €', note: 'Nettoyage complet + ramonage + vérifications' },
        { label: 'Entretien sans ramonage', price: '100 €', note: 'Si ramonage déjà fait' },
        { label: 'Dépannage / Diagnostic', price: '90 €', note: 'Recherche de panne' },
        { label: 'Remplacement bougie', price: '90 €', note: 'Pièce et main d\'œuvre' },
      ]}
      priceNote="* Tarifs TTC. Professionnels : tarifs HT. Pièces détachées facturées en supplément si remplacement nécessaire."
      faqs={[
        {
          question: 'À quelle fréquence faut-il entretenir un poêle à granulés ?',
          answer: 'Un entretien professionnel annuel est recommandé, idéalement avant la saison de chauffe. En plus, le ramonage du conduit est obligatoire 2 fois par an. Côté utilisateur, videz le cendrier toutes les semaines et nettoyez le creuset régulièrement.',
        },
        {
          question: 'Que puis-je vérifier moi-même avant d\'appeler ?',
          answer: 'Vérifiez que le réservoir contient des granulés, que le poêle est bien branché et le disjoncteur enclenché, que le cendrier n\'est pas plein, et que les arrivées d\'air ne sont pas bouchées. Au-delà, laissez faire un professionnel.',
        },
        {
          question: 'Mon poêle affiche un code erreur, que faire ?',
          answer: 'Notez le code erreur et contactez-nous. Certains codes sont bénins (manque de granulés, cendrier plein), d\'autres nécessitent une intervention. Ne tentez pas de réinitialiser en boucle, cela peut masquer un vrai problème.',
        },
        {
          question: 'Intervenez-vous sur toutes les marques de poêles ?',
          answer: 'Oui, nous intervenons sur toutes les marques du marché : MCZ, Piazzetta, Palazzetti, Ravelli, Edilkamin, Invicta, Cadel, Extraflame, CMG, Jolly Mec, etc. Certaines pièces spécifiques peuvent nécessiter une commande.',
        },
        {
          question: 'Combien de temps dure un entretien de poêle à granulés ?',
          answer: 'Comptez environ 1h à 1h30 pour un entretien complet avec ramonage. Un peu moins si le poêle est bien entretenu au quotidien, un peu plus s\'il est très encrassé.',
        },
      ]}
      relatedServices={[
        {
          name: 'Ramonage',
          slug: 'ramonage',
          description: 'Ramonage obligatoire du conduit de votre poêle à granulés.',
        },
        {
          name: 'Diagnostic',
          slug: 'diagnostic-conduit',
          description: 'Inspection vidéo du conduit en cas de problème de tirage.',
        },
        {
          name: 'Tubage',
          slug: 'tubage-cheminee',
          description: 'Rénovation du conduit pour une meilleure évacuation.',
        },
      ]}
    />
  );
}
