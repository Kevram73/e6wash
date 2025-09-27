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

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        services,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API services:', error);
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
    
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        type: body.type,
        estimatedTime: body.estimatedTime,
        isActive: body.isActive,
        tenantId: currentUser.tenantId // Utiliser le tenantId de l'utilisateur connecté
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Service créé avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur création services:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    );
  }
}
