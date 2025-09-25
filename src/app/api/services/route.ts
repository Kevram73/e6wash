import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        services,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API services:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        type: body.type,
        estimatedTime: body.estimatedTime,
        isActive: body.isActive,
        tenantId: 'default-tenant' // TODO: Get from auth context
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Service créé avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur création services:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    );
  }
}
