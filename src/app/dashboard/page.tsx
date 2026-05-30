'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import {
  LayoutDashboard, Download, Star, Users, Package, Plus, Loader2,
  Eye, EyeOff, Shield, Sparkles, TrendingUp, ChevronRight
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (user) {
      fetch('/api/dashboard/presets').then(r => r.json()).then(d => { setData(d); setLoadingData(false) }).catch(() => setLoadingData(false))
    }
  }, [user])

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <LayoutDashboard size={32} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
        <h1 className="text-xl font-bold mb-3">Sign in required</h1>
        <p className="text-[rgba(255,255,255,0.4)] mb-6 text-[0.85rem]">Sign in to access your creator dashboard.</p>
        <Link href="/login" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Sign In</Link>
      </div>
    )
  }

  const stats = data?.stats || {}
  const presets = data?.presets || []

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(96,165,250,0.15)] to-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] flex items-center justify-center">
              <LayoutDashboard size={18} className="text-[#60a5fa]" />
            </div>
            <h1 className="text-2xl font-extrabold">Creator Dashboard</h1>
          </div>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">Manage and publish your marketplace content</p>
        </div>
        <Link href="/marketplace/create" className="btn-primary px-5 py-2.5 rounded-lg text-[0.82rem] font-bold flex items-center gap-2">
          <Plus size={15} /> Publish New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Package} label="Presets" value={stats.totalPresets ?? 0} color="#60a5fa" />
        <StatCard icon={Download} label="Total Downloads" value={(stats.totalDownloads ?? 0).toLocaleString()} color="#4ade80" />
        <StatCard icon={Star} label="Avg Rating" value={stats.avgRating ?? '0.0'} color="#fbbf24" />
        <StatCard icon={Users} label="Followers" value={stats.followerCount ?? 0} color="#a78bfa" />
      </div>

      {/* Presets list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Your Presets</h2>
        <Link href={`/creator/${user.username}`} className="text-[0.75rem] text-[#60a5fa] hover:underline flex items-center gap-1">
          View public profile <ChevronRight size={13} />
        </Link>
      </div>

      {loadingData ? (
        <div className="py-12 text-center"><Loader2 size={20} className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>
      ) : presets.length > 0 ? (
        <div className="space-y-3">
          {presets.map((p: any) => (
            <div key={p.id} className="glass rounded-xl p-5 flex items-center gap-4 glass-hover transition-all">
              <div className="w-11 h-11 rounded-lg bg-[rgba(96,165,250,0.12)] flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-[#60a5fa]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[0.88rem] font-semibold">{p.name}</span>
                  {p.verified && <Shield size={12} className="text-[#60a5fa]" />}
                  {p.published
                    ? <span className="flex items-center gap-1 text-[0.6rem] text-[#4ade80]"><Eye size={10} /> Published</span>
                    : <span className="flex items-center gap-1 text-[0.6rem] text-[rgba(255,255,255,0.3)]"><EyeOff size={10} /> Draft</span>}
                </div>
                <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)] capitalize">{p.category} · v{p.version}</div>
              </div>
              <div className="flex items-center gap-5 text-[0.7rem] text-[rgba(255,255,255,0.4)]">
                <span className="flex items-center gap-1"><Download size={12} /> {p.downloadCount.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-[#fbbf24]"><Star size={12} fill="#fbbf24" /> {p.ratingAvg.toFixed(1)}</span>
              </div>
              <Link href={`/marketplace/${p.slug}`} className="text-[rgba(255,255,255,0.2)] hover:text-white transition-colors">
                <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <Package size={32} className="mx-auto mb-4 text-[rgba(255,255,255,0.12)]" />
          <h3 className="text-[0.95rem] font-bold mb-2">No presets yet</h3>
          <p className="text-[0.78rem] text-[rgba(255,255,255,0.35)] mb-6 max-w-sm mx-auto">
            Publish your first preset, game config, or theme to start building your creator reputation.
          </p>
          <Link href="/marketplace/create" className="btn-primary px-6 py-2.5 rounded-lg text-[0.82rem] font-bold inline-flex items-center gap-2">
            <Plus size={15} /> Publish Your First Preset
          </Link>
        </div>
      )}
    </div>
  )
}
