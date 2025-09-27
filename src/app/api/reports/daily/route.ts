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

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

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

    // Récupérer les données du jour
    const [
      orders,
      payments,
      newCustomers,
      collectionRequests
    ] = await Promise.all([
      // Commandes du jour
      prisma.order.findMany({
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
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Paiements du jour
      prisma.payment.findMany({
        where: {
          ...filters,
          status: { in: ['PAID', 'PARTIAL'] }
        },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  fullname: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Nouveaux clients du jour
      prisma.customer.findMany({
        where: {
          tenantId: currentUser.tenantId,
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          isActive: true
        },
        include: {
          agency: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Demandes de collecte du jour
      prisma.collectionRequest.findMany({
        where: {
          tenantId: currentUser.tenantId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          customer: {
            select: {
              fullname: true,
              phone: true
            }
          },
          collector: {
            select: {
              fullname: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Calculer les statistiques des ventes
    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = orders.length;
    const paidOrders = orders.filter(order => order.paymentStatus === 'PAID').length;
    const pendingOrders = orders.filter(order => order.paymentStatus === 'PENDING').length;

    // Calculer les recettes
    const totalReceipts = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const receiptsByMethod = payments.reduce((acc, payment) => {
      const method = payment.method;
      if (!acc[method]) {
        acc[method] = {
          method,
          amount: 0,
          count: 0
        };
      }
      acc[method].amount += Number(payment.amount);
      acc[method].count += 1;
      return acc;
    }, {} as any);

    // Ventes par agence
    const salesByAgency = orders.reduce((acc, order) => {
      const agencyName = order.agency?.name || 'Agence inconnue';
      if (!acc[agencyName]) {
        acc[agencyName] = {
          agencyName,
          totalSales: 0,
          orderCount: 0,
          receipts: 0
        };
      }
      acc[agencyName].totalSales += Number(order.totalAmount);
      acc[agencyName].orderCount += 1;
      
      // Calculer les recettes pour cette agence
      const agencyPayments = payments.filter(p => p.order.agency?.name === agencyName);
      acc[agencyName].receipts = agencyPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      
      return acc;
    }, {} as any);

    // Ventes par service
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

    // Statistiques des collectes
    const totalCollections = collectionRequests.length;
    const assignedCollections = collectionRequests.filter(req => req.status === 'ASSIGNED').length;
    const completedCollections = collectionRequests.filter(req => req.status === 'COLLECTED').length;

    // Retraits du jour (paiements sortants - à implémenter selon vos besoins)
    const withdrawals = 0; // Placeholder pour les retraits

    return NextResponse.json({
      success: true,
      data: {
        date,
        summary: {
          // Ventes
          totalSales,
          totalOrders,
          paidOrders,
          pendingOrders,
          averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
          
          // Recettes
          totalReceipts,
          receiptsByMethod: Object.values(receiptsByMethod),
          
          // Clients
          newCustomers: newCustomers.length,
          
          // Collectes
          totalCollections,
          assignedCollections,
          completedCollections,
          
          // Retraits
          withdrawals
        },
        salesByAgency: Object.values(salesByAgency),
        salesByService: Object.values(salesByService),
        orders,
        payments,
        newCustomers,
        collectionRequests
      }
    });

  } catch (error) {
    console.error('Erreur API rapport journalier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du rapport journalier' },
      { status: 500 }
    );
  }
}
