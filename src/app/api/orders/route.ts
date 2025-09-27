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

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        },
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          agency: { select: { name: true } },
          customer: { select: { fullname: true, phone: true } },
          createdBy: { select: { name: true } },
          updatedBy: { select: { name: true } },
          items: {
            include: {
              service: { select: { name: true } }
            }
          },
          payments: true,
          _count: {
            select: {
              items: true,
              payments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({
        where: {
          tenantId: currentUser.tenantId // Filtrer par tenant
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API orders:', error);
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
    
    const order = await prisma.order.create({
      data: {
        tenantId: currentUser.tenantId, // Utiliser le tenantId de l'utilisateur connecté
        agencyId: body.agencyId,
        customerId: body.customerId,
        orderNumber: body.orderNumber,
        totalAmount: body.totalAmount,
        status: body.status || 'NEW',
        paymentStatus: body.paymentStatus || 'PENDING',
        paymentMethod: body.paymentMethod,
        notes: body.notes,
        pickupDate: body.pickupDate ? new Date(body.pickupDate) : null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        discountAmount: body.discountAmount || 0,
        taxAmount: body.taxAmount || 0,
        createdById: session.user.id, // Utiliser l'ID de l'utilisateur connecté
        updatedById: session.user.id
      },
      include: {
        tenant: { select: { name: true } },
        agency: { select: { name: true } },
        customer: { select: { fullname: true, phone: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Commande créée avec succès',
      data: order
    });
  } catch (error) {
    console.error('Erreur création orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
