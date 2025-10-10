'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";
// Importation avec gestion d'erreur pour éviter les erreurs console
import dynamic from 'next/dynamic';

// Chargement optimisé de SpeedInsights avec loading state
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next')
    .then(mod => mod.SpeedInsights)
    .catch((error) => {
      console.warn('SpeedInsights non chargé:', error?.message || 'Erreur inconnue');
      return () => null;
    }),
  { 
    ssr: false,
    loading: () => null // Pas de spinner, chargement silencieux
  }
);

// JsonLdSchema chargé dynamiquement (non critique pour TTI)
const JsonLdSchema = dynamic(
  () => import('./components/JsonLdSchema'),
  { 
    ssr: false,
    loading: () => null
  }
);

// Composant qui ramène la page en haut lors des changements de route
const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

// ClientComponents chargé après l'interactivité
const ClientComponents = dynamic(
  () => import('@/components/ClientComponents'),
  { 
    ssr: false,
    loading: () => null
  }
);

// Footer chargé après l'interactivité (non critique)
const Footer = dynamic(
  () => import('@/components/layout/Footer'),
  { 
    ssr: false,
    loading: () => null
  }
);

// MobilePerformanceOptimizer chargé uniquement sur mobile
const MobilePerformanceOptimizer = dynamic(
  () => import('@/components/optimization/MobilePerformanceOptimizer'),
  { 
    ssr: false,
    loading: () => null
  }
);

// Suppression de tous les autres composants d'optimisation avancés

// Désactiver les autres composants d'optimisation qui pourraient causer des problèmes
// const CacheInitializer = dynamic(
//   () => import('@/components/performance/CacheInitializer'),
//   { ssr: false }
// );
// 
// const DataPreloader = dynamic(
//   () => import('@/components/performance/DataPreloader'),
//   { ssr: false }
// );
// 
// const ServiceWorkerRegistration = dynamic(
//   () => import('@/components/performance/ServiceWorkerRegistration'),
//   { ssr: false }
// );
// 
// const SmartImagePreloader = dynamic(
//   () => import('@/components/performance/SmartImagePreloader'),
//   { ssr: false }
// );

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Préconnexion aux domaines critiques pour améliorer le LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        
        {/* Le titre est géré par les métadonnées de chaque page */}
        <meta name="description" content="Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MovieHunt" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="keywords" content="films, cinéma, critiques, notes, recommandations, perles rares, streaming, plateformes françaises, casting remarquable, coup de cœur" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'} />
        <meta property="og:title" content="MovieHunt - Trouvez votre prochain film coup de cœur" />
        <meta property="og:description" content="Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus." />
        <meta property="og:image" content="/images/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'} />
        <meta name="twitter:title" content="MovieHunt - Trouvez votre prochain film coup de cœur" />
        <meta name="twitter:description" content="Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus." />
        <meta name="twitter:image" content="/images/og-image.jpg" />
        
        {/* Favicons et icônes pour différentes plateformes */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/images/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" sizes="180x180" />
        <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#1e293b" />
        <meta name="msapplication-TileImage" content="/images/mstile-144x144.png" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* La balise canonique est gérée par le composant MetaTags pour chaque page */}
        
        {/* Google tag (gtag.js) - Chargé après le LCP pour ne pas bloquer le rendu */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-TB25P4NBF2"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TB25P4NBF2');
            `,
          }}
        />
        
        {/* Microsoft Clarity Analytics */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tndhq5pobe");
            `,
          }}
        />
        
        {/* Cabin Analytics - Chargé après le LCP */}
        <Script
          id="cabin-analytics-conditional"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Charger Cabin Analytics uniquement si pas sur une page admin
              if (!window.location.pathname.startsWith('/admin')) {
                const script = document.createElement('script');
                script.src = 'https://scripts.withcabin.com/hello.js';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <SpeedInsights />
        <MobilePerformanceOptimizer />
        <JsonLdSchema />
        <ClientComponents />
        {/* Suppression des composants d'optimisation avancés qui ralentissaient le rendu */}
        {/* <ImageOptimizer /> */}
        {/* <SpeedIndexOptimizer /> */}
        {/* <ResourceOptimizer /> */}
        {/* <CacheInitializer /> */}
        {/* <DataPreloader /> */}
        {/* <ServiceWorkerRegistration /> */}
        {/* <SmartImagePreloader /> */}
      </body>
    </html>
  );
}
