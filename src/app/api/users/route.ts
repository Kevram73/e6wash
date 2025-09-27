import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const agencyId = searchParams.get('agencyId') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur actuel pour vérifier les permissions
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Construire les filtres
    const where: any = {
      tenantId: currentUser.tenantId
    };

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (agencyId) {
      where.agencyId = agencyId;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Récupérer les utilisateurs
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          agency: {
            select: {
              id: true,
              name: true
            }
          },
          createdBy: {
            select: {
              id: true,
              fullname: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        users,
        total,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { fullname, email, phone, password, roleId, agencyId, isActive = true } = body;

    // Validation
    if (!fullname || !email || !password || !roleId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        tenantId: currentUser.tenantId
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Vérifier que l'agence appartient au tenant
    if (agencyId) {
      const agency = await prisma.agency.findFirst({
        where: {
          id: agencyId,
          tenantId: currentUser.tenantId
        }
      });

      if (!agency) {
        return NextResponse.json(
          { error: 'Agence non trouvée' },
          { status: 400 }
        );
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        phone,
        password: hashedPassword,
        role: roleId,
        agencyId: agencyId || null,
        isActive,
        tenantId: currentUser.tenantId,
        createdById: currentUser.id
      },
      include: {
        agency: {
          select: {
            id: true,
            name: true
          }
        },
        createdBy: {
          select: {
            id: true,
            fullname: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}