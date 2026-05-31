import { prisma } from '@/lib/db'

// Create an in-app notification. Never notify yourself; never throw.
export async function notify(opts: {
  userId: string
  actorId?: string
  type: 'reply' | 'review' | 'follow' | 'system'
  message: string
  link?: string
}) {
  try {
    if (opts.actorId && opts.actorId === opts.userId) return
    await prisma.notification.create({
      data: { userId: opts.userId, type: opts.type, message: opts.message, link: opts.link },
    })
  } catch { /* notifications are best-effort */ }
}
