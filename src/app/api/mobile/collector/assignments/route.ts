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
    const status = searchParams.get('status');

    // Vérifier que l'utilisateur est un collecteur
    const collector = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        tenantId: true,
        fullname: true
      }
    });

    if (!collector || collector.role !== 'COLLECTOR') {
      return NextResponse.json(
        { error: 'Accès non autorisé - Collecteur requis' },
        { status: 403 }
      );
    }

    const filters: any = {
      collectorId: collector.id,
      tenantId: collector.tenantId
    };

    if (status) {
      filters.status = status;
    }

    const assignments = await prisma.collectionRequest.findMany({
      where: filters,
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
        itemsDetails: true
      },
      orderBy: { collectionDate: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Erreur récupération assignations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des assignations' },
      { status: 500 }
    );
  }
}
