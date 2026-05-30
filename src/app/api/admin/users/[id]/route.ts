import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { isStaff, canManage, canAssignRole, ROLES } from '@/lib/roles'

// Modify a user: change role, freeze/unfreeze, set plan/verified.
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await ctx.params
  if (id === me.id) return NextResponse.json({ error: "You can't modify your own account here" }, { status: 400 })

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // You can only act on users strictly below your own rank
  if (!canManage(me.role, target.role)) {
    return NextResponse.json({ error: 'You cannot manage a user of equal or higher rank' }, { status: 403 })
  }

  const body = await req.json()
  const data: Record<string, any> = {}

  if (typeof body.role === 'string') {
    if (!ROLES.includes(body.role as any)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    if (!canAssignRole(me.role, body.role)) {
      return NextResponse.json({ error: 'You cannot assign a role at or above your own' }, { status: 403 })
    }
    data.role = body.role
  }
  if (typeof body.frozen === 'boolean') data.frozen = body.frozen
  if (typeof body.verified === 'boolean') data.verified = body.verified
  if (typeof body.plan === 'string' && ['free', 'pro', 'lifetime'].includes(body.plan)) data.plan = body.plan

  if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, role: true, frozen: true, verified: true, plan: true },
  })
  return NextResponse.json({ user: updated })
}

// Delete a user (founder+ only, target must be below your rank)
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await ctx.params
  if (id === me.id) return NextResponse.json({ error: "You can't delete your own account here" }, { status: 400 })

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (!canManage(me.role, target.role)) {
    return NextResponse.json({ error: 'You cannot delete a user of equal or higher rank' }, { status: 403 })
  }

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
