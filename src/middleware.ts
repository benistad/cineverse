import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Vérifie si un cookie de session Supabase existe (vérification plus générique)
  const hasSessionCookie = Array.from(request.cookies.getAll())
    .some(cookie => cookie.name.startsWith('sb-') && cookie.value);

  // Si l'utilisateur tente d'accéder à une route admin sans être connecté
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin' && 
      !hasSessionCookie) {
    // Rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Si l'utilisateur est déjà connecté et tente d'accéder à la page de connexion
  if (request.nextUrl.pathname === '/admin' && hasSessionCookie) {
    // Rediriger vers le dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
