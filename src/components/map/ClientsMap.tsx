'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Client {
  id: string;
  nom: string;
  prenom?: string;
  type: 'PARTICULIER' | 'PROFESSIONNEL';
  adresse: string;
  ville: string;
  codePostal: string;
  lat: number;
  lng: number;
  telephone?: string;
  email?: string;
  nbInterventions: number;
  totalFacture: number;
}

interface ClientsMapProps {
  clients: Client[];
  onClientClick?: (client: Client) => void;
}

function FitBounds({ clients }: { clients: Client[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (clients.length > 0) {
      const bounds = L.latLngBounds(clients.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [clients, map]);
  
  return null;
}

function createClientIcon(type: 'PARTICULIER' | 'PROFESSIONNEL') {
  const color = type === 'PARTICULIER' ? '#3b82f6' : '#8b5cf6';
  const icon = type === 'PARTICULIER' ? '👤' : '🏢';
  
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
    ">${icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export default function ClientsMap({ clients, onClientClick }: ClientsMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-secondary-100 flex items-center justify-center rounded-xl">
        <p className="text-secondary-500">Chargement de la carte...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="w-full h-full bg-secondary-100 flex items-center justify-center rounded-xl">
        <p className="text-secondary-500">Aucun client à afficher</p>
      </div>
    );
  }

  // Centre par défaut (Beauvais)
  const defaultCenter: [number, number] = [49.4295, 2.0807];

  const formatMoney = (amount: number) => 
    amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <FitBounds clients={clients} />
      
      {clients.map((client) => (
        <Marker
          key={client.id}
          position={[client.lat, client.lng]}
          icon={createClientIcon(client.type)}
          eventHandlers={{
            click: () => onClientClick?.(client),
          }}
        >
          <Popup>
            <div className="text-sm min-w-[200px]">
              <p className="font-semibold text-secondary-900">
                {client.type === 'PARTICULIER' 
                  ? `${client.prenom || ''} ${client.nom}`.trim()
                  : client.nom
                }
              </p>
              <p className="text-secondary-500 text-xs mt-1">
                {client.adresse}<br />
                {client.codePostal} {client.ville}
              </p>
              {client.telephone && (
                <p className="text-xs mt-2">
                  <a href={`tel:${client.telephone}`} className="text-primary-600 hover:underline">
                    {client.telephone}
                  </a>
                </p>
              )}
              <div className="flex justify-between mt-2 pt-2 border-t border-secondary-100 text-xs">
                <span className="text-secondary-500">{client.nbInterventions} intervention(s)</span>
                <span className="font-medium text-secondary-900">{formatMoney(client.totalFacture)}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
