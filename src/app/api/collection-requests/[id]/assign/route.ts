import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    const { collectorId } = body;

    if (!collectorId) {
      return NextResponse.json(
        { error: 'ID du collecteur requis' },
        { status: 400 }
      );
    }

    // Vérifier que la demande existe
    const collectionRequest = await prisma.collectionRequest.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        customer: true
      }
    });

    if (!collectionRequest) {
      return NextResponse.json(
        { error: 'Demande de collecte non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que le collecteur existe et appartient au même tenant
    const collector = await prisma.user.findFirst({
      where: {
        id: collectorId,
        tenantId: collectionRequest.tenantId,
        role: 'COLLECTOR',
        isActive: true
      }
    });

    if (!collector) {
      return NextResponse.json(
        { error: 'Collecteur non trouvé ou inactif' },
        { status: 404 }
      );
    }

    // Assigner le collecteur
    const updatedRequest = await prisma.collectionRequest.update({
      where: { id: params.id },
      data: {
        collectorId: collectorId,
        status: 'ASSIGNED'
      },
      include: {
        customer: {
          select: {
            fullname: true,
            phone: true
          }
        },
        collector: {
          select: {
            fullname: true,
            phone: true
          }
        }
      }
    });

    // Créer une notification pour le collecteur
    await prisma.internalNotification.create({
      data: {
        tenantId: collectionRequest.tenantId,
        title: 'Nouvelle collecte assignée',
        content: `Vous avez été assigné à une collecte chez ${collectionRequest.customer.fullname}`,
        level: 'INFO',
        userId: collectorId,
        createdById: session.user.id,
        relatedType: 'COLLECTION_REQUEST',
        relatedId: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Collecteur assigné avec succès',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Erreur assignation collecteur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'assignation du collecteur' },
      { status: 500 }
    );
  }
}
