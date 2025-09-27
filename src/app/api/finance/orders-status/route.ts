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
    const status = searchParams.get('status'); // 'PAID', 'PENDING', 'OVERDUE'
    const agencyId = searchParams.get('agencyId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tenantId: true,
        agencyId: true,
        role: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Construire les filtres
    const filters: any = {
      tenantId: currentUser.tenantId,
      deletedAt: null
    };

    // Si l'utilisateur n'est pas admin/owner, filtrer par agence
    if (!['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(currentUser.role)) {
      filters.agencyId = currentUser.agencyId;
    } else if (agencyId) {
      filters.agencyId = agencyId;
    }

    // Filtrer par statut de paiement
    if (status === 'PAID') {
      filters.paymentStatus = 'PAID';
    } else if (status === 'PENDING') {
      filters.paymentStatus = 'PENDING';
    } else if (status === 'OVERDUE') {
      // Commandes en retard (plus de 7 jours)
      filters.paymentStatus = 'PENDING';
      filters.createdAt = {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      };
    }

    // Récupérer les commandes
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              fullname: true,
              phone: true,
              email: true
            }
          },
          agency: {
            select: {
              name: true
            }
          },
          payments: {
            select: {
              amount: true,
              method: true,
              status: true,
              createdAt: true
            }
          },
          items: {
            select: {
              name: true,
              quantity: true,
              totalPrice: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: filters })
    ]);

    // Calculer les montants payés et restants
    const ordersWithPaymentInfo = orders.map(order => {
      const paidAmount = order.payments.reduce((sum, payment) => 
        payment.status === 'PAID' ? sum + Number(payment.amount) : sum, 0
      );
      const remainingAmount = Number(order.totalAmount) - paidAmount;
      const isOverdue = order.paymentStatus === 'PENDING' && 
        new Date(order.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      return {
        ...order,
        paidAmount,
        remainingAmount,
        isOverdue,
        paymentProgress: Number(order.totalAmount) > 0 ? (paidAmount / Number(order.totalAmount)) * 100 : 0
      };
    });

    // Calculer les statistiques
    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalPaid = ordersWithPaymentInfo.reduce((sum, order) => sum + order.paidAmount, 0);
    const totalRemaining = ordersWithPaymentInfo.reduce((sum, order) => sum + order.remainingAmount, 0);
    const overdueCount = ordersWithPaymentInfo.filter(order => order.isOverdue).length;

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersWithPaymentInfo,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        summary: {
          totalOrders: orders.length,
          totalAmount,
          totalPaid,
          totalRemaining,
          overdueCount,
          paymentRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0
        }
      }
    });

  } catch (error) {
    console.error('Erreur API statut commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
