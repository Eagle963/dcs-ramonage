'use client';

import Link from 'next/link';
import { 
  Phone, 
  Calendar,
  ArrowRight, 
  Star, 
  Shield, 
  Clock, 
  CheckCircle2,
  Flame
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background avec effet mesh */}
      <div className="absolute inset-0 bg-mesh" />
      
      {/* Pattern décoratif */}
      <div className="absolute inset-0 bg-pattern opacity-50" />
      
      {/* Cercles décoratifs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      
      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                           bg-primary-50 border border-primary-100 mb-6 animate-fade-in animation-delay-200">
              <span className="flex items-center gap-1 text-primary-600 font-medium text-sm">
                <Star className="w-4 h-4 fill-primary-500" />
                5/5 sur Google
              </span>
              <span className="text-secondary-400">•</span>
              <span className="text-secondary-600 text-sm">+50 avis clients</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6 leading-tight">
              Ramoneur certifié{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-500 to-accent-600 bg-clip-text text-transparent">
                  Beauvais
                </span>
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8.5C50 2.5 150 2.5 198 8.5"
                    stroke="url(#underline-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#f97316" />
                      <stop offset="1" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              <span className="text-secondary-500">Oise & Val-d&apos;Oise</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-secondary-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Ramonage de cheminées, poêles à bois et granulés, débistrage, tubage.
              <br />
              <strong className="text-secondary-800">Intervention rapide sous 24-48h</strong> avec certificat officiel.
            </p>

            {/* Points clés */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {[
                { icon: Shield, text: 'Artisan certifié' },
                { icon: Clock, text: 'Intervention 24-48h' },
                { icon: CheckCircle2, text: 'Certificat officiel' },
              ].map((item, index) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-secondary-700 animate-fade-in"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <item.icon className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in animation-delay-500">
              <Link
                href="/contact"
                className="btn-primary btn-lg w-full sm:w-auto group"
              >
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {/* Téléphone discret */}
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-secondary-400 hover:text-secondary-600 
                           text-sm transition-colors"
                title="Urgences uniquement"
              >
                <Phone className="w-4 h-4" />
                <span>Urgences : {siteConfig.contact.phone}</span>
              </a>
            </div>

            {/* Réassurance */}
            <p className="mt-6 text-sm text-secondary-500 animate-fade-in animation-delay-700">
              ✓ Réponse sous 2h • ✓ RDV confirmé par SMS • ✓ Paiement après intervention
            </p>
          </div>

          {/* Visuel / Illustration */}
          <div className="relative hidden lg:block animate-fade-in animation-delay-300">
            {/* Card principale avec effet 3D */}
            <div className="relative">
              {/* Fond décoratif */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 
                              rounded-3xl blur-2xl" />
              
              {/* Image/Illustration placeholder */}
              <div className="relative bg-gradient-to-br from-secondary-800 to-secondary-900 
                              rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                {/* Overlay avec motif */}
                <div className="absolute inset-0 bg-pattern opacity-10" />
                
                {/* Contenu de la card */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  {/* Icône flamme animée */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 
                                    flex items-center justify-center animate-flame">
                      <Flame className="w-12 h-12 text-white" />
                    </div>
                    {/* Cercles concentriques */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary-400/30 
                                    animate-ping" style={{ animationDuration: '2s' }} />
                  </div>
                  
                  {/* Texte */}
                  <h3 className="text-white font-display font-bold text-2xl mb-2 text-center">
                    Votre sécurité,<br />notre priorité
                  </h3>
                  <p className="text-secondary-300 text-center max-w-xs">
                    Ramonage professionnel certifié pour cheminées et poêles
                  </p>
                </div>

                {/* Badge flottant - Avis */}
                <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg p-3 
                                animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning-400 text-warning-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-secondary-900">5.0</span>
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">Google Avis</p>
                </div>

                {/* Badge flottant - Intervention */}
                <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-3
                                animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary-900">24-48h</p>
                      <p className="text-xs text-secondary-500">Intervention rapide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
