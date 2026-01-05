'use client';

import { useState } from 'react';
import { Settings, Save, Clock, Calendar, Bell, Wrench, FileText, CreditCard, Palette, LayoutDashboard } from 'lucide-react';

type TabType = 'personnalisation' | 'chantiers' | 'calendrier' | 'devis-factures' | 'paiements';

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<TabType>('personnalisation');
  
  const [settings, setSettings] = useState({
    // Personnalisation
    theme: 'light',
    accentColor: '#f97316',
    logo: '',
    // Calendrier
    maxMorning: 5,
    maxAfternoon: 5,
    morningStart: '08:00',
    morningEnd: '12:00',
    afternoonStart: '14:00',
    afternoonEnd: '18:00',
    firstDayOfWeek: 'monday',
    // Notifications
    notifyEmail: true,
    notifySms: false,
    // Devis/Factures
    devisPrefix: 'D',
    facturePrefix: 'F',
    avoirPrefix: 'A',
    tvaDefault: 10,
    // Paiements
    delaiPaiement: 30,
    penalitesRetard: true,
    // Chantiers
    suiviChantier: true,
    photosObligatoires: false,
  });

  const handleSave = () => {
    alert('Paramètres sauvegardés ! (simulation)');
  };

  const tabs = [
    { id: 'personnalisation', label: 'Personnalisation', icon: Palette },
    { id: 'chantiers', label: 'Chantiers', icon: Wrench },
    { id: 'calendrier', label: 'Calendrier', icon: Calendar },
    { id: 'devis-factures', label: 'Devis et factures', icon: FileText },
    { id: 'paiements', label: 'Paiements', icon: CreditCard },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Paramètres</h1>
        <p className="text-secondary-500">Configurez les paramètres de votre application</p>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b border-secondary-200 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id as TabType)} 
            className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === id 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Personnalisation */}
      {activeTab === 'personnalisation' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Apparence</h3>
                <p className="text-sm text-secondary-500">Personnalisez l'apparence de votre interface</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Thème</label>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSettings({ ...settings, theme })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        settings.theme === theme
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                    >
                      {theme === 'light' ? 'Clair' : theme === 'dark' ? 'Sombre' : 'Système'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Couleur d'accent</label>
                <div className="flex gap-2">
                  {['#f97316', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444', '#06b6d4'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSettings({ ...settings, accentColor: color })}
                      className={`w-10 h-10 rounded-lg border-2 ${
                        settings.accentColor === color ? 'border-secondary-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Logo personnalisé</label>
                <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-secondary-500">Glissez votre logo ici ou cliquez pour parcourir</p>
                  <button className="mt-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm hover:bg-secondary-200">
                    Parcourir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Tableau de bord</h3>
                <p className="text-sm text-secondary-500">Personnalisez votre tableau de bord</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <span className="text-sm text-secondary-700">Afficher le chiffre d'affaires</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <span className="text-sm text-secondary-700">Afficher les RDV du jour</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <span className="text-sm text-secondary-700">Afficher les factures impayées</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-secondary-700">Afficher le graphique mensuel</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Chantiers */}
      {activeTab === 'chantiers' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Gestion des chantiers</h3>
                <p className="text-sm text-secondary-500">Configuration du suivi de chantiers</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <div>
                  <span className="text-sm font-medium text-secondary-700">Suivi de chantier</span>
                  <p className="text-xs text-secondary-500">Activer le module de suivi</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.suiviChantier} 
                  onChange={(e) => setSettings({ ...settings, suiviChantier: e.target.checked })}
                  className="toggle" 
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <div>
                  <span className="text-sm font-medium text-secondary-700">Photos obligatoires</span>
                  <p className="text-xs text-secondary-500">Exiger des photos avant/après</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.photosObligatoires}
                  onChange={(e) => setSettings({ ...settings, photosObligatoires: e.target.checked })}
                  className="toggle" 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Calendrier */}
      {activeTab === 'calendrier' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Créneaux horaires</h3>
                <p className="text-sm text-secondary-500">Définissez vos plages de travail</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Début matin</label>
                  <input
                    type="time"
                    value={settings.morningStart}
                    onChange={(e) => setSettings({ ...settings, morningStart: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Fin matin</label>
                  <input
                    type="time"
                    value={settings.morningEnd}
                    onChange={(e) => setSettings({ ...settings, morningEnd: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Début après-midi</label>
                  <input
                    type="time"
                    value={settings.afternoonStart}
                    onChange={(e) => setSettings({ ...settings, afternoonStart: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Fin après-midi</label>
                  <input
                    type="time"
                    value={settings.afternoonEnd}
                    onChange={(e) => setSettings({ ...settings, afternoonEnd: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-100">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">RDV max / matin</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={settings.maxMorning}
                    onChange={(e) => setSettings({ ...settings, maxMorning: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">RDV max / après-midi</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={settings.maxAfternoon}
                    onChange={(e) => setSettings({ ...settings, maxAfternoon: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Notifications</h3>
                <p className="text-sm text-secondary-500">Gérez vos alertes</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                <span className="text-sm text-secondary-700">Notifications par email</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifyEmail} 
                  onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.checked })}
                  className="toggle" 
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-secondary-700">Notifications par SMS</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifySms}
                  onChange={(e) => setSettings({ ...settings, notifySms: e.target.checked })}
                  className="toggle" 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Devis et factures */}
      {activeTab === 'devis-factures' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Numérotation</h3>
                <p className="text-sm text-secondary-500">Préfixes des documents</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Préfixe devis</label>
                <input
                  type="text"
                  value={settings.devisPrefix}
                  onChange={(e) => setSettings({ ...settings, devisPrefix: e.target.value })}
                  className="input"
                  placeholder="D"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Préfixe facture</label>
                <input
                  type="text"
                  value={settings.facturePrefix}
                  onChange={(e) => setSettings({ ...settings, facturePrefix: e.target.value })}
                  className="input"
                  placeholder="F"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Préfixe avoir</label>
                <input
                  type="text"
                  value={settings.avoirPrefix}
                  onChange={(e) => setSettings({ ...settings, avoirPrefix: e.target.value })}
                  className="input"
                  placeholder="A"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">TVA par défaut</h3>
                <p className="text-sm text-secondary-500">Taux appliqué automatiquement</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Taux de TVA (%)</label>
                <select
                  value={settings.tvaDefault}
                  onChange={(e) => setSettings({ ...settings, tvaDefault: parseInt(e.target.value) })}
                  className="input"
                >
                  <option value={0}>0%</option>
                  <option value={5.5}>5.5%</option>
                  <option value={10}>10%</option>
                  <option value={20}>20%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Paiements */}
      {activeTab === 'paiements' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Conditions de paiement</h3>
                <p className="text-sm text-secondary-500">Paramètres par défaut</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Délai de paiement (jours)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.delaiPaiement}
                  onChange={(e) => setSettings({ ...settings, delaiPaiement: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t border-secondary-100">
                <div>
                  <span className="text-sm font-medium text-secondary-700">Pénalités de retard</span>
                  <p className="text-xs text-secondary-500">Appliquer des pénalités automatiques</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.penalitesRetard}
                  onChange={(e) => setSettings({ ...settings, penalitesRetard: e.target.checked })}
                  className="toggle" 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button onClick={handleSave} className="btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
