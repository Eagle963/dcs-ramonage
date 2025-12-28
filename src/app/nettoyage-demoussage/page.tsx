import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  Phone,
  Droplets,
  Home,
  Sun,
  Sparkles
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Nettoyage & Démoussage | Toitures, Murs, Sols, Vérandas',
  description: 'Nettoyage et démoussage professionnels de toitures, murs, sols et vérandas dans l\'Oise et le Val-d\'Oise. Traitement anti-mousse longue durée. Devis gratuit.',
  keywords: ['démoussage toiture', 'nettoyage toiture', 'nettoyage façade', 'nettoyage véranda', 'démoussage Oise'],
  alternates: { canonical: `${siteConfig.urls.website}/nettoyage-demoussage` },
};

export default function NettoyageDemoussagePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                Nettoyage & Démoussage
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
              Nettoyage et démoussage{' '}
              <span className="text-gradient">professionnel</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 text-center">
              Redonnez un coup d'éclat à votre maison !
              <br />
              Nous nettoyons et traitons vos toitures, murs, sols extérieurs et vérandas avec des équipements professionnels.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/contact" className="btn-primary btn-lg">
                <Calendar className="w-5 h-5" />
                Demander un devis gratuit
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
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Nos prestations de nettoyage
            </h2>
            <p className="text-secondary-600 text-center">
              Un service complet pour l'extérieur de votre maison.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Home,
                title: 'Toitures',
                description: 'Démoussage et nettoyage de toitures en tuiles, ardoises ou fibrociment. Élimination des mousses, lichens et algues. Traitement hydrofuge et anti-mousse longue durée.',
                includes: [
                  'Nettoyage haute ou basse pression',
                  'Traitement anti-mousse',
                  'Application hydrofuge (en option)',
                  'Nettoyage des gouttières',
                ],
              },
              {
                icon: Sparkles,
                title: 'Murs & Façades',
                description: 'Nettoyage des façades, murs extérieurs et clôtures. Élimination des traces noires, verdissures et salissures diverses.',
                includes: [
                  'Nettoyage basse pression adapté',
                  'Traitement anti-verdissure',
                  'Tous types de supports',
                  'Préservation des joints',
                ],
              },
              {
                icon: Sun,
                title: 'Vérandas',
                description: 'Nettoyage complet de vérandas : toiture en verre ou polycarbonate, montants aluminium et surfaces vitrées.',
                includes: [
                  'Nettoyage toiture véranda',
                  'Nettoyage vitrages',
                  'Nettoyage montants',
                  'Sans traces ni rayures',
                ],
              },
              {
                icon: Droplets,
                title: 'Sols extérieurs',
                description: 'Nettoyage de terrasses, allées, dalles et pavés. Élimination des mousses et taches tenaces.',
                includes: [
                  'Terrasses bois ou carrelage',
                  'Allées en pavés ou béton',
                  'Dalles et dallages',
                  'Traitement anti-mousse',
                ],
              },
            ].map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-secondary-100 
                           hover:border-blue-200 hover:shadow-soft transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-secondary-900 text-lg mb-2">
                      {service.title}
                    </h3>
                    <p className="text-secondary-600 text-sm mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-secondary-600">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="section-padding bg-secondary-50">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Tarification
            </h2>
            <p className="text-secondary-600 text-center">
              Chaque chantier est unique. Nous établissons un devis gratuit après 
              évaluation de la surface et de l'état de vos extérieurs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
                className="p-5 rounded-2xl bg-white border border-secondary-100"
              >
                <h3 className="font-semibold text-secondary-900 mb-1">{item.label}</h3>
                <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">{item.price}</span>
                <p className="text-sm text-secondary-500 mt-2">{item.note}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-secondary-500 mt-8">
            * Devis gratuit et sans engagement. Intervention dans l'Oise (60) et le Val-d'Oise (95).
          </p>
        </div>
      </section>

      {/* Pourquoi nous */}
      <section className="section-padding">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Pourquoi faire appel à nous ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Équipement professionnel',
                desc: 'Nettoyeur haute pression, traitement anti-mousse professionnel, équipements de sécurité pour travaux en hauteur.',
              },
              {
                title: 'Intervention complète',
                desc: 'Nous combinons ramonage et nettoyage extérieur pour une intervention globale sur votre maison.',
              },
              {
                title: 'Proximité',
                desc: 'Artisan local, nous intervenons rapidement dans toute l\'Oise et le Val-d\'Oise.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-secondary-100"
              >
                <CheckCircle2 className="w-8 h-8 text-blue-500 mb-4" />
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-secondary-900 to-secondary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Besoin d'un devis pour votre nettoyage ?
            </h2>
            <p className="text-secondary-300 mb-8">
              Contactez-nous pour un devis gratuit. Nous évaluons vos besoins 
              et vous proposons une solution adaptée.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg">
                <Calendar className="w-5 h-5" />
                Demander un devis
                <ArrowRight className="w-5 h-5" />
              </Link>
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
