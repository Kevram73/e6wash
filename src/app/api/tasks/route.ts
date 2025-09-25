import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
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
      prisma.task.count()
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
    const body = await request.json();
    
    const task = await prisma.task.create({
      data: {
        tenantId: body.tenantId,
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        status: body.status || 'PENDING',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedToId: body.assignedToId,
        createdById: body.createdById,
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
