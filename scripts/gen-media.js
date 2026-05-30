/**
 * Generates official Cloz Optimizer branding assets as real downloadable SVGs
 * into public/media/. SVGs are vector + scale to any resolution.
 */
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, '..', 'public', 'media')
fs.mkdirSync(OUT, { recursive: true })

const BOLT = '13 2 3 14 12 14 11 22 21 10 12 10 13 2'

// Core brand canvas builder
function brand(w, h, opts = {}) {
  const {
    transparent = false, lightText = false, showWordmark = true, showTagline = false,
    iconScale = 1, layout = 'horizontal', label = '', sublabel = '',
    accent1: a1 = '#60a5fa', accent2: a2 = '#a78bfa', mono = null,
  } = opts
  const accent1 = mono || a1, accent2 = mono || a2
  const textColor = mono || (lightText ? '#04040a' : '#f0f0f5')
  const subColor = lightText ? 'rgba(4,4,10,0.5)' : 'rgba(255,255,255,0.45)'
  const bg = transparent ? '' : `<rect width="${w}" height="${h}" fill="#04040a"/>`
  const grid = transparent ? '' : `
    <defs><pattern id="g" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
    </pattern></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <ellipse cx="${w*0.3}" cy="${h*0.3}" rx="${w*0.4}" ry="${h*0.5}" fill="url(#glow1)"/>
    <ellipse cx="${w*0.8}" cy="${h*0.7}" rx="${w*0.3}" ry="${h*0.4}" fill="url(#glow2)"/>`
  const defs = `<defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent1}"/><stop offset="100%" stop-color="${accent2}"/>
    </linearGradient>
    <radialGradient id="glow1"><stop offset="0%" stop-color="rgba(96,165,250,0.10)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    <radialGradient id="glow2"><stop offset="0%" stop-color="rgba(167,139,250,0.07)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  </defs>`

  // Icon mark: rounded square with gradient border + bolt
  const markSize = Math.round(Math.min(w, h) * 0.16 * iconScale)
  const mark = (cx, cy, size) => `
    <g transform="translate(${cx - size/2}, ${cy - size/2})">
      <rect width="${size}" height="${size}" rx="${size*0.28}" fill="rgba(96,165,250,0.10)" stroke="url(#grad)" stroke-width="${Math.max(1.5,size*0.025)}"/>
      <g transform="translate(${size*0.5}, ${size*0.5}) scale(${size/40}) translate(-12,-12)">
        <polygon points="${BOLT}" fill="none" stroke="url(#grad)" stroke-width="2" stroke-linejoin="round"/>
      </g>
    </g>`

  let content = ''
  if (layout === 'icon') {
    const s = Math.min(w, h) * 0.62
    content = mark(w/2, h/2, s)
  } else if (layout === 'vertical') {
    const s = Math.min(w, h) * 0.28
    content = mark(w/2, h*0.40, s)
    if (showWordmark) content += `<text x="${w/2}" y="${h*0.66}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${w*0.085}" fill="${textColor}">ClozOptimizer</text>`
    if (showTagline) content += `<text x="${w/2}" y="${h*0.76}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="500" font-size="${w*0.032}" letter-spacing="${w*0.006}" fill="${subColor}">PERFORMANCE SUITE</text>`
  } else {
    // horizontal / banner / wallpaper
    const s = Math.min(w, h) * (layout === 'banner' || layout === 'wallpaper' ? 0.34 : 0.5)
    const gx = layout === 'horizontal' ? w*0.16 : w*0.5 - (showWordmark ? w*0.18 : 0)
    const cy = h/2
    if (layout === 'wallpaper' || layout === 'banner') {
      const totalW = s + (showWordmark ? w*0.36 : 0)
      const startX = (w - totalW)/2 + s/2
      content = mark(startX, cy, s)
      if (showWordmark) content += `<text x="${startX + s*0.7}" y="${cy + s*0.12}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${s*0.5}" fill="${textColor}">ClozOptimizer</text>`
      if (showTagline) content += `<text x="${startX + s*0.72}" y="${cy + s*0.42}" font-family="Inter,Arial,sans-serif" font-weight="500" font-size="${s*0.14}" letter-spacing="${s*0.04}" fill="${subColor}">${sublabel || 'PERFORMANCE · OPTIMIZATION · GAMING'}</text>`
    } else {
      content = mark(gx, cy, s)
      if (showWordmark) content += `<text x="${gx + s*0.72}" y="${cy + s*0.16}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${s*0.62}" fill="${textColor}">ClozOptimizer</text>`
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${bg}${grid}${content}</svg>`
}

// Screenshot/promo mockup builder (stylized app frame)
function mockup(w, h, kind) {
  const accent = '#60a5fa'
  const title = kind === 'marketplace' ? 'Marketplace' : kind === 'promo' ? 'ClozOptimizer V2' : 'Dashboard'
  const cards = []
  const cols = 3, rows = 2, pad = w*0.04, top = h*0.18, gw = (w - pad*2 - w*0.18) / cols, gh = (h - top - pad) / rows
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = pad + w*0.18 + c*gw + 8, y = top + r*gh + 8
    cards.push(`<rect x="${x}" y="${y}" width="${gw-16}" height="${gh-16}" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
      <rect x="${x+16}" y="${y+16}" width="${gw*0.4}" height="10" rx="5" fill="${accent}" opacity="0.5"/>
      <rect x="${x+16}" y="${y+34}" width="${gw*0.6}" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><radialGradient id="gl"><stop offset="0%" stop-color="rgba(96,165,250,0.08)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="#060609"/>
    <ellipse cx="${w*0.7}" cy="${h*0.2}" rx="${w*0.4}" ry="${h*0.4}" fill="url(#gl)"/>
    <rect x="0" y="0" width="${w*0.16}" height="${h}" fill="rgba(8,8,14,0.6)"/>
    <g transform="translate(${w*0.03}, ${h*0.06})"><rect width="28" height="28" rx="8" fill="rgba(96,165,250,0.12)" stroke="url(#gr)"/>
      <g transform="translate(14,14) scale(0.7) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#gr)" stroke-width="2"/></g></g>
    ${Array.from({length:7}).map((_,i)=>`<rect x="${w*0.03}" y="${h*0.16+i*h*0.07}" width="${w*0.10}" height="10" rx="5" fill="rgba(255,255,255,${i===0?0.25:0.08})"/>`).join('')}
    <text x="${w*0.18+8}" y="${h*0.11}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${h*0.05}" fill="#f0f0f5">${title}</text>
    ${cards.join('')}
  </svg>`
}

// Circular avatar / profile picture
function avatar(size, opts = {}) {
  const { a1 = '#60a5fa', a2 = '#a78bfa', ring = false } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${a1}"/><stop offset="100%" stop-color="${a2}"/></linearGradient>
    <radialGradient id="ag2"><stop offset="0%" stop-color="rgba(96,165,250,0.18)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#04040a"/>
    <circle cx="${size/2}" cy="${size*0.42}" r="${size*0.42}" fill="url(#ag2)"/>
    ${ring ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2 - size*0.03}" fill="none" stroke="url(#ag)" stroke-width="${size*0.03}"/>` : ''}
    <g transform="translate(${size/2}, ${size/2}) scale(${size/40*0.62}) translate(-12,-12)">
      <polygon points="${BOLT}" fill="none" stroke="url(#ag)" stroke-width="2.2" stroke-linejoin="round"/></g>
  </svg>`
}

// Badge / pill graphic
function badge(text, opts = {}) {
  const { a1 = '#60a5fa', a2 = '#a78bfa', w = 360, h = 120 } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${a1}"/><stop offset="100%" stop-color="${a2}"/></linearGradient></defs>
    <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="${h/2}" fill="rgba(96,165,250,0.08)" stroke="url(#bg)" stroke-width="2"/>
    <g transform="translate(${h*0.28}, ${h/2}) scale(${h/40*0.5}) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#bg)" stroke-width="2.4" stroke-linejoin="round"/></g>
    <text x="${h*0.62}" y="${h*0.62}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="${h*0.34}" fill="#f0f0f5">${text}</text>
  </svg>`
}

// Twitch panel (small banner)
function panel(label, a = '#60a5fa') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="100" viewBox="0 0 320 100">
    <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="320" height="100" fill="#0a0a12"/>
    <rect x="0" y="0" width="6" height="100" fill="url(#pg)"/>
    <g transform="translate(40,50) scale(${28/40}) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#pg)" stroke-width="2.4"/></g>
    <text x="70" y="58" font-family="Inter,sans-serif" font-weight="800" font-size="22" letter-spacing="2" fill="#f0f0f5">${label}</text>
  </svg>`
}
// Discord emote (small square)
function emote(glyph, a = '#60a5fa') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="128" height="128" rx="28" fill="rgba(96,165,250,0.10)"/>
    ${glyph === 'bolt'
      ? `<g transform="translate(64,64) scale(2.4) translate(-12,-12)"><polygon points="${BOLT}" fill="url(#eg)"/></g>`
      : `<text x="64" y="90" text-anchor="middle" font-size="68">${glyph}</text>`}
  </svg>`
}
// Full-screen stream scene (Starting Soon / BRB / Ending)
function screen(title, sub, a = '#60a5fa') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient>
    <radialGradient id="sgl"><stop offset="0%" stop-color="${a}22"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    <pattern id="sgp" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="rgba(255,255,255,0.02)"/></pattern></defs>
    <rect width="1920" height="1080" fill="#04040a"/>
    <ellipse cx="960" cy="540" rx="700" ry="500" fill="url(#sgl)"/>
    <rect width="1920" height="1080" fill="url(#sgp)"/>
    <g transform="translate(960,420) scale(5) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#sg)" stroke-width="2"/></g>
    <text x="960" y="640" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="96" fill="#f0f0f5">${title}</text>
    <text x="960" y="700" text-anchor="middle" font-family="Inter,sans-serif" font-weight="500" font-size="28" letter-spacing="6" fill="${a}">${sub}</text>
  </svg>`
}
// Card with avatar slot + name (welcome / rank / thumbnail)
function card(w, h, title, sub, a = '#60a5fa') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="${w}" height="${h}" rx="24" fill="#0a0a12"/>
    <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="22" fill="none" stroke="url(#cg)" stroke-width="2" opacity="0.4"/>
    <circle cx="${h/2}" cy="${h/2}" r="${h*0.30}" fill="rgba(96,165,250,0.12)" stroke="url(#cg)" stroke-width="3"/>
    <g transform="translate(${h/2},${h/2}) scale(${h*0.30/40}) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#cg)" stroke-width="2"/></g>
    <text x="${h}" y="${h*0.46}" font-family="Inter,sans-serif" font-weight="800" font-size="${h*0.15}" fill="#f0f0f5">${title}</text>
    <text x="${h}" y="${h*0.62}" font-family="Inter,sans-serif" font-weight="500" font-size="${h*0.085}" fill="${a}">${sub}</text>
  </svg>`
}

