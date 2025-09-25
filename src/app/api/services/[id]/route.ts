import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.enum(['DETAIL', 'KILO', 'PACKAGE']).optional(),
  price: z.number().min(0).optional(),
  description: z.string().optional(),
  estimatedTime: z.string().optional(),
  isActive: z.boolean().optional(),
  category: z.enum(['WASHING', 'DRY_CLEANING', 'IRONING', 'REPAIR', 'OTHER']).optional(),
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

    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        agency: true,
        orderItems: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            order: {
              include: {
                customer: true,
              },
            },
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
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
    const validatedData = updateServiceSchema.parse(body);

    // Vérifier si le service existe
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le nom est déjà utilisé par un autre service
    if (validatedData.name && validatedData.name !== existingService.name) {
      const nameExists = await prisma.service.findFirst({
        where: {
          name: validatedData.name,
          tenantId: existingService.tenantId,
          agencyId: existingService.agencyId,
          id: { not: params.id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Ce nom de service est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le service
    const service = await prisma.service.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        tenant: true,
        agency: true,
      },
    });

    return NextResponse.json({
      message: 'Service mis à jour avec succès',
      service,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    
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

    // Vérifier si le service existe
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des commandes associées
    const orderItemCount = await prisma.orderItem.count({
      where: { serviceId: params.id },
    });

    if (orderItemCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un service avec des commandes associées' },
        { status: 400 }
      );
    }

    // Soft delete - marquer comme supprimé
    await prisma.service.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Service supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
