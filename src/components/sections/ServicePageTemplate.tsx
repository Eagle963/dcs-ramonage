'use client';

import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Shield, 
  FileCheck, 
  Phone,
  Calendar,
  ArrowRight,
  Star,
  ChevronRight,
  Flame,
  Hammer,
  CircleDot,
  Sparkles,
  Search,
  Wrench,
  Droplets,
  Settings,
  LucideIcon
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

// Map des icônes par nom de service
const serviceIcons: { [key: string]: LucideIcon } = {
  'Ramonage': Flame,
  'Débistrage': Hammer,
  'Tubage': CircleDot,
  'Entretien Poêles': Settings,
  'Entretien poêles à granulés': Settings,
  'Entretien poêle à granulés': Settings,
  'Diagnostic conduit': Search,
  'Diagnostic': Search,
  'Fumisterie': Wrench,
  'Nettoyage & démoussage': Droplets,
  'Nettoyage et démoussage': Droplets,
};

// Types
interface ServiceFeature {
  title: string;
  description: string;
}

interface PriceItem {
  label: string;
  price: string;
  note?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RealisationItem {
  title: string;
  description?: string;
  image1?: string;
  image2?: string;
  isBeforeAfter?: boolean; // true = avant/après, false = 2 photos simples
  videoUrl?: string; // URL YouTube ou autre
}

interface ServicePageProps {
  // Header
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  color?: 'orange' | 'red' | 'blue' | 'green' | 'purple' | 'amber' | 'teal';
  
  // Contenu principal
  intro: string;
  features: ServiceFeature[];
  
  // Processus
  processSteps: string[];
  
  // Tarifs
  priceItems: PriceItem[];
  priceNote?: string;
  
  // FAQ
  faqs: FAQItem[];
  
  // Réalisations (optionnel)
  realisations?: RealisationItem[];
  
