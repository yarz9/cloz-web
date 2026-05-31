'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { RoleBadge } from './RoleBadge'
import { Send, MessagesSquare, Loader2 } from 'lucide-react'

interface Msg {
  id: string; content: string; createdAt: string
  user: { uid?: number; username: string; displayName: string | null; avatarUrl: string | null; role?: string }
}

export default function ChatBox() {
  const { user } = useAuth()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const atBottom = useRef(true)

  const load = useCallback(async () => {
    try { const r = await fetch('/api/chat'); const d = await r.json(); setMsgs(d.messages || []) } catch {}
  }, [])

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t) }, [load])
  useEffect(() => {
    if (atBottom.current && scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight
  }, [msgs])

  const onScroll = () => {
    const el = scroller.current; if (!el) return
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }

  const send = async () => {
    const c = text.trim(); if (!c) return
    setSending(true)
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: c }) })
      if (r.ok) { setText(''); atBottom.current = true; await load() }
      else { const d = await r.json(); alert(d.error || 'Failed') }
    } catch {}
    setSending(false)
  }

  return (
    <div className="glass rounded-2xl flex flex-col h-[520px] overflow-hidden">
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2">
        <MessagesSquare size={15} className="text-[#60a5fa]" />
        <span className="text-[0.82rem] font-bold">Live Chat</span>
        <span className="ml-auto text-[0.6rem] text-[rgba(255,255,255,0.3)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block animate-pulse" /> live
        </span>
      </div>

      <div ref={scroller} onScroll={onScroll} className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {msgs.length === 0 && <div className="text-center text-[0.72rem] text-[rgba(255,255,255,0.25)] py-8">No messages yet — say hi! 👋</div>}
        {msgs.map(m => (
          <div key={m.id} className="flex items-start gap-2">
            {m.user.avatarUrl
              ? <img src={m.user.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
              : <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-[0.55rem] font-bold text-white shrink-0 mt-0.5">{(m.user.displayName || m.user.username).charAt(0).toUpperCase()}</div>}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[0.7rem] font-semibold truncate">{m.user.displayName || m.user.username}</span>
                <RoleBadge role={m.user.role} size="xs" />
              </div>
              <div className="text-[0.74rem] text-[rgba(255,255,255,0.6)] leading-snug break-words">{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <div className="p-2.5 border-t border-[rgba(255,255,255,0.06)] flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} maxLength={300}
            onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder="Message…"
            className="flex-1 glass rounded-lg py-2 px-3 text-[0.78rem] outline-none focus:border-[rgba(96,165,250,0.3)]" />
          <button onClick={send} disabled={sending || !text.trim()}
            className="btn-primary px-3 rounded-lg disabled:opacity-50 flex items-center">
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      ) : (
        <div className="p-3 border-t border-[rgba(255,255,255,0.06)] text-center">
          <Link href="/login?next=/forum" className="text-[0.72rem] text-[#60a5fa] hover:underline">Sign in to chat</Link>
        </div>
      )}
    </div>
  )
}
