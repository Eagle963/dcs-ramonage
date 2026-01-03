'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, User, MapPin, FileText, Receipt } from 'lucide-react';

interface LigneFacture {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
}

interface FactureFormData {
  clientId: string;
  clientNom: string;
  adresseChantier: string;
  villeChantier: string;
  codePostalChantier: string;
  dateFacture: string;
  dateEcheance: string;
  devisReference?: string;
  lignes: LigneFacture[];
  notes?: string;
  modePaiement: string;
}

interface FactureFormProps {
  initialData?: Partial<FactureFormData>;
  onSubmit: (data: FactureFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultLigne = (): LigneFacture => ({
  id: Math.random().toString(36).substr(2, 9),
  description: '',
  quantite: 1,
  prixUnitaire: 0,
  tva: 10,
});

export default function FactureForm({ initialData, onSubmit, onCancel, isLoading }: FactureFormProps) {
  const [formData, setFormData] = useState<FactureFormData>({
    clientId: initialData?.clientId || '',
    clientNom: initialData?.clientNom || '',
    adresseChantier: initialData?.adresseChantier || '',
    villeChantier: initialData?.villeChantier || '',
    codePostalChantier: initialData?.codePostalChantier || '',
    dateFacture: initialData?.dateFacture || new Date().toISOString().split('T')[0],
    dateEcheance: initialData?.dateEcheance || new Date().toISOString().split('T')[0],
    devisReference: initialData?.devisReference || '',
    lignes: initialData?.lignes || [defaultLigne()],
    notes: initialData?.notes || '',
    modePaiement: initialData?.modePaiement || 'ESPECES',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLigneChange = (id: string, field: keyof LigneFacture, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lignes: prev.lignes.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  };

  const addLigne = () => {
    setFormData(prev => ({
      ...prev,
      lignes: [...prev.lignes, defaultLigne()],
    }));
  };

  const removeLigne = (id: string) => {
    if (formData.lignes.length > 1) {
      setFormData(prev => ({
        ...prev,
        lignes: prev.lignes.filter(l => l.id !== id),
      }));
    }
  };

  const calculs = {
    totalHT: formData.lignes.reduce((acc, l) => acc + (l.quantite * l.prixUnitaire), 0),
    totalTVA: formData.lignes.reduce((acc, l) => acc + (l.quantite * l.prixUnitaire * l.tva / 100), 0),
    get totalTTC() { return this.totalHT + this.totalTVA; },
  };

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const servicesPredefinis = [
    { label: 'Ramonage cheminée', prix: 70 },
    { label: 'Ramonage poêle à bois', prix: 70 },
    { label: 'Ramonage poêle à granulés', prix: 90 },
    { label: 'Ramonage chaudière fioul', prix: 90 },
    { label: 'Ramonage chaudière gaz', prix: 80 },
    { label: 'Entretien insert', prix: 120 },
    { label: 'Débistrage', prix: 250 },
    { label: 'Tubage flexible', prix: 450 },
    { label: 'Déplacement', prix: 0 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client */}
      <div className="bg-secondary-50 rounded-xl p-4">
        <h3 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4" /> Client
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-1">Client</label>
            <input
              type="text"
              name="clientNom"
              value={formData.clientNom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Nom du client..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Devis associé (optionnel)</label>
            <input
              type="text"
              name="devisReference"
              value={formData.devisReference}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="D0001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Mode de paiement</label>
            <select
              name="modePaiement"
              value={formData.modePaiement}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="ESPECES">Espèces</option>
              <option value="CHEQUE">Chèque</option>
              <option value="VIREMENT">Virement</option>
              <option value="CB">Carte bancaire</option>
              <option value="PRELEVEMENT">Prélèvement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Adresse chantier */}
      <div className="bg-secondary-50 rounded-xl p-4">
        <h3 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Adresse d'intervention
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            name="adresseChantier"
            value={formData.adresseChantier}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            placeholder="Adresse"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              name="codePostalChantier"
              value={formData.codePostalChantier}
              onChange={handleChange}
              required
              maxLength={5}
              className="px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Code postal"
            />
            <input
              type="text"
              name="villeChantier"
              value={formData.villeChantier}
              onChange={handleChange}
              required
              className="col-span-2 px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Ville"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Date de facturation</label>
          <input
            type="date"
            name="dateFacture"
            value={formData.dateFacture}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Date d'échéance</label>
          <input
            type="date"
            name="dateEcheance"
            value={formData.dateEcheance}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lignes de facture */}
      <div>
        <h3 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Prestations
        </h3>
        
        <div className="space-y-3">
          {formData.lignes.map((ligne) => (
            <div key={ligne.id} className="flex gap-2 items-start p-3 bg-secondary-50 rounded-lg">
              <div className="flex-1 grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <select
                    value={ligne.description}
                    onChange={(e) => {
                      const service = servicesPredefinis.find(s => s.label === e.target.value);
                      handleLigneChange(ligne.id, 'description', e.target.value);
                      if (service && service.prix > 0) {
                        handleLigneChange(ligne.id, 'prixUnitaire', service.prix);
                      }
                    }}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
                  >
                    <option value="">Sélectionner...</option>
                    {servicesPredefinis.map(s => (
                      <option key={s.label} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={ligne.quantite}
                    onChange={(e) => handleLigneChange(ligne.id, 'quantite', parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm text-center"
                    placeholder="Qté"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={ligne.prixUnitaire}
                    onChange={(e) => handleLigneChange(ligne.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                    step={0.01}
                    min={0}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm text-right"
                    placeholder="Prix HT"
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={ligne.tva}
                    onChange={(e) => handleLigneChange(ligne.id, 'tva', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
                  >
                    <option value={10}>10%</option>
                    <option value={20}>20%</option>
                    <option value={5.5}>5.5%</option>
                    <option value={0}>0%</option>
                  </select>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeLigne(ligne.id)}
                    disabled={formData.lignes.length === 1}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addLigne}
          className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une ligne
        </button>
      </div>

      {/* Totaux */}
      <div className="bg-secondary-900 text-white rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-secondary-300">Total HT</span>
          <span className="font-medium">{formatMoney(calculs.totalHT)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-secondary-300">TVA</span>
          <span className="font-medium">{formatMoney(calculs.totalTVA)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-secondary-700">
          <span className="text-lg font-semibold">Total TTC</span>
          <span className="text-xl font-bold text-primary-400">{formatMoney(calculs.totalTTC)}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Notes sur la facture..."
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
          {isLoading ? 'Enregistrement...' : 'Créer la facture'}
        </button>
      </div>
    </form>
  );
}
