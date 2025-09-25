// Service API pour l'inventaire

import { apiClient } from '../client';
import { 
  Inventory, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateInventoryRequest {
  tenantId: string;
  agencyId: string;
  name: string;
  category: string;
  currentStock?: number;
  minStock?: number;
  unit: string;
  unitPrice: number;
  supplier?: string;
}

export interface UpdateInventoryRequest {
  name?: string;
  category?: string;
  currentStock?: number;
  minStock?: number;
  unit?: string;
  unitPrice?: number;
  supplier?: string;
}

export interface InventoryFilters {
  tenantId?: string;
  agencyId?: string;
  category?: string;
  isLowStock?: boolean;
  search?: string;
}

export class InventoryService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Inventory>>> {
    return this.getInventory(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tout l'inventaire avec pagination et filtres
  async getInventory(
    page: number = 1,
    limit: number = 10,
    filters?: InventoryFilters
  ): Promise<ApiResponse<PaginatedResponse<Inventory>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Inventory>('/inventory', params);
  }

  // Récupérer un article d'inventaire par ID
  async getInventoryItem(id: string): Promise<ApiResponse<Inventory>> {
    return apiClient.get<Inventory>(`/inventory/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Inventory>> {
    return this.createInventoryItem(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Inventory>> {
    return this.updateInventoryItem(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteInventoryItem(id);
  }

  // Créer un nouvel article d'inventaire
  async createInventoryItem(data: CreateInventoryRequest): Promise<ApiResponse<Inventory>> {
    return apiClient.post<Inventory>('/inventory', data);
  }

  // Mettre à jour un article d'inventaire
  async updateInventoryItem(id: string, data: UpdateInventoryRequest): Promise<ApiResponse<Inventory>> {
    return apiClient.patch<Inventory>(`/inventory/${id}`, data);
  }

  // Supprimer un article d'inventaire
  async deleteInventoryItem(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/inventory/${id}`);
  }

  // Mettre à jour le stock
  async updateStock(id: string, quantity: number, reason?: string): Promise<ApiResponse<Inventory>> {
    return apiClient.patch<Inventory>(`/inventory/${id}/stock`, { quantity, reason });
  }

  // Récupérer les articles en rupture de stock
  async getLowStockItems(): Promise<ApiResponse<Inventory[]>> {
    return apiClient.get<Inventory[]>('/inventory/low-stock');
  }

  // Récupérer les statistiques de l'inventaire
  async getInventoryStats(): Promise<ApiResponse<{
    total: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
    categories: { [key: string]: number };
  }>> {
    return apiClient.get('/inventory/stats');
  }

  // Récupérer l'historique des transactions
  async getInventoryHistory(
    id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    return apiClient.getPaginated(`/inventory/${id}/history`, { page, limit });
  }
}

export const inventoryService = new InventoryService();
