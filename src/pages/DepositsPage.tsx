'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { depositsService } from '@/lib/api/services/deposits';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Receipt,
  Download,
  Send,
  Truck,
  User,
  DollarSign
} from 'lucide-react';
import { Deposit, DepositFormData } from '@/lib/types/deposit';
import DepositForm from '@/components/forms/DepositForm';
import ReceiptGenerator from '@/components/receipts/ReceiptGenerator';
import InstallmentManager from '@/components/payments/InstallmentManager';

const DepositsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);

  const {
    items: deposits,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleView,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModals
  } = useApiCrudSimple<Deposit>({ service: depositsService, entityName: 'deposit' });

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.depositNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.customerPhone.includes(searchTerm) ||
                         deposit.collectionAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || deposit.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || deposit.paymentStatus === paymentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'CONFIRMED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'READY':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DELIVERED':
        return <Truck className="h-4 w-4 text-emerald-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-red-100 text-red-800';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDateTime = (date: string | Date) => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  const handleGenerateReceipt = (deposit: Deposit, type: 'DEPOSIT' | 'PAYMENT' | 'DELIVERY') => {
    setSelectedDeposit(deposit);
    setIsReceiptModalOpen(true);
  };

  const handleSendWhatsApp = (deposit: Deposit) => {
    // Implémentation de l'envoi WhatsApp
    console.log('Envoi WhatsApp pour:', deposit.id);
  };

  const handleManageInstallments = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setIsInstallmentModalOpen(true);
  };

  const handleInstallmentPayment = async (installmentId: string, amount: number, method: string) => {
    // Implémentation du paiement d'échéance
    console.log('Paiement échéance:', { installmentId, amount, method });
    // Ici, vous appelleriez l'API pour enregistrer le paiement
  };

  const handleCreateDeposit = async (formData: DepositFormData) => {
    try {
      await handleCreate(formData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur création dépôt:', error);
    }
  };

  const stats = {
    total: deposits.length,
    pending: deposits.filter(d => d.status === 'NEW').length,
    inProgress: deposits.filter(d => d.status === 'IN_PROGRESS').length,
    ready: deposits.filter(d => d.status === 'READY').length,
    delivered: deposits.filter(d => d.status === 'DELIVERED').length,
    totalRevenue: deposits.reduce((sum, d) => sum + d.totalAmount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Dépôts au Pressing</h1>
          <p className="text-[#525252] mt-1">
            Gérez les dépôts de vêtements et générez les reçus
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Templates
          </UpworkButton>
          <UpworkButton className="flex items-center" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Dépôt
          </UpworkButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <UpworkCard>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Total</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{stats.total}</p>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">En Attente</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{stats.pending}</p>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">En Cours</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{stats.inProgress}</p>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Prêts</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{stats.ready}</p>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Livrés</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{stats.delivered}</p>
            </div>
          </div>
        </UpworkCard>

        <UpworkCard>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-[#525252]">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-[#2c2c2c]">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </UpworkCard>
      </div>

      {/* Filtres et recherche */}
      <UpworkCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par numéro, client, téléphone ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-[#a3a3a3]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="NEW">Nouveau</option>
              <option value="CONFIRMED">Confirmé</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="READY">Prêt</option>
              <option value="DELIVERED">Livré</option>
              <option value="CANCELLED">Annulé</option>
            </select>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            >
              <option value="all">Tous les paiements</option>
              <option value="PENDING">En attente</option>
              <option value="PARTIAL">Partiel</option>
              <option value="PAID">Payé</option>
              <option value="REFUNDED">Remboursé</option>
            </select>
          </div>
        </div>
      </UpworkCard>

      {/* Liste des dépôts */}
      <div className="grid gap-4">
        {filteredDeposits.length > 0 ? (
          filteredDeposits.map((deposit) => (
            <UpworkCard key={deposit.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(deposit.status)}
                      <h3 className="font-semibold text-lg">{deposit.depositNumber}</h3>
                    </div>
                    <span className={getStatusColor(deposit.status)}>
                      {deposit.status}
                    </span>
                    <span className={getPaymentStatusColor(deposit.paymentStatus)}>
                      {deposit.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#737373]">Client</p>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{deposit.customerName}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{deposit.customerPhone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#737373]">Adresse de Collecte</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="font-medium">{deposit.collectionAddress}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-[#a3a3a3]" />
                        <p className="text-[#525252]">{formatDateTime(deposit.collectionDate)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#737373]">Articles</p>
                      <p className="font-medium">{deposit.items.length} articles</p>
                      <p className="text-[#525252]">{formatCurrency(deposit.totalAmount)}</p>
                    </div>

                    <div>
                      <p className="text-[#737373]">Paiement</p>
                      <p className="font-medium">{formatCurrency(deposit.paidAmount)} / {formatCurrency(deposit.totalAmount)}</p>
                      <p className="text-[#525252]">Reste: {formatCurrency(deposit.remainingAmount)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(deposit)}
                    >
                      <Eye className="h-4 w-4" />
                    </UpworkButton>
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(deposit)}
                    >
                      <Edit className="h-4 w-4" />
                    </UpworkButton>
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(deposit)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </UpworkButton>
                  </div>
                  
                  <div className="flex space-x-2">
                    <UpworkButton
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleGenerateReceipt(deposit, 'DEPOSIT')}
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Reçu
                    </UpworkButton>
                    {deposit.isInstallmentPayment && (
                      <UpworkButton
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleManageInstallments(deposit)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Échéances
                      </UpworkButton>
                    )}
                    <UpworkButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendWhatsApp(deposit)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      WhatsApp
                    </UpworkButton>
                  </div>
                </div>
              </div>
            </UpworkCard>
          ))
        ) : (
          <UpworkCard>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Aucun dépôt trouvé</h3>
              <p className="text-[#737373]">
                {searchTerm || statusFilter !== 'all' || paymentStatusFilter !== 'all'
                  ? 'Aucun dépôt ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier dépôt.'}
              </p>
            </div>
          </UpworkCard>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nouveau Dépôt"
        size="xl"
      >
        <div className="p-6">
          <DepositForm
            onSubmit={handleCreateDeposit}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isLoading}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Détails du Dépôt"
        size="lg"
      >
        <div className="p-6">
          {selectedDeposit && (
            <div className="space-y-4">
              <p className="text-[#525252]">Détails complets du dépôt {selectedDeposit.depositNumber}</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Générer un Reçu"
        size="xl"
      >
        <div className="p-6">
          {selectedDeposit && (
            <ReceiptGenerator
              deposit={selectedDeposit}
              onClose={() => setIsReceiptModalOpen(false)}
            />
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isInstallmentModalOpen}
        onClose={() => setIsInstallmentModalOpen(false)}
        title="Gestion des Paiements Échelonnés"
        size="xl"
      >
        <div className="p-6">
          {selectedDeposit && (
            <InstallmentManager
              deposit={selectedDeposit}
              onPaymentUpdate={handleInstallmentPayment}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={() => selectedDeposit && handleDelete(selectedDeposit.id)}
        title="Supprimer le Dépôt"
        message={`Êtes-vous sûr de vouloir supprimer le dépôt "${selectedDeposit?.depositNumber}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DepositsPage;
