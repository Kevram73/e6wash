import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  subdomain: z.string().min(2).optional(),
  domain: z.string().optional(),
  logo: z.string().optional(),
  settings: z.record(z.any()).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']).optional(),
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

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: {
            agency: true,
          },
        },
        agencies: true,
        customers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        subscriptions: {
          include: {
            subscription: true,
          },
        },
        _count: {
          select: {
            users: true,
            agencies: true,
            customers: true,
            orders: true,
            services: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error('Erreur lors de la récupération du tenant:', error);
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
    const validatedData = updateTenantSchema.parse(body);

    // Vérifier si le tenant existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: params.id },
    });

    if (!existingTenant) {
      return NextResponse.json(
        { error: 'Tenant non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le subdomain est déjà utilisé par un autre tenant
    if (validatedData.subdomain && validatedData.subdomain !== existingTenant.subdomain) {
      const subdomainExists = await prisma.tenant.findUnique({
        where: { subdomain: validatedData.subdomain },
      });

      if (subdomainExists) {
        return NextResponse.json(
          { error: 'Ce sous-domaine est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Vérifier si le domain est déjà utilisé par un autre tenant
    if (validatedData.domain && validatedData.domain !== existingTenant.domain) {
      const domainExists = await prisma.tenant.findUnique({
        where: { domain: validatedData.domain },
      });

      if (domainExists) {
        return NextResponse.json(
          { error: 'Ce domaine est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le tenant
    const tenant = await prisma.tenant.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      message: 'Tenant mis à jour avec succès',
      tenant,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tenant:', error);
    
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

    // Vérifier si le tenant existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: params.id },
    });

    if (!existingTenant) {
      return NextResponse.json(
        { error: 'Tenant non trouvé' },
        { status: 404 }
      );
    }

    // Soft delete - marquer comme supprimé
    await prisma.tenant.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Tenant supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du tenant:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
