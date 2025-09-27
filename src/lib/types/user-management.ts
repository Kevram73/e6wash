// Types pour la gestion des utilisateurs et permissions

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number; // 1 = Owner, 2 = Manager, 3 = Employee
  color: string;
  icon: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'DASHBOARD' | 'ORDERS' | 'CUSTOMERS' | 'DEPOSITS' | 'PAYMENTS' | 'REPORTS' | 'USERS' | 'SETTINGS' | 'AGENCIES';
  action: 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'MANAGE';
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  role: UserRole;
  agencyId?: string;
  agency?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  createdBy?: {
    id: string;
    fullname: string;
  };
}

export interface CreateUserData {
  fullname: string;
  email: string;
  phone?: string;
  password: string;
  roleId: string;
  agencyId?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  fullname?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  agencyId?: string;
  isActive?: boolean;
}

export interface UserFormData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  agencyId: string;
  isActive: boolean;
}

// Rôles prédéfinis pour les pressings
export const PREDEFINED_ROLES: UserRole[] = [
  {
    id: 'owner',
    name: 'Propriétaire',
    description: 'Accès complet à toutes les fonctionnalités',
    level: 1,
    color: 'bg-purple-100 text-purple-800',
    icon: 'crown',
    permissions: [
      { id: 'all', name: 'Toutes les permissions', description: 'Accès complet', category: 'DASHBOARD', action: 'MANAGE' }
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Gestion complète d\'une agence',
    level: 2,
    color: 'bg-blue-100 text-blue-800',
    icon: 'user-tie',
    permissions: [
      { id: 'dashboard_view', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord', category: 'DASHBOARD', action: 'VIEW' },
      { id: 'orders_manage', name: 'Gérer les commandes', description: 'Créer, modifier, supprimer les commandes', category: 'ORDERS', action: 'MANAGE' },
      { id: 'customers_manage', name: 'Gérer les clients', description: 'Créer, modifier, supprimer les clients', category: 'CUSTOMERS', action: 'MANAGE' },
      { id: 'deposits_manage', name: 'Gérer les dépôts', description: 'Créer, modifier, supprimer les dépôts', category: 'DEPOSITS', action: 'MANAGE' },
      { id: 'payments_manage', name: 'Gérer les paiements', description: 'Enregistrer et gérer les paiements', category: 'PAYMENTS', action: 'MANAGE' },
      { id: 'reports_view', name: 'Voir les rapports', description: 'Accès aux rapports de l\'agence', category: 'REPORTS', action: 'VIEW' },
      { id: 'users_view', name: 'Voir les utilisateurs', description: 'Voir les utilisateurs de l\'agence', category: 'USERS', action: 'VIEW' }
    ]
  },
  {
    id: 'cashier',
    name: 'Caissier',
    description: 'Gestion des paiements et encaissements',
    level: 3,
    color: 'bg-green-100 text-green-800',
    icon: 'cash-register',
    permissions: [
      { id: 'dashboard_view', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord', category: 'DASHBOARD', action: 'VIEW' },
      { id: 'orders_view', name: 'Voir les commandes', description: 'Consulter les commandes', category: 'ORDERS', action: 'VIEW' },
      { id: 'customers_view', name: 'Voir les clients', description: 'Consulter les clients', category: 'CUSTOMERS', action: 'VIEW' },
      { id: 'deposits_view', name: 'Voir les dépôts', description: 'Consulter les dépôts', category: 'DEPOSITS', action: 'VIEW' },
      { id: 'payments_manage', name: 'Gérer les paiements', description: 'Enregistrer et gérer les paiements', category: 'PAYMENTS', action: 'MANAGE' },
      { id: 'reports_view', name: 'Voir les rapports', description: 'Accès aux rapports de paiements', category: 'REPORTS', action: 'VIEW' }
    ]
  },
  {
    id: 'operator',
    name: 'Opérateur',
    description: 'Gestion des commandes et dépôts',
    level: 3,
    color: 'bg-orange-100 text-orange-800',
    icon: 'user-cog',
    permissions: [
      { id: 'dashboard_view', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord', category: 'DASHBOARD', action: 'VIEW' },
      { id: 'orders_manage', name: 'Gérer les commandes', description: 'Créer, modifier les commandes', category: 'ORDERS', action: 'MANAGE' },
      { id: 'customers_manage', name: 'Gérer les clients', description: 'Créer, modifier les clients', category: 'CUSTOMERS', action: 'MANAGE' },
      { id: 'deposits_manage', name: 'Gérer les dépôts', description: 'Créer, modifier les dépôts', category: 'DEPOSITS', action: 'MANAGE' },
      { id: 'payments_view', name: 'Voir les paiements', description: 'Consulter les paiements', category: 'PAYMENTS', action: 'VIEW' }
    ]
  },
  {
    id: 'collector',
    name: 'Collecteur',
    description: 'Collecte et livraison des commandes',
    level: 3,
    color: 'bg-cyan-100 text-cyan-800',
    icon: 'truck',
    permissions: [
      { id: 'dashboard_view', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord', category: 'DASHBOARD', action: 'VIEW' },
      { id: 'orders_view', name: 'Voir les commandes', description: 'Consulter les commandes assignées', category: 'ORDERS', action: 'VIEW' },
      { id: 'customers_view', name: 'Voir les clients', description: 'Consulter les clients', category: 'CUSTOMERS', action: 'VIEW' },
      { id: 'deposits_view', name: 'Voir les dépôts', description: 'Consulter les dépôts', category: 'DEPOSITS', action: 'VIEW' }
    ]
  },
  {
    id: 'viewer',
    name: 'Observateur',
    description: 'Accès en lecture seule',
    level: 4,
    color: 'bg-gray-100 text-gray-800',
    icon: 'eye',
    permissions: [
      { id: 'dashboard_view', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord', category: 'DASHBOARD', action: 'VIEW' },
      { id: 'orders_view', name: 'Voir les commandes', description: 'Consulter les commandes', category: 'ORDERS', action: 'VIEW' },
      { id: 'customers_view', name: 'Voir les clients', description: 'Consulter les clients', category: 'CUSTOMERS', action: 'VIEW' },
      { id: 'deposits_view', name: 'Voir les dépôts', description: 'Consulter les dépôts', category: 'DEPOSITS', action: 'VIEW' },
      { id: 'payments_view', name: 'Voir les paiements', description: 'Consulter les paiements', category: 'PAYMENTS', action: 'VIEW' },
      { id: 'reports_view', name: 'Voir les rapports', description: 'Accès aux rapports', category: 'REPORTS', action: 'VIEW' }
    ]
  }
];

// Permissions par catégorie
export const PERMISSION_CATEGORIES = {
  DASHBOARD: 'Tableau de bord',
  ORDERS: 'Commandes',
  CUSTOMERS: 'Clients',
  DEPOSITS: 'Dépôts',
  PAYMENTS: 'Paiements',
  REPORTS: 'Rapports',
  USERS: 'Utilisateurs',
  SETTINGS: 'Paramètres',
  AGENCIES: 'Agences'
};

export const PERMISSION_ACTIONS = {
  VIEW: 'Voir',
  CREATE: 'Créer',
  EDIT: 'Modifier',
  DELETE: 'Supprimer',
  MANAGE: 'Gérer'
};
