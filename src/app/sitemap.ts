import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://cloz-optimizer.up.railway.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '', '/features', '/pricing', '/downloads', '/marketplace', '/creators',
    '/media', '/docs', '/docs/api', '/about', '/support', '/community',
    '/blog', '/changelog', '/roadmap', '/privacy', '/terms', '/contact',
  ]
  const now = new Date()
  return routes.map(r => ({
    url: `${SITE}${r}`,
    lastModified: now,
    changeFrequency: r === '' || r === '/marketplace' ? 'daily' : 'weekly',
    priority: r === '' ? 1 : r === '/pricing' || r === '/downloads' ? 0.9 : 0.6,
  }))
}
