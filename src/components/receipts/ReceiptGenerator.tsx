import React, { useState } from 'react';
import { Deposit } from '@/lib/types/deposit';
import { 
  ReceiptTemplateA4, 
  ReceiptTemplateA5, 
  ReceiptTemplateCashRegister, 
  ReceiptTemplateElectronic 
} from './ReceiptTemplates';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkCard from '@/components/ui/UpworkCard';
import { 
  Download, 
  Send, 
  Printer, 
  FileText, 
  Smartphone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReceiptGeneratorProps {
  deposit: Deposit;
  onClose: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ deposit, onClose }) => {
  const [selectedType, setSelectedType] = useState<'DEPOSIT' | 'PAYMENT' | 'DELIVERY'>('DEPOSIT');
  const [selectedFormat, setSelectedFormat] = useState<'A4' | 'A5' | 'CASH_REGISTER' | 'ELECTRONIC'>('A4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [whatsappNumber, setWhatsappNumber] = useState(deposit.customerPhone);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Ici, vous intégreriez une bibliothèque comme jsPDF ou Puppeteer
      // pour générer le PDF à partir du template HTML
      console.log('Génération PDF pour:', deposit.id, selectedType, selectedFormat);
      
      // Simulation de génération
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Télécharger le PDF (simulation)
      const link = document.createElement('a');
      link.href = '#'; // URL du PDF généré
      link.download = `receipt-${deposit.depositNumber}-${selectedType.toLowerCase()}.pdf`;
      link.click();
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const template = getTemplateComponent();
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu - ${deposit.depositNumber}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div id="receipt-content"></div>
          </body>
        </html>
      `);
      
      // Injecter le contenu du template
      const contentDiv = printWindow.document.getElementById('receipt-content');
      if (contentDiv) {
        contentDiv.innerHTML = template;
      }
      
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSendWhatsApp = async () => {
    setIsSending(true);
    setSendStatus('idle');
    
    try {
      // Ici, vous intégreriez l'API WhatsApp Business
      const message = generateWhatsAppMessage();
      
      // Simulation d'envoi WhatsApp
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ouvrir WhatsApp Web avec le message pré-rempli
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      setSendStatus('success');
    } catch (error) {
      console.error('Erreur envoi WhatsApp:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setSendStatus('idle');
    
    try {
      // Ici, vous intégreriez l'API d'envoi d'email
      console.log('Envoi email pour:', deposit.id);
      
      // Simulation d'envoi email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSendStatus('success');
    } catch (error) {
      console.error('Erreur envoi email:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const typeText = {
      'DEPOSIT': 'Reçu de Dépôt',
      'PAYMENT': 'Reçu de Paiement',
      'DELIVERY': 'Reçu de Livraison'
    };

    return `Bonjour ${deposit.customerName},

${typeText[selectedType]} - ${deposit.depositNumber}

📦 Articles: ${deposit.items.length} articles
💰 Montant: ${formatCurrency(deposit.totalAmount)}
📅 Date: ${formatDate(deposit.createdAt)}

Merci pour votre confiance !

${deposit.tenantName}
${deposit.agencyName}`;
  };

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
    }).format(dateObj);
  };

  const getTemplateComponent = () => {
    const props = { deposit, type: selectedType, format: selectedFormat };
    
    switch (selectedFormat) {
      case 'A4':
        return <ReceiptTemplateA4 {...props} />;
      case 'A5':
        return <ReceiptTemplateA5 {...props} />;
      case 'CASH_REGISTER':
        return <ReceiptTemplateCashRegister {...props} />;
      case 'ELECTRONIC':
        return <ReceiptTemplateElectronic {...props} />;
      default:
        return <ReceiptTemplateA4 {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélection du type de reçu */}
      <UpworkCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Type de Reçu</h3>
        <div className="grid grid-cols-3 gap-4">
          <UpworkButton
            variant={selectedType === 'DEPOSIT' ? 'default' : 'outline'}
            onClick={() => setSelectedType('DEPOSIT')}
            className="h-20 flex-col"
          >
            <FileText className="h-6 w-6 mb-2" />
            Reçu de Dépôt
          </UpworkButton>
          <UpworkButton
            variant={selectedType === 'PAYMENT' ? 'default' : 'outline'}
            onClick={() => setSelectedType('PAYMENT')}
            className="h-20 flex-col"
          >
            <CheckCircle className="h-6 w-6 mb-2" />
            Reçu de Paiement
          </UpworkButton>
          <UpworkButton
            variant={selectedType === 'DELIVERY' ? 'default' : 'outline'}
            onClick={() => setSelectedType('DELIVERY')}
            className="h-20 flex-col"
          >
            <Send className="h-6 w-6 mb-2" />
            Reçu de Livraison
          </UpworkButton>
        </div>
      </UpworkCard>

      {/* Sélection du format */}
      <UpworkCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Format du Reçu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UpworkButton
            variant={selectedFormat === 'A4' ? 'default' : 'outline'}
            onClick={() => setSelectedFormat('A4')}
            className="h-20 flex-col"
          >
            <FileText className="h-6 w-6 mb-2" />
            A4 (Standard)
          </UpworkButton>
          <UpworkButton
            variant={selectedFormat === 'A5' ? 'default' : 'outline'}
            onClick={() => setSelectedFormat('A5')}
            className="h-20 flex-col"
          >
            <FileText className="h-6 w-6 mb-2" />
            A5 (Compact)
          </UpworkButton>
          <UpworkButton
            variant={selectedFormat === 'CASH_REGISTER' ? 'default' : 'outline'}
            onClick={() => setSelectedFormat('CASH_REGISTER')}
            className="h-20 flex-col"
          >
            <Printer className="h-6 w-6 mb-2" />
            Ticket de Caisse
          </UpworkButton>
          <UpworkButton
            variant={selectedFormat === 'ELECTRONIC' ? 'default' : 'outline'}
            onClick={() => setSelectedFormat('ELECTRONIC')}
            className="h-20 flex-col"
          >
            <Smartphone className="h-6 w-6 mb-2" />
            Électronique
          </UpworkButton>
        </div>
      </UpworkCard>

      {/* Aperçu du reçu */}
      <UpworkCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aperçu du Reçu</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          {getTemplateComponent()}
        </div>
      </UpworkCard>

      {/* Actions */}
      <UpworkCard>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UpworkButton
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Génération...' : 'Télécharger PDF'}
          </UpworkButton>

          <UpworkButton
            variant="outline"
            onClick={handlePrint}
            className="flex items-center justify-center"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </UpworkButton>

          <UpworkButton
            variant="outline"
            onClick={handleSendWhatsApp}
            disabled={isSending}
            className="flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Envoi...' : 'WhatsApp'}
          </UpworkButton>

          <UpworkButton
            variant="outline"
            onClick={handleSendEmail}
            disabled={isSending}
            className="flex items-center justify-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSending ? 'Envoi...' : 'Email'}
          </UpworkButton>
        </div>

        {/* Configuration WhatsApp */}
        {selectedFormat === 'ELECTRONIC' && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Configuration WhatsApp</h4>
            <div className="flex items-center space-x-2">
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Numéro WhatsApp"
                className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <UpworkButton
                size="sm"
                onClick={handleSendWhatsApp}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-1" />
                Envoyer
              </UpworkButton>
            </div>
          </div>
        )}

        {/* Statut d'envoi */}
        {sendStatus !== 'idle' && (
          <div className={`mt-4 p-3 rounded-lg flex items-center ${
            sendStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {sendStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {sendStatus === 'success' 
              ? 'Reçu envoyé avec succès !' 
              : 'Erreur lors de l\'envoi du reçu'
            }
          </div>
        )}
      </UpworkCard>
    </div>
  );
};

export default ReceiptGenerator;
