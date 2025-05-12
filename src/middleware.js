import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cacheMiddleware } from './middleware/cacheMiddleware';

export async function middleware(request) {
  const url = new URL(request.url);
  
  // Appliquer le middleware de cache pour les routes non-admin
  if (!url.pathname.startsWith('/admin')) {
    try {
      const cacheResponse = await cacheMiddleware(request);
      
      // Si le middleware de cache a modifié la réponse, retourner cette réponse
      if (cacheResponse && cacheResponse.headers && cacheResponse.headers.has('X-Cache-Status')) {
        return cacheResponse;
      }
    } catch (error) {
      console.error('Erreur dans le middleware de cache:', error);
      // En cas d'erreur, continuer sans bloquer la navigation
    }
  }
  
  // Pour les routes admin, appliquer le middleware d'authentification
  if (url.pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove: (name, options) => {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Récupérer la session
    const { data: { session } } = await supabase.auth.getSession();

    // Si l'utilisateur tente d'accéder à une route admin sans être connecté
    if (url.pathname.startsWith('/admin') && 
        url.pathname !== '/admin' && 
        !session) {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Si l'utilisateur est déjà connecté et tente d'accéder à la page de connexion
    if (url.pathname === '/admin' && session) {
      // Rediriger vers le dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return response;
  }
  
  // Pour les autres routes, continuer normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Routes d'administration
    '/admin/:path*',
    // Routes publiques principales (pas les routes dynamiques de films)
    '/',
    '/films',
    '/genres/:path*',
    // Routes d'API
    '/api/:path*',
    // Fichiers statiques et autres routes à mettre en cache
    '/:path*.jpg',
    '/:path*.jpeg',
    '/:path*.png',
    '/:path*.webp',
    '/:path*.css',
    '/:path*.js'
  ],
};
