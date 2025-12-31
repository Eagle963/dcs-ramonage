'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, Home, Flame, Droplet, Wind, CircleDot, Calendar, List, ArrowRight, Brush, Wrench, FileText, SprayCan, PenTool, CircleOff } from 'lucide-react';

interface DayAvailability {
  date: string;
  dayOfWeek: number;
  morning: { available: boolean };
  afternoon: { available: boolean };
  isPast: boolean;
  isToday: boolean;
}

// Prestations principales avec tarifs
const PRESTATIONS = [
  { id: 'RAMONAGE_ENTRETIEN', name: 'Ramonage / Entretien', icon: Flame, color: 'bg-orange-500', tarif: 'À partir de 60€' },
  { id: 'DEBISTRAGE', name: 'Débistrage', icon: PenTool, color: 'bg-amber-700', tarif: 'À partir de 90€' },
  { id: 'TUBAGE', name: 'Tubage', icon: CircleOff, color: 'bg-gray-600', tarif: 'Sur devis' },
  { id: 'DEPANNAGE', name: 'Dépannage', icon: Wrench, color: 'bg-red-500', tarif: 'À partir de 80€' },
  { id: 'DEVIS', name: 'Devis', icon: FileText, color: 'bg-blue-500', tarif: 'Gratuit' },
  { id: 'NETTOYAGE', name: 'Démoussage / Nettoyage', icon: SprayCan, color: 'bg-green-600', tarif: 'Sur devis' },
];

// Équipements pour Ramonage/Entretien
const EQUIPMENTS = [
  { id: 'WOOD_STOVE', name: 'Poêle à bois', icon: Flame, color: 'bg-orange-500', hasOptions: false },
  { id: 'PELLET_STOVE', name: 'Poêle à granulés', icon: CircleDot, color: 'bg-green-500', hasOptions: true },
  { id: 'CHIMNEY_OPEN', name: 'Cheminée ouverte', icon: Home, color: 'bg-red-600', hasOptions: false },
  { id: 'CHIMNEY_INSERT', name: 'Insert', icon: Flame, color: 'bg-gray-500', hasOptions: false },
  { id: 'OIL_BOILER', name: 'Chaudière fioul', icon: Droplet, color: 'bg-amber-500', hasOptions: false },
  { id: 'GAS_BOILER', name: 'Chaudière gaz', icon: Wind, color: 'bg-blue-500', hasOptions: false },
  { id: 'WOOD_BOILER', name: 'Chaudière bois', icon: Flame, color: 'bg-amber-700', hasOptions: false },
];

// Interventions poêle à granulés
const PELLET_INTERVENTIONS = [
  { id: 'RAMONAGE_ENTRETIEN', name: 'Ramonage + Entretien', tarif: '120€' },
  { id: 'RAMONAGE', name: 'Ramonage seul', tarif: '60€' },
  { id: 'ENTRETIEN', name: 'Entretien seul', tarif: '90€' },
];

// Types de sortie
const EXHAUST_TYPES = [
  { id: 'VENTOUSE', name: 'Ventouse', description: 'Sortie horizontale sur mur' },
  { id: 'TOITURE', name: 'Toiture', description: 'Sortie verticale sur toit' },
];

