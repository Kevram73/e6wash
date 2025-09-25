// Service API pour les tenants

import { apiClient } from '../client';
import { 
  Tenant, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateTenantRequest {
  name: string;
  subdomain: string;
  domain?: string;
  logo?: string;
  settings?: any;
  status?: string;
}

export interface UpdateTenantRequest {
  name?: string;
  subdomain?: string;
  domain?: string;
  logo?: string;
  settings?: any;
  status?: string;
}

export interface TenantFilters {
  status?: string;
  search?: string;
}

export class TenantsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Tenant>>> {
    return this.getTenants(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les tenants avec pagination et filtres
  async getTenants(
    page: number = 1,
    limit: number = 10,
    filters?: TenantFilters
  ): Promise<ApiResponse<PaginatedResponse<Tenant>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Tenant>('/tenants', params);
  }

  // Récupérer un tenant par ID
  async getTenant(id: string): Promise<ApiResponse<Tenant>> {
    return apiClient.get<Tenant>(`/tenants/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Tenant>> {
    return this.createTenant(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Tenant>> {
    return this.updateTenant(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteTenant(id);
  }

  // Créer un nouveau tenant
  async createTenant(data: CreateTenantRequest): Promise<ApiResponse<Tenant>> {
    return apiClient.post<Tenant>('/tenants', data);
  }

  // Mettre à jour un tenant
  async updateTenant(id: string, data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    return apiClient.patch<Tenant>(`/tenants/${id}`, data);
  }

  // Supprimer un tenant
  async deleteTenant(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/tenants/${id}`);
  }

  // Récupérer les statistiques des tenants
  async getTenantStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    totalUsers: number;
    totalAgencies: number;
    totalRevenue: number;
  }>> {
    return apiClient.get('/tenants/stats');
  }

  // Activer/désactiver un tenant
  async toggleTenantStatus(id: string): Promise<ApiResponse<Tenant>> {
    return apiClient.patch<Tenant>(`/tenants/${id}/toggle-status`);
  }

  // Vérifier la disponibilité d'un sous-domaine
  async checkSubdomainAvailability(subdomain: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiClient.get(`/tenants/check-subdomain?subdomain=${subdomain}`);
  }
}

export const tenantsService = new TenantsService();
