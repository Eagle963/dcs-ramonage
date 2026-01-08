'use client';

import { useEffect, useRef } from 'react';

export default function ReservationPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Ajuster la hauteur de l'iframe dynamiquement
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Recevoir la hauteur du contenu depuis l'iframe
      if (event.data?.type === 'widget-resize' && event.data?.height) {
        if (iframeRef.current) {
          iframeRef.current.style.height = `${event.data.height + 50}px`; // +50 pour marge de sécurité
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      {/* Header de la page */}
      <section className="pt-32 pb-12 bg-mesh">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge-primary mb-4">Réservation en ligne</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Prenez rendez-vous
            </h1>
            <p className="text-secondary-600">
              Choisissez votre créneau et nous vous recontactons pour confirmer.
            </p>
          </div>
        </div>
      </section>

      {/* Widget de réservation via iframe */}
      <section className="section-padding">
        <div className="container-site max-w-4xl">
          <iframe
            ref={iframeRef}
            src="/admin/dcs-ramonage?embed=true"
            className="w-full border-0 min-h-[600px]"
            style={{ height: '800px' }}
            title="Widget de réservation"
            allow="geolocation"
          />
        </div>
      </section>
    </>
  );
}
