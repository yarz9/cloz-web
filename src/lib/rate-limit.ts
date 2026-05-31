import { NextRequest, NextResponse } from 'next/server'

// Lightweight in-memory rate limiter. Fine for a single Railway instance —
// module state persists across requests. Swap for Redis if you ever scale out.

type Bucket = { count: number; reset: number }
const store = new Map<string, Bucket>()

// Periodic cleanup of expired buckets
const cleanup = setInterval(() => {
  const now = Date.now()
  for (const [k, v] of store) if (now > v.reset) store.delete(k)
}, 60_000)
;(cleanup as any).unref?.()

export function clientIp(req: NextRequest | Request): string {
  const xff = req.headers.get('x-forwarded-for') || ''
  const first = xff.split(',')[0].trim()
  return first || req.headers.get('x-real-ip') || 'unknown'
}

/**
 * Returns null if allowed, or a 429 NextResponse if the limit is exceeded.
 * @param key   logical bucket (e.g. "login")
 * @param req   request (for client IP)
 * @param limit max requests per window
 * @param windowMs window length in ms
 */
export function checkRateLimit(key: string, req: NextRequest | Request, limit: number, windowMs: number): NextResponse | null {
  const id = `${key}:${clientIp(req)}`
  const now = Date.now()
  const b = store.get(id)

  if (!b || now > b.reset) {
    store.set(id, { count: 1, reset: now + windowMs })
    return null
  }
  if (b.count >= limit) {
    const retryAfter = Math.ceil((b.reset - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests — please slow down and try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }
  b.count++
  return null
}
