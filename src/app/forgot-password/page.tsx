'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devToken, setDevToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setSent(true)
      if (data.devToken) setDevToken(data.devToken)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4 border border-[rgba(96,165,250,0.15)]">
            <Zap size={24} className="text-[#60a5fa]" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Reset Password</h1>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.35)]">We&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div className="glass-strong rounded-2xl p-8 text-center">
            <CheckCircle2 size={36} className="text-[#4ade80] mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Check your email</h3>
            <p className="text-[0.8rem] text-[rgba(255,255,255,0.4)] mb-4">If an account exists for {email}, a reset link has been sent.</p>
            {devToken && (
              <div className="mt-4 p-3 rounded-lg bg-[rgba(251,191,36,0.05)] border border-[rgba(251,191,36,0.1)]">
                <p className="text-[0.62rem] text-[rgba(255,255,255,0.3)] mb-1">Dev mode — use this link:</p>
                <Link href={`/reset-password?token=${devToken}`} className="text-[0.7rem] text-[#60a5fa] hover:underline break-all">
                  /reset-password?token={devToken.slice(0, 16)}...
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.15)]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full glass rounded-lg py-3 pl-10 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all"
                  placeholder="you@example.com" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-lg text-[0.85rem] font-bold flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Send Reset Link</>}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-[0.78rem] text-[rgba(255,255,255,0.3)]">
          Remember your password? <Link href="/login" className="text-[#60a5fa] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
