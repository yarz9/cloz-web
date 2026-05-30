// Email delivery via Resend's HTTP API (no SDK dependency).
// Configure with RESEND_API_KEY; sender defaults to general@cloz.digital.
// If no API key is set, emails are logged and skipped (dev-safe).

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'Cloz <general@cloz.digital>'
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://cloz-optimizer.up.railway.app').replace(/\/$/, '')

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[email] (no RESEND_API_KEY) would send to ${to}: ${subject}`)
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    })
    if (!res.ok) { console.error('[email] send failed', res.status, await res.text().catch(() => '')); return false }
    return true
  } catch (e) {
    console.error('[email] error', e)
    return false
  }
}

// ---- Branded shell ----
function shell(title: string, bodyHtml: string, cta?: { label: string; url: string }): string {
  return `<!doctype html><html><body style="margin:0;background:#0a0a0f;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#e8e8ef">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
      <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#60a5fa,#a78bfa)"></div>
      <span style="font-size:18px;font-weight:800;letter-spacing:-0.3px">ClozOptimizer</span>
    </div>
    <div style="background:#14141c;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:32px">
      <h1 style="font-size:20px;font-weight:700;margin:0 0 14px">${title}</h1>
      <div style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.6)">${bodyHtml}</div>
      ${cta ? `<a href="${cta.url}" style="display:inline-block;margin-top:24px;padding:12px 22px;border-radius:10px;background:#60a5fa;color:#0a0a0f;font-weight:700;font-size:14px;text-decoration:none">${cta.label}</a>
      <p style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:18px;word-break:break-all">Or paste this link: ${cta.url}</p>` : ''}
    </div>
    <p style="font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-top:24px">© 2026 Cloz · Premium Windows Optimization</p>
  </div></body></html>`
}

export function sendVerificationEmail(to: string, token: string) {
  const url = `${APP_URL}/api/auth/verify-email?token=${token}`
  return sendEmail(to, 'Verify your Cloz account', shell(
    'Confirm your email',
    'Welcome to the Cloz ecosystem! Confirm your email address to verify your account and unlock the full marketplace.',
    { label: 'Verify Email', url },
  ))
}

export function sendPasswordResetEmail(to: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`
  return sendEmail(to, 'Reset your Cloz password', shell(
    'Password reset',
    'We received a request to reset your password. This link expires in 1 hour. If you didn\'t request this, you can safely ignore this email.',
    { label: 'Reset Password', url },
  ))
}

export function sendLicenseEmail(to: string, plan: string, key: string) {
  return sendEmail(to, `Your ClozOptimizer ${plan} license key`, shell(
    'Thank you for your purchase! 🎉',
    `Your <strong>${plan}</strong> license is ready. Activate it in the app or on your account page:<br><br>
     <div style="font-family:monospace;font-size:16px;font-weight:700;letter-spacing:1px;padding:14px;background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:10px;text-align:center;color:#60a5fa">${key}</div>`,
    { label: 'Activate on your account', url: `${APP_URL}/account?tab=subscription` },
  ))
}
