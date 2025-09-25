'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { subscriptionsService } from '@/lib/api/services/subscriptions';
import { 
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  TrendingUp,
  Star
} from 'lucide-react';


const SubscriptionPlansPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const {
    items: plans,
    isLoading,
    error
  } = useApiCrudSimple({ service: subscriptionsService, entityName: 'subscriptionPlan' });

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' F CFA/mois';
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Illimité' : limit.toLocaleString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Header - Upwork Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c2c] flex items-center">
            <CreditCard className="h-7 w-7 mr-3 text-[#14a800]" />
            Plans d'Abonnement
          </h1>
          <p className="text-[#525252] mt-1">
            Gérez les plans d'abonnement de la plateforme
          </p>
        </div>
        <UpworkButton className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Plan
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Total Plans</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{plans.length}</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Plans Actifs</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {plans.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Prix Moyen</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length).toLocaleString() : 0} F CFA
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <Star className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Plan Populaire</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">Premium</p>
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Liste des Plans - Upwork Style */}
      <div className="grid gap-6">
        {plans.map((plan) => (
          <UpworkCard key={plan.id} hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#2c2c2c] flex items-center">
                      {plan.name === 'Premium' && <Star className="h-5 w-5 mr-2 text-yellow-500" />}
                      {plan.name}
                    </h3>
                    <div className="flex items-center mt-2">
                      {plan.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#2c2c2c]">
                      {formatPrice(plan.price)}
                    </p>
                    <p className="text-sm text-[#737373]">par mois</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-3 text-[#14a800]" />
                    <div>
                      <p className="text-sm text-[#737373]">Agences</p>
                      <p className="font-semibold text-[#2c2c2c]">{formatLimit(plan.maxAgences)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-[#14a800]" />
                    <div>
                      <p className="text-sm text-[#737373]">Utilisateurs</p>
                      <p className="font-semibold text-[#2c2c2c]">{formatLimit(plan.maxUsers)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-3 text-[#14a800]" />
                    <div>
                      <p className="text-sm text-[#737373]">Commandes/mois</p>
                      <p className="font-semibold text-[#2c2c2c]">{formatLimit(plan.maxOrdersPerMonth)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-[#525252] mb-3">Fonctionnalités incluses :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-[#525252]">
                        <CheckCircle className="h-4 w-4 mr-2 text-[#14a800] flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-6">
                <UpworkButton variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>
          </UpworkCard>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
