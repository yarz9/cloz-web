import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await req.json()
  if (!userId || userId === user.id) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
  }

  try {
    await prisma.follow.create({ data: { followerId: user.id, followingId: userId } })
    return NextResponse.json({ following: true })
  } catch {
    return NextResponse.json({ error: 'Already following' }, { status: 409 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await req.json()
  await prisma.follow.deleteMany({ where: { followerId: user.id, followingId: userId } })
  return NextResponse.json({ following: false })
}
