import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSubscriptionSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().min(0).optional(),
  maxAgencies: z.number().min(-1).optional(),
  maxUsers: z.number().min(-1).optional(),
  maxOrdersPerMonth: z.number().min(-1).optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        tenantSubscriptions: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                subdomain: true,
              },
            },
          },
        },
        _count: {
          select: {
            tenantSubscriptions: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateSubscriptionSchema.parse(body);

    // Vérifier si l'abonnement existe
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: params.id },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le nom est déjà utilisé par un autre abonnement
    if (validatedData.name && validatedData.name !== existingSubscription.name) {
      const nameExists = await prisma.subscription.findUnique({
        where: { name: validatedData.name },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Ce nom d\'abonnement est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'abonnement
    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      message: 'Abonnement mis à jour avec succès',
      subscription,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier si l'abonnement existe
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: params.id },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des tenants qui utilisent cet abonnement
    const tenantSubscriptionCount = await prisma.tenantSubscription.count({
      where: { subscriptionId: params.id },
    });

    if (tenantSubscriptionCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un abonnement utilisé par des tenants' },
        { status: 400 }
      );
    }

    // Supprimer l'abonnement
    await prisma.subscription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Abonnement supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
