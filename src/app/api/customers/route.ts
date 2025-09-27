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

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        },
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          agency: { select: { name: true } },
          country: { select: { name: true } },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API customers:', error);
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
    
    const customer = await prisma.customer.create({
      data: {
        tenantId: currentUser.tenantId, // Utiliser le tenantId de l'utilisateur connecté
        agencyId: body.agencyId,
        fullname: body.fullname,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        countryId: body.countryId,
        isActive: body.isActive ?? true,
        notes: body.notes
      },
      include: {
        tenant: { select: { name: true } },
        agency: { select: { name: true } },
        country: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Client créé avec succès',
      data: customer
    });
  } catch (error) {
    console.error('Erreur création customers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
}
