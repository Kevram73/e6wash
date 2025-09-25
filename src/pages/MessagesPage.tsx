'use client';

import React, { useState } from 'react';
import { useApiCrudSimple } from '@/hooks/useApiCrudSimple';
import { messagesService } from '@/lib/api/services/messages';
import UpworkCard from '@/components/ui/UpworkCard';
// Badge component replaced with custom spans
import UpworkButton from '@/components/ui/UpworkButton';
import { 
  MessageSquare,
  Send,
  Search,
  Plus,
  Users,
  Clock,
  CheckCircle,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const {
    items: conversations,
    selectedItem,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    formData,
    setFormData,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
    openCreateModal,
    openEditModal,
    closeModals,
    setItems
  } = useApiCrudSimple({ service: messagesService, entityName: 'conversation' });

  // Données mock temporaires pour les messages
  const messages = [
    {
      id: '1',
      conversationId: '1',
      senderId: '1',
      senderName: 'Marie Dubois',
      content: 'Bonjour, j\'aimerais savoir l\'état de ma commande.',
      timestamp: new Date().toISOString(),
      isRead: true
    },
    {
      id: '2',
      conversationId: '1',
      senderId: '2',
      senderName: 'Support',
      content: 'Bonjour Marie, votre commande est en cours de traitement.',
      timestamp: new Date().toISOString(),
      isRead: true
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages.filter(m => m.conversationId === selectedConversation);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Logique pour envoyer le message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Sidebar - Liste des conversations */}
      <div className="w-1/3 border-r border-[#e5e5e5] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#e5e5e5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2c2c2c]">Messages</h2>
            <UpworkButton size="sm">
              <Plus className="h-4 w-4" />
            </UpworkButton>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-[#f7f7f7] ${
                selectedConversation === conversation.id ? 'bg-[#f0fdf4] border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#f0fdf4]0 rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.type === 'GROUP' ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      getInitials(conversation.participants[0]?.name || 'U')
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#2c2c2c] truncate">
                      {conversation.title}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-[#525252] truncate mt-1">
                    <span className="font-medium">{conversation.lastMessage.sender}:</span>{' '}
                    {conversation.lastMessage.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[#737373]">
                      {formatDateTime(conversation.lastMessage.timestamp)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {conversation.participants.slice(0, 3).map((participant, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            participant.isOnline ? 'bg-[#f0fdf4]0 text-white' : 'bg-gray-300 text-[#525252]'
                          }`}
                          title={participant.name}
                        >
                          {participant.avatar}
                        </div>
                      ))}
                      {conversation.participants.length > 3 && (
                        <span className="text-xs text-[#737373]">
                          +{conversation.participants.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Messages */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-[#e5e5e5] bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#f0fdf4]0 rounded-full flex items-center justify-center text-white">
                    {currentConversation.type === 'GROUP' ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      getInitials(currentConversation.participants[0]?.name || 'U')
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c]">{currentConversation.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#737373]">
                        {currentConversation.participants.length} participants
                      </span>
                      <div className="flex items-center space-x-1">
                        {currentConversation.participants.slice(0, 4).map((participant, index) => (
                          <div
                            key={index}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                              participant.isOnline ? 'bg-[#f0fdf4]0 text-white' : 'bg-gray-300 text-[#525252]'
                            }`}
                            title={participant.name}
                          >
                            {participant.avatar}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <UpworkButton variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.name === 'Admin Pressing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.sender.name === 'Admin Pressing' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#f0fdf4]0 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {message.sender.avatar}
                      </div>
                    </div>
                    <div className={`flex flex-col ${message.sender.name === 'Admin Pressing' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2 rounded-lg ${
                        message.sender.name === 'Admin Pressing'
                          ? 'bg-[#f0fdf4]0 text-white'
                          : 'bg-[#e5e5e5] text-[#2c2c2c]'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-[#737373]">
                          {formatDateTime(message.timestamp)}
                        </span>
                        {message.isRead && (
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#e5e5e5] bg-white">
              <div className="flex items-center space-x-2">
                <UpworkButton variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </UpworkButton>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent"
                  />
                </div>
                <UpworkButton variant="outline" size="sm">
                  <Smile className="h-4 w-4" />
                </UpworkButton>
                <UpworkButton onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </UpworkButton>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-[#a3a3a3] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">Sélectionnez une conversation</h3>
              <p className="text-[#737373]">
                Choisissez une conversation dans la liste pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
