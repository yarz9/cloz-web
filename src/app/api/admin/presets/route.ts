import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { isStaff } from '@/lib/roles'

// List ALL presets (including unpublished) for moderation. Staff only.
export async function GET(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim()

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  const presets = await prisma.preset.findMany({
    where,
    select: {
      id: true, slug: true, name: true, category: true, published: true,
      verified: true, featured: true, downloadCount: true, ratingAvg: true,
      createdAt: true,
      author: { select: { username: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json({ presets })
}
