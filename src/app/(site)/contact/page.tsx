import { Metadata } from 'next';
import { ContactForm } from '@/components/forms/ContactForm';
import { EmailImageLight } from '@/components/ui/EmailImage';
import { Phone, Mail, Clock, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact | DCS Ramonage',
  description: 'Contactez DCS Ramonage pour toute question ou renseignement. Intervention dans l\'Oise et Val-d\'Oise.',
  alternates: {
    canonical: `${siteConfig.urls.website}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
        
        <div className="container-site relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">Contact</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
              Contactez{' '}
              <span className="text-gradient">-nous</span>
            </h1>
            <p className="text-lg text-secondary-600 text-center">
              Une question ? Besoin d'un renseignement ?
              <br />
              Nous sommes à votre écoute.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-secondary-100 shadow-soft p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-secondary-900">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-sm text-secondary-500">
                      Nous vous répondons rapidement
                    </p>
                  </div>
                </div>
                
                <ContactForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Card contact direct */}
              <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-3xl p-6 text-white">
                
                <div className="space-y-4">
                  {/* Titre "Nous contacter" dans une box */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      Nous contacter
                    </h3>
                  </div>

                  {/* Email protégé */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <span className="text-secondary-400 text-xs block">Email</span>
                      <EmailImageLight size="sm" />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary-700 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div>
                      <span className="text-secondary-400 text-xs block">Téléphone</span>
                      <span className="font-medium text-secondary-300">{siteConfig.contact.phone}</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Card horaires */}
              <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-display font-semibold text-secondary-900">
                    Horaires
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Lundi - Vendredi</span>
                    <span className="font-medium text-secondary-900">{siteConfig.hours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Samedi</span>
                    <span className="font-medium text-secondary-900">{siteConfig.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Dimanche</span>
                    <span className="font-medium text-secondary-500">{siteConfig.hours.sunday}</span>
                  </div>
                </div>
              </div>

              {/* Card zone */}
              <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-display font-semibold text-secondary-900">
                    Zone d&apos;intervention
                  </h3>
                </div>
                
                <p className="text-secondary-600 text-sm mb-4">
                  Nous intervenons dans l&apos;Oise (60) et le Val-d&apos;Oise (95).
                </p>
                
                <a 
                  href="/zones-intervention"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Voir toutes les zones →
                </a>
              </div>

              {/* Engagements */}
              <div className="bg-primary-50 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-secondary-900 mb-4">
                  Nos engagements
                </h3>
                
                <ul className="space-y-3">
                  {[
                    'À votre écoute',
                    'Intervention sous 24-48h',
                    'Certificat de ramonage officiel',
                    'Artisan de confiance',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-secondary-700">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
