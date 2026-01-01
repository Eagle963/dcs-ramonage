'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, Sun, Sunset, Home, Flame, Droplet, Wind, CircleDot, Calendar, List, ArrowRight } from 'lucide-react';

interface DayAvailability {
  date: string;
  dayOfWeek: number;
  morning: { available: boolean };
  afternoon: { available: boolean };
  isPast: boolean;
  isToday: boolean;
}

const EQUIPMENTS = [
  { id: 'WOOD_STOVE', name: 'Poêle à bois', icon: Flame, color: 'bg-orange-500', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: 'PELLET_STOVE', name: 'Poêle à granulés', icon: CircleDot, color: 'bg-green-500', interventions: ['Ramonage + Entretien', 'Ramonage', 'Entretien', 'Dépannage'], requiresBrand: true, requiresExhaust: true },
  { id: 'CHIMNEY_OPEN', name: 'Cheminée ouverte', icon: Home, color: 'bg-red-500', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: 'CHIMNEY_INSERT', name: 'Insert', icon: Flame, color: 'bg-gray-500', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: 'OIL_BOILER', name: 'Chaudière fioul', icon: Droplet, color: 'bg-amber-500', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: 'GAS_BOILER', name: 'Chaudière gaz', icon: Wind, color: 'bg-blue-500', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: 'WOOD_BOILER', name: 'Chaudière bois', icon: Flame, color: 'bg-amber-700', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
];

const EXHAUST_TYPES = [
  { id: 'VENTOUSE', name: 'Ventouse', description: 'Sortie horizontale sur mur', icon: '🔲' },
  { id: 'TOITURE', name: 'Toiture', description: 'Sortie verticale sur toit', icon: '🏠' },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [exhaustType, setExhaustType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
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
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [formData, setFormData] = useState({ lastName: '', firstName: '', email: '', phone: '', address: '', city: '', message: '' });

  const equipment = EQUIPMENTS.find(e => e.id === selectedEquipment);

  const fetchAvailability = async (month: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/booking/availability?month=${month}&postalCode=${postalCode}`);
      const data = await res.json();
      if (data.success) setAvailability(data.availability);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const checkPostalCode = () => {
    const cp = postalCode.trim();
    if (cp.length !== 5) { setPostalCodeError('Le code postal doit contenir 5 chiffres'); return; }
    if (!cp.startsWith('60') && !cp.startsWith('95')) { setPostalCodeError('Nous intervenons uniquement dans l\'Oise (60) et le Val-d\'Oise (95)'); return; }
    setPostalCodeError('');
    setStep(2);
  };

  const selectEquipment = (id: string) => {
    setSelectedEquipment(id);
    const eq = EQUIPMENTS.find(e => e.id === id);
    if (eq && eq.interventions.length === 1) {
      setSelectedIntervention(eq.interventions[0]);
      if (!eq.requiresBrand && !eq.requiresExhaust) {
        setStep(4);
        fetchAvailability(currentMonth);
      } else {
        setStep(3);
      }
    } else {
      setStep(3);
    }
  };

  const continueFromOptions = () => {
    if (equipment?.requiresBrand && (!brand.trim() || !model.trim())) { alert('Veuillez renseigner la marque et le modèle'); return; }
    if (equipment?.requiresExhaust && !exhaustType) { alert('Veuillez sélectionner le type de sortie'); return; }
    if (equipment && equipment.interventions.length > 1 && !selectedIntervention) { alert('Veuillez sélectionner le type d\'intervention'); return; }
    setStep(4);
    fetchAvailability(currentMonth);
  };

  const changeMonth = (delta: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
    fetchAvailability(newMonth);
  };

  const selectSlot = (slot: 'MORNING' | 'AFTERNOON') => {
    setSelectedSlot(slot);
    setStep(5);
  };

  const searchAddress = async (query: string) => {
    if (query.length < 3) { setAddressSuggestions([]); return; }
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&postcode=${postalCode}&limit=5`);
      const data = await res.json();
      setAddressSuggestions(data.features || []);
    } catch (e) { console.error(e); }
  };

  const selectAddress = (feature: any) => {
    setFormData({ ...formData, address: feature.properties.name, city: feature.properties.city });
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/booking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate, slot: selectedSlot, ...formData, postalCode,
          equipmentType: selectedEquipment, serviceType: selectedIntervention || 'RAMONAGE',
          brand, model, exhaustType,
        }),
      });
      const data = await res.json();
      if (data.success) { setBookingId(data.bookingId); setStep(6); }
      else { setSubmitError(data.errors?.join(', ') || data.message || 'Erreur'); }
    } catch (error) { setSubmitError('Erreur de connexion'); }
    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const formatDateShort = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  const getMondayBasedDay = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1);

  const availableDays = availability.filter(d => (d.morning.available || d.afternoon.available) && !d.isPast);

  const [year, month] = currentMonth.split('-').map(Number);

  return (
    <>
      <section className="pt-32 pb-12 bg-mesh">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge-primary mb-4">Réservation en ligne</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">Prenez rendez-vous</h1>
            <p className="text-secondary-600">Choisissez votre créneau et nous vous recontactons pour confirmer.</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site max-w-4xl">
          {/* Étapes */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-400'}`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 6 && <div className={`w-8 h-1 mx-1 rounded ${step > s ? 'bg-primary-500' : 'bg-secondary-100'}`} />}
              </div>
            ))}
          </div>

          {/* Étape 1: Code postal */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Vérification zone d'intervention</h2>
              <p className="text-secondary-600 mb-6">Entrez votre code postal</p>
              <div className="max-w-xs mx-auto">
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="Ex: 60000" className="w-full px-4 py-3 border border-secondary-200 rounded-xl text-center text-lg focus:ring-2 focus:ring-primary-500" onKeyDown={(e) => e.key === 'Enter' && checkPostalCode()} />
                {postalCodeError && <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1"><AlertCircle className="w-4 h-4" />{postalCodeError}</p>}
                <button onClick={checkPostalCode} className="btn-primary w-full mt-4">Vérifier</button>
              </div>
              <p className="text-sm text-secondary-500 mt-6">Oise (60) et Val-d'Oise (95)</p>
            </div>
          )}

          {/* Étape 2: Équipement */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => setStep(1)} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Modifier CP ({postalCode})</button>
              <h2 className="text-xl font-semibold text-center mb-6">Quel est votre équipement ?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {EQUIPMENTS.map((eq) => {
                  const Icon = eq.icon;
                  return (
                    <button key={eq.id} onClick={() => selectEquipment(eq.id)} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 hover:border-primary-500 ${selectedEquipment === eq.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                      <div className={`w-14 h-14 ${eq.color} rounded-xl flex items-center justify-center`}><Icon className="w-7 h-7 text-white" /></div>
                      <span className="font-medium text-sm text-center">{eq.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Étape 3: Options (intervention, marque, sortie) */}
          {step === 3 && equipment && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => { setStep(2); setSelectedEquipment(null); setSelectedIntervention(null); }} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Modifier équipement</button>
              <h2 className="text-xl font-semibold text-center mb-6">Détails de l'intervention</h2>
              <div className="space-y-6">
                {equipment.interventions.length > 1 && (
                  <div>
                    <h3 className="font-medium mb-3">Type d'intervention</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {equipment.interventions.map((int) => (
                        <button key={int} onClick={() => setSelectedIntervention(int)} className={`p-4 rounded-xl border-2 text-center transition-all ${selectedIntervention === int ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>{int}</button>
                      ))}
                    </div>
                  </div>
                )}
                {equipment.requiresBrand && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Marque *</label><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: MCZ, Edilkamin..." className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-1">Modèle *</label><input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex: Ego 2.0" className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                  </div>
                )}
                {equipment.requiresExhaust && (
                  <div>
                    <h3 className="font-medium mb-3">Type de sortie</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {EXHAUST_TYPES.map((ex) => (
                        <button key={ex.id} onClick={() => setExhaustType(ex.id)} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${exhaustType === ex.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>
                          <span className="text-3xl">{ex.icon}</span>
                          <span className="font-medium">{ex.name}</span>
                          <span className="text-xs text-secondary-500">{ex.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={continueFromOptions} className="btn-primary w-full flex items-center justify-center gap-2">Continuer<ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Étape 4: Date et créneau */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => setStep(equipment?.requiresBrand || equipment?.requiresExhaust || (equipment?.interventions.length || 0) > 1 ? 3 : 2)} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Retour</button>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Choisissez votre créneau</h2>
                <div className="flex bg-secondary-100 rounded-lg p-1">
                  <button onClick={() => setViewMode('list')} className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('calendar')} className={`px-3 py-1 rounded text-sm ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}><Calendar className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Liste ou calendrier */}
                <div>
                  {loading ? (
                    <div className="text-center py-12"><Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" /></div>
                  ) : viewMode === 'list' ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {availableDays.length > 0 ? availableDays.slice(0, 14).map((day) => (
                        <button key={day.date} onClick={() => setSelectedDate(day.date)} className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${selectedDate === day.date ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>
                          <span className="font-medium capitalize">{formatDateShort(day.date)}</span>
                          <div className="flex gap-2">
                            {day.morning.available && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Matin</span>}
                            {day.afternoon.available && <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Après-midi</span>}
                          </div>
                        </button>
                      )) : <p className="text-center text-secondary-500 py-8">Aucune disponibilité ce mois</p>}
                      {availableDays.length > 14 && <button onClick={() => changeMonth(1)} className="w-full text-center text-primary-600 py-2">Voir plus...</button>}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-secondary-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="font-semibold">{MONTHS[month - 1]} {year}</span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-secondary-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map(d => <div key={d} className="text-center text-sm text-secondary-500 py-1">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array(getMondayBasedDay(new Date(year, month - 1, 1).getDay())).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                        {availability.map((day) => {
                          const hasAvail = day.morning.available || day.afternoon.available;
                          const isSelected = selectedDate === day.date;
                          return (
                            <button key={day.date} onClick={() => hasAvail && !day.isPast && setSelectedDate(day.date)} disabled={!hasAvail || day.isPast} className={`aspect-square rounded-lg text-sm flex items-center justify-center ${isSelected ? 'bg-primary-500 text-white' : hasAvail && !day.isPast ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-secondary-50 text-secondary-300'}`}>
                              {new Date(day.date).getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sélection créneau */}
                <div>
                  {selectedDate ? (
                    <div className="bg-secondary-50 rounded-xl p-6">
                      <h3 className="font-semibold mb-4 capitalize">{formatDate(selectedDate)}</h3>
                      <div className="space-y-3">
                        {availability.find(d => d.date === selectedDate)?.morning.available && (
                          <button onClick={() => selectSlot('MORNING')} className="w-full p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:border-amber-400 flex items-center gap-4">
                            <Sun className="w-8 h-8 text-amber-500" />
                            <div className="text-left"><p className="font-semibold">Matin</p><p className="text-sm text-secondary-500">8h - 12h</p></div>
                          </button>
                        )}
                        {availability.find(d => d.date === selectedDate)?.afternoon.available && (
                          <button onClick={() => selectSlot('AFTERNOON')} className="w-full p-4 rounded-xl border-2 border-orange-200 bg-orange-50 hover:border-orange-400 flex items-center gap-4">
                            <Sunset className="w-8 h-8 text-orange-500" />
                            <div className="text-left"><p className="font-semibold">Après-midi</p><p className="text-sm text-secondary-500">14h - 18h</p></div>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-secondary-50 rounded-xl p-6 text-center text-secondary-400">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Sélectionnez un jour</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Étape 5: Formulaire */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => { setStep(4); setSelectedSlot(null); }} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Modifier créneau</button>
              
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 flex items-center gap-4">
                <Calendar className="w-10 h-10 text-primary-500" />
                <div><p className="font-semibold capitalize">{formatDate(selectedDate!)}</p><p className="text-secondary-600">{selectedSlot === 'MORNING' ? 'Matin (8h-12h)' : 'Après-midi (14h-18h)'}</p></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold">Vos informations</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Nom *</label><input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Prénom *</label><input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Téléphone *</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Adresse *</label>
                  <input type="text" required value={formData.address} onChange={(e) => { setFormData({ ...formData, address: e.target.value }); searchAddress(e.target.value); }} placeholder="Commencez à taper..." className="w-full px-4 py-2 border border-secondary-200 rounded-lg" />
                  {addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-secondary-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                      {addressSuggestions.map((s, i) => (
                        <button key={i} type="button" onClick={() => selectAddress(s)} className="w-full px-4 py-2 text-left hover:bg-secondary-50 text-sm">{s.properties.label}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Code postal</label><input type="text" value={postalCode} disabled className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50" /></div>
                  <div><label className="block text-sm font-medium mb-1">Ville *</label><input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Message</label><textarea rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Informations complémentaires..." className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                {submitError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5" />{submitError}</div>}
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">{submitting ? <><Loader2 className="w-5 h-5 animate-spin" />Envoi...</> : 'Envoyer ma demande'}</button>
              </form>
            </div>
          )}

          {/* Étape 6: Confirmation */}
          {step === 6 && (
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
              <h2 className="text-2xl font-bold mb-2">Demande envoyée !</h2>
              <p className="text-secondary-600 mb-6">Nous vous recontactons rapidement pour confirmer.</p>
              <div className="bg-secondary-50 rounded-xl p-4 mb-6 max-w-sm mx-auto text-left">
                <p className="font-semibold capitalize">{formatDate(selectedDate!)}</p>
                <p className="text-secondary-600">{selectedSlot === 'MORNING' ? 'Matin' : 'Après-midi'}</p>
                <p className="text-secondary-600">{equipment?.name}</p>
                <p className="text-xs text-secondary-400 mt-2">Réf: {bookingId}</p>
              </div>
              <Link href="/" className="btn-primary inline-flex items-center gap-2"><Home className="w-4 h-4" />Retour à l'accueil</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
