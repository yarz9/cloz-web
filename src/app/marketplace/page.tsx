'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Store, Palette, Gamepad2, Monitor, Puzzle, Star, Download, Search, Sparkles,
  SlidersHorizontal, Layout, Layers, Shield, Crown, ArrowRight, Loader2, Lock
} from 'lucide-react'
import { RoleBadge } from '@/components/RoleBadge'

const categories = [
  { id: 'all', label: 'All', icon: Store },
  { id: 'ui', label: 'UI Presets', icon: Palette },
  { id: 'game', label: 'Game Profiles', icon: Gamepad2 },
  { id: 'windows', label: 'Windows Presets', icon: Monitor },
  { id: 'optimization', label: 'Opt. Profiles', icon: SlidersHorizontal },
  { id: 'theme', label: 'Themes', icon: Layers },
  { id: 'dashboard', label: 'Dashboards', icon: Layout },
  { id: 'widget', label: 'Widgets', icon: Puzzle },
]

const catColors: Record<string, string> = {
  ui: '#22d3ee', game: '#f87171', windows: '#4ade80', optimization: '#60a5fa',
  theme: '#a78bfa', dashboard: '#fbbf24', widget: '#22d3ee',
}

interface Preset {
  id: string; slug: string; name: string; description: string; category: string
  version: string; tags: string[]; downloadCount: number; ratingAvg: number; ratingCount: number
  verified: boolean; featured: boolean
  price: number
  author: { username: string; displayName: string | null; role?: string }
}

function PresetCard({ preset }: { preset: Preset }) {
  const color = catColors[preset.category] || '#60a5fa'
  return (
    <Link href={`/marketplace/${preset.slug}`} className="glass rounded-xl overflow-hidden glass-hover transition-all group block">
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
              <Sparkles size={15} style={{ color }} />
            </div>
            <div>
              <div className="text-[0.82rem] font-semibold group-hover:text-white transition-colors flex items-center gap-2">
                {preset.name}
                {preset.verified && <Shield size={11} className="text-[#60a5fa]" />}
              </div>
              <div className="text-[0.62rem] text-[rgba(255,255,255,0.3)] flex items-center gap-1.5">by {preset.author.displayName || preset.author.username} <RoleBadge role={preset.author.role} size="xs" /></div>
            </div>
          </div>
          {preset.price > 0
            ? <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-[rgba(251,191,36,0.12)] text-[#fbbf24] shrink-0">{preset.price} C$</span>
            : <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-[rgba(74,222,128,0.1)] text-[#4ade80] shrink-0">Free</span>}
        </div>
        <p className="text-[0.7rem] text-[rgba(255,255,255,0.35)] leading-relaxed mb-3 line-clamp-2">{preset.description}</p>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {preset.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[0.58rem] glass text-[rgba(255,255,255,0.3)]">{t}</span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <span className="flex items-center gap-1 text-[0.65rem] text-[rgba(255,255,255,0.3)]">
              <Download size={11} /> {(preset.downloadCount / 1000).toFixed(1)}k
            </span>
            <span className="flex items-center gap-1 text-[0.65rem] text-[#fbbf24]">
              <Star size={11} fill="#fbbf24" /> {preset.ratingAvg.toFixed(1)}
            </span>
          </div>
          <span className="text-[0.62rem] text-[rgba(255,255,255,0.2)] capitalize">{preset.category}</span>
        </div>
      </div>
    </Link>
  )
}

export default function MarketplacePage() {
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState<'all' | 'verified' | 'featured'>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [presets, setPresets] = useState<Preset[]>([])
  const [featured, setFeatured] = useState<Preset[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPresets = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    params.set('sort', sort)
    params.set('limit', '50')
    try {
      const res = await fetch(`/api/marketplace?${params}`)
      const data = await res.json()
      let list: Preset[] = data.presets || []
      if (filter === 'verified') list = list.filter(p => p.verified)
      if (filter === 'featured') list = list.filter(p => p.featured)
      setPresets(list)
    } catch {}
    setLoading(false)
  }, [category, search, sort, filter])

  useEffect(() => { fetchPresets() }, [fetchPresets])

  useEffect(() => {
    fetch('/api/marketplace?featured=true&limit=3').then(r => r.json()).then(d => setFeatured(d.presets || [])).catch(() => {})
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"><span className="gradient-text">Marketplace</span></h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg max-w-xl mx-auto">Community presets, game configs, themes, and optimization profiles — synced to the cloud</p>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="glass-strong rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown size={14} className="text-[#fbbf24]" />
            <span className="text-[0.72rem] font-semibold text-[#fbbf24]">Featured</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map(p => (
              <Link key={p.id} href={`/marketplace/${p.slug}`} className="glass rounded-xl p-4 glass-hover transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${catColors[p.category] || '#60a5fa'}12` }}>
                  <Sparkles size={20} style={{ color: catColors[p.category] || '#60a5fa' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[0.85rem] font-semibold truncate">{p.name}</div>
                  <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)]">{(p.downloadCount / 1000).toFixed(1)}k downloads · {p.ratingAvg.toFixed(1)} stars</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search + sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.2)]" />
          <input
            className="w-full glass rounded-xl py-3 pl-11 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.15)]"
            placeholder="Search presets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="glass rounded-xl py-3 px-4 text-[0.8rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all cursor-pointer">
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {([['all', 'All Content'], ['verified', 'Verified'], ['featured', 'Featured']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id as any)}
            className={`px-3.5 py-1.5 rounded-full text-[0.7rem] font-medium transition-all ${filter === id ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)]'}`}>
            {id === 'verified' && <Shield size={10} className="inline mr-1" />}
            {id === 'featured' && <Crown size={10} className="inline mr-1" />}
            {label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map(c => {
          const Icon = c.icon
          const active = category === c.id
          return (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[0.75rem] font-medium transition-all ${active ? 'glass-strong text-white border-[rgba(96,165,250,0.2)]' : 'text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.02)]'}`}>
              <Icon size={13} /> {c.label}
            </button>
          )
        })}
        {/* App Extensions — coming soon */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.75rem] font-medium text-[rgba(255,255,255,0.2)] cursor-not-allowed relative">
          <Lock size={12} /> Extensions
          <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.04)]">Soon</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center"><Loader2 size={24} className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>
      ) : presets.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map(p => <PresetCard key={p.id} preset={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Store size={32} className="mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
          <p className="text-[rgba(255,255,255,0.3)]">No presets found</p>
        </div>
      )}

      {/* Creator CTA */}
      <div className="glass-strong rounded-2xl p-10 text-center mt-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.06),transparent_70%)]" />
        <h3 className="text-2xl font-bold mb-3">Create &amp; Publish</h3>
        <p className="text-[rgba(255,255,255,0.4)] mb-6 max-w-md mx-auto">Build presets, game configs, and themes. Share with the community. Build your reputation.</p>
        <Link href="/marketplace/create" className="btn-primary px-6 py-3 rounded-xl text-[0.85rem] font-bold inline-flex items-center gap-2">
          Publish a Preset <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
