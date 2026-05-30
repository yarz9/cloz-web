import Link from "next/link"
import { HelpCircle, MessageCircle, BookOpen, Mail, Bug, ChevronRight, Zap, Search } from "lucide-react"

const channels = [
  { icon: BookOpen, title: "Documentation", desc: "Browse guides, tutorials, and API reference", href: "/docs", color: "#60a5fa" },
  { icon: MessageCircle, title: "Discord Community", desc: "Get help from the community and dev team", href: "#", color: "#a78bfa" },
  { icon: Mail, title: "Email Support", desc: "Contact us directly for account and billing issues", href: "/contact", color: "#4ade80" },
  { icon: Bug, title: "Bug Reports", desc: "Report issues and track known bugs", href: "#", color: "#f87171" },
]

const faqs = [
  { q: "Is ClozOptimizer free?", a: "Yes! The core version is completely free with 15+ tools. Pro unlocks AI Intelligence, Optimization Profiles, Cloud Sync, Marketplace, and 30+ additional tools." },
  { q: "Is it safe to use?", a: "Absolutely. ClozOptimizer only makes changes you explicitly approve. Every optimization is logged and can be rolled back. We don't collect telemetry." },
  { q: "Will it break my PC?", a: "No. All changes are safe and reversible. System Restore points can be created before major modifications. The app checks for compatibility before applying changes." },
  { q: "Does it work on Windows 11?", a: "Yes. ClozOptimizer V2 is tested on both Windows 10 and 11. All features work on both operating systems." },
  { q: "Can I use it on multiple PCs?", a: "Free version: unlimited PCs. Pro Monthly: up to 5 devices. Lifetime: unlimited devices. Cloud Sync keeps everything in sync." },
  { q: "How do I activate Pro?", a: "Go to Settings > Developer in the app, or visit the Pro Center. Enter your license key to activate. You can also purchase directly from our website." },
]

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Support Center</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">How can we help you?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-20">
        {channels.map(c => (
          <Link key={c.title} href={c.href} className="glass rounded-xl p-6 glass-hover transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}12`, border: `1px solid ${c.color}20` }}>
              <c.icon size={20} style={{ color: c.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-[0.9rem] font-bold group-hover:text-white transition-colors">{c.title}</h3>
              <p className="text-[0.72rem] text-[rgba(255,255,255,0.35)]">{c.desc}</p>
            </div>
            <ChevronRight size={16} className="text-[rgba(255,255,255,0.15)] group-hover:text-[rgba(255,255,255,0.4)] transition-colors" />
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="glass rounded-xl group">
              <summary className="p-5 cursor-pointer text-[0.88rem] font-semibold flex items-center justify-between list-none">
                {faq.q}
                <ChevronRight size={16} className="text-[rgba(255,255,255,0.2)] group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-[0.8rem] text-[rgba(255,255,255,0.45)] leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
