'use client';

import { useState } from 'react';
import { 
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Euro, XCircle, Settings2, RefreshCw
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  debiteurCrediteur: string;
  libelle: string;
  montant: number;
  rapprochee: boolean;
  documentAssocie?: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '02/01/2026', debiteurCrediteur: 'Google ADS7551779848', libelle: 'Google ADS7551779848 / MCC: 7311', montant: -123.90, rapprochee: false },
  { id: '2', date: '31/12/2025', debiteurCrediteur: 'AMRTOP.NET', libelle: 'AMRTOP.NET / MCC: 5085', montant: -70.08, rapprochee: false },
  { id: '3', date: '31/12/2025', debiteurCrediteur: 'SAS ATEMIA', libelle: 'DCS RAMONAGE FACTURE F0347 ATEMIA 291225', montant: 84.00, rapprochee: false },
  { id: '4', date: '30/12/2025', debiteurCrediteur: 'TOTAL', libelle: 'TOTAL / MCC: 5542', montant: -15.07, rapprochee: false },
  { id: '5', date: '30/12/2025', debiteurCrediteur: 'KARTHAGE', libelle: 'HONORAIRES KARTHAGE', montant: -210.00, rapprochee: false },
  { id: '6', date: '26/12/2025', debiteurCrediteur: 'MME MOUTELIERE VERONIQUE OU M. MOUTELIERE ALAIN', libelle: '', montant: 130.00, rapprochee: false },
  { id: '7', date: '24/12/2025', debiteurCrediteur: 'AUCHAN 0565C', libelle: 'AUCHAN 0565C / MCC: 5541', montant: -30.13, rapprochee: false },
  { id: '8', date: '22/12/2025', debiteurCrediteur: 'M STEPHANE SANDERS', libelle: 'Nettoyage vitre veranda', montant: 330.00, rapprochee: false },
  { id: '9', date: '19/12/2025', debiteurCrediteur: 'NORAUTO 219 PSC', libelle: 'NORAUTO 219 PSC / MCC: 5533', montant: -27.98, rapprochee: false },
  { id: '10', date: '19/12/2025', debiteurCrediteur: 'WESTAFLEX-BATIMENT', libelle: '500057068', montant: -312.07, rapprochee: false },
  { id: '11', date: '18/12/2025', debiteurCrediteur: 'CC GOINCOURT', libelle: 'CC GOINCOURT / MCC: 5542', montant: -70.39, rapprochee: false },
  { id: '12', date: '18/12/2025', debiteurCrediteur: 'CO DEPOT', libelle: 'BRICO DEPOT / MCC: 5231', montant: -8.90, rapprochee: false },
  { id: '13', date: '15/12/2025', debiteurCrediteur: 'M. DUPONT JEAN', libelle: 'FACTURE F0340', montant: 180.00, rapprochee: true, documentAssocie: 'F0340' },
  { id: '14', date: '14/12/2025', debiteurCrediteur: 'MME MARTIN MARIE', libelle: 'FACTURE F0339', montant: 70.00, rapprochee: true, documentAssocie: 'F0339' },
  { id: '15', date: '12/12/2025', debiteurCrediteur: 'AMAZON', libelle: 'AMAZON / MCC: 5999', montant: -45.99, rapprochee: true, documentAssocie: 'E00065' },
];

export default function BanquePage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'rapprochees' | 'a_rapprocher'>('a_rapprocher');

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.debiteurCrediteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.libelle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'rapprochees' ? t.rapprochee : !t.rapprochee;
    return matchSearch && matchTab;
  });

  const formatMoney = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return amount >= 0 ? `${formatted} €` : `-${formatted} €`;
  };

  // Calcul du solde
  const solde = transactions.reduce((acc, t) => acc + t.montant, 2500); // Solde initial fictif

  return (
    <div>
      {/* Carte compte bancaire */}
      <div className="bg-white rounded-xl border border-secondary-100 p-6 mb-6 max-w-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold text-secondary-900">
              {solde.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </p>
            <p className="text-sm text-secondary-500 mt-1 font-mono">
              FR7630833830000045099424622
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">FINOM</span>
            <button className="p-2 hover:bg-secondary-100 rounded-lg" title="Rafraîchir">
              <RefreshCw className="w-4 h-4 text-secondary-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par débiteur / créditeur ou libellé"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Calendar className="w-4 h-4" /> Date de l'opération
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Euro className="w-4 h-4" /> Montant
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <XCircle className="w-4 h-4" /> Réinitialiser
        </button>

        {/* Onglets à droite */}
        <div className="ml-auto flex">
          <button
            onClick={() => setActiveTab('rapprochees')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border transition-colors ${
              activeTab === 'rapprochees'
                ? 'bg-primary-50 border-primary-500 text-primary-700 z-10'
                : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            Rapprochées
          </button>
          <button
            onClick={() => setActiveTab('a_rapprocher')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border -ml-px transition-colors ${
              activeTab === 'a_rapprocher'
                ? 'bg-primary-50 border-primary-500 text-primary-700 z-10'
                : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            À rapprocher
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Débiteur / créditeur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Libellé</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">Montant</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-secondary-500">
                    Aucune transaction trouvée
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3 text-sm text-secondary-600">{t.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-secondary-900">{t.debiteurCrediteur}</td>
                    <td className="px-4 py-3 text-sm text-secondary-600 max-w-[300px] truncate">{t.libelle}</td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${t.montant >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatMoney(t.montant)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.rapprochee ? (
                        <span className="text-xs text-secondary-500">{t.documentAssocie}</span>
                      ) : (
                        <button className="px-3 py-1.5 text-xs font-medium text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors">
                          Rapprocher...
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100">
          <div></div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm text-secondary-600 hover:text-secondary-800">
              <Settings2 className="w-4 h-4" /> Personnaliser
            </button>
            <span className="text-secondary-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-600">Page 1 sur 1</span>
              <div className="flex items-center">
                <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30" disabled>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30" disabled>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
