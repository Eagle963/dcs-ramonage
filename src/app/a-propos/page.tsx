import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  Phone,
  Shield,
  Award,
  Users,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'À Propos | DCS Ramonage - Artisan Ramoneur',
  description: 'DCS Ramonage, votre artisan ramoneur dans l\'Oise et le Val-d\'Oise. Découvrez notre entreprise, nos valeurs et notre engagement qualité.',
  keywords: ['DCS Ramonage', 'ramoneur Oise', 'artisan ramoneur', 'entreprise ramonage'],
  alternates: { canonical: `${siteConfig.urls.website}/a-propos` },
};

export default function AProposPage() {
  const values = [
    {
      icon: Shield,
      title: 'Professionnalisme',
      description: 'Travail soigné, équipement professionnel et respect des normes en vigueur.',
    },
    {
      icon: Clock,
      title: 'Réactivité',
      description: 'Intervention rapide sous 24-48h, prise de rendez-vous simplifiée.',
    },
    {
      icon: Heart,
      title: 'Proximité',
      description: 'Artisan local, nous connaissons le territoire et ses spécificités.',
    },
    {
      icon: Award,
      title: 'Transparence',
      description: 'Tarifs clairs affichés, pas de surprise à la facturation.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Interventions par an' },
    { value: '100%', label: 'Clients satisfaits' },
    { value: '24-48h', label: 'Délai d\'intervention' },
    { value: '2', label: 'Départements couverts' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-start gap-2 mb-4">
              <Users className="w-5 h-5 text-amber-500" />
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">À propos</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6 text-left">
              Votre artisan ramoneur{' '}
              <span className="text-gradient">de confiance</span>
            </h1>
            <p className="text-xl text-secondary-600 text-left">
              DCS Ramonage, c'est un savoir-faire artisanal au service de votre sécurité.
              <br />
              Nous intervenons dans l'Oise et le Val-d'Oise pour l'entretien de vos cheminées, poêles et conduits de fumée.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-soft">
                <img 
                  src="/images/fondateur.webp" 
                  alt="Fondateur de DCS Ramonage" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Décoration */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-500/20 rounded-xl -z-10" />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6 text-left">
                Notre histoire
              </h2>
              <div className="space-y-4 text-secondary-600 text-left">
                <p>
                  DCS Ramonage est né de la volonté de proposer un service de ramonage 
                  professionnel, fiable et accessible dans l'Oise et le Val-d'Oise.
                </p>
                <p>
                  Fort d'une expertise dans l'entretien des systèmes de chauffage au bois, 
                  nous avons développé un savoir-faire complet : ramonage, débistrage, 
                  tubage, entretien de poêles à granulés et travaux de fumisterie.
                </p>
                <p>
                  Notre engagement : vous garantir des installations sûres et performantes, 
                  avec un service de proximité et des tarifs transparents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-secondary-900">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <span className="block text-3xl md:text-4xl font-display font-bold text-white mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-secondary-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-secondary-600">
              Ce qui nous guide au quotidien dans notre métier d'artisan ramoneur.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-secondary-100"
              >
                <value.icon className="w-10 h-10 text-primary-500 mb-4" />
                <h3 className="font-display font-semibold text-secondary-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-secondary-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Nos domaines d'expertise
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Ramonage', desc: 'Cheminées, inserts, poêles à bois, chaudières gaz et fioul', href: '/ramonage' },
              { title: 'Entretien poêles à granulés', desc: 'Nettoyage complet, vérifications, dépannage toutes marques', href: '/entretien-poele-granules' },
              { title: 'Débistrage', desc: 'Élimination du bistre avec équipement professionnel', href: '/debistrage' },
              { title: 'Tubage', desc: 'Installation de tubage inox double peau, rigide ou flexible', href: '/tubage-cheminee' },
              { title: 'Diagnostic', desc: 'Inspection vidéo, test d\'étanchéité, rapport détaillé', href: '/diagnostic-conduit' },
              { title: 'Fumisterie', desc: 'Pose de chapeaux, plaques d\'étanchéité, accessoires', href: '/fumisterie' },
            ].map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group p-6 rounded-2xl bg-white border border-secondary-100 
                           hover:border-primary-200 hover:shadow-soft transition-all"
              >
                <h3 className="font-display font-semibold text-secondary-900 mb-2 
                               group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  {service.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Zone */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span className="badge-primary">Zone d'intervention</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6">
                Nous intervenons dans<br />l'Oise et le Val-d'Oise
              </h2>
              <p className="text-secondary-600 mb-6">
                Nous intervenons dans l'Oise (60) et le Val-d'Oise (95). 
                Déplacement inclus dans nos tarifs.
              </p>
              <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md">
                <Calendar className="w-4 h-4" />
                Vérifier notre disponibilité
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {siteConfig.serviceAreas.mainCities.map((city) => (
                <span
                  key={city}
                  className="px-4 py-2 bg-white rounded-full text-secondary-700 text-sm border border-secondary-100"
                >
                  {city}
                </span>
              ))}
              <span className="px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium">
                + communes environnantes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Prêt à faire appel à nos services ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Prenez rendez-vous en ligne ou contactez-nous pour un devis gratuit.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
                <ArrowRight className="w-5 h-5" />
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
