'use client';

import { useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, CreditCard, Banknote, Building2,
  Smartphone, Settings2, Download, RotateCcw, Users, Filter
} from 'lucide-react';

interface Paiement {
  id: string;
  numero: string;
  recuLe: string;
  montant: number;
  modeIcone: 'CB' | 'ESPECES' | 'CHEQUE' | 'VIREMENT';
  factureAssociee: string;
  statutFacture: 'PAYEE' | 'PARTIEL';
  commentaire?: string;
  consignePar: string;
  consigneLe: string;
}

const mockPaiements: Paiement[] = [
  { id: '1', numero: 'P0324', recuLe: '31/12/2025', montant: 84, modeIcone: 'ESPECES', factureAssociee: 'F0347 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '01/01/2026 à 09h31' },
  { id: '2', numero: 'P0323', recuLe: '29/12/2025', montant: 350, modeIcone: 'ESPECES', factureAssociee: 'F0348 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '29/12/2025 à 19h18' },
  { id: '3', numero: 'P0322', recuLe: '26/12/2025', montant: 130, modeIcone: 'CHEQUE', factureAssociee: 'F0345 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '27/12/2025 à 11h19' },
  { id: '4', numero: 'P0318', recuLe: '22/12/2025', montant: 150, modeIcone: 'ESPECES', factureAssociee: 'F0343 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 23h22' },
  { id: '5', numero: 'P0316', recuLe: '22/12/2025', montant: 180, modeIcone: 'CB', factureAssociee: 'F0341 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 13h38' },
  { id: '6', numero: 'P0317', recuLe: '22/12/2025', montant: 180, modeIcone: 'CB', factureAssociee: 'F0342 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 13h41' },
  { id: '7', numero: 'P0321', recuLe: '18/12/2025', montant: 80, modeIcone: 'VIREMENT', factureAssociee: 'F0344 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 23h39' },
  { id: '8', numero: 'P0315', recuLe: '17/12/2025', montant: 180, modeIcone: 'CB', factureAssociee: 'F0340 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '17/12/2025 à 19h53' },
  { id: '9', numero: 'P0314', recuLe: '17/12/2025', montant: 70, modeIcone: 'CB', factureAssociee: 'F0339 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '17/12/2025 à 19h51' },
  { id: '10', numero: 'P0320', recuLe: '15/12/2025', montant: 70, modeIcone: 'ESPECES', factureAssociee: 'F0337 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 23h31' },
  { id: '11', numero: 'P0319', recuLe: '15/12/2025', montant: 70, modeIcone: 'ESPECES', factureAssociee: 'F0335 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 23h31' },
  { id: '12', numero: 'P0312', recuLe: '12/12/2025', montant: 70, modeIcone: 'ESPECES', factureAssociee: 'F0333 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '13/12/2025 à 06h12' },
  { id: '13', numero: 'P0311', recuLe: '12/12/2025', montant: 200, modeIcone: 'ESPECES', factureAssociee: 'F0331 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '13/12/2025 à 06h12' },
  { id: '14', numero: 'P0313', recuLe: '12/12/2025', montant: 70, modeIcone: 'ESPECES', factureAssociee: 'F0332 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '22/12/2025 à 06h13' },
  { id: '15', numero: 'P0310', recuLe: '11/12/2025', montant: 80, modeIcone: 'ESPECES', factureAssociee: 'F0334 Facture', statutFacture: 'PAYEE', consignePar: 'DCS RAMONAGE', consigneLe: '11/12/2025 à 10h55' },
];

const modeIcons = {
  CB: CreditCard,
  ESPECES: Banknote,
  CHEQUE: CreditCard,
  VIREMENT: Building2,
};

export default function PaiementsPage() {
  const [paiements] = useState<Paiement[]>(mockPaiements);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'consignes' | 'primes'>('consignes');

  const filteredPaiements = paiements.filter(p =>
    p.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.factureAssociee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('consignes')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'consignes' 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Consignés
        </button>
        <button
          onClick={() => setActiveTab('primes')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'primes' 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Primes
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par titre ou numéro de facture"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Users className="w-4 h-4" /> Client
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <CreditCard className="w-4 h-4" /> Type
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Calendar className="w-4 h-4" /> Date
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <RotateCcw className="w-4 h-4" /> Réinitialiser
        </button>
        <div className="flex-1"></div>
        <button className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-sm bg-white">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Numéro</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Reçu le</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Montant reçu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Facture associée</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500">Statut de la facture</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Commentaire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Consigné par</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Consigné le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredPaiements.map((p) => {
                const ModeIcon = modeIcons[p.modeIcone];
                return (
                  <tr key={p.id} className="hover:bg-secondary-50 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-mono rounded">
                        {p.numero}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{p.recuLe}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ModeIcon className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm font-medium">{formatMoney(p.montant)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-primary-600 hover:underline text-sm">{p.factureAssociee}</a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          € Payée
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-500">{p.commentaire || ''}</td>
                    <td className="px-4 py-3 text-sm">{p.consignePar}</td>
                    <td className="px-4 py-3 text-sm text-secondary-600">{p.consigneLe}</td>
                  </tr>
                );
              })}
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
              <span className="text-sm text-secondary-600">Page 1 sur 2</span>
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
