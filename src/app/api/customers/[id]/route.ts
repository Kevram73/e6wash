import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateCustomerSchema = z.object({
  fullname: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  address: z.string().min(5).optional(),
  countryId: z.string().optional(),
  city: z.string().min(2).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
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

    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        tenant: true,
        agency: true,
        country: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            orderItems: true,
            payments: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
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
    const validatedData = updateCustomerSchema.parse(body);

    // Vérifier si le client existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre client
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findFirst({
        where: {
          email: validatedData.email,
          tenantId: existingCustomer.tenantId,
          id: { not: params.id },
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre client' },
          { status: 400 }
        );
      }
    }

    // Vérifier si le téléphone est déjà utilisé par un autre client
    if (validatedData.phone && validatedData.phone !== existingCustomer.phone) {
      const phoneExists = await prisma.customer.findFirst({
        where: {
          phone: validatedData.phone,
          tenantId: existingCustomer.tenantId,
          id: { not: params.id },
        },
      });

      if (phoneExists) {
        return NextResponse.json(
          { error: 'Ce téléphone est déjà utilisé par un autre client' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le client
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
      },
      include: {
        tenant: true,
        agency: true,
        country: true,
      },
    });

    return NextResponse.json({
      message: 'Client mis à jour avec succès',
      customer,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    
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

    // Vérifier si le client existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des commandes associées
    const orderCount = await prisma.order.count({
      where: { customerId: params.id },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un client avec des commandes associées' },
        { status: 400 }
      );
    }

    // Soft delete - marquer comme supprimé
    await prisma.customer.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Client supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
