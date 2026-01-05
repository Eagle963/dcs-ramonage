'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function DateRangePicker({ value, onChange, placeholder = "Sélectionner une période" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(new Date(2026, 0, 1)); // Janvier 2026
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Synchroniser tempRange avec value
  useEffect(() => {
    setTempRange(value);
  }, [value]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDisplayText = () => {
    if (value.start && value.end) {
      return `Du ${formatDate(value.start)} au ${formatDate(value.end)}`;
    }
    if (value.start) {
      return `À partir du ${formatDate(value.start)}`;
    }
    return placeholder;
  };

  const navigateMonth = (direction: number) => {
    setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + direction, 1));
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
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
    
    // Compléter pour avoir 42 jours (6 semaines)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const isInRange = (date: Date) => {
    if (!tempRange.start || !tempRange.end) return false;
    return date >= tempRange.start && date <= tempRange.end;
  };

  const isRangeStart = (date: Date) => {
    if (!tempRange.start) return false;
    return date.toDateString() === tempRange.start.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    if (!tempRange.end) return false;
    return date.toDateString() === tempRange.end.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (selecting === 'start') {
      setTempRange({ start: date, end: null });
      setSelecting('end');
    } else {
      if (tempRange.start && date < tempRange.start) {
        setTempRange({ start: date, end: tempRange.start });
      } else {
        setTempRange({ ...tempRange, end: date });
      }
      setSelecting('start');
      // Appliquer la sélection
      const newRange = date < (tempRange.start || date) 
        ? { start: date, end: tempRange.start }
        : { start: tempRange.start, end: date };
      onChange(newRange);
    }
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let start: Date | null = null;
    let end: Date | null = null;

    switch (preset) {
      case 'today':
        start = end = new Date(today);
        break;
      case 'thisWeek':
        start = new Date(today);
        const dayOfWeek = start.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        start.setDate(start.getDate() + diff);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        break;
      case 'lastWeek':
        start = new Date(today);
        const dow = start.getDay();
        const d = dow === 0 ? -6 : 1 - dow;
        start.setDate(start.getDate() + d - 7);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case 'lastYear':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case 'fiscalYear':
        // Exercice comptable actuel (1er janvier au 31 décembre)
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case 'lastFiscalYear':
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case 'none':
        start = null;
        end = null;
        break;
    }

    setTempRange({ start, end });
    onChange({ start, end });
    if (preset !== 'none') {
      setIsOpen(false);
    }
  };

  const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1);

  const presets = [
    { id: 'today', label: "Aujourd'hui" },
    { id: 'thisWeek', label: 'Cette semaine' },
    { id: 'lastWeek', label: 'Semaine dernière' },
    { id: 'thisMonth', label: 'Ce mois' },
    { id: 'lastMonth', label: 'Mois dernier' },
    { id: 'thisYear', label: 'Cette année' },
    { id: 'lastYear', label: 'Année dernière' },
    { id: 'fiscalYear', label: 'Exercice comptable actuel' },
    { id: 'lastFiscalYear', label: 'Exercice comptable précédent' },
    { id: 'none', label: 'Aucune' },
  ];

  const renderCalendar = (monthDate: Date) => {
    const days = getMonthDays(monthDate);
    
    return (
      <div>
        <div className="text-center font-medium text-secondary-900 mb-3">
          {MONTHS[monthDate.getMonth()]}, {monthDate.getFullYear()}
        </div>
        
        {/* En-têtes jours */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-secondary-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const inRange = isInRange(day.date);
            const rangeStart = isRangeStart(day.date);
            const rangeEnd = isRangeEnd(day.date);
            const today = isToday(day.date);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(day.date)}
                className={`
                  relative w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors
                  ${!day.isCurrentMonth ? 'text-secondary-300' : 'text-secondary-700'}
                  ${inRange && !rangeStart && !rangeEnd ? 'bg-primary-100' : ''}
                  ${rangeStart || rangeEnd ? 'bg-primary-500 text-white' : ''}
                  ${today && !rangeStart && !rangeEnd ? 'ring-2 ring-primary-500 ring-offset-1' : ''}
                  ${day.isCurrentMonth && !inRange && !rangeStart && !rangeEnd ? 'hover:bg-secondary-100' : ''}
                `}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Bouton déclencheur */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm text-secondary-700 hover:bg-secondary-50 bg-white"
      >
        <Calendar className="w-4 h-4" />
        <span>{getDisplayText()}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-secondary-200 rounded-xl shadow-xl z-50 flex">
          {/* Raccourcis */}
          <div className="border-r border-secondary-200 py-2 min-w-[180px]">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary-50 transition-colors ${
                  preset.id === 'none' ? 'text-primary-600' : 'text-secondary-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendriers */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-secondary-100 rounded"
              >
                <ChevronLeft className="w-5 h-5 text-secondary-600" />
              </button>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-secondary-100 rounded"
              >
                <ChevronRight className="w-5 h-5 text-secondary-600" />
              </button>
            </div>
            
            <div className="flex gap-8">
              {renderCalendar(leftMonth)}
              {renderCalendar(rightMonth)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
