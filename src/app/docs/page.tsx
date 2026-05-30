'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Search, Crown, Code } from 'lucide-react'
import { DOC_CATEGORIES, DOC_ARTICLES } from '@/lib/docs-content'

export default function DocsPage() {
  const [q, setQ] = useState('')
  const filtered = DOC_ARTICLES.filter(a =>
    !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.summary.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"><span className="gradient-text">Documentation</span></h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">Guides, tutorials, and reference for ClozOptimizer</p>
      </div>

      <div className="relative max-w-xl mx-auto mb-12">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.2)]" />
        <input value={q} onChange={e => setQ(e.target.value)}
          className="w-full glass-strong rounded-xl py-3.5 pl-11 pr-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.15)]"
          placeholder="Search documentation..." />
      </div>

      {q ? (
        <div className="max-w-3xl mx-auto space-y-2">
          {filtered.map(a => (
            <Link key={a.slug} href={`/docs/${a.slug}`} className="glass rounded-xl p-4 flex items-center gap-3 glass-hover transition-all block">
              <BookOpen size={15} className="text-[#60a5fa]" />
              <div className="flex-1">
                <div className="text-[0.84rem] font-semibold flex items-center gap-2">{a.title} {a.pro && <Crown size={11} className="text-[#fbbf24]" />}</div>
                <div className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">{a.summary}</div>
              </div>
              <ChevronRight size={14} className="text-[rgba(255,255,255,0.15)]" />
            </Link>
          ))}
          {filtered.length === 0 && <p className="text-center text-[rgba(255,255,255,0.3)] py-12">No articles found</p>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {DOC_CATEGORIES.map(cat => {
            const arts = DOC_ARTICLES.filter(a => a.category === cat.id)
            return (
              <div key={cat.id} className="glass rounded-xl p-6">
                <h3 className="text-[0.95rem] font-bold mb-4">{cat.label}</h3>
                <ul className="space-y-1.5">
                  {arts.map(a => (
                    <li key={a.slug}>
                      <Link href={`/docs/${a.slug}`} className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[0.8rem] text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all">
                        <span className="flex items-center gap-2">{a.title}{a.pro && <Crown size={10} className="text-[#fbbf24]" />}</span>
                        <ChevronRight size={13} className="text-[rgba(255,255,255,0.15)]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
          <div className="glass rounded-xl p-6">
            <h3 className="text-[0.95rem] font-bold mb-4">Developers</h3>
            <Link href="/docs/api" className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[0.8rem] text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all">
              <span className="flex items-center gap-2"><Code size={13} /> API Reference</span>
              <ChevronRight size={13} className="text-[rgba(255,255,255,0.15)]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
