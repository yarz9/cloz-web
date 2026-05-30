import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth'

// PATCH — update profile (displayName, bio, avatarUrl)
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const data: Record<string, any> = {}

  if (typeof body.displayName === 'string') data.displayName = body.displayName.slice(0, 60)
  if (typeof body.bio === 'string') data.bio = body.bio.slice(0, 280)
  if (typeof body.avatarUrl === 'string') {
    const v = body.avatarUrl
    // Allow clearing, an http(s) URL, or a reasonably-sized inline image data URL
    if (v === '') {
      data.avatarUrl = null
    } else if (/^https?:\/\//.test(v)) {
      data.avatarUrl = v.slice(0, 1000)
    } else if (/^data:image\/(png|jpeg|jpg|webp);base64,/.test(v)) {
      if (v.length > 1_500_000) {
        return NextResponse.json({ error: 'Image too large (max ~1MB). Try a smaller picture.' }, { status: 400 })
      }
      data.avatarUrl = v
    } else {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }
  }

  // Password change (requires current password)
  if (body.newPassword) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: 'Current password required' }, { status: 400 })
    }
    const full = await prisma.user.findUnique({ where: { id: user.id } })
    if (!full || !(await verifyPassword(body.currentPassword, full.passwordHash))) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be 8+ characters' }, { status: 400 })
    }
    data.passwordHash = await hashPassword(body.newPassword)
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: {
      id: true, email: true, username: true, displayName: true,
      avatarUrl: true, bio: true, role: true, verified: true, plan: true,
    },
  })

  return NextResponse.json({ user: updated })
}

// DELETE — delete account
export async function DELETE() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.user.delete({ where: { id: user.id } })
  return NextResponse.json({ success: true })
}
