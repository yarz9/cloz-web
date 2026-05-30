'use client'
import { useState } from 'react'
import { Mail, MessageCircle, Send, CheckCircle2, Loader2, Globe } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate send
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Contact Us</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">We&apos;d love to hear from you</p>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="glass-strong rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle2 size={40} className="text-[#4ade80] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p className="text-[0.82rem] text-[rgba(255,255,255,0.4)]">We&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.12)]"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.12)]"
                    placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Subject</label>
                <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all placeholder:text-[rgba(255,255,255,0.12)]"
                  placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-[0.72rem] text-[rgba(255,255,255,0.3)] font-medium mb-2">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full glass rounded-lg py-3 px-4 text-[0.85rem] outline-none focus:border-[rgba(96,165,250,0.3)] transition-all resize-none placeholder:text-[rgba(255,255,255,0.12)]"
                  placeholder="Tell us more..." />
              </div>
              <button type="submit" disabled={sending}
                className="btn-primary w-full py-3.5 rounded-lg text-[0.88rem] font-bold flex items-center justify-center gap-2">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact info sidebar */}
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', value: 'support@cloz.dev', color: '#60a5fa' },
            { icon: MessageCircle, title: 'Discord', value: 'discord.gg/cloz', color: '#7289da' },
            { icon: Globe, title: 'Website', value: 'cloz.dev', color: '#4ade80' },
          ].map(c => (
            <div key={c.title} className="glass rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${c.color}12`, border: `1px solid ${c.color}20` }}>
                <c.icon size={16} style={{ color: c.color }} />
              </div>
              <div>
                <div className="text-[0.72rem] text-[rgba(255,255,255,0.3)]">{c.title}</div>
                <div className="text-[0.82rem] font-medium">{c.value}</div>
              </div>
            </div>
          ))}

          <div className="glass rounded-xl p-5">
            <h4 className="text-[0.82rem] font-bold mb-2">Response Time</h4>
            <p className="text-[0.72rem] text-[rgba(255,255,255,0.35)] leading-relaxed">
              We typically respond within 24 hours. Pro users get priority support with faster response times.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
