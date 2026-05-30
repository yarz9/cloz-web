import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { syncDiscordRoles } from '@/lib/discord-roles'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cloz-optimizer.up.railway.app').replace(/\/$/, '')

export async function GET(req: NextRequest) {
  const me = await getCurrentUser()
  if (!me) return NextResponse.redirect(`${APP_URL}/login`)

  const code = new URL(req.url).searchParams.get('code')
  if (!code) return NextResponse.redirect(`${APP_URL}/account?discord=denied`)

  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  if (!clientId || !clientSecret) return NextResponse.redirect(`${APP_URL}/account?discord=unconfigured`)

  const redirectUri = `${APP_URL}/api/auth/discord/callback`

  try {
    // Exchange the code for a token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret,
        grant_type: 'authorization_code', code, redirect_uri: redirectUri,
      }),
    })
    if (!tokenRes.ok) return NextResponse.redirect(`${APP_URL}/account?discord=error`)
    const tok = await tokenRes.json()

    // Identify the Discord user
    const meRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tok.access_token}` },
    })
    if (!meRes.ok) return NextResponse.redirect(`${APP_URL}/account?discord=error`)
    const dUser = await meRes.json()

    // Prevent linking the same Discord to two accounts
    const taken = await prisma.user.findFirst({ where: { discordId: dUser.id, NOT: { id: me.id } } })
    if (taken) return NextResponse.redirect(`${APP_URL}/account?discord=taken`)

    await prisma.user.update({ where: { id: me.id }, data: { discordId: dUser.id } })

    // Grant roles based on plan + creator status
    const isCreator = (await prisma.preset.count({ where: { authorId: me.id, published: true } })) > 0
      || ['developer', 'founder', 'admin', 'moderator'].includes(me.role)
    await syncDiscordRoles(dUser.id, me.plan, isCreator)

    return NextResponse.redirect(`${APP_URL}/account?discord=linked`)
  } catch {
    return NextResponse.redirect(`${APP_URL}/account?discord=error`)
  }
}
