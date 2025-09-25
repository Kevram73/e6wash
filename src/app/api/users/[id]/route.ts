import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullname: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['ADMIN', 'OWNER', 'EMPLOYEE', 'CAISSIER', 'MANAGER', 'COLLECTOR', 'CLIENT']).optional(),
  tenantId: z.string().optional(),
  agencyId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
  status: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        agency: true,
        agencies: {
          include: {
            agency: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        tenant: true,
        agency: true,
      },
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Utilisateur mis à jour avec succès',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Soft delete - marquer comme supprimé
    await prisma.user.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Utilisateur supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
