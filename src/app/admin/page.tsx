'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { ROLES, ROLE_LABELS, ROLE_COLORS, rank } from '@/lib/roles'
import {
  Shield, Users, Package, Search, Loader2, Trash2, Snowflake, CheckCircle2,
  Star, Eye, EyeOff, ShieldCheck, Crown, BarChart3, TrendingUp, Download, Key,
} from 'lucide-react'

interface AdminUser {
  id: string; uid?: number; email: string; username: string; displayName: string | null; avatarUrl: string | null
  role: string; verified: boolean; frozen: boolean; plan: string; createdAt: string
  _count: { presets: number; reviews: number; followers: number }
}
interface AdminPreset {
  id: string; slug: string; name: string; category: string; published: boolean; verified: boolean
  featured: boolean; downloadCount: number; ratingAvg: number
  author: { username: string; displayName: string | null }
}

function RoleBadge({ role }: { role: string }) {
  const c = ROLE_COLORS[role] || '#94a3b8'
  return (
    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full" style={{ background: `${c}1a`, color: c }}>
      {ROLE_LABELS[role] || role}
    </span>
  )
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<'analytics' | 'users' | 'marketplace'>('analytics')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [presets, setPresets] = useState<AdminPreset[]>([])
  const [stats, setStats] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const myRank = rank(user?.role)

  const loadUsers = useCallback(async () => {
    setBusy(true)
    try {
      const p = new URLSearchParams(); if (search) p.set('search', search)
      const res = await fetch(`/api/admin/users?${p}`)
      const d = await res.json(); setUsers(d.users || [])
    } catch {} setBusy(false)
  }, [search])

  const loadPresets = useCallback(async () => {
    setBusy(true)
    try {
      const p = new URLSearchParams(); if (search) p.set('search', search)
      const res = await fetch(`/api/admin/presets?${p}`)
      const d = await res.json(); setPresets(d.presets || [])
    } catch {} setBusy(false)
  }, [search])

  const loadStats = useCallback(async () => {
    setBusy(true)
    try { const res = await fetch('/api/admin/analytics'); setStats(await res.json()) } catch {}
    setBusy(false)
  }, [])

  useEffect(() => {
    if (!user) return
    const t = setTimeout(() => {
      if (tab === 'users') loadUsers()
      else if (tab === 'marketplace') loadPresets()
      else loadStats()
    }, 250)
    return () => clearTimeout(t)
  }, [tab, user, loadUsers, loadPresets, loadStats])

  const patchUser = async (id: string, body: any) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.ok) loadUsers()
    else alert((await res.json()).error || 'Failed')
  }
  const deleteUser = async (u: AdminUser) => {
    if (!confirm(`Permanently delete @${u.username}? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    if (res.ok) loadUsers(); else alert((await res.json()).error || 'Failed')
  }
  const patchPreset = async (id: string, body: any) => {
    const res = await fetch(`/api/admin/presets/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.ok) loadPresets()
  }
  const deletePreset = async (p: AdminPreset) => {
    if (!confirm(`Delete preset "${p.name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/presets/${p.id}`, { method: 'DELETE' })
    if (res.ok) loadPresets()
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>

  if (!user || rank(user.role) < rank('admin')) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <Shield size={32} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
        <h1 className="text-xl font-bold mb-2">Access denied</h1>
        <p className="text-[rgba(255,255,255,0.4)] text-[0.85rem] mb-6">This area is for staff only.</p>
        <Link href="/" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck size={26} className="text-[#60a5fa]" />
        <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        <RoleBadge role={user.role} />
      </div>
      <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)] mb-8">Manage users, roles, and the marketplace.</p>

      <div className="flex gap-1 glass rounded-lg p-1 mb-6 w-fit">
        {(['analytics', 'users', 'marketplace'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setSearch('') }}
            className={`px-5 py-2 rounded-md text-[0.8rem] font-medium capitalize flex items-center gap-2 transition-all ${tab === t ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
            {t === 'analytics' ? <BarChart3 size={14} /> : t === 'users' ? <Users size={14} /> : <Package size={14} />} {t}
          </button>
        ))}
      </div>

      {tab === 'analytics' && stats && (
        <div className="space-y-5 mb-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.users.total, sub: `+${stats.users.new7d} this week`, icon: Users, color: '#60a5fa' },
              { label: 'Pro / Lifetime', value: stats.users.pro, sub: `${stats.users.frozen} frozen`, icon: Crown, color: '#fbbf24' },
              { label: 'Total Downloads', value: stats.content.downloads.toLocaleString(), sub: `${stats.content.presets} presets`, icon: Download, color: '#4ade80' },
              { label: 'Reviews', value: stats.content.reviews, sub: `${stats.content.favorites} favorites`, icon: Star, color: '#a78bfa' },
            ].map(c => (
              <div key={c.label} className="glass rounded-2xl p-5">
                <c.icon size={18} style={{ color: c.color }} className="mb-3" />
                <div className="text-2xl font-extrabold">{c.value}</div>
                <div className="text-[0.72rem] text-[rgba(255,255,255,0.4)] mt-1">{c.label}</div>
                <div className="text-[0.62rem] text-[rgba(255,255,255,0.25)] mt-1 flex items-center gap-1"><TrendingUp size={10} /> {c.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Key stock */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4"><Key size={15} className="text-[#fbbf24]" /><h3 className="text-[0.9rem] font-bold">License Stock</h3></div>
              <div className="space-y-2">
                {(['monthly', '3month', 'yearly', 'lifetime'] as const).map(p => {
                  const s = stats.stock[p] || { available: 0, sold: 0 }
                  const label = { monthly: '1 Month', '3month': '3 Months', yearly: '12 Months', lifetime: 'Lifetime' }[p]
                  return (
                    <div key={p} className="flex items-center justify-between text-[0.78rem]">
                      <span className="text-[rgba(255,255,255,0.5)]">{label}</span>
                      <span className="flex items-center gap-3">
                        <span className={s.available < 25 ? 'text-[#f87171]' : 'text-[#4ade80]'}>{s.available} avail</span>
                        <span className="text-[rgba(255,255,255,0.35)]">{s.sold} sold</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Roles breakdown */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4"><ShieldCheck size={15} className="text-[#60a5fa]" /><h3 className="text-[0.9rem] font-bold">Users by Role</h3></div>
              <div className="space-y-2">
                {['developer', 'founder', 'admin', 'moderator', 'user'].map(r => (
                  <div key={r} className="flex items-center justify-between text-[0.78rem]">
                    <span style={{ color: ROLE_COLORS[r] || '#94a3b8' }}>{ROLE_LABELS[r] || r}</span>
                    <span className="font-semibold text-[rgba(255,255,255,0.6)]">{stats.users.byRole[r] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent signups + top presets */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-[0.9rem] font-bold mb-4">Recent Signups</h3>
              <div className="space-y-2">
                {stats.recentUsers.map((u: any) => (
                  <div key={u.uid} className="flex items-center justify-between text-[0.75rem]">
                    <span className="text-[rgba(255,255,255,0.55)]">#{u.uid} @{u.username}</span>
                    <span className="text-[rgba(255,255,255,0.3)]">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-[0.9rem] font-bold mb-4">Top Presets</h3>
              <div className="space-y-2">
                {stats.topPresets.map((p: any) => (
                  <div key={p.slug} className="flex items-center justify-between text-[0.75rem]">
                    <span className="text-[rgba(255,255,255,0.55)] truncate">{p.name}</span>
                    <span className="text-[rgba(255,255,255,0.3)] flex items-center gap-1 shrink-0"><Download size={10} /> {p.downloadCount}</span>
                  </div>
                ))}
                {stats.topPresets.length === 0 && <div className="text-[0.72rem] text-[rgba(255,255,255,0.3)]">No presets yet</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`relative mb-5 ${tab === 'analytics' ? 'hidden' : ''}`}>
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.2)]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={tab === 'users' ? 'Search users…' : 'Search presets…'}
          className="w-full glass rounded-xl py-3 pl-11 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" />
      </div>

      {busy && <div className="py-4 text-center"><Loader2 size={18} className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>}

      {/* USERS */}
      {tab === 'users' && (
        <div className="space-y-2">
          {users.map(u => {
            const manageable = myRank > rank(u.role)
            return (
              <div key={u.id} className="glass rounded-xl p-4 flex items-center gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-[0.8rem] font-bold text-white shrink-0 overflow-hidden">
                  {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" /> : (u.displayName || u.username).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] font-semibold truncate">{u.displayName || u.username}</span>
                    <RoleBadge role={u.role} />
                    {u.verified && <CheckCircle2 size={12} className="text-[#60a5fa]" />}
                    {u.frozen && <Snowflake size={12} className="text-[#7dd3fc]" />}
                  </div>
                  <div className="text-[0.66rem] text-[rgba(255,255,255,0.3)]">#{u.uid ?? '—'} · @{u.username} · {u.email} · {u.plan}</div>
                </div>

                {manageable ? (
                  <div className="flex items-center gap-2">
                    <select value={u.role} onChange={e => patchUser(u.id, { role: e.target.value })}
                      className="glass-strong rounded-lg py-1.5 px-2 text-[0.72rem] outline-none cursor-pointer">
                      {ROLES.filter(r => myRank > rank(r) || r === u.role).map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                    <button onClick={() => patchUser(u.id, { frozen: !u.frozen })}
                      title={u.frozen ? 'Unfreeze' : 'Freeze'}
                      className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] font-medium flex items-center gap-1 ${u.frozen ? 'bg-[rgba(125,211,252,0.12)] text-[#7dd3fc]' : 'glass-strong text-[rgba(255,255,255,0.5)] hover:text-[#7dd3fc]'}`}>
                      <Snowflake size={12} /> {u.frozen ? 'Frozen' : 'Freeze'}
                    </button>
                    <button onClick={() => deleteUser(u)} title="Delete"
                      className="px-2.5 py-1.5 rounded-lg text-[0.7rem] text-[#f87171] hover:bg-[rgba(248,113,113,0.08)]">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <span className="text-[0.62rem] text-[rgba(255,255,255,0.2)] flex items-center gap-1"><Crown size={11} /> protected</span>
                )}
              </div>
            )
          })}
          {!busy && users.length === 0 && <div className="text-center py-12 text-[rgba(255,255,255,0.3)] text-[0.85rem]">No users found</div>}
        </div>
      )}

      {/* MARKETPLACE */}
      {tab === 'marketplace' && (
        <div className="space-y-2">
          {presets.map(p => (
            <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/marketplace/${p.slug}`} className="text-[0.85rem] font-semibold truncate hover:text-[#60a5fa]">{p.name}</Link>
                  {p.verified && <ShieldCheck size={12} className="text-[#60a5fa]" />}
                  {p.featured && <Star size={12} className="text-[#fbbf24]" fill="#fbbf24" />}
                  {!p.published && <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-[rgba(248,113,113,0.12)] text-[#f87171]">UNPUBLISHED</span>}
                </div>
                <div className="text-[0.66rem] text-[rgba(255,255,255,0.3)]">{p.category} · by @{p.author.username} · {p.downloadCount} downloads · ★ {p.ratingAvg.toFixed(1)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => patchPreset(p.id, { published: !p.published })} title={p.published ? 'Unpublish' : 'Publish'}
                  className="px-2.5 py-1.5 rounded-lg text-[0.7rem] glass-strong text-[rgba(255,255,255,0.5)] hover:text-white flex items-center gap-1">
                  {p.published ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
                <button onClick={() => patchPreset(p.id, { verified: !p.verified })} title="Toggle verified"
                  className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] flex items-center gap-1 ${p.verified ? 'bg-[rgba(96,165,250,0.12)] text-[#60a5fa]' : 'glass-strong text-[rgba(255,255,255,0.5)]'}`}>
                  <ShieldCheck size={12} />
                </button>
                <button onClick={() => patchPreset(p.id, { featured: !p.featured })} title="Toggle featured"
                  className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] flex items-center gap-1 ${p.featured ? 'bg-[rgba(251,191,36,0.12)] text-[#fbbf24]' : 'glass-strong text-[rgba(255,255,255,0.5)]'}`}>
                  <Star size={12} />
                </button>
                <button onClick={() => deletePreset(p)} title="Delete"
                  className="px-2.5 py-1.5 rounded-lg text-[0.7rem] text-[#f87171] hover:bg-[rgba(248,113,113,0.08)]">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {!busy && presets.length === 0 && <div className="text-center py-12 text-[rgba(255,255,255,0.3)] text-[0.85rem]">No presets found</div>}
        </div>
      )}
    </div>
  )
}
