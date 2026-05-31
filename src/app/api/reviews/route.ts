import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { notify } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const limited = checkRateLimit('review', req, 15, 60_000)
  if (limited) return limited

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presetId, rating, comment } = await req.json()
  if (!presetId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid rating (1-5 required)' }, { status: 400 })
  }
  if (comment != null && (typeof comment !== 'string' || comment.length > 1000)) {
    return NextResponse.json({ error: 'Comment too long (max 1000 chars)' }, { status: 400 })
  }

  try {
    const review = await prisma.review.upsert({
      where: { presetId_userId: { presetId, userId: user.id } },
      create: { presetId, userId: user.id, rating, comment },
      update: { rating, comment },
    })

    // Recalculate preset rating
    const agg = await prisma.review.aggregate({
      where: { presetId },
      _avg: { rating: true },
      _count: { rating: true },
    })
    await prisma.preset.update({
      where: { id: presetId },
      data: { ratingAvg: agg._avg.rating || 0, ratingCount: agg._count.rating },
    })

    const preset = await prisma.preset.findUnique({ where: { id: presetId }, select: { authorId: true, name: true, slug: true } })
    if (preset) {
      await notify({
        userId: preset.authorId, actorId: user.id, type: 'review',
        message: `${user.displayName || user.username} rated "${preset.name}" ${rating}★`,
        link: `/marketplace/${preset.slug}`,
      })
    }

    return NextResponse.json({ review })
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const presetId = searchParams.get('presetId')
  if (!presetId) return NextResponse.json({ error: 'presetId required' }, { status: 400 })

  const reviews = await prisma.review.findMany({
    where: { presetId },
    include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ reviews })
}
