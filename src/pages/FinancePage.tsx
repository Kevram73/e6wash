'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { billingService } from '@/lib/api/services/billing';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Calendar,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';

const FinancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('month');
  const [typeFilter, setTypeFilter] = useState('all');

  const {
    items: payments,
    isLoading,
    error
  } = useApiCrudSimple({ service: billingService, entityName: 'billing' });

  // Variables calculées pour remplacer les données mock
  const expenses: any[] = []; // TODO: Remplacer par un appel API pour les dépenses
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || payment.method === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
      default:
        return 'bg-[#f5f5f5] text-[#2c2c2c]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminé';
      case 'PENDING':
        return 'En attente';
      case 'FAILED':
        return 'Échoué';
      case 'REFUNDED':
        return 'Remboursé';
      default:
        return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Banknote className="h-4 w-4" />;
      case 'MOBILE_MONEY':
        return <Smartphone className="h-4 w-4" />;
      case 'CARD':
        return <CreditCard className="h-4 w-4" />;
      case 'BANK_TRANSFER':
        return <DollarSign className="h-4 w-4" />;
      case 'WALLET':
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Espèces';
      case 'MOBILE_MONEY':
        return 'Mobile Money';
      case 'CARD':
        return 'Carte bancaire';
      case 'BANK_TRANSFER':
        return 'Virement bancaire';
      case 'WALLET':
        return 'Wallet interne';
      default:
        return method;
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

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.netAmount, 0);
  
  const totalExpenses = expenses
    .filter(e => e.status === 'PAID')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const netProfit = totalRevenue - totalExpenses;
  
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const pendingExpenses = expenses.filter(e => e.status === 'PENDING').length;

  const paymentMethods = [
    { method: 'CASH', count: payments.filter(p => p.method === 'CASH').length, amount: payments.filter(p => p.method === 'CASH').reduce((sum, p) => sum + p.netAmount, 0) },
    { method: 'MOBILE_MONEY', count: payments.filter(p => p.method === 'MOBILE_MONEY').length, amount: payments.filter(p => p.method === 'MOBILE_MONEY').reduce((sum, p) => sum + p.netAmount, 0) },
    { method: 'CARD', count: payments.filter(p => p.method === 'CARD').length, amount: payments.filter(p => p.method === 'CARD').reduce((sum, p) => sum + p.netAmount, 0) },
    { method: 'BANK_TRANSFER', count: payments.filter(p => p.method === 'BANK_TRANSFER').length, amount: payments.filter(p => p.method === 'BANK_TRANSFER').reduce((sum, p) => sum + p.netAmount, 0) },
    { method: 'WALLET', count: payments.filter(p => p.method === 'WALLET').length, amount: payments.filter(p => p.method === 'WALLET').reduce((sum, p) => sum + p.netAmount, 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Finances</h1>
          <p className="text-[#525252] mt-1">
            Gestion financière et comptabilité
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </UpworkButton>
          <UpworkButton className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Transaction
          </UpworkButton>
        </div>
      </div>

      {/* KPIs Financiers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Revenus</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-[#14a800]">+12.5% ce mois</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Dépenses</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-red-600">+8.3% ce mois</p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Bénéfice Net</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-[#14a800]' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </p>
                <p className={`text-xs ${netProfit >= 0 ? 'text-[#14a800]' : 'text-red-600'}`}>
                  {netProfit >= 0 ? '+15.2%' : '-5.1%'} ce mois
                </p>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">En Attente</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{pendingPayments + pendingExpenses}</p>
                <p className="text-xs text-[#525252]">Paiements & Dépenses</p>
              </div>
            </div>
          
        </UpworkCard>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des moyens de paiement */}
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <PieChart className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Moyens de Paiement</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Répartition des revenus par méthode de paiement
            </p>
          
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(method.method)}
                      <span className="text-sm font-medium">{getMethodText(method.method)}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-medium">{method.count}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(method.amount)}</p>
                    <p className="text-xs text-[#525252]">
                      {((method.amount / totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>

        {/* Dépenses par catégorie */}
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Dépenses par Catégorie</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Répartition des dépenses par type
            </p>
          
            <div className="space-y-4">
              {expenses.reduce((acc, expense) => {
                const existing = acc.find(item => item.category === expense.category);
                if (existing) {
                  existing.amount += expense.amount;
                } else {
                  acc.push({ category: expense.category, amount: expense.amount });
                }
                return acc;
              }, [] as { category: string; amount: number }[]).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.category}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-[#525252]">
                      {((category.amount / totalExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Filtres */}
      <UpworkCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro de commande, client ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#a3a3a3]" />
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="CASH">Espèces</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CARD">Carte bancaire</option>
                <option value="BANK_TRANSFER">Virement bancaire</option>
                <option value="WALLET">Wallet interne</option>
              </select>
            </div>
          </div>
        </div>
      </UpworkCard>

      {/* Transactions récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paiements */}
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Paiements Récents</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Dernières transactions entrantes
            </p>
          
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMethodIcon(payment.method)}
                    <div>
                      <p className="font-medium text-sm">{payment.orderNumber}</p>
                      <p className="text-xs text-[#525252]">{payment.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatCurrency(payment.netAmount)}</p>
                    <span className={getStatusColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>

        {/* Dépenses */}
        <UpworkCard>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <TrendingDown className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Dépenses Récentes</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Dernières sorties d'argent
            </p>
          
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-[#525252]">{expense.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-red-600">{formatCurrency(expense.amount)}</p>
                    <span className={getStatusColor(expense.status)}>
                      {getStatusText(expense.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>
      </div>
    </div>
  );
};

export default FinancePage;
