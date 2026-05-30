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

function planFromKey(key: string): 'monthly' | '3month' | 'yearly' | 'lifetime' | null {
  const u = key.toUpperCase()
  if (u === TEST_KEY) return 'lifetime'
  if (u.includes('LIFETIME')) return 'lifetime'
  if (u.includes('YEAR') || u.includes('12M')) return 'yearly'
  if (u.includes('3M') || u.includes('QUARTER')) return '3month'
  if (u.startsWith('CLOZ-') || u.startsWith('RC-')) return 'monthly'
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

  // 1. Check if the key already exists in the License table
  const existing = await prisma.license.findUnique({ where: { key: trimmed } })

  if (existing) {
    if (existing.status === 'revoked') {
      return NextResponse.json({ error: 'This key has been revoked' }, { status: 403 })
    }
    if (existing.userId && existing.userId !== user.id) {
      return NextResponse.json({ error: 'This key is already linked to another account' }, { status: 409 })
    }
    // Claim / re-affirm ownership
    const updated = await prisma.license.update({
      where: { id: existing.id },
      data: {
        userId: user.id, hwid: hwid || existing.hwid, status: 'active',
        activatedAt: existing.activatedAt || new Date(),
      },
    })
    await prisma.user.update({ where: { id: user.id }, data: { plan: PLAN_TIER[updated.plan] || 'pro' } })
    return NextResponse.json({ success: true, plan: updated.plan, tier: PLAN_TIER[updated.plan] || 'pro', expiresAt: updated.expiresAt })
  }

  // 2. New key — validate format and create a linked license
  const plan = planFromKey(trimmed)
  if (!plan) {
    return NextResponse.json({ error: 'Invalid license key' }, { status: 400 })
  }

  const created = await prisma.license.create({
    data: {
      key: trimmed, userId: user.id, plan, status: 'active',
      hwid: hwid || null, activatedAt: new Date(), expiresAt: expiryFor(plan),
    },
  })
  await prisma.user.update({ where: { id: user.id }, data: { plan: PLAN_TIER[plan] || 'pro' } })

  return NextResponse.json({ success: true, plan: created.plan, tier: PLAN_TIER[plan] || 'pro', expiresAt: created.expiresAt })
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
