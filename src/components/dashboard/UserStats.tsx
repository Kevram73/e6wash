import React, { useState, useEffect } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import { Users, UserCheck, UserX, Shield, TrendingUp } from 'lucide-react';
import { usersService } from '@/lib/api/services/users';
import { UserStats as UserStatsType } from '@/lib/types/user-management';

interface UserStatsProps {
  className?: string;
}

const UserStats: React.FC<UserStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<UserStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await usersService.getUserStats();
      if (response.success) {
        setStats(response.data || null);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <UpworkCard key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </UpworkCard>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const activePercentage = stats.totalUsers > 0 
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100) 
    : 0;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <UpworkCard className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#14a800] rounded-xl flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#525252]">Total Utilisateurs</p>
            <p className="text-2xl font-bold text-[#2c2c2c]">{stats.totalUsers}</p>
          </div>
        </div>
      </UpworkCard>

      <UpworkCard className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#525252]">Utilisateurs Actifs</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            <p className="text-xs text-[#525252]">{activePercentage}% du total</p>
          </div>
        </div>
      </UpworkCard>

      <UpworkCard className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
            <UserX className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#525252]">Utilisateurs Inactifs</p>
            <p className="text-2xl font-bold text-red-600">{stats.totalUsers - stats.activeUsers}</p>
            <p className="text-xs text-[#525252]">{100 - activePercentage}% du total</p>
          </div>
        </div>
      </UpworkCard>

      <UpworkCard className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#525252]">Rôles Actifs</p>
            <p className="text-2xl font-bold text-blue-600">{stats.usersByRole.length}</p>
            <p className="text-xs text-[#525252]">Types de rôles</p>
          </div>
        </div>
      </UpworkCard>

      {/* Répartition par rôles */}
      {stats.usersByRole.length > 0 && (
        <UpworkCard className="p-4 md:col-span-4">
          <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4">Répartition par Rôles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.usersByRole.map((roleStat) => (
              <div key={roleStat.role} className="text-center">
                <div className="w-16 h-16 bg-[#f9f9f9] rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-8 w-8 text-[#14a800]" />
                </div>
                <p className="text-sm font-medium text-[#2c2c2c] capitalize">
                  {roleStat.role.replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold text-[#14a800]">{roleStat.count}</p>
              </div>
            ))}
          </div>
        </UpworkCard>
      )}

      {/* Utilisateurs récents */}
      {stats.recentUsers.length > 0 && (
        <UpworkCard className="p-4 md:col-span-4">
          <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4">Utilisateurs Récents</h3>
          <div className="space-y-3">
            {stats.recentUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#14a800] rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2c2c2c]">{user.fullname}</p>
                    <p className="text-sm text-[#525252]">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                  <p className="text-xs text-[#525252] mt-1">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </UpworkCard>
      )}
    </div>
  );
};

export default UserStats;
