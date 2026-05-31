import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://cloz-optimizer.up.railway.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/account', '/dashboard'] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  }
}
