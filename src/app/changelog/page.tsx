import { CheckCircle2, Sparkles, Zap, Bug, ArrowUp } from "lucide-react"

const releases = [
  {
    version: '2.0.0', date: 'May 29, 2026', type: 'major' as const,
    features: [
      'AI Intelligence Center — health scoring, bottleneck analysis, recommendations, troubleshooter',
      'Optimization Profiles — Gaming, Streaming, Editing, Work, Battery with real system changes',
      'Cloud Sync platform — settings, profiles, presets synced across devices',
      'Community Marketplace — browse, install, rate, publish presets',
      'Analytics Center — real data collection, boot time tracking, daily stats',
      'Hardware Center — detailed specs, live monitoring, upgrade recommendations',
      'Toolbox — DNS switcher, hash generator, network tools',
      'Knowledge Base — searchable guides and tutorials',
      'Pro Center — pricing, feature comparison, exclusive presets',
      'Premium loading screen with real startup verification (10 system checks)',
      'Background stat collector (CPU/RAM/temp every 5 minutes)',
      'Portable .exe build — no installer required',
      'Glassmorphism UI overhaul — glass cards, accent system, new sidebar',
      'Collapsible sidebar with 8 category groups',
    ],
    fixes: [
      'Removed all mock data — every page uses real system information',
      'Fixed Dashboard process list and chart fallbacks',
      'Fixed Sell.app key validation for RC-format serial keys',
    ],
  },
  {
    version: '1.5.0', date: 'April 2026', type: 'minor' as const,
    features: [
      'Discord bot integration — license approval, moderation, giveaways',
      'Developer settings section — encrypted config storage for API keys',
      'Sell.app license validation',
      'Discord OAuth for user identity linking',
      'HWID-based license activation with approval workflow',
    ],
    fixes: ['Fixed stale closure in ProContext', 'Fixed shimmer animation', 'Switched to sql.js for bot database'],
  },
  {
    version: '1.0.0', date: 'January 2025', type: 'major' as const,
    features: [
      'Initial release',
      'Dashboard with live CPU/RAM/GPU/disk monitoring',
      'Cleanup suite — temp files, browser cache, Windows junk',
      'Startup manager — enable/disable startup apps',
      'Game mode — kill background processes, boost priority',
      'Network tools — DNS switching, speed test, latency monitoring',
      'RAM optimizer, disk analyzer, battery info',
      'System tweaks, privacy toggles, service manager',
      'Security scanner, defrag manager, benchmark suite',
      'Driver scanner, boot analyzer, duplicate finder',
      'File shredder, restore points, registry cleaner',
      'Power plans, context menu editor, scheduled tasks',
      'Hosts editor, environment variables, Wi-Fi analyzer',
      'USB devices, Bluetooth, event viewer',
      'System report generator, Windows update checker',
    ],
    fixes: [],
  },
]

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Changelog</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">Every update, feature, and fix — documented</p>
      </div>

      <div className="space-y-8">
        {releases.map(release => (
          <div key={release.version} className="glass rounded-2xl p-8 relative overflow-hidden">
            {release.type === 'major' && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent" />
            )}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-[0.72rem] font-bold ${release.type === 'major' ? 'bg-[rgba(96,165,250,0.12)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)]' : 'glass text-[rgba(255,255,255,0.4)]'}`}>
                v{release.version}
              </span>
              <span className="text-[0.72rem] text-[rgba(255,255,255,0.3)]">{release.date}</span>
              {release.type === 'major' && (
                <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-bold bg-[rgba(74,222,128,0.1)] text-[#4ade80]">
                  Major Release
                </span>
              )}
            </div>

            {release.features.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-[#4ade80]" />
                  <h3 className="text-[0.82rem] font-bold text-[#4ade80]">New Features</h3>
                </div>
                <ul className="space-y-2">
                  {release.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.78rem] text-[rgba(255,255,255,0.5)]">
                      <CheckCircle2 size={13} className="text-[#4ade80] shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {release.fixes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bug size={14} className="text-[#fbbf24]" />
                  <h3 className="text-[0.82rem] font-bold text-[#fbbf24]">Fixes</h3>
                </div>
                <ul className="space-y-2">
                  {release.fixes.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.78rem] text-[rgba(255,255,255,0.5)]">
                      <Bug size={13} className="text-[#fbbf24] shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
