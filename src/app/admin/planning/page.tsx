'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, X, Lock, Unlock, Sun, Sunset, 
  CheckCircle2, Clock, CalendarDays, CalendarRange, LayoutList, Phone, 
  MapPin, Map, Navigation, Route, Home, Search, Filter, User, Plus
} from 'lucide-react';

interface DayData {
  date: string;
  dayOfWeek: number;
  morning: { available: boolean; remaining: number; bookings: number };
  afternoon: { available: boolean; remaining: number; bookings: number };
  isPast: boolean;
  isToday: boolean;
  isBlocked: boolean;
}

interface BookingRequest {
  id: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON';
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  serviceType: string;
  status: string;
  lat: number;
  lng: number;
}

interface Technicien {
  id: string;
  name: string;
  color: string;
  startAddress: string;
  startLat: number;
  startLng: number;
}

const DAYS_FROM_MONDAY = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// Mock techniciens
const techniciens: Technicien[] = [
  { id: '1', name: 'DCS RAMONAGE', color: '#3b82f6', startAddress: '15 Rue de la Gare, 60000 Beauvais', startLat: 49.4295, startLng: 2.0807 },
  { id: '2', name: 'Technicien 2', color: '#22c55e', startAddress: '10 Place du Marché, 60100 Creil', startLat: 49.2583, startLng: 2.4833 },
];

// Mock bookings avec coordonnées
const mockBookings: BookingRequest[] = [
  { id: 'br_001', date: new Date().toISOString().split('T')[0], slot: 'MORNING', firstName: 'Jean', lastName: 'Dupont', phone: '06 12 34 56 78', address: '12 rue de la République', city: 'Beauvais', postalCode: '60000', serviceType: 'RAMONAGE', status: 'CONFIRMED', lat: 49.4320, lng: 2.0850 },
  { id: 'br_002', date: new Date().toISOString().split('T')[0], slot: 'MORNING', firstName: 'Marie', lastName: 'Martin', phone: '06 98 76 54 32', address: '45 avenue Jean Jaurès', city: 'Creil', postalCode: '60100', serviceType: 'ENTRETIEN', status: 'CONFIRMED', lat: 49.2600, lng: 2.4900 },
  { id: 'br_003', date: new Date().toISOString().split('T')[0], slot: 'AFTERNOON', firstName: 'Pierre', lastName: 'Bernard', phone: '07 11 22 33 44', address: '8 place Henri IV', city: 'Senlis', postalCode: '60300', serviceType: 'RAMONAGE', status: 'CONFIRMED', lat: 49.2069, lng: 2.5856 },
  { id: 'br_004', date: new Date().toISOString().split('T')[0], slot: 'MORNING', firstName: 'Sophie', lastName: 'Leroy', phone: '06 55 44 33 22', address: '23 rue Victor Hugo', city: 'Chantilly', postalCode: '60500', serviceType: 'DEPANNAGE', status: 'PENDING', lat: 49.1947, lng: 2.4714 },
];

type ViewType = 'day' | 'week' | 'month' | 'map' | 'aplanifier';
type FilterType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'BLOCKED';

