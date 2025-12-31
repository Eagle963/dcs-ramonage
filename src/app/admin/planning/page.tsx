'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight, 
  X,
  Lock,
  Unlock,
  Sun,
  Sunset,
  CheckCircle2,
  Clock,
  CalendarDays,
  CalendarRange,
  LayoutList,
  Phone,
  MapPin
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
  postalCode: string;
  serviceType: string;
  equipmentType?: string;
  status: string;
  createdAt: string;
}

const DAYS_FROM_MONDAY = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const SERVICE_LABELS: Record<string, string> = {
  'RAMONAGE': 'Ramonage',
  'ENTRETIEN': 'Entretien poêle',
  'RAMONAGE_ENTRETIEN': 'Ramonage + Entretien',
  'DEPANNAGE': 'Dépannage',
  'DEBISTRAGE': 'Débistrage',
  'TUBAGE': 'Tubage',
  'DIAGNOSTIC': 'Diagnostic',
  'FUMISTERIE': 'Fumisterie',
  'OTHER': 'Autre',
};

const mockBookings: BookingRequest[] = [
  {
    id: 'br_001',
    date: new Date().toISOString().split('T')[0],
    slot: 'MORNING',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '06 12 34 56 78',
    city: 'Beauvais',
    postalCode: '60000',
    serviceType: 'RAMONAGE',
    equipmentType: 'CHIMNEY_INSERT',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'br_002',
    date: new Date().toISOString().split('T')[0],
    slot: 'AFTERNOON',
    firstName: 'Marie',
    lastName: 'Martin',
    phone: '06 98 76 54 32',
    city: 'Creil',
    postalCode: '60100',
    serviceType: 'ENTRETIEN',
    equipmentType: 'PELLET_STOVE',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  },
];

const mockBlockedDays: { date: string; slot: 'MORNING' | 'AFTERNOON' | null; reason?: string }[] = [];

type ViewType = 'day' | 'week' | 'month';

