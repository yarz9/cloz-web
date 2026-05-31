import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const preset = await prisma.preset.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      author: { select: { id: true, uid: true, username: true, displayName: true, avatarUrl: true, bio: true, role: true } },
      reviews: {
        include: { user: { select: { uid: true, username: true, displayName: true, avatarUrl: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      versions: { orderBy: { createdAt: 'desc' }, take: 10 },
      _count: { select: { reviews: true, favorites: true, downloads: true } },
    },
  })

  if (!preset) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Check if current user favorited / owns it
  const user = await getCurrentUser()
  let isFavorited = false
  let owned = false
  if (user) {
    const fav = await prisma.favorite.findUnique({
      where: { presetId_userId: { presetId: preset.id, userId: user.id } },
    })
    isFavorited = !!fav
    if (preset.authorId === user.id) owned = true
    else owned = !!(await prisma.download.findFirst({ where: { presetId: preset.id, userId: user.id } }))
  }

  return NextResponse.json({
    preset: {
      ...preset,
      tags: preset.tags ? JSON.parse(preset.tags) : [],
      screenshots: preset.screenshots ? JSON.parse(preset.screenshots) : [],
      isFavorited,
      owned,
    },
  })
}

// Download / install a preset
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()

  const preset = await prisma.preset.findFirst({ where: { OR: [{ id }, { slug: id }] } })
  if (!preset) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Increment download count
  await prisma.preset.update({
    where: { id: preset.id },
    data: { downloadCount: { increment: 1 } },
  })

  // Record download
  if (user) {
    await prisma.download.create({
      data: { presetId: preset.id, userId: user.id, version: preset.version },
    })
  }

  return NextResponse.json({
    configData: preset.configData ? JSON.parse(preset.configData) : {},
    version: preset.version,
  })
}
