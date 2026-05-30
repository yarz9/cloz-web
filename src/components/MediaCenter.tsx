'use client'
import { useState } from 'react'
import { Download, Image as ImageIcon, Layout, Monitor, Sparkles, Store, FileImage, Check, User } from 'lucide-react'

export interface MediaAsset {
  name: string
  file: string
  format: string
  resolution: string
  desc?: string
  light?: boolean // preview on a light backing (for light logos)
}

export interface MediaCategory {
  id: string
  label: string
  icon: any
  assets: MediaAsset[]
}

export const MEDIA: MediaCategory[] = [
  {
    id: 'logos', label: 'Logos', icon: Sparkles, assets: [
      { name: 'Logo — Dark', file: '/media/cloz-logo-dark.svg', format: 'SVG', resolution: 'Vector', desc: 'For dark backgrounds' },
      { name: 'Logo — Light', file: '/media/cloz-logo-light.svg', format: 'SVG', resolution: 'Vector', desc: 'For light backgrounds', light: true },
      { name: 'Logo — Mono White', file: '/media/cloz-logo-mono-white.svg', format: 'SVG', resolution: 'Vector', desc: 'Single-color white' },
      { name: 'Logo — Mono Black', file: '/media/cloz-logo-mono-black.svg', format: 'SVG', resolution: 'Vector', desc: 'Single-color black', light: true },
      { name: 'Icon Mark', file: '/media/cloz-icon.svg', format: 'SVG', resolution: '512×512', desc: 'App / favicon mark' },
      { name: 'Icon — White', file: '/media/cloz-icon-white.svg', format: 'SVG', resolution: '512×512', desc: 'Monochrome icon' },
      { name: 'Icon — Cyan', file: '/media/cloz-icon-cyan.svg', format: 'SVG', resolution: '512×512', desc: 'Cyan variant' },
      { name: 'Horizontal Lockup', file: '/media/cloz-logo-horizontal.svg', format: 'SVG', resolution: 'Vector', desc: 'Icon + wordmark' },
      { name: 'Vertical Lockup', file: '/media/cloz-logo-vertical.svg', format: 'SVG', resolution: 'Vector', desc: 'Stacked with tagline' },
    ],
  },
  {
    id: 'avatars', label: 'Avatars', icon: User, assets: [
      { name: 'Avatar', file: '/media/avatar-512.svg', format: 'SVG', resolution: '512×512', desc: 'Profile picture' },
      { name: 'Avatar — Ring', file: '/media/avatar-ring-512.svg', format: 'SVG', resolution: '512×512', desc: 'With gradient ring' },
      { name: 'Avatar — Cyan', file: '/media/avatar-cyan-512.svg', format: 'SVG', resolution: '512×512' },
      { name: 'Avatar — Purple', file: '/media/avatar-purple-512.svg', format: 'SVG', resolution: '512×512' },
    ],
  },
  {
    id: 'banners', label: 'Banners', icon: Layout, assets: [
      { name: 'Website Banner', file: '/media/banner-website.svg', format: 'SVG', resolution: '1920×480' },
      { name: 'Discord Banner', file: '/media/banner-discord.svg', format: 'SVG', resolution: '960×540' },
      { name: 'YouTube Channel Art', file: '/media/banner-youtube.svg', format: 'SVG', resolution: '2560×1440' },
      { name: 'X / Twitter Header', file: '/media/banner-x.svg', format: 'SVG', resolution: '1500×500' },
      { name: 'LinkedIn Banner', file: '/media/banner-linkedin.svg', format: 'SVG', resolution: '1584×396' },
      { name: 'Twitch Offline', file: '/media/banner-twitch-offline.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Facebook Cover', file: '/media/banner-facebook.svg', format: 'SVG', resolution: '1200×630' },
      { name: 'Email Header', file: '/media/banner-email-header.svg', format: 'SVG', resolution: '1200×300' },
    ],
  },
  {
    id: 'wallpapers', label: 'Wallpapers', icon: Monitor, assets: [
      { name: 'Wallpaper — 1080p', file: '/media/wallpaper-1080.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Wallpaper — 1440p', file: '/media/wallpaper-1440.svg', format: 'SVG', resolution: '2560×1440' },
      { name: 'Wallpaper — 4K', file: '/media/wallpaper-4k.svg', format: 'SVG', resolution: '3840×2160' },
      { name: 'Wallpaper — Ultrawide', file: '/media/wallpaper-ultrawide.svg', format: 'SVG', resolution: '3440×1440' },
      { name: 'Wallpaper — Phone', file: '/media/wallpaper-phone.svg', format: 'SVG', resolution: '1080×1920' },
      { name: 'Wallpaper — Cyan', file: '/media/wallpaper-cyan-1080.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Wallpaper — Purple', file: '/media/wallpaper-purple-1080.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Wallpaper — Green', file: '/media/wallpaper-green-1080.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Wallpaper — Amber', file: '/media/wallpaper-amber-1080.svg', format: 'SVG', resolution: '1920×1080' },
    ],
  },
  {
    id: 'social', label: 'Social Posts', icon: ImageIcon, assets: [
      { name: 'Square Post', file: '/media/social-square.svg', format: 'SVG', resolution: '1080×1080' },
      { name: 'Square — Cyan', file: '/media/social-square-cyan.svg', format: 'SVG', resolution: '1080×1080' },
      { name: 'Story / Reel', file: '/media/social-story.svg', format: 'SVG', resolution: '1080×1920' },
    ],
  },
  {
    id: 'badges', label: 'Badges', icon: Sparkles, assets: [
      { name: 'Pro Badge', file: '/media/badge-pro.svg', format: 'SVG', resolution: 'Vector' },
      { name: 'Verified Creator', file: '/media/badge-verified-creator.svg', format: 'SVG', resolution: 'Vector' },
      { name: 'Powered by Cloz', file: '/media/badge-powered-by.svg', format: 'SVG', resolution: 'Vector' },
      { name: 'Available Now', file: '/media/badge-available-now.svg', format: 'SVG', resolution: 'Vector' },
    ],
  },
  {
    id: 'app', label: 'App Screenshots', icon: ImageIcon, assets: [
      { name: 'Dashboard', file: '/media/screenshot-dashboard.svg', format: 'SVG', resolution: '1600×1000' },
    ],
  },
  {
    id: 'marketplace', label: 'Marketplace Screenshots', icon: Store, assets: [
      { name: 'Marketplace', file: '/media/screenshot-marketplace.svg', format: 'SVG', resolution: '1600×1000' },
    ],
  },
  {
    id: 'motion', label: 'Motion / Video', icon: FileImage, assets: [
      { name: 'Intro Reveal', file: '/media/motion-intro-reveal.svg', format: 'Animated SVG', resolution: '1920×1080', desc: 'Logo intro animation' },
      { name: 'Popup / Toast', file: '/media/motion-popup-toast.svg', format: 'Animated SVG', resolution: '600×200', desc: 'Notification animation' },
      { name: 'Loading Spinner', file: '/media/motion-loading-spinner.svg', format: 'Animated SVG', resolution: '200×200', desc: 'Looping loader' },
      { name: 'Lower Third', file: '/media/motion-lower-third.svg', format: 'Animated SVG', resolution: '1920×400', desc: 'Slide-in name bar' },
    ],
  },
  {
    id: 'youtube', label: 'YouTube Kit', icon: FileImage, assets: [
      { name: 'Animated Intro', file: '/media/yt-intro.svg', format: 'Animated SVG', resolution: '1920×1080', desc: 'Channel intro' },
      { name: 'Thumbnail Template', file: '/media/yt-thumbnail-template.svg', format: 'SVG', resolution: '1280×720' },
      { name: 'Gaming Thumbnail', file: '/media/yt-thumbnail-gaming.svg', format: 'SVG', resolution: '1280×720' },
      { name: 'End Screen', file: '/media/yt-endscreen.svg', format: 'SVG', resolution: '1280×720' },
      { name: 'Watermark', file: '/media/yt-watermark.svg', format: 'SVG', resolution: '150×150' },
      { name: 'Channel Art', file: '/media/yt-channel-art.svg', format: 'SVG', resolution: '2560×1440' },
    ],
  },
  {
    id: 'streaming', label: 'Streaming Kit', icon: Monitor, assets: [
      { name: 'Starting Soon', file: '/media/stream-starting-soon.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Be Right Back', file: '/media/stream-brb.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Stream Ending', file: '/media/stream-ending.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Overlay Frame', file: '/media/stream-overlay-frame.svg', format: 'SVG', resolution: '1920×1080' },
      { name: 'Webcam Frame', file: '/media/stream-webcam-frame.svg', format: 'SVG', resolution: '480×270' },
      { name: 'Panel — About', file: '/media/twitch-panel-about.svg', format: 'SVG', resolution: '320×100' },
      { name: 'Panel — Rules', file: '/media/twitch-panel-rules.svg', format: 'SVG', resolution: '320×100' },
      { name: 'Panel — Socials', file: '/media/twitch-panel-socials.svg', format: 'SVG', resolution: '320×100' },
      { name: 'Panel — Donate', file: '/media/twitch-panel-donate.svg', format: 'SVG', resolution: '320×100' },
      { name: 'Panel — Schedule', file: '/media/twitch-panel-schedule.svg', format: 'SVG', resolution: '320×100' },
      { name: 'Panel — PC Specs', file: '/media/twitch-panel-specs.svg', format: 'SVG', resolution: '320×100' },
    ],
  },
  {
    id: 'discord', label: 'Discord Kit', icon: User, assets: [
      { name: 'Server Icon', file: '/media/discord-server-icon.svg', format: 'SVG', resolution: '512×512' },
      { name: 'Server Banner', file: '/media/discord-server-banner.svg', format: 'SVG', resolution: '960×540' },
      { name: 'Welcome Card', file: '/media/discord-welcome-card.svg', format: 'SVG', resolution: '1100×360' },
      { name: 'Rank Card', file: '/media/discord-rank-card.svg', format: 'SVG', resolution: '934×282' },
      { name: 'Emote — Bolt', file: '/media/discord-emote-bolt.svg', format: 'SVG', resolution: '128×128' },
      { name: 'Emote — Fire', file: '/media/discord-emote-fire.svg', format: 'SVG', resolution: '128×128' },
      { name: 'Emote — GG', file: '/media/discord-emote-gg.svg', format: 'SVG', resolution: '128×128' },
      { name: 'Emote — Pog', file: '/media/discord-emote-pog.svg', format: 'SVG', resolution: '128×128' },
      { name: 'Role Icon — Pro', file: '/media/discord-role-pro.svg', format: 'SVG', resolution: '128×128' },
      { name: 'Role Icon — Creator', file: '/media/discord-role-creator.svg', format: 'SVG', resolution: '128×128' },
    ],
  },
  {
    id: 'promo', label: 'Promotional', icon: FileImage, assets: [
      { name: 'Launch Promo', file: '/media/promo-launch.svg', format: 'SVG', resolution: '1200×630' },
      { name: 'Feature Promo', file: '/media/promo-feature.svg', format: 'SVG', resolution: '1200×630' },
      { name: 'AI Promo', file: '/media/promo-ai.svg', format: 'SVG', resolution: '1200×630' },
      { name: 'Gaming Promo', file: '/media/promo-gaming.svg', format: 'SVG', resolution: '1200×630' },
      { name: 'Cloud Promo', file: '/media/promo-cloud.svg', format: 'SVG', resolution: '1200×630' },
      { name: 'Press One-Pager', file: '/media/press-onepager.svg', format: 'SVG', resolution: '1240×1754' },
    ],
  },
]

