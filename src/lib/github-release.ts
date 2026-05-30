// Helpers for serving GitHub release assets through our own domain.
// Works with a private repo when GITHUB_TOKEN is set (fine-grained PAT,
// Contents: Read), and unauthenticated while the repo is still public.

const REPO = process.env.GITHUB_RELEASE_REPO || 'yarz9/cloz-web'

function ghHeaders(extra: Record<string, string> = {}) {
  const token = process.env.GITHUB_TOKEN
  return {
    'User-Agent': 'cloz-web',
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

export interface GhAsset { id: number; name: string; url: string; size: number }
export interface GhRelease { tag_name: string; assets: GhAsset[] }

// Fetch the newest published (non-draft, non-prerelease) release.
export async function getLatestRelease(): Promise<GhRelease | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: ghHeaders(), cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

// Stream a release asset's bytes. Returns a Response or null if not found.
export async function streamAsset(asset: GhAsset, contentType: string, filename?: string): Promise<Response | null> {
  const token = process.env.GITHUB_TOKEN
  const assetRes = await fetch(asset.url, {
    headers: {
      'User-Agent': 'cloz-web',
      Accept: 'application/octet-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  })
  if (!assetRes.ok || !assetRes.body) return null

  const headers = new Headers()
  headers.set('Content-Type', contentType)
  if (filename) headers.set('Content-Disposition', `attachment; filename="${filename}"`)
  const len = assetRes.headers.get('content-length')
  if (len) headers.set('Content-Length', len)
  headers.set('Cache-Control', 'no-store')
  return new Response(assetRes.body, { status: 200, headers })
}
