'use client';

import { useState } from 'react';
import { 
  Building2, Globe, Mail, Phone, MapPin, Camera, 
  FileText, CreditCard, Hash, FileSpreadsheet,
  Receipt, TrendingUp, Banknote,
  Calendar, ClipboardList, Palette, Wrench, MessageSquare,
  Package, Clock, Box,
  Type, FileCheck, ScrollText, Award, Send,
  Puzzle, Download, QrCode,
  Check, Info, Save, X, Copy, ExternalLink
} from 'lucide-react';

type MainTab = 'general' | 'documents' | 'parametres' | 'abonnement' | 'parrainage' | 'avantages';
type SettingsSection = 
  | 'general' 
  | 'presentation' | 'paiements' | 'numerotation' | 'modeles-devis'
  | 'depenses-general'
  | 'compta-depenses' | 'compta-ventes' | 'compta-banque'
  | 'calendrier' | 'modeles-rapports' | 'style-rapports' | 'equipements' | 'formulaires'
  | 'chantiers' | 'gestion-stock' | 'feuilles-heures'
  | 'proprietes' | 'blocs-texte' | 'cgv' | 'certifications' | 'emails'
  | 'integrations' | 'imports' | 'qr-codes';

interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  link?: string;
}

interface RdvConfig {
  // Mode
  mode: 'creneaux' | 'horaires';
  
  // Mode Créneaux
  maxMorning: number;
  maxAfternoon: number;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  
  // Mode Horaires
  slotDuration: number;
  slotInterval: number;
  maxPerSlot: number;
  dayStart: string;
  dayEnd: string;
  lunchBreak: boolean;
  lunchStart: string;
  lunchEnd: string;
  
  // Disponibilités
  workDays: { [key: string]: boolean };
  minDelayEnabled: boolean;
  minDelayHours: number;
  maxDelayEnabled: boolean;
  maxDelayDays: number;
  
  // Services
  services: { id: string; name: string; enabled: boolean }[];
  
  // Zones
  departments: string[];
  
  // Notifications
  emailNotify: boolean;
  smsNotify: boolean;
  validationMode: 'auto' | 'manual';
  clientEmailConfirm: boolean;
  confirmMessage: string;
  
  // Widget
  widgetColor: string;
  showLogo: boolean;
}

