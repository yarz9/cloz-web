import Link from "next/link"
import {
  Zap, Download, Gamepad2, Shield, BarChart3, Brain, SlidersHorizontal, Store,
  Cloud, Monitor, Cpu, MemoryStick, Thermometer, HardDrive, Wrench, Crown,
  ChevronRight, Star, ArrowRight, CheckCircle2, Sparkles, Globe,
} from "lucide-react"

const features = [
  { icon: Brain, title: "AI Intelligence", desc: "Real-time health scoring, bottleneck detection, and AI-powered troubleshooting", color: "#a78bfa" },
  { icon: Gamepad2, title: "Gaming Hub", desc: "One-click game profiles, FPS boost, process optimization, and latency reduction", color: "#f87171" },
  { icon: SlidersHorizontal, title: "Optimization Profiles", desc: "Instant system tuning — Gaming, Streaming, Editing, Work, Battery modes", color: "#60a5fa" },
  { icon: Shield, title: "Security & Privacy", desc: "Telemetry blocking, firewall management, startup security scanning", color: "#4ade80" },
  { icon: BarChart3, title: "Analytics Center", desc: "Track performance trends, boot times, optimization history over time", color: "#fbbf24" },
  { icon: Store, title: "Marketplace", desc: "Community presets, game configs, UI themes — browse, install, and share", color: "#22d3ee" },
  { icon: Cloud, title: "Cloud Sync", desc: "Settings, profiles, and presets synced across all your devices", color: "#60a5fa" },
  { icon: Wrench, title: "45+ Tools", desc: "Registry cleaner, disk analyzer, RAM optimizer, driver scanner, and more", color: "#a78bfa" },
]

const stats = [
  { value: "45+", label: "System Tools" },
  { value: "6", label: "Optimization Profiles" },
  { value: "15+", label: "Backend Modules" },
  { value: "100%", label: "Free Core" },
]

const plans = [
  { name: "Free", price: "$0", original: "", period: "forever", features: ["Dashboard & Monitoring", "Cleanup & Startup Manager", "RAM Optimizer", "Process Manager", "Network Tools", "Community Support"], cta: "Download Free", ctaStyle: "btn-white", popular: false },
  { name: "Pro", price: "$4.99", original: "$9.99", period: "/month", features: ["Everything in Free", "AI Intelligence Suite", "Optimization Profiles", "Privacy & Security Tools", "Cloud Sync", "Marketplace Access", "Registry Cleaner", "Priority Support"], cta: "Get Pro", ctaStyle: "btn-primary", popular: true },
  { name: "Lifetime", price: "$74.99", original: "$149.99", period: "one time", features: ["Everything in Pro", "Lifetime Updates", "All Future Features", "Exclusive Presets", "Beta Access", "Creator Dashboard"], cta: "Go Lifetime", ctaStyle: "btn-primary", popular: false },
]

