'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import {
  User, Crown, Heart, Settings, Shield, Loader2, CheckCircle2, Save,
  Star, Download, Sparkles, Mail, LogOut, AlertTriangle, Key, Image as ImageIcon
} from 'lucide-react'
import MediaCenter from '@/components/MediaCenter'

function AccountContent() {
  const { user, loading, refresh, logout } = useAuth()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'profile')
  const [favorites, setFavorites] = useState<any[]>([])
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [licenseKey, setLicenseKey] = useState('')
  const [activating, setActivating] = useState(false)
  const [activateMsg, setActivateMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [licenses, setLicenses] = useState<any[]>([])
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState('')

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
      setBio(user.bio || '')
    }
  }, [user])

  useEffect(() => {
    if (tab === 'favorites' && user) {
      fetch('/api/favorites').then(r => r.json()).then(d => setFavorites(d.favorites || [])).catch(() => {})
    }
    if (tab === 'subscription' && user) {
      fetch('/api/license/activate').then(r => r.json()).then(d => setLicenses(d.licenses || [])).catch(() => {})
    }
  }, [tab, user])

  const activateKey = async () => {
    if (!licenseKey.trim()) return
    setActivating(true); setActivateMsg(null)
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: licenseKey.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setActivateMsg({ ok: true, text: `Activated ${String(data.plan).toUpperCase()} plan!` })
        setLicenseKey('')
        await refresh()
        fetch('/api/license/activate').then(r => r.json()).then(d => setLicenses(d.licenses || [])).catch(() => {})
      } else {
        setActivateMsg({ ok: false, text: data.error || 'Activation failed' })
      }
    } catch { setActivateMsg({ ok: false, text: 'Connection error' }) }
    setActivating(false)
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <User size={32} className="mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
        <h1 className="text-xl font-bold mb-3">Sign in required</h1>
        <p className="text-[rgba(255,255,255,0.4)] mb-6 text-[0.85rem]">You need to be logged in to view your account.</p>
        <Link href="/login" className="btn-primary px-6 py-2.5 rounded-lg text-[0.85rem] font-semibold inline-block">Sign In</Link>
      </div>
    )
  }

  // Resize an image file to a square <=256px and return a JPEG data URL
  const resizeImage = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const img = new window.Image()
      img.onerror = () => reject(new Error('decode failed'))
      img.onload = () => {
        const size = 256
        const canvas = document.createElement('canvas')
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('no canvas'))
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })

  const onAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setAvatarMsg('')
    if (!file.type.startsWith('image/')) { setAvatarMsg('Please choose an image file'); return }
    if (file.size > 8 * 1024 * 1024) { setAvatarMsg('Image too large (max 8MB)'); return }
    setAvatarUploading(true)
    try {
      const dataUrl = await resizeImage(file)
      const res = await fetch('/api/account', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: dataUrl }),
      })
      if (res.ok) { await refresh() } else {
        const d = await res.json().catch(() => ({}))
        setAvatarMsg(d.error || 'Upload failed')
      }
    } catch { setAvatarMsg('Could not process image') }
    setAvatarUploading(false)
  }

  const removeAvatar = async () => {
    setAvatarUploading(true); setAvatarMsg('')
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: '' }),
      })
      if (res.ok) await refresh()
    } catch {}
    setAvatarUploading(false)
  }

  const saveProfile = async () => {
    setSaving(true); setSaved(false)
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, bio }),
      })
      if (res.ok) { await refresh(); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    } catch {}
    setSaving(false)
  }

  const changePassword = async () => {
    setPwMsg('')
    if (!currentPassword || !newPassword) { setPwMsg('Both fields required'); return }
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) { setPwMsg('Password updated successfully'); setCurrentPassword(''); setNewPassword('') }
      else setPwMsg(data.error || 'Failed')
    } catch { setPwMsg('Connection error') }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-2xl font-bold text-white">
            {(user.displayName || user.username).charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold">{user.displayName || user.username}</h1>
            {user.verified && <CheckCircle2 size={16} className="text-[#60a5fa]" />}
          </div>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">@{user.username} · {user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[0.82rem] font-medium transition-all ${tab === t.id ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[0.82rem] font-medium text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-all mt-4">
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Content */}
        <div>
          {tab === 'profile' && (
            <div className="glass-strong rounded-2xl p-8 space-y-5">
              <h2 className="text-lg font-bold">Edit Profile</h2>

              {/* Profile picture */}
              <div>
                <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-3">Profile Picture</label>
                <div className="flex items-center gap-5">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center text-3xl font-bold text-white shrink-0">
                      {(user.displayName || user.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className={`btn-white px-4 py-2 rounded-lg text-[0.78rem] font-medium cursor-pointer flex items-center gap-2 ${avatarUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                        {avatarUploading ? <Loader2 size={13} className="animate-spin" /> : <ImageIcon size={13} />}
                        {user.avatarUrl ? 'Change' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={onAvatarPick} disabled={avatarUploading} />
                      </label>
                      {user.avatarUrl && (
                        <button onClick={removeAvatar} disabled={avatarUploading}
                          className="px-4 py-2 rounded-lg text-[0.78rem] font-medium text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-all">
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[0.65rem] text-[rgba(255,255,255,0.25)]">JPG, PNG or WebP · auto-cropped to a square · max 8MB</p>
                    {avatarMsg && <p className="text-[0.68rem] text-[#f87171]">{avatarMsg}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" />
              </div>
              <div>
                <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={280}
                  className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all resize-none"
                  placeholder="Tell the community about yourself..." />
                <div className="text-[0.62rem] text-[rgba(255,255,255,0.2)] mt-1 text-right">{bio.length}/280</div>
              </div>
              <button onClick={saveProfile} disabled={saving}
                className="btn-primary px-5 py-2.5 rounded-lg text-[0.82rem] font-bold flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {tab === 'subscription' && (
            <div className="space-y-5">
              <div className="glass-strong rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-6">Subscription</h2>
                <div className="flex items-center justify-between p-5 rounded-xl glass mb-2">
                  <div className="flex items-center gap-3">
                    <Crown size={20} className={user.plan && user.plan !== 'free' ? 'text-[#fbbf24]' : 'text-[rgba(255,255,255,0.3)]'} />
                    <div>
                      <div className="text-[0.9rem] font-bold capitalize">{user.plan || 'Free'} Plan</div>
                      <div className="text-[0.7rem] text-[rgba(255,255,255,0.35)]">
                        {user.plan && user.plan !== 'free' ? 'Active subscription' : 'Upgrade for full features'}
                      </div>
                    </div>
                  </div>
                  {(!user.plan || user.plan === 'free') && (
                    <Link href="/pricing" className="btn-primary px-5 py-2 rounded-lg text-[0.78rem] font-bold">Upgrade</Link>
                  )}
                </div>
              </div>

              {/* Activate License Key */}
              <div className="glass-strong rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={16} className="text-[#fbbf24]" />
                  <h2 className="text-lg font-bold">Activate License Key</h2>
                </div>
                <p className="text-[0.76rem] text-[rgba(255,255,255,0.4)] leading-relaxed mb-5">
                  Enter a license key to unlock Pro. It links to your account and works on every device you sign into — website, launcher, and desktop app.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={licenseKey} onChange={e => setLicenseKey(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && activateKey()}
                    placeholder="CLOZ-XXXX-XXXX-XXXX or RC-XXXX-XXXX-XXXX"
                    className="flex-1 glass rounded-lg py-3 px-4 text-[0.82rem] font-mono outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.15)]" />
                  <button onClick={activateKey} disabled={activating || !licenseKey.trim()}
                    className="btn-primary px-6 py-3 rounded-lg text-[0.82rem] font-bold flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50">
                    {activating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Activate
                  </button>
                </div>
                {activateMsg && (
                  <div className={`flex items-center gap-2 mt-4 px-4 py-2.5 rounded-lg text-[0.76rem] ${activateMsg.ok ? 'bg-[rgba(74,222,128,0.08)] text-[#4ade80]' : 'bg-[rgba(248,113,113,0.08)] text-[#f87171]'}`}>
                    {activateMsg.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    {activateMsg.text}
                  </div>
                )}
              </div>

              {/* Linked licenses */}
              {licenses.length > 0 && (
                <div className="glass-strong rounded-2xl p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={15} className="text-[#4ade80]" />
                    <h2 className="text-base font-bold">Your Licenses</h2>
                  </div>
                  <div className="space-y-2">
                    {licenses.map((lic: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg glass">
                        <Key size={13} className="text-[rgba(255,255,255,0.3)]" />
                        <span className="flex-1 text-[0.74rem] font-mono text-[rgba(255,255,255,0.55)]">
                          {lic.key.length > 14 ? `${lic.key.slice(0, 8)}…${lic.key.slice(-4)}` : lic.key}
                        </span>
                        <span className="text-[0.64rem] font-bold uppercase text-[#fbbf24]">{lic.plan}</span>
                        <span className={`text-[0.58rem] px-2 py-0.5 rounded-full ${lic.status === 'active' ? 'bg-[rgba(74,222,128,0.1)] text-[#4ade80]' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.3)]'}`}>{lic.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'favorites' && (
            <div>
              <h2 className="text-lg font-bold mb-4">Favorite Presets</h2>
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((f: any) => (
                    <Link key={f.id} href={`/marketplace/${f.preset.slug}`}
                      className="glass rounded-xl p-4 flex items-center gap-4 glass-hover transition-all">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(96,165,250,0.12)] flex items-center justify-center shrink-0">
                        <Sparkles size={16} className="text-[#60a5fa]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.85rem] font-semibold">{f.preset.name}</div>
                        <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)]">by {f.preset.author.displayName || f.preset.author.username}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[0.7rem] text-[#fbbf24]">
                        <Star size={11} fill="#fbbf24" /> {f.preset.ratingAvg.toFixed(1)}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-xl p-12 text-center">
                  <Heart size={28} className="mx-auto mb-3 text-[rgba(255,255,255,0.12)]" />
                  <p className="text-[0.82rem] text-[rgba(255,255,255,0.3)]">No favorites yet</p>
                  <Link href="/marketplace" className="text-[0.75rem] text-[#60a5fa] hover:underline mt-2 inline-block">Browse marketplace</Link>
                </div>
              )}
            </div>
          )}

          {tab === 'media' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold">Media Kit</h2>
                  <p className="text-[0.75rem] text-[rgba(255,255,255,0.4)]">Official branding assets — logos, banners, wallpapers & more</p>
                </div>
                <Link href="/media" className="text-[0.72rem] text-[#60a5fa] hover:underline shrink-0">Open full Media Center →</Link>
              </div>
              <MediaCenter compact />
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-5">
              {/* Connections */}
              <div className="glass-strong rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-2">Connections</h2>
                <p className="text-[0.76rem] text-[rgba(255,255,255,0.4)] mb-5">Link your Discord to get your plan&apos;s role in the community server automatically.</p>
                {searchParams.get('discord') === 'linked' && (
                  <div className="mb-4 px-4 py-2.5 rounded-lg bg-[rgba(74,222,128,0.08)] text-[#4ade80] text-[0.76rem] flex items-center gap-2"><CheckCircle2 size={14} /> Discord linked! Your roles have been synced.</div>
                )}
                {searchParams.get('discord') === 'taken' && (
                  <div className="mb-4 px-4 py-2.5 rounded-lg bg-[rgba(248,113,113,0.08)] text-[#f87171] text-[0.76rem]">That Discord account is already linked to another user.</div>
                )}
                {['error', 'denied'].includes(searchParams.get('discord') || '') && (
                  <div className="mb-4 px-4 py-2.5 rounded-lg bg-[rgba(248,113,113,0.08)] text-[#f87171] text-[0.76rem]">Couldn&apos;t link Discord — please try again.</div>
                )}
                <div className="flex items-center justify-between p-4 rounded-xl glass">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(88,101,242,0.15)] flex items-center justify-center text-[#8b9bf4] font-bold">D</div>
                    <div>
                      <div className="text-[0.85rem] font-semibold">Discord</div>
                      <div className="text-[0.68rem] text-[rgba(255,255,255,0.35)]">{user.discordId ? `Linked · ${user.discordId}` : 'Not linked'}</div>
                    </div>
                  </div>
                  {user.discordId
                    ? <a href="/api/auth/discord" className="btn-white px-4 py-2 rounded-lg text-[0.76rem] font-medium">Re-sync</a>
                    : <a href="/api/auth/discord" className="btn-primary px-4 py-2 rounded-lg text-[0.76rem] font-bold">Link Discord</a>}
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-5">Change Password</h2>
                {pwMsg && (
                  <div className={`px-4 py-2.5 rounded-lg text-[0.75rem] mb-4 ${pwMsg.includes('success') ? 'bg-[rgba(74,222,128,0.08)] text-[#4ade80]' : 'bg-[rgba(248,113,113,0.08)] text-[#f87171]'}`}>
                    {pwMsg}
                  </div>
                )}
                <div className="space-y-4">
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" />
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password (min 8 chars)"
                    className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all" />
                  <button onClick={changePassword} className="btn-white px-5 py-2.5 rounded-lg text-[0.82rem] font-medium">Update Password</button>
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-8 border border-[rgba(248,113,113,0.1)]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-[#f87171]" />
                  <h2 className="text-lg font-bold">Danger Zone</h2>
                </div>
                <p className="text-[0.75rem] text-[rgba(255,255,255,0.4)] mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
                <button className="px-5 py-2.5 rounded-lg text-[0.82rem] font-medium bg-[rgba(248,113,113,0.08)] text-[#f87171] border border-[rgba(248,113,113,0.15)] hover:bg-[rgba(248,113,113,0.12)] transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[rgba(255,255,255,0.2)]" /></div>}>
      <AccountContent />
    </Suspense>
  )
}
