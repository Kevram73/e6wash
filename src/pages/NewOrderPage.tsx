'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { ordersService } from '@/lib/api/services/orders';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Package,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingCart,
  Plus,
  Minus,
  Clock,
  Truck,
  Home,
  Building2,
  CheckCircle
} from 'lucide-react';

const NewOrderPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    service: '',
    collectionType: 'COLLECTION',
    collectionAddress: '',
    collectionDate: '',
    collectionTime: '',
    items: [] as Array<{ name: string; quantity: number; weight: number; price: number }>,
    paymentMethod: 'CASH',
    notes: '',
  });

  

  

  const addItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { name: '', quantity: 1, weight: 0, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setOrderData({
      ...orderData,
      items: orderData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderData({ ...orderData, items: newItems });
  };

  const calculateTotal = () => {
    const selectedService = services.find(s => s.id === orderData.service);
    if (!selectedService) return 0;

    if (selectedService.unit === 'kg') {
      const totalWeight = orderData.items.reduce((sum, item) => sum + item.weight, 0);
      return totalWeight * selectedService.price;
    } else {
      const totalQuantity = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
      return totalQuantity * selectedService.price;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const renderStep1 = () => (
    <UpworkCard>
      <UpworkCardHeader>
        <UpworkCardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Choisir le Service
        </CardTitle>
        <UpworkCardDescription>
          Sélectionnez le type de service dont vous avez besoin
        </CardDescription>
      </CardHeader>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setOrderData({ ...orderData, service: service.id })}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                orderData.service === service.id
                  ? 'border-blue-500 bg-[#f0fdf4]'
                  : 'border-[#e5e5e5] hover:border-[#e5e5e5]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <span variant="outline">{formatCurrency(service.price)}/{service.unit}</span>
              </div>
              <p className="text-[#525252] text-sm mb-3">{service.description}</p>
              <div className="flex items-center space-x-4 text-sm text-[#737373]">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.estimatedDuration}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-[#737373] mb-1">Inclus:</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <span key={index} variant="outline" className="text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      
    </UpworkCard>
  );

  const renderStep2 = () => (
    <UpworkCard>
      <UpworkCardHeader>
        <UpworkCardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Détails de la Collecte
        </CardTitle>
        <UpworkCardDescription>
          Configurez la collecte et la livraison
        </CardDescription>
      </CardHeader>
      
        <div>
          <label className="block text-sm font-medium text-[#525252] mb-2">
            Type de collecte
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setOrderData({ ...orderData, collectionType: 'COLLECTION' })}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                orderData.collectionType === 'COLLECTION'
                  ? 'border-blue-500 bg-[#f0fdf4]'
                  : 'border-[#e5e5e5] hover:border-[#e5e5e5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5 text-[#14a800]" />
                <div>
                  <h4 className="font-medium">Collecte à domicile</h4>
                  <p className="text-sm text-[#525252]">Nous venons chercher vos vêtements</p>
                </div>
              </div>
            </div>
            <div
              onClick={() => setOrderData({ ...orderData, collectionType: 'DROP_OFF' })}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                orderData.collectionType === 'DROP_OFF'
                  ? 'border-blue-500 bg-[#f0fdf4]'
                  : 'border-[#e5e5e5] hover:border-[#e5e5e5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-[#14a800]" />
                <div>
                  <h4 className="font-medium">Dépôt en agence</h4>
                  <p className="text-sm text-[#525252]">Vous apportez vos vêtements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {orderData.collectionType === 'COLLECTION' && (
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Adresse de collecte
            </label>
            <textarea
              rows={3}
              value={orderData.collectionAddress}
              onChange={(e) => setOrderData({ ...orderData, collectionAddress: e.target.value })}
              placeholder="Entrez votre adresse complète..."
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Date de collecte
            </label>
            <input
              type="date"
              value={orderData.collectionDate}
              onChange={(e) => setOrderData({ ...orderData, collectionDate: e.target.value })}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Heure de collecte
            </label>
            <select
              value={orderData.collectionTime}
              onChange={(e) => setOrderData({ ...orderData, collectionTime: e.target.value })}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
            >
              <option value="">Sélectionner une heure</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>
        </div>
      
    </UpworkCard>
  );

  const renderStep3 = () => (
    <UpworkCard>
      <UpworkCardHeader>
        <UpworkCardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Articles à Traiter
        </CardTitle>
        <UpworkCardDescription>
          Ajoutez les vêtements et articles à traiter
        </CardDescription>
      </CardHeader>
      
        {orderData.items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Article {index + 1}</h4>
              <UpworkButton
                variant="outline"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </UpworkButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1">
                  Type d'article
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  placeholder="Ex: Chemises, Pantalons..."
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={item.weight}
                  onChange={(e) => updateItem(index, 'weight', parseFloat(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1">
                  Prix estimé
                </label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
                />
              </div>
            </div>
          </div>
        ))}
        
        <UpworkButton
          variant="outline"
          onClick={addItem}
          className="w-full flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un article
        </UpworkButton>
      
    </UpworkCard>
  );

  const renderStep4 = () => (
    <UpworkCard>
      <UpworkCardHeader>
        <UpworkCardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Paiement
        </CardTitle>
        <UpworkCardDescription>
          Choisissez votre méthode de paiement
        </CardDescription>
      </CardHeader>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setOrderData({ ...orderData, paymentMethod: method.id })}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                orderData.paymentMethod === method.id
                  ? 'border-blue-500 bg-[#f0fdf4]'
                  : 'border-[#e5e5e5] hover:border-[#e5e5e5]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h4 className="font-medium">{method.name}</h4>
                  <p className="text-sm text-[#525252]">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-[#525252] mb-2">
            Notes spéciales (optionnel)
          </label>
          <textarea
            rows={3}
            value={orderData.notes}
            onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
            placeholder="Instructions spéciales, préférences, etc..."
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800]"
          />
        </div>
      
    </UpworkCard>
  );

  const renderSummary = () => {
    const selectedService = services.find(s => s.id === orderData.service);
    const total = calculateTotal();

    return (
      <UpworkCard>
        <UpworkCardHeader>
          <UpworkCardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Récapitulatif de la Commande
          </CardTitle>
          <UpworkCardDescription>
            Vérifiez les détails avant de confirmer
          </CardDescription>
        </CardHeader>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Service sélectionné</h4>
              <div className="p-4 bg-[#f7f7f7] rounded-lg">
                <h5 className="font-medium">{selectedService?.name}</h5>
                <p className="text-sm text-[#525252]">{selectedService?.description}</p>
                <p className="text-sm text-[#525252] mt-1">
                  {formatCurrency(selectedService?.price || 0)}/{selectedService?.unit}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Collecte</h4>
              <div className="p-4 bg-[#f7f7f7] rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {
                    orderData.collectionType === 'COLLECTION' ? 'À domicile' : 'Dépôt agence'
                  }
                </p>
                {orderData.collectionAddress && (
                  <p className="text-sm">
                    <span className="font-medium">Adresse:</span> {orderData.collectionAddress}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {orderData.collectionDate}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Heure:</span> {orderData.collectionTime}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Articles</h4>
            <div className="space-y-2">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[#f7f7f7] rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-[#525252]">
                      {item.quantity} pièces • {item.weight} kg
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="text-sm text-[#525252] mt-2">
              Paiement: {paymentMethods.find(m => m.id === orderData.paymentMethod)?.name}
            </p>
          </div>
        
      </UpworkCard>
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return orderData.service !== '';
      case 2:
        return orderData.collectionDate !== '' && orderData.collectionTime !== '' &&
               (orderData.collectionType === 'DROP_OFF' || orderData.collectionAddress !== '');
      case 3:
        return orderData.items.length > 0 && orderData.items.every(item => 
          item.name !== '' && item.quantity > 0 && item.weight > 0
        );
      case 4:
        return orderData.paymentMethod !== '';
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Nouvelle Commande</h1>
          <p className="text-[#525252] mt-1">
            Créez une nouvelle commande de pressing
          </p>
        </div>
        <div className="text-sm text-[#525252]">
          Étape {step} sur 5
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#e5e5e5] rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        ></div>
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderSummary()}

      {/* Navigation */}
      <div className="flex justify-between">
        <UpworkButton
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Précédent
        </UpworkButton>
        
        {step < 5 ? (
          <UpworkButton
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Suivant
          </UpworkButton>
        ) : (
          <UpworkButton
            className="bg-green-600 hover:bg-green-700"
            disabled={!canProceed()}
          >
            Confirmer la commande
          </UpworkButton>
        )}
      </div>
    </div>
  );
};

export default NewOrderPage;
