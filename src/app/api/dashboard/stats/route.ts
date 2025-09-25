import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/dashboard/stats - Récupérer les statistiques du dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'ADMIN';

    let stats: any = {};

    switch (role) {
      case 'SUPER_ADMIN':
        // Statistiques globales pour le super admin
        const [
          totalPressings,
          totalRevenue,
          activeSubscriptions,
          newPressingsThisMonth
        ] = await Promise.all([
          prisma.tenant.count(),
          prisma.order.aggregate({
            _sum: { totalAmount: true }
          }),
          prisma.subscription.count({
            where: { isActive: true }
          }),
          prisma.tenant.count({
            where: {
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          })
        ]);

        stats = {
          totalPressings,
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          activeSubscriptions,
          newPressingsThisMonth,
        };
        break;

      case 'ADMIN':
      case 'OWNER':
      case 'MANAGER':
        // Statistiques pour un pressing spécifique
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const [
          totalOrders,
          totalRevenuePressing,
          activeAgences,
          pendingOrders,
          completedOrdersToday,
          revenueToday
        ] = await Promise.all([
          prisma.order.count(),
          prisma.order.aggregate({
            _sum: { totalAmount: true }
          }),
          prisma.agency.count({
            where: { isActive: true }
          }),
          prisma.order.count({
            where: { status: 'NEW' }
          }),
          prisma.order.count({
            where: {
              status: 'COMPLETED',
              updatedAt: {
                gte: startOfDay,
                lt: endOfDay
              }
            }
          }),
          prisma.order.aggregate({
            where: {
              status: 'COMPLETED',
              updatedAt: {
                gte: startOfDay,
                lt: endOfDay
              }
            },
            _sum: { totalAmount: true }
          })
        ]);

        stats = {
          totalOrders,
          totalRevenue: totalRevenuePressing._sum.totalAmount || 0,
          activeAgences,
          pendingOrders,
          completedOrdersToday,
          revenueToday: revenueToday._sum.totalAmount || 0,
        };
        break;

      default:
        // Statistiques par défaut
        const defaultToday = new Date();
        const defaultStartOfDay = new Date(defaultToday.getFullYear(), defaultToday.getMonth(), defaultToday.getDate());
        const defaultEndOfDay = new Date(defaultToday.getFullYear(), defaultToday.getMonth(), defaultToday.getDate() + 1);

        const [
          defaultTotalOrders,
          defaultTotalRevenue,
          defaultActiveAgences,
          defaultPendingOrders,
          defaultCompletedOrdersToday,
          defaultRevenueToday
        ] = await Promise.all([
          prisma.order.count(),
          prisma.order.aggregate({
            _sum: { totalAmount: true }
          }),
          prisma.agency.count({
            where: { isActive: true }
          }),
          prisma.order.count({
            where: { status: 'NEW' }
          }),
          prisma.order.count({
            where: {
              status: 'COMPLETED',
              updatedAt: {
                gte: defaultStartOfDay,
                lt: defaultEndOfDay
              }
            }
          }),
          prisma.order.aggregate({
            where: {
              status: 'COMPLETED',
              updatedAt: {
                gte: defaultStartOfDay,
                lt: defaultEndOfDay
              }
            },
            _sum: { totalAmount: true }
          })
        ]);

        stats = {
          totalOrders: defaultTotalOrders,
          totalRevenue: defaultTotalRevenue._sum.totalAmount || 0,
          activeAgences: defaultActiveAgences,
          pendingOrders: defaultPendingOrders,
          completedOrdersToday: defaultCompletedOrdersToday,
          revenueToday: defaultRevenueToday._sum.totalAmount || 0,
        };
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}