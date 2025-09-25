'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { inventoryService } from '@/lib/api/services/inventory';
import UpworkCard from '@/components/ui/UpworkCard';
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
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  location: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  notes?: string;
  createdAt: Date;
}

const StockPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  

  const {
    items: stockItems,
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
  } = useApiCrudSimple({ service: inventoryService, entityName: 'inventory' });

  const filteredStockItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<StockItem>>({
    name: '',
    category: '',
    sku: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'pièces',
    unitPrice: 0,
    supplier: '',
    location: '',
    status: 'IN_STOCK',
    notes: '',
    createdAt: new Date()
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<StockItem, 'id'>);
    }
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      sku: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'pièces',
      unitPrice: 0,
      supplier: '',
      location: '',
      status: 'IN_STOCK',
      notes: '',
      createdAt: new Date()
    });
  };

  const handleEditClick = (item: StockItem) => {
    setFormData(item);
    openEditModal(item);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'En stock';
      case 'LOW_STOCK':
        return 'Stock faible';
      case 'OUT_OF_STOCK':
        return 'Rupture';
      case 'EXPIRED':
        return 'Expiré';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return <CheckCircle className="h-4 w-4" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="h-4 w-4" />;
      case 'OUT_OF_STOCK':
        return <XCircle className="h-4 w-4" />;
      case 'EXPIRED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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

  const categories = Array.from(new Set(stockItems.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock</h1>
          <p className="text-gray-600 mt-1">
            Gestion de l'inventaire et des stocks
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Article
        </UpworkButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UpworkCard>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stockItems.length}</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockItems.filter(s => s.status === 'IN_STOCK').length}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Faible</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockItems.filter(s => s.status === 'LOW_STOCK').length}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stockItems.reduce((sum, s) => sum + s.totalValue, 0))}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, SKU, catégorie ou fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
            >
              <option value="all">Tous les statuts</option>
              <option value="IN_STOCK">En stock</option>
              <option value="LOW_STOCK">Stock faible</option>
              <option value="OUT_OF_STOCK">Rupture</option>
              <option value="EXPIRED">Expiré</option>
            </select>
          </div>
        </div>
      </UpworkCard>

      {/* Stock Items List */}
      {filteredStockItems.length === 0 ? (
        <UpworkCard>
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun article ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier article au stock.'
              }
            </p>
            <UpworkButton onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Article
            </UpworkButton>
          </div>
        </UpworkCard>
      ) : (
        <div className="grid gap-4">
          {filteredStockItems.map((item) => (
            <UpworkCard key={item.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500">({item.sku})</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Stock</p>
                      <p className="font-medium text-gray-900">
                        {item.currentStock} {item.unit}
                      </p>
                      <p className="text-gray-500">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Prix & Valeur</p>
                      <p className="font-medium text-gray-900">{formatCurrency(item.unitPrice)}/{item.unit}</p>
                      <p className="text-gray-500">Total: {formatCurrency(item.totalValue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fournisseur</p>
                      <p className="font-medium text-gray-900">{item.supplier}</p>
                      <p className="text-gray-500">{item.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Dernière mise à jour</p>
                      <p className="font-medium text-gray-900">{formatDateTime(item.lastRestocked)}</p>
                      {item.expiryDate && (
                        <p className="text-gray-500">
                          Expire: {formatDateTime(item.expiryDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {item.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteModal(item)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            </UpworkCard>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier l\'Article' : 'Nouvel Article'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom de l'article"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <UpworkInput
              label="SKU"
              value={formData.sku || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              required
            />
            <UpworkInput
              label="Catégorie"
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            />
            <UpworkInput
              label="Unité"
              value={formData.unit || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              required
            />
            <UpworkInput
              label="Stock actuel"
              type="number"
              value={formData.currentStock || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
              required
            />
            <UpworkInput
              label="Stock minimum"
              type="number"
              value={formData.minStock || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
              required
            />
            <UpworkInput
              label="Stock maximum"
              type="number"
              value={formData.maxStock || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
              required
            />
            <UpworkInput
              label="Prix unitaire (FCFA)"
              type="number"
              value={formData.unitPrice || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
              required
            />
            <UpworkInput
              label="Fournisseur"
              value={formData.supplier || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              required
            />
            <UpworkInput
              label="Emplacement"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.status || 'IN_STOCK'}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="IN_STOCK">En stock</option>
              <option value="LOW_STOCK">Stock faible</option>
              <option value="OUT_OF_STOCK">Rupture</option>
              <option value="EXPIRED">Expiré</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              placeholder="Notes supplémentaires..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <UpworkButton variant="outline" onClick={closeModals}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </UpworkButton>
            <UpworkButton type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEditModalOpen ? 'Modifier' : 'Créer'}
            </UpworkButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={() => selectedItem && handleDelete(selectedItem.id)}
        title="Supprimer l'Article"
        message={`Êtes-vous sûr de vouloir supprimer l'article "${selectedItem?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
};

export default StockPage;
