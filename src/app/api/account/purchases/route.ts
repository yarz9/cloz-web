import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Presets the user owns (acquired via the buy flow — free or paid).
export async function GET() {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ purchases: [] })

  const rows = await prisma.download.findMany({
    where: { userId: me.id },
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      preset: {
        select: {
          id: true, slug: true, name: true, category: true, price: true, version: true,
          author: { select: { username: true, displayName: true } },
        },
      },
    },
    take: 200,
  })

  // De-dupe by preset (a preset may have multiple download rows)
  const seen = new Set<string>()
  const purchases = []
  for (const r of rows) {
    if (!r.preset || seen.has(r.preset.id)) continue
    seen.add(r.preset.id)
    purchases.push({ ...r.preset, acquiredAt: r.createdAt })
  }
  return NextResponse.json({ purchases })
}
