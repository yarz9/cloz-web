import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await prisma.user.findFirst({
    where: { OR: [{ id }, { username: id }] },
    select: {
      id: true, uid: true, username: true, displayName: true, avatarUrl: true, bio: true,
      role: true, verified: true, createdAt: true,
      presets: {
        where: { published: true },
        select: {
          id: true, slug: true, name: true, description: true, category: true,
          version: true, downloadCount: true, ratingAvg: true, ratingCount: true,
          verified: true, featured: true, createdAt: true,
          tags: true,
        },
        orderBy: { downloadCount: 'desc' },
      },
      _count: {
        select: { presets: { where: { published: true } }, reviews: true },
      },
    },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Calculate total downloads across all presets
  const totalDownloads = user.presets.reduce((sum, p) => sum + p.downloadCount, 0)
  const rated = user.presets.filter(p => p.ratingCount > 0)
  const avgRating = rated.length > 0
    ? rated.reduce((sum, p) => sum + p.ratingAvg, 0) / rated.length
    : 0
  const followerCount = await prisma.follow.count({ where: { followingId: user.id } })

  return NextResponse.json({
    user: {
      ...user,
      presets: user.presets.map(p => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] })),
      stats: {
        totalPresets: user._count.presets,
        totalDownloads,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: user._count.reviews,
        followerCount,
      },
    },
  })
}
