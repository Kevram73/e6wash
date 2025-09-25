import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supplier.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        suppliers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API suppliers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supplier = await prisma.supplier.create({
      data: {
        tenantId: body.tenantId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        contact: body.contact,
        isActive: body.isActive ?? true,
      },
      include: {
        tenant: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Fournisseur créé avec succès',
      data: supplier
    });
  } catch (error) {
    console.error('Erreur création suppliers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du fournisseur' },
      { status: 500 }
    );
  }
}
