'use client';

// Importer les styles slick-carousel globalement pour éviter les requêtes multiples
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";
// Importation avec gestion d'erreur pour éviter les erreurs console
import dynamic from 'next/dynamic';

// Chargement conditionnel de SpeedInsights pour éviter les erreurs console
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights).catch(() => {
    // Retourner un composant vide en cas d'erreur
    return () => null;
  }),
  { ssr: false }
);
// dynamic est déjà importé plus haut
import JsonLdSchema from './components/JsonLdSchema';
import CanonicalTag from './components/CanonicalTag';
import TitleTag from './components/TitleTag';

// Composants d'optimisation essentiels pour améliorer le Speed Index
const MobilePerformanceOptimizer = dynamic(
  () => import('@/components/optimization/MobilePerformanceOptimizer'),
  { ssr: false }
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
        {/* Le titre est géré par les métadonnées de chaque page */}
        <meta name="description" content="Movie Hunt est le site pour savoir quel film regarder et découvrir des perles rares. Notes de films, recommandations, casting remarquable, disponibilité sur les plateformes de streaming françaises et encore plus." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MovieHunt" />
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
        
        {/* Google tag (gtag.js) - Implémentation directe de la balise fournie par Google */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-TB25P4NBF2"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TB25P4NBF2');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
        <SpeedInsights />
        <MobilePerformanceOptimizer />
        <JsonLdSchema />
        <CanonicalTag />
        <TitleTag />
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
