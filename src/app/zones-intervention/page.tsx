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

      {/* Carte des zones */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Notre zone d'intervention
            </h2>
            <p className="text-secondary-600">
              Nous intervenons dans le sud de l'Oise et le nord du Val-d'Oise.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-soft border border-secondary-100 bg-white p-8">
              {/* Carte SVG stylisée */}
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Fond */}
                <rect width="400" height="300" fill="#f8fafc" />
                
                {/* Oise (60) - Zone couverte (sud du département) */}
                <path
                  d="M50 50 L200 30 L280 60 L300 120 L260 180 L180 200 L100 170 L60 120 Z"
                  fill="#fed7aa"
                  stroke="#ea580c"
                  strokeWidth="2"
                  opacity="0.7"
                />
                
                {/* Val-d'Oise (95) - Zone couverte (nord du département) */}
                <path
                  d="M100 170 L180 200 L260 180 L280 220 L240 260 L160 270 L80 240 L60 200 Z"
                  fill="#fed7aa"
                  stroke="#ea580c"
                  strokeWidth="2"
                  opacity="0.7"
                />
                
                {/* Zone non couverte Oise (nord) - grisée */}
                <path
                  d="M50 50 L200 30 L350 40 L380 100 L300 120 L280 60 L200 30"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  opacity="0.5"
                />
                
                {/* Marqueur Beauvais */}
                <circle cx="120" cy="100" r="8" fill="#ea580c" />
                <text x="120" y="125" textAnchor="middle" className="text-xs font-semibold" fill="#1e293b">Beauvais</text>
                
                {/* Marqueur Creil */}
                <circle cx="220" cy="150" r="8" fill="#ea580c" />
                <text x="220" y="175" textAnchor="middle" className="text-xs font-semibold" fill="#1e293b">Creil</text>
                
                {/* Marqueur Chantilly */}
                <circle cx="250" cy="185" r="6" fill="#c2410c" />
                <text x="285" y="188" textAnchor="start" className="text-xs" fill="#475569">Chantilly</text>
                
                {/* Marqueur Cergy */}
                <circle cx="130" cy="220" r="8" fill="#ea580c" />
                <text x="130" y="245" textAnchor="middle" className="text-xs font-semibold" fill="#1e293b">Cergy</text>
                
                {/* Marqueur Pontoise */}
                <circle cx="160" cy="210" r="6" fill="#c2410c" />
                <text x="175" y="205" textAnchor="start" className="text-xs" fill="#475569">Pontoise</text>
                
                {/* Marqueur L'Isle-Adam */}
                <circle cx="200" cy="200" r="6" fill="#c2410c" />
                <text x="200" y="192" textAnchor="middle" className="text-xs" fill="#475569">L'Isle-Adam</text>
                
                {/* Marqueur Argenteuil */}
                <circle cx="210" cy="250" r="6" fill="#c2410c" />
                <text x="210" y="268" textAnchor="middle" className="text-xs" fill="#475569">Argenteuil</text>
                
                {/* Légende */}
                <rect x="290" y="220" width="16" height="16" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" rx="2" />
                <text x="312" y="233" className="text-xs" fill="#475569">Zone couverte</text>
                
                <rect x="290" y="245" width="16" height="16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="2" />
                <text x="312" y="258" className="text-xs" fill="#475569">Hors zone</text>
                
                {/* Labels départements */}
                <text x="150" y="80" className="text-sm font-bold" fill="#c2410c">OISE (60)</text>
                <text x="140" y="235" className="text-sm font-bold" fill="#c2410c">VAL-D'OISE (95)</text>
              </svg>
            </div>
            <p className="text-center text-sm text-secondary-500 mt-4">
              Votre commune n'est pas listée ? Contactez-nous pour vérifier notre disponibilité.
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
            <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              <Calendar className="w-5 h-5" />
              Vérifier la disponibilité
              <ArrowRight className="w-5 h-5" />
            </a>
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
            
            <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
