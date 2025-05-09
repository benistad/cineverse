/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://moviehunt.vercel.app'}/sitemap.xml`,
    ],
  },
  exclude: ['/admin/*', '/api/*'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
};
