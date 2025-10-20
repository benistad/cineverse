'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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

// BackToTop button pour améliorer la navigation mobile
const BackToTop = dynamic(
  () => import('@/components/ui/BackToTop'),
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

export default function ClientLayout({ children }) {
  return (
    <>
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
      
      <LanguageProvider>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </AuthProvider>
      </LanguageProvider>
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
    </>
  );
}
