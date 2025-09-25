import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateInventorySchema = z.object({
  name: z.string().min(2).optional(),
  category: z.enum(['DETERGENT', 'SOFTENER', 'BLEACH', 'STARCH', 'EQUIPMENT', 'SUPPLIES', 'OTHER']).optional(),
  currentStock: z.number().min(0).optional(),
  minStock: z.number().min(0).optional(),
  unit: z.string().min(1).optional(),
  unitPrice: z.number().min(0).optional(),
  supplier: z.string().optional(),
  isLowStock: z.boolean().optional(),
  notes: z.string().optional(),
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

    const item = await prisma.inventory.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                fullname: true,
              },
            },
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Article d\'inventaire non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article d\'inventaire:', error);
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
    const validatedData = updateInventorySchema.parse(body);

    // Vérifier si l'article existe
    const existingItem = await prisma.inventory.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Article d\'inventaire non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le nom est déjà utilisé par un autre article
    if (validatedData.name && validatedData.name !== existingItem.name) {
      const nameExists = await prisma.inventory.findFirst({
        where: {
          name: validatedData.name,
          tenantId: existingItem.tenantId,
          id: { not: params.id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Ce nom d\'article est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'article
    const item = await prisma.inventory.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        tenant: true,
      },
    });

    return NextResponse.json({
      message: 'Article d\'inventaire mis à jour avec succès',
      item,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article d\'inventaire:', error);
    
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

    // Vérifier si l'article existe
    const existingItem = await prisma.inventory.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Article d\'inventaire non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des transactions associées
    const transactionCount = await prisma.inventoryTransaction.count({
      where: { inventoryId: params.id },
    });

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un article avec des transactions associées' },
        { status: 400 }
      );
    }

    // Supprimer l'article
    await prisma.inventory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Article d\'inventaire supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article d\'inventaire:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
