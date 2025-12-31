'use client';

import { useState } from 'react';
import { 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
  Eye,
  X
} from 'lucide-react';

interface BookingRequest {
  id: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  serviceType: string;
  equipmentType?: string;
  message?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = {
  'RAMONAGE': 'Ramonage',
  'ENTRETIEN': 'Entretien poêle',
  'DEBISTRAGE': 'Débistrage',
  'TUBAGE': 'Tubage',
  'DIAGNOSTIC': 'Diagnostic',
  'FUMISTERIE': 'Fumisterie',
  'DEPANNAGE': 'Dépannage',
  'OTHER': 'Autre',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  'CHIMNEY_OPEN': 'Cheminée ouverte',
  'CHIMNEY_INSERT': 'Insert',
  'WOOD_STOVE': 'Poêle à bois',
  'PELLET_STOVE': 'Poêle à granulés',
  'OIL_BOILER': 'Chaudière fioul',
  'GAS_BOILER': 'Chaudière gaz',
  'WOOD_BOILER': 'Chaudière bois',
  'OTHER': 'Autre',
};

const STATUS_CONFIG = {
  PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  CONFIRMED: { label: 'Confirmé', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  REJECTED: { label: 'Refusé', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELED: { label: 'Annulé', color: 'bg-secondary-100 text-secondary-600', icon: XCircle },
};

// Données de test
const mockBookings: BookingRequest[] = [
  {
    id: 'br_001',
    date: new Date().toISOString().split('T')[0],
    slot: 'MORNING',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.fr',
    phone: '06 12 34 56 78',
    address: '12 rue de la Paix',
    city: 'Beauvais',
    postalCode: '60000',
    serviceType: 'RAMONAGE',
    equipmentType: 'CHIMNEY_INSERT',
    message: 'Ramonage annuel, dernier passage il y a 1 an.',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'br_002',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    slot: 'AFTERNOON',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.fr',
    phone: '06 98 76 54 32',
    address: '45 avenue Foch',
    city: 'Creil',
    postalCode: '60100',
    serviceType: 'ENTRETIEN',
    equipmentType: 'PELLET_STOVE',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'br_003',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    slot: 'MORNING',
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'p.bernard@email.fr',
    phone: '07 11 22 33 44',
    address: '8 place du Marché',
    city: 'Senlis',
    postalCode: '60300',
    serviceType: 'DEBISTRAGE',
    equipmentType: 'CHIMNEY_OPEN',
    message: 'Conduit très encrassé, n\'a pas été ramoné depuis 3 ans.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'br_004',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    slot: 'AFTERNOON',
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@email.fr',
    phone: '06 55 66 77 88',
    address: '23 rue Victor Hugo',
    city: 'Chantilly',
    postalCode: '60500',
    serviceType: 'DIAGNOSTIC',
    status: 'REJECTED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function DemandesPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // Filtrer les demandes
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Trier par date de création (plus récent en premier)
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const updateStatus = (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    if (selectedBooking?.id === id) {
      setSelectedBooking({ ...selectedBooking, status });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Stats
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Demandes de RDV</h1>
          <p className="text-secondary-500">
            {pendingCount > 0 ? `${pendingCount} demande${pendingCount > 1 ? 's' : ''} en attente` : 'Aucune demande en attente'}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filtre statut */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-secondary-200 rounded-lg
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="REJECTED">Refusés</option>
              <option value="CANCELED">Annulés</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        {sortedBookings.length > 0 ? (
          <div className="divide-y divide-secondary-100">
            {sortedBookings.map((booking) => {
              const statusConfig = STATUS_CONFIG[booking.status];
              const StatusIcon = statusConfig.icon;

              return (
                <div 
                  key={booking.id}
                  className="p-4 hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Info principale */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-secondary-900">
                          {booking.firstName} {booking.lastName}
                        </h3>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.date)} • {booking.slot === 'MORNING' ? 'Matin' : 'Après-midi'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.city} ({booking.postalCode})
                        </span>
                        <span>{SERVICE_LABELS[booking.serviceType]}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Confirmer
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'REJECTED')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Refuser
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-secondary-200 text-sm rounded-lg hover:bg-secondary-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-secondary-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune demande trouvée</p>
          </div>
        )}
      </div>

      {/* Modal détails */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedBooking(null)} />
          <div className="bg-white rounded-xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-secondary-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Détails de la demande</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-secondary-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Statut */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${STATUS_CONFIG[selectedBooking.status].color}`}>
                  {STATUS_CONFIG[selectedBooking.status].label}
                </span>
                <span className="text-sm text-secondary-500">
                  Reçu le {formatDateTime(selectedBooking.createdAt)}
                </span>
              </div>

              {/* Date & Créneau */}
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-primary-500" />
                  <div>
                    <p className="font-semibold text-secondary-900 capitalize">
                      {new Date(selectedBooking.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                    <p className="text-secondary-600">
                      {selectedBooking.slot === 'MORNING' ? 'Matin (8h - 12h)' : 'Après-midi (14h - 18h)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <h4 className="text-sm font-medium text-secondary-500 mb-2">Prestation</h4>
                <p className="font-medium">{SERVICE_LABELS[selectedBooking.serviceType]}</p>
                {selectedBooking.equipmentType && (
                  <p className="text-secondary-600">{EQUIPMENT_LABELS[selectedBooking.equipmentType]}</p>
                )}
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-medium text-secondary-500 mb-2">Contact</h4>
                <p className="font-medium">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <a 
                    href={`tel:${selectedBooking.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedBooking.phone}
                  </a>
                  <a 
                    href={`mailto:${selectedBooking.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedBooking.email}
                  </a>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h4 className="text-sm font-medium text-secondary-500 mb-2">Adresse d'intervention</h4>
                <p>{selectedBooking.address}</p>
                <p>{selectedBooking.postalCode} {selectedBooking.city}</p>
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div>
                  <h4 className="text-sm font-medium text-secondary-500 mb-2">Message</h4>
                  <p className="text-secondary-600 bg-secondary-50 p-3 rounded-lg">
                    {selectedBooking.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedBooking.status === 'PENDING' && (
                <div className="flex gap-2 pt-4 border-t border-secondary-100">
                  <button
                    onClick={() => updateStatus(selectedBooking.id, 'CONFIRMED')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmer
                  </button>
                  <button
                    onClick={() => updateStatus(selectedBooking.id, 'REJECTED')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Refuser
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
