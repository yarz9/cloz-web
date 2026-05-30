'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Zap, Monitor, Shield, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'

function LinkDeviceContent() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const callback = searchParams.get('callback') || ''
  const [authorizing, setAuthorizing] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  // Redirect to login (and come back here) if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(`/link-device?callback=${encodeURIComponent(callback)}`)
      window.location.href = `/login?next=${next}`
    }
  }, [loading, user, callback])

  const authorize = async () => {
    setAuthorizing(true)
    setError('')
    try {
      const res = await fetch('/api/auth/device-token')
      const data = await res.json()
      if (!res.ok || !data.token) { setError('Could not authorize. Please try again.'); setAuthorizing(false); return }
      setDone(true)
      // Hand the token back to the desktop app's local callback server
      const url = new URL(callback)
      url.searchParams.set('token', data.token)
      setTimeout(() => { window.location.href = url.toString() }, 800)
    } catch {
      setError('Connection error')
      setAuthorizing(false)
    }
  }

  if (loading || !user) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>
  }

  if (!callback) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center max-w-md">
        <p className="text-[0.85rem] text-[rgba(255,255,255,0.5)]">This page links the ClozOptimizer desktop app to your account. Open it from the app&apos;s sign-in button.</p>
      </div>
    )
  }

  return (
    <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.06),transparent_70%)]" />
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[rgba(96,165,250,0.2)] to-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] flex items-center justify-center">
          <Zap size={20} className="text-[#60a5fa]" />
        </div>
        <ArrowRight size={16} className="text-[rgba(255,255,255,0.25)]" />
        <div className="w-11 h-11 rounded-xl glass flex items-center justify-center">
          <Monitor size={20} className="text-[rgba(255,255,255,0.6)]" />
        </div>
      </div>

      {done ? (
        <>
          <CheckCircle2 size={36} className="text-[#4ade80] mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-2">Device Linked!</h1>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">You can return to the ClozOptimizer app. This tab will close automatically.</p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">Authorize ClozOptimizer</h1>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.45)] mb-1">
            Sign in to the desktop app as
          </p>
          <p className="text-[0.9rem] font-semibold mb-6">{user.displayName || user.username} <span className="text-[rgba(255,255,255,0.3)] font-normal">({user.email})</span></p>

          <div className="glass rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={13} className="text-[#4ade80]" />
              <span className="text-[0.72rem] font-semibold">This will allow the app to:</span>
            </div>
            <ul className="text-[0.72rem] text-[rgba(255,255,255,0.4)] space-y-1 pl-5 list-disc">
              <li>Access your account &amp; subscription</li>
              <li>Sync your settings, profiles &amp; presets</li>
              <li>Activate license keys on this device</li>
            </ul>
          </div>

          {error && <div className="px-4 py-2.5 rounded-lg bg-[rgba(248,113,113,0.08)] text-[0.75rem] text-[#f87171] mb-4">{error}</div>}

          <button onClick={authorize} disabled={authorizing}
            className="btn-primary w-full py-3 rounded-xl text-[0.85rem] font-bold flex items-center justify-center gap-2">
            {authorizing ? <Loader2 size={16} className="animate-spin" /> : <><Shield size={15} /> Authorize Device</>}
          </button>
          <Link href="/" className="text-[0.72rem] text-[rgba(255,255,255,0.3)] hover:text-white mt-4 inline-block">Cancel</Link>
        </>
      )}
    </div>
  )
}

export default function LinkDevicePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <Suspense fallback={<Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" />}>
        <LinkDeviceContent />
      </Suspense>
    </div>
  )
}
