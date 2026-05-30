# Cloz Optimizer — Official Website & Cloud Backend

The public hub and cloud backend for the entire Cloz Optimizer ecosystem: downloads,
marketplace, community content, user accounts, creator profiles, and cross-device cloud sync.

Built with **Next.js 16 (App Router)**, **Prisma**, and **Tailwind v4**, matching the desktop
application's glassmorphism design language.

## Features

- **Marketing site** — homepage, features, pricing, downloads, docs, support, about, community, contact, blog, changelog, roadmap
- **Marketplace** — browse/search/filter/sort presets across 8 categories (UI, Game, Windows, Optimization, Theme, Dashboard, Widget, + Extensions coming soon), with detail pages, verified/featured filters, ratings, reviews, version history
- **Accounts** — register, login, password recovery, email verification, profile management, subscription view, favorites, device management
- **Creator ecosystem** — publish presets, creator dashboard with stats, public creator profiles, follower system
- **Cloud sync API** — settings, profiles, presets, favorites synced per-user
- **REST API** — consumed by the desktop app via `electron/cloud-connector.ts`

## Local Development

```bash
npm install
cp .env.example .env        # configure DATABASE_URL + JWT_SECRET
npx prisma db push          # create the SQLite schema
npm run db:seed             # seed marketplace presets + demo creators
npm run dev                 # http://localhost:3000
```

## API Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/register` | POST | Create account, returns JWT |
| `/api/auth/login` | POST | Login, returns JWT cookie + token |
| `/api/auth/me` | GET, DELETE | Current user / logout |
| `/api/auth/forgot-password` | POST | Request reset token |
| `/api/auth/reset-password` | POST | Consume token, set password |
| `/api/auth/verify-email` | POST, GET | Email verification |
| `/api/account` | PATCH, DELETE | Update profile / delete account |
| `/api/marketplace` | GET, POST | Browse / publish presets |
| `/api/marketplace/[id]` | GET, POST | Preset detail / record install |
| `/api/reviews` | GET, POST | Preset reviews |
| `/api/favorites` | GET, POST, DELETE | User favorites |
| `/api/follow` | POST, DELETE | Follow/unfollow creators |
| `/api/users/[id]` | GET | Public creator profile + stats |
| `/api/dashboard/presets` | GET | Authed creator's own presets |
| `/api/sync` | GET, POST, PUT | Cloud sync (Bearer token from desktop app) |
| `/api/devices` | GET, POST, DELETE | Device registration/management |

## Railway Deployment

1. Create a new Railway project and add the **PostgreSQL** plugin.
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
3. Railway injects `DATABASE_URL` automatically. Add `JWT_SECRET` and `NEXT_PUBLIC_APP_URL`
   as environment variables.
4. `railway.json` already defines the build/start commands (runs `prisma db push` on deploy).
5. Push to the connected repo — Railway builds with Nixpacks and deploys.

The desktop app points at the backend via `cloudSetApiBase(url)` — set it to the Railway
public URL in production.

## Desktop App Integration

`cloz-optimizer/electron/cloud-connector.ts` talks to this backend for:
auth, marketplace browsing, preset install, reviews, favorites, cloud sync, and device
registration — all exposed to the renderer via `window.electronAPI.cloud*` methods.
