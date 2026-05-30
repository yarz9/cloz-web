import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function getUserFromBearer(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const payload = verifyToken(auth.slice(7))
  if (!payload) return null
  return prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } })
}

export async function GET(req: NextRequest) {
  const user = await getUserFromBearer(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const devices = await prisma.device.findMany({
    where: { userId: user.id },
    orderBy: { lastSeen: 'desc' },
  })

  return NextResponse.json({ devices })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromBearer(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, hwid, os } = await req.json()
  if (!name || !hwid) return NextResponse.json({ error: 'name and hwid required' }, { status: 400 })

  const device = await prisma.device.upsert({
    where: { userId_hwid: { userId: user.id, hwid } },
    create: { userId: user.id, name, hwid, os },
    update: { name, os, lastSeen: new Date() },
  })

  return NextResponse.json({ device })
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromBearer(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deviceId } = await req.json()
  if (!deviceId) return NextResponse.json({ error: 'deviceId required' }, { status: 400 })

  await prisma.device.deleteMany({ where: { id: deviceId, userId: user.id } })
  return NextResponse.json({ success: true })
}
