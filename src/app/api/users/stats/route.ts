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

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Statistiques générales
    const [totalUsers, activeUsers] = await Promise.all([
      prisma.user.count({
        where: { tenantId: currentUser.tenantId }
      }),
      prisma.user.count({
        where: { 
          tenantId: currentUser.tenantId,
          isActive: true
        }
      })
    ]);

    // Utilisateurs par rôle
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      where: { tenantId: currentUser.tenantId },
      _count: {
        role: true
      }
    });

    // Utilisateurs récents (derniers 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.findMany({
      where: {
        tenantId: currentUser.tenantId,
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      include: {
        agency: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Utilisateurs par agence
    const usersByAgency = await prisma.user.groupBy({
      by: ['agencyId'],
      where: { 
        tenantId: currentUser.tenantId,
        agencyId: { not: null }
      },
      _count: {
        agencyId: true
      }
    });

    // Récupérer les noms des agences
    const agencyIds = usersByAgency.map(item => item.agencyId).filter(Boolean);
    const agencies = await prisma.agency.findMany({
      where: {
        id: { in: agencyIds as string[] },
        tenantId: currentUser.tenantId
      },
      select: {
        id: true,
        name: true
      }
    });

    const usersByAgencyWithNames = usersByAgency.map(item => ({
      agencyId: item.agencyId,
      agencyName: agencies.find(a => a.id === item.agencyId)?.name || 'Agence inconnue',
      count: item._count.agencyId
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role
        })),
        usersByAgency: usersByAgencyWithNames,
        recentUsers
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
