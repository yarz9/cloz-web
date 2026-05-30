import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { isStaff } from '@/lib/roles'

export async function GET(_req: NextRequest) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const now = new Date()
  const d7 = new Date(now.getTime() - 7 * 864e5)
  const d30 = new Date(now.getTime() - 30 * 864e5)

  const [
    totalUsers, users7d, users30d, frozenUsers, proUsers,
    totalPresets, publishedPresets, totalReviews, totalFavorites,
    usersByRole, licenseGroups, dlAgg, recentUsers, topPresets,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d30 } } }),
    prisma.user.count({ where: { frozen: true } }),
    prisma.user.count({ where: { plan: { in: ['pro', 'lifetime'] } } }),
    prisma.preset.count(),
    prisma.preset.count({ where: { published: true } }),
    prisma.review.count(),
    prisma.favorite.count(),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.license.groupBy({ by: ['plan', 'status'], _count: { _all: true } }),
    prisma.preset.aggregate({ _sum: { downloadCount: true } }),
    prisma.user.findMany({ select: { uid: true, username: true, role: true, plan: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.preset.findMany({ select: { name: true, slug: true, downloadCount: true, ratingAvg: true }, orderBy: { downloadCount: 'desc' }, take: 8 }),
  ])

  const roleCounts: Record<string, number> = {}
  for (const r of usersByRole) roleCounts[r.role] = r._count._all

  const plans = ['monthly', '3month', 'yearly', 'lifetime']
  const stock: Record<string, { available: number; sold: number }> = {}
  for (const p of plans) stock[p] = { available: 0, sold: 0 }
  for (const g of licenseGroups) {
    if (!stock[g.plan]) stock[g.plan] = { available: 0, sold: 0 }
    if (g.status === 'available') stock[g.plan].available += g._count._all
    else if (g.status === 'active') stock[g.plan].sold += g._count._all
  }

  return NextResponse.json({
    users: { total: totalUsers, new7d: users7d, new30d: users30d, frozen: frozenUsers, pro: proUsers, byRole: roleCounts },
    content: { presets: totalPresets, published: publishedPresets, reviews: totalReviews, favorites: totalFavorites, downloads: dlAgg._sum.downloadCount || 0 },
    stock,
    recentUsers,
    topPresets,
  })
}
