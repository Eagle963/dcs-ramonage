import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Wrench, Settings, Search, Hammer } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

// Map des icônes
const iconMap = {
  Flame,
  Sparkles,
  Wrench,
  Settings,
  Search,
  Hammer,
} as const;

export function ServicesSection() {
  const featuredServices = siteConfig.services.filter(s => s.featured);

  return (
    <section className="section-padding bg-secondary-50/50">
      <div className="container-site">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <span className="badge-primary mb-4">Nos prestations</span>
          <h2 className="section-title">
            Services de ramonage{' '}
            <span className="text-gradient">professionnels</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Des solutions complètes pour l&apos;entretien et la sécurité de vos installations 
            de chauffage. Intervention dans l&apos;Oise et le Val-d&apos;Oise.
          </p>
        </div>

        {/* Grille de services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            
            return (
              <Link
                key={service.id}
                href={`/${service.slug}`}
                className={cn(
                  'card card-hover p-6 group',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icône */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 
                                flex items-center justify-center mb-5 
                                group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
                  {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                </div>

                {/* Contenu */}
                <h3 className="text-xl font-display font-semibold text-secondary-900 mb-2 
                               group-hover:text-primary-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed mb-4">
                  {service.shortDescription}
                </p>

                {/* Lien */}
                <div className="flex items-center gap-2 text-primary-500 font-medium text-sm
                                group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA vers tous les services */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="btn-outline btn-md inline-flex"
          >
            Voir tous nos services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
