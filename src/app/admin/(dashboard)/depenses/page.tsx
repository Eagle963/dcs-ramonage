'use client';

import { useState } from 'react';
import {
  Plus, Search, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Euro, Filter, Settings2, Download, RotateCcw,
  Building2, XCircle
} from 'lucide-react';

interface Depense {
  id: string;
  numero: string;
  affecteeA?: string;
  libelle: string;
  statut: 'PAYEE' | 'A_PAYER' | 'ANNULEE';
  dateFacture: string;
  dateEcheance?: string;
  montantHT: number;
  montantTTC: number;
  resteAPayer: number;
  payeeLe?: string;
  fournisseur: string;
}

const mockDepenses: Depense[] = [
  { id: '1', numero: 'E00080', libelle: 'MAXI-RET 5 LAMES-PINCE A GAUFRER DEMULTIPLIEE', statut: 'PAYEE', dateFacture: '06/01/25', montantHT: 49.31, montantTTC: 59.17, resteAPayer: 0, payeeLe: '07/01/25', fournisseur: 'PLATEFORME QUINCAILLERIE ANGLES ROI' },
  { id: '2', numero: 'E00079', libelle: 'Colle réfractaire et transport', statut: 'PAYEE', dateFacture: '07/01/25', montantHT: 7.45, montantTTC: 8.94, resteAPayer: 0, payeeLe: '07/01/25', fournisseur: 'CEDEO - DISTRIB. SANITAIRE CHAUFFAGE' },
  { id: '3', numero: 'E00078', libelle: 'Tresse ronde 8 50m', statut: 'PAYEE', dateFacture: '07/01/25', montantHT: 142.07, montantTTC: 170.48, resteAPayer: 0, payeeLe: '07/01/25', fournisseur: 'CEDEO - UNE MARQUE DE SAINT-GOBAIN' },
  { id: '4', numero: 'E00077', libelle: 'Matériaux de construction et accessoires', statut: 'PAYEE', dateFacture: '06/01/25', montantHT: 267.16, montantTTC: 320.59, resteAPayer: 0, payeeLe: '07/01/25', fournisseur: 'ALTEMA' },
  { id: '5', numero: 'E00076', libelle: 'Achat chez Mr Bricolage Allonne', statut: 'PAYEE', dateFacture: '10/01/25', montantHT: 20.75, montantTTC: 24.90, resteAPayer: 0, payeeLe: '11/01/25', fournisseur: 'MR BRICOLAGE ALLONNE' },
  { id: '6', numero: 'E00075', libelle: 'Distribution de 11 jetons', statut: 'PAYEE', dateFacture: '10/01/25', montantHT: 8.33, montantTTC: 10, resteAPayer: 0, payeeLe: '11/01/25', fournisseur: 'HYDROSTAR SUD' },
  { id: '7', numero: 'E00074', libelle: 'Bip&Go A la Carte et frais d\'activation', statut: 'PAYEE', dateFacture: '03/01/25', montantHT: 13.33, montantTTC: 16, resteAPayer: 0, payeeLe: '16/01/25', fournisseur: 'Bip&Go' },
  { id: '8', numero: 'E00073', libelle: 'Snacks et papier nettoyage', statut: 'PAYEE', dateFacture: '17/01/25', montantHT: 7.36, montantTTC: 8.60, resteAPayer: 0, payeeLe: '18/01/25', fournisseur: 'Action France SAS' },
  { id: '9', numero: 'E00072', libelle: 'Flexible gris noir anti statique et garantie livraison', statut: 'PAYEE', dateFacture: '15/01/25', montantHT: 163.20, montantTTC: 195.84, resteAPayer: 0, payeeLe: '15/01/25', fournisseur: 'FRANCE-ASPIRATION' },
  { id: '10', numero: 'E00071', libelle: 'Google Ads', statut: 'PAYEE', dateFacture: '01/01/25', montantHT: 6.88, montantTTC: 6.88, resteAPayer: 0, payeeLe: '01/01/25', fournisseur: 'Google Ireland Limited' },
  { id: '11', numero: 'E00070', libelle: 'Carburant', statut: 'PAYEE', dateFacture: '14/12/24', montantHT: 95.35, montantTTC: 114.42, resteAPayer: 0, payeeLe: '14/12/24', fournisseur: 'AUCHAN CARBURANT' },
  { id: '12', numero: 'E00069', libelle: 'Péage', statut: 'PAYEE', dateFacture: '14/12/24', montantHT: 4.25, montantTTC: 5.10, resteAPayer: 0, payeeLe: '14/12/24', fournisseur: 'SANEF CONSEIL' },
];

