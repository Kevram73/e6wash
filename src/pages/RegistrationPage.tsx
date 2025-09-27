'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationForm from '@/components/forms/RegistrationForm';
import { RegistrationFormData, RegistrationResponse } from '@/lib/types/registration';
import { 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Users, 
  Shield, 
  Zap,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegistration = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    setRegistrationStatus('idle');
    setErrorMessage('');

    try {
      // Validation côté client
      if (formData.ownerPassword !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (formData.ownerPassword.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      if (!formData.acceptTerms || !formData.acceptPrivacy) {
        throw new Error('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité');
      }

      // Appel à l'API d'inscription
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: RegistrationResponse = await response.json();

      if (result.success) {
        setRegistrationStatus('success');
        
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/login?message=registration-success');
        }, 3000);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      setRegistrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuccessMessage = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Inscription Réussie !
        </h2>
        <p className="text-green-700 mb-6">
          Votre compte pressing a été créé avec succès. Vous allez être redirigé vers la page de connexion dans quelques secondes.
        </p>
        <div className="space-y-2 text-sm text-green-600">
          <p>✓ Compte utilisateur créé</p>
          <p>✓ Entreprise configurée</p>
          <p>✓ Services définis</p>
          <p>✓ Plan d'abonnement activé</p>
        </div>
        <div className="mt-6">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Se connecter maintenant
          </Link>
        </div>
      </div>
    </div>
  );

  const renderErrorMessage = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Erreur d'Inscription
        </h2>
        <p className="text-red-700 mb-6">
          {errorMessage}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setRegistrationStatus('idle')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );

  if (registrationStatus === 'success') {
    return renderSuccessMessage();
  }

  if (registrationStatus === 'error') {
    return renderErrorMessage();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">E6Wash</h1>
            </div>
            <Link
              href="/auth/login"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Style Upwork */}
      <div className="bg-[#f7f7f7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto w-20 h-20 bg-[#14a800] rounded-xl flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#2c2c2c] mb-4">
            Créez votre Pressing en Ligne
          </h1>
          <p className="text-xl text-[#525252] mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers de pressings qui utilisent E6Wash pour gérer leur entreprise plus efficacement
          </p>
          
          {/* Features - Style Upwork */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#14a800] rounded-xl flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Gestion Complète</h3>
              <p className="text-[#525252]">
                Commandes, clients, paiements, tout en un seul endroit
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#14a800] rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Automatisation</h3>
              <p className="text-[#525252]">
                Automatisez vos processus et gagnez du temps
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#14a800] rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Sécurisé</h3>
              <p className="text-[#525252]">
                Vos données sont protégées et sauvegardées
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegistrationForm
            onSubmit={handleRegistration}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Footer - Style Upwork */}
      <div className="bg-[#2c2c2c] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-6 w-6 text-[#14a800] mr-2" />
                <h3 className="text-lg font-semibold">E6Wash</h3>
              </div>
              <p className="text-[#a3a3a3]">
                La solution complète pour gérer votre pressing en ligne.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#2c2c2c]">Fonctionnalités</h3>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li>Gestion des commandes</li>
                <li>Suivi des clients</li>
                <li>Paiements échelonnés</li>
                <li>Rapports détaillés</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#2c2c2c]">Support</h3>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li>Centre d'aide</li>
                <li>Documentation</li>
                <li>Formation</li>
                <li>Support technique</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#2c2c2c]">Légal</h3>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li>Conditions d'utilisation</li>
                <li>Politique de confidentialité</li>
                <li>Mentions légales</li>
                <li>CGV</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#525252] mt-8 pt-8 text-center text-[#a3a3a3]">
            <p>&copy; 2025 E6Wash. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
