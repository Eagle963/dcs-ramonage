import Link from 'next/link';
import { MapPin, ChevronRight, Navigation } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function ZonesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="badge-primary mb-4">Zones d&apos;intervention</span>
          <h2 className="section-title">
            Nous intervenons dans{' '}
            <span className="text-gradient">l&apos;Oise et le Val-d&apos;Oise</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Artisan ramoneur basé à Beauvais, nous couvrons l&apos;ensemble des départements 
            60 et 95 pour tous vos travaux de ramonage.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Carte/Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-3xl p-8 
                            relative overflow-hidden">
              {/* Pattern */}
              <div className="absolute inset-0 bg-pattern opacity-30" />
              
              <div className="relative z-10">
                {/* Départements */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {siteConfig.serviceAreas.departments.map((dept) => (
                    <div key={dept.code} className="bg-white rounded-2xl p-6 shadow-soft">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                        <MapPin className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-secondary-900 mb-1">
                        {dept.name}
                      </h3>
                      <p className="text-secondary-500 text-sm">Département {dept.code}</p>
                    </div>
                  ))}
                </div>

                {/* Infos pratiques */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">Basé à Beauvais</p>
                      <p className="text-sm text-secondary-500">Intervention rapide dans un rayon de 40km</p>
                    </div>
                  </div>
                  <p className="text-secondary-600 text-sm">
                    Nous nous déplaçons chez vous pour tous vos travaux de ramonage, 
                    débistrage et tubage. Devis gratuit et sans engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des villes */}
          <div>
            <h3 className="font-display font-bold text-xl text-secondary-900 mb-6">
              Principales villes desservies
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {siteConfig.serviceAreas.mainCities.map((city, index) => (
                <Link
                  key={city}
                  href={`/ramonage-${city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['\s]/g, '-')}`}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl',
                    'bg-secondary-50 hover:bg-primary-50',
                    'text-secondary-700 hover:text-primary-600',
                    'transition-all duration-200 group',
                    'animate-fade-in'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span className="font-medium">{city}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 
                                           group-hover:opacity-100 group-hover:translate-x-0 
                                           transition-all" />
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 
                            text-white relative overflow-hidden">
              {/* Pattern */}
              <div className="absolute inset-0 bg-pattern opacity-10" />
              
              <div className="relative z-10">
                <p className="font-display font-bold text-lg mb-2">
                  Votre ville n&apos;est pas listée ?
                </p>
                <p className="text-white/80 text-sm mb-4">
                  Contactez-nous pour vérifier notre disponibilité dans votre secteur.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 
                             rounded-lg font-semibold text-sm hover:bg-secondary-50 transition-colors"
                >
                  Nous contacter
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
