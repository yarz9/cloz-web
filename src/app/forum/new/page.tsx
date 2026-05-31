'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Loader2, Send } from 'lucide-react'

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'support', label: 'Support' },
  { id: 'presets', label: 'Presets' },
  { id: 'offtopic', label: 'Off-topic' },
  { id: 'announcements', label: 'Announcements (staff)' },
]

export default function NewThreadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h1 className="text-xl font-bold mb-3">Sign in to post</h1>
        <Link href="/login?next=/forum/new" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Sign In</Link>
      </div>
    )
  }

  const submit = async () => {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      })
      const d = await res.json()
      if (res.ok && d.thread) router.push(`/forum/${d.thread.id}`)
      else setError(d.error || 'Failed to create thread')
    } catch { setError('Connection error') }
    setBusy(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/forum" className="text-[0.78rem] text-[rgba(255,255,255,0.4)] hover:text-white flex items-center gap-1.5 mb-6"><ArrowLeft size={14} /> Back to forum</Link>
      <h1 className="text-2xl font-extrabold mb-6">New Thread</h1>

      <div className="glass-strong rounded-2xl p-7 space-y-5">
        {error && <div className="px-4 py-2.5 rounded-lg bg-[rgba(248,113,113,0.08)] text-[#f87171] text-[0.78rem]">{error}</div>}
        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none cursor-pointer">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={140} placeholder="What's your thread about?"
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)]" />
        </div>
        <div>
          <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Body</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} maxLength={10000} placeholder="Write your post…"
            className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] resize-none" />
        </div>
        <button onClick={submit} disabled={busy || title.trim().length < 4 || content.trim().length < 4}
          className="btn-primary px-5 py-2.5 rounded-lg text-[0.82rem] font-bold flex items-center gap-2 disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Post Thread
        </button>
      </div>
    </div>
  )
}
