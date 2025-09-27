import { apiClient } from '../client';
import { ApiResponse } from '../types';
import { User, CreateUserData, UpdateUserData, UserRole } from '@/lib/types/user-management';

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  recentUsers: User[];
}

class UsersService {
  // Récupérer tous les utilisateurs
  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
    agencyId?: string,
    isActive?: boolean
  ): Promise<ApiResponse<UsersResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (agencyId) params.append('agencyId', agencyId);
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    return apiClient.get(`/users?${params.toString()}`);
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get(`/users/${id}`);
  }

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    return apiClient.post('/users', userData);
  }

  // Mettre à jour un utilisateur
  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    return apiClient.put(`/users/${id}`, userData);
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete(`/users/${id}`);
  }

  // Activer/Désactiver un utilisateur
  async toggleUserStatus(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    return apiClient.patch(`/users/${id}/status`, { isActive });
  }

  // Réinitialiser le mot de passe d'un utilisateur
  async resetPassword(id: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.patch(`/users/${id}/password`, { password: newPassword });
  }

  // Récupérer les statistiques des utilisateurs
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get('/users/stats');
  }

  // Récupérer les rôles disponibles
  async getRoles(): Promise<ApiResponse<UserRole[]>> {
    return apiClient.get('/users/roles');
  }

  // Assigner un utilisateur à une agence
  async assignToAgency(userId: string, agencyId: string): Promise<ApiResponse<User>> {
    return apiClient.patch(`/users/${userId}/agency`, { agencyId });
  }

  // Récupérer les utilisateurs d'une agence
  async getAgencyUsers(agencyId: string): Promise<ApiResponse<User[]>> {
    return apiClient.get(`/agencies/${agencyId}/users`);
  }

  // Vérifier les permissions d'un utilisateur
  async checkPermissions(userId: string, permission: string): Promise<ApiResponse<{ hasPermission: boolean }>> {
    return apiClient.get(`/users/${userId}/permissions/${permission}`);
  }

  // Récupérer les permissions d'un utilisateur
  async getUserPermissions(userId: string): Promise<ApiResponse<{ permissions: string[] }>> {
    return apiClient.get(`/users/${userId}/permissions`);
  }
}

export const usersService = new UsersService();
