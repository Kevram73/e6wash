// Service API pour les collecteurs

import { apiClient } from '../client';
import { 
  Collector, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateCollectorRequest {
  name: string;
  email: string;
  phone: string;
  status: string;
  availability: string;
  currentLocation: string;
  vehicle: {
    type: string;
    plate: string;
    model: string;
  };
  workingHours: string;
  notes?: string;
}

export interface UpdateCollectorRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  availability?: string;
  currentLocation?: string;
  vehicle?: {
    type?: string;
    plate?: string;
    model?: string;
  };
  workingHours?: string;
  notes?: string;
}

export interface CollectorFilters {
  status?: string;
  availability?: string;
  vehicleType?: string;
}

export class CollectorsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Collector>>> {
    return this.getCollectors(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les collecteurs avec pagination et filtres
  async getCollectors(
    page: number = 1,
    limit: number = 10,
    filters?: CollectorFilters
  ): Promise<ApiResponse<PaginatedResponse<Collector>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Collector>('/collectors', params);
  }

  // Récupérer un collecteur par ID
  async getCollector(id: string): Promise<ApiResponse<Collector>> {
    return apiClient.get<Collector>(`/collectors/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Collector>> {
    return this.createCollector(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Collector>> {
    return this.updateCollector(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteCollector(id);
  }

  // Créer un nouveau collecteur
  async createCollector(data: CreateCollectorRequest): Promise<ApiResponse<Collector>> {
    return apiClient.post<Collector>('/collectors', data);
  }

  // Mettre à jour un collecteur
  async updateCollector(id: string, data: UpdateCollectorRequest): Promise<ApiResponse<Collector>> {
    return apiClient.patch<Collector>(`/collectors/${id}`, data);
  }

  // Supprimer un collecteur
  async deleteCollector(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/collectors/${id}`);
  }

  // Mettre à jour le statut d'un collecteur
  async updateCollectorStatus(
    id: string, 
    status: string
  ): Promise<ApiResponse<Collector>> {
    return apiClient.patch<Collector>(`/collectors/${id}/status`, { status });
  }

  // Mettre à jour la disponibilité
  async updateAvailability(
    id: string, 
    availability: string
  ): Promise<ApiResponse<Collector>> {
    return apiClient.patch<Collector>(`/collectors/${id}/availability`, { availability });
  }

  // Mettre à jour la localisation
  async updateLocation(
    id: string, 
    location: string
  ): Promise<ApiResponse<Collector>> {
    return apiClient.patch<Collector>(`/collectors/${id}/location`, { location });
  }

  // Récupérer les collecteurs disponibles
  async getAvailableCollectors(): Promise<ApiResponse<Collector[]>> {
    return apiClient.get<Collector[]>('/collectors/available');
  }

  // Récupérer les statistiques des collecteurs
  async getCollectorStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    available: number;
    busy: number;
    averageRating: number;
    totalMissions: number;
    totalEarnings: number;
  }>> {
    return apiClient.get('/collectors/stats');
  }

  // Assigner une mission à un collecteur
  async assignMission(
    collectorId: string, 
    missionId: string
  ): Promise<ApiResponse<Collector>> {
    return apiClient.post<Collector>(`/collectors/${collectorId}/missions`, { missionId });
  }
}

export const collectorsService = new CollectorsService();
