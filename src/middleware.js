import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
// Middleware de cache désactivé pour résoudre les problèmes de performance
// import { cacheMiddleware } from './middleware/cacheMiddleware';

// MULTILINGUAL DISABLED - Keep for future use
// const locales = ['fr', 'en'];
// const defaultLocale = 'fr';

// function getLocale(request) {
//   // 1. Vérifier le cookie
//   const localeCookie = request.cookies.get('NEXT_LOCALE');
//   if (localeCookie && locales.includes(localeCookie.value)) {
//     return localeCookie.value;
//   }

//   // 2. Vérifier l'en-tête Accept-Language
//   const acceptLanguage = request.headers.get('accept-language');
//   if (acceptLanguage) {
//     const languages = acceptLanguage.split(',').map(lang => {
//       const [code] = lang.trim().split(';');
//       return code.split('-')[0];
//     });
    
//     for (const lang of languages) {
//       if (locales.includes(lang)) {
//         return lang;
//       }
//     }
//   }

//   return defaultLocale;
// }

export async function middleware(request) {
  const url = new URL(request.url);
  
  // IMPORTANT: Ne PAS exécuter de middleware sur les routes publiques
  // pour permettre le SSG/ISR et une bonne indexation Google
  // Le matcher ci-dessous limite déjà aux routes /admin/*
  
  // Appliquer uniquement le middleware d'authentification pour les routes admin
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
  
  // Ce code ne devrait jamais être atteint grâce au matcher
  return NextResponse.next();
}

export const config = {
  matcher: [
    // IMPORTANT: Limiter STRICTEMENT aux routes admin
    // Ne PAS ajouter d'autres routes ici pour permettre SSG/ISR
    '/admin/:path*',
  ],
};
