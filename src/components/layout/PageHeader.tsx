'use client';

import { ReactNode } from 'react';
import {
  Search, Filter, RotateCcw, Plus, ChevronDown,
  Users, User, CheckCircle2, FileText, Euro, Calendar
} from 'lucide-react';

export interface FilterButton {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

interface PageHeaderProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterButtons?: FilterButton[];
  showAllFilters?: boolean;
  onResetFilters?: () => void;
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  children?: ReactNode;
}

// Boutons de filtre prédéfinis pour réutilisation
export const COMMON_FILTERS = {
  client: { id: 'client', label: 'Client', icon: <Users className="w-4 h-4" /> },
  intervenant: { id: 'intervenant', label: 'Intervenant', icon: <User className="w-4 h-4" /> },
  statut: { id: 'statut', label: 'Statut', icon: <CheckCircle2 className="w-4 h-4" /> },
  prevoirDevis: { id: 'prevoir-devis', label: 'Prévoir un devis', icon: <FileText className="w-4 h-4" /> },
  aFacturer: { id: 'a-facturer', label: 'À facturer', icon: <Euro className="w-4 h-4" /> },
  date: { id: 'date', label: 'Date', icon: <Calendar className="w-4 h-4" /> },
};

export default function PageHeader({
  searchPlaceholder = 'Filtrer par titre ou numéro',
  searchValue = '',
  onSearchChange,
  filterButtons = [],
  showAllFilters = true,
  onResetFilters,
  primaryAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Recherche */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
        />
      </div>

      {/* Boutons de filtre */}
      {filterButtons.map((filter) => (
        <button
          key={filter.id}
          onClick={filter.onClick}
          className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50"
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}

      {/* Tous les filtres */}
      {showAllFilters && (
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white hover:bg-secondary-50">
          <Filter className="w-4 h-4" />
          Tous les filtres
        </button>
      )}

      {/* Réinitialiser */}
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      )}

      {/* Contenu personnalisé */}
      {children}

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Action principale */}
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium"
        >
          {primaryAction.icon || <Plus className="w-4 h-4" />}
          {primaryAction.label}
        </button>
      )}
    </div>
  );
}
