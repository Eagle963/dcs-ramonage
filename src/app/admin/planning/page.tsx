'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  ChevronLeft, ChevronRight, Calendar, List, Map, Clock, 
  Search, Filter, User, CheckCircle2, XCircle, LayoutGrid,
  MapPin, Phone, Navigation
} from 'lucide-react';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const PlanningMap = dynamic(() => import('@/components/map/PlanningMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary-100 flex items-center justify-center rounded-xl">
      <p className="text-secondary-500">Chargement de la carte...</p>
    </div>
  ),
});

interface Technician {
  id: string;
  name: string;
  color: string;
  startAddress: string;
  startLat: number;
  startLng: number;
}

interface Booking {
  id: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON';
  clientName: string;
  clientPhone: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  serviceType: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
  technicianId: string;
}

const technicians: Technician[] = [
  { id: '1', name: 'DCS RAMONAGE', color: '#3b82f6', startAddress: '15 Rue de la Gare, 60000 Beauvais', startLat: 49.4295, startLng: 2.0807 },
  { id: '2', name: 'Technicien 2', color: '#22c55e', startAddress: '10 Place du Marché, 60100 Creil', startLat: 49.2583, startLng: 2.4833 },
];

const mockBookings: Booking[] = [
  { id: 'br_001', date: '2026-01-01', slot: 'MORNING', clientName: 'Jean Dupont', clientPhone: '06 12 34 56 78', address: '12 rue de la République', city: 'Beauvais', postalCode: '60000', lat: 49.4320, lng: 2.0850, serviceType: 'Ramonage + Entretien', status: 'CONFIRMED', technicianId: '1' },
  { id: 'br_002', date: '2026-01-01', slot: 'MORNING', clientName: 'Marie Martin', clientPhone: '06 98 76 54 32', address: '45 avenue Jean Jaurès', city: 'Creil', postalCode: '60100', lat: 49.2600, lng: 2.4900, serviceType: 'Ramonage', status: 'CONFIRMED', technicianId: '1' },
  { id: 'br_003', date: '2026-01-01', slot: 'AFTERNOON', clientName: 'Pierre Bernard', clientPhone: '07 11 22 33 44', address: '8 place Henri IV', city: 'Senlis', postalCode: '60300', lat: 49.2069, lng: 2.5856, serviceType: 'Dépannage', status: 'PENDING', technicianId: '1' },
  { id: 'br_004', date: '2026-01-01', slot: 'AFTERNOON', clientName: 'Sophie Leroy', clientPhone: '06 55 44 33 22', address: '23 rue Victor Hugo', city: 'Chantilly', postalCode: '60500', lat: 49.1947, lng: 2.4714, serviceType: 'Entretien', status: 'CONFIRMED', technicianId: '1' },
];

type ViewType = 'calendar' | 'list' | 'map' | 'timeline' | 'toplan';