  // SEO
  relatedServices: {
    name: string;
    slug: string;
    description: string;
  }[];
}

export function ServicePageTemplate({
  badge,
  title,
  titleHighlight,
  description,
  color = 'orange',
  intro,
  features,
  processSteps,
  priceItems,
  priceNote,
  faqs,
  realisations,
  relatedServices,
}: ServicePageProps) {
  // Classes de couleur par service
  const colorClasses = {
    orange: {
      blob1: 'bg-orange-500/10',
      blob2: 'bg-orange-300/10',
      icon: 'text-orange-500',
      badge: 'bg-orange-100 text-orange-700',
    },
    red: {
      blob1: 'bg-red-500/10',
      blob2: 'bg-red-300/10',
      icon: 'text-red-500',
      badge: 'bg-red-100 text-red-700',
    },
    blue: {
      blob1: 'bg-blue-500/10',
      blob2: 'bg-blue-300/10',
      icon: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-700',
    },
    green: {
      blob1: 'bg-green-500/10',
      blob2: 'bg-green-300/10',
      icon: 'text-green-500',
      badge: 'bg-green-100 text-green-700',
    },
    purple: {
      blob1: 'bg-purple-500/10',
      blob2: 'bg-purple-300/10',
      icon: 'text-purple-500',
      badge: 'bg-purple-100 text-purple-700',
    },
    amber: {
      blob1: 'bg-amber-500/10',
      blob2: 'bg-amber-300/10',
      icon: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-700',
    },
    teal: {
      blob1: 'bg-teal-500/10',
      blob2: 'bg-teal-300/10',
      icon: 'text-teal-500',
      badge: 'bg-teal-100 text-teal-700',
    },
  };

  const colors = colorClasses[color];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className={`absolute top-20 right-0 w-96 h-96 ${colors.blob1} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 left-0 w-80 h-80 ${colors.blob2} rounded-full blur-3xl`} />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-start gap-2 mb-4">
              {serviceIcons[badge] && (() => {
                const IconComponent = serviceIcons[badge];
                return <IconComponent className={`w-5 h-5 ${colors.icon}`} />;
              })()}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                {badge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6 text-left">
              {title}{' '}
              <span className="text-gradient">{titleHighlight}</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 text-left">
              {description.split('. ').map((sentence, index, array) => (
                <span key={index}>
                  {sentence}{index < array.length - 1 ? '.' : ''}
                  {index < array.length - 1 && <br />}
                </span>
              ))}
            </p>
            
            {/* CTA */}
            <div className="flex flex-col items-start gap-3">
              <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
                <ArrowRight className="w-5 h-5" />
              </a>
              <div className="flex items-center gap-2 text-secondary-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Intervention sous 24-48h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + Features */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Intro */}
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6 text-left">
                Pourquoi faire appel à un professionnel ?
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-6 text-left">
                {intro.split('. ').map((sentence, index, array) => (
                  <span key={index}>
                    {sentence}{index < array.length - 1 ? '.' : ''}
                    {index < array.length - 1 && <br />}
                  </span>
                ))}
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Shield className="w-5 h-5 text-primary-500" />
                  <span>Artisan certifié</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <FileCheck className="w-5 h-5 text-primary-500" />
                  <span>Certificat officiel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <GoogleIcon className="w-5 h-5" />
                  <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
                  <span>5/5</span>
                </div>
              </div>
            </div>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white border border-secondary-100 
                             hover:border-primary-200 hover:shadow-soft transition-all"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary-500 mb-3" />
                  <h3 className="font-semibold text-secondary-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-primary mb-4">Comment ça marche</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
              Le déroulement de l'intervention
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-5 rounded-2xl bg-white border border-secondary-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-700">{index + 1}</span>
                  </div>
                  <p className="text-secondary-700 pt-2">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="badge-primary mb-4">Tarifs transparents</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
                Nos prix tout compris
              </h2>
              <p className="text-secondary-600 mb-6">
                Pas de surprise ! Nos tarifs incluent le déplacement, l'intervention 
                et la remise du certificat officiel.
              </p>
              
              <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md inline-flex">
                <Calendar className="w-4 h-4" />
                Demander un devis personnalisé
              </a>
            </div>

            <div className="bg-white rounded-3xl border border-secondary-100 shadow-soft overflow-hidden">
              <div className="p-6 bg-secondary-900 text-white">
                <h3 className="font-display font-bold text-lg">Grille tarifaire indicative</h3>
                <p className="text-secondary-300 text-sm">Tarifs TTC, déplacement inclus</p>
              </div>
              
              <div className="p-6 space-y-4">
                {priceItems.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center justify-between gap-4 py-3',
                      index !== priceItems.length - 1 && 'border-b border-secondary-100'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-secondary-900">{item.label}</span>
                      {item.note && (
                        <span className="block text-xs text-secondary-500">{item.note}</span>
                      )}
                    </div>
                    <span className="font-bold text-primary-700 text-lg flex-shrink-0 whitespace-nowrap">{item.price}</span>
                  </div>
                ))}
              </div>
              
