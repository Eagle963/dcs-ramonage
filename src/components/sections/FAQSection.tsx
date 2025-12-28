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
    answer: 'Nous intervenons généralement sous 24 à 48 heures dans l\'Oise (60) et le Val-d\'Oise (95). En cas d\'urgence (problème de tirage, suspicion de fuite), nous faisons notre maximum pour intervenir le jour même. Contactez-nous par téléphone pour les situations urgentes.',
  },
  {
    question: 'Que puis-je vérifier moi-même avant de demander un dépannage ?',
    answer: 'Avant de nous appeler, quelques vérifications simples peuvent résoudre le problème :',
    list: [
      'Il y a bien des granulés dans le réservoir',
      'Le poêle est branché et le disjoncteur n\'a pas sauté',
      'Le poêle a été vidé de ses cendres',
      'Les arrivées d\'air ne sont pas bouchées',
    ],
    listNote: 'Au-delà de ça : on évite de démonter, on laisse faire le technicien.',
  },
  {
    question: 'Le certificat de ramonage est-il vraiment nécessaire ?',
    answer: 'Oui, le certificat de ramonage est indispensable. Il prouve que votre installation a été entretenue par un professionnel qualifié. En cas de sinistre (incendie, intoxication au CO), votre assurance exigera ce document. Sans certificat valide, vous risquez un refus d\'indemnisation et votre responsabilité peut être engagée.',
  },
  {
    question: 'Quelle est la différence entre ramonage et débistrage ?',
    answer: 'Le ramonage consiste à nettoyer les suies et dépôts légers dans le conduit à l\'aide d\'un hérisson. Le débistrage est une opération plus lourde qui élimine le bistre, un dépôt durci et goudronné très inflammable. Le débistrage nécessite un équipement spécial (débistreuse rotative) et est obligatoire avant un tubage. Nous proposons les deux services.',
  },
  {
    question: 'Intervenez-vous sur tous les types de poêles ?',
    answer: 'Oui, nous intervenons sur tous les types d\'appareils de chauffage : cheminées ouvertes, inserts, poêles à bois, poêles à granulés (pellets), chaudières bois/fioul/gaz. Nous assurons également l\'entretien complet des poêles à granulés (nettoyage du brûleur, vérification des joints, etc.).',
  },
  {
    question: 'Proposez-vous des contrats d\'entretien annuel ?',
    answer: 'Oui, nous proposons des contrats d\'entretien qui vous permettent de bénéficier d\'un suivi régulier et de tarifs préférentiels. Nous vous contactons automatiquement avant la période de chauffe pour planifier l\'intervention. C\'est la solution idéale pour ne jamais oublier votre ramonage obligatoire.',
  },
  {
    question: 'Comment se déroule une intervention de ramonage ?',
    answer: 'L\'intervention dure environ 30 à 45 minutes. Nous protégeons d\'abord votre intérieur avec des bâches. Ensuite, nous ramonons le conduit par le haut ou le bas selon l\'accessibilité. Nous vérifions le bon tirage et l\'état du conduit. Enfin, nous nettoyons notre zone de travail et vous remettons le certificat de ramonage.',
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
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Une autre question ?</p>
                  <a href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
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
                      openIndex === index ? 'text-primary-600' : 'text-secondary-900'
                    )}>
                      {faq.question}
                    </h3>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                      openIndex === index 
                        ? 'bg-primary-100 text-primary-600 rotate-180' 
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
