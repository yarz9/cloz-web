import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendLicenseEmail } from '@/lib/email'
import { syncDiscordRoles } from '@/lib/discord-roles'

// Sell.app order webhook. On a completed sale we link the delivered key to a
// matching account (if one exists), mark our stock as sold, sync Discord, and
// send a branded receipt. Field paths are parsed defensively since sell.app
// payloads vary — adjust the extractors below to match your store if needed.
//
// Auth: set SELLAPP_WEBHOOK_SECRET in Railway and the same value as a header
// (x-sellapp-secret) on the webhook in your sell.app dashboard.

const SECRET = process.env.SELLAPP_WEBHOOK_SECRET || ''

function deepFindEmail(obj: any): string | null {
  try {
    const s = JSON.stringify(obj)
    const m = s.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    return m ? m[0].toLowerCase() : null
  } catch { return null }
}

function planFromText(text: string): { plan: string; tier: string } {
  const t = (text || '').toLowerCase()
  if (t.includes('life')) return { plan: 'lifetime', tier: 'lifetime' }
  if (t.includes('12') || t.includes('year') || t.includes('annual')) return { plan: 'yearly', tier: 'pro' }
  if (t.includes('3') && t.includes('month')) return { plan: '3month', tier: 'pro' }
  return { plan: 'monthly', tier: 'pro' }
}

function findKey(obj: any): string | null {
  // Look for a CLOZ-style key anywhere in the payload (delivered serial)
  try {
    const s = JSON.stringify(obj)
    const m = s.match(/CLOZ-[A-Z0-9-]{6,}/i)
    return m ? m[0].toUpperCase() : null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  if (SECRET) {
    const provided = req.headers.get('x-sellapp-secret') || req.headers.get('x-signature') || ''
    if (provided !== SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ ok: true }) }

  const email = deepFindEmail(body)
  const productText = JSON.stringify(body?.data?.listing || body?.data?.product || body?.data || '')
  const { plan, tier } = planFromText(productText)
  const key = findKey(body)

  // We never auto-create accounts. Only link if the buyer already has one.
  if (email) {
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
    if (user) {
      if (key) {
        // Attach (or create) the license and mark it sold to this account
        await prisma.license.upsert({
          where: { key },
          create: { key, plan, status: 'active', userId: user.id, activatedAt: new Date() },
          update: { userId: user.id, status: 'active', activatedAt: new Date() },
        })
      }
      await prisma.user.update({ where: { id: user.id }, data: { plan: tier } })
      const full = await prisma.user.findUnique({ where: { id: user.id }, select: { discordId: true } })
      if (full?.discordId) await syncDiscordRoles(full.discordId, tier, true).catch(() => {})
      if (key) sendLicenseEmail(email, plan, key).catch(() => {})
    }
  }

  // Always 200 so sell.app doesn't retry-storm
  return NextResponse.json({ ok: true })
}
