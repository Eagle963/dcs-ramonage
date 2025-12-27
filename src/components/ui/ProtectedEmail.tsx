'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface ProtectedEmailProps {
  showIcon?: boolean;
  className?: string;
  linkClassName?: string;
}

/**
 * Composant qui affiche l'email de manière protégée contre les bots
 * L'email est reconstruit uniquement côté client via JavaScript
 * Les bots qui scrapent le HTML ne verront pas l'email
 */
export function ProtectedEmail({ 
  showIcon = true, 
  className = '',
  linkClassName = ''
}: ProtectedEmailProps) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Reconstruire l'email uniquement côté client
    // Les bots ne peuvent pas exécuter JavaScript
    const { emailUser, emailDomain } = siteConfig.contact;
    setEmail(`${emailUser}@${emailDomain}`);
  }, []);

  const handleClick = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  // Avant le chargement JS, afficher un placeholder
  if (!email) {
    return (
      <span className={className}>
        {showIcon && <Mail className="w-4 h-4 inline mr-2" />}
        <span className="text-secondary-400">Chargement...</span>
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 hover:text-primary-500 transition-colors ${linkClassName}`}
    >
      {showIcon && <Mail className="w-4 h-4" />}
      <span className={className}>{email}</span>
    </button>
  );
}

/**
 * Hook pour obtenir l'email côté client uniquement
 */
export function useProtectedEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const { emailUser, emailDomain } = siteConfig.contact;
    setEmail(`${emailUser}@${emailDomain}`);
  }, []);

  return email;
}

/**
 * Fonction pour créer un lien mailto protégé
 * À utiliser dans les handlers onClick uniquement
 */
export function getMailtoLink(): string {
  const { emailUser, emailDomain } = siteConfig.contact;
  return `mailto:${emailUser}@${emailDomain}`;
}
