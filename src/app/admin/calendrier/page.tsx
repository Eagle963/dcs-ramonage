'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  ChevronLeft, ChevronRight, Calendar, List, Map, Clock, 
  Search, Filter, User, CheckCircle2, XCircle, LayoutGrid,
  MapPin, Phone, Navigation, Plus, MoreVertical
} from 'lucide-react';

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
  startTime?: string;
  endTime?: string;
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
  { id: 'br_001', date: '2026-01-03', slot: 'MORNING', startTime: '08:30', endTime: '09:30', clientName: 'Jean Dupont', clientPhone: '06 12 34 56 78', address: '12 rue de la République', city: 'Beauvais', postalCode: '60000', lat: 49.4320, lng: 2.0850, serviceType: 'Ramonage cheminée', status: 'CONFIRMED', technicianId: '1' },
  { id: 'br_002', date: '2026-01-03', slot: 'MORNING', startTime: '10:00', endTime: '11:00', clientName: 'Marie Martin', clientPhone: '06 98 76 54 32', address: '45 avenue Jean Jaurès', city: 'Creil', postalCode: '60100', lat: 49.2600, lng: 2.4900, serviceType: 'Ramonage poêle', status: 'CONFIRMED', technicianId: '1' },
  { id: 'br_003', date: '2026-01-03', slot: 'AFTERNOON', startTime: '14:00', endTime: '15:30', clientName: 'Pierre Bernard', clientPhone: '07 11 22 33 44', address: '8 place Henri IV', city: 'Senlis', postalCode: '60300', lat: 49.2069, lng: 2.5856, serviceType: 'Entretien insert', status: 'PENDING', technicianId: '1' },
  { id: 'br_004', date: '2026-01-03', slot: 'AFTERNOON', startTime: '16:00', endTime: '17:00', clientName: 'Sophie Leroy', clientPhone: '06 55 44 33 22', address: '23 rue Victor Hugo', city: 'Chantilly', postalCode: '60500', lat: 49.1947, lng: 2.4714, serviceType: 'Ramonage chaudière', status: 'CONFIRMED', technicianId: '1' },
  { id: 'br_005', date: '2026-01-04', slot: 'MORNING', startTime: '09:00', endTime: '10:00', clientName: 'Alain Moreau', clientPhone: '06 77 88 99 00', address: '3 impasse du Château', city: "L'Isle-Adam", postalCode: '95290', lat: 49.1081, lng: 2.2283, serviceType: 'Ramonage cheminée', status: 'CONFIRMED', technicianId: '1' },
  { id: 'br_006', date: '2026-01-05', slot: 'MORNING', startTime: '08:00', endTime: '09:00', clientName: 'HYBA LA MAMMA', clientPhone: '03 44 12 34 56', address: '8 place du Marché', city: 'Senlis', postalCode: '60300', lat: 49.2069, lng: 2.5856, serviceType: 'Entretien professionnel', status: 'CONFIRMED', technicianId: '1' },
];

type ViewType = 'calendar' | 'list' | 'map' | 'timeline' | 'toplan';

