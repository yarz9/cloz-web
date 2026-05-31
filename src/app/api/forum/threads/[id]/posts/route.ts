import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { notify } from '@/lib/notify'

// POST — reply to a thread
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const limited = checkRateLimit('forum-reply', req, 20, 60_000)
  if (limited) return limited

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Sign in to reply' }, { status: 401 })
  if ((user as any).frozen) return NextResponse.json({ error: 'Your account is suspended' }, { status: 403 })

  const { id } = await ctx.params
  const thread = await prisma.thread.findUnique({ where: { id }, select: { id: true, locked: true, authorId: true, title: true } })
  if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  if (thread.locked) return NextResponse.json({ error: 'This thread is locked' }, { status: 403 })

  const content = String((await req.json()).content || '').trim()
  if (content.length < 1 || content.length > 10000) return NextResponse.json({ error: 'Reply must be 1-10000 characters' }, { status: 400 })

  const post = await prisma.post.create({
    data: { threadId: id, authorId: user.id, content },
    select: { id: true },
  })
  await prisma.thread.update({ where: { id }, data: { lastPostAt: new Date() } })
  await notify({
    userId: thread.authorId, actorId: user.id, type: 'reply',
    message: `${user.displayName || user.username} replied to "${thread.title.slice(0, 50)}"`,
    link: `/forum/${id}`,
  })
  return NextResponse.json({ post })
}
