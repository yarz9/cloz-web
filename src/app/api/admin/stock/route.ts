import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Returns key stock counts per plan/status. Called by the Discord /stock command.
const MOD_SECRET = process.env.MOD_SECRET || 'cloz-mod-secret'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }
  if (body.secret !== MOD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const grouped = await prisma.license.groupBy({
    by: ['plan', 'status'],
    _count: { _all: true },
  })

  const plans = ['monthly', '3month', 'yearly', 'lifetime']
  const stock: Record<string, { available: number; active: number; revoked: number; total: number }> = {}
  for (const p of plans) stock[p] = { available: 0, active: 0, revoked: 0, total: 0 }

  for (const row of grouped) {
    if (!stock[row.plan]) stock[row.plan] = { available: 0, active: 0, revoked: 0, total: 0 }
    const n = row._count._all
    if (row.status === 'available') stock[row.plan].available += n
    else if (row.status === 'active') stock[row.plan].active += n
    else if (row.status === 'revoked') stock[row.plan].revoked += n
    stock[row.plan].total += n
  }

  return NextResponse.json({ success: true, stock })
}
