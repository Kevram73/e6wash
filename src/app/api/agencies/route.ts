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

    const [agencies, total] = await Promise.all([
      prisma.agency.findMany({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        },
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          country: { select: { name: true } },
          _count: {
            select: {
              users: true,
              customers: true,
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.agency.count({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        agencies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API agencies:', error);
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
    
    const agency = await prisma.agency.create({
      data: {
        tenantId: currentUser.tenantId, // Utiliser le tenantId de l'utilisateur connecté
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        countryId: body.countryId,
        city: body.city,
        isActive: body.isActive ?? true,
        code: body.code,
        capacity: body.capacity,
        isMainAgency: body.isMainAgency ?? false,
        settings: body.settings
      },
      include: {
        tenant: { select: { name: true } },
        country: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Agence créée avec succès',
      data: agency
    });
  } catch (error) {
    console.error('Erreur création agencies:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'agence' },
      { status: 500 }
    );
  }
}
