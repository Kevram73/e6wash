'use client';

import React from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Package,
  CheckCircle,
  Activity
} from 'lucide-react';

const GlobalStatsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header - Upwork Style */}
      <div>
        <h1 className="text-2xl font-bold text-[#2c2c2c] flex items-center">
          <BarChart3 className="h-7 w-7 mr-3 text-[#14a800]" />
          Statistiques Globales
        </h1>
        <p className="text-[#525252] mt-1">
          Vue d'ensemble de la plateforme E6Wash
        </p>
      </div>

      {/* Statistiques Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UpworkCard>
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Total Pressings</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">45</p>
              <p className="text-xs text-green-600">+12% ce mois</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <Users className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">1,250</p>
              <p className="text-xs text-green-600">+8% ce mois</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Commandes Totales</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">15,420</p>
              <p className="text-xs text-green-600">+15% ce mois</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Revenus SaaS</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">2.5M F CFA</p>
              <p className="text-xs text-green-600">+20% ce mois</p>
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Graphiques Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpworkCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-[#14a800]" />
              Évolution des Revenus
            </h3>
            <p className="text-[#525252]">
              Revenus mensuels des abonnements
            </p>
          </div>
          <div className="h-64 flex items-center justify-center bg-[#f7f7f7] rounded-lg border border-[#e5e5e5]">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-[#a3a3a3] mx-auto mb-3" />
              <p className="text-[#525252] font-medium mb-1">Graphique des revenus</p>
              <p className="text-sm text-[#737373]">Intégration avec une bibliothèque de graphiques</p>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
              <Activity className="h-5 w-5 mr-2 text-[#14a800]" />
              Activité des Pressings
            </h3>
            <p className="text-[#525252]">
              Répartition par statut d'abonnement
            </p>
          </div>
          <div className="h-64 flex items-center justify-center bg-[#f7f7f7] rounded-lg border border-[#e5e5e5]">
            <div className="text-center">
              <Activity className="h-12 w-12 text-[#a3a3a3] mx-auto mb-3" />
              <p className="text-[#525252] font-medium mb-1">Graphique d'activité</p>
              <p className="text-sm text-[#737373]">Intégration avec une bibliothèque de graphiques</p>
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Métriques Détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpworkCard>
          <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4">Plans d'Abonnement</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Basic</span>
              <span className="font-semibold text-[#2c2c2c]">25 pressings</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Premium</span>
              <span className="font-semibold text-[#2c2c2c]">15 pressings</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Enterprise</span>
              <span className="font-semibold text-[#2c2c2c]">5 pressings</span>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4">Statut des Abonnements</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#525252] flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Actifs
              </span>
              <span className="font-semibold text-[#2c2c2c]">42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Suspendus</span>
              <span className="font-semibold text-[#2c2c2c]">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Annulés</span>
              <span className="font-semibold text-[#2c2c2c]">1</span>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Taux de rétention</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Satisfaction client</span>
              <span className="font-semibold text-green-600">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Temps de réponse</span>
              <span className="font-semibold text-[#2c2c2c]">2.3s</span>
            </div>
          </div>
        </UpworkCard>
      </div>
    </div>
  );
};

export default GlobalStatsPage;