export default function PlanningPage() {
  const [viewType, setViewType] = useState<ViewType>('map');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [blockedDays, setBlockedDays] = useState<{ date: string; slot: string | null }[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedTechnicien, setSelectedTechnicien] = useState<Technicien>(techniciens[0]);
  const [optimizedRoute, setOptimizedRoute] = useState<BookingRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { generateCalendar(); }, [currentDate, bookings, blockedDays, viewType]);
  useEffect(() => { if (viewType === 'map') optimizeRoute(); }, [selectedDate, bookings, selectedTechnicien, viewType]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (viewType === 'month') {
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    } else if (viewType === 'week') {
      const dayOfWeek = currentDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() + mondayOffset);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else {
      startDate = new Date(currentDate);
      endDate = new Date(currentDate);
    }
    
    const days: DayData[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = d < new Date(now.toDateString());
      const isToday = d.toDateString() === now.toDateString();
      
      const morningBookings = bookings.filter(b => b.date === dateStr && b.slot === 'MORNING').length;
      const afternoonBookings = bookings.filter(b => b.date === dateStr && b.slot === 'AFTERNOON').length;
      const isBlocked = blockedDays.some(b => b.date === dateStr && b.slot === null);
      
      days.push({
        date: dateStr, dayOfWeek,
        morning: { available: !isWeekend && !isPast && !isBlocked, remaining: Math.max(0, 5 - morningBookings), bookings: morningBookings },
        afternoon: { available: !isWeekend && !isPast && !isBlocked, remaining: Math.max(0, 5 - afternoonBookings), bookings: afternoonBookings },
        isPast, isToday, isBlocked,
      });
    }
    setCalendar(days);
  };

  const navigate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') newDate.setMonth(newDate.getMonth() + delta);
    else if (viewType === 'week') newDate.setDate(newDate.getDate() + (delta * 7));
    else newDate.setDate(newDate.getDate() + delta);
    setCurrentDate(newDate);
    if (viewType === 'day' || viewType === 'map') {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
  };

  const goToToday = () => { 
    setCurrentDate(new Date()); 
    setSelectedDate(new Date().toISOString().split('T')[0]); 
  };

  // Optimisation de tournée (tri par distance depuis point de départ)
  const optimizeRoute = () => {
    const dayBookings = bookings.filter(b => b.date === selectedDate && b.status === 'CONFIRMED');
    if (dayBookings.length === 0) { setOptimizedRoute([]); return; }

    // Algorithme simple: nearest neighbor
    const start = { lat: selectedTechnicien.startLat, lng: selectedTechnicien.startLng };
    const remaining = [...dayBookings];
    const route: BookingRequest[] = [];
    let current = start;

    while (remaining.length > 0) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      remaining.forEach((b, i) => {
        const dist = Math.sqrt(Math.pow(b.lat - current.lat, 2) + Math.pow(b.lng - current.lng, 2));
        if (dist < nearestDist) { nearestDist = dist; nearestIdx = i; }
      });
      const nearest = remaining.splice(nearestIdx, 1)[0];
      route.push(nearest);
      current = { lat: nearest.lat, lng: nearest.lng };
    }
    setOptimizedRoute(route);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const formatDateShort = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const getMondayBasedDay = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1);

  // Stats
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const blockedCount = blockedDays.length;
  const totalCount = bookings.length;

  const dayBookings = bookings.filter(b => b.date === selectedDate);
  const filteredDayBookings = dayBookings.filter(b => {
    if (activeFilter === 'PENDING') return b.status === 'PENDING';
    if (activeFilter === 'CONFIRMED') return b.status === 'CONFIRMED';
    return true;
  }).filter(b => {
    if (!searchQuery) return true;
    return `${b.firstName} ${b.lastName} ${b.city}`.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getViewTitle = () => {
    if (viewType === 'day' || viewType === 'map') return formatDate(selectedDate);
    if (viewType === 'week') {
      const s = calendar[0]?.date, e = calendar[calendar.length - 1]?.date;
      return s && e ? `${formatDateShort(s)} - ${formatDateShort(e)} ${currentDate.getFullYear()}` : '';
    }
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Génération SVG pour la carte avec points et lignes
  const generateMapSVG = () => {
    const allPoints = [
      { lat: selectedTechnicien.startLat, lng: selectedTechnicien.startLng, isStart: true },
      ...optimizedRoute.map(b => ({ lat: b.lat, lng: b.lng, isStart: false }))
    ];

    if (allPoints.length <= 1) return null;

    // Calculer les bounds
    const lats = allPoints.map(p => p.lat);
    const lngs = allPoints.map(p => p.lng);
    const minLat = Math.min(...lats) - 0.02;
    const maxLat = Math.max(...lats) + 0.02;
    const minLng = Math.min(...lngs) - 0.03;
    const maxLng = Math.max(...lngs) + 0.03;

    // Convertir en coordonnées SVG
    const toSVG = (lat: number, lng: number) => ({
      x: ((lng - minLng) / (maxLng - minLng)) * 280 + 10,
      y: ((maxLat - lat) / (maxLat - minLat)) * 180 + 10
    });

    const svgPoints = allPoints.map(p => toSVG(p.lat, p.lng));

    return (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        {/* Ligne de trajet */}
        <polyline
          points={svgPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={selectedTechnicien.color}
          strokeWidth="2"
          strokeDasharray="5,3"
          opacity="0.7"
        />
        
        {/* Points */}
        {svgPoints.map((p, i) => (
          <g key={i}>
            {i === 0 ? (
              // Point de départ (maison)
              <>
                <circle cx={p.x} cy={p.y} r="12" fill={selectedTechnicien.color} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize="10">🏠</text>
              </>
            ) : (
              // Clients numérotés
              <>
                <circle cx={p.x} cy={p.y} r="10" fill={selectedTechnicien.color} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{i}</text>
              </>
            )}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div>
      {/* Header avec filtres */}
      <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-secondary-200">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par titre ou numéro"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-secondary-200 rounded-lg text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <User className="w-4 h-4" /> Client
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <User className="w-4 h-4" /> Intervenant
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Statut
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="text-sm text-secondary-500 hover:text-secondary-700">× Réinitialiser</button>
      </div>

      {/* Onglets de vue */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 border-b border-secondary-200">
          {[
            { type: 'day' as ViewType, label: 'Calendrier' },
            { type: 'week' as ViewType, label: 'Liste' },
            { type: 'map' as ViewType, label: 'Carte ✨' },
            { type: 'month' as ViewType, label: 'Timeline' },
            { type: 'aplanifier' as ViewType, label: 'À planifier' },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                viewType === type ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
          <Plus className="w-4 h-4" /> Planifier
        </button>
      </div>

      {/* Vue Carte */}
      {viewType === 'map' && (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Panneau gauche - Liste */}
          <div className="lg:col-span-2 space-y-4">
            {/* Navigation date + Intervenant */}
            <div className="bg-white rounded-xl border border-secondary-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary-100 rounded">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={goToToday} className="flex items-center gap-2 px-3 py-1.5 border border-secondary-200 rounded-lg text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDateShort(selectedDate)}
                </button>
                <button onClick={() => navigate(1)} className="p-1 hover:bg-secondary-100 rounded">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-500">Intervenant :</span>
                <select
                  value={selectedTechnicien.id}
                  onChange={(e) => setSelectedTechnicien(techniciens.find(t => t.id === e.target.value) || techniciens[0])}
                  className="flex-1 px-3 py-1.5 border border-secondary-200 rounded-lg text-sm font-medium"
                >
                  {techniciens.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sous-filtres */}
            <div className="flex gap-2">
              {[
                { id: 'ALL', label: 'Interventions' },
                { id: 'CONFIRMED', label: 'Maintenances' },
                { id: 'PENDING', label: 'Journée' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as FilterType)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${activeFilter === f.id ? 'bg-secondary-200' : 'bg-white border border-secondary-200'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Liste des RDV */}
            <div className="bg-white rounded-xl border border-secondary-100 p-4">
              <p className="text-sm text-secondary-500 mb-3">
                Sélectionnez l'intervention à planifier puis cliquez sur l'épingle grise pour voir les actions possibles.
              </p>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Filtrer par titre ou numéro"
                  className="w-full pl-9 pr-3 py-2 border border-secondary-200 rounded-lg text-sm"
                />
              </div>

              {filteredDayBookings.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {optimizedRoute.length > 0 ? (
                    optimizedRoute.map((booking, idx) => (
                      <div key={booking.id} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 cursor-pointer">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: selectedTechnicien.color }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{booking.lastName} {booking.firstName}</p>
                          <p className="text-xs text-secondary-500">{booking.address}, {booking.city}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${booking.slot === 'MORNING' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                          {booking.slot === 'MORNING' ? '☀️ Matin' : '🌅 Après-midi'}
                        </span>
                      </div>
                    ))
                  ) : (
                    filteredDayBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{booking.lastName} {booking.firstName}</p>
                          <p className="text-xs text-secondary-500">{booking.city}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {booking.status === 'PENDING' ? 'En attente' : 'Confirmé'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-center text-secondary-400 py-8">Aucun évènement</p>
              )}
            </div>
          </div>

          {/* Panneau droite - Carte */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden h-[500px] relative">
              {/* Contrôles zoom */}
              <div className="absolute top-4 left-4 z-10 flex flex-col bg-white rounded-lg shadow border border-secondary-200">
                <button className="p-2 hover:bg-secondary-50 border-b border-secondary-200">+</button>
                <button className="p-2 hover:bg-secondary-50">−</button>
              </div>

              {/* Légende */}
              <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow border border-secondary-200 p-3">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: selectedTechnicien.color, color: 'white' }}>🏠</div>
                  <span>Point de départ</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: selectedTechnicien.color, color: 'white' }}>1</div>
                  <span>Clients (ordre de tournée)</span>
                </div>
              </div>

              {/* Carte avec overlay SVG */}
              <div className="relative w-full h-full">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=1.8,49.0,3.0,49.6&layer=mapnik`}
                  style={{ border: 0 }}
                  className="absolute inset-0"
                />
                
                {/* Overlay SVG avec points et lignes */}
                <div className="absolute inset-0 pointer-events-none">
                  {generateMapSVG()}
                </div>
              </div>

              {/* Info départ */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow border border-secondary-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedTechnicien.color }}>
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Point de départ</p>
                    <p className="text-xs text-secondary-500">{selectedTechnicien.startAddress}</p>
                  </div>
                  <button onClick={optimizeRoute} className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
                    <Route className="w-4 h-4" /> Optimiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats cliquables (pour autres vues) */}
      {viewType !== 'map' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button onClick={() => setActiveFilter('PENDING')} className={`p-4 rounded-xl border transition-all ${activeFilter === 'PENDING' ? 'border-amber-500 bg-amber-50' : 'border-secondary-100 bg-white hover:border-amber-300'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
                <div className="text-left"><p className="text-2xl font-bold text-secondary-900">{pendingCount}</p><p className="text-sm text-secondary-500">En attente</p></div>
              </div>
            </button>
            <button onClick={() => setActiveFilter('CONFIRMED')} className={`p-4 rounded-xl border transition-all ${activeFilter === 'CONFIRMED' ? 'border-green-500 bg-green-50' : 'border-secondary-100 bg-white hover:border-green-300'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                <div className="text-left"><p className="text-2xl font-bold text-secondary-900">{confirmedCount}</p><p className="text-sm text-secondary-500">Confirmés</p></div>
              </div>
            </button>
            <button onClick={() => setActiveFilter('BLOCKED')} className={`p-4 rounded-xl border transition-all ${activeFilter === 'BLOCKED' ? 'border-red-500 bg-red-50' : 'border-secondary-100 bg-white hover:border-red-300'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Lock className="w-5 h-5 text-red-600" /></div>
                <div className="text-left"><p className="text-2xl font-bold text-secondary-900">{blockedCount}</p><p className="text-sm text-secondary-500">Bloqués</p></div>
              </div>
            </button>
            <button onClick={() => setActiveFilter('ALL')} className={`p-4 rounded-xl border transition-all ${activeFilter === 'ALL' ? 'border-primary-500 bg-primary-50' : 'border-secondary-100 bg-white hover:border-primary-300'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-primary-600" /></div>
                <div className="text-left"><p className="text-2xl font-bold text-secondary-900">{totalCount}</p><p className="text-sm text-secondary-500">Total RDV</p></div>
              </div>
            </button>
          </div>

          {/* Calendrier mois (simplifié) */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-center">
                <h2 className="font-semibold text-lg">{getViewTitle()}</h2>
                <button onClick={goToToday} className="text-sm text-primary-600 hover:underline">Aujourd'hui</button>
              </div>
              <button onClick={() => navigate(1)} className="p-2 hover:bg-secondary-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <p className="text-center text-secondary-500">Vue {viewType} - À compléter</p>
          </div>
        </>
      )}
    </div>
  );
}
