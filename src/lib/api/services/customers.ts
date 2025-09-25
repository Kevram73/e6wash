// Service API pour les clients

import { apiClient } from '../client';
import { 
  Customer, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilters,
  ApiResponse,
  PaginatedResponse 
} from '../types';

export class CustomersService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    return this.getCustomers(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les clients avec pagination et filtres
  async getCustomers(
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Customer>('/customers', params);
  }

  // Récupérer un client par ID
  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get<Customer>(`/customers/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Customer>> {
    return this.createCustomer(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Customer>> {
    return this.updateCustomer(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteCustomer(id);
  }

  // Créer un nouveau client
  async createCustomer(data: CreateUserRequest): Promise<ApiResponse<Customer>> {
    return apiClient.post<Customer>('/customers', data);
  }

  // Mettre à jour un client
  async updateCustomer(id: string, data: UpdateUserRequest): Promise<ApiResponse<Customer>> {
    return apiClient.patch<Customer>(`/customers/${id}`, data);
  }

  // Supprimer un client
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/customers/${id}`);
  }

  // Rechercher des clients
  async searchCustomers(query: string): Promise<ApiResponse<Customer[]>> {
    return apiClient.get<Customer[]>(`/customers/search?q=${encodeURIComponent(query)}`);
  }

  // Récupérer les statistiques des clients
  async getCustomerStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    totalLoyaltyPoints: number;
    averageOrderValue: number;
  }>> {
    return apiClient.get('/customers/stats');
  }

  // Mettre à jour les points de fidélité
  async updateLoyaltyPoints(
    id: string, 
    points: number
  ): Promise<ApiResponse<Customer>> {
    return apiClient.patch<Customer>(`/customers/${id}/loyalty-points`, { points });
  }
}

export const customersService = new CustomersService();
