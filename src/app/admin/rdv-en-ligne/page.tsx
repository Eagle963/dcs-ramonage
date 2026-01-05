'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  Unlock,
  Sun,
  Sunset,
  CheckCircle2,
  Clock,
  X,
  Calendar
} from 'lucide-react';

interface DayData {
  date: string;
  dayOfWeek: number;
  morning: { available: boolean; remaining: number; bookings: number };
  afternoon: { available: boolean; remaining: number; bookings: number };
  isPast: boolean;
  isToday: boolean;
  isBlocked: boolean;
  blockedSlot?: 'MORNING' | 'AFTERNOON' | null;
}

interface BookingRequest {
  id: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON';
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  serviceType: string;
  status: string;
  createdAt: string;
}

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const SERVICE_LABELS: Record<string, string> = {
  'RAMONAGE': 'Ramonage',
  'ENTRETIEN': 'Entretien poêle',
  'DEBISTRAGE': 'Débistrage',
  'TUBAGE': 'Tubage',
  'DIAGNOSTIC': 'Diagnostic',
  'FUMISTERIE': 'Fumisterie',
  'DEPANNAGE': 'Dépannage',
  'OTHER': 'Autre',
};

// Simulation de données (à remplacer par API)
const mockBookings: BookingRequest[] = [
  {
    id: 'br_001',
    date: new Date().toISOString().split('T')[0],
    slot: 'MORNING',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '06 12 34 56 78',
    city: 'Beauvais',
    serviceType: 'RAMONAGE',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'br_002',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    slot: 'AFTERNOON',
    firstName: 'Marie',
    lastName: 'Martin',
    phone: '06 98 76 54 32',
    city: 'Creil',
    serviceType: 'ENTRETIEN',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  },
];

const mockBlockedDays: { date: string; slot: 'MORNING' | 'AFTERNOON' | null; reason?: string }[] = [];

