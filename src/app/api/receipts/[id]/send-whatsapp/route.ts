import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { phoneNumber } = body;

    // Vérifier que le reçu existe
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: {
        deposit: {
          include: {
            customer: true,
            agency: true,
            tenant: true,
            items: {
              include: {
                service: true
              }
            },
            payments: true
          }
        }
      }
    });

    if (!receipt) {
      return NextResponse.json(
        { error: 'Reçu non trouvé' },
        { status: 404 }
      );
    }

    // Générer le message WhatsApp
    const message = generateWhatsAppMessage(receipt.deposit, receipt.type);
    
    // Ici, vous intégreriez l'API WhatsApp Business
    // Pour l'instant, nous simulons l'envoi
    const whatsappResponse = await sendWhatsAppMessage(phoneNumber, message);
    
    // Mettre à jour le statut du reçu
    await prisma.receipt.update({
      where: { id },
      data: {
        status: 'SENT',
        sentTo: phoneNumber,
        sentAt: new Date(),
        deliveryStatus: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reçu envoyé par WhatsApp avec succès',
      data: {
        messageId: whatsappResponse.messageId,
        status: whatsappResponse.status,
        whatsappUrl: `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
      }
    });
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du reçu par WhatsApp' },
      { status: 500 }
    );
  }
}

function generateWhatsAppMessage(deposit: any, type: string): string {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const typeText = {
    'DEPOSIT': '📦 Reçu de Dépôt',
    'PAYMENT': '💳 Reçu de Paiement',
    'DELIVERY': '🚚 Reçu de Livraison'
  };

  const emoji = {
    'DEPOSIT': '📦',
    'PAYMENT': '💳',
    'DELIVERY': '🚚'
  };

  let message = `Bonjour ${deposit.customer.fullname},

${emoji[type]} ${typeText[type]} - ${deposit.orderNumber}

📋 *Détails de la commande:*
${deposit.items.map((item: any) => 
  `• ${item.name} (${item.quantity}x) - ${formatCurrency(Number(item.totalPrice))}`
).join('\n')}

💰 *Résumé financier:*
• Sous-total: ${formatCurrency(Number(deposit.totalAmount))}
${Number(deposit.discountAmount) > 0 ? `• Remise: -${formatCurrency(Number(deposit.discountAmount))}` : ''}
• *Total: ${formatCurrency(Number(deposit.totalAmount))}*
• Payé: ${formatCurrency(deposit.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0))}

📅 *Informations:*
• Date: ${formatDate(deposit.createdAt)}
• Agence: ${deposit.agency.name}

🙏 Merci pour votre confiance !

${deposit.tenant.name}
${deposit.agency.name}`;

  return message;
}

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<{ messageId: string; status: string }> {
  // Ici, vous intégreriez l'API WhatsApp Business
  // Exemple avec l'API WhatsApp Business Cloud API:
  
  /*
  const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phoneNumber.replace(/[^0-9]/g, ''),
      type: 'text',
      text: {
        body: message
      }
    })
  });

  const data = await response.json();
  return {
    messageId: data.messages[0].id,
    status: 'sent'
  };
  */

  // Simulation pour le développement
  console.log('Envoi WhatsApp simulé:', { phoneNumber, message });
  
  return {
    messageId: `msg_${Date.now()}`,
    status: 'sent'
  };
}
