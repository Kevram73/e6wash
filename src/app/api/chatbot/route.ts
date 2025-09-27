import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface ChatbotRequest {
  message: string;
  customerId?: string;
  customerPhone?: string;
  orderNumber?: string;
}

interface ChatbotResponse {
  response: string;
  type: 'info' | 'order_status' | 'payment_info' | 'delivery_info' | 'history' | 'error';
  data?: any;
  suggestions?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body: ChatbotRequest = await request.json();
    const { message, customerId, customerPhone, orderNumber } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tenantId: true,
        agencyId: true,
        role: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Analyser le message et déterminer l'intention
    const intent = analyzeIntent(message);
    
    let response: ChatbotResponse;

    switch (intent.type) {
      case 'order_status':
        response = await handleOrderStatus(intent, currentUser, customerId, customerPhone, orderNumber);
        break;
      case 'payment_info':
        response = await handlePaymentInfo(intent, currentUser, customerId, customerPhone, orderNumber);
        break;
      case 'delivery_info':
        response = await handleDeliveryInfo(intent, currentUser, customerId, customerPhone, orderNumber);
        break;
      case 'history':
        response = await handleHistory(intent, currentUser, customerId, customerPhone);
        break;
      case 'greeting':
        response = {
          response: "Bonjour ! Je suis l'assistant E6Wash. Comment puis-je vous aider ?",
          type: 'info',
          suggestions: [
            "Où en est ma commande ?",
            "Combien je dois payer ?",
            "Quand ma commande sera prête ?",
            "Voir mon historique"
          ]
        };
        break;
      default:
        response = {
          response: "Je ne comprends pas votre demande. Pouvez-vous être plus précis ?",
          type: 'error',
          suggestions: [
            "Où en est ma commande #123 ?",
            "Combien je dois payer ?",
            "Quand ma commande sera prête ?",
            "Voir mon historique"
          ]
        };
    }

    return NextResponse.json({ success: true, data: response });

  } catch (error) {
    console.error('Erreur chatbot:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de votre demande' },
      { status: 500 }
    );
  }
}

