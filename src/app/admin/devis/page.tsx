'use client';

import { useState } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, Eye, Edit2, Trash2, 
  Send, FileText, Download, Copy, CheckCircle2, Clock, XCircle,
  AlertCircle, ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';

interface Devis {
  id: string;
  numero: string;
  client: {
    nom: string;
    email: string;
    adresse: string;
  };
  date: string;
  dateValidite: string;
  montantHT: number;
  montantTTC: number;
  statut: 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'EXPIRE';
  lignes: {
    description: string;
    quantite: number;
    prixUnitaire: number;
    tva: number;
  }[];
}

const mockDevis: Devis[] = [
  {
    id: '1',
    numero: 'D-2026-001',
    client: { nom: 'Jean Dupont', email: 'jean.dupont@email.fr', adresse: '12 rue de la République, 60000 Beauvais' },
    date: '2026-01-02',
    dateValidite: '2026-02-02',
    montantHT: 150,
    montantTTC: 180,
    statut: 'ENVOYE',
    lignes: [{ description: 'Ramonage cheminée', quantite: 1, prixUnitaire: 80, tva: 10 }, { description: 'Certificat de ramonage', quantite: 1, prixUnitaire: 70, tva: 10 }]
  },
  {
    id: '2',
    numero: 'D-2026-002',
    client: { nom: 'Marie Martin', email: 'marie.martin@email.fr', adresse: '45 avenue Jean Jaurès, 60100 Creil' },
    date: '2026-01-03',
    dateValidite: '2026-02-03',
    montantHT: 320,
    montantTTC: 384,
    statut: 'ACCEPTE',
    lignes: [{ description: 'Ramonage poêle à granulés', quantite: 1, prixUnitaire: 120, tva: 10 }, { description: 'Entretien complet', quantite: 1, prixUnitaire: 200, tva: 10 }]
  },
  {
    id: '3',
    numero: 'D-2026-003',
    client: { nom: 'Pierre Bernard', email: 'p.bernard@email.fr', adresse: '8 place Henri IV, 60300 Senlis' },
    date: '2026-01-04',
    dateValidite: '2026-02-04',
    montantHT: 95,
    montantTTC: 114,
    statut: 'BROUILLON',
    lignes: [{ description: 'Ramonage insert', quantite: 1, prixUnitaire: 95, tva: 10 }]
  },
  {
    id: '4',
    numero: 'D-2026-004',
    client: { nom: 'Sophie Leroy', email: 'sophie.leroy@email.fr', adresse: '23 rue Victor Hugo, 60500 Chantilly' },
    date: '2025-11-15',
    dateValidite: '2025-12-15',
    montantHT: 450,
    montantTTC: 540,
    statut: 'EXPIRE',
    lignes: [{ description: 'Débistrage conduit', quantite: 1, prixUnitaire: 450, tva: 10 }]
  },
  {
    id: '5',
    numero: 'D-2026-005',
    client: { nom: 'Thomas Moreau', email: 't.moreau@email.fr', adresse: '5 rue des Lilas, 95000 Cergy' },
    date: '2026-01-05',
    dateValidite: '2026-02-05',
    montantHT: 180,
    montantTTC: 216,
    statut: 'REFUSE',
    lignes: [{ description: 'Diagnostic conduit', quantite: 1, prixUnitaire: 180, tva: 10 }]
  },
];

const statutConfig = {
  BROUILLON: { label: 'Brouillon', color: 'bg-secondary-100 text-secondary-700', icon: FileText },
  ENVOYE: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700', icon: Send },
  ACCEPTE: { label: 'Accepté', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  REFUSE: { label: 'Refusé', color: 'bg-red-100 text-red-700', icon: XCircle },
  EXPIRE: { label: 'Expiré', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
};

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>(mockDevis);
  const [searchQuery, setSearchQuery] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('ALL');
  const [selectedDevis, setSelectedDevis] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredDevis = devis.filter(d => {
    const matchSearch = d.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.client.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatut = statutFilter === 'ALL' || d.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const stats = {
    total: devis.length,
    brouillon: devis.filter(d => d.statut === 'BROUILLON').length,
    envoye: devis.filter(d => d.statut === 'ENVOYE').length,
    accepte: devis.filter(d => d.statut === 'ACCEPTE').length,
    refuse: devis.filter(d => d.statut === 'REFUSE').length,
    montantEnvoye: devis.filter(d => d.statut === 'ENVOYE').reduce((acc, d) => acc + d.montantTTC, 0),
    montantAccepte: devis.filter(d => d.statut === 'ACCEPTE').reduce((acc, d) => acc + d.montantTTC, 0),
  };

  const toggleSelectAll = () => {
    if (selectedDevis.length === filteredDevis.length) {
      setSelectedDevis([]);
    } else {
      setSelectedDevis(filteredDevis.map(d => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedDevis(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Total devis</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">En attente</p>
          <p className="text-2xl font-bold text-blue-600">{stats.envoye}</p>
          <p className="text-xs text-secondary-400">{formatMoney(stats.montantEnvoye)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Acceptés</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepte}</p>
          <p className="text-xs text-secondary-400">{formatMoney(stats.montantAccepte)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Brouillons</p>
          <p className="text-2xl font-bold text-secondary-600">{stats.brouillon}</p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
            />
          </div>
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="ENVOYE">Envoyé</option>
            <option value="ACCEPTE">Accepté</option>
            <option value="REFUSE">Refusé</option>
            <option value="EXPIRE">Expiré</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          Nouveau devis
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedDevis.length === filteredDevis.length && filteredDevis.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Numéro</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Validité</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Montant TTC</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredDevis.map((d) => {
                const config = statutConfig[d.statut];
                const StatusIcon = config.icon;
                return (
                  <tr key={d.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDevis.includes(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-primary-600">{d.numero}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{d.client.nom}</p>
                      <p className="text-xs text-secondary-500">{d.client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(d.date)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(d.dateValidite)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatMoney(d.montantTTC)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center relative">
                        <button
                          onClick={() => setShowActions(showActions === d.id ? null : d.id)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-secondary-500" />
                        </button>
                        {showActions === d.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Eye className="w-4 h-4" /> Voir
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Edit2 className="w-4 h-4" /> Modifier
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Copy className="w-4 h-4" /> Dupliquer
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Download className="w-4 h-4" /> Télécharger PDF
                            </button>
                            {d.statut === 'BROUILLON' && (
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                <Send className="w-4 h-4" /> Envoyer
                              </button>
                            )}
                            {d.statut === 'ACCEPTE' && (
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                                <FileText className="w-4 h-4" /> Convertir en facture
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100">
          <p className="text-sm text-secondary-500">
            {filteredDevis.length} devis
          </p>
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
