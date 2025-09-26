'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { tasksService } from '@/lib/api/services/tasks';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Package,
  User,
  Phone,
  Calendar,
  Truck,
  QrCode
} from 'lucide-react';

interface Mission {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  type: 'PICKUP' | 'DELIVERY' | 'BOTH';
  scheduledTime: string | Date;
  estimatedDuration: number;
  totalWeight: number;
  totalAmount: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    weight: number;
  }>;
  notes?: string;
  cancellationReason?: string;
  qrCode: string;
  completedAt?: string | Date;
  createdAt: string | Date;
}

const MissionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load tasks data using the hook
  const { items: tasks } = useApiCrudSimple({ service: tasksService, entityName: 'task' });

  // Mock missions data for now (since the page expects a different structure than tasks)
  const missions: Mission[] = [
    {
      id: '1',
      orderNumber: 'CMD-001',
      customerName: 'Jean Dupont',
      customerPhone: '+237 123 456 789',
      address: '123 Rue de la Paix, Douala',
      status: 'PENDING',
      priority: 'HIGH',
      type: 'PICKUP',
      scheduledTime: new Date(),
      estimatedDuration: 30,
      totalWeight: 5.5,
      totalAmount: 15000,
      items: [
        { id: '1', name: 'Chemises', quantity: 3, weight: 1.5 },
        { id: '2', name: 'Pantalons', quantity: 2, weight: 2.0 }
      ],
      notes: 'Porte principale, sonner 2 fois',
      qrCode: 'QR123456',
      createdAt: new Date()
    },
    {
      id: '2',
      orderNumber: 'CMD-002',
      customerName: 'Marie Martin',
      customerPhone: '+237 987 654 321',
      address: '456 Avenue des Martyrs, Yaoundé',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      type: 'DELIVERY',
      scheduledTime: new Date(),
      estimatedDuration: 45,
      totalWeight: 8.2,
      totalAmount: 25000,
      items: [
        { id: '3', name: 'Robes', quantity: 2, weight: 3.0 },
        { id: '4', name: 'Costumes', quantity: 1, weight: 2.5 }
      ],
      qrCode: 'QR789012',
      createdAt: new Date()
    },
    {
      id: '3',
      orderNumber: 'CMD-003',
      customerName: 'Pierre Durand',
      customerPhone: '+237 555 123 456',
      address: '789 Boulevard du 20 Mai, Garoua',
      status: 'COMPLETED',
      priority: 'LOW',
      type: 'BOTH',
      scheduledTime: new Date(),
      estimatedDuration: 60,
      totalWeight: 12.0,
      totalAmount: 35000,
      items: [
        { id: '5', name: 'Manteaux', quantity: 2, weight: 4.0 },
        { id: '6', name: 'Vestes', quantity: 3, weight: 3.5 }
      ],
      notes: 'Livraison effectuée avec succès',
      qrCode: 'QR345678',
      completedAt: new Date(),
      createdAt: new Date()
    }
  ];

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Navigation className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-[#737373]" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Haute';
      case 'MEDIUM':
        return 'Moyenne';
      case 'LOW':
        return 'Basse';
      default:
        return priority;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'COLLECTION':
        return 'Collecte';
      case 'DELIVERY':
        return 'Livraison';
      default:
        return type;
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

  const pendingMissions = missions.filter(m => m.status === 'PENDING').length;
  const inProgressMissions = missions.filter(m => m.status === 'IN_PROGRESS').length;
  const completedMissions = missions.filter(m => m.status === 'COMPLETED').length;
  const totalEarnings = missions
    .filter(m => m.status === 'COMPLETED')
    .reduce((sum, m) => sum + m.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Mes Missions</h1>
          <p className="text-[#525252] mt-1">
            Gestion des collectes et livraisons
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            Scanner QR
          </UpworkButton>
          <UpworkButton className="flex items-center">
            <Navigation className="h-4 w-4 mr-2" />
            Navigation
          </UpworkButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">En Attente</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{pendingMissions}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Navigation className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">En Cours</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{inProgressMissions}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Terminées</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{completedMissions}</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Gains Aujourd'hui</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(totalEarnings)}</p>
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
                  placeholder="Rechercher par numéro de commande, client ou adresse..."
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
                <option value="COMPLETED">Terminée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* Missions List */}
      <div className="grid gap-4">
        {filteredMissions.map((mission) => (
          <UpworkCard key={mission.id} className="hover:shadow-md transition-shadow">
            
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(mission.status)}
                      <h3 className="font-semibold text-lg">{mission.orderNumber}</h3>
                    </div>
                    <span className={getStatusColor(mission.status)}>
                      {getStatusText(mission.status)}
                    </span>
                    <span className={getPriorityColor(mission.priority)}>
                      {getPriorityText(mission.priority)}
                    </span>
                    <span variant="outline">
                      {getTypeText(mission.type)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Client</p>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{mission.customerName}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{mission.customerPhone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Adresse</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{mission.address}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Horaire & Durée</p>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{formatDateTime(mission.scheduledTime)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{mission.estimatedDuration} min</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#737373]">Détails</p>
                      <p className="font-medium">{mission.totalWeight} kg</p>
                      <p className="text-[#525252]">{formatCurrency(mission.totalAmount)}</p>
                      <p className="text-[#525252]">{mission.items.length} articles</p>
                    </div>
                  </div>
                  
                  {mission.notes && (
                    <div className="mt-3 p-3 bg-[#f7f7f7] rounded-md">
                      <p className="text-sm text-[#525252]">
                        <span className="font-medium">Notes:</span> {mission.notes}
                      </p>
                    </div>
                  )}

                  {mission.items && mission.items.length > 0 && (
                    <div className="mt-3 p-3 bg-[#f0fdf4] rounded-md">
                      <p className="text-sm font-medium text-blue-900 mb-2">Articles à collecter/livrer:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mission.items.map((item, index) => (
                          <div key={index} className="text-sm text-blue-800">
                            • {item.name} ({item.quantity} pièces, {item.weight} kg)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mission.cancellationReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Raison d'annulation:</span> {mission.cancellationReason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center space-y-2 ml-4">
                  <div className="text-center">
                    <QrCode className="h-8 w-8 text-[#a3a3a3] mx-auto mb-1" />
                    <p className="text-xs text-[#525252]">{mission.qrCode}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {mission.status === 'PENDING' && (
                      <>
                        <UpworkButton size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Commencer
                        </UpworkButton>
                        <UpworkButton variant="outline" size="sm">
                          Voir détails
                        </UpworkButton>
                      </>
                    )}
                    {mission.status === 'IN_PROGRESS' && (
                      <>
                        <UpworkButton size="sm" className="bg-green-600 hover:bg-green-700">
                          Terminer
                        </UpworkButton>
                        <UpworkButton variant="outline" size="sm">
                          Scanner QR
                        </UpworkButton>
                      </>
                    )}
                    {mission.status === 'COMPLETED' && (
                      <span className="bg-green-100 text-green-800">
                        Terminée à {formatDateTime(mission.completedAt!)}
                      </span>
                    )}
                    {mission.status === 'CANCELLED' && (
                      <span className="bg-red-100 text-red-800">
                        Annulée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            
          </UpworkCard>
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <UpworkCard>
          
            <Truck className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune mission trouvée</h3>
            <p className="text-[#737373]">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune mission ne correspond à vos critères de recherche.'
                : 'Aucune mission assignée pour le moment.'
              }
            </p>
          
        </UpworkCard>
      )}
    </div>
  );
};

export default MissionsPage;
