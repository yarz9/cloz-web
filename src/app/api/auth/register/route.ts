import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (username.length < 3 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json({ error: 'Username must be 3+ chars, alphanumeric' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (existing) {
      return NextResponse.json({ error: existing.email === email ? 'Email already registered' : 'Username taken' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const verifyToken = crypto.randomBytes(32).toString('hex')
    const user = await prisma.user.create({
      data: { email, username, passwordHash, displayName: username, verifyToken },
      select: { id: true, email: true, username: true, displayName: true, role: true },
    })

    // Fire-and-forget verification email (no-op if RESEND_API_KEY unset)
    sendVerificationEmail(email, verifyToken).catch(() => {})

    const token = generateToken(user.id)

    const response = NextResponse.json({ user, token }, { status: 201 })
    const cookie = setAuthCookie(token)
    response.headers.set('Set-Cookie', cookie['Set-Cookie'])
    return response
  } catch (error: any) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
