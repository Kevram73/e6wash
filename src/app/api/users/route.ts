import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          fullname: true,
          email: true,
          role: true,
          isActive: true,
          phoneNumber: true,
          address: true,
          createdAt: true,
          lastLoginAt: true,
          tenant: { select: { name: true } },
          agency: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: body.name,
        fullname: body.fullname,
        email: body.email,
        password: hashedPassword,
        role: body.role,
        tenantId: body.tenantId,
        agencyId: body.agencyId,
        phoneNumber: body.phoneNumber,
        address: body.address,
        isActive: body.isActive ?? true
      },
      select: {
        id: true,
        name: true,
        fullname: true,
        email: true,
        role: true,
        isActive: true,
        phoneNumber: true,
        address: true,
        createdAt: true,
        tenant: { select: { name: true } },
        agency: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur création users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}
