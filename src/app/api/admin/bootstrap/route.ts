import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ROLES } from '@/lib/roles'

// One-off role bootstrap, guarded by MOD_SECRET (server-to-server only).
// Used to seed the top-level developer/founder accounts.
const MOD_SECRET = process.env.MOD_SECRET || 'cloz-mod-secret'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  if (body.secret !== MOD_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = String(body.email || '').trim().toLowerCase()
  const role = String(body.role || '').trim()
  if (!email || !ROLES.includes(role as any)) {
    return NextResponse.json({ error: 'email and a valid role are required' }, { status: 400 })
  }

  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
  if (!user) return NextResponse.json({ error: `No account found for ${email}` }, { status: 404 })

  const updated = await prisma.user.update({
    where: { id: user.id }, data: { role, frozen: false },
    select: { id: true, email: true, username: true, role: true },
  })
  return NextResponse.json({ success: true, user: updated })
}
