// ===========================================
// Configuration NextAuth v5 - Multi-tenant SaaS
// ===========================================

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import type { UserRole } from '@prisma/client';

// Extension des types NextAuth pour inclure nos champs custom
declare module 'next-auth' {
  interface User {
    role: UserRole;
    organizationId: string;
    organizationSlug?: string;
    organizationName?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: UserRole;
      organizationId: string;
      organizationSlug: string;
      organizationName: string;
    };
  }
}

// Note: Les types JWT sont étendus via le callback jwt directement

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Utiliser JWT pour les sessions (pas d'adapter pour credentials)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  providers: [
    // Connexion par email/mot de passe
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Chercher l'utilisateur avec son organisation
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            organization: {
              select: {
                id: true,
                slug: true,
                name: true,
                planStatus: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          throw new Error('Identifiants incorrects');
        }

        // Vérifier le mot de passe
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
          throw new Error('Identifiants incorrects');
        }

        // Vérifier que l'organisation est active
        if (user.organization.planStatus === 'CANCELED') {
          throw new Error('Votre abonnement a été annulé. Contactez le support.');
        }

        // Mettre à jour la date de dernière connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          organizationId: user.organizationId,
          organizationSlug: user.organization.slug,
          organizationName: user.organization.name,
        };
      },
    }),
  ],

  callbacks: {
    // Ajouter les infos custom au JWT
    async jwt({ token, user, trigger, session }) {
      // Première connexion : ajouter les infos de l'utilisateur
      if (user) {
        token.role = user.role as UserRole;
        token.organizationId = user.organizationId as string;
        token.organizationSlug = (user.organizationSlug as string) || '';
        token.organizationName = (user.organizationName as string) || '';
      }

      // Mise à jour de session (ex: changement de rôle)
      if (trigger === 'update' && session) {
        token.role = (session.role as UserRole) ?? token.role;
        token.organizationId = (session.organizationId as string) ?? token.organizationId;
      }

      return token;
    },

    // Ajouter les infos custom à la session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
        session.user.organizationSlug = token.organizationSlug as string;
        session.user.organizationName = token.organizationName as string;
      }
      return session;
    },

    // Autoriser la connexion
    async signIn() {
      return true;
    },
  },

  events: {
    // Log des connexions
    async signIn({ user }) {
      console.log(`[Auth] Connexion: ${user.email}`);
    },
  },
});
