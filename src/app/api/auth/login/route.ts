import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: email }] },
    })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.frozen) {
      return NextResponse.json({ error: 'This account has been suspended. Contact support.' }, { status: 403 })
    }

    const token = generateToken(user.id)

    const response = NextResponse.json({
      user: {
        id: user.id, email: user.email, username: user.username,
        displayName: user.displayName, avatarUrl: user.avatarUrl,
        role: user.role, verified: user.verified,
      },
      token,
    })
    const cookie = setAuthCookie(token)
    response.headers.set('Set-Cookie', cookie['Set-Cookie'])
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
