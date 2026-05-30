import Link from "next/link"
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"

const posts = [
  { slug: 'v2-launch', title: 'ClozOptimizer V2 — The Complete Ecosystem', date: 'May 29, 2026', readTime: '5 min', category: 'Release', color: '#60a5fa', excerpt: 'Introducing V2 with AI Intelligence, Optimization Profiles, Cloud Sync, Marketplace, and 45+ real system tools. Every feature is fully functional.' },
  { slug: 'ai-intelligence', title: 'How AI Intelligence Analyzes Your System', date: 'May 28, 2026', readTime: '4 min', category: 'Feature', color: '#a78bfa', excerpt: 'Deep dive into the health scoring algorithm, bottleneck detection, and how the AI troubleshooter pattern-matches your issues against live system data.' },
  { slug: 'optimization-profiles', title: 'Optimization Profiles — What Actually Changes', date: 'May 27, 2026', readTime: '6 min', category: 'Guide', color: '#4ade80', excerpt: 'Every profile makes real Windows changes — power plans, services, registry, process priorities. Here is exactly what each one does and how to roll back.' },
  { slug: 'marketplace-launch', title: 'Marketplace Launch — Browse, Install, Create', date: 'May 25, 2026', readTime: '3 min', category: 'Announcement', color: '#fbbf24', excerpt: 'The community marketplace is live. Browse presets, install with one click, rate content, and publish your own creations.' },
  { slug: 'cloud-sync', title: 'Cloud Sync — Your Settings Everywhere', date: 'May 23, 2026', readTime: '3 min', category: 'Feature', color: '#22d3ee', excerpt: 'Settings, profiles, marketplace purchases, and presets — all synced across your devices through your Cloz account.' },
  { slug: 'security-privacy', title: 'Security & Privacy — Our Approach', date: 'May 20, 2026', readTime: '4 min', category: 'Security', color: '#f87171', excerpt: 'How ClozOptimizer handles your data, what we collect (nothing), and how the cloud sync infrastructure protects your information.' },
]

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">News, guides, and deep dives from the Cloz team</p>
      </div>

      {/* Featured post */}
      <div className="glass-strong rounded-2xl p-8 mb-8 glass-hover transition-all cursor-pointer group relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.04),transparent_70%)]" />
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[0.65rem] font-bold bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)]">
            {posts[0].category}
          </span>
          <span className="text-[0.65rem] text-[rgba(255,255,255,0.2)] flex items-center gap-1">
            <Calendar size={10} /> {posts[0].date}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{posts[0].title}</h2>
        <p className="text-[0.85rem] text-[rgba(255,255,255,0.4)] leading-relaxed mb-4 max-w-2xl">{posts[0].excerpt}</p>
        <span className="text-[0.78rem] text-[#60a5fa] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Read more <ArrowRight size={14} />
        </span>
      </div>

      {/* Post grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {posts.slice(1).map(post => (
          <article key={post.slug} className="glass rounded-xl p-6 glass-hover transition-all cursor-pointer group">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold"
                style={{ background: `${post.color}12`, color: post.color, border: `1px solid ${post.color}20` }}>
                {post.category}
              </span>
              <span className="text-[0.62rem] text-[rgba(255,255,255,0.2)] flex items-center gap-1">
                <Clock size={9} /> {post.readTime}
              </span>
            </div>
            <h3 className="text-[0.95rem] font-bold mb-2 group-hover:text-white transition-colors leading-snug">{post.title}</h3>
            <p className="text-[0.75rem] text-[rgba(255,255,255,0.35)] leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] text-[rgba(255,255,255,0.2)]">{post.date}</span>
              <span className="text-[0.72rem] text-[#60a5fa] font-medium flex items-center gap-1">
                Read <ArrowRight size={12} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
