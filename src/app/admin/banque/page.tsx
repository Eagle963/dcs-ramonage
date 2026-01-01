'use client';

import { useState } from 'react';
import { 
  Plus, Search, ArrowUpRight, ArrowDownLeft, Link2, 
  ChevronLeft, ChevronRight, Building2, RefreshCw,
  CheckCircle2, AlertCircle, HelpCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  libelle: string;
  montant: number;
  type: 'CREDIT' | 'DEBIT';
  rapprochement: 'RAPPROCHE' | 'EN_ATTENTE' | 'IGNORE';
  documentLie?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2026-01-10',
    libelle: 'VIR MARIE MARTIN',
    montant: 384,
    type: 'CREDIT',
    rapprochement: 'RAPPROCHE',
    documentLie: 'F-2026-001',
  },
  {
    id: '2',
    date: '2026-01-12',
    libelle: 'CB SOPHIE LEROY',
    montant: 300,
    type: 'CREDIT',
    rapprochement: 'RAPPROCHE',
    documentLie: 'F-2026-004',
  },
  {
    id: '3',
    date: '2026-01-05',
    libelle: 'PRLV TOTALENERGIES',
    montant: 100,
    type: 'DEBIT',
    rapprochement: 'RAPPROCHE',
    documentLie: 'DEP-2026-001',
  },
  {
    id: '4',
    date: '2026-01-08',
    libelle: 'CB BRICO DEPOT',
    montant: 55,
    type: 'DEBIT',
    rapprochement: 'RAPPROCHE',
    documentLie: 'DEP-2026-002',
  },
  {
    id: '5',
    date: '2026-01-15',
    libelle: 'VIR CLIENT INCONNU',
    montant: 150,
    type: 'CREDIT',
    rapprochement: 'EN_ATTENTE',
  },
  {
    id: '6',
    date: '2026-01-14',
    libelle: 'FRAIS BANCAIRES',
    montant: 12.50,
    type: 'DEBIT',
    rapprochement: 'IGNORE',
  },
];

export default function BanquePage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.libelle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const solde = transactions.reduce((acc, t) => t.type === 'CREDIT' ? acc + t.montant : acc - t.montant, 0);
  const entrees = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.montant, 0);
  const sorties = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + t.montant, 0);
  const nonRapproche = transactions.filter(t => t.rapprochement === 'EN_ATTENTE').length;

  const rapprochementConfig = {
    RAPPROCHE: { icon: CheckCircle2, color: 'text-green-500', label: 'Rapproché' },
    EN_ATTENTE: { icon: AlertCircle, color: 'text-amber-500', label: 'En attente' },
    IGNORE: { icon: HelpCircle, color: 'text-secondary-400', label: 'Ignoré' },
  };

  return (
    <div>
      {/* Compte bancaire */}
      <div className="bg-white rounded-xl border border-secondary-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold">Compte principal</h2>
              <p className="text-sm text-secondary-500">FR76 1234 5678 9012 3456 7890 123</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
            <RefreshCw className="w-4 h-4" />
            Synchroniser
          </button>
        </div>
        <p className="text-sm text-secondary-500 mb-1">Solde actuel</p>
        <p className="text-3xl font-bold text-secondary-900">{formatMoney(solde + 10000)}</p>
        <p className="text-xs text-secondary-400 mt-1">Dernière sync: il y a 2 heures</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Entrées</p>
          <p className="text-xl font-bold text-green-600">+{formatMoney(entrees)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Sorties</p>
          <p className="text-xl font-bold text-red-600">-{formatMoney(sorties)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Balance</p>
          <p className={`text-xl font-bold ${solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatMoney(solde)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">À rapprocher</p>
          <p className="text-xl font-bold text-amber-600">{nonRapproche}</p>
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
          >
            <option value="ALL">Tous</option>
            <option value="CREDIT">Entrées</option>
            <option value="DEBIT">Sorties</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          Ajouter manuellement
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Libellé</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Rapprochement</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredTransactions.map((t) => {
                const config = rapprochementConfig[t.rapprochement];
                const StatusIcon = config.icon;
                return (
                  <tr key={t.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3 text-sm">{formatDate(t.date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.type === 'CREDIT' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium">{t.libelle}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}{formatMoney(t.montant)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center items-center gap-1">
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                        <span className="text-sm text-secondary-500">{config.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.documentLie ? (
                        <span className="text-primary-600 text-sm flex items-center justify-center gap-1">
                          <Link2 className="w-3 h-3" />
                          {t.documentLie}
                        </span>
                      ) : t.rapprochement === 'EN_ATTENTE' ? (
                        <button className="text-xs text-primary-600 hover:underline">Associer</button>
                      ) : (
                        <span className="text-secondary-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100">
          <p className="text-sm text-secondary-500">{filteredTransactions.length} transactions</p>
        </div>
      </div>
    </div>
  );
}
