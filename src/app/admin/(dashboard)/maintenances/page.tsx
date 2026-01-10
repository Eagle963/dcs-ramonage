'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Users,
  UserCheck,
  CheckCircle,
  X,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { usePageHeader } from '@/contexts/PageHeaderContext';

interface Maintenance {
  id: string;
  client: string;
  contrat: string;
  frequence: string;
  visites: {
    mois: string; // Format: "2026-01"
    status: 'effectuee' | 'planifiee' | 'non-planifiee';
    date?: string;
  }[];
}

const MOCK_MAINTENANCES: Maintenance[] = [
  {
    id: '1',
    client: 'Alexandra Laminot',
    contrat: 'Entretien chaudière',
    frequence: '1 / An',
    visites: [
      { mois: '2026-01', status: 'planifiee' },
      { mois: '2026-06', status: 'non-planifiee' },
    ],
  },
  {
    id: '2',
    client: 'Jean-Pierre Martin',
    contrat: 'Ramonage cheminée',
    frequence: '2 / An',
    visites: [
      { mois: '2025-11', status: 'effectuee', date: '2025-11-15' },
      { mois: '2026-05', status: 'non-planifiee' },
    ],
  },
  {
    id: '3',
    client: 'Sophie Bernard',
    contrat: 'Entretien poêle à granulés',
    frequence: '1 / An',
    visites: [
      { mois: '2025-12', status: 'effectuee', date: '2025-12-20' },
    ],
  },
  {
    id: '4',
    client: 'SARL Dupont & Fils',
    contrat: 'Contrat annuel multi-équipements',
    frequence: '4 / An',
    visites: [
      { mois: '2025-11', status: 'effectuee', date: '2025-11-05' },
      { mois: '2026-02', status: 'planifiee' },
      { mois: '2026-05', status: 'non-planifiee' },
      { mois: '2026-08', status: 'non-planifiee' },
    ],
  },
  {
    id: '5',
    client: 'Marie Petit',
    contrat: 'Ramonage insert',
    frequence: '1 / An',
    visites: [
      { mois: '2026-03', status: 'non-planifiee' },
    ],
  },
];

const MONTHS = [
  { key: '2025-11', label: 'Novembre', year: '2025' },
  { key: '2025-12', label: 'Décembre', year: '2025' },
  { key: '2026-01', label: 'Janvier', year: '2026' },
  { key: '2026-02', label: 'Février', year: '2026' },
  { key: '2026-03', label: 'Mars', year: '2026' },
  { key: '2026-04', label: 'Avril', year: '2026' },
  { key: '2026-05', label: 'Mai', year: '2026' },
  { key: '2026-06', label: 'Juin', year: '2026' },
  { key: '2026-07', label: 'Juillet', year: '2026' },
  { key: '2026-08', label: 'Août', year: '2026' },
  { key: '2026-09', label: 'Septembre', year: '2026' },
  { key: '2026-10', label: 'Octobre', year: '2026' },
];