// Animated (SMIL) SVG motion graphics — real, playable, screen-recordable
function motion(kind) {
  const grad = `<linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient>`
  if (kind === 'intro') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs>${grad}</defs>
      <rect width="1920" height="1080" fill="#04040a"/>
      <g transform="translate(960,540)">
        <circle r="180" fill="none" stroke="url(#mg)" stroke-width="3" stroke-dasharray="900 200" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite"/>
        </circle>
        <g opacity="0"><animate attributeName="opacity" values="0;1" dur="1s" begin="0.3s" fill="freeze"/>
          <animateTransform attributeName="transform" type="scale" values="0.6;1" dur="1s" begin="0.3s" fill="freeze" additive="sum"/>
          <g transform="scale(6) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#mg)" stroke-width="2" stroke-linejoin="round"/></g>
        </g>
        <text y="280" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="72" fill="#f0f0f5" opacity="0">ClozOptimizer
          <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1s" fill="freeze"/></text>
      </g></svg>`
  }
  if (kind === 'popup') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><defs>${grad}</defs>
      <g opacity="0" transform="translate(0,30)">
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.15;0.8;0.9;1" dur="4s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" values="0,30;0,0;0,0;0,30" keyTimes="0;0.15;0.85;1" dur="4s" repeatCount="indefinite"/>
        <rect x="20" y="60" width="560" height="80" rx="16" fill="rgba(255,255,255,0.04)" stroke="url(#mg)" stroke-width="1.5"/>
        <g transform="translate(56,100) scale(1.2) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#mg)" stroke-width="2"/></g>
        <text x="92" y="95" font-family="Inter,sans-serif" font-weight="700" font-size="20" fill="#f0f0f5">Optimization Applied</text>
        <text x="92" y="118" font-family="Inter,sans-serif" font-size="13" fill="rgba(255,255,255,0.5)">System tuned · +14% performance</text>
      </g></svg>`
  }
  if (kind === 'spinner') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs>${grad}</defs>
      <rect width="200" height="200" fill="#04040a"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#mg)" stroke-width="6" stroke-linecap="round" stroke-dasharray="110 330">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="1.1s" repeatCount="indefinite"/>
      </circle>
      <g transform="translate(100,100) scale(1.6) translate(-12,-12)"><polygon points="${BOLT}" fill="none" stroke="url(#mg)" stroke-width="2"/></g></svg>`
  }
  // lower-third
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="400" viewBox="0 0 1920 400"><defs>${grad}</defs>
    <g opacity="0" transform="translate(-80,0)">
      <animate attributeName="opacity" values="0;1" dur="0.6s" begin="0.2s" fill="freeze"/>
      <animateTransform attributeName="transform" type="translate" values="-80,0;0,0" dur="0.6s" begin="0.2s" fill="freeze"/>
      <rect x="120" y="240" width="8" height="90" fill="url(#mg)"/>
      <rect x="140" y="240" width="520" height="90" rx="10" fill="rgba(4,4,10,0.7)"/>
      <text x="168" y="285" font-family="Inter,sans-serif" font-weight="800" font-size="34" fill="#f0f0f5">ClozOptimizer</text>
      <text x="168" y="314" font-family="Inter,sans-serif" font-size="16" fill="#60a5fa">Performance Suite</text>
    </g></svg>`
}

