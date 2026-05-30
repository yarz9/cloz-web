import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Helper to extract user from Bearer token (for desktop app API calls)
async function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const payload = verifyToken(auth.slice(7))
  if (!payload) return null
  return prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } })
}

// GET — retrieve synced data
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  if (key) {
    const data = await prisma.syncData.findUnique({
      where: { userId_key: { userId: user.id, key } },
    })
    return NextResponse.json({ key, value: data?.value ? JSON.parse(data.value) : null })
  }

  // Return all sync data
  const allData = await prisma.syncData.findMany({
    where: { userId: user.id },
    select: { key: true, value: true, updatedAt: true },
  })

  const result: Record<string, any> = {}
  for (const d of allData) {
    result[d.key] = { value: JSON.parse(d.value), updatedAt: d.updatedAt }
  }

  return NextResponse.json({ data: result })
}

// POST — save/update synced data
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { key, value } = body

  if (!key) return NextResponse.json({ error: 'Key is required' }, { status: 400 })

  await prisma.syncData.upsert({
    where: { userId_key: { userId: user.id, key } },
    create: { userId: user.id, key, value: JSON.stringify(value) },
    update: { value: JSON.stringify(value) },
  })

  return NextResponse.json({ success: true, key })
}

// PUT — batch sync multiple keys
export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { items } = body // Array of { key, value }

  if (!Array.isArray(items)) return NextResponse.json({ error: 'Items array required' }, { status: 400 })

  const results = []
  for (const item of items) {
    if (!item.key) continue
    await prisma.syncData.upsert({
      where: { userId_key: { userId: user.id, key: item.key } },
      create: { userId: user.id, key: item.key, value: JSON.stringify(item.value) },
      update: { value: JSON.stringify(item.value) },
    })
    results.push(item.key)
  }

  return NextResponse.json({ success: true, synced: results })
}
