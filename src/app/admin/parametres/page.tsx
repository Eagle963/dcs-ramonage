'use client';

import { useState } from 'react';
import { Settings, Save, Clock, Calendar, Bell, Wrench, Plus, Trash2, Edit2, X, Flame, Home, Droplet, Wind, CircleDot } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  icon: string;
  color: string;
  interventions: string[];
  requiresBrand: boolean;
  requiresExhaust: boolean;
}

const ICON_OPTIONS = [
  { value: 'flame', label: 'Flamme', icon: Flame },
  { value: 'home', label: 'Maison', icon: Home },
  { value: 'droplet', label: 'Goutte', icon: Droplet },
  { value: 'wind', label: 'Vent', icon: Wind },
  { value: 'circle', label: 'Cercle', icon: CircleDot },
];

const COLOR_OPTIONS = [
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'green', label: 'Vert', class: 'bg-green-500' },
  { value: 'red', label: 'Rouge', class: 'bg-red-500' },
  { value: 'gray', label: 'Gris', class: 'bg-gray-500' },
  { value: 'amber', label: 'Ambre', class: 'bg-amber-500' },
  { value: 'blue', label: 'Bleu', class: 'bg-blue-500' },
  { value: 'brown', label: 'Marron', class: 'bg-amber-700' },
];

