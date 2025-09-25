// Service API pour les promotions

import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'buy_one_get_one';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  applicableServices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionData {
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'buy_one_get_one';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  usageLimit?: number;
  applicableServices?: string[];
}

export interface UpdatePromotionData {
  name?: string;
  description?: string;
  type?: 'percentage' | 'fixed_amount' | 'free_delivery' | 'buy_one_get_one';
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  usageLimit?: number;
  applicableServices?: string[];
}

export interface PromotionFilters {
  type?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export class PromotionsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Promotion>>> {
    return this.getPromotions(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les promotions avec pagination et filtres
  async getPromotions(
    page: number = 1,
    limit: number = 10,
    filters?: PromotionFilters
  ): Promise<ApiResponse<PaginatedResponse<Promotion>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Promotion>('/promotions', params);
  }

  // Récupérer une promotion par ID
  async getPromotion(id: string): Promise<ApiResponse<Promotion>> {
    return apiClient.get<Promotion>(`/promotions/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Promotion>> {
    return this.createPromotion(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Promotion>> {
    return this.updatePromotion(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deletePromotion(id);
  }

  // Créer une nouvelle promotion
  async createPromotion(data: CreatePromotionData): Promise<ApiResponse<Promotion>> {
    return apiClient.post<Promotion>('/promotions', data);
  }

  // Mettre à jour une promotion
  async updatePromotion(id: string, data: UpdatePromotionData): Promise<ApiResponse<Promotion>> {
    return apiClient.patch<Promotion>(`/promotions/${id}`, data);
  }

  // Supprimer une promotion
  async deletePromotion(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/promotions/${id}`);
  }

  // Activer/Désactiver une promotion
  async togglePromotionStatus(id: string, isActive: boolean): Promise<ApiResponse<Promotion>> {
    return apiClient.patch<Promotion>(`/promotions/${id}/status`, { isActive });
  }

  // Récupérer les statistiques des promotions
  async getPromotionStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    totalUsage: number;
    totalDiscount: number;
    byType: { [key: string]: number };
  }>> {
    return apiClient.get('/promotions/stats');
  }

  // Récupérer les promotions actives
  async getActivePromotions(): Promise<ApiResponse<Promotion[]>> {
    return apiClient.get<Promotion[]>('/promotions/active');
  }

  // Vérifier la validité d'un code promotion
  async validatePromoCode(code: string, orderAmount: number): Promise<ApiResponse<{ valid: boolean; discount: number; message?: string }>> {
    return apiClient.post('/promotions/validate', { code, orderAmount });
  }
}

export const promotionsService = new PromotionsService();
