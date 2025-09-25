// Types pour les APIs E6Wash

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les nouvelles entités
export interface Tenant {
  id: string;
  name: string;
  subdomain?: string;
  domain?: string;
  logo?: string;
  settings?: any;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateTenantData {
  name: string;
  subdomain?: string;
  domain?: string;
  logo?: string;
  settings?: any;
  status?: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

export interface UpdateTenantData {
  name?: string;
  subdomain?: string;
  domain?: string;
  logo?: string;
  settings?: any;
  status?: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

export interface Agency {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  countryId: string;
  city: string;
  isActive: boolean;
  isMainAgency: boolean;
  code: string;
  settings?: any;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateAgencyData {
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  countryId: string;
  city: string;
  isActive?: boolean;
  isMainAgency?: boolean;
  code: string;
  settings?: any;
  capacity?: number;
}

export interface UpdateAgencyData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  countryId?: string;
  city?: string;
  isActive?: boolean;
  isMainAgency?: boolean;
  code?: string;
  settings?: any;
  capacity?: number;
}

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  assignedToId?: string;
  createdById: string;
  completedAt?: string;
  completedById?: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  tenantId: string;
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  assignedToId?: string;
  createdById: string;
  tags?: string[];
  estimatedHours?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  assignedToId?: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
  completedById?: string;
}

export interface Inventory {
  id: string;
  tenantId: string;
  name: string;
  category: 'DETERGENT' | 'SOFTENER' | 'BLEACH' | 'STARCH' | 'EQUIPMENT' | 'SUPPLIES' | 'OTHER';
  currentStock: number;
  minStock: number;
  unit: string;
  unitPrice: number;
  supplier?: string;
  isLowStock: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryData {
  tenantId: string;
  name: string;
  category: 'DETERGENT' | 'SOFTENER' | 'BLEACH' | 'STARCH' | 'EQUIPMENT' | 'SUPPLIES' | 'OTHER';
  currentStock?: number;
  minStock?: number;
  unit: string;
  unitPrice: number;
  supplier?: string;
  isLowStock?: boolean;
  notes?: string;
}

export interface UpdateInventoryData {
  name?: string;
  category?: 'DETERGENT' | 'SOFTENER' | 'BLEACH' | 'STARCH' | 'EQUIPMENT' | 'SUPPLIES' | 'OTHER';
  currentStock?: number;
  minStock?: number;
  unit?: string;
  unitPrice?: number;
  supplier?: string;
  isLowStock?: boolean;
  notes?: string;
}

export interface Notification {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  icon?: string;
  link?: string;
  userId?: string;
  createdById: string;
  relatedType?: string;
  relatedId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface CreateNotificationData {
  tenantId: string;
  title: string;
  content: string;
  level?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  icon?: string;
  link?: string;
  userId?: string;
  createdById: string;
  relatedType?: string;
  relatedId?: string;
  isRead?: boolean;
}

export interface UpdateNotificationData {
  title?: string;
  content?: string;
  level?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  icon?: string;
  link?: string;
  isRead?: boolean;
  readAt?: string;
}

// Types d'entités
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  pressingId?: string;
  agenceId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pressing {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: Address;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionExpiresAt: string;
  totalAgences: number;
  totalUsers: number;
  totalOrders: number;
  monthlyRevenue: number;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface Agence {
  id: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  isActive: boolean;
  totalUsers: number;
  totalOrders: number;
  monthlyRevenue: number;
  createdAt: string;
  lastActivity: string;
}

export interface Collector {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  availability: string;
  currentLocation: string;
  totalMissions: number;
  completedMissions: number;
  successRate: number;
  averageRating: number;
  totalEarnings: number;
  lastMission: Date;
  joinedAt: Date;
  vehicle: Vehicle;
  workingHours: string;
  notes: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectionType: CollectionType;
  collectionDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  dueDate: string;
  completedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  applicableServices: string[];
  createdAt: string;
  updatedAt: string;
}

// Types utilitaires
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Vehicle {
  type: string;
  plate: string;
  model: string;
}

// Enums
export type UserRole = 'SUPER_ADMIN' | 'PRESSING_ADMIN' | 'ADMIN' | 'OWNER' | 'AGENT' | 'CAISSIER' | 'COLLECTOR' | 'CLIENT';

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'mobile_money' | 'card' | 'cash' | 'wallet';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type CollectionType = 'pickup' | 'dropoff';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PromotionType = 'percentage' | 'fixed_amount' | 'free_delivery' | 'buy_one_get_one';

// Types pour les requêtes
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  pressingId?: string;
  agenceId?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateOrderRequest {
  customerId: string;
  serviceId: string;
  collectionType: CollectionType;
  collectionDate: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  actualDelivery?: string;
  notes?: string;
}

// Types pour les filtres
export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  pressingId?: string;
  agenceId?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  createdBy?: string;
}
