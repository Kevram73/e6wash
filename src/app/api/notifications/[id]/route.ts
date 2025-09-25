import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateNotificationSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.string().min(2).optional(),
  level: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS']).optional(),
  icon: z.string().optional(),
  link: z.string().optional(),
  isRead: z.boolean().optional(),
  readAt: z.string().optional(),
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

    const notification = await prisma.internalNotification.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        user: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ notification });
  } catch (error) {
    console.error('Erreur lors de la récupération de la notification:', error);
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
    const validatedData = updateNotificationSchema.parse(body);

    // Vérifier si la notification existe
    const existingNotification = await prisma.internalNotification.findUnique({
      where: { id: params.id },
    });

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = { ...validatedData };

    // Gérer la lecture de la notification
    if (validatedData.isRead && !existingNotification.isRead) {
      updateData.readAt = new Date();
    } else if (!validatedData.isRead && existingNotification.isRead) {
      updateData.readAt = null;
    }

    // Mettre à jour la notification
    const notification = await prisma.internalNotification.update({
      where: { id: params.id },
      data: updateData,
      include: {
        tenant: true,
        user: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Notification mise à jour avec succès',
      notification,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
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

    // Vérifier si la notification existe
    const existingNotification = await prisma.internalNotification.findUnique({
      where: { id: params.id },
    });

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la notification
    await prisma.internalNotification.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Notification supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
