'use client';

import { useState } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  User, Calendar, Clock, CheckCircle2, XCircle, FileText,
  Send, Settings2, AlertTriangle, CalendarClock
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import DevisForm from '@/components/forms/DevisForm';

interface Devis {
  id: string;
  numero?: string;
  titre: string;
  client: string;
  chantier?: string;
  montantHT: number;
  montantTTC: number;
  resteAFacturer?: number;
  statut: 'BROUILLON' | 'FINALISE' | 'ENVOYE' | 'ACCEPTE' | 'FACTURE' | 'REFUSE' | 'ANNULE';
  expireDans?: number;
  enRetard?: number;
  creeLe: string;
  creePar: string;
}

const mockDevis: Devis[] = [
  { id: '1', titre: 'Devis', client: 'M. Aymeric Beaugrand', montantHT: 1803.25, montantTTC: 2163.90, statut: 'BROUILLON', expireDans: 2, creeLe: '03/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '2', titre: 'Devis', client: 'Client', montantHT: 1280.90, montantTTC: 1351.35, statut: 'BROUILLON', enRetard: 27, creeLe: '05/11/2025', creePar: 'DCS RAMONAGE' },
  { id: '3', numero: 'D0010', titre: 'Devis', client: 'Aly Sow', montantHT: 550, montantTTC: 605, statut: 'ANNULE', creeLe: '15/01/2025', creePar: 'DCS RAMONAGE' },
  { id: '4', titre: 'Devis', client: 'plarue', montantHT: 1310.56, montantTTC: 1382.64, statut: 'BROUILLON', expireDans: 2, creeLe: '03/12/2025', creePar: 'DCS RAMONAGE' },
  { id: '5', titre: 'Devis', client: 'Mr', montantHT: 787.51, montantTTC: 830.82, statut: 'BROUILLON', enRetard: 7, creeLe: '25/11/2025', creePar: 'DCS RAMONAGE' },
  { id: '6', numero: 'D0018', titre: 'Devis', client: 'Mme. Marie-Laure Brucculeri', montantHT: 1622.97, montantTTC: 1712.23, statut: 'FACTURE', creeLe: '21/07/2025', creePar: 'DCS RAMONAGE' },
  { id: '7', titre: 'Devis', client: 'M. Stéphane Sanders', montantHT: 300, montantTTC: 330, statut: 'BROUILLON', enRetard: 7, creeLe: '25/11/2025', creePar: 'DCS RAMONAGE' },
  { id: '8', numero: 'D0017', titre: 'Devis', client: 'Probcr Tertiaire', chantier: 'Installation Poêle a granulés', montantHT: 1005.25, montantTTC: 1206.30, statut: 'FACTURE', creeLe: '27/10/2025', creePar: 'DCS RAMONAGE' },
  { id: '9', titre: 'Devis', client: 'M. Aymeric Beaugrand', montantHT: 772.42, montantTTC: 926.90, statut: 'BROUILLON', enRetard: 29, creeLe: '03/11/2025', creePar: 'DCS RAMONAGE' },
  { id: '10', titre: 'Devis', client: 'Jc rep garage', montantHT: 300, montantTTC: 330, statut: 'BROUILLON', enRetard: 52, creeLe: '10/10/2025', creePar: 'DCS RAMONAGE' },
];

const statsData = {
  tous: { count: 38, montantHT: 60121.93, montantTTC: 66564.93 },
  brouillons: { count: 19, montantHT: 27324.68, montantTTC: 30243.91 },
  finalise: { count: 0, montantHT: 0, montantTTC: 0 },
  envoye: { count: 0, montantHT: 0, montantTTC: 0 },
  accepte: { count: 1, montantHT: 118.48, montantTTC: 125 },
  factures: { count: 10, montantHT: 9144.32, montantTTC: 9997.04 },
  refuse: { count: 0, montantHT: 0, montantTTC: 0 },
  annules: { count: 8, montantHT: 0, montantTTC: 0 },
};

export default function DevisPage() {
  const [devis] = useState<Devis[]>(mockDevis);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('tous');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateDevis = (data: any) => {
    console.log('Nouveau devis:', data);
    setIsModalOpen(false);
  };

  const filteredDevis = devis.filter(d => {
    const matchSearch = (d.numero?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      d.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'tous') return matchSearch;
    if (activeFilter === 'brouillons') return matchSearch && d.statut === 'BROUILLON';
    if (activeFilter === 'finalise') return matchSearch && d.statut === 'FINALISE';
    if (activeFilter === 'envoye') return matchSearch && d.statut === 'ENVOYE';
    if (activeFilter === 'accepte') return matchSearch && d.statut === 'ACCEPTE';
    if (activeFilter === 'factures') return matchSearch && d.statut === 'FACTURE';
    if (activeFilter === 'refuse') return matchSearch && d.statut === 'REFUSE';
    if (activeFilter === 'annules') return matchSearch && d.statut === 'ANNULE';
    return matchSearch;
  });

  const formatMoney = (amount: number) => amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const StatCard = ({ id, label, count, montantHT, montantTTC, icon, iconBg, active }: {
    id: string; label: string; count: number; montantHT: number; montantTTC: number; 
    icon: React.ReactNode; iconBg: string; active: boolean;
  }) => (
    <button
      onClick={() => setActiveFilter(id)}
      className={`flex-shrink-0 min-w-[130px] p-3 rounded-xl border text-left transition-all ${
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

  const getStatutBadge = (statut: string, expireDans?: number, enRetard?: number) => {
    let badge = null;
    let expireText = null;

    switch (statut) {
      case 'BROUILLON':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"><FileText className="w-3 h-3" /> Brouillon</span>;
        break;
      case 'FINALISE':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-700"><Clock className="w-3 h-3" /> Finalisé</span>;
        break;
      case 'ENVOYE':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700"><Send className="w-3 h-3" /> Envoyé</span>;
        break;
      case 'ACCEPTE':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" /> Accepté</span>;
        break;
      case 'FACTURE':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">€ Facturé</span>;
        break;
      case 'REFUSE':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Refusé</span>;
        break;
      case 'ANNULE':
        badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Annulé</span>;
        break;
    }

    if (expireDans && expireDans > 0) {
      expireText = <span className="text-xs text-amber-600">Expire dans {expireDans} j</span>;
    } else if (enRetard && enRetard > 0) {
      expireText = <span className="text-xs text-red-500">En retard de {enRetard} j</span>;
    }

    return (
      <div className="flex flex-col items-start gap-0.5">
        {badge}
        {expireText}
      </div>
    );
  };

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nouveau devis
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-sm">
          Actions
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Stats cards */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <StatCard 
          id="tous" label="Tous" count={statsData.tous.count} 
          montantHT={statsData.tous.montantHT} montantTTC={statsData.tous.montantTTC}
          icon={<Settings2 className="w-3 h-3 text-secondary-500" />} iconBg="bg-secondary-100"
          active={activeFilter === 'tous'}
        />
        <StatCard 
          id="brouillons" label="Brouillons" count={statsData.brouillons.count}
          montantHT={statsData.brouillons.montantHT} montantTTC={statsData.brouillons.montantTTC}
          icon={<FileText className="w-3 h-3 text-blue-500" />} iconBg="bg-blue-100"
          active={activeFilter === 'brouillons'}
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
          id="accepte" label="Accepté" count={statsData.accepte.count}
          montantHT={statsData.accepte.montantHT} montantTTC={statsData.accepte.montantTTC}
          icon={<CheckCircle2 className="w-3 h-3 text-green-500" />} iconBg="bg-green-100"
          active={activeFilter === 'accepte'}
        />
        <StatCard 
          id="factures" label="Facturés" count={statsData.factures.count}
          montantHT={statsData.factures.montantHT} montantTTC={statsData.factures.montantTTC}
          icon={<span className="text-[10px] font-bold text-green-600">€</span>} iconBg="bg-green-100"
          active={activeFilter === 'factures'}
        />
        <StatCard 
          id="refuse" label="Refusé" count={statsData.refuse.count}
          montantHT={statsData.refuse.montantHT} montantTTC={statsData.refuse.montantTTC}
          icon={<XCircle className="w-3 h-3 text-red-500" />} iconBg="bg-red-100"
          active={activeFilter === 'refuse'}
        />
        <StatCard 
          id="annules" label="Annulés" count={statsData.annules.count}
          montantHT={statsData.annules.montantHT} montantTTC={statsData.annules.montantTTC}
          icon={<XCircle className="w-3 h-3 text-red-500" />} iconBg="bg-red-100"
          active={activeFilter === 'annules'}
        />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Filtrer par titre, numéro ou chantier"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <User className="w-4 h-4" /> Client
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Calendar className="w-4 h-4" /> Date
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Clock className="w-4 h-4" /> Expiré
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <CalendarClock className="w-4 h-4" /> À planifier
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50">
          <Filter className="w-4 h-4" /> Tous les filtres
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-secondary-500 hover:text-secondary-700">
          <XCircle className="w-4 h-4" /> Réinitialiser
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
                  <div className="flex items-center justify-end gap-1">Reste à facturer <ChevronDown className="w-3 h-3" /></div>
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
              {filteredDevis.map((d) => (
                <tr key={d.id} className="hover:bg-secondary-50 cursor-pointer">
                  <td className="px-4 py-3">
                    {d.numero ? (
                      <span className="inline-flex px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-mono rounded">
                        {d.numero}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-primary-600 hover:underline text-sm font-medium">{d.titre}</a>
                  </td>
                  <td className="px-4 py-3 text-sm">{d.client}</td>
                  <td className="px-4 py-3 text-sm">
                    {d.chantier && (
                      <span className="flex items-center gap-1 text-secondary-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {d.chantier}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">{formatMoney(d.montantHT)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatMoney(d.montantTTC)}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    {d.resteAFacturer ? formatMoney(d.resteAFacturer) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {getStatutBadge(d.statut, d.expireDans, d.enRetard)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-600">{d.creeLe}</td>
                  <td className="px-4 py-3 text-sm text-secondary-600">{d.creePar}</td>
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
              <span className="text-sm text-secondary-600">Page 1 sur 3</span>
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

      {/* Modal Nouveau Devis */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau devis"
        size="xl"
      >
        <DevisForm
          onSubmit={handleCreateDevis}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
