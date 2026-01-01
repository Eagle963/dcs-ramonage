'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  address: string;
  type: 'start' | 'client';
  order?: number;
}

interface PlanningMapProps {
  points: MapPoint[];
  technicianColor: string;
  showRoute?: boolean;
}

// Composant pour ajuster la vue sur tous les points
function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  
  return null;
}

// Créer une icône personnalisée pour le point de départ
function createStartIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-size: 14px;
    ">🏠</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Créer une icône numérotée pour les clients
function createClientIcon(color: string, order: number) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">${order}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export default function PlanningMap({ points, technicianColor, showRoute = true }: PlanningMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
        <p className="text-secondary-500">Chargement de la carte...</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
        <p className="text-secondary-500">Aucun point à afficher</p>
      </div>
    );
  }

  // Centre par défaut (Beauvais)
  const defaultCenter: [number, number] = [49.4295, 2.0807];
  const center: [number, number] = points.length > 0 
    ? [points[0].lat, points[0].lng] 
    : defaultCenter;

  // Points pour le tracé de la route
  const routePoints: [number, number][] = points
    .sort((a, b) => {
      if (a.type === 'start') return -1;
      if (b.type === 'start') return 1;
      return (a.order || 0) - (b.order || 0);
    })
    .map(p => [p.lat, p.lng]);

  return (
    <MapContainer
      center={center}
      zoom={10}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <FitBounds points={points} />
      
      {/* Tracé de la route */}
      {showRoute && routePoints.length > 1 && (
        <Polyline
          positions={routePoints}
          color={technicianColor}
          weight={3}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}
      
      {/* Marqueurs */}
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={point.type === 'start' 
            ? createStartIcon(technicianColor)
            : createClientIcon(technicianColor, point.order || 0)
          }
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{point.label}</p>
              <p className="text-secondary-600">{point.address}</p>
              {point.type === 'start' && (
                <p className="text-xs text-primary-600 mt-1">Point de départ</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
