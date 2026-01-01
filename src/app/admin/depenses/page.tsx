'use client';

import { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, Fuel, Wrench, Package, Car,
  FileText, Upload, Receipt
} from 'lucide-react';

interface Depense {
  id: string;
  reference: string;
  fournisseur: string;
  categorie: 'CARBURANT' | 'FOURNITURES' | 'EQUIPEMENT' | 'VEHICULE' | 'AUTRES';
  date: string;
  montantHT: number;
  montantTTC: number;
  tva: number;
  justificatif: boolean;
  description: string;
}

const mockDepenses: Depense[] = [
  {
    id: '1',
    reference: 'DEP-2026-001',
    fournisseur: 'TotalEnergies',
    categorie: 'CARBURANT',
    date: '2026-01-05',
    montantHT: 83.33,
    montantTTC: 100,
    tva: 20,
    justificatif: true,
    description: 'Plein essence véhicule',
  },
  {
    id: '2',
    reference: 'DEP-2026-002',
    fournisseur: 'Brico Dépôt',
    categorie: 'FOURNITURES',
    date: '2026-01-08',
    montantHT: 45.83,
    montantTTC: 55,
    tva: 20,
    justificatif: true,
    description: 'Hérissons de ramonage',
  },
  {
    id: '3',
    reference: 'DEP-2026-003',
    fournisseur: 'Amazon Pro',
    categorie: 'EQUIPEMENT',
    date: '2026-01-10',
    montantHT: 208.33,
    montantTTC: 250,
    tva: 20,
    justificatif: false,
    description: 'Aspirateur industriel',
  },
  {
    id: '4',
    reference: 'DEP-2026-004',
    fournisseur: 'Speedy',
    categorie: 'VEHICULE',
    date: '2026-01-12',
    montantHT: 125,
    montantTTC: 150,
    tva: 20,
    justificatif: true,
    description: 'Vidange + filtres',
  },
];

const categorieConfig = {
  CARBURANT: { label: 'Carburant', icon: Fuel, color: 'bg-amber-100 text-amber-700' },
  FOURNITURES: { label: 'Fournitures', icon: Package, color: 'bg-blue-100 text-blue-700' },
  EQUIPEMENT: { label: 'Équipement', icon: Wrench, color: 'bg-purple-100 text-purple-700' },
  VEHICULE: { label: 'Véhicule', icon: Car, color: 'bg-green-100 text-green-700' },
  AUTRES: { label: 'Autres', icon: FileText, color: 'bg-secondary-100 text-secondary-700' },
};

export default function DepensesPage() {
  const [depenses] = useState<Depense[]>(mockDepenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorieFilter, setCategorieFilter] = useState<string>('ALL');
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredDepenses = depenses.filter(d => {
    const matchSearch = d.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fournisseur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategorie = categorieFilter === 'ALL' || d.categorie === categorieFilter;
    return matchSearch && matchCategorie;
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const totalDepenses = depenses.reduce((acc, d) => acc + d.montantTTC, 0);
  const totalTVA = depenses.reduce((acc, d) => acc + (d.montantTTC - d.montantHT), 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Total dépenses</p>
          <p className="text-2xl font-bold text-red-600">{formatMoney(totalDepenses)}</p>
          <p className="text-xs text-secondary-400">Ce mois</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">TVA récupérable</p>
          <p className="text-2xl font-bold text-green-600">{formatMoney(totalTVA)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Carburant</p>
          <p className="text-xl font-bold">
            {formatMoney(depenses.filter(d => d.categorie === 'CARBURANT').reduce((acc, d) => acc + d.montantTTC, 0))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Sans justificatif</p>
          <p className="text-xl font-bold text-amber-600">{depenses.filter(d => !d.justificatif).length}</p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={categorieFilter}
            onChange={(e) => setCategorieFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
          >
            <option value="ALL">Toutes catégories</option>
            <option value="CARBURANT">Carburant</option>
            <option value="FOURNITURES">Fournitures</option>
            <option value="EQUIPEMENT">Équipement</option>
            <option value="VEHICULE">Véhicule</option>
            <option value="AUTRES">Autres</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          Nouvelle dépense
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Fournisseur</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">TTC</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Justif.</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredDepenses.map((d) => {
                const config = categorieConfig[d.categorie];
                const CatIcon = config.icon;
                return (
                  <tr key={d.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <span className="font-medium">{d.reference}</span>
                      <p className="text-xs text-secondary-500">{d.description}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{d.fournisseur}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <CatIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(d.date)}</td>
                    <td className="px-4 py-3 text-right text-sm">{formatMoney(d.montantHT)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatMoney(d.montantTTC)}</td>
                    <td className="px-4 py-3 text-center">
                      {d.justificatif ? (
                        <Receipt className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <button className="text-amber-500 hover:text-amber-600">
                          <Upload className="w-4 h-4 mx-auto" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center relative">
                        <button
                          onClick={() => setShowActions(showActions === d.id ? null : d.id)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-secondary-500" />
                        </button>
                        {showActions === d.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Eye className="w-4 h-4" /> Voir
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Edit2 className="w-4 h-4" /> Modifier
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Upload className="w-4 h-4" /> Justificatif
                            </button>
                            <hr className="my-1" />
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100">
          <p className="text-sm text-secondary-500">{filteredDepenses.length} dépenses</p>
        </div>
      </div>
    </div>
  );
}
