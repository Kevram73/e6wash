import React from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  CheckCircle
} from 'lucide-react';

interface RegistrationStatsProps {
  stats: {
    totalRegistrations: number;
    monthlyRegistrations: number;
    activeTenants: number;
    conversionRate: number;
    popularPlan: string;
    averageRevenue: number;
  };
}

const RegistrationStats: React.FC<RegistrationStatsProps> = ({ stats }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total des inscriptions */}
      <UpworkCard>
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Total Inscriptions</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.totalRegistrations}</p>
            <p className="text-xs text-[#737373]">Pressings inscrits</p>
          </div>
        </div>
      </UpworkCard>

      {/* Inscriptions ce mois */}
      <UpworkCard>
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Ce Mois</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.monthlyRegistrations}</p>
            <p className="text-xs text-[#737373]">Nouvelles inscriptions</p>
          </div>
        </div>
      </UpworkCard>

      {/* Tenants actifs */}
      <UpworkCard>
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Tenants Actifs</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.activeTenants}</p>
            <p className="text-xs text-[#737373]">Pressings actifs</p>
          </div>
        </div>
      </UpworkCard>

      {/* Taux de conversion */}
      <UpworkCard>
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Taux de Conversion</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{formatPercentage(stats.conversionRate)}</p>
            <p className="text-xs text-[#737373]">Inscriptions → Actifs</p>
          </div>
        </div>
      </UpworkCard>

      {/* Plan populaire */}
      <UpworkCard>
        <div className="flex items-center">
          <Star className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Plan Populaire</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.popularPlan}</p>
            <p className="text-xs text-[#737373]">Le plus choisi</p>
          </div>
        </div>
      </UpworkCard>

      {/* Revenus moyens */}
      <UpworkCard>
        <div className="flex items-center">
          <Users className="h-8 w-8 text-indigo-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-[#525252]">Revenus Moyens</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(stats.averageRevenue)}</p>
            <p className="text-xs text-[#737373]">Par tenant/mois</p>
          </div>
        </div>
      </UpworkCard>
    </div>
  );
};

export default RegistrationStats;
