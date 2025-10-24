export async function GET() {
  const robotsTxt = `# Robots.txt for MovieHunt
User-agent: *
Allow: /api/server-sitemap.xml
Disallow: /admin/
Disallow: /api/
Disallow: /debug-dates/
Disallow: /test-carousel

User-agent: Googlebot-Mobile
Allow: /
Crawl-delay: 1

User-agent: Googlebot-Image
User-agent: Googlebot-Video
Allow: /

# Host
Host: https://www.moviehunt.fr

# Sitemaps
Sitemap: https://www.moviehunt.fr/sitemap.xml
Sitemap: https://www.moviehunt.fr/api/server-sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
