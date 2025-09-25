// Service API pour les commandes

import { apiClient } from '../client';
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderFilters,
  ApiResponse,
  PaginatedResponse 
} from '../types';

export class OrdersService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return this.getOrders(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les commandes avec pagination et filtres
  async getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Order>('/orders', params);
  }

  // Récupérer une commande par ID
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Order>> {
    return this.createOrder(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Order>> {
    return this.updateOrder(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteOrder(id);
  }

  // Créer une nouvelle commande
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>('/orders', data);
  }

  // Mettre à jour une commande
  async updateOrder(id: string, data: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${id}`, data);
  }

  // Supprimer une commande
  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/orders/${id}`);
  }

  // Récupérer les commandes d'un client
  async getCustomerOrders(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return apiClient.getPaginated<Order>(`/customers/${customerId}/orders`, {
      page,
      limit,
    });
  }

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(
    id: string, 
    status: Order['status']
  ): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  }

  // Mettre à jour le statut de paiement
  async updatePaymentStatus(
    id: string, 
    paymentStatus: Order['paymentStatus']
  ): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${id}/payment-status`, { paymentStatus });
  }

  // Récupérer les statistiques des commandes
  async getOrderStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  }>> {
    return apiClient.get('/orders/stats');
  }
}

export const ordersService = new OrdersService();
