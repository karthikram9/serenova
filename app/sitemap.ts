import type { MetadataRoute } from 'next'

const ROUTES = [
  '',
  '/about',
  '/services',
  '/approach',
  '/book',
  '/contact',
  '/privacy',
  '/terms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/book' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/book' ? 0.9 : 0.7,
  }))
}
