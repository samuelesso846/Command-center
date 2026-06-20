function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function stars(n = 5) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

// Sections spéciales par secteur
function buildSectorSection(templateType, c, color, primary) {
  switch(templateType) {
    case 'restaurant':
      if (!c.menu_items && !c.services) return '';
      const plats = (c.services || []).slice(0,4).map(s => `
        <div class="menu-card">
          <div class="menu-icon">${s.icon || '🍽️'}</div>
          <div class="menu-info">
            <h3>${escapeHtml(s.title)}</h3>
            <p>${escapeHtml(s.description)}</p>
          </div>
          ${s.price_hint ? `<span class="menu-price">${escapeHtml(s.price_hint)}</span>` : ''}
        </div>`).join('');
      return `
<section id="menu" style="background:var(--light);padding:80px 5%;">
  <div class="section-header text-center">
    <span class="section-label">Notre Carte</span>
    <h2 class="section-title">Nos Spécialités</h2>
  </div>
  <div style="max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:16px;">
    ${plats}
  </div>
  <div style="text-align:center;margin-top:40px;">
    <a href="#contact" style="display:inline-flex;align-items:center;gap:8px;background:${primary};color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:1rem;">
      🍽️ Réserver une table
    </a>
  </div>
</section>`;

    case 'boutique':
      const prods = (c.services || []).map(s => `
        <div class="product-card">
          <div class="product-img">${s.icon || '👗'}</div>
          <div class="product-info">
            <h3>${escapeHtml(s.title)}</h3>
            <p>${escapeHtml(s.description)}</p>
            ${s.price_hint ? `<span class="product-price">${escapeHtml(s.price_hint)}</span>` : ''}
          </div>
        </div>`).join('');
      return `
<section id="produits" style="padding:80px 5%;background:var(--light);">
  <div class="section-header text-center">
    <span class="section-label">Nos Produits</span>
    <h2 class="section-title">Nouveautés & Coups de Cœur</h2>
  </div>
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
    ${prods}
  </div>
  <div style="text-align:center;margin-top:40px;padding:24px;background:linear-gradient(135deg,${primary},${primary}dd);border-radius:16px;max-width:600px;margin:40px auto 0;">
    <p style="color:#fff;font-size:1.1rem;font-weight:600;margin-bottom:16px;">💸 Paiement Mobile Money accepté</p>
    <p style="color:rgba(255,255,255,0.85);font-size:.9rem;">MTN Mobile Money · Flooz · Orange Money · Carte bancaire</p>
  </div>
</section>`;

    case 'avocat':
      return `
<section id="urgence" style="padding:60px 5%;background:#1a1a2e;">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <p style="color:rgba(255,255,255,0.6);font-size:.8rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">⚡ Disponible 7j/7</p>
    <h2 style="color:#fff;font-size:1.8rem;font-weight:800;margin-bottom:16px;">Besoin d'une consultation urgente ?</h2>
    <p style="color:rgba(255,255,255,0.7);margin-bottom:32px;">Certaines situations juridiques ne peuvent pas attendre. Contactez-nous maintenant pour une consultation express.</p>
    <a href="#contact" style="display:inline-flex;align-items:center;gap:8px;background:${primary};color:#fff;padding:16px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:1rem;">
      📞 Consultation express
    </a>
  </div>
</section>`;

    case 'agence':
      return `
<section id="process" style="padding:80px 5%;background:var(--light);">
  <div class="section-header text-center">
    <span class="section-label">Comment on travaille</span>
    <h2 class="section-title">Notre Processus en 4 Étapes</h2>
  </div>
  <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;">
    ${['Découverte & Brief', 'Stratégie & Design', 'Développement', 'Livraison & Suivi'].map((step, i) => `
    <div style="text-align:center;padding:28px 20px;background:#fff;border-radius:16px;border:1px solid #e5e7eb;">
      <div style="width:48px;height:48px;background:${primary};border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.2rem;margin:0 auto 16px;">${i+1}</div>
      <h3 style="font-size:1rem;font-weight:700;color:#1a1a2e;">${step}</h3>
    </div>`).join('')}
  </div>
</section>`;

    default:
      return '';
  }
}

