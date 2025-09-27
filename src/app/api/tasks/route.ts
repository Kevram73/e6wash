import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur actuel pour obtenir son tenantId
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        },
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          assignedTo: { select: { name: true, fullname: true } },
          completedBy: { select: { name: true, fullname: true } },
          createdBy: { select: { name: true, fullname: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API tasks:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur actuel pour obtenir son tenantId
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const body = await request.json();
    
    const task = await prisma.task.create({
      data: {
        tenantId: currentUser.tenantId, // Utiliser le tenantId de l'utilisateur connecté
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        status: body.status || 'PENDING',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedToId: body.assignedToId,
        createdById: session.user.id, // Utiliser l'ID de l'utilisateur connecté
        relatedType: body.relatedType,
        relatedId: body.relatedId
      },
      include: {
        tenant: { select: { name: true } },
        assignedTo: { select: { name: true, fullname: true } },
        createdBy: { select: { name: true, fullname: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Tâche créée avec succès',
      data: task
    });
  } catch (error) {
    console.error('Erreur création tasks:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    );
  }
}
