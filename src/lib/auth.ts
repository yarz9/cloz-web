import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'cloz-jwt-fallback-secret'
const TOKEN_EXPIRY = '30d'
const COOKIE_NAME = 'cloz_token'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true, email: true, username: true, displayName: true,
        avatarUrl: true, bio: true, role: true, verified: true, frozen: true, discordId: true,
        plan: true, createdAt: true,
      },
    })
    return user
  } catch {
    return null
  }
}

export function setAuthCookie(token: string) {
  return {
    'Set-Cookie': `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`,
  }
}

export function clearAuthCookie() {
  return {
    'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
  }
}
