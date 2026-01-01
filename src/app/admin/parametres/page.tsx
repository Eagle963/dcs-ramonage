'use client';

import { useState } from 'react';
import { Settings, Save, Clock, Calendar, Bell, Wrench, Plus, Trash2, Edit2, X, Flame, Home, Droplet, Wind, CircleDot, Euro, MapPin, Check, Ban } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  icon: string;
  color: string;
  tarif: string;
  interventions: { name: string; tarif: string }[];
}

interface PostalCodeRule {
  code: string;
  type: 'allowed' | 'blocked';
}

const ICON_OPTIONS = [
  { value: 'flame', label: 'Flamme', icon: Flame },
  { value: 'home', label: 'Maison', icon: Home },
  { value: 'droplet', label: 'Goutte', icon: Droplet },
  { value: 'wind', label: 'Vent', icon: Wind },
  { value: 'circle', label: 'Cercle', icon: CircleDot },
];

const COLOR_OPTIONS = [
  { value: 'orange', class: 'bg-orange-500' },
  { value: 'green', class: 'bg-green-500' },
  { value: 'red', class: 'bg-red-500' },
  { value: 'gray', class: 'bg-gray-500' },
  { value: 'amber', class: 'bg-amber-500' },
  { value: 'blue', class: 'bg-blue-500' },
  { value: 'purple', class: 'bg-purple-500' },
  { value: 'slate', class: 'bg-slate-700' },
];

const DEFAULT_EQUIPMENTS: Equipment[] = [
  { id: '1', name: 'Chaudière gaz', icon: 'wind', color: 'blue', tarif: '60', interventions: [] },
  { id: '2', name: 'Cheminée ouverte', icon: 'home', color: 'red', tarif: '70', interventions: [] },
  { id: '3', name: 'Insert', icon: 'flame', color: 'gray', tarif: '70', interventions: [] },
  { id: '4', name: 'Poêle à bois', icon: 'flame', color: 'orange', tarif: '80', interventions: [] },
  { id: '5', name: 'Chaudière fioul', icon: 'droplet', color: 'amber', tarif: '80', interventions: [] },
  { id: '6', name: 'Poêle à granulés', icon: 'circle', color: 'green', tarif: '80', interventions: [
    { name: 'Ramonage + Entretien', tarif: '180' },
    { name: 'Entretien seul', tarif: '100' },
    { name: 'Ramonage seul', tarif: '80' },
  ]},
  { id: '7', name: 'Chaudière bois', icon: 'flame', color: 'amber', tarif: '80', interventions: [] },
  { id: '8', name: 'Cheminée Polyflam', icon: 'home', color: 'purple', tarif: '90', interventions: [] },
  { id: '9', name: 'Conduit difficile', icon: 'home', color: 'slate', tarif: '110', interventions: [] },
];

