import { NextRequest, NextResponse } from 'next/server'
import { getLatestRelease, streamAsset } from '@/lib/github-release'

// electron-updater generic feed. The app requests:
//   /api/update/latest.yml                       (update metadata)
//   /api/update/ClozOptimizer-Setup-<ver>.exe     (the installer)
//   /api/update/ClozOptimizer-Setup-<ver>.exe.blockmap (delta map)
// We resolve each by exact filename from the newest GitHub release and stream
// it back, so updates flow through our domain and work with a private repo.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params
  const name = decodeURIComponent(file)

  if (!/^[A-Za-z0-9._-]+$/.test(name) || name.length > 120) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  }

  const release = await getLatestRelease()
  if (!release) {
    return NextResponse.json({ error: 'No release available' }, { status: 502 })
  }

  const asset = release.assets.find(a => a.name === name)
  if (!asset) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isYml = name.endsWith('.yml') || name.endsWith('.yaml')
  const contentType = isYml ? 'text/yaml; charset=utf-8' : 'application/octet-stream'

  const streamed = await streamAsset(asset, contentType)
  if (!streamed) {
    return NextResponse.json({ error: 'Could not retrieve update file' }, { status: 502 })
  }
  return streamed
}
