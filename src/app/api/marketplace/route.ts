import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, verifyToken } from '@/lib/auth'

// Resolve user from cookie (website) OR Bearer token (desktop app)
async function resolvePublisher(req: NextRequest) {
  const cookieUser = await getCurrentUser()
  if (cookieUser) return cookieUser
  const auth = req.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) {
    const payload = verifyToken(auth.slice(7))
    if (payload) {
      return prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, username: true, role: true },
      })
    }
  }
  return null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')
  const sort = searchParams.get('sort') || 'popular'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

  const where: any = { published: true }
  if (category && category !== 'all') where.category = category
  if (featured === 'true') where.featured = true
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ]
  }

  const orderBy: any = sort === 'newest' ? { createdAt: 'desc' }
    : sort === 'rating' ? { ratingAvg: 'desc' }
    : { downloadCount: 'desc' }

  const [presets, total] = await Promise.all([
    prisma.preset.findMany({
      where, orderBy, skip: (page - 1) * limit, take: limit,
      include: {
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
    }),
    prisma.preset.count({ where }),
  ])

  return NextResponse.json({
    presets: presets.map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const user = await resolvePublisher(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, longDesc, category, tags, configData, compatibility, changelog } = body

  if (!name || !description || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const existing = await prisma.preset.findUnique({ where: { slug } })

  const preset = await prisma.preset.create({
    data: {
      slug: existing ? `${slug}-${Date.now().toString(36)}` : slug,
      name, description, longDesc, category,
      authorId: user.id,
      tags: tags ? JSON.stringify(tags) : null,
      configData: configData ? JSON.stringify(configData) : null,
      compatibility: compatibility ? JSON.stringify(compatibility) : null,
      changelog,
      published: false, // pending moderation — goes live after Discord approval
      verified: false,
    },
    include: { author: { select: { id: true, username: true, displayName: true } } },
  })

  // Send a Discord approval embed for the team to review (non-blocking)
  const { sendPresetApprovalEmbed } = await import('@/lib/discord')
  sendPresetApprovalEmbed({
    id: preset.id, slug: preset.slug, name: preset.name, description: preset.description,
    longDesc: preset.longDesc, category: preset.category, version: preset.version,
    tags: tags || [], configData, author: preset.author,
  }).catch(() => {})

  return NextResponse.json({ preset, status: 'pending_review' }, { status: 201 })
}
