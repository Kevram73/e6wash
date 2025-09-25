'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { ordersService } from '@/lib/api/services/orders';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  Package,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  RefreshCw,
  History
} from 'lucide-react';

const QRScannerPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  // Données simulées pour les codes QR
  const mockOrderData = {
    'QR-ORD-001-ABC123': {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'Jean Dupont',
      customerPhone: '+237 6XX XXX XXX',
      address: 'Douala, Akwa, Rue de la Paix',
      type: 'COLLECTION',
      status: 'PENDING',
      items: [
        { name: 'Chemises', quantity: 5, weight: 2.5 },
        { name: 'Pantalons', quantity: 3, weight: 1.8 },
      ],
      totalWeight: 4.3,
      totalAmount: 15000,
      scheduledTime: new Date('2024-09-22T14:00:00'),
      notes: 'Appartement au 3ème étage, sonner à l\'interphone',
    },
    'QR-ORD-002-DEF456': {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Marie Martin',
      customerPhone: '+237 6XX XXX XXX',
      address: 'Yaoundé, Mfoundi, Avenue Kennedy',
      type: 'DELIVERY',
      status: 'IN_PROGRESS',
      items: [
        { name: 'Costumes', quantity: 2, weight: 1.2 },
        { name: 'Robes', quantity: 4, weight: 2.0 },
      ],
      totalWeight: 3.2,
      totalAmount: 22000,
      scheduledTime: new Date('2024-09-22T16:00:00'),
      notes: 'Livraison urgente, client en attente',
    },
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedCode('');
    setScanResult(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const simulateScan = (code: string) => {
    setScannedCode(code);
    const orderData = mockOrderData[code as keyof typeof mockOrderData];
    
    if (orderData) {
      setScanResult({
        success: true,
        data: orderData,
        timestamp: new Date(),
      });
      
      // Ajouter à l'historique
      setScanHistory(prev => [{
        code,
        success: true,
        data: orderData,
        timestamp: new Date(),
      }, ...prev.slice(0, 9)]); // Garder seulement les 10 derniers
    } else {
      setScanResult({
        success: false,
        error: 'Code QR non reconnu',
        timestamp: new Date(),
      });
      
      setScanHistory(prev => [{
        code,
        success: false,
        error: 'Code QR non reconnu',
        timestamp: new Date(),
      }, ...prev.slice(0, 9)]);
    }
  };

  const confirmAction = (action: 'collect' | 'deliver') => {
    if (scanResult?.success) {
      // Simuler la confirmation
      alert(`Action ${action === 'collect' ? 'collecte' : 'livraison'} confirmée pour ${scanResult.data.orderNumber}`);
      setScanResult(null);
      setScannedCode('');
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">Scanner QR</h1>
          <p className="text-[#525252] mt-1">
            Scanner les codes QR pour confirmer les collectes et livraisons
          </p>
        </div>
        <div className="flex space-x-2">
          <UpworkButton variant="outline" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Historique
          </UpworkButton>
          <UpworkButton 
            onClick={isScanning ? stopScanning : startScanning}
            className={`flex items-center ${
              isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Camera className="h-4 w-4 mr-2" />
            {isScanning ? 'Arrêter' : 'Démarrer'} le scan
          </UpworkButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Area */}
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Scanner de Code QR
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Scannez le code QR sur le sac ou le ticket client
            </p>
          
            {isScanning ? (
              <div className="space-y-4">
                {/* Zone de scan simulée */}
                <div className="relative bg-[#f5f5f5] rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-[#e5e5e5]">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-[#a3a3a3] mx-auto mb-2" />
                    <p className="text-[#525252]">Pointez la caméra vers le code QR</p>
                    <p className="text-sm text-[#737373] mt-1">Zone de scan active</p>
                  </div>
                  
                  {/* Cadre de scan animé */}
                  <div className="absolute inset-4 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                </div>

                {/* Boutons de test pour simulation */}
                <div className="space-y-2">
                  <p className="text-sm text-[#525252]">Codes de test disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(mockOrderData).map((code) => (
                      <UpworkButton
                        key={code}
                        variant="outline"
                        size="sm"
                        onClick={() => simulateScan(code)}
                        className="text-xs"
                      >
                        {code}
                      </UpworkButton>
                    ))}
                  </div>
                </div>

                <UpworkButton
                  onClick={stopScanning}
                  variant="outline"
                  className="w-full"
                >
                  Arrêter le scan
                </UpworkButton>
              </div>
            ) : (
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 text-[#a3a3a3] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">
                  Scanner inactif
                </h3>
                <p className="text-[#525252] mb-4">
                  Cliquez sur "Démarrer le scan" pour commencer à scanner les codes QR
                </p>
                <UpworkButton onClick={startScanning} className="flex items-center mx-auto">
                  <Camera className="h-4 w-4 mr-2" />
                  Démarrer le scan
                </UpworkButton>
              </div>
            )}
          </div>
        </UpworkCard>

        {/* Scan Result */}
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              {scanResult?.success ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              ) : scanResult ? (
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
              ) : (
                <Package className="h-5 w-5 mr-2 text-[#a3a3a3]" />
              )}
              Résultat du Scan
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {scanResult ? 'Détails de la commande scannée' : 'Aucun scan effectué'}
            </p>
          
            {scanResult ? (
              <div className="space-y-4">
                {scanResult.success ? (
                  <>
                    <div className="p-4 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0]">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-800">Code QR valide</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Scanné le {formatDateTime(scanResult.timestamp)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-lg">{scanResult.data.orderNumber}</h4>
                        <span className={
                          scanResult.data.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          scanResult.data.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {scanResult.data.status === 'PENDING' ? 'En attente' :
                           scanResult.data.status === 'IN_PROGRESS' ? 'En cours' : 'Terminé'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-[#a3a3a3]" />
                          <span className="font-medium">Client:</span>
                          <span>{scanResult.data.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-[#a3a3a3]" />
                          <span className="font-medium">Adresse:</span>
                          <span>{scanResult.data.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#a3a3a3]" />
                          <span className="font-medium">Horaire:</span>
                          <span>{formatDateTime(scanResult.data.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-[#a3a3a3]" />
                          <span className="font-medium">Type:</span>
                          <span>{scanResult.data.type === 'COLLECTION' ? 'Collecte' : 'Livraison'}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#f7f7f7] rounded-lg">
                        <p className="text-sm font-medium mb-2">Articles:</p>
                        <div className="space-y-1">
                          {scanResult.data.items.map((item: any, index: number) => (
                            <div key={index} className="text-sm text-[#525252]">
                              • {item.name} ({item.quantity} pièces, {item.weight} kg)
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm">
                            <span className="font-medium">Total:</span> {scanResult.data.totalWeight} kg - {formatCurrency(scanResult.data.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {scanResult.data.notes && (
                        <div className="p-3 bg-[#f0fdf4] rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Notes:</span> {scanResult.data.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {scanResult.data.type === 'COLLECTION' ? (
                          <UpworkButton
                            onClick={() => confirmAction('collect')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Confirmer Collecte
                          </UpworkButton>
                        ) : (
                          <UpworkButton
                            onClick={() => confirmAction('deliver')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            Confirmer Livraison
                          </UpworkButton>
                        )}
                        <UpworkButton
                          variant="outline"
                          onClick={() => {
                            setScanResult(null);
                            setScannedCode('');
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </UpworkButton>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-800">Code QR invalide</span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      {scanResult.error}
                    </p>
                    <p className="text-sm text-red-600">
                      Scanné le {formatDateTime(scanResult.timestamp)}
                    </p>
                    <UpworkButton
                      variant="outline"
                      onClick={() => {
                        setScanResult(null);
                        setScannedCode('');
                      }}
                      className="mt-3"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réessayer
                    </UpworkButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-[#a3a3a3] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">
                  Aucun scan effectué
                </h3>
                <p className="text-[#525252]">
                  Scannez un code QR pour voir les détails de la commande
                </p>
              </div>
            )}
          </div>
        </UpworkCard>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <UpworkCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <History className="h-5 w-5 mr-2" />
              Historique des Scans
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Derniers codes QR scannés
            </p>
          
            <div className="space-y-2">
              {scanHistory.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {scan.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{scan.code}</p>
                      <p className="text-sm text-[#525252]">
                        {scan.success ? scan.data.orderNumber : scan.error}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#525252]">
                      {formatDateTime(scan.timestamp)}
                    </p>
                    <span className={
                      scan.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }>
                      {scan.success ? 'Valide' : 'Invalide'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UpworkCard>
      )}
    </div>
  );
};

export default QRScannerPage;
