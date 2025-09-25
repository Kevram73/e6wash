import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  completedAt: z.string().optional(),
  completedById: z.string().optional(),
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

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        assignedTo: {
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
        completedBy: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                fullname: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Tâche non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
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
    const validatedData = updateTaskSchema.parse(body);

    // Vérifier si la tâche existe
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Tâche non trouvée' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = { ...validatedData };

    // Gérer la date d'échéance
    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate);
    }

    // Gérer la completion
    if (validatedData.status === 'COMPLETED' && !existingTask.completedAt) {
      updateData.completedAt = new Date();
      updateData.completedById = validatedData.completedById || session.user.id;
    } else if (validatedData.status !== 'COMPLETED' && existingTask.completedAt) {
      updateData.completedAt = null;
      updateData.completedById = null;
    }

    // Mettre à jour la tâche
    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
      include: {
        tenant: true,
        assignedTo: {
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
        completedBy: {
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
      message: 'Tâche mise à jour avec succès',
      task,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    
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

    // Vérifier si la tâche existe
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Tâche non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la tâche
    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Tâche supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}