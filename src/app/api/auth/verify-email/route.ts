import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import crypto from 'crypto'

// POST — request an email verification token
export async function POST() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.verified) return NextResponse.json({ success: true, message: 'Already verified' })

  const token = crypto.randomBytes(24).toString('hex')
  await prisma.user.update({ where: { id: user.id }, data: { verifyToken: token } })
  // In production: send verification email. Return token in dev for testing.
  return NextResponse.json({
    success: true,
    message: 'Verification email sent',
    ...(process.env.NODE_ENV !== 'production' ? { devToken: token } : {}),
  })
}

// GET — confirm verification via token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const user = await prisma.user.findFirst({ where: { verifyToken: token } })
  if (!user) return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null },
  })

  return NextResponse.json({ success: true, message: 'Email verified' })
}
