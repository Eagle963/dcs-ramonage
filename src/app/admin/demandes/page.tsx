'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, CheckCircle2, XCircle, Clock, Phone, Mail, MapPin, Calendar, Eye, X, ExternalLink } from 'lucide-react';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const LeafletMap = dynamic(() => import('@/components/ui/LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-secondary-100 rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-secondary-500">
        <MapPin className="w-8 h-8 animate-pulse" />
        <span className="text-sm">Chargement de la carte...</span>
      </div>
    </div>
  )
});

interface BookingRequest {
  id: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  serviceType: string;
  equipmentType?: string;
  brand?: string;
  model?: string;
  exhaustType?: string;
  message?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = { 
  'RAMONAGE': 'Ramonage', 
  'ENTRETIEN': 'Entretien', 
  'RAMONAGE_ENTRETIEN': 'Ramonage + Entretien', 
  'DEPANNAGE': 'Dépannage', 
  'DEBISTRAGE': 'Débistrage', 
  'TUBAGE': 'Tubage', 
  'DIAGNOSTIC': 'Diagnostic', 
  'DEVIS': 'Devis', 
  'NETTOYAGE': 'Nettoyage', 
  'OTHER': 'Autre' 
};

const EQUIPMENT_LABELS: Record<string, string> = { 
  'WOOD_STOVE': 'Poêle à bois', 
  'PELLET_STOVE': 'Poêle à granulés', 
  'CHIMNEY_OPEN': 'Cheminée ouverte', 
  'CHIMNEY_INSERT': 'Insert', 
  'OIL_BOILER': 'Chaudière fioul', 
  'GAS_BOILER': 'Chaudière gaz', 
  'WOOD_BOILER': 'Chaudière bois', 
  'POLYFLAM': 'Cheminée Polyflam', 
  'CONDUIT_DIFFICILE': 'Conduit difficile', 
  'OTHER': 'Autre' 
};

const EXHAUST_LABELS: Record<string, string> = { 
  'VENTOUSE': 'Ventouse', 
  'TOITURE': 'Toiture' 
};

const STATUS_CONFIG = {
  PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  CONFIRMED: { label: 'Confirmé', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  REJECTED: { label: 'Refusé', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELED: { label: 'Annulé', color: 'bg-secondary-100 text-secondary-600', icon: XCircle },
};

const mockBookings: BookingRequest[] = [
  { 
    id: 'br_001', 
    date: new Date().toISOString().split('T')[0], 
    slot: 'MORNING', 
    firstName: 'Jean', 
    lastName: 'Dupont', 
    email: 'jean.dupont@email.fr', 
    phone: '06 12 34 56 78', 
    address: '12 rue de la République', 
    city: 'Beauvais', 
    postalCode: '60000', 
    serviceType: 'RAMONAGE_ENTRETIEN', 
    equipmentType: 'PELLET_STOVE', 
    brand: 'MCZ', 
    model: 'Ego 2.0', 
    exhaustType: 'TOITURE', 
    message: 'Entretien annuel.', 
    status: 'PENDING', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'br_002', 
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
    slot: 'AFTERNOON', 
    firstName: 'Marie', 
    lastName: 'Martin', 
    email: 'marie.martin@email.fr', 
    phone: '06 98 76 54 32', 
    address: '45 avenue Jean Jaurès', 
    city: 'Creil', 
    postalCode: '60100', 
    serviceType: 'RAMONAGE', 
    equipmentType: 'CHIMNEY_INSERT', 
    status: 'CONFIRMED', 
    createdAt: new Date(Date.now() - 86400000).toISOString() 
  },
  { 
    id: 'br_003', 
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], 
    slot: 'MORNING', 
    firstName: 'Pierre', 
    lastName: 'Bernard', 
    email: 'p.bernard@email.fr', 
    phone: '07 11 22 33 44', 
    address: '8 place Henri IV', 
    city: 'Senlis', 
    postalCode: '60300', 
    serviceType: 'DEPANNAGE', 
    equipmentType: 'PELLET_STOVE', 
    brand: 'Edilkamin', 
    model: 'Nara', 
    exhaustType: 'VENTOUSE', 
    message: 'Erreur E03.', 
    status: 'PENDING', 
    createdAt: new Date(Date.now() - 3600000).toISOString() 
  },
];

export default function DemandesPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const updateStatus = (id: string, status: 'CONFIRMED' | 'REJECTED', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status });
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });
  
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const getGoogleMapsUrl = (b: BookingRequest) => 
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, ${b.postalCode} ${b.city}, France`)}`;

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Demandes de RDV</h1>
          <p className="text-secondary-500">
            {pendingCount > 0 
              ? `${pendingCount} demande${pendingCount > 1 ? 's' : ''} en attente` 
              : 'Aucune demande en attente'}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, ville, téléphone..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-4 py-2 border border-secondary-200 rounded-lg bg-white"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmés</option>
            <option value="REJECTED">Refusés</option>
          </select>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="divide-y divide-secondary-100">
            {filteredBookings.map((booking) => {
              const cfg = STATUS_CONFIG[booking.status];
              return (
                <div 
                  key={booking.id} 
                  onClick={() => setSelectedBooking(booking)}
                  className="p-4 hover:bg-secondary-50 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{booking.lastName} {booking.firstName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 text-sm text-secondary-500">
                        <span>
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(booking.date)} • {booking.slot === 'MORNING' ? 'Matin' : 'Après-midi'}
                        </span>
                        <span>
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {booking.city}
                        </span>
                        <span>
                          {EQUIPMENT_LABELS[booking.equipmentType || ''] || SERVICE_LABELS[booking.serviceType]}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={(e) => updateStatus(booking.id, 'CONFIRMED', e)} 
                            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Confirmer
                          </button>
                          <button 
                            onClick={(e) => updateStatus(booking.id, 'REJECTED', e)} 
                            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }} 
                        className="px-3 py-1.5 border border-secondary-200 text-sm rounded-lg hover:bg-secondary-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-secondary-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune demande trouvée</p>
          </div>
        )}
      </div>

      {/* Modal détails */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedBooking(null)} />
          <div className="bg-white rounded-xl w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Détails de la demande</h3>
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Colonne gauche - Infos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_CONFIG[selectedBooking.status].color}`}>
                    {STATUS_CONFIG[selectedBooking.status].label}
                  </span>
                  <span className="text-sm text-secondary-500">
                    Reçu le {formatDateTime(selectedBooking.createdAt)}
                  </span>
                </div>

                {/* Date RDV */}
                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="font-semibold capitalize">
                    {new Date(selectedBooking.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                  <p className="text-secondary-600">
                    {selectedBooking.slot === 'MORNING' ? 'Matin (8h-12h)' : 'Après-midi (14h-18h)'}
                  </p>
                </div>

                {/* Équipement */}
                <div>
                  <h4 className="text-sm text-secondary-500 mb-1">Équipement</h4>
                  <p className="font-medium">{EQUIPMENT_LABELS[selectedBooking.equipmentType || '']}</p>
                  <p className="text-secondary-600">{SERVICE_LABELS[selectedBooking.serviceType]}</p>
                </div>

                {/* Marque / Modèle */}
                {selectedBooking.brand && (
                  <div>
                    <h4 className="text-sm text-secondary-500 mb-1">Marque / Modèle</h4>
                    <p>{selectedBooking.brand} {selectedBooking.model}</p>
                  </div>
                )}

                {/* Type de sortie */}
                {selectedBooking.exhaustType && (
                  <div>
                    <h4 className="text-sm text-secondary-500 mb-1">Type de sortie</h4>
                    <p>{EXHAUST_LABELS[selectedBooking.exhaustType]}</p>
                  </div>
                )}

                {/* Contact */}
                <div>
                  <h4 className="text-sm text-secondary-500 mb-1">Contact</h4>
                  <p className="font-medium">{selectedBooking.lastName} {selectedBooking.firstName}</p>
                  <a href={`tel:${selectedBooking.phone}`} className="text-primary-600 flex items-center gap-1 hover:underline">
                    <Phone className="w-4 h-4" />{selectedBooking.phone}
                  </a>
                  <a href={`mailto:${selectedBooking.email}`} className="text-primary-600 flex items-center gap-1 hover:underline">
                    <Mail className="w-4 h-4" />{selectedBooking.email}
                  </a>
                </div>

                {/* Adresse */}
                <div>
                  <h4 className="text-sm text-secondary-500 mb-1">Adresse</h4>
                  <p>{selectedBooking.address}</p>
                  <p>{selectedBooking.postalCode} {selectedBooking.city}</p>
                </div>

                {/* Message */}
                {selectedBooking.message && (
                  <div>
                    <h4 className="text-sm text-secondary-500 mb-1">Message du client</h4>
                    <p className="bg-secondary-50 p-3 rounded-lg text-sm">{selectedBooking.message}</p>
                  </div>
                )}

                {/* Actions */}
                {selectedBooking.status === 'PENDING' && (
                  <div className="flex gap-2 pt-4 border-t border-secondary-200">
                    <button 
                      onClick={() => updateStatus(selectedBooking.id, 'CONFIRMED')} 
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      Confirmer
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedBooking.id, 'REJECTED')} 
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>

              {/* Colonne droite - Carte */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-secondary-500">Localisation</h4>
                  <a 
                    href={getGoogleMapsUrl(selectedBooking)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary-600 text-sm flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir dans Maps
                  </a>
                </div>
                <div className="rounded-xl overflow-hidden border border-secondary-200 h-80">
                  <LeafletMap
                    address={selectedBooking.address}
                    city={selectedBooking.city}
                    postalCode={selectedBooking.postalCode}
                    className="h-full"
                  />
                </div>
                <p className="text-xs text-secondary-400 mt-2 text-center">
                  {selectedBooking.address}, {selectedBooking.postalCode} {selectedBooking.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
