import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Acquire a preset. Free presets just record ownership; paid ones transfer
// credits (C$) from buyer to author.
export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const { id } = await ctx.params
  const preset = await prisma.preset.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    select: { id: true, price: true, authorId: true, name: true },
  })
  if (!preset) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Author owns their own work
  if (preset.authorId === me.id) return NextResponse.json({ owned: true, balance: me.credits ?? 0 })

  // Already owned?
  const already = await prisma.download.findFirst({ where: { presetId: preset.id, userId: me.id } })
  if (already) return NextResponse.json({ owned: true, balance: me.credits ?? 0 })

  // Free preset → just record ownership
  if (!preset.price || preset.price <= 0) {
    await prisma.download.create({ data: { presetId: preset.id, userId: me.id } })
    await prisma.preset.update({ where: { id: preset.id }, data: { downloadCount: { increment: 1 } } })
    return NextResponse.json({ owned: true, free: true, balance: me.credits ?? 0 })
  }

  // Paid → check balance, transfer credits, record ownership (atomic)
  const balance = me.credits ?? 0
  if (balance < preset.price) {
    return NextResponse.json({ error: `Not enough credits — you need ${preset.price} C$ but have ${balance} C$.`, balance }, { status: 402 })
  }

  const [buyer] = await prisma.$transaction([
    prisma.user.update({ where: { id: me.id }, data: { credits: { decrement: preset.price } }, select: { credits: true } }),
    prisma.user.update({ where: { id: preset.authorId }, data: { credits: { increment: preset.price } } }),
    prisma.download.create({ data: { presetId: preset.id, userId: me.id } }),
    prisma.preset.update({ where: { id: preset.id }, data: { downloadCount: { increment: 1 } } }),
  ])

  return NextResponse.json({ owned: true, balance: buyer.credits, spent: preset.price })
}