const files = {
  // Logos
  'cloz-logo-dark.svg': brand(800, 240, { transparent: true, lightText: false, layout: 'horizontal' }),
  'cloz-logo-light.svg': brand(800, 240, { transparent: true, lightText: true, layout: 'horizontal' }),
  'cloz-icon.svg': brand(512, 512, { transparent: true, layout: 'icon' }),
  'cloz-logo-horizontal.svg': brand(1000, 260, { transparent: true, layout: 'horizontal' }),
  'cloz-logo-vertical.svg': brand(420, 520, { transparent: true, layout: 'vertical', showTagline: true }),
  // Banners
  'banner-website.svg': brand(1920, 480, { layout: 'banner', showTagline: true }),
  'banner-discord.svg': brand(960, 540, { layout: 'banner', showTagline: true }),
  'banner-youtube.svg': brand(2560, 1440, { layout: 'banner', showTagline: true }),
  'banner-x.svg': brand(1500, 500, { layout: 'banner', showTagline: true }),
  'banner-linkedin.svg': brand(1584, 396, { layout: 'banner', showTagline: true }),
  // Wallpapers
  'wallpaper-1080.svg': brand(1920, 1080, { layout: 'wallpaper', showTagline: true }),
  'wallpaper-1440.svg': brand(2560, 1440, { layout: 'wallpaper', showTagline: true }),
  'wallpaper-4k.svg': brand(3840, 2160, { layout: 'wallpaper', showTagline: true }),
  // Screenshots
  'screenshot-dashboard.svg': mockup(1600, 1000, 'dashboard'),
  'screenshot-marketplace.svg': mockup(1600, 1000, 'marketplace'),
  // Promo
  'promo-launch.svg': mockup(1200, 630, 'promo'),
  'promo-feature.svg': brand(1200, 630, { layout: 'wallpaper', showTagline: true, sublabel: 'AI · CLOUD SYNC · MARKETPLACE' }),

  // ---- Logos (additional) ----
  'cloz-logo-mono-white.svg': brand(800, 240, { transparent: true, layout: 'horizontal', mono: '#ffffff' }),
  'cloz-logo-mono-black.svg': brand(800, 240, { transparent: true, layout: 'horizontal', mono: '#04040a' }),
  'cloz-icon-white.svg': brand(512, 512, { transparent: true, layout: 'icon', mono: '#ffffff' }),
  'cloz-icon-cyan.svg': brand(512, 512, { transparent: true, layout: 'icon', accent1: '#22d3ee', accent2: '#2dd4bf' }),

  // ---- Avatars / profile pictures ----
  'avatar-512.svg': avatar(512),
  'avatar-ring-512.svg': avatar(512, { ring: true }),
  'avatar-cyan-512.svg': avatar(512, { a1: '#22d3ee', a2: '#2dd4bf', ring: true }),
  'avatar-purple-512.svg': avatar(512, { a1: '#a855f7', a2: '#e879f9', ring: true }),

  // ---- Wallpapers (additional sizes + accents) ----
  'wallpaper-ultrawide.svg': brand(3440, 1440, { layout: 'wallpaper', showTagline: true }),
  'wallpaper-phone.svg': brand(1080, 1920, { layout: 'vertical', showTagline: true }),
  'wallpaper-cyan-1080.svg': brand(1920, 1080, { layout: 'wallpaper', showTagline: true, accent1: '#22d3ee', accent2: '#2dd4bf' }),
  'wallpaper-purple-1080.svg': brand(1920, 1080, { layout: 'wallpaper', showTagline: true, accent1: '#a855f7', accent2: '#e879f9' }),
  'wallpaper-green-1080.svg': brand(1920, 1080, { layout: 'wallpaper', showTagline: true, accent1: '#10b981', accent2: '#34d399' }),
  'wallpaper-amber-1080.svg': brand(1920, 1080, { layout: 'wallpaper', showTagline: true, accent1: '#f59e0b', accent2: '#fbbf24' }),

  // ---- Banners (additional) ----
  'banner-twitch-offline.svg': brand(1920, 1080, { layout: 'banner', showTagline: true }),
  'banner-facebook.svg': brand(1200, 630, { layout: 'banner', showTagline: true }),
  'banner-email-header.svg': brand(1200, 300, { layout: 'banner', showTagline: true }),

  // ---- Social posts ----
  'social-square.svg': brand(1080, 1080, { layout: 'wallpaper', showTagline: true }),
  'social-square-cyan.svg': brand(1080, 1080, { layout: 'wallpaper', showTagline: true, accent1: '#22d3ee', accent2: '#2dd4bf' }),
  'social-story.svg': brand(1080, 1920, { layout: 'vertical', showTagline: true }),

  // ---- Badges ----
  'badge-pro.svg': badge('PRO', { a1: '#fbbf24', a2: '#f59e0b' }),
  'badge-verified-creator.svg': badge('VERIFIED CREATOR', { w: 560 }),
  'badge-powered-by.svg': badge('Powered by Cloz', { w: 520, a1: '#60a5fa', a2: '#a78bfa' }),
  'badge-available-now.svg': badge('AVAILABLE NOW', { w: 520, a1: '#4ade80', a2: '#22d3ee' }),

  // ---- Promo (additional) ----
  'promo-ai.svg': brand(1200, 630, { layout: 'wallpaper', showTagline: true, accent1: '#a855f7', accent2: '#e879f9', sublabel: 'AI INTELLIGENCE ENGINE' }),
  'promo-gaming.svg': brand(1200, 630, { layout: 'wallpaper', showTagline: true, accent1: '#f87171', accent2: '#fb7185', sublabel: 'GAMING HUB · MAX FPS' }),
  'promo-cloud.svg': brand(1200, 630, { layout: 'wallpaper', showTagline: true, accent1: '#22d3ee', accent2: '#2dd4bf', sublabel: 'CLOUD SYNC ACROSS DEVICES' }),
  'press-onepager.svg': brand(1240, 1754, { layout: 'vertical', showTagline: true }),

  // ---- Motion graphics (animated SVG) ----
  'motion-intro-reveal.svg': motion('intro'),
  'motion-popup-toast.svg': motion('popup'),
  'motion-loading-spinner.svg': motion('spinner'),
  'motion-lower-third.svg': motion('lowerthird'),

  // ---- YouTube creator kit ----
  'yt-intro.svg': motion('intro'),
  'yt-thumbnail-template.svg': card(1280, 720, 'CLOZ', 'EPIC OPTIMIZATION'),
  'yt-thumbnail-gaming.svg': card(1280, 720, 'MAX FPS', 'GAMING SETUP', '#f87171'),
  'yt-endscreen.svg': brand(1280, 720, { layout: 'wallpaper', showTagline: true, sublabel: 'SUBSCRIBE · LIKE · SHARE' }),
  'yt-watermark.svg': brand(150, 150, { transparent: true, layout: 'icon' }),
  'yt-channel-art.svg': brand(2560, 1440, { layout: 'banner', showTagline: true }),

  // ---- Twitch / streaming kit ----
  'twitch-panel-about.svg': panel('ABOUT'),
  'twitch-panel-rules.svg': panel('RULES', '#f87171'),
  'twitch-panel-socials.svg': panel('SOCIALS', '#a855f7'),
  'twitch-panel-donate.svg': panel('DONATE', '#4ade80'),
  'twitch-panel-schedule.svg': panel('SCHEDULE', '#fbbf24'),
  'twitch-panel-specs.svg': panel('PC SPECS', '#22d3ee'),
  'stream-starting-soon.svg': screen('STARTING SOON', 'ClozOptimizer · Stream'),
  'stream-brb.svg': screen('BE RIGHT BACK', 'Grab a drink', '#fbbf24'),
  'stream-ending.svg': screen('THANKS FOR WATCHING', 'See you next stream', '#a855f7'),
  'stream-overlay-frame.svg': brand(1920, 1080, { transparent: true, layout: 'wallpaper', showWordmark: false }),
  'stream-webcam-frame.svg': card(480, 270, 'LIVE', 'ClozOptimizer', '#f87171'),

  // ---- Discord kit ----
  'discord-server-icon.svg': avatar(512, { ring: true }),
  'discord-emote-bolt.svg': emote('bolt'),
  'discord-emote-fire.svg': emote('🔥', '#f87171'),
  'discord-emote-gg.svg': emote('🎮', '#a855f7'),
  'discord-emote-pog.svg': emote('⚡', '#fbbf24'),
  'discord-role-pro.svg': emote('👑', '#fbbf24'),
  'discord-role-creator.svg': emote('🛠️', '#22d3ee'),
  'discord-welcome-card.svg': card(1100, 360, 'Welcome!', 'to the Cloz community'),
  'discord-rank-card.svg': card(934, 282, 'Level 12', 'Cloz Member · 4,200 XP', '#4ade80'),
  'discord-server-banner.svg': brand(960, 540, { layout: 'banner', showTagline: true }),

  // ---- Extras ----
  'quote-card.svg': card(1080, 1080, 'Optimize.', 'Then dominate.', '#a855f7'),
  'thumbnail-blank.svg': brand(1280, 720, { layout: 'wallpaper', showWordmark: false }),
  'sticker-pack-bolt.svg': emote('bolt', '#22d3ee'),
}

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), svg, 'utf-8')
}
console.log(`Generated ${Object.keys(files).length} media assets into public/media/`)
