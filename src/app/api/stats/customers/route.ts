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
    const agencyId = searchParams.get('agencyId');
    const sortBy = searchParams.get('sortBy') || 'totalSpent'; // totalSpent, orderCount, lastOrder
    const limit = parseInt(searchParams.get('limit') || '50');

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
      isActive: true
    };

    // Si l'utilisateur n'est pas admin/owner, filtrer par agence
    if (!['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(currentUser.role)) {
      filters.agencyId = currentUser.agencyId;
    } else if (agencyId) {
      filters.agencyId = agencyId;
    }

    // Récupérer les clients avec leurs commandes
    const customers = await prisma.customer.findMany({
      where: filters,
      include: {
        orders: {
          where: {
            deletedAt: null
          },
          include: {
            payments: {
              select: {
                amount: true,
                status: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        agency: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques pour chaque client
    const customersWithStats = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const totalPaid = customer.orders.reduce((sum, order) => {
        const orderPaid = order.payments.reduce((paymentSum, payment) => 
          payment.status === 'PAID' ? paymentSum + Number(payment.amount) : paymentSum, 0
        );
        return sum + orderPaid;
      }, 0);
      
      const orderCount = customer.orders.length;
      const lastOrder = customer.orders[0]?.createdAt || null;
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
      const paymentRate = totalSpent > 0 ? (totalPaid / totalSpent) * 100 : 0;
      
      // Calculer le nombre de jours depuis la dernière commande
      const daysSinceLastOrder = lastOrder ? 
        Math.floor((Date.now() - new Date(lastOrder).getTime()) / (1000 * 60 * 60 * 24)) : null;

      return {
        ...customer,
        stats: {
          totalSpent,
          totalPaid,
          remainingAmount: totalSpent - totalPaid,
          orderCount,
          lastOrder,
          daysSinceLastOrder,
          averageOrderValue,
          paymentRate
        }
      };
    });

    // Trier selon le critère choisi
    let sortedCustomers = customersWithStats;
    switch (sortBy) {
      case 'totalSpent':
        sortedCustomers = customersWithStats.sort((a, b) => b.stats.totalSpent - a.stats.totalSpent);
        break;
      case 'orderCount':
        sortedCustomers = customersWithStats.sort((a, b) => b.stats.orderCount - a.stats.orderCount);
        break;
      case 'lastOrder':
        sortedCustomers = customersWithStats.sort((a, b) => {
          if (!a.stats.lastOrder && !b.stats.lastOrder) return 0;
          if (!a.stats.lastOrder) return 1;
          if (!b.stats.lastOrder) return -1;
          return new Date(b.stats.lastOrder).getTime() - new Date(a.stats.lastOrder).getTime();
        });
        break;
      case 'paymentRate':
        sortedCustomers = customersWithStats.sort((a, b) => b.stats.paymentRate - a.stats.paymentRate);
        break;
    }

    // Limiter les résultats
    const limitedCustomers = sortedCustomers.slice(0, limit);

    // Calculer les statistiques globales
    const totalCustomers = customers.length;
    const totalRevenue = customersWithStats.reduce((sum, customer) => sum + customer.stats.totalSpent, 0);
    const totalPaid = customersWithStats.reduce((sum, customer) => sum + customer.stats.totalPaid, 0);
    const totalOrders = customersWithStats.reduce((sum, customer) => sum + customer.stats.orderCount, 0);
    const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Clients par agence
    const customersByAgency = customersWithStats.reduce((acc, customer) => {
      const agencyName = customer.agency?.name || 'Agence inconnue';
      if (!acc[agencyName]) {
        acc[agencyName] = {
          agencyName,
          customerCount: 0,
          totalRevenue: 0,
          totalOrders: 0
        };
      }
      acc[agencyName].customerCount += 1;
      acc[agencyName].totalRevenue += customer.stats.totalSpent;
      acc[agencyName].totalOrders += customer.stats.orderCount;
      return acc;
    }, {} as any);

    // Clients actifs vs inactifs (basé sur la dernière commande)
    const activeCustomers = customersWithStats.filter(customer => 
      customer.stats.daysSinceLastOrder !== null && customer.stats.daysSinceLastOrder <= 30
    ).length;
    const inactiveCustomers = totalCustomers - activeCustomers;

    return NextResponse.json({
      success: true,
      data: {
        customers: limitedCustomers,
        summary: {
          totalCustomers,
          activeCustomers,
          inactiveCustomers,
          totalRevenue,
          totalPaid,
          totalOrders,
          averageCustomerValue,
          averageOrderValue,
          paymentRate: totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0
        },
        customersByAgency: Object.values(customersByAgency),
        sortBy,
        limit
      }
    });

  } catch (error) {
    console.error('Erreur API statistiques clients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques clients' },
      { status: 500 }
    );
  }
}
