'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface EmailImageProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Affiche l'email sous forme d'image SVG
 * Les bots ne peuvent pas lire le texte dans une image
 * Le clic ouvre quand même le mailto (reconstruit côté JS)
 */
export function EmailImage({ className = '', showIcon = true, size = 'md' }: EmailImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Reconstruire l'email côté client pour le mailto
  const handleClick = () => {
    const email = `${siteConfig.contact.emailUser}@${siteConfig.contact.emailDomain}`;
    window.location.href = `mailto:${email}`;
  };

  // Tailles selon la prop
  const sizes = {
    sm: { width: 160, height: 18, fontSize: 12 },
    md: { width: 190, height: 22, fontSize: 14 },
    lg: { width: 220, height: 26, fontSize: 16 },
  };

  const { width, height, fontSize } = sizes[size];

  // L'email est "dessiné" dans le SVG, pas en texte HTML
  const emailText = `${siteConfig.contact.emailUser}@${siteConfig.contact.emailDomain}`;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex items-center gap-2 transition-colors cursor-pointer ${className}`}
      aria-label="Envoyer un email"
      title="Cliquez pour envoyer un email"
    >
      {showIcon && (
        <Mail className={`w-4 h-4 ${isHovered ? 'text-primary-500' : ''}`} />
      )}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all ${isHovered ? 'opacity-80' : ''}`}
        role="img"
        aria-label="Adresse email"
      >
        <text
          x="0"
          y={height - 4}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize={fontSize}
          fill={isHovered ? '#f97316' : 'currentColor'}
          className="transition-colors"
        >
          {emailText}
        </text>
      </svg>
    </button>
  );
}

/**
 * Version compacte pour les footers sombres
 */
export function EmailImageLight({ className = '', size = 'md' }: Omit<EmailImageProps, 'showIcon'>) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    const email = `${siteConfig.contact.emailUser}@${siteConfig.contact.emailDomain}`;
    window.location.href = `mailto:${email}`;
  };

  const sizes = {
    sm: { width: 160, height: 18, fontSize: 12 },
    md: { width: 190, height: 22, fontSize: 14 },
    lg: { width: 220, height: 26, fontSize: 16 },
  };

  const { width, height, fontSize } = sizes[size];
  const emailText = `${siteConfig.contact.emailUser}@${siteConfig.contact.emailDomain}`;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block transition-opacity cursor-pointer ${isHovered ? 'opacity-80' : ''} ${className}`}
      aria-label="Envoyer un email"
      title="Cliquez pour envoyer un email"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Adresse email"
      >
        <text
          x="0"
          y={height - 4}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize={fontSize}
          fontWeight="600"
          fill={isHovered ? '#fb923c' : '#ffffff'}
          className="transition-colors"
        >
          {emailText}
        </text>
      </svg>
    </button>
  );
}
