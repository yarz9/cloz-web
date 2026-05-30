import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Bulk-load license keys into stock. Called by the Discord /restock command.
// Auth: shared MOD_SECRET (server-to-server), same secret the bot uses.

const MOD_SECRET = process.env.MOD_SECRET || 'cloz-mod-secret'

// Map the friendly tier names to the License.plan values used at activation.
const PLAN_MAP: Record<string, string> = {
  '1month': 'monthly', monthly: 'monthly', '1m': 'monthly',
  '3month': '3month', '3m': '3month', quarterly: '3month',
  '12month': 'yearly', yearly: 'yearly', '12m': 'yearly', annual: 'yearly',
  lifetime: 'lifetime', lt: 'lifetime',
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  if (body.secret !== MOD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plan = PLAN_MAP[String(body.plan || '').toLowerCase()]
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan (use 1month, 3month, 12month, or lifetime)' }, { status: 400 })
  }

  const rawKeys: string[] = Array.isArray(body.keys) ? body.keys : []
  // Normalise: trim, uppercase, dedupe, drop obvious junk
  const keys = Array.from(new Set(
    rawKeys
      .map(k => String(k).trim().toUpperCase())
      .filter(k => k.length >= 8 && k.length <= 64 && /^[A-Z0-9\-]+$/.test(k)),
  ))

  if (keys.length === 0) {
    return NextResponse.json({ error: 'No valid keys provided' }, { status: 400 })
  }
  if (keys.length > 5000) {
    return NextResponse.json({ error: 'Too many keys in one batch (max 5000)' }, { status: 400 })
  }

  const result = await prisma.license.createMany({
    data: keys.map(key => ({ key, plan, status: 'available' })),
    skipDuplicates: true,
  })

  const added = result.count
  const skipped = keys.length - added

  // Current available stock for this plan after restock
  const available = await prisma.license.count({ where: { plan, status: 'available' } })

  return NextResponse.json({ success: true, plan, added, skipped, available })
}
