import { Download, Monitor, Shield, CheckCircle2, HardDrive, Cpu, MemoryStick, Zap } from "lucide-react"

const requirements = [
  { icon: Monitor, label: "OS", value: "Windows 10/11 (64-bit)" },
  { icon: Cpu, label: "CPU", value: "Dual-core 1.8 GHz+" },
  { icon: MemoryStick, label: "RAM", value: "4 GB minimum" },
  { icon: HardDrive, label: "Disk", value: "500 MB free space" },
]

const changelog = [
  { version: "2.0.0", date: "May 2026", items: ["AI Intelligence Center", "Optimization Profiles with real system changes", "Cloud Sync platform", "Community Marketplace", "45+ functional system tools", "Premium loading screen with startup checks", "Analytics with real data collection"] },
  { version: "1.0.0", date: "Jan 2025", items: ["Initial release", "Dashboard with live monitoring", "Cleanup & startup manager", "Game mode", "Network tools"] },
]

export default function DownloadsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Download <span className="gradient-text">ClozOptimizer</span>
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-lg">Free to download. Pro features available.</p>
      </div>

      {/* Download cards */}
      <div className="grid md:grid-cols-2 gap-5 mb-16">
        <div className="glass-strong rounded-2xl p-8 glow-blue relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <Zap size={20} className="text-[#60a5fa]" />
            <div>
              <h3 className="text-lg font-bold">ClozOptimizer V2</h3>
              <span className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">Portable Edition — No installer needed</span>
            </div>
          </div>
          <p className="text-[0.78rem] text-[rgba(255,255,255,0.4)] mb-6 leading-relaxed">
            Full application with all features. Extract and run — no installation required. Includes all 45+ tools, AI intelligence, optimization profiles, and marketplace access.
          </p>
          <div className="flex items-center gap-3 mb-6 text-[0.7rem] text-[rgba(255,255,255,0.3)]">
            <span>v2.0.0</span>
            <span>·</span>
            <span>~320 MB</span>
            <span>·</span>
            <span>Windows 10/11</span>
          </div>
          <button className="btn-primary w-full py-3.5 rounded-xl text-[0.88rem] font-bold flex items-center justify-center gap-2.5">
            <Download size={18} /> Download Portable (.zip)
          </button>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-[#4ade80]" />
            <div>
              <h3 className="text-lg font-bold">Installer Edition</h3>
              <span className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">Setup wizard with auto-updates</span>
            </div>
          </div>
          <p className="text-[0.78rem] text-[rgba(255,255,255,0.4)] mb-6 leading-relaxed">
            Standard Windows installer with Start Menu shortcut, desktop icon, and automatic update support. Recommended for most users.
          </p>
          <div className="flex items-center gap-3 mb-6 text-[0.7rem] text-[rgba(255,255,255,0.3)]">
            <span>v2.0.0</span>
            <span>·</span>
            <span>~120 MB</span>
            <span>·</span>
            <span>Windows 10/11</span>
          </div>
          <button className="btn-white w-full py-3.5 rounded-xl text-[0.88rem] font-medium flex items-center justify-center gap-2.5">
            <Download size={18} /> Download Installer (.exe)
          </button>
        </div>
      </div>

      {/* System requirements */}
      <div className="glass rounded-2xl p-8 mb-16">
        <h3 className="text-lg font-bold mb-6">System Requirements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {requirements.map(r => (
            <div key={r.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg glass flex items-center justify-center shrink-0">
                <r.icon size={16} className="text-[rgba(255,255,255,0.4)]" />
              </div>
              <div>
                <div className="text-[0.68rem] text-[rgba(255,255,255,0.3)]">{r.label}</div>
                <div className="text-[0.78rem] font-medium">{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Changelog */}
      <div>
        <h3 className="text-xl font-bold mb-8">Changelog</h3>
        <div className="space-y-6">
          {changelog.map(release => (
            <div key={release.version} className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-[0.72rem] font-bold bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border border-[rgba(96,165,250,0.2)]">
                  v{release.version}
                </span>
                <span className="text-[0.72rem] text-[rgba(255,255,255,0.3)]">{release.date}</span>
              </div>
              <ul className="space-y-2">
                {release.items.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[0.78rem] text-[rgba(255,255,255,0.5)]">
                    <CheckCircle2 size={13} className="text-[#4ade80] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
