'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { customersService } from '@/lib/api/services/customers';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Save,
  X
} from 'lucide-react';

interface Customer {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalOrders: number;
  totalSpent: number;
  lastOrder: string | Date;
  loyaltyPoints: number;
  notes?: string;
  createdAt: string | Date;
}

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const {
    items: customers,
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
  } = useApiCrudSimple<Customer>({ service: customersService, entityName: 'customer' });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Customer>>({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    status: 'ACTIVE',
    totalOrders: 0,
    totalSpent: 0,
    lastOrder: new Date(),
    loyaltyPoints: 0,
    notes: '',
    createdAt: new Date()
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Customer, 'id'>);
    }
    
    // Reset form
    setFormData({
      fullname: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      status: 'ACTIVE',
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: new Date(),
      loyaltyPoints: 0,
      notes: '',
      createdAt: new Date()
    });
  };

  const handleEditClick = (customer: Customer) => {
    setFormData(customer);
    openEditModal(customer);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
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
      case 'SUSPENDED':
        return 'Suspendu';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDateTime = (date: string | Date) => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Clients</h1>
          <p className="text-[#525252] mt-1">
            Gestion de la base de données clients
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Clients</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{customers.length}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Clients Actifs</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {customers.filter(c => c.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {customers.filter(c => 
                    new Date(c.createdAt).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">CA Total</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
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
                  placeholder="Rechercher par nom, email, téléphone ou adresse..."
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
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="SUSPENDED">Suspendu</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <UpworkCard key={customer.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-[#a3a3a3]" />
                      <h3 className="font-semibold text-lg">{customer.fullname}</h3>
                    </div>
                    <span className={getStatusColor(customer.status)}>
                      {getStatusText(customer.status)}
                    </span>
                    <span className="px-2 py-1 bg-[#f0fdf4] text-[#14a800] border border-[#bbf7d0] rounded text-xs font-medium">
                      {customer.loyaltyPoints} pts
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Contact</p>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{customer.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Adresse</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{customer.address}</p>
                      </div>
                      <p className="text-[#525252]">{customer.city}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Statistiques</p>
                      <p className="font-medium">{customer.totalOrders} commandes</p>
                      <p className="text-[#525252]">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Dernière activité</p>
                      <p className="text-[#525252]">Dernière commande: {formatDateTime(customer.lastOrder)}</p>
                      <p className="text-[#525252]">Inscrit: {formatDateTime(customer.createdAt)}</p>
                    </div>
                  </div>
                  
                  {customer.notes && (
                    <div className="mt-3 p-3 bg-[#f7f7f7] rounded-md">
                      <p className="text-sm text-[#525252]">
                        <span className="font-medium">Notes:</span> {customer.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(customer)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(customer)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(customer)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <UpworkCard>
          
            <Users className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucun client trouvé</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucun client ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier client.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
            <UpworkButton className="mt-4" onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un client
            </UpworkButton>
            )}
          
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier le Client' : 'Nouveau Client'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom complet"
              value={formData.fullname || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
              required
            />
            <UpworkInput
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <UpworkInput
              label="Téléphone"
              value={formData.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
            <UpworkInput
              label="Adresse"
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Statut
              </label>
              <select
                value={formData.status || 'ACTIVE'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="SUSPENDED">Suspendu</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              placeholder="Notes sur le client..."
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
        title="Supprimer le Client"
        message={`Êtes-vous sûr de vouloir supprimer le client "${selectedItem?.fullname}" ? Cette action est irréversible.`}
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

export default CustomersPage;
