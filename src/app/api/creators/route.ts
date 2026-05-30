import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public list of creators (anyone who has published a preset), with stats.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sort = searchParams.get('sort') || 'downloads'
  const search = searchParams.get('search') || ''

  const users = await prisma.user.findMany({
    where: {
      presets: { some: { published: true } },
      ...(search ? { OR: [{ username: { contains: search } }, { displayName: { contains: search } }] } : {}),
    },
    select: {
      id: true, username: true, displayName: true, avatarUrl: true, bio: true, role: true, verified: true, createdAt: true,
      presets: { where: { published: true }, select: { downloadCount: true, ratingAvg: true, ratingCount: true } },
      _count: { select: { presets: { where: { published: true } }, followers: true } },
    },
    take: 100,
  })

  const creators = users.map(u => {
    const downloads = u.presets.reduce((s, p) => s + p.downloadCount, 0)
    const rated = u.presets.filter(p => p.ratingCount > 0)
    const avgRating = rated.length ? rated.reduce((s, p) => s + p.ratingAvg, 0) / rated.length : 0
    return {
      id: u.id, username: u.username, displayName: u.displayName, avatarUrl: u.avatarUrl, bio: u.bio,
      role: u.role, verified: u.verified,
      presetCount: u._count.presets, followers: u._count.followers,
      downloads, avgRating: Math.round(avgRating * 10) / 10,
    }
  })

  creators.sort((a, b) =>
    sort === 'rating' ? b.avgRating - a.avgRating
    : sort === 'presets' ? b.presetCount - a.presetCount
    : sort === 'followers' ? b.followers - a.followers
    : b.downloads - a.downloads
  )

  return NextResponse.json({ creators })
}
