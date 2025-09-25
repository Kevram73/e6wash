// Service API pour les messages

import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  type: 'DIRECT' | 'GROUP';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageData {
  conversationId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'FILE';
}

export interface CreateConversationData {
  title: string;
  type: 'DIRECT' | 'GROUP';
  participants: string[];
}

export interface MessageFilters {
  type?: string;
  search?: string;
}

export class MessagesService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Conversation>>> {
    return this.getConversations(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer toutes les conversations avec pagination et filtres
  async getConversations(
    page: number = 1,
    limit: number = 10,
    filters?: MessageFilters
  ): Promise<ApiResponse<PaginatedResponse<Conversation>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Conversation>('/conversations', params);
  }

  // Récupérer une conversation par ID
  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(`/conversations/${id}`);
  }

  // Récupérer les messages d'une conversation
  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Message>>> {
    return apiClient.getPaginated<Message>(`/conversations/${conversationId}/messages`, {
      page,
      limit,
    });
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Conversation>> {
    return this.createConversation(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Conversation>> {
    return this.updateConversation(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteConversation(id);
  }

  // Créer une nouvelle conversation
  async createConversation(data: CreateConversationData): Promise<ApiResponse<Conversation>> {
    return apiClient.post<Conversation>('/conversations', data);
  }

  // Mettre à jour une conversation
  async updateConversation(id: string, data: Partial<CreateConversationData>): Promise<ApiResponse<Conversation>> {
    return apiClient.patch<Conversation>(`/conversations/${id}`, data);
  }

  // Supprimer une conversation
  async deleteConversation(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/conversations/${id}`);
  }

  // Envoyer un message
  async sendMessage(data: CreateMessageData): Promise<ApiResponse<Message>> {
    return apiClient.post<Message>(`/conversations/${data.conversationId}/messages`, data);
  }

  // Marquer les messages comme lus
  async markAsRead(conversationId: string, messageIds: string[]): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`/conversations/${conversationId}/messages/read`, { messageIds });
  }

  // Récupérer les conversations non lues
  async getUnreadConversations(): Promise<ApiResponse<Conversation[]>> {
    return apiClient.get<Conversation[]>('/conversations/unread');
  }

  // Récupérer les statistiques des messages
  async getMessageStats(): Promise<ApiResponse<{
    totalConversations: number;
    unreadConversations: number;
    totalMessages: number;
    unreadMessages: number;
  }>> {
    return apiClient.get('/messages/stats');
  }
}

export const messagesService = new MessagesService();
