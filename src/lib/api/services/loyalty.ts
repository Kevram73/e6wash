// Service API pour la fidélité

import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface LoyaltyGroup {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountPercentage: number;
  benefits: string[];
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoyaltyGroupData {
  name: string;
  description: string;
  pointsRequired: number;
  discountPercentage: number;
  benefits: string[];
  color: string;
}

export interface UpdateLoyaltyGroupData {
  name?: string;
  description?: string;
  pointsRequired?: number;
  discountPercentage?: number;
  benefits?: string[];
  color?: string;
  isActive?: boolean;
}

export interface LoyaltyFilters {
  isActive?: boolean;
  search?: string;
}

export class LoyaltyService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<LoyaltyGroup>>> {
    return this.getLoyaltyGroups(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les groupes de fidélité avec pagination et filtres
  async getLoyaltyGroups(
    page: number = 1,
    limit: number = 10,
    filters?: LoyaltyFilters
  ): Promise<ApiResponse<PaginatedResponse<LoyaltyGroup>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<LoyaltyGroup>('/loyalty', params);
  }

  // Récupérer un groupe de fidélité par ID
  async getLoyaltyGroup(id: string): Promise<ApiResponse<LoyaltyGroup>> {
    return apiClient.get<LoyaltyGroup>(`/loyalty/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<LoyaltyGroup>> {
    return this.createLoyaltyGroup(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<LoyaltyGroup>> {
    return this.updateLoyaltyGroup(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteLoyaltyGroup(id);
  }

  // Créer un nouveau groupe de fidélité
  async createLoyaltyGroup(data: CreateLoyaltyGroupData): Promise<ApiResponse<LoyaltyGroup>> {
    return apiClient.post<LoyaltyGroup>('/loyalty', data);
  }

  // Mettre à jour un groupe de fidélité
  async updateLoyaltyGroup(id: string, data: UpdateLoyaltyGroupData): Promise<ApiResponse<LoyaltyGroup>> {
    return apiClient.patch<LoyaltyGroup>(`/loyalty/${id}`, data);
  }

  // Supprimer un groupe de fidélité
  async deleteLoyaltyGroup(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/loyalty/${id}`);
  }

  // Activer/Désactiver un groupe
  async toggleGroupStatus(id: string, isActive: boolean): Promise<ApiResponse<LoyaltyGroup>> {
    return apiClient.patch<LoyaltyGroup>(`/loyalty/${id}/status`, { isActive });
  }

  // Récupérer les groupes actifs
  async getActiveLoyaltyGroups(): Promise<ApiResponse<LoyaltyGroup[]>> {
    return apiClient.get<LoyaltyGroup[]>('/loyalty/active');
  }

  // Récupérer les statistiques de fidélité
  async getLoyaltyStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    totalMembers: number;
    totalPoints: number;
    averagePoints: number;
  }>> {
    return apiClient.get('/loyalty/stats');
  }
}

export const loyaltyService = new LoyaltyService();
