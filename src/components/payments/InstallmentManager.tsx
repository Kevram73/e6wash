import React, { useState } from 'react';
import { PaymentInstallment, Deposit } from '@/lib/types/deposit';
import { depositsService } from '@/lib/api/services/deposits';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkCard from '@/components/ui/UpworkCard';
import { 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp
} from 'lucide-react';

interface InstallmentManagerProps {
  deposit: Deposit;
  onPaymentUpdate: (installmentId: string, amount: number, method: string) => void;
}

const InstallmentManager: React.FC<InstallmentManagerProps> = ({ 
  deposit, 
  onPaymentUpdate 
}) => {
  const [selectedInstallment, setSelectedInstallment] = useState<PaymentInstallment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER'>('CASH');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Banknote className="h-4 w-4" />;
      case 'MOBILE_MONEY':
        return <Smartphone className="h-4 w-4" />;
      case 'CARD':
        return <CreditCard className="h-4 w-4" />;
      case 'BANK_TRANSFER':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: Date | string) => {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    return due < new Date();
  };

  const handlePayment = async () => {
    if (selectedInstallment && paymentAmount > 0) {
      try {
        await depositsService.payInstallment(
          selectedInstallment.id, 
          paymentAmount, 
          paymentMethod
        );
        onPaymentUpdate(selectedInstallment.id, paymentAmount, paymentMethod);
        setSelectedInstallment(null);
        setPaymentAmount(0);
      } catch (error) {
        console.error('Erreur paiement:', error);
        alert('Erreur lors du paiement');
      }
    }
  };

  const totalPaid = deposit.installments
    .filter(inst => inst.status === 'PAID')
    .reduce((sum, inst) => sum + inst.amount, 0);

  const totalPending = deposit.installments
    .filter(inst => inst.status === 'PENDING')
    .reduce((sum, inst) => sum + inst.amount, 0);

  const overdueCount = deposit.installments.filter(inst => 
    inst.status === 'PENDING' && isOverdue(inst.dueDate)
  ).length;

  return (
    <div className="space-y-6">
      {/* Résumé des paiements */}
      <UpworkCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Résumé des Paiements Échelonnés
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(deposit.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Payé</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">En Attente</p>
                <p className="text-xl font-bold text-yellow-900">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">En Retard</p>
                <p className="text-xl font-bold text-red-900">{overdueCount}</p>
              </div>
            </div>
          </div>
        </div>
      </UpworkCard>

      {/* Liste des échéances */}
      <UpworkCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Échéances de Paiement
        </h3>
        
        <div className="space-y-3">
          {deposit.installments.map((installment) => (
            <div 
              key={installment.id} 
              className={`p-4 border rounded-lg ${
                installment.status === 'PAID' ? 'bg-green-50 border-green-200' :
                isOverdue(installment.dueDate) ? 'bg-red-50 border-red-200' :
                'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(installment.status)}
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Échéance {installment.installmentNumber}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Échéance: {formatDate(installment.dueDate)}
                    </p>
                    {installment.paidDate && (
                      <p className="text-sm text-green-600">
                        Payé le: {formatDate(installment.paidDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatCurrency(installment.amount)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                      {installment.status}
                    </span>
                  </div>

                  {installment.status === 'PENDING' && (
                    <UpworkButton
                      size="sm"
                      onClick={() => {
                        setSelectedInstallment(installment);
                        setPaymentAmount(installment.amount);
                      }}
                      className={isOverdue(installment.dueDate) ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      Payer
                    </UpworkButton>
                  )}

                  {installment.status === 'PAID' && installment.paymentMethod && (
                    <div className="flex items-center text-sm text-gray-600">
                      {getPaymentMethodIcon(installment.paymentMethod)}
                      <span className="ml-1">{installment.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              {installment.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Note:</strong> {installment.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </UpworkCard>

      {/* Modal de paiement */}
      {selectedInstallment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Paiement - Échéance {selectedInstallment.installmentNumber}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant à payer
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  max={selectedInstallment.amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Montant dû: {formatCurrency(selectedInstallment.amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CASH">Espèces</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CARD">Carte</option>
                  <option value="BANK_TRANSFER">Virement</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <UpworkButton
                  variant="outline"
                  onClick={() => setSelectedInstallment(null)}
                >
                  Annuler
                </UpworkButton>
                <UpworkButton
                  onClick={handlePayment}
                  disabled={paymentAmount <= 0 || paymentAmount > selectedInstallment.amount}
                >
                  Enregistrer le Paiement
                </UpworkButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentManager;
