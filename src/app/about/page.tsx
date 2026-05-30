import { Zap, Shield, Sparkles, Globe, Users, Code, Heart, Award } from "lucide-react"

const values = [
  { icon: Zap, title: "Performance First", desc: "Every feature is built around making your PC faster, not slower. No bloat, no background processes you don't need." },
  { icon: Shield, title: "Privacy Respecting", desc: "We don't collect telemetry. Your data stays on your machine. Cloud sync is opt-in and end-to-end managed." },
  { icon: Code, title: "Real Functionality", desc: "No mock data. No placeholders. Every button does exactly what it claims. Every optimization makes a real change." },
  { icon: Users, title: "Community Driven", desc: "The marketplace, presets, and profiles are powered by the community. Build, share, and discover together." },
]

const timeline = [
  { year: "2024", title: "Genesis", desc: "ClozOptimizer V1 — cleanup, startup manager, game mode, network tools" },
  { year: "2025", title: "Growth", desc: "20+ new features, Pro licensing, Discord bot, system tweaks and privacy tools" },
  { year: "2026", title: "V2 Launch", desc: "AI Intelligence, Optimization Profiles, Cloud Sync, Marketplace, 45+ tools, full ecosystem" },
  { year: "Future", title: "Platform", desc: "Mobile companion, advanced AI, marketplace economy, hardware advisors, RGB integration" },
]

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          About <span className="gradient-text">ClozOptimizer</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg max-w-2xl mx-auto leading-relaxed">
          Built for power users, gamers, and creators who demand the most from their Windows PC.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-strong rounded-2xl p-10 mb-16 text-center relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.05),transparent_70%)]" />
        <Sparkles size={28} className="text-[#60a5fa] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-[rgba(255,255,255,0.45)] max-w-xl mx-auto leading-relaxed">
          To transform Windows optimization from a fragmented, sketchy landscape of questionable tools into a single, premium, trustworthy platform that actually delivers results.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-2 gap-5 mb-20">
        {values.map(v => (
          <div key={v.title} className="glass rounded-xl p-7 glass-hover transition-all">
            <v.icon size={22} className="text-[#60a5fa] mb-4" />
            <h3 className="text-lg font-bold mb-2">{v.title}</h3>
            <p className="text-[0.8rem] text-[rgba(255,255,255,0.4)] leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-10 text-center">Journey</h2>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div key={t.year} className="flex gap-6 pb-8 relative">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-[0.7rem] font-bold text-[#60a5fa] border border-[rgba(96,165,250,0.2)]">
                  {t.year.slice(-2)}
                </div>
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-[rgba(255,255,255,0.04)] mt-2" />}
              </div>
              <div className="pt-2">
                <div className="text-[0.72rem] text-[#60a5fa] font-semibold mb-1">{t.year}</div>
                <h3 className="text-lg font-bold mb-1">{t.title}</h3>
                <p className="text-[0.8rem] text-[rgba(255,255,255,0.4)]">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
