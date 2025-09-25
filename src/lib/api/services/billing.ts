// Service API pour la facturation

import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Billing {
  id: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillingData {
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency?: string;
  dueDate: string;
  description: string;
}

export interface UpdateBillingData {
  amount?: number;
  status?: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  dueDate?: string;
  paidDate?: string;
  description?: string;
}

export interface BillingFilters {
  status?: string;
  tenantId?: string;
  search?: string;
}

export class BillingService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Billing>>> {
    return this.getBillings(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les factures avec pagination et filtres
  async getBillings(
    page: number = 1,
    limit: number = 10,
    filters?: BillingFilters
  ): Promise<ApiResponse<PaginatedResponse<Billing>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Billing>('/billing', params);
  }

  // Récupérer une facture par ID
  async getBilling(id: string): Promise<ApiResponse<Billing>> {
    return apiClient.get<Billing>(`/billing/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Billing>> {
    return this.createBilling(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Billing>> {
    return this.updateBilling(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteBilling(id);
  }

  // Créer une nouvelle facture
  async createBilling(data: CreateBillingData): Promise<ApiResponse<Billing>> {
    return apiClient.post<Billing>('/billing', data);
  }

  // Mettre à jour une facture
  async updateBilling(id: string, data: UpdateBillingData): Promise<ApiResponse<Billing>> {
    return apiClient.patch<Billing>(`/billing/${id}`, data);
  }

  // Supprimer une facture
  async deleteBilling(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/billing/${id}`);
  }

  // Marquer une facture comme payée
  async markAsPaid(id: string, paidDate?: string): Promise<ApiResponse<Billing>> {
    return apiClient.patch<Billing>(`/billing/${id}/pay`, { 
      paidDate: paidDate || new Date().toISOString() 
    });
  }

  // Récupérer les factures d'un tenant
  async getTenantBillings(
    tenantId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Billing>>> {
    return apiClient.getPaginated<Billing>('/billing', {
      page,
      limit,
      tenantId,
    });
  }

  // Récupérer les factures en attente
  async getPendingBillings(): Promise<ApiResponse<Billing[]>> {
    return apiClient.get<Billing[]>('/billing/pending');
  }

  // Récupérer les statistiques de facturation
  async getBillingStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    paid: number;
    failed: number;
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
  }>> {
    return apiClient.get('/billing/stats');
  }
}

export const billingService = new BillingService();
