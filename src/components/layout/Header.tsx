'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { 
  Menu, 
  X, 
  Phone, 
  ChevronDown,
  Flame,
  Sparkles,
  Wrench,
  Settings,
  Search,
  Hammer,
  Droplets,
  Calendar
} from 'lucide-react';

// Map des icônes pour les services
const serviceIcons = {
  Flame,
  Sparkles,
  Wrench,
  Settings,
  Search,
  Hammer,
  Droplets,
} as const;

// Navigation principale
const navigation = [
  { name: 'Accueil', href: '/' },
  { 
    name: 'Services', 
    href: '/services',
    children: siteConfig.services.map(service => ({
      name: service.name,
      href: `/${service.slug}`,
      description: service.shortDescription,
      icon: service.icon,
    })),
  },
  { name: 'Zones', href: '/zones-intervention' },
  { name: 'Tarifs', href: '/tarifs' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [pathname]);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-secondary-100' 
          : 'bg-transparent'
      )}
    >
      <nav className="container-site">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            aria-label={`${siteConfig.company.name} - Retour à l'accueil`}
          >
            {/* Icône flamme */}
            <div className={cn(
              'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
              'bg-gradient-to-br from-primary-500 to-accent-600',
              'group-hover:scale-110 group-hover:shadow-glow-primary'
            )}>
              <Flame className="w-6 h-6 text-white" />
              {/* Effet de brillance */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
            
            {/* Texte logo */}
            <div className="flex flex-col">
              <span className={cn(
                'font-display font-bold text-xl tracking-tight transition-colors',
                isScrolled ? 'text-secondary-900' : 'text-secondary-900'
              )}>
                DCS <span className="text-primary-500">Ramonage</span>
              </span>
              <span className={cn(
                'text-xs font-medium transition-colors hidden sm:block',
                isScrolled ? 'text-secondary-500' : 'text-secondary-500'
              )}>
                Oise & Val-d'Oise
              </span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              item.children ? (
                // Menu déroulant pour les services
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      pathname.startsWith('/services') || siteConfig.services.some(s => pathname === `/${s.slug}`)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50'
                    )}
                    aria-expanded={isServicesOpen}
                    aria-haspopup="true"
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isServicesOpen && 'rotate-180'
                    )} />
                  </button>
                  
                  {/* Dropdown */}
                  <div className={cn(
                    'absolute top-full left-0 pt-2 transition-all duration-200',
                    isServicesOpen 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible -translate-y-2'
                  )}>
                    <div className="bg-white rounded-2xl shadow-soft-lg border border-secondary-100 p-2 min-w-[280px]">
                      {item.children.map((child) => {
                        const IconComponent = serviceIcons[child.icon as keyof typeof serviceIcons];
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex items-start gap-3 px-4 py-3 rounded-xl transition-all',
                              pathname === child.href
                                ? 'bg-primary-50 text-primary-700'
                                : 'hover:bg-secondary-50 text-secondary-700'
                            )}
                          >
                            {IconComponent && (
                              <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                pathname === child.href
                                  ? 'bg-primary-100 text-primary-600'
                                  : 'bg-secondary-100 text-secondary-600'
                              )}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span className="font-medium block">{child.name}</span>
                              <span className="text-xs text-secondary-500 line-clamp-1">
                                {child.description}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Lien simple
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50'
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Numéro de téléphone - discret */}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-secondary-400 hover:text-secondary-600 text-sm transition-colors"
              title="Urgences uniquement"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{siteConfig.contact.phone}</span>
            </a>
            
            {/* Bouton RDV - principal */}
            <Link
              href="/contact"
              className="btn-primary btn-md"
            >
              <Calendar className="w-4 h-4" />
              Prendre RDV
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div className={cn(
        'lg:hidden fixed inset-0 top-20 z-40 transition-all duration-300',
        isMobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible pointer-events-none'
      )}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-secondary-900/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu */}
        <div className={cn(
          'absolute top-0 right-0 w-full max-w-sm h-[calc(100vh-5rem)] bg-white shadow-xl',
          'transform transition-transform duration-300 overflow-y-auto',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="p-6 space-y-6">
            {/* Navigation */}
            <nav className="space-y-1">
              {navigation.map((item) => (
                item.children ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-xl',
                        'text-left font-medium transition-all',
                        isServicesOpen 
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-secondary-700 hover:bg-secondary-50'
                      )}
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        'w-5 h-5 transition-transform',
                        isServicesOpen && 'rotate-180'
                      )} />
                    </button>
                    
                    {/* Sous-menu */}
                    <div className={cn(
                      'overflow-hidden transition-all duration-300',
                      isServicesOpen ? 'max-h-96 mt-2' : 'max-h-0'
                    )}>
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 rounded-lg text-sm transition-all',
                              pathname === child.href
                                ? 'bg-primary-100 text-primary-700 font-medium'
                                : 'text-secondary-600 hover:bg-secondary-50'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-4 py-3 rounded-xl font-medium transition-all',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Séparateur */}
            <div className="border-t border-secondary-100" />

            {/* Contact */}
            <div className="space-y-4">
              {/* Bouton RDV - principal */}
              <Link
                href="/contact"
                className="btn-primary btn-lg w-full"
              >
                <Calendar className="w-5 h-5" />
                Prendre rendez-vous
              </Link>
              
              {/* Téléphone - secondaire et discret */}
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                           text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 
                           transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Urgences : {siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
