import Link from "next/link"
import { Users, MessageCircle, Trophy, Star, Store, BookOpen, ArrowRight, Sparkles, Crown, Shield, Heart } from "lucide-react"

const channels = [
  { icon: MessageCircle, title: "Discord Server", desc: "Join 2,000+ members — get help, share presets, discuss optimization", color: "#7289da", href: "#", members: "2,400+" },
  { icon: Store, title: "Marketplace", desc: "Browse and install community presets, game configs, and themes", color: "#4ade80", href: "/marketplace", members: "120+ presets" },
  { icon: BookOpen, title: "Knowledge Base", desc: "Guides written by the community and dev team", color: "#60a5fa", href: "/docs", members: "50+ articles" },
  { icon: Trophy, title: "Leaderboards", desc: "Top creators ranked by downloads, ratings, and contributions", color: "#fbbf24", href: "#", members: "Coming Soon" },
]

const topCreators = [
  { name: "ClozTeam", presets: 12, downloads: "28.4k", rating: 4.9, badge: "Official" },
  { name: "FPSGod", presets: 8, downloads: "15.2k", rating: 4.7, badge: "Verified" },
  { name: "WinTweaker", presets: 6, downloads: "11.8k", rating: 4.8, badge: "Verified" },
  { name: "DesignPro", presets: 5, downloads: "8.1k", rating: 4.6, badge: "Creator" },
  { name: "CDLPro", presets: 4, downloads: "9.2k", rating: 4.8, badge: "Verified" },
]

export default function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Community</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg max-w-xl mx-auto">
          Connect with optimizers, creators, and gamers building the future of PC performance
        </p>
      </div>

      {/* Channel cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-20">
        {channels.map(c => (
          <Link key={c.title} href={c.href} className="glass rounded-xl p-6 glass-hover transition-all group flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${c.color}12`, border: `1px solid ${c.color}20` }}>
              <c.icon size={20} style={{ color: c.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">{c.title}</h3>
              <p className="text-[0.78rem] text-[rgba(255,255,255,0.35)] mb-2">{c.desc}</p>
              <span className="text-[0.68rem] text-[rgba(255,255,255,0.25)]">{c.members}</span>
            </div>
            <ArrowRight size={16} className="text-[rgba(255,255,255,0.1)] mt-1 group-hover:text-[rgba(255,255,255,0.3)] transition-colors" />
          </Link>
        ))}
      </div>

      {/* Top Creators */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Crown size={18} className="text-[#fbbf24]" />
          <h2 className="text-2xl font-bold">Top Creators</h2>
        </div>
        <div className="space-y-3">
          {topCreators.map((c, i) => (
            <div key={c.name} className="glass rounded-xl p-5 flex items-center gap-5 glass-hover transition-all">
              <span className="text-lg font-extrabold text-[rgba(255,255,255,0.15)] w-8 text-center">#{i + 1}</span>
              <div className="w-11 h-11 rounded-full glass-strong flex items-center justify-center text-[0.8rem] font-bold">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[0.9rem] font-bold">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[0.55rem] font-bold ${c.badge === 'Official' ? 'bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)]' : c.badge === 'Verified' ? 'bg-[rgba(74,222,128,0.1)] text-[#4ade80] border border-[rgba(74,222,128,0.2)]' : 'glass text-[rgba(255,255,255,0.3)]'}`}>
                    {c.badge}
                  </span>
                </div>
                <div className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">
                  {c.presets} presets · {c.downloads} downloads
                </div>
              </div>
              <div className="flex items-center gap-1 text-[0.75rem] text-[#fbbf24]">
                <Star size={13} fill="#fbbf24" /> {c.rating}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Become a creator CTA */}
      <div className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.06),transparent_70%)]" />
        <Sparkles size={28} className="text-[#a78bfa] mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Become a Creator</h3>
        <p className="text-[rgba(255,255,255,0.4)] max-w-lg mx-auto mb-6">
          Build presets, game configs, themes, and optimization profiles. Publish them to the marketplace and build your reputation in the Cloz community.
        </p>
        <Link href="/register" className="btn-primary px-8 py-3 rounded-xl text-[0.88rem] font-bold inline-flex items-center gap-2">
          Create Account <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
