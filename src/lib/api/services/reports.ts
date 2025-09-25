// Service API pour les rapports

import { apiClient } from '../client';
import { 
  Report, 
  ApiResponse,
  PaginatedResponse 
} from '../types';

export interface CreateReportRequest {
  tenantId: string;
  name: string;
  type: string;
  parameters: any;
  generatedBy: string;
}

export interface ReportFilters {
  tenantId?: string;
  agencyId?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
}

export interface ReportParams {
  tenantId: string;
  agencyId?: string;
  startDate?: string;
  endDate?: string;
}

export class ReportsService {
  // Méthode générique pour le hook useApiCrudSimple
  async getItems(params?: any): Promise<ApiResponse<PaginatedResponse<Report>>> {
    return this.getReports(
      params?.page || 1,
      params?.limit || 10,
      params
    );
  }

  // Récupérer tous les rapports avec pagination et filtres
  async getReports(
    page: number = 1,
    limit: number = 10,
    filters?: ReportFilters
  ): Promise<ApiResponse<PaginatedResponse<Report>>> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.getPaginated<Report>('/reports', params);
  }

  // Récupérer un rapport par ID
  async getReport(id: string): Promise<ApiResponse<Report>> {
    return apiClient.get<Report>(`/reports/${id}`);
  }

  // Méthodes génériques pour le hook useApiCrudSimple
  async createItem(data: any): Promise<ApiResponse<Report>> {
    return this.createReport(data);
  }

  async updateItem(id: string, data: any): Promise<ApiResponse<Report>> {
    return this.updateReport(id, data);
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.deleteReport(id);
  }

  // Créer un nouveau rapport
  async createReport(data: CreateReportRequest): Promise<ApiResponse<Report>> {
    return apiClient.post<Report>('/reports', data);
  }

  // Mettre à jour un rapport
  async updateReport(id: string, data: Partial<CreateReportRequest>): Promise<ApiResponse<Report>> {
    return apiClient.patch<Report>(`/reports/${id}`, data);
  }

  // Supprimer un rapport
  async deleteReport(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/reports/${id}`);
  }

  // Générer un rapport de données
  async generateReport(type: 'overview' | 'orders' | 'revenue' | 'customers' | 'inventory' | 'tasks', params: ReportParams): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    searchParams.append('type', type);
    if (params.tenantId) searchParams.append('tenantId', params.tenantId);
    if (params.agencyId) searchParams.append('agencyId', params.agencyId);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    return apiClient.get(`/reports?${searchParams.toString()}`);
  }

  // Rapport de vue d'ensemble
  async getOverviewReport(params: ReportParams): Promise<ApiResponse<any>> {
    return this.generateReport('overview', params);
  }

  // Rapport des commandes
  async getOrdersReport(params: ReportParams): Promise<ApiResponse<any>> {
    return this.generateReport('orders', params);
  }

  // Rapport des revenus
  async getRevenueReport(params: ReportParams): Promise<ApiResponse<any>> {
    return this.generateReport('revenue', params);
  }

  // Rapport des clients
  async getCustomersReport(params: ReportParams): Promise<ApiResponse<any>> {
    return this.generateReport('customers', params);
  }

  // Rapport de l'inventaire
  async getInventoryReport(params: ReportParams): Promise<ApiResponse<any>> {
    return this.generateReport('inventory', params);
  }

  // Rapport des tâches
  async getTasksReport(params: ReportParams): Promise<ApiResponse<any>> {
    return this.generateReport('tasks', params);
  }

  // Exporter un rapport
  async exportReport(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<ApiResponse<Blob>> {
    return apiClient.get(`/reports/${id}/export?format=${format}`, {
      responseType: 'blob'
    });
  }

  // Récupérer les statistiques des rapports
  async getReportStats(): Promise<ApiResponse<{
    total: number;
    byType: { [key: string]: number };
    recent: Report[];
    mostGenerated: Report[];
  }>> {
    return apiClient.get('/reports/stats');
  }
}

export const reportsService = new ReportsService();
