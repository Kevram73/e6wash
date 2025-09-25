import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        skip,
        take: limit,
        include: {
          conversation: { select: { id: true, title: true } },
          sender: { select: { name: true, fullname: true, avatar: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const message = await prisma.message.create({
      data: {
        conversationId: body.conversationId,
        senderId: body.senderId,
        content: body.content,
        messageType: body.messageType || 'TEXT',
        metadata: body.metadata
      },
      include: {
        conversation: { select: { id: true, title: true } },
        sender: { select: { name: true, fullname: true, avatar: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message créé avec succès',
      data: message
    });
  } catch (error) {
    console.error('Erreur création messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du message' },
      { status: 500 }
    );
  }
}
