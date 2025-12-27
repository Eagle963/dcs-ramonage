'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  // Ne pas charger si pas d'ID configuré
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Hook pour tracker les événements personnalisés
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Événements prédéfinis pour DCS Ramonage
export const GA_EVENTS = {
  // Contact
  CONTACT_FORM_SUBMIT: () => trackEvent('submit', 'contact', 'form'),
  CONTACT_PHONE_CLICK: () => trackEvent('click', 'contact', 'phone'),
  CONTACT_EMAIL_CLICK: () => trackEvent('click', 'contact', 'email'),
  
  // Navigation
  CTA_CLICK: (location: string) => trackEvent('click', 'cta', location),
  SERVICE_VIEW: (service: string) => trackEvent('view', 'service', service),
  CITY_VIEW: (city: string) => trackEvent('view', 'city', city),
  
  // Engagement
  TESTIMONIAL_VIEW: () => trackEvent('view', 'testimonial'),
  FAQ_EXPAND: (question: string) => trackEvent('expand', 'faq', question),
  TARIF_VIEW: () => trackEvent('view', 'tarifs'),
};
