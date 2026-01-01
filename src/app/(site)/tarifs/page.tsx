import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  Phone,
  Info,
  Flame,
  Sparkles,
  Wrench,
  Search,
  Settings,
  Hammer,
  Droplets,
  Euro
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Tarifs Ramonage | Prix Transparents',
  description: 'Tarifs ramonage, débistrage, tubage et entretien poêles dans l\'Oise et Val-d\'Oise. Prix clairs, déplacement inclus. Devis gratuit.',
  keywords: ['tarif ramonage', 'prix ramonage', 'coût ramonage cheminée', 'tarif ramoneur'],
  alternates: { canonical: `${siteConfig.urls.website}/tarifs` },
};

export default function TarifsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-300/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-start gap-2 mb-4">
              <Euro className="w-5 h-5 text-green-500" />
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">Tarifs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6 text-left">
              Nos tarifs{' '}
              <span className="text-gradient">transparents</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 text-left">
              Des prix clairs, sans surprise.
              <br />
              Déplacement inclus dans l'Oise (60) et le Val-d'Oise (95).
              <br />
              Certificat officiel remis après chaque intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Section Ramonage */}
      <section className="section-padding">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Ramonage</h2>
              <p className="text-secondary-500 text-sm">Ramonage mécanique avec certificat officiel</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Chaudière à gaz', price: '60 €', note: 'Conduit gaz, certificat inclus' },
              { label: 'Cheminée ouverte ou insert', price: '70 €', note: 'Foyer ouvert ou insert bois' },
              { label: 'Poêle à bois', price: '80 €', note: 'Poêle à bûches, certificat inclus' },
              { label: 'Chaudière à fioul', price: '80 €', note: 'Conduit fioul, certificat inclus' },
              { label: 'Cheminée Polyflam', price: '90 €', note: 'Cheminée Polyflam, certificat inclus' },
              { label: 'Conduit difficile', price: '110 €', note: 'Accès complexe ou conduit > 10m' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-primary-200 
                           hover:shadow-soft transition-all"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-primary-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Entretien Poêles */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Entretien Poêles à Granulés</h2>
              <p className="text-secondary-500 text-sm">Nettoyage complet et vérifications</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Ramonage + Entretien complet', price: '180 €', note: 'Forfait annuel recommandé' },
              { label: 'Entretien sans ramonage', price: '100 €', note: 'Si ramonage déjà effectué' },
              { label: 'Dépannage / Diagnostic', price: '90 €', note: 'Recherche de panne' },
              { label: 'Remplacement bougie', price: '90 €', note: 'Pièce et main d\'œuvre' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-accent-200 
                           hover:shadow-soft transition-all"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-accent-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Diagnostic */}
      <section className="section-padding">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Diagnostic</h2>
              <p className="text-secondary-500 text-sm">Inspection et analyse de vos conduits</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Diagnostic vidéo complet', price: '200 €', note: 'Inspection caméra + rapport détaillé' },
              { label: 'Diagnostic simple', price: '80 €', note: 'Inspection visuelle + test tirage' },
              { label: 'Test d\'étanchéité fumigène', price: '130 €', note: 'Vérification des fuites du conduit' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-blue-200 
                           hover:shadow-soft transition-all"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Débistrage */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Débistrage</h2>
              <p className="text-secondary-500 text-sm">Élimination du bistre dans les conduits</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-orange-200 
                           hover:shadow-soft transition-all">
              <h3 className="font-semibold text-secondary-900 mb-1">Débistrage cheminée</h3>
              <span className="text-2xl font-bold text-orange-600 whitespace-nowrap">Sur devis</span>
              <p className="text-sm text-secondary-500 mt-2">Tarif au mètre selon épaisseur du bistre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Tubage */}
      <section className="section-padding">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Tubage</h2>
              <p className="text-secondary-500 text-sm">Installation et rénovation de conduits</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {[
              { label: 'Tubage flexible ou rigide', price: 'Sur devis', note: 'Selon équipement et environnement' },
              { label: 'Conduit double paroi / isolé', price: 'Sur devis', note: 'Installation complète avec sortie toiture' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-purple-200 
                           hover:shadow-soft transition-all"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-purple-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Fumisterie */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <Hammer className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Fumisterie</h2>
              <p className="text-secondary-500 text-sm">Pose d'accessoires et travaux divers</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Chapeau de cheminée inox', price: 'À partir de 100 €', note: 'Pose uniquement, fourniture non incluse' },
              { label: 'Plaque d\'étanchéité', price: 'À partir de 100 €', note: 'Pose uniquement, fourniture non incluse' },
              { label: 'Traitement de toiture', price: 'Sur devis', note: 'Nettoyage et démoussage' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-green-200 
                           hover:shadow-soft transition-all"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-green-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Nettoyage/Démoussage */}
      <section className="section-padding">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">Nettoyage & Démoussage</h2>
              <p className="text-secondary-500 text-sm">Toitures, murs, sols et vérandas</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Démoussage toiture', price: 'Sur devis', note: 'Prix au m² selon surface' },
              { label: 'Nettoyage façade', price: 'Sur devis', note: 'Prix au m² selon surface' },
              { label: 'Nettoyage véranda', price: 'Sur devis', note: 'Selon dimensions' },
              { label: 'Nettoyage terrasse', price: 'Sur devis', note: 'Prix au m² selon surface' },
              { label: 'Traitement hydrofuge', price: 'Sur devis', note: 'En complément du nettoyage' },
              { label: 'Nettoyage gouttières', price: 'Sur devis', note: 'Au mètre linéaire' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-secondary-100 hover:border-cyan-200 
                           hover:shadow-soft transition-all"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-cyan-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="section-padding">
        <div className="container-site">
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-primary-50 border border-primary-100">
            <div className="flex gap-3">
              <Info className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">Informations importantes</h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Tarifs TTC, déplacement inclus dans l'Oise (60) et le Val-d'Oise (95)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Professionnels : tarifs affichés HT + TVA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Certificat de ramonage officiel inclus (valable pour votre assurance)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Paiement sur place : espèces, chèque, virement</span>
                  </li>
                </ul>
              </div>
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
              Besoin d'un devis personnalisé ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Contactez-nous pour un devis gratuit adapté à votre situation.
              Réponse rapide garantie.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={siteConfig.urls.booking} className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
                <Calendar className="w-5 h-5" />
                Demander un devis
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
