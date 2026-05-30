'use client'
import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, X } from "lucide-react"

const proFeatures = [
  { text: "Everything in Free", included: true },
  { text: "AI Intelligence Suite", included: true },
  { text: "Optimization Profiles (5 modes)", included: true },
  { text: "Privacy & Security Tools", included: true },
  { text: "Registry Cleaner", included: true },
  { text: "Driver Scanner", included: true },
  { text: "File Shredder", included: true },
  { text: "Wi-Fi Analyzer & Benchmark", included: true },
  { text: "Cloud Sync (5 devices)", included: true },
  { text: "Marketplace Full Access", included: true },
  { text: "Create & Publish Presets", included: true },
  { text: "Priority Support", included: true },
]

// Sell.app product links (set these in Railway; fall back to /register if unset)
const BUY = {
  '1month': process.env.NEXT_PUBLIC_SELLAPP_1MONTH || '/register',
  '3month': process.env.NEXT_PUBLIC_SELLAPP_3MONTH || '/register',
  '12month': process.env.NEXT_PUBLIC_SELLAPP_12MONTH || '/register',
  lifetime: process.env.NEXT_PUBLIC_SELLAPP_LIFETIME || '/register',
}

// Pro billing periods (50% launch promo)
const periods = [
  { id: "1month", label: "1 Month", price: "$4.99", original: "$9.99", per: "/month", note: "billed monthly", badge: null as string | null },
  { id: "3month", label: "3 Months", price: "$12.49", original: "$24.99", per: "/3 months", note: "≈ $4.16 / month", badge: "Save 17%" },
  { id: "12month", label: "12 Months", price: "$29.99", original: "$59.99", per: "/year", note: "≈ $2.50 / month", badge: "Best Value" },
]

const freeFeatures = [
  { text: "Dashboard & Live Monitoring", included: true },
  { text: "Cleanup & Temp File Removal", included: true },
  { text: "Startup Manager", included: true },
  { text: "RAM Optimizer", included: true },
  { text: "Process Manager", included: true },
  { text: "Network & DNS Tools", included: true },
  { text: "Disk Analyzer", included: true },
  { text: "AI Intelligence", included: false },
  { text: "Optimization Profiles", included: false },
  { text: "Privacy & Security Suite", included: false },
  { text: "Cloud Sync", included: false },
  { text: "Marketplace Access", included: false },
]

const lifetimeFeatures = [
  { text: "Everything in Pro", included: true },
  { text: "Lifetime Updates", included: true },
  { text: "All Future Features", included: true },
  { text: "Unlimited Devices", included: true },
  { text: "Exclusive Lifetime Presets", included: true },
  { text: "Creator Dashboard", included: true },
  { text: "Early Access to Betas", included: true },
  { text: "Lifetime Badge on Profile", included: true },
  { text: "Priority Queue Support", included: true },
]

function FeatureList({ features }: { features: { text: string; included: boolean }[] }) {
  return (
    <ul className="space-y-3 mb-8 flex-1">
      {features.map(f => (
        <li key={f.text} className="flex items-start gap-2.5 text-[0.78rem]">
          {f.included
            ? <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
            : <X size={14} className="text-[rgba(255,255,255,0.1)] shrink-0 mt-0.5" />}
          <span className={f.included ? 'text-[rgba(255,255,255,0.55)]' : 'text-[rgba(255,255,255,0.15)]'}>{f.text}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PricingPage() {
  const [periodId, setPeriodId] = useState("12month")
  const period = periods.find(p => p.id === periodId)!

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Simple <span className="gradient-text-gold">Pricing</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">Start free. Upgrade when ready. No tricks.</p>
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)]">
          <span className="text-[0.72rem] font-bold text-[#fbbf24]">🎉 Launch promo — 50% off all plans</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 items-stretch">
        {/* Free */}
        <div className="glass rounded-2xl p-8 flex flex-col">
          <div className="text-[0.75rem] text-[rgba(255,255,255,0.3)] font-medium mb-3">Free</div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-4xl font-extrabold">$0</span>
            <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)]">forever</span>
          </div>
          <p className="text-[0.78rem] text-[rgba(255,255,255,0.35)] mb-6">Core tools for everyone</p>
          <FeatureList features={freeFeatures} />
          <Link href="/downloads" className="btn-white w-full py-3 rounded-xl text-[0.85rem] font-bold text-center block">Download Free</Link>
        </div>

        {/* Pro — with billing period toggle */}
        <div className="glass rounded-2xl p-8 relative overflow-hidden flex flex-col border-[rgba(96,165,250,0.3)] glow-blue">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)] font-medium">Pro</span>
            <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-[rgba(251,191,36,0.15)] text-[#fbbf24]">50% OFF</span>
            {period.badge && (
              <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-[rgba(96,165,250,0.15)] text-[#60a5fa]">{period.badge}</span>
            )}
          </div>

          {/* Period segmented control */}
          <div className="flex gap-1 glass-strong rounded-lg p-1 mb-4">
            {periods.map(p => (
              <button key={p.id} onClick={() => setPeriodId(p.id)}
                className={`flex-1 py-1.5 rounded-md text-[0.66rem] font-semibold transition-all ${periodId === p.id ? 'bg-[rgba(96,165,250,0.18)] text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'}`}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-4xl font-extrabold">{period.price}</span>
            <span className="text-[0.9rem] text-[rgba(255,255,255,0.3)] line-through">{period.original}</span>
            <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)]">{period.per}</span>
          </div>
          <p className="text-[0.78rem] text-[rgba(255,255,255,0.35)] mb-6">{period.note}</p>

          <FeatureList features={proFeatures} />
          <a href={(BUY as any)[periodId] || '/register'} className="btn-primary w-full py-3 rounded-xl text-[0.85rem] font-bold text-center block">Get Pro</a>
        </div>

        {/* Lifetime */}
        <div className="glass rounded-2xl p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)] font-medium">Lifetime</span>
            <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-[rgba(251,191,36,0.15)] text-[#fbbf24]">50% OFF</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-4xl font-extrabold">$74.99</span>
            <span className="text-[0.9rem] text-[rgba(255,255,255,0.3)] line-through">$149.99</span>
            <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)]">one time</span>
          </div>
          <p className="text-[0.78rem] text-[rgba(255,255,255,0.35)] mb-6">Pay once, own forever</p>
          <FeatureList features={lifetimeFeatures} />
          <a href={BUY.lifetime} className="btn-white w-full py-3 rounded-xl text-[0.85rem] font-bold text-center block">Go Lifetime</a>
        </div>
      </div>

      <div className="text-center mt-12 text-[0.75rem] text-[rgba(255,255,255,0.25)]">
        All plans include free updates. Pro features require an active subscription or lifetime license.
      </div>
    </div>
  )
}
