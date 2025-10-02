/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/debug-dates/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt.fr'}/server-sitemap.xml`,
    ],
  },
  exclude: ['/admin/*', '/api/*', '/debug-dates/*'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  // Configuration pour les pages prioritaires
  transform: async (config, path) => {
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
    
    // Pages de films individuelles
    if (path.startsWith('/films/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
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
};
