import { Brain, Gamepad2, Shield, BarChart3, SlidersHorizontal, Store, Cloud, Wrench, Cpu, MemoryStick, HardDrive, Thermometer, Activity, Zap, Monitor, Database, Wifi, Lock, Terminal, Crown, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    title: "AI Intelligence",
    icon: Brain,
    color: "#a78bfa",
    desc: "Real-time system analysis powered by live hardware data",
    items: ["System Health Score — live CPU, RAM, thermal, storage, startup scoring", "Bottleneck Analyzer — identifies your weakest component in real time", "Smart Recommendations — actionable fixes based on actual system state", "AI Troubleshooter — describe your issue, get diagnosis + steps"],
  },
  {
    title: "Optimization Profiles",
    icon: SlidersHorizontal,
    color: "#60a5fa",
    desc: "One-click system tuning that actually changes your system",
    items: ["Competitive Gaming — Ultimate Performance plan, 12+ services stopped, Game DVR disabled", "Streaming — OBS priority boost, upload optimization, balanced CPU split", "Video Editing — editor process priority, GPU acceleration, max memory", "Battery Saver — 60% CPU cap, 15+ services stopped, Power Saver plan", "Full rollback — every change is tracked and reversible"],
  },
  {
    title: "Gaming Hub",
    icon: Gamepad2,
    color: "#f87171",
    desc: "Maximum FPS with zero compromise",
    items: ["Game Mode — kills background processes, frees RAM, boosts priority", "Process Priority Manager — set game executables to High/Realtime", "Mouse acceleration removal — raw input for competitive shooters", "Xbox Game DVR disabler — removes background recording overhead", "Network latency optimization — DNS switching, traffic prioritization"],
  },
  {
    title: "Security & Privacy",
    icon: Shield,
    color: "#4ade80",
    desc: "Windows hardening and telemetry control",
    items: ["Privacy toggles — disable tracking, telemetry, data collection", "Security Scanner — Defender status, firewall, UAC, Windows Update", "File Shredder — secure multi-pass file deletion", "Hosts Editor — block domains at system level", "Service Manager — disable unnecessary Windows services"],
  },
  {
    title: "Analytics & Monitoring",
    icon: BarChart3,
    color: "#fbbf24",
    desc: "Real data collected from your system over time",
    items: ["Daily performance stats — CPU, RAM, temperature averages", "Boot time tracking — historical boot duration chart", "Optimization history — every action logged with timestamps", "Live CPU/GPU/RAM charts — real-time hardware monitoring", "Temperature monitoring — CPU, GPU, disk thermal data"],
  },
  {
    title: "45+ System Tools",
    icon: Wrench,
    color: "#22d3ee",
    desc: "Everything from registry cleaning to disk analysis",
    items: ["Cleanup Suite — temp files, browser cache, Windows junk", "Registry Cleaner — scan and fix broken registry entries", "Disk Analyzer — visualize storage usage by folder", "RAM Optimizer — clear standby memory, trim processes", "Benchmark Suite — CPU, memory, disk speed testing", "Driver Scanner, Defrag Manager, Boot Analyzer, Duplicate Finder..."],
  },
  {
    title: "Marketplace",
    icon: Store,
    color: "#4ade80",
    desc: "Community presets, themes, and game configs",
    items: ["Browse UI Presets, Game Profiles, Windows Presets", "One-click install with version management", "Rate, review, and favorite community content", "Creator profiles — publish and manage your own presets", "Verified badges and featured content"],
  },
  {
    title: "Cloud Platform",
    icon: Cloud,
    color: "#60a5fa",
    desc: "Sync everything across all your devices",
    items: ["Settings sync — app preferences across PCs", "Profile sync — optimization profiles on every device", "Marketplace purchases — install once, available everywhere", "Cloud backups — restore your configuration anytime", "Device management — see and manage all linked PCs"],
  },
]

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <Sparkles size={12} className="text-[#60a5fa]" />
          <span className="text-[0.72rem] text-[rgba(255,255,255,0.4)]">V2.0 Feature Set</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Every Feature.{" "}<span className="gradient-text">Fully Functional.</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] max-w-2xl mx-auto text-lg">
          No placeholders. No mock data. Every button does what it says.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat, i) => (
          <div key={cat.title} className="glass rounded-2xl p-8 md:p-10 glass-hover transition-all">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}20` }}>
                <cat.icon size={22} style={{ color: cat.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">{cat.title}</h2>
                <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">{cat.desc}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3 pl-0 md:pl-17">
              {cat.items.map(item => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: cat.color }} />
                  <span className="text-[0.78rem] text-[rgba(255,255,255,0.5)] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/downloads" className="btn-primary px-8 py-3.5 rounded-xl text-[0.9rem] font-bold inline-flex items-center gap-2.5">
          Download ClozOptimizer <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