export default function MaintenancesPage() {
  const { setActions, setInfoTooltip } = usePageHeader();
  const [activeTab, setActiveTab] = useState<'toutes' | 'a-planifier'>('toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(2025, 10, 1), // 1er novembre 2025
    end: new Date(2026, 9, 31),   // 31 octobre 2026
  });

  // Actions du header
  useEffect(() => {
    setActions([
      {
        label: 'Planificateur',
        icon: Calendar,
        variant: 'outline',
        onClick: () => {
          // TODO: Ouvrir le planificateur
          console.log('Planificateur');
        },
      },
      {
        label: 'Nouvelle maintenance',
        icon: Plus,
        variant: 'primary',
        onClick: () => {
          // TODO: Ouvrir le formulaire de nouvelle maintenance
          console.log('Nouvelle maintenance');
        },
      },
    ]);
    setInfoTooltip('Gérez vos contrats de maintenance');

    return () => {
      setActions([]);
      setInfoTooltip(undefined);
    };
  }, [setActions, setInfoTooltip]);

  const currentMonth = '2026-01'; // Janvier 2026
  
  const filteredMaintenances = MOCK_MAINTENANCES.filter(m => {
    const matchesSearch = m.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.contrat.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'a-planifier') {
      return matchesSearch && m.visites.some(v => v.status === 'non-planifiee');
    }
    
    return matchesSearch;
  });

  const getVisiteForMonth = (maintenance: Maintenance, monthKey: string) => {
    return maintenance.visites.find(v => v.mois === monthKey);
  };

  const getStatusColor = (status: 'effectuee' | 'planifiee' | 'non-planifiee') => {
    switch (status) {
      case 'effectuee': return 'bg-green-500';
      case 'planifiee': return 'bg-blue-500';
      case 'non-planifiee': return 'bg-red-500';
    }
  };

  const getBarStyle = (maintenance: Maintenance) => {
    const visitesMois = maintenance.visites.map(v => v.mois).sort();
    if (visitesMois.length === 0) return null;

    const startIdx = MONTHS.findIndex(m => m.key === visitesMois[0]);
    const endIdx = MONTHS.findIndex(m => m.key === visitesMois[visitesMois.length - 1]);
    
    if (startIdx === -1) return null;
    
    return {
      startCol: startIdx + 2, // +2 car la 1ère colonne est le client
      span: endIdx - startIdx + 1,
    };
  };

  return (
    <div>
      {/* Onglets */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setActiveTab('toutes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'toutes'
              ? 'bg-secondary-900 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setActiveTab('a-planifier')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'a-planifier'
              ? 'bg-secondary-900 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}
        >
          À planifier
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm w-48"
          />
        </div>

        {/* Date Range */}
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />

        {/* Clients */}
        <button className="btn-outline btn-sm">
          <Users className="w-4 h-4" />
          Clients
        </button>

        {/* Affectées à */}
        <button className="btn-outline btn-sm">
          <UserCheck className="w-4 h-4" />
          Affectées à
        </button>

        {/* Actives */}
        <button className="btn-outline btn-sm">
          <CheckCircle className="w-4 h-4" />
          Actives
        </button>

        {/* Réinitialiser */}
        <button className="flex items-center gap-1 text-sm text-secondary-500 hover:text-secondary-700">
          <X className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-secondary-600">Visite effectuée</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-secondary-600">Visite planifiée</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-secondary-600">Visite non-planifiée</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left p-4 font-medium text-secondary-700 w-64 bg-secondary-50">
                  Client
                </th>
                {MONTHS.map(month => (
                  <th 
                    key={month.key}
                    className={`text-center p-3 font-medium w-24 ${
                      month.key === currentMonth 
                        ? 'bg-primary-500 text-white' 
                        : 'text-secondary-700 bg-secondary-50'
                    }`}
                  >
                    <div className="text-sm">{month.label}</div>
                    <div className={`text-xs ${month.key === currentMonth ? 'text-primary-100' : 'text-secondary-500'}`}>
                      {month.year}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map(maintenance => (
                <tr key={maintenance.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="p-4">
                    <div className="font-medium text-secondary-900">{maintenance.client}</div>
                    <div className="text-sm text-secondary-500">
                      {maintenance.contrat} - {maintenance.frequence}
                    </div>
                  </td>
                  {MONTHS.map(month => {
                    const visite = getVisiteForMonth(maintenance, month.key);
                    return (
                      <td 
                        key={month.key} 
                        className={`p-2 relative ${month.key === currentMonth ? 'bg-primary-50' : ''}`}
                      >
                        {visite ? (
                          <div className="flex justify-center">
                            <div 
                              className={`w-full h-6 rounded ${getStatusColor(visite.status)} opacity-80 flex items-center justify-center`}
                              title={visite.date || visite.status}
                            >
                              {visite.status === 'effectuee' && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button className="w-6 h-6 rounded border-2 border-dashed border-secondary-300 flex items-center justify-center text-secondary-400 hover:border-primary-500 hover:text-primary-500">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="text-2xl font-bold text-secondary-900">{MOCK_MAINTENANCES.length}</div>
          <div className="text-sm text-secondary-500">Contrats actifs</div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {MOCK_MAINTENANCES.reduce((acc, m) => acc + m.visites.filter(v => v.status === 'effectuee').length, 0)}
          </div>
          <div className="text-sm text-secondary-500">Visites effectuées</div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {MOCK_MAINTENANCES.reduce((acc, m) => acc + m.visites.filter(v => v.status === 'planifiee').length, 0)}
          </div>
          <div className="text-sm text-secondary-500">Visites planifiées</div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {MOCK_MAINTENANCES.reduce((acc, m) => acc + m.visites.filter(v => v.status === 'non-planifiee').length, 0)}
          </div>
          <div className="text-sm text-secondary-500">À planifier</div>
        </div>
      </div>
    </div>
  );
}
