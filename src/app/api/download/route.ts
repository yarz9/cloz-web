import { NextRequest, NextResponse } from 'next/server'

// Streams the installer through our own domain so the GitHub release URL is
// never exposed to the client. Works with a private repo when GITHUB_TOKEN is
// set (fine-grained PAT with Contents:Read on the repo), and falls back to
// unauthenticated access while the repo is still public.

const REPO = process.env.GITHUB_RELEASE_REPO || 'yarz9/cloz-web'
const TAG = process.env.INSTALLER_TAG || 'v2.0.0'
const ASSET_NAME = process.env.INSTALLER_ASSET || 'ClozOptimizer-Setup-2.0.0.exe'

export const runtime = 'nodejs'
// Don't cache — always resolve a fresh signed asset URL
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const token = process.env.GITHUB_TOKEN
  const ghHeaders: Record<string, string> = {
    'User-Agent': 'cloz-web-download-proxy',
    Accept: 'application/vnd.github+json',
  }
  if (token) ghHeaders.Authorization = `Bearer ${token}`

  try {
    // 1. Look up the release by tag to find the asset id
    const relRes = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${TAG}`, {
      headers: ghHeaders,
      cache: 'no-store',
    })
    if (!relRes.ok) {
      return NextResponse.json(
        { error: 'Download is temporarily unavailable. Please try again shortly.' },
        { status: 502 },
      )
    }
    const release = await relRes.json()
    const asset = (release.assets || []).find((a: any) => a.name === ASSET_NAME)
    if (!asset) {
      return NextResponse.json({ error: 'Installer not found for this release.' }, { status: 404 })
    }

    // 2. Fetch the asset bytes (octet-stream). GitHub 302-redirects to a signed
    //    URL which fetch follows automatically — we stream the result back.
    const assetRes = await fetch(asset.url, {
      headers: {
        'User-Agent': 'cloz-web-download-proxy',
        Accept: 'application/octet-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    })
    if (!assetRes.ok || !assetRes.body) {
      return NextResponse.json({ error: 'Could not retrieve the installer.' }, { status: 502 })
    }

    const headers = new Headers()
    headers.set('Content-Type', 'application/octet-stream')
    headers.set('Content-Disposition', `attachment; filename="${ASSET_NAME}"`)
    const len = assetRes.headers.get('content-length')
    if (len) headers.set('Content-Length', len)
    headers.set('Cache-Control', 'no-store')

    return new NextResponse(assetRes.body, { status: 200, headers })
  } catch {
    return NextResponse.json({ error: 'Download failed. Please try again.' }, { status: 500 })
  }
}