export default function PlanningPage() {
  const [viewType, setViewType] = useState<ViewType>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  const selectedTechnician = technicians.find(t => t.id === selectedTechnicianId) || technicians[0];

  const filteredBookings = mockBookings.filter(b => 
    b.date === selectedDate && 
    b.technicianId === selectedTechnicianId &&
    (searchQuery === '' || b.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const changeWeek = (weeks: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (weeks * 7));
    setCurrentWeekStart(newDate);
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const getBookingsForDate = (date: string) => {
    return mockBookings.filter(b => b.date === date && b.technicianId === selectedTechnicianId);
  };

  const statusConfig = {
    PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    CONFIRMED: { label: 'Confirmé', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    COMPLETED: { label: 'Terminé', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    CANCELED: { label: 'Annulé', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  };

  const views = [
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'list', label: 'Liste', icon: List },
    { id: 'map', label: 'Carte', icon: Map },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'toplan', label: 'À planifier', icon: LayoutGrid },
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Nouvelle intervention
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
          />
        </div>
        <select
          value={selectedTechnicianId}
          onChange={(e) => setSelectedTechnicianId(e.target.value)}
          className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
        >
          {technicians.map((tech) => (
            <option key={tech.id} value={tech.id}>{tech.name}</option>
          ))}
        </select>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <CheckCircle2 className="w-4 h-4" /> Statut
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <XCircle className="w-4 h-4" /> Réinitialiser
        </button>
      </div>

      {/* Onglets */}
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

      {/* Vue Calendrier */}
      {viewType === 'calendar' && (
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          {/* Navigation semaine */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-100">
            <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-secondary-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="font-semibold text-secondary-900">
                {currentWeekStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <p className="text-sm text-secondary-500">Semaine du {currentWeekStart.getDate()}</p>
            </div>
            <button onClick={() => changeWeek(1)} className="p-2 hover:bg-secondary-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Grille semaine */}
          <div className="grid grid-cols-7">
            {getWeekDays().map((day) => {
              const isToday = day === new Date().toISOString().split('T')[0];
              const isSelected = day === selectedDate;
              const dayBookings = getBookingsForDate(day);
              
              return (
                <div 
                  key={day} 
                  className={`border-r border-secondary-100 last:border-r-0 min-h-[150px] cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary-50' : 'hover:bg-secondary-50'
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={`p-2 text-center border-b border-secondary-100 ${isToday ? 'bg-primary-500 text-white' : ''}`}>
                    <p className="text-xs font-medium uppercase">
                      {new Date(day).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? '' : 'text-secondary-900'}`}>
                      {new Date(day).getDate()}
                    </p>
                  </div>
                  <div className="p-1 space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <div 
                        key={booking.id}
                        className={`px-2 py-1 rounded text-xs truncate ${statusConfig[booking.status].color}`}
                      >
                        {booking.startTime} - {booking.clientName}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <p className="text-xs text-secondary-500 text-center">+{dayBookings.length - 3} autres</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vue Liste */}
      {viewType === 'list' && (
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-secondary-100">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-secondary-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold capitalize">{formatDate(selectedDate)}</span>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-secondary-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="divide-y divide-secondary-100">
            {filteredBookings.length === 0 ? (
              <p className="p-8 text-center text-secondary-500">Aucune intervention ce jour</p>
            ) : (
              filteredBookings.map((booking) => {
                const status = statusConfig[booking.status];
                return (
                  <div key={booking.id} className="p-4 hover:bg-secondary-50 flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-secondary-900">{booking.startTime}</p>
                      <p className="text-xs text-secondary-500">{booking.endTime}</p>
                    </div>
                    <div className={`w-1 h-12 rounded-full ${status.dot}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-secondary-900">{booking.clientName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600">{booking.serviceType}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-secondary-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {booking.clientPhone}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-secondary-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-secondary-400" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Vue Timeline */}
      {viewType === 'timeline' && (
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-secondary-100">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-secondary-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold capitalize">{formatDate(selectedDate)}</span>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-secondary-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            {/* Heures */}
            <div className="flex">
              <div className="w-20 flex-shrink-0"></div>
              <div className="flex-1 grid grid-cols-11 border-b border-secondary-100">
                {timeSlots.map((time) => (
                  <div key={time} className="p-2 text-center text-xs text-secondary-500 border-l border-secondary-100">
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Technicien */}
            <div className="flex min-h-[100px]">
              <div className="w-20 flex-shrink-0 p-2 border-r border-secondary-100 bg-secondary-50">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: selectedTechnician.color }}
                >
                  {selectedTechnician.name.charAt(0)}
                </div>
                <p className="text-xs text-secondary-600 mt-1 truncate">{selectedTechnician.name}</p>
              </div>
              <div className="flex-1 relative">
                {/* Grille horaire */}
                <div className="absolute inset-0 grid grid-cols-11">
                  {timeSlots.map((_, idx) => (
                    <div key={idx} className="border-l border-secondary-100"></div>
                  ))}
                </div>
                
                {/* RDV */}
                {filteredBookings.map((booking) => {
                  if (!booking.startTime || !booking.endTime) return null;
                  const startHour = parseInt(booking.startTime.split(':')[0]);
                  const startMin = parseInt(booking.startTime.split(':')[1]);
                  const endHour = parseInt(booking.endTime.split(':')[0]);
                  const endMin = parseInt(booking.endTime.split(':')[1]);
                  
                  const startOffset = ((startHour - 8) + startMin / 60) / 11 * 100;
                  const duration = ((endHour - startHour) + (endMin - startMin) / 60) / 11 * 100;
                  
                  return (
                    <div
                      key={booking.id}
                      className="absolute top-2 bottom-2 rounded-lg p-2 text-white text-xs overflow-hidden cursor-pointer hover:opacity-90"
                      style={{
                        left: `${startOffset}%`,
                        width: `${duration}%`,
                        backgroundColor: selectedTechnician.color,
                      }}
                    >
                      <p className="font-medium truncate">{booking.clientName}</p>
                      <p className="opacity-80 truncate">{booking.serviceType}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vue Carte */}
      {viewType === 'map' && (
        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-4">
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
            </div>

            <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
              <div className="p-3 border-b border-secondary-100 flex items-center justify-between">
                <span className="text-sm font-medium">{optimizedBookings.length} interventions</span>
                <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <Navigation className="w-3 h-3" />
                  Optimiser
                </button>
              </div>
              
              <div className="divide-y divide-secondary-100 max-h-[calc(100vh-400px)] overflow-y-auto">
                {optimizedBookings.length === 0 ? (
                  <p className="p-4 text-sm text-secondary-500 text-center">Aucune intervention</p>
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
                              <Clock className="w-3 h-3" />
                              <span>{booking.slot === 'MORNING' ? 'Matin' : 'Après-midi'} {booking.startTime && `- ${booking.startTime}`}</span>
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

          <div className="lg:col-span-8">
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
              <PlanningMap 
                points={mapPoints}
                technicianColor={selectedTechnician.color}
                showRoute={true}
              />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-secondary-500">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: selectedTechnician.color, color: 'white' }}>🏠</div>
                <span>Départ</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: selectedTechnician.color, color: 'white' }}>1</div>
                <span>Clients</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vue À planifier */}
      {viewType === 'toplan' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-8 text-center">
          <LayoutGrid className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
          <h3 className="font-medium text-secondary-900 mb-2">Interventions à planifier</h3>
          <p className="text-secondary-500 text-sm">Les demandes en attente de planification apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
}
      {/* Vue Semaine */}
      {selectedView === 'semaine' && (
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <p className="text-secondary-500 text-center">Vue Semaine - À implémenter</p>
        </div>
      )}

      {/* Vue Jour */}
      {selectedView === 'jour' && (
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <p className="text-secondary-500 text-center">Vue Jour - À implémenter</p>
        </div>
      )}

      {/* Vue Liste */}
      {selectedView === 'liste' && (
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <div className="divide-y divide-secondary-100">
            {bookings.sort((a, b) => a.date.localeCompare(b.date)).map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-4 hover:bg-secondary-50">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="w-24 text-sm text-secondary-500">
                  {new Date(booking.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </div>
                <div className="w-20 text-sm font-medium text-secondary-900">
                  {booking.slot === 'MORNING' ? 'Matin' : 'Après-midi'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">{booking.firstName} {booking.lastName}</p>
                  <p className="text-xs text-secondary-500">{SERVICE_LABELS[booking.serviceType]} - {booking.city}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${booking.status === 'PENDING' 
                    ? 'bg-amber-100 text-amber-700'
                    : booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-secondary-200 text-secondary-600'
                  }`}
                >
                  {booking.status === 'PENDING' ? 'En attente' : 
                   booking.status === 'CONFIRMED' ? 'Confirmé' : booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}