'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { collectorsService } from '@/lib/api/services/collectors';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Save,
  X
} from 'lucide-react';

interface Collector {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  availability: string;
  currentLocation: string;
  totalMissions: number;
  completedMissions: number;
  successRate: number;
  averageRating: number;
  totalEarnings: number;
  lastMission: Date;
  joinedAt: Date;
  vehicle: {
    type: string;
    plate: string;
    model: string;
  };
  workingHours: string;
  notes: string;
}

const CollectorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const {
    items: collectors,
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
  } = useApiCrudSimple({ service: collectorsService, entityName: 'collector' });

  const filteredCollectors = collectors.filter(collector => {
    const matchesSearch = collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collector.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && collector.status === 'ACTIVE') ||
                         (statusFilter === 'inactive' && collector.status === 'INACTIVE');
    
    return matchesSearch && matchesStatus;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Collector>>({
    name: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
    currentLocation: '',
    totalMissions: 0,
    completedMissions: 0,
    successRate: 0,
    averageRating: 5.0,
    totalEarnings: 0,
    lastMission: new Date(),
    joinedAt: new Date(),
    vehicle: {
      type: 'Moto',
      plate: '',
      model: ''
    },
    workingHours: '8h00 - 17h00',
    notes: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Collector, 'id'>);
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'ACTIVE',
      availability: 'AVAILABLE',
      currentLocation: '',
      totalMissions: 0,
      completedMissions: 0,
      successRate: 0,
      averageRating: 5.0,
      totalEarnings: 0,
      lastMission: new Date(),
      joinedAt: new Date(),
      vehicle: {
        type: 'Moto',
        plate: '',
        model: ''
      },
      workingHours: '8h00 - 17h00',
      notes: ''
    });
  };

  const handleEditClick = (collector: Collector) => {
    setFormData(collector);
    openEditModal(collector);
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'ON_MISSION':
        return 'bg-blue-100 text-blue-800';
      case 'OFFLINE':
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
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

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'ON_MISSION':
        return 'En mission';
      case 'OFFLINE':
        return 'Hors ligne';
      default:
        return availability;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Collecteurs</h1>
          <p className="text-[#525252] mt-1">
            Gestion des collecteurs et livreurs
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Collecteur
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Total Collecteurs</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{collectors.length}</p>
              </div>
            </div>
        </UpworkCard>
        
        <UpworkCard>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Disponibles</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {collectors.filter(c => c.availability === 'AVAILABLE').length}
                </p>
              </div>
            </div>
        </UpworkCard>
        
        <UpworkCard>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">En Mission</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {collectors.filter(c => c.availability === 'ON_MISSION').length}
                </p>
              </div>
            </div>
        </UpworkCard>
        
        <UpworkCard>
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Taux de Réussite</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">
                  {Math.round(collectors.reduce((sum, c) => sum + c.successRate, 0) / collectors.length)}%
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
                  placeholder="Rechercher par nom, email, téléphone ou localisation..."
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

      {/* Collectors List */}
      <div className="grid gap-4">
        {filteredCollectors.map((collector) => (
          <UpworkCard key={collector.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-[#a3a3a3]" />
                      <h3 className="font-semibold text-lg">{collector.name}</h3>
                    </div>
                    <span className={getStatusColor(collector.status)}>
                      {getStatusText(collector.status)}
                    </span>
                    <span className={getAvailabilityColor(collector.availability)}>
                      {getAvailabilityText(collector.availability)}
                    </span>
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded text-xs font-medium">
                      ⭐ {collector.averageRating}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Contact</p>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{collector.phone}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{collector.email}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{collector.currentLocation}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Véhicule</p>
                      <p className="font-medium">{collector.vehicle.type}</p>
                      <p className="text-[#525252]">{collector.vehicle.model}</p>
                      <p className="text-[#525252]">{collector.vehicle.plate}</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Performance</p>
                      <p className="font-medium">{collector.totalMissions} missions</p>
                      <p className="text-[#525252]">{collector.completedMissions} terminées</p>
                      <p className="text-[#525252]">{collector.successRate}% de réussite</p>
                    </div>
                    <div>
                      <p className="text-[#737373]">Gains & Horaires</p>
                      <p className="font-medium">{formatCurrency(collector.totalEarnings)}</p>
                      <p className="text-[#525252]">{collector.workingHours}</p>
                      <p className="text-[#525252]">Dernière mission: {formatDateTime(collector.lastMission)}</p>
                    </div>
                  </div>
                  
                  {collector.notes && (
                    <div className="mt-3 p-3 bg-[#f7f7f7] rounded-md">
                      <p className="text-sm text-[#525252]">
                        <span className="font-medium">Notes:</span> {collector.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(collector)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(collector)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(collector)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
          </UpworkCard>
        ))}
      </div>

      {filteredCollectors.length === 0 && (
        <UpworkCard>
            <Truck className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucun collecteur trouvé</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucun collecteur ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier collecteur.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <UpworkButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un collecteur
              </UpworkButton>
            )}
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier le Collecteur' : 'Nouveau Collecteur'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Nom complet"
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
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Type de véhicule
              </label>
              <select
                value={formData.vehicle?.type || 'moto'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  vehicle: { 
                    type: e.target.value,
                    plate: prev.vehicle?.plate || '',
                    model: prev.vehicle?.model || ''
                  }
                }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="moto">Moto</option>
                <option value="voiture">Voiture</option>
                <option value="velo">Vélo</option>
                <option value="pied">À pied</option>
              </select>
            </div>
            <UpworkInput
              label="Plaque d'immatriculation"
              value={formData.vehicle?.plate || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                vehicle: { 
                  type: prev.vehicle?.type || 'moto',
                  plate: e.target.value,
                  model: prev.vehicle?.model || ''
                }
              }))}
            />
            <UpworkInput
              label="Agence"
              value={formData.currentLocation || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, currentLocation: e.target.value }))}
              required
            />
            <UpworkInput
              label="Note (0-5)"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.averageRating || 5.0}
              onChange={(e) => setFormData(prev => ({ ...prev, averageRating: Number(e.target.value) }))}
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
        title="Supprimer le Collecteur"
        message={`Êtes-vous sûr de vouloir supprimer le collecteur "${selectedItem?.name}" ? Cette action est irréversible.`}
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

export default CollectorsPage;