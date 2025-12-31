'use client';

import { useState } from 'react';
import { Settings, Save, Clock, MapPin, Bell } from 'lucide-react';

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    maxMorning: 5,
    maxAfternoon: 5,
    morningStart: '08:00',
    morningEnd: '12:00',
    afternoonStart: '14:00',
    afternoonEnd: '18:00',
    notifyEmail: true,
    notifySms: false,
  });

  const handleSave = () => {
    // TODO: Sauvegarder en BDD
    alert('Paramètres sauvegardés ! (simulation)');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Paramètres</h1>
        <p className="text-secondary-500">Configurez votre système de réservation</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Capacité */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-secondary-900">Capacité quotidienne</h2>
              <p className="text-sm text-secondary-500">Nombre de RDV max par créneau</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Matin (max)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxMorning}
                onChange={(e) => setSettings({ ...settings, maxMorning: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Après-midi (max)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxAfternoon}
                onChange={(e) => setSettings({ ...settings, maxAfternoon: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Horaires */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-secondary-900">Horaires</h2>
              <p className="text-sm text-secondary-500">Plages horaires affichées aux clients</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Matin</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={settings.morningStart}
                  onChange={(e) => setSettings({ ...settings, morningStart: e.target.value })}
                  className="px-3 py-2 border border-secondary-200 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-secondary-400">à</span>
                <input
                  type="time"
                  value={settings.morningEnd}
                  onChange={(e) => setSettings({ ...settings, morningEnd: e.target.value })}
                  className="px-3 py-2 border border-secondary-200 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Après-midi</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={settings.afternoonStart}
                  onChange={(e) => setSettings({ ...settings, afternoonStart: e.target.value })}
                  className="px-3 py-2 border border-secondary-200 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-secondary-400">à</span>
                <input
                  type="time"
                  value={settings.afternoonEnd}
                  onChange={(e) => setSettings({ ...settings, afternoonEnd: e.target.value })}
                  className="px-3 py-2 border border-secondary-200 rounded-lg
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-secondary-900">Notifications</h2>
              <p className="text-sm text-secondary-500">Alertes pour nouvelles demandes</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyEmail}
                onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.checked })}
                className="w-5 h-5 rounded text-primary-500"
              />
              <span>Notification par email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifySms}
                onChange={(e) => setSettings({ ...settings, notifySms: e.target.checked })}
                className="w-5 h-5 rounded text-primary-500"
              />
              <span>Notification par SMS (bientôt disponible)</span>
            </label>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={handleSave}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
}
