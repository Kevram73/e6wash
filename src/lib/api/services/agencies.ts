// Service API pour les agences

import { apiClient } from '../client';
import { 
  Agency, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

// Re-export du type Agency pour faciliter l'import
export type { Agency };

// Type étendu avec les relations pour l'affichage
export interface AgencyWithRelations extends Agency {
  tenant: {
    id: string;
    name: string;
    subdomain: string;
    domain: string | null;
    logo: string | null;
    settings: any;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  country: {
    id: string;
    name: string;
    code: string;
    createdAt: string;
  };
  _count: {
    users: number;
    customers: number;
    orders: number;
  };
  managerId?: string | null;
  openingHours?: any;
}

export interface CreateAgencyRequest {
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  countryId: string;
  city: string;
  isActive?: boolean;
  code: string;
  capacity: number;
  isMainAgency?: boolean;
  settings?: any;
}

export interface UpdateAgencyRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  countryId?: string;
  city?: string;
  isActive?: boolean;
  code?: string;
  capacity?: number;
  isMainAgency?: boolean;
  settings?: any;
}

export interface AgencyFilters {
  tenantId?: string;
  isActive?: boolean;
  city?: string;
  countryId?: string;
  search?: string;
}

export class AgenciesService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Agency>>> {
    return this.getAgencies(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les agences avec pagination et filtres
  async getAgencies(
    page: number = 1,
    limit: number = 10,
    filters?: AgencyFilters
  ): Promise<ApiResponse<PaginatedResponse<Agency>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Agency>('/agencies', params);
  }

  // Récupérer une agence par ID
  async getAgency(id: string): Promise<ApiResponse<Agency>> {
    return apiClient.get<Agency>(`/agencies/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Agency>> {
    return this.createAgency(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Agency>> {
    return this.updateAgency(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteAgency(id);
  }

  // Créer une nouvelle agence
  async createAgency(data: CreateAgencyRequest): Promise<ApiResponse<Agency>> {
    return apiClient.post<Agency>('/agencies', data);
  }

  // Mettre à jour une agence
  async updateAgency(id: string, data: UpdateAgencyRequest): Promise<ApiResponse<Agency>> {
    return apiClient.patch<Agency>(`/agencies/${id}`, data);
  }

  // Supprimer une agence
  async deleteAgency(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/agencies/${id}`);
  }

  // Récupérer les agences par tenant
  async getAgenciesByTenant(tenantId: string): Promise<ApiResponse<Agency[]>> {
    return apiClient.get<Agency[]>(`/agencies/tenant/${tenantId}`);
  }

  // Récupérer les agences par pays
  async getAgenciesByCountry(countryId: string): Promise<ApiResponse<Agency[]>> {
    return apiClient.get<Agency[]>(`/agencies/country/${countryId}`);
  }

  // Récupérer l'agence principale d'un tenant
  async getMainAgency(tenantId: string): Promise<ApiResponse<Agency>> {
    return apiClient.get<Agency>(`/agencies/tenant/${tenantId}/main`);
  }

  // Récupérer les statistiques des agences
  async getAgencyStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    byCountry: { [key: string]: number };
    averageCapacity: number;
    totalCapacity: number;
  }>> {
    return apiClient.get('/agencies/stats');
  }

  // Activer/désactiver une agence
  async toggleAgencyStatus(id: string): Promise<ApiResponse<Agency>> {
    return apiClient.patch<Agency>(`/agencies/${id}/toggle-status`);
  }

  // Définir une agence comme principale
  async setMainAgency(id: string): Promise<ApiResponse<Agency>> {
    return apiClient.patch<Agency>(`/agencies/${id}/set-main`);
  }
}

export const agenciesService = new AgenciesService();
