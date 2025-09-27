// Service API pour les dépôts au pressing

import { apiClient } from '../client';
import { 
  Deposit, 
  DepositFormData, 
  Receipt, 
  ReceiptTemplate,
  WhatsAppMessage,
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface DepositFilters {
  tenantId?: string;
  agencyId?: string;
  customerId?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export class DepositsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Deposit>>> {
    return this.getDeposits(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les dépôts avec pagination et filtres
  async getDeposits(
    page: number = 1,
    limit: number = 10,
    filters?: DepositFilters
  ): Promise<ApiResponse<PaginatedResponse<Deposit>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Deposit>('/deposits', params);
  }

  // Récupérer un dépôt par ID
  async getDeposit(id: string): Promise<ApiResponse<Deposit>> {
    return apiClient.get<Deposit>(`/deposits/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Deposit>> {
    return this.createDeposit(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Deposit>> {
    return this.updateDeposit(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteDeposit(id);
  }

  // Créer un nouveau dépôt
  async createDeposit(data: DepositFormData): Promise<ApiResponse<Deposit>> {
    return apiClient.post<Deposit>('/deposits', data);
  }

  // Mettre à jour un dépôt
  async updateDeposit(id: string, data: Partial<DepositFormData>): Promise<ApiResponse<Deposit>> {
    return apiClient.patch<Deposit>(`/deposits/${id}`, data);
  }

  // Supprimer un dépôt
  async deleteDeposit(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/deposits/${id}`);
  }

  // Confirmer un dépôt
  async confirmDeposit(id: string): Promise<ApiResponse<Deposit>> {
    return apiClient.patch<Deposit>(`/deposits/${id}/confirm`);
  }

  // Marquer comme prêt
  async markAsReady(id: string): Promise<ApiResponse<Deposit>> {
    return apiClient.patch<Deposit>(`/deposits/${id}/ready`);
  }

  // Marquer comme livré
  async markAsDelivered(id: string): Promise<ApiResponse<Deposit>> {
    return apiClient.patch<Deposit>(`/deposits/${id}/delivered`);
  }

  // Annuler un dépôt
  async cancelDeposit(id: string, reason: string): Promise<ApiResponse<Deposit>> {
    return apiClient.patch<Deposit>(`/deposits/${id}/cancel`, { reason });
  }

  // Générer un reçu
  async generateReceipt(
    depositId: string, 
    type: 'DEPOSIT' | 'PAYMENT' | 'DELIVERY',
    format: 'A4' | 'A5' | 'CASH_REGISTER' | 'ELECTRONIC'
  ): Promise<ApiResponse<Receipt>> {
    return apiClient.post<Receipt>(`/deposits/${depositId}/receipts`, {
      type,
      format
    });
  }

  // Envoyer un reçu par WhatsApp
  async sendReceiptByWhatsApp(
    receiptId: string, 
    phoneNumber: string
  ): Promise<ApiResponse<{ messageId: string; status: string }>> {
    return apiClient.post<{ messageId: string; status: string }>(
      `/receipts/${receiptId}/send-whatsapp`, 
      { phoneNumber }
    );
  }

  // Envoyer un reçu par email
  async sendReceiptByEmail(
    receiptId: string, 
    email: string
  ): Promise<ApiResponse<{ messageId: string; status: string }>> {
    return apiClient.post<{ messageId: string; status: string }>(
      `/receipts/${receiptId}/send-email`, 
      { email }
    );
  }

  // Récupérer les templates de reçus
  async getReceiptTemplates(): Promise<ApiResponse<ReceiptTemplate[]>> {
    return apiClient.get<ReceiptTemplate[]>('/receipt-templates');
  }

  // Créer un template de reçu
  async createReceiptTemplate(data: Omit<ReceiptTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ReceiptTemplate>> {
    return apiClient.post<ReceiptTemplate>('/receipt-templates', data);
  }

  // Mettre à jour un template de reçu
  async updateReceiptTemplate(id: string, data: Partial<ReceiptTemplate>): Promise<ApiResponse<ReceiptTemplate>> {
    return apiClient.patch<ReceiptTemplate>(`/receipt-templates/${id}`, data);
  }

  // Récupérer les statistiques des dépôts
  async getDepositStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    inProgress: number;
    ready: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  }>> {
    return apiClient.get('/deposits/stats');
  }

  // Récupérer les dépôts d'un client
  async getCustomerDeposits(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Deposit>>> {
    return apiClient.getPaginated<Deposit>(`/customers/${customerId}/deposits`, {
      page,
      limit,
    });
  }

  // Rechercher des clients
  async searchCustomers(query: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
  }>>> {
    return apiClient.get(`/customers/search?q=${encodeURIComponent(query)}`);
  }

  // Payer une échéance
  async payInstallment(
    installmentId: string, 
    amount: number, 
    method: string, 
    notes?: string
  ): Promise<ApiResponse<{ payment: any; installment: any; allPaid: boolean }>> {
    return apiClient.post(`/installments/${installmentId}/pay`, {
      amount,
      method,
      notes
    });
  }

  // Récupérer les échéances d'un dépôt
  async getDepositInstallments(depositId: string): Promise<ApiResponse<Array<{
    id: string;
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: string;
    paymentMethod?: string;
    notes?: string;
  }>>> {
    return apiClient.get(`/deposits/${depositId}/installments`);
  }

  // Créer des échéances pour un dépôt
  async createInstallments(
    depositId: string,
    installmentCount: number,
    installmentAmount: number,
    interval: number
  ): Promise<ApiResponse<Array<any>>> {
    return apiClient.post(`/deposits/${depositId}/installments`, {
      installmentCount,
      installmentAmount,
      interval
    });
  }
}

export const depositsService = new DepositsService();
