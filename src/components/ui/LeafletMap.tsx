'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LeafletMapProps {
  address: string;
  city: string;
  postalCode: string;
  className?: string;
}

export default function LeafletMap({ address, city, postalCode, className = '' }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS and initialize map
    const initMap = async () => {
      try {
        // @ts-ignore
        if (!window.L) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Leaflet'));
            document.head.appendChild(script);
          });
        }

        // @ts-ignore
        const L = window.L;

        if (!mapRef.current) return;

        // Geocode the address
        const fullAddress = `${address}, ${postalCode} ${city}, France`;
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
        
        const response = await fetch(geocodeUrl, {
          headers: {
            'User-Agent': 'DCS-Ramonage-App/1.0'
          }
        });
        const data = await response.json();

        let lat = 49.25;
        let lon = 2.45;

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lon = parseFloat(data[0].lon);
        } else {
          // Fallback: try with just city
          const cityUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${postalCode} ${city}, France`)}&limit=1`;
          const cityResponse = await fetch(cityUrl, {
            headers: {
              'User-Agent': 'DCS-Ramonage-App/1.0'
            }
          });
          const cityData = await cityResponse.json();
          if (cityData && cityData.length > 0) {
            lat = parseFloat(cityData[0].lat);
            lon = parseFloat(cityData[0].lon);
          }
        }

        // Destroy existing map if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create map
        const map = L.map(mapRef.current).setView([lat, lon], 15);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Custom marker icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: #f97316;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        // Add marker
        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
        marker.bindPopup(`<strong>${address}</strong><br/>${postalCode} ${city}`);
        markerRef.current = marker;

        setIsLoading(false);
        setError(null);

      } catch (err) {
        console.error('Map error:', err);
        setError('Impossible de charger la carte');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [address, city, postalCode]);

  if (error) {
    return (
      <div className={`bg-secondary-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-secondary-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-secondary-100 rounded-xl flex items-center justify-center z-10">
          <div className="text-center text-secondary-500">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Chargement...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