// Sous-options nettoyage
const NETTOYAGE_OPTIONS = [
  { id: 'MUR', name: 'Murs extérieurs' },
  { id: 'SOL', name: 'Sols / Terrasses' },
  { id: 'VERANDA', name: 'Vérandas' },
  { id: 'TOITURE', name: 'Toiture' },
  { id: 'BARDAGE', name: 'Bardage' },
  { id: 'AUTRE', name: 'Autre' },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  
  // Sélections
  const [selectedPrestation, setSelectedPrestation] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [selectedNettoyage, setSelectedNettoyage] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [exhaustType, setExhaustType] = useState<string | null>(null);
  
  // Calendrier
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'MORNING' | 'AFTERNOON' | null>(null);
  
  // Formulaire
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({ lastName: '', firstName: '', email: '', phone: '', address: '', city: '', message: '' });
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);

  const prestation = PRESTATIONS.find(p => p.id === selectedPrestation);
  const equipment = EQUIPMENTS.find(e => e.id === selectedEquipment);

  const fetchAvailability = async (month: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/booking/availability?month=${month}&postalCode=${postalCode}`);
      const data = await res.json();
      if (data.success) setAvailability(data.availability);
    } catch (error) { console.error('Erreur:', error); }
    setLoading(false);
  };

  const checkPostalCode = () => {
    const cp = postalCode.trim();
    if (cp.length !== 5) { setPostalCodeError('Le code postal doit contenir 5 chiffres'); return; }
    if (!cp.startsWith('60') && !cp.startsWith('95')) { setPostalCodeError('Nous intervenons uniquement dans l\'Oise (60) et le Val-d\'Oise (95)'); return; }
    setPostalCodeError('');
    setStep(2);
  };

  const selectPrestation = (id: string) => {
    setSelectedPrestation(id);
    if (id === 'RAMONAGE_ENTRETIEN') {
      setStep(3); // Choix équipement
    } else if (id === 'DEPANNAGE') {
      setStep(3); // Marque/modèle obligatoire
    } else if (id === 'NETTOYAGE') {
      setStep(3); // Choix zones
    } else {
      // Devis, Tubage, Débistrage -> directement calendrier
      setStep(4);
      fetchAvailability(currentMonth);
    }
  };

  const continueFromEquipment = () => {
    if (!selectedEquipment) { alert('Veuillez sélectionner un équipement'); return; }
    const eq = EQUIPMENTS.find(e => e.id === selectedEquipment);
    if (eq?.hasOptions) {
      // Poêle granulés -> options supplémentaires dans même étape
      return;
    }
    setStep(4);
    fetchAvailability(currentMonth);
  };

  const continueFromOptions = () => {
    if (selectedPrestation === 'RAMONAGE_ENTRETIEN' && selectedEquipment === 'PELLET_STOVE') {
      if (!selectedIntervention) { alert('Veuillez sélectionner le type d\'intervention'); return; }
      if (!brand.trim() || !model.trim()) { alert('Veuillez renseigner la marque et le modèle'); return; }
      if (!exhaustType) { alert('Veuillez sélectionner le type de sortie'); return; }
    }
    if (selectedPrestation === 'DEPANNAGE') {
      if (!brand.trim() || !model.trim()) { alert('Veuillez renseigner la marque et le modèle du poêle'); return; }
    }
    if (selectedPrestation === 'NETTOYAGE' && selectedNettoyage.length === 0) {
      alert('Veuillez sélectionner au moins une zone'); return;
    }
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
          equipmentType: selectedEquipment || selectedPrestation,
          serviceType: selectedIntervention || selectedPrestation,
          brand, model, exhaustType,
          nettoyageZones: selectedNettoyage,
        }),
      });
      const data = await res.json();
      if (data.success) { setStep(6); }
      else { setSubmitError(data.errors?.join(', ') || data.message || 'Erreur'); }
    } catch (error) { setSubmitError('Erreur de connexion'); }
    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const formatDateShort = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  const getMondayBasedDay = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1);

  const availableDays = availability.filter(d => (d.morning.available || d.afternoon.available) && !d.isPast);
  const [year, month] = currentMonth.split('-').map(Number);

  const getStepName = () => {
    if (step === 1) return 'Zone d\'intervention';
    if (step === 2) return 'Type de prestation';
    if (step === 3) return 'Détails';
    if (step === 4) return 'Date et créneau';
    if (step === 5) return 'Vos coordonnées';
    return 'Confirmation';
  };

  const getTarif = () => {
    if (selectedPrestation === 'RAMONAGE_ENTRETIEN' && selectedEquipment === 'PELLET_STOVE' && selectedIntervention) {
      return PELLET_INTERVENTIONS.find(i => i.id === selectedIntervention)?.tarif || '';
    }
    return prestation?.tarif || '';
  };

  const toggleNettoyage = (id: string) => {
    setSelectedNettoyage(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // SVG custom pour ventouse et toiture
  const VentouseIcon = () => (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      <path d="M10 32 Q10 20 25 20 L50 20 Q55 20 55 25 L55 35 Q55 40 50 40 L25 40 Q10 40 10 32Z" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-600"/>
      <path d="M55 28 Q60 28 62 25 M55 32 Q62 32 64 30 M55 36 Q60 36 62 38" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"/>
      <rect x="5" y="25" width="8" height="14" rx="2" fill="currentColor" className="text-gray-500"/>
    </svg>
  );

  const ToitureIcon = () => (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      <path d="M32 5 L55 25 L55 55 L9 55 L9 25 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"/>
      <rect x="26" y="10" width="12" height="35" rx="2" fill="currentColor" className="text-gray-600"/>
      <rect x="24" y="8" width="16" height="4" rx="1" fill="currentColor" className="text-gray-500"/>
      <path d="M32 5 Q34 2 36 5 M30 3 Q32 0 34 3" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"/>
    </svg>
  );

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
          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-600">{getStepName()}</span>
              <span className="text-sm text-secondary-400">Étape {step}/6</span>
            </div>
            <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
            </div>
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
            </div>
          )}

          {/* Étape 2: Type de prestation */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => setStep(1)} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Modifier ({postalCode})</button>
              <h2 className="text-xl font-semibold text-center mb-6">Quelle prestation souhaitez-vous ?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PRESTATIONS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button key={p.id} onClick={() => selectPrestation(p.id)} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-primary-500 ${selectedPrestation === p.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                      <div className={`w-14 h-14 ${p.color} rounded-xl flex items-center justify-center`}><Icon className="w-7 h-7 text-white" /></div>
                      <span className="font-medium text-sm text-center">{p.name}</span>
                      <span className="text-xs text-primary-600 font-semibold">{p.tarif}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Étape 3: Sous-sélections */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => { setStep(2); setSelectedEquipment(null); setSelectedIntervention(null); }} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Modifier prestation</button>
              
              {/* Ramonage/Entretien -> Choix équipement */}
              {selectedPrestation === 'RAMONAGE_ENTRETIEN' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center">Quel équipement ?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {EQUIPMENTS.map((eq) => {
                      const Icon = eq.icon;
                      return (
                        <button key={eq.id} onClick={() => setSelectedEquipment(eq.id)} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-primary-500 ${selectedEquipment === eq.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                          <div className={`w-12 h-12 ${eq.color} rounded-xl flex items-center justify-center`}><Icon className="w-6 h-6 text-white" /></div>
                          <span className="font-medium text-sm text-center">{eq.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Options poêle granulés */}
                  {selectedEquipment === 'PELLET_STOVE' && (
                    <div className="space-y-6 pt-6 border-t border-secondary-100">
                      <div>
                        <h3 className="font-medium mb-3">Type d'intervention</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {PELLET_INTERVENTIONS.map((int) => (
                            <button key={int.id} onClick={() => setSelectedIntervention(int.id)} className={`p-3 rounded-xl border-2 text-center ${selectedIntervention === int.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                              <span className="block font-medium text-sm">{int.name}</span>
                              <span className="text-xs text-primary-600">{int.tarif}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Marque *</label><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: MCZ, Edilkamin..." className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                        <div><label className="block text-sm font-medium mb-1">Modèle *</label><input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex: Ego 2.0" className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-3">Type de sortie</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => setExhaustType('VENTOUSE')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${exhaustType === 'VENTOUSE' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                            <VentouseIcon />
                            <span className="font-medium">Ventouse</span>
                            <span className="text-xs text-secondary-500">Sortie horizontale</span>
                          </button>
                          <button onClick={() => setExhaustType('TOITURE')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${exhaustType === 'TOITURE' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                            <ToitureIcon />
                            <span className="font-medium">Toiture</span>
                            <span className="text-xs text-secondary-500">Sortie verticale</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button onClick={selectedEquipment === 'PELLET_STOVE' ? continueFromOptions : continueFromEquipment} className="btn-primary w-full flex items-center justify-center gap-2">Continuer<ArrowRight className="w-4 h-4" /></button>
                </div>
              )}

              {/* Dépannage -> Marque/Modèle */}
              {selectedPrestation === 'DEPANNAGE' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center">Informations sur votre poêle</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Marque du poêle *</label><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: MCZ, Edilkamin, Ravelli..." className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-1">Modèle *</label><input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex: Ego 2.0, Nara..." className="w-full px-4 py-2 border border-secondary-200 rounded-lg" /></div>
                  </div>
                  <button onClick={continueFromOptions} className="btn-primary w-full flex items-center justify-center gap-2">Continuer<ArrowRight className="w-4 h-4" /></button>
                </div>
              )}

              {/* Nettoyage -> Zones */}
              {selectedPrestation === 'NETTOYAGE' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center">Que souhaitez-vous nettoyer ?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {NETTOYAGE_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => toggleNettoyage(opt.id)} className={`p-4 rounded-xl border-2 text-center ${selectedNettoyage.includes(opt.id) ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}>
                        {opt.name}
                      </button>
                    ))}
                  </div>
                  <button onClick={continueFromOptions} className="btn-primary w-full flex items-center justify-center gap-2">Continuer<ArrowRight className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          )}

          {/* Étape 4: Date et créneau */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <button onClick={() => setStep(selectedPrestation === 'RAMONAGE_ENTRETIEN' || selectedPrestation === 'DEPANNAGE' || selectedPrestation === 'NETTOYAGE' ? 3 : 2)} className="text-secondary-500 hover:text-secondary-700 flex items-center gap-1 mb-6"><ChevronLeft className="w-4 h-4" />Retour</button>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Choisissez votre créneau</h2>
                <div className="flex bg-secondary-100 rounded-lg p-1">
                  <button onClick={() => setViewMode('list')} className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('calendar')} className={`px-3 py-1 rounded text-sm ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}><Calendar className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  {loading ? (
                    <div className="text-center py-12"><Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" /></div>
                  ) : viewMode === 'list' ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {availableDays.length > 0 ? availableDays.slice(0, 14).map((day) => (
                        <button key={day.date} onClick={() => setSelectedDate(day.date)} className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between ${selectedDate === day.date ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>
                          <span className="font-medium capitalize">{formatDateShort(day.date)}</span>
                          <div className="flex gap-2">
                            {day.morning.available && <span className="text-xs px-2 py-1 bg-sky-100 text-sky-700 rounded">Matin</span>}
                            {day.afternoon.available && <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Après-midi</span>}
                          </div>
                        </button>
                      )) : <p className="text-center text-secondary-500 py-8">Aucune disponibilité</p>}
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

                <div>
                  {selectedDate ? (
                    <div className="bg-secondary-50 rounded-xl p-6">
                      <h3 className="font-semibold mb-4 capitalize">{formatDate(selectedDate)}</h3>
                      <div className="space-y-3">
                        {availability.find(d => d.date === selectedDate)?.morning.available && (
                          <button onClick={() => selectSlot('MORNING')} className="w-full p-4 rounded-xl border-2 border-sky-200 bg-sky-50 hover:border-sky-400 flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                            </div>
                            <div className="text-left"><p className="font-semibold">Matin</p><p className="text-sm text-secondary-500">8h - 12h</p></div>
                          </button>
                        )}
                        {availability.find(d => d.date === selectedDate)?.afternoon.available && (
                          <button onClick={() => selectSlot('AFTERNOON')} className="w-full p-4 rounded-xl border-2 border-orange-200 bg-orange-50 hover:border-orange-400 flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.7.7M1 12h1M20 12h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7"/><path d="M12 6a6 6 0 0 0 0 12 6 6 0 0 0 0-12z"/><path d="M12 18c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z" opacity=".3"/></svg>
                            </div>
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
              
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-10 h-10 text-primary-500" />
                  <div>
                    <p className="font-semibold capitalize">{formatDate(selectedDate!)}</p>
                    <p className="text-secondary-600">{selectedSlot === 'MORNING' ? 'Matin (8h-12h)' : 'Après-midi (14h-18h)'}</p>
                  </div>
                </div>
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
              
              <div className="bg-secondary-50 rounded-xl p-6 mb-6 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between"><span className="text-secondary-500">Nom</span><span className="font-medium">{formData.lastName} {formData.firstName}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500">Prestation</span><span className="font-medium">{prestation?.name}{equipment ? ` - ${equipment.name}` : ''}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500">Date</span><span className="font-medium capitalize">{formatDate(selectedDate!)}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500">Créneau</span><span className="font-medium">{selectedSlot === 'MORNING' ? 'Matin' : 'Après-midi'}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500">Adresse</span><span className="font-medium text-right">{formData.address}<br/>{postalCode} {formData.city}</span></div>
                <div className="flex justify-between border-t border-secondary-200 pt-3"><span className="text-secondary-500">Tarif indicatif</span><span className="font-bold text-primary-600">{getTarif()}</span></div>
              </div>
              
              <Link href="/" className="btn-primary inline-flex items-center gap-2"><Home className="w-4 h-4" />Retour à l'accueil</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
