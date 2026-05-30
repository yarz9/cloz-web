import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const rating = () => Math.round((3.8 + Math.random() * 1.2) * 10) / 10
const pick = <T,>(arr: T[]) => arr[rnd(0, arr.length - 1)]

async function main() {
  console.log('Bulk seeding marketplace...')
  const passwordHash = await bcrypt.hash('clozadmin2024', 12)

  // Ensure creators exist
  const creatorDefs = [
    { username: 'ClozTeam', email: 'admin@cloz.dev', role: 'admin', bio: 'Official Cloz Optimizer team' },
    { username: 'FPSGod', email: 'fps@cloz.dev', role: 'creator', bio: 'Competitive FPS optimizer' },
    { username: 'WinTweaker', email: 'win@cloz.dev', role: 'creator', bio: 'Windows debloat specialist' },
    { username: 'DesignPro', email: 'design@cloz.dev', role: 'creator', bio: 'UI/UX theme designer' },
    { username: 'CDLPro', email: 'cdl@cloz.dev', role: 'creator', bio: 'Call of Duty optimizer' },
    { username: 'StreamKing', email: 'stream@cloz.dev', role: 'creator', bio: 'Streaming setup guru' },
    { username: 'PixelWizard', email: 'pixel@cloz.dev', role: 'creator', bio: 'Color grading & filters expert' },
    { username: 'RadeonRanger', email: 'radeon@cloz.dev', role: 'creator', bio: 'AMD tuning specialist' },
    { username: 'GreenTeamGuru', email: 'green@cloz.dev', role: 'creator', bio: 'NVIDIA optimization' },
  ]
  const creators: Record<string, any> = {}
  for (const c of creatorDefs) {
    creators[c.username] = await prisma.user.upsert({
      where: { username: c.username }, update: {},
      create: { email: c.email, username: c.username, passwordHash, displayName: c.username, role: c.role, verified: true, bio: c.bio },
    })
  }
  const authorIds = Object.values(creators).map((u: any) => u.id)

  const presets: any[] = []

  // ---------- GAMES with NVIDIA filter + AMD + optimization configs ----------
  const games = [
    'Warzone', 'Valorant', 'Fortnite', 'Apex Legends', 'CS2', 'Overwatch 2', 'PUBG',
    'Rainbow Six Siege', 'Call of Duty MW3', 'Rocket League', 'Destiny 2', 'Battlefield 2042',
    'GTA V', 'League of Legends', 'Dota 2', 'Marvel Rivals', 'The Finals', 'Escape from Tarkov',
    'Genshin Impact', 'Cyberpunk 2077', 'Elden Ring', 'Helldivers 2', 'Roblox', 'Minecraft', 'Fall Guys',
  ]

  for (const game of games) {
    // NVIDIA Freestyle filter preset
    presets.push({
      slug: slugify(`nvidia-filter-${game}`),
      name: `NVIDIA Filter — ${game}`,
      desc: `NVIDIA Freestyle filter config for ${game} — enhanced visibility & color`,
      longDesc: `Tuned NVIDIA Freestyle / GeForce Experience filter set for ${game}. Boosts enemy visibility, sharpens textures, and balances color for competitive clarity. Apply via the in-game overlay (Alt+F3).`,
      category: 'game', author: pick(['GreenTeamGuru', 'PixelWizard', 'FPSGod']),
      version: `1.${rnd(0, 9)}`, tags: ['NVIDIA', 'Freestyle', 'Filter', game.split(' ')[0]],
      config: {
        type: 'nvidia-filter', gpu: 'nvidia', game,
        filters: {
          sharpen: rnd(30, 70), clarity: rnd(20, 60), hdrToning: rnd(0, 30),
          vibrance: rnd(40, 80), temperature: rnd(-20, 20), exposure: rnd(-10, 15),
          contrast: rnd(0, 25), highlights: rnd(-10, 20), shadows: rnd(-15, 25), gamma: rnd(-10, 10),
        },
      },
    })
    // AMD Radeon config
    presets.push({
      slug: slugify(`amd-radeon-${game}`),
      name: `AMD Radeon — ${game}`,
      desc: `AMD Radeon settings for ${game} — Anti-Lag, Image Sharpening, Boost`,
      longDesc: `Radeon Software profile for ${game}. Enables Radeon Anti-Lag, Image Sharpening, and Radeon Boost for higher effective FPS with minimal latency. Includes per-game graphics overrides.`,
      category: 'game', author: pick(['RadeonRanger', 'FPSGod']),
      version: `1.${rnd(0, 9)}`, tags: ['AMD', 'Radeon', 'Anti-Lag', game.split(' ')[0]],
      config: {
        type: 'amd-settings', gpu: 'amd', game,
        settings: {
          antiLag: true, imageSharpening: rnd(50, 90), radeonBoost: true,
          radeonChill: pick([true, false]), chillMin: 90, chillMax: 144,
          enhancedSync: true, surfaceFormatOptimization: true,
          textureFilteringQuality: 'Performance', vsync: 'Off',
        },
      },
    })
    // General game optimization profile
    presets.push({
      slug: slugify(`${game}-boost`),
      name: `${game} Boost`,
      desc: `Full system optimization profile for ${game}`,
      longDesc: `Complete optimization for ${game}: Ultimate Performance power plan, background services trimmed, game process priority raised to High, Game DVR disabled, mouse acceleration removed, and shader cache cleared.`,
      category: 'optimization', author: pick(authorIdsNames),
      version: `2.${rnd(0, 9)}`, tags: ['Optimization', 'FPS', 'Profile', game.split(' ')[0]],
      config: {
        type: 'optimization-profile', game,
        powerPlan: 'Ultimate Performance', processPriority: 'High',
        disabledServices: rnd(8, 16), gameDvr: false, mouseAccel: false,
        network: 'Low Latency', clearStandbyRam: true,
      },
    })
  }

  // ---------- UI THEMES ----------
  const themeDefs = [
    { name: 'Midnight Cyan', accent: '#22d3ee', bg: '#04080a' },
    { name: 'Neon Purple', accent: '#a855f7', bg: '#08040f' },
    { name: 'Crimson Edge', accent: '#ef4444', bg: '#0c0506' },
    { name: 'Emerald Flow', accent: '#10b981', bg: '#040a08' },
    { name: 'Amber Gold', accent: '#f59e0b', bg: '#0b0803' },
    { name: 'Minimal White', accent: '#e2e8f0', bg: '#0d0d11' },
    { name: 'Ocean Blue', accent: '#3b82f6', bg: '#040810' },
    { name: 'Rose Quartz', accent: '#f472b6', bg: '#0f060b' },
    { name: 'Solar Flare', accent: '#fb923c', bg: '#0d0704' },
    { name: 'Toxic Green', accent: '#84cc16', bg: '#070a04' },
    { name: 'Deep Violet', accent: '#7c3aed', bg: '#070414' },
    { name: 'Arctic Teal', accent: '#2dd4bf', bg: '#04100e' },
    { name: 'Sunset Coral', accent: '#fb7185', bg: '#0f0608' },
    { name: 'Royal Indigo', accent: '#6366f1', bg: '#06060f' },
    { name: 'Matrix Lime', accent: '#22c55e', bg: '#04080a' },
  ]
  for (const t of themeDefs) {
    presets.push({
      slug: slugify(`theme-${t.name}`),
      name: t.name,
      desc: `${t.name} UI theme — glassmorphism accents and glow`,
      longDesc: `A premium ${t.name} theme. Recolors the entire app — sidebar, cards, buttons, glows, and accents. Applies instantly on install and persists across restarts.`,
      category: pick(['ui', 'theme']), author: pick(['ClozTeam', 'DesignPro', 'PixelWizard']),
      version: `1.${rnd(0, 9)}`, tags: ['Theme', 'UI', t.name.split(' ')[0], 'Glass'],
      config: {
        type: 'theme',
        vars: {
          '--bg-primary': t.bg, '--accent-blue': t.accent,
          '--accent-blue-dim': t.accent + '26', '--border-glow': t.accent + '38',
        },
      },
    })
  }

  // ---------- WINDOWS PRESETS ----------
  const winPresets = [
    'Ultra Debloat', 'Privacy Fortress', 'Latency Killer', 'SSD Optimizer', 'Telemetry Block',
    'Service Slimmer', 'Boot Accelerator', 'Memory Tuner', 'Network Turbo', 'Update Tamer',
  ]
  for (const w of winPresets) {
    presets.push({
      slug: slugify(`win-${w}`),
      name: w,
      desc: `${w} — Windows tweak preset with rollback`,
      longDesc: `${w} applies a curated set of Windows tweaks with full rollback support. Every change is logged and reversible.`,
      category: 'windows', author: pick(['WinTweaker', 'ClozTeam']),
      version: `2.${rnd(0, 9)}`, tags: ['Windows', 'Tweak', w.split(' ')[0]],
      config: { type: 'windows-preset', tweaks: rnd(10, 30), services: rnd(5, 20), rollback: true },
    })
  }

  // ---------- DASHBOARDS & WIDGETS ----------
  const dashboards = ['Pro Dashboard', 'Gamer HUD', 'Minimalist View', 'Sensor Grid', 'Streamer Panel', 'Compact Mode']
  for (const d of dashboards) {
    presets.push({
      slug: slugify(`dash-${d}`), name: d, desc: `${d} — custom dashboard layout`,
      category: 'dashboard', author: pick(['DesignPro', 'ClozTeam']),
      version: `1.${rnd(0, 9)}`, tags: ['Dashboard', 'Layout', d.split(' ')[0]],
      config: { type: 'dashboard', widgets: rnd(4, 12), columns: rnd(2, 4) },
    })
  }
  const widgets = ['FPS Overlay', 'CPU Gauge', 'GPU Gauge', 'RAM Meter', 'Temp Monitor', 'Net Graph', 'Clock Pro', 'Disk Activity']
  for (const w of widgets) {
    presets.push({
      slug: slugify(`widget-${w}`), name: w, desc: `${w} — live dashboard widget`,
      category: 'widget', author: pick(['DesignPro', 'GreenTeamGuru']),
      version: `1.${rnd(0, 9)}`, tags: ['Widget', w.split(' ')[0]],
      config: { type: 'widget', refreshMs: pick([500, 1000, 2000]) },
    })
  }

  // Insert all
  let count = 0
  for (const p of presets) {
    const authorId = creators[p.author]?.id || pick(authorIds)
    const downloadCount = rnd(120, 15000)
    await prisma.preset.upsert({
      where: { slug: p.slug },
      update: {
        configData: JSON.stringify(p.config),
        tags: JSON.stringify(p.tags),
      },
      create: {
        slug: p.slug, name: p.name, description: p.desc, longDesc: p.longDesc || null,
        category: p.category, authorId, version: p.version,
        tags: JSON.stringify(p.tags), configData: JSON.stringify(p.config),
        downloadCount, ratingAvg: rating(), ratingCount: rnd(10, 300),
        verified: Math.random() > 0.5, featured: Math.random() > 0.85,
      },
    })
    count++
  }

  const total = await prisma.preset.count()
  console.log(`Bulk seeded ${count} presets. Marketplace total: ${total}`)
}

// helper list of creator usernames for random author assignment
const authorIdsNames = ['ClozTeam', 'FPSGod', 'WinTweaker', 'DesignPro', 'CDLPro', 'StreamKing', 'PixelWizard', 'RadeonRanger', 'GreenTeamGuru']

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
