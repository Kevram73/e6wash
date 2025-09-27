import React, { useState, useEffect } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Building2,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';

interface SalesStatsData {
  period: string;
  summary: {
    totalSales: number;
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    averageOrderValue: number;
    paymentRate: number;
  };
  salesByAgency: Array<{
    agencyName: string;
    totalSales: number;
    orderCount: number;
    paidOrders: number;
  }>;
  salesByService: Array<{
    serviceName: string;
    category: string;
    totalSales: number;
    orderCount: number;
    quantity: number;
  }>;
  salesByDay: Array<{
    date: string;
    totalSales: number;
    orderCount: number;
  }>;
  topCustomers: Array<{
    customerName: string;
    customerPhone: string;
    totalSales: number;
    orderCount: number;
  }>;
}

const SalesStatsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [statsData, setStatsData] = useState<SalesStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: agencies } = useApiCrudSimple('agencies');

  const periods = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' }
  ];

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(selectedAgency && { agencyId: selectedAgency })
      });

      const response = await fetch(`/api/stats/sales?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setStatsData(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod, selectedAgency]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques de Ventes</h1>
          <p className="text-gray-600">Analyse des performances commerciales</p>
        </div>
      </div>

      {/* Filtres */}
      <UpworkCard>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les agences</option>
                {agencies?.map((agency: any) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>
            <UpworkButton onClick={fetchStats} disabled={loading}>
              {loading ? 'Chargement...' : 'Actualiser'}
            </UpworkButton>
          </div>
        </div>
      </UpworkCard>

      {statsData && (
        <>
          {/* Résumé */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Ventes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(statsData.summary.totalSales)}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Commandes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsData.summary.totalOrders}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux de Paiement</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsData.summary.paymentRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Panier Moyen</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(statsData.summary.averageOrderValue)}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>
          </div>

          {/* Ventes par agence */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ventes par Agence
              </h3>
              <div className="space-y-4">
                {statsData.salesByAgency.map((agency, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{agency.agencyName}</p>
                      <p className="text-sm text-gray-600">
                        {agency.orderCount} commandes • {agency.paidOrders} payées
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(agency.totalSales)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {agency.orderCount > 0 ? 
                          formatCurrency(agency.totalSales / agency.orderCount) : 
                          '0 FCFA'
                        } / commande
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Ventes par service */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ventes par Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statsData.salesByService.map((service, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{service.serviceName}</p>
                    <p className="text-sm text-gray-600 capitalize">{service.category}</p>
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      {formatCurrency(service.totalSales)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {service.orderCount} commandes • {service.quantity} articles
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Top clients */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top 10 Clients
              </h3>
              <div className="space-y-3">
                {statsData.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.customerName}</p>
                        <p className="text-sm text-gray-600">{customer.customerPhone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(customer.totalSales)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {customer.orderCount} commandes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Ventes par jour */}
          {statsData.salesByDay.length > 0 && (
            <UpworkCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ventes par Jour
                </h3>
                <div className="space-y-3">
                  {statsData.salesByDay.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(day.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {day.orderCount} commandes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(day.totalSales)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </UpworkCard>
          )}
        </>
      )}
    </div>
  );
};

export default SalesStatsPage;
