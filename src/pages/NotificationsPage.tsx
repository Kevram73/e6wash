'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { notificationsService } from '@/lib/api/services/notifications';

interface Notification {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  icon?: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  link?: string;
  readAt?: string;
  userId: string;
  createdById: string;
  relatedType?: string;
  relatedId?: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    name: string;
  };
  user?: {
    name: string;
    fullname: string;
  };
  createdBy?: {
    name: string;
    fullname: string;
  };
}
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

const NotificationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  const {
    items: notifications,
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
  } = useApiCrudSimple<Notification>({ service: notificationsService, entityName: 'notification' });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || notification.level === levelFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' && notification.readAt) ||
                       (readFilter === 'unread' && !notification.readAt);
    
    return matchesSearch && matchesLevel && matchesRead;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'INFO':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-[#737373]" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const markAsRead = (notificationId: string) => {
    // Logique pour marquer comme lu
    console.log('Mark as read:', notificationId);
  };

  const markAllAsRead = () => {
    // Logique pour marquer toutes comme lues
    console.log('Mark all as read');
  };

  const deleteNotification = (notificationId: string) => {
    // Logique pour supprimer
    console.log('Delete notification:', notificationId);
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c] flex items-center">
            <Bell className="h-8 w-8 mr-3" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                {unreadCount} non lues
              </span>
            )}
          </h1>
          <p className="text-[#525252] mt-1">
            Gestion des notifications et alertes système
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <UpworkButton variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </UpworkButton>
          )}
          <UpworkButton className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Notification
          </UpworkButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Total</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-[#737373]" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Non lues</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Aujourd'hui</p>
                <p className="text-2xl font-bold text-[#14a800]">
                  {notifications.filter(n => 
                    new Date(n.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Alertes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications.filter(n => n.level === 'WARNING' || n.level === 'ERROR').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-500" />
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
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#a3a3a3]" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Tous les niveaux</option>
                <option value="INFO">Information</option>
                <option value="SUCCESS">Succès</option>
                <option value="WARNING">Avertissement</option>
                <option value="ERROR">Erreur</option>
              </select>
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Toutes</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Notifications List */}
      <div className="grid gap-4">
        {filteredNotifications.map((notification) => (
          <UpworkCard key={notification.id} className={`hover:shadow-md transition-shadow ${
            !notification.readAt ? 'border-l-4 border-l-blue-500 bg-[#f0fdf4]' : ''
          }`}>
            
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getLevelIcon(notification.level)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        <span className={getLevelColor(notification.level)}>
                          {notification.level}
                        </span>
                        {!notification.readAt && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Non lue
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[#525252] mb-3">{notification.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-[#737373]">
                        <div className="flex items-center space-x-4">
                          <span>Créé par: {notification.createdBy?.name || 'Système'}</span>
                          <span>•</span>
                          <span>{formatDateTime(notification.createdAt)}</span>
                          {notification.readAt && (
                            <>
                              <span>•</span>
                              <span>Lue: {formatDateTime(notification.readAt)}</span>
                            </>
                          )}
                        </div>
                        {notification.link && (
                          <a href={notification.link}>
                            <UpworkButton variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </UpworkButton>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.readAt && (
                    <UpworkButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </UpworkButton>
                  )}
                  <UpworkButton 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <UpworkCard>
          
            <Bell className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune notification trouvée</h3>
            <p className="text-[#737373]">
              {searchTerm || levelFilter !== 'all' || readFilter !== 'all'
                ? 'Aucune notification ne correspond à vos critères de recherche.'
                : 'Vous n\'avez aucune notification pour le moment.'
              }
            </p>
          
        </UpworkCard>
      )}
    </div>
  );
};

export default NotificationsPage;