export default function PlanningPage() {
  const [viewType, setViewType] = useState<ViewType>('map');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTechnician = technicians.find(t => t.id === selectedTechnicianId) || technicians[0];

  // Filtrer les bookings par date et technicien
  const filteredBookings = mockBookings.filter(b => 
    b.date === selectedDate && 
    b.technicianId === selectedTechnicianId &&
    (searchQuery === '' || b.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Optimiser la tournée (algorithme nearest neighbor simple)
  const optimizedBookings = useMemo(() => {
    if (filteredBookings.length === 0) return [];
    
    const sorted = [...filteredBookings];
    const result: Booking[] = [];
    let currentLat = selectedTechnician.startLat;
    let currentLng = selectedTechnician.startLng;
    
    while (sorted.length > 0) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      
      sorted.forEach((booking, idx) => {
        const dist = Math.sqrt(
          Math.pow(booking.lat - currentLat, 2) + 
          Math.pow(booking.lng - currentLng, 2)
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = idx;
        }
      });
      
      const nearest = sorted.splice(nearestIdx, 1)[0];
      result.push(nearest);
      currentLat = nearest.lat;
      currentLng = nearest.lng;
    }
    
    return result;
  }, [filteredBookings, selectedTechnician]);

  // Convertir les bookings en points pour la carte
  const mapPoints = useMemo(() => {
    const points = [
      {
        id: 'start',
        lat: selectedTechnician.startLat,
        lng: selectedTechnician.startLng,
        label: selectedTechnician.name,
        address: selectedTechnician.startAddress,
        type: 'start' as const,
      },
      ...optimizedBookings.map((b, idx) => ({
        id: b.id,
        lat: b.lat,
        lng: b.lng,
        label: b.clientName,
        address: `${b.address}, ${b.postalCode} ${b.city}`,
        type: 'client' as const,
        order: idx + 1,
      })),
    ];
    return points;
  }, [optimizedBookings, selectedTechnician]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const statusConfig = {
    PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
    CONFIRMED: { label: 'Confirmé', color: 'bg-green-100 text-green-700' },
    COMPLETED: { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
    CANCELED: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
  };

  const views = [
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'list', label: 'Liste', icon: List },
    { id: 'map', label: 'Carte', icon: Map },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'toplan', label: 'À planifier', icon: LayoutGrid },
  ];

  return (
    <div>
      {/* Barre de filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par titre, numéro ou chantier"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <User className="w-4 h-4" /> Client
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <User className="w-4 h-4" /> Intervenant
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <CheckCircle2 className="w-4 h-4" /> Statut
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          À facturer
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <XCircle className="w-4 h-4" /> Réinitialiser
        </button>
      </div>

      {/* Onglets de vue */}
      <div className="flex gap-1 mb-4 border-b border-secondary-200">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setViewType(view.id as ViewType)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                viewType === view.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {view.label}
            </button>
          );
        })}
      </div>

      {/* Vue Carte */}
      {viewType === 'map' && (
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Panneau gauche - Liste RDV */}
          <div className="lg:col-span-4 space-y-4">
            {/* Navigation date */}
            <div className="bg-white rounded-xl border border-secondary-100 p-3">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => changeDate(-1)} className="p-1 hover:bg-secondary-100 rounded">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <span className="font-medium text-sm">{formatDate(selectedDate)}</span>
                </div>
                <button onClick={() => changeDate(1)} className="p-1 hover:bg-secondary-100 rounded">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Sélecteur technicien */}
              <select
                value={selectedTechnicianId}
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
              >
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
              </select>
            </div>

            {/* Liste des RDV optimisés */}
            <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
              <div className="p-3 border-b border-secondary-100 flex items-center justify-between">
                <span className="text-sm font-medium">{optimizedBookings.length} interventions</span>
                <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <Navigation className="w-3 h-3" />
                  Optimiser la tournée
                </button>
              </div>
              
              <div className="divide-y divide-secondary-100 max-h-[calc(100vh-400px)] overflow-y-auto">
                {optimizedBookings.length === 0 ? (
                  <p className="p-4 text-sm text-secondary-500 text-center">Aucune intervention ce jour</p>
                ) : (
                  optimizedBookings.map((booking, idx) => {
                    const status = statusConfig[booking.status];
                    return (
                      <div key={booking.id} className="p-3 hover:bg-secondary-50 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: selectedTechnician.color }}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{booking.clientName}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-xs text-secondary-500 mb-1">{booking.serviceType}</p>
                            <div className="flex items-center gap-1 text-xs text-secondary-500">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{booking.address}, {booking.city}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-secondary-500 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{booking.clientPhone}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-secondary-500 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{booking.slot === 'MORNING' ? 'Matin (8h-12h)' : 'Après-midi (14h-18h)'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Panneau droite - Carte */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden h-[calc(100vh-280px)] min-h-[500px]">
              <PlanningMap 
                points={mapPoints}
                technicianColor={selectedTechnician.color}
                showRoute={true}
              />
            </div>
            
            {/* Légende */}
            <div className="mt-2 flex items-center gap-4 text-xs text-secondary-500">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: selectedTechnician.color, color: 'white' }}>🏠</div>
                <span>Point de départ</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: selectedTechnician.color, color: 'white' }}>1</div>
                <span>Clients (ordre de tournée)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-0.5" style={{ backgroundColor: selectedTechnician.color, borderStyle: 'dashed' }}></div>
                <span>Trajet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autres vues (placeholder) */}
      {viewType !== 'map' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-8 text-center">
          <p className="text-secondary-500">Vue {views.find(v => v.id === viewType)?.label} à venir...</p>
        </div>
      )}
    </div>
  );
}
