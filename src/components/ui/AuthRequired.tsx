import React from 'react';
import { useSession } from 'next-auth/react';
import UpworkButton from './UpworkButton';
import { LogIn, User } from 'lucide-react';

interface AuthRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ children, fallback }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14a800] mx-auto mb-4"></div>
          <p className="text-[#737373]">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Authentification requise
            </h3>
            <p className="text-blue-600 mb-4">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <UpworkButton 
              onClick={() => window.location.href = '/auth/signin'}
              className="flex items-center mx-auto"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </UpworkButton>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRequired;
