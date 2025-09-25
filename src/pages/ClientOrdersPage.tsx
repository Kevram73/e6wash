'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { ordersService } from '@/lib/api/services/orders';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Truck,
  Star
} from 'lucide-react';

const ClientOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    items: orders,
    isLoading,
    error
  } = useApiCrudSimple({ service: ordersService, entityName: 'order' });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'READY_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'IN_PROGRESS':
        return 'En cours de traitement';
      case 'READY_FOR_DELIVERY':
        return 'Prêt à livrer';
      case 'COMPLETED':
        return 'Terminé';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'READY_FOR_DELIVERY':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-[#737373]" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Payé';
      case 'PENDING':
        return 'En attente';
      case 'FAILED':
        return 'Échoué';
      case 'REFUNDED':
        return 'Remboursé';
      default:
        return status;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const totalSpent = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const averageRating = orders
    .filter(o => o.rating)
    .reduce((sum, o) => sum + o.rating!, 0) / orders.filter(o => o.rating).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Mes Commandes</h1>
          <p className="text-[#525252] mt-1">
            Suivi de vos commandes et historique
          </p>
        </div>
        <UpworkButton className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Commande
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Commandes</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{totalOrders}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Commandes Terminées</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{completedOrders}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Dépensé</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Note Moyenne</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{averageRating.toFixed(1)}/5</p>
              </div>
            </div>
          
        </UpworkCard>
      </div>

      {/* Filters */}
      <UpworkCard>
        
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro de commande ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#a3a3a3]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="READY_FOR_DELIVERY">Prêt à livrer</option>
                <option value="COMPLETED">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <UpworkCard key={order.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    </div>
                    <span className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </span>
                    <span className={getPaymentStatusColor(order.paymentStatus)}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                    {order.rating && (
                      <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {order.rating}/5
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Service & Montant</p>
                      <p className="font-medium">{order.service}</p>
                      <p className="text-lg font-bold text-[#2c2c2c]">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-[#525252]">{order.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Collection</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">
                          {order.collectionType === 'COLLECTION' ? 'À domicile' : 'Dépôt agence'}
                        </p>
                      </div>
                      <p className="text-[#525252]">{order.collectionAddress}</p>
                      <p className="text-[#525252]">{formatDateTime(order.collectionDate)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Livraison & Paiement</p>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{formatDateTime(order.deliveryDate)}</p>
                      </div>
                      <p className="text-[#525252]">{getPaymentMethodText(order.paymentMethod)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Collecteur</p>
                      {order.collector ? (
                        <>
                          <p className="font-medium">{order.collector.name}</p>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-[#a3a3a3]" />
                            <p className="text-[#525252]">{order.collector.phone}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <p className="text-[#525252]">{order.collector.rating}/5</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-[#525252]">Non assigné</p>
                      )}
                    </div>
                  </div>
                  
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 p-3 bg-[#f7f7f7] rounded-md">
                      <p className="text-sm font-medium text-[#525252] mb-2">Articles:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="text-sm text-[#525252]">
                            • {item.name} ({item.quantity} pièces) - {formatCurrency(item.price)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.review && (
                    <div className="mt-3 p-3 bg-[#f0fdf4] rounded-md">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Votre avis:</span> {order.review}
                      </p>
                    </div>
                  )}

                  {order.cancellationReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Raison d'annulation:</span> {order.cancellationReason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center space-y-2 ml-4">
                  <div className="text-center">
                    <p className="text-xs text-[#525252]">Créée le</p>
                    <p className="text-sm font-medium">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <UpworkButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </UpworkButton>
                    {order.status === 'COMPLETED' && !order.rating && (
                      <UpworkButton size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Noter
                      </UpworkButton>
                    )}
                    {order.status === 'PENDING' && (
                      <UpworkButton size="sm" className="bg-red-600 hover:bg-red-700">
                        Annuler
                      </UpworkButton>
                    )}
                    {order.status === 'READY_FOR_DELIVERY' && (
                      <UpworkButton size="sm" className="bg-green-600 hover:bg-green-700">
                        Confirmer réception
                      </UpworkButton>
                    )}
                  </div>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <UpworkCard>
          
            <Package className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune commande trouvée</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune commande ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore passé de commande.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <UpworkButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Passer ma première commande
              </UpworkButton>
            )}
          
        </UpworkCard>
      )}
    </div>
  );
};

export default ClientOrdersPage;
