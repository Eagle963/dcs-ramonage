'use client';

import { useState } from 'react';
import { User, Building2, Mail, Phone, MapPin, Save, X } from 'lucide-react';

interface ClientFormData {
  type: 'PARTICULIER' | 'PROFESSIONNEL';
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  notes?: string;
}

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ClientForm({ initialData, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    type: initialData?.type || 'PARTICULIER',
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    email: initialData?.email || '',
    telephone: initialData?.telephone || '',
    adresse: initialData?.adresse || '',
    codePostal: initialData?.codePostal || '',
    ville: initialData?.ville || '',
    notes: initialData?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de client */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Type de client</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'PARTICULIER' }))}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.type === 'PARTICULIER'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Particulier</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'PROFESSIONNEL' }))}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.type === 'PROFESSIONNEL'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Professionnel</span>
          </button>
        </div>
      </div>

      {/* Nom / Prénom */}
      <div className="grid grid-cols-2 gap-4">
        {formData.type === 'PARTICULIER' && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Prénom"
            />
          </div>
        )}
        <div className={formData.type === 'PROFESSIONNEL' ? 'col-span-2' : ''}>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {formData.type === 'PARTICULIER' ? 'Nom' : 'Raison sociale'}
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={formData.type === 'PARTICULIER' ? 'Nom de famille' : 'Nom de l\'entreprise'}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="email@exemple.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" /> Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          <MapPin className="w-4 h-4 inline mr-1" /> Adresse
        </label>
        <input
          type="text"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Numéro et nom de rue"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Code postal</label>
          <input
            type="text"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
            required
            maxLength={5}
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="60000"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-1">Ville</label>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Beauvais"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Notes internes sur ce client..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
