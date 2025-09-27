import React from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react';

interface InstallmentStatsProps {
  stats: {
    totalInstallments: number;
    paidInstallments: number;
    pendingInstallments: number;
    overdueInstallments: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    averageInstallmentAmount: number;
    completionRate: number;
  };
}

const InstallmentStats: React.FC<InstallmentStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total des échéances */}
      <UpworkCard>
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Total Échéances</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.totalInstallments}</p>
            <p className="text-xs text-[#737373]">
              {formatCurrency(stats.totalAmount)} au total
            </p>
          </div>
        </div>
      </UpworkCard>

      {/* Échéances payées */}
      <UpworkCard>
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Payées</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.paidInstallments}</p>
            <p className="text-xs text-[#737373]">
              {formatCurrency(stats.paidAmount)} reçus
            </p>
          </div>
        </div>
      </UpworkCard>

      {/* Échéances en attente */}
      <UpworkCard>
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">En Attente</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.pendingInstallments}</p>
            <p className="text-xs text-[#737373]">
              {formatCurrency(stats.pendingAmount)} à recevoir
            </p>
          </div>
        </div>
      </UpworkCard>

      {/* Échéances en retard */}
      <UpworkCard>
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">En Retard</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.overdueInstallments}</p>
            <p className="text-xs text-[#737373]">
              {formatCurrency(stats.overdueAmount)} en souffrance
            </p>
          </div>
        </div>
      </UpworkCard>

      {/* Taux de completion */}
      <UpworkCard>
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Taux de Completion</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{formatPercentage(stats.completionRate)}</p>
            <p className="text-xs text-[#737373]">
              Moyenne: {formatCurrency(stats.averageInstallmentAmount)}
            </p>
          </div>
        </div>
      </UpworkCard>

      {/* Montant moyen par échéance */}
      <UpworkCard>
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-indigo-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Montant Moyen</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(stats.averageInstallmentAmount)}</p>
            <p className="text-xs text-[#737373]">
              Par échéance
            </p>
          </div>
        </div>
      </UpworkCard>

      {/* Progression visuelle */}
      <UpworkCard className="md:col-span-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Progression des Paiements</h3>
          
          {/* Barre de progression globale */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Paiements reçus</span>
              <span>{formatPercentage(stats.completionRate)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Détail des montants */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium text-green-600">{formatCurrency(stats.paidAmount)}</p>
              <p className="text-gray-500">Payé</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
              <p className="text-gray-500">En attente</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-red-600">{formatCurrency(stats.overdueAmount)}</p>
              <p className="text-gray-500">En retard</p>
            </div>
          </div>
        </div>
      </UpworkCard>
    </div>
  );
};

export default InstallmentStats;
