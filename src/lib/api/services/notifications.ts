// Service API pour les notifications

import { apiClient } from '../client';
import { 
  InternalNotification, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateNotificationRequest {
  tenantId: string;
  userId: string;
  title: string;
  content: string;
  icon?: string;
  level?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  link?: string;
  createdById: string;
  relatedType?: string;
  relatedId?: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  content?: string;
  icon?: string;
  level?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  link?: string;
  isRead?: boolean;
}

export interface NotificationFilters {
  tenantId?: string;
  userId?: string;
  level?: string;
  isRead?: boolean;
  search?: string;
}

export class NotificationsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<InternalNotification>>> {
    return this.getNotifications(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les notifications avec pagination et filtres
  async getNotifications(
    page: number = 1,
    limit: number = 10,
    filters?: NotificationFilters
  ): Promise<ApiResponse<PaginatedResponse<InternalNotification>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<InternalNotification>('/notifications', params);
  }

  // Récupérer une notification par ID
  async getNotification(id: string): Promise<ApiResponse<InternalNotification>> {
    return apiClient.get<InternalNotification>(`/notifications/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<InternalNotification>> {
    return this.createNotification(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<InternalNotification>> {
    return this.updateNotification(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteNotification(id);
  }

  // Créer une nouvelle notification
  async createNotification(data: CreateNotificationRequest): Promise<ApiResponse<InternalNotification>> {
    return apiClient.post<InternalNotification>('/notifications', data);
  }

  // Mettre à jour une notification
  async updateNotification(id: string, data: UpdateNotificationRequest): Promise<ApiResponse<InternalNotification>> {
    return apiClient.patch<InternalNotification>(`/notifications/${id}`, data);
  }

  // Supprimer une notification
  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/notifications/${id}`);
  }

  // Marquer une notification comme lue
  async markAsRead(id: string): Promise<ApiResponse<InternalNotification>> {
    return apiClient.patch<InternalNotification>(`/notifications/${id}/read`);
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`/notifications/mark-all-read`, { userId });
  }

  // Récupérer les notifications non lues
  async getUnreadNotifications(userId: string): Promise<ApiResponse<InternalNotification[]>> {
    return apiClient.get<InternalNotification[]>(`/notifications/unread?userId=${userId}`);
  }

  // Récupérer les statistiques des notifications
  async getNotificationStats(): Promise<ApiResponse<{
    total: number;
    unread: number;
    byLevel: { [key: string]: number };
    recent: InternalNotification[];
  }>> {
    return apiClient.get('/notifications/stats');
  }
}

export const notificationsService = new NotificationsService();
