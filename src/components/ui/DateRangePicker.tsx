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
const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

export default function DateRangePicker({ value, onChange, placeholder = "Sélectionner une période" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
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

  const getMonthDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Lundi = 0, Dimanche = 6
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

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isInRange = (date: Date) => {
    if (!tempRange.start || !tempRange.end) return false;
    const time = date.getTime();
    return time > tempRange.start.getTime() && time < tempRange.end.getTime();
  };

  const isRangeStart = (date: Date) => {
    if (!tempRange.start) return false;
    return isSameDay(date, tempRange.start);
  };

  const isRangeEnd = (date: Date) => {
    if (!tempRange.end) return false;
    return isSameDay(date, tempRange.end);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const handleDateClick = (date: Date) => {
    if (selecting === 'start') {
      setTempRange({ start: date, end: null });
      setSelecting('end');
    } else {
      if (tempRange.start && date < tempRange.start) {
        setTempRange({ start: date, end: tempRange.start });
        onChange({ start: date, end: tempRange.start });
      } else {
        setTempRange({ start: tempRange.start, end: date });
        onChange({ start: tempRange.start, end: date });
      }
      setSelecting('start');
    }
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let start: Date | null = null;
    let end: Date | null = null;

    switch (preset) {
      case 'today':
        start = new Date(today);
        end = new Date(today);
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
      <div style={{ width: '224px' }}>
        {/* Titre du mois */}
        <div className="text-center font-medium text-secondary-900 mb-3 text-sm">
          {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
        </div>
        
        {/* En-têtes jours */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {DAYS.map(day => (
                <th key={day} className="w-8 h-8 text-xs font-medium text-secondary-500 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Diviser days en semaines de 7 jours */}
            {Array.from({ length: 6 }).map((_, weekIndex) => (
              <tr key={weekIndex}>
                {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                  const inRange = isInRange(day.date);
                  const rangeStart = isRangeStart(day.date);
                  const rangeEnd = isRangeEnd(day.date);
                  const todayDate = isToday(day.date);
                  
                  let bgClass = '';
                  let textClass = day.isCurrentMonth ? 'text-secondary-700' : 'text-secondary-300';
                  let roundedClass = '';
                  
                  if (rangeStart && rangeEnd) {
                    bgClass = 'bg-primary-500';
                    textClass = 'text-white';
                    roundedClass = 'rounded-full';
                  } else if (rangeStart) {
                    bgClass = 'bg-primary-500';
                    textClass = 'text-white';
                    roundedClass = 'rounded-l-full';
                  } else if (rangeEnd) {
                    bgClass = 'bg-primary-500';
                    textClass = 'text-white';
                    roundedClass = 'rounded-r-full';
                  } else if (inRange) {
                    bgClass = 'bg-primary-50';
                  }
                  
                  if (todayDate && !rangeStart && !rangeEnd) {
                    textClass = 'text-primary-600 font-bold';
                  }
                  
                  return (
                    <td key={dayIndex} className="p-0">
                      <button
                        type="button"
                        onClick={() => handleDateClick(day.date)}
                        className={`w-8 h-8 text-xs flex items-center justify-center transition-colors hover:bg-secondary-100 ${bgClass} ${textClass} ${roundedClass}`}
                      >
                        {day.date.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
          <div className="border-r border-secondary-200 py-2" style={{ width: '200px' }}>
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
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4 px-2">
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
            
            {/* 2 calendriers côte à côte */}
            <div className="flex gap-6">
              {renderCalendar(leftMonth)}
              {renderCalendar(rightMonth)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
