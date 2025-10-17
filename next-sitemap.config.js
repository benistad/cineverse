/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/debug-dates/', '/test-carousel'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'}/server-sitemap.xml`,
    ],
  },
  exclude: [
    '/admin*', 
    '/api*', 
    '/debug-dates*',
    '/test-carousel*',
    '/icon.png',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-0.xml',
    '/_not-found'
  ],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  // Configuration pour les pages prioritaires
  transform: async (config, path) => {
    // Exclure les pages admin, api, debug et test
    if (
      path.startsWith('/admin') || 
      path.startsWith('/api') || 
      path.startsWith('/debug') ||
      path.startsWith('/test-carousel') ||
      path.includes('icon.png') ||
      path.includes('robots.txt') ||
      path.includes('sitemap')
    ) {
      return null; // Exclure cette page
    }
    
    // Donner une priorité plus élevée aux pages principales et aux pages de films
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Pages de catégories importantes
    if (path === '/top-rated' || path === '/hidden-gems' || path === '/quel-film-regarder' || path === '/comment-nous-travaillons') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Pages de films individuelles (FR)
    if (path.startsWith('/films/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: `https://www.moviehunt.fr${path}`,
            hreflang: 'fr',
          },
          {
            href: `https://www.moviehunt.fr/en${path}`,
            hreflang: 'en',
          },
          {
            href: `https://www.moviehunt.fr${path}`,
            hreflang: 'x-default',
          },
        ],
      };
    }
    
    // Pages de films individuelles (EN)
    if (path.startsWith('/en/films/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: `https://www.moviehunt.fr${path.replace('/en', '')}`,
            hreflang: 'fr',
          },
          {
            href: `https://www.moviehunt.fr${path}`,
            hreflang: 'en',
          },
          {
            href: `https://www.moviehunt.fr${path.replace('/en', '')}`,
            hreflang: 'x-default',
          },
        ],
      };
    }
    
    // Configuration par défaut pour les autres pages
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  
  // Ajouter les URLs additionnelles (versions anglaises)
  additionalPaths: async (config) => {
    const result = [];
    
    // Générer les URLs /en/films/ pour tous les films
    // Ces URLs seront créées dynamiquement par Next.js
    // Le sitemap les inclura automatiquement lors du build
    
    return result;
  },
};
