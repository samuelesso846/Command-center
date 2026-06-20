function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function stars(n = 5) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function buildSiteHtml({ businessName, color, content, contact }) {
  const c = content || {};
  const primary = color || '#4285f4';

  // Couleur secondaire plus foncée
  const darken = (hex, pct) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - pct);
    const g = Math.max(0, ((n >> 8) & 0xff) - pct);
    const b = Math.max(0, (n & 0xff) - pct);
    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
  };
  const dark = darken(primary, 40);

  const services = (c.services || []).map(s => `
    <div class="service-card reveal">
      <div class="service-icon">${escapeHtml(s.icon || '✦')}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.description)}</p>
      ${s.price_hint ? `<span class="price-hint">${escapeHtml(s.price_hint)}</span>` : ''}
    </div>`).join('');

  const stats = (c.stats || []).map(s => `
    <div class="stat-item">
      <div class="stat-number">${escapeHtml(s.number)}</div>
      <div class="stat-label">${escapeHtml(s.label)}</div>
    </div>`).join('');

  const testimonials = (c.testimonials || []).map(t => `
    <div class="testi-card reveal">
      <div class="testi-stars">${stars(t.rating || 5)}</div>
      <p>"${escapeHtml(t.text)}"</p>
      <div class="testi-author">
        <div class="testi-avatar">${escapeHtml((t.name || 'A')[0])}</div>
        <div>
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.role || '')}</span>
        </div>
      </div>
    </div>`).join('');

  const faq = (c.faq || []).map((f, i) => `
    <div class="faq-item reveal">
      <button class="faq-q" onclick="toggleFaq(${i})">
        <span>${escapeHtml(f.question)}</span>
        <span class="faq-icon" id="icon-${i}">+</span>
      </button>
      <div class="faq-a" id="faq-${i}">${escapeHtml(f.answer)}</div>
    </div>`).join('');

  const wa = contact.phone ? contact.phone.replace(/\D/g,'') : '';
  const waMsg = encodeURIComponent(c.whatsapp_message || `Bonjour, je souhaite en savoir plus sur ${businessName}`);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(businessName)} — ${escapeHtml(c.tagline || '')}</title>
<meta name="description" content="${escapeHtml(c.hero_subtitle || c.tagline || '')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --primary: ${primary}; --dark: ${dark}; --text: #1a1a2e; --gray: #6b7280; --light: #f8fafc; --white: #ffffff; --radius: 16px; --shadow: 0 4px 24px rgba(0,0,0,0.08); }
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }
body { font-family:'Poppins',sans-serif; color:var(--text); background:var(--white); overflow-x:hidden; }

/* NAVBAR */
nav { position:fixed; top:0; left:0; right:0; z-index:1000; padding:0 5%; background:rgba(255,255,255,0.95); backdrop-filter:blur(12px); border-bottom:1px solid rgba(0,0,0,0.06); display:flex; align-items:center; justify-content:space-between; height:70px; transition:box-shadow .3s; }
nav.scrolled { box-shadow:0 2px 20px rgba(0,0,0,0.1); }
.nav-logo { font-size:1.3rem; font-weight:800; color:var(--primary); text-decoration:none; letter-spacing:-0.5px; }
.nav-links { display:flex; gap:32px; list-style:none; }
.nav-links a { text-decoration:none; color:var(--text); font-size:.9rem; font-weight:500; transition:color .2s; }
.nav-links a:hover { color:var(--primary); }
.nav-cta { background:var(--primary); color:#fff !important; padding:10px 22px; border-radius:50px; font-weight:600 !important; transition:transform .2s, box-shadow .2s !important; }
.nav-cta:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,0.2); }
.nav-toggle { display:none; flex-direction:column; gap:5px; cursor:pointer; }
.nav-toggle span { width:24px; height:2px; background:var(--text); border-radius:2px; transition:.3s; }

