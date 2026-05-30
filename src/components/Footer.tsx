import Link from 'next/link'
import { Zap, ExternalLink, MessageCircle } from 'lucide-react'

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse', href: '/marketplace' },
      { label: 'Creators', href: '/creators' },
      { label: 'Game Profiles', href: '/marketplace?category=game' },
      { label: 'UI Presets', href: '/marketplace?category=ui' },
      { label: 'Create', href: '/marketplace/create' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Media Kit', href: '/media' },
      { label: 'Support', href: '/support' },
      { label: 'Community', href: '/community' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.04)] mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[rgba(96,165,250,0.15)] to-[rgba(96,165,250,0.05)] border border-[rgba(96,165,250,0.2)] flex items-center justify-center">
                <Zap size={13} className="text-[#60a5fa]" />
              </div>
              <span className="text-[0.85rem] font-bold">ClozOptimizer</span>
            </div>
            <p className="text-[0.72rem] text-[rgba(255,255,255,0.3)] leading-relaxed mb-4">
              The ultimate Windows performance, optimization, and gaming platform.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">
                <MessageCircle size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="text-[0.68rem] font-semibold text-[rgba(255,255,255,0.2)] uppercase tracking-[2px] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[0.78rem] text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.7)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[0.68rem] text-[rgba(255,255,255,0.2)]">
            &copy; 2024-2026 Cloz. All rights reserved.
          </p>
          <p className="text-[0.62rem] text-[rgba(255,255,255,0.12)]">
            v2.0.0
          </p>
        </div>
      </div>
    </footer>
  )
}
