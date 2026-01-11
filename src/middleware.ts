// ===========================================
// Middleware - Protection des routes
// ===========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

// Routes publiques (pas besoin d'auth)
const PUBLIC_ROUTES = [
  '/admin/login',
  '/admin/register',
  '/admin/forgot-password',
  '/admin/reset-password',
];

// Routes API publiques
const PUBLIC_API_ROUTES = [
  '/api/auth',
  '/api/contact',
  '/api/booking',
  '/api/widget',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Routes publiques du site (pas /admin)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // API publiques
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Routes admin publiques (login, register, etc.)
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // Si déjà connecté, rediriger vers le dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Routes admin protégées - vérifier l'auth
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      // Sauvegarder l'URL de destination pour rediriger après login
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/admin/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    // Utilisateur connecté - continuer
    return NextResponse.next();
  }

  // Routes API protégées
  if (pathname.startsWith('/api') && !isLoggedIn) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  return NextResponse.next();
});

// Configuration du matcher
export const config = {
  matcher: [
    // Protéger les routes admin
    '/admin/:path*',
    // Protéger les API (sauf celles publiques)
    '/api/:path*',
  ],
};
