'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { promotionsService } from '@/lib/api/services/promotions';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Gift,
  Calendar,
  Users,
  Percent,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  X
} from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'buy_one_get_one';
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

const PromotionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Utilisation de l'API au lieu des données mock
  const {
    items: promotions,
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
  } = useApiCrudSimple({ service: promotionsService, entityName: 'promotion' });


  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && promotion.isActive) ||
                         (statusFilter === 'inactive' && !promotion.isActive);
    
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: 0,
    usedCount: 0,
    applicableServices: [],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Promotion, 'id'>);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      usageLimit: 0,
      usedCount: 0,
      applicableServices: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditClick = (promotion: Promotion) => {
    setFormData(promotion);
    openEditModal(promotion);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'SCHEDULED':
        return 'Programmée';
      case 'EXPIRED':
        return 'Expirée';
      case 'PAUSED':
        return 'En pause';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-[#737373]" />;
      case 'PAUSED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-[#737373]" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Pourcentage';
      case 'FIXED_AMOUNT':
        return 'Montant fixe';
      case 'FREE_SHIPPING':
        return 'Livraison gratuite';
      default:
        return type;
    }
  };

  const getTargetAudienceText = (audience: string) => {
    switch (audience) {
      case 'ALL_CUSTOMERS':
        return 'Tous les clients';
      case 'NEW_CUSTOMERS':
        return 'Nouveaux clients';
      case 'LOYAL_CUSTOMERS':
        return 'Clients fidèles';
      case 'STUDENTS':
        return 'Étudiants';
      case 'FAMILIES':
        return 'Familles';
      default:
        return audience;
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const activePromotions = promotions.filter(p => p.status === 'ACTIVE').length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usedCount, 0);
  const scheduledPromotions = promotions.filter(p => p.status === 'SCHEDULED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Promotions</h1>
          <p className="text-[#525252] mt-1">
            Gestion des promotions et codes de réduction
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Promotion
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Promotions</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{promotions.length}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Promotions Actives</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{activePromotions}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Programmées</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{scheduledPromotions}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Utilisations Total</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{totalUsage}</p>
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
                  placeholder="Rechercher par nom, description ou code..."
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
                <option value="ACTIVE">Active</option>
                <option value="SCHEDULED">Programmée</option>
                <option value="EXPIRED">Expirée</option>
                <option value="PAUSED">En pause</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="PERCENTAGE">Pourcentage</option>
                <option value="FIXED_AMOUNT">Montant fixe</option>
                <option value="FREE_SHIPPING">Livraison gratuite</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Promotions List */}
      <div className="grid gap-4">
        {filteredPromotions.map((promotion) => (
          <UpworkCard key={promotion.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(promotion.status)}
                      <h3 className="font-semibold text-lg">{promotion.name}</h3>
                    </div>
                    <span className={getStatusColor(promotion.status)}>
                      {getStatusText(promotion.status)}
                    </span>
                    <span variant="outline">
                      {promotion.code}
                    </span>
                    <span variant="outline" className="flex items-center">
                      {promotion.type === 'PERCENTAGE' ? (
                        <Percent className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {promotion.type === 'PERCENTAGE' ? `${promotion.value}%` : formatCurrency(promotion.value)}
                    </span>
                  </div>
                  
                  <p className="text-[#525252] mb-4">{promotion.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Détails de la réduction</p>
                      <p className="font-medium">
                        {promotion.type === 'PERCENTAGE' ? `${promotion.value}%` : formatCurrency(promotion.value)}
                      </p>
                      <p className="text-[#525252]">Min: {formatCurrency(promotion.minOrderAmount)}</p>
                      <p className="text-[#525252]">Max: {formatCurrency(promotion.maxDiscount)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Période</p>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">Du {formatDate(promotion.startDate)}</p>
                      </div>
                      <p className="text-[#525252]">Au {formatDate(promotion.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Utilisation</p>
                      <p className="font-medium">{promotion.usedCount} utilisations</p>
                      <p className="text-[#525252]">
                        {promotion.usageLimit ? `Limite: ${promotion.usageLimit}` : 'Sans limite'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Cible & Services</p>
                      <p className="font-medium">{getTargetAudienceText(promotion.targetAudience)}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {promotion.applicableServices.slice(0, 2).map((service, index) => (
                          <span key={index} variant="outline" className="text-xs">
                            {service}
                          </span>
                        ))}
                        {promotion.applicableServices.length > 2 && (
                          <span variant="outline" className="text-xs">
                            +{promotion.applicableServices.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(promotion)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(promotion)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(promotion)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <UpworkCard>
          
            <Gift className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune promotion trouvée</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Aucune promotion ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre première promotion.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <UpworkButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer une promotion
              </UpworkButton>
            )}
          
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom de la promotion"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Type de promotion
              </label>
              <select
                value={formData.type || 'percentage'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Promotion['type'] }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="percentage">Pourcentage</option>
                <option value="fixed_amount">Montant fixe</option>
                <option value="free_delivery">Livraison gratuite</option>
                <option value="buy_one_get_one">Achetez 1, obtenez 1</option>
              </select>
            </div>
            <UpworkInput
              label="Valeur"
              type="number"
              value={formData.value || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
              required
            />
            <UpworkInput
              label="Montant minimum de commande"
              type="number"
              value={formData.minOrderAmount || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
            />
            <UpworkInput
              label="Montant maximum de réduction"
              type="number"
              value={formData.maxDiscountAmount || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: Number(e.target.value) }))}
            />
            <UpworkInput
              label="Limite d'utilisation"
              type="number"
              value={formData.usageLimit || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
            />
            <UpworkInput
              label="Date de début"
              type="datetime-local"
              value={formData.startDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <UpworkInput
              label="Date de fin"
              type="datetime-local"
              value={formData.endDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              placeholder="Description de la promotion..."
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
            <UpworkButton variant="outline" onClick={closeModals}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </UpworkButton>
            <UpworkButton type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Sauvegarde...' : (isEditModalOpen ? 'Modifier' : 'Créer')}
            </UpworkButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={() => selectedItem && handleDelete(selectedItem.id)}
        title="Supprimer la Promotion"
        message={`Êtes-vous sûr de vouloir supprimer la promotion "${selectedItem?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={isLoading}
      />

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
