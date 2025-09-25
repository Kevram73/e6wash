import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
      prisma.order.count()
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
    const body = await request.json();
    
    const order = await prisma.order.create({
      data: {
        tenantId: body.tenantId,
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
        createdById: body.createdById,
        updatedById: body.updatedById
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
