import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { EmailImageLight } from '@/components/ui/EmailImage';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin,
  Youtube,
  ChevronRight,
  Shield,
  Award,
  FileCheck,
  Calendar
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Section principale */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Colonne 1: À propos */}
          <div className="lg:col-span-1">
            {/* Logo image + texte */}
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Image
                src="/logo-dcs.svg"
                alt="DCS Ramonage"
                width={50}
                height={50}
                className="brightness-0 invert group-hover:opacity-80 transition-opacity"
              />
              <div>
                <span className="font-display font-bold text-xl">
                  DCS <span className="text-primary-400">Ramonage</span>
                </span>
              </div>
            </Link>
            
            <p className="text-secondary-300 text-sm leading-relaxed mb-6">
              {siteConfig.company.tagline}. Artisan ramoneur certifié, nous intervenons 
              rapidement pour tous vos travaux de ramonage, débistrage et tubage.
            </p>
            
            {/* Garanties */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <Shield className="w-4 h-4 text-primary-400" />
                <span>Assurance décennale</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <Award className="w-4 h-4 text-primary-400" />
                <span>Artisan qualifié</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <FileCheck className="w-4 h-4 text-primary-400" />
                <span>Certificat officiel</span>
              </div>
            </div>
          </div>

          {/* Colonne 2: Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Nos Services</h3>
            <ul className="space-y-3">
              {siteConfig.services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/${service.slug}`}
                    className="flex items-center gap-2 text-secondary-300 hover:text-primary-400 
                               transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-primary-700 group-hover:translate-x-1 transition-transform" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Zones d'intervention */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Zones d'intervention</h3>
            <div className="grid grid-cols-2 gap-2">
              {siteConfig.serviceAreas.mainCities.slice(0, 14).map((city) => {
                // Génération du slug correct
                const slug = city
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
                  .replace(/^l'/, '') // Supprime "l'" au début
                  .replace(/['\s]/g, '-'); // Remplace apostrophes et espaces par des tirets
                return (
                  <Link
                    key={city}
                    href={`/ramonage-${slug}`}
                    className="text-sm text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    {city}
                  </Link>
                );
              })}
            </div>
            <Link 
              href="/zones-intervention" 
              className="inline-flex items-center gap-1 mt-4 text-primary-400 
                         hover:text-primary-300 text-sm font-medium transition-colors"
            >
              Voir toutes les zones
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-400 block">Téléphone</span>
                    <span className="font-semibold">{siteConfig.contact.phone}</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-secondary-300">
                  <div className="w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-400 block">Email</span>
                    <EmailImageLight size="md" />
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-secondary-300">
                  <div className="w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-400 block">Zone principale</span>
                    <span className="font-semibold">Beauvais et environs</span>
                    <span className="text-sm block">Oise (60) & Val-d'Oise (95)</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-secondary-300">
                  <div className="w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-400 block">Horaires</span>
                    <span className="font-semibold">Lun-Ven: {siteConfig.hours.weekdays}</span>
                    <span className="text-sm block">Sam: {siteConfig.hours.saturday}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bandeau CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-700">
        <div className="container-site py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-display font-bold text-xl mb-1">
                Besoin d'un ramonage ?
              </h3>
              <p className="text-white/80 text-sm">
                Intervention rapide sous 24-48h • Devis gratuit
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.urls.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-primary-700 hover:bg-secondary-50 btn-md"
              >
                <Calendar className="w-4 h-4" />
                Prendre RDV
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="btn bg-secondary-800 text-secondary-300 hover:bg-secondary-700 btn-md text-sm"
              >
                <Phone className="w-4 h-4" />
                Urgences
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-secondary-800">
        <div className="container-site py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-secondary-400 text-sm text-center md:text-left">
              © {currentYear} {siteConfig.company.name}. Tous droits réservés.
              <span className="mx-2">•</span>
              SIRET: {siteConfig.company.siret}
            </div>

            {/* Liens légaux */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/mentions-legales"
                className="text-secondary-400 hover:text-primary-400 transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="text-secondary-400 hover:text-primary-400 transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/cgv"
                className="text-secondary-400 hover:text-primary-400 transition-colors"
              >
                CGV
              </Link>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-800 flex items-center justify-center
                             text-secondary-400 hover:bg-primary-500 hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-800 flex items-center justify-center
                             text-secondary-400 hover:bg-primary-500 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-800 flex items-center justify-center
                             text-secondary-400 hover:bg-primary-500 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-800 flex items-center justify-center
                             text-secondary-400 hover:bg-primary-500 hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
