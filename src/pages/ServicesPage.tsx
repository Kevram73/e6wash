'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { servicesService } from '@/lib/api/services/services';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Settings,
  Clock,
  DollarSign,
  Package,
  Star,
  TrendingUp,
  Save,
  X
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  type?: 'DETAIL' | 'KILO';
  price: number;
  description: string;
  estimatedTime?: string;
  isActive: boolean;
  category: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
  // Optional fields for display
  status?: string;
  basePrice?: number;
  unit?: string;
  estimatedDuration?: number;
  totalOrders?: number;
  monthlyRevenue?: number;
  popularity?: number;
}

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  

  const {
    items: services,
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
  } = useApiCrudSimple({ service: servicesService, entityName: 'service' });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'ACTIVE' && service.isActive) ||
                         (statusFilter === 'INACTIVE' && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    type: 'DETAIL',
    price: 0,
    description: '',
    estimatedTime: '',
    isActive: true,
    category: 'WASHING',
    features: []
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Service, 'id'>);
    }
    
    // Reset form
    setFormData({
      name: '',
      type: 'DETAIL',
      price: 0,
      description: '',
      estimatedTime: '',
      isActive: true,
      category: 'WASHING',
      features: []
    });
  };

  const handleEditClick = (service: Service) => {
    setFormData(service);
    openEditModal(service);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'INACTIVE':
        return 'Inactif';
      case 'MAINTENANCE':
        return 'Maintenance';
      default:
        return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'WASHING':
        return 'bg-blue-100 text-blue-800';
      case 'IRONING':
        return 'bg-purple-100 text-purple-800';
      case 'DRY_CLEANING':
        return 'bg-green-100 text-green-800';
      case 'REPAIR':
        return 'bg-yellow-100 text-yellow-800';
      case 'OTHER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'WASHING':
        return 'Lavage';
      case 'IRONING':
        return 'Repassage';
      case 'DRY_CLEANING':
        return 'Nettoyage à sec';
      case 'REPAIR':
        return 'Réparation';
      case 'OTHER':
        return 'Autre';
      default:
        return category;
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

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Services</h1>
          <p className="text-[#525252] mt-1">
            Gestion des services et tarifs
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Services</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{services.length}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Services Actifs</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Commandes</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {services.reduce((sum, s) => sum + (s.totalOrders || 0), 0)}
                </p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">CA Mensuel</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {formatCurrency(services.reduce((sum, s) => sum + (s.monthlyRevenue || 0), 0))}
                </p>
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
                  placeholder="Rechercher par nom, description ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#a3a3a3]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{getCategoryName(category)}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Services List */}
      <div className="grid gap-4">
        {filteredServices.map((service) => (
          <UpworkCard key={service.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-[#a3a3a3]" />
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                    </div>
                    <span className={getCategoryColor(service.category)}>
                      {getCategoryName(service.category)}
                    </span>
                    <span className={getStatusColor(service.isActive ? 'ACTIVE' : 'INACTIVE')}>
                      {getStatusText(service.isActive ? 'ACTIVE' : 'INACTIVE')}
                    </span>
                    <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-medium">
                      <Star className="h-3 w-3 mr-1" />
                      {service.popularity || 0}%
                    </span>
                  </div>
                  
                  <p className="text-[#525252] mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Tarif & Durée</p>
                      <p className="font-medium">{formatCurrency(service.price)} / {service.unit || 'unité'}</p>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{service.estimatedTime || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Statistiques</p>
                      <p className="font-medium">{service.totalOrders || 0} commandes</p>
                      <p className="text-[#525252]">{formatCurrency(service.monthlyRevenue || 0)}/mois</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Fonctionnalités</p>
                      <div className="flex flex-wrap gap-1">
                        {(service.features || []).slice(0, 2).map((feature: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-medium">
                            {feature}
                          </span>
                        ))}
                        {(service.features || []).length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-medium">
                            +{(service.features || []).length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Dernière mise à jour</p>
                      <p className="text-[#525252]">
                        {service.updatedAt ? formatDateTime(new Date(service.updatedAt)) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="mt-3 p-3 bg-[#f7f7f7] rounded-md">
                      <p className="text-sm text-[#525252]">
                        <span className="font-medium">Fonctionnalités:</span> {service.features.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(service)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(service)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(service)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <UpworkCard>
          
            <Settings className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucun service trouvé</h3>
            <p className="text-[#737373]">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun service ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier service.'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
            <UpworkButton className="mt-4" onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un service
            </UpworkButton>
            )}
          
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier le Service' : 'Nouveau Service'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom du service"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Type de service
              </label>
              <select
                value={formData.type || 'DETAIL'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'DETAIL' | 'KILO' }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="DETAIL">Au détail</option>
                <option value="KILO">Au kilo</option>
              </select>
            </div>
            <UpworkInput
              label="Prix (F CFA)"
              type="number"
              value={formData.price || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              required
            />
            <UpworkInput
              label="Temps estimé"
              value={formData.estimatedTime || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
              placeholder="ex: 2-3 heures"
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Catégorie
              </label>
              <select
                value={formData.category || 'WASHING'}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="WASHING">Lavage</option>
                <option value="IRONING">Repassage</option>
                <option value="DRY_CLEANING">Nettoyage à sec</option>
                <option value="REPAIR">Réparation</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-[#525252]">
                  Service actif
                </label>
                <p className="text-xs text-[#737373]">
                  Le service est disponible pour les commandes
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
              />
            </div>
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
              placeholder="Description détaillée du service..."
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
        title="Supprimer le Service"
        message={`Êtes-vous sûr de vouloir supprimer le service "${selectedItem?.name}" ? Cette action est irréversible.`}
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

export default ServicesPage;
