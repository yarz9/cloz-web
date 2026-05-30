import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presetId } = await req.json()
  if (!presetId) return NextResponse.json({ error: 'presetId required' }, { status: 400 })

  try {
    await prisma.favorite.create({
      data: { presetId, userId: user.id },
    })
    return NextResponse.json({ favorited: true })
  } catch {
    return NextResponse.json({ error: 'Already favorited' }, { status: 409 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presetId } = await req.json()
  if (!presetId) return NextResponse.json({ error: 'presetId required' }, { status: 400 })

  await prisma.favorite.deleteMany({
    where: { presetId, userId: user.id },
  })
  return NextResponse.json({ favorited: false })
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      preset: {
        include: { author: { select: { username: true, displayName: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ favorites })
}
