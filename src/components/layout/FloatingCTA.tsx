'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher après 300px de scroll
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ne pas afficher sur desktop ou si fermé
  if (isDismissed) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'transition-all duration-300 transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
    >
      {/* Fond avec dégradé */}
      <div className="bg-gradient-to-t from-secondary-900 via-secondary-900 to-secondary-900/95 
                      backdrop-blur-sm border-t border-secondary-700">
        <div className="container-site py-3">
          <div className="flex items-center gap-3">
            {/* Bouton RDV - Principal */}
            <a
              href={siteConfig.urls.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] flex items-center justify-center gap-2 
                         bg-primary-500 hover:bg-primary-600 
                         text-white font-semibold py-3.5 rounded-xl
                         transition-colors shadow-lg shadow-primary-500/30"
            >
              <Calendar className="w-5 h-5" />
              <span>Prendre RDV</span>
            </a>

            {/* Bouton Appeler - Secondaire et plus petit */}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
              className="flex-1 flex items-center justify-center gap-2 
                         bg-secondary-700 hover:bg-secondary-600 
                         text-secondary-200 font-medium py-3.5 rounded-xl
                         transition-colors text-sm"
              title="Urgences"
            >
              <Phone className="w-4 h-4" />
              <span>Urgences</span>
            </a>

            {/* Bouton fermer */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 text-secondary-500 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Safe area pour iPhone */}
      <div className="h-safe-area-inset-bottom bg-secondary-900" />
    </div>
  );
}
