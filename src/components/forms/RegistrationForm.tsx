import React, { useState } from 'react';
import { RegistrationFormData, ServiceType, SUBSCRIPTION_PLANS, BUSINESS_TYPES, DEFAULT_SERVICES_DETAIL, DEFAULT_SERVICES_KILO } from '@/lib/types/registration';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  User, 
  Building2, 
  MapPin, 
  CreditCard, 
  Settings, 
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Star,
  Shirt,
  Scale,
  Layers,
  Truck,
  Home
} from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPassword: '',
    confirmPassword: '',
    businessName: '',
    businessType: 'INDIVIDUAL',
    businessRegistrationNumber: '',
    businessAddress: '',
    businessCity: '',
    businessCountry: 'Cameroun',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
    pressingType: 'DETAIL',
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    services: [],
    subscriptionPlan: 'PREMIUM',
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false
  });

  const [newService, setNewService] = useState<Omit<ServiceType, 'id'>>({
    name: '',
    category: 'WASHING',
    price: 0,
    description: '',
    isActive: true
  });

  const steps = [
    { id: 1, title: 'Informations Personnelles', icon: User },
    { id: 2, title: 'Informations Entreprise', icon: Building2 },
    { id: 3, title: 'Type de Pressing', icon: Settings },
    { id: 4, title: 'Localisation', icon: MapPin },
    { id: 5, title: 'Services', icon: Settings },
    { id: 6, title: 'Plan d\'Abonnement', icon: CreditCard },
    { id: 7, title: 'Confirmation', icon: Check }
  ];

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePressingTypeChange = (pressingType: 'DETAIL' | 'KILO' | 'MIXED') => {
    setFormData(prev => {
      let defaultServices: ServiceType[] = [];
      
      if (pressingType === 'DETAIL') {
        defaultServices = [
          { name: 'Lavage Chemise', category: 'WASHING', type: 'WASHING', price: 500, description: 'Lavage d\'une chemise', isActive: true },
          { name: 'Lavage Pantalon', category: 'WASHING', type: 'WASHING', price: 800, description: 'Lavage d\'un pantalon', isActive: true },
          { name: 'Repassage Chemise', category: 'IRONING', type: 'IRONING', price: 300, description: 'Repassage d\'une chemise', isActive: true },
        ];
      } else if (pressingType === 'KILO') {
        defaultServices = [
          { name: 'Lavage au Kilo', category: 'WASHING', type: 'WASHING', price: 1500, description: 'Lavage au kilo', isActive: true },
          { name: 'Repassage au Kilo', category: 'IRONING', type: 'IRONING', price: 1000, description: 'Repassage au kilo', isActive: true },
        ];
      } else {
        // MIXED: combine both types
        defaultServices = [
          { name: 'Lavage Chemise', category: 'WASHING', type: 'WASHING', price: 500, description: 'Lavage d\'une chemise', isActive: true },
          { name: 'Lavage Pantalon', category: 'WASHING', type: 'WASHING', price: 800, description: 'Lavage d\'un pantalon', isActive: true },
          { name: 'Lavage au Kilo', category: 'WASHING', type: 'WASHING', price: 1500, description: 'Lavage au kilo', isActive: true },
          { name: 'Repassage au Kilo', category: 'IRONING', type: 'IRONING', price: 1000, description: 'Repassage au kilo', isActive: true },
        ];
      }
      
      return {
        ...prev,
        pressingType,
        services: defaultServices
      };
    });
  };

  const handleServiceChange = (index: number, field: keyof ServiceType, value: any) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    if (newService.name && newService.price > 0) {
      const service: ServiceType = {
        ...newService,
        id: `service_${Date.now()}`
      };
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
      setNewService({
        name: '',
        category: 'WASHING',
        price: 0,
        description: '',
        isActive: true
      });
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informations Personnelles</h2>
        <p className="text-gray-600">Renseignez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpworkInput
          label="Prénom *"
          value={formData.ownerFirstName}
          onChange={(e) => handleInputChange('ownerFirstName', e.target.value)}
          placeholder="Votre prénom"
          required
        />
        <UpworkInput
          label="Nom *"
          value={formData.ownerLastName}
          onChange={(e) => handleInputChange('ownerLastName', e.target.value)}
          placeholder="Votre nom"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpworkInput
          label="Email *"
          type="email"
          value={formData.ownerEmail}
          onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
          placeholder="votre@email.com"
          required
        />
        <UpworkInput
          label="Téléphone *"
          value={formData.ownerPhone}
          onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
          placeholder="+237 123 456 789"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.ownerPassword}
              onChange={(e) => handleInputChange('ownerPassword', e.target.value)}
              placeholder="Mot de passe sécurisé"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirmer le mot de passe"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informations Entreprise</h2>
        <p className="text-gray-600">Renseignez les informations de votre pressing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpworkInput
          label="Nom de l'entreprise *"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Nom de votre pressing"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'entreprise *
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="INDIVIDUAL">Entreprise individuelle</option>
            <option value="COMPANY">Société</option>
            <option value="COOPERATIVE">Coopérative</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpworkInput
          label="Numéro d'enregistrement"
          value={formData.businessRegistrationNumber || ''}
          onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
          placeholder="Numéro RCCM (optionnel)"
        />
        <UpworkInput
          label="Téléphone entreprise *"
          value={formData.businessPhone}
          onChange={(e) => handleInputChange('businessPhone', e.target.value)}
          placeholder="+237 123 456 789"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpworkInput
          label="Email entreprise *"
          type="email"
          value={formData.businessEmail}
          onChange={(e) => handleInputChange('businessEmail', e.target.value)}
          placeholder="contact@pressing.com"
          required
        />
        <UpworkInput
          label="Site web"
          value={formData.businessWebsite || ''}
          onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
          placeholder="https://www.pressing.com"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Type de Pressing</h2>
        <p className="text-gray-600">Choisissez le modèle de tarification de votre pressing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BUSINESS_TYPES.map((businessType) => {
          const getIcon = (iconName: string) => {
            switch (iconName) {
              case 'shirt': return <Shirt className="h-8 w-8" />;
              case 'scale': return <Scale className="h-8 w-8" />;
              case 'layers': return <Layers className="h-8 w-8" />;
              default: return <Building2 className="h-8 w-8" />;
            }
          };

          const isSelected = formData.pressingType === businessType.pricingModel;
          
          return (
            <div
              key={businessType.id}
              className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#14a800] bg-[#f0fdf4]'
                  : 'border-[#e5e5e5] hover:border-[#14a800] hover:bg-[#f9f9f9]'
              }`}
              onClick={() => handlePressingTypeChange(businessType.pricingModel as any)}
            >
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                  isSelected ? 'bg-[#14a800] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}>
                  {getIcon(businessType.icon)}
                </div>
                
                <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">
                  {businessType.name}
                </h3>
                
                <p className="text-[#525252] text-sm mb-4">
                  {businessType.description}
                </p>

                <ul className="space-y-2 text-sm text-[#737373]">
                  {businessType.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-[#14a800] mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? 'border-[#14a800] bg-[#14a800]'
                    : 'border-[#d1d5db]'
                }`}>
                  {isSelected && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Informations supplémentaires */}
      <div className="bg-[#f9f9f9] p-6 rounded-lg">
        <h3 className="font-semibold text-[#2c2c2c] mb-3">💡 Aide à la décision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#525252]">
          <div>
            <h4 className="font-medium text-[#2c2c2c] mb-2">Pressing au Détail</h4>
            <p>Idéal pour les clients exigeants qui veulent un service personnalisé par article. Chaque pièce est traitée individuellement avec un prix spécifique.</p>
          </div>
          <div>
            <h4 className="font-medium text-[#2c2c2c] mb-2">Pressing au Kilo</h4>
            <p>Parfait pour les familles et les clients qui ont beaucoup de linge. Facturation au poids, plus économique pour de gros volumes.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Localisation</h2>
        <p className="text-gray-600">Renseignez l'adresse de votre pressing</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse complète *
        </label>
        <textarea
          value={formData.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          placeholder="Adresse complète de votre pressing"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpworkInput
          label="Ville *"
          value={formData.businessCity}
          onChange={(e) => handleInputChange('businessCity', e.target.value)}
          placeholder="Douala, Yaoundé, etc."
          required
        />
        <UpworkInput
          label="Pays *"
          value={formData.businessCountry}
          onChange={(e) => handleInputChange('businessCountry', e.target.value)}
          placeholder="Cameroun"
          required
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Informations Bancaires (Optionnel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UpworkInput
            label="Nom de la banque"
            value={formData.bankName || ''}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            placeholder="Ex: BICEC, UBA, etc."
          />
          <UpworkInput
            label="Numéro de compte"
            value={formData.bankAccountNumber || ''}
            onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
            placeholder="Numéro de compte bancaire"
          />
          <UpworkInput
            label="Titulaire du compte"
            value={formData.bankAccountHolder || ''}
            onChange={(e) => handleInputChange('bankAccountHolder', e.target.value)}
            placeholder="Nom du titulaire"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Services Proposés</h2>
        <p className="text-gray-600">Configurez les services que vous proposez</p>
      </div>

      {/* Services par défaut */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Services Standard</h3>
        {formData.services.map((service, index) => (
          <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du service"
                />
              </div>
              <div>
                <select
                  value={service.category}
                  onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WASHING">Lavage</option>
                  <option value="IRONING">Repassage</option>
                  <option value="DRY_CLEANING">Nettoyage à sec</option>
                  <option value="REPAIR">Réparation</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prix (FCFA)"
                />
              </div>
              <div>
                <select
                  value={service.pricingType}
                  onChange={(e) => handleServiceChange(index, 'pricingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DETAIL">Au détail</option>
                  <option value="KILO">Au kilo</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={service.isActive}
                    onChange={(e) => handleServiceChange(index, 'isActive', e.target.checked)}
                    className="mr-2"
                  />
                  Actif
                </label>
              </div>
              <div>
                <UpworkButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ajouter un nouveau service */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-3">Ajouter un Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du service
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Blanchisserie"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={newService.category}
              onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="WASHING">Lavage</option>
              <option value="IRONING">Repassage</option>
              <option value="DRY_CLEANING">Nettoyage à sec</option>
              <option value="REPAIR">Réparation</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (FCFA)
            </label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de tarification
            </label>
            <select
              value={newService.pricingType}
              onChange={(e) => setNewService(prev => ({ ...prev, pricingType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DETAIL">Au détail</option>
              <option value="KILO">Au kilo</option>
            </select>
          </div>
          <div>
            <UpworkButton
              type="button"
              onClick={addService}
              disabled={!newService.name || newService.price <= 0}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </UpworkButton>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Plan d'Abonnement</h2>
        <p className="text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              formData.subscriptionPlan === plan.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${plan.isPopular ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => handleInputChange('subscriptionPlan', plan.id)}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Populaire
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-blue-600">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-gray-600">/mois</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="text-center">
              <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                formData.subscriptionPlan === plan.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.subscriptionPlan === plan.id && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmation</h2>
        <p className="text-gray-600">Vérifiez vos informations avant de finaliser</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Informations Personnelles</h3>
          <p><strong>Nom:</strong> {formData.ownerFirstName} {formData.ownerLastName}</p>
          <p><strong>Email:</strong> {formData.ownerEmail}</p>
          <p><strong>Téléphone:</strong> {formData.ownerPhone}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Entreprise</h3>
          <p><strong>Nom:</strong> {formData.businessName}</p>
          <p><strong>Type:</strong> {formData.businessType}</p>
          <p><strong>Type de pressing:</strong> {
            formData.pressingType === 'DETAIL' ? 'Pressing au Détail' :
            formData.pressingType === 'KILO' ? 'Pressing au Kilo' :
            'Pressing Mixte'
          }</p>
          <p><strong>Adresse:</strong> {formData.businessAddress}, {formData.businessCity}</p>
          <p><strong>Téléphone:</strong> {formData.businessPhone}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Services ({formData.services.length})</h3>
          <div className="grid grid-cols-2 gap-2">
            {formData.services.map((service) => (
              <div key={service.id} className="text-sm">
                {service.name} - {formatCurrency(service.price)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Plan d'Abonnement</h3>
          <p><strong>Plan:</strong> {SUBSCRIPTION_PLANS.find(p => p.id === formData.subscriptionPlan)?.name}</p>
          <p><strong>Prix:</strong> {formatCurrency(SUBSCRIPTION_PLANS.find(p => p.id === formData.subscriptionPlan)?.price || 0)}/mois</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
            className="mt-1 mr-3"
            required
          />
          <span className="text-sm text-gray-600">
            J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a> *
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.acceptPrivacy}
            onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
            className="mt-1 mr-3"
            required
          />
          <span className="text-sm text-gray-600">
            J'accepte la <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a> *
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.acceptMarketing}
            onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
            className="mt-1 mr-3"
          />
          <span className="text-sm text-gray-600">
            J'accepte de recevoir des communications marketing (optionnel)
          </span>
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return renderStep1();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-blue-500 bg-blue-500 text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 bg-white text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <UpworkButton
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Précédent
          </UpworkButton>

          {currentStep < steps.length ? (
            <UpworkButton
              type="button"
              onClick={nextStep}
            >
              Suivant
            </UpworkButton>
          ) : (
            <UpworkButton
              type="submit"
              disabled={isLoading || !formData.acceptTerms || !formData.acceptPrivacy}
            >
              {isLoading ? 'Création en cours...' : 'Créer mon Compte'}
            </UpworkButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
