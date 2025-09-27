import React, { useState, useRef, useEffect } from 'react';
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  Send, 
  Bot, 
  User, 
  Phone, 
  Hash,
  MessageCircle,
  X,
  Minimize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface ChatbotInterfaceProps {
  customerId?: string;
  customerPhone?: string;
  orderNumber?: string;
  onClose?: () => void;
  minimized?: boolean;
  onMinimize?: () => void;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({
  customerId,
  customerPhone,
  orderNumber,
  onClose,
  minimized = false,
  onMinimize
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "Bonjour ! Je suis l'assistant E6Wash. Comment puis-je vous aider ?",
      timestamp: new Date(),
      suggestions: [
        "Où en est ma commande ?",
        "Combien je dois payer ?",
        "Quand ma commande sera prête ?",
        "Voir mon historique"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          customerId,
          customerPhone,
          orderNumber
        }),
      });

      const result = await response.json();

      if (result.success) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: result.data.response,
          timestamp: new Date(),
          suggestions: result.data.suggestions,
          data: result.data.data
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          message: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          timestamp: new Date(),
          suggestions: [
            "Où en est ma commande ?",
            "Combien je dois payer ?",
            "Quand ma commande sera prête ?"
          ]
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <UpworkButton
          onClick={onMinimize}
          className="w-12 h-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
        </UpworkButton>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Assistant E6Wash</h3>
            <p className="text-xs text-gray-600">En ligne</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Minimize2 className="h-4 w-4 text-gray-600" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="h-4 w-4 mt-0.5 text-blue-500" />
                )}
                {message.type === 'user' && (
                  <User className="h-4 w-4 mt-0.5 text-white" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <UpworkButton
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className="px-3 py-2"
          >
            <Send className="h-4 w-4" />
          </UpworkButton>
        </div>

        {/* Raccourcis */}
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => sendMessage("Où en est ma commande ?")}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            <Hash className="h-3 w-3" />
            <span>État</span>
          </button>
          <button
            onClick={() => sendMessage("Combien je dois payer ?")}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            <Phone className="h-3 w-3" />
            <span>Paiement</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;