const DEFAULT_PRESTATIONS = [
  { id: 'DEBISTRAGE', name: 'Débistrage', tarif: '90' },
  { id: 'DEPANNAGE', name: 'Dépannage', tarif: '90' },
  { id: 'TUBAGE', name: 'Tubage', tarif: 'Sur devis' },
  { id: 'NETTOYAGE', name: 'Démoussage / Nettoyage', tarif: 'Sur devis' },
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
  const [prestations, setPrestations] = useState(DEFAULT_PRESTATIONS);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  
  const [postalCodes, setPostalCodes] = useState<PostalCodeRule[]>([
    { code: '60', type: 'allowed' },
    { code: '95', type: 'allowed' },
  ]);
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newPostalType, setNewPostalType] = useState<'allowed' | 'blocked'>('allowed');

  const [activeTab, setActiveTab] = useState<'general' | 'tarifs' | 'zones' | 'techniciens'>('general');
  
  // Techniciens
  const [techniciens, setTechniciens] = useState([
    { id: '1', name: 'DCS RAMONAGE', email: 'dcsramonage@gmail.com', phone: '06 12 34 56 78', color: '#3b82f6', startAddress: '15 Rue de la Gare, 60000 Beauvais', isDefault: true },
  ]);
  const [entrepriseAddress, setEntrepriseAddress] = useState('15 Rue de la Gare, 60000 Beauvais');

  const handleSave = () => {
    alert('Paramètres sauvegardés ! (simulation)');
  };

  const openEquipmentModal = (eq?: Equipment) => {
    if (eq) {
      setEditingEquipment({ ...eq });
    } else {
      setEditingEquipment({ id: Date.now().toString(), name: '', icon: 'flame', color: 'orange', tarif: '', interventions: [] });
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

  const updatePrestationTarif = (id: string, tarif: string) => {
    setPrestations(prestations.map(p => p.id === id ? { ...p, tarif } : p));
  };

  const addPostalCode = () => {
    if (!newPostalCode.trim()) return;
    if (postalCodes.find(p => p.code === newPostalCode.trim())) {
      alert('Ce code postal existe déjà');
      return;
    }
    setPostalCodes([...postalCodes, { code: newPostalCode.trim(), type: newPostalType }]);
    setNewPostalCode('');
  };

  const removePostalCode = (code: string) => {
    setPostalCodes(postalCodes.filter(p => p.code !== code));
  };

  const togglePostalType = (code: string) => {
    setPostalCodes(postalCodes.map(p => p.code === code ? { ...p, type: p.type === 'allowed' ? 'blocked' : 'allowed' } : p));
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

      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b border-secondary-200">
        {[
          { id: 'general', label: 'Général', icon: Settings },
          { id: 'tarifs', label: 'Tarifs', icon: Euro },
          { id: 'zones', label: 'Zones', icon: MapPin },
          { id: 'techniciens', label: 'Techniciens', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id as any)} className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors ${activeTab === id ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Onglet Général */}
      {activeTab === 'general' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
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

            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><MapPin className="w-5 h-5 text-purple-600" /></div>
                <div><h2 className="font-semibold">Adresse du siège</h2><p className="text-sm text-secondary-500">Point de départ par défaut</p></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse complète</label>
                <input type="text" value={entrepriseAddress} onChange={(e) => setEntrepriseAddress(e.target.value)} placeholder="15 Rue de la Gare, 60000 Beauvais" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                <p className="text-xs text-secondary-500 mt-1">Cette adresse sera utilisée comme point de départ pour l'optimisation des tournées</p>
              </div>
            </div>

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

            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div>
                <div><h2 className="font-semibold">Calendrier</h2><p className="text-sm text-secondary-500">Affichage</p></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Premier jour de la semaine</label><select value={settings.firstDayOfWeek} onChange={(e) => setSettings({ ...settings, firstDayOfWeek: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg"><option value="monday">Lundi</option><option value="sunday">Dimanche</option></select></div>
            </div>

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
          </div>

          <div>
            <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2 mb-6"><Save className="w-5 h-5" />Sauvegarder</button>
          </div>
        </div>
      )}

      {/* Onglet Tarifs */}
      {activeTab === 'tarifs' && (
        <div className="space-y-6">
          {/* Prestations principales */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h2 className="font-semibold mb-4">Prestations principales</h2>
            <div className="space-y-3">
              {prestations.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="font-medium">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <input type="text" value={p.tarif} onChange={(e) => updatePrestationTarif(p.id, e.target.value)} className="w-24 px-3 py-1 border border-secondary-200 rounded-lg text-right" />
                    <span className="text-secondary-500">€</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Équipements */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Équipements (Ramonage/Entretien)</h2>
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
                        {eq.interventions.length > 0 && <p className="text-xs text-secondary-500">{eq.interventions.map(i => `${i.name}: ${i.tarif}€`).join(' | ')}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" value={eq.tarif} onChange={(e) => setEquipments(equipments.map(x => x.id === eq.id ? { ...x, tarif: e.target.value } : x))} className="w-20 px-3 py-1 border border-secondary-200 rounded-lg text-right" />
                      <span className="text-secondary-500">€</span>
                      <button onClick={() => openEquipmentModal(eq)} className="p-2 hover:bg-secondary-200 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteEquipment(eq.id)} className="p-2 hover:bg-red-100 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2"><Save className="w-5 h-5" />Sauvegarder les tarifs</button>
        </div>
      )}

      {/* Onglet Zones */}
      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h2 className="font-semibold mb-4">Codes postaux autorisés / bloqués</h2>
            <p className="text-sm text-secondary-500 mb-4">Gérez les zones où vous intervenez. Vous pouvez autoriser un département entier (ex: 60) ou des codes spécifiques (ex: 60000).</p>

            <div className="flex gap-2 mb-4">
              <input type="text" value={newPostalCode} onChange={(e) => setNewPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="Code postal ou début (ex: 60)" className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg" />
              <select value={newPostalType} onChange={(e) => setNewPostalType(e.target.value as any)} className="px-3 py-2 border border-secondary-200 rounded-lg">
                <option value="allowed">Autorisé</option>
                <option value="blocked">Bloqué</option>
              </select>
              <button onClick={addPostalCode} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"><Plus className="w-4 h-4" /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1"><Check className="w-4 h-4" /> Autorisés</h3>
                <div className="space-y-2">
                  {postalCodes.filter(p => p.type === 'allowed').map((p) => (
                    <div key={p.code} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-mono font-medium">{p.code}{p.code.length < 5 && 'xxx'}</span>
                      <div className="flex gap-1">
                        <button onClick={() => togglePostalType(p.code)} className="p-1 hover:bg-green-200 rounded text-amber-600" title="Bloquer"><Ban className="w-4 h-4" /></button>
                        <button onClick={() => removePostalCode(p.code)} className="p-1 hover:bg-red-100 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {postalCodes.filter(p => p.type === 'allowed').length === 0 && <p className="text-sm text-secondary-400">Aucun code autorisé</p>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1"><Ban className="w-4 h-4" /> Bloqués</h3>
                <div className="space-y-2">
                  {postalCodes.filter(p => p.type === 'blocked').map((p) => (
                    <div key={p.code} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <span className="font-mono font-medium">{p.code}{p.code.length < 5 && 'xxx'}</span>
                      <div className="flex gap-1">
                        <button onClick={() => togglePostalType(p.code)} className="p-1 hover:bg-red-200 rounded text-green-600" title="Autoriser"><Check className="w-4 h-4" /></button>
                        <button onClick={() => removePostalCode(p.code)} className="p-1 hover:bg-red-100 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {postalCodes.filter(p => p.type === 'blocked').length === 0 && <p className="text-sm text-secondary-400">Aucun code bloqué</p>}
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2"><Save className="w-5 h-5" />Sauvegarder les zones</button>
        </div>
      )}

      {/* Onglet Techniciens */}
      {activeTab === 'techniciens' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Techniciens / Intervenants</h2>
              <button className="flex items-center gap-1 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
            <p className="text-sm text-secondary-500 mb-4">Gérez les techniciens et leur adresse de départ pour l'optimisation des tournées.</p>

            <div className="space-y-3">
              {techniciens.map((tech) => (
                <div key={tech.id} className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: tech.color }}>
                    {tech.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tech.name}</p>
                      {tech.isDefault && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">Par défaut</span>}
                    </div>
                    <p className="text-sm text-secondary-500">{tech.email}</p>
                    <p className="text-xs text-secondary-400 mt-1">📍 {tech.startAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={tech.color} onChange={(e) => setTechniciens(techniciens.map(t => t.id === tech.id ? { ...t, color: e.target.value } : t))} className="w-8 h-8 rounded cursor-pointer" />
                    <button className="p-2 hover:bg-secondary-200 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-red-100 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h2 className="font-semibold mb-4">Ajouter un technicien</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input type="text" placeholder="Nom du technicien" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" placeholder="email@exemple.fr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input type="tel" placeholder="06 12 34 56 78" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Couleur</label>
                <input type="color" defaultValue="#3b82f6" className="w-full h-10 rounded-lg cursor-pointer" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Adresse de départ</label>
                <input type="text" placeholder="Adresse complète (laisser vide pour utiliser l'adresse du siège)" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                <p className="text-xs text-secondary-500 mt-1">Si vide, l'adresse du siège sera utilisée comme point de départ</p>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">Ajouter le technicien</button>
          </div>

          <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2"><Save className="w-5 h-5" />Sauvegarder</button>
        </div>
      )}

      {/* Modal équipement */}
      {showEquipmentModal && editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEquipmentModal(false)} />
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingEquipment.name ? 'Modifier' : 'Ajouter'} équipement</h3>
              <button onClick={() => setShowEquipmentModal(false)} className="p-1 hover:bg-secondary-100 rounded"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><input type="text" value={editingEquipment.name} onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })} placeholder="Ex: Poêle à granulés" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" /></div>

              <div><label className="block text-sm font-medium mb-1">Tarif de base (€)</label><input type="text" value={editingEquipment.tarif} onChange={(e) => setEditingEquipment({ ...editingEquipment, tarif: e.target.value })} placeholder="Ex: 80" className="w-full px-3 py-2 border border-secondary-200 rounded-lg" /></div>

              <div><label className="block text-sm font-medium mb-2">Icône</label><div className="flex gap-2">{ICON_OPTIONS.map((opt) => { const I = opt.icon; return (<button key={opt.value} onClick={() => setEditingEquipment({ ...editingEquipment, icon: opt.value })} className={`p-3 rounded-lg border-2 ${editingEquipment.icon === opt.value ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}><I className="w-5 h-5" /></button>); })}</div></div>

              <div><label className="block text-sm font-medium mb-2">Couleur</label><div className="flex gap-2 flex-wrap">{COLOR_OPTIONS.map((opt) => (<button key={opt.value} onClick={() => setEditingEquipment({ ...editingEquipment, color: opt.value })} className={`w-8 h-8 rounded-lg ${opt.class} ${editingEquipment.color === opt.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} />))}</div></div>
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
