import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

// Export des métadonnées pour le SSR
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'),
  title: {
    default: 'MovieHunt : idées de films - Quel film regarder ?',
    template: '%s | MovieHunt'
  },
  description: 'Découvrez quel film regarder : notes, critiques de films et perles rares. Staff remarquable et disponibilité streaming en France.',
  keywords: ['films', 'cinéma', 'critiques', 'notes', 'recommandations', 'perles rares', 'streaming', 'plateformes françaises', 'casting remarquable', 'coup de cœur'],
  authors: [{ name: 'MovieHunt' }],
  creator: 'MovieHunt',
  publisher: 'MovieHunt',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.moviehunt.fr',
    siteName: 'MovieHunt',
    title: 'MovieHunt - Trouvez votre prochain film coup de cœur',
    description: 'Découvrez quel film regarder : notes, critiques de films et perles rares. Staff remarquable et disponibilité streaming en France.',
    images: [
      {
        url: '/api/og-image',
        width: 1200,
        height: 630,
        alt: 'MovieHunt - Découvrez votre prochain film coup de cœur',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MovieHunt',
    creator: '@MovieHunt',
    title: 'MovieHunt - Trouvez votre prochain film coup de cœur',
    description: 'Découvrez quel film regarder : notes, critiques de films et perles rares. Staff remarquable et disponibilité streaming en France.',
    images: ['https://www.moviehunt.fr/api/og-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/',
      'en': '/en',
      'x-default': '/'
    }
  },
};

// Forcer le dynamic rendering pour toutes les pages par défaut
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
