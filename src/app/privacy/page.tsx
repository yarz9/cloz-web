import { Shield } from 'lucide-react'

export const metadata = { title: 'Privacy Policy — ClozOptimizer' }

const sections = [
  { h: 'Overview', p: 'ClozOptimizer is built privacy-first. The desktop application performs optimizations locally on your machine. We only collect the minimum data required to operate your account, cloud sync, and the marketplace.' },
  { h: 'What we collect', p: 'Account data you provide (email, username), license activation records, and content you choose to sync or publish (presets, settings). The desktop app does not collect telemetry or usage tracking. Hardware identifiers (HWID) are used only to bind licenses to devices.' },
  { h: 'How we use it', p: 'To authenticate you, sync your settings and presets across devices, deliver marketplace content, validate licenses, and provide support. We never sell your data.' },
  { h: 'Cloud sync', p: 'Cloud sync is opt-in. Data you sync (profiles, themes, settings) is stored against your account and transmitted over secure connections. You can delete it at any time from your account.' },
  { h: 'Cookies & sessions', p: 'The website uses a single secure, HTTP-only session cookie to keep you signed in. No third-party advertising or tracking cookies are used.' },
  { h: 'Your rights', p: 'You can export or delete your account and all associated data at any time from Account → Settings. Deleting your account permanently removes your profile, synced data, and published content.' },
  { h: 'Contact', p: 'Privacy questions can be sent through the Contact page.' },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center"><Shield size={18} className="text-[#4ade80]" /></div>
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      </div>
      <p className="text-[0.72rem] text-[rgba(255,255,255,0.3)] mb-10">Last updated: May 2026</p>
      <div className="space-y-8">
        {sections.map(s => (
          <section key={s.h}>
            <h2 className="text-lg font-bold mb-2">{s.h}</h2>
            <p className="text-[0.85rem] text-[rgba(255,255,255,0.5)] leading-relaxed">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
