"use client";

import React, { useState, useEffect } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Building2,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Key,
  Settings
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { usersService } from '@/lib/api/services/users';
import { User, UserRole, UserStats } from '@/lib/types/user-management';
import UserForm from '@/components/forms/UserForm';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modales et états
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadStats();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await usersService.getUsers(
        currentPage,
        10,
        searchTerm,
        roleFilter,
        undefined,
        statusFilter === 'all' ? undefined : statusFilter === 'active'
      );

      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.total);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await usersService.getRoles();
      if (response.success) {
        setRoles(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadStats = async () => {
    try {
      const response = await usersService.getUserStats();
      if (response.success) {
        setStats(response.data || null);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await usersService.deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
      loadStats();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      await usersService.toggleUserStatus(selectedUser.id, !selectedUser.isActive);
      setIsStatusModalOpen(false);
      setSelectedUser(null);
      loadUsers();
      loadStats();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      alert('Erreur lors du changement de statut');
    }
  };

  const confirmResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      await usersService.resetPassword(selectedUser.id, newPassword);
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
      alert('Mot de passe mis à jour avec succès');
    } catch (err) {
      console.error('Failed to reset password:', err);
      alert('Erreur lors de la mise à jour du mot de passe');
    }
  };

  const getRoleColor = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.icon || 'user';
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2c2c2c]">
          Gestion des Utilisateurs
        </h1>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <UpworkCard className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#14a800] mr-3" />
              <div>
                <p className="text-sm font-medium text-[#525252]">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{stats.totalUsers}</p>
              </div>
            </div>
          </UpworkCard>
          <UpworkCard className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-[#525252]">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
            </div>
          </UpworkCard>
          <UpworkCard className="p-4">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-[#525252]">Inactifs</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalUsers - stats.activeUsers}</p>
              </div>
            </div>
          </UpworkCard>
          <UpworkCard className="p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-[#525252]">Rôles</p>
                <p className="text-2xl font-bold text-blue-600">{stats.usersByRole.length}</p>
              </div>
            </div>
          </UpworkCard>
        </div>
      )}

      {/* Actions et filtres */}
      <UpworkCard className="mt-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#2c2c2c]">Liste des Utilisateurs</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <UpworkButton onClick={handleCreateUser} className="bg-[#14a800] hover:bg-[#16a34a]">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </UpworkButton>
            </div>
          </div>
          {/* Filtres */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-1">
              <UpworkInput
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a3a3a3]" />
            </div>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent sm:text-sm"
              >
                <option value="">Tous les rôles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a3a3a3]" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent sm:text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a3a3a3]" />
            </div>
          </div>

          {/* Liste des utilisateurs */}
          {isLoading ? (
            <div className="text-center py-8">Chargement des utilisateurs...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-[#525252]">Aucun utilisateur trouvé.</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    user.isActive
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#14a800] rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-[#2c2c2c] truncate">
                          {user.fullname}
                        </p>
                        {user.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[#525252]">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                        {user.agency && (
                          <div className="flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {user.agency.name}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role.id)}`}>
                          {user.role.name}
                        </span>
                        <div className="flex items-center text-xs text-[#525252]">
                          <Calendar className="h-3 w-3 mr-1" />
                          Créé le {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </UpworkButton>
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(user)}
                      className={user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                    >
                      {user.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </UpworkButton>
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleResetPassword(user)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Key className="h-4 w-4" />
                    </UpworkButton>
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </UpworkButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-[#525252]">
                Affichage de {((currentPage - 1) * 10) + 1} à {Math.min(currentPage * 10, totalUsers)} sur {totalUsers} utilisateurs
              </div>
              <div className="flex space-x-2">
                <UpworkButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </UpworkButton>
                <span className="px-3 py-1 text-sm text-[#2c2c2c]">
                  Page {currentPage} sur {totalPages}
                </span>
                <UpworkButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </UpworkButton>
              </div>
            </div>
          )}
        </div>
      </UpworkCard>

      {/* Modales */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un Utilisateur"
        size="lg"
      >
        <UserForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            loadUsers();
            loadStats();
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier l'Utilisateur"
        size="lg"
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
              loadUsers();
              loadStats();
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'Utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUser?.fullname}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmToggleStatus}
        title={selectedUser?.isActive ? "Désactiver l'Utilisateur" : "Activer l'Utilisateur"}
        message={`Êtes-vous sûr de vouloir ${selectedUser?.isActive ? 'désactiver' : 'activer'} l'utilisateur "${selectedUser?.fullname}" ?`}
        confirmText={selectedUser?.isActive ? "Désactiver" : "Activer"}
        cancelText="Annuler"
        variant={selectedUser?.isActive ? "warning" : "success"}
      />

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Réinitialiser le Mot de Passe"
        size="md"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
              Nouveau mot de passe pour {selectedUser?.fullname}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <UpworkButton
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Annuler
            </UpworkButton>
            <UpworkButton
              onClick={confirmResetPassword}
              disabled={!newPassword || newPassword.length < 6}
            >
              Mettre à jour
            </UpworkButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
