/* =============================================
   BIRTHDAY WEBSITE — ALL JAVASCRIPT
   ============================================= */

/* ── 1. WELCOME OVERLAY ── */
const overlay   = document.getElementById('welcome-overlay');
const mainSite  = document.getElementById('main-site');
const openBtn   = document.getElementById('open-btn');
const nav       = document.getElementById('nav');
const bgMusic   = document.getElementById('bg-music');

// Generate star particles on the welcome screen
(function spawnWelcomeStars() {
  const container = document.querySelector('.welcome-particles');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.style.cssText = `
      position:absolute;
      width:${Math.random()*3+1}px;
      height:${Math.random()*3+1}px;
      border-radius:50%;
      background:rgba(192,99,122,${Math.random()*0.35+0.08});
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation: twinkle ${Math.random()*4+2}s ease-in-out ${Math.random()*3}s infinite;
    `;
    container.appendChild(s);
  }
})();

// Twinkle keyframe injected via JS (avoids extra CSS rule)
const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
  @keyframes twinkle {
    0%,100%{opacity:0.2;transform:scale(1);}
    50%{opacity:1;transform:scale(1.6);}
  }
`;
document.head.appendChild(twinkleStyle);

openBtn.addEventListener('click', () => {
  // 1. Start music (browser requires gesture first)
  if (bgMusic) { bgMusic.volume = 0.4; bgMusic.play().catch(() => {}); }

  // 2. Hide overlay
  overlay.classList.add('hidden');

  // 3. Show main site
  mainSite.style.display = 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { mainSite.classList.add('visible'); });
  });

  // 4. Show nav after a beat
  setTimeout(() => nav.classList.add('show'), 800);

  // 5. Trigger timeline animations after section is visible
  setTimeout(observeTimeline, 1200);
  setTimeout(startTyping, 2400);
  setTimeout(launchHearts, 1500);
  setTimeout(initParticles, 1200);
});

/* ── 2. LIGHTBOX ── */
const lightbox      = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightbox-media');
const closeBtn      = document.getElementById('lightbox-close');

function openLightbox(type, src, poster) {
  lightboxMedia.innerHTML = '';
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src; img.alt = 'Memory';
    lightboxMedia.appendChild(img);
  } else if (type === 'video') {
    const vid = document.createElement('video');
    vid.src = src; vid.controls = true; vid.autoplay = true;
    vid.style.maxHeight = '85vh';
    if (poster) vid.poster = poster;
    lightboxMedia.appendChild(vid);
  }
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Stop any playing video
  const vid = lightboxMedia.querySelector('video');
  if (vid) { vid.pause(); vid.src = ''; }
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// Wire up all cards
document.querySelectorAll('.float-card[data-type]').forEach(card => {
  card.addEventListener('click', () => {
    openLightbox(card.dataset.type, card.dataset.src, card.dataset.poster || '');
  });
});

/* ── 3. TIMELINE SCROLL OBSERVER ── */
function observeTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  items.forEach(i => obs.observe(i));
}

/* ── 4. LOVE LETTER TYPING EFFECT ── */
const letterText = [
  "To my favourite person in the entire universe,",
  "\n\nEvery single day with you feels like a scene",
  " from a movie I never want to end. You make",
  " ordinary moments extraordinary just by being you.",
  "\n\nYour laugh is my favourite sound.",
  " Your smile is my favourite sight.",
  " And you — simply you — are my favourite everything.",
  "\n\nOn this special day, I want you to know that",
  " I am endlessly grateful that the universe",
  " decided we should find each other.",
  "\n\nHappy Birthday, my love. 🌹",
  "\n\n                        — Always yours ♾️"
].join('');

function startTyping() {
  const el = document.getElementById('typed-letter');
  const cursor = document.querySelector('.typing-cursor');
  if (!el) return;
  let i = 0;
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    const interval = setInterval(() => {
      if (i >= letterText.length) { clearInterval(interval); return; }
      // Handle newlines
      if (letterText[i] === '\n') { el.appendChild(document.createElement('br')); }
      else { el.insertBefore(document.createTextNode(letterText[i]), cursor); }
      i++;
    }, 38);
  }, { threshold: 0.3 });
  obs.observe(el);
}

/* ── 5. PARTICLE CANVAS (Stars/Hearts — Finale) ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const SYMBOLS = ['✦', '✧', '♡', '·', '⋆'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 14 + 6,
      sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      alphaDir: Math.random() > 0.5 ? 0.005 : -0.005,
      color: [`#c0637a`, `#c9963a`, `#e8899a`, `#d4a0b0`][Math.floor(Math.random() * 4)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0.05, Math.min(0.9, p.alpha));
      ctx.fillStyle   = p.color;
      ctx.font        = `${p.size}px serif`;
      ctx.fillText(p.sym, p.x, p.y);
      ctx.restore();

      p.x += p.vx; p.y += p.vy;
      p.alpha += p.alphaDir;
      if (p.alpha > 0.85 || p.alpha < 0.05) p.alphaDir *= -1;
      if (p.y < -20)            { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10)            p.x = canvas.width + 10;
      if (p.x > canvas.width+10) p.x = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 6. FLOATING HEARTS (Finale section) ── */
function launchHearts() {
  const finale = document.getElementById('finale-section');
  if (!finale) return;
  const emojis = ['♡', '✦', '🌸', '✧', '♡'];

  setInterval(() => {
    if (!document.getElementById('finale-section')) return;
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left     = `${Math.random() * 100}%`;
    h.style.fontSize = `${Math.random() * 20 + 12}px`;
    h.style.opacity  = `${Math.random() * 0.6 + 0.3}`;
    const dur = Math.random() * 6 + 7;
    h.style.animationDuration = `${dur}s`;
    h.style.color = ['#c0637a','#c9963a','#e8899a','#d4a0b0'][Math.floor(Math.random()*4)];
    finale.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  }, 700);
}

/* ── 7. SMOOTH SCROLL for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
