'use client';

import { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, MapPin, Phone, Mail,
  User, Building2, FileText, Calendar, Download, Upload
} from 'lucide-react';

interface Client {
  id: string;
  reference: string;
  type: 'PARTICULIER' | 'PROFESSIONNEL';
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateCreation: string;
  nbInterventions: number;
  totalFacture: number;
}

const mockClients: Client[] = [
  {
    id: '1',
    reference: 'C0001',
    type: 'PARTICULIER',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.fr',
    telephone: '06 12 34 56 78',
    adresse: '12 rue de la République',
    codePostal: '60000',
    ville: 'Beauvais',
    dateCreation: '2024-03-15',
    nbInterventions: 5,
    totalFacture: 650,
  },
  {
    id: '2',
    reference: 'C0002',
    type: 'PARTICULIER',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@email.fr',
    telephone: '06 98 76 54 32',
    adresse: '45 avenue Jean Jaurès',
    codePostal: '60100',
    ville: 'Creil',
    dateCreation: '2024-05-20',
    nbInterventions: 3,
    totalFacture: 384,
  },
  {
    id: '3',
    reference: 'C0003',
    type: 'PROFESSIONNEL',
    nom: 'HYBA (LA MAMMA)',
    email: 'contact@lamamma.fr',
    telephone: '03 44 12 34 56',
    adresse: '22 Rue des Jacobins',
    codePostal: '60000',
    ville: 'Beauvais',
    dateCreation: '2024-01-10',
    nbInterventions: 12,
    totalFacture: 2450,
  },
  {
    id: '4',
    reference: 'C0004',
    type: 'PROFESSIONNEL',
    nom: 'NUANCES DE FEU INNOVATIONS',
    email: 'navarro.david.ndf@gmail.com',
    telephone: '06 50 25 95 39',
    adresse: '15 rue du Commerce',
    codePostal: '60300',
    ville: 'Senlis',
    dateCreation: '2024-02-28',
    nbInterventions: 8,
    totalFacture: 1890,
  },
  {
    id: '5',
    reference: 'C0005',
    type: 'PARTICULIER',
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'p.bernard@email.fr',
    telephone: '07 11 22 33 44',
    adresse: '8 place Henri IV',
    codePostal: '60300',
    ville: 'Senlis',
    dateCreation: '2025-06-05',
    nbInterventions: 2,
    totalFacture: 210,
  },
  {
    id: '6',
    reference: 'C0006',
    type: 'PARTICULIER',
    nom: 'Leroy',
    prenom: 'Sophie',
    email: 'sophie.leroy@email.fr',
    telephone: '06 55 44 33 22',
    adresse: '23 rue Victor Hugo',
    codePostal: '60500',
    ville: 'Chantilly',
    dateCreation: '2025-09-12',
    nbInterventions: 1,
    totalFacture: 95,
  },
];

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const filteredClients = clients.filter(c => {
    const fullName = c.prenom ? `${c.prenom} ${c.nom}` : c.nom;
    const matchSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ville.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const stats = {
    total: clients.length,
    particuliers: clients.filter(c => c.type === 'PARTICULIER').length,
    professionnels: clients.filter(c => c.type === 'PROFESSIONNEL').length,
    totalCA: clients.reduce((acc, c) => acc + c.totalFacture, 0),
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Total clients</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Particuliers</p>
          <p className="text-2xl font-bold text-blue-600">{stats.particuliers}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">Professionnels</p>
          <p className="text-2xl font-bold text-purple-600">{stats.professionnels}</p>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-4">
          <p className="text-sm text-secondary-500">CA total</p>
          <p className="text-2xl font-bold text-green-600">{formatMoney(stats.totalCA)}</p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Filtrer par nom ou référence..."
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
            <option value="ALL">Tous les types</option>
            <option value="PARTICULIER">Particuliers</option>
            <option value="PROFESSIONNEL">Professionnels</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded"
            />
            Archivés
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
            <MapPin className="w-4 h-4" />
            Carte
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
            <Download className="w-4 h-4" />
            Importer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4" />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Adresse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Téléphone</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredClients.map((c) => {
                const fullName = c.prenom ? `${c.nom} ${c.prenom}` : c.nom;
                return (
                  <tr key={c.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-secondary-600">{c.reference}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        c.type === 'PARTICULIER' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {c.type === 'PARTICULIER' ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        {c.type === 'PARTICULIER' ? 'Particulier' : 'Professionnel'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a href="#" className="font-medium text-primary-600 hover:underline">{fullName}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-600">
                      {c.adresse}, {c.codePostal} {c.ville}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${c.email}`} className="text-sm text-secondary-600 hover:text-primary-600">{c.email}</a>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${c.telephone}`} className="text-sm text-secondary-600 hover:text-primary-600">{c.telephone}</a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center relative">
                        <button
                          onClick={() => setShowActions(showActions === c.id ? null : c.id)}
                          className="p-1 hover:bg-secondary-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-secondary-500" />
                        </button>
                        {showActions === c.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-secondary-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Eye className="w-4 h-4" /> Voir fiche
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Edit2 className="w-4 h-4" /> Modifier
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <FileText className="w-4 h-4" /> Nouveau devis
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                              <Calendar className="w-4 h-4" /> Planifier RDV
                            </button>
                            <hr className="my-1" />
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Archiver
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
          <p className="text-sm text-secondary-500">{filteredClients.length} clients</p>
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
