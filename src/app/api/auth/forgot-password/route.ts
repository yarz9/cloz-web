import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

// POST — request a password reset token
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })

  // Always return success to avoid email enumeration
  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    })
    // In production: send email with reset link.
    // For now we return the token in dev so the flow is testable.
    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' ? { devToken: token } : {}),
    })
  }

  return NextResponse.json({
    success: true,
    message: 'If an account exists, a reset link has been sent.',
  })
}