/* HERO */
.hero { min-height:100vh; background:linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%); display:flex; align-items:center; padding:100px 5% 60px; position:relative; overflow:hidden; }
.hero::before { content:''; position:absolute; top:-50%; right:-20%; width:600px; height:600px; background:rgba(255,255,255,0.05); border-radius:50%; }
.hero::after { content:''; position:absolute; bottom:-30%; left:-10%; width:400px; height:400px; background:rgba(255,255,255,0.04); border-radius:50%; }
.hero-content { position:relative; z-index:1; max-width:700px; }
.hero-badge { display:inline-block; background:rgba(255,255,255,0.15); color:#fff; padding:6px 16px; border-radius:50px; font-size:.8rem; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px; }
.hero h1 { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; color:#fff; line-height:1.15; margin-bottom:20px; letter-spacing:-1px; }
.hero p { font-size:1.1rem; color:rgba(255,255,255,0.85); line-height:1.7; margin-bottom:36px; max-width:560px; }
.hero-btns { display:flex; gap:16px; flex-wrap:wrap; }
.btn { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:50px; font-weight:600; font-size:.95rem; text-decoration:none; transition:all .3s; cursor:pointer; border:none; }
.btn-white { background:#fff; color:var(--primary); }
.btn-white:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.2); }
.btn-outline { background:transparent; color:#fff; border:2px solid rgba(255,255,255,0.6); }
.btn-outline:hover { background:rgba(255,255,255,0.15); border-color:#fff; }

/* STATS BAR */
.stats-bar { background:var(--white); padding:48px 5%; }
.stats-inner { max-width:900px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
.stat-item { text-align:center; }
.stat-number { font-size:2.2rem; font-weight:800; color:var(--primary); line-height:1; }
.stat-label { font-size:.85rem; color:var(--gray); margin-top:6px; font-weight:500; }

/* SECTIONS */
section { padding:80px 5%; }
.section-label { display:inline-block; color:var(--primary); font-size:.8rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
.section-title { font-size:clamp(1.6rem,3vw,2.4rem); font-weight:800; color:var(--text); line-height:1.2; margin-bottom:16px; letter-spacing:-0.5px; }
.section-sub { color:var(--gray); font-size:1rem; line-height:1.7; max-width:560px; }
.section-header { margin-bottom:56px; }
.text-center { text-align:center; }
.text-center .section-sub { margin:0 auto; }

/* ABOUT */
.about-section { background:var(--light); }
.about-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; max-width:1100px; margin:0 auto; }
.about-visual { background:linear-gradient(135deg, var(--primary), var(--dark)); border-radius:24px; height:360px; display:flex; align-items:center; justify-content:center; font-size:5rem; position:relative; overflow:hidden; }
.about-visual::after { content:''; position:absolute; inset:0; background:rgba(0,0,0,0.1); }
.about-text p { color:var(--gray); line-height:1.8; font-size:1rem; margin-bottom:24px; }
.about-highlight { display:inline-flex; align-items:center; gap:12px; background:var(--white); border:1px solid #e5e7eb; border-radius:12px; padding:16px 20px; }
.about-highlight-icon { width:40px; height:40px; background:var(--primary); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.1rem; flex-shrink:0; }
.about-highlight-text strong { display:block; font-size:.95rem; color:var(--text); }
.about-highlight-text span { font-size:.8rem; color:var(--gray); }

/* SERVICES */
.services-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:24px; max-width:1100px; margin:0 auto; }
.service-card { background:var(--white); border:1px solid #e5e7eb; border-radius:var(--radius); padding:32px 28px; transition:all .3s; position:relative; overflow:hidden; }
.service-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--primary), var(--dark)); transform:scaleX(0); transition:transform .3s; }
.service-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,0.1); border-color:transparent; }
.service-card:hover::before { transform:scaleX(1); }
.service-icon { font-size:2.2rem; margin-bottom:16px; }
.service-card h3 { font-size:1.1rem; font-weight:700; margin-bottom:10px; color:var(--text); }
.service-card p { color:var(--gray); font-size:.9rem; line-height:1.7; }
.price-hint { display:inline-block; margin-top:12px; font-size:.8rem; font-weight:600; color:var(--primary); background:rgba(66,133,244,0.08); padding:4px 12px; border-radius:50px; }

