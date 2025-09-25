import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          participants: {
            include: {
              user: { select: { name: true, fullname: true, avatar: true } }
            }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              sender: { select: { name: true, fullname: true } }
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.conversation.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API conversations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const conversation = await prisma.conversation.create({
      data: {
        tenantId: body.tenantId,
        title: body.title,
        type: body.type || 'DIRECT',
        status: body.status || 'ACTIVE'
      },
      include: {
        tenant: { select: { name: true } },
        participants: {
          include: {
            user: { select: { name: true, fullname: true, avatar: true } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Conversation créée avec succès',
      data: conversation
    });
  } catch (error) {
    console.error('Erreur création conversations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la conversation' },
      { status: 500 }
    );
  }
}
