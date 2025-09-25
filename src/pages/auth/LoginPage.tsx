'use client';

import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  Building2, 
  Users, 
  Package, 
  Truck,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        // Récupérer la session pour rediriger selon le rôle
        const session = await getSession();
        if (session?.user) {
          const role = session.user.role;
          switch (role) {
            case 'SUPER_ADMIN':
              router.push('/dashboard');
              break;
            case 'PRESSING_ADMIN':
            case 'ADMIN':
            case 'OWNER':
              router.push('/dashboard');
              break;
            case 'AGENT':
            case 'CAISSIER':
              router.push('/dashboard');
              break;
            case 'COLLECTOR':
              router.push('/missions');
              break;
            default:
              router.push('/dashboard');
          }
        }
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'admin@e6wash.com',
      password: 'admin123',
      description: 'Gestion globale de la plateforme',
      icon: Building2,
      color: 'bg-[#14a800]',
    },
    {
      role: 'Admin Pressing',
      email: 'pressing@e6wash.com',
      password: 'pressing123',
      description: 'Gestion d\'un pressing',
      icon: Users,
      color: 'bg-[#14a800]',
    },
    {
      role: 'Agent',
      email: 'agent@e6wash.com',
      password: 'agent123',
      description: 'Gestion des commandes',
      icon: Package,
      color: 'bg-[#14a800]',
    },
    {
      role: 'Collecteur',
      email: 'collector@e6wash.com',
      password: 'collector123',
      description: 'Livraisons et collectes',
      icon: Truck,
      color: 'bg-[#14a800]',
    },
  ];

  const fillDemoAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Login Form - Upwork Style */}
        <div className="flex items-center justify-center">
          <UpworkCard className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[#14a800] rounded-xl flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#2c2c2c] mb-2">E6Wash SaaS</h1>
              <p className="text-[#525252]">
                Plateforme de gestion pour pressings
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <UpworkInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2c2c2c] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] hover:text-[#2c2c2c] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-[#ef4444] text-sm bg-[#fef2f2] border border-[#fecaca] p-3 rounded-lg">
                  {error}
                </div>
              )}

              <UpworkButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </UpworkButton>
            </form>
          </UpworkCard>
        </div>

        {/* Right Side - Demo Accounts - Upwork Style */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#2c2c2c] mb-2">
                Comptes de démonstration
              </h2>
              <p className="text-[#525252]">
                Cliquez sur un compte pour vous connecter automatiquement
              </p>
            </div>

            <div className="space-y-4">
              {demoAccounts.map((account, index) => {
                const Icon = account.icon;
                return (
                  <UpworkCard 
                    key={index} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-[#14a800]"
                    onClick={() => fillDemoAccount(account.email, account.password)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${account.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-[#2c2c2c]">{account.role}</h3>
                          <span className="text-xs bg-[#f0fdf4] text-[#14a800] px-2 py-1 rounded border border-[#bbf7d0]">
                            Demo
                          </span>
                        </div>
                        <p className="text-sm text-[#525252]">{account.description}</p>
                        <p className="text-xs text-[#737373] mt-1">
                          {account.email}
                        </p>
                      </div>
                    </div>
                  </UpworkCard>
                );
              })}
            </div>

            <UpworkCard className="mt-8 bg-[#f0fdf4] border-[#bbf7d0]">
              <h3 className="font-semibold text-[#14a800] mb-2">🚀 Fonctionnalités</h3>
              <ul className="text-sm text-[#15803d] space-y-1">
                <li>• Gestion multi-tenant (pressings)</li>
                <li>• Suivi des commandes en temps réel</li>
                <li>• Gestion des agences et employés</li>
                <li>• Tableaux de bord personnalisés</li>
                <li>• Système de paiement intégré</li>
                <li>• Rapports et statistiques</li>
              </ul>
            </UpworkCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
