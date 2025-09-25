import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take: limit,
        include: {
          tenant: { select: { name: true } },
          agency: { select: { name: true } },
          country: { select: { name: true } },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API customers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const customer = await prisma.customer.create({
      data: {
        tenantId: body.tenantId,
        agencyId: body.agencyId,
        fullname: body.fullname,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        countryId: body.countryId,
        isActive: body.isActive ?? true,
        notes: body.notes
      },
      include: {
        tenant: { select: { name: true } },
        agency: { select: { name: true } },
        country: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Client créé avec succès',
      data: customer
    });
  } catch (error) {
    console.error('Erreur création customers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
}
