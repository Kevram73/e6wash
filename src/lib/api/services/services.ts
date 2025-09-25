// Service API pour les services

import { apiClient } from '../client';
import { 
  Service, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  estimatedDuration: number;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  isActive?: boolean;
  estimatedDuration?: number;
}

export interface ServiceFilters {
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export class ServicesService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Service>>> {
    return this.getServices(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les services avec pagination et filtres
  async getServices(
    page: number = 1,
    limit: number = 10,
    filters?: ServiceFilters
  ): Promise<ApiResponse<PaginatedResponse<Service>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Service>('/services', params);
  }

  // Récupérer un service par ID
  async getService(id: string): Promise<ApiResponse<Service>> {
    return apiClient.get<Service>(`/services/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Service>> {
    return this.createService(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Service>> {
    return this.updateService(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteService(id);
  }

  // Créer un nouveau service
  async createService(data: CreateServiceRequest): Promise<ApiResponse<Service>> {
    return apiClient.post<Service>('/services', data);
  }

  // Mettre à jour un service
  async updateService(id: string, data: UpdateServiceRequest): Promise<ApiResponse<Service>> {
    return apiClient.patch<Service>(`/services/${id}`, data);
  }

  // Supprimer un service
  async deleteService(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/services/${id}`);
  }

  // Récupérer les services par catégorie
  async getServicesByCategory(category: string): Promise<ApiResponse<Service[]>> {
    return apiClient.get<Service[]>(`/services/category/${category}`);
  }

  // Récupérer toutes les catégories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/services/categories');
  }

  // Récupérer les statistiques des services
  async getServiceStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    categories: number;
    averagePrice: number;
    mostPopular: Service[];
  }>> {
    return apiClient.get('/services/stats');
  }

  // Activer/désactiver un service
  async toggleServiceStatus(id: string): Promise<ApiResponse<Service>> {
    return apiClient.patch<Service>(`/services/${id}/toggle-status`);
  }
}

export const servicesService = new ServicesService();
