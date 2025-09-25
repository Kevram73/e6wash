// Service API pour les tâches

import { apiClient } from '../client';
import { 
  Task, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateTaskRequest {
  tenantId: string;
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: Date;
  assignedToId?: string;
  createdById: string;
  relatedType?: string;
  relatedId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: Date;
  assignedToId?: string;
  completedById?: string;
  completedAt?: Date;
}

export interface TaskFilters {
  tenantId?: string;
  status?: string;
  priority?: string;
  assignedToId?: string;
  createdById?: string;
  search?: string;
}

export class TasksService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return this.getTasks(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les tâches avec pagination et filtres
  async getTasks(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilters
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Task>('/tasks', params);
  }

  // Récupérer une tâche par ID
  async getTask(id: string): Promise<ApiResponse<Task>> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Task>> {
    return this.createTask(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Task>> {
    return this.updateTask(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteTask(id);
  }

  // Créer une nouvelle tâche
  async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return apiClient.post<Task>('/tasks', data);
  }

  // Mettre à jour une tâche
  async updateTask(id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return apiClient.patch<Task>(`/tasks/${id}`, data);
  }

  // Supprimer une tâche
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/tasks/${id}`);
  }

  // Récupérer les tâches d'un utilisateur
  async getUserTasks(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return apiClient.getPaginated<Task>(`/users/${userId}/tasks`, {
      page,
      limit,
    });
  }

  // Marquer une tâche comme terminée
  async completeTask(id: string, completedById: string): Promise<ApiResponse<Task>> {
    return apiClient.patch<Task>(`/tasks/${id}/complete`, { completedById });
  }

  // Assigner une tâche
  async assignTask(id: string, assignedToId: string): Promise<ApiResponse<Task>> {
    return apiClient.patch<Task>(`/tasks/${id}/assign`, { assignedToId });
  }

  // Récupérer les statistiques des tâches
  async getTaskStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
    averageCompletionTime: number;
  }>> {
    return apiClient.get('/tasks/stats');
  }
}

export const tasksService = new TasksService();
