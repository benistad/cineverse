import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
// Middleware de cache désactivé pour résoudre les problèmes de performance
// import { cacheMiddleware } from './middleware/cacheMiddleware';

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

function getLocale(request) {
  // 1. Vérifier le cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // 2. Vérifier l'en-tête Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => {
      const [code] = lang.trim().split(';');
      return code.split('-')[0];
    });
    
    for (const lang of languages) {
      if (locales.includes(lang)) {
        return lang;
      }
    }
  }

  return defaultLocale;
}

export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Liste des pages statiques à gérer avec i18n
  const staticPages = [
    '/contact',
    '/huntedbymoviehunt',
    '/hidden-gems',
    '/top-rated',
    '/all-films',
    '/comment-nous-travaillons',
    '/quel-film-regarder',
    '/films-horreur-halloween-2025'
  ];
  
  // Gestion de la langue pour toutes les routes (sauf admin et API)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    // Vérifier si l'URL commence par /en/
    const pathnameHasLocale = pathname.startsWith('/en/');
    
    if (pathnameHasLocale) {
      // URL avec /en/ : extraire le chemin sans le préfixe de langue
      const pathnameWithoutLocale = pathname.replace(/^\/en/, '') || '/';
      
      // Vérifier si c'est une page statique
      const isStaticPage = staticPages.some(page => pathnameWithoutLocale === page || pathnameWithoutLocale.startsWith(page + '/'));
      
      if (isStaticPage) {
        // Rewrite vers la page sans préfixe mais avec le cookie de langue
        const response = NextResponse.rewrite(new URL(pathnameWithoutLocale, request.url));
        response.cookies.set('NEXT_LOCALE', 'en', {
          path: '/',
          maxAge: 60 * 60 * 24 * 365, // 1 an
        });
        return response;
      }
    } else {
      // URL sans préfixe de langue
      const locale = getLocale(request);
      const response = NextResponse.next();
      
      // Définir le cookie de langue si nécessaire
      if (!request.cookies.get('NEXT_LOCALE') || request.cookies.get('NEXT_LOCALE').value !== locale) {
        response.cookies.set('NEXT_LOCALE', locale, {
          path: '/',
          maxAge: 60 * 60 * 24 * 365, // 1 an
        });
      }
      
      return response;
    }
  }
  
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
  
  // Pour les autres routes, continuer normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Routes d'administration
    '/admin/:path*',
    // Routes publiques pour la gestion de la langue
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)' 
  ],
};
