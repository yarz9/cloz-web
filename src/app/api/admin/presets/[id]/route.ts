import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { isStaff } from '@/lib/roles'

// Moderate a preset: publish/unpublish, verify, feature. Staff only.
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await ctx.params
  const body = await req.json()
  const data: Record<string, any> = {}
  if (typeof body.published === 'boolean') data.published = body.published
  if (typeof body.verified === 'boolean') data.verified = body.verified
  if (typeof body.featured === 'boolean') data.featured = body.featured
  if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  try {
    const updated = await prisma.preset.update({
      where: { id }, data,
      select: { id: true, published: true, verified: true, featured: true },
    })
    return NextResponse.json({ preset: updated })
  } catch {
    return NextResponse.json({ error: 'Preset not found' }, { status: 404 })
  }
}

// Delete a preset. Staff only.
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await ctx.params
  try {
    await prisma.preset.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Preset not found' }, { status: 404 })
  }
}