/* TESTIMONIALS */
.testi-section { background:var(--light); }
.testi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; max-width:1100px; margin:0 auto; }
.testi-card { background:var(--white); border-radius:var(--radius); padding:28px; box-shadow:var(--shadow); }
.testi-stars { color:#f59e0b; font-size:1rem; margin-bottom:12px; letter-spacing:2px; }
.testi-card p { color:var(--gray); font-size:.95rem; line-height:1.7; margin-bottom:20px; font-style:italic; }
.testi-author { display:flex; align-items:center; gap:12px; }
.testi-avatar { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, var(--primary), var(--dark)); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:1.1rem; flex-shrink:0; }
.testi-author strong { display:block; font-size:.9rem; color:var(--text); }
.testi-author span { font-size:.8rem; color:var(--gray); }

/* FAQ */
.faq-list { max-width:720px; margin:0 auto; }
.faq-item { border:1px solid #e5e7eb; border-radius:12px; margin-bottom:12px; overflow:hidden; }
.faq-q { width:100%; background:var(--white); border:none; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-size:.95rem; font-weight:600; color:var(--text); font-family:'Poppins',sans-serif; text-align:left; gap:16px; }
.faq-q:hover { background:var(--light); }
.faq-icon { font-size:1.4rem; color:var(--primary); flex-shrink:0; transition:transform .3s; font-weight:300; }
.faq-a { max-height:0; overflow:hidden; transition:max-height .4s ease, padding .3s; padding:0 24px; color:var(--gray); font-size:.9rem; line-height:1.7; }
.faq-a.open { max-height:200px; padding:0 24px 20px; }

/* CONTACT */
.contact-section { background:linear-gradient(135deg, var(--primary), var(--dark)); }
.contact-inner { max-width:700px; margin:0 auto; text-align:center; }
.contact-section .section-title { color:#fff; }
.contact-section .section-sub { color:rgba(255,255,255,0.8); margin:0 auto 40px; }
.contact-cards { display:flex; flex-wrap:wrap; justify-content:center; gap:16px; margin-bottom:40px; }
.contact-card { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:16px 24px; display:flex; align-items:center; gap:12px; color:#fff; text-decoration:none; transition:background .2s; }
.contact-card:hover { background:rgba(255,255,255,0.2); }
.contact-card span { font-size:1.2rem; }
.contact-card p { font-size:.9rem; }

/* FOOTER */
footer { background:#0f172a; color:rgba(255,255,255,0.6); padding:40px 5%; text-align:center; }
.footer-logo { font-size:1.4rem; font-weight:800; color:#fff; margin-bottom:12px; }
.footer-desc { font-size:.85rem; max-width:400px; margin:0 auto 24px; line-height:1.7; }
.footer-bottom { font-size:.8rem; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; margin-top:20px; }

/* WHATSAPP */
.wa-btn { position:fixed; bottom:24px; right:24px; z-index:999; width:60px; height:60px; background:#25d366; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(37,211,102,0.4); text-decoration:none; font-size:1.8rem; transition:transform .3s; }
.wa-btn:hover { transform:scale(1.1); }

/* REVEAL ANIMATION */
.reveal { opacity:0; transform:translateY(30px); transition:opacity .6s ease, transform .6s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }

/* RESPONSIVE */
@media(max-width:768px) {
  .nav-links { display:none; position:fixed; top:70px; left:0; right:0; background:#fff; flex-direction:column; padding:24px; gap:16px; box-shadow:0 8px 24px rgba(0,0,0,0.1); }
  .nav-links.open { display:flex; }
  .nav-toggle { display:flex; }
  .about-grid { grid-template-columns:1fr; gap:32px; }
  .about-visual { height:200px; }
  .stats-inner { grid-template-columns:repeat(3,1fr); gap:16px; }
  .stat-number { font-size:1.6rem; }
  .hero-btns { flex-direction:column; }
  .btn { justify-content:center; }
}
</style>
</head>
<body>

<!-- NAVBAR -->
<nav id="navbar">
  <a href="#" class="nav-logo">${escapeHtml(businessName)}</a>
  <ul class="nav-links" id="navLinks">
    <li><a href="#about">À propos</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#testimonials">Avis</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#contact" class="nav-cta">Nous contacter</a></li>
  </ul>
  <div class="nav-toggle" onclick="toggleNav()">
    <span></span><span></span><span></span>
  </div>
</nav>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-content">
    <div class="hero-badge">✦ Bienvenue</div>
    <h1>${escapeHtml(c.tagline || businessName)}</h1>
    <p>${escapeHtml(c.hero_subtitle || '')}</p>
    <div class="hero-btns">
      <a href="#contact" class="btn btn-white">📞 ${escapeHtml(c.cta_primary || 'Nous contacter')}</a>
      <a href="#services" class="btn btn-outline">${escapeHtml(c.cta_secondary || 'Nos services')}</a>
    </div>
  </div>
</section>

<!-- STATS -->
${stats ? `<div class="stats-bar"><div class="stats-inner">${stats}</div></div>` : ''}

<!-- ABOUT -->
<section class="about-section" id="about">
  <div class="about-grid">
    <div class="about-visual">🏢</div>
    <div class="about-text">
      <span class="section-label">À propos de nous</span>
      <h2 class="section-title">${escapeHtml(c.about_title || 'Notre histoire')}</h2>
      <p>${escapeHtml(c.about || '')}</p>
      ${c.about_highlight ? `<div class="about-highlight">
        <div class="about-highlight-icon">⭐</div>
        <div class="about-highlight-text">
          <strong>${escapeHtml(c.about_highlight)}</strong>
          <span>Notre engagement qualité</span>
        </div>
      </div>` : ''}
    </div>
  </div>
</section>

<!-- SERVICES -->
<section id="services">
  <div class="section-header text-center">
    <span class="section-label">Ce que nous faisons</span>
    <h2 class="section-title">${escapeHtml(c.services_title || 'Nos Services')}</h2>
  </div>
  <div class="services-grid">${services}</div>
</section>

<!-- TESTIMONIALS -->
<section class="testi-section" id="testimonials">
  <div class="section-header text-center">
    <span class="section-label">Ils nous font confiance</span>
    <h2 class="section-title">Ce que disent nos clients</h2>
  </div>
  <div class="testi-grid">${testimonials}</div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="section-header text-center">
    <span class="section-label">Questions fréquentes</span>
    <h2 class="section-title">Tout ce que vous voulez savoir</h2>
  </div>
  <div class="faq-list">${faq}</div>
</section>

<!-- CONTACT -->
<section class="contact-section" id="contact">
  <div class="contact-inner">
    <span class="section-label" style="color:rgba(255,255,255,0.7)">Parlons de votre projet</span>
    <h2 class="section-title">Contactez-nous</h2>
    <p class="section-sub">Nous répondons dans les 24h. N\'hésitez pas à nous contacter par téléphone, email ou WhatsApp.</p>
    <div class="contact-cards">
      ${contact.phone ? `<a href="tel:${escapeHtml(contact.phone)}" class="contact-card"><span>📞</span><p>${escapeHtml(contact.phone)}</p></a>` : ''}
      ${contact.email ? `<a href="mailto:${escapeHtml(contact.email)}" class="contact-card"><span>✉️</span><p>${escapeHtml(contact.email)}</p></a>` : ''}
      ${wa ? `<a href="https://wa.me/${wa}?text=${waMsg}" target="_blank" class="contact-card"><span>💬</span><p>WhatsApp</p></a>` : ''}
    </div>
    <a href="${wa ? `https://wa.me/${wa}?text=${waMsg}` : `mailto:${contact.email}`}" class="btn btn-white" style="font-size:1rem;padding:16px 36px;">
      🚀 Démarrer mon projet
    </a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">${escapeHtml(businessName)}</div>
  <p class="footer-desc">${escapeHtml(c.footer_description || '')}</p>
  <div class="footer-bottom">© ${new Date().getFullYear()} ${escapeHtml(businessName)} — Tous droits réservés</div>
</footer>

<!-- WHATSAPP FLOATING -->
${wa ? `<a href="https://wa.me/${wa}?text=${waMsg}" class="wa-btn" target="_blank" title="WhatsApp">💬</a>` : ''}

<script>
// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// FAQ
function toggleFaq(i) {
  const el = document.getElementById('faq-' + i);
  const icon = document.getElementById('icon-' + i);
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(e => e.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(e => e.textContent = '+');
  if (!isOpen) { el.classList.add('open'); icon.textContent = '−'; }
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
</body>
</html>`;
}

module.exports = { buildSiteHtml };
