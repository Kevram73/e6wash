import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [collectors, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'COLLECTOR',
          deletedAt: null
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullname: true,
          name: true,
          email: true,
          phoneNumber: true,
          phone: true,
          address: true,
          picture: true,
          avatar: true,
          status: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          tenantId: true,
          agencyId: true,
          tenant: {
            select: {
              id: true,
              name: true
            }
          },
          agency: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          role: 'COLLECTOR',
          deletedAt: null
        }
      })
    ]);

    // Transform the data to match the expected Collector interface
    const transformedCollectors = collectors.map(collector => ({
      id: collector.id,
      name: collector.fullname || collector.name || '',
      email: collector.email,
      phone: collector.phoneNumber || collector.phone || '',
      status: collector.isActive ? 'ACTIVE' : 'INACTIVE',
      availability: 'AVAILABLE', // Default value since not in User model
      currentLocation: collector.address || '',
      totalMissions: 0, // Default value
      completedMissions: 0, // Default value
      successRate: 0, // Default value
      averageRating: 0, // Default value
      totalEarnings: 0, // Default value
      lastMission: null, // Default value
      joinedAt: collector.createdAt,
      vehicle: {
        type: 'MOTORCYCLE', // Default value
        plate: 'N/A', // Default value
        model: 'N/A' // Default value
      },
      workingHours: '08:00-17:00', // Default value
      notes: '',
      lastLoginAt: collector.lastLoginAt,
      createdAt: collector.createdAt,
      updatedAt: collector.updatedAt,
      tenantId: collector.tenantId,
      agencyId: collector.agencyId,
      tenant: collector.tenant,
      agency: collector.agency
    }));

    return NextResponse.json({
      success: true,
      data: {
        collectors: transformedCollectors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API collectors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des collecteurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const collector = await prisma.user.create({
      data: {
        fullname: body.name,
        name: body.name,
        email: body.email,
        password: 'defaultPassword123', // You should hash this properly
        role: 'COLLECTOR',
        phoneNumber: body.phone,
        phone: body.phone,
        address: body.currentLocation,
        status: body.status === 'ACTIVE',
        isActive: body.status === 'ACTIVE',
        tenantId: body.tenantId,
        agencyId: body.agencyId
      },
      select: {
        id: true,
        fullname: true,
        name: true,
        email: true,
        phoneNumber: true,
        phone: true,
        address: true,
        status: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        tenantId: true,
        agencyId: true
      }
    });

    // Transform the response to match the expected interface
    const transformedCollector = {
      id: collector.id,
      name: collector.fullname || collector.name || '',
      email: collector.email,
      phone: collector.phoneNumber || collector.phone || '',
      status: collector.isActive ? 'ACTIVE' : 'INACTIVE',
      availability: 'AVAILABLE',
      currentLocation: collector.address || '',
      totalMissions: 0,
      completedMissions: 0,
      successRate: 0,
      averageRating: 0,
      totalEarnings: 0,
      lastMission: null,
      joinedAt: collector.createdAt,
      vehicle: {
        type: 'MOTORCYCLE',
        plate: 'N/A',
        model: 'N/A'
      },
      workingHours: '08:00-17:00',
      notes: '',
      createdAt: collector.createdAt,
      updatedAt: collector.updatedAt,
      tenantId: collector.tenantId,
      agencyId: collector.agencyId
    };

    return NextResponse.json({
      success: true,
      message: 'Collecteur créé avec succès',
      data: transformedCollector
    });
  } catch (error) {
    console.error('Erreur création collecteur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du collecteur' },
      { status: 500 }
    );
  }
}
