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
  MapPin
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

interface LocalPageProps {
  city: string;
  department: string;
  postalCodes: string[];
  nearbyAreas?: string[];
  specificContent?: string;
}

export function LocalPageTemplate({
  city,
  department,
  postalCodes,
  nearbyAreas = [],
  specificContent,
}: LocalPageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-start gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
              <span className="badge-primary">{department}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6 text-left">
              Ramonage à{' '}
              <span className="text-gradient">{city}</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 text-left">
              Votre artisan ramoneur certifié à {city} et ses environs. 
              Ramonage de cheminées, poêles à bois et à granulés. 
              Certificat officiel pour votre assurance.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col items-start gap-3">
              <a href={siteConfig.urls.booking} className="btn-primary btn-lg">
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous à {city}
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

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6 text-left">
                Nos services de ramonage à {city}
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-6 text-left">
                DCS Ramonage intervient à {city} ({postalCodes.join(', ')}) pour tous vos besoins en ramonage et entretien de conduits de fumée.
                <br />
                Nous sommes votre ramoneur de proximité, disponible rapidement pour les particuliers et les professionnels.
              </p>
              {specificContent && (
                <p className="text-secondary-600 leading-relaxed mb-6 text-left">
                  {specificContent}
                </p>
              )}
              
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

            {/* Services grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Ramonage cheminée', desc: 'Cheminées ouvertes et inserts', price: '70 €' },
                { title: 'Ramonage poêle à bois', desc: 'Tous types de poêles', price: '80 €' },
                { title: 'Entretien poêle à granulés', desc: 'Nettoyage + ramonage', price: '180 €' },
                { title: 'Débistrage', desc: 'Élimination du bistre', price: 'Sur devis' },
              ].map((service, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white border border-secondary-100 
                             hover:border-primary-200 hover:shadow-soft transition-all"
                >
                  <h3 className="font-semibold text-secondary-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-2">
                    {service.desc}
                  </p>
                  <span className="text-primary-700 font-bold">{service.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
              Pourquoi choisir DCS Ramonage à {city} ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Proximité',
                desc: `Basés dans la région, nous intervenons rapidement à ${city} et ses environs.`,
              },
              {
                title: 'Professionnalisme',
                desc: 'Artisan qualifié, équipement professionnel, travail soigné et certificat officiel.',
              },
              {
                title: 'Tarifs clairs',
                desc: 'Prix fixes annoncés, déplacement inclus, pas de surprise à la facturation.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-secondary-100"
              >
                <CheckCircle2 className="w-8 h-8 text-primary-500 mb-4" />
                <h3 className="font-display font-semibold text-secondary-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones */}
      {nearbyAreas.length > 0 && (
        <section className="section-padding">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6 text-center">
              Nous intervenons aussi près de {city}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Besoin d'un ramoneur à {city} ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Réservez votre créneau en ligne.
              <br />
              Intervention rapide sous 24-48h dans l'Oise et le Val-d'Oise.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={siteConfig.urls.booking} className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="text-secondary-400 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
