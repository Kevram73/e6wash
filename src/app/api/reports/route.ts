import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Construire les filtres
    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Statistiques des revenus par mois (6 derniers mois)
    const revenueData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        SUM(totalAmount) as revenue
      FROM orders 
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      ${tenantId ? `AND tenantId = '${tenantId}'` : ''}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month
    `;

    // Statistiques des services
    const serviceStats = await prisma.orderItem.groupBy({
      by: ['serviceId'],
      where: {
        order: whereClause
      },
      _count: {
        id: true
      },
      _sum: {
        totalPrice: true
      },
      include: {
        service: {
          select: {
            name: true
          }
        }
      }
    });

    // Statistiques générales
    const [totalOrders, totalRevenue, totalCustomers, totalServices] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.aggregate({
        where: whereClause,
        _sum: { totalAmount: true }
      }),
      prisma.customer.count({ where: tenantId ? { tenantId } : {} }),
      prisma.service.count({ where: tenantId ? { tenantId } : {} })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        revenueData,
        serviceStats: serviceStats.map(stat => ({
          service: stat.service?.name || 'Service inconnu',
          orders: stat._count.id,
          revenue: stat._sum.totalPrice || 0
        })),
        summary: {
          totalOrders,
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          totalCustomers,
          totalServices
        }
      }
    });
  } catch (error) {
    console.error('Erreur API reports:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Créer un rapport personnalisé
    const report = await prisma.report.create({
      data: {
        tenantId: body.tenantId,
        name: body.name,
        type: body.type,
        parameters: body.parameters,
        generatedBy: body.generatedBy
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Rapport créé avec succès',
      data: report
    });
  } catch (error) {
    console.error('Erreur création reports:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rapport' },
      { status: 500 }
    );
  }
}
