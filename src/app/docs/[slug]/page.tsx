import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Crown, ChevronRight, BookOpen, Check } from 'lucide-react'
import { DOC_ARTICLES, DOC_CATEGORIES, getArticle } from '@/lib/docs-content'

export function generateStaticParams() {
  return DOC_ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArticle(slug)
  return { title: a ? `${a.title} — ClozOptimizer Docs` : 'Docs — ClozOptimizer' }
}

export default async function DocArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const category = DOC_CATEGORIES.find(c => c.id === article.category)
  const related = DOC_ARTICLES.filter(a => a.category === article.category && a.slug !== article.slug)

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <Link href="/docs" className="text-[0.75rem] text-[rgba(255,255,255,0.4)] hover:text-white flex items-center gap-1 mb-6">
        <ArrowLeft size={13} /> Back to Docs
      </Link>

      <div className="grid md:grid-cols-[1fr_220px] gap-12">
        {/* Article */}
        <article>
          <div className="text-[0.7rem] text-[#60a5fa] font-semibold uppercase tracking-[1px] mb-2">{category?.label}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
            {article.title}
            {article.pro && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.6rem] font-bold bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border border-[rgba(251,191,36,0.2)]">
                <Crown size={11} /> PRO
              </span>
            )}
          </h1>
          <p className="text-[0.95rem] text-[rgba(255,255,255,0.45)] leading-relaxed mb-10">{article.summary}</p>

          <div className="space-y-10">
            {article.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold mb-3">{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="text-[0.88rem] text-[rgba(255,255,255,0.55)] leading-relaxed mb-3">{p}</p>
                ))}
                {s.steps && (
                  <ol className="space-y-2.5 mt-4">
                    {s.steps.map((step, k) => (
                      <li key={k} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full glass-strong flex items-center justify-center text-[0.7rem] font-bold text-[#60a5fa] shrink-0 mt-0.5">{k + 1}</span>
                        <span className="text-[0.85rem] text-[rgba(255,255,255,0.55)] leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>

          {article.pro && (
            <div className="glass-strong rounded-2xl p-6 mt-12 flex items-center gap-4">
              <Crown size={22} className="text-[#fbbf24] shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-[0.9rem]">This is a Pro feature</div>
                <div className="text-[0.75rem] text-[rgba(255,255,255,0.4)]">Unlock it with ClozOptimizer Pro.</div>
              </div>
              <Link href="/pricing" className="btn-primary px-5 py-2.5 rounded-lg text-[0.8rem] font-bold shrink-0">View Plans</Link>
            </div>
          )}
        </article>

        {/* Sidebar: related */}
        <aside className="hidden md:block">
          <div className="sticky top-24">
            <div className="text-[0.68rem] font-semibold text-[rgba(255,255,255,0.25)] uppercase tracking-[1.5px] mb-3">In this section</div>
            <ul className="space-y-1">
              {[article, ...related].map(a => (
                <li key={a.slug}>
                  <Link href={`/docs/${a.slug}`}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg text-[0.76rem] transition-all ${a.slug === article.slug ? 'glass-strong text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
                    <BookOpen size={12} className="shrink-0" />
                    <span className="flex-1">{a.title}</span>
                    {a.pro && <Crown size={9} className="text-[#fbbf24] shrink-0" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
