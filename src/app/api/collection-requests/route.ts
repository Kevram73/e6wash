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
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur actuel pour obtenir son tenantId
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const filters: any = {
      tenantId: currentUser.tenantId
    };

    if (status) {
      filters.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.collectionRequest.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              fullname: true,
              phone: true,
              email: true,
              address: true
            }
          },
          collector: {
            select: {
              id: true,
              fullname: true,
              phone: true
            }
          },
          itemsDetails: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.collectionRequest.count({ where: filters })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur API collection requests:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    );
  }
}
