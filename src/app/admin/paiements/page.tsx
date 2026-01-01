'use client';

import { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, CreditCard, Banknote, Building2,
  Smartphone, CheckCircle2
} from 'lucide-react';

interface Paiement {
  id: string;
  reference: string;
  facture: {
    numero: string;
    client: string;
  };
  date: string;
  montant: number;
  mode: 'ESPECES' | 'CHEQUE' | 'VIREMENT' | 'CB' | 'PRELEVEMENT';
  notes?: string;
}

const mockPaiements: Paiement[] = [
  {
    id: '1',
    reference: 'P-2026-001',
    facture: { numero: 'F-2026-001', client: 'Marie Martin' },
    date: '2026-01-10',
    montant: 384,
    mode: 'VIREMENT',
  },
  {
    id: '2',
    reference: 'P-2026-002',
    facture: { numero: 'F-2026-004', client: 'Sophie Leroy' },
    date: '2026-01-12',
    montant: 300,
    mode: 'CB',
    notes: 'Paiement partiel - solde à venir',
  },
  {
    id: '3',
    reference: 'P-2026-003',
    facture: { numero: 'F-2025-098', client: 'Luc Petit' },
    date: '2026-01-08',
    montant: 150,
    mode: 'CHEQUE',
    notes: 'Chèque n°1234567',
  },
  {
    id: '4',
    reference: 'P-2026-004',
    facture: { numero: 'F-2025-095', client: 'Emma Roux' },
    date: '2026-01-05',
    montant: 95,
    mode: 'ESPECES',
  },
  {
    id: '5',
    reference: 'P-2026-005',
    facture: { numero: 'F-2025-092', client: 'Paul Blanc' },
    date: '2026-01-03',
    montant: 220,
    mode: 'PRELEVEMENT',
  },
];

const modeConfig = {
  ESPECES: { label: 'Espèces', icon: Banknote, color: 'bg-green-100 text-green-700' },
  CHEQUE: { label: 'Chèque', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
  VIREMENT: { label: 'Virement', icon: Building2, color: 'bg-purple-100 text-purple-700' },
  CB: { label: 'Carte bancaire', icon: CreditCard, color: 'bg-amber-100 text-amber-700' },
  PRELEVEMENT: { label: 'Prélèvement', icon: Smartphone, color: 'bg-cyan-100 text-cyan-700' },
};

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>(mockPaiements);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredPaiements = paiements.filter(p => {
    const matchSearch = p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.facture.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.facture.numero.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMode = modeFilter === 'ALL' || p.mode === modeFilter;
    return matchSearch && matchMode;
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const totalMois = paiements.reduce((acc, p) => acc + p.montant, 0);
  const parMode = {
    especes: paiements.filter(p => p.mode === 'ESPECES').reduce((acc, p) => acc + p.montant, 0),
    cheque: paiements.filter(p => p.mode === 'CHEQUE').reduce((acc, p) => acc + p.montant, 0),
    virement: paiements.filter(p => p.mode === 'VIREMENT').reduce((acc, p) => acc + p.montant, 0),
    cb: paiements.filter(p => p.mode === 'CB').reduce((acc, p) => acc + p.montant, 0),
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Total encaissé</p>
          <p className="text-2xl font-bold text-green-600">{formatMoney(totalMois)}</p>
          <p className="text-xs text-secondary-400">Ce mois</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Espèces</p>
          <p className="text-xl font-bold">{formatMoney(parMode.especes)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Chèques</p>
          <p className="text-xl font-bold">{formatMoney(parMode.cheque)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Virements</p>
          <p className="text-xl font-bold">{formatMoney(parMode.virement)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">CB</p>
          <p className="text-xl font-bold">{formatMoney(parMode.cb)}</p>
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
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
          >
            <option value="ALL">Tous les modes</option>
            <option value="ESPECES">Espèces</option>
            <option value="CHEQUE">Chèque</option>
            <option value="VIREMENT">Virement</option>
            <option value="CB">Carte bancaire</option>
            <option value="PRELEVEMENT">Prélèvement</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          Nouveau paiement
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Facture</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Mode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Notes</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredPaiements.map((p) => {
                const config = modeConfig[p.mode];
                const ModeIcon = config.icon;
                return (
                  <tr key={p.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{p.reference}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-primary-600">{p.facture.numero}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.facture.client}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(p.date)}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{formatMoney(p.montant)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <ModeIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-500 max-w-[200px] truncate">
                      {p.notes || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center relative">
                        <button
                          onClick={() => setShowActions(showActions === p.id ? null : p.id)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-secondary-500" />
                        </button>
                        {showActions === p.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Eye className="w-4 h-4" /> Voir
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Edit2 className="w-4 h-4" /> Modifier
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100">
          <p className="text-sm text-secondary-500">{filteredPaiements.length} paiements</p>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm">Page 1 sur 1</span>
            <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-50" disabled>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
