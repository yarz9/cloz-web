import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'ClozOptimizer — Premium PC Performance Suite'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px',
          background: 'radial-gradient(1000px 600px at 20% 10%, rgba(96,165,250,0.18), transparent), radial-gradient(900px 600px at 90% 90%, rgba(167,139,250,0.16), transparent), #08080d',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 26,
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 56, color: '#08080d', fontWeight: 800 }}>⚡</div>
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#f0f0f5' }}>ClozOptimizer</div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, maxWidth: 920 }}>
          Premium PC Performance Suite
        </div>
        <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.55)', marginTop: 28, maxWidth: 900 }}>
          45+ optimization tools · AI tuning · community marketplace
        </div>
        <div style={{ display: 'flex', marginTop: 48, gap: 14 }}>
          {['Optimize', 'Monitor', 'Marketplace', 'Cloud Sync'].map(t => (
            <div key={t} style={{
              fontSize: 22, color: '#9ec1fb', padding: '10px 22px', borderRadius: 999,
              background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)',
            }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
