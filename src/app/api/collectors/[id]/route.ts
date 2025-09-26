import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collector = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: 'COLLECTOR',
        deletedAt: null
      },
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
    });

    if (!collector) {
      return NextResponse.json(
        { error: 'Collecteur non trouvé' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected Collector interface
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
      lastLoginAt: collector.lastLoginAt,
      createdAt: collector.createdAt,
      updatedAt: collector.updatedAt,
      tenantId: collector.tenantId,
      agencyId: collector.agencyId,
      tenant: collector.tenant,
      agency: collector.agency
    };

    return NextResponse.json({
      success: true,
      data: transformedCollector
    });
  } catch (error) {
    console.error('Erreur API collector:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du collecteur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const collector = await prisma.user.update({
      where: {
        id: params.id,
        role: 'COLLECTOR'
      },
      data: {
        fullname: body.name,
        name: body.name,
        email: body.email,
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
      message: 'Collecteur modifié avec succès',
      data: transformedCollector
    });
  } catch (error) {
    console.error('Erreur modification collecteur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du collecteur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete by setting deletedAt
    await prisma.user.update({
      where: {
        id: params.id,
        role: 'COLLECTOR'
      },
      data: {
        deletedAt: new Date(),
        isActive: false,
        status: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Collecteur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression collecteur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du collecteur' },
      { status: 500 }
    );
  }
}
