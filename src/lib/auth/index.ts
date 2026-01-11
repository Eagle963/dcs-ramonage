// ===========================================
// Helpers d'authentification - Côté serveur
// ===========================================

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { UserRole } from '@prisma/client';

// Type pour l'utilisateur courant avec son organisation
export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  organizationId: string;
  organization: {
    id: string;
    slug: string;
    name: string;
    plan: string;
    planStatus: string;
    logo: string | null;
    primaryColor: string | null;
  };
};

/**
 * Récupère la session courante
 * À utiliser dans les Server Components et Route Handlers
 */
export const getSession = cache(async () => {
  return await auth();
});

/**
 * Récupère l'utilisateur courant avec son organisation
 * Retourne null si non connecté
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        select: {
          id: true,
          slug: true,
          name: true,
          plan: true,
          planStatus: true,
          logo: true,
          primaryColor: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    organizationId: user.organizationId,
    organization: user.organization,
  };
});

/**
 * Récupère l'utilisateur courant ou redirige vers login
 * À utiliser dans les pages protégées
 */
export const requireAuth = cache(async (): Promise<CurrentUser> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
});

/**
 * Récupère l'utilisateur courant et vérifie le rôle
 * Redirige vers 403 si pas autorisé
 */
export const requireRole = cache(
  async (allowedRoles: UserRole[]): Promise<CurrentUser> => {
    const user = await requireAuth();

    if (!allowedRoles.includes(user.role)) {
      redirect('/admin/unauthorized');
    }

    return user;
  }
);

/**
 * Récupère l'organizationId de l'utilisateur courant
 * À utiliser dans les API routes
 */
export async function getOrganizationId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.organizationId ?? null;
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession();
  return session?.user?.role === role;
}

/**
 * Vérifie si l'utilisateur a l'un des rôles spécifiés
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const session = await getSession();
  return roles.includes(session?.user?.role as UserRole);
}

/**
 * Vérifie si l'utilisateur est admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN');
}

/**
 * Vérifie si l'utilisateur est admin ou manager
 */
export async function isManager(): Promise<boolean> {
  return hasAnyRole(['ADMIN', 'MANAGER']);
}
