'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { agenciesService, type AgencyWithRelations } from '@/lib/api/services/agencies';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AuthRequired from '@/components/ui/AuthRequired';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Users,
  TrendingUp,
  Clock,
  Save,
  X
} from 'lucide-react';


const AgencesPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  

  const {
    items: agencies,
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
  } = useApiCrudSimple<AgencyWithRelations>({ service: agenciesService, entityName: 'agency' });

  // Debug: Afficher l'erreur et la session (à supprimer en production)
  console.log('AgencesPage - Session Status:', status);
  console.log('AgencesPage - Session Data:', session);
  console.log('AgencesPage - Error:', error);
  console.log('AgencesPage - Loading:', isLoading);
  console.log('AgencesPage - Agencies:', agencies);

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.phone.includes(searchTerm) ||
                         (agency.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'ACTIVE' && agency.isActive) ||
                         (statusFilter === 'INACTIVE' && !agency.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<AgencyWithRelations>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    isActive: true,
    code: '',
    capacity: 0,
    isMainAgency: false
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<AgencyWithRelations, 'id'>);
    }
    
    // Reset form
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      city: '',
      isActive: true,
      code: '',
      capacity: 0,
      isMainAgency: false
    });
  };

  const handleEditClick = (agence: AgencyWithRelations) => {
    setFormData(agence);
    openEditModal(agence);
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
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'MAINTENANCE':
        return 'Maintenance';
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

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Afficher l'erreur si elle existe
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2c2c2c]">Agences</h1>
            <p className="text-[#525252] mt-1">
              Gestion des agences et succursales
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-500 mr-3">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Erreur lors du chargement des données</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthRequired>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Agences</h1>
          <p className="text-[#525252] mt-1">
            Gestion des agences et succursales
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Agence
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Agences</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{agencies.length}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Agences Actives</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {agencies.filter(a => a.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {agencies.reduce((sum, a) => sum + a._count.users, 0)}
                </p>
              </div>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Commandes</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {agencies.reduce((sum, a) => sum + a._count.orders, 0)}
                </p>
              </div>
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
                  placeholder="Rechercher par nom, adresse, ville ou téléphone..."
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
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Agencies List */}
      <div className="grid gap-4">
        {filteredAgencies.map((agency) => (
          <UpworkCard key={agency.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-[#a3a3a3]" />
                      <h3 className="font-semibold text-lg">{agency.name}</h3>
                      {agency.isMainAgency && (
                        <span className="bg-blue-100 text-blue-800">
                          Principale
                        </span>
                      )}
                    </div>
                    <span className={agency.isActive ? "px-2 py-1 bg-green-100 text-green-800 border border-green-200 rounded text-xs font-medium" : "px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded text-xs font-medium"}>
                      {agency.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Contact</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{agency.address}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{agency.phone}</p>
                      </div>
                      <p className="text-[#525252]">{agency.email}</p>
                      <p className="text-[#525252]">{agency.city}, {agency.country.name}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Pressing</p>
                      <p className="font-medium">{agency.tenant.name}</p>
                      <p className="text-[#525252]">{agency.tenant.subdomain}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">Capacité: {agency.capacity || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Statistiques</p>
                      <p className="font-medium">{agency._count.users} utilisateurs</p>
                      <p className="text-[#525252]">{agency._count.customers} clients</p>
                      <p className="text-[#525252]">{agency._count.orders} commandes</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Informations</p>
                      <p className="text-[#525252]">Code: {agency.code}</p>
                      <p className="text-[#525252]">Manager: {agency.managerId ? 'Assigné' : 'Non assigné'}</p>
                      <p className="text-[#525252] mt-1">Créée: {formatDateTime(new Date(agency.createdAt))}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(agency)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(agency)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(agency)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredAgencies.length === 0 && (
        <UpworkCard>
          
            <Building2 className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune agence trouvée</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune agence ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre première agence.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <UpworkButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer une agence
              </UpworkButton>
            )}
          
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier l\'Agence' : 'Nouvelle Agence'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom de l'agence"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: e.target.value
              }))}
              required
            />
            <UpworkInput
              label="Ville"
              value={formData.city || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                city: e.target.value
              }))}
              required
            />
            <UpworkInput
              label="Code agence"
              value={formData.code || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                code: e.target.value
              }))}
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
        title="Supprimer l'Agence"
        message={`Êtes-vous sûr de vouloir supprimer l'agence "${selectedItem?.name}" ? Cette action est irréversible.`}
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
    </AuthRequired>
  );
};

export default AgencesPage;
