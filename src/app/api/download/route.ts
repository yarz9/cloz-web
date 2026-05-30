import { NextRequest, NextResponse } from 'next/server'
import { getLatestRelease, streamAsset } from '@/lib/github-release'

// Streams the latest installer through our own domain so the GitHub release
// URL is never exposed. Always serves the newest published release, so the
// download button stays current as versions bump.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Match the NSIS installer asset regardless of version (e.g. ClozOptimizer-Setup-2.0.1.exe)
const INSTALLER_RE = /^ClozOptimizer-Setup-.*\.exe$/

export async function GET(_req: NextRequest) {
  const release = await getLatestRelease()
  if (!release) {
    return NextResponse.json(
      { error: 'Download is temporarily unavailable. Please try again shortly.' },
      { status: 502 },
    )
  }

  const asset = release.assets.find(a => INSTALLER_RE.test(a.name))
  if (!asset) {
    return NextResponse.json({ error: 'Installer not found for the latest release.' }, { status: 404 })
  }

  const streamed = await streamAsset(asset, 'application/octet-stream', asset.name)
  if (!streamed) {
    return NextResponse.json({ error: 'Could not retrieve the installer.' }, { status: 502 })
  }
  return streamed
}
