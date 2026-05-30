'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap, Menu, X, Download, ChevronDown, User, LayoutDashboard, Store, LogOut, Settings, Crown } from 'lucide-react'
import { useAuth } from './AuthProvider'

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/media', label: 'Media' },
  { href: '/docs', label: 'Docs' },
]

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  if (!user) return null

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg glass glass-hover transition-all">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-[0.7rem] font-bold text-white">
          {(user.displayName || user.username).charAt(0).toUpperCase()}
        </div>
        <span className="text-[0.78rem] font-medium max-w-[100px] truncate">{user.displayName || user.username}</span>
        <ChevronDown size={13} className="text-[rgba(255,255,255,0.3)]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-2 z-50 shadow-2xl">
            <div className="px-3 py-2.5 border-b border-[rgba(255,255,255,0.05)] mb-1">
              <div className="text-[0.82rem] font-semibold truncate">{user.displayName || user.username}</div>
              <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)] truncate">{user.email}</div>
              {user.plan && user.plan !== 'free' && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[0.55rem] font-bold bg-[rgba(251,191,36,0.1)] text-[#fbbf24] border border-[rgba(251,191,36,0.2)]">
                  <Crown size={9} /> {user.plan.toUpperCase()}
                </span>
              )}
            </div>
            {[
              { href: '/account', label: 'Account', icon: User },
              { href: '/dashboard', label: 'Creator Dashboard', icon: LayoutDashboard },
              { href: `/creator/${user.username}`, label: 'My Profile', icon: Store },
              { href: '/account?tab=settings', label: 'Settings', icon: Settings },
            ].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.78rem] text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all">
                <item.icon size={14} /> {item.label}
              </Link>
            ))}
            <button onClick={() => { setOpen(false); logout() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.78rem] text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-all mt-1 border-t border-[rgba(255,255,255,0.05)] pt-2.5">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, loading } = useAuth()

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgba(96,165,250,0.2)] to-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] flex items-center justify-center transition-all group-hover:shadow-[0_0_16px_rgba(96,165,250,0.15)]">
            <Zap size={16} className="text-[#60a5fa]" />
          </div>
          <span className="text-[0.95rem] font-bold tracking-tight">ClozOptimizer</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="px-4 py-2 text-[0.82rem] text-[rgba(255,255,255,0.5)] hover:text-white rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-all">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!loading && (user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-[0.82rem] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/downloads" className="btn-primary px-5 py-2 rounded-lg text-[0.82rem] font-semibold flex items-center gap-2">
                <Download size={14} /> Download
              </Link>
            </>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[rgba(255,255,255,0.5)]">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-[rgba(255,255,255,0.04)] px-6 py-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block py-3 text-[0.85rem] text-[rgba(255,255,255,0.6)] hover:text-white border-b border-[rgba(255,255,255,0.04)]">
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/account" className="btn-white px-4 py-2.5 rounded-lg text-[0.82rem] font-medium text-center">Account</Link>
              <Link href="/dashboard" className="btn-primary px-4 py-2.5 rounded-lg text-[0.82rem] font-semibold text-center">Creator Dashboard</Link>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <Link href="/login" className="btn-white px-4 py-2.5 rounded-lg text-[0.82rem] font-medium flex-1 text-center">Sign In</Link>
              <Link href="/downloads" className="btn-primary px-4 py-2.5 rounded-lg text-[0.82rem] font-semibold flex-1 text-center">Download</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
