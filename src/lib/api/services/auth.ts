// Service API pour l'authentification

import { apiClient } from '../client';
import { ApiResponse, User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class AuthService {
  // Connexion
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Stocker le token
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  // Déconnexion
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');
    
    // Supprimer le token
    apiClient.clearToken();
    
    return response;
  }

  // Inscription
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    
    if (response.success && response.data) {
      // Stocker le token
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  // Vérifier le token
  async verifyToken(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/verify');
  }

  // Rafraîchir le token
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh');
    
    if (response.success && response.data) {
      // Mettre à jour le token
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/forgot-password', { email });
  }

  // Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', { token, newPassword });
  }

  // Changer le mot de passe
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
  }

  // Obtenir le profil utilisateur
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/profile');
  }

  // Mettre à jour le profil
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch<User>('/auth/profile', data);
  }
}

export const authService = new AuthService();
