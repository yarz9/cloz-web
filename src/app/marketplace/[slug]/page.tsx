'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { RoleBadge, UidTag } from '@/components/RoleBadge'
import {
  Star, Download, Heart, Shield, ArrowLeft, Clock, Tag, Monitor,
  ChevronRight, User, MessageSquare, CheckCircle2, Sparkles, Copy,
  ExternalLink, Calendar, Package, Loader2, Send
} from 'lucide-react'

interface PresetDetail {
  id: string; slug: string; name: string; description: string; longDesc: string | null
  category: string; version: string; tags: string[]; screenshots: string[]
  downloadCount: number; ratingAvg: number; ratingCount: number
  verified: boolean; featured: boolean; createdAt: string; updatedAt: string
  author: { id: string; uid?: number; username: string; displayName: string | null; avatarUrl: string | null; bio: string | null; role?: string }
  reviews: { id: string; rating: number; comment: string | null; createdAt: string; user: { uid?: number; username: string; displayName: string | null; avatarUrl: string | null; role?: string } }[]
  versions: { id: string; version: string; changelog: string | null; createdAt: string }[]
  _count: { reviews: number; favorites: number; downloads: number }
  isFavorited: boolean
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
          stroke={i <= Math.round(rating) ? '#fbbf24' : 'rgba(255,255,255,0.15)'} strokeWidth={1.5} />
      ))}
    </div>
  )
}

