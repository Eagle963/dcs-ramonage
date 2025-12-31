'use client';

import Link from 'next/link';
import { Phone, Mail, Clock, MapPin, ArrowRight, Flame, Calendar } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { EmailImageLight } from '@/components/ui/EmailImage';

export function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      
      {/* Cercles décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu */}
          <div className="text-center lg:text-left">
            {/* Icône */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                            bg-gradient-to-br from-primary-500 to-accent-600 mb-6 animate-flame">
              <Flame className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Prêt à sécuriser votre{' '}
              <span className="text-primary-400">installation ?</span>
            </h2>
            
            <p className="text-secondary-300 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Réservez votre créneau en ligne.
              <br />
              Intervention rapide sous 24-48h dans l&apos;Oise et le Val-d&apos;Oise.
            </p>

            {/* Boutons d'action - RDV en priorité */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <a
                href={siteConfig.urls.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-primary-500 hover:bg-primary-600 text-white btn-lg w-full sm:w-auto
                           shadow-lg shadow-primary-500/30"
              >
                <Calendar className="w-5 h-5" />
                Réserver un créneau
                <ArrowRight className="w-5 h-5" />
              </a>
              
              {/* Téléphone secondaire */}
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-secondary-400 hover:text-secondary-200 
                           text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Urgences : {siteConfig.contact.phone}</span>
              </a>
            </div>

            {/* Réassurance */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-secondary-400 text-sm">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                Confirmation par email
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                Oise & Val-d&apos;Oise
              </span>
            </div>
          </div>

          {/* Card contact - Réorganisée */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-display font-bold text-white mb-6">
              Informations pratiques
            </h3>
            
            <div className="space-y-6">
              {/* RDV en ligne - mis en avant */}
              <a
                href={siteConfig.urls.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 
                           transition-colors group border border-primary-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-primary-300 text-sm block">Le plus simple</span>
                  <span className="text-white font-semibold text-lg">Prendre RDV en ligne</span>
                </div>
                <ArrowRight className="w-5 h-5 text-primary-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Email protégé (image) */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <span className="text-secondary-400 text-sm block">Email</span>
                  <EmailImageLight size="md" />
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <span className="text-secondary-400 text-sm block">Horaires d&apos;intervention</span>
                  <span className="text-white font-semibold">Lun-Ven: {siteConfig.hours.weekdays}</span>
                  <span className="text-secondary-300 text-sm block">Sam: {siteConfig.hours.saturday}</span>
                </div>
              </div>

              {/* Téléphone - discret en bas */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-secondary-400" />
                </div>
                <div>
                  <span className="text-secondary-500 text-sm block">Urgences uniquement</span>
                  <span className="text-secondary-300 font-medium">{siteConfig.contact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
