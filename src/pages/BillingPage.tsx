'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { billingService } from '@/lib/api/services/billing';
import { 
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

const BillingPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    items: billingData,
    isLoading,
    error
  } = useApiCrudSimple({ service: billingService, entityName: 'billing' });

  const filteredBilling = billingData.filter(bill => 
    statusFilter === 'all' || bill.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            En retard
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        );
      default:
        return null;
    }
  };

  const totalRevenue = mockBilling
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const overdueAmount = mockBilling
    .filter(bill => bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header - Upwork Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c2c] flex items-center">
            <TrendingUp className="h-7 w-7 mr-3 text-[#14a800]" />
            Facturation SaaS
          </h1>
          <p className="text-[#525252] mt-1">
            Gérez la facturation et les paiements des abonnements
          </p>
        </div>
        <UpworkButton className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </UpworkButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UpworkCard>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Revenus Totaux</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{totalRevenue.toLocaleString()} F CFA</p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Factures Payées</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {billingData.filter(b => b.status === 'paid').length}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">En Retard</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">
                {billingData.filter(b => b.status === 'overdue').length}
              </p>
            </div>
          </div>
        </UpworkCard>
        
        <UpworkCard>
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-[#14a800]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Montant En Retard</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{overdueAmount.toLocaleString()} F CFA</p>
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Filtres */}
      <UpworkCard>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payé</option>
              <option value="overdue">En retard</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </UpworkCard>

      {/* Liste des Factures */}
      <div className="grid gap-4">
        {filteredBilling.map((bill) => (
          <UpworkCard key={bill.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2c2c2c]">{bill.pressingName}</h3>
                    <p className="text-sm text-[#525252]">Plan: {bill.planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#2c2c2c]">{bill.amount.toLocaleString()} F CFA</p>
                    <p className="text-sm text-[#737373]">#{bill.invoiceNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-[#525252]">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Échéance: {new Date(bill.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                    {bill.paidDate && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Payé le: {new Date(bill.paidDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(bill.status)}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <UpworkButton variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>
          </UpworkCard>
        ))}
      </div>
    </div>
  );
};

export default BillingPage;
