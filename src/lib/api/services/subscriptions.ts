// Service API pour les plans d'abonnement

import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxUsers: number;
  maxAgences: number;
  maxOrders: number;
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanData {
  name: string;
  description: string;
  price: number;
  currency?: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxUsers: number;
  maxAgences: number;
  maxOrders: number;
  isPopular?: boolean;
}

export interface UpdateSubscriptionPlanData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  billingCycle?: 'MONTHLY' | 'YEARLY';
  features?: string[];
  maxUsers?: number;
  maxAgences?: number;
  maxOrders?: number;
  isActive?: boolean;
  isPopular?: boolean;
}

export interface SubscriptionFilters {
  isActive?: boolean;
  search?: string;
}

export class SubscriptionsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<SubscriptionPlan>>> {
    return this.getSubscriptionPlans(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les plans d'abonnement avec pagination et filtres
  async getSubscriptionPlans(
    page: number = 1,
    limit: number = 10,
    filters?: SubscriptionFilters
  ): Promise<ApiResponse<PaginatedResponse<SubscriptionPlan>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<SubscriptionPlan>('/subscriptions/plans', params);
  }

  // Récupérer un plan d'abonnement par ID
  async getSubscriptionPlan(id: string): Promise<ApiResponse<SubscriptionPlan>> {
    return apiClient.get<SubscriptionPlan>(`/subscriptions/plans/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<SubscriptionPlan>> {
    return this.createSubscriptionPlan(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<SubscriptionPlan>> {
    return this.updateSubscriptionPlan(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteSubscriptionPlan(id);
  }

  // Créer un nouveau plan d'abonnement
  async createSubscriptionPlan(data: CreateSubscriptionPlanData): Promise<ApiResponse<SubscriptionPlan>> {
    return apiClient.post<SubscriptionPlan>('/subscriptions/plans', data);
  }

  // Mettre à jour un plan d'abonnement
  async updateSubscriptionPlan(id: string, data: UpdateSubscriptionPlanData): Promise<ApiResponse<SubscriptionPlan>> {
    return apiClient.patch<SubscriptionPlan>(`/subscriptions/plans/${id}`, data);
  }

  // Supprimer un plan d'abonnement
  async deleteSubscriptionPlan(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/subscriptions/plans/${id}`);
  }

  // Activer/Désactiver un plan
  async togglePlanStatus(id: string, isActive: boolean): Promise<ApiResponse<SubscriptionPlan>> {
    return apiClient.patch<SubscriptionPlan>(`/subscriptions/plans/${id}/status`, { isActive });
  }

  // Récupérer les plans populaires
  async getPopularPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans/popular');
  }

  // Récupérer les plans actifs
  async getActivePlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans/active');
  }

  // Récupérer les statistiques des abonnements
  async getSubscriptionStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    popular: number;
    totalRevenue: number;
    averagePrice: number;
  }>> {
    return apiClient.get('/subscriptions/stats');
  }
}

export const subscriptionsService = new SubscriptionsService();
