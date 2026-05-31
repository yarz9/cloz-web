'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { RoleBadge, UidTag } from '@/components/RoleBadge'
import { isStaff } from '@/lib/roles'
import { ArrowLeft, Loader2, Send, Pin, Lock, Trash2, Unlock } from 'lucide-react'

interface Author { uid?: number; username: string; displayName: string | null; avatarUrl: string | null; role?: string }
interface Post { id: string; content: string; createdAt: string; author: Author }
interface Thread {
  id: string; title: string; content: string; category: string; pinned: boolean; locked: boolean; views: number
  createdAt: string; author: Author; posts: Post[]
}

function Avatar({ a }: { a: Author }) {
  return a.avatarUrl
    ? <img src={a.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
    : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-[0.7rem] font-bold text-white shrink-0">{(a.displayName || a.username).charAt(0).toUpperCase()}</div>
}

function PostBlock({ a, content, date }: { a: Author; content: string; date: string }) {
  return (
    <div className="glass rounded-xl p-5 flex gap-4">
      <Avatar a={a} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <Link href={`/creator/${a.username}`} className="text-[0.82rem] font-semibold hover:text-[#60a5fa]">{a.displayName || a.username}</Link>
          <RoleBadge role={a.role} size="xs" /><UidTag uid={a.uid} />
          <span className="text-[0.62rem] text-[rgba(255,255,255,0.25)]">· {new Date(date).toLocaleString()}</span>
        </div>
        <div className="text-[0.84rem] text-[rgba(255,255,255,0.6)] leading-relaxed whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  )
}

export default function ThreadPage() {
  const { id } = useParams() as { id: string }
  const { user } = useAuth()
  const router = useRouter()
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try { const r = await fetch(`/api/forum/threads/${id}`); const d = await r.json(); setThread(d.thread || null) } catch {}
    setLoading(false)
  }, [id])
  useEffect(() => { load() }, [load])

  const sendReply = async () => {
    if (reply.trim().length < 1) return
    setBusy(true)
    try {
      const r = await fetch(`/api/forum/threads/${id}/posts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: reply.trim() }),
      })
      if (r.ok) { setReply(''); await load() } else alert((await r.json()).error || 'Failed')
    } catch {}
    setBusy(false)
  }
  const moderate = async (patch: any) => {
    const r = await fetch(`/api/forum/threads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (r.ok) load()
  }
  const remove = async () => {
    if (!confirm('Delete this thread?')) return
    const r = await fetch(`/api/forum/threads/${id}`, { method: 'DELETE' })
    if (r.ok) router.push('/forum')
  }

  if (loading) return <div className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>
  if (!thread) return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <h1 className="text-xl font-bold mb-3">Thread not found</h1>
      <Link href="/forum" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Back to forum</Link>
    </div>
  )

  const canModerate = user && isStaff(user.role)
  const canDelete = user && (isStaff(user.role) || user.username === thread.author.username)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/forum" className="text-[0.78rem] text-[rgba(255,255,255,0.4)] hover:text-white flex items-center gap-1.5 mb-5"><ArrowLeft size={14} /> Forum</Link>

      <div className="flex items-start justify-between gap-4 mb-5">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 flex-wrap">
          {thread.pinned && <Pin size={16} className="text-[#fbbf24]" />}
          {thread.locked && <Lock size={15} className="text-[rgba(255,255,255,0.4)]" />}
          {thread.title}
        </h1>
        {(canModerate || canDelete) && (
          <div className="flex items-center gap-1.5 shrink-0">
            {canModerate && <button onClick={() => moderate({ pinned: !thread.pinned })} title="Pin" className="p-2 rounded-lg glass hover:text-[#fbbf24]"><Pin size={13} /></button>}
            {canModerate && <button onClick={() => moderate({ locked: !thread.locked })} title="Lock" className="p-2 rounded-lg glass hover:text-white">{thread.locked ? <Unlock size={13} /> : <Lock size={13} />}</button>}
            {canDelete && <button onClick={remove} title="Delete" className="p-2 rounded-lg glass text-[#f87171]"><Trash2 size={13} /></button>}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <PostBlock a={thread.author} content={thread.content} date={thread.createdAt} />
        {thread.posts.map(p => <PostBlock key={p.id} a={p.author} content={p.content} date={p.createdAt} />)}
      </div>

      {/* Reply */}
      <div className="mt-6">
        {thread.locked ? (
          <div className="glass rounded-xl p-4 text-center text-[0.8rem] text-[rgba(255,255,255,0.4)] flex items-center justify-center gap-2"><Lock size={14} /> This thread is locked.</div>
        ) : user ? (
          <div className="glass-strong rounded-xl p-4">
            <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} maxLength={10000} placeholder="Write a reply…"
              className="w-full glass rounded-lg py-2.5 px-3.5 text-[0.84rem] outline-none focus:border-[rgba(96,165,250,0.3)] resize-none" />
            <div className="flex justify-end mt-2.5">
              <button onClick={sendReply} disabled={busy || reply.trim().length < 1}
                className="btn-primary px-5 py-2 rounded-lg text-[0.78rem] font-bold flex items-center gap-2 disabled:opacity-50">
                {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-[0.8rem] text-[rgba(255,255,255,0.4)]">Sign in to reply</span>
            <Link href={`/login?next=/forum/${id}`} className="btn-white px-4 py-2 rounded-lg text-[0.76rem] font-medium">Sign In</Link>
          </div>
        )}
      </div>
    </div>
  )
}
