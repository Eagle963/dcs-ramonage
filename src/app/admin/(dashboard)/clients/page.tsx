'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Search, ChevronDown, ChevronLeft, ChevronRight,
  User, Building2, Filter, Settings2, Download, XCircle,
  MapPin, Phone, Mail, MoreVertical, Eye, Edit, Calendar,
  Archive, Map, List
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ClientForm from '@/components/forms/ClientForm';
import { usePageHeader } from '@/contexts/PageHeaderContext';

// Import dynamique pour éviter les erreurs SSR
const ClientsMap = dynamic(() => import('@/components/map/ClientsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-280px)] bg-secondary-100 flex items-center justify-center rounded-xl">
      <p className="text-secondary-500">Chargement de la carte...</p>
    </div>
  ),
});

interface Client {
  id: string;
  reference: string;
  nom: string;
  prenom?: string;
  type: 'PARTICULIER' | 'PROFESSIONNEL';
  email?: string;
  telephone?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  lat: number;
  lng: number;
  nbInterventions: number;
  totalFacture: number;
  archive: boolean;
}

const mockClients: Client[] = [
  { id: '1', reference: 'C0001', nom: 'Dupont', prenom: 'Jean', type: 'PARTICULIER', email: 'jean.dupont@email.com', telephone: '06 12 34 56 78', adresse: '12 rue de la République', codePostal: '60000', ville: 'Beauvais', lat: 49.4320, lng: 2.0850, nbInterventions: 3, totalFacture: 420, archive: false },
  { id: '2', reference: 'C0002', nom: 'Martin', prenom: 'Marie', type: 'PARTICULIER', email: 'marie.martin@email.com', telephone: '06 98 76 54 32', adresse: '45 avenue Jean Jaurès', codePostal: '60100', ville: 'Creil', lat: 49.2600, lng: 2.4900, nbInterventions: 2, totalFacture: 280, archive: false },
  { id: '3', reference: 'C0003', nom: 'HYBA LA MAMMA', type: 'PROFESSIONNEL', email: 'contact@hybamamma.fr', telephone: '03 44 12 34 56', adresse: '8 place du Marché', codePostal: '60300', ville: 'Senlis', lat: 49.2069, lng: 2.5856, nbInterventions: 5, totalFacture: 1250, archive: false },
  { id: '4', reference: 'C0004', nom: 'NUANCES DE FEU INNOVATIONS', type: 'PROFESSIONNEL', email: 'info@nuancesdefeu.fr', telephone: '03 44 98 76 54', adresse: '15 rue de l\'Industrie', codePostal: '60500', ville: 'Chantilly', lat: 49.1947, lng: 2.4714, nbInterventions: 8, totalFacture: 3200, archive: false },
  { id: '5', reference: 'C0005', nom: 'Bernard', prenom: 'Pierre', type: 'PARTICULIER', telephone: '07 11 22 33 44', adresse: '23 rue Victor Hugo', codePostal: '60270', ville: 'Gouvieux', lat: 49.1872, lng: 2.4167, nbInterventions: 1, totalFacture: 140, archive: false },
  { id: '6', reference: 'C0006', nom: 'Leroy', prenom: 'Sophie', type: 'PARTICULIER', email: 'sophie.leroy@email.com', telephone: '06 55 44 33 22', adresse: '7 allée des Roses', codePostal: '60110', ville: 'Méru', lat: 49.2364, lng: 2.1339, nbInterventions: 4, totalFacture: 560, archive: false },
  { id: '7', reference: 'C0007', nom: 'SAS ATEMIA', type: 'PROFESSIONNEL', email: 'compta@atemia.fr', telephone: '03 44 55 66 77', adresse: '25 zone industrielle', codePostal: '60230', ville: 'Chambly', lat: 49.1656, lng: 2.2478, nbInterventions: 12, totalFacture: 4800, archive: false },
  { id: '8', reference: 'C0008', nom: 'Moreau', prenom: 'Alain', type: 'PARTICULIER', telephone: '06 77 88 99 00', adresse: '3 impasse du Château', codePostal: '95290', ville: "L'Isle-Adam", lat: 49.1081, lng: 2.2283, nbInterventions: 2, totalFacture: 280, archive: false },
];

const statsData = {
  total: mockClients.length,
  particuliers: mockClients.filter(c => c.type === 'PARTICULIER').length,
  professionnels: mockClients.filter(c => c.type === 'PROFESSIONNEL').length,
  caTotal: mockClients.reduce((acc, c) => acc + c.totalFacture, 0),
};

type ViewType = 'list' | 'map';

