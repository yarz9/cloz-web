// Assigns Discord server roles based on a user's plan, using the bot token.
// The member must already be in the guild. Configure via env:
//   DISCORD_BOT_TOKEN, DISCORD_GUILD_ID,
//   DISCORD_ROLE_PRO, DISCORD_ROLE_LIFETIME, DISCORD_ROLE_CREATOR

const API = 'https://discord.com/api/v10'

function botHeaders() {
  return {
    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'cloz-web (https://cloz-optimizer.up.railway.app)',
  }
}

async function addRole(guildId: string, userId: string, roleId: string) {
  if (!roleId) return
  try {
    await fetch(`${API}/guilds/${guildId}/members/${userId}/roles/${roleId}`, { method: 'PUT', headers: botHeaders() })
  } catch {}
}
async function removeRole(guildId: string, userId: string, roleId: string) {
  if (!roleId) return
  try {
    await fetch(`${API}/guilds/${guildId}/members/${userId}/roles/${roleId}`, { method: 'DELETE', headers: botHeaders() })
  } catch {}
}

// Sync the plan-based roles for a linked Discord account.
export async function syncDiscordRoles(discordId: string | null | undefined, plan: string | undefined, isCreator = false) {
  const guildId = process.env.DISCORD_GUILD_ID
  const token = process.env.DISCORD_BOT_TOKEN
  if (!discordId || !guildId || !token) return

  const PRO = process.env.DISCORD_ROLE_PRO || ''
  const LIFETIME = process.env.DISCORD_ROLE_LIFETIME || ''
  const CREATOR = process.env.DISCORD_ROLE_CREATOR || ''

  // Plan roles — grant the matching one, clear the others
  if (plan === 'lifetime') {
    await addRole(guildId, discordId, LIFETIME)
    await removeRole(guildId, discordId, PRO)
  } else if (plan === 'pro') {
    await addRole(guildId, discordId, PRO)
    await removeRole(guildId, discordId, LIFETIME)
  } else {
    await removeRole(guildId, discordId, PRO)
    await removeRole(guildId, discordId, LIFETIME)
  }

  if (isCreator && CREATOR) await addRole(guildId, discordId, CREATOR)
}
