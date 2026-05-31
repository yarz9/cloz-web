'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { RoleBadge } from '@/components/RoleBadge'
import ChatBox from '@/components/ChatBox'
import {
  MessagesSquare, Search, Plus, Pin, Lock, MessageSquare, Eye, Loader2, Megaphone, HelpCircle, Package, Coffee, Hash,
} from 'lucide-react'

export const CATS = [
  { id: 'all', label: 'All', icon: Hash, color: '#94a3b8' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, color: '#fbbf24' },
  { id: 'general', label: 'General', icon: MessagesSquare, color: '#60a5fa' },
  { id: 'support', label: 'Support', icon: HelpCircle, color: '#4ade80' },
  { id: 'presets', label: 'Presets', icon: Package, color: '#a78bfa' },
  { id: 'offtopic', label: 'Off-topic', icon: Coffee, color: '#22d3ee' },
]

interface Thread {
  id: string; title: string; category: string; pinned: boolean; locked: boolean; views: number
  lastPostAt: string
  author: { uid?: number; username: string; displayName: string | null; avatarUrl: string | null; role?: string }
  _count: { posts: number }
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function ForumPage() {
  const { user } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<{ threads: number; posts: number; members: number } | null>(null)

  useEffect(() => { fetch('/api/forum/stats').then(r => r.json()).then(setStats).catch(() => {}) }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (cat !== 'all') p.set('category', cat)
      if (search) p.set('search', search)
      const res = await fetch(`/api/forum/threads?${p}`)
      const d = await res.json()
      setThreads(d.threads || [])
    } catch {}
    setLoading(false)
  }, [cat, search])

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])

  const catMeta = (id: string) => CATS.find(c => c.id === id) || CATS[2]

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3"><MessagesSquare className="text-[#60a5fa]" /> Community Forum</h1>
          <p className="text-[0.85rem] text-[rgba(255,255,255,0.4)] mt-1">Discuss optimization, share presets, get support.</p>
        </div>
        {user
          ? <Link href="/forum/new" className="btn-primary px-5 py-2.5 rounded-lg text-[0.82rem] font-bold flex items-center gap-2"><Plus size={15} /> New Thread</Link>
          : <Link href="/login?next=/forum" className="btn-white px-5 py-2.5 rounded-lg text-[0.82rem] font-medium">Sign in to post</Link>}
      </div>

      {stats && (
        <div className="flex gap-6 mb-5 text-[0.72rem] text-[rgba(255,255,255,0.4)]">
          <span><b className="text-white font-bold">{stats.threads}</b> threads</span>
          <span><b className="text-white font-bold">{stats.posts}</b> posts</span>
          <span><b className="text-white font-bold">{stats.members}</b> members</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex gap-1.5 flex-wrap">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`px-3.5 py-2 rounded-lg text-[0.74rem] font-medium flex items-center gap-1.5 transition-all ${cat === c.id ? 'glass-strong text-white' : 'glass text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
              <c.icon size={13} style={{ color: cat === c.id ? c.color : undefined }} /> {c.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.2)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads…"
            className="w-full glass rounded-lg py-2.5 pl-10 pr-4 text-[0.82rem] outline-none focus:border-[rgba(96,165,250,0.3)]" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_330px] gap-5 items-start">
        <div>
      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>
      ) : threads.length ? (
        <div className="glass rounded-2xl overflow-hidden divide-y divide-[rgba(255,255,255,0.05)]">
          {threads.map(t => {
            const cm = catMeta(t.category)
            return (
              <Link key={t.id} href={`/forum/${t.id}`} className="flex items-center gap-4 p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cm.color}14` }}>
                  <cm.icon size={15} style={{ color: cm.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {t.pinned && <Pin size={12} className="text-[#fbbf24] shrink-0" />}
                    {t.locked && <Lock size={12} className="text-[rgba(255,255,255,0.3)] shrink-0" />}
                    <span className="text-[0.88rem] font-semibold truncate">{t.title}</span>
                  </div>
                  <div className="text-[0.66rem] text-[rgba(255,255,255,0.35)] flex items-center gap-1.5 mt-0.5">
                    by {t.author.displayName || t.author.username} <RoleBadge role={t.author.role} size="xs" /> · {timeAgo(t.lastPostAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[0.68rem] text-[rgba(255,255,255,0.35)] shrink-0">
                  <span className="flex items-center gap-1"><MessageSquare size={11} /> {t._count.posts}</span>
                  <span className="flex items-center gap-1"><Eye size={11} /> {t.views}</span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <MessagesSquare size={32} className="mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
          <p className="text-[rgba(255,255,255,0.3)]">No threads yet — start the conversation!</p>
        </div>
      )}
        </div>
        <div className="lg:sticky lg:top-20"><ChatBox /></div>
      </div>
    </div>
  )
}
