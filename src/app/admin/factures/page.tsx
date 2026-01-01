'use client';

import { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, Eye, Edit2, Trash2, 
  Send, Download, CheckCircle2, Clock, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, Euro, CreditCard, FileText
} from 'lucide-react';

interface Facture {
  id: string;
  numero: string;
  devisNumero?: string;
  client: {
    nom: string;
    email: string;
    adresse: string;
  };
  dateEmission: string;
  dateEcheance: string;
  montantHT: number;
  montantTTC: number;
  montantPaye: number;
  statut: 'BROUILLON' | 'ENVOYEE' | 'PAYEE' | 'PARTIELLEMENT_PAYEE' | 'EN_RETARD' | 'ANNULEE';
}

const mockFactures: Facture[] = [
  {
    id: '1',
    numero: 'F-2026-001',
    devisNumero: 'D-2026-002',
    client: { nom: 'Marie Martin', email: 'marie.martin@email.fr', adresse: '45 avenue Jean Jaurès, 60100 Creil' },
    dateEmission: '2026-01-05',
    dateEcheance: '2026-02-05',
    montantHT: 320,
    montantTTC: 384,
    montantPaye: 384,
    statut: 'PAYEE',
  },
  {
    id: '2',
    numero: 'F-2026-002',
    client: { nom: 'Jean Dupont', email: 'jean.dupont@email.fr', adresse: '12 rue de la République, 60000 Beauvais' },
    dateEmission: '2026-01-06',
    dateEcheance: '2026-02-06',
    montantHT: 150,
    montantTTC: 180,
    montantPaye: 0,
    statut: 'ENVOYEE',
  },
  {
    id: '3',
    numero: 'F-2026-003',
    client: { nom: 'Pierre Bernard', email: 'p.bernard@email.fr', adresse: '8 place Henri IV, 60300 Senlis' },
    dateEmission: '2025-12-01',
    dateEcheance: '2025-12-31',
    montantHT: 250,
    montantTTC: 300,
    montantPaye: 0,
    statut: 'EN_RETARD',
  },
  {
    id: '4',
    numero: 'F-2026-004',
    client: { nom: 'Sophie Leroy', email: 'sophie.leroy@email.fr', adresse: '23 rue Victor Hugo, 60500 Chantilly' },
    dateEmission: '2026-01-07',
    dateEcheance: '2026-02-07',
    montantHT: 500,
    montantTTC: 600,
    montantPaye: 300,
    statut: 'PARTIELLEMENT_PAYEE',
  },
  {
    id: '5',
    numero: 'F-2026-005',
    client: { nom: 'Thomas Moreau', email: 't.moreau@email.fr', adresse: '5 rue des Lilas, 95000 Cergy' },
    dateEmission: '2026-01-08',
    dateEcheance: '2026-02-08',
    montantHT: 95,
    montantTTC: 114,
    montantPaye: 0,
    statut: 'BROUILLON',
  },
];

const statutConfig = {
  BROUILLON: { label: 'Brouillon', color: 'bg-secondary-100 text-secondary-700', icon: FileText },
  ENVOYEE: { label: 'Envoyée', color: 'bg-blue-100 text-blue-700', icon: Send },
  PAYEE: { label: 'Payée', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PARTIELLEMENT_PAYEE: { label: 'Partiel', color: 'bg-amber-100 text-amber-700', icon: Clock },
  EN_RETARD: { label: 'En retard', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  ANNULEE: { label: 'Annulée', color: 'bg-secondary-100 text-secondary-500', icon: XCircle },
};

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>(mockFactures);
  const [searchQuery, setSearchQuery] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('ALL');
  const [selectedFactures, setSelectedFactures] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredFactures = factures.filter(f => {
    const matchSearch = f.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.client.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatut = statutFilter === 'ALL' || f.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  const stats = {
    total: factures.reduce((acc, f) => acc + f.montantTTC, 0),
    paye: factures.reduce((acc, f) => acc + f.montantPaye, 0),
    enAttente: factures.filter(f => f.statut === 'ENVOYEE').reduce((acc, f) => acc + f.montantTTC, 0),
    enRetard: factures.filter(f => f.statut === 'EN_RETARD').reduce((acc, f) => acc + (f.montantTTC - f.montantPaye), 0),
  };

  const toggleSelectAll = () => {
    if (selectedFactures.length === filteredFactures.length) {
      setSelectedFactures([]);
    } else {
      setSelectedFactures(filteredFactures.map(f => f.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedFactures(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Total facturé</p>
          <p className="text-2xl font-bold">{formatMoney(stats.total)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Encaissé</p>
          <p className="text-2xl font-bold text-green-600">{formatMoney(stats.paye)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">En attente</p>
          <p className="text-2xl font-bold text-blue-600">{formatMoney(stats.enAttente)}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">En retard</p>
          <p className="text-2xl font-bold text-red-600">{formatMoney(stats.enRetard)}</p>
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
            <option value="ENVOYEE">Envoyée</option>
            <option value="PAYEE">Payée</option>
            <option value="PARTIELLEMENT_PAYEE">Partiellement payée</option>
            <option value="EN_RETARD">En retard</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          Nouvelle facture
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
                    checked={selectedFactures.length === filteredFactures.length && filteredFactures.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Numéro</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Émission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Échéance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Payé</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredFactures.map((f) => {
                const config = statutConfig[f.statut];
                const StatusIcon = config.icon;
                const resteAPayer = f.montantTTC - f.montantPaye;
                return (
                  <tr key={f.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedFactures.includes(f.id)}
                        onChange={() => toggleSelect(f.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-primary-600">{f.numero}</span>
                      {f.devisNumero && (
                        <p className="text-xs text-secondary-400">Devis: {f.devisNumero}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{f.client.nom}</p>
                      <p className="text-xs text-secondary-500">{f.client.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(f.dateEmission)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(f.dateEcheance)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatMoney(f.montantTTC)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={f.montantPaye > 0 ? 'text-green-600 font-medium' : 'text-secondary-400'}>
                        {formatMoney(f.montantPaye)}
                      </span>
                      {resteAPayer > 0 && f.montantPaye > 0 && (
                        <p className="text-xs text-secondary-400">Reste: {formatMoney(resteAPayer)}</p>
                      )}
                    </td>
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
                          onClick={() => setShowActions(showActions === f.id ? null : f.id)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-secondary-500" />
                        </button>
                        {showActions === f.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[180px]">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Eye className="w-4 h-4" /> Voir
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Edit2 className="w-4 h-4" /> Modifier
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Download className="w-4 h-4" /> Télécharger PDF
                            </button>
                            {f.statut === 'BROUILLON' && (
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                <Send className="w-4 h-4" /> Envoyer
                              </button>
                            )}
                            {(f.statut === 'ENVOYEE' || f.statut === 'EN_RETARD' || f.statut === 'PARTIELLEMENT_PAYEE') && (
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                                <CreditCard className="w-4 h-4" /> Enregistrer paiement
                              </button>
                            )}
                            {(f.statut === 'ENVOYEE' || f.statut === 'EN_RETARD') && (
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">
                                <Send className="w-4 h-4" /> Relancer
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
            {filteredFactures.length} factures
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
