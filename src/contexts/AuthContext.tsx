'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin, LoginCredentials } from '../types';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (adminData: Partial<Admin>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'admin est déjà connecté
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Vérifier le token stocké et récupérer les données admin
      // const token = localStorage.getItem('authToken');
      // if (token) {
      //   const adminData = await api.getAdminProfile();
      //   setAdmin(adminData);
      // }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      // TODO: Appel API pour la connexion admin
      // const response = await api.loginAdmin(credentials);
      // localStorage.setItem('authToken', response.token);
      // setAdmin(response.admin);
      
      // Simulation temporaire
      const mockAdmin: Admin = {
        id: '1',
        email: credentials.email,
        firstName: 'Admin',
        lastName: 'E6Wash',
        pressingId: 'pressing-1',
        pressingName: 'Pressing E6Wash',
        role: 'owner',
        permissions: ['all'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAdmin(mockAdmin);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // TODO: Appel API pour la déconnexion
      // await api.logout();
      // localStorage.removeItem('authToken');
      setAdmin(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  const updateProfile = async (adminData: Partial<Admin>): Promise<void> => {
    try {
      setIsLoading(true);
      // TODO: Appel API pour la mise à jour du profil
      // const updatedAdmin = await api.updateAdminProfile(adminData);
      // setAdmin(updatedAdmin);
      
      // Simulation temporaire
      if (admin) {
        setAdmin({ ...admin, ...adminData, updatedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    admin,
    isLoading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
