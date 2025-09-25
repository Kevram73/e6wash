'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { inventoryService } from '@/lib/api/services/inventory';
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
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  BarChart3
} from 'lucide-react';

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'En stock';
      case 'LOW_STOCK':
        return 'Stock faible';
      case 'OUT_OF_STOCK':
        return 'Rupture de stock';
      default:
        return status;
    }
  };

  const getStockIcon = (item: any) => {
    if (item.status === 'OUT_OF_STOCK') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    } else if (item.status === 'LOW_STOCK') {
      return <TrendingDown className="h-4 w-4 text-yellow-500" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
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

  

  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.status === 'LOW_STOCK').length;
  const outOfStockItems = inventory.filter(item => item.status === 'OUT_OF_STOCK').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Inventaire</h1>
          <p className="text-[#525252] mt-1">
            Gestion du stock et des fournitures
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Commande Fournisseur
          </UpworkButton>
          <UpworkButton className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Article
          </UpworkButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Articles</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{inventory.length}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Valeur Totale</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Stock Faible</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{lowStockItems}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Rupture de Stock</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{outOfStockItems}</p>
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
                  placeholder="Rechercher par nom, SKU, catégorie ou fournisseur..."
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
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="IN_STOCK">En stock</option>
                <option value="LOW_STOCK">Stock faible</option>
                <option value="OUT_OF_STOCK">Rupture de stock</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Inventory List */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => (
          <UpworkCard key={item.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStockIcon(item)}
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                    </div>
                    <span className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </span>
                    <span variant="outline">
                      {item.sku}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Stock</p>
                      <p className="font-medium text-lg">{item.currentStock} {item.unit}</p>
                      <p className="text-[#525252]">Min: {item.minStock} | Max: {item.maxStock}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Prix & Valeur</p>
                      <p className="font-medium">{formatCurrency(item.unitPrice)} / {item.unit}</p>
                      <p className="text-[#525252]">Total: {formatCurrency(item.totalValue)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Fournisseur</p>
                      <p className="font-medium">{item.supplier}</p>
                      <p className="text-[#525252]">Dernière commande: {formatDateTime(item.lastRestock)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Localisation</p>
                      <p className="font-medium">{item.location}</p>
                      <p className="text-[#525252]">Prochaine commande: {formatDateTime(item.nextRestock)}</p>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-3 p-3 bg-[#f7f7f7] rounded-md">
                      <p className="text-sm text-[#525252]">
                        <span className="font-medium">Notes:</span> {item.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <UpworkCard>
          
            <Package className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucun article trouvé</h3>
            <p className="text-[#737373]">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun article ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier article à l\'inventaire.'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
              <UpworkButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un article
              </UpworkButton>
            )}
          
        </UpworkCard>
      )}
    </div>
  );
};

export default InventoryPage;
