import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create system user
  const passwordHash = await bcrypt.hash('clozadmin2024', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cloz.dev' },
    update: {},
    create: {
      email: 'admin@cloz.dev', username: 'ClozTeam', passwordHash,
      displayName: 'Cloz Team', role: 'admin', verified: true,
      bio: 'Official Cloz Optimizer development team',
    },
  })

  // Create community users
  const creators = await Promise.all([
    prisma.user.upsert({ where: { username: 'FPSGod' }, update: {}, create: { email: 'fps@cloz.dev', username: 'FPSGod', passwordHash, displayName: 'FPSGod', role: 'creator', verified: true, bio: 'Competitive FPS optimizer' } }),
    prisma.user.upsert({ where: { username: 'WinTweaker' }, update: {}, create: { email: 'win@cloz.dev', username: 'WinTweaker', passwordHash, displayName: 'WinTweaker', role: 'creator', verified: true, bio: 'Windows debloat specialist' } }),
    prisma.user.upsert({ where: { username: 'DesignPro' }, update: {}, create: { email: 'design@cloz.dev', username: 'DesignPro', passwordHash, displayName: 'DesignPro', role: 'creator', verified: true, bio: 'UI/UX theme designer' } }),
    prisma.user.upsert({ where: { username: 'CDLPro' }, update: {}, create: { email: 'cdl@cloz.dev', username: 'CDLPro', passwordHash, displayName: 'CDLPro', role: 'creator', verified: true, bio: 'Call of Duty optimizer' } }),
    prisma.user.upsert({ where: { username: 'StreamKing' }, update: {}, create: { email: 'stream@cloz.dev', username: 'StreamKing', passwordHash, displayName: 'StreamKing', role: 'creator', verified: true, bio: 'Streaming setup guru' } }),
  ])

  const presetData = [
    { slug: 'midnight-cyan', name: 'Midnight Cyan', desc: 'Dark theme with cyan accents and glassmorphism effects', longDesc: 'A premium dark theme featuring cyan accent colors throughout the interface. Includes glassmorphism card effects, subtle glow animations, and optimized contrast ratios for comfortable extended use. Works with all dashboard layouts.', category: 'ui', authorId: admin.id, version: '2.1', tags: ['Dark', 'Cyan', 'Glass', 'Premium'], downloadCount: 12840, ratingAvg: 4.9, ratingCount: 248, verified: true, featured: true },
    { slug: 'valorant-pro', name: 'Valorant Pro', desc: 'Optimized for Valorant — max FPS, low input lag, competitive settings', longDesc: 'Competition-grade Valorant optimization profile. Disables unnecessary services, sets game priority to High, removes mouse acceleration, disables Xbox Game DVR, switches to Ultimate Performance power plan. Tested by Immortal-rank players.', category: 'game', authorId: creators[0].id, version: '1.8', tags: ['FPS', 'Competitive', 'Valorant', 'Esports'], downloadCount: 8920, ratingAvg: 4.7, ratingCount: 186, verified: true, featured: true },
    { slug: 'ultra-clean-win', name: 'Ultra Clean Win', desc: 'Debloated Windows preset — removes telemetry, strips services, maximum performance', longDesc: 'Complete Windows debloating preset. Disables 20+ telemetry endpoints, removes pre-installed bloatware references, optimizes service startup types, and configures privacy settings. Includes rollback instructions for every change.', category: 'windows', authorId: creators[1].id, version: '3.0', tags: ['Debloat', 'Privacy', 'Fast', 'Clean'], downloadCount: 6340, ratingAvg: 4.8, ratingCount: 142, verified: true },
    { slug: 'neon-purple', name: 'Neon Purple', desc: 'Vibrant purple theme with neon glow effects and animations', longDesc: 'Eye-catching purple neon theme with animated glow effects on cards and buttons. Features custom accent colors, animated hover states, and gradient backgrounds.', category: 'theme', authorId: creators[2].id, version: '1.5', tags: ['Purple', 'Neon', 'Animated', 'Vibrant'], downloadCount: 5120, ratingAvg: 4.6, ratingCount: 98 },
    { slug: 'fortnite-boost', name: 'Fortnite Boost', desc: 'Fortnite optimization — fast builds, smooth rendering, reduced stutters', longDesc: 'Fortnite-specific optimization targeting build speed and render smoothness. Configures GPU settings, adjusts process priority, clears shader cache, and optimizes network for reduced packet loss.', category: 'game', authorId: creators[0].id, version: '2.3', tags: ['Fortnite', 'Smooth', 'Builds', 'FPS'], downloadCount: 7650, ratingAvg: 4.5, ratingCount: 165, verified: true },
    { slug: 'warzone-config', name: 'Warzone Config', desc: 'Call of Duty Warzone — visibility settings, FPS boost, audio tuning', longDesc: 'Warzone optimization with focus on visibility and target acquisition. Includes render distance optimization, audio enhancement for footstep detection, and GPU-specific shader cache management.', category: 'game', authorId: creators[3].id, version: '1.9', tags: ['Warzone', 'COD', 'Visibility', 'Audio'], downloadCount: 9200, ratingAvg: 4.8, ratingCount: 201, featured: true },
    { slug: 'privacy-shield', name: 'Privacy Shield', desc: 'Maximum privacy Windows preset — blocks tracking, disables telemetry', longDesc: 'The most comprehensive privacy preset available. Blocks 50+ tracking domains via hosts file, disables all Windows telemetry services, configures firewall rules, and removes diagnostic data collection. Every change is documented with undo instructions.', category: 'windows', authorId: creators[1].id, version: '2.0', tags: ['Privacy', 'Security', 'Block', 'Firewall'], downloadCount: 4560, ratingAvg: 4.9, ratingCount: 89, verified: true },
    { slug: 'minimal-white', name: 'Minimal White', desc: 'Clean minimal theme with subtle white accents', category: 'ui', authorId: admin.id, version: '1.2', tags: ['Minimal', 'Clean', 'Light', 'Simple'], downloadCount: 3890, ratingAvg: 4.4, ratingCount: 76 },
    { slug: 'streamer-elite', name: 'Streamer Elite', desc: 'Optimized for OBS + gaming dual workload', longDesc: 'Dual-purpose streaming optimization. Splits CPU affinity between OBS encoder and game, manages memory allocation, prioritizes upload bandwidth, and configures NVENC settings for minimal FPS impact while streaming.', category: 'optimization', authorId: creators[4].id, version: '1.4', tags: ['Streaming', 'OBS', 'NVENC', 'Twitch'], downloadCount: 3400, ratingAvg: 4.6, ratingCount: 67 },
    { slug: 'pro-dashboard-v2', name: 'Pro Dashboard V2', desc: 'Custom dashboard layout with live performance widgets', category: 'dashboard', authorId: creators[2].id, version: '2.0', tags: ['Dashboard', 'Widgets', 'Layout', 'Custom'], downloadCount: 2100, ratingAvg: 4.3, ratingCount: 45 },
    { slug: 'fps-monitor-widget', name: 'FPS Monitor Widget', desc: 'Real-time FPS overlay widget for dashboard', category: 'widget', authorId: creators[0].id, version: '1.1', tags: ['FPS', 'Monitor', 'Widget', 'Overlay'], downloadCount: 1800, ratingAvg: 4.2, ratingCount: 32 },
    { slug: 'apex-legends-cfg', name: 'Apex Legends Config', desc: 'Apex Legends — competitive settings, visibility boost', longDesc: 'Apex Legends optimization targeting competitive play. Includes video settings for maximum visibility, audio configuration for directional awareness, and system tweaks for consistent frame times.', category: 'game', authorId: creators[0].id, version: '2.1', tags: ['Apex', 'Battle Royale', 'Competitive', 'FPS'], downloadCount: 6100, ratingAvg: 4.7, ratingCount: 134, verified: true },
  ]

  for (const p of presetData) {
    await prisma.preset.upsert({
      where: { slug: p.slug },
      update: { downloadCount: p.downloadCount, ratingAvg: p.ratingAvg, ratingCount: p.ratingCount },
      create: {
        slug: p.slug, name: p.name, description: p.desc, longDesc: p.longDesc || null,
        category: p.category, authorId: p.authorId, version: p.version,
        tags: JSON.stringify(p.tags), downloadCount: p.downloadCount,
        ratingAvg: p.ratingAvg, ratingCount: p.ratingCount,
        verified: p.verified || false, featured: p.featured || false,
      },
    })
  }

  console.log(`Seeded ${presetData.length} presets and ${creators.length + 1} users`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
