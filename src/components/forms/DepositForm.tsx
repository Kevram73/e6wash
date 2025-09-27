import React, { useState, useEffect } from 'react';
import { DepositFormData, DepositItem } from '@/lib/types/deposit';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  Plus, 
  Trash2, 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Clock,
  DollarSign,
  Save
} from 'lucide-react';

interface DepositFormProps {
  initialData?: Partial<DepositFormData>;
  onSubmit: (data: DepositFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<DepositFormData>({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    collectionAddress: '',
    collectionDate: new Date(),
    collectionTime: '09:00',
    collectionNotes: '',
    deliveryAddress: '',
    deliveryDate: undefined,
    deliveryTime: '',
    deliveryNotes: '',
    items: [],
    paymentMethod: 'CASH',
    paidAmount: 0,
    discountAmount: 0,
    specialInstructions: '',
    isInstallmentPayment: false,
    installmentCount: 2,
    installmentInterval: 7 // jours
  });

  const [newItem, setNewItem] = useState<Omit<DepositItem, 'id' | 'totalPrice' | 'status'>>({
    name: '',
    category: 'WASHING',
    quantity: 1,
    unitPrice: 0,
    description: '',
    specialInstructions: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof DepositFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (field: keyof typeof newItem, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (newItem.name && newItem.unitPrice > 0) {
      const item: Omit<DepositItem, 'id' | 'status'> = {
        ...newItem,
        totalPrice: newItem.quantity * newItem.unitPrice
      };
      
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      
      setNewItem({
        name: '',
        category: 'WASHING',
        quantity: 1,
        unitPrice: 0,
        description: '',
        specialInstructions: ''
      });
    }
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return subtotal - formData.discountAmount;
  };

  const generateInstallmentPreview = () => {
    if (!formData.isInstallmentPayment) return [];
    
    const total = calculateTotal();
    const remainingAmount = total - formData.paidAmount;
    const installmentCount = formData.installmentCount || 2;
    const installmentAmount = Math.ceil(remainingAmount / installmentCount);
    const interval = formData.installmentInterval || 7;
    
    const installments = [];
    let currentDate = new Date();
    
    for (let i = 1; i <= installmentCount; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setDate(dueDate.getDate() + (i * interval));
      
      installments.push({
        number: i,
        amount: i === installmentCount ? remainingAmount - (installmentAmount * (installmentCount - 1)) : installmentAmount,
        dueDate: dueDate.toLocaleDateString('fr-FR')
      });
    }
    
    return installments;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = calculateTotal();
    
    if (formData.items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }

    if (formData.customerName.trim() === '') {
      alert('Veuillez saisir le nom du client');
      return;
    }

    if (formData.customerPhone.trim() === '') {
      alert('Veuillez saisir le téléphone du client');
      return;
    }

    onSubmit({
      ...formData,
      totalAmount
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations client */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Informations Client
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UpworkInput
            label="Nom complet *"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="Nom du client"
            required
          />
          <UpworkInput
            label="Téléphone *"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            placeholder="+237 123 456 789"
            required
          />
          <UpworkInput
            label="Email"
            type="email"
            value={formData.customerEmail || ''}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            placeholder="client@example.com"
          />
        </div>
      </div>

      {/* Informations de collecte */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Informations de Collecte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse de collecte *
            </label>
            <textarea
              value={formData.collectionAddress}
              onChange={(e) => handleInputChange('collectionAddress', e.target.value)}
              placeholder="Adresse complète de collecte"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de collecte *
              </label>
              <input
                type="date"
                value={formData.collectionDate.toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('collectionDate', new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de collecte
              </label>
              <input
                type="time"
                value={formData.collectionTime}
                onChange={(e) => handleInputChange('collectionTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes de collecte
          </label>
          <textarea
            value={formData.collectionNotes || ''}
            onChange={(e) => handleInputChange('collectionNotes', e.target.value)}
            placeholder="Instructions spéciales pour la collecte"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
      </div>

      {/* Articles */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Articles à Déposer
        </h3>
        
        {/* Formulaire d'ajout d'article */}
        <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'article *
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => handleItemChange('name', e.target.value)}
                placeholder="Ex: Chemise, Pantalon..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={newItem.category}
                onChange={(e) => handleItemChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                Quantité
              </label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire (FCFA)
              </label>
              <input
                type="number"
                min="0"
                value={newItem.unitPrice}
                onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">
                {formatCurrency(newItem.quantity * newItem.unitPrice)}
              </div>
            </div>
            <div>
              <UpworkButton
                type="button"
                onClick={addItem}
                disabled={!newItem.name || newItem.unitPrice <= 0}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </UpworkButton>
            </div>
          </div>
        </div>

        {/* Liste des articles */}
        {formData.items.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Articles ajoutés:</h4>
            {formData.items.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-green-200 flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                  <span className="text-sm text-gray-500 ml-2">- {item.quantity}x {formatCurrency(item.unitPrice)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                  <UpworkButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </UpworkButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paiement */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Informations de Paiement
        </h3>
        
        {/* Type de paiement */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de paiement
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                checked={!formData.isInstallmentPayment}
                onChange={() => handleInputChange('isInstallmentPayment', false)}
                className="mr-2"
              />
              Paiement unique
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                checked={formData.isInstallmentPayment}
                onChange={() => handleInputChange('isInstallmentPayment', true)}
                className="mr-2"
              />
              Paiement échelonné
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de paiement
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="CASH">Espèces</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CARD">Carte</option>
              <option value="BANK_TRANSFER">Virement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.isInstallmentPayment ? 'Acompte payé (FCFA)' : 'Montant payé (FCFA)'}
            </label>
            <input
              type="number"
              min="0"
              value={formData.paidAmount}
              onChange={(e) => handleInputChange('paidAmount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remise (FCFA)
            </label>
            <input
              type="number"
              min="0"
              value={formData.discountAmount}
              onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Configuration du paiement échelonné */}
        {formData.isInstallmentPayment && (
          <div className="mt-4 bg-white p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-gray-800 mb-3">Configuration du Paiement Échelonné</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'échéances
                </label>
                <select
                  value={formData.installmentCount}
                  onChange={(e) => handleInputChange('installmentCount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value={2}>2 échéances</option>
                  <option value={3}>3 échéances</option>
                  <option value={4}>4 échéances</option>
                  <option value={6}>6 échéances</option>
                  <option value={12}>12 échéances</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalle entre échéances
                </label>
                <select
                  value={formData.installmentInterval}
                  onChange={(e) => handleInputChange('installmentInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value={7}>7 jours</option>
                  <option value={14}>14 jours</option>
                  <option value={30}>30 jours</option>
                  <option value={60}>60 jours</option>
                </select>
              </div>
            </div>
            
            {/* Aperçu des échéances */}
            <div className="mt-4">
              <h5 className="font-medium text-gray-800 mb-2">Aperçu des échéances :</h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                {generateInstallmentPreview().map((installment, index) => (
                  <div key={index} className="flex justify-between items-center py-1 text-sm">
                    <span>Échéance {installment.number}:</span>
                    <span className="font-medium">{formatCurrency(installment.amount)}</span>
                    <span className="text-gray-500">{installment.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Résumé financier */}
        <div className="mt-4 bg-white p-4 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total à payer:</span>
            <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
            <span>{formData.isInstallmentPayment ? 'Acompte payé:' : 'Montant payé:'}</span>
            <span>{formatCurrency(formData.paidAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Reste à payer:</span>
            <span className={calculateTotal() - formData.paidAmount > 0 ? 'text-red-600' : 'text-green-600'}>
              {formatCurrency(calculateTotal() - formData.paidAmount)}
            </span>
          </div>
          
          {formData.isInstallmentPayment && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span>Nombre d'échéances:</span>
                <span className="font-medium">{formData.installmentCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Montant par échéance:</span>
                <span className="font-medium">
                  {formatCurrency(Math.ceil((calculateTotal() - formData.paidAmount) / (formData.installmentCount || 2)))}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Intervalle:</span>
                <span className="font-medium">{formData.installmentInterval} jours</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <UpworkButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </UpworkButton>
        <UpworkButton
          type="submit"
          disabled={isLoading || formData.items.length === 0}
          className="flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer le Dépôt'}
        </UpworkButton>
      </div>
    </form>
  );
};

export default DepositForm;