export default function Home() {
  return (
    <div>
      {/* ============= PROMO ANNOUNCEMENT BAR ============= */}
      <div className="relative overflow-hidden border-b border-[rgba(251,191,36,0.12)]" style={{ background: 'linear-gradient(90deg, rgba(251,191,36,0.08), rgba(167,139,250,0.06))' }}>
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3 text-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.25)]">
            <Sparkles size={11} /> LIMITED TIME
          </span>
          <span className="text-[0.8rem] text-[rgba(255,255,255,0.7)]">
            <b className="text-white">50% OFF</b> all Pro &amp; Lifetime plans — launch promotion
          </span>
          <Link href="/pricing" className="text-[0.75rem] font-semibold text-[#60a5fa] hover:underline flex items-center gap-1">
            Claim discount <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ============= CREATOR RECRUITMENT ANNOUNCEMENT ============= */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="glass-strong rounded-2xl p-6 md:p-7 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.10),transparent_70%)] pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(167,139,250,0.2)] to-[rgba(96,165,250,0.1)] border border-[rgba(167,139,250,0.2)] flex items-center justify-center shrink-0">
            <Crown size={22} className="text-[#a78bfa]" />
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-[rgba(167,139,250,0.12)] text-[#a78bfa]">NOW HIRING</span>
              <span className="text-[0.62rem] text-[rgba(255,255,255,0.35)]">Creator Program</span>
            </div>
            <h3 className="text-[1.05rem] font-bold mb-1">We&apos;re looking for content creators &amp; preset makers</h3>
            <p className="text-[0.8rem] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-2xl">
              Make videos, build presets, or grow the community? Join the Cloz Creator Program for a free Lifetime license, revenue share on premium presets, early access to features, and a verified badge.
            </p>
          </div>
          <Link href="/contact" className="btn-primary px-6 py-2.5 rounded-xl text-[0.82rem] font-bold shrink-0 relative z-10 flex items-center gap-2">
            Apply Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ============= HERO ============= */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.06)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.04)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_20%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
              <Sparkles size={12} className="text-[#fbbf24]" />
              <span className="text-[0.72rem] text-[rgba(255,255,255,0.5)]">V2.0 — AI Intelligence + Cloud Sync + Marketplace</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up delay-100">
              The Ultimate{" "}
              <span className="gradient-text">Windows Performance</span>{" "}
              Platform
            </h1>

            <p className="text-base md:text-lg text-[rgba(255,255,255,0.45)] leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
              AI-powered optimization, real-time monitoring, gaming profiles, cloud sync, and 45+ system tools — all in one premium desktop application.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <Link href="/downloads" className="btn-primary px-8 py-3.5 rounded-xl text-[0.9rem] font-bold flex items-center justify-center gap-2.5">
                <Download size={18} /> Download Free
              </Link>
              <Link href="/features" className="btn-white px-8 py-3.5 rounded-xl text-[0.9rem] font-medium flex items-center justify-center gap-2.5">
                Explore Features <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up delay-400">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-glow-blue">{s.value}</div>
                  <div className="text-[0.7rem] text-[rgba(255,255,255,0.3)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= APP PREVIEW ============= */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-24">
        <div className="glass-strong rounded-2xl p-2 glow-blue animate-fade-in-up delay-500">
          <div className="rounded-xl overflow-hidden bg-[#060609] aspect-[16/9] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-[#60a5fa]" />
              </div>
              <p className="text-[0.85rem] text-[rgba(255,255,255,0.3)]">Application Preview</p>
              <p className="text-[0.7rem] text-[rgba(255,255,255,0.15)] mt-1">Screenshot of ClozOptimizer V2 dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FEATURES ============= */}
      <section id="features" className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Everything You Need.{" "}
            <span className="gradient-text">Nothing You Don&apos;t.</span>
          </h2>
          <p className="text-[rgba(255,255,255,0.4)] max-w-xl mx-auto">
            From AI diagnostics to community presets — a complete ecosystem for Windows performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={f.title} className="glass rounded-xl p-6 glass-hover transition-all group cursor-default"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h3 className="text-[0.9rem] font-bold mb-2 group-hover:text-white transition-colors">{f.title}</h3>
              <p className="text-[0.75rem] text-[rgba(255,255,255,0.35)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============= MARKETPLACE PREVIEW ============= */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-6">
              <Store size={12} className="text-[#4ade80]" />
              <span className="text-[0.68rem] text-[rgba(255,255,255,0.4)]">Community Marketplace</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Discover. Install.{" "}
              <span className="gradient-text">Share.</span>
            </h2>
            <p className="text-[rgba(255,255,255,0.4)] leading-relaxed mb-6">
              Browse thousands of community-created presets, game configs, UI themes, and optimization profiles. Install with one click. Publish your own creations.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["UI Presets", "Game Profiles", "Windows Presets", "Themes", "Widgets", "Verified"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-[0.68rem] glass text-[rgba(255,255,255,0.4)]">
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/marketplace" className="btn-primary px-6 py-2.5 rounded-lg text-[0.82rem] font-semibold inline-flex items-center gap-2">
              Browse Marketplace <ArrowRight size={14} />
            </Link>
          </div>
          <div className="glass-strong rounded-2xl p-6 space-y-3">
            {[
              { name: "Midnight Cyan", author: "ClozTeam", downloads: "12.8k", rating: "4.9", color: "#22d3ee", cat: "UI Preset" },
              { name: "Valorant Pro", author: "FPSGod", downloads: "8.9k", rating: "4.7", color: "#f87171", cat: "Game Profile" },
              { name: "Ultra Clean Win", author: "WinTweaker", downloads: "6.3k", rating: "4.8", color: "#4ade80", cat: "Windows Preset" },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-4 p-3 rounded-xl glass glass-hover transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${p.color}15` }}>
                  <Sparkles size={16} style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.82rem] font-semibold">{p.name}</div>
                  <div className="text-[0.65rem] text-[rgba(255,255,255,0.3)]">by {p.author} · {p.cat}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-[0.65rem] text-[#fbbf24]">
                    <Star size={10} fill="#fbbf24" /> {p.rating}
                  </div>
                  <div className="text-[0.6rem] text-[rgba(255,255,255,0.2)]">{p.downloads}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text-gold">Pricing</span>
          </h2>
          <p className="text-[rgba(255,255,255,0.4)]">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map(plan => (
            <div key={plan.name} className={`glass rounded-2xl p-7 relative overflow-hidden transition-all hover:scale-[1.02] ${plan.popular ? 'border-[rgba(96,165,250,0.3)] glow-blue' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent" />
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium">{plan.name}</span>
                {plan.original && <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-[rgba(251,191,36,0.15)] text-[#fbbf24]">50% OFF</span>}
              </div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                {plan.original && <span className="text-[0.85rem] text-[rgba(255,255,255,0.3)] line-through">{plan.original}</span>}
                <span className="text-[0.72rem] text-[rgba(255,255,255,0.3)]">{plan.period}</span>
              </div>
              {plan.popular && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-[rgba(96,165,250,0.15)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)] mb-4">
                  Most Popular
                </span>
              )}
              <ul className="space-y-2.5 my-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[0.78rem] text-[rgba(255,255,255,0.5)]">
                    <CheckCircle2 size={14} className="text-[#4ade80] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`${plan.ctaStyle} w-full py-3 rounded-xl text-[0.82rem] font-bold`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.06),transparent_70%)]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.04),transparent_70%)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 relative z-10">
            Ready to Optimize?
          </h2>
          <p className="text-[rgba(255,255,255,0.4)] max-w-lg mx-auto mb-8 relative z-10">
            Join thousands of users who trust ClozOptimizer for peak PC performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/downloads" className="btn-primary px-8 py-3.5 rounded-xl text-[0.9rem] font-bold flex items-center justify-center gap-2.5">
              <Download size={18} /> Download Free
            </Link>
            <Link href="/marketplace" className="btn-white px-8 py-3.5 rounded-xl text-[0.9rem] font-medium flex items-center justify-center gap-2.5">
              <Store size={16} /> Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
