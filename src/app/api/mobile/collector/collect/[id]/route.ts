import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const collectSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    actualWeight: z.number().min(0),
    notes: z.string().optional()
  })).min(1),
  totalWeight: z.number().min(0),
  collectionNotes: z.string().optional()
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = collectSchema.parse(body);

    // Vérifier que l'utilisateur est un collecteur
    const collector = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        tenantId: true
      }
    });

    if (!collector || collector.role !== 'COLLECTOR') {
      return NextResponse.json(
        { error: 'Accès non autorisé - Collecteur requis' },
        { status: 403 }
      );
    }

    // Vérifier que la demande existe et est assignée au collecteur
    const collectionRequest = await prisma.collectionRequest.findFirst({
      where: {
        id: params.id,
        collectorId: collector.id,
        status: { in: ['ASSIGNED', 'IN_PROGRESS'] }
      },
      include: {
        customer: true,
        tenant: true
      }
    });

    if (!collectionRequest) {
      return NextResponse.json(
        { error: 'Demande de collecte non trouvée ou non assignée' },
        { status: 404 }
      );
    }

    // Mettre à jour les articles avec les poids réels
    await Promise.all(
      validatedData.items.map(item =>
        prisma.collectionRequestItem.update({
          where: { id: item.id },
          data: {
            actualWeight: item.actualWeight,
            description: item.notes
          }
        })
      )
    );

    // Calculer le montant total basé sur le poids (tarification au kilo)
    const services = await prisma.service.findMany({
      where: {
        tenantId: collector.tenantId,
        type: 'KILO',
        isActive: true
      }
    });

    // Utiliser le premier service au kilo trouvé (ou un prix par défaut)
    const kiloService = services[0];
    const pricePerKilo = kiloService ? Number(kiloService.price) : 1000; // 1000 FCFA par défaut
    const subtotal = validatedData.totalWeight * pricePerKilo;
    const discount = Number(collectionRequest.promoDiscount);
    const totalAmount = subtotal - discount;

    // Mettre à jour la demande de collecte
    const updatedRequest = await prisma.collectionRequest.update({
      where: { id: params.id },
      data: {
        status: 'COLLECTED',
        totalWeight: validatedData.totalWeight,
        totalAmount: totalAmount,
        actualItems: validatedData.items.length,
        collectionNotes: validatedData.collectionNotes
      }
    });

    // Créer la commande correspondante
    const order = await prisma.order.create({
      data: {
        tenantId: collectionRequest.tenantId,
        agencyId: collectionRequest.tenant.agencies[0]?.id || '', // Utiliser la première agence
        customerId: collectionRequest.customerId,
        orderNumber: `COL-${Date.now()}`,
        totalAmount: totalAmount,
        discountAmount: discount,
        taxAmount: 0,
        status: 'NEW',
        paymentStatus: 'PENDING',
        notes: `Collecte à domicile - ${validatedData.collectionNotes}`,
        createdById: collector.id,
        updatedById: collector.id
      }
    });

    // Créer les articles de la commande
    await Promise.all(
      validatedData.items.map(item =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            serviceId: kiloService?.id || 'default-kilo-service',
            name: `Article collecté (${item.actualWeight}kg)`,
            quantity: 1,
            unitPrice: pricePerKilo,
            totalPrice: item.actualWeight * pricePerKilo,
            category: 'KILO',
            notes: item.notes
          }
        })
      )
    );

    // Lier la commande à la demande de collecte
    await prisma.collectionRequest.update({
      where: { id: params.id },
      data: {
        order: {
          connect: { id: order.id }
        }
      }
    });

    // Créer une notification pour le client
    await prisma.internalNotification.create({
      data: {
        tenantId: collectionRequest.tenantId,
        title: 'Collecte effectuée',
        content: `Votre collecte a été effectuée. Poids total: ${validatedData.totalWeight}kg. Montant: ${totalAmount} FCFA`,
        level: 'SUCCESS',
        userId: collectionRequest.customer.user?.id || '',
        createdById: collector.id,
        relatedType: 'ORDER',
        relatedId: order.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Collecte enregistrée avec succès',
      data: {
        requestId: updatedRequest.id,
        orderId: order.id,
        totalWeight: validatedData.totalWeight,
        totalAmount: totalAmount,
        status: updatedRequest.status
      }
    });

  } catch (error) {
    console.error('Erreur enregistrement collecte:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la collecte' },
      { status: 500 }
    );
  }
}
