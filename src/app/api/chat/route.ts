import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

const authorSel = { select: { uid: true, username: true, displayName: true, avatarUrl: true, role: true } }

// GET — recent chat messages (oldest → newest)
export async function GET() {
  const rows = await prisma.chatMessage.findMany({
    include: { user: authorSel },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ messages: rows.reverse() })
}

// POST — send a chat message
export async function POST(req: NextRequest) {
  const limited = checkRateLimit('chat', req, 20, 60_000)
  if (limited) return limited

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Sign in to chat' }, { status: 401 })
  if ((user as any).frozen) return NextResponse.json({ error: 'Your account is suspended' }, { status: 403 })

  const content = String((await req.json()).content || '').trim()
  if (content.length < 1 || content.length > 300) {
    return NextResponse.json({ error: 'Message must be 1-300 characters' }, { status: 400 })
  }

  const msg = await prisma.chatMessage.create({
    data: { userId: user.id, content },
    include: { user: authorSel },
  })
  return NextResponse.json({ message: msg })
}