function AssetCard({ asset }: { asset: MediaAsset }) {
  const [done, setDone] = useState(false)
  const onDownload = () => {
    const a = document.createElement('a')
    a.href = asset.file
    a.download = asset.file.split('/').pop() || 'cloz-asset.svg'
    document.body.appendChild(a); a.click(); a.remove()
    setDone(true); setTimeout(() => setDone(false), 1800)
  }
  return (
    <div className="glass rounded-xl overflow-hidden glass-hover transition-all group">
      <div className="relative aspect-[16/9] flex items-center justify-center overflow-hidden"
        style={{ background: asset.light ? 'repeating-conic-gradient(#1a1a22 0% 25%, #12121a 0% 50%) 50% / 20px 20px' : '#060609' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.file} alt={asset.name} className="max-w-[82%] max-h-[82%] object-contain" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[0.82rem] font-semibold">{asset.name}</span>
          <span className="text-[0.58rem] px-2 py-0.5 rounded-full bg-[rgba(96,165,250,0.1)] text-[#60a5fa] font-bold shrink-0">{asset.format}</span>
        </div>
        <div className="text-[0.66rem] text-[rgba(255,255,255,0.3)] mb-3">
          {asset.resolution}{asset.desc ? ` · ${asset.desc}` : ''}
        </div>
        <button onClick={onDownload}
          className="btn-primary w-full py-2 rounded-lg text-[0.74rem] font-bold flex items-center justify-center gap-2">
          {done ? <><Check size={13} /> Downloaded</> : <><Download size={13} /> Download</>}
        </button>
      </div>
    </div>
  )
}

export default function MediaCenter({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState('all')
  const cats = MEDIA
  const shown = active === 'all' ? cats : cats.filter(c => c.id === active)

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setActive('all')}
          className={`px-3.5 py-1.5 rounded-full text-[0.72rem] font-medium transition-all ${active === 'all' ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
          All Assets
        </button>
        {cats.map(c => {
          const Icon = c.icon
          return (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.72rem] font-medium transition-all ${active === c.id ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
              <Icon size={12} /> {c.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-10">
        {shown.map(cat => {
          const Icon = cat.icon
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg glass-strong flex items-center justify-center">
                  <Icon size={15} className="text-[#60a5fa]" />
                </div>
                <h3 className="text-[0.95rem] font-bold">{cat.label}</h3>
                <span className="text-[0.62rem] text-[rgba(255,255,255,0.25)]">{cat.assets.length} asset{cat.assets.length > 1 ? 's' : ''}</span>
              </div>
              <div className={`grid gap-4 ${compact ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                {cat.assets.map(a => <AssetCard key={a.file} asset={a} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
