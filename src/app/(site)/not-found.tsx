import Link from 'next/link';
import { Home, ArrowLeft, Search, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Illustration 404 */}
        <div className="mb-8">
          <div className="text-[150px] font-display font-bold text-secondary-200 leading-none select-none">
            404
          </div>
          <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full" />
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-secondary-600 mb-8">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          <br />
          Pas de panique, voici quelques liens utiles.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/" className="btn-primary btn-lg w-full sm:w-auto">
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link href="/contact" className="btn-outline btn-lg w-full sm:w-auto">
            <Phone className="w-5 h-5" />
            Nous contacter
          </Link>
        </div>

        {/* Liens rapides */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="font-semibold text-secondary-900 mb-4 flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-primary-500" />
            Pages populaires
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link 
              href="/ramonage" 
              className="text-secondary-600 hover:text-primary-500 transition-colors"
            >
              Ramonage
            </Link>
            <Link 
              href="/debistrage" 
              className="text-secondary-600 hover:text-primary-500 transition-colors"
            >
              Débistrage
            </Link>
            <Link 
              href="/tubage-cheminee" 
              className="text-secondary-600 hover:text-primary-500 transition-colors"
            >
              Tubage
            </Link>
            <Link 
              href="/entretien-poele-granules" 
              className="text-secondary-600 hover:text-primary-500 transition-colors"
            >
              Entretien poêles
            </Link>
            <Link 
              href="/tarifs" 
              className="text-secondary-600 hover:text-primary-500 transition-colors"
            >
              Tarifs
            </Link>
            <Link 
              href="/zones-intervention" 
              className="text-secondary-600 hover:text-primary-500 transition-colors"
            >
              Zones d'intervention
            </Link>
          </div>
        </div>

        {/* Numéro de téléphone */}
        <p className="mt-8 text-secondary-500 text-sm">
          Besoin d'aide ? Appelez-nous au{' '}
          <a 
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
            className="text-primary-500 font-medium hover:underline"
          >
            {siteConfig.contact.phone}
          </a>
        </p>
      </div>
    </div>
  );
}
