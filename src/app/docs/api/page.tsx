import Link from 'next/link'
import { Code, ArrowLeft, Lock, Globe } from 'lucide-react'

export const metadata = { title: 'API Reference — ClozOptimizer' }

const groups = [
  {
    name: 'Authentication', endpoints: [
      { m: 'POST', path: '/api/auth/register', d: 'Create an account, returns a JWT + session cookie' },
      { m: 'POST', path: '/api/auth/login', d: 'Login with email/username + password' },
      { m: 'GET', path: '/api/auth/me', d: 'Current user (cookie or Bearer token)', auth: true },
      { m: 'POST', path: '/api/auth/forgot-password', d: 'Request a password reset token' },
      { m: 'POST', path: '/api/auth/reset-password', d: 'Consume token, set a new password' },
      { m: 'GET', path: '/api/auth/device-token', d: 'Hand the session JWT to the desktop app (device link)', auth: true },
    ],
  },
  {
    name: 'Marketplace', endpoints: [
      { m: 'GET', path: '/api/marketplace', d: 'Browse presets — category, search, sort, limit, featured' },
      { m: 'POST', path: '/api/marketplace', d: 'Publish a preset (pending moderation)', auth: true },
      { m: 'GET', path: '/api/marketplace/:id', d: 'Preset detail + reviews + versions' },
      { m: 'POST', path: '/api/marketplace/:id', d: 'Record a download / install' },
      { m: 'POST', path: '/api/marketplace/:id/moderate', d: 'Approve / deny (bot, shared secret)', auth: true },
    ],
  },
  {
    name: 'Licensing', endpoints: [
      { m: 'POST', path: '/api/license/activate', d: 'Activate a key, link to account, set plan', auth: true },
      { m: 'GET', path: '/api/license/activate', d: 'List licenses on the account', auth: true },
    ],
  },
  {
    name: 'Cloud Sync & Account', endpoints: [
      { m: 'GET/POST/PUT', path: '/api/sync', d: 'Get / set / batch-sync user data (Bearer)', auth: true },
      { m: 'GET/POST/DELETE', path: '/api/devices', d: 'Device registration & management', auth: true },
      { m: 'PATCH/DELETE', path: '/api/account', d: 'Update profile / delete account', auth: true },
      { m: 'GET/POST/DELETE', path: '/api/favorites', d: 'User favorites', auth: true },
      { m: 'POST/DELETE', path: '/api/follow', d: 'Follow / unfollow creators', auth: true },
      { m: 'GET', path: '/api/users/:id', d: 'Public creator profile + stats' },
    ],
  },
]

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Link href="/docs" className="text-[0.75rem] text-[rgba(255,255,255,0.4)] hover:text-white flex items-center gap-1 mb-6"><ArrowLeft size={13} /> Back to Docs</Link>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center"><Code size={18} className="text-[#60a5fa]" /></div>
        <h1 className="text-3xl font-extrabold tracking-tight">API Reference</h1>
      </div>
      <p className="text-[0.85rem] text-[rgba(255,255,255,0.45)] mb-4 leading-relaxed">
        The Cloz backend exposes a REST API consumed by the website and desktop app. Authenticated
        endpoints accept a session cookie (web) or a <code className="text-[#60a5fa]">Bearer</code> token (desktop).
      </p>
      <div className="glass rounded-lg px-4 py-3 mb-10 flex items-center gap-2 text-[0.75rem] text-[rgba(255,255,255,0.4)]">
        <Globe size={14} className="text-[#4ade80]" /> Base URL: <code className="text-white">{process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</code>
      </div>

      <div className="space-y-10">
        {groups.map(g => (
          <div key={g.name}>
            <h2 className="text-lg font-bold mb-4">{g.name}</h2>
            <div className="glass rounded-xl overflow-hidden">
              {g.endpoints.map((e, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <span className="text-[0.6rem] font-bold px-2 py-1 rounded bg-[rgba(96,165,250,0.12)] text-[#60a5fa] w-24 text-center shrink-0">{e.m}</span>
                  <code className="text-[0.78rem] text-[rgba(255,255,255,0.8)] shrink-0">{e.path}</code>
                  <span className="text-[0.72rem] text-[rgba(255,255,255,0.35)] flex-1">{e.d}</span>
                  {e.auth && <Lock size={11} className="text-[rgba(255,255,255,0.25)] shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