              {priceNote && (
                <div className="px-6 pb-6">
                  <p className="text-xs text-secondary-500 bg-secondary-50 p-3 rounded-xl">
                    {priceNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Réalisations Section (si fournie) */}
      {realisations && realisations.length > 0 && (() => {
        // Séparer photos et vidéos
        const photoRealisations = realisations.filter(r => !r.videoUrl && (r.image1 || r.image2));
        const videoRealisations = realisations.filter(r => r.videoUrl);
        
        // Classes pour centrer selon le nombre
        const getGridClasses = (count: number) => {
          if (count === 1) return 'flex justify-center';
          if (count === 2) return 'flex justify-center gap-6 flex-wrap';
          return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
        };
        
        const getItemClasses = (count: number) => {
          if (count === 1) return 'w-full max-w-md';
          if (count === 2) return 'w-full max-w-md';
          return '';
        };

        return (
          <section className="section-padding">
            <div className="container-site">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="badge-primary mb-4">Nos réalisations</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
                  {photoRealisations.some(r => r.isBeforeAfter) ? 'Avant / Après' : 'Nos interventions'}
                </h2>
                <p className="text-secondary-600 mt-4">
                  Découvrez quelques exemples de nos interventions
                </p>
              </div>

              {/* Photos - max 3 blocs */}
              {photoRealisations.length > 0 && (
                <div className={getGridClasses(Math.min(photoRealisations.length, 3))}>
                  {photoRealisations.slice(0, 3).map((realisation, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-2xl border border-secondary-100 overflow-hidden shadow-soft ${getItemClasses(Math.min(photoRealisations.length, 3))}`}
                    >
                      {/* 2 images */}
                      {realisation.image1 && realisation.image2 && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="relative aspect-square bg-secondary-100">
                            <img
                              src={realisation.image1}
                              alt={realisation.isBeforeAfter ? `Avant - ${realisation.title}` : realisation.title}
                              className="w-full h-full object-cover"
                            />
                            {realisation.isBeforeAfter && (
                              <span className="absolute bottom-2 left-2 bg-secondary-900/80 text-white text-xs px-2 py-1 rounded">
                                Avant
                              </span>
                            )}
                          </div>
                          <div className="relative aspect-square bg-secondary-100">
                            <img
                              src={realisation.image2}
                              alt={realisation.isBeforeAfter ? `Après - ${realisation.title}` : realisation.title}
                              className="w-full h-full object-cover"
                            />
                            {realisation.isBeforeAfter && (
                              <span className="absolute bottom-2 right-2 bg-primary-500/90 text-white text-xs px-2 py-1 rounded">
                                Après
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 1 seule image */}
                      {realisation.image1 && !realisation.image2 && (
                        <div className="relative aspect-video bg-secondary-100">
                          <img
                            src={realisation.image1}
                            alt={realisation.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Texte */}
                      <div className="p-4">
                        <h3 className="font-semibold text-secondary-900 mb-1">
                          {realisation.title}
                        </h3>
                        {realisation.description && (
                          <p className="text-sm text-secondary-600">
                            {realisation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vidéos - séparées, max 3 */}
              {videoRealisations.length > 0 && (
                <div className={`${photoRealisations.length > 0 ? 'mt-8' : ''} ${getGridClasses(Math.min(videoRealisations.length, 3))}`}>
                  {videoRealisations.slice(0, 3).map((realisation, index) => (
                    <div
                      key={`video-${index}`}
                      className={`bg-white rounded-2xl border border-secondary-100 overflow-hidden shadow-soft ${getItemClasses(Math.min(videoRealisations.length, 3))}`}
                    >
                      <div className={realisation.videoUrl?.includes('/shorts/') ? 'aspect-[9/16] max-h-[400px] mx-auto' : 'aspect-video'}>
                        <iframe
                          src={realisation.videoUrl
                            ?.replace('watch?v=', 'embed/')
                            .replace('/shorts/', '/embed/')
                          }
                          title={realisation.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-secondary-900 mb-1">
                          {realisation.title}
                        </h3>
                        {realisation.description && (
                          <p className="text-sm text-secondary-600">
                            {realisation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* FAQ Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-primary mb-4">FAQ</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
              Questions fréquentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border border-secondary-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="font-semibold text-secondary-900 pr-4">{faq.question}</h3>
                  <ChevronRight className="w-5 h-5 text-secondary-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-secondary-600">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
              Services complémentaires
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                className="group p-6 rounded-2xl bg-white border border-secondary-100 
                           hover:border-primary-200 hover:shadow-soft transition-all"
              >
                <h3 className="font-display font-semibold text-secondary-900 mb-2 
                               group-hover:text-primary-700 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-primary-700 text-sm font-medium">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Besoin d'un {badge.toLowerCase()} ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Réservez votre créneau en ligne.
              <br />
              Intervention rapide sous 24-48h dans l'Oise et le Val-d'Oise.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="text-secondary-400 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Urgences : {siteConfig.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
