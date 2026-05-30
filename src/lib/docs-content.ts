export interface DocSection { heading: string; body: string[]; steps?: string[] }
export interface DocArticle {
  slug: string; title: string; category: string; pro?: boolean
  summary: string; sections: DocSection[]
}

export const DOC_CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'dashboard', label: 'Dashboard & Monitoring' },
  { id: 'optimization', label: 'Optimization & Profiles' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'security', label: 'Security & Privacy' },
  { id: 'marketplace', label: 'Marketplace & Creators' },
  { id: 'cloud', label: 'Account & Cloud' },
]

export const DOC_ARTICLES: DocArticle[] = [
  {
    slug: 'install', title: 'Download & Install', category: 'getting-started',
    summary: 'Get ClozOptimizer running on your PC in under a minute.',
    sections: [
      { heading: 'Requirements', body: ['Windows 10 or 11 (64-bit), a dual-core CPU, 4 GB RAM, and 500 MB of free disk space.'] },
      { heading: 'Install', body: ['ClozOptimizer ships as a portable build — no installer required.'], steps: [
        'Download the ZIP from the Downloads page.',
        'Extract it anywhere (e.g. your Desktop).',
        'Run ClozOptimizer.exe. Approve the UAC prompt — admin rights are needed for power plans, services, and registry tweaks.',
        'The startup screen verifies dependencies, then opens the dashboard.',
      ] },
    ],
  },
  {
    slug: 'first-launch', title: 'First Launch Guide', category: 'getting-started',
    summary: 'What happens the first time you open the app.',
    sections: [
      { heading: 'Startup checks', body: ['On launch, ClozOptimizer verifies your OS version, hardware, VC++/.NET runtimes, critical services, and disk space. Each check shows live status before the dashboard appears.'] },
      { heading: 'Free vs Pro', body: ['The core tools (dashboard, cleanup, startup manager, RAM optimizer, processes, basic monitoring) are free. Advanced features — AI Intelligence, Optimization Profiles, Gaming Hub, Security, Cloud Sync and more — are marked with a crown and require Pro.'] },
    ],
  },
  {
    slug: 'activate-license', title: 'Activate a License Key', category: 'getting-started',
    summary: 'Unlock Pro on your account and across devices.',
    sections: [
      { heading: 'Activate in the app', body: ['Pro is tied to your Cloz account, so it works on every device you sign into.'], steps: [
        'Open Account → Sign in with Cloz (this opens your browser to authorize).',
        'Back in the app, enter your license key and click Activate.',
        'The whole app unlocks instantly — the sidebar shows your plan.',
      ] },
      { heading: 'Activate on the web', body: ['You can also activate from this website: Account → Subscription → enter your key. It syncs to the app automatically.'] },
    ],
  },
  {
    slug: 'dashboard', title: 'Understanding the Dashboard', category: 'dashboard',
    summary: 'Your system at a glance — live metrics and health score.',
    sections: [
      { heading: 'Health Score', body: ['The score (0-100) is computed from live CPU, memory, thermal, storage, and startup readings. Green is healthy, amber is fair, red needs attention.'] },
      { heading: 'Live metrics', body: ['CPU, memory, and GPU temperature update in real time. The CPU history chart shows the last several minutes. The Optimize Now button applies a safe one-click tune (High Performance plan, Game DVR off, standby RAM cleared).'] },
    ],
  },
  {
    slug: 'monitoring', title: 'Live Monitoring & Hardware', category: 'dashboard',
    summary: 'Track temperatures, processes, and hardware details.',
    sections: [
      { heading: 'Temperatures', body: ['The Temperatures page reads CPU and GPU sensors live. Sustained CPU temps above 85°C indicate thermal throttling — check cooling.'] },
      { heading: 'Processes & Hardware', body: ['Process Manager lists top CPU/RAM consumers with kill and priority controls. The Hardware Center (Pro) shows full CPU, GPU, memory, OS, and storage specs.'] },
    ],
  },
  {
    slug: 'optimization-profiles', title: 'Optimization Profiles', category: 'optimization', pro: true,
    summary: 'One-click system tuning for any task. Pro feature.',
    sections: [
      { heading: 'What they do', body: ['Profiles apply real system changes at once: power plan, background services, process priorities, Game DVR, mouse acceleration, network mode, and standby RAM. Every change is reversible.'] },
      { heading: 'Built-in profiles', body: ['Competitive Gaming, Streaming, Video Editing, Work Mode, and Battery Saver. Activate one and it reconfigures your system; deactivate to restore.'] },
      { heading: 'Activating', body: [], steps: [
        'Open Profiles (Pro).', 'Pick a profile and review the listed changes.', 'Click Activate — actions run immediately and are logged.', 'Deactivate any time to roll everything back.',
      ] },
    ],
  },
  {
    slug: 'build-optimization', title: 'Build Your Own Optimization', category: 'optimization', pro: true,
    summary: 'Create custom optimization profiles in the Customize studio. Pro feature.',
    sections: [
      { heading: 'Optimization builder', body: ['Customize → Optimization lets you choose a target (system-wide or a specific game), power plan, process priority, tweak toggles, and which services to disable.'] },
      { heading: 'Save, apply, publish', body: ['Apply Now runs it immediately, Save Profile stores it under My Profiles, and Publish submits it to the marketplace (after Discord approval) so others can use it.'] },
    ],
  },
  {
    slug: 'ai-intelligence', title: 'AI Intelligence', category: 'optimization', pro: true,
    summary: 'Health checks, bottleneck analysis, and an AI troubleshooter. Pro feature.',
    sections: [
      { heading: 'Health Check', body: ['Scans your live system and scores CPU, memory, thermal, storage, and startup, each with a specific suggestion.'] },
      { heading: 'Bottleneck Analyzer & Troubleshooter', body: ['The analyzer flags your most constrained component in real time. The AI Troubleshooter takes a plain-English description of your issue and returns a diagnosis plus step-by-step fixes based on your actual metrics.'] },
    ],
  },
  {
    slug: 'cleanup', title: 'Cleanup Suite', category: 'optimization',
    summary: 'Reclaim disk space safely.',
    sections: [
      { heading: 'How it works', body: ['Cleanup scans temp files, caches, logs, and Windows junk, then shows exactly what will be removed and how much space you reclaim. Nothing is deleted without your confirmation.'] },
    ],
  },
  {
    slug: 'gaming-hub', title: 'Gaming Hub & Per-Game Configs', category: 'gaming', pro: true,
    summary: 'Maximize FPS and configure per-game GPU settings. Pro feature.',
    sections: [
      { heading: 'Game optimization', body: ['The Gaming Hub raises game process priority, switches to Ultimate Performance, disables Game DVR, and clears standby memory for a clean run.'] },
      { heading: 'NVIDIA & AMD per-game settings', body: ['In Customize → GPU & Game, build NVIDIA Freestyle filter configs (sharpen, vibrance, clarity…) or AMD Radeon settings (Anti-Lag, Image Sharpening, Boost) per game, then save and publish them.'] },
      { heading: 'Auto-apply on launch', body: ['Pro users can toggle Auto on a subscribed game profile in My Items. The app detects the game executable launching and applies the profile automatically.'] },
    ],
  },
  {
    slug: 'security-privacy', title: 'Security & Privacy Tools', category: 'security', pro: true,
    summary: 'Harden Windows and control your data. Pro features.',
    sections: [
      { heading: 'Privacy', body: ['Disable telemetry, tracking, and data collection with reversible toggles. Each change is documented.'] },
      { heading: 'Security & cleanup tools', body: ['Security Scanner reports Defender, firewall, and UAC status. File Shredder securely erases files. Hosts Editor blocks domains system-wide. Services Manager disables unnecessary services.'] },
    ],
  },
  {
    slug: 'registry-restore', title: 'Registry Cleaner & Restore Points', category: 'security', pro: true,
    summary: 'Clean the registry safely with rollback. Pro features.',
    sections: [
      { heading: 'Best practice', body: ['Always create a Restore Point before registry changes — the Restore Points page does this in one click.'] },
      { heading: 'Registry Cleaner', body: ['Scans for broken references and orphaned keys, then fixes them on your confirmation. All changes are logged.'] },
    ],
  },
  {
    slug: 'marketplace-browse', title: 'Browsing & Installing Presets', category: 'marketplace',
    summary: 'Discover community content and install it on your PC.',
    sections: [
      { heading: 'Browse', body: ['The Marketplace (in-app and on the web) lists UI themes, game profiles, Windows presets, optimization profiles, and more. Filter by category, search, and sort by popularity, rating, or newest.'] },
      { heading: 'Install', body: ['In the app, click Install — themes apply instantly; game/optimization presets land in My Items where you can Apply them. On the web, Get Preset adds it to your library to install from the app.'] },
    ],
  },
  {
    slug: 'become-creator', title: 'Publishing as a Creator', category: 'marketplace', pro: true,
    summary: 'Create, publish, and manage marketplace content. Customize is a Pro tool.',
    sections: [
      { heading: 'Create', body: ['Use Customize (Pro) to build themes, GPU configs, or optimization profiles, then Save them as profiles.'] },
      { heading: 'Publish & approval', body: ['Click Publish — your submission is sent to the team for review via Discord. Once approved, it goes live in the marketplace under your creator profile with your saved config.'] },
    ],
  },
  {
    slug: 'account-cloud', title: 'Account & Cloud Sync', category: 'cloud', pro: true,
    summary: 'One account across web, app, and marketplace. Cloud Sync is Pro.',
    sections: [
      { heading: 'Your Cloz account', body: ['A single account works everywhere — website, launcher, marketplace, and the desktop app. Sign in via Account → Sign in with Cloz.'] },
      { heading: 'Cloud Sync', body: ['Pro users sync settings, profiles, themes, and favorites across devices. Install a preset on one PC and it is available on any device you sign into.'] },
    ],
  },
  {
    slug: 'device-management', title: 'Devices & License Dashboard', category: 'cloud',
    summary: 'See your devices, licenses, and installed content.',
    sections: [
      { heading: 'License Dashboard', body: ['Cloud → License Dashboard shows your current plan, linked license keys, and everything you have installed.'] },
      { heading: 'Devices', body: ['Each PC you sign into is registered to your account. Manage them from the Cloud → Devices tab.'] },
    ],
  },
]

export function getArticle(slug: string) {
  return DOC_ARTICLES.find(a => a.slug === slug) || null
}
