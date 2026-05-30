import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, verifyToken } from '@/lib/auth'

const TEST_KEY = 'CLOZ-TEST-PRO-2024'

// Resolve the authenticated user from either the session cookie (website)
// or a Bearer token (desktop app).
async function resolveUser(req: NextRequest) {
  const cookieUser = await getCurrentUser()
  if (cookieUser) return cookieUser
  const auth = req.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) {
    const payload = verifyToken(auth.slice(7))
    if (payload) {
      return prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, username: true, plan: true },
      })
    }
  }
  return null
}

function expiryFor(plan: string): Date | null {
  const d = new Date()
  if (plan === 'monthly') { d.setMonth(d.getMonth() + 1); return d }
  if (plan === '3month') { d.setMonth(d.getMonth() + 3); return d }
  if (plan === 'yearly') { d.setFullYear(d.getFullYear() + 1); return d }
  return null // lifetime
}

const PLAN_TIER: Record<string, string> = {
  monthly: 'pro', '3month': 'pro', yearly: 'pro', lifetime: 'lifetime',
}

export async function POST(req: NextRequest) {
  const user = await resolveUser(req)
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const { key, hwid } = await req.json()
  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'License key required' }, { status: 400 })
  }
  const trimmed = key.trim()

  // 0. Dev/test key — always grants lifetime, reusable across accounts (no unique row)
  if (trimmed.toUpperCase() === TEST_KEY) {
    await prisma.user.update({ where: { id: user.id }, data: { plan: 'lifetime' } })
    return NextResponse.json({ success: true, plan: 'lifetime', tier: 'lifetime', expiresAt: null })
  }

  // Look up the key. Keys must have been pre-loaded into stock (via the Discord
  // /restock command). Unknown keys are rejected — we never auto-create one.
  const existing = await prisma.license.findUnique({ where: { key: trimmed } })

  if (!existing) {
    return NextResponse.json({ error: 'Invalid or unknown license key' }, { status: 400 })
  }
  if (existing.status === 'revoked') {
    return NextResponse.json({ error: 'This key has been revoked' }, { status: 403 })
  }
  if (existing.userId && existing.userId !== user.id) {
    return NextResponse.json({ error: 'This key is already linked to another account' }, { status: 409 })
  }

  // Already this user's key — re-affirm without resetting the clock
  if (existing.userId === user.id && existing.status === 'active') {
    await prisma.user.update({ where: { id: user.id }, data: { plan: PLAN_TIER[existing.plan] || 'pro' } })
    return NextResponse.json({ success: true, plan: existing.plan, tier: PLAN_TIER[existing.plan] || 'pro', expiresAt: existing.expiresAt })
  }

  // Claim an available key — bind to the user and start the subscription clock now
  const updated = await prisma.license.update({
    where: { id: existing.id },
    data: {
      userId: user.id,
      hwid: hwid || existing.hwid,
      status: 'active',
      activatedAt: new Date(),
      expiresAt: expiryFor(existing.plan),
    },
  })
  await prisma.user.update({ where: { id: user.id }, data: { plan: PLAN_TIER[updated.plan] || 'pro' } })

  return NextResponse.json({ success: true, plan: updated.plan, tier: PLAN_TIER[updated.plan] || 'pro', expiresAt: updated.expiresAt })
}

// GET — list the user's licenses
export async function GET(req: NextRequest) {
  const user = await resolveUser(req)
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const licenses = await prisma.license.findMany({
    where: { userId: user.id },
    select: { key: true, plan: true, status: true, activatedAt: true, expiresAt: true },
    orderBy: { activatedAt: 'desc' },
  })
  return NextResponse.json({ licenses })
}
