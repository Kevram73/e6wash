'use client';

import React, { useState, useEffect } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { depositsService } from '@/lib/api/services/deposits';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import InstallmentStats from '@/components/dashboard/InstallmentStats';
import { 
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye,
  CreditCard
} from 'lucide-react';
import { Deposit, PaymentInstallment } from '@/lib/types/deposit';

const InstallmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInstallment, setSelectedInstallment] = useState<PaymentInstallment | null>(null);

  const {
    items: deposits,
    isLoading,
    error
  } = useApiCrudSimple<Deposit>({ service: depositsService, entityName: 'deposit' });

  // Filtrer les dépôts avec paiement échelonné
  const installmentDeposits = deposits.filter(deposit => deposit.isInstallmentPayment);

  // Extraire toutes les échéances
  const allInstallments = installmentDeposits.flatMap(deposit => 
    deposit.installments.map(installment => ({
      ...installment,
      deposit
    }))
  );

  const filteredInstallments = allInstallments.filter(installment => {
    const matchesSearch = installment.deposit.depositNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installment.deposit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installment.deposit.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || installment.status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const today = new Date();
      const dueDate = new Date(installment.dueDate);
      
      switch (dateFilter) {
        case 'today':
          return dueDate.toDateString() === today.toDateString();
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return dueDate >= today && dueDate <= weekFromNow;
        case 'month':
          const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          return dueDate >= today && dueDate <= monthFromNow;
        case 'overdue':
          return dueDate < today && installment.status === 'PENDING';
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculer les statistiques
  const stats = {
    totalInstallments: allInstallments.length,
    paidInstallments: allInstallments.filter(inst => inst.status === 'PAID').length,
    pendingInstallments: allInstallments.filter(inst => inst.status === 'PENDING').length,
    overdueInstallments: allInstallments.filter(inst => 
      inst.status === 'PENDING' && new Date(inst.dueDate) < new Date()
    ).length,
    totalAmount: allInstallments.reduce((sum, inst) => sum + inst.amount, 0),
    paidAmount: allInstallments.filter(inst => inst.status === 'PAID').reduce((sum, inst) => sum + inst.amount, 0),
    pendingAmount: allInstallments.filter(inst => inst.status === 'PENDING').reduce((sum, inst) => sum + inst.amount, 0),
    overdueAmount: allInstallments.filter(inst => 
      inst.status === 'PENDING' && new Date(inst.dueDate) < new Date()
    ).reduce((sum, inst) => sum + inst.amount, 0),
    averageInstallmentAmount: allInstallments.length > 0 ? 
      allInstallments.reduce((sum, inst) => sum + inst.amount, 0) / allInstallments.length : 0,
    completionRate: allInstallments.length > 0 ? 
      (allInstallments.filter(inst => inst.status === 'PAID').length / allInstallments.length) * 100 : 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const isOverdue = (dueDate: Date | string) => {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    return due < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Paiements Échelonnés</h1>
          <p className="text-[#525252] mt-1">
            Gérez les paiements échelonnés et suivez les échéances
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Rapports
          </UpworkButton>
          <UpworkButton className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier
          </UpworkButton>
        </div>
      </div>

      {/* Statistiques */}
      <InstallmentStats stats={stats} />

      {/* Filtres et recherche */}
      <UpworkCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par numéro, client ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-[#a3a3a3]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="PAID">Payé</option>
              <option value="OVERDUE">En retard</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
        </div>
      </UpworkCard>

      {/* Liste des échéances */}
      <div className="grid gap-4">
        {filteredInstallments.length > 0 ? (
          filteredInstallments.map((installment) => (
            <UpworkCard key={installment.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(installment.status)}
                      <h3 className="font-semibold text-lg">
                        Échéance {installment.installmentNumber} - {installment.deposit.depositNumber}
                      </h3>
                    </div>
                    <span className={getStatusColor(installment.status)}>
                      {installment.status}
                    </span>
                    {isOverdue(installment.dueDate) && installment.status === 'PENDING' && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        EN RETARD
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Client</p>
                      <p className="font-medium">{installment.deposit.customerName}</p>
                      <p className="text-[#525252]">{installment.deposit.customerPhone}</p>
                    </div>

                    <div>
                      <p className="text-[#737373]">Montant</p>
                      <p className="font-medium text-lg">{formatCurrency(installment.amount)}</p>
                      <p className="text-[#525252]">
                        {installment.deposit.installmentCount} échéances au total
                      </p>
                    </div>

                    <div>
                      <p className="text-[#737373]">Date d'échéance</p>
                      <p className="font-medium">{formatDate(installment.dueDate)}</p>
                      {installment.paidDate && (
                        <p className="text-green-600">Payé le {formatDate(installment.paidDate)}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-[#737373]">Méthode de paiement</p>
                      <p className="font-medium">
                        {installment.paymentMethod || 'Non spécifiée'}
                      </p>
                      {installment.notes && (
                        <p className="text-[#525252] text-xs">{installment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInstallment(installment)}
                    >
                      <Eye className="h-4 w-4" />
                    </UpworkButton>
                    {installment.status === 'PENDING' && (
                      <UpworkButton
                        size="sm"
                        className={isOverdue(installment.dueDate) ? 'bg-red-600 hover:bg-red-700' : ''}
                        onClick={() => {
                          // Ouvrir le modal de paiement
                          console.log('Payer échéance:', installment.id);
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Payer
                      </UpworkButton>
                    )}
                  </div>
                </div>
              </div>
            </UpworkCard>
          ))
        ) : (
          <UpworkCard>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucune échéance trouvée</h3>
              <p className="text-[#737373]">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Aucune échéance ne correspond à vos critères de recherche.'
                  : 'Aucun paiement échelonné configuré pour le moment.'}
              </p>
            </div>
          </UpworkCard>
        )}
      </div>
    </div>
  );
};

export default InstallmentsPage;
