import MediaCenter from '@/components/MediaCenter'
import { Download, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Media Kit — ClozOptimizer',
  description: 'Official ClozOptimizer branding assets — logos, banners, wallpapers, screenshots, and promotional graphics.',
}

export default function MediaPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <Sparkles size={12} className="text-[#60a5fa]" />
          <span className="text-[0.72rem] text-[rgba(255,255,255,0.4)]">Official Media Kit</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Media Center</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg max-w-2xl mx-auto leading-relaxed">
          Official ClozOptimizer branding for creators, reviewers, partners, and the community.
          Preview and download logos, banners, wallpapers, screenshots, and promo graphics.
        </p>
      </div>

      {/* Usage note */}
      <div className="glass-strong rounded-2xl p-5 mb-10 flex items-start gap-3 max-w-3xl mx-auto">
        <Download size={16} className="text-[#60a5fa] mt-0.5 shrink-0" />
        <p className="text-[0.76rem] text-[rgba(255,255,255,0.45)] leading-relaxed">
          All assets are provided as scalable SVG (vector) — perfect for any resolution. Please keep the logo
          proportions intact and don&apos;t recolor the mark. For partnership or press inquiries, reach out via the Contact page.
        </p>
      </div>

      <MediaCenter />
    </div>
  )
}
