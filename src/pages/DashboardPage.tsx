'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { dashboardService } from '@/lib/api/services/dashboard';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Building2, 
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { UserRole } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const DashboardPage: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const userRole = user?.role as UserRole;

  const [dashboardData, setDashboardData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Vérifier si l'utilisateur est connecté
        if (!user || !userRole) {
          setError('Utilisateur non connecté');
          setIsLoading(false);
          return;
        }
        
        const response = await dashboardService.getDashboardStats(userRole);
        
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.error || 'Erreur lors du chargement des données');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données du dashboard');
        console.error('Erreur dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userRole]);

  const data = dashboardData;
  
  // Debug: Afficher les données reçues
  console.log('Dashboard data received:', data);
  console.log('User role:', userRole);
  console.log('User:', user);

  const getMainCards = () => {
    if (userRole === 'SUPER_ADMIN') {
      return [
        {
          title: 'Pressings Actifs',
          value: data.totalPressings,
          change: `+${data.newPressingsThisMonth} ce mois`,
          icon: Building2,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
        {
          title: 'Revenus Totaux',
          value: formatCurrency(data.totalRevenue),
          change: '+12% vs mois dernier',
          icon: DollarSign,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
        {
          title: 'Abonnements Actifs',
          value: data.activeSubscriptions,
          change: '93% de taux de rétention',
          icon: Users,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
        {
          title: 'Commandes Totales',
          value: data.totalOrders,
          change: '+8% vs mois dernier',
          icon: ShoppingBag,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
      ];
    } else {
      return [
        {
          title: 'Commandes Aujourd\'hui',
          value: data.completedOrdersToday || 0,
          change: `${data.pendingOrders || 0} en attente`,
          icon: ShoppingBag,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
        {
          title: 'Revenus Aujourd\'hui',
          value: formatCurrency(data.revenueToday || 0),
          change: 'En hausse',
          icon: DollarSign,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
        {
          title: 'Agences Actives',
          value: data.activeAgences || 0,
          change: 'Toutes opérationnelles',
          icon: Building2,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
        {
          title: 'Satisfaction Client',
          value: '4.8/5',
          change: 'Excellent',
          icon: TrendingUp,
          color: 'text-[#14a800]',
          bgColor: 'bg-[#f0fdf4]',
        },
      ];
    }
  };

  const mainCards = getMainCards();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14a800] mx-auto mb-4"></div>
          <p className="text-[#737373]">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          {error === 'Utilisateur non connecté' ? (
            <UpworkButton onClick={() => window.location.href = '/auth/signin'}>
              Se connecter
            </UpworkButton>
          ) : (
            <UpworkButton onClick={() => window.location.reload()}>
              Réessayer
            </UpworkButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info - À supprimer en production */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info (à supprimer)</h3>
        <div className="text-xs text-yellow-700">
          <p><strong>User Role:</strong> {userRole || 'Non défini'}</p>
          <p><strong>User:</strong> {user?.name || 'Non connecté'}</p>
          <p><strong>Data:</strong> {JSON.stringify(data, null, 2)}</p>
        </div>
      </div>

      {/* Header - Upwork Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[#525252] mt-1">
            {formatDate(new Date())} • {user?.pressing?.name || 'E6Wash SaaS'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm bg-[#f0fdf4] text-[#14a800] px-3 py-1 rounded border border-[#bbf7d0]">
            {userRole === 'SUPER_ADMIN' ? 'Super Admin' : 
             userRole === 'PRESSING_ADMIN' ? 'Admin Pressing' :
             userRole === 'ADMIN' ? 'Administrateur' :
             userRole === 'OWNER' ? 'Propriétaire' : userRole}
          </span>
          {user?.agence && (
            <span className="text-sm bg-[#f5f5f5] text-[#737373] px-3 py-1 rounded border border-[#e5e5e5]">
              {user.agence.name}
            </span>
          )}
        </div>
      </div>

      {/* Main Stats Cards - Upwork Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <UpworkCard key={index} hover padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#525252] mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-[#2c2c2c] mb-1">{card.value}</p>
                  <p className="text-xs text-[#737373]">{card.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor} flex-shrink-0`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </UpworkCard>
          );
        })}
      </div>

      {/* Performance Chart Placeholder - Upwork Style */}
      <UpworkCard padding="lg">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <BarChart3 className="h-5 w-5 mr-2 text-[#14a800]" />
            Performance
          </h3>
          <p className="text-[#525252]">
            Évolution des indicateurs clés
          </p>
        </div>
        <div className="h-64 flex items-center justify-center bg-[#f7f7f7] rounded-lg border border-[#e5e5e5]">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-[#a3a3a3] mx-auto mb-3" />
            <p className="text-[#525252] font-medium mb-1">Graphique de performance</p>
            <p className="text-sm text-[#737373]">Intégration avec une bibliothèque de graphiques</p>
          </div>
        </div>
      </UpworkCard>
    </div>
  );
};

export default DashboardPage;