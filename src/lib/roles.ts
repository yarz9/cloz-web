// Role hierarchy for the forum / admin panel.
// Higher rank = more authority. developer is the top role.

export const ROLES = ['user', 'moderator', 'admin', 'founder', 'developer'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_RANK: Record<string, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  founder: 3,
  developer: 4,
}

export const ROLE_LABELS: Record<string, string> = {
  user: 'Member',
  moderator: 'Moderator',
  admin: 'Admin',
  founder: 'Founder',
  developer: 'Developer',
}

// Display colors (hex) for role badges
export const ROLE_COLORS: Record<string, string> = {
  user: '#94a3b8',
  moderator: '#4ade80',
  admin: '#60a5fa',
  founder: '#fbbf24',
  developer: '#a78bfa',
}

export function rank(role?: string | null): number {
  return ROLE_RANK[role || 'user'] ?? 0
}

// Admin panel access: admin and above
export function isStaff(role?: string | null): boolean {
  return rank(role) >= ROLE_RANK.admin
}

// An actor can only manage targets strictly below their own rank,
// and can only assign roles below their own rank.
export function canManage(actorRole?: string | null, targetRole?: string | null): boolean {
  return rank(actorRole) > rank(targetRole)
}

export function canAssignRole(actorRole?: string | null, newRole?: string | null): boolean {
  return rank(actorRole) > rank(newRole)
}
