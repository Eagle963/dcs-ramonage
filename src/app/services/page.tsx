import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Flame, 
  Hammer, 
  CircleDot, 
  Settings, 
  Search, 
  Wrench,
  Droplets,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Nos Services | DCS Ramonage',
  description: 'Découvrez tous nos services : ramonage, débistrage, tubage, entretien de poêles à granulés, diagnostic de conduit, fumisterie et nettoyage de toiture.',
};

const services = [
  {
    title: 'Ramonage',
    slug: 'ramonage',
    icon: Flame,
    description: 'Ramonage certifié de cheminées, inserts, poêles à bois et conduits. Certificat officiel fourni pour votre assurance.',
    features: ['Certificat de ramonage', 'Tous types de conduits', 'Intervention sous 24-48h'],
    price: 'À partir de 60€',
  },
  {
    title: 'Débistrage',
    slug: 'debistrage',
    icon: Hammer,
    description: 'Élimination professionnelle du bistre et des dépôts de goudron dans vos conduits de cheminée.',
    features: ['Débistrage mécanique', 'Nettoyage en profondeur', 'Prévention des feux de cheminée'],
    price: 'Sur devis',
  },
  {
    title: 'Tubage',
    slug: 'tubage-cheminee',
    icon: CircleDot,
    description: 'Installation et rénovation de tubage aux normes pour sécuriser et optimiser vos conduits.',
    features: ['Tubage inox', 'Mise aux normes', 'Garantie décennale'],
    price: 'Sur devis',
  },
  {
    title: 'Entretien Poêles à Granulés',
    slug: 'entretien-poele-granules',
    icon: Settings,
    description: 'Entretien complet et dépannage de poêles à bois et à granulés toutes marques.',
    features: ['Nettoyage complet', 'Vérification des composants', 'Optimisation des performances'],
    price: 'À partir de 90€',
  },
  {
    title: 'Diagnostic de Conduit',
    slug: 'diagnostic-conduit',
    icon: Search,
    description: 'Inspection et diagnostic complet de vos conduits pour identifier les problèmes potentiels.',
    features: ['Inspection visuelle', 'Test d\'étanchéité', 'Rapport détaillé'],
    price: 'Sur devis',
  },
  {
    title: 'Fumisterie',
    slug: 'fumisterie',
    icon: Wrench,
    description: 'Travaux de fumisterie : création, rénovation et mise aux normes de vos installations.',
    features: ['Création de conduits', 'Rénovation', 'Mise aux normes'],
    price: 'Sur devis',
  },
  {
    title: 'Nettoyage & Démoussage',
    slug: 'nettoyage-demoussage',
    icon: Droplets,
    description: 'Nettoyage de toiture, démoussage, nettoyage de façade et entretien extérieur.',
    features: ['Démoussage toiture', 'Nettoyage façade', 'Traitement hydrofuge'],
    price: 'Sur devis',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-secondary-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-50" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
              Nos <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Artisan ramoneur certifié, nous intervenons dans l'Oise (60) et le Val-d'Oise (95) 
              pour tous vos travaux de ramonage, entretien et rénovation.
            </p>
          </div>
        </div>
      </section>

      {/* Liste des services */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/${service.slug}`}
                  className="group bg-white rounded-2xl border border-secondary-100 p-6 
                           hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Icône */}
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-4
                               group-hover:bg-primary-100 transition-colors">
                    <IconComponent className="w-7 h-7 text-primary-600" />
                  </div>

                  {/* Titre */}
                  <h2 className="text-xl font-display font-bold text-secondary-900 mb-2 
                               group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-secondary-600 text-sm mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-secondary-700">
                        <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Prix et CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                    <span className="text-primary-600 font-semibold">{service.price}</span>
                    <span className="flex items-center gap-1 text-primary-600 text-sm font-medium 
                                   group-hover:gap-2 transition-all">
                      En savoir plus
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Besoin d'un service ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Prenez rendez-vous en ligne ou contactez-nous pour un devis gratuit.
              Intervention rapide sous 24-48h.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={siteConfig.urls.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg"
              >
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
                <ArrowRight className="w-5 h-5" />
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
    </main>
  );
}
