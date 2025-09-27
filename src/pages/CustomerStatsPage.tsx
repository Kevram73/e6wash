import React, { useState, useEffect } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Building2,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface CustomerStatsData {
  customers: Array<{
    id: string;
    fullname: string;
    phone: string;
    email: string;
    agency: { name: string };
    stats: {
      totalSpent: number;
      totalPaid: number;
      remainingAmount: number;
      orderCount: number;
      lastOrder: string | null;
      daysSinceLastOrder: number | null;
      averageOrderValue: number;
      paymentRate: number;
    };
  }>;
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    totalRevenue: number;
    totalPaid: number;
    totalOrders: number;
    averageCustomerValue: number;
    averageOrderValue: number;
    paymentRate: number;
  };
  customersByAgency: Array<{
    agencyName: string;
    customerCount: number;
    totalRevenue: number;
    totalOrders: number;
  }>;
}

const CustomerStatsPage: React.FC = () => {
  const [selectedAgency, setSelectedAgency] = useState('');
  const [sortBy, setSortBy] = useState('totalSpent');
  const [searchTerm, setSearchTerm] = useState('');
  const [statsData, setStatsData] = useState<CustomerStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: agencies } = useApiCrudSimple('agencies');

  const sortOptions = [
    { value: 'totalSpent', label: 'Montant dépensé' },
    { value: 'orderCount', label: 'Nombre de commandes' },
    { value: 'lastOrder', label: 'Dernière commande' },
    { value: 'paymentRate', label: 'Taux de paiement' }
  ];

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        limit: '100',
        ...(selectedAgency && { agencyId: selectedAgency })
      });

      const response = await fetch(`/api/stats/customers?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setStatsData(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedAgency, sortBy]);

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

  const getCustomerStatus = (daysSinceLastOrder: number | null) => {
    if (daysSinceLastOrder === null) return { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' };
    if (daysSinceLastOrder <= 7) return { label: 'Très actif', color: 'bg-green-100 text-green-800' };
    if (daysSinceLastOrder <= 30) return { label: 'Actif', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Inactif', color: 'bg-red-100 text-red-800' };
  };

  const filteredCustomers = statsData?.customers.filter(customer =>
    customer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques Clients</h1>
          <p className="text-gray-600">Analyse et classement des clients</p>
        </div>
      </div>

      {/* Filtres */}
      <UpworkCard>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <UpworkInput
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
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
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsData.summary.totalCustomers}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsData.summary.activeCustomers}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(statsData.summary.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(statsData.summary.averageCustomerValue)}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>
          </div>

          {/* Clients par agence */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Répartition par Agence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statsData.customersByAgency.map((agency, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{agency.agencyName}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {agency.customerCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(agency.totalRevenue)} • {agency.totalOrders} commandes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Liste des clients */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Classement des Clients ({filteredCustomers.length})
              </h3>
              <div className="space-y-3">
                {filteredCustomers.map((customer, index) => {
                  const status = getCustomerStatus(customer.stats.daysSinceLastOrder);
                  return (
                    <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{customer.fullname}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {customer.phone} • {customer.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {customer.agency.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(customer.stats.totalSpent)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {customer.stats.orderCount} commandes
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.stats.paymentRate.toFixed(1)}% payé
                        </p>
                        {customer.stats.lastOrder && (
                          <p className="text-xs text-gray-400">
                            Dernière: {formatDate(customer.stats.lastOrder)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </UpworkCard>
        </>
      )}
    </div>
  );
};

export default CustomerStatsPage;
