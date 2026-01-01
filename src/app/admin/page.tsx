'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  HardHat, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Euro,
  FileText,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';

type TabType = 'activite' | 'finance' | 'tresorerie';

// Données mockées
const mockData = {
  activite: {
    clients: { nouveaux: 285, total: 1250 },
    chantiers: { demarres: 3, total: 45 },
    interventions: { total: 291, depannage: 45, intervention: 98, ramonages: 148 },
    demandes: { enAttente: 12, confirmes: 156, taux: 92.8 },
  },
  finance: {
    ca: { previsionnel: 54952.50, encaisse: 45349.01, restant: 9603.49 },
    depenses: { prevues: 769.68, payees: 769.68 },
    marge: { previsionnelle: 54182.82, reelle: 44579.33 },
    tva: { prevue: 3783.63, reelle: 2998.74 },
    impayes: 274.88,
    repartition: { mainOeuvre: 8537.86, fournitures: 46414.64 },
    devis: { acceptes: 7877.71, factures: 7759.23, restant: 118.48, enCours: 27324.68 },
  },
  tresorerie: {
    solde: 12543.67,
    entrees: 54952.50,
    sorties: 42408.83,
  },
};

// Données graphique interventions (12 mois)
const interventionsData = [
  { mois: 'Jan', creees: 21, terminees: 18 },
  { mois: 'Fév', creees: 12, terminees: 15 },
  { mois: 'Mar', creees: 18, terminees: 14 },
  { mois: 'Avr', creees: 15, terminees: 8 },
  { mois: 'Mai', creees: 8, terminees: 5 },
  { mois: 'Jun', creees: 10, terminees: 12 },
  { mois: 'Juil', creees: 15, terminees: 18 },
  { mois: 'Aoû', creees: 18, terminees: 15 },
  { mois: 'Sep', creees: 65, terminees: 58 },
  { mois: 'Oct', creees: 55, terminees: 62 },
  { mois: 'Nov', creees: 35, terminees: 45 },
  { mois: 'Déc', creees: 19, terminees: 21 },
];

