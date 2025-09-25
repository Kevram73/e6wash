'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { tenantsService } from '@/lib/api/services/tenants';
import { Tenant } from '@/lib/api/types';
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
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Save,
  X
} from 'lucide-react';


interface TenantWithCounts extends Tenant {
  _count: {
    users: number;
    agencies: number;
    customers: number;
    orders: number;
    services: number;
  };
}

const PressingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  
  const {
    items: pressings,
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
  } = useApiCrudSimple<TenantWithCounts>({ service: tenantsService, entityName: 'tenant' });

  const filteredPressings = pressings.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tenant.subdomain && tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (tenant.domain && tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && tenant.status === 'ACTIVE') ||
                         (statusFilter === 'inactive' && tenant.status !== 'ACTIVE');
    
    const matchesPlan = planFilter === 'all'; // Pas de plan dans les données actuelles

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    subdomain: '',
    domain: '',
    logo: '',
    settings: {},
    status: 'ACTIVE'
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Tenant, 'id'>);
    }
    
    // Reset form
    setFormData({
      name: '',
      subdomain: '',
      domain: '',
      logo: '',
      settings: {},
      status: 'ACTIVE'
    });
  };

  const handleEditClick = (tenant: TenantWithCounts) => {
    setFormData(tenant);
    openEditModal(tenant);
  };


  const getStatusBadge = (status: string) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'SUSPENDED': 'bg-yellow-100 text-yellow-800',
      'INACTIVE': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'ACTIVE': 'Actif',
      'SUSPENDED': 'Suspendu',
      'INACTIVE': 'Inactif'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header - Upwork Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c2c] flex items-center">
            <Building2 className="h-7 w-7 mr-3 text-[#14a800]" />
            Gestion des Pressings
          </h1>
          <p className="text-[#525252] mt-1">
            Gérez tous les pressings de la plateforme
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Pressing
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Total Pressings</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{pressings.length}</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Actifs</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {pressings.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <Users className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Utilisateurs</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {pressings.reduce((sum, p) => sum + (p._count?.users || 0), 0)}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Commandes Total</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {pressings.reduce((sum, p) => sum + (p._count?.orders || 0), 0)}
              </p>
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Filtres - Upwork Style */}
      <UpworkCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UpworkInput
            label="Rechercher"
            placeholder="Nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Plan d'abonnement
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <UpworkButton variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </UpworkButton>
          </div>
        </div>
      </UpworkCard>

      {/* Liste des Pressings - Upwork Style */}
      <div className="grid gap-4">
        {filteredPressings.map((pressing) => (
          <UpworkCard key={pressing.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-[#14a800]" />
                      {pressing.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      {getStatusBadge(pressing.status)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-[#525252]">
                    <Mail className="h-4 w-4 mr-2 text-[#737373]" />
                    {pressing.domain || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-[#525252]">
                    <Phone className="h-4 w-4 mr-2 text-[#737373]" />
                    {pressing.subdomain || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-[#525252]">
                    <MapPin className="h-4 w-4 mr-2 text-[#737373]" />
                    {pressing.settings?.timezone || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-[#525252]">
                    <Calendar className="h-4 w-4 mr-2 text-[#737373]" />
                    Créé le {new Date(pressing.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#737373]">Agences:</span>
                    <span className="ml-1 font-medium text-[#2c2c2c]">{pressing._count?.agencies || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#737373]">Utilisateurs:</span>
                    <span className="ml-1 font-medium text-[#2c2c2c]">{pressing._count?.users || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#737373]">Commandes:</span>
                    <span className="ml-1 font-medium text-[#2c2c2c]">{pressing._count?.orders || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#737373]">Services:</span>
                    <span className="ml-1 font-medium text-[#2c2c2c]">{pressing._count?.services || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <UpworkButton variant="outline" size="sm" onClick={() => handleView(pressing)}>
                  <Eye className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(pressing)}>
                  <Edit className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(pressing)}>
                  <Trash2 className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>
          </UpworkCard>
        ))}
      </div>

      {filteredPressings.length === 0 && (
        <UpworkCard>
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">
              Aucun pressing trouvé
            </h3>
            <p className="text-[#525252] mb-6">
              Aucun pressing ne correspond à vos critères de recherche.
            </p>
            <UpworkButton onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un pressing
            </UpworkButton>
          </div>
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier le Pressing' : 'Nouveau Pressing'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom du pressing"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <UpworkInput
              label="Email de contact"
              type="email"
              value={formData.contactEmail || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              required
            />
            <UpworkInput
              label="Téléphone"
              value={formData.contactPhone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Plan d'abonnement
              </label>
              <select
                value={formData.subscriptionPlan || 'Basic'}
                onChange={(e) => setFormData(prev => ({ ...prev, subscriptionPlan: e.target.value }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <UpworkInput
              label="Rue"
              value={formData.address?.street || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address!, street: e.target.value }
              }))}
              required
            />
            <UpworkInput
              label="Ville"
              value={formData.address?.city || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address!, city: e.target.value }
              }))}
              required
            />
            <UpworkInput
              label="Code postal"
              value={formData.address?.postalCode || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address!, postalCode: e.target.value }
              }))}
              required
            />
            <UpworkInput
              label="Date d'expiration"
              type="date"
              value={formData.subscriptionExpiresAt || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, subscriptionExpiresAt: e.target.value }))}
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
        title="Supprimer le Pressing"
        message={`Êtes-vous sûr de vouloir supprimer le pressing "${selectedItem?.name}" ? Cette action est irréversible.`}
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

export default PressingsPage;
