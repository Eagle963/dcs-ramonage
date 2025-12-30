import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  Phone,
  Award,
  Settings,
  Wrench,
  Shield,
  Clock,
  Star
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Entretien Poêle à Granulés Dielle | Spécialiste Formé',
  description: 'Spécialiste formé par Dielle pour l\'entretien et le dépannage de vos poêles à granulés. Intervention dans l\'Oise et le Val-d\'Oise. Devis gratuit.',
  keywords: ['poêle Dielle', 'entretien Dielle', 'dépannage Dielle', 'poêle granulés Dielle', 'pellets Dielle'],
  alternates: { canonical: `${siteConfig.urls.website}/poele-granules-dielle` },
};

export default function PoeleDiellePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-start gap-2 mb-4">
              <Award className="w-5 h-5 text-primary-500" />
              <span className="badge-primary">Spécialiste Certifié Dielle</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6 text-left">
              Expert poêles à granulés{' '}
              <span className="text-gradient">Dielle</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 text-left">
              Formés directement par Dielle, nous sommes spécialistes de l'entretien et du dépannage de vos poêles à granulés de cette marque italienne reconnue.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                <Award className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">Formé par Dielle</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary-100 rounded-full">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-secondary-700">5/5 Google</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a href={siteConfig.urls.booking} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
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
        </div>
      </section>

      {/* Pourquoi Dielle */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6">
                Pourquoi choisir un spécialiste Dielle ?
              </h2>
              <div className="space-y-4 text-secondary-600">
                <p>
                  Les poêles à granulés Dielle sont des appareils de qualité italienne 
                  qui nécessitent une expertise spécifique pour un entretien optimal.
                </p>
                <p>
                  Ayant suivi une formation directement auprès de Dielle, nous connaissons 
                  parfaitement ces appareils : leur fonctionnement, leurs spécificités 
                  techniques et les interventions adaptées.
                </p>
                <p>
                  Cette expertise nous permet de diagnostiquer rapidement les pannes, 
                  d'effectuer un entretien complet et de prolonger la durée de vie 
                  de votre poêle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: 'Formation Dielle', desc: 'Technicien formé par le fabricant' },
                { icon: Settings, title: 'Pièces d\'origine', desc: 'Accès aux pièces Dielle' },
                { icon: Wrench, title: 'Diagnostic précis', desc: 'Codes erreur et paramètres' },
                { icon: Shield, title: 'Garantie préservée', desc: 'Entretien conforme aux exigences' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white border border-secondary-100"
                >
                  <item.icon className="w-8 h-8 text-primary-500 mb-3" />
                  <h3 className="font-semibold text-secondary-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-secondary-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Dielle */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Nos prestations pour poêles Dielle
            </h2>
            <p className="text-secondary-600">
              Un entretien complet adapté aux spécificités de votre appareil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Entretien annuel complet',
                desc: 'Nettoyage chambre de combustion, échangeur, ventilateurs, creuset. Vérification des paramètres et réglages.',
                price: '180 €',
                note: 'Ramonage inclus',
              },
              {
                title: 'Entretien sans ramonage',
                desc: 'Nettoyage complet de l\'appareil si le ramonage a déjà été effectué.',
                price: '100 €',
                note: 'Si ramonage déjà fait',
              },
              {
                title: 'Dépannage / Diagnostic',
                desc: 'Recherche de panne, lecture des codes erreur, diagnostic complet.',
                price: '90 €',
                note: 'Déplacement inclus',
              },
              {
                title: 'Remplacement bougie',
                desc: 'Remplacement de la bougie d\'allumage Dielle.',
                price: '90 €',
                note: 'Pièce et main d\'œuvre',
              },
              {
                title: 'Ramonage conduit',
                desc: 'Ramonage mécanique du conduit d\'évacuation avec certificat.',
                price: '80 €',
                note: 'Certificat inclus',
              },
              {
                title: 'Mise en service',
                desc: 'Première mise en route, réglages et explications d\'utilisation.',
                price: 'Sur devis',
                note: 'Pour installation neuve',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-secondary-100 
                           hover:border-primary-200 hover:shadow-soft transition-all"
              >
                <h3 className="font-display font-semibold text-secondary-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  {service.desc}
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">{service.price}</span>
                    <span className="block text-xs text-secondary-500 mt-1">{service.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèles Dielle */}
      <section className="section-padding">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Nous intervenons sur tous les modèles Dielle
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Dielle Pellet',
              'Dielle Aria',
              'Dielle Canalizzabile',
              'Dielle Hydro',
              'Dielle Stufa',
              'Dielle Inserto',
              'Et tous les autres modèles...',
            ].map((model, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 text-sm"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-8 text-center">
              Questions fréquentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'À quelle fréquence entretenir mon poêle Dielle ?',
                  a: 'Un entretien professionnel annuel est recommandé, idéalement avant la saison de chauffe. Le ramonage du conduit est obligatoire 2 fois par an pour les appareils à granulés.',
                },
                {
                  q: 'Avez-vous accès aux pièces détachées Dielle ?',
                  a: 'Oui, en tant que technicien formé par Dielle, nous avons accès au catalogue de pièces détachées d\'origine pour tous les modèles.',
                },
                {
                  q: 'Mon poêle Dielle affiche un code erreur, que faire ?',
                  a: 'Notez le code erreur affiché et contactez-nous. Grâce à notre formation Dielle, nous pouvons diagnostiquer la panne rapidement et vous proposer la solution adaptée.',
                },
                {
                  q: 'L\'entretien par un spécialiste préserve-t-il la garantie ?',
                  a: 'Oui, un entretien réalisé par un technicien formé par le fabricant préserve votre garantie constructeur et vous permet de bénéficier d\'un suivi optimal.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white border border-secondary-100"
                >
                  <h3 className="font-semibold text-secondary-900 mb-2">{faq.q}</h3>
                  <p className="text-secondary-600 text-sm">{faq.a}</p>
                </div>
              ))}
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
              Besoin d'un spécialiste Dielle ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Prenez rendez-vous pour l'entretien ou le dépannage de votre poêle Dielle.
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
