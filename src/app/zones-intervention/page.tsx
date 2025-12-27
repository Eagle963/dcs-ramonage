import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight, 
  Phone,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Zones d\'intervention | Ramonage Oise et Val-d\'Oise',
  description: 'DCS Ramonage intervient dans l\'Oise (60) et le Val-d\'Oise (95) : Beauvais, Creil, Chantilly, Senlis, Cergy, Pontoise, Argenteuil.',
  keywords: ['ramonage Oise', 'ramonage Val-d\'Oise', 'ramoneur 60', 'ramoneur 95', 'zone intervention ramonage'],
  alternates: { canonical: `${siteConfig.urls.website}/zones-intervention` },
};

const zones = [
  {
    department: 'Oise (60)',
    description: 'Nous intervenons dans l\'Oise, de Beauvais à Senlis.',
    cities: [
      { name: 'Beauvais', slug: 'beauvais', postalCode: '60000' },
      { name: 'Clermont', slug: 'clermont', postalCode: '60600' },
      { name: 'Creil', slug: 'creil', postalCode: '60100' },
      { name: 'Chantilly', slug: 'chantilly', postalCode: '60500' },
      { name: 'Senlis', slug: 'senlis', postalCode: '60300' },
      { name: 'Gouvieux', slug: 'gouvieux', postalCode: '60270' },
      { name: 'Méru', slug: 'meru', postalCode: '60110' },
      { name: 'Chambly', slug: 'chambly', postalCode: '60230' },
    ],
  },
  {
    department: 'Val-d\'Oise (95)',
    description: 'Nous intervenons dans le Val-d\'Oise, de Cergy à Argenteuil.',
    cities: [
      { name: 'L\'Isle-Adam', slug: 'isle-adam', postalCode: '95290' },
      { name: 'Persan', slug: 'persan', postalCode: '95340' },
      { name: 'Cergy', slug: 'cergy', postalCode: '95000' },
      { name: 'Pontoise', slug: 'pontoise', postalCode: '95300' },
      { name: 'Bessancourt', slug: 'bessancourt', postalCode: '95550' },
      { name: 'Taverny', slug: 'taverny', postalCode: '95150' },
      { name: 'Ermont', slug: 'ermont', postalCode: '95120' },
      { name: 'Argenteuil', slug: 'argenteuil', postalCode: '95100' },
    ],
  },
];

export default function ZonesInterventionPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
              <span className="badge-primary">Zones d'intervention</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
              Nous intervenons dans{' '}
              <span className="text-gradient">l'Oise et le Val-d'Oise</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              DCS Ramonage intervient dans l'Oise (60) et le Val-d'Oise (95).
              <br />
              Déplacement inclus dans nos tarifs.
              <br />
              Intervention sous 24-48h.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-secondary-600">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span>Déplacement inclus</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span>Intervention rapide</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span>Devis gratuit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carte interactive */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Notre zone d'intervention
            </h2>
            <p className="text-secondary-600">
              Cliquez sur la carte pour voir notre localisation et calculer votre itinéraire.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-soft border border-secondary-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d330638.5489438446!2d1.9!3d49.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6441d8c9d5a6f%3A0x40af13e81647e40!2sOise!5e0!3m2!1sfr!2sfr!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zone d'intervention DCS Ramonage - Oise et Val-d'Oise"
                className="w-full"
              />
            </div>
            <p className="text-center text-sm text-secondary-500 mt-4">
              <a 
                href={siteConfig.urls.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Ouvrir dans Google Maps →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Zones par département */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-8">
            {zones.map((zone, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-secondary-100 shadow-soft overflow-hidden"
              >
                <div className="p-6 bg-secondary-900 text-white">
                  <h2 className="font-display font-bold text-xl">{zone.department}</h2>
                  <p className="text-secondary-300 text-sm mt-1">{zone.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {zone.cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/ramonage-${city.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 
                                   hover:bg-primary-50 hover:border-primary-200 border border-transparent
                                   transition-all group"
                      >
                        <div>
                          <span className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                            {city.name}
                          </span>
                          <span className="block text-xs text-secondary-500">{city.postalCode}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 
                                               group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                  
                  <p className="text-sm text-secondary-500 mt-4 text-center">
                    + communes environnantes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autres communes */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Votre commune n'est pas listée ?
            </h2>
            <p className="text-secondary-600">
              Nous intervenons dans l'Oise (60) et le Val-d'Oise (95). 
              Contactez-nous pour vérifier notre disponibilité dans votre secteur.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary btn-lg">
              <Calendar className="w-5 h-5" />
              Vérifier la disponibilité
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
              className="btn-outline btn-lg"
            >
              <Phone className="w-5 h-5" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Prêt à prendre rendez-vous ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Réservez votre créneau en ligne. Intervention rapide sous 24-48h dans l'Oise et le Val-d'Oise.
            </p>
            
            <Link href="/contact" className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