export default function PlanningPage() {
  const [viewType, setViewType] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [blockedDays, setBlockedDays] = useState(mockBlockedDays);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockSlot, setBlockSlot] = useState<'ALL' | 'MORNING' | 'AFTERNOON'>('ALL');

  useEffect(() => {
    generateCalendar();
  }, [currentDate, bookings, blockedDays, viewType]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const now = new Date();
    
    let startDate: Date;
    let endDate: Date;

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
      
      const morningBookings = bookings.filter(
        b => b.date === dateStr && b.slot === 'MORNING' && b.status !== 'CANCELED'
      ).length;
      const afternoonBookings = bookings.filter(
        b => b.date === dateStr && b.slot === 'AFTERNOON' && b.status !== 'CANCELED'
      ).length;
      
      const dayBlock = blockedDays.find(b => b.date === dateStr);
      const isBlocked = !!dayBlock && dayBlock.slot === null;
      const blockedSlot = dayBlock?.slot || null;
      
      const morningAvailable = !isWeekend && !isPast && !isBlocked && blockedSlot !== 'MORNING' && (5 - morningBookings) > 0;
      const afternoonAvailable = !isWeekend && !isPast && !isBlocked && blockedSlot !== 'AFTERNOON' && (5 - afternoonBookings) > 0;
      
      days.push({
        date: dateStr,
        dayOfWeek,
        morning: { available: morningAvailable, remaining: Math.max(0, 5 - morningBookings), bookings: morningBookings },
        afternoon: { available: afternoonAvailable, remaining: Math.max(0, 5 - afternoonBookings), bookings: afternoonBookings },
        isPast,
        isToday,
        isBlocked,
        blockedSlot,
      });
    }
    
    setCalendar(days);
  };

  const navigate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + delta);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (delta * 7));
    } else {
      newDate.setDate(newDate.getDate() + delta);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const selectDay = (day: DayData) => setSelectedDate(day.date);

  const toggleBlockDay = () => {
    if (!selectedDate) return;
    const existingBlock = blockedDays.findIndex(b => b.date === selectedDate);
    if (existingBlock >= 0) {
      setBlockedDays(blockedDays.filter((_, i) => i !== existingBlock));
    } else {
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
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getMondayBasedDay = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1);

  const selectedDayData = calendar.find(d => d.date === selectedDate);
  const selectedDayBookings = bookings.filter(b => b.date === selectedDate);
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;

  const getViewTitle = () => {
    if (viewType === 'day') return formatDate(currentDate.toISOString().split('T')[0]);
    if (viewType === 'week') {
      const s = calendar[0]?.date, e = calendar[calendar.length - 1]?.date;
      return s && e ? `${formatDateShort(s)} - ${formatDateShort(e)} ${currentDate.getFullYear()}` : '';
    }
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayMondayBased = getMondayBasedDay(firstDay.getDay());
    const days: (DayData | null)[] = [...Array(firstDayMondayBased).fill(null), ...calendar];

    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_FROM_MONDAY.map(day => (
            <div key={day} className="text-center text-sm font-medium text-secondary-500 py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="aspect-square" />;
            const isSelected = selectedDate === day.date;
            const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;
            const totalBookings = day.morning.bookings + day.afternoon.bookings;

            return (
              <button
                key={day.date}
                onClick={() => selectDay(day)}
                className={`aspect-square rounded-lg text-sm transition-all relative flex flex-col items-center justify-center
                  ${isSelected ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2' 
                    : day.isBlocked ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : day.isPast || isWeekend ? 'bg-secondary-50 text-secondary-300'
                    : totalBookings > 0 ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-100'}`}
              >
                <span className="font-medium">{new Date(day.date).getDate()}</span>
                {totalBookings > 0 && !isSelected && <span className="text-[10px] font-semibold">{totalBookings}</span>}
                {day.isBlocked && !isSelected && <Lock className="w-3 h-3 absolute top-1 right-1" />}
                {day.isToday && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`} />}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  const renderWeekView = () => (
    <>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS_FROM_MONDAY.map(day => (
          <div key={day} className="text-center text-sm font-medium text-secondary-500 py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendar.map((day) => {
          const isSelected = selectedDate === day.date;
          const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;
          const dayBookings = bookings.filter(b => b.date === day.date);

          return (
            <div
              key={day.date}
              onClick={() => selectDay(day)}
              className={`rounded-lg p-2 min-h-[120px] cursor-pointer transition-all
                ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : day.isBlocked ? 'bg-red-50'
                  : day.isPast || isWeekend ? 'bg-secondary-50'
                  : 'bg-white border border-secondary-100 hover:border-primary-300'}`}
            >
              <div className={`text-center font-medium mb-2 ${day.isToday ? 'text-primary-600' : isWeekend || day.isPast ? 'text-secondary-400' : 'text-secondary-700'}`}>
                {new Date(day.date).getDate()}
              </div>
              {day.isBlocked ? (
                <div className="text-center text-red-500"><Lock className="w-4 h-4 mx-auto" /><span className="text-xs">Bloqué</span></div>
              ) : (
                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className={`text-xs p-1 rounded truncate ${booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {booking.slot === 'MORNING' ? '☀️' : '🌅'} {booking.lastName}
                    </div>
                  ))}
                  {dayBookings.length > 3 && <div className="text-xs text-secondary-500 text-center">+{dayBookings.length - 3}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const renderDayView = () => {
    const day = calendar[0];
    if (!day) return null;
    const dayBookings = bookings.filter(b => b.date === day.date);
    const morningBookings = dayBookings.filter(b => b.slot === 'MORNING');
    const afternoonBookings = dayBookings.filter(b => b.slot === 'AFTERNOON');

    const renderSlot = (slot: 'MORNING' | 'AFTERNOON', slotBookings: BookingRequest[], icon: React.ReactNode, title: string, iconColor: string) => (
      <div className={`rounded-xl border ${day.isBlocked || day.blockedSlot === slot ? 'border-red-200 bg-red-50' : 'border-secondary-200 bg-white'} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">{icon}<h3 className="font-semibold">{title}</h3></div>
          <span className={`text-sm px-2 py-1 rounded-full ${(slot === 'MORNING' ? day.morning.bookings : day.afternoon.bookings) >= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {slot === 'MORNING' ? day.morning.bookings : day.afternoon.bookings}/5 RDV
          </span>
        </div>
        {slotBookings.length > 0 ? (
          <div className="space-y-2">
            {slotBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium">{booking.lastName} {booking.firstName}</p>
                  <p className="text-sm text-secondary-500 flex items-center gap-2"><MapPin className="w-3 h-3" /> {booking.city} <Phone className="w-3 h-3 ml-2" /> {booking.phone}</p>
                  <p className="text-sm text-secondary-600">{SERVICE_LABELS[booking.serviceType]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {booking.status === 'PENDING' ? 'En attente' : 'Confirmé'}
                  </span>
                  {booking.status === 'PENDING' && (
                    <button onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Confirmer</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary-400 text-center py-4">Aucun rendez-vous</p>
        )}
      </div>
    );

    return (
      <div className="space-y-6">
        {renderSlot('MORNING', morningBookings, <Sun className="w-5 h-5 text-amber-500" />, 'Matin (8h - 12h)', 'amber')}
        {renderSlot('AFTERNOON', afternoonBookings, <Sunset className="w-5 h-5 text-orange-500" />, 'Après-midi (14h - 18h)', 'orange')}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Planning</h1>
          <p className="text-secondary-500">Gérez vos disponibilités et rendez-vous</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-secondary-200">
          {[
            { type: 'day' as ViewType, icon: LayoutList, label: 'Jour' },
            { type: 'week' as ViewType, icon: CalendarRange, label: 'Semaine' },
            { type: 'month' as ViewType, icon: CalendarDays, label: 'Mois' },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewType === type ? 'bg-primary-500 text-white' : 'text-secondary-600 hover:bg-secondary-100'}`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Clock, color: 'amber', count: pendingCount, label: 'En attente' },
          { icon: CheckCircle2, color: 'green', count: confirmedCount, label: 'Confirmés' },
          { icon: Lock, color: 'red', count: blockedDays.length, label: 'Bloqués' },
          { icon: Calendar, color: 'primary', count: bookings.length, label: 'Total RDV' },
        ].map(({ icon: Icon, color, count, label }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-secondary-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{count}</p>
                <p className="text-sm text-secondary-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`grid ${viewType === 'day' ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        <div className={`${viewType === 'day' ? '' : 'lg:col-span-2'} bg-white rounded-xl border border-secondary-100 p-6`}>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-secondary-900 capitalize">{getViewTitle()}</h2>
              <button onClick={goToToday} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Aujourd'hui</button>
            </div>
            <button onClick={() => navigate(1)} className="p-2 hover:bg-secondary-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>

          {viewType === 'month' && renderMonthView()}
          {viewType === 'week' && renderWeekView()}
          {viewType === 'day' && renderDayView()}

          {viewType !== 'day' && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-50 border border-green-200" /><span className="text-secondary-600">RDV</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100 border border-red-200" /><span className="text-secondary-600">Bloqué</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-secondary-50 border border-secondary-200" /><span className="text-secondary-600">Passé/Weekend</span></div>
            </div>
          )}
        </div>

        {viewType !== 'day' && (
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            {selectedDate ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-secondary-900 capitalize">{formatDate(selectedDate)}</h3>
                  <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-secondary-100 rounded"><X className="w-4 h-4" /></button>
                </div>
                <button
                  onClick={toggleBlockDay}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-6 ${selectedDayData?.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  {selectedDayData?.isBlocked ? <><Unlock className="w-4 h-4" />Débloquer</> : <><Lock className="w-4 h-4" />Bloquer</>}
                </button>
                {selectedDayData && (
                  <div className="space-y-3 mb-6">
                    <div className={`p-3 rounded-lg border ${selectedDayData.morning.available ? 'border-green-200 bg-green-50' : 'border-secondary-200 bg-secondary-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500" /><span className="font-medium">Matin</span></div>
                        <span className="text-sm">{selectedDayData.morning.bookings}/5</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border ${selectedDayData.afternoon.available ? 'border-green-200 bg-green-50' : 'border-secondary-200 bg-secondary-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Sunset className="w-4 h-4 text-orange-500" /><span className="font-medium">Après-midi</span></div>
                        <span className="text-sm">{selectedDayData.afternoon.bookings}/5</span>
                      </div>
                    </div>
                  </div>
                )}
                <h4 className="text-sm font-medium text-secondary-500 mb-3">RDV ({selectedDayBookings.length})</h4>
                {selectedDayBookings.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayBookings.map((booking) => (
                      <div key={booking.id} className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{booking.lastName} {booking.firstName}</p>
                            <p className="text-sm text-secondary-500">{booking.slot === 'MORNING' ? 'Matin' : 'Après-midi'} • {booking.city}</p>
                            <p className="text-sm text-secondary-500">{SERVICE_LABELS[booking.serviceType]}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {booking.status === 'PENDING' ? 'En attente' : 'Confirmé'}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 mt-1">📞 {booking.phone}</p>
                        {booking.status === 'PENDING' && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Confirmer</button>
                            <button onClick={() => updateBookingStatus(booking.id, 'REJECTED')} className="flex-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Refuser</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-400 text-center py-4">Aucun RDV</p>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-secondary-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Sélectionnez un jour</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowBlockModal(false)} />
          <div className="bg-white rounded-xl p-6 w-full max-w-sm relative z-10">
            <h3 className="text-lg font-semibold mb-4">Bloquer le {formatDate(selectedDate!)}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Créneau</label>
                {[{ value: 'ALL', label: 'Journée entière' }, { value: 'MORNING', label: 'Matin' }, { value: 'AFTERNOON', label: 'Après-midi' }].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer mb-1">
                    <input type="radio" name="blockSlot" value={opt.value} checked={blockSlot === opt.value} onChange={(e) => setBlockSlot(e.target.value as 'ALL' | 'MORNING' | 'AFTERNOON')} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Raison</label>
                <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Ex: Congés" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowBlockModal(false)} className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">Annuler</button>
              <button onClick={confirmBlock} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Bloquer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