// Données graphique CA (12 mois)
const caData = [
  { mois: 'Jan', facture: 5800, encaisse: 4200 },
  { mois: 'Mar', facture: 4200, encaisse: 5500 },
  { mois: 'Mai', facture: 9800, encaisse: 8500 },
  { mois: 'Juil', facture: 4500, encaisse: 3200 },
  { mois: 'Sep', facture: 7200, encaisse: 6800 },
  { mois: 'Nov', facture: 7800, encaisse: 7200 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('activite');

  const formatMoney = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  const formatMoneyHT = (amount: number) => `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(amount)}€ HT`;

  // Calcul max pour graphique
  const maxInterventions = Math.max(...interventionsData.map(d => Math.max(d.creees, d.terminees)));
  const maxCA = Math.max(...caData.map(d => Math.max(d.facture, d.encaisse)));

  return (
    <div>
      {/* Onglets */}
      <div className="flex gap-1 mb-6 border-b border-secondary-200">
        {[
          { id: 'activite', label: 'Activité' },
          { id: 'finance', label: 'Finance' },
          { id: 'tresorerie', label: 'Trésorerie' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet Activité */}
      {activeTab === 'activite' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Clients */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-secondary-500 text-sm font-medium">Clients</h3>
                <Users className="w-5 h-5 text-secondary-400" />
              </div>
              <p className="text-3xl font-bold text-secondary-900">{mockData.activite.clients.nouveaux}</p>
              <p className="text-sm text-secondary-500">nouveaux</p>
              <Link href="/admin/clients" className="text-primary-600 text-sm mt-3 inline-flex items-center gap-1 hover:underline">
                Voir tous <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Chantiers */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-secondary-500 text-sm font-medium">Chantiers</h3>
                <HardHat className="w-5 h-5 text-secondary-400" />
              </div>
              <p className="text-3xl font-bold text-secondary-900">{mockData.activite.chantiers.demarres}</p>
              <p className="text-sm text-secondary-500">démarrés</p>
              <Link href="/admin/chantiers" className="text-primary-600 text-sm mt-3 inline-flex items-center gap-1 hover:underline">
                Voir tous <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Demandes */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-secondary-500 text-sm font-medium">Demandes</h3>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-secondary-900">{mockData.activite.demandes.enAttente}</p>
              <p className="text-sm text-secondary-500">en attente</p>
              <Link href="/admin/demandes" className="text-primary-600 text-sm mt-3 inline-flex items-center gap-1 hover:underline">
                Voir toutes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Interventions donut */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-secondary-500 text-sm font-medium">Interventions</h3>
              </div>
              <div className="flex items-center gap-4">
                {/* Simple donut representation */}
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${(148/291)*97.4} 97.4`} strokeDashoffset="0" transform="rotate(-90 18 18)" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${(98/291)*97.4} 97.4`} strokeDashoffset={`-${(148/291)*97.4}`} transform="rotate(-90 18 18)" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray={`${(45/291)*97.4} 97.4`} strokeDashoffset={`-${((148+98)/291)*97.4}`} transform="rotate(-90 18 18)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-secondary-400">Total</span>
                    <span className="text-lg font-bold">{mockData.activite.interventions.total}</span>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Dépannage</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Intervention</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Ramonages</div>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique Interventions */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-secondary-900">Interventions</h3>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                  <span className="text-secondary-600">Créées</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-green-500" />
                  <span className="text-secondary-600">Terminées</span>
                </label>
              </div>
            </div>

            {/* Simple chart representation */}
            <div className="h-64 relative">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-secondary-400">
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-12 h-full flex items-end gap-2 pb-8 border-l border-b border-secondary-200">
                {interventionsData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1 h-48">
                      <div 
                        className="w-3 bg-cyan-400 rounded-t transition-all"
                        style={{ height: `${(d.creees / 80) * 100}%` }}
                      />
                      <div 
                        className="w-3 bg-green-400 rounded-t transition-all"
                        style={{ height: `${(d.terminees / 80) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-secondary-400">{d.mois}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Finance */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-500">Filter par :</span>
            <button className="px-3 py-1.5 bg-secondary-100 rounded-lg text-sm font-medium">Activité</button>
          </div>

          {/* KPIs row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* CA Prévisionnel */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-secondary-500 text-sm">Chiffre d'affaires prévisionnel</h3>
              </div>
              <p className="text-2xl font-bold text-secondary-900">{formatMoneyHT(mockData.finance.ca.previsionnel)}</p>
              <div className="mt-3">
                <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(mockData.finance.ca.encaisse / mockData.finance.ca.previsionnel) * 100}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-secondary-500">
                  <span>Encaissé : {formatMoneyHT(mockData.finance.ca.encaisse)}</span>
                  <span>Restant : {formatMoneyHT(mockData.finance.ca.restant)}</span>
                </div>
              </div>
            </div>

            {/* Dépenses */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <h3 className="text-secondary-500 text-sm mb-2">Dépenses prévues</h3>
              <p className="text-2xl font-bold text-secondary-900">{formatMoneyHT(mockData.finance.depenses.prevues)}</p>
              <div className="mt-3">
                <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-xs text-secondary-500 mt-2">Payées : {formatMoneyHT(mockData.finance.depenses.payees)}</p>
              </div>
            </div>

            {/* Marge */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <h3 className="text-secondary-500 text-sm mb-2">Marge prévisionnelle</h3>
              <p className="text-2xl font-bold text-secondary-900">{formatMoneyHT(mockData.finance.marge.previsionnelle)}</p>
              <p className="text-sm text-secondary-500 mt-2">Réelle : {formatMoneyHT(mockData.finance.marge.reelle)}</p>
            </div>

            {/* TVA */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <h3 className="text-secondary-500 text-sm mb-2">Balance de TVA prévue</h3>
              <p className="text-2xl font-bold text-secondary-900">{formatMoneyHT(mockData.finance.tva.prevue)}</p>
              <p className="text-sm text-secondary-500 mt-2">Réelle : {formatMoney(mockData.finance.tva.reelle)}</p>
            </div>

            {/* Impayés */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-secondary-500 text-sm">Impayés clients</h3>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{formatMoneyHT(mockData.finance.impayes)}</p>
            </div>
          </div>

          {/* Row 2 - Répartition & Devis */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Répartition CA */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Répartition du chiffre d'affaires</h3>
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Main d'oeuvre</p>
                    <p className="text-lg font-bold">{formatMoneyHT(mockData.finance.repartition.mainOeuvre)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <HardHat className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Fournitures</p>
                    <p className="text-lg font-bold">{formatMoneyHT(mockData.finance.repartition.fournitures)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails devis */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Détails sur les devis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Devis acceptés</p>
                    <p className="font-bold">{formatMoneyHT(mockData.finance.devis.acceptes)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-4 h-4 text-green-500">✓</span>
                    <span className="text-xs text-secondary-500">Facturés</span>
                  </div>
                  <p className="font-bold text-sm">{formatMoneyHT(mockData.finance.devis.factures)}</p>
                  <div className="flex items-center gap-2 mt-2 mb-1">
                    <span className="w-4 h-4 text-secondary-400">⏳</span>
                    <span className="text-xs text-secondary-500">Restant à facturer</span>
                  </div>
                  <p className="font-bold text-sm">{formatMoneyHT(mockData.finance.devis.restant)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Devis en cours</p>
                    <p className="font-bold">{formatMoneyHT(mockData.finance.devis.enCours)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* CA Graph */}
            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-secondary-900">Chiffre d'affaires</h3>
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                    <span className="text-secondary-600">Facturé TTC</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-green-500" />
                    <span className="text-secondary-600">Encaissé</span>
                  </label>
                </div>
              </div>
              <div className="h-48 flex items-end gap-4 border-l border-b border-secondary-200 pl-2 pb-6">
                {caData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div className="w-4 bg-cyan-400 rounded-t" style={{ height: `${(d.facture / 12000) * 100}%` }} />
                      <div className="w-4 bg-green-400 rounded-t" style={{ height: `${(d.encaisse / 12000) * 100}%` }} />
                    </div>
                    <span className="text-xs text-secondary-400">{d.mois}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dépenses Graph */}
            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <h3 className="font-semibold text-secondary-900 mb-6">Dépenses payées TTC</h3>
              <div className="h-48 flex items-end gap-4 border-l border-b border-secondary-200 pl-2 pb-6">
                {[
                  { mois: 'Jan', montant: 800 },
                  { mois: 'Mar', montant: 50 },
                  { mois: 'Mai', montant: 20 },
                  { mois: 'Juil', montant: 10 },
                  { mois: 'Sep', montant: 15 },
                  { mois: 'Nov', montant: 25 },
                ].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center h-36">
                      <div className="w-6 bg-orange-400 rounded-t" style={{ height: `${(d.montant / 1000) * 100}%` }} />
                    </div>
                    <span className="text-xs text-secondary-400">{d.mois}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Trésorerie */}
      {activeTab === 'tresorerie' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <h3 className="text-secondary-500 text-sm mb-2">Solde actuel</h3>
              <p className="text-3xl font-bold text-secondary-900">{formatMoney(mockData.tresorerie.solde)}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12.5% ce mois</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <h3 className="text-secondary-500 text-sm mb-2">Entrées</h3>
              <p className="text-3xl font-bold text-green-600">{formatMoney(mockData.tresorerie.entrees)}</p>
              <p className="text-sm text-secondary-500 mt-2">Total encaissé cette année</p>
            </div>

            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <h3 className="text-secondary-500 text-sm mb-2">Sorties</h3>
              <p className="text-3xl font-bold text-red-600">{formatMoney(mockData.tresorerie.sorties)}</p>
              <p className="text-sm text-secondary-500 mt-2">Total dépensé cette année</p>
            </div>
          </div>

          {/* Graphique trésorerie */}
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h3 className="font-semibold text-secondary-900 mb-6">Évolution de la trésorerie</h3>
            <div className="h-64 flex items-end gap-2 border-l border-b border-secondary-200 pl-2 pb-6">
              {[
                { mois: 'Jan', solde: 8500 },
                { mois: 'Fév', solde: 9200 },
                { mois: 'Mar', solde: 8800 },
                { mois: 'Avr', solde: 10500 },
                { mois: 'Mai', solde: 11200 },
                { mois: 'Jun', solde: 10800 },
                { mois: 'Juil', solde: 9500 },
                { mois: 'Aoû', solde: 9800 },
                { mois: 'Sep', solde: 11500 },
                { mois: 'Oct', solde: 12800 },
                { mois: 'Nov', solde: 13200 },
                { mois: 'Déc', solde: 12543 },
              ].map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center h-48">
                    <div 
                      className="w-6 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t" 
                      style={{ height: `${(d.solde / 15000) * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs text-secondary-400">{d.mois}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
