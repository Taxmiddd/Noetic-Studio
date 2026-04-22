import { MetadataRoute } from 'next';
// Note: In an edge deployment, you might query Supabase here to get dynamic project routes
// For now, we will output the primary static routes and any known dynamic ones.

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://noeticstudio.net';

  const routes = [
    '',
    '/about',
    '/work',
    '/services',
    '/terms',
    '/privacy',
    '/refund',
    '/pricing',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // You would typically fetch active projects here to generate dynamic /work/[slug] routes,
  // but to keep build steps fast on the edge, we will rely on GoogleBot crawling the /work page grid.

  return [...routes];
}
