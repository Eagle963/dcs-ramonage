'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sun,
  Sunset
} from 'lucide-react';

// Types
interface DayAvailability {
  date: string;
  dayOfWeek: number;
  morning: { available: boolean; remaining: number };
  afternoon: { available: boolean; remaining: number };
  isPast: boolean;
  isToday: boolean;
}

const SERVICES = [
  { value: 'RAMONAGE', label: 'Ramonage' },
  { value: 'ENTRETIEN', label: 'Entretien poêle à granulés' },
  { value: 'DEBISTRAGE', label: 'Débistrage' },
  { value: 'TUBAGE', label: 'Tubage' },
  { value: 'DIAGNOSTIC', label: 'Diagnostic / Inspection' },
  { value: 'FUMISTERIE', label: 'Fumisterie' },
  { value: 'DEPANNAGE', label: 'Dépannage' },
  { value: 'OTHER', label: 'Autre' },
];

const EQUIPMENT_TYPES = [
  { value: 'CHIMNEY_OPEN', label: 'Cheminée ouverte' },
  { value: 'CHIMNEY_INSERT', label: 'Insert / Foyer fermé' },
  { value: 'WOOD_STOVE', label: 'Poêle à bois' },
  { value: 'PELLET_STOVE', label: 'Poêle à granulés' },
  { value: 'OIL_BOILER', label: 'Chaudière fioul' },
  { value: 'GAS_BOILER', label: 'Chaudière gaz' },
  { value: 'WOOD_BOILER', label: 'Chaudière bois' },
  { value: 'OTHER', label: 'Autre' },
];

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function ReservationPage() {
  // États
  const [step, setStep] = useState(1); // 1: CP, 2: Calendrier, 3: Formulaire, 4: Confirmation
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'MORNING' | 'AFTERNOON' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingId, setBookingId] = useState('');

  // Formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    serviceType: '',
    equipmentType: '',
    message: '',
  });

  // Charger les disponibilités
  const fetchAvailability = async (month: string, cp: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/booking/availability?month=${month}&postalCode=${cp}`);
      const data = await res.json();
      
      if (data.success) {
        setAvailability(data.availability);
      } else {
        setPostalCodeError(data.message);
        setStep(1);
      }
    } catch (error) {
      console.error('Erreur chargement disponibilités:', error);
    }
    setLoading(false);
  };

  // Vérifier le code postal
  const checkPostalCode = () => {
    const cp = postalCode.trim();
    if (cp.length !== 5) {
      setPostalCodeError('Le code postal doit contenir 5 chiffres');
      return;
    }
    if (!cp.startsWith('60') && !cp.startsWith('95')) {
      setPostalCodeError('Désolé, nous n\'intervenons que dans l\'Oise (60) et le Val-d\'Oise (95)');
      return;
    }
    setPostalCodeError('');
    setStep(2);
    fetchAvailability(currentMonth, cp);
  };

  // Changer de mois
  const changeMonth = (delta: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
    fetchAvailability(newMonth, postalCode);
  };

  // Sélectionner un jour
  const selectDay = (day: DayAvailability) => {
    if (day.isPast || (!day.morning.available && !day.afternoon.available)) return;
    setSelectedDate(day.date);
    setSelectedSlot(null);
  };

  // Sélectionner un créneau
  const selectSlot = (slot: 'MORNING' | 'AFTERNOON') => {
    setSelectedSlot(slot);
    setStep(3);
  };

  // Soumettre la demande
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          slot: selectedSlot,
          ...formData,
          postalCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingId(data.bookingId);
        setStep(4);
      } else {
        setSubmitError(data.errors?.join(', ') || data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setSubmitError('Erreur de connexion. Veuillez réessayer.');
    }

    setSubmitting(false);
  };

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Rendu du calendrier
  const renderCalendar = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const startPadding = firstDay.getDay();
    
    const days: (DayAvailability | null)[] = [];
    
    // Padding avant
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Jours du mois
    availability.forEach(day => {
      days.push(day);
    });

    return (
      <div className="bg-white rounded-2xl shadow-soft p-6">
        {/* Header mois */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-secondary-900">
            {MONTHS[month - 1]} {year}
          </h3>
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
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isSelected = selectedDate === day.date;
            const hasAvailability = day.morning.available || day.afternoon.available;
            const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;

            return (
              <button
                key={day.date}
                onClick={() => selectDay(day)}
                disabled={day.isPast || !hasAvailability}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all
                  flex flex-col items-center justify-center gap-0.5
                  ${isSelected 
                    ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2' 
                    : hasAvailability && !day.isPast
                      ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer'
                      : day.isPast || isWeekend
                        ? 'bg-secondary-50 text-secondary-300 cursor-not-allowed'
                        : 'bg-red-50 text-red-300 cursor-not-allowed'
                  }
                `}
              >
                <span>{new Date(day.date).getDate()}</span>
                {hasAvailability && !day.isPast && !isSelected && (
                  <span className="text-[10px]">
                    {day.morning.available && day.afternoon.available ? '●●' : '●'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
            <span className="text-secondary-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
            <span className="text-secondary-600">Complet</span>
          </div>
        </div>
      </div>
    );
  };

  // Rendu sélection créneau
  const renderSlotSelection = () => {
    const selectedDay = availability.find(d => d.date === selectedDate);
    if (!selectedDay) return null;

    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Choisissez un créneau pour le {formatDate(selectedDate!)}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => selectSlot('MORNING')}
            disabled={!selectedDay.morning.available}
            className={`
              p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
              ${selectedDay.morning.available
                ? 'border-primary-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer'
                : 'border-secondary-100 bg-secondary-50 cursor-not-allowed opacity-50'
              }
            `}
          >
            <Sun className={`w-8 h-8 ${selectedDay.morning.available ? 'text-primary-500' : 'text-secondary-300'}`} />
            <span className="font-semibold">Matin</span>
            <span className="text-sm text-secondary-500">8h - 12h</span>
            {selectedDay.morning.available && (
              <span className="text-xs text-green-600">
                {selectedDay.morning.remaining} place{selectedDay.morning.remaining > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => selectSlot('AFTERNOON')}
            disabled={!selectedDay.afternoon.available}
            className={`
              p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
              ${selectedDay.afternoon.available
                ? 'border-primary-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer'
                : 'border-secondary-100 bg-secondary-50 cursor-not-allowed opacity-50'
              }
            `}
          >
            <Sunset className={`w-8 h-8 ${selectedDay.afternoon.available ? 'text-primary-500' : 'text-secondary-300'}`} />
            <span className="font-semibold">Après-midi</span>
            <span className="text-sm text-secondary-500">14h - 18h</span>
            {selectedDay.afternoon.available && (
              <span className="text-xs text-green-600">
                {selectedDay.afternoon.remaining} place{selectedDay.afternoon.remaining > 1 ? 's' : ''}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-mesh">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge-primary mb-4">Réservation en ligne</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Prenez rendez-vous
            </h1>
            <p className="text-secondary-600">
              Choisissez votre créneau et nous vous recontactons pour confirmer l'intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section-padding">
        <div className="container-site max-w-3xl">
          
          {/* Étapes */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${step >= s ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-400'}
                `}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-primary-500' : 'bg-secondary-100'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Étape 1: Code postal */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                Vérification de la zone d'intervention
              </h2>
              <p className="text-secondary-600 mb-6">
                Entrez votre code postal pour vérifier que nous intervenons dans votre secteur.
              </p>
              
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Ex: 60000"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl text-center text-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && checkPostalCode()}
                />
                {postalCodeError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {postalCodeError}
                  </p>
                )}
                <button
                  onClick={checkPostalCode}
                  className="btn-primary w-full mt-4"
                >
                  Vérifier
                </button>
              </div>

              <p className="text-sm text-secondary-500 mt-6">
                Nous intervenons dans l'Oise (60) et le Val-d'Oise (95)
              </p>
            </div>
          )}

          {/* Étape 2: Calendrier */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Modifier le code postal
                </button>
                <span className="text-secondary-300">|</span>
                <span className="text-secondary-600">{postalCode}</span>
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" />
                  <p className="text-secondary-600 mt-4">Chargement des disponibilités...</p>
                </div>
              ) : (
                <>
                  {renderCalendar()}
                  {selectedDate && renderSlotSelection()}
                </>
              )}
            </>
          )}

          {/* Étape 3: Formulaire */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => { setStep(2); setSelectedSlot(null); }}
                  className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Modifier la date
                </button>
              </div>

              {/* Résumé */}
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 flex items-center gap-4">
                <Calendar className="w-10 h-10 text-primary-500" />
                <div>
                  <p className="font-semibold text-secondary-900 capitalize">
                    {formatDate(selectedDate!)}
                  </p>
                  <p className="text-secondary-600">
                    {selectedSlot === 'MORNING' ? 'Matin (8h - 12h)' : 'Après-midi (14h - 18h)'}
                  </p>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Vos informations
                </h2>

                {/* Nom / Prénom */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email / Téléphone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Numéro et nom de rue"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Type de service */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Type de prestation *
                  </label>
                  <select
                    required
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    {SERVICES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Type d'équipement */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Type d'équipement
                  </label>
                  <select
                    value={formData.equipmentType}
                    onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    {EQUIPMENT_TYPES.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Informations complémentaires
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Précisez votre demande, accès particulier..."
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Erreur */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {submitError}
                  </div>
                )}

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer ma demande'
                  )}
                </button>

                <p className="text-xs text-secondary-500 text-center">
                  En soumettant ce formulaire, vous acceptez d'être recontacté pour confirmer votre rendez-vous.
                </p>
              </form>
            </>
          )}

          {/* Étape 4: Confirmation */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                Demande envoyée !
              </h2>
              <p className="text-secondary-600 mb-6">
                Nous avons bien reçu votre demande de rendez-vous.<br />
                Nous vous recontactons rapidement pour confirmer l'intervention.
              </p>

              <div className="bg-secondary-50 rounded-xl p-4 mb-6 text-left max-w-sm mx-auto">
                <p className="text-sm text-secondary-600 mb-1">Récapitulatif :</p>
                <p className="font-semibold capitalize">{formatDate(selectedDate!)}</p>
                <p className="text-secondary-600">
                  {selectedSlot === 'MORNING' ? 'Matin' : 'Après-midi'}
                </p>
                <p className="text-xs text-secondary-400 mt-2">
                  Référence : {bookingId}
                </p>
              </div>

              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