function analyzeIntent(message: string): { type: string; orderNumber?: string; customerInfo?: string } {
  const lowerMessage = message.toLowerCase();

  // Détection de l'état d'une commande
  if (lowerMessage.includes('état') || lowerMessage.includes('en est') || lowerMessage.includes('statut')) {
    const orderMatch = lowerMessage.match(/#?(\d+)/);
    return {
      type: 'order_status',
      orderNumber: orderMatch ? orderMatch[1] : undefined
    };
  }

  // Détection du montant dû
  if (lowerMessage.includes('combien') || lowerMessage.includes('montant') || lowerMessage.includes('payer') || lowerMessage.includes('dû')) {
    const orderMatch = lowerMessage.match(/#?(\d+)/);
    return {
      type: 'payment_info',
      orderNumber: orderMatch ? orderMatch[1] : undefined
    };
  }

  // Détection de la date de livraison
  if (lowerMessage.includes('quand') || lowerMessage.includes('livraison') || lowerMessage.includes('prêt') || lowerMessage.includes('terminé')) {
    const orderMatch = lowerMessage.match(/#?(\d+)/);
    return {
      type: 'delivery_info',
      orderNumber: orderMatch ? orderMatch[1] : undefined
    };
  }

  // Détection de l'historique
  if (lowerMessage.includes('historique') || lowerMessage.includes('dernière') || lowerMessage.includes('avant')) {
    return { type: 'history' };
  }

  // Détection de salutation
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
    return { type: 'greeting' };
  }

  return { type: 'unknown' };
}

async function handleOrderStatus(intent: any, user: any, customerId?: string, customerPhone?: string, orderNumber?: string): Promise<ChatbotResponse> {
  try {
    const filters: any = {
      tenantId: user.tenantId,
      deletedAt: null
    };

    // Si un numéro de commande est fourni
    if (intent.orderNumber || orderNumber) {
      filters.orderNumber = intent.orderNumber || orderNumber;
    } else if (customerId) {
      filters.customerId = customerId;
    } else if (customerPhone) {
      // Trouver le client par téléphone
      const customer = await prisma.customer.findFirst({
        where: {
          phone: customerPhone,
          tenantId: user.tenantId
        }
      });
      if (customer) {
        filters.customerId = customer.id;
      }
    }

    const order = await prisma.order.findFirst({
      where: filters,
      include: {
        customer: {
          select: {
            fullname: true,
            phone: true
          }
        },
        agency: {
          select: {
            name: true
          }
        },
        items: {
          include: {
            service: {
              select: {
                name: true
              }
            }
          }
        },
        payments: {
          select: {
            amount: true,
            status: true,
            method: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!order) {
      return {
        response: "Je n'ai pas trouvé de commande correspondante. Pouvez-vous vérifier le numéro de commande ?",
        type: 'error',
        suggestions: ["Voir mon historique", "Combien je dois payer ?"]
      };
    }

    const paidAmount = order.payments.reduce((sum, payment) => 
      payment.status === 'PAID' ? sum + Number(payment.amount) : sum, 0
    );
    const remainingAmount = Number(order.totalAmount) - paidAmount;

    let statusText = '';
    switch (order.status) {
      case 'PENDING':
        statusText = 'En attente de traitement';
        break;
      case 'IN_PROGRESS':
        statusText = 'En cours de traitement';
        break;
      case 'READY':
        statusText = 'Prête pour la livraison';
        break;
      case 'DELIVERED':
        statusText = 'Livrée';
        break;
      default:
        statusText = order.status;
    }

    const response = `📦 **Commande #${order.orderNumber}**\n\n` +
      `👤 Client: ${order.customer.fullname}\n` +
      `🏢 Agence: ${order.agency?.name || 'N/A'}\n` +
      `📅 Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}\n` +
      `📊 Statut: ${statusText}\n` +
      `💰 Montant: ${formatCurrency(order.totalAmount)}\n` +
      `💳 Payé: ${formatCurrency(paidAmount)}\n` +
      `⏳ Restant: ${formatCurrency(remainingAmount)}\n\n` +
      `📋 Articles:\n${order.items.map(item => 
        `• ${item.service.name} (${item.quantity}x)`
      ).join('\n')}`;

    return {
      response,
      type: 'order_status',
      data: order,
      suggestions: [
        "Combien je dois payer ?",
        "Quand ma commande sera prête ?",
        "Voir mon historique"
      ]
    };

  } catch (error) {
    console.error('Erreur handleOrderStatus:', error);
    return {
      response: "Erreur lors de la récupération des informations de la commande.",
      type: 'error'
    };
  }
}

async function handlePaymentInfo(intent: any, user: any, customerId?: string, customerPhone?: string, orderNumber?: string): Promise<ChatbotResponse> {
  try {
    const filters: any = {
      tenantId: user.tenantId,
      deletedAt: null
    };

    if (intent.orderNumber || orderNumber) {
      filters.orderNumber = intent.orderNumber || orderNumber;
    } else if (customerId) {
      filters.customerId = customerId;
    } else if (customerPhone) {
      const customer = await prisma.customer.findFirst({
        where: {
          phone: customerPhone,
          tenantId: user.tenantId
        }
      });
      if (customer) {
        filters.customerId = customer.id;
      }
    }

    const orders = await prisma.order.findMany({
      where: {
        ...filters,
        paymentStatus: { in: ['PENDING', 'PARTIAL'] }
      },
      include: {
        customer: {
          select: {
            fullname: true
          }
        },
        payments: {
          select: {
            amount: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (orders.length === 0) {
      return {
        response: "Vous n'avez aucune somme en attente de paiement.",
        type: 'payment_info',
        suggestions: ["Où en est ma commande ?", "Voir mon historique"]
      };
    }

    const totalDue = orders.reduce((sum, order) => {
      const paidAmount = order.payments.reduce((paymentSum, payment) => 
        payment.status === 'PAID' ? paymentSum + Number(payment.amount) : paymentSum, 0
      );
      return sum + (Number(order.totalAmount) - paidAmount);
    }, 0);

    const response = `💰 **Montant dû: ${formatCurrency(totalDue)}**\n\n` +
      `📋 Détail des commandes en attente:\n\n` +
      orders.map(order => {
        const paidAmount = order.payments.reduce((sum, payment) => 
          payment.status === 'PAID' ? sum + Number(payment.amount) : sum, 0
        );
        const remaining = Number(order.totalAmount) - paidAmount;
        return `• Commande #${order.orderNumber}: ${formatCurrency(remaining)}`;
      }).join('\n');

    return {
      response,
      type: 'payment_info',
      data: { totalDue, orders },
      suggestions: [
        "Où en est ma commande ?",
        "Quand ma commande sera prête ?",
        "Voir mon historique"
      ]
    };

  } catch (error) {
    console.error('Erreur handlePaymentInfo:', error);
    return {
      response: "Erreur lors de la récupération des informations de paiement.",
      type: 'error'
    };
  }
}

async function handleDeliveryInfo(intent: any, user: any, customerId?: string, customerPhone?: string, orderNumber?: string): Promise<ChatbotResponse> {
  try {
    const filters: any = {
      tenantId: user.tenantId,
      deletedAt: null
    };

    if (intent.orderNumber || orderNumber) {
      filters.orderNumber = intent.orderNumber || orderNumber;
    } else if (customerId) {
      filters.customerId = customerId;
    } else if (customerPhone) {
      const customer = await prisma.customer.findFirst({
        where: {
          phone: customerPhone,
          tenantId: user.tenantId
        }
      });
      if (customer) {
        filters.customerId = customer.id;
      }
    }

    const order = await prisma.order.findFirst({
      where: filters,
      include: {
        customer: {
          select: {
            fullname: true
          }
        },
        agency: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!order) {
      return {
        response: "Je n'ai pas trouvé de commande correspondante.",
        type: 'error',
        suggestions: ["Voir mon historique", "Où en est ma commande ?"]
      };
    }

    let deliveryInfo = '';
    switch (order.status) {
      case 'PENDING':
        deliveryInfo = "Votre commande est en attente de traitement. Elle sera prête dans 2-3 jours ouvrables.";
        break;
      case 'IN_PROGRESS':
        deliveryInfo = "Votre commande est en cours de traitement. Elle sera prête dans 1-2 jours ouvrables.";
        break;
      case 'READY':
        deliveryInfo = "🎉 Votre commande est prête ! Vous pouvez venir la récupérer à l'agence.";
        break;
      case 'DELIVERED':
        deliveryInfo = "✅ Votre commande a été livrée.";
        break;
      default:
        deliveryInfo = "Statut de livraison non déterminé.";
    }

    const response = `📅 **Livraison - Commande #${order.orderNumber}**\n\n` +
      `👤 Client: ${order.customer.fullname}\n` +
      `🏢 Agence: ${order.agency?.name || 'N/A'}\n` +
      `📅 Date de commande: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}\n\n` +
      `📋 ${deliveryInfo}`;

    return {
      response,
      type: 'delivery_info',
      data: order,
      suggestions: [
        "Où en est ma commande ?",
        "Combien je dois payer ?",
        "Voir mon historique"
      ]
    };

  } catch (error) {
    console.error('Erreur handleDeliveryInfo:', error);
    return {
      response: "Erreur lors de la récupération des informations de livraison.",
      type: 'error'
    };
  }
}

async function handleHistory(intent: any, user: any, customerId?: string, customerPhone?: string): Promise<ChatbotResponse> {
  try {
    const filters: any = {
      tenantId: user.tenantId,
      deletedAt: null
    };

    if (customerId) {
      filters.customerId = customerId;
    } else if (customerPhone) {
      const customer = await prisma.customer.findFirst({
        where: {
          phone: customerPhone,
          tenantId: user.tenantId
        }
      });
      if (customer) {
        filters.customerId = customer.id;
      }
    }

    const orders = await prisma.order.findMany({
      where: filters,
      include: {
        customer: {
          select: {
            fullname: true
          }
        },
        agency: {
          select: {
            name: true
          }
        },
        items: {
          include: {
            service: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (orders.length === 0) {
      return {
        response: "Vous n'avez pas encore de commandes.",
        type: 'history',
        suggestions: ["Où en est ma commande ?", "Combien je dois payer ?"]
      };
    }

    const response = `📋 **Vos 5 dernières commandes:**\n\n` +
      orders.map((order, index) => {
        const statusEmoji = order.status === 'DELIVERED' ? '✅' : 
                           order.status === 'READY' ? '🎉' : 
                           order.status === 'IN_PROGRESS' ? '⏳' : '📦';
        
        return `${index + 1}. ${statusEmoji} **Commande #${order.orderNumber}**\n` +
               `   📅 ${new Date(order.createdAt).toLocaleDateString('fr-FR')}\n` +
               `   💰 ${formatCurrency(order.totalAmount)}\n` +
               `   📊 ${order.status}\n`;
      }).join('\n');

    return {
      response,
      type: 'history',
      data: orders,
      suggestions: [
        "Où en est ma commande ?",
        "Combien je dois payer ?",
        "Quand ma commande sera prête ?"
      ]
    };

  } catch (error) {
    console.error('Erreur handleHistory:', error);
    return {
      response: "Erreur lors de la récupération de l'historique.",
      type: 'error'
    };
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount);
}
