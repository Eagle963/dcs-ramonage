'use client';

import { useState } from 'react';
import { User, Building2, Home, Mail, Phone, Save, MapPin } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';
import CompanySearch from './CompanySearch';

type ClientType = 'PARTICULIER' | 'PROFESSIONNEL' | 'SYNDIC';

interface ContactInfo {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
}

interface AddressInfo {
  adresse: string;
  complement: string;
  codePostal: string;
  ville: string;
  lat?: number;
  lng?: number;
}

interface EntrepriseInfo {
  raisonSociale: string;
  siret: string;
  tvaIntra: string;
  codeAPE: string;
}

interface ClientFormData {
  type: ClientType;
  // Particulier
  civilite?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  // Adresse principale
  adresse: AddressInfo;
  // Professionnel / Syndic
  entreprise?: EntrepriseInfo;
  contact?: ContactInfo;
  // Notes
  notes?: string;
}

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultAddress: AddressInfo = {
  adresse: '',
  complement: '',
  codePostal: '',
  ville: '',
};

const defaultContact: ContactInfo = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
};

const defaultEntreprise: EntrepriseInfo = {
  raisonSociale: '',
  siret: '',
  tvaIntra: '',
  codeAPE: '',
};

export default function ClientForm({ initialData, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    type: initialData?.type || 'PARTICULIER',
    civilite: initialData?.civilite || '',
    prenom: initialData?.prenom || '',
    nom: initialData?.nom || '',
    email: initialData?.email || '',
    telephone: initialData?.telephone || '',
    adresse: initialData?.adresse || { ...defaultAddress },
    entreprise: initialData?.entreprise || { ...defaultEntreprise },
    contact: initialData?.contact || { ...defaultContact },
    notes: initialData?.notes || '',
  });

  const handleTypeChange = (type: ClientType) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address: any) => {
    if (address) {
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse,
          adresse: `${address.housenumber || ''} ${address.street || ''}`.trim() || address.label,
          codePostal: address.postcode,
          ville: address.city,
          lat: address.lat,
          lng: address.lng,
        },
      }));
    }
  };

  const handleCompanySelect = (company: any) => {
    setFormData(prev => ({
      ...prev,
      entreprise: {
        raisonSociale: company.nom,
        siret: company.siret,
        tvaIntra: company.tvaIntra,
        codeAPE: company.codeAPE,
      },
      adresse: {
        ...prev.adresse,
        adresse: company.adresse,
        codePostal: company.codePostal,
        ville: company.ville,
        lat: company.lat,
        lng: company.lng,
      },
    }));
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact!, [field]: value },
    }));
  };

  const handleEntrepriseChange = (field: keyof EntrepriseInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      entreprise: { ...prev.entreprise!, [field]: value },
    }));
  };

  const handleAddressFieldChange = (field: keyof AddressInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      adresse: { ...prev.adresse, [field]: value },
    }));
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
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('PARTICULIER')}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              formData.type === 'PARTICULIER'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="font-medium text-sm">Particulier</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('PROFESSIONNEL')}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              formData.type === 'PROFESSIONNEL'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <Building2 className="w-6 h-6" />
            <span className="font-medium text-sm">Professionnel</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('SYNDIC')}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              formData.type === 'SYNDIC'
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="font-medium text-sm">Syndic</span>
          </button>
        </div>
      </div>

      {/* Formulaire Particulier */}
      {formData.type === 'PARTICULIER' && (
        <>
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900 flex items-center gap-2">
              <User className="w-4 h-4" /> Informations personnelles
            </h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Civilité</label>
                <select
                  name="civilite"
                  value={formData.civilite}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-white"
                >
                  <option value="">-</option>
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                  placeholder="Prénom"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                  placeholder="Nom de famille"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  <Mail className="w-3 h-3 inline mr-1" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  <Phone className="w-3 h-3 inline mr-1" /> Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
          </div>

          {/* Adresse Particulier */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Adresse
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Adresse *</label>
              <AddressAutocomplete
                value={formData.adresse.adresse}
                onChange={handleAddressSelect}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Complément d'adresse</label>
              <input
                type="text"
                value={formData.adresse.complement}
                onChange={(e) => handleAddressFieldChange('complement', e.target.value)}
                className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                placeholder="Bâtiment, étage, appartement..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Code postal *</label>
                <input
                  type="text"
                  value={formData.adresse.codePostal}
                  onChange={(e) => handleAddressFieldChange('codePostal', e.target.value)}
                  required
                  maxLength={5}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Ville *</label>
                <input
                  type="text"
                  value={formData.adresse.ville}
                  onChange={(e) => handleAddressFieldChange('ville', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Formulaire Professionnel */}
      {formData.type === 'PROFESSIONNEL' && (
        <>
          <div className="bg-purple-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-purple-900 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Entreprise
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Rechercher une entreprise</label>
              <CompanySearch onSelect={handleCompanySelect} />
              <p className="text-xs text-secondary-500 mt-1">Recherchez par nom ou SIRET pour remplir automatiquement</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Raison sociale *</label>
                <input
                  type="text"
                  value={formData.entreprise?.raisonSociale}
                  onChange={(e) => handleEntrepriseChange('raisonSociale', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>
          </div>

          {/* Adresse entreprise */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Adresse
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Adresse *</label>
              <AddressAutocomplete
                value={formData.adresse.adresse}
                onChange={handleAddressSelect}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Complément d'adresse</label>
              <input
                type="text"
                value={formData.adresse.complement}
                onChange={(e) => handleAddressFieldChange('complement', e.target.value)}
                className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                placeholder="Bâtiment, étage..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Code postal *</label>
                <input
                  type="text"
                  value={formData.adresse.codePostal}
                  onChange={(e) => handleAddressFieldChange('codePostal', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Ville *</label>
                <input
                  type="text"
                  value={formData.adresse.ville}
                  onChange={(e) => handleAddressFieldChange('ville', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Contact entreprise */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900 flex items-center gap-2">
              <User className="w-4 h-4" /> Contact au sein de l'entreprise
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Prénom du contact</label>
                <input
                  type="text"
                  value={formData.contact?.prenom}
                  onChange={(e) => handleContactChange('prenom', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Nom du contact</label>
                <input
                  type="text"
                  value={formData.contact?.nom}
                  onChange={(e) => handleContactChange('nom', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contact?.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                  placeholder="email@entreprise.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.contact?.telephone}
                  onChange={(e) => handleContactChange('telephone', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Détails entreprise */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900">Détails de l'entreprise</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">SIRET</label>
                <input
                  type="text"
                  value={formData.entreprise?.siret}
                  onChange={(e) => handleEntrepriseChange('siret', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">N° TVA intra.</label>
                <input
                  type="text"
                  value={formData.entreprise?.tvaIntra}
                  onChange={(e) => handleEntrepriseChange('tvaIntra', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Code APE</label>
                <input
                  type="text"
                  value={formData.entreprise?.codeAPE}
                  onChange={(e) => handleEntrepriseChange('codeAPE', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Formulaire Syndic */}
      {formData.type === 'SYNDIC' && (
        <>
          <div className="bg-amber-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-amber-900 flex items-center gap-2">
              <Home className="w-4 h-4" /> Syndicat de copropriété
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Rechercher le syndic</label>
              <CompanySearch 
                onSelect={handleCompanySelect}
                placeholder="Rechercher le syndic (nom ou SIRET)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Nom du syndicat de copropriété *</label>
              <input
                type="text"
                value={formData.entreprise?.raisonSociale}
                onChange={(e) => handleEntrepriseChange('raisonSociale', e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                placeholder="Ex: Syndic Foncia, Nexity..."
              />
            </div>
          </div>

          {/* Adresse syndic */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Adresse
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Adresse *</label>
              <AddressAutocomplete
                value={formData.adresse.adresse}
                onChange={handleAddressSelect}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Complément d'adresse</label>
              <input
                type="text"
                value={formData.adresse.complement}
                onChange={(e) => handleAddressFieldChange('complement', e.target.value)}
                className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Code postal *</label>
                <input
                  type="text"
                  value={formData.adresse.codePostal}
                  onChange={(e) => handleAddressFieldChange('codePostal', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Ville *</label>
                <input
                  type="text"
                  value={formData.adresse.ville}
                  onChange={(e) => handleAddressFieldChange('ville', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Contact syndic */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900 flex items-center gap-2">
              <User className="w-4 h-4" /> Contact au sein du syndic
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Prénom du contact</label>
                <input
                  type="text"
                  value={formData.contact?.prenom}
                  onChange={(e) => handleContactChange('prenom', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Nom du contact</label>
                <input
                  type="text"
                  value={formData.contact?.nom}
                  onChange={(e) => handleContactChange('nom', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contact?.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.contact?.telephone}
                  onChange={(e) => handleContactChange('telephone', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Détails syndic */}
          <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
            <h3 className="font-medium text-secondary-900">Détails du syndic</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">SIRET</label>
                <input
                  type="text"
                  value={formData.entreprise?.siret}
                  onChange={(e) => handleEntrepriseChange('siret', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">N° TVA intra.</label>
                <input
                  type="text"
                  value={formData.entreprise?.tvaIntra}
                  onChange={(e) => handleEntrepriseChange('tvaIntra', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Code APE</label>
                <input
                  type="text"
                  value={formData.entreprise?.codeAPE}
                  onChange={(e) => handleEntrepriseChange('codeAPE', e.target.value)}
                  className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg bg-secondary-100"
                  readOnly
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Notes internes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg resize-none"
          placeholder="Notes visibles uniquement par vous..."
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
