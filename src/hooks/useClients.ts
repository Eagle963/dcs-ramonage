'use client';

import { useState, useCallback } from 'react';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  phoneAlt: string | null;
  address: string;
  addressComplement: string | null;
  city: string;
  postalCode: string;
  notes: string | null;
  tags: string[];
  source: string;
  sourceDetail: string | null;
  createdAt: string;
  updatedAt: string;
  equipments?: any[];
  _count?: {
    quotes: number;
    invoices: number;
    interventions: number;
  };
}

export interface ClientFormData {
  type: 'PARTICULIER' | 'PROFESSIONNEL' | 'SYNDIC';
  civilite?: string;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse: {
    adresse: string;
    complement?: string;
    codePostal: string;
    ville: string;
    lat?: number;
    lng?: number;
  };
  entreprise?: {
    raisonSociale: string;
    siret: string;
    tvaIntra: string;
    codeAPE: string;
  };
  contact?: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  notes?: string;
}

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchClients: (page?: number, search?: string) => Promise<void>;
  getClient: (id: string) => Promise<Client | null>;
  createClient: (data: ClientFormData) => Promise<Client | null>;
  updateClient: (id: string, data: ClientFormData) => Promise<Client | null>;
  deleteClient: (id: string) => Promise<boolean>;
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchClients = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/clients?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des clients');
      }

      setClients(data.clients);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const getClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération du client');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const createClient = useCallback(async (data: ClientFormData): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du client');
      }

      // Rafraîchir la liste
      await fetchClients(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchClients, pagination.page]);

  const updateClient = useCallback(async (id: string, data: ClientFormData): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour du client');
      }

      // Rafraîchir la liste
      await fetchClients(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchClients, pagination.page]);

  const deleteClient = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression du client');
      }

      // Rafraîchir la liste
      await fetchClients(pagination.page);

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchClients, pagination.page]);

  return {
    clients,
    loading,
    error,
    pagination,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
  };
}
