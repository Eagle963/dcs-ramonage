'use client';

import { useState } from 'react';
import { Save, Palette, LayoutDashboard, Bell } from 'lucide-react';

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    // Apparence
    theme: 'light',
    accentColor: '#f97316',
    // Tableau de bord
    showRevenue: true,
    showTodayRdv: true,
    showUnpaidInvoices: true,
    showMonthlyChart: true,
    // Notifications
    notifyEmail: true,
    notifySms: false,
    notifyNewRdv: true,
    notifyRdvReminder: true,
  });

  const handleSave = () => {
    alert('Paramètres sauvegardés ! (simulation)');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Paramètres</h1>
        <p className="text-secondary-500">Personnalisez votre application</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Apparence */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Apparence</h3>
              <p className="text-sm text-secondary-500">Personnalisez l'interface</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Thème</label>
              <div className="flex gap-3">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, theme })}
                    className={`flex-1 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.theme === theme
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-secondary-200 hover:border-secondary-300 text-secondary-600'
                    }`}
                  >
                    {theme === 'light' ? '☀️ Clair' : theme === 'dark' ? '🌙 Sombre' : '💻 Système'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Couleur d'accent</label>
              <div className="flex gap-2">
                {[
                  { color: '#f97316', name: 'Orange' },
                  { color: '#3b82f6', name: 'Bleu' },
                  { color: '#22c55e', name: 'Vert' },
                  { color: '#8b5cf6', name: 'Violet' },
                  { color: '#ef4444', name: 'Rouge' },
                  { color: '#06b6d4', name: 'Cyan' },
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setSettings({ ...settings, accentColor: color })}
                    title={name}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      settings.accentColor === color 
                        ? 'border-secondary-900 scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Logo personnalisé</label>
              <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center hover:border-secondary-300 transition-colors cursor-pointer">
                <p className="text-sm text-secondary-500 mb-2">Glissez votre logo ici ou cliquez pour parcourir</p>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                  Parcourir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau de bord */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Tableau de bord</h3>
              <p className="text-sm text-secondary-500">Widgets à afficher</p>
            </div>
          </div>
          
          <div className="space-y-1">
            {[
              { key: 'showRevenue', label: 'Chiffre d\'affaires' },
              { key: 'showTodayRdv', label: 'RDV du jour' },
              { key: 'showUnpaidInvoices', label: 'Factures impayées' },
              { key: 'showMonthlyChart', label: 'Graphique mensuel' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                <span className="text-sm text-secondary-700">{label}</span>
                <button
                  onClick={() => setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings[key as keyof typeof settings] ? 'bg-primary-500' : 'bg-secondary-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Notifications</h3>
              <p className="text-sm text-secondary-500">Gérez vos alertes</p>
            </div>
          </div>
          
          <div className="space-y-1">
            {[
              { key: 'notifyEmail', label: 'Notifications par email' },
              { key: 'notifySms', label: 'Notifications par SMS' },
              { key: 'notifyNewRdv', label: 'Nouvelle demande de RDV' },
              { key: 'notifyRdvReminder', label: 'Rappel de RDV (J-1)' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                <span className="text-sm text-secondary-700">{label}</span>
                <button
                  onClick={() => setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings[key as keyof typeof settings] ? 'bg-primary-500' : 'bg-secondary-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <div className="lg:col-span-2">
          <button 
            onClick={handleSave} 
            className="w-full md:w-auto px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}
