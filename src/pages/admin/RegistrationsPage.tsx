'use client';

import React, { useState, useEffect } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import RegistrationStats from '@/components/dashboard/RegistrationStats';
import { 
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  Users,
  MoreVertical
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  city: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  isActive: boolean;
  createdAt: Date;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  owner: {
    fullname: string;
    email: string;
  };
  _count: {
    users: number;
    agencies: number;
    orders: number;
  };
}

const RegistrationsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setIsLoading(true);
      // Ici, vous appelleriez l'API pour récupérer les tenants
      // const response = await fetch('/api/admin/tenants');
      // const data = await response.json();
      
      // Données mockées pour la démonstration
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Pressing Elite',
          type: 'COMPANY',
          email: 'contact@elite.com',
          phone: '+237 123 456 789',
          city: 'Douala',
          subscriptionPlan: 'PREMIUM',
          subscriptionStatus: 'ACTIVE',
          isActive: true,
          createdAt: new Date('2025-01-15'),
          subscriptionStartDate: new Date('2025-01-15'),
          subscriptionEndDate: new Date('2025-02-15'),
          owner: {
            fullname: 'Jean Dupont',
            email: 'jean@elite.com'
          },
          _count: {
            users: 3,
            agencies: 2,
            orders: 45
          }
        },
        {
          id: '2',
          name: 'Clean Express',
          type: 'INDIVIDUAL',
          email: 'info@cleanexpress.com',
          phone: '+237 987 654 321',
          city: 'Yaoundé',
          subscriptionPlan: 'BASIC',
          subscriptionStatus: 'ACTIVE',
          isActive: true,
          createdAt: new Date('2025-01-20'),
          subscriptionStartDate: new Date('2025-01-20'),
          subscriptionEndDate: new Date('2025-02-20'),
          owner: {
            fullname: 'Marie Martin',
            email: 'marie@cleanexpress.com'
          },
          _count: {
            users: 1,
            agencies: 1,
            orders: 12
          }
        },
        {
          id: '3',
          name: 'Wash & Go',
          type: 'COOPERATIVE',
          email: 'contact@washandgo.com',
          phone: '+237 555 123 456',
          city: 'Bafoussam',
          subscriptionPlan: 'ENTERPRISE',
          subscriptionStatus: 'TRIAL',
          isActive: true,
          createdAt: new Date('2025-01-25'),
          subscriptionStartDate: new Date('2025-01-25'),
          subscriptionEndDate: new Date('2025-02-25'),
          owner: {
            fullname: 'Pierre Durand',
            email: 'pierre@washandgo.com'
          },
          _count: {
            users: 5,
            agencies: 3,
            orders: 78
          }
        }
      ];
      
      setTenants(mockTenants);
    } catch (error) {
      console.error('Erreur chargement tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.owner.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.subscriptionStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.subscriptionPlan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    totalRegistrations: tenants.length,
    monthlyRegistrations: tenants.filter(t => {
      const now = new Date();
      const tenantDate = new Date(t.createdAt);
      return tenantDate.getMonth() === now.getMonth() && tenantDate.getFullYear() === now.getFullYear();
    }).length,
    activeTenants: tenants.filter(t => t.isActive).length,
    conversionRate: tenants.length > 0 ? (tenants.filter(t => t.isActive).length / tenants.length) * 100 : 0,
    popularPlan: 'PREMIUM',
    averageRevenue: 25000
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'TRIAL':
        return 'bg-blue-100 text-blue-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'BASIC':
        return 'bg-gray-100 text-gray-800';
      case 'PREMIUM':
        return 'bg-blue-100 text-blue-800';
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActivateTenant = async (tenantId: string) => {
    try {
      // Ici, vous appelleriez l'API pour activer le tenant
      console.log('Activation tenant:', tenantId);
      // Mettre à jour l'état local
      setTenants(prev => prev.map(t => 
        t.id === tenantId ? { ...t, isActive: true, subscriptionStatus: 'ACTIVE' } : t
      ));
    } catch (error) {
      console.error('Erreur activation:', error);
    }
  };

  const handleSuspendTenant = async (tenantId: string) => {
    try {
      // Ici, vous appelleriez l'API pour suspendre le tenant
      console.log('Suspension tenant:', tenantId);
      // Mettre à jour l'état local
      setTenants(prev => prev.map(t => 
        t.id === tenantId ? { ...t, isActive: false, subscriptionStatus: 'SUSPENDED' } : t
      ));
    } catch (error) {
      console.error('Erreur suspension:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Gestion des Inscriptions</h1>
          <p className="text-[#525252] mt-1">
            Gérez les pressings inscrits et leurs abonnements
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Exporter
          </UpworkButton>
          <UpworkButton className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Nouveau Tenant
          </UpworkButton>
        </div>
      </div>

      {/* Statistiques */}
      <RegistrationStats stats={stats} />

      {/* Filtres et recherche */}
      <UpworkCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, propriétaire, email ou ville..."
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
              <option value="TRIAL">Essai</option>
              <option value="SUSPENDED">Suspendu</option>
              <option value="CANCELLED">Annulé</option>
            </select>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les plans</option>
              <option value="BASIC">Basique</option>
              <option value="PREMIUM">Premium</option>
              <option value="ENTERPRISE">Entreprise</option>
            </select>
          </div>
        </div>
      </UpworkCard>

      {/* Liste des tenants */}
      <div className="grid gap-4">
        {filteredTenants.length > 0 ? (
          filteredTenants.map((tenant) => (
            <UpworkCard key={tenant.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">{tenant.name}</h3>
                    </div>
                    <span className={getStatusColor(tenant.subscriptionStatus)}>
                      {tenant.subscriptionStatus}
                    </span>
                    <span className={getPlanColor(tenant.subscriptionPlan)}>
                      {tenant.subscriptionPlan}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Propriétaire</p>
                      <p className="font-medium">{tenant.owner.fullname}</p>
                      <p className="text-[#525252]">{tenant.owner.email}</p>
                    </div>

                    <div>
                      <p className="text-[#737373]">Contact</p>
                      <p className="font-medium">{tenant.phone}</p>
                      <p className="text-[#525252]">{tenant.email}</p>
                    </div>

                    <div>
                      <p className="text-[#737373]">Localisation</p>
                      <p className="font-medium">{tenant.city}</p>
                      <p className="text-[#525252]">{tenant.type}</p>
                    </div>

                    <div>
                      <p className="text-[#737373]">Statistiques</p>
                      <p className="font-medium">{tenant._count.users} utilisateurs</p>
                      <p className="text-[#525252]">{tenant._count.agencies} agences, {tenant._count.orders} commandes</p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-[#737373]">
                    Inscrit le {formatDate(tenant.createdAt)} • 
                    Abonnement jusqu'au {formatDate(tenant.subscriptionEndDate)}
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('Voir détails:', tenant.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </UpworkButton>
                    {tenant.subscriptionStatus === 'TRIAL' && (
                      <UpworkButton
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleActivateTenant(tenant.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activer
                      </UpworkButton>
                    )}
                    {tenant.isActive && (
                      <UpworkButton
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleSuspendTenant(tenant.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Suspendre
                      </UpworkButton>
                    )}
                  </div>
                </div>
              </div>
            </UpworkCard>
          ))
        ) : (
          <UpworkCard>
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucun pressing trouvé</h3>
              <p className="text-[#737373]">
                {searchTerm || statusFilter !== 'all' || planFilter !== 'all'
                  ? 'Aucun pressing ne correspond à vos critères de recherche.'
                  : 'Aucun pressing inscrit pour le moment.'}
              </p>
            </div>
          </UpworkCard>
        )}
      </div>
    </div>
  );
};

export default RegistrationsPage;
