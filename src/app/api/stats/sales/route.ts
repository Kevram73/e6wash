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
    const period = searchParams.get('period') || 'today'; // today, week, month, year
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

    // Calculer les dates selon la période
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Construire les filtres
    const filters: any = {
      tenantId: currentUser.tenantId,
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      deletedAt: null
    };

    // Si l'utilisateur n'est pas admin/owner, filtrer par agence
    if (!['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(currentUser.role)) {
      filters.agencyId = currentUser.agencyId;
    } else if (agencyId) {
      filters.agencyId = agencyId;
    }

    // Récupérer les commandes
    const orders = await prisma.order.findMany({
      where: filters,
      include: {
        customer: {
          select: {
            fullname: true,
            phone: true
          }
        },
        agency: {
          select: {
            name: true
          }
        },
        items: {
          include: {
            service: {
              select: {
                name: true,
                category: true,
                type: true
              }
            }
          }
        },
        payments: {
          select: {
            amount: true,
            method: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques de vente
    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = orders.length;
    const paidOrders = orders.filter(order => order.paymentStatus === 'PAID').length;
    const pendingOrders = orders.filter(order => order.paymentStatus === 'PENDING').length;

    // Ventes par agence
    const salesByAgency = orders.reduce((acc, order) => {
      const agencyName = order.agency?.name || 'Agence inconnue';
      if (!acc[agencyName]) {
        acc[agencyName] = {
          agencyName,
          totalSales: 0,
          orderCount: 0,
          paidOrders: 0
        };
      }
      acc[agencyName].totalSales += Number(order.totalAmount);
      acc[agencyName].orderCount += 1;
      if (order.paymentStatus === 'PAID') {
        acc[agencyName].paidOrders += 1;
      }
      return acc;
    }, {} as any);

    // Ventes par service/catégorie
    const salesByService = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const serviceName = item.service?.name || 'Service inconnu';
        const category = item.service?.category || 'Autre';
        
        if (!acc[serviceName]) {
          acc[serviceName] = {
            serviceName,
            category,
            totalSales: 0,
            orderCount: 0,
            quantity: 0
          };
        }
        acc[serviceName].totalSales += Number(item.totalPrice);
        acc[serviceName].orderCount += 1;
        acc[serviceName].quantity += item.quantity;
      });
      return acc;
    }, {} as any);

    // Ventes par jour (pour les graphiques)
    const salesByDay = orders.reduce((acc, order) => {
      const day = order.createdAt.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = {
          date: day,
          totalSales: 0,
          orderCount: 0
        };
      }
      acc[day].totalSales += Number(order.totalAmount);
      acc[day].orderCount += 1;
      return acc;
    }, {} as any);

    // Top clients
    const salesByCustomer = orders.reduce((acc, order) => {
      const customerName = order.customer?.fullname || 'Client inconnu';
      if (!acc[customerName]) {
        acc[customerName] = {
          customerName,
          customerPhone: order.customer?.phone,
          totalSales: 0,
          orderCount: 0
        };
      }
      acc[customerName].totalSales += Number(order.totalAmount);
      acc[customerName].orderCount += 1;
      return acc;
    }, {} as any);

    // Trier les top clients
    const topCustomers = Object.values(salesByCustomer)
      .sort((a: any, b: any) => b.totalSales - a.totalSales)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        period,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        summary: {
          totalSales,
          totalOrders,
          paidOrders,
          pendingOrders,
          averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
          paymentRate: totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0
        },
        salesByAgency: Object.values(salesByAgency),
        salesByService: Object.values(salesByService),
        salesByDay: Object.values(salesByDay),
        topCustomers
      }
    });

  } catch (error) {
    console.error('Erreur API statistiques ventes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
