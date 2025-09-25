'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  Settings,
  Save,
  Server,
  Shield,
  Mail,
  Bell,
  Database,
  Globe,
  Key,
  AlertTriangle
} from 'lucide-react';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Configuration générale
    platformName: 'E6Wash SaaS',
    platformUrl: 'https://e6wash.com',
    supportEmail: 'support@e6wash.com',
    adminEmail: 'admin@e6wash.com',
    
    // Configuration serveur
    maxFileSize: '10',
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    
    // Configuration sécurité
    requireEmailVerification: true,
    requireTwoFactor: false,
    passwordMinLength: '8',
    
    // Configuration notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Configuration base de données
    backupFrequency: 'daily',
    retentionPeriod: '90',
    
    // Configuration API
    apiRateLimit: '1000',
    apiTimeout: '30'
  });

  const handleSave = () => {
    // Logique de sauvegarde
    console.log('Sauvegarde des paramètres:', settings);
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header - Upwork Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c2c] flex items-center">
            <Settings className="h-7 w-7 mr-3 text-[#14a800]" />
            Paramètres Système
          </h1>
          <p className="text-[#525252] mt-1">
            Configurez les paramètres globaux de la plateforme
          </p>
        </div>
        <UpworkButton onClick={handleSave} className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </UpworkButton>
      </div>

      {/* Configuration Générale */}
      <UpworkCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <Globe className="h-5 w-5 mr-2 text-[#14a800]" />
            Configuration Générale
          </h3>
          <p className="text-[#525252]">
            Paramètres de base de la plateforme
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpworkInput
            label="Nom de la plateforme"
            value={settings.platformName}
            onChange={(e) => handleInputChange('platformName', e.target.value)}
          />
          <UpworkInput
            label="URL de la plateforme"
            value={settings.platformUrl}
            onChange={(e) => handleInputChange('platformUrl', e.target.value)}
          />
          <UpworkInput
            label="Email de support"
            value={settings.supportEmail}
            onChange={(e) => handleInputChange('supportEmail', e.target.value)}
            icon={Mail}
          />
          <UpworkInput
            label="Email administrateur"
            value={settings.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            icon={Mail}
          />
        </div>
      </UpworkCard>

      {/* Configuration Serveur */}
      <UpworkCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <Server className="h-5 w-5 mr-2 text-[#14a800]" />
            Configuration Serveur
          </h3>
          <p className="text-[#525252]">
            Paramètres de performance et limites
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UpworkInput
            label="Taille max des fichiers (MB)"
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
          />
          <UpworkInput
            label="Timeout de session (min)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
          />
          <UpworkInput
            label="Tentatives de connexion max"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
          />
        </div>
      </UpworkCard>

      {/* Configuration Sécurité */}
      <UpworkCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <Shield className="h-5 w-5 mr-2 text-[#14a800]" />
            Configuration Sécurité
          </h3>
          <p className="text-[#525252]">
            Paramètres de sécurité et authentification
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-[#525252]">
                  Vérification email obligatoire
                </label>
                <p className="text-xs text-[#737373]">
                  Les utilisateurs doivent vérifier leur email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-[#525252]">
                  Authentification à deux facteurs
                </label>
                <p className="text-xs text-[#737373]">
                  Activer la 2FA pour tous les utilisateurs
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={(e) => handleInputChange('requireTwoFactor', e.target.checked)}
                className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
              />
            </div>
          </div>
          
          <UpworkInput
            label="Longueur minimale du mot de passe"
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleInputChange('passwordMinLength', e.target.value)}
            icon={Key}
          />
        </div>
      </UpworkCard>

      {/* Configuration Notifications */}
      <UpworkCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <Bell className="h-5 w-5 mr-2 text-[#14a800]" />
            Configuration Notifications
          </h3>
          <p className="text-[#525252]">
            Paramètres des notifications système
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-[#525252]">
                Notifications email
              </label>
              <p className="text-xs text-[#737373]">
                Envoyer des notifications par email
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-[#525252]">
                Notifications SMS
              </label>
              <p className="text-xs text-[#737373]">
                Envoyer des notifications par SMS
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-[#525252]">
                Notifications push
              </label>
              <p className="text-xs text-[#737373]">
                Envoyer des notifications push
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
            />
          </div>
        </div>
      </UpworkCard>

      {/* Configuration Base de Données */}
      <UpworkCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <Database className="h-5 w-5 mr-2 text-[#14a800]" />
            Configuration Base de Données
          </h3>
          <p className="text-[#525252]">
            Paramètres de sauvegarde et rétention
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Fréquence de sauvegarde
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="hourly">Horaire</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>
          
          <UpworkInput
            label="Période de rétention (jours)"
            type="number"
            value={settings.retentionPeriod}
            onChange={(e) => handleInputChange('retentionPeriod', e.target.value)}
          />
        </div>
      </UpworkCard>

      {/* Configuration API */}
      <UpworkCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#2c2c2c] flex items-center mb-2">
            <Key className="h-5 w-5 mr-2 text-[#14a800]" />
            Configuration API
          </h3>
          <p className="text-[#525252]">
            Paramètres de l'API et des limites de taux
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpworkInput
            label="Limite de taux API (req/min)"
            type="number"
            value={settings.apiRateLimit}
            onChange={(e) => handleInputChange('apiRateLimit', e.target.value)}
          />
          <UpworkInput
            label="Timeout API (secondes)"
            type="number"
            value={settings.apiTimeout}
            onChange={(e) => handleInputChange('apiTimeout', e.target.value)}
          />
        </div>
      </UpworkCard>

      {/* Avertissement */}
      <UpworkCard className="border-yellow-200 bg-yellow-50">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Attention
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Les modifications de ces paramètres peuvent affecter le fonctionnement de la plateforme. 
              Assurez-vous de comprendre les implications avant de sauvegarder.
            </p>
          </div>
        </div>
      </UpworkCard>
    </div>
  );
};

export default SystemSettingsPage;
