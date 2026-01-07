'use client';

import { useState, useCallback } from 'react';

export interface LigneFacture {
  id: string;
  description: string;
  quantity: number;
  unitPriceHT: number;
  vatRate: number;
  totalHT: number;
  sortOrder: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: 'CASH' | 'CHECK' | 'CARD' | 'TRANSFER' | 'STRIPE' | 'OTHER';
  reference: string | null;
  notes: string | null;
  paidAt: string;
}

export interface Facture {
  id: string;
  number: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELED' | 'REFUNDED';
  issueDate: string;
  dueDate: string;
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  amountPaid: number;
  notes: string | null;
  paymentTerms: string | null;
  sentAt: string | null;
  paidAt: string | null;
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
  lines: LigneFacture[];
  payments: Payment[];
  quote?: {
    id: string;
    number: string;
  };
}

export interface FactureFormData {
  clientId: string;
  clientNom: string;
  devisId?: string;
  dateEcheance?: string;
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

export interface PaymentData {
  amount: number;
  method: 'CASH' | 'CHECK' | 'CARD' | 'TRANSFER' | 'STRIPE' | 'OTHER';
  reference?: string;
  notes?: string;
  date?: string;
}

interface UseFacturesReturn {
  factures: Facture[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchFactures: (page?: number, search?: string, status?: string) => Promise<void>;
  getFacture: (id: string) => Promise<Facture | null>;
  createFacture: (data: FactureFormData) => Promise<Facture | null>;
  updateFacture: (id: string, data: FactureFormData) => Promise<Facture | null>;
  updateFactureStatus: (id: string, status: string) => Promise<Facture | null>;
  addPayment: (id: string, payment: PaymentData) => Promise<boolean>;
  deleteFacture: (id: string) => Promise<boolean>;
}

export function useFactures(): UseFacturesReturn {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchFactures = useCallback(async (page = 1, search = '', status = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
        ...(search && { search }),
        ...(status && { status }),
      });

      const response = await fetch(`/api/admin/factures?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des factures');
      }

      setFactures(data.factures);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const getFacture = useCallback(async (id: string): Promise<Facture | null> => {
    try {
      const response = await fetch(`/api/admin/factures/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération de la facture');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const createFacture = useCallback(async (data: FactureFormData): Promise<Facture | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/factures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création de la facture');
      }

      await fetchFactures(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFactures, pagination.page]);

  const updateFacture = useCallback(async (id: string, data: FactureFormData): Promise<Facture | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/factures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour de la facture');
      }

      await fetchFactures(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFactures, pagination.page]);

  const updateFactureStatus = useCallback(async (id: string, status: string): Promise<Facture | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/factures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour du statut');
      }

      await fetchFactures(pagination.page);

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFactures, pagination.page]);

  const addPayment = useCallback(async (id: string, payment: PaymentData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/factures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'ajout du paiement');
      }

      await fetchFactures(pagination.page);

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchFactures, pagination.page]);

  const deleteFacture = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/factures/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression de la facture');
      }

      await fetchFactures(pagination.page);

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchFactures, pagination.page]);

  return {
    factures,
    loading,
    error,
    pagination,
    fetchFactures,
    getFacture,
    createFacture,
    updateFacture,
    updateFactureStatus,
    addPayment,
    deleteFacture,
  };
}
