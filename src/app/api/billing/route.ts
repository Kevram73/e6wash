import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        include: {
          order: { 
            include: {
              tenant: { select: { name: true } }
            }
          },
          agency: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        billing: payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API billing:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const payment = await prisma.payment.create({
      data: {
        orderId: body.orderId,
        agencyId: body.agencyId,
        userId: body.userId,
        amount: body.amount,
        method: body.method || 'CASH',
        status: body.status || 'PENDING',
        reference: body.reference,
        notes: body.notes
      },
      include: {
        order: { 
          include: {
            tenant: { select: { name: true } }
          }
        },
        agency: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Paiement créé avec succès',
      data: payment
    });
  } catch (error) {
    console.error('Erreur création billing:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
}
