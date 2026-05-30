import { CheckCircle2, Clock, Sparkles, Zap, Brain, Store, Cloud, Gamepad2, Monitor, Smartphone, Palette, Shield, Globe } from "lucide-react"

type Status = 'done' | 'in-progress' | 'planned' | 'future'

const roadmapItems: { quarter: string; items: { title: string; desc: string; status: Status; icon: any }[] }[] = [
  {
    quarter: 'Q1 2025 — Foundation',
    items: [
      { title: 'Core Application', desc: 'Dashboard, cleanup, startup, game mode, network tools', status: 'done', icon: Zap },
      { title: '35+ System Tools', desc: 'Registry, RAM, disk, battery, drivers, benchmark, privacy, services', status: 'done', icon: Monitor },
      { title: 'Pro Licensing', desc: 'License activation, Discord OAuth, approval system', status: 'done', icon: Shield },
    ],
  },
  {
    quarter: 'Q2 2026 — V2 Ecosystem',
    items: [
      { title: 'AI Intelligence', desc: 'Health scoring, bottleneck detection, recommendations, troubleshooter', status: 'done', icon: Brain },
      { title: 'Optimization Profiles', desc: 'Gaming, Streaming, Editing, Work, Battery with real system changes', status: 'done', icon: Zap },
      { title: 'Community Marketplace', desc: 'Browse, install, rate, publish presets', status: 'done', icon: Store },
      { title: 'Cloud Sync', desc: 'Settings, profiles, presets synced across devices', status: 'done', icon: Cloud },
      { title: 'Official Website', desc: 'Next.js site with Prisma DB, auth, marketplace API, cloud sync API', status: 'done', icon: Globe },
      { title: 'Analytics Center', desc: 'Real data collection, boot times, daily stats, optimization history', status: 'done', icon: Monitor },
    ],
  },
  {
    quarter: 'Q3 2026 — Platform Growth',
    items: [
      { title: 'Railway Deployment', desc: 'Production hosting with PostgreSQL, CDN, auto-scaling', status: 'planned', icon: Cloud },
      { title: 'Creator Dashboard', desc: 'Analytics, version management, revenue tracking for creators', status: 'planned', icon: Palette },
      { title: 'Game Auto-Detection', desc: 'Detect Steam, Epic, Riot games and apply optimal settings', status: 'planned', icon: Gamepad2 },
      { title: 'Advanced AI', desc: 'ML-based optimization suggestions, predictive issue detection', status: 'planned', icon: Brain },
    ],
  },
  {
    quarter: 'Q4 2026 — Expansion',
    items: [
      { title: 'Mobile Companion App', desc: 'Remote monitoring, push notifications, remote optimization', status: 'future', icon: Smartphone },
      { title: 'Dashboard Builder', desc: 'Drag-and-drop widget system for custom dashboards', status: 'future', icon: Monitor },
      { title: 'RGB Integration', desc: 'Sync RGB lighting with system performance and profiles', status: 'future', icon: Palette },
      { title: 'Marketplace Economy', desc: 'Premium presets, creator monetization, featured promotions', status: 'future', icon: Store },
    ],
  },
]

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  done: { label: 'Shipped', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  'in-progress': { label: 'In Progress', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  planned: { label: 'Planned', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  future: { label: 'Future', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.03)' },
}

export default function RoadmapPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Roadmap</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">Where we&apos;ve been and where we&apos;re going</p>
      </div>

      {/* Status legend */}
      <div className="flex justify-center gap-6 mb-12">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
            <span className="text-[0.72rem] text-[rgba(255,255,255,0.4)]">{cfg.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {roadmapItems.map((section, si) => (
          <div key={section.quarter}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full glass-strong flex items-center justify-center text-[0.65rem] font-bold text-[#60a5fa]">
                {si + 1}
              </div>
              {section.quarter}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 pl-11">
              {section.items.map(item => {
                const cfg = statusConfig[item.status]
                return (
                  <div key={item.title} className="glass rounded-xl p-5 glass-hover transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: cfg.bg }}>
                        <item.icon size={16} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[0.85rem] font-bold">{item.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[0.55rem] font-bold"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[0.72rem] text-[rgba(255,255,255,0.35)] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
