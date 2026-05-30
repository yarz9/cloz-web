import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// Start the Discord OAuth flow to link an account.
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cloz-optimizer.up.railway.app').replace(/\/$/, '')

export async function GET(_req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.redirect(`${APP_URL}/login?next=/account`)

  const clientId = process.env.DISCORD_CLIENT_ID
  if (!clientId) return NextResponse.redirect(`${APP_URL}/account?discord=unconfigured`)

  const redirectUri = `${APP_URL}/api/auth/discord/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
    state: me.id, // callback re-verifies the session cookie anyway
    prompt: 'consent',
  })
  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
}
