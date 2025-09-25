// Index des services API E6Wash

export { apiClient, useApiClient } from './client';
export * from './types';

// Services
export { ordersService } from './services/orders';
export { customersService } from './services/customers';
export { servicesService } from './services/services';
export { collectorsService } from './services/collectors';
export { authService } from './services/auth';
export { tenantsService } from './services/tenants';
export { agenciesService } from './services/agencies';
export { tasksService } from './services/tasks';
export { inventoryService } from './services/inventory';
export { notificationsService } from './services/notifications';
export { reportsService } from './services/reports';
export { promotionsService } from './services/promotions';
export { dashboardService } from './services/dashboard';
export { billingService } from './services/billing';
export { subscriptionsService } from './services/subscriptions';
export { loyaltyService } from './services/loyalty';
export { messagesService } from './services/messages';

// Hooks
export { useApiCrud } from '../../hooks/useApiCrud';
