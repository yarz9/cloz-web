'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Zap, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

function ResetContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
      setDone(true)
      setTimeout(() => router.push('/login'), 1500)
    } catch { setError('Connection error'); setLoading(false) }
  }

  if (!token) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">Invalid reset link. Request a new one.</p>
        <Link href="/forgot-password" className="text-[0.78rem] text-[#60a5fa] hover:underline mt-3 inline-block">Request reset link</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <CheckCircle2 size={36} className="text-[#4ade80] mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">Password Reset!</h3>
        <p className="text-[0.8rem] text-[rgba(255,255,255,0.4)]">Redirecting to sign in...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
      {error && <div className="px-4 py-3 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] text-[0.78rem] text-[#f87171]">{error}</div>}
      <div>
        <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">New Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
            className="w-full glass rounded-lg py-3 pl-10 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" placeholder="Min 8 characters" />
        </div>
      </div>
      <div>
        <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Confirm Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]" />
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
            className="w-full glass rounded-lg py-3 pl-10 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" placeholder="Re-enter password" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-lg text-[0.85rem] font-bold flex items-center justify-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Reset Password</>}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4 border border-[rgba(96,165,250,0.15)]">
            <Zap size={24} className="text-[#60a5fa]" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Set New Password</h1>
        </div>
        <Suspense fallback={<div className="text-center"><Loader2 size={20} className="animate-spin mx-auto text-[rgba(255,255,255,0.2)]" /></div>}>
          <ResetContent />
        </Suspense>
      </div>
    </div>
  )
}
