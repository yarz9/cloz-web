import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

// POST — consume reset token and set a new password
export async function POST(req: NextRequest) {
  const limited = checkRateLimit('reset', req, 10, 60_000)
  if (limited) return limited

  const { token, password } = await req.json()
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  })
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  return NextResponse.json({ success: true, message: 'Password reset successfully' })
}
