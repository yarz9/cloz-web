import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

const CATEGORIES = ['announcements', 'general', 'support', 'presets', 'offtopic']

// GET — list threads (pinned first, then most recent activity)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')?.trim()
  const search = searchParams.get('search')?.trim()

  const where: any = {}
  if (category && CATEGORIES.includes(category)) where.category = category
  if (search) where.title = { contains: search, mode: 'insensitive' }

  const threads = await prisma.thread.findMany({
    where,
    select: {
      id: true, title: true, category: true, pinned: true, locked: true, views: true,
      createdAt: true, lastPostAt: true,
      author: { select: { uid: true, username: true, displayName: true, avatarUrl: true, role: true } },
      _count: { select: { posts: true } },
    },
    orderBy: [{ pinned: 'desc' }, { lastPostAt: 'desc' }],
    take: 100,
  })
  return NextResponse.json({ threads })
}

// POST — create a thread
export async function POST(req: NextRequest) {
  const limited = checkRateLimit('thread-create', req, 5, 60_000)
  if (limited) return limited

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Sign in to post' }, { status: 401 })
  if ((user as any).frozen) return NextResponse.json({ error: 'Your account is suspended' }, { status: 403 })

  const body = await req.json()
  const title = String(body.title || '').trim()
  const content = String(body.content || '').trim()
  let category = String(body.category || 'general').trim()
  if (!CATEGORIES.includes(category)) category = 'general'
  // Only staff can post in announcements
  if (category === 'announcements' && !['developer', 'founder', 'admin', 'moderator'].includes(user.role)) {
    category = 'general'
  }
  if (title.length < 4 || title.length > 140) return NextResponse.json({ error: 'Title must be 4-140 characters' }, { status: 400 })
  if (content.length < 4 || content.length > 10000) return NextResponse.json({ error: 'Body must be 4-10000 characters' }, { status: 400 })

  const thread = await prisma.thread.create({
    data: { title, content, category, authorId: user.id },
    select: { id: true },
  })
  return NextResponse.json({ thread })
}
