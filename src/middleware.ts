import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: { path: string; domain?: string }) {
          request.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Vérifier si l'utilisateur est authentifié
  const { data: { session } } = await supabase.auth.getSession();

  // Si l'utilisateur tente d'accéder à une route admin sans être connecté
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin' && 
      !session) {
    // Rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Si l'utilisateur est déjà connecté et tente d'accéder à la page de connexion
  if (request.nextUrl.pathname === '/admin' && session) {
    // Rediriger vers le dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
