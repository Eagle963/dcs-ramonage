'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Check
} from 'lucide-react';

type ViewType = 'mois' | 'semaine' | 'jour' | 'liste';

interface Booking {
  id: string;
  date: string;
  time: string;
  title: string;
  client: string;
  address: string;
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  color: string;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: '1', date: '2026-01-05', time: '09:03', title: 'Ramonage Cheminée Insert', client: 'Martin Dupont', address: '12 Rue de Paris, 60000 Beauvais', status: 'confirmed', color: '#22c55e' },
  { id: '2', date: '2026-01-05', time: '10:00', title: 'Ramonage Cheminée Ouverte', client: 'Sophie Bernard', address: '45 Avenue Victor Hugo, 60200 Compiègne', status: 'confirmed', color: '#22c55e' },
  { id: '3', date: '2026-01-05', time: '12:30', title: 'Débistrage cheminée poêle', client: 'Jean Leroy', address: '8 Rue du Château, 60300 Senlis', status: 'pending', color: '#22c55e' },
  { id: '4', date: '2026-01-02', time: '09:06', title: 'Entretien + Ramonage Poêle', client: 'Marie Petit', address: '23 Rue de la Gare, 95000 Cergy', status: 'completed', color: '#22c55e' },
  { id: '5', date: '2026-01-02', time: '11:33', title: 'Ramonage & Entretien Poêle', client: 'Pierre Moreau', address: '56 Boulevard Gambetta, 60100 Creil', status: 'completed', color: '#22c55e' },
  { id: '6', date: '2026-01-08', time: '10:00', title: 'Ramonage Poêle à bois', client: 'Lucie Durand', address: '15 Rue des Fleurs, 60500 Chantilly', status: 'confirmed', color: '#22c55e' },
];

const DAYS_SHORT = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export default function CalendrierPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 5)); // 5 janvier 2026
  const [selectedView, setSelectedView] = useState<ViewType>('mois');
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowViewDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date(2026, 0, 5);

  const goToToday = () => setCurrentDate(today);
  
  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (selectedView === 'mois') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (selectedView === 'semaine') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (selectedView === 'jour') {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Jour de la semaine du 1er (0=dim, 1=lun, ...) - on veut que lundi = 0
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
    
    // Jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return MOCK_BOOKINGS.filter(b => b.date === dateStr);
  };

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const formatDateHeader = () => {
    if (selectedView === 'mois') {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (selectedView === 'semaine') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (selectedView === 'jour') {
      return `${currentDate.getDate()} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const viewOptions: { id: ViewType; label: string }[] = [
    { id: 'mois', label: 'Mois' },
    { id: 'semaine', label: 'Semaine' },
    { id: 'jour', label: 'Jour' },
    { id: 'liste', label: 'Liste' },
  ];

  const monthDays = getMonthDays();

  return (
    <div className="h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-secondary-100 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-secondary-600" />
            </button>
            <span className="text-lg font-medium text-secondary-900 min-w-[180px]">
              {formatDateHeader()}
            </span>
            <button 
              onClick={() => navigate(1)}
              className="p-1 hover:bg-secondary-100 rounded"
            >
              <ChevronRight className="w-5 h-5 text-secondary-600" />
            </button>
          </div>
          
          {/* Aujourd'hui */}
          <button 
            onClick={goToToday}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Aujourd'hui
          </button>
        </div>

        {/* View selector dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowViewDropdown(!showViewDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50"
          >
            <ChevronDown className="w-4 h-4" />
            {viewOptions.find(v => v.id === selectedView)?.label}
          </button>
          
          {showViewDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[120px] z-50">
              {viewOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedView(option.id);
                    setShowViewDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                >
                  {option.label}
                  {selectedView === option.id && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vue Mois */}
      {selectedView === 'mois' && (
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden h-[calc(100%-60px)]">
          {/* En-têtes jours */}
          <div className="grid grid-cols-7 border-b border-secondary-200">
            {DAYS_SHORT.map((day) => (
              <div key={day} className="px-2 py-3 text-center text-sm font-medium text-secondary-500 border-r border-secondary-100 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille des jours */}
          <div className="grid grid-cols-7 grid-rows-6 h-[calc(100%-45px)]">
            {monthDays.map((day, index) => {
              const bookings = getBookingsForDate(day.date);
              const dayIsToday = isToday(day.date);
              
              return (
                <div 
                  key={index}
                  className={`border-r border-b border-secondary-100 last:border-r-0 p-1 overflow-hidden ${
                    !day.isCurrentMonth ? 'bg-secondary-50' : ''
                  }`}
                >
                  <div className="flex justify-start mb-1">
                    <span className={`text-sm w-7 h-7 flex items-center justify-center ${
                      dayIsToday 
                        ? 'bg-primary-500 text-white rounded-full font-medium' 
                        : day.isCurrentMonth 
                          ? 'text-secondary-900' 
                          : 'text-secondary-400'
                    }`}>
                      {day.date.getDate()}
                    </span>
                  </div>
                  
                  {/* Bookings */}
                  <div className="space-y-0.5 overflow-hidden">
                    {bookings.slice(0, 3).map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex items-center gap-1 text-xs truncate cursor-pointer hover:bg-secondary-100 rounded px-1"
                      >
                        <span 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: booking.color }}
                        />
                        <span className="text-secondary-600">{booking.time}</span>
                        <span className="text-secondary-900 truncate">{booking.title}</span>
                      </div>
                    ))}
                    {bookings.length > 3 && (
                      <div className="text-xs text-secondary-500 px-1">
                        +{bookings.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            {MOCK_BOOKINGS.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-4 hover:bg-secondary-50">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: booking.color }} />
                <div className="w-24 text-sm text-secondary-500">
                  {new Date(booking.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </div>
                <div className="w-16 text-sm font-medium text-secondary-900">{booking.time}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">{booking.title}</p>
                  <p className="text-xs text-secondary-500">{booking.client} - {booking.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
