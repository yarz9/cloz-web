import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { isStaff } from '@/lib/roles'

const authorSel = { select: { uid: true, username: true, displayName: true, avatarUrl: true, role: true } }

// GET — a thread with its replies (also bumps the view count)
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      author: authorSel,
      posts: { include: { author: authorSel }, orderBy: { createdAt: 'asc' }, take: 500 },
    },
  })
  if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  prisma.thread.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {})
  return NextResponse.json({ thread })
}

// PATCH — staff: pin / lock
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await ctx.params
  const body = await req.json()
  const data: any = {}
  if (typeof body.pinned === 'boolean') data.pinned = body.pinned
  if (typeof body.locked === 'boolean') data.locked = body.locked
  if (!Object.keys(data).length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  try {
    const t = await prisma.thread.update({ where: { id }, data, select: { id: true, pinned: true, locked: true } })
    return NextResponse.json({ thread: t })
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }) }
}

// DELETE — staff or the thread author
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  const thread = await prisma.thread.findUnique({ where: { id }, select: { authorId: true } })
  if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (thread.authorId !== me.id && !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.thread.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
