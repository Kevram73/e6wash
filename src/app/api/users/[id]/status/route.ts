import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = params;
    const { isActive } = await request.json();

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Empêcher la désactivation de soi-même
    if (id === currentUser.id && !isActive) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas désactiver votre propre compte' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur à modifier appartient au même tenant
    const userToUpdate = await prisma.user.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId
      }
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour le statut
    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
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
      message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
      data: user
    });

  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de statut' },
      { status: 500 }
    );
  }
}
