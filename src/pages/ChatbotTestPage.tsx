import React, { useState } from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import ChatbotInterface from '@/components/chatbot/ChatbotInterface';
import { 
  Bot, 
  MessageCircle, 
  Phone, 
  Hash,
  User,
  TestTube
} from 'lucide-react';

const ChatbotTestPage: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [testScenarios, setTestScenarios] = useState([
    {
      id: 1,
      title: "État d'un dépôt",
      description: "Vérifier le statut d'une commande",
      message: "Où en est ma commande #123 ?",
      icon: Hash
    },
    {
      id: 2,
      title: "Montant dû",
      description: "Connaître le montant à payer",
      message: "Combien je dois payer ?",
      icon: Phone
    },
    {
      id: 3,
      title: "Date de livraison",
      description: "Savoir quand la commande sera prête",
      message: "Quand ma commande sera prête ?",
      icon: MessageCircle
    },
    {
      id: 4,
      title: "Historique",
      description: "Voir les commandes précédentes",
      message: "Qu'est-ce que j'ai déposé la dernière fois ?",
      icon: User
    }
  ]);

  const handleTestScenario = (message: string) => {
    // Ici on pourrait ouvrir le chatbot avec le message pré-rempli
    setShowChatbot(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test du Chatbot</h1>
          <p className="text-gray-600">Interface de test pour l'assistant E6Wash</p>
        </div>
        <UpworkButton
          onClick={() => setShowChatbot(!showChatbot)}
          className="flex items-center space-x-2"
        >
          <Bot className="h-4 w-4" />
          <span>{showChatbot ? 'Masquer' : 'Ouvrir'} Chatbot</span>
        </UpworkButton>
      </div>

      {/* Configuration de test */}
      <UpworkCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configuration de Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone Client (optionnel)
              </label>
              <UpworkInput
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+225 XX XX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Commande (optionnel)
              </label>
              <UpworkInput
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="#123"
              />
            </div>
          </div>
        </div>
      </UpworkCard>

      {/* Scénarios de test */}
      <UpworkCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Scénarios de Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testScenarios.map((scenario) => {
              const IconComponent = scenario.icon;
              return (
                <div
                  key={scenario.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {scenario.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {scenario.description}
                      </p>
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-3">
                        "{scenario.message}"
                      </div>
                      <UpworkButton
                        size="sm"
                        onClick={() => handleTestScenario(scenario.message)}
                        className="w-full"
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Tester ce scénario
                      </UpworkButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </UpworkCard>

      {/* Instructions */}
      <UpworkCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Instructions d'Utilisation
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Configuration</p>
                <p className="text-sm text-gray-600">
                  Renseignez le téléphone client et/ou le numéro de commande pour des réponses plus précises.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Test des Scénarios</p>
                <p className="text-sm text-gray-600">
                  Cliquez sur "Tester ce scénario" pour ouvrir le chatbot avec le message pré-rempli.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Interaction</p>
                <p className="text-sm text-gray-600">
                  Le chatbot peut répondre à des questions sur l'état des commandes, les montants dus, 
                  les dates de livraison et l'historique des clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </UpworkCard>

      {/* Chatbot Interface */}
      {showChatbot && (
        <ChatbotInterface
          customerPhone={customerPhone}
          orderNumber={orderNumber}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
};

export default ChatbotTestPage;
