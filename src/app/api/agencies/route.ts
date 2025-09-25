import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [agencies, total] = await Promise.all([
      prisma.agency.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          country: { select: { name: true } },
          _count: {
            select: {
              users: true,
              customers: true,
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.agency.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        agencies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API agencies:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const agency = await prisma.agency.create({
      data: {
        tenantId: body.tenantId,
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        countryId: body.countryId,
        city: body.city,
        isActive: body.isActive ?? true,
        code: body.code,
        capacity: body.capacity,
        isMainAgency: body.isMainAgency ?? false,
        settings: body.settings
      },
      include: {
        tenant: { select: { name: true } },
        country: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Agence créée avec succès',
      data: agency
    });
  } catch (error) {
    console.error('Erreur création agencies:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'agence' },
      { status: 500 }
    );
  }
}
