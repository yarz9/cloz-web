'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { canSell } from '@/lib/roles'
import { Upload, Loader2, CheckCircle2, ArrowLeft, Palette, Gamepad2, Monitor, SlidersHorizontal, Layers, Layout, Puzzle, Shield } from 'lucide-react'

const categories = [
  { id: 'ui', label: 'UI Preset', icon: Palette },
  { id: 'game', label: 'Game Profile', icon: Gamepad2 },
  { id: 'windows', label: 'Windows Preset', icon: Monitor },
  { id: 'optimization', label: 'Optimization Profile', icon: SlidersHorizontal },
  { id: 'theme', label: 'Theme', icon: Layers },
  { id: 'dashboard', label: 'Dashboard Layout', icon: Layout },
  { id: 'widget', label: 'Widget', icon: Puzzle },
]

export default function CreatePresetPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', longDesc: '', category: 'ui', tags: '', changelog: '', compatibility: '', price: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <Upload size={32} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
        <h1 className="text-xl font-bold mb-3">Sign in to publish</h1>
        <Link href="/login" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Sign In</Link>
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSubmitting(true)
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price) || 0,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to publish'); setSubmitting(false); return }
      setSuccess(true)
      setTimeout(() => router.push(`/marketplace/${data.preset.slug}`), 1200)
    } catch { setError('Connection error'); setSubmitting(false) }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4 text-[#4ade80]" />
        <h1 className="text-xl font-bold mb-2">Published!</h1>
        <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">Redirecting to your preset...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/dashboard" className="text-[0.75rem] text-[rgba(255,255,255,0.4)] hover:text-white flex items-center gap-1 mb-6">
        <ArrowLeft size={13} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-extrabold mb-2">Publish a Preset</h1>
      <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)] mb-8">Share your creation with the Cloz community</p>

      <form onSubmit={submit} className="glass-strong rounded-2xl p-8 space-y-5">
        {error && <div className="px-4 py-3 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] text-[0.78rem] text-[#f87171]">{error}</div>}

        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {categories.map(c => (
              <button key={c.id} type="button" onClick={() => setForm({ ...form, category: c.id })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${form.category === c.id ? 'border-[rgba(96,165,250,0.3)] bg-[rgba(96,165,250,0.06)]' : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]'}`}>
                <c.icon size={16} className={form.category === c.id ? 'text-[#60a5fa]' : 'text-[rgba(255,255,255,0.3)]'} />
                <span className="text-[0.62rem]">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Name</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" placeholder="My Awesome Preset" />
        </div>

        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Short Description</label>
          <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" placeholder="One-line summary" />
        </div>

        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Full Description</label>
          <textarea value={form.longDesc} onChange={e => setForm({ ...form, longDesc: e.target.value })} rows={5}
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all resize-none" placeholder="Detailed description of what your preset does..." />
        </div>

        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Tags (comma separated)</label>
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" placeholder="Dark, Gaming, FPS" />
        </div>

        {canSell(user.role) && (
          <div>
            <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Price <span className="text-[#fbbf24]">(C$ — staff only)</span></label>
            <input type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(251,191,36,0.3)] transition-all" placeholder="0 = free" />
            <p className="text-[0.62rem] text-[rgba(255,255,255,0.3)] mt-1">Buyers pay this in credits; the amount is added to your balance. Leave 0 for a free listing.</p>
          </div>
        )}

        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Compatibility</label>
          <input value={form.compatibility} onChange={e => setForm({ ...form, compatibility: e.target.value })}
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" placeholder="Windows 10/11, ClozOptimizer v2.0+" />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[rgba(251,191,36,0.05)] border border-[rgba(251,191,36,0.1)]">
          <Shield size={14} className="text-[#fbbf24] shrink-0" />
          <p className="text-[0.7rem] text-[rgba(255,255,255,0.4)]">New presets are reviewed before earning a verified badge. Published content goes live immediately.</p>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-xl text-[0.88rem] font-bold flex items-center justify-center gap-2">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {submitting ? 'Publishing...' : 'Publish Preset'}
        </button>
      </form>
    </div>
  )
}
