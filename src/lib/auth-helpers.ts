import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export interface UserContext {
  userId: string;
  tenantId: string;
  agencyId?: string;
  role: string;
}

/**
 * Récupère le contexte de l'utilisateur connecté avec ses permissions
 */
export async function getUserContext(): Promise<UserContext | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tenantId: true,
        agencyId: true,
        role: true
      }
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      tenantId: user.tenantId,
      agencyId: user.agencyId || undefined,
      role: user.role
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du contexte utilisateur:', error);
    return null;
  }
}

/**
 * Construit les filtres de base pour l'isolation par tenant
 */
export function buildTenantFilters(userContext: UserContext): any {
  const filters: any = {
    tenantId: userContext.tenantId
  };

  // Si l'utilisateur n'est pas admin/owner, filtrer aussi par agence
  if (userContext.agencyId && !['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(userContext.role)) {
    filters.agencyId = userContext.agencyId;
  }

  return filters;
}

/**
 * Vérifie si l'utilisateur peut accéder à une ressource
 */
export function canAccessResource(userContext: UserContext, resourceTenantId: string, resourceAgencyId?: string): boolean {
  // Vérifier l'isolation par tenant
  if (userContext.tenantId !== resourceTenantId) {
    return false;
  }

  // Si l'utilisateur est admin/owner, il peut accéder à toutes les ressources du tenant
  if (['ADMIN', 'OWNER', 'SUPER_ADMIN'].includes(userContext.role)) {
    return true;
  }

  // Sinon, vérifier l'isolation par agence
  if (userContext.agencyId && resourceAgencyId) {
    return userContext.agencyId === resourceAgencyId;
  }

  return true;
}

/**
 * Middleware pour vérifier l'authentification et retourner le contexte utilisateur
 */
export async function requireAuth(): Promise<{ userContext: UserContext; error?: never } | { userContext?: never; error: Response }> {
  const userContext = await getUserContext();
  
  if (!userContext) {
    return {
      error: new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    };
  }

  return { userContext };
}