function buildSiteHtmlV2({ businessName, color, content, contact, images = {}, templateType = 'landing' }) {
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
<title>${escapeHtml(c.seo_title || businessName + ' — ' + (c.tagline || ''))}</title>
<meta name="description" content="${escapeHtml(c.seo_description || c.hero_subtitle || '')}">
<meta property="og:title" content="${escapeHtml(c.og_title || c.tagline || businessName)}">
<meta property="og:description" content="${escapeHtml(c.seo_description || c.hero_subtitle || '')}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='${primary}'/><text y='.9em' font-size='70' x='50%' dominant-baseline='middle' text-anchor='middle'>${(c.services && c.services[0] && c.services[0].icon) ? c.services[0].icon : '✦'}</text></svg>">
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
.hero.has-img { background-size:cover; background-position:center; background-blend-mode:multiply; }
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
.faq-a { max-height:0; overflow:hidden; transition:max-height .5s cubic-bezier(0,1,0,1), padding .3s; padding:0 24px; color:var(--gray); font-size:.9rem; line-height:1.7; }
.faq-a.open { max-height:1000px; padding:0 24px 20px; transition:max-height 1s ease-in-out, padding .3s; }

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

/* MENU RESTAURANT */
.menu-card { display:flex; align-items:center; gap:16px; background:var(--white); border:1px solid #e5e7eb; border-radius:14px; padding:20px; }
.menu-icon { font-size:2.5rem; flex-shrink:0; }
.menu-info { flex:1; }
.menu-info h3 { font-size:1rem; font-weight:700; margin-bottom:6px; }
.menu-info p { font-size:.85rem; color:var(--gray); line-height:1.6; }
.menu-price { font-size:.9rem; font-weight:700; color:var(--primary); white-space:nowrap; }

/* BOUTIQUE PRODUITS */
.product-card { background:var(--white); border-radius:16px; overflow:hidden; border:1px solid #e5e7eb; transition:all .3s; }
.product-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.1); }
.product-img { height:160px; display:flex; align-items:center; justify-content:center; font-size:4rem; background:var(--light); }
.product-info { padding:20px; }
.product-info h3 { font-size:1rem; font-weight:700; margin-bottom:8px; }
.product-info p { font-size:.85rem; color:var(--gray); line-height:1.6; margin-bottom:12px; }
.product-price { display:inline-block; background:var(--primary); color:#fff; padding:6px 14px; border-radius:50px; font-size:.85rem; font-weight:700; }

/* REVEAL ANIMATION */
.reveal { opacity:1; transform:translateY(0); animation:fadeUp .6s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }

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
<section class="hero${images.hero ? ' has-img' : ''}" id="home" ${images.hero ? `style="background-image:linear-gradient(135deg,${primary}dd,${dark}cc),url('${images.hero}')"` : ''}>
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
    ${images.about ? `<div class="about-visual" style="background-image:url('${images.about}');background-size:cover;background-position:center;font-size:0;"></div>` : '<div class="about-visual">🏢</div>'}
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
${templateType !== 'restaurant' && templateType !== 'boutique' ? `
<section id="services">
  <div class="section-header text-center">
    <span class="section-label">Ce que nous faisons</span>
    <h2 class="section-title">${escapeHtml(c.services_title || 'Nos Services')}</h2>
  </div>
  <div class="services-grid">${services}</div>
</section>` : ''}

<!-- SECTION METIER -->
${buildSectorSection(templateType, c, color, primary)}

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

<!-- MAPS -->
${contact.address ? `
<section id="localisation" style="padding:0;">
  <div style="width:100%;height:350px;background:#e5e7eb;position:relative;overflow:hidden;">
    <iframe
      width="100%" height="350" style="border:0;" loading="lazy"
      src="https://maps.google.com/maps?q=${encodeURIComponent(contact.address || businessName + ' Togo')}&output=embed">
    </iframe>
  </div>
</section>` : ''}

<!-- FORMULAIRE CONTACT -->
<section id="formulaire" style="background:var(--light);padding:80px 5%;">
  <div style="max-width:600px;margin:0 auto;">
    <div class="section-header text-center">
      <span class="section-label">Écrivez-nous</span>
      <h2 class="section-title">Envoyez un message</h2>
    </div>
    <form id="contactForm" onsubmit="sendForm(event)" style="display:flex;flex-direction:column;gap:16px;">
      <input type="text" id="formName" placeholder="Votre nom complet" required
        style="padding:14px 18px;border:1px solid #e5e7eb;border-radius:12px;font-family:'Poppins',sans-serif;font-size:.95rem;outline:none;transition:border .2s;"
        onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'">
      <input type="tel" id="formPhone" placeholder="Votre numéro de téléphone"
        style="padding:14px 18px;border:1px solid #e5e7eb;border-radius:12px;font-family:'Poppins',sans-serif;font-size:.95rem;outline:none;transition:border .2s;"
        onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'">
      <textarea id="formMessage" placeholder="Votre message..." rows="4" required
        style="padding:14px 18px;border:1px solid #e5e7eb;border-radius:12px;font-family:'Poppins',sans-serif;font-size:.95rem;outline:none;resize:vertical;transition:border .2s;"
        onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
      <button type="submit" class="btn btn-white"
        style="background:${primary};color:#fff;justify-content:center;font-size:1rem;padding:16px;">
        📨 Envoyer le message
      </button>
      <div id="formSuccess" style="display:none;background:#dcfce7;color:#16a34a;padding:14px 18px;border-radius:12px;text-align:center;font-weight:600;">
        ✅ Message envoyé ! Nous vous répondrons dans les 24h.
      </div>
    </form>
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
  const nav = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  nav.classList.toggle('open');
  toggle.classList.toggle('active');
}
// Fermer menu au clic sur lien
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.querySelector('.nav-toggle').classList.remove('active');
  });
});

