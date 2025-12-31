import { Clock, FileCheck, FileText, Award, Shield, Wrench, Phone, ThumbsUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

const benefits = [
  {
    icon: Clock,
    title: 'Intervention Rapide',
    description: 'Disponible sous 24 à 48h dans l\'Oise et le Val-d\'Oise. Urgences traitées en priorité.',
    color: 'primary',
  },
  {
    icon: FileCheck,
    title: 'Certificat Officiel',
    description: 'Attestation de ramonage conforme délivrée après chaque intervention pour votre assurance.',
    color: 'success',
  },
  {
    icon: Award,
    title: 'Artisan Qualifié',
    description: 'Formation professionnelle et expérience terrain. Équipement professionnel de qualité.',
    color: 'warning',
  },
  {
    icon: FileText,
    title: 'Devis Gratuit',
    description: 'Estimation claire et détaillée sans engagement. Tarifs transparents et compétitifs.',
    color: 'accent',
  },
  {
    icon: Shield,
    title: 'Assurance Décennale',
    description: 'Couverture complète pour tous nos travaux. Intervention en toute sérénité.',
    color: 'primary',
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction Garantie',
    description: '100% de clients satisfaits. Note de 5/5 sur Google avec plus de 50 avis.',
    color: 'success',
  },
];

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary-700',
    gradient: 'from-primary-500 to-primary-600',
  },
  success: {
    bg: 'bg-success-100',
    icon: 'text-success-600',
    gradient: 'from-success-500 to-success-600',
  },
  warning: {
    bg: 'bg-warning-100',
    icon: 'text-warning-600',
    gradient: 'from-warning-500 to-warning-600',
  },
  accent: {
    bg: 'bg-accent-100',
    icon: 'text-accent-600',
    gradient: 'from-accent-500 to-accent-600',
  },
};

export function BenefitsSection() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-site">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="badge-primary mb-4">Pourquoi nous choisir</span>
          <h2 className="section-title">
            L&apos;expertise au service de{' '}
            <span className="text-gradient">votre sécurité</span>
          </h2>
          <p className="section-subtitle mx-auto">
            DCS Ramonage s&apos;engage à vous offrir un service de qualité, 
            rapide et professionnel pour tous vos besoins en ramonage.
          </p>
        </div>

        {/* Grille d'avantages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const colors = colorClasses[benefit.color as keyof typeof colorClasses];
            
            return (
              <div
                key={benefit.title}
                className={cn(
                  'relative p-6 rounded-2xl',
                  'bg-white border border-secondary-100',
                  'hover:border-primary-200 hover:shadow-soft-lg',
                  'transition-all duration-300',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icône */}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                  colors.bg
                )}>
                  <benefit.icon className={cn('w-6 h-6', colors.icon)} />
                </div>

                {/* Contenu */}
                <h3 className="text-lg font-display font-semibold text-secondary-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>

                {/* Accent décoratif */}
                <div className={cn(
                  'absolute top-0 right-0 w-20 h-20 opacity-5 rounded-tr-2xl',
                  'bg-gradient-to-br',
                  colors.gradient
                )} />
              </div>
            );
          })}
        </div>

        {/* Bandeau de confiance */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-secondary-900 to-secondary-800 
                        relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 bg-pattern opacity-5" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                Prêt à sécuriser votre installation ?
              </h3>
              <p className="text-secondary-300">
                Réservez votre créneau en ligne. Intervention rapide sous 24-48h
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.urls.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-primary-500 text-white hover:bg-primary-600 btn-md"
              >
                <Calendar className="w-4 h-4" />
                Prendre RDV
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="btn bg-secondary-700 text-secondary-300 hover:bg-secondary-600 btn-md text-sm"
              >
                <Phone className="w-4 h-4" />
                Urgences
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
