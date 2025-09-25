import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [promotions, total] = await Promise.all([
      prisma.promo.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.promo.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        promotions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API promotions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const promotion = await prisma.promo.create({
      data: {
        tenantId: body.tenantId,
        name: body.name,
        description: body.description,
        type: body.type,
        value: body.value,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive ?? true
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Promotion créée avec succès',
      data: promotion
    });
  } catch (error) {
    console.error('Erreur création promotions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la promotion' },
      { status: 500 }
    );
  }
}
