// Service API pour le dashboard

import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface DashboardStats {
  totalPressings?: number;
  totalRevenue?: number;
  activeSubscriptions?: number;
  newPressingsThisMonth?: number;
  totalOrders?: number;
  activeAgences?: number;
  pendingOrders?: number;
  completedOrdersToday?: number;
  revenueToday?: number;
}

export class DashboardService {
  // Récupérer les statistiques du dashboard selon le rôle
  async getDashboardStats(role: string): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>(`/dashboard/stats?role=${role}`);
  }

  // Récupérer les statistiques générales
  async getGeneralStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>('/dashboard/general');
  }

  // Récupérer les statistiques pour un pressing spécifique
  async getPressingStats(tenantId: string): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>(`/dashboard/pressing/${tenantId}`);
  }

  // Récupérer les statistiques en temps réel
  async getRealTimeStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>('/dashboard/realtime');
  }

  // Récupérer les statistiques par période
  async getStatsByPeriod(
    startDate: string, 
    endDate: string
  ): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>(`/dashboard/period?start=${startDate}&end=${endDate}`);
  }

  // Récupérer les statistiques comparatives
  async getComparativeStats(): Promise<ApiResponse<{
    current: DashboardStats;
    previous: DashboardStats;
    growth: DashboardStats;
  }>> {
    return apiClient.get('/dashboard/comparative');
  }

  // Récupérer les tendances
  async getTrends(period: 'week' | 'month' | 'year'): Promise<ApiResponse<{
    revenue: Array<{ date: string; value: number }>;
    orders: Array<{ date: string; value: number }>;
    customers: Array<{ date: string; value: number }>;
  }>> {
    return apiClient.get(`/dashboard/trends?period=${period}`);
  }
}

export const dashboardService = new DashboardService();
