'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { tasksService } from '@/lib/api/services/tasks';
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
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
  Flag,
  Save,
  X
} from 'lucide-react';
import { formatDateTime, getStatusColor, getStatusText } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  dueDate: string;
  completedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const TasksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  

  const {
    items: tasks,
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
  } = useApiCrudSimple({ service: tasksService, entityName: 'task' });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    assignedToName: '',
    createdBy: '',
    createdByName: '',
    dueDate: '',
    tags: [],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedItem) {
      await handleEdit(selectedItem.id, formData);
    } else {
      await handleCreate(formData as Omit<Task, 'id'>);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: '',
      assignedToName: '',
      createdBy: '',
      createdByName: '',
      dueDate: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditClick = (task: Task) => {
    setFormData(task);
    openEditModal(task);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <Flag className="h-4 w-4 text-green-500" />;
      case 'MEDIUM':
        return <Flag className="h-4 w-4 text-blue-500" />;
      case 'HIGH':
        return <Flag className="h-4 w-4 text-yellow-500" />;
      case 'URGENT':
        return <Flag className="h-4 w-4 text-red-500" />;
      default:
        return <Flag className="h-4 w-4 text-[#737373]" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'HIGH':
        return 'bg-yellow-100 text-yellow-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <Trash2 className="h-4 w-4 text-[#737373]" />;
      default:
        return <Clock className="h-4 w-4 text-[#737373]" />;
    }
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return new Date() > dueDate && status !== 'COMPLETED';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Tâches</h1>
          <p className="text-[#525252] mt-1">
            Gestion des tâches et suivi des priorités
          </p>
        </div>
        <UpworkButton className="flex items-center" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Tâche
        </UpworkButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">En cours</p>
                <p className="text-2xl font-bold text-[#14a800]">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Terminées</p>
                <p className="text-2xl font-bold text-[#14a800]">
                  {tasks.filter(t => t.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">En retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
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
                  placeholder="Rechercher par titre, description ou assigné..."
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
                <option value="COMPLETED">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Toutes les priorités</option>
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Élevée</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <UpworkCard key={task.id} className={`hover:shadow-md transition-shadow ${
            isOverdue(task.dueDate, task.status) ? 'border-red-200 bg-red-50' : ''
          }`}>
            
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getPriorityIcon(task.priority)}
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </span>
                    <span className={getStatusColor(task.status)}>
                      {getStatusText(task.status)}
                    </span>
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 border border-red-200 rounded text-xs font-medium">
                        En retard
                      </span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-[#525252] mb-4">{task.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#a3a3a3]" />
                      <div>
                        <p className="text-[#737373]">Assigné à</p>
                        <p className="font-medium">{task.assignedTo.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#a3a3a3]" />
                      <div>
                        <p className="text-[#737373]">Échéance</p>
                        <p className={`font-medium ${
                          isOverdue(task.dueDate, task.status) ? 'text-red-600' : ''
                        }`}>
                          {formatDateTime(task.dueDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#a3a3a3]" />
                      <div>
                        <p className="text-[#737373]">Créé par</p>
                        <p className="font-medium">{task.createdBy.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-[#a3a3a3]" />
                      <div>
                        <p className="text-[#737373]">Commentaires</p>
                        <p className="font-medium">{task.commentsCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <UpworkButton variant="outline" size="sm" onClick={() => handleView(task)}>
                    <Eye className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" onClick={() => handleEditClick(task)}>
                    <Edit className="h-4 w-4" />
                  </UpworkButton>
                  <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteModal(task)}>
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <UpworkCard>
          
            <CheckCircle className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune tâche trouvée</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Aucune tâche ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre première tâche.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <UpworkButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer une tâche
              </UpworkButton>
            )}
          
        </UpworkCard>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModals}
        title={isEditModalOpen ? 'Modifier la Tâche' : 'Nouvelle Tâche'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpworkInput
              label="Titre de la tâche"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Statut
              </label>
              <select
                value={formData.status || 'pending'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-2">
                Priorité
              </label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <UpworkInput
              label="Assigné à"
              value={formData.assignedToName || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedToName: e.target.value }))}
              required
            />
            <UpworkInput
              label="Date d'échéance"
              type="datetime-local"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
            <UpworkInput
              label="Créé par"
              value={formData.createdByName || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, createdByName: e.target.value }))}
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
              rows={4}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              placeholder="Description de la tâche..."
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
        title="Supprimer la Tâche"
        message={`Êtes-vous sûr de vouloir supprimer la tâche "${selectedItem?.title}" ? Cette action est irréversible.`}
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

export default TasksPage;