export default function PresetDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()
  const [preset, setPreset] = useState<PresetDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'reviews' | 'versions'>('overview')
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [favorited, setFavorited] = useState(false)
  // Review form
  const [myRating, setMyRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

  const loadPreset = useCallback(async () => {
    try {
      const res = await fetch(`/api/marketplace/${slug}`)
      const data = await res.json()
      if (data.preset) {
        setPreset(data.preset)
        setFavorited(data.preset.isFavorited)
        // Pre-fill the form if the user already reviewed
        const mine = user && data.preset.reviews?.find((r: any) => r.user.username === user.username)
        if (mine) { setMyRating(mine.rating); setMyComment(mine.comment || '') }
      }
    } catch {} finally { setLoading(false) }
  }, [slug, user])

  useEffect(() => { loadPreset() }, [loadPreset])

  const submitReview = async () => {
    if (!preset || myRating < 1) { setReviewMsg('Please pick a star rating'); return }
    setSubmittingReview(true); setReviewMsg('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: preset.id, rating: myRating, comment: myComment.trim() || null }),
      })
      const data = await res.json()
      if (res.ok) { setReviewMsg('Thanks for your review!'); await loadPreset() }
      else setReviewMsg(data.error || 'Failed to submit review')
    } catch { setReviewMsg('Connection error') }
    setSubmittingReview(false)
  }

  const handleInstall = async () => {
    if (!preset) return
    setInstalling(true)
    try {
      // Record the download/install against the preset, and add to the user's
      // library (favorite) so it syncs to their account. Actual on-device
      // installation happens in the ClozOptimizer desktop app.
      await fetch(`/api/marketplace/${preset.id}`, { method: 'POST' })
      if (!favorited) {
        await fetch('/api/favorites', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ presetId: preset.id }),
        }).then(r => { if (r.ok) setFavorited(true) }).catch(() => {})
      }
      setInstalled(true)
    } catch {}
    setInstalling(false)
  }

  const handleFavorite = async () => {
    if (!preset) return
    try {
      await fetch('/api/favorites', {
        method: favorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: preset.id }),
      })
      setFavorited(!favorited)
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" />
      </div>
    )
  }

  if (!preset) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Preset Not Found</h1>
        <p className="text-[rgba(255,255,255,0.4)] mb-8">This preset doesn&apos;t exist or has been removed.</p>
        <Link href="/marketplace" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>
      </div>
    )
  }

  const catColors: Record<string, string> = {
    ui: '#22d3ee', game: '#f87171', windows: '#4ade80', optimization: '#60a5fa',
    theme: '#a78bfa', dashboard: '#fbbf24', widget: '#22d3ee',
  }
  const color = catColors[preset.category] || '#60a5fa'

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.72rem] text-[rgba(255,255,255,0.3)] mb-8">
        <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
        <ChevronRight size={12} />
        <span className="capitalize">{preset.category}</span>
        <ChevronRight size={12} />
        <span className="text-[rgba(255,255,255,0.5)]">{preset.name}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        {/* Main content */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
              <Sparkles size={28} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold">{preset.name}</h1>
                {preset.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)]">
                    <Shield size={10} /> Verified
                  </span>
                )}
                {preset.featured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-[rgba(251,191,36,0.1)] text-[#fbbf24] border border-[rgba(251,191,36,0.2)]">
                    <Star size={10} /> Featured
                  </span>
                )}
              </div>
              <p className="text-[0.85rem] text-[rgba(255,255,255,0.45)] leading-relaxed">{preset.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={preset.ratingAvg} size={13} />
                  <span className="text-[0.72rem] text-[rgba(255,255,255,0.4)]">{preset.ratingAvg.toFixed(1)} ({preset.ratingCount})</span>
                </div>
                <span className="flex items-center gap-1 text-[0.72rem] text-[rgba(255,255,255,0.3)]">
                  <Download size={12} /> {preset.downloadCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-[0.72rem] text-[rgba(255,255,255,0.3)]">
                  <Heart size={12} /> {preset._count.favorites}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 glass rounded-lg p-1 mb-6">
            {(['overview', 'reviews', 'versions'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-md text-[0.78rem] font-medium capitalize transition-all ${tab === t ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)]'}`}>
                {t} {t === 'reviews' && `(${preset._count.reviews})`}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {preset.longDesc && (
                <div className="glass rounded-xl p-6">
                  <h3 className="text-[0.9rem] font-bold mb-3">Description</h3>
                  <p className="text-[0.8rem] text-[rgba(255,255,255,0.45)] leading-relaxed whitespace-pre-wrap">{preset.longDesc}</p>
                </div>
              )}
              <div className="glass rounded-xl p-6">
                <h3 className="text-[0.9rem] font-bold mb-3">Installation</h3>
                <ol className="space-y-2">
                  <li className="flex items-start gap-3 text-[0.8rem] text-[rgba(255,255,255,0.45)]">
                    <span className="w-5 h-5 rounded-full glass-strong flex items-center justify-center text-[0.65rem] font-bold shrink-0 mt-0.5">1</span>
                    Open ClozOptimizer and navigate to Marketplace
                  </li>
                  <li className="flex items-start gap-3 text-[0.8rem] text-[rgba(255,255,255,0.45)]">
                    <span className="w-5 h-5 rounded-full glass-strong flex items-center justify-center text-[0.65rem] font-bold shrink-0 mt-0.5">2</span>
                    Search for &quot;{preset.name}&quot; or browse the {preset.category} category
                  </li>
                  <li className="flex items-start gap-3 text-[0.8rem] text-[rgba(255,255,255,0.45)]">
                    <span className="w-5 h-5 rounded-full glass-strong flex items-center justify-center text-[0.65rem] font-bold shrink-0 mt-0.5">3</span>
                    Click Install — the preset will be applied automatically
                  </li>
                </ol>
              </div>
              {preset.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preset.tags.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full text-[0.68rem] glass text-[rgba(255,255,255,0.35)]">
                      <Tag size={10} className="inline mr-1" />{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {/* Write a review */}
              {user ? (
                <div className="glass-strong rounded-xl p-5 mb-2">
                  <h3 className="text-[0.85rem] font-bold mb-3">
                    {preset.reviews.some(r => r.user.username === user.username) ? 'Update your review' : 'Write a review'}
                  </h3>
                  <div className="flex items-center gap-1 mb-3" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} type="button" onClick={() => setMyRating(i)} onMouseEnter={() => setHoverRating(i)}
                        className="p-0.5 transition-transform hover:scale-110">
                        <Star size={22}
                          fill={i <= (hoverRating || myRating) ? '#fbbf24' : 'none'}
                          stroke={i <= (hoverRating || myRating) ? '#fbbf24' : 'rgba(255,255,255,0.25)'} strokeWidth={1.5} />
                      </button>
                    ))}
                    {myRating > 0 && <span className="text-[0.72rem] text-[rgba(255,255,255,0.4)] ml-2">{myRating}/5</span>}
                  </div>
                  <textarea value={myComment} onChange={e => setMyComment(e.target.value)} rows={3} maxLength={1000}
                    placeholder="Share your experience with this preset (optional)…"
                    className="w-full glass rounded-lg py-2.5 px-3.5 text-[0.8rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all resize-none placeholder:text-[rgba(255,255,255,0.18)]" />
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={submitReview} disabled={submittingReview || myRating < 1}
                      className="btn-primary px-5 py-2 rounded-lg text-[0.78rem] font-bold flex items-center gap-2 disabled:opacity-50">
                      {submittingReview ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Submit Review
                    </button>
                    {reviewMsg && <span className={`text-[0.72rem] ${reviewMsg.includes('Thank') ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{reviewMsg}</span>}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-5 mb-2 flex items-center justify-between">
                  <span className="text-[0.78rem] text-[rgba(255,255,255,0.4)]">Sign in to rate and review this preset</span>
                  <Link href="/login" className="btn-white px-4 py-2 rounded-lg text-[0.76rem] font-medium">Sign In</Link>
                </div>
              )}

              {preset.reviews.length > 0 ? preset.reviews.map(r => (
                <div key={r.id} className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    {r.user.avatarUrl ? (
                      <img src={r.user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full glass-strong flex items-center justify-center text-[0.65rem] font-bold">
                        {(r.user.displayName || r.user.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.8rem] font-semibold">{r.user.displayName || r.user.username}</span>
                        <RoleBadge role={r.user.role} size="xs" />
                        <UidTag uid={r.user.uid} />
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.rating} size={11} />
                        <span className="text-[0.62rem] text-[rgba(255,255,255,0.2)]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {r.comment && <p className="text-[0.78rem] text-[rgba(255,255,255,0.4)] leading-relaxed">{r.comment}</p>}
                </div>
              )) : (
                <div className="text-center py-12">
                  <MessageSquare size={24} className="mx-auto mb-3 text-[rgba(255,255,255,0.12)]" />
                  <p className="text-[0.82rem] text-[rgba(255,255,255,0.3)]">No reviews yet</p>
                  <p className="text-[0.7rem] text-[rgba(255,255,255,0.15)]">Be the first to review this preset</p>
                </div>
              )}
            </div>
          )}

          {tab === 'versions' && (
            <div className="space-y-3">
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-[rgba(74,222,128,0.1)] text-[#4ade80] border border-[rgba(74,222,128,0.15)]">
                    Latest
                  </span>
                  <span className="text-[0.85rem] font-bold">v{preset.version}</span>
                </div>
                <p className="text-[0.72rem] text-[rgba(255,255,255,0.3)]">
                  Released {new Date(preset.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {preset.versions.map(v => (
                <div key={v.id} className="glass rounded-xl p-5">
                  <div className="text-[0.82rem] font-semibold mb-1">v{v.version}</div>
                  <p className="text-[0.7rem] text-[rgba(255,255,255,0.3)] mb-1">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                  {v.changelog && <p className="text-[0.75rem] text-[rgba(255,255,255,0.4)]">{v.changelog}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Install card */}
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <button onClick={handleInstall} disabled={installing || installed}
              className="btn-primary w-full py-3.5 rounded-xl text-[0.88rem] font-bold flex items-center justify-center gap-2.5 mb-3">
              {installing ? <Loader2 size={16} className="animate-spin" /> : installed ? <CheckCircle2 size={16} /> : <Download size={16} />}
              {installing ? 'Adding…' : installed ? 'Added to your Library' : 'Get Preset'}
            </button>
            {installed && (
              <div className="mb-3 px-3 py-2.5 rounded-lg bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.15)] text-[0.72rem] text-[#4ade80] leading-relaxed">
                Added to your account. Open <span className="font-semibold">ClozOptimizer → Marketplace</span> (or My Items) on your PC to install it on this device.
              </div>
            )}
            <button onClick={handleFavorite}
              className={`btn-white w-full py-3 rounded-xl text-[0.82rem] font-medium flex items-center justify-center gap-2 ${favorited ? 'text-[#f87171] border-[rgba(248,113,113,0.2)]' : ''}`}>
              <Heart size={14} fill={favorited ? '#f87171' : 'none'} />
              {favorited ? 'Favorited' : 'Add to Favorites'}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-[0.75rem]">
                <span className="text-[rgba(255,255,255,0.3)]">Version</span>
                <span className="font-medium">{preset.version}</span>
              </div>
              <div className="flex justify-between text-[0.75rem]">
                <span className="text-[rgba(255,255,255,0.3)]">Category</span>
                <span className="font-medium capitalize">{preset.category}</span>
              </div>
              <div className="flex justify-between text-[0.75rem]">
                <span className="text-[rgba(255,255,255,0.3)]">Downloads</span>
                <span className="font-medium">{preset.downloadCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[0.75rem]">
                <span className="text-[rgba(255,255,255,0.3)]">Updated</span>
                <span className="font-medium">{new Date(preset.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-[0.75rem]">
                <span className="text-[rgba(255,255,255,0.3)]">Created</span>
                <span className="font-medium">{new Date(preset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Creator */}
            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.04)]">
              <div className="text-[0.65rem] text-[rgba(255,255,255,0.2)] uppercase tracking-wider font-semibold mb-3">Creator</div>
              <Link href={`/creator/${preset.author.username}`} className="flex items-center gap-3 group">
                {preset.author.avatarUrl ? (
                  <img src={preset.author.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-[0.75rem] font-bold text-white">
                    {(preset.author.displayName || preset.author.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.82rem] font-semibold group-hover:text-[#60a5fa] transition-colors">{preset.author.displayName || preset.author.username}</span>
                    <RoleBadge role={preset.author.role} size="xs" />
                  </div>
                  <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)] flex items-center gap-1.5">@{preset.author.username} <UidTag uid={preset.author.uid} /> · View profile →</div>
                </div>
              </Link>
              {preset.author.bio && (
                <p className="text-[0.72rem] text-[rgba(255,255,255,0.35)] mt-3 leading-relaxed">{preset.author.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
