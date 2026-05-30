import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles'

// Small role chip shown next to a username anywhere users are mentioned.
// Members (default role) render nothing.
export function RoleBadge({ role, size = 'sm' }: { role?: string | null; size?: 'sm' | 'xs' }) {
  if (!role || role === 'user') return null
  const c = ROLE_COLORS[role] || '#94a3b8'
  const pad = size === 'xs' ? 'px-1.5 py-0.5 text-[0.5rem]' : 'px-2 py-0.5 text-[0.6rem]'
  return (
    <span className={`font-bold rounded-full shrink-0 ${pad}`} style={{ background: `${c}1a`, color: c }}>
      {ROLE_LABELS[role] || role}
    </span>
  )
}

// "#42" UID tag
export function UidTag({ uid, className = '' }: { uid?: number | null; className?: string }) {
  if (!uid) return null
  return <span className={`text-[0.62rem] font-mono text-[rgba(255,255,255,0.3)] ${className}`}>#{uid}</span>
}
