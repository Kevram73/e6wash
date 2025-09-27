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
    const customerId = searchParams.get('customerId');
    const customerPhone = searchParams.get('phone');
    const customerName = searchParams.get('name');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // Construire les filtres pour trouver le client
    const customerFilters: any = {
      tenantId: currentUser.tenantId,
      isActive: true
    };

    if (customerId) {
      customerFilters.id = customerId;
    } else if (customerPhone) {
      customerFilters.phone = { contains: customerPhone };
    } else if (customerName) {
      customerFilters.fullname = { contains: customerName, mode: 'insensitive' };
    } else {
      return NextResponse.json(
        { error: 'ID client, téléphone ou nom requis' },
        { status: 400 }
      );
    }

    // Si l'utilisateur n'est pas admin/owner, filtrer par agence
    if (!['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(currentUser.role)) {
      customerFilters.agencyId = currentUser.agencyId;
    }

    // Trouver le(s) client(s)
    const customers = await prisma.customer.findMany({
      where: customerFilters,
      include: {
        agency: {
          select: {
            name: true
          }
        }
      }
    });

    if (customers.length === 0) {
      return NextResponse.json(
        { error: 'Aucun client trouvé' },
        { status: 404 }
      );
    }

    // Construire les filtres pour les commandes
    const orderFilters: any = {
      customerId: { in: customers.map(c => c.id) },
      deletedAt: null
    };

    if (startDate && endDate) {
      orderFilters.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Récupérer les commandes du client
    const orders = await prisma.order.findMany({
      where: orderFilters,
      include: {
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
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Récupérer les demandes de collecte du client
    const collectionRequests = await prisma.collectionRequest.findMany({
      where: {
        customerId: { in: customers.map(c => c.id) },
        ...(startDate && endDate ? {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        } : {})
      },
      include: {
        collector: {
          select: {
            fullname: true,
            phone: true
          }
        },
        itemsDetails: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques pour chaque client
    const customersWithActivity = customers.map(customer => {
      const customerOrders = orders.filter(order => order.customerId === customer.id);
      const customerCollections = collectionRequests.filter(req => req.customerId === customer.id);

      const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const totalPaid = customerOrders.reduce((sum, order) => {
        const orderPaid = order.payments.reduce((paymentSum, payment) => 
          payment.status === 'PAID' ? paymentSum + Number(payment.amount) : paymentSum, 0
        );
        return sum + orderPaid;
      }, 0);

      const orderCount = customerOrders.length;
      const collectionCount = customerCollections.length;
      const lastOrder = customerOrders[0]?.createdAt || null;
      const lastCollection = customerCollections[0]?.createdAt || null;

      return {
        ...customer,
        activity: {
          totalSpent,
          totalPaid,
          remainingAmount: totalSpent - totalPaid,
          orderCount,
          collectionCount,
          lastOrder,
          lastCollection,
          averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
          paymentRate: totalSpent > 0 ? (totalPaid / totalSpent) * 100 : 0
        },
        orders: customerOrders,
        collections: customerCollections
      };
    });

    // Statistiques globales
    const totalCustomers = customersWithActivity.length;
    const totalRevenue = customersWithActivity.reduce((sum, customer) => sum + customer.activity.totalSpent, 0);
    const totalPaid = customersWithActivity.reduce((sum, customer) => sum + customer.activity.totalPaid, 0);
    const totalOrders = customersWithActivity.reduce((sum, customer) => sum + customer.activity.orderCount, 0);
    const totalCollections = customersWithActivity.reduce((sum, customer) => sum + customer.activity.collectionCount, 0);

    return NextResponse.json({
      success: true,
      data: {
        customers: customersWithActivity,
        summary: {
          totalCustomers,
          totalRevenue,
          totalPaid,
          totalOrders,
          totalCollections,
          averageCustomerValue: totalCustomers > 0 ? totalRevenue / totalCustomers : 0,
          paymentRate: totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0
        },
        searchCriteria: {
          customerId,
          customerPhone,
          customerName,
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    console.error('Erreur API recherche activité client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche de l\'activité client' },
      { status: 500 }
    );
  }
}
