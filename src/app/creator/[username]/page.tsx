'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import {
  Package, Download, Star, Users, Shield, Sparkles, CheckCircle2,
  Loader2, Calendar, UserPlus, UserCheck, Crown
} from 'lucide-react'
import { RoleBadge, UidTag } from '@/components/RoleBadge'

export default function CreatorProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    fetch(`/api/users/${username}`).then(r => r.json()).then(d => {
      if (d.user) setProfile(d.user)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [username])

  const toggleFollow = async () => {
    if (!currentUser || !profile) return
    await fetch('/api/follow', {
      method: following ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id }),
    })
    setFollowing(!following)
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <Users size={32} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
        <h1 className="text-xl font-bold mb-3">Creator not found</h1>
        <Link href="/marketplace" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Browse Marketplace</Link>
      </div>
    )
  }

  const stats = profile.stats || {}
  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Profile header */}
      <div className="glass-strong rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.05),transparent_70%)]" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-3xl font-bold text-white shrink-0">
            {(profile.displayName || profile.username).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold">{profile.displayName || profile.username}</h1>
              {profile.verified && <CheckCircle2 size={18} className="text-[#60a5fa]" />}
              <RoleBadge role={profile.role} />
            </div>
            <p className="text-[0.8rem] text-[rgba(255,255,255,0.4)] flex items-center gap-2">@{profile.username} <UidTag uid={profile.uid} /></p>
            {profile.bio && <p className="text-[0.82rem] text-[rgba(255,255,255,0.5)] mt-3 max-w-lg leading-relaxed">{profile.bio}</p>}
            <div className="flex items-center gap-2 mt-3 text-[0.68rem] text-[rgba(255,255,255,0.25)]">
              <Calendar size={11} /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          {currentUser && !isOwnProfile && (
            <button onClick={toggleFollow}
              className={`px-5 py-2.5 rounded-lg text-[0.8rem] font-bold flex items-center gap-2 transition-all ${following ? 'btn-white' : 'btn-primary'}`}>
              {following ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
            </button>
          )}
          {isOwnProfile && (
            <Link href="/dashboard" className="btn-white px-5 py-2.5 rounded-lg text-[0.8rem] font-medium">Edit in Dashboard</Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Package, label: 'Presets', value: stats.totalPresets ?? 0, color: '#60a5fa' },
          { icon: Download, label: 'Downloads', value: (stats.totalDownloads ?? 0).toLocaleString(), color: '#4ade80' },
          { icon: Star, label: 'Avg Rating', value: stats.avgRating ?? '0.0', color: '#fbbf24' },
          { icon: Users, label: 'Followers', value: stats.followerCount ?? 0, color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}15` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <h2 className="text-lg font-bold mb-4">Published Presets</h2>
      {profile.presets && profile.presets.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {profile.presets.map((p: any) => (
            <Link key={p.id} href={`/marketplace/${p.slug}`} className="glass rounded-xl p-5 glass-hover transition-all flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-[rgba(96,165,250,0.12)] flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-[#60a5fa]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[0.85rem] font-semibold truncate">{p.name}</span>
                  {p.verified && <Shield size={11} className="text-[#60a5fa] shrink-0" />}
                </div>
                <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)] capitalize">{p.category}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-[0.68rem] text-[#fbbf24] justify-end"><Star size={10} fill="#fbbf24" /> {p.ratingAvg.toFixed(1)}</div>
                <div className="text-[0.6rem] text-[rgba(255,255,255,0.2)]">{(p.downloadCount / 1000).toFixed(1)}k</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <Package size={28} className="mx-auto mb-3 text-[rgba(255,255,255,0.12)]" />
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.3)]">No published presets yet</p>
        </div>
      )}
    </div>
  )
}
