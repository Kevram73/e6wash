import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createMessageSchema = z.object({
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string().min(1),
  type: z.enum(['TEXT', 'IMAGE', 'FILE', 'SYSTEM']).default('TEXT'),
  replyToId: z.string().optional(),
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const skip = (page - 1) * limit;

    // Vérifier si l'utilisateur a accès à cette conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.id,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée ou accès non autorisé' },
        { status: 404 }
      );
    }

    // Récupérer les messages
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId: params.id },
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              fullname: true,
              email: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  fullname: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({ where: { conversationId: params.id } }),
    ]);

    return NextResponse.json({
      messages: messages.reverse(), // Inverser pour avoir l'ordre chronologique
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const validatedData = createMessageSchema.parse(body);

    // Vérifier si l'utilisateur a accès à cette conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.id,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée ou accès non autorisé' },
        { status: 404 }
      );
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        ...validatedData,
        conversationId: params.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            fullname: true,
            email: true,
          },
        },
        replyTo: {
          include: {
            sender: {
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

    // Mettre à jour la date de dernière activité de la conversation
    await prisma.conversation.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Message envoyé avec succès',
      message: message,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
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
