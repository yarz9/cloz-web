import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cloz-optimizer.up.railway.app').replace(/\/$/, '')

// POST — (re)send a verification email to the logged-in user
export async function POST(req: NextRequest) {
  const limited = checkRateLimit('verify-resend', req, 4, 60_000)
  if (limited) return limited

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.verified) return NextResponse.json({ success: true, message: 'Already verified' })

  const token = crypto.randomBytes(24).toString('hex')
  await prisma.user.update({ where: { id: user.id }, data: { verifyToken: token } })
  await sendVerificationEmail(user.email, token)
  return NextResponse.json({ success: true, message: 'Verification email sent' })
}

// GET — confirm verification via the emailed link, then redirect to the account page
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.redirect(`${APP_URL}/account?verified=0`)

  const user = await prisma.user.findFirst({ where: { verifyToken: token } })
  if (!user) return NextResponse.redirect(`${APP_URL}/account?verified=0`)

  await prisma.user.update({ where: { id: user.id }, data: { verified: true, verifyToken: null } })
  return NextResponse.redirect(`${APP_URL}/account?verified=1`)
}
