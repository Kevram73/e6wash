import React, { useState, useEffect } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Building2,
  CreditCard,
  Filter,
  Download
} from 'lucide-react';

interface DailyReceiptsData {
  date: string;
  summary: {
    totalReceipts: number;
    totalOrders: number;
    paidOrders: number;
    partialOrders: number;
    averageOrderValue: number;
  };
  receiptsByAgency: Array<{
    agencyName: string;
    totalAmount: number;
    orderCount: number;
    payments: any[];
  }>;
  receiptsByMethod: Array<{
    method: string;
    totalAmount: number;
    count: number;
  }>;
  payments: any[];
}

const FinancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [receiptsData, setReceiptsData] = useState<DailyReceiptsData | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: agencies } = useApiCrudSimple('agencies');

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        ...(selectedAgency && { agencyId: selectedAgency })
      });

      const response = await fetch(`/api/finance/daily-receipts?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setReceiptsData(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [selectedDate, selectedAgency]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportReceipts = () => {
    if (!receiptsData) return;
    
    const csvContent = [
      ['Date', 'Agence', 'Montant', 'Méthode', 'Client', 'Statut'].join(','),
      ...receiptsData.payments.map(payment => [
        new Date(payment.createdAt).toLocaleDateString('fr-FR'),
        payment.agency?.name || '',
        payment.amount,
        payment.method,
        payment.order?.customer?.fullname || '',
        payment.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recettes-${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600">Gestion des recettes et finances</p>
        </div>
        <div className="flex space-x-3">
          <UpworkButton
            variant="outline"
            onClick={exportReceipts}
            disabled={!receiptsData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </UpworkButton>
        </div>
      </div>

      {/* Filtres */}
      <UpworkCard>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <UpworkInput
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
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
            <UpworkButton onClick={fetchReceipts} disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              {loading ? 'Chargement...' : 'Filtrer'}
            </UpworkButton>
          </div>
        </div>
      </UpworkCard>

      {receiptsData && (
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
                    <p className="text-sm font-medium text-gray-600">Total Recettes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(receiptsData.summary.totalReceipts)}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Commandes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {receiptsData.summary.totalOrders}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Payées</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {receiptsData.summary.paidOrders}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>

            <UpworkCard>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Partielles</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {receiptsData.summary.partialOrders}
                    </p>
                  </div>
                </div>
              </div>
            </UpworkCard>
          </div>

          {/* Recettes par agence */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recettes par Agence
              </h3>
              <div className="space-y-4">
                {receiptsData.receiptsByAgency.map((agency, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{agency.agencyName}</p>
                      <p className="text-sm text-gray-600">{agency.orderCount} commandes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(agency.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Recettes par méthode de paiement */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recettes par Méthode de Paiement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {receiptsData.receiptsByMethod.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 capitalize">{method.method}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(method.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">{method.count} transactions</p>
                  </div>
                ))}
              </div>
            </div>
          </UpworkCard>

          {/* Détail des paiements */}
          <UpworkCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détail des Paiements
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
                        Méthode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {receiptsData.payments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleTimeString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.order?.customer?.fullname || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.agency?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'PAID' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status === 'PAID' ? 'Payé' : 'Partiel'}
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

export default FinancePage;