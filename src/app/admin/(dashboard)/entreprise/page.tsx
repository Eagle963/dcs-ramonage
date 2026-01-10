'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Building2, Globe, Mail, Phone, MapPin, Camera,
  FileText, CreditCard, Hash, FileSpreadsheet,
  Receipt, TrendingUp, Banknote,
  Calendar, ClipboardList, Palette, Wrench, MessageSquare,
  Package, Clock, Box,
  Type, FileCheck, ScrollText, Award, Send,
  Puzzle, Download, QrCode,
  Check, Info, Save, X, Copy, ExternalLink,
  Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronUp,
  Briefcase, FileSearch, Flag
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant Sortable pour les services
function SortableServiceItem({
  service,
  onToggle,
  onEdit,
  onDelete
}: {
  service: ServiceItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border border-secondary-200 rounded-lg group hover:border-secondary-300"
    >
      {/* Poignée de drag */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-secondary-400 hover:text-secondary-600 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Infos service */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-secondary-900">{service.name}</p>
        <p className="text-sm text-primary-600 font-medium">{service.tarif}</p>
      </div>

      {/* Toggle ON/OFF */}
      <button
        onClick={onToggle}
        className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          service.enabled ? 'bg-primary-500' : 'bg-secondary-300'
        }`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
          service.enabled ? 'translate-x-5' : 'translate-x-1'
        }`} />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Composant Sortable pour les équipements
function SortableEquipmentItem({
  equipment,
  onEdit,
  onDelete
}: {
  equipment: EquipmentItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: equipment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border border-secondary-200 rounded-lg group hover:border-secondary-300"
    >
      {/* Poignée de drag */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-secondary-400 hover:text-secondary-600 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Infos équipement */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-secondary-900 text-sm">{equipment.name}</p>
      </div>

      {/* Tarif */}
      <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
        {equipment.tarif}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

type MainTab = 'general' | 'documents' | 'parametres' | 'abonnement' | 'parrainage' | 'avantages';
type GeneralSection = 'metiers' | 'details';

// Liste des métiers disponibles
const METIERS_LIST = [
  'Alarme',
  'Ascensoriste',
  'Automatisme',
  'Automobile',
  'Autre',
  'Borne de recharge',
  'Carreleur',
  'Charpente',
  'Chauffage',
  'Climatisation',
  'Construction',
  'Cordiste',
  'Courant faible',
  'Couverture',
  'Cuisine Professionnelle',
  'Diagnostic immobilier',
  'Electricité',
  'Étanchéité',
  'Froid',
  'Informatique',
  'Isolation',
  'Loueur Auto',
  'Loueur Immo',
  'Lutte contre les nuisibles',
  'Mécanique nautique',
  'Menuiserie',
  'Miroitier',
  'Multi-Services',
  'Nettoyage',
  'Paysagisme',
  'Peinture',
  'Photovoltaïque',
  'Pisciniste',
  'Plaquiste',
  'Plomberie',
  'Pompe à chaleur',
  'Portes automatiques',
  'Ramonage',
  'Ravalement',
  'Rénovation',
  'Serrurerie',
  'Télématique',
  'Tous Corps d\'Etat',
  'Transport',
  'Ventilation',
  'Zinguerie',
];
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

// Service avec tarif et ordre
interface ServiceItem {
  id: string;
  name: string;
  tarif: string;
  tarifHT?: string;
  enabled: boolean;
  order: number;
}

// Équipement avec tarif et ordre
interface EquipmentItem {
  id: string;
  name: string;
  tarif: string;
  tarifHT?: string;
  order: number;
}

// Zone d'intervention
interface ZoneItem {
  id: string;
  code: string;
  name: string;
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
  services: ServiceItem[];

  // Équipements
  equipments: EquipmentItem[];

  // Zones
  zones: ZoneItem[];

  // Notifications
  emailNotify: boolean;
  smsNotify: boolean;
  validationMode: 'auto' | 'manual';
  clientEmailConfirm: boolean;
  confirmMessage: string;

  // Widget
  widgetColor: string;
  showLogo: boolean;
  headerBadge: string;
  headerTitle: string;
  headerSubtitle: string;
  enableClientTypeStep: boolean;
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
  const [mainTab, setMainTab] = useState<MainTab>('general');
  const [generalSection, setGeneralSection] = useState<GeneralSection>('metiers');
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('general');
  const [showRdvConfig, setShowRdvConfig] = useState(false);
  const [rdvConfigTab, setRdvConfigTab] = useState<'mode' | 'disponibilites' | 'services' | 'notifications' | 'widget'>('mode');

  // États pour la section Métiers
  const [selectedMetiers, setSelectedMetiers] = useState<string[]>(['Ramonage']);
  const [editingMetiers, setEditingMetiers] = useState(false);
  const [tempMetiers, setTempMetiers] = useState<string[]>([]);
  const [metiersDropdownOpen, setMetiersDropdownOpen] = useState(false);
  const metiersDropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (metiersDropdownRef.current && !metiersDropdownRef.current.contains(event.target as Node)) {
        setMetiersDropdownOpen(false);
      }
    };

    if (metiersDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [metiersDropdownOpen]);

  // États pour la section Détails
  const [editingInfos, setEditingInfos] = useState(false);
  const [editingCoordonnees, setEditingCoordonnees] = useState(false);

  // États pour la numérotation
  const [numerotation, setNumerotation] = useState({
    devis: { prefix: 'D', year: '', separator: '', numberLength: '4', nextNumber: '0020' },
    factures: { prefix: 'F', year: '', separator: '', numberLength: '4', nextNumber: '0354' },
    avoirs: { prefix: 'AV', year: '', separator: '', numberLength: '4', nextNumber: '0001' },
  });
  const [formatModalOpen, setFormatModalOpen] = useState<'devis' | 'factures' | 'avoirs' | null>(null);
  const [numberModalOpen, setNumberModalOpen] = useState<'devis' | 'factures' | 'avoirs' | null>(null);
  const [tempFormat, setTempFormat] = useState({ prefix: '', year: '', separator: '', numberLength: '4' });
  const [tempNextNumber, setTempNextNumber] = useState('');

  const getFormatPreview = (format: { prefix: string; year: string; separator: string; numberLength: string }) => {
    let result = format.prefix;
    if (format.year) {
      result += format.separator + (format.year === 'YYYY' ? '2026' : format.year === 'YY' ? '26' : format.year === 'YYYYMM' ? '202601' : '2601');
    }
    result += format.separator + '0'.repeat(parseInt(format.numberLength) - 1) + '1';
    return result;
  };

  // États pour la Présentation des documents
  const [documentColor, setDocumentColor] = useState('#3b82f6');
  const [documentStyle, setDocumentStyle] = useState<'classique' | 'moderne'>('classique');
  const [phoneInternational, setPhoneInternational] = useState(false);
  const [autoCreateArticles, setAutoCreateArticles] = useState(true);
  const [presentationSections, setPresentationSections] = useState<Record<string, boolean>>({
    entreprise: false,
    client: false,
    tableaux: false,
    operations: false,
    paiements: false,
    piedPage: false,
    mentions: false,
    cgv: false,
    automatisations: false,
  });

  const togglePresentationSection = (section: string) => {
    setPresentationSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [entreprise, setEntreprise] = useState({
    name: 'DCS Ramonage Oise & Val d\'Oise',
    slogan: '',
    type: 'SAS',
    siren: '931826903',
    siret: '93182690300011',
    capital: '1000',
    tva: 'FR85931826903',
    dateClotureExercice: '',
    pays: 'France',
    email: 'contact@dcs-ramonage.fr',
    phone: '09 80 80 10 61',
    website: 'dcs-ramonage.fr',
    address: '58 RUE de Monceau',
    postalCode: '75008',
    city: 'Paris 8e Arrondissement',
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
      { id: 'ramonage', name: 'Ramonage / Entretien', tarif: 'À partir de 60€', tarifHT: 'À partir de 50€ HT', enabled: true, order: 0 },
      { id: 'debistrage', name: 'Débistrage', tarif: 'À partir de 90€', tarifHT: 'À partir de 75€ HT', enabled: true, order: 1 },
      { id: 'tubage', name: 'Tubage', tarif: 'Sur devis', tarifHT: 'Sur devis', enabled: true, order: 2 },
      { id: 'depannage', name: 'Dépannage', tarif: 'À partir de 90€', tarifHT: 'À partir de 75€ HT', enabled: true, order: 3 },
      { id: 'devis', name: 'Devis', tarif: 'Gratuit', tarifHT: 'Gratuit', enabled: true, order: 4 },
      { id: 'nettoyage', name: 'Démoussage / Nettoyage', tarif: 'Sur devis', tarifHT: 'Sur devis', enabled: false, order: 5 },
    ],
    equipments: [
      { id: 'gas_boiler', name: 'Chaudière gaz', tarif: '60€', tarifHT: '50€ HT', order: 0 },
      { id: 'chimney_open', name: 'Cheminée ouverte', tarif: '70€', tarifHT: '58€ HT', order: 1 },
      { id: 'chimney_insert', name: 'Insert', tarif: '70€', tarifHT: '58€ HT', order: 2 },
      { id: 'wood_stove', name: 'Poêle à bois', tarif: '80€', tarifHT: '67€ HT', order: 3 },
      { id: 'oil_boiler', name: 'Chaudière fioul', tarif: '80€', tarifHT: '67€ HT', order: 4 },
      { id: 'pellet_stove', name: 'Poêle à granulés', tarif: 'Dès 80€', tarifHT: 'Dès 67€ HT', order: 5 },
      { id: 'wood_boiler', name: 'Chaudière bois', tarif: '80€', tarifHT: '67€ HT', order: 6 },
      { id: 'polyflam', name: 'Cheminée Polyflam', tarif: '90€', tarifHT: '75€ HT', order: 7 },
      { id: 'conduit_difficile', name: 'Conduit difficile', tarif: '110€', tarifHT: '92€ HT', order: 8 },
    ],
    zones: [
      { id: 'zone_60', code: '60', name: 'Oise' },
      { id: 'zone_95', code: '95', name: 'Val-d\'Oise' },
    ],
    emailNotify: true,
    smsNotify: false,
    validationMode: 'manual',
    clientEmailConfirm: true,
    confirmMessage: 'Votre demande de rendez-vous a bien été enregistrée. Nous vous confirmerons le créneau dans les plus brefs délais.',
    widgetColor: '#f97316',
    showLogo: true,
    headerBadge: 'Réservation en ligne',
    headerTitle: 'Prenez rendez-vous',
    headerSubtitle: 'Choisissez votre créneau et nous vous recontactons pour confirmer.',
    enableClientTypeStep: true,
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

  // États pour les modales d'édition
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);
  const [editingZone, setEditingZone] = useState<ZoneItem | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);

  // États pour les paramètres du calendrier
  const [calendarSettings, setCalendarSettings] = useState({
    showEventTitle: true,
    maxEventsDisplay: 10,
    plageHoraireStart: '08:00',
    plageHoraireEnd: '17:00',
    workDays: {
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: true,
      dimanche: false,
    },
    showToPlanOnMobile: true,
    absencesEnabled: false,
    customStatuts: [] as { id: string; name: string; color: string }[],
  });
  const [showAddStatutModal, setShowAddStatutModal] = useState(false);
  const [newStatut, setNewStatut] = useState({ name: '', color: '#3b82f6' });

  // Sensors pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler pour le drag & drop des services
  const handleServiceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const services = [...rdvConfig.services].sort((a, b) => a.order - b.order);
      const oldIndex = services.findIndex(s => s.id === active.id);
      const newIndex = services.findIndex(s => s.id === over.id);
      const reordered = arrayMove(services, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
      setRdvConfig({ ...rdvConfig, services: reordered });
    }
  };

  // Handler pour le drag & drop des équipements
  const handleEquipmentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const equipments = [...rdvConfig.equipments].sort((a, b) => a.order - b.order);
      const oldIndex = equipments.findIndex(e => e.id === active.id);
      const newIndex = equipments.findIndex(e => e.id === over.id);
      const reordered = arrayMove(equipments, oldIndex, newIndex).map((e, i) => ({ ...e, order: i }));
      setRdvConfig({ ...rdvConfig, equipments: reordered });
    }
  };

  const toggleModule = (id: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const toggleService = (id: string) => {
    setRdvConfig({
      ...rdvConfig,
      services: rdvConfig.services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    });
  };

  // === CRUD Services ===
  const addService = (service: Omit<ServiceItem, 'id' | 'order'>) => {
    const newService: ServiceItem = {
      ...service,
      id: `service_${Date.now()}`,
      order: rdvConfig.services.length,
    };
    setRdvConfig({ ...rdvConfig, services: [...rdvConfig.services, newService] });
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setRdvConfig({
      ...rdvConfig,
      services: rdvConfig.services.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const deleteService = (id: string) => {
    setRdvConfig({
      ...rdvConfig,
      services: rdvConfig.services.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }))
    });
  };

  const moveService = (id: string, direction: 'up' | 'down') => {
    const services = [...rdvConfig.services].sort((a, b) => a.order - b.order);
    const index = services.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [services[index], services[newIndex]] = [services[newIndex], services[index]];
    setRdvConfig({
      ...rdvConfig,
      services: services.map((s, i) => ({ ...s, order: i }))
    });
  };

  // === CRUD Équipements ===
  const addEquipment = (equipment: Omit<EquipmentItem, 'id' | 'order'>) => {
    const newEquipment: EquipmentItem = {
      ...equipment,
      id: `equipment_${Date.now()}`,
      order: rdvConfig.equipments.length,
    };
    setRdvConfig({ ...rdvConfig, equipments: [...rdvConfig.equipments, newEquipment] });
  };

  const updateEquipment = (id: string, updates: Partial<EquipmentItem>) => {
    setRdvConfig({
      ...rdvConfig,
      equipments: rdvConfig.equipments.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const deleteEquipment = (id: string) => {
    setRdvConfig({
      ...rdvConfig,
      equipments: rdvConfig.equipments.filter(e => e.id !== id).map((e, i) => ({ ...e, order: i }))
    });
  };

  const moveEquipment = (id: string, direction: 'up' | 'down') => {
    const equipments = [...rdvConfig.equipments].sort((a, b) => a.order - b.order);
    const index = equipments.findIndex(e => e.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === equipments.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [equipments[index], equipments[newIndex]] = [equipments[newIndex], equipments[index]];
    setRdvConfig({
      ...rdvConfig,
      equipments: equipments.map((e, i) => ({ ...e, order: i }))
    });
  };

  // === CRUD Zones ===
  const addZone = (zone: Omit<ZoneItem, 'id'>) => {
    const newZone: ZoneItem = {
      ...zone,
      id: `zone_${Date.now()}`,
    };
    setRdvConfig({ ...rdvConfig, zones: [...rdvConfig.zones, newZone] });
  };

  const updateZone = (id: string, updates: Partial<ZoneItem>) => {
    setRdvConfig({
      ...rdvConfig,
      zones: rdvConfig.zones.map(z => z.id === id ? { ...z, ...updates } : z)
    });
  };

  const deleteZone = (id: string) => {
    setRdvConfig({
      ...rdvConfig,
      zones: rdvConfig.zones.filter(z => z.id !== id)
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
        <div className="flex gap-6">
          {/* Menu latéral Général */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-secondary-100 p-2">
              <button
                onClick={() => setGeneralSection('metiers')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  generalSection === 'metiers'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Métiers
              </button>
              <button
                onClick={() => setGeneralSection('details')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  generalSection === 'details'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <FileSearch className="w-4 h-4" />
                Détails
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Section Métiers */}
            {generalSection === 'metiers' && (
              <div className="flex flex-col gap-3" style={{ maxWidth: '800px' }}>
                <div className="mb-5">
                  <div className="mb-2">
                    <div className="flex flex-row flex-wrap justify-between gap-2 sm:gap-4 items-start">
                      <div className="flex flex-col flex-1">
                        <h2 className="text-xl font-semibold mb-1">Mes métiers</h2>
                        <span className="text-secondary-500">
                          Définissez les métiers exercés par votre entreprise pour adapter le logiciel à votre activité.
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        {!editingMetiers && (
                          <button
                            onClick={() => {
                              setTempMetiers([...selectedMetiers]);
                              setEditingMetiers(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-secondary-200 rounded-lg hover:bg-secondary-50 whitespace-nowrap"
                          >
                            <Pencil className="w-4 h-4" />
                            Modifier
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-secondary-200 mt-2 mb-4" />

                  {!editingMetiers ? (
                    // Mode lecture - Liste à puces
                    <div className="grid grid-cols-2 gap-x-8">
                      <ul className="list-disc list-inside text-secondary-900 space-y-1">
                        {selectedMetiers.slice(0, Math.ceil(selectedMetiers.length / 2)).map((metier) => (
                          <li key={metier}>{metier}</li>
                        ))}
                      </ul>
                      <ul className="list-disc list-inside text-secondary-900 space-y-1">
                        {selectedMetiers.slice(Math.ceil(selectedMetiers.length / 2)).map((metier) => (
                          <li key={metier}>{metier}</li>
                        ))}
                      </ul>
                      {selectedMetiers.length === 0 && (
                        <p className="text-secondary-400 italic col-span-2">Aucun métier sélectionné</p>
                      )}
                    </div>
                  ) : (
                    // Mode édition - Multi-select dropdown
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Mes métiers <span className="text-red-500">*</span>
                        </label>

                        {/* Input avec tags et dropdown intégré */}
                        <div className="relative" ref={metiersDropdownRef}>
                          <div
                            className="flex gap-2 p-2 border border-secondary-200 rounded-lg bg-white min-h-[44px] cursor-text"
                            onClick={() => setMetiersDropdownOpen(true)}
                          >
                            {/* Zone des tags - s'agrandit */}
                            <div className="flex-1 flex flex-wrap items-center gap-2">
                              {tempMetiers.map((metier) => (
                                <span
                                  key={metier}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded text-sm"
                                >
                                  {metier}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTempMetiers(prev => prev.filter(m => m !== metier));
                                    }}
                                    className="hover:text-secondary-900 ml-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            {/* Bloc icônes - s'étire verticalement, icônes centrées */}
                            <div className="flex items-center justify-center gap-2 text-secondary-400 self-stretch pl-2 border-l border-secondary-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTempMetiers([]);
                                }}
                                className="hover:text-secondary-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>

                          {metiersDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-secondary-200 rounded-lg shadow-lg z-10">
                              {METIERS_LIST.filter(m => !tempMetiers.includes(m)).map((metier) => (
                                <button
                                  key={metier}
                                  onClick={() => {
                                    setTempMetiers(prev => [...prev, metier]);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 hover:text-primary-700"
                                >
                                  {metier}
                                </button>
                              ))}
                              {METIERS_LIST.filter(m => !tempMetiers.includes(m)).length === 0 && (
                                <p className="px-3 py-2 text-sm text-secondary-400">Tous les métiers sont sélectionnés</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditingMetiers(false);
                            setMetiersDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMetiers([...tempMetiers]);
                            setEditingMetiers(false);
                            setMetiersDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          <Check className="w-4 h-4" />
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Détails */}
            {generalSection === 'details' && (
              <div className="space-y-6" style={{ maxWidth: '800px' }}>
                {/* Bloc Informations */}
                <div className="bg-white rounded-xl border border-secondary-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Informations</h2>
                    {!editingInfos ? (
                      <button
                        onClick={() => setEditingInfos(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-secondary-200 rounded-lg hover:bg-secondary-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingInfos(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-secondary-200 rounded-lg hover:bg-secondary-50"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                        <button
                          onClick={() => setEditingInfos(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          <Check className="w-4 h-4" />
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingInfos ? (
                    // Mode lecture
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-secondary-500">Type d'entreprise</p>
                        <p className="font-medium">{entreprise.type || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Entreprise</p>
                        <p className="font-medium">{entreprise.name || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-secondary-500">Slogan / Description</p>
                        <p className="font-medium">{entreprise.slogan || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Siren</p>
                        <p className="font-medium">{entreprise.siren || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">SIRET</p>
                        <p className="font-medium">{entreprise.siret || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Capital</p>
                        <p className="font-medium">{entreprise.capital ? `${entreprise.capital} €` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Numéro de TVA intracommunautaire</p>
                        <p className="font-medium">{entreprise.tva || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Date de clôture d'exercice comptable</p>
                        <p className="font-medium">{entreprise.dateClotureExercice || 'Non renseignée'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Pays</p>
                        <p className="font-medium flex items-center gap-2">
                          {entreprise.pays === 'France' && <Flag className="w-4 h-4 text-blue-600" />}
                          {entreprise.pays || '-'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Mode édition
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Type d'entreprise</label>
                        <select
                          value={entreprise.type}
                          onChange={(e) => setEntreprise({...entreprise, type: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        >
                          <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                          <option value="SAS">SAS</option>
                          <option value="SARL">SARL</option>
                          <option value="EURL">EURL</option>
                          <option value="SA">SA</option>
                          <option value="SCI">SCI</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Entreprise</label>
                        <input
                          type="text"
                          value={entreprise.name}
                          onChange={(e) => setEntreprise({...entreprise, name: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Slogan / Description</label>
                        <input
                          type="text"
                          value={entreprise.slogan}
                          onChange={(e) => setEntreprise({...entreprise, slogan: e.target.value})}
                          placeholder="Ex: Votre expert en ramonage depuis 2010"
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Siren</label>
                        <input
                          type="text"
                          value={entreprise.siren}
                          onChange={(e) => setEntreprise({...entreprise, siren: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">SIRET</label>
                        <input
                          type="text"
                          value={entreprise.siret}
                          onChange={(e) => setEntreprise({...entreprise, siret: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Capital (€)</label>
                        <input
                          type="text"
                          value={entreprise.capital}
                          onChange={(e) => setEntreprise({...entreprise, capital: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">N° TVA intracommunautaire</label>
                        <input
                          type="text"
                          value={entreprise.tva}
                          onChange={(e) => setEntreprise({...entreprise, tva: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Date de clôture d'exercice</label>
                        <input
                          type="date"
                          value={entreprise.dateClotureExercice}
                          onChange={(e) => setEntreprise({...entreprise, dateClotureExercice: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Pays</label>
                        <select
                          value={entreprise.pays}
                          onChange={(e) => setEntreprise({...entreprise, pays: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Luxembourg">Luxembourg</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bloc Coordonnées */}
                <div className="bg-white rounded-xl border border-secondary-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Coordonnées</h2>
                    {!editingCoordonnees ? (
                      <button
                        onClick={() => setEditingCoordonnees(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-secondary-200 rounded-lg hover:bg-secondary-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCoordonnees(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-secondary-200 rounded-lg hover:bg-secondary-50"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                        <button
                          onClick={() => setEditingCoordonnees(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          <Check className="w-4 h-4" />
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingCoordonnees ? (
                    // Mode lecture
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="md:col-span-2">
                        <p className="text-sm text-secondary-500">Adresse</p>
                        <p className="font-medium">{entreprise.address || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Code postal</p>
                        <p className="font-medium">{entreprise.postalCode || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Ville</p>
                        <p className="font-medium">{entreprise.city || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Email</p>
                        <p className="font-medium">{entreprise.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">Téléphone</p>
                        <p className="font-medium">{entreprise.phone || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-secondary-500">Site WEB</p>
                        <p className="font-medium">{entreprise.website || '-'}</p>
                      </div>
                    </div>
                  ) : (
                    // Mode édition
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Adresse</label>
                        <input
                          type="text"
                          value={entreprise.address}
                          onChange={(e) => setEntreprise({...entreprise, address: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Code postal</label>
                        <input
                          type="text"
                          value={entreprise.postalCode}
                          onChange={(e) => setEntreprise({...entreprise, postalCode: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Ville</label>
                        <input
                          type="text"
                          value={entreprise.city}
                          onChange={(e) => setEntreprise({...entreprise, city: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={entreprise.email}
                          onChange={(e) => setEntreprise({...entreprise, email: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          value={entreprise.phone}
                          onChange={(e) => setEntreprise({...entreprise, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Site WEB</label>
                        <input
                          type="text"
                          value={entreprise.website}
                          onChange={(e) => setEntreprise({...entreprise, website: e.target.value})}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
              <div className="flex gap-6">
                {/* Colonne de gauche - Paramètres */}
                <div className="flex-1 space-y-6" style={{ maxWidth: '600px' }}>
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">Présentation</h2>
                      <button className="text-secondary-400 hover:text-secondary-600">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-secondary-500">Personnalisez vos documents pour les adapter à votre entreprise.</p>
                  </div>

                  {/* Couleur du document */}
                  <div className="border-t border-secondary-100 pt-6">
                    <h3 className="font-medium mb-1">Couleur du document</h3>
                    <p className="text-sm text-secondary-500 mb-3">Sélectionner la couleur des titres du document.</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border border-secondary-200 rounded-lg p-1">
                        <button className="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style={{ backgroundColor: documentColor }}>A</button>
                        <input
                          type="color"
                          value={documentColor}
                          onChange={(e) => setDocumentColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                      </div>
                      <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        <Pencil className="w-3 h-3" />
                        Appliquer à tout le document
                      </button>
                    </div>
                  </div>

                  {/* Style du document */}
                  <div className="border-t border-secondary-100 pt-6">
                    <h3 className="font-medium mb-1">Style du document</h3>
                    <p className="text-sm text-secondary-500 mb-3">Donnez un style plus moderne en choisissant un type d'arrondi pour les bordures de vos tableaux.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDocumentStyle('classique')}
                        className={`px-6 py-2 rounded-lg border text-sm font-medium ${
                          documentStyle === 'classique'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-200 hover:bg-secondary-50'
                        }`}
                      >
                        Classique
                      </button>
                      <button
                        onClick={() => setDocumentStyle('moderne')}
                        className={`px-6 py-2 rounded-lg border text-sm font-medium ${
                          documentStyle === 'moderne'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-200 hover:bg-secondary-50'
                        }`}
                      >
                        Moderne
                      </button>
                    </div>
                  </div>

                  {/* Format téléphone */}
                  <div className="border-t border-secondary-100 pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={phoneInternational}
                        onChange={(e) => setPhoneInternational(e.target.checked)}
                        className="mt-1 rounded border-secondary-300"
                      />
                      <div>
                        <span className="font-medium">Numéros de téléphone au format international</span>
                        <p className="text-sm text-secondary-500">Affiche les numéros de téléphone au format international.</p>
                      </div>
                    </label>
                  </div>

                  {/* Accordéons */}
                  <div className="border-t border-secondary-100 pt-6 space-y-0">
                    {[
                      { key: 'entreprise', label: 'Entreprise' },
                      { key: 'client', label: 'Client' },
                      { key: 'tableaux', label: 'Tableaux' },
                      { key: 'operations', label: 'Opérations' },
                      { key: 'paiements', label: 'Paiements' },
                      { key: 'piedPage', label: 'Pied de page' },
                      { key: 'mentions', label: 'Mentions' },
                      { key: 'cgv', label: 'CGV et filigrane' },
                      { key: 'automatisations', label: 'Automatisations' },
                    ].map((section) => (
                      <div key={section.key} className="border-b border-secondary-100">
                        <button
                          onClick={() => togglePresentationSection(section.key)}
                          className="w-full flex items-center justify-between py-4 text-left"
                        >
                          <span className="font-medium">{section.label}</span>
                          <ChevronDown className={`w-5 h-5 text-secondary-400 transition-transform ${presentationSections[section.key] ? 'rotate-180' : ''}`} />
                        </button>
                        {presentationSections[section.key] && (
                          <div className="pb-4 text-sm text-secondary-500">
                            Options de configuration pour {section.label.toLowerCase()}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Création d'articles */}
                  <div className="border-t border-secondary-100 pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoCreateArticles}
                        onChange={(e) => setAutoCreateArticles(e.target.checked)}
                        className="mt-1 rounded border-secondary-300"
                      />
                      <div>
                        <span className="font-medium">Création d'articles</span>
                        <p className="text-sm text-secondary-500">Lors de la saisie manuelle d'une ligne dans un devis / facture, un article est automatiquement créé au sein de la bibliothèque dans le catalogue « Autres ».</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Colonne de droite - Aperçu */}
                <div className="w-96 flex-shrink-0">
                  <div className="sticky top-4">
                    {/* Toolbar aperçu */}
                    <div className="flex items-center justify-center gap-1 mb-4 text-secondary-400">
                      <button className="p-1.5 hover:bg-secondary-100 rounded">−</button>
                      <button className="p-1.5 hover:bg-secondary-100 rounded">+</button>
                      <button className="p-1.5 hover:bg-secondary-100 rounded">↕</button>
                      <button className="p-1.5 hover:bg-secondary-100 rounded">↔</button>
                      <button className="p-1.5 hover:bg-secondary-100 rounded"><Download className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-secondary-100 rounded">🖨</button>
                    </div>

                    {/* Aperçu de la facture */}
                    <div className="bg-white border border-secondary-200 rounded-lg shadow-sm p-6 text-xs">
                      <div className="flex justify-between mb-6">
                        <div>
                          <div className="w-20 h-12 bg-secondary-100 rounded flex items-center justify-center text-secondary-400 text-[8px]">
                            DCS RAMONAGE
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm" style={{ color: documentColor }}>Facture F0000</p>
                          <p className="text-secondary-500">Date émission : 10/01/2026</p>
                          <p className="text-secondary-500">Date échéance : 10/01/2026</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-semibold" style={{ color: documentColor }}>Dcs Ramonage Oise & Val d'Oise</p>
                        <p className="text-secondary-600">58 RUE de Monceau</p>
                        <p className="text-secondary-600">75008 Paris 8e Arrondissement</p>
                        <p className="text-secondary-600">contact@dcs-ramonage.fr</p>
                        <p className="text-secondary-600">09 80 80 10 61</p>
                      </div>

                      <div className="border border-secondary-200 rounded p-2 mb-4">
                        <p className="font-semibold text-secondary-700">Client</p>
                        <p className="text-secondary-600">Hedi Maronier</p>
                        <p className="text-secondary-600">6 rue d'Armaillé</p>
                        <p className="text-secondary-600">75017 Paris</p>
                      </div>

                      <p className="text-secondary-500 mb-2">N° de bon de commande : XXXXXXZZZ</p>

                      <p className="font-semibold mb-2" style={{ color: documentColor }}>Installation climatisation</p>

                      <table className="w-full text-[8px] border-collapse mb-4">
                        <thead>
                          <tr className="bg-secondary-100">
                            <th className="border border-secondary-200 p-1 text-left">Désignation</th>
                            <th className="border border-secondary-200 p-1">Qté</th>
                            <th className="border border-secondary-200 p-1">Prix U.HT</th>
                            <th className="border border-secondary-200 p-1">TVA</th>
                            <th className="border border-secondary-200 p-1">Total HT</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-secondary-200 p-1">Installation climatisation</td>
                            <td className="border border-secondary-200 p-1 text-center">1</td>
                            <td className="border border-secondary-200 p-1 text-right">120,00€</td>
                            <td className="border border-secondary-200 p-1 text-center">10%</td>
                            <td className="border border-secondary-200 p-1 text-right">600,00€</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="text-right">
                        <p className="text-secondary-600">Sous-total : 600,00 €</p>
                        <p className="font-bold">Total TTC : 660,00 €</p>
                      </div>
                    </div>
                  </div>
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
              <div className="space-y-6" style={{ maxWidth: '800px' }}>
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">Numérotation</h2>
                    <button className="text-secondary-400 hover:text-secondary-600">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-secondary-500">Configurez le format des prochains numéros de vos documents.</p>
                </div>

                {/* Devis */}
                <div className="border-t border-secondary-100 pt-6">
                  <h3 className="font-semibold mb-3">Devis</h3>
                  <p className="text-secondary-700 mb-3">
                    Le prochain numéro sera le <span className="font-semibold">{numerotation.devis.prefix}{numerotation.devis.nextNumber}</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setTempFormat(numerotation.devis);
                        setFormatModalOpen('devis');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Modifier le format
                    </button>
                    <button
                      onClick={() => {
                        setTempNextNumber(numerotation.devis.nextNumber);
                        setNumberModalOpen('devis');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Modifier le prochain numéro
                    </button>
                  </div>
                </div>

                {/* Factures */}
                <div className="border-t border-secondary-100 pt-6">
                  <h3 className="font-semibold mb-3">Factures</h3>
                  <p className="text-secondary-700 mb-3">
                    Le prochain numéro sera le <span className="font-semibold">{numerotation.factures.prefix}{numerotation.factures.nextNumber}</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setTempFormat(numerotation.factures);
                        setFormatModalOpen('factures');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Modifier le format
                    </button>
                    <button
                      onClick={() => {
                        setTempNextNumber(numerotation.factures.nextNumber);
                        setNumberModalOpen('factures');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Modifier le prochain numéro
                    </button>
                  </div>
                </div>

                {/* Avoirs */}
                <div className="border-t border-secondary-100 pt-6">
                  <h3 className="font-semibold mb-3">Avoirs</h3>
                  <p className="text-secondary-700 mb-3">
                    Le prochain numéro sera le <span className="font-semibold">{numerotation.avoirs.prefix}{numerotation.avoirs.nextNumber}</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setTempFormat(numerotation.avoirs);
                        setFormatModalOpen('avoirs');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Modifier le format
                    </button>
                    <button
                      onClick={() => {
                        setTempNextNumber(numerotation.avoirs.nextNumber);
                        setNumberModalOpen('avoirs');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      Modifier le prochain numéro
                    </button>
                  </div>
                </div>

                {/* Modal Format */}
                {formatModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setFormatModalOpen(null)} />
                    <div className="bg-white rounded-xl w-full max-w-lg relative z-10">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Hash className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Format de la numérotation</h3>
                            <p className="text-sm text-secondary-500">Configurer le format de la numérotation :</p>
                          </div>
                        </div>

                        <div className="space-y-4 mt-6">
                          {/* Préfixe */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Préfixe <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={tempFormat.prefix}
                              onChange={(e) => setTempFormat({ ...tempFormat, prefix: e.target.value })}
                              className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                            />
                          </div>

                          {/* Année */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Année</label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: '', label: 'Non' },
                                { value: 'YYYY', label: 'Année (4 chiffres)' },
                                { value: 'YY', label: 'Année (2 chiffres)' },
                                { value: 'YYYYMM', label: 'Année (4 chiffres) et Mois' },
                                { value: 'YYMM', label: 'Année (2 chiffres) et Mois' },
                              ].map((option) => (
                                <label
                                  key={option.value}
                                  className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
                                    tempFormat.year === option.value
                                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                                      : 'border-secondary-200 hover:bg-secondary-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="year"
                                    value={option.value}
                                    checked={tempFormat.year === option.value}
                                    onChange={(e) => setTempFormat({ ...tempFormat, year: e.target.value })}
                                    className="sr-only"
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Séparateur */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Séparateur</label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: '', label: 'Aucun' },
                                { value: '-', label: 'Tiret (-)' },
                              ].map((option) => (
                                <label
                                  key={option.value}
                                  className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
                                    tempFormat.separator === option.value
                                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                                      : 'border-secondary-200 hover:bg-secondary-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="separator"
                                    value={option.value}
                                    checked={tempFormat.separator === option.value}
                                    onChange={(e) => setTempFormat({ ...tempFormat, separator: e.target.value })}
                                    className="sr-only"
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Longueur */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Longueur du numéro</label>
                            <div className="flex flex-wrap gap-2">
                              {['3', '4', '5', '6', '7', '8'].map((len) => (
                                <label
                                  key={len}
                                  className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
                                    tempFormat.numberLength === len
                                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                                      : 'border-secondary-200 hover:bg-secondary-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="numberLength"
                                    value={len}
                                    checked={tempFormat.numberLength === len}
                                    onChange={(e) => setTempFormat({ ...tempFormat, numberLength: e.target.value })}
                                    className="sr-only"
                                  />
                                  {len}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Aperçu */}
                          <div className="bg-secondary-50 rounded-lg p-3">
                            <p className="text-sm">
                              Le format de numérotation sera : <span className="font-semibold">{getFormatPreview(tempFormat)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setFormatModalOpen(null)}
                            className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              if (formatModalOpen) {
                                setNumerotation({
                                  ...numerotation,
                                  [formatModalOpen]: { ...numerotation[formatModalOpen], ...tempFormat }
                                });
                              }
                              setFormatModalOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                          >
                            <Check className="w-4 h-4" />
                            Je confirme
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Numéro */}
                {numberModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setNumberModalOpen(null)} />
                    <div className="bg-white rounded-xl w-full max-w-md relative z-10">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Hash className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Modifier le prochain numéro</h3>
                            <p className="text-sm text-secondary-500">Définir le prochain numéro de la séquence</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">
                            Prochain numéro <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={tempNextNumber}
                            onChange={(e) => setTempNextNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setNumberModalOpen(null)}
                            className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              if (numberModalOpen) {
                                setNumerotation({
                                  ...numerotation,
                                  [numberModalOpen]: { ...numerotation[numberModalOpen], nextNumber: tempNextNumber }
                                });
                              }
                              setNumberModalOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                          >
                            <Check className="w-4 h-4" />
                            Je confirme
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {settingsSection === 'calendrier' && (
              <div className="space-y-6">
                {/* Section Calendrier */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-secondary-500" />
                    <h2 className="text-xl font-semibold">Calendrier</h2>
                  </div>
                  <p className="text-secondary-500 text-sm mb-4">Adaptez votre calendrier à votre activité.</p>

                  <div className="bg-white border border-secondary-100 rounded-xl p-6 space-y-6">
                    {/* Afficher le titre de l'événement */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="showEventTitle"
                        checked={calendarSettings.showEventTitle}
                        onChange={(e) => setCalendarSettings({ ...calendarSettings, showEventTitle: e.target.checked })}
                        className="mt-1 rounded"
                      />
                      <div>
                        <label htmlFor="showEventTitle" className="font-medium">Afficher le titre de l&apos;événement</label>
                        <p className="text-sm text-secondary-500">En activant cette option, le titre de l&apos;événement sera affiché dans le calendrier à la place du nom du client.</p>
                      </div>
                    </div>

                    {/* Nombre d'événements à afficher */}
                    <div>
                      <label className="block font-medium mb-1">Nombre d&apos;événements à afficher</label>
                      <p className="text-sm text-secondary-500 mb-2">Vous réalisez un nombre important d&apos;interventions par jour ? Augmentez le nombre d&apos;événements à afficher pour ne rien manquer.</p>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={calendarSettings.maxEventsDisplay}
                        onChange={(e) => setCalendarSettings({ ...calendarSettings, maxEventsDisplay: parseInt(e.target.value) || 10 })}
                        className="w-24 px-3 py-2 border border-secondary-200 rounded-lg"
                      />
                    </div>

                    {/* Plage horaire */}
                    <div>
                      <label className="block font-medium mb-1">Plage horaire</label>
                      <p className="text-sm text-secondary-500 mb-2">Définissez la plage horaire à afficher dans les calendriers en vous basant sur les horaires de travail de votre entreprise.</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">De</span>
                        <input
                          type="time"
                          value={calendarSettings.plageHoraireStart}
                          onChange={(e) => setCalendarSettings({ ...calendarSettings, plageHoraireStart: e.target.value })}
                          className="px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                        <span className="text-sm">à</span>
                        <input
                          type="time"
                          value={calendarSettings.plageHoraireEnd}
                          onChange={(e) => setCalendarSettings({ ...calendarSettings, plageHoraireEnd: e.target.value })}
                          className="px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {Object.entries(calendarSettings.workDays).map(([day, enabled]) => (
                          <label key={day} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setCalendarSettings({
                                ...calendarSettings,
                                workDays: { ...calendarSettings.workDays, [day]: e.target.checked }
                              })}
                              className="rounded"
                            />
                            <span className="text-sm capitalize">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Interventions à planifier */}
                <div>
                  <h3 className="font-semibold mb-2">Interventions à planifier</h3>
                  <p className="text-secondary-500 text-sm mb-4">Vous souhaitez plus de souplesse dans la planification des interventions ? Laissez les techniciens choisir des interventions à réaliser parmi celles qui ne sont pas encore planifiées.</p>

                  <div className="bg-white border border-secondary-100 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="showToPlanOnMobile"
                        checked={calendarSettings.showToPlanOnMobile}
                        onChange={(e) => setCalendarSettings({ ...calendarSettings, showToPlanOnMobile: e.target.checked })}
                        className="mt-1 rounded"
                      />
                      <div>
                        <label htmlFor="showToPlanOnMobile" className="font-medium">Afficher les interventions à planifier sur l&apos;application Terrain</label>
                        <p className="text-sm text-secondary-500">En activant cette fonctionnalité, les interventions à planifier sont listées dans l&apos;onglet <span className="font-medium">Calendrier &gt; À planifier</span> de l&apos;application mobile. Les <span className="font-medium">techniciens</span> ont accès uniquement aux interventions qui leurs sont affectées. Les <span className="font-medium">techniciens +</span> ont accès à toute les interventions à planifier.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Statuts de traitement */}
                <div>
                  <h3 className="font-semibold mb-2">Statuts de traitement</h3>
                  <p className="text-secondary-500 text-sm mb-4">Vous souhaitez bénéficier de statuts supplémentaires sur vos interventions ? Ajoutez de nouveaux statuts de traitement.</p>

                  <div className="bg-white border border-secondary-100 rounded-xl p-6">
                    {calendarSettings.customStatuts.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {calendarSettings.customStatuts.map((statut) => (
                          <div key={statut.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: statut.color }} />
                              <span>{statut.name}</span>
                            </div>
                            <button
                              onClick={() => setCalendarSettings({
                                ...calendarSettings,
                                customStatuts: calendarSettings.customStatuts.filter(s => s.id !== statut.id)
                              })}
                              className="text-secondary-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setShowAddStatutModal(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg text-sm hover:bg-secondary-50"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un statut
                    </button>
                  </div>
                </div>

                {/* Section Absences */}
                <div>
                  <h3 className="font-semibold mb-2">Absences</h3>
                  <p className="text-secondary-500 text-sm mb-4">Gérez les absences de vos collaborateurs en toute simplicité et retrouvez-les directement dans votre calendrier.</p>

                  <div className="bg-white border border-secondary-100 rounded-xl p-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={calendarSettings.absencesEnabled}
                        onChange={(e) => setCalendarSettings({ ...calendarSettings, absencesEnabled: e.target.checked })}
                        className="rounded"
                      />
                      <span className="font-medium">Absences</span>
                    </label>
                  </div>
                </div>

                {/* Modal Ajouter statut */}
                {showAddStatutModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddStatutModal(false)} />
                    <div className="bg-white rounded-xl w-full max-w-md relative z-10 p-6">
                      <h3 className="text-lg font-semibold mb-4">Ajouter un statut</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nom du statut</label>
                          <input
                            type="text"
                            value={newStatut.name}
                            onChange={(e) => setNewStatut({ ...newStatut, name: e.target.value })}
                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                            placeholder="Ex: En cours de traitement"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Couleur</label>
                          <input
                            type="color"
                            value={newStatut.color}
                            onChange={(e) => setNewStatut({ ...newStatut, color: e.target.value })}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          onClick={() => setShowAddStatutModal(false)}
                          className="px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50 rounded-lg"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => {
                            if (newStatut.name.trim()) {
                              setCalendarSettings({
                                ...calendarSettings,
                                customStatuts: [...calendarSettings.customStatuts, { ...newStatut, id: `statut_${Date.now()}` }]
                              });
                              setNewStatut({ name: '', color: '#3b82f6' });
                              setShowAddStatutModal(false);
                            }
                          }}
                          className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
        <div className="flex gap-6">
          {/* Colonne principale */}
          <div className="flex-1 space-y-6">
            {/* Bannière upgrade */}
            <div className="bg-white rounded-xl border border-secondary-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <p className="font-semibold">Envie de plus ?</p>
                  <p className="text-secondary-500 text-sm">Profitez de plus de fonctionnalités en passant sur un plan supérieur.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 whitespace-nowrap">
                <span>→</span>
                Je passe à un plan supérieur
              </button>
            </div>

            {/* Mes factures */}
            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <h2 className="font-semibold mb-4">Mes factures</h2>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-secondary-600">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-secondary-600">Numéro</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-secondary-600">Statut</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-secondary-600">Montant</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-secondary-50">
                    <td className="py-3 px-2 text-sm">03/01/2026</td>
                    <td className="py-3 px-2 text-sm">S2026010103</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Payée <Check className="w-3 h-3" />
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm">24.00 €</td>
                    <td className="py-3 px-2">
                      <button className="p-1 hover:bg-secondary-100 rounded">
                        <Download className="w-4 h-4 text-secondary-400" />
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-secondary-50">
                    <td className="py-3 px-2 text-sm">03/12/2025</td>
                    <td className="py-3 px-2 text-sm">S2025120093</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Payée <Check className="w-3 h-3" />
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm">24.00 €</td>
                    <td className="py-3 px-2">
                      <button className="p-1 hover:bg-secondary-100 rounded">
                        <Download className="w-4 h-4 text-secondary-400" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 mt-4 text-sm text-secondary-500">
                <span>Page 1 sur 1</span>
                <div className="flex gap-1">
                  <button className="p-1 border border-secondary-200 rounded hover:bg-secondary-50 disabled:opacity-50" disabled>«</button>
                  <button className="p-1 border border-secondary-200 rounded hover:bg-secondary-50 disabled:opacity-50" disabled>‹</button>
                  <button className="p-1 border border-secondary-200 rounded hover:bg-secondary-50 disabled:opacity-50" disabled>›</button>
                  <button className="p-1 border border-secondary-200 rounded hover:bg-secondary-50 disabled:opacity-50" disabled>»</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar droite - Mon abonnement */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-semibold">Mon abonnement</h2>
                <button className="text-secondary-400 hover:text-secondary-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-secondary-500 mb-1">Plan</p>
                  <p className="font-medium">DCS Solo 🏆 (mensuel)</p>
                </div>

                <div>
                  <p className="text-sm text-secondary-500 mb-1">Prix mensuel</p>
                  <p className="font-medium">20.00 € HT / utilisateur</p>
                </div>

                <div>
                  <p className="text-sm text-secondary-500 mb-1">Nombre de licences</p>
                  <p className="font-medium">1</p>
                </div>

                <div>
                  <p className="text-sm text-secondary-500 mb-1">Crédits</p>
                  <p className="font-medium">0.00 €</p>
                </div>

                <div>
                  <p className="text-sm text-secondary-500 mb-1">Prochaine échéance</p>
                  <p className="font-medium">03/02/2026</p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-secondary-500 mb-1">Méthode de paiement</p>
                    <button className="text-secondary-400 hover:text-secondary-600">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-medium">**** **** **** 0874 9/2028</p>
                </div>
              </div>
            </div>
          </div>
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
                <div className="space-y-8">
                  {/* === SERVICES PROPOSÉS === */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Services proposés</h3>
                        <p className="text-sm text-secondary-500">Gérez les prestations disponibles à la réservation</p>
                      </div>
                      <button
                        onClick={() => { setEditingService(null); setShowServiceModal(true); }}
                        className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </button>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleServiceDragEnd}
                    >
                      <SortableContext
                        items={[...rdvConfig.services].sort((a, b) => a.order - b.order).map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {[...rdvConfig.services].sort((a, b) => a.order - b.order).map((service) => (
                            <SortableServiceItem
                              key={service.id}
                              service={service}
                              onToggle={() => toggleService(service.id)}
                              onEdit={() => { setEditingService(service); setShowServiceModal(true); }}
                              onDelete={() => { if (confirm('Supprimer ce service ?')) deleteService(service.id); }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

                  {/* === ÉQUIPEMENTS === */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Équipements</h3>
                        <p className="text-sm text-secondary-500">Types d'équipements avec leurs tarifs</p>
                      </div>
                      <button
                        onClick={() => { setEditingEquipment(null); setShowEquipmentModal(true); }}
                        className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </button>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleEquipmentDragEnd}
                    >
                      <SortableContext
                        items={[...rdvConfig.equipments].sort((a, b) => a.order - b.order).map(e => e.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[...rdvConfig.equipments].sort((a, b) => a.order - b.order).map((equipment) => (
                            <SortableEquipmentItem
                              key={equipment.id}
                              equipment={equipment}
                              onEdit={() => { setEditingEquipment(equipment); setShowEquipmentModal(true); }}
                              onDelete={() => { if (confirm('Supprimer cet équipement ?')) deleteEquipment(equipment.id); }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

                  {/* === ZONES D'INTERVENTION === */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Zones d'intervention</h3>
                        <p className="text-sm text-secondary-500">Départements où vous intervenez</p>
                      </div>
                      <button
                        onClick={() => { setEditingZone(null); setShowZoneModal(true); }}
                        className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rdvConfig.zones.map(zone => (
                        <div
                          key={zone.id}
                          className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg group"
                        >
                          <span className="font-medium text-primary-700">{zone.name} ({zone.code})</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingZone(zone); setShowZoneModal(true); }}
                              className="p-1 text-primary-400 hover:text-primary-600 rounded"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { if (confirm('Supprimer cette zone ?')) deleteZone(zone.id); }}
                              className="p-1 text-primary-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
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

                  {/* Options avancées */}
                  <div>
                    <h3 className="font-semibold mb-3">Options avancées</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div>
                          <p className="font-medium">Étape type de client</p>
                          <p className="text-sm text-secondary-500">Demander si le client est Particulier, Professionnel ou Syndic</p>
                        </div>
                        <button
                          onClick={() => setRdvConfig({ ...rdvConfig, enableClientTypeStep: !rdvConfig.enableClientTypeStep })}
                          className={`w-10 h-6 rounded-full transition-colors ${rdvConfig.enableClientTypeStep ? 'bg-primary-500' : 'bg-secondary-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${rdvConfig.enableClientTypeStep ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Textes du header */}
                  <div>
                    <h3 className="font-semibold mb-3">Textes du header</h3>
                    <p className="text-sm text-secondary-500 mb-4">Personnalisez les textes affichés en haut du widget de réservation</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Badge</label>
                        <input
                          type="text"
                          value={rdvConfig.headerBadge}
                          onChange={(e) => setRdvConfig({ ...rdvConfig, headerBadge: e.target.value })}
                          placeholder="Ex: Réservation en ligne"
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <input
                          type="text"
                          value={rdvConfig.headerTitle}
                          onChange={(e) => setRdvConfig({ ...rdvConfig, headerTitle: e.target.value })}
                          placeholder="Ex: Prenez rendez-vous"
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sous-titre</label>
                        <textarea
                          value={rdvConfig.headerSubtitle}
                          onChange={(e) => setRdvConfig({ ...rdvConfig, headerSubtitle: e.target.value })}
                          placeholder="Ex: Choisissez votre créneau et nous vous recontactons pour confirmer."
                          rows={2}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                        />
                      </div>
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

      {/* Modal Service */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowServiceModal(false)} />
          <div className="bg-white rounded-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <h3 className="font-semibold">{editingService ? 'Modifier le service' : 'Ajouter un service'}</h3>
              <button onClick={() => setShowServiceModal(false)} className="p-1 hover:bg-secondary-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const tarif = formData.get('tarif') as string;
                const tarifHT = formData.get('tarifHT') as string;
                if (editingService) {
                  updateService(editingService.id, { name, tarif, tarifHT });
                } else {
                  addService({ name, tarif, tarifHT, enabled: true });
                }
                setShowServiceModal(false);
              }}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Nom du service *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingService?.name || ''}
                  placeholder="Ex: Ramonage / Entretien"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Tarif TTC *</label>
                  <input
                    type="text"
                    name="tarif"
                    required
                    defaultValue={editingService?.tarif || ''}
                    placeholder="Ex: À partir de 60€"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tarif HT (Pro)</label>
                  <input
                    type="text"
                    name="tarifHT"
                    defaultValue={editingService?.tarifHT || ''}
                    placeholder="Ex: À partir de 50€ HT"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                  />
                </div>
              </div>
              <p className="text-xs text-secondary-500">Format: "À partir de X€", "Sur devis", "Gratuit", etc.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowServiceModal(false)} className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  {editingService ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Équipement */}
      {showEquipmentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEquipmentModal(false)} />
          <div className="bg-white rounded-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <h3 className="font-semibold">{editingEquipment ? 'Modifier l\'équipement' : 'Ajouter un équipement'}</h3>
              <button onClick={() => setShowEquipmentModal(false)} className="p-1 hover:bg-secondary-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const tarif = formData.get('tarif') as string;
                const tarifHT = formData.get('tarifHT') as string;
                if (editingEquipment) {
                  updateEquipment(editingEquipment.id, { name, tarif, tarifHT });
                } else {
                  addEquipment({ name, tarif, tarifHT });
                }
                setShowEquipmentModal(false);
              }}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Nom de l'équipement *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingEquipment?.name || ''}
                  placeholder="Ex: Poêle à bois"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Tarif TTC *</label>
                  <input
                    type="text"
                    name="tarif"
                    required
                    defaultValue={editingEquipment?.tarif || ''}
                    placeholder="Ex: 80€"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tarif HT (Pro)</label>
                  <input
                    type="text"
                    name="tarifHT"
                    defaultValue={editingEquipment?.tarifHT || ''}
                    placeholder="Ex: 67€ HT"
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                  />
                </div>
              </div>
              <p className="text-xs text-secondary-500">Format: "80€", "Dès 80€", etc.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEquipmentModal(false)} className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  {editingEquipment ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Zone */}
      {showZoneModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowZoneModal(false)} />
          <div className="bg-white rounded-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <h3 className="font-semibold">{editingZone ? 'Modifier la zone' : 'Ajouter une zone'}</h3>
              <button onClick={() => setShowZoneModal(false)} className="p-1 hover:bg-secondary-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const code = formData.get('code') as string;
                const name = formData.get('name') as string;
                if (editingZone) {
                  updateZone(editingZone.id, { code, name });
                } else {
                  addZone({ code, name });
                }
                setShowZoneModal(false);
              }}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Code département *</label>
                <input
                  type="text"
                  name="code"
                  required
                  maxLength={3}
                  defaultValue={editingZone?.code || ''}
                  placeholder="Ex: 60"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom du département *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingZone?.name || ''}
                  placeholder="Ex: Oise"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowZoneModal(false)} className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  {editingZone ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
