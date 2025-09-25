// Types pour la plateforme SaaS E6Wash

// ===== RÔLES ET AUTHENTIFICATION =====
export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'PRESSING_ADMIN' 
  | 'ADMIN' 
  | 'OWNER' 
  | 'AGENT' 
  | 'CAISSIER' 
  | 'COLLECTOR' 
  | 'CLIENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  pressingId?: string; // null pour super_admin
  agenceId?: string; // null pour super_admin et pressing_admin
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== STRUCTURE MULTI-TENANT =====
export interface Pressing {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: Address;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  subscriptionExpiresAt: string;
  settings: PressingSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Agence {
  id: string;
  pressingId: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// ===== ABONNEMENTS SAAS =====
export interface SubscriptionPlan {
  id: string;
  name: string; // 'basic', 'premium', 'enterprise'
  price: number; // prix mensuel en FCFA
  maxAgences: number;
  maxUsers: number;
  maxOrdersPerMonth: number;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  pressingId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'suspended' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== SERVICES ET TARIFS =====
export interface Service {
  id: string;
  pressingId: string;
  name: string;
  type: 'detail' | 'kilo';
  price: number;
  description: string;
  estimatedTime: string; // en heures
  isActive: boolean;
  category: 'washing' | 'ironing' | 'dry_cleaning' | 'repair';
  createdAt: string;
  updatedAt: string;
}

// ===== COMMANDES =====
export interface Order {
  id: string;
  pressingId: string;
  agenceId: string;
  clientId: string;
  client: User;
  serviceId: string;
  service: Service;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectionType: 'pickup' | 'dropoff';
  collectionAddress: Address;
  collectionDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  assignedCollectorId?: string;
  assignedCollector?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: 'shirt' | 'pants' | 'dress' | 'suit' | 'coat' | 'other';
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'pending'        // En attente de confirmation
  | 'confirmed'      // Confirmé par l'agence
  | 'in_progress'    // En cours de traitement
  | 'ready'          // Prêt pour livraison
  | 'out_for_delivery' // En cours de livraison
  | 'delivered'      // Livré
  | 'cancelled';     // Annulé

// ===== PAIEMENTS =====
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 
  | 'mobile_money'   // Mobile Money
  | 'card'           // Carte bancaire
  | 'cash'           // Espèces
  | 'wallet';        // Wallet interne

export type PaymentStatus = 
  | 'pending'        // En attente
  | 'paid'           // Payé
  | 'failed'         // Échec
  | 'refunded';      // Remboursé

// ===== MISSIONS COLLECTE/LIVRAISON =====
export interface Mission {
  id: string;
  pressingId: string;
  agenceId: string;
  collectorId: string;
  collector: User;
  orderId: string;
  order: Order;
  type: MissionType;
  status: MissionStatus;
  scheduledTime: string;
  actualTime?: string;
  notes?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type MissionType = 'pickup' | 'delivery';
export type MissionStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';

// ===== STOCK ET INVENTAIRE =====
export interface StockItem {
  id: string;
  pressingId: string;
  agenceId: string;
  name: string;
  category: 'detergent' | 'bag' | 'hanger' | 'equipment' | 'other';
  currentStock: number;
  minStock: number;
  unit: 'kg' | 'liter' | 'piece' | 'box';
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== FINANCES =====
export interface FinancialRecord {
  id: string;
  pressingId: string;
  agenceId?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  orderId?: string;
  date: string;
  createdAt: string;
}

// ===== PROMOTIONS =====
export interface Promotion {
  id: string;
  pressingId: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

// ===== PARAMÈTRES PRESSING =====
export interface PressingSettings {
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  deliveryRadius: number; // en km
  autoAssignCollectors: boolean;
  allowOnlinePayment: boolean;
  allowCashPayment: boolean;
  currency: string;
  timezone: string;
}

// ===== STATISTIQUES ET RAPPORTS =====
export interface DashboardStats {
  // Super Admin
  totalPressings?: number;
  totalRevenue?: number;
  activeSubscriptions?: number;
  
  // Pressing Admin
  totalOrders?: number;
  totalRevenue?: number;
  activeAgences?: number;
  pendingOrders?: number;
  completedOrdersToday?: number;
  revenueToday?: number;
  revenueThisMonth?: number;
  averageOrderValue?: number;
  customerSatisfaction?: number;
}

// ===== CONTEXTES D'AUTHENTIFICATION =====
export interface AuthContextType {
  user: User | null;
  pressing: Pressing | null;
  agence: Agence | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// ===== TYPES POUR LA NAVIGATION =====
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Orders: undefined;
  Customers: undefined;
  Collectors: undefined;
  Agences: undefined;
  Services: undefined;
  Promotions: undefined;
  Inventory: undefined;
  Finance: undefined;
  Reports: undefined;
  Settings: undefined;
  Profile: undefined;
};

// ===== TYPES POUR LES FILTRES ET PAGINATION =====
export interface FilterOptions {
  status?: OrderStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  collectorId?: string;
  serviceType?: string;
  paymentStatus?: PaymentStatus[];
  pressingId?: string;
  agenceId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}