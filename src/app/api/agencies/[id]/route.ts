import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateAgencySchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  phone: z.string().min(8).optional(),
  email: z.string().email().optional(),
  countryId: z.string().optional(),
  city: z.string().min(2).optional(),
  isActive: z.boolean().optional(),
  isMainAgency: z.boolean().optional(),
  code: z.string().min(2).optional(),
  settings: z.record(z.any()).optional(),
  capacity: z.number().min(1).optional(),
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

    const agency = await prisma.agency.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        country: true,
        users: {
          include: {
            tenant: true,
          },
        },
        customers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            users: true,
            customers: true,
            orders: true,
            services: true,
          },
        },
      },
    });

    if (!agency) {
      return NextResponse.json(
        { error: 'Agence non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ agency });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'agence:', error);
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
    const validatedData = updateAgencySchema.parse(body);

    // Vérifier si l'agence existe
    const existingAgency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!existingAgency) {
      return NextResponse.json(
        { error: 'Agence non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le code est déjà utilisé par une autre agence
    if (validatedData.code && validatedData.code !== existingAgency.code) {
      const codeExists = await prisma.agency.findUnique({
        where: { code: validatedData.code },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Ce code d\'agence est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Vérifier si c'est la première agence du tenant (agence principale)
    if (validatedData.isMainAgency && !existingAgency.isMainAgency) {
      const existingMainAgency = await prisma.agency.findFirst({
        where: {
          tenantId: existingAgency.tenantId,
          isMainAgency: true,
          id: { not: params.id },
        },
      });

      if (existingMainAgency) {
        return NextResponse.json(
          { error: 'Ce tenant a déjà une agence principale' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'agence
    const agency = await prisma.agency.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        tenant: true,
        country: true,
      },
    });

    return NextResponse.json({
      message: 'Agence mise à jour avec succès',
      agency,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'agence:', error);
    
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

    // Vérifier si l'agence existe
    const existingAgency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!existingAgency) {
      return NextResponse.json(
        { error: 'Agence non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si c'est l'agence principale
    if (existingAgency.isMainAgency) {
      return NextResponse.json(
        { error: 'Impossible de supprimer l\'agence principale' },
        { status: 400 }
      );
    }

    // Vérifier s'il y a des utilisateurs associés
    const userCount = await prisma.user.count({
      where: { agencyId: params.id },
    });

    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une agence avec des utilisateurs associés' },
        { status: 400 }
      );
    }

    // Soft delete - marquer comme supprimé
    await prisma.agency.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Agence supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'agence:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
