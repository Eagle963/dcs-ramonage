'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Client {
  id: string;
  reference: string;
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
  archive: boolean;
}

interface ClientsMapProps {
  clients: Client[];
  selectedClientId?: string | null;
  onClientClick?: (client: Client) => void;
}

// Composant pour centrer la carte sur le client sélectionné
function FlyToClient({ client, selectedClientId }: { client: Client | undefined; selectedClientId: string | null | undefined }) {
  const map = useMap();
  
  useEffect(() => {
    if (client && selectedClientId) {
      map.flyTo([client.lat, client.lng], 14, {
        duration: 0.5
      });
    }
  }, [client, selectedClientId, map]);
  
  return null;
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

function createClientIcon(type: 'PARTICULIER' | 'PROFESSIONNEL', isSelected: boolean) {
  const baseColor = type === 'PARTICULIER' ? '#3b82f6' : '#8b5cf6';
  const color = isSelected ? '#f97316' : baseColor; // Orange si sélectionné
  const size = isSelected ? 40 : 32;
  const borderWidth = isSelected ? 4 : 3;
  const icon = type === 'PARTICULIER' ? '👤' : '🏢';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: ${borderWidth}px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 ${isSelected ? '4' : '2'}px ${isSelected ? '12' : '6'}px rgba(0,0,0,${isSelected ? '0.4' : '0.3'});
      font-size: ${isSelected ? '18' : '14'}px;
      transition: all 0.2s ease;
      ${isSelected ? 'z-index: 1000;' : ''}
    ">${icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// Composant Marker individuel pour gérer l'ouverture du popup
function ClientMarker({ 
  client, 
  isSelected, 
  onClientClick,
  formatMoney
}: { 
  client: Client; 
  isSelected: boolean;
  onClientClick?: (client: Client) => void;
  formatMoney: (amount: number) => string;
}) {
  const markerRef = useRef<L.Marker>(null);

  // Ouvrir le popup automatiquement quand le client est sélectionné
  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[client.lat, client.lng]}
      icon={createClientIcon(client.type, isSelected)}
      zIndexOffset={isSelected ? 1000 : 0}
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
  );
}

export default function ClientsMap({ clients, selectedClientId, onClientClick }: ClientsMapProps) {
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

  const defaultCenter: [number, number] = [49.4295, 2.0807];
  const selectedClient = clients.find(c => c.id === selectedClientId);

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
      <FlyToClient client={selectedClient} selectedClientId={selectedClientId} />
      
      {clients.map((client) => (
        <ClientMarker
          key={client.id}
          client={client}
          isSelected={client.id === selectedClientId}
          onClientClick={onClientClick}
          formatMoney={formatMoney}
        />
      ))}
    </MapContainer>
  );
}
