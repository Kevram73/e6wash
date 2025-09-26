'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Building2, 
  BarChart3, 
  Users, 
  Package, 
  Store, 
  Truck, 
  Settings, 
  Gift, 
  MessageSquare, 
  Bell, 
  CheckSquare, 
  CreditCard, 
  QrCode, 
  History, 
  Plus, 
  User,
  TrendingUp,
  FileText,
  ShoppingBag,
  Wrench
} from 'lucide-react';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const user = session?.user;
  const userRole = user?.role as UserRole;

  // Navigation basée sur le rôle
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Tableau de bord', href: '/dashboard', icon: BarChart3, roles: ['SUPER_ADMIN', 'PRESSING_ADMIN', 'AGENT', 'COLLECTOR'] },
    ];

    switch (userRole) {
      case 'SUPER_ADMIN':
        return [
          ...baseItems,
          { name: 'Pressings', href: '/pressings', icon: Building2, roles: ['SUPER_ADMIN'] },
          { name: 'Agences', href: '/agences', icon: Store, roles: ['SUPER_ADMIN'] },
          { name: 'Collecteurs', href: '/collectors', icon: Truck, roles: ['SUPER_ADMIN'] },
          { name: 'Services', href: '/services', icon: Settings, roles: ['SUPER_ADMIN'] },
          { name: 'Promotions', href: '/promotions', icon: Gift, roles: ['SUPER_ADMIN'] },
          { name: 'Stock', href: '/stock', icon: FileText, roles: ['SUPER_ADMIN'] },
          { name: 'Finances', href: '/finance', icon: TrendingUp, roles: ['SUPER_ADMIN'] },
          { name: 'Tâches', href: '/tasks', icon: CheckSquare, roles: ['SUPER_ADMIN'] },
          { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['SUPER_ADMIN'] },
          { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['SUPER_ADMIN'] },
          { name: 'Fidélité', href: '/loyalty', icon: Gift, roles: ['SUPER_ADMIN'] },
          { name: 'Rapports', href: '/reports', icon: BarChart3, roles: ['SUPER_ADMIN'] },
        ];

      case 'PRESSING_ADMIN':
      case 'ADMIN':
      case 'OWNER':
        return [
          ...baseItems,
          { name: 'Commandes', href: '/orders', icon: Package, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Clients', href: '/customers', icon: Users, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Agences', href: '/agences', icon: Store, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Collecteurs', href: '/collectors', icon: Truck, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Services', href: '/services', icon: Settings, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Promotions', href: '/promotions', icon: Gift, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Stock', href: '/stock', icon: FileText, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Finances', href: '/finance', icon: TrendingUp, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Tâches', href: '/tasks', icon: CheckSquare, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Fidélité', href: '/loyalty', icon: Gift, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
          { name: 'Rapports', href: '/reports', icon: BarChart3, roles: ['PRESSING_ADMIN', 'ADMIN', 'OWNER'] },
        ];

      case 'AGENT':
      case 'CAISSIER':
        return [
          ...baseItems,
          { name: 'Commandes', href: '/orders', icon: Package, roles: ['AGENT', 'CAISSIER'] },
          { name: 'Clients', href: '/customers', icon: Users, roles: ['AGENT', 'CAISSIER'] },
          { name: 'Services', href: '/services', icon: Settings, roles: ['AGENT', 'CAISSIER'] },
          { name: 'Stock', href: '/stock', icon: FileText, roles: ['AGENT', 'CAISSIER'] },
          { name: 'Tâches', href: '/tasks', icon: CheckSquare, roles: ['AGENT', 'CAISSIER'] },
          { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['AGENT', 'CAISSIER'] },
          { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['AGENT', 'CAISSIER'] },
        ];

      case 'COLLECTOR':
        return [
          ...baseItems,
          { name: 'Mes missions', href: '/missions', icon: Package, roles: ['COLLECTOR'] },
          { name: 'QR Scanner', href: '/qr-scanner', icon: QrCode, roles: ['COLLECTOR'] },
          { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['COLLECTOR'] },
          { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['COLLECTOR'] },
          { name: 'Historique', href: '/history', icon: History, roles: ['COLLECTOR'] },
        ];

      case 'CLIENT':
        return [
          { name: 'Mes commandes', href: '/my-orders', icon: Package, roles: ['CLIENT'] },
          { name: 'Nouvelle commande', href: '/new-order', icon: Plus, roles: ['CLIENT'] },
          { name: 'Mon profil', href: '/profile', icon: User, roles: ['CLIENT'] },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'PRESSING_ADMIN': return 'Admin Pressing';
      case 'ADMIN': return 'Administrateur';
      case 'OWNER': return 'Propriétaire';
      case 'AGENT': return 'Agent';
      case 'CAISSIER': return 'Caissier';
      case 'COLLECTOR': return 'Collecteur';
      case 'CLIENT': return 'Client';
      default: return role;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14a800] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#14a800] rounded-lg flex items-center justify-center mr-3">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">E6Wash</h1>
            <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">SaaS</span>
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#14a800] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[#14a800] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user.name || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500">{getRoleDisplayName(userRole)}</p>
              {user.pressing && (
                <p className="text-xs text-gray-400">{user.pressing.name}</p>
              )}
            </div>
            <button
              onClick={() => signOut()}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Déconnexion"
            >
              <span className="text-sm">🚪</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="text-xl">☰</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600">
                  {user.pressing?.name || 'E6Wash SaaS'}
                </p>
                {user.agence && (
                  <p className="text-xs text-gray-500">{user.agence.name}</p>
                )}
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;