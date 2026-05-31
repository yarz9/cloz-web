'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, MessageSquare, Star, UserPlus, Info, Check } from 'lucide-react'
import { useAuth } from './AuthProvider'

interface Notif { id: string; type: string; message: string; link: string | null; read: boolean; createdAt: string }

const ICONS: Record<string, any> = { reply: MessageSquare, review: Star, follow: UserPlus, system: Info }

function ago(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'now'; if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`; return `${Math.floor(s / 86400)}d`
}

export default function NotificationBell() {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)

  const load = useCallback(async () => {
    try { const r = await fetch('/api/notifications'); const d = await r.json(); setItems(d.notifications || []); setUnread(d.unread || 0) } catch {}
  }, [])

  useEffect(() => {
    if (!user) return
    load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [user, load])

  if (!user) return null

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {})
    setUnread(0); setItems(items.map(i => ({ ...i, read: true })))
  }
  const openItem = async (n: Notif) => {
    setOpen(false)
    if (!n.read) { fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) }).catch(() => {}) }
    if (n.link) router.push(n.link)
  }

  return (
    <div className="relative">
      <button onClick={() => { setOpen(!open); if (!open && unread) markAll() }}
        className="relative p-2 rounded-lg glass glass-hover transition-all" aria-label="Notifications">
        <Bell size={16} className="text-[rgba(255,255,255,0.6)]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#f87171] text-white text-[0.55rem] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 glass-strong rounded-xl p-2 z-50 shadow-2xl max-h-[420px] overflow-auto">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.05)] mb-1">
              <span className="text-[0.82rem] font-semibold">Notifications</span>
              {items.some(i => !i.read) && (
                <button onClick={markAll} className="text-[0.65rem] text-[#60a5fa] hover:underline flex items-center gap-1"><Check size={11} /> Mark all read</button>
              )}
            </div>
            {items.length ? items.map(n => {
              const Icon = ICONS[n.type] || Info
              return (
                <button key={n.id} onClick={() => openItem(n)}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.04)] ${!n.read ? 'bg-[rgba(96,165,250,0.05)]' : ''}`}>
                  <Icon size={14} className="text-[#60a5fa] mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.74rem] text-[rgba(255,255,255,0.7)] leading-snug">{n.message}</div>
                    <div className="text-[0.6rem] text-[rgba(255,255,255,0.3)] mt-0.5">{ago(n.createdAt)} ago</div>
                  </div>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 shrink-0" />}
                </button>
              )
            }) : (
              <div className="px-3 py-8 text-center text-[0.75rem] text-[rgba(255,255,255,0.3)]">No notifications yet</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
