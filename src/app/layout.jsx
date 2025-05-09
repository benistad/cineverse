'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <title>MovieHunt - Votre collection de films notés</title>
        <meta name="description" content="Découvrez ma collection de films notés et mes recommandations de casting et d'équipe technique" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MovieHunt" />
        <meta name="keywords" content="films, cinéma, critiques, notes, recommandations, acteurs, réalisateurs" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app'} />
        <meta property="og:title" content="MovieHunt - Votre collection de films notés" />
        <meta property="og:description" content="Découvrez ma collection de films notés et mes recommandations de casting et d'équipe technique" />
        <meta property="og:image" content="/images/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app'} />
        <meta name="twitter:title" content="MovieHunt - Votre collection de films notés" />
        <meta name="twitter:description" content="Découvrez ma collection de films notés et mes recommandations de casting et d'équipe technique" />
        <meta name="twitter:image" content="/images/og-image.jpg" />
        
        {/* Liens vers les ressources importantes */}
        <link rel="icon" href="/images/logo-mh.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo-mh.png" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app'} />
        
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
      </body>
    </html>
  );
}
