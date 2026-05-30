import Link from "next/link"
import { CheckCircle2, X, Crown, Sparkles, ArrowRight } from "lucide-react"

const plans = [
  { name: "Free", price: "$0", period: "forever", desc: "Core tools for everyone", color: "rgba(255,255,255,0.5)", features: [
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
    { text: "Priority Support", included: false },
  ], cta: "Download Free", href: "/downloads" },
  { name: "Pro Monthly", price: "$4.99", original: "$9.99", period: "/month", desc: "Full power, billed monthly", color: "#60a5fa", popular: true, features: [
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
    { text: "Early Access to Betas", included: false },
  ], cta: "Get Pro", href: "/register" },
  { name: "Lifetime", price: "$74.99", original: "$149.99", period: "one time", desc: "Pay once, own forever", color: "#fbbf24", features: [
    { text: "Everything in Pro", included: true },
    { text: "Lifetime Updates", included: true },
    { text: "All Future Features", included: true },
    { text: "Unlimited Devices", included: true },
    { text: "Exclusive Lifetime Presets", included: true },
    { text: "Creator Dashboard", included: true },
    { text: "Early Access to Betas", included: true },
    { text: "Lifetime Badge on Profile", included: true },
    { text: "Priority Queue Support", included: true },
  ], cta: "Go Lifetime", href: "/register" },
]

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Simple <span className="gradient-text-gold">Pricing</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">Start free. Upgrade when ready. No tricks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map(plan => (
          <div key={plan.name} className={`glass rounded-2xl p-8 relative overflow-hidden transition-all hover:scale-[1.01] flex flex-col ${plan.popular ? 'border-[rgba(96,165,250,0.3)] glow-blue' : ''}`}>
            {plan.popular && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent" />}

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)] font-medium">{plan.name}</span>
              {(plan as any).original && <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-[rgba(251,191,36,0.15)] text-[#fbbf24]">50% OFF</span>}
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              {(plan as any).original && <span className="text-[0.9rem] text-[rgba(255,255,255,0.3)] line-through">{(plan as any).original}</span>}
              <span className="text-[0.75rem] text-[rgba(255,255,255,0.3)]">{plan.period}</span>
            </div>
            <p className="text-[0.78rem] text-[rgba(255,255,255,0.35)] mb-6">{plan.desc}</p>

            {plan.popular && (
              <span className="inline-block w-fit px-3 py-1 rounded-full text-[0.62rem] font-bold bg-[rgba(96,165,250,0.12)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)] mb-4">
                Most Popular
              </span>
            )}

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f.text} className="flex items-start gap-2.5 text-[0.78rem]">
                  {f.included
                    ? <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
                    : <X size={14} className="text-[rgba(255,255,255,0.1)] shrink-0 mt-0.5" />}
                  <span className={f.included ? 'text-[rgba(255,255,255,0.55)]' : 'text-[rgba(255,255,255,0.15)]'}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link href={plan.href || '/downloads'}
              className={`${plan.popular ? 'btn-primary' : 'btn-white'} w-full py-3 rounded-xl text-[0.85rem] font-bold text-center block`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 text-[0.75rem] text-[rgba(255,255,255,0.25)]">
        All plans include free updates. Pro features require an active subscription or lifetime license.
      </div>
    </div>
  )
}
