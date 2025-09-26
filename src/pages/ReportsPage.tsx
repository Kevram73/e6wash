'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { reportsService } from '@/lib/api/services/reports';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Package,
  Users,
  Truck,
  PieChart,
  LineChart
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedAgency, setSelectedAgency] = useState('all');

  const {
    items: reportsData,
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
  } = useApiCrudSimple({ service: reportsService, entityName: 'report' });

  // Mock data for reports (since the API structure is complex)
  const revenueData = [
    { month: 'Jan', revenue: 1200000 },
    { month: 'Fév', revenue: 1500000 },
    { month: 'Mar', revenue: 1800000 },
    { month: 'Avr', revenue: 1600000 },
    { month: 'Mai', revenue: 2000000 },
    { month: 'Juin', revenue: 2200000 }
  ];

  const serviceStats = [
    { service: 'Nettoyage à sec', orders: 45, revenue: 450000 },
    { service: 'Repassage', orders: 32, revenue: 320000 },
    { service: 'Blanchisserie', orders: 28, revenue: 280000 },
    { service: 'Retouches', orders: 15, revenue: 150000 }
  ];

  const summaryStats = {
    totalOrders: 120,
    totalRevenue: 1200000,
    totalCustomers: 89,
    totalServices: 4
  };

  const agencyStats = [
    { name: 'Agence Centre', orders: 45, revenue: 450000, growth: 12 },
    { name: 'Agence Nord', orders: 32, revenue: 320000, growth: 8 },
    { name: 'Agence Sud', orders: 28, revenue: 280000, growth: 5 },
    { name: 'Agence Est', orders: 15, revenue: 150000, growth: 2 }
  ];

  const collectorStats = [
    { name: 'Jean Martin', missions: 45, successRate: 98, earnings: 45000 },
    { name: 'Marie Dubois', missions: 38, successRate: 96, earnings: 38000 },
    { name: 'Pierre Durand', missions: 32, successRate: 94, earnings: 32000 },
    { name: 'Sophie Moreau', missions: 28, successRate: 92, earnings: 28000 }
  ];
  

  

  

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Rapports & Statistiques</h1>
          <p className="text-[#525252] mt-1">
            Analyse des performances et tendances
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </UpworkButton>
          <UpworkButton className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </UpworkButton>
        </div>
      </div>

      {/* Filtres */}
      <UpworkCard>
        
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#a3a3a3]" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#a3a3a3]" />
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              >
                <option value="all">Toutes les agences</option>
                <option value="douala-main">Agence Principale - Douala</option>
                <option value="yaounde-centre">Agence Yaoundé Centre</option>
                <option value="douala-bonanjo">Agence Douala Bonanjo</option>
                <option value="yaounde-essos">Agence Yaoundé Essos</option>
              </select>
            </div>
          </div>
        
      </UpworkCard>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(4500000)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-[#14a800] ml-1">+12.5%</span>
                </div>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#14a800]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Commandes</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">260</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-[#14a800] ml-1">+8.3%</span>
                </div>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Clients Actifs</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">1,250</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-[#14a800] ml-1">+5.2%</span>
                </div>
              </div>
            </div>
          
        </UpworkCard>
        
        <UpworkCard>
          
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-[#525252]">Taux de Réussite</p>
                <p className="text-2xl font-bold text-[#2c2c2c]">96%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-[#14a800] ml-1">+2.1%</span>
                </div>
              </div>
            </div>
          
        </UpworkCard>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution du CA */}
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Évolution du Chiffre d'Affaires
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tendances mensuelles des revenus
            </p>
          
            <div className="h-64 flex items-end justify-between space-x-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-[#f0fdf4]0 rounded-t w-full mb-2 transition-all hover:bg-blue-600"
                    style={{ height: `${(data.revenue / 5000000) * 200}px` }}
                  ></div>
                  <span className="text-xs text-[#525252]">{data.month}</span>
                  <span className="text-xs font-medium">{formatCurrency(data.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>

        {/* Répartition des services */}
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Répartition par Service
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Distribution des commandes par type de service
            </p>
          
            <div className="space-y-4">
              {serviceStats.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ 
                        backgroundColor: index === 0 ? '#3B82F6' : 
                                        index === 1 ? '#10B981' : 
                                        index === 2 ? '#F59E0B' : '#EF4444' 
                      }}
                    ></div>
                    <span className="text-sm font-medium">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(service.revenue)}</p>
                    <p className="text-xs text-[#525252]">{service.orders} commandes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Performance par Agence */}
      <UpworkCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance par Agence
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Comparaison des performances entre agences
          </p>
        
          <div className="space-y-4">
            {agencyStats.map((agency, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-[#2c2c2c]">{agency.name}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-[#525252]">{formatNumber(agency.orders)} commandes</span>
                    <span className="text-sm text-[#525252]">{formatCurrency(agency.revenue)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {agency.growth > 0 ? (
                    <div className="flex items-center text-[#14a800]">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">+{agency.growth}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-[#737373]">
                      <span className="text-sm font-medium">-</span>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    agency.growth > 10 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : agency.growth > 5 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {agency.growth > 10 ? 'Excellent' : agency.growth > 5 ? 'Bon' : 'Moyen'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </UpworkCard>

      {/* Performance des Collecteurs */}
      <UpworkCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Performance des Collecteurs
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Statistiques détaillées des collecteurs
          </p>
        
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c2c]">Collecteur</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c2c]">Missions</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c2c]">Taux de Réussite</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c2c]">Gains</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c2c]">Performance</th>
                </tr>
              </thead>
              <tbody>
                {collectorStats.map((collector, index) => (
                  <tr key={index} className="border-b hover:bg-[#f7f7f7]">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#2c2c2c]">{collector.name}</div>
                    </td>
                    <td className="py-3 px-4 text-[#525252]">{formatNumber(collector.missions)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-[#e5e5e5] rounded-full h-2 mr-2">
                          <div 
                            className="bg-[#f0fdf4]0 h-2 rounded-full" 
                            style={{ width: `${collector.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{collector.successRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#525252]">{formatCurrency(collector.earnings)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        collector.successRate >= 96 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : collector.successRate >= 94 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {collector.successRate >= 96 ? 'Excellent' : collector.successRate >= 94 ? 'Bon' : 'Moyen'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </UpworkCard>
    </div>
  );
};

export default ReportsPage;
