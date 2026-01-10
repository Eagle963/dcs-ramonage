'use client';

import { useState, useEffect } from 'react';
import {
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Clock, XCircle, FileText, Send, Settings2, RotateCcw, Users, Plus
} from 'lucide-react';
import { usePageHeader } from '@/contexts/PageHeaderContext';

interface Avoir {
  id: string;
  numero: string;
  titre: string;
  client: string;
  chantier?: string;
  montantHT: number;
  montantTTC: number;
  statut: 'BROUILLON' | 'FINALISE' | 'ENVOYE' | 'ANNULE';
  creeLe: string;
  creePar: string;
}

const mockAvoirs: Avoir[] = [];

const statsData = {
  tous: { count: 0, montantHT: 0, montantTTC: 0 },
  brouillon: { count: 0, montantHT: 0, montantTTC: 0 },
  finalise: { count: 0, montantHT: 0, montantTTC: 0 },
  envoye: { count: 0, montantHT: 0, montantTTC: 0 },
  annule: { count: 0, montantHT: 0, montantTTC: 0 },
};

export default function AvoirsPage() {
  const { setActions, setInfoTooltip } = usePageHeader();
  const [avoirs] = useState<Avoir[]>(mockAvoirs);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('tous');

  // Actions du header
  useEffect(() => {
    setActions([
      {
        label: 'Nouvel avoir',
        icon: Plus,
        variant: 'primary',
        onClick: () => {
          // TODO: Ouvrir le formulaire de nouvel avoir
          console.log('Nouvel avoir');
        },
      },
    ]);
    setInfoTooltip('Gérez vos avoirs');

    return () => {
      setActions([]);
      setInfoTooltip(undefined);
    };
  }, [setActions, setInfoTooltip]);

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const StatCard = ({ id, label, count, montantHT, montantTTC, icon, iconBg, active }: {
    id: string; label: string; count: number; montantHT: number; montantTTC: number; 
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
        <div>Montant HT : <span className="font-medium text-secondary-700">{formatMoney(montantHT)}</span></div>
        <div>Montant TTC : <span className="font-medium text-secondary-700">{formatMoney(montantTTC)}</span></div>
      </div>
    </button>
  );

  return (
    <div>
      {/* Stats cards */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <StatCard 
          id="tous" label="Tous" count={statsData.tous.count} 
          montantHT={statsData.tous.montantHT} montantTTC={statsData.tous.montantTTC}
          icon={<Settings2 className="w-3 h-3 text-secondary-500" />} iconBg="bg-secondary-100"
          active={activeFilter === 'tous'}
        />
        <StatCard 
          id="brouillon" label="Brouillon" count={statsData.brouillon.count}
          montantHT={statsData.brouillon.montantHT} montantTTC={statsData.brouillon.montantTTC}
          icon={<FileText className="w-3 h-3 text-blue-500" />} iconBg="bg-blue-100"
          active={activeFilter === 'brouillon'}
        />
        <StatCard 
          id="finalise" label="Finalisé" count={statsData.finalise.count}
          montantHT={statsData.finalise.montantHT} montantTTC={statsData.finalise.montantTTC}
          icon={<Clock className="w-3 h-3 text-secondary-500" />} iconBg="bg-secondary-100"
          active={activeFilter === 'finalise'}
        />
        <StatCard 
          id="envoye" label="Envoyé" count={statsData.envoye.count}
          montantHT={statsData.envoye.montantHT} montantTTC={statsData.envoye.montantTTC}
          icon={<Send className="w-3 h-3 text-amber-500" />} iconBg="bg-amber-100"
          active={activeFilter === 'envoye'}
        />
        <StatCard 
          id="annule" label="Annulé" count={statsData.annule.count}
          montantHT={statsData.annule.montantHT} montantTTC={statsData.annule.montantTTC}
          icon={<XCircle className="w-3 h-3 text-red-500" />} iconBg="bg-red-100"
          active={activeFilter === 'annule'}
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
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Créé le <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">
                  <div className="flex items-center gap-1">Créé par <ChevronDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {avoirs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-secondary-500">
                    Aucun avoir trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
