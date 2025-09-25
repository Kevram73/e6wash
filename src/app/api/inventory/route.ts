import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [inventoryItems, total] = await Promise.all([
      prisma.inventory.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          agency: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.inventory.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        inventory: inventoryItems,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API inventory:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const inventoryItem = await prisma.inventory.create({
      data: {
        tenantId: body.tenantId,
        agencyId: body.agencyId,
        name: body.name,
        category: body.category,
        currentStock: body.currentStock || 0,
        minStock: body.minStock || 0,
        unit: body.unit,
        unitPrice: body.unitPrice,
        supplier: body.supplier
      },
      include: {
        tenant: { select: { name: true } },
        agency: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Article d\'inventaire créé avec succès',
      data: inventoryItem
    });
  } catch (error) {
    console.error('Erreur création inventory:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article d\'inventaire' },
      { status: 500 }
    );
  }
}
