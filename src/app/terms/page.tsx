import { FileText } from 'lucide-react'

export const metadata = { title: 'Terms of Service — ClozOptimizer' }

const sections = [
  { h: 'Acceptance', p: 'By downloading, installing, or using ClozOptimizer and this website, you agree to these terms. If you do not agree, do not use the software.' },
  { h: 'License', p: 'ClozOptimizer grants you a personal, non-transferable license to use the software. The free tier is available at no cost; Pro features require an active subscription or lifetime license. License keys are bound to your account and devices.' },
  { h: 'Acceptable use', p: 'You agree not to redistribute, resell, or reverse-engineer the software, or use it to harm systems you do not own or control. Optimization changes are applied at your direction and are reversible.' },
  { h: 'Marketplace content', p: 'Content you publish must be your own or properly licensed, must not contain malware, and is subject to moderation. We may remove content that violates these terms. You retain ownership of presets you create.' },
  { h: 'Disclaimer', p: 'ClozOptimizer modifies system settings. While every change is designed to be safe and reversible, the software is provided "as is" without warranty. Always create a restore point before major changes.' },
  { h: 'Limitation of liability', p: 'To the maximum extent permitted by law, Cloz is not liable for indirect or consequential damages arising from use of the software.' },
  { h: 'Changes', p: 'We may update these terms; continued use after changes constitutes acceptance. Material changes will be announced in the changelog.' },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center"><FileText size={18} className="text-[#60a5fa]" /></div>
        <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
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
