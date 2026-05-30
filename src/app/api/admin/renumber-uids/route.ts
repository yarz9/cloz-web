import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// One-off: assign sequential UIDs by registration order (oldest = #1).
// Guarded by MOD_SECRET. Safe to re-run.
const MOD_SECRET = process.env.MOD_SECRET || 'cloz-mod-secret'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }
  if (body.secret !== MOD_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Shift existing uids out of the way to avoid unique collisions mid-renumber,
  // then number 1..N by createdAt ascending, then reset the autoincrement sequence.
  await prisma.$executeRawUnsafe(`UPDATE "User" SET uid = uid + 1000000`)
  await prisma.$executeRawUnsafe(`
    WITH ordered AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) AS rn FROM "User"
    )
    UPDATE "User" u SET uid = o.rn FROM ordered o WHERE u.id = o.id
  `)
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"User"', 'uid'), COALESCE((SELECT MAX(uid) FROM "User"), 1))`
  )

  const sample = await prisma.user.findMany({
    select: { uid: true, username: true, role: true },
    orderBy: { uid: 'asc' }, take: 10,
  })
  return NextResponse.json({ success: true, sample })
}
