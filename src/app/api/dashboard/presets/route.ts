import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET — current user's presets (including unpublished) for the creator dashboard
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const presets = await prisma.preset.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { reviews: true, favorites: true, downloads: true } } },
  })

  const totalDownloads = presets.reduce((s, p) => s + p.downloadCount, 0)
  const avgRating = presets.length
    ? presets.reduce((s, p) => s + p.ratingAvg, 0) / presets.filter(p => p.ratingCount > 0).length || 0
    : 0
  const followerCount = await prisma.follow.count({ where: { followingId: user.id } })

  return NextResponse.json({
    presets: presets.map(p => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] })),
    stats: {
      totalPresets: presets.length,
      publishedPresets: presets.filter(p => p.published).length,
      totalDownloads,
      avgRating: Math.round((avgRating || 0) * 10) / 10,
      followerCount,
    },
  })
}
