// Types pour le système de dépôt au pressing

export interface DepositItem {
  id: string;
  name: string;
  category: 'WASHING' | 'IRONING' | 'DRY_CLEANING' | 'REPAIR' | 'OTHER';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  specialInstructions?: string;
  estimatedDeliveryDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'DELIVERED' | 'CANCELLED';
}

export interface PaymentInstallment {
  id: string;
  depositId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentMethod?: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deposit {
  id: string;
  depositNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  agencyId: string;
  agencyName: string;
  tenantId: string;
  tenantName: string;
  
  // Informations de collecte
  collectionAddress: string;
  collectionDate: Date;
  collectionTime: string;
  collectionNotes?: string;
  
  // Informations de livraison
  deliveryAddress: string;
  deliveryDate?: Date;
  deliveryTime?: string;
  deliveryNotes?: string;
  
  // Articles déposés
  items: DepositItem[];
  
  // Calculs financiers
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  
  // Paiement échelonné
  isInstallmentPayment: boolean;
  installmentCount: number;
  installmentAmount: number;
  installments: PaymentInstallment[];
  
  // Statut et paiement
  status: 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'READY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'INSTALLMENT';
  paymentMethod?: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER';
  
  // Métadonnées
  createdById: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Reçus générés
  receipts: Receipt[];
}

export interface Receipt {
  id: string;
  depositId: string;
  type: 'DEPOSIT' | 'PAYMENT' | 'DELIVERY';
  format: 'A4' | 'A5' | 'CASH_REGISTER' | 'ELECTRONIC';
  status: 'GENERATED' | 'SENT' | 'DELIVERED' | 'FAILED';
  
  // Contenu du reçu
  content: string; // HTML ou texte formaté
  pdfUrl?: string; // URL du PDF généré
  
  // Envoi électronique
  sentTo?: string; // Email ou numéro WhatsApp
  sentAt?: Date;
  deliveryStatus?: 'PENDING' | 'DELIVERED' | 'FAILED';
  
  // Métadonnées
  generatedAt: Date;
  generatedBy: string;
}

export interface ReceiptTemplate {
  id: string;
  name: string;
  type: 'DEPOSIT' | 'PAYMENT' | 'DELIVERY';
  format: 'A4' | 'A5' | 'CASH_REGISTER' | 'ELECTRONIC';
  template: string; // Template HTML
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppMessage {
  to: string; // Numéro de téléphone
  message: string;
  mediaUrl?: string; // URL du PDF ou image
  type: 'TEXT' | 'DOCUMENT' | 'IMAGE';
}

export interface DepositFormData {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  collectionAddress: string;
  collectionDate: Date;
  collectionTime: string;
  collectionNotes?: string;
  deliveryAddress: string;
  deliveryDate?: Date;
  deliveryTime?: string;
  deliveryNotes?: string;
  items: Omit<DepositItem, 'id' | 'totalPrice' | 'status'>[];
  paymentMethod?: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER';
  paidAmount: number;
  discountAmount: number;
  specialInstructions?: string;
  isInstallmentPayment?: boolean;
  installmentCount?: number;
  installmentInterval?: number; // en jours
}
