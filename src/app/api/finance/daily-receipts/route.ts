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
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const agencyId = searchParams.get('agencyId');

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
      createdAt: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lt: new Date(`${date}T23:59:59.999Z`)
      }
    };

    // Si l'utilisateur n'est pas admin/owner, filtrer par agence
    if (!['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(currentUser.role)) {
      filters.agencyId = currentUser.agencyId;
    } else if (agencyId) {
      filters.agencyId = agencyId;
    }

    // Récupérer les paiements du jour
    const payments = await prisma.payment.findMany({
      where: {
        ...filters,
        status: { in: ['PAID', 'PARTIAL'] }
      },
      include: {
        order: {
          include: {
            customer: {
              select: {
                fullname: true,
                phone: true
              }
            }
          }
        },
        agency: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques
    const totalReceipts = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const totalOrders = payments.length;
    const paidOrders = payments.filter(p => p.status === 'PAID').length;
    const partialOrders = payments.filter(p => p.status === 'PARTIAL').length;

    // Grouper par agence
    const receiptsByAgency = payments.reduce((acc, payment) => {
      const agencyName = payment.agency?.name || 'Agence inconnue';
      if (!acc[agencyName]) {
        acc[agencyName] = {
          agencyName,
          totalAmount: 0,
          orderCount: 0,
          payments: []
        };
      }
      acc[agencyName].totalAmount += Number(payment.amount);
      acc[agencyName].orderCount += 1;
      acc[agencyName].payments.push(payment);
      return acc;
    }, {} as any);

    // Grouper par méthode de paiement
    const receiptsByMethod = payments.reduce((acc, payment) => {
      const method = payment.method;
      if (!acc[method]) {
        acc[method] = {
          method,
          totalAmount: 0,
          count: 0
        };
      }
      acc[method].totalAmount += Number(payment.amount);
      acc[method].count += 1;
      return acc;
    }, {} as any);

    return NextResponse.json({
      success: true,
      data: {
        date,
        summary: {
          totalReceipts,
          totalOrders,
          paidOrders,
          partialOrders,
          averageOrderValue: totalOrders > 0 ? totalReceipts / totalOrders : 0
        },
        receiptsByAgency: Object.values(receiptsByAgency),
        receiptsByMethod: Object.values(receiptsByMethod),
        payments
      }
    });

  } catch (error) {
    console.error('Erreur API recettes journalières:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des recettes' },
      { status: 500 }
    );
  }
}