const DEFAULT_EQUIPMENTS: Equipment[] = [
  { id: '1', name: 'Poêle à bois', icon: 'flame', color: 'orange', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: '2', name: 'Poêle à granulés', icon: 'circle', color: 'green', interventions: ['Ramonage + Entretien', 'Ramonage', 'Entretien', 'Dépannage'], requiresBrand: true, requiresExhaust: true },
  { id: '3', name: 'Cheminée ouverte', icon: 'home', color: 'red', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: '4', name: 'Insert', icon: 'flame', color: 'gray', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: '5', name: 'Chaudière fioul', icon: 'droplet', color: 'amber', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: '6', name: 'Chaudière gaz', icon: 'wind', color: 'blue', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
  { id: '7', name: 'Chaudière bois', icon: 'flame', color: 'brown', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false },
];

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    maxMorning: 5,
    maxAfternoon: 5,
    morningStart: '08:00',
    morningEnd: '12:00',
    afternoonStart: '14:00',
    afternoonEnd: '18:00',
    firstDayOfWeek: 'monday',
    notifyEmail: true,
    notifySms: false,
  });

  const [equipments, setEquipments] = useState<Equipment[]>(DEFAULT_EQUIPMENTS);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [newIntervention, setNewIntervention] = useState('');

  const handleSave = () => {
    alert('Paramètres sauvegardés ! (simulation)');
  };

  const openEquipmentModal = (eq?: Equipment) => {
    if (eq) {
      setEditingEquipment({ ...eq });
    } else {
      setEditingEquipment({ id: Date.now().toString(), name: '', icon: 'flame', color: 'orange', interventions: ['Ramonage'], requiresBrand: false, requiresExhaust: false });
    }
    setShowEquipmentModal(true);
  };

  const saveEquipment = () => {
    if (!editingEquipment || !editingEquipment.name) return;
    const exists = equipments.find(e => e.id === editingEquipment.id);
    if (exists) {
      setEquipments(equipments.map(e => e.id === editingEquipment.id ? editingEquipment : e));
    } else {
      setEquipments([...equipments, editingEquipment]);
    }
    setShowEquipmentModal(false);
    setEditingEquipment(null);
  };

  const deleteEquipment = (id: string) => {
    if (confirm('Supprimer cet équipement ?')) {
      setEquipments(equipments.filter(e => e.id !== id));
    }
  };

  const addIntervention = () => {
    if (!newIntervention.trim() || !editingEquipment) return;
    setEditingEquipment({ ...editingEquipment, interventions: [...editingEquipment.interventions, newIntervention.trim()] });
    setNewIntervention('');
  };

  const removeIntervention = (idx: number) => {
    if (!editingEquipment) return;
    setEditingEquipment({ ...editingEquipment, interventions: editingEquipment.interventions.filter((_, i) => i !== idx) });
  };

  const getIconComponent = (iconName: string) => {
    const found = ICON_OPTIONS.find(i => i.value === iconName);
    return found ? found.icon : Flame;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Paramètres</h1>
        <p className="text-secondary-500">Configurez votre système de réservation</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div className="space-y-6">
          {/* Capacité */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-primary-600" /></div>
              <div><h2 className="font-semibold">Capacité quotidienne</h2><p className="text-sm text-secondary-500">RDV max par créneau</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Matin (max)</label><input type="number" min="1" max="20" value={settings.maxMorning} onChange={(e) => setSettings({ ...settings, maxMorning: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Après-midi (max)</label><input type="number" min="1" max="20" value={settings.maxAfternoon} onChange={(e) => setSettings({ ...settings, maxAfternoon: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" /></div>
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div><h2 className="font-semibold">Horaires</h2><p className="text-sm text-secondary-500">Plages affichées</p></div>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Matin</label><div className="flex items-center gap-2"><input type="time" value={settings.morningStart} onChange={(e) => setSettings({ ...settings, morningStart: e.target.value })} className="px-3 py-2 border border-secondary-200 rounded-lg" /><span>à</span><input type="time" value={settings.morningEnd} onChange={(e) => setSettings({ ...settings, morningEnd: e.target.value })} className="px-3 py-2 border border-secondary-200 rounded-lg" /></div></div>
              <div><label className="block text-sm font-medium mb-2">Après-midi</label><div className="flex items-center gap-2"><input type="time" value={settings.afternoonStart} onChange={(e) => setSettings({ ...settings, afternoonStart: e.target.value })} className="px-3 py-2 border border-secondary-200 rounded-lg" /><span>à</span><input type="time" value={settings.afternoonEnd} onChange={(e) => setSettings({ ...settings, afternoonEnd: e.target.value })} className="px-3 py-2 border border-secondary-200 rounded-lg" /></div></div>
            </div>
          </div>

          {/* Calendrier */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div>
              <div><h2 className="font-semibold">Calendrier</h2><p className="text-sm text-secondary-500">Affichage</p></div>
            </div>
            <div><label className="block text-sm font-medium mb-2">Premier jour de la semaine</label><select value={settings.firstDayOfWeek} onChange={(e) => setSettings({ ...settings, firstDayOfWeek: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg"><option value="monday">Lundi</option><option value="sunday">Dimanche</option></select></div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-green-600" /></div>
              <div><h2 className="font-semibold">Notifications</h2><p className="text-sm text-secondary-500">Alertes nouvelles demandes</p></div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={settings.notifyEmail} onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.checked })} className="w-5 h-5 rounded" /><span>Email</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={settings.notifySms} onChange={(e) => setSettings({ ...settings, notifySms: e.target.checked })} className="w-5 h-5 rounded" /><span>SMS (bientôt)</span></label>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2"><Save className="w-5 h-5" />Sauvegarder</button>
        </div>

        {/* Colonne droite - Équipements */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Wrench className="w-5 h-5 text-purple-600" /></div>
              <div><h2 className="font-semibold">Équipements</h2><p className="text-sm text-secondary-500">Types et interventions</p></div>
            </div>
            <button onClick={() => openEquipmentModal()} className="flex items-center gap-1 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"><Plus className="w-4 h-4" />Ajouter</button>
          </div>

          <div className="space-y-3">
            {equipments.map((eq) => {
              const IconComp = getIconComponent(eq.icon);
              const colorClass = COLOR_OPTIONS.find(c => c.value === eq.color)?.class || 'bg-gray-500';
              return (
                <div key={eq.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}><IconComp className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-xs text-secondary-500">{eq.interventions.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEquipmentModal(eq)} className="p-2 hover:bg-secondary-200 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteEquipment(eq.id)} className="p-2 hover:bg-red-100 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal équipement */}
      {showEquipmentModal && editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEquipmentModal(false)} />
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingEquipment.id ? 'Modifier' : 'Ajouter'} équipement</h3>
              <button onClick={() => setShowEquipmentModal(false)} className="p-1 hover:bg-secondary-100 rounded"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><input type="text" value={editingEquipment.name} onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })} placeholder="Ex: Poêle à granulés" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" /></div>

              <div><label className="block text-sm font-medium mb-2">Icône</label><div className="flex gap-2">{ICON_OPTIONS.map((opt) => { const I = opt.icon; return (<button key={opt.value} onClick={() => setEditingEquipment({ ...editingEquipment, icon: opt.value })} className={`p-3 rounded-lg border-2 ${editingEquipment.icon === opt.value ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}><I className="w-5 h-5" /></button>); })}</div></div>

              <div><label className="block text-sm font-medium mb-2">Couleur</label><div className="flex gap-2 flex-wrap">{COLOR_OPTIONS.map((opt) => (<button key={opt.value} onClick={() => setEditingEquipment({ ...editingEquipment, color: opt.value })} className={`w-8 h-8 rounded-lg ${opt.class} ${editingEquipment.color === opt.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} />))}</div></div>

              <div>
                <label className="block text-sm font-medium mb-2">Interventions</label>
                <div className="space-y-2 mb-2">{editingEquipment.interventions.map((int, idx) => (<div key={idx} className="flex items-center justify-between bg-secondary-50 px-3 py-2 rounded-lg"><span>{int}</span><button onClick={() => removeIntervention(idx)} className="text-red-500 hover:text-red-600"><X className="w-4 h-4" /></button></div>))}</div>
                <div className="flex gap-2"><input type="text" value={newIntervention} onChange={(e) => setNewIntervention(e.target.value)} placeholder="Nouvelle intervention" className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg" onKeyDown={(e) => e.key === 'Enter' && addIntervention()} /><button onClick={addIntervention} className="px-3 py-2 bg-secondary-100 rounded-lg hover:bg-secondary-200"><Plus className="w-4 h-4" /></button></div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={editingEquipment.requiresBrand} onChange={(e) => setEditingEquipment({ ...editingEquipment, requiresBrand: e.target.checked })} className="w-5 h-5 rounded" /><span>Demander marque/modèle</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={editingEquipment.requiresExhaust} onChange={(e) => setEditingEquipment({ ...editingEquipment, requiresExhaust: e.target.checked })} className="w-5 h-5 rounded" /><span>Demander type de sortie</span></label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowEquipmentModal(false)} className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">Annuler</button>
              <button onClick={saveEquipment} className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
