import React, { useState, useEffect } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Building2,
  Package,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';

interface DailyReportData {
  date: string;
  summary: {
    totalSales: number;
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    averageOrderValue: number;
    totalReceipts: number;
    receiptsByMethod: Array<{
      method: string;
      amount: number;
      count: number;
    }>;
    newCustomers: number;
    totalCollections: number;
    assignedCollections: number;
    completedCollections: number;
    withdrawals: number;
  };
  salesByAgency: Array<{
    agencyName: string;
    totalSales: number;
    orderCount: number;
    receipts: number;
  }>;
  salesByService: Array<{
    serviceName: string;
    category: string;
    totalSales: number;
    orderCount: number;
    quantity: number;
  }>;
  orders: any[];
  payments: any[];
  newCustomers: any[];
  collectionRequests: any[];
}

const DailyReportsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: agencies } = useApiCrudSimple('agencies');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        ...(selectedAgency && { agencyId: selectedAgency })
      });

      const response = await fetch(`/api/reports/daily?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setReportData(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du rapport:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedDate, selectedAgency]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR');
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const csvContent = [
      ['Rapport Journalier', reportData.date].join(','),
      [''],
      ['Résumé'],
      ['Total Ventes', reportData.summary.totalSales],
      ['Total Commandes', reportData.summary.totalOrders],
      ['Commandes Payées', reportData.summary.paidOrders],
      ['Commandes En Attente', reportData.summary.pendingOrders],
      ['Total Recettes', reportData.summary.totalReceipts],
      ['Nouveaux Clients', reportData.summary.newCustomers],
      ['Collectes', reportData.summary.totalCollections],
      [''],
      ['Ventes par Agence'],
      ['Agence', 'Ventes', 'Commandes', 'Recettes'],
      ...reportData.salesByAgency.map(agency => [
        agency.agencyName,
        agency.totalSales,
        agency.orderCount,
        agency.receipts
      ])
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapport Journalier</h1>
          <p className="text-gray-600">Synthèse complète de la journée</p>
        </div>
        <div className="flex space-x-3">
          <UpworkButton
            variant="outline"
            onClick={exportReport}
            disabled={!reportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </UpworkButton>
          <UpworkButton onClick={fetchReport} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </UpworkButton>
        </div>
      </div>

      {/* Filtres */}
      <UpworkCard>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>
        </div>
      </UpworkCard>

      {reportData && (
        <>
          {/* Résumé des ventes */}
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
                      {formatCurrency(reportData.summary.totalSales)}
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
                      {reportData.summary.totalOrders}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recettes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(reportData.summary.totalReceipts)}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Nouveaux Clients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.newCustomers}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>
          </div>

          {/* Collectes */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Collectes du Jour
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Total Collectes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.summary.totalCollections}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Assignées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.summary.assignedCollections}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.summary.completedCollections}
                  </p>
                </div>
              </div>
            </div>
          </UpworkCard>

          {/* Ventes par agence */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance par Agence
              </h3>
              <div className="space-y-4">
                {reportData.salesByAgency.map((agency, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{agency.agencyName}</p>
                      <p className="text-sm text-gray-600">{agency.orderCount} commandes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(agency.totalSales)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Recettes: {formatCurrency(agency.receipts)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Recettes par méthode */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recettes par Méthode de Paiement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportData.summary.receiptsByMethod.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 capitalize">{method.method}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(method.amount)}
                    </p>
                    <p className="text-sm text-gray-600">{method.count} transactions</p>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Détail des commandes */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Commandes du Jour ({reportData.orders.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.orders.slice(0, 10).map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer?.fullname || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.agency?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === 'PAID' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus === 'PAID' ? 'Payé' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </UpworkCard>
        </>
      )}
    </div>
  );
};

export default DailyReportsPage;