// FAQ
function toggleFaq(i) {
  const el = document.getElementById('faq-' + i);
  const icon = document.getElementById('icon-' + i);
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(e => { e.classList.remove('open'); });
  document.querySelectorAll('.faq-icon').forEach(e => { e.textContent = '+'; e.style.transform = 'rotate(0deg)'; });
  if (!isOpen) {
    el.classList.add('open');
    icon.textContent = '×';
    icon.style.transform = 'rotate(45deg)';
  }
}

// Reveal on scroll
// Animations CSS natives - pas besoin d'observer
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.animationDelay = (i * 0.1) + 's';
});

// Formulaire contact
function sendForm(e) {
  e.preventDefault();
  const name = document.getElementById('formName').value;
  const phone = document.getElementById('formPhone').value;
  const message = document.getElementById('formMessage').value;
  const email = '${escapeHtml(contact.email || '')}';
  const wa = '${wa}';
  
  if (wa) {
    const text = encodeURIComponent('Bonjour, je suis ' + name + (phone ? ' (' + phone + ')' : '') + '.\n\n' + message);
    window.open('https://wa.me/' + wa + '?text=' + text, '_blank');
  } else if (email) {
    window.location.href = 'mailto:' + email + '?subject=Message de ' + encodeURIComponent(name) + '&body=' + encodeURIComponent(message);
  }
  document.getElementById('formSuccess').style.display = 'block';
  document.getElementById('contactForm').reset();
}
</script>
</body>
</html>`;
}

module.exports = { buildSiteHtml: buildSiteHtmlV2 };
// redeploy Sat Jun 20 15:59:08 GMT 2026
