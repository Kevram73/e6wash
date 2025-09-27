// Types pour l'inscription des nouveaux pressings

export interface RegistrationFormData {
  // Informations du propriétaire
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerPassword: string;
  confirmPassword: string;
  
  // Informations de l'entreprise
  businessName: string;
  businessType: 'INDIVIDUAL' | 'COMPANY' | 'COOPERATIVE';
  businessRegistrationNumber?: string;
  businessAddress: string;
  businessCity: string;
  businessCountry: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string;
  
  // Type de pressing
  pressingType: 'DETAIL' | 'KILO' | 'MIXED';
  
  // Informations bancaires
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  
  // Services proposés
  services: ServiceType[];
  
  // Plan d'abonnement
  subscriptionPlan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  
  // Conditions
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  category: 'WASHING' | 'IRONING' | 'DRY_CLEANING' | 'REPAIR' | 'OTHER';
  price: number;
  description?: string;
  isActive: boolean;
  pricingType: 'DETAIL' | 'KILO'; // Nouveau champ pour le type de tarification
}

export interface BusinessType {
  id: string;
  name: string;
  description: string;
  pricingModel: 'DETAIL' | 'KILO' | 'MIXED';
  features: string[];
  icon: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    tenantId: string;
    userId: string;
    businessId: string;
    activationToken?: string;
  };
  error?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number; // en mois
  features: string[];
  maxUsers: number;
  maxAgencies: number;
  maxCustomers: number;
  storage: string; // ex: "10GB", "unlimited"
  support: string;
  isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Plan Basique',
    price: 15000,
    currency: 'XAF',
    duration: 1,
    features: [
      'Gestion des commandes',
      'Gestion des clients',
      '1 agence',
      '2 utilisateurs',
      'Support email',
      'Stockage 5GB'
    ],
    maxUsers: 2,
    maxAgencies: 1,
    maxCustomers: 100,
    storage: '5GB',
    support: 'Email'
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: 25000,
    currency: 'XAF',
    duration: 1,
    features: [
      'Toutes les fonctionnalités du plan basique',
      'Gestion des paiements échelonnés',
      'Rapports avancés',
      '3 agences',
      '5 utilisateurs',
      'Support téléphonique',
      'Stockage 20GB',
      'Intégration WhatsApp'
    ],
    maxUsers: 5,
    maxAgencies: 3,
    maxCustomers: 500,
    storage: '20GB',
    support: 'Téléphonique',
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Plan Entreprise',
    price: 45000,
    currency: 'XAF',
    duration: 1,
    features: [
      'Toutes les fonctionnalités du plan premium',
      'API personnalisée',
      'Formation personnalisée',
      'Agences illimitées',
      'Utilisateurs illimités',
      'Support prioritaire 24/7',
      'Stockage illimité',
      'Intégrations avancées',
      'Tableau de bord personnalisé'
    ],
    maxUsers: -1, // illimité
    maxAgencies: -1, // illimité
    maxCustomers: -1, // illimité
    storage: 'Illimité',
    support: '24/7'
  }
];

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: 'detail',
    name: 'Pressing au Détail',
    description: 'Chaque article a son prix spécifique (chemise, pantalon, robe, etc.)',
    pricingModel: 'DETAIL',
    features: [
      'Prix par article',
      'Collecte à domicile',
      'Service personnalisé',
      'Suivi détaillé par pièce'
    ],
    icon: 'shirt'
  },
  {
    id: 'kilo',
    name: 'Pressing au Kilo',
    description: 'Facturation au poids pour tous les services',
    pricingModel: 'KILO',
    features: [
      'Prix au kilogramme',
      'Service en vrac',
      'Tarifs compétitifs',
      'Idéal pour les familles'
    ],
    icon: 'scale'
  },
  {
    id: 'mixed',
    name: 'Pressing Mixte',
    description: 'Combinaison des deux systèmes selon les besoins',
    pricingModel: 'MIXED',
    features: [
      'Flexibilité tarifaire',
      'Service adaptatif',
      'Maximum de choix',
      'Clientèle diversifiée'
    ],
    icon: 'layers'
  }
];

export const DEFAULT_SERVICES_DETAIL: ServiceType[] = [
  {
    id: 'shirt-wash',
    name: 'Chemise - Lavage',
    category: 'WASHING',
    price: 800,
    description: 'Lavage d\'une chemise',
    isActive: true,
    pricingType: 'DETAIL'
  },
  {
    id: 'shirt-iron',
    name: 'Chemise - Repassage',
    category: 'IRONING',
    price: 500,
    description: 'Repassage d\'une chemise',
    isActive: true,
    pricingType: 'DETAIL'
  },
  {
    id: 'pants-wash',
    name: 'Pantalon - Lavage',
    category: 'WASHING',
    price: 1200,
    description: 'Lavage d\'un pantalon',
    isActive: true,
    pricingType: 'DETAIL'
  },
  {
    id: 'dress-dry-clean',
    name: 'Robe - Nettoyage à sec',
    category: 'DRY_CLEANING',
    price: 2500,
    description: 'Nettoyage à sec d\'une robe',
    isActive: true,
    pricingType: 'DETAIL'
  }
];

export const DEFAULT_SERVICES_KILO: ServiceType[] = [
  {
    id: 'wash-kilo',
    name: 'Lavage au Kilo',
    category: 'WASHING',
    price: 1500,
    description: 'Lavage facturé au kilogramme',
    isActive: true,
    pricingType: 'KILO'
  },
  {
    id: 'iron-kilo',
    name: 'Repassage au Kilo',
    category: 'IRONING',
    price: 1000,
    description: 'Repassage facturé au kilogramme',
    isActive: true,
    pricingType: 'KILO'
  },
  {
    id: 'dry-clean-kilo',
    name: 'Nettoyage à sec au Kilo',
    category: 'DRY_CLEANING',
    price: 3000,
    description: 'Nettoyage à sec facturé au kilogramme',
    isActive: true,
    pricingType: 'KILO'
  }
];