const settingsMenu = [
  {
    title: 'Général',
    items: [{ id: 'general', label: 'Général', icon: Building2 }],
  },
  {
    title: 'Devis / Facture',
    items: [
      { id: 'presentation', label: 'Présentation', icon: FileText },
      { id: 'paiements', label: 'Paiements & taxes', icon: CreditCard },
      { id: 'numerotation', label: 'Numérotation', icon: Hash },
      { id: 'modeles-devis', label: 'Modèles de devis', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Dépenses',
    items: [{ id: 'depenses-general', label: 'Général', icon: Receipt }],
  },
  {
    title: 'Comptabilité',
    items: [
      { id: 'compta-depenses', label: 'Dépenses', icon: TrendingUp },
      { id: 'compta-ventes', label: 'Ventes', icon: TrendingUp },
      { id: 'compta-banque', label: 'Banque', icon: Banknote },
    ],
  },
  {
    title: 'Interventions',
    items: [
      { id: 'calendrier', label: 'Calendrier', icon: Calendar },
      { id: 'modeles-rapports', label: 'Modèles de rapports', icon: ClipboardList },
      { id: 'style-rapports', label: 'Style des rapports', icon: Palette },
      { id: 'equipements', label: 'Équipements', icon: Wrench },
      { id: 'formulaires', label: 'Formulaires de demande', icon: MessageSquare },
    ],
  },
  {
    title: 'Modules',
    items: [
      { id: 'chantiers', label: 'Chantiers', icon: Package },
      { id: 'gestion-stock', label: 'Gestion de stock', icon: Box },
      { id: 'feuilles-heures', label: "Feuilles d'heures", icon: Clock },
    ],
  },
  {
    title: 'Personnalisation',
    items: [
      { id: 'proprietes', label: 'Propriétés', icon: Type },
      { id: 'blocs-texte', label: 'Blocs de texte', icon: FileCheck },
      { id: 'cgv', label: 'CGV', icon: ScrollText },
      { id: 'certifications', label: 'Certifications', icon: Award },
      { id: 'emails', label: 'Emails', icon: Send },
    ],
  },
  {
    title: 'Autres',
    items: [
      { id: 'integrations', label: 'Intégrations', icon: Puzzle },
      { id: 'imports', label: 'Imports', icon: Download },
      { id: 'qr-codes', label: 'QR Codes', icon: QrCode },
    ],
  },
];

export default function EntreprisePage() {
  const [mainTab, setMainTab] = useState<MainTab>('parametres');
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('general');
  const [showRdvConfig, setShowRdvConfig] = useState(false);
  const [rdvConfigTab, setRdvConfigTab] = useState<'mode' | 'disponibilites' | 'services' | 'notifications' | 'widget'>('mode');
  
  const [entreprise, setEntreprise] = useState({
    name: 'DCS Ramonage Oise & Val d\'Oise',
    type: 'Auto-entrepreneur',
    siret: '123 456 789 00012',
    tva: 'FR12345678901',
    email: 'contact@dcs-ramonage.fr',
    phone: '06 12 34 56 78',
    website: 'dcs-ramonage.fr',
    address: '15 Rue de la Gare',
    postalCode: '60000',
    city: 'Beauvais',
  });

  const [rdvConfig, setRdvConfig] = useState<RdvConfig>({
    mode: 'creneaux',
    maxMorning: 5,
    maxAfternoon: 5,
    morningStart: '08:00',
    morningEnd: '12:00',
    afternoonStart: '14:00',
    afternoonEnd: '18:00',
    slotDuration: 60,
    slotInterval: 30,
    maxPerSlot: 1,
    dayStart: '08:00',
    dayEnd: '18:00',
    lunchBreak: true,
    lunchStart: '12:00',
    lunchEnd: '14:00',
    workDays: {
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: false,
      dimanche: false,
    },
    minDelayEnabled: true,
    minDelayHours: 24,
    maxDelayEnabled: true,
    maxDelayDays: 60,
    services: [
      { id: 'ramonage', name: 'Ramonage', enabled: true },
      { id: 'entretien', name: 'Entretien poêle', enabled: true },
      { id: 'debistrage', name: 'Débistrage', enabled: true },
      { id: 'tubage', name: 'Tubage', enabled: true },
      { id: 'diagnostic', name: 'Diagnostic', enabled: true },
      { id: 'fumisterie', name: 'Fumisterie', enabled: false },
      { id: 'depannage', name: 'Dépannage', enabled: false },
      { id: 'autre', name: 'Autre', enabled: true },
    ],
    departments: ['60', '95'],
    emailNotify: true,
    smsNotify: false,
    validationMode: 'manual',
    clientEmailConfirm: true,
    confirmMessage: 'Votre demande de rendez-vous a bien été enregistrée. Nous vous confirmerons le créneau dans les plus brefs délais.',
    widgetColor: '#f97316',
    showLogo: true,
  });

  const [modules, setModules] = useState<Module[]>([
    { id: 'rdv-en-ligne', name: 'RDV en ligne', description: 'Permettez à vos clients de prendre rendez-vous directement depuis votre site web. Widget intégrable avec lien externe.', enabled: true, link: 'Configurer' },
    { id: 'devis-factures', name: 'Devis / Factures', description: 'Conçu avec l\'expérience du terrain, vous éditez vos devis en quelques clics puis les facturez depuis le WEB ou sur le terrain avec l\'application mobile.', enabled: true, link: 'En savoir plus' },
    { id: 'depenses', name: 'Dépenses & bons de commande', description: 'Suivez vos dépenses, générez vos bons de commandes fournisseurs et pilotez votre marge.', enabled: true },
    { id: 'chantiers', name: 'Suivi de chantiers', description: 'Pour les chefs d\'entreprises qui veulent en finir avec les problèmes d\'organisation et de suivi sur les chantiers.', enabled: false },
    { id: 'gmao', name: 'GMAO - Maintenances', description: 'Pilotez vos maintenances et vos parcs d\'équipement simplement.', enabled: false },
    { id: 'bibliotheque', name: 'Bibliothèque de prix', description: 'Accédez à vos articles et ouvrages favoris en un clin d\'oeil.', enabled: true },
    { id: 'stock', name: 'Gestion de stock', description: 'Gérez l\'état de vos stocks et anticipez d\'éventuelles ruptures.', enabled: false },
    { id: 'banque', name: 'Banque', description: 'Rapprochez vos transactions bancaires de vos dépenses et factures.', enabled: true },
    { id: 'automatisations', name: 'Automatisations', description: 'Gagnez du temps en automatisant vos actions.', enabled: true },
  ]);

  const toggleModule = (id: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const toggleService = (id: string) => {
    setRdvConfig({
      ...rdvConfig,
      services: rdvConfig.services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    });
  };

  const handleModuleLink = (moduleId: string) => {
    if (moduleId === 'rdv-en-ligne') {
      setShowRdvConfig(true);
    }
  };

  const mainTabs = [
    { id: 'general', label: 'Général' },
    { id: 'documents', label: 'Documents' },
    { id: 'parametres', label: 'Paramètres' },
    { id: 'abonnement', label: 'Mon abonnement' },
    { id: 'parrainage', label: 'Parrainage' },
    { id: 'avantages', label: 'Avantages ✨' },
  ];

  const widgetUrl = `https://${entreprise.website}/reservation`;
  const iframeCode = `<iframe src="${widgetUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <div>
      {/* Header entreprise */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center border border-secondary-200 relative group cursor-pointer">
          <Building2 className="w-8 h-8 text-secondary-400" />
          <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-secondary-900">{entreprise.name}</h1>
          <p className="text-secondary-500">Type : {entreprise.type}</p>
          <a href={`https://${entreprise.website}`} target="_blank" className="text-primary-600 hover:underline text-sm">
            Site web : {entreprise.website}
          </a>
        </div>
      </div>

      {/* Onglets principaux */}
      <div className="flex gap-1 border-b border-secondary-200 mb-6">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id as MainTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              mainTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet Général */}
      {mainTab === 'general' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h3 className="font-semibold mb-4">Informations de l'entreprise</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Nom de l'entreprise</label>
                <input type="text" value={entreprise.name} onChange={(e) => setEntreprise({...entreprise, name: e.target.value})} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">SIRET</label>
                  <input type="text" value={entreprise.siret} onChange={(e) => setEntreprise({...entreprise, siret: e.target.value})} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">N° TVA</label>
                  <input type="text" value={entreprise.tva} onChange={(e) => setEntreprise({...entreprise, tva: e.target.value})} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input type="email" value={entreprise.email} onChange={(e) => setEntreprise({...entreprise, email: e.target.value})} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Téléphone</label>
                <input type="tel" value={entreprise.phone} onChange={(e) => setEntreprise({...entreprise, phone: e.target.value})} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Documents */}
      {mainTab === 'documents' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="font-semibold mb-4">Documents</h2>
          <p className="text-secondary-500">Gérez vos documents légaux (Kbis, attestations, etc.)</p>
        </div>
      )}

      {/* Onglet Paramètres */}
      {mainTab === 'parametres' && (
        <div className="flex gap-6">
          {/* Menu latéral */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-secondary-100 p-2">
              {settingsMenu.map((section, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-xs font-semibold text-secondary-400 uppercase px-3 py-2">{section.title}</p>
                  {section.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSettingsSection(item.id as SettingsSection)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          settingsSection === item.id
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-secondary-600 hover:bg-secondary-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1">
            {settingsSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Général</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-700">Bienvenue dans les paramètres. Configurez votre application selon vos besoins.</p>
                </div>

                {/* Modules */}
                <div>
                  <h3 className="font-semibold mb-2">Modules</h3>
                  <p className="text-secondary-500 text-sm mb-4">Activez uniquement les modules dont vous avez besoin pour simplifier l'interface.</p>
                  
                  <div className="space-y-3">
                    {modules.map(module => (
                      <div key={module.id} className="flex items-start gap-3 p-4 bg-white border border-secondary-100 rounded-xl">
                        <button 
                          onClick={() => toggleModule(module.id)}
                          className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                            module.enabled ? 'bg-primary-500 text-white' : 'bg-secondary-200'
                          }`}
                        >
                          {module.enabled && <Check className="w-3 h-3" />}
                        </button>
                        <div className="flex-1">
                          <p className="font-medium">{module.name}</p>
                          <p className="text-sm text-secondary-500">
                            {module.description}
                            {module.link && (
                              <button 
                                onClick={() => handleModuleLink(module.id)}
                                className="text-primary-600 hover:underline ml-1"
                              >
                                {module.link}
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settingsSection === 'presentation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Présentation des devis / factures</h2>
                <div className="bg-white border border-secondary-100 rounded-xl p-6">
                  <p className="text-secondary-500">Personnalisez l'apparence de vos devis et factures.</p>
                </div>
              </div>
            )}

            {settingsSection === 'paiements' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Paiements et taxes</h2>
                <div className="bg-white border border-secondary-100 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Taux de TVA par défaut</label>
                    <select className="w-full max-w-xs px-3 py-2 border border-secondary-200 rounded-lg">
                      <option>20% - TVA normale</option>
                      <option>10% - TVA réduite</option>
                      <option>5.5% - TVA réduite</option>
                      <option>0% - Exonéré</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {settingsSection === 'numerotation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Numérotation</h2>
                <div className="bg-white border border-secondary-100 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Format des numéros de devis</label>
                    <input type="text" defaultValue="D-{YYYY}-{NUM}" className="w-full max-w-xs px-3 py-2 border border-secondary-200 rounded-lg" />
                    <p className="text-xs text-secondary-500 mt-1">Exemple: D-2026-001</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Format des numéros de factures</label>
                    <input type="text" defaultValue="F-{YYYY}-{NUM}" className="w-full max-w-xs px-3 py-2 border border-secondary-200 rounded-lg" />
                    <p className="text-xs text-secondary-500 mt-1">Exemple: F-2026-001</p>
                  </div>
                </div>
              </div>
            )}

            {settingsSection === 'calendrier' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Calendrier</h2>
                <div className="bg-white border border-secondary-100 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Premier jour de la semaine</label>
                    <select className="w-full max-w-xs px-3 py-2 border border-secondary-200 rounded-lg">
                      <option>Lundi</option>
                      <option>Dimanche</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {!['general', 'presentation', 'paiements', 'numerotation', 'calendrier'].includes(settingsSection) && (
              <div>
                <h2 className="text-xl font-semibold mb-4 capitalize">{settingsSection.replace(/-/g, ' ')}</h2>
                <div className="bg-white border border-secondary-100 rounded-xl p-6">
                  <p className="text-secondary-500">Configuration à venir...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onglet Abonnement */}
      {mainTab === 'abonnement' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="font-semibold mb-4">Mon abonnement</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <p className="text-green-700 font-medium">Abonnement actif</p>
          </div>
          <p className="text-secondary-500">Gérez votre abonnement et vos options de facturation.</p>
        </div>
      )}

      {/* Onglet Parrainage */}
      {mainTab === 'parrainage' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="font-semibold mb-4">Parrainage</h2>
          <p className="text-secondary-500 mb-4">Parrainez vos confrères et gagnez des récompenses !</p>
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="text-primary-700 font-medium">Votre code de parrainage : DCS2026</p>
          </div>
        </div>
      )}

      {/* Onglet Avantages */}
      {mainTab === 'avantages' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="font-semibold mb-4">Avantages</h2>
          <p className="text-secondary-500">Découvrez les avantages exclusifs réservés à nos utilisateurs.</p>
        </div>
      )}

      {/* Modal Configuration RDV en ligne */}
      {showRdvConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRdvConfig(false)} />
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div>
                <h2 className="text-xl font-bold">Configuration RDV en ligne</h2>
                <p className="text-secondary-500 text-sm">Paramétrez votre système de réservation</p>
              </div>
              <button onClick={() => setShowRdvConfig(false)} className="p-2 hover:bg-secondary-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 border-b border-secondary-200">
              {[
                { id: 'mode', label: 'Mode & Créneaux' },
                { id: 'disponibilites', label: 'Disponibilités' },
                { id: 'services', label: 'Services' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'widget', label: 'Widget' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRdvConfigTab(tab.id as typeof rdvConfigTab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    rdvConfigTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Mode & Créneaux */}
              {rdvConfigTab === 'mode' && (
                <div className="space-y-6">
                  {/* Choix du mode */}
                  <div>
                    <h3 className="font-semibold mb-3">Mode de réservation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setRdvConfig({ ...rdvConfig, mode: 'creneaux' })}
                        className={`p-4 rounded-xl border-2 text-left transition-colors ${
                          rdvConfig.mode === 'creneaux'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <p className="font-semibold">Mode Créneaux</p>
                        <p className="text-sm text-secondary-500">Matin / Après-midi avec capacité max par créneau</p>
                      </button>
                      <button
                        onClick={() => setRdvConfig({ ...rdvConfig, mode: 'horaires' })}
                        className={`p-4 rounded-xl border-2 text-left transition-colors ${
                          rdvConfig.mode === 'horaires'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <p className="font-semibold">Mode Horaires</p>
                        <p className="text-sm text-secondary-500">Plages horaires précises (9h00, 10h00...)</p>
                      </button>
                    </div>
                  </div>

                  {/* Paramètres Mode Créneaux */}
                  {rdvConfig.mode === 'creneaux' && (
                    <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
                      <h4 className="font-medium">Paramètres créneaux</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">RDV max / matin</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={rdvConfig.maxMorning}
                            onChange={(e) => setRdvConfig({ ...rdvConfig, maxMorning: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">RDV max / après-midi</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={rdvConfig.maxAfternoon}
                            onChange={(e) => setRdvConfig({ ...rdvConfig, maxAfternoon: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Début matin</label>
                          <input type="time" value={rdvConfig.morningStart} onChange={(e) => setRdvConfig({ ...rdvConfig, morningStart: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Fin matin</label>
                          <input type="time" value={rdvConfig.morningEnd} onChange={(e) => setRdvConfig({ ...rdvConfig, morningEnd: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Début après-midi</label>
                          <input type="time" value={rdvConfig.afternoonStart} onChange={(e) => setRdvConfig({ ...rdvConfig, afternoonStart: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Fin après-midi</label>
                          <input type="time" value={rdvConfig.afternoonEnd} onChange={(e) => setRdvConfig({ ...rdvConfig, afternoonEnd: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Paramètres Mode Horaires */}
                  {rdvConfig.mode === 'horaires' && (
                    <div className="bg-secondary-50 rounded-xl p-4 space-y-4">
                      <h4 className="font-medium">Paramètres horaires</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Durée RDV (min)</label>
                          <select value={rdvConfig.slotDuration} onChange={(e) => setRdvConfig({ ...rdvConfig, slotDuration: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg">
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>1h</option>
                            <option value={90}>1h30</option>
                            <option value={120}>2h</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Intervalle (min)</label>
                          <select value={rdvConfig.slotInterval} onChange={(e) => setRdvConfig({ ...rdvConfig, slotInterval: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg">
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={60}>1h</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">RDV max / créneau</label>
                          <input type="number" min={1} max={10} value={rdvConfig.maxPerSlot} onChange={(e) => setRdvConfig({ ...rdvConfig, maxPerSlot: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Début journée</label>
                          <input type="time" value={rdvConfig.dayStart} onChange={(e) => setRdvConfig({ ...rdvConfig, dayStart: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Fin journée</label>
                          <input type="time" value={rdvConfig.dayEnd} onChange={(e) => setRdvConfig({ ...rdvConfig, dayEnd: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="lunchBreak" checked={rdvConfig.lunchBreak} onChange={(e) => setRdvConfig({ ...rdvConfig, lunchBreak: e.target.checked })} className="rounded" />
                        <label htmlFor="lunchBreak" className="text-sm font-medium">Pause déjeuner</label>
                      </div>
                      {rdvConfig.lunchBreak && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Début pause</label>
                            <input type="time" value={rdvConfig.lunchStart} onChange={(e) => setRdvConfig({ ...rdvConfig, lunchStart: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Fin pause</label>
                            <input type="time" value={rdvConfig.lunchEnd} onChange={(e) => setRdvConfig({ ...rdvConfig, lunchEnd: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Disponibilités */}
              {rdvConfigTab === 'disponibilites' && (
                <div className="space-y-6">
                  {/* Jours travaillés */}
                  <div>
                    <h3 className="font-semibold mb-3">Jours travaillés</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(rdvConfig.workDays).map(([day, enabled]) => (
                        <button
                          key={day}
                          onClick={() => setRdvConfig({
                            ...rdvConfig,
                            workDays: { ...rdvConfig.workDays, [day]: !enabled }
                          })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            enabled
                              ? 'bg-primary-500 text-white'
                              : 'bg-secondary-100 text-secondary-600'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Délai min */}
                  <div className="bg-secondary-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">Délai minimum de réservation</p>
                        <p className="text-sm text-secondary-500">Temps minimum avant la date du RDV</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={rdvConfig.minDelayEnabled}
                        onChange={(e) => setRdvConfig({ ...rdvConfig, minDelayEnabled: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    {rdvConfig.minDelayEnabled && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={rdvConfig.minDelayHours}
                          onChange={(e) => setRdvConfig({ ...rdvConfig, minDelayHours: parseInt(e.target.value) })}
                          className="w-24 px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                        <span className="text-secondary-600">heures avant le RDV</span>
                      </div>
                    )}
                  </div>

                  {/* Délai max */}
                  <div className="bg-secondary-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">Délai maximum de réservation</p>
                        <p className="text-sm text-secondary-500">Jusqu'à quand peut-on réserver à l'avance</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={rdvConfig.maxDelayEnabled}
                        onChange={(e) => setRdvConfig({ ...rdvConfig, maxDelayEnabled: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    {rdvConfig.maxDelayEnabled && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={rdvConfig.maxDelayDays}
                          onChange={(e) => setRdvConfig({ ...rdvConfig, maxDelayDays: parseInt(e.target.value) })}
                          className="w-24 px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                        <span className="text-secondary-600">jours à l'avance maximum</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Services */}
              {rdvConfigTab === 'services' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Services proposés</h3>
                    <p className="text-sm text-secondary-500 mb-4">Sélectionnez les services disponibles à la réservation en ligne</p>
                    <div className="space-y-2">
                      {rdvConfig.services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <span className="font-medium">{service.name}</span>
                          <button
                            onClick={() => toggleService(service.id)}
                            className={`w-10 h-6 rounded-full transition-colors ${
                              service.enabled ? 'bg-primary-500' : 'bg-secondary-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              service.enabled ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Zones d'intervention</h3>
                    <div className="flex flex-wrap gap-2">
                      {['60', '95'].map(dept => (
                        <span key={dept} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {dept === '60' ? 'Oise (60)' : 'Val-d\'Oise (95)'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {rdvConfigTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Notifications administrateur</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div>
                          <p className="font-medium">Notification par email</p>
                          <p className="text-sm text-secondary-500">Recevoir un email à chaque nouvelle demande</p>
                        </div>
                        <button
                          onClick={() => setRdvConfig({ ...rdvConfig, emailNotify: !rdvConfig.emailNotify })}
                          className={`w-10 h-6 rounded-full transition-colors ${rdvConfig.emailNotify ? 'bg-primary-500' : 'bg-secondary-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${rdvConfig.emailNotify ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div>
                          <p className="font-medium">Notification par SMS</p>
                          <p className="text-sm text-secondary-500">Recevoir un SMS à chaque nouvelle demande</p>
                        </div>
                        <button
                          onClick={() => setRdvConfig({ ...rdvConfig, smsNotify: !rdvConfig.smsNotify })}
                          className={`w-10 h-6 rounded-full transition-colors ${rdvConfig.smsNotify ? 'bg-primary-500' : 'bg-secondary-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${rdvConfig.smsNotify ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Mode de validation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setRdvConfig({ ...rdvConfig, validationMode: 'manual' })}
                        className={`p-4 rounded-xl border-2 text-left ${rdvConfig.validationMode === 'manual' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}
                      >
                        <p className="font-semibold">Validation manuelle</p>
                        <p className="text-sm text-secondary-500">Vous confirmez chaque demande</p>
                      </button>
                      <button
                        onClick={() => setRdvConfig({ ...rdvConfig, validationMode: 'auto' })}
                        className={`p-4 rounded-xl border-2 text-left ${rdvConfig.validationMode === 'auto' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'}`}
                      >
                        <p className="font-semibold">Validation automatique</p>
                        <p className="text-sm text-secondary-500">Les RDV sont confirmés automatiquement</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Confirmation client</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <p className="font-medium">Envoyer un email de confirmation au client</p>
                        <button
                          onClick={() => setRdvConfig({ ...rdvConfig, clientEmailConfirm: !rdvConfig.clientEmailConfirm })}
                          className={`w-10 h-6 rounded-full transition-colors ${rdvConfig.clientEmailConfirm ? 'bg-primary-500' : 'bg-secondary-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${rdvConfig.clientEmailConfirm ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message de confirmation</label>
                        <textarea
                          value={rdvConfig.confirmMessage}
                          onChange={(e) => setRdvConfig({ ...rdvConfig, confirmMessage: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Widget */}
              {rdvConfigTab === 'widget' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">URL de réservation</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={widgetUrl}
                        className="flex-1 px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-600"
                      />
                      <button className="p-2 bg-secondary-100 hover:bg-secondary-200 rounded-lg">
                        <Copy className="w-5 h-5" />
                      </button>
                      <a href={widgetUrl} target="_blank" className="p-2 bg-secondary-100 hover:bg-secondary-200 rounded-lg">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Code d'intégration (iframe)</h3>
                    <div className="relative">
                      <textarea
                        readOnly
                        value={iframeCode}
                        rows={3}
                        className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-mono text-secondary-600"
                      />
                      <button className="absolute top-2 right-2 p-1 bg-white border border-secondary-200 rounded hover:bg-secondary-50">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Personnalisation</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Couleur principale</label>
                        <div className="flex gap-2">
                          {['#f97316', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444', '#06b6d4'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setRdvConfig({ ...rdvConfig, widgetColor: color })}
                              className={`w-10 h-10 rounded-lg border-2 ${rdvConfig.widgetColor === color ? 'border-secondary-900' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <p className="font-medium">Afficher le logo</p>
                        <button
                          onClick={() => setRdvConfig({ ...rdvConfig, showLogo: !rdvConfig.showLogo })}
                          className={`w-10 h-6 rounded-full transition-colors ${rdvConfig.showLogo ? 'bg-primary-500' : 'bg-secondary-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${rdvConfig.showLogo ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200">
              <button
                onClick={() => setShowRdvConfig(false)}
                className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowRdvConfig(false);
                  alert('Configuration sauvegardée !');
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
