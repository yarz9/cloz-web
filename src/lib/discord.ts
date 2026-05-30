/**
 * Discord integration — sends a marketplace-submission embed to the approval
 * channel with Approve/Deny buttons for the team to review before a preset
 * goes live.
 */

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const CHANNEL_ID = process.env.DISCORD_PRESET_CHANNEL_ID

const CATEGORY_COLORS: Record<string, number> = {
  ui: 0x22d3ee, theme: 0xa78bfa, game: 0xf87171, optimization: 0x60a5fa,
  windows: 0x4ade80, dashboard: 0xfbbf24, widget: 0x22d3ee,
}

export async function sendPresetApprovalEmbed(preset: {
  id: string; slug: string; name: string; description: string; longDesc?: string | null
  category: string; version: string; tags: string[]; configData?: any
  author: { username: string; displayName?: string | null }
}): Promise<string | null> {
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.warn('[discord] Bot token / channel not configured — skipping approval embed')
    return null
  }

  // Build a compact preview of the saved config
  let configPreview = '—'
  try {
    if (preset.configData) {
      const c = typeof preset.configData === 'string' ? JSON.parse(preset.configData) : preset.configData
      if (c.type === 'theme' && c.vars) {
        configPreview = Object.entries(c.vars).slice(0, 5).map(([k, v]) => `${k}: ${v}`).join('\n')
      } else if (c.type === 'nvidia-filter') {
        configPreview = `NVIDIA Freestyle · ${c.game}\n` + Object.entries(c.filters || {}).slice(0, 6).map(([k, v]) => `${k}: ${v}`).join(', ')
      } else if (c.type === 'amd-settings') {
        configPreview = `AMD Radeon · ${c.game}\n` + Object.entries(c.settings || {}).slice(0, 6).map(([k, v]) => `${k}: ${v}`).join(', ')
      } else {
        configPreview = JSON.stringify(c).slice(0, 200)
      }
    }
  } catch {}

  const body = {
    embeds: [{
      title: '📦 New Marketplace Submission',
      description: `**${preset.name}** is awaiting review before going live.`,
      color: CATEGORY_COLORS[preset.category] || 0x60a5fa,
      fields: [
        { name: '📝 Name', value: preset.name, inline: true },
        { name: '🗂️ Category', value: `\`${preset.category}\``, inline: true },
        { name: '🔖 Version', value: `\`${preset.version}\``, inline: true },
        { name: '👤 Creator', value: preset.author.displayName || preset.author.username, inline: true },
        { name: '🏷️ Tags', value: preset.tags.length ? preset.tags.map(t => `\`${t}\``).join(' ') : '—', inline: true },
        { name: '🔗 Slug', value: `\`${preset.slug}\``, inline: true },
        { name: '📄 Description', value: (preset.longDesc || preset.description || '—').slice(0, 500), inline: false },
        { name: '⚙️ Saved Config', value: '```\n' + configPreview.slice(0, 400) + '\n```', inline: false },
      ],
      footer: { text: `Preset ID: ${preset.id}` },
      timestamp: new Date().toISOString(),
    }],
    components: [{
      type: 1,
      components: [
        { type: 2, style: 3, label: 'Approve', emoji: { name: '✅' }, custom_id: `preset_approve_${preset.id}` },
        { type: 2, style: 4, label: 'Deny', emoji: { name: '❌' }, custom_id: `preset_deny_${preset.id}` },
        { type: 2, style: 1, label: 'Approve + Verify', emoji: { name: '🛡️' }, custom_id: `preset_verify_${preset.id}` },
      ],
    }],
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) { console.error('[discord] embed failed', await res.text()); return null }
    const json = await res.json()
    return json.id || null
  } catch (e) {
    console.error('[discord] embed error', e)
    return null
  }
}
