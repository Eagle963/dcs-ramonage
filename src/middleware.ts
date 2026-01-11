// ===========================================
// Middleware - Protection des routes (Edge Runtime compatible)
// ===========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques du site (pas /admin)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // API publiques
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Vérifier le token JWT
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isLoggedIn = !!token;

  // Routes admin publiques (login, register, etc.)
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // Si déjà connecté, rediriger vers le dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Routes admin protégées - vérifier l'auth
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      // Sauvegarder l'URL de destination pour rediriger après login
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/admin/login?callbackUrl=${callbackUrl}`, request.url)
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
}

// Configuration du matcher
export const config = {
  matcher: [
    // Protéger les routes admin
    '/admin/:path*',
    // Protéger les API (sauf celles publiques)
    '/api/:path*',
  ],
};
