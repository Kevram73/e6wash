import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              agencies: true,
              customers: true,
              orders: true,
              services: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tenant.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tenants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API tenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const tenant = await prisma.tenant.create({
      data: {
        name: body.name,
        subdomain: body.subdomain,
        domain: body.domain,
        logo: body.logo,
        settings: body.settings,
        status: body.status || 'ACTIVE'
      },
      include: {
        _count: {
          select: {
            users: true,
            agencies: true,
            customers: true,
            orders: true,
            services: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Tenant créé avec succès',
      data: tenant
    });
  } catch (error) {
    console.error('Erreur création tenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du tenant' },
      { status: 500 }
    );
  }
}
