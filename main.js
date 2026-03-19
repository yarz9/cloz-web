/* ============================================
   CLOZ OPTIMIZER — SHARED JAVASCRIPT
   ============================================ */

// ---------- Particles Background ----------
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((w * h) / 18000), 80);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// ---------- Navbar Scroll Effect ----------
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Mobile hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ---------- Scroll Reveal ----------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, i) => {
    el.style.setProperty('--i', i % 8);
    observer.observe(el);
  });
}

// ---------- FAQ Accordion ----------
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ---------- Discord ID Passthrough ----------
function getDiscordId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('discord_id');
}

function appendDiscordId(url) {
  const discordId = getDiscordId();
  if (discordId && url) {
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + 'discord_id=' + encodeURIComponent(discordId);
  }
  return url;
}

function initDiscordPassthrough() {
  const discordId = getDiscordId();
  if (!discordId) return;

  // Show banner if present
  const banner = document.getElementById('discord-id-banner');
  if (banner) banner.style.display = 'block';

  // Append to all sell.app links
  document.querySelectorAll('a[href*="sell.app"]').forEach(a => {
    a.href = appendDiscordId(a.href);
  });
}

// ---------- Leaderboard Fetching ----------
function initLeaderboard(containerId, apiUrl, refreshInterval) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tbody = container.querySelector('tbody') || container;
  const refreshBtn = document.getElementById('leaderboard-refresh');
  const lastUpdated = document.getElementById('last-updated');

  async function fetchLeaderboard() {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const entries = data.leaderboard || data.data || data;

      if (!Array.isArray(entries) || entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:32px;">No leaderboard data available yet.</td></tr>';
        return;
      }

      tbody.innerHTML = entries.map((entry, i) => {
        const rank = entry.rank || i + 1;
        const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : '';
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
        const username = escapeHTML(entry.username || 'Unknown');
        const score = entry.score != null ? Number(entry.score).toLocaleString() : '—';
        const cpu = (entry.cpu_score ?? entry.cpuscore) != null ? Number(entry.cpu_score ?? entry.cpuscore).toLocaleString() : '—';
        const ram = (entry.ram_score ?? entry.ramscore) != null ? Number(entry.ram_score ?? entry.ramscore).toLocaleString() : '—';
        const disk = (entry.disk_score ?? entry.diskscore) != null ? Number(entry.disk_score ?? entry.diskscore).toLocaleString() : '—';
        const date = (entry.submitted_at || entry.submittedat) ? new Date(entry.submitted_at || entry.submittedat).toLocaleDateString() : '—';

        return `<tr>
          <td class="rank-cell ${rankClass}">${medal}</td>
          <td><strong>${username}</strong></td>
          <td class="score-cell">${score}</td>
          <td class="score-breakdown">CPU: ${cpu}<br>RAM: ${ram}<br>Disk: ${disk}</td>
          <td class="date-cell">${date}</td>
        </tr>`;
      }).join('');

      if (lastUpdated) {
        lastUpdated.textContent = 'Updated ' + new Date().toLocaleTimeString();
      }
    } catch (err) {
      console.warn('Leaderboard fetch error:', err);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:32px;">Unable to load leaderboard. Retrying...</td></tr>';
    }
  }

  fetchLeaderboard();
  if (refreshInterval) {
    setInterval(fetchLeaderboard, refreshInterval);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchLeaderboard);
  }
}

// ---------- Status Badge ----------
function initStatusBadge(apiUrl) {
  const badge = document.getElementById('bot-status');
  if (!badge) return;

  async function checkStatus() {
    try {
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      const online = data.status === 'online' || data.ok || (typeof data.online === 'number' ? data.online > 0 : !!data.online);
      badge.className = 'status-indicator ' + (online ? 'status-online' : 'status-offline');
      badge.innerHTML = online
        ? '<span class="live-dot"></span> Bot Online'
        : '<span style="width:8px;height:8px;border-radius:50%;background:var(--red);"></span> Bot Offline';
    } catch {
      badge.className = 'status-indicator status-offline';
      badge.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:var(--red);"></span> Bot Offline';
    }
  }

  checkStatus();
  setInterval(checkStatus, 30000);
}

// ---------- Helpers ----------
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Init Everything ----------
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initScrollReveal();
  initFAQ();
  initDiscordPassthrough();
});