const statsData = {
  nonAnnulees: { count: 78, totalHT: 5502.06, totalTTC: 6340.26 },
  aPayer: { count: 0, totalHT: 0, totalTTC: 0 },
  payees: { count: 78, totalHT: 5502.06, totalTTC: 6340.26 },
  annulee: { count: 0, totalHT: 0, totalTTC: 0 },
};

export default function DepensesPage() {
  const [depenses] = useState<Depense[]>(mockDepenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('nonAnnulees');

  const filteredDepenses = depenses.filter(d =>
    d.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.fournisseur.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const StatCard = ({ id, label, count, totalHT, totalTTC, icon, iconBg, active }: {
    id: string; label: string; count: number; totalHT: number; totalTTC: number; 
    icon: React.ReactNode; iconBg: string; active: boolean;
  }) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`flex-shrink-0 min-w-[140px] p-3 rounded-xl border text-left transition-all ${
        active ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-secondary-200 bg-white hover:border-secondary-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl font-bold">{count}</span>
        <span className="text-secondary-600 text-sm">{label}</span>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-[10px] text-secondary-500 space-y-0.5">
        <div>Total HT : <span className="font-medium text-secondary-700">{formatMoney(totalHT)}</span></div>
        <div>Total TTC : <span className="font-medium text-secondary-700">{formatMoney(totalTTC)}</span></div>
      </div>
    </button>
  );

  return (
    <div>
      {/* Stats cards */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <StatCard 
          id="nonAnnulees" label="Non annulées" count={statsData.nonAnnulees.count} 
          totalHT={statsData.nonAnnulees.totalHT} totalTTC={statsData.nonAnnulees.totalTTC}
          icon={<Settings2 className="w-3 h-3 text-secondary-500" />} iconBg="bg-secondary-100"
          active={activeFilter === 'nonAnnulees'}
        />
        <StatCard 
          id="aPayer" label="À payer" count={statsData.aPayer.count}
          totalHT={statsData.aPayer.totalHT} totalTTC={statsData.aPayer.totalTTC}
          icon={<XCircle className="w-3 h-3 text-red-500" />} iconBg="bg-red-100"
          active={activeFilter === 'aPayer'}
        />
        <StatCard 
          id="payees" label="Payées" count={statsData.payees.count}
          totalHT={statsData.payees.totalHT} totalTTC={statsData.payees.totalTTC}
          icon={<span className="text-[10px] font-bold text-green-600">€</span>} iconBg="bg-green-100"
          active={activeFilter === 'payees'}
        />
        <StatCard 
          id="annulee" label="Annulée" count={statsData.annulee.count}
          totalHT={statsData.annulee.totalHT} totalTTC={statsData.annulee.totalTTC}
          icon={<XCircle className="w-3 h-3 text-red-500" />} iconBg="bg-red-100"
          active={activeFilter === 'annulee'}
        />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par libellé ou par numéro"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Building2 className="w-4 h-4" /> Fournisseur
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Calendar className="w-4 h-4" /> Date
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Euro className="w-4 h-4" /> Montant TTC
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <RotateCcw className="w-4 h-4" /> Réinitialiser
        </button>
        <div className="flex-1"></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Numéro <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Affectée à <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Libellé</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Date de la facture <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Date d'échéance <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">
                  <div className="flex items-center justify-end gap-1">Montant HT <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">
                  <div className="flex items-center justify-end gap-1">Montant TTC <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">
                  <div className="flex items-center justify-end gap-1">Reste à payer <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Payée le <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Fournisseur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredDepenses.map((d) => (
                <tr key={d.id} className="hover:bg-secondary-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-mono rounded">
                      {d.numero}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-500">{d.affecteeA || ''}</td>
                  <td className="px-4 py-3 text-sm max-w-[250px] truncate">{d.libelle}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        € Payée
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{d.dateFacture}</td>
                  <td className="px-4 py-3 text-sm text-secondary-500">{d.dateEcheance || ''}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatMoney(d.montantHT)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatMoney(d.montantTTC)}</td>
                  <td className="px-4 py-3 text-right text-sm">{d.resteAPayer > 0 ? formatMoney(d.resteAPayer) : ''}</td>
                  <td className="px-4 py-3 text-sm">{d.payeeLe || ''}</td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-primary-600 hover:underline text-sm truncate block max-w-[200px]">{d.fournisseur}</a>
                  </td>
                </tr>
              ))}
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
              <span className="text-sm text-secondary-600">Page 1 sur 6</span>
              <div className="flex items-center">
                <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-secondary-100 rounded disabled:opacity-30" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-secondary-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-secondary-100 rounded">
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
