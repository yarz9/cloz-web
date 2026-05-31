import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Lightweight forum stats for the header strip.
export async function GET() {
  const [threads, posts, members, latest] = await Promise.all([
    prisma.thread.count(),
    prisma.post.count(),
    prisma.user.count(),
    prisma.thread.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { author: { select: { username: true } } },
    }),
  ])
  return NextResponse.json({
    threads,
    posts: posts + threads, // opening posts count too
    members,
    newest: latest?.author?.username || null,
  })
}
