'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Users, Search, Star, Download, Package, CheckCircle2, Crown, Loader2, UserPlus } from 'lucide-react'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles'
import { UidTag } from '@/components/RoleBadge'

interface Creator {
  id: string; uid?: number; username: string; displayName: string | null; avatarUrl: string | null; bio: string | null
  role: string; verified: boolean; presetCount: number; followers: number; downloads: number; avgRating: number
}

const sorts = [
  { id: 'downloads', label: 'Most Downloads' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'presets', label: 'Most Presets' },
  { id: 'followers', label: 'Most Followed' },
]

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('downloads')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sort })
      if (search) params.set('search', search)
      const res = await fetch(`/api/creators?${params}`)
      const data = await res.json()
      setCreators(data.creators || [])
    } catch {}
    setLoading(false)
  }, [sort, search])

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"><span className="gradient-text">Creators</span></h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg max-w-xl mx-auto">Browse the community — discover creators and the presets they&apos;ve published</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.2)]" />
          <input className="w-full glass rounded-xl py-3 pl-11 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.15)]"
            placeholder="Search creators..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="glass rounded-xl py-3 px-4 text-[0.8rem] outline-none cursor-pointer">
          {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 size={24} className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>
      ) : creators.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((c, i) => (
            <Link key={c.id} href={`/creator/${c.username}`} className="glass rounded-2xl p-6 glass-hover transition-all block relative overflow-hidden">
              {i < 3 && sort === 'downloads' && (
                <span className="absolute top-3 right-3 text-[0.55rem] font-bold px-2 py-0.5 rounded-full bg-[rgba(251,191,36,0.12)] text-[#fbbf24]">#{i + 1}</span>
              )}
              <div className="flex items-center gap-3 mb-4">
                {c.avatarUrl ? (
                  <img src={c.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-lg font-bold text-white shrink-0">
                    {(c.displayName || c.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[0.92rem] font-bold truncate">{c.displayName || c.username}</span>
                    {c.verified && <CheckCircle2 size={13} className="text-[#60a5fa] shrink-0" />}
                    {c.role && c.role !== 'user' && (
                      <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: `${ROLE_COLORS[c.role] || '#94a3b8'}1a`, color: ROLE_COLORS[c.role] || '#94a3b8' }}>
                        {ROLE_LABELS[c.role] || c.role}
                      </span>
                    )}
                  </div>
                  <div className="text-[0.66rem] text-[rgba(255,255,255,0.3)] flex items-center gap-1.5">@{c.username} <UidTag uid={c.uid} /></div>
                </div>
              </div>
              {c.bio && <p className="text-[0.72rem] text-[rgba(255,255,255,0.4)] leading-relaxed mb-4 line-clamp-2">{c.bio}</p>}
              <div className="flex items-center justify-between text-[0.66rem] text-[rgba(255,255,255,0.4)] pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <span className="flex items-center gap-1"><Package size={11} /> {c.presetCount}</span>
                <span className="flex items-center gap-1"><Download size={11} /> {(c.downloads / 1000).toFixed(1)}k</span>
                <span className="flex items-center gap-1 text-[#fbbf24]"><Star size={11} fill="#fbbf24" /> {c.avgRating}</span>
                <span className="flex items-center gap-1"><UserPlus size={11} /> {c.followers}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Users size={32} className="mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
          <p className="text-[rgba(255,255,255,0.3)]">No creators found</p>
        </div>
      )}
    </div>
  )
}
