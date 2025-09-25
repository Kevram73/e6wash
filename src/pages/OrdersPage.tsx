'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { ordersService } from '@/lib/api/services/orders';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusColor, getStatusText } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentMethod: 'mobile_money' | 'card' | 'cash' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  collectionType: 'pickup' | 'dropoff';
  collectionDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Les données sont maintenant récupérées via l'API

  const {
    items: orders,
    selectedItem,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleView,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    setItems
  } = useApiCrudSimple({ service: ordersService, entityName: 'order' });

  // Fonction refresh temporaire
  const refreshData = () => {
    console.log('Refresh clicked');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Order>>({
    orderNumber: '',
    customerName: '',
    customerPhone: '',
    serviceName: '',
    status: 'pending',
    totalAmount: 0,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    collectionType: 'pickup',
    collectionDate: '',
    estimatedDelivery: '',
    notes: '',
    createdAt: new Date().toISOString().split('T')[0]
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Order, 'id'>);
    }
    
    // Reset form
    setFormData({
      orderNumber: '',
      customerName: '',
      customerPhone: '',
      serviceName: '',
      status: 'pending',
      totalAmount: 0,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      collectionType: 'pickup',
      collectionDate: '',
      estimatedDelivery: '',
      notes: '',
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditClick = (order: Order) => {
    setFormData(order);
    openEditModal(order);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Package className="h-4 w-4" />;
      case 'PROCESSING':
        return <Clock className="h-4 w-4" />;
      case 'READY':
        return <CheckCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Espèces';
      case 'MOBILE_MONEY':
        return 'Mobile Money';
      case 'CARD':
        return 'Carte bancaire';
      case 'BANK_TRANSFER':
        return 'Virement bancaire';
      case 'WALLET':
        return 'Wallet interne';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600 mt-1">
            Gestion des commandes et suivi des statuts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <UpworkButton variant="outline" className="flex items-center" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </UpworkButton>
          <UpworkButton className="flex items-center" onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Commande
          </UpworkButton>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <UpworkCard>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14a800] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des commandes...</p>
          </div>
        </UpworkCard>
      )}

      {/* Error State */}
      {error && (
        <UpworkCard>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Erreur:</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </UpworkCard>
      )}

      {/* Filters - Upwork Style */}
      <UpworkCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par numéro, client ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-[#a3a3a3]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#2c2c2c] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
            >
              <option value="all">Tous les statuts</option>
              <option value="NEW">Nouveau</option>
              <option value="PROCESSING">En cours</option>
              <option value="READY">Prêt</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        </div>
      </UpworkCard>

      {/* Orders List - Upwork Style */}
      {filteredOrders.length === 0 ? (
        <UpworkCard>
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Aucune commande trouvée</h3>
            <p className="text-[#525252] mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune commande ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre première commande.'
              }
            </p>
            <UpworkButton onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Commande
            </UpworkButton>
          </div>
        </UpworkCard>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
          <UpworkCard key={order.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <h3 className="font-semibold text-lg text-[#2c2c2c]">{order.orderNumber}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.paymentStatus === 'PAID' 
                      ? 'bg-[#f0fdf4] text-[#14a800] border border-[#bbf7d0]' 
                      : 'bg-[#fef3c7] text-[#d97706] border border-[#fde68a]'
                  }`}>
                    {getStatusText(order.paymentStatus)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[#737373]">Client</p>
                    <p className="font-medium text-[#2c2c2c]">{order.customerName}</p>
                    <p className="text-[#525252]">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-[#737373]">Service</p>
                    <p className="font-medium text-[#2c2c2c]">{order.service}</p>
                  </div>
                  <div>
                    <p className="text-[#737373]">Montant</p>
                    <p className="font-medium text-lg text-[#2c2c2c]">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-[#525252]">{getPaymentMethodText(order.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-[#737373]">Dates</p>
                    <p className="text-[#525252]">Créé: {formatDateTime(order.createdAt)}</p>
                    <p className="text-[#525252]">Livraison: {formatDateTime(order.deliveryDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <UpworkButton variant="outline" size="sm" onClick={() => handleView(order)}>
                  <Eye className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(order)}>
                  <Edit className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton variant="outline" size="sm" className="text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fef2f2]" onClick={() => openDeleteModal(order)}>
                  <Trash2 className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>
          </UpworkCard>
        ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
