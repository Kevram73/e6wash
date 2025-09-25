// API Routes Index
// Ce fichier sert de référence pour toutes les routes API disponibles

export const API_ROUTES = {
  // Authentification
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },

  // Utilisateurs
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },

  // Tenants (Pressings)
  TENANTS: {
    LIST: '/api/tenants',
    CREATE: '/api/tenants',
    GET: (id: string) => `/api/tenants/${id}`,
    UPDATE: (id: string) => `/api/tenants/${id}`,
    DELETE: (id: string) => `/api/tenants/${id}`,
  },

  // Agences
  AGENCIES: {
    LIST: '/api/agencies',
    CREATE: '/api/agencies',
    GET: (id: string) => `/api/agencies/${id}`,
    UPDATE: (id: string) => `/api/agencies/${id}`,
    DELETE: (id: string) => `/api/agencies/${id}`,
  },

  // Clients
  CUSTOMERS: {
    LIST: '/api/customers',
    CREATE: '/api/customers',
    GET: (id: string) => `/api/customers/${id}`,
    UPDATE: (id: string) => `/api/customers/${id}`,
    DELETE: (id: string) => `/api/customers/${id}`,
  },

  // Commandes
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    GET: (id: string) => `/api/orders/${id}`,
    UPDATE: (id: string) => `/api/orders/${id}`,
    DELETE: (id: string) => `/api/orders/${id}`,
  },

  // Services
  SERVICES: {
    LIST: '/api/services',
    CREATE: '/api/services',
    GET: (id: string) => `/api/services/${id}`,
    UPDATE: (id: string) => `/api/services/${id}`,
    DELETE: (id: string) => `/api/services/${id}`,
  },

  // Tâches
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    GET: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },

  // Inventaire
  INVENTORY: {
    LIST: '/api/inventory',
    CREATE: '/api/inventory',
    GET: (id: string) => `/api/inventory/${id}`,
    UPDATE: (id: string) => `/api/inventory/${id}`,
    DELETE: (id: string) => `/api/inventory/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    CREATE: '/api/notifications',
    GET: (id: string) => `/api/notifications/${id}`,
    UPDATE: (id: string) => `/api/notifications/${id}`,
    DELETE: (id: string) => `/api/notifications/${id}`,
  },

  // Conversations
  CONVERSATIONS: {
    LIST: '/api/conversations',
    CREATE: '/api/conversations',
    GET: (id: string) => `/api/conversations/${id}`,
    MESSAGES: (id: string) => `/api/conversations/${id}/messages`,
  },

  // Rapports
  REPORTS: {
    OVERVIEW: '/api/reports?type=overview',
    ORDERS: '/api/reports?type=orders',
    REVENUE: '/api/reports?type=revenue',
    CUSTOMERS: '/api/reports?type=customers',
    INVENTORY: '/api/reports?type=inventory',
    TASKS: '/api/reports?type=tasks',
  },

  // Fidélité
  LOYALTY: {
    SETTINGS: '/api/loyalty?type=settings',
    CUSTOMERS: '/api/loyalty?type=customers',
    TRANSACTIONS: '/api/loyalty?type=transactions',
    GROUPS: '/api/loyalty?type=groups',
    GET: (id: string) => `/api/loyalty/${id}`,
    UPDATE: (id: string) => `/api/loyalty/${id}`,
    DELETE: (id: string) => `/api/loyalty/${id}`,
  },

  // Abonnements
  SUBSCRIPTIONS: {
    LIST: '/api/subscriptions',
    CREATE: '/api/subscriptions',
    GET: (id: string) => `/api/subscriptions/${id}`,
    UPDATE: (id: string) => `/api/subscriptions/${id}`,
    DELETE: (id: string) => `/api/subscriptions/${id}`,
  },

  // Pays
  COUNTRIES: {
    LIST: '/api/countries',
    CREATE: '/api/countries',
  },

  // Fournisseurs
  SUPPLIERS: {
    LIST: '/api/suppliers',
    CREATE: '/api/suppliers',
  },
};

// Types pour les paramètres de requête
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface TenantParams {
  tenantId: string;
  agencyId?: string;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T = any> {
  [key: string]: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
