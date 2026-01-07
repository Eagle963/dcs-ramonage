'use client';

import { useState, useCallback } from 'react';

export interface LigneDevis {
  id: string;
  description: string;
  quantity: number;
  unitPriceHT: number;
  vatRate: number;
  totalHT: number;
  sortOrder: number;
}

export interface Devis {
  id: string;
  number: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'INVOICED';
  validUntil: string;
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  notes: string | null;
  conditions: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  signatureData: string | null;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  lines: LigneDevis[];
}

export interface DevisFormData {
  clientId: string;
  clientNom: string;
  adresseChantier: string;
  villeChantier: string;
  codePostalChantier: string;
  dateValidite: string;
  lignes: {
    id: string;
    description: string;
    quantite: number;
    prixUnitaire: number;
    tva: number;
  }[];
  notes?: string;
  conditionsPaiement: string;
}

interface UseDevisReturn {
  devis: Devis[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchDevis: (page?: number, search?: string, status?: string) => Promise<void>;
  getDevis: (id: string) => Promise<Devis | null>;
  createDevis: (data: DevisFormData) => Promise<Devis | null>;
  updateDevis: (id: string, data: DevisFormData) => Promise<Devis | null>;
  updateDevisStatus: (id: string, status: string, signatureData?: string) => Promise<Devis | null>;
  deleteDevis: (id: string) => Promise<boolean>;
}

export function useDevis(): UseDevisReturn {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchDevis = useCallback(async (page = 1, search = '', status = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
        ...(search && { search }),
        ...(status && { status }),
      });

      const response = await fetch(`/api/admin/devis?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des devis');
      }

      setDevis(data.devis);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const getDevis = useCallback(async (id: string): Promise<Devis | null> => {
    try {
      const response = await fetch(`/api/admin/devis/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération du devis');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const createDevis = useCallback(async (data: DevisFormData): Promise<Devis | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du devis');
      }

      await fetchDevis(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchDevis, pagination.page]);

  const updateDevis = useCallback(async (id: string, data: DevisFormData): Promise<Devis | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/devis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour du devis');
      }

      await fetchDevis(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchDevis, pagination.page]);

  const updateDevisStatus = useCallback(async (id: string, status: string, signatureData?: string): Promise<Devis | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/devis/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, signatureData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour du statut');
      }

      await fetchDevis(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchDevis, pagination.page]);

  const deleteDevis = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/devis/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression du devis');
      }

      await fetchDevis(pagination.page);

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDevis, pagination.page]);

  return {
    devis,
    loading,
    error,
    pagination,
    fetchDevis,
    getDevis,
    createDevis,
    updateDevis,
    updateDevisStatus,
    deleteDevis,
  };
}