export default function RdvEnLignePage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [calendar, setCalendar] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [blockedDays, setBlockedDays] = useState(mockBlockedDays);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockSlot, setBlockSlot] = useState<'ALL' | 'MORNING' | 'AFTERNOON'>('ALL');

  // Générer le calendrier
  useEffect(() => {
    generateCalendar();
  }, [currentMonth, bookings, blockedDays]);

  const generateCalendar = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const now = new Date();
    
    const days: DayData[] = [];
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = d < new Date(now.toDateString());
      const isToday = d.toDateString() === now.toDateString();
      
      // Compter les réservations
      const morningBookings = bookings.filter(
        b => b.date === dateStr && b.slot === 'MORNING' && b.status !== 'CANCELED'
      ).length;
      const afternoonBookings = bookings.filter(
        b => b.date === dateStr && b.slot === 'AFTERNOON' && b.status !== 'CANCELED'
      ).length;
      
      // Vérifier blocages
      const dayBlock = blockedDays.find(b => b.date === dateStr);
      const isBlocked = !!dayBlock;
      const blockedSlot = dayBlock?.slot || null;
      
      const morningAvailable = !isWeekend && !isPast && !isBlocked && blockedSlot !== 'MORNING' && (5 - morningBookings) > 0;
      const afternoonAvailable = !isWeekend && !isPast && !isBlocked && blockedSlot !== 'AFTERNOON' && (5 - afternoonBookings) > 0;
      
      days.push({
        date: dateStr,
        dayOfWeek,
        morning: {
          available: morningAvailable,
          remaining: Math.max(0, 5 - morningBookings),
          bookings: morningBookings,
        },
        afternoon: {
          available: afternoonAvailable,
          remaining: Math.max(0, 5 - afternoonBookings),
          bookings: afternoonBookings,
        },
        isPast,
        isToday,
        isBlocked: isBlocked && blockedSlot === null,
        blockedSlot,
      });
    }
    
    setCalendar(days);
  };

  const changeMonth = (delta: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    setCurrentMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const selectDay = (day: DayData) => {
    setSelectedDate(day.date);
  };

  const toggleBlockDay = () => {
    if (!selectedDate) return;
    
    const existingBlock = blockedDays.findIndex(b => b.date === selectedDate);
    
    if (existingBlock >= 0) {
      // Débloquer
      setBlockedDays(blockedDays.filter((_, i) => i !== existingBlock));
    } else {
      // Ouvrir modal pour bloquer
      setShowBlockModal(true);
    }
  };

  const confirmBlock = () => {
    if (!selectedDate) return;
    
    const slot = blockSlot === 'ALL' ? null : blockSlot;
    setBlockedDays([...blockedDays, { date: selectedDate, slot, reason: blockReason }]);
    setShowBlockModal(false);
    setBlockReason('');
    setBlockSlot('ALL');
  };

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const selectedDayData = calendar.find(d => d.date === selectedDate);
  const selectedDayBookings = bookings.filter(b => b.date === selectedDate);
  const [year, month] = currentMonth.split('-').map(Number);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  // Stats du mois
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">RDV en ligne</h1>
        <p className="text-secondary-500">Gérez vos disponibilités et demandes de rendez-vous</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{pendingCount}</p>
              <p className="text-sm text-secondary-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{confirmedCount}</p>
              <p className="text-sm text-secondary-500">Confirmés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{blockedDays.length}</p>
              <p className="text-sm text-secondary-500">Jours bloqués</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{bookings.length}</p>
              <p className="text-sm text-secondary-500">Total RDV</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-secondary-100 p-6">
          {/* Header mois */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-secondary-900">
              {MONTHS[month - 1]} {year}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-secondary-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {/* Padding avant */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {calendar.map((day) => {
              const isSelected = selectedDate === day.date;
              const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;
              const totalBookings = day.morning.bookings + day.afternoon.bookings;

              return (
                <button
                  key={day.date}
                  onClick={() => selectDay(day)}
                  className={`
                    aspect-square rounded-lg text-sm transition-all relative
                    flex flex-col items-center justify-center
                    ${isSelected 
                      ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2' 
                      : day.isBlocked
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : day.isPast || isWeekend
                          ? 'bg-secondary-50 text-secondary-300'
                          : totalBookings > 0
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-100'
                    }
                  `}
                >
                  <span className="font-medium">{new Date(day.date).getDate()}</span>
                  {totalBookings > 0 && !isSelected && (
                    <span className="text-[10px] font-semibold">{totalBookings} RDV</span>
                  )}
                  {day.isBlocked && !isSelected && (
                    <Lock className="w-3 h-3 absolute top-1 right-1" />
                  )}
                  {day.isToday && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
              <span className="text-secondary-600">RDV</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
              <span className="text-secondary-600">Bloqué</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary-50 border border-secondary-200" />
              <span className="text-secondary-600">Passé/Weekend</span>
            </div>
          </div>
        </div>

        {/* Panneau détails jour */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900 capitalize">
                  {formatDate(selectedDate)}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1 hover:bg-secondary-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={toggleBlockDay}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedDayData?.isBlocked 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                >
                  {selectedDayData?.isBlocked ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      Débloquer
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Bloquer
                    </>
                  )}
                </button>
              </div>

              {/* Créneaux */}
              {selectedDayData && (
                <div className="space-y-3 mb-6">
                  <div className={`p-3 rounded-lg border ${
                    selectedDayData.morning.available 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-secondary-200 bg-secondary-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span className="font-medium">Matin</span>
                      </div>
                      <span className="text-sm">
                        {selectedDayData.morning.bookings}/5 RDV
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    selectedDayData.afternoon.available 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-secondary-200 bg-secondary-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">Après-midi</span>
                      </div>
                      <span className="text-sm">
                        {selectedDayData.afternoon.bookings}/5 RDV
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des RDV du jour */}
              <div>
                <h4 className="text-sm font-medium text-secondary-500 mb-3">
                  Rendez-vous ({selectedDayBookings.length})
                </h4>
                {selectedDayBookings.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-3 bg-secondary-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-secondary-900">
                              {booking.firstName} {booking.lastName}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {booking.slot === 'MORNING' ? 'Matin' : 'Après-midi'} • {booking.city}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {SERVICE_LABELS[booking.serviceType]}
                            </p>
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
                        <p className="text-sm text-secondary-600 mt-1">
                          📞 {booking.phone}
                        </p>
                        {booking.status === 'PENDING' && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                              className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                              className="flex-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-400 text-center py-4">
                    Aucun rendez-vous ce jour
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-secondary-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sélectionnez un jour pour voir les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal blocage */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowBlockModal(false)} />
          <div className="bg-white rounded-xl p-6 w-full max-w-sm relative z-10">
            <h3 className="text-lg font-semibold mb-4">Bloquer le {formatDate(selectedDate!)}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Créneau à bloquer
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'ALL', label: 'Journée entière' },
                    { value: 'MORNING', label: 'Matin uniquement' },
                    { value: 'AFTERNOON', label: 'Après-midi uniquement' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="blockSlot"
                        value={option.value}
                        checked={blockSlot === option.value}
                        onChange={(e) => setBlockSlot(e.target.value as 'ALL' | 'MORNING' | 'AFTERNOON')}
                        className="text-primary-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Raison (optionnel)
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Congés, Formation..."
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmBlock}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Bloquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
