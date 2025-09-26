'use client';

import React, { useState, useEffect } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { loyaltyService } from '@/lib/api/services/loyalty';

interface LoyaltySettings {
  id: string;
  tenantId: string;
  isActive: boolean;
  pointsPerCurrency: number;
  currencyPerPoint: number;
  minimumPointsForRedeem: number;
  expiryMonths: number;
  welcomeBonus: number;
  birthdayBonus: number;
  tiers?: any;
  rules?: any;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    name: string;
  };
}
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Gift,
  Star,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Award,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const LoyaltyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [formData, setFormData] = useState({
    pointsPerCurrency: 1.0,
    currencyPerPoint: 100.0,
    minimumPointsForRedeem: 100,
    expiryMonths: 12,
    welcomeBonus: 0,
    birthdayBonus: 0,
    isActive: true
  });

  const {
    items: loyaltySettingsList,
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
  } = useApiCrudSimple<LoyaltySettings>({ service: loyaltyService, entityName: 'loyalty' });

  // Get the first loyalty settings or create default values
  const loyaltySettings = loyaltySettingsList[0] || {
    id: '',
    tenantId: '',
    isActive: true,
    pointsPerCurrency: 1.0,
    currencyPerPoint: 100.0,
    minimumPointsForRedeem: 100,
    expiryMonths: 12,
    welcomeBonus: 0,
    birthdayBonus: 0,
    tiers: [],
    rules: []
  };

  // Sync form data when loyaltySettings changes
  useEffect(() => {
    if (loyaltySettings.id) {
      setFormData({
        pointsPerCurrency: Number(loyaltySettings.pointsPerCurrency),
        currencyPerPoint: Number(loyaltySettings.currencyPerPoint),
        minimumPointsForRedeem: loyaltySettings.minimumPointsForRedeem,
        expiryMonths: loyaltySettings.expiryMonths,
        welcomeBonus: loyaltySettings.welcomeBonus,
        birthdayBonus: loyaltySettings.birthdayBonus,
        isActive: loyaltySettings.isActive
      });
    }
  }, [loyaltySettings]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const customerStats = {
    totalCustomers: 156,
    activeCustomers: 89,
    totalPointsEarned: 12500,
    totalPointsRedeemed: 3200,
    averagePointsPerCustomer: 80,
    topTierCustomers: 12,
  };

  // Mock data for loyalty transactions
  const loyaltyTransactions = [
    {
      id: '1',
      customerName: 'Marie Dubois',
      type: 'EARNED',
      description: 'Points gagnés pour commande #1234',
      points: 50,
      date: new Date().toISOString()
    },
    {
      id: '2',
      customerName: 'Jean Martin',
      type: 'REDEEMED',
      description: 'Points échangés contre réduction',
      points: -100,
      date: new Date().toISOString()
    }
  ];

  const getTierColor = (tier: string) => {
    const tierData = loyaltySettings.tiers?.find((t: any) => t.name === tier);
    return tierData?.color || '#6B7280';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNED':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'REDEEMED':
        return <Gift className="h-4 w-4 text-blue-500" />;
      case 'WELCOME_BONUS':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'BIRTHDAY_BONUS':
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-[#737373]" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'EARNED':
        return 'bg-green-100 text-green-800';
      case 'REDEEMED':
        return 'bg-blue-100 text-blue-800';
      case 'WELCOME_BONUS':
        return 'bg-yellow-100 text-yellow-800';
      case 'BIRTHDAY_BONUS':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c] flex items-center">
            <Gift className="h-8 w-8 mr-3" />
            Programme de Fidélité
          </h1>
          <p className="text-[#525252] mt-1">
            Gestion des points de fidélité et des niveaux clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UpworkButton variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </UpworkButton>
          <UpworkButton>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Niveau
          </UpworkButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Clients Actifs</p>
                <p className="text-2xl font-bold text-[#14a800]">{customerStats.activeCustomers}</p>
                <p className="text-xs text-[#737373]">sur {customerStats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Points Gagnés</p>
                <p className="text-2xl font-bold text-[#14a800]">{customerStats.totalPointsEarned.toLocaleString()}</p>
                <p className="text-xs text-[#737373]">ce mois</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Points Utilisés</p>
                <p className="text-2xl font-bold text-orange-600">{customerStats.totalPointsRedeemed.toLocaleString()}</p>
                <p className="text-xs text-[#737373]">ce mois</p>
              </div>
              <Gift className="h-8 w-8 text-orange-500" />
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#525252]">Clients Premium</p>
                <p className="text-2xl font-bold text-purple-600">{customerStats.topTierCustomers}</p>
                <p className="text-xs text-[#737373]">Niveau Or/Platine</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          
        </UpworkCard>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e5e5]">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'settings', label: 'Paramètres', icon: Settings },
            { id: 'tiers', label: 'Niveaux', icon: Target },
            { id: 'transactions', label: 'Transactions', icon: Clock },
            { id: 'customers', label: 'Clients', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-[#14a800]'
                    : 'border-transparent text-[#737373] hover:text-[#525252] hover:border-[#e5e5e5]'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' && (
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paramètres du Programme de Fidélité</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configurez les règles et les récompenses de votre programme de fidélité
            </p>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-2">
                  Points par FCFA dépensé
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pointsPerCurrency}
                  onChange={(e) => handleInputChange('pointsPerCurrency', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-2">
                  FCFA par point (valeur de rachat)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currencyPerPoint}
                  onChange={(e) => handleInputChange('currencyPerPoint', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-2">
                  Points minimum pour rachat
                </label>
                <input
                  type="number"
                  value={formData.minimumPointsForRedeem}
                  onChange={(e) => handleInputChange('minimumPointsForRedeem', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-2">
                  Expiration des points (mois)
                </label>
                <input
                  type="number"
                  value={formData.expiryMonths}
                  onChange={(e) => handleInputChange('expiryMonths', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-2">
                  Bonus de bienvenue
                </label>
                <input
                  type="number"
                  value={formData.welcomeBonus}
                  onChange={(e) => handleInputChange('welcomeBonus', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-2">
                  Bonus anniversaire
                </label>
                <input
                  type="number"
                  value={formData.birthdayBonus}
                  onChange={(e) => handleInputChange('birthdayBonus', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-[#e5e5e5] rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-[#2c2c2c]">
                Programme de fidélité actif
              </label>
            </div>
            
            <div className="flex justify-end">
              <UpworkButton>Sauvegarder les paramètres</UpworkButton>
            </div>
          </div>
        </UpworkCard>
      )}

      {activeTab === 'tiers' && (
        <div className="grid gap-6">
          {loyaltySettings.tiers?.map((tier: any, index: number) => (
            <UpworkCard key={index}>
              
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2c2c2c]">{tier.name}</h3>
                      <p className="text-sm text-[#525252]">
                        {tier.pointsRequired} points requis • {tier.discount}% de réduction
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tier.benefits?.map((benefit: string, idx: number) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
      )}

      {activeTab === 'transactions' && (
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transactions de Fidélité</h3>
            <p className="text-sm text-gray-600 mb-4">
              Historique des points gagnés et utilisés par les clients
            </p>
          
            <div className="space-y-4">
              {loyaltyTransactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#2c2c2c]">{transaction.customerName}</h4>
                      <p className="text-sm text-[#525252]">{transaction.description}</p>
                      <p className="text-xs text-[#737373]">{formatDateTime(transaction.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.points > 0 ? 'text-[#14a800]' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                      </p>
                      <p className="text-sm text-[#525252]">Total: {transaction.totalPoints} pts</p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <span className={getTransactionColor(transaction.type)}>
                        {transaction.type}
                      </span>
                      <span 
                        className="px-2 py-1 border rounded text-xs font-medium"
                        style={{ 
                          borderColor: getTierColor(transaction.currentTier),
                          color: getTierColor(transaction.currentTier)
                        }}
                      >
                        {transaction.currentTier}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>
      )}

      {activeTab === 'customers' && (
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clients et Niveaux</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vue d'ensemble des clients et de leurs niveaux de fidélité
            </p>
          
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Liste des clients</h3>
              <p className="text-[#737373]">
                Interface de gestion des clients et de leurs points de fidélité
              </p>
            </div>
          </div>
        </UpworkCard>
      )}
    </div>
  );
};

export default LoyaltyPage;
