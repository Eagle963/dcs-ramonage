'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type pour les FAQ avec support des listes
interface FAQ {
  question: string;
  answer: string;
  list?: string[];
  listNote?: string;
}

const faqs: FAQ[] = [
  {
    question: 'Le ramonage est-il obligatoire ?',
    answer: 'Oui, le ramonage est obligatoire en France. Selon le Règlement Sanitaire Départemental, vous devez faire ramoner vos conduits de fumée au moins une fois par an pour les conduits de gaz, et deux fois par an pour les conduits de bois, charbon ou fioul (dont une fois pendant la période de chauffe). Un certificat de ramonage vous est remis après chaque intervention.',
  },
  {
    question: 'Combien coûte un ramonage ?',
    answer: 'Le prix d\'un ramonage varie selon le type de conduit et l\'accessibilité. En moyenne, comptez entre 60€ et 90€ pour un ramonage standard de cheminée ou poêle à bois. Nous établissons un devis gratuit et personnalisé avant toute intervention. Les tarifs incluent le déplacement et la remise du certificat officiel.',
  },
  {
    question: 'Dans quel délai pouvez-vous intervenir ?',
    answer: 'Les délais varient selon la période :',
    list: [
      'Hors saison de chauffe : délais généralement plus courts',
      'En pleine saison (automne/hiver) : le planning est plus chargé',
      'En cas d\'urgence (panne totale, problème de sécurité), nous faisons notre maximum pour intervenir au plus vite',
    ],
    listNote: 'Le mieux est de prendre votre rendez-vous d\'entretien avant l\'hiver pour éviter l\'urgence.',
  },
  {
    question: 'Que puis-je vérifier moi-même avant de demander un dépannage ?',
    answer: 'Avant de nous appeler, quelques vérifications simples peuvent résoudre le problème :',
    list: [
      'Le réservoir a bien des granulés',
      'Le poêle est branché et le disjoncteur n\'a pas sauté',
      'Le poêle a été vidé de ses cendres régulièrement',
      'L\'arrivée d\'air n\'est pas obstruée',
      'La trappe à cendres est fermée correctement',
    ],
    listNote: 'En revanche, pas de démontage hasardeux : électronique, sondes, pressostats, vis sans fin… c\'est pour le technicien.',
  },
  {
    question: 'Quels sont les signes que mon poêle à granulés a besoin d\'un dépannage ?',
    answer: 'Plusieurs symptômes doivent vous alerter :',
    list: [
      'Le poêle ne démarre plus ou s\'éteint tout seul',
      'Messages d\'erreur ou code défaut à l\'écran',
      'Message type « ATTENTION SERVICE »',
      'Fumées inhabituelles ou odeur anormale',
      'Bruit inhabituel (ventilateur, vis sans fin, extracteur…)',
      'Température qui ne monte plus correctement',
    ],
    listNote: 'Si vous constatez l\'un de ces problèmes, il est préférable de stopper l\'appareil et de nous contacter.',
  },
  {
    question: 'Le certificat de ramonage est-il vraiment nécessaire ?',
    answer: 'Oui, le certificat de ramonage est indispensable. Il prouve que votre installation a été entretenue par un professionnel qualifié. En cas de sinistre (incendie, intoxication au CO), votre assurance exigera ce document. Sans certificat valide, vous risquez un refus d\'indemnisation et votre responsabilité peut être engagée.',
  },
  {
    question: 'Quelle est la différence entre ramonage et débistrage ?',
    answer: 'Le ramonage consiste à nettoyer les suies et dépôts légers dans le conduit à l\'aide d\'un hérisson. Le débistrage est une opération plus lourde qui élimine le bistre, un dépôt durci et goudronné très inflammable. Le débistrage nécessite un équipement spécial et est obligatoire avant un tubage. Nous proposons les deux services.',
  },
  {
    question: 'Quelle est la différence entre un entretien et un dépannage ?',
    answer: 'Ce sont deux prestations distinctes :',
    list: [
      'Entretien/ramonage : nettoyage complet du poêle, ramonage du conduit, contrôles de sécurité, attestation de ramonage',
      'Dépannage : recherche de panne (diagnostic), tests sur les composants, remplacement ou réparation de pièces si nécessaire',
    ],
    listNote: 'Un poêle mal entretenu finit souvent… en dépannage.',
  },
  {
    question: 'Intervenez-vous sur tous les types de poêles ?',
    answer: 'Oui, nous intervenons sur tous les types d\'appareils de chauffage : cheminées ouvertes, inserts, poêles à bois, poêles à granulés (pellets), chaudières bois/fioul/gaz. Nous intervenons sur la plupart des marques courantes (sous réserve de disponibilité des pièces détachées). Lors de votre demande, merci de préciser la marque, le modèle et si possible une photo de la plaque signalétique.',
  },
  {
    question: 'Le message « ATTENTION SERVICE » s\'affiche, est-ce une panne ?',
    answer: 'Dans la majorité des cas, ce message indique que le nombre d\'heures de fonctionnement est atteint et qu\'un entretien complet (ramonage + nettoyage poêle) est nécessaire. Ce n\'est pas forcément une grosse panne, mais sans entretien conforme, nous ne pouvons pas délivrer d\'attestation, et le poêle peut finir par se mettre en sécurité.',
  },
  {
    question: 'Combien coûte un dépannage de poêle à granulés ?',
    answer: 'Le tarif dépend de plusieurs facteurs :',
    list: [
      'Le type de panne (simple réglage, capteur, carte électronique, moteur…)',
      'Le temps passé sur place',
      'Le prix des pièces détachées éventuelles',
    ],
    listNote: 'Il y a un forfait déplacement + diagnostic. Si des pièces sont nécessaires, un devis vous est proposé avant toute intervention supplémentaire.',
  },
  {
    question: 'Comment se déroule une intervention de ramonage ?',
    answer: 'L\'intervention dure environ 30 à 45 minutes. Nous protégeons d\'abord votre intérieur avec des bâches. Ensuite, nous ramonons le conduit par le haut ou le bas selon l\'accessibilité. Nous vérifions le bon tirage et l\'état du conduit. Enfin, nous nettoyons notre zone de travail et vous remettons le certificat de ramonage.',
  },
  {
    question: 'Faut-il être présent pendant l\'intervention ?',
    answer: 'Oui, il est impératif qu\'un adulte soit présent :',
    list: [
      'Pour ouvrir et fermer le logement',
      'Pour répondre aux questions du technicien',
      'Pour valider le diagnostic et le devis si des réparations sont nécessaires',
    ],
  },
  {
    question: 'Que dois-je préparer avant votre venue ?',
    answer: 'Pour gagner du temps et éviter les allers-retours :',
    list: [
      'Libérer l\'accès au poêle et au conduit',
      'Prévoir un point d\'électricité',
      'Noter les messages d\'erreur qui s\'affichent',
      'Garder sous la main la notice du poêle et les anciennes factures si vous les avez',
    ],
  },
  {
    question: 'Fournissez-vous une attestation lors d\'un dépannage ?',
    answer: 'Si l\'intervention inclut un ramonage complet conforme, nous délivrons une attestation de ramonage. Si nous intervenons uniquement pour du dépannage/réglage sans ramonage, aucune attestation ne peut être fournie. Même si vous avez ramoné vous-même, nous ne pouvons pas attester d\'un travail que nous n\'avons pas réalisé.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Schema.org FAQ pour le SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.list 
          ? `${faq.answer} ${faq.list.join('. ')}.${faq.listNote ? ' ' + faq.listNote : ''}`
          : faq.answer,
      },
    })),
  };

  return (
    <section className="section-padding bg-secondary-50/50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-site">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* En-tête */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="badge-primary mb-4">FAQ</span>
              <h2 className="section-title">
                Questions{' '}
                <span className="text-gradient">fréquentes</span>
              </h2>
              <p className="text-secondary-600 mb-6">
                Retrouvez les réponses aux questions les plus courantes sur nos 
                services de ramonage.
              </p>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Une autre question ?</p>
                  <a href="/contact" className="text-primary-700 font-semibold hover:text-primary-700">
                    Contactez-nous →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des FAQ */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={cn(
                    'bg-white rounded-2xl border transition-all duration-300',
                    openIndex === index 
                      ? 'border-primary-200 shadow-soft' 
                      : 'border-secondary-100 hover:border-secondary-200'
                  )}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    aria-expanded={openIndex === index}
                  >
                    <h3 className={cn(
                      'font-display font-semibold text-lg transition-colors',
                      openIndex === index ? 'text-primary-700' : 'text-secondary-900'
                    )}>
                      {faq.question}
                    </h3>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                      openIndex === index 
                        ? 'bg-primary-100 text-primary-700 rotate-180' 
                        : 'bg-secondary-100 text-secondary-600'
                    )}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  
                  <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-[500px]' : 'max-h-0'
                  )}>
                    <div className="px-6 pb-6">
                      <p className="text-secondary-600 leading-relaxed">
                        {faq.answer}
                      </p>
                      
                      {/* Liste à puce si présente */}
                      {faq.list && faq.list.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {faq.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-secondary-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {/* Note après la liste */}
                      {faq.listNote && (
                        <p className="mt-3 text-secondary-500 text-sm italic">
                          {faq.listNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
