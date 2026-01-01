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
  Check, Info, Save
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

  const [modules, setModules] = useState<Module[]>([
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

  const mainTabs = [
    { id: 'general', label: 'Général' },
    { id: 'documents', label: 'Documents' },
    { id: 'parametres', label: 'Paramètres' },
    { id: 'abonnement', label: 'Mon abonnement' },
    { id: 'parrainage', label: 'Parrainage' },
    { id: 'avantages', label: 'Avantages ✨' },
  ];

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
            <h2 className="font-semibold mb-4">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom de l entreprise</label>
                <input type="text" value={entreprise.name} onChange={(e) => setEntreprise({ ...entreprise, name: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type de structure</label>
                <select value={entreprise.type} onChange={(e) => setEntreprise({ ...entreprise, type: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg">
                  <option>Auto-entrepreneur</option>
                  <option>EURL</option>
                  <option>SARL</option>
                  <option>SAS</option>
                  <option>SASU</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SIRET</label>
                  <input type="text" value={entreprise.siret} onChange={(e) => setEntreprise({ ...entreprise, siret: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">N TVA</label>
                  <input type="text" value={entreprise.tva} onChange={(e) => setEntreprise({ ...entreprise, tva: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6">
            <h2 className="font-semibold mb-4">Coordonnées</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="email" value={entreprise.email} onChange={(e) => setEntreprise({ ...entreprise, email: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="tel" value={entreprise.phone} onChange={(e) => setEntreprise({ ...entreprise, phone: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site web</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="text" value={entreprise.website} onChange={(e) => setEntreprise({ ...entreprise, website: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6 lg:col-span-2">
            <h2 className="font-semibold mb-4">Adresse</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Rue</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="text" value={entreprise.address} onChange={(e) => setEntreprise({ ...entreprise, address: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code postal</label>
                <input type="text" value={entreprise.postalCode} onChange={(e) => setEntreprise({ ...entreprise, postalCode: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input type="text" value={entreprise.city} onChange={(e) => setEntreprise({ ...entreprise, city: e.target.value })} className="w-full px-3 py-2 border border-secondary-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Onglet Documents */}
      {mainTab === 'documents' && (
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="font-semibold mb-4">Documents de l entreprise</h2>
          <p className="text-secondary-500">Ajoutez vos documents officiels (Kbis, attestations, certifications...)</p>
          <div className="mt-4 border-2 border-dashed border-secondary-200 rounded-xl p-8 text-center">
            <Download className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
            <p className="text-secondary-500">Glissez-déposez vos fichiers ici ou cliquez pour parcourir</p>
          </div>
        </div>
      )}

      {/* Onglet Paramètres */}
      {mainTab === 'parametres' && (
        <div className="flex gap-6">
          {/* Sous-menu latéral */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-secondary-100 p-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {settingsMenu.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-xs font-semibold text-secondary-400 uppercase px-3 py-2">{section.title}</p>
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = settingsSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSettingsSection(item.id as SettingsSection)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-secondary-600 hover:bg-secondary-50'
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

          {/* Contenu paramètres */}
          <div className="flex-1">
            {settingsSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Général</h2>
                
                {/* Message info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-700">Bienvenue dans les paramètres. Configurez votre application selon vos besoins.</p>
                </div>

                {/* Modules */}
                <div>
                  <h3 className="font-semibold mb-2">Modules</h3>
                  <p className="text-secondary-500 text-sm mb-4">Activez uniquement les modules dont vous avez besoin pour simplifier l interface.</p>
                  
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
                          <p className="text-sm text-secondary-500">{module.description} {module.link && <a href="#" className="text-primary-600 hover:underline">{module.link}</a>}</p>
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
                  <p className="text-secondary-500">Personnalisez l apparence de vos devis et factures.</p>
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Modes de paiement acceptés</label>
                    <div className="space-y-2">
                      {['Espèces', 'Chèque', 'Virement bancaire', 'Carte bancaire'].map(mode => (
                        <label key={mode} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Horaires de travail</label>
                    <div className="flex items-center gap-2">
                      <input type="time" defaultValue="08:00" className="px-3 py-2 border border-secondary-200 rounded-lg" />
                      <span>à</span>
                      <input type="time" defaultValue="18:00" className="px-3 py-2 border border-secondary-200 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {settingsSection === 'equipements' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Équipements</h2>
                <div className="bg-white border border-secondary-100 rounded-xl p-6">
                  <p className="text-secondary-500 mb-4">Gérez les types d équipements pour vos interventions.</p>
                  <button className="btn-primary">Gérer les équipements</button>
                </div>
              </div>
            )}

            {/* Contenu par défaut pour les autres sections */}
            {!['general', 'presentation', 'paiements', 'numerotation', 'calendrier', 'equipements'].includes(settingsSection) && (
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
    </div>
  );
}