export default function ClientsPage() {
  const { setActions, setInfoTooltip } = usePageHeader();
  const [clients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Actions du header
  useEffect(() => {
    setActions([
      {
        label: 'Importer',
        icon: Download,
        variant: 'outline',
        onClick: () => {
          // TODO: Ouvrir le modal d'importation
          console.log('Importer des clients');
        },
      },
      {
        label: 'Ajouter un client',
        icon: Plus,
        variant: 'primary',
        onClick: () => setIsModalOpen(true),
      },
    ]);
    setInfoTooltip('Gérez votre base de clients');

    return () => {
      setActions([]);
      setInfoTooltip(undefined);
    };
  }, [setActions, setInfoTooltip]);

  const handleCreateClient = (data: any) => {
    console.log('Nouveau client:', data);
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ville.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'particuliers') return matchSearch && c.type === 'PARTICULIER';
    if (activeFilter === 'professionnels') return matchSearch && c.type === 'PROFESSIONNEL';
    return matchSearch;
  });

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const StatCard = ({ id, label, value, icon, iconBg, active, suffix }: {
    id: string; label: string; value: number | string; 
    icon: React.ReactNode; iconBg: string; active: boolean; suffix?: string;
  }) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`flex-shrink-0 min-w-[120px] p-3 rounded-xl border text-left transition-all ${
        active ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-secondary-200 bg-white hover:border-secondary-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{value}{suffix}</p>
      <p className="text-xs text-secondary-500">{label}</p>
    </button>
  );

  return (
    <div>
      {/* Stats cards */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <StatCard 
          id="all" label="Total clients" value={statsData.total}
          icon={<User className="w-4 h-4 text-secondary-600" />} iconBg="bg-secondary-100"
          active={activeFilter === 'all'}
        />
        <StatCard 
          id="particuliers" label="Particuliers" value={statsData.particuliers}
          icon={<User className="w-4 h-4 text-blue-600" />} iconBg="bg-blue-100"
          active={activeFilter === 'particuliers'}
        />
        <StatCard 
          id="professionnels" label="Professionnels" value={statsData.professionnels}
          icon={<Building2 className="w-4 h-4 text-purple-600" />} iconBg="bg-purple-100"
          active={activeFilter === 'professionnels'}
        />
        <StatCard 
          id="ca" label="CA total" value={formatMoney(statsData.caTotal)}
          icon={<span className="text-sm font-bold text-green-600">€</span>} iconBg="bg-green-100"
          active={false}
        />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence ou ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Type
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Archive className="w-4 h-4" /> Archivés
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <XCircle className="w-4 h-4" /> Réinitialiser
        </button>
        {/* Toggle Vue */}
        <div className="flex-1"></div>
        <div className="flex border border-secondary-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewType('list')}
            className={`flex items-center gap-1 px-3 py-2 text-sm ${
              viewType === 'list' ? 'bg-primary-50 text-primary-700' : 'bg-white text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewType('map')}
            className={`flex items-center gap-1 px-3 py-2 text-sm border-l border-secondary-200 ${
              viewType === 'map' ? 'bg-primary-50 text-primary-700' : 'bg-white text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vue Liste */}
      {viewType === 'list' && (
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500">Adresse</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">Interventions</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500">Total facturé</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-mono rounded">
                        {client.reference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {client.type === 'PARTICULIER' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          <User className="w-3 h-3" /> Particulier
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          <Building2 className="w-3 h-3" /> Professionnel
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-secondary-900">
                        {client.type === 'PARTICULIER' 
                          ? `${client.prenom || ''} ${client.nom}`.trim()
                          : client.nom
                        }
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {client.email && (
                          <div className="flex items-center gap-1 text-secondary-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{client.email}</span>
                          </div>
                        )}
                        {client.telephone && (
                          <div className="flex items-center gap-1 text-secondary-600">
                            <Phone className="w-3 h-3" />
                            <span>{client.telephone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-1 text-sm text-secondary-600">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {client.adresse}, {client.codePostal} {client.ville}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{client.nbInterventions}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">{formatMoney(client.totalFacture)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 hover:bg-secondary-100 rounded" title="Voir">
                          <Eye className="w-4 h-4 text-secondary-500" />
                        </button>
                        <button className="p-1.5 hover:bg-secondary-100 rounded" title="Modifier">
                          <Edit className="w-4 h-4 text-secondary-500" />
                        </button>
                        <button className="p-1.5 hover:bg-secondary-100 rounded" title="Plus">
                          <MoreVertical className="w-4 h-4 text-secondary-500" />
                        </button>
                      </div>
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
      )}

      {/* Vue Carte */}
      {viewType === 'map' && (
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Liste des clients à gauche */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <div className="p-3 border-b border-secondary-100">
              <span className="text-sm font-medium">{filteredClients.length} clients</span>
            </div>
            <div className="divide-y divide-secondary-100 max-h-[calc(100vh-350px)] overflow-y-auto">
              {filteredClients.map((client) => (
                <div 
                  key={client.id} 
                  className={`p-3 hover:bg-secondary-50 cursor-pointer transition-colors ${
                    selectedClient?.id === client.id ? 'bg-primary-50 border-l-2 border-primary-500' : ''
                  }`}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      client.type === 'PARTICULIER' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {client.type === 'PARTICULIER' 
                        ? <User className="w-4 h-4 text-blue-600" />
                        : <Building2 className="w-4 h-4 text-purple-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-secondary-900 truncate">
                        {client.type === 'PARTICULIER' 
                          ? `${client.prenom || ''} ${client.nom}`.trim()
                          : client.nom
                        }
                      </p>
                      <p className="text-xs text-secondary-500 truncate">
                        {client.codePostal} {client.ville}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-secondary-400">{client.nbInterventions} interv.</span>
                        <span className="text-xs font-medium text-secondary-700">{formatMoney(client.totalFacture)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte à droite */}
          <div className="lg:col-span-8">
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
              <ClientsMap 
                clients={filteredClients}
                selectedClientId={selectedClient?.id}
                onClientClick={(client) => setSelectedClient(client)}
              />
            </div>
            
            {/* Légende */}
            <div className="mt-2 flex items-center gap-4 text-xs text-secondary-500">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👤</div>
                <span>Particulier</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-white">🏢</div>
                <span>Professionnel</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[8px] text-white">●</div>
                <span>Sélectionné</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau Client */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau client"
        size="lg"
      >
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
