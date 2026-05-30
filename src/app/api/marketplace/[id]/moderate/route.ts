import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const MOD_SECRET = process.env.MOD_SECRET || 'cloz-mod-secret'

/**
 * Moderation endpoint called by the Discord bot when a moderator clicks
 * Approve / Deny / Approve+Verify on a marketplace submission embed.
 * Secured by a shared secret.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { action, secret, moderator } = body

  if (secret !== MOD_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const preset = await prisma.preset.findUnique({ where: { id } })
  if (!preset) return NextResponse.json({ error: 'Preset not found' }, { status: 404 })

  if (action === 'approve') {
    await prisma.preset.update({ where: { id }, data: { published: true } })
    return NextResponse.json({ success: true, status: 'approved', name: preset.name })
  }
  if (action === 'verify') {
    await prisma.preset.update({ where: { id }, data: { published: true, verified: true } })
    return NextResponse.json({ success: true, status: 'approved_verified', name: preset.name })
  }
  if (action === 'deny') {
    await prisma.preset.update({ where: { id }, data: { published: false } })
    return NextResponse.json({ success: true, status: 'denied', name: preset.name })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
