import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET — current user's recent notifications + unread count
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ notifications: [], unread: 0 })

  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ])
  return NextResponse.json({ notifications, unread })
}

// POST — mark all (or a single id) as read
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  if (body.id) {
    await prisma.notification.updateMany({ where: { id: body.id, userId: user.id }, data: { read: true } })
  } else {
    await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } })
  }
  return NextResponse.json({ success: true })
}
