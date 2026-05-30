'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { Zap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already signed in — no reason to show the signup form
  if (!authLoading && user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center glass-strong rounded-2xl p-10">
          <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4 border border-[rgba(96,165,250,0.15)]">
            <CheckCircle2 size={24} className="text-[#4ade80]" />
          </div>
          <h1 className="text-xl font-bold mb-1">You&apos;re already signed in</h1>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)] mb-6">Logged in as @{user.username}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/account" className="btn-primary px-5 py-2.5 rounded-lg text-[0.82rem] font-bold">Go to Account</Link>
            <Link href="/" className="btn-white px-5 py-2.5 rounded-lg text-[0.82rem] font-medium">Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
      const next = new URLSearchParams(window.location.search).get('next')
      window.location.href = next && next.startsWith('/') ? next : '/'
    } catch { setError('Connection error'); setLoading(false) }
  }

  const perks = ['Cloud Sync across devices', 'Marketplace access', 'Community presets', 'Creator dashboard']

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4 border border-[rgba(96,165,250,0.15)]">
            <Zap size={24} className="text-[#60a5fa]" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.35)]">Join the Cloz ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] text-[0.78rem] text-[#f87171]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full glass rounded-lg py-3 pl-10 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.12)]"
                placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Username</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full glass rounded-lg py-3 pl-10 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.12)]"
                placeholder="your_username" />
            </div>
          </div>

          <div>
            <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                className="w-full glass rounded-lg py-3 pl-10 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.12)]"
                placeholder="Min 8 characters" />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-2 text-[0.72rem] text-[rgba(255,255,255,0.35)]">
                <CheckCircle2 size={13} className="text-[#4ade80]" /> {p}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 rounded-lg text-[0.85rem] font-bold flex items-center justify-center gap-2 mt-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Create Account</>}
          </button>
        </form>

        <p className="text-center mt-6 text-[0.78rem] text-[rgba(255,255,255,0.3)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#60a5fa] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
