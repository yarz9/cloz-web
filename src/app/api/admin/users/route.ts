import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { isStaff } from '@/lib/roles'

// List users for the admin panel (staff only). Supports ?search= and ?role=
export async function GET(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me || !isStaff(me.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim()
  const role = searchParams.get('role')?.trim()

  const where: any = {}
  if (role) where.role = role
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, uid: true, email: true, username: true, displayName: true, avatarUrl: true,
      role: true, verified: true, frozen: true, plan: true, createdAt: true,
      _count: { select: { presets: true, reviews: true, followers: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json({ users })
}
