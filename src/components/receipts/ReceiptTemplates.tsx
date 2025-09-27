import React from 'react';
import { Deposit } from '@/lib/types/deposit';

interface ReceiptTemplateProps {
  deposit: Deposit;
  type: 'DEPOSIT' | 'PAYMENT' | 'DELIVERY';
  format: 'A4' | 'A5' | 'CASH_REGISTER' | 'ELECTRONIC';
}

export const ReceiptTemplateA4: React.FC<ReceiptTemplateProps> = ({ deposit, type }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 shadow-lg" style={{ minHeight: '297mm' }}>
      {/* En-tête */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {deposit.tenantName}
        </h1>
        <p className="text-lg text-gray-600 mb-1">{deposit.agencyName}</p>
        <p className="text-sm text-gray-500">
          {type === 'DEPOSIT' && 'REÇU DE DÉPÔT'}
          {type === 'PAYMENT' && 'REÇU DE PAIEMENT'}
          {type === 'DELIVERY' && 'REÇU DE LIVRAISON'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          N° {deposit.depositNumber} | Date: {formatDate(deposit.createdAt)}
        </p>
      </div>

      {/* Informations client */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Informations Client
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Nom:</span> {deposit.customerName}</p>
            <p><span className="font-medium">Téléphone:</span> {deposit.customerPhone}</p>
            {deposit.customerEmail && (
              <p><span className="font-medium">Email:</span> {deposit.customerEmail}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Informations de Collecte
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Adresse:</span> {deposit.collectionAddress}</p>
            <p><span className="font-medium">Date:</span> {formatDate(deposit.collectionDate)}</p>
            <p><span className="font-medium">Heure:</span> {deposit.collectionTime}</p>
            {deposit.collectionNotes && (
              <p><span className="font-medium">Notes:</span> {deposit.collectionNotes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Articles déposés */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
          Articles Déposés
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Article</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Catégorie</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Quantité</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Prix Unitaire</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {deposit.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé financier */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Résumé Financier
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Sous-total:</span>
              <span>{formatCurrency(deposit.subtotal)}</span>
            </div>
            {deposit.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Remise:</span>
                <span>-{formatCurrency(deposit.discountAmount)}</span>
              </div>
            )}
            {deposit.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Taxes:</span>
                <span>{formatCurrency(deposit.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
              <span>Total:</span>
              <span>{formatCurrency(deposit.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payé:</span>
              <span className={deposit.paidAmount >= deposit.totalAmount ? 'text-green-600' : 'text-orange-600'}>
                {formatCurrency(deposit.paidAmount)}
              </span>
            </div>
            {deposit.remainingAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Reste à payer:</span>
                <span>{formatCurrency(deposit.remainingAmount)}</span>
              </div>
            )}
            {deposit.isInstallmentPayment && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="flex justify-between text-sm">
                  <span>Paiement échelonné:</span>
                  <span className="font-medium">{deposit.installmentCount} échéances</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Montant par échéance:</span>
                  <span className="font-medium">{formatCurrency(deposit.installmentAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Informations de Livraison
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Adresse:</span> {deposit.deliveryAddress}</p>
            {deposit.deliveryDate && (
              <p><span className="font-medium">Date prévue:</span> {formatDate(deposit.deliveryDate)}</p>
            )}
            {deposit.deliveryTime && (
              <p><span className="font-medium">Heure:</span> {deposit.deliveryTime}</p>
            )}
            {deposit.deliveryNotes && (
              <p><span className="font-medium">Notes:</span> {deposit.deliveryNotes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="border-t-2 border-gray-300 pt-6 mt-6">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            Merci pour votre confiance. Nous nous engageons à traiter vos vêtements avec le plus grand soin.
          </p>
          <p className="mb-4">
            Pour toute question, contactez-nous au {deposit.agencyName} ou par téléphone.
          </p>
          <div className="flex justify-between text-xs">
            <p>Reçu généré le {formatDate(new Date())}</p>
            <p>Par: {deposit.createdByName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReceiptTemplateA5: React.FC<ReceiptTemplateProps> = ({ deposit, type }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 shadow-lg" style={{ minHeight: '210mm' }}>
      {/* En-tête compact */}
      <div className="text-center border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          {deposit.tenantName}
        </h1>
        <p className="text-sm text-gray-600 mb-1">{deposit.agencyName}</p>
        <p className="text-xs text-gray-500 font-medium">
          {type === 'DEPOSIT' && 'REÇU DE DÉPÔT'}
          {type === 'PAYMENT' && 'REÇU DE PAIEMENT'}
          {type === 'DELIVERY' && 'REÇU DE LIVRAISON'}
        </p>
        <p className="text-xs text-gray-500">
          N° {deposit.depositNumber} | {formatDate(deposit.createdAt)}
        </p>
      </div>

      {/* Informations client compactes */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Client</h3>
          <p>{deposit.customerName}</p>
          <p>{deposit.customerPhone}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Collecte</h3>
          <p>{deposit.collectionAddress}</p>
          <p>{formatDate(deposit.collectionDate)}</p>
        </div>
      </div>

      {/* Articles en format compact */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">Articles</h3>
        <div className="space-y-1 text-xs">
          {deposit.items.map((item, index) => (
            <div key={index} className="flex justify-between border-b border-gray-100 pb-1">
              <span>{item.name} ({item.quantity}x)</span>
              <span>{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé financier compact */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{formatCurrency(deposit.subtotal)}</span>
          </div>
          {deposit.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Remise:</span>
              <span>-{formatCurrency(deposit.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
            <span>Total:</span>
            <span>{formatCurrency(deposit.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payé:</span>
            <span className={deposit.paidAmount >= deposit.totalAmount ? 'text-green-600' : 'text-orange-600'}>
              {formatCurrency(deposit.paidAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Pied de page compact */}
      <div className="text-center text-xs text-gray-600 border-t border-gray-300 pt-4">
        <p>Merci pour votre confiance</p>
        <p className="mt-1">Reçu généré le {formatDate(new Date())}</p>
      </div>
    </div>
  );
};

export const ReceiptTemplateCashRegister: React.FC<ReceiptTemplateProps> = ({ deposit, type }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white p-4" style={{ fontFamily: 'monospace' }}>
      {/* En-tête ticket */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold">{deposit.tenantName}</h1>
        <p className="text-sm">{deposit.agencyName}</p>
        <p className="text-xs">
          {type === 'DEPOSIT' && 'REÇU DE DÉPÔT'}
          {type === 'PAYMENT' && 'REÇU DE PAIEMENT'}
          {type === 'DELIVERY' && 'REÇU DE LIVRAISON'}
        </p>
        <p className="text-xs">N° {deposit.depositNumber}</p>
        <p className="text-xs">{formatDate(deposit.createdAt)}</p>
        <div className="border-t border-black my-2"></div>
      </div>

      {/* Client */}
      <div className="mb-3 text-xs">
        <p><strong>Client:</strong> {deposit.customerName}</p>
        <p><strong>Tel:</strong> {deposit.customerPhone}</p>
        <div className="border-t border-gray-300 my-2"></div>
      </div>

      {/* Articles */}
      <div className="mb-3 text-xs">
        {deposit.items.map((item, index) => (
          <div key={index} className="mb-1">
            <p>{item.name}</p>
            <p className="text-right">{item.quantity}x {formatCurrency(item.unitPrice)}</p>
            <p className="text-right font-bold">{formatCurrency(item.totalPrice)}</p>
          </div>
        ))}
        <div className="border-t border-gray-300 my-2"></div>
      </div>

      {/* Total */}
      <div className="mb-3 text-xs">
        <div className="flex justify-between">
          <span>Sous-total:</span>
          <span>{formatCurrency(deposit.subtotal)}</span>
        </div>
        {deposit.discountAmount > 0 && (
          <div className="flex justify-between">
            <span>Remise:</span>
            <span>-{formatCurrency(deposit.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
          <span>TOTAL:</span>
          <span>{formatCurrency(deposit.totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payé:</span>
          <span>{formatCurrency(deposit.paidAmount)}</span>
        </div>
        {deposit.remainingAmount > 0 && (
          <div className="flex justify-between">
            <span>Reste:</span>
            <span>{formatCurrency(deposit.remainingAmount)}</span>
          </div>
        )}
        <div className="border-t border-gray-300 my-2"></div>
      </div>

      {/* Pied de page */}
      <div className="text-center text-xs">
        <p>Merci pour votre confiance</p>
        <p>Reçu généré le {formatDate(new Date())}</p>
        <div className="border-t border-black my-2"></div>
        <p className="text-xs">www.e6wash.com</p>
      </div>
    </div>
  );
};

export const ReceiptTemplateElectronic: React.FC<ReceiptTemplateProps> = ({ deposit, type }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg">
      {/* En-tête moderne */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-white font-bold text-xl">E6</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          {deposit.tenantName}
        </h1>
        <p className="text-sm text-gray-600 mb-2">{deposit.agencyName}</p>
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-sm font-medium text-blue-800">
            {type === 'DEPOSIT' && '📦 REÇU DE DÉPÔT'}
            {type === 'PAYMENT' && '💳 REÇU DE PAIEMENT'}
            {type === 'DELIVERY' && '🚚 REÇU DE LIVRAISON'}
          </p>
          <p className="text-xs text-blue-600">
            N° {deposit.depositNumber} • {formatDate(deposit.createdAt)}
          </p>
        </div>
      </div>

      {/* Informations client */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          👤 Informations Client
        </h3>
        <div className="space-y-1 text-sm">
          <p><strong>{deposit.customerName}</strong></p>
          <p>📞 {deposit.customerPhone}</p>
          {deposit.customerEmail && <p>📧 {deposit.customerEmail}</p>}
        </div>
      </div>

      {/* Articles */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          🧺 Articles Déposés
        </h3>
        <div className="space-y-2">
          {deposit.items.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(item.totalPrice)}</p>
                  <p className="text-xs text-gray-500">{item.quantity}x {formatCurrency(item.unitPrice)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé financier */}
      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          💰 Résumé Financier
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{formatCurrency(deposit.subtotal)}</span>
          </div>
          {deposit.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Remise:</span>
              <span>-{formatCurrency(deposit.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(deposit.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payé:</span>
            <span className={deposit.paidAmount >= deposit.totalAmount ? 'text-green-600' : 'text-orange-600'}>
              {formatCurrency(deposit.paidAmount)}
            </span>
          </div>
          {deposit.remainingAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Reste à payer:</span>
              <span>{formatCurrency(deposit.remainingAmount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Informations de livraison */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          📍 Informations de Livraison
        </h3>
        <div className="space-y-1 text-sm">
          <p>📍 {deposit.deliveryAddress}</p>
          {deposit.deliveryDate && <p>📅 {formatDate(deposit.deliveryDate)}</p>}
          {deposit.deliveryTime && <p>🕐 {deposit.deliveryTime}</p>}
        </div>
      </div>

      {/* Pied de page moderne */}
      <div className="text-center text-sm text-gray-600">
        <p className="mb-2">🙏 Merci pour votre confiance !</p>
        <p className="text-xs mb-3">
          Nous nous engageons à traiter vos vêtements avec le plus grand soin.
        </p>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-xs">
            Reçu généré le {formatDate(new Date())} par {deposit.createdByName}
          </p>
          <p className="text-xs mt-1">www.e6wash.com</p>
        </div>
      </div>
    </div>
  );
};
