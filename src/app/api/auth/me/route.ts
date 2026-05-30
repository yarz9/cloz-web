import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, clearAuthCookie, verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Resolve user from cookie (website) OR Bearer token (desktop app device-link)
async function resolveUser(req: NextRequest) {
  const cookieUser = await getCurrentUser()
  if (cookieUser) return cookieUser
  const auth = req.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) {
    const payload = verifyToken(auth.slice(7))
    if (payload) {
      return prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true, email: true, username: true, displayName: true,
          avatarUrl: true, bio: true, role: true, verified: true, discordId: true,
          plan: true, createdAt: true,
        },
      })
    }
  }
  return null
}

export async function GET(req: NextRequest) {
  const user = await resolveUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ user })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  const cookie = clearAuthCookie()
  response.headers.set('Set-Cookie', cookie['Set-Cookie'])
  return response
}
