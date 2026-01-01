'use client';

import { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, Eye, Edit2, Trash2, 
  Download, ChevronLeft, ChevronRight, RotateCcw, Send
} from 'lucide-react';

interface Avoir {
  id: string;
  numero: string;
  factureOrigine: string;
  client: string;
  date: string;
  montantHT: number;
  montantTTC: number;
  motif: string;
  statut: 'BROUILLON' | 'EMIS' | 'REMBOURSE';
}

const mockAvoirs: Avoir[] = [
  {
    id: '1',
    numero: 'AV-2026-001',
    factureOrigine: 'F-2025-089',
    client: 'Jean Dupont',
    date: '2026-01-05',
    montantHT: 80,
    montantTTC: 96,
    motif: 'Prestation non effectuée',
    statut: 'EMIS',
  },
  {
    id: '2',
    numero: 'AV-2026-002',
    factureOrigine: 'F-2025-092',
    client: 'Paul Blanc',
    date: '2026-01-08',
    montantHT: 50,
    montantTTC: 60,
    motif: 'Erreur de facturation',
    statut: 'REMBOURSE',
  },
];

const statutConfig = {
  BROUILLON: { label: 'Brouillon', color: 'bg-secondary-100 text-secondary-700' },
  EMIS: { label: 'Émis', color: 'bg-blue-100 text-blue-700' },
  REMBOURSE: { label: 'Remboursé', color: 'bg-green-100 text-green-700' },
};

export default function AvoirsPage() {
  const [avoirs] = useState<Avoir[]>(mockAvoirs);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredAvoirs = avoirs.filter(a =>
    a.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const totalAvoirs = avoirs.reduce((acc, a) => acc + a.montantTTC, 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Total avoirs</p>
          <p className="text-2xl font-bold">{avoirs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Montant total</p>
          <p className="text-2xl font-bold text-red-600">{formatMoney(totalAvoirs)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">À rembourser</p>
          <p className="text-2xl font-bold text-amber-600">
            {formatMoney(avoirs.filter(a => a.statut === 'EMIS').reduce((acc, a) => acc + a.montantTTC, 0))}
          </p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
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
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          Nouvel avoir
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Numéro</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Facture</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Motif</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredAvoirs.map((a) => {
                const config = statutConfig[a.statut];
                return (
                  <tr key={a.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-primary-600">{a.numero}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-600">{a.factureOrigine}</td>
                    <td className="px-4 py-3 font-medium">{a.client}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(a.date)}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">-{formatMoney(a.montantTTC)}</td>
                    <td className="px-4 py-3 text-sm text-secondary-500">{a.motif}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center relative">
                        <button
                          onClick={() => setShowActions(showActions === a.id ? null : a.id)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-secondary-500" />
                        </button>
                        {showActions === a.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Eye className="w-4 h-4" /> Voir
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Download className="w-4 h-4" /> PDF
                            </button>
                            {a.statut === 'BROUILLON' && (
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                <Send className="w-4 h-4" /> Émettre
                              </button>
                            )}
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
          <p className="text-sm text-secondary-500">{filteredAvoirs.length} avoirs</p>
        </div>
      </div>
    </div>
  );
}
