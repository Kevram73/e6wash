import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [loyaltySettings, total] = await Promise.all([
      prisma.loyaltySettings.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.loyaltySettings.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        loyalty: loyaltySettings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API loyalty:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const loyaltySettings = await prisma.loyaltySettings.create({
      data: {
        tenantId: body.tenantId,
        isActive: body.isActive ?? true,
        pointsPerCurrency: body.pointsPerCurrency || 1.0,
        currencyPerPoint: body.currencyPerPoint || 100.0
      },
      include: {
        tenant: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Paramètres de fidélité créés avec succès',
      data: loyaltySettings
    });
  } catch (error) {
    console.error('Erreur création loyalty:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du programme de fidélité' },
      { status: 500 }
    );
  }
}
