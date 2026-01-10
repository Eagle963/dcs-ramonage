'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, MoreHorizontal, Eye, Edit2, Trash2,
  Send, Download, CheckCircle2, Clock, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronDown, Calendar,
  FileText, RefreshCw, Settings2, RotateCcw, Users
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import FactureForm from '@/components/forms/FactureForm';
import { usePageHeader } from '@/contexts/PageHeaderContext';

interface Facture {
  id: string;
  numero: string;
  titre: string;
  client: string;
  chantier?: string;
  montantHT: number;
  montantTTC: number;
  resteAPayer: number;
  statut: 'BROUILLON' | 'FINALISEE' | 'ENVOYEE' | 'PAYEE' | 'ANNULEE';
  retardJours?: number;
  creeLe: string;
  creePar: string;
}

const mockFactures: Facture[] = [
  { id: '1', numero: 'F0347', titre: 'Facture', client: 'ATEMIA', montantHT: 70, montantTTC: 84, resteAPayer: 0, statut: 'PAYEE', creeLe: '29/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '2', numero: 'F0348', titre: 'Facture', client: 'M. Matthieu VELDEKENS', montantHT: 331.75, montantTTC: 350, resteAPayer: 0, statut: 'PAYEE', creeLe: '29/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '3', numero: 'F0346', titre: 'Facture', client: 'Mme. Isabelle Dehaynin', montantHT: 66.35, montantTTC: 70, resteAPayer: 70, statut: 'FINALISEE', retardJours: 3, creeLe: '29/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '4', numero: 'F0349', titre: 'Facture', client: 'TELYS', montantHT: 4874.76, montantTTC: 5849.71, resteAPayer: 5849.71, statut: 'BROUILLON', retardJours: 5, creeLe: '27/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '5', numero: 'F0345', titre: 'Facture', client: 'Mme. Véronique Mouteliere', montantHT: 123.22, montantTTC: 130, resteAPayer: 0, statut: 'PAYEE', creeLe: '25/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '6', numero: 'F0344', titre: 'Facture', client: 'Jean Yves Manigot', montantHT: 75.83, montantTTC: 80, resteAPayer: 0, statut: 'PAYEE', creeLe: '18/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '7', numero: 'F0337', titre: 'Facture', client: 'M. Eric Medioni', montantHT: 66.35, montantTTC: 70, resteAPayer: 0, statut: 'PAYEE', creeLe: '10/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '8', numero: 'F0335', titre: 'Facture', client: 'M. Eric Medioni', montantHT: 66.35, montantTTC: 70, resteAPayer: 0, statut: 'PAYEE', creeLe: '10/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '9', numero: 'F0343', titre: 'Facture', client: 'Ait douch', montantHT: 142.18, montantTTC: 150, resteAPayer: 0, statut: 'PAYEE', creeLe: '22/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '10', numero: 'F0342', titre: 'Facture', client: 'Mme. DEBORAH LERONDAULT', montantHT: 170.62, montantTTC: 180, resteAPayer: 0, statut: 'PAYEE', creeLe: '22/12/2025', creePar: 'DCS RAMONAGE' },
];

// Stats calculées
const statsData = {
  toutes: { count: 350, montantHT: 67225.48, montantTTC: 72446.97 },
  brouillons: { count: 2, montantHT: 4924.76, montantTTC: 5909.71 },
  finalisees: { count: 4, montantHT: 274.88, montantTTC: 290 },
  envoyee: { count: 0, montantHT: 0, montantTTC: 0 },
  payees: { count: 313, montantHT: 50508.62, montantTTC: 53816.70 },
  annulees: { count: 31, montantHT: 11517.22, montantTTC: 12430.56 },
};

export default function FacturesPage() {
  const { setActions, setInfoTooltip } = usePageHeader();
  const [factures] = useState<Facture[]>(mockFactures);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('toutes');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Actions du header
  useEffect(() => {
    setActions([
      {
        label: 'Nouvelle facture',
        icon: Plus,
        variant: 'primary',
        onClick: () => setIsModalOpen(true),
      },
    ]);
    setInfoTooltip('Gérez vos factures et suivez les paiements');

    return () => {
      setActions([]);
      setInfoTooltip(undefined);
    };
  }, [setActions, setInfoTooltip]);

  const handleCreateFacture = (data: any) => {
    console.log('Nouvelle facture:', data);
    setIsModalOpen(false);
  };

  const filteredFactures = factures.filter(f => {
    const matchSearch = f.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'toutes') return matchSearch;
    if (activeFilter === 'brouillons') return matchSearch && f.statut === 'BROUILLON';
    if (activeFilter === 'finalisees') return matchSearch && f.statut === 'FINALISEE';
    if (activeFilter === 'envoyee') return matchSearch && f.statut === 'ENVOYEE';
    if (activeFilter === 'payees') return matchSearch && f.statut === 'PAYEE';
    if (activeFilter === 'annulees') return matchSearch && f.statut === 'ANNULEE';
    return matchSearch;
  });

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const StatCard = ({ id, label, count, montantHT, montantTTC, icon, iconBg, active }: {
    id: string; label: string; count: number; montantHT: number; montantTTC: number; 
    icon: React.ReactNode; iconBg: string; active: boolean;
  }) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`flex-1 min-w-[140px] p-4 rounded-xl border text-left transition-all ${
        active ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-secondary-200 bg-white hover:border-secondary-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-bold">{count}</span>
        <span className="text-secondary-600">{label}</span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-xs text-secondary-500 space-y-0.5">
        <div>Montant HT : <span className="font-medium text-secondary-700">{formatMoney(montantHT)}</span></div>
        <div>Montant TTC : <span className="font-medium text-secondary-700">{formatMoney(montantTTC)}</span></div>
      </div>
    </button>
  );

  const getStatutBadge = (statut: string, retardJours?: number) => {
    switch (statut) {
      case 'PAYEE':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">€ Payée</span>;
      case 'BROUILLON':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
              <FileText className="w-3 h-3" /> Brouillon
            </span>
            {retardJours && <span className="text-xs text-red-500">En retard de {retardJours} j</span>}
          </div>
        );
      case 'FINALISEE':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-700">
              <CheckCircle2 className="w-3 h-3" /> Finalisée
            </span>
            {retardJours && <span className="text-xs text-red-500">En retard de {retardJours} j</span>}
          </div>
        );
      case 'ENVOYEE':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700"><Send className="w-3 h-3" /> Envoyée</span>;
      case 'ANNULEE':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Annulée</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Stats cards */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <StatCard 
          id="toutes" label="Toutes" count={statsData.toutes.count} 
          montantHT={statsData.toutes.montantHT} montantTTC={statsData.toutes.montantTTC}
          icon={<Settings2 className="w-3.5 h-3.5 text-secondary-500" />} iconBg="bg-secondary-100"
          active={activeFilter === 'toutes'}
        />
        <StatCard 
          id="brouillons" label="Brouillons" count={statsData.brouillons.count}
          montantHT={statsData.brouillons.montantHT} montantTTC={statsData.brouillons.montantTTC}
          icon={<FileText className="w-3.5 h-3.5 text-blue-500" />} iconBg="bg-blue-100"
          active={activeFilter === 'brouillons'}
        />
        <StatCard 
          id="finalisees" label="Finalisées" count={statsData.finalisees.count}
          montantHT={statsData.finalisees.montantHT} montantTTC={statsData.finalisees.montantTTC}
          icon={<Clock className="w-3.5 h-3.5 text-secondary-500" />} iconBg="bg-secondary-100"
          active={activeFilter === 'finalisees'}
        />
        <StatCard 
          id="envoyee" label="Envoyée" count={statsData.envoyee.count}
          montantHT={statsData.envoyee.montantHT} montantTTC={statsData.envoyee.montantTTC}
          icon={<Send className="w-3.5 h-3.5 text-amber-500" />} iconBg="bg-amber-100"
          active={activeFilter === 'envoyee'}
        />
        <StatCard 
          id="payees" label="Payées" count={statsData.payees.count}
          montantHT={statsData.payees.montantHT} montantTTC={statsData.payees.montantTTC}
          icon={<span className="text-xs font-bold text-green-600">€</span>} iconBg="bg-green-100"
          active={activeFilter === 'payees'}
        />
        <StatCard 
          id="annulees" label="Annulées" count={statsData.annulees.count}
          montantHT={statsData.annulees.montantHT} montantTTC={statsData.annulees.montantTTC}
          icon={<XCircle className="w-3.5 h-3.5 text-red-500" />} iconBg="bg-red-100"
          active={activeFilter === 'annulees'}
        />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par titre, numéro ou chantier"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Users className="w-4 h-4" /> Client
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Calendar className="w-4 h-4" /> Date
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <AlertTriangle className="w-4 h-4" /> En retard
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <RotateCcw className="w-4 h-4" /> Réinitialiser
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
                  <div className="flex items-center gap-1">Titre <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Chantier <ChevronDown className="w-3 h-3" /></div>
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
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Créée le <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Créée par <ChevronDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredFactures.map((f) => (
                <tr key={f.id} className="hover:bg-secondary-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-mono rounded">
                      {f.numero}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-primary-600 hover:underline text-sm font-medium">{f.titre}</a>
                  </td>
                  <td className="px-4 py-3 text-sm">{f.client}</td>
                  <td className="px-4 py-3 text-sm text-secondary-500">{f.chantier || ''}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatMoney(f.montantHT)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatMoney(f.montantTTC)}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    {f.resteAPayer > 0 ? formatMoney(f.resteAPayer) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {getStatutBadge(f.statut, f.retardJours)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-600">{f.creeLe}</td>
                  <td className="px-4 py-3 text-sm text-secondary-600">{f.creePar}</td>
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
              <span className="text-sm text-secondary-600">Page 1 sur 24</span>
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

      {/* Modal Nouvelle Facture */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle facture"
        size="xl"
      >
        <FactureForm
          onSubmit={handleCreateFacture}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
