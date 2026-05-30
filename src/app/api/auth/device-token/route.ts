import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const COOKIE_NAME = 'cloz_token'

/**
 * Returns the current session's JWT so the desktop app can capture it
 * during the browser-based device-linking flow. Cookie-authenticated.
 */
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  return NextResponse.json({ token })
}
