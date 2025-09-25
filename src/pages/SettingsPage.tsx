'use client';

import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Database,
  Key,
  Mail,
  Phone,
  MapPin,
  Save,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'company', name: 'Entreprise', icon: Building2 },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'billing', name: 'Facturation', icon: CreditCard },
    { id: 'integrations', name: 'Intégrations', icon: Globe },
    { id: 'appearance', name: 'Apparence', icon: Palette },
    { id: 'data', name: 'Données', icon: Database },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Informations Personnelles</CardTitle>
          <UpworkCardDescription>
            Gérez vos informations de profil et préférences
          </CardDescription>
        </CardHeader>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Nom complet
              </label>
              <input
                type="text"
                defaultValue="Admin Principal"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@e6wash.com"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                defaultValue="+237 6XX XXX XXX"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Rôle
              </label>
              <input
                type="text"
                defaultValue="Administrateur Principal"
                disabled
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md bg-[#f7f7f7]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              defaultValue="Administrateur principal de la plateforme E6Wash"
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
        
      </UpworkCard>

      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Changer le Mot de Passe</CardTitle>
          <UpworkCardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-1">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
        
      </UpworkCard>
    </div>
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Informations de l'Entreprise</CardTitle>
          <UpworkCardDescription>
            Gérez les informations de votre pressing
          </CardDescription>
        </CardHeader>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                defaultValue="E6Wash - Pressing Moderne"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Slogan
              </label>
              <input
                type="text"
                defaultValue="Votre pressing de confiance"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="contact@e6wash.com"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                defaultValue="+237 6XX XXX XXX"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-1">
              Adresse
            </label>
            <textarea
              rows={3}
              defaultValue="Douala, Akwa, Rue de la Paix"
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
        
      </UpworkCard>

      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Paramètres d'Agence</CardTitle>
          <UpworkCardDescription>
            Configuration des agences et services
          </CardDescription>
        </CardHeader>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Heures d'ouverture
              </label>
              <input
                type="text"
                defaultValue="7h00 - 19h00"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Jours de fermeture
              </label>
              <input
                type="text"
                defaultValue="Dimanche"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Délai de traitement standard
              </label>
              <input
                type="text"
                defaultValue="24-48 heures"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#525252] mb-1">
                Zone de livraison
              </label>
              <input
                type="text"
                defaultValue="Douala et Yaoundé"
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
              />
            </div>
          </div>
        
      </UpworkCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Préférences de Notification</CardTitle>
          <UpworkCardDescription>
            Configurez comment vous souhaitez recevoir les notifications
          </CardDescription>
        </CardHeader>
        
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Nouvelles commandes</h4>
                <p className="text-sm text-[#525252]">Recevoir une notification pour chaque nouvelle commande</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#14a800]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Paiements reçus</h4>
                <p className="text-sm text-[#525252]">Notification lors de la réception d'un paiement</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#14a800]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Stock faible</h4>
                <p className="text-sm text-[#525252]">Alerte quand un produit est en rupture de stock</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#14a800]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Rapports quotidiens</h4>
                <p className="text-sm text-[#525252]">Résumé quotidien des activités</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-[#14a800]" />
            </div>
          </div>
        
      </UpworkCard>

      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Méthodes de Notification</CardTitle>
          <UpworkCardDescription>
            Choisissez comment vous souhaitez être notifié
          </CardDescription>
        </CardHeader>
        
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-[#a3a3a3]" />
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-[#525252]">admin@e6wash.com</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-[#14a800]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-[#a3a3a3]" />
              <div>
                <h4 className="font-medium">SMS</h4>
                <p className="text-sm text-[#525252]">+237 6XX XXX XXX</p>
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4 text-[#14a800]" />
          </div>
        
      </UpworkCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Authentification à Deux Facteurs</CardTitle>
          <UpworkCardDescription>
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </CardDescription>
        </CardHeader>
        
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">2FA activé</h4>
              <p className="text-sm text-[#525252]">Protection supplémentaire pour votre compte</p>
            </div>
            <span className="bg-green-100 text-green-800">Activé</span>
          </div>
        
      </UpworkCard>

      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle>Sessions Actives</CardTitle>
          <UpworkCardDescription>
            Gérez vos sessions de connexion actives
          </CardDescription>
        </CardHeader>
        
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Session actuelle</h4>
              <p className="text-sm text-[#525252]">Chrome sur Windows • Douala, Cameroun</p>
            </div>
            <span className="bg-green-100 text-green-800">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Session mobile</h4>
              <p className="text-sm text-[#525252]">Safari sur iOS • Yaoundé, Cameroun</p>
            </div>
            <UpworkButton variant="outline" size="sm">Révoquer</UpworkButton>
          </div>
        
      </UpworkCard>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'company':
        return renderCompanySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return (
          <UpworkCard>
            
              <Settings className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Section en développement</h3>
              <p className="text-[#737373]">Cette section sera bientôt disponible.</p>
            
          </UpworkCard>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Paramètres</h1>
          <p className="text-[#525252] mt-1">
            Gérez vos préférences et configurations
          </p>
        </div>
        <UpworkButton className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </UpworkButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <UpworkCard>
            
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#f0fdf4] text-blue-700 border-r-2 border-blue-700'
                          : 'text-[#525252] hover:bg-[#f7f7f7] hover:text-[#2c2c2c]'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            
          </UpworkCard>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
