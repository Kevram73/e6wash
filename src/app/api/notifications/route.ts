import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.internalNotification.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          user: { select: { name: true, fullname: true } },
          createdBy: { select: { name: true, fullname: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.internalNotification.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const notification = await prisma.internalNotification.create({
      data: {
        tenantId: body.tenantId,
        userId: body.userId,
        title: body.title,
        content: body.content,
        icon: body.icon,
        level: body.level || 'INFO',
        link: body.link,
        createdById: body.createdById,
        relatedType: body.relatedType,
        relatedId: body.relatedId
      },
      include: {
        tenant: { select: { name: true } },
        user: { select: { name: true, fullname: true } },
        createdBy: { select: { name: true, fullname: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Notification créée avec succès',
      data: notification
    });
  } catch (error) {
    console.error('Erreur création notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la notification' },
      { status: 500 }
    );
  }
}
