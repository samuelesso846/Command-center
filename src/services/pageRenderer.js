function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSharedAssets(site, currentPage = 'home') {
  const c = site.content || {};
  const primary = (site.colors && site.colors.primary) || '#4285f4';
  const slug = site.slug;
  const baseUrl = `/s/${slug}`;

  const nav = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(site.site_name)} — ${escapeHtml(c.seo_title || c.tagline || '')}</title>
<meta name="description" content="${escapeHtml(c.seo_description || '')}">
<meta property="og:title" content="${escapeHtml(c.og_title || site.site_name)}">
<meta property="og:description" content="${escapeHtml(c.seo_description || '')}">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --primary: ${primary}; --text: #1a1a2e; --gray: #6b7280; --light: #f8fafc; --white: #ffffff; --radius: 16px; }
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { font-family:'Poppins',sans-serif; color:var(--text); background:var(--white); }
a { text-decoration:none; color:inherit; }

/* NAVBAR */
nav { position:fixed; top:0; left:0; right:0; z-index:1000; height:68px; background:rgba(255,255,255,0.97); backdrop-filter:blur(12px); border-bottom:1px solid rgba(0,0,0,0.06); display:flex; align-items:center; justify-content:space-between; padding:0 5%; box-shadow:0 2px 20px rgba(0,0,0,0.06); }
.nav-logo { font-size:1.2rem; font-weight:800; color:var(--primary); letter-spacing:-0.5px; }
.nav-links { display:flex; gap:28px; list-style:none; }
.nav-links a { font-size:.875rem; font-weight:500; color:var(--text); transition:color .2s; padding:4px 0; border-bottom:2px solid transparent; }
.nav-links a:hover, .nav-links a.active { color:var(--primary); border-bottom-color:var(--primary); }
.nav-cta { background:var(--primary); color:#fff !important; padding:10px 20px; border-radius:50px; font-weight:600 !important; border-bottom:none !important; }
.nav-toggle { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
.nav-toggle span { width:24px; height:2px; background:var(--text); border-radius:2px; transition:.3s; display:block; }
@media(max-width:768px) {
  .nav-links { display:none; position:fixed; top:68px; left:0; right:0; background:#fff; flex-direction:column; padding:20px; gap:12px; box-shadow:0 8px 24px rgba(0,0,0,0.1); z-index:999; }
  .nav-links.open { display:flex; }
  .nav-toggle { display:flex; }
}

/* FOOTER */
footer { background:#0f172a; color:rgba(255,255,255,0.6); padding:48px 5% 24px; }
.footer-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:32px; margin-bottom:32px; }
.footer-brand h3 { font-size:1.1rem; font-weight:800; color:#fff; margin-bottom:8px; }
.footer-brand p { font-size:.82rem; line-height:1.7; }
.footer-links h4 { font-size:.8rem; font-weight:700; color:#fff; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
.footer-links ul { list-style:none; }
.footer-links ul li { margin-bottom:8px; }
.footer-links ul li a { font-size:.82rem; color:rgba(255,255,255,0.5); transition:color .2s; }
.footer-links ul li a:hover { color:#fff; }
.footer-bottom { border-top:1px solid rgba(255,255,255,0.08); padding-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
.footer-bottom p { font-size:.75rem; }
@media(max-width:768px) { .footer-grid { grid-template-columns:1fr; gap:24px; } .footer-bottom { flex-direction:column; text-align:center; } }

/* UTILS */
.container { max-width:1100px; margin:0 auto; padding:0 5%; }
.page-content { padding-top:68px; }
.section { padding:72px 0; }
.section-label { display:inline-block; color:var(--primary); font-size:.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }
.section-title { font-size:clamp(1.6rem,3vw,2.2rem); font-weight:800; color:var(--text); line-height:1.2; margin-bottom:14px; letter-spacing:-0.5px; }
.section-sub { color:var(--gray); font-size:.95rem; line-height:1.7; max-width:560px; }
.btn { display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:50px; font-weight:600; font-size:.9rem; transition:all .3s; cursor:pointer; border:none; }
.btn-primary { background:var(--primary); color:#fff; }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,0,0,0.15); }
.btn-outline { background:transparent; color:var(--primary); border:2px solid var(--primary); }
.grid-3 { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:var(--radius); padding:28px; transition:all .3s; }
.card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.08); }

/* WA FLOAT */
.wa-float { position:fixed; bottom:24px; right:24px; z-index:999; width:56px; height:56px; background:#25d366; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.6rem; box-shadow:0 4px 16px rgba(37,211,102,0.4); transition:transform .3s; }
.wa-float:hover { transform:scale(1.1); }
</style>
</head>
<body>
<nav id="navbar">
  <a href="${baseUrl}" class="nav-logo">${escapeHtml(site.site_name)}</a>
  <ul class="nav-links" id="navLinks">
    <li><a href="${baseUrl}" class="${currentPage==='home'?'active':''}">Accueil</a></li>
    <li><a href="${baseUrl}/a-propos" class="${currentPage==='about'?'active':''}">À propos</a></li>
    <li><a href="${baseUrl}/services" class="${currentPage==='services'?'active':''}">Services</a></li>
    <li><a href="${baseUrl}/equipe" class="${currentPage==='team'?'active':''}">Équipe</a></li>
    <li><a href="${baseUrl}/contact" class="nav-cta ${currentPage==='contact'?'active':''}">Contact</a></li>
  </ul>
  <button class="nav-toggle" onclick="document.getElementById('navLinks').classList.toggle('open')">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="page-content">`;

  return { nav, primary, slug, baseUrl, c };
}

function buildFooter(site, wa) {
  const c = site.content || {};
  const baseUrl = `/s/${site.slug}`;
  return `
</div>
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h3>${escapeHtml(site.site_name)}</h3>
        <p>${escapeHtml(c.footer_description || '')}</p>
      </div>
      <div class="footer-links">
        <h4>Navigation</h4>
        <ul>
          <li><a href="${baseUrl}">Accueil</a></li>
          <li><a href="${baseUrl}/a-propos">À propos</a></li>
          <li><a href="${baseUrl}/services">Services</a></li>
          <li><a href="${baseUrl}/equipe">Équipe</a></li>
          <li><a href="${baseUrl}/contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Contact</h4>
        <ul>
          ${site.content && site.content.phone ? `<li><a href="tel:${escapeHtml(site.content.phone)}">📞 ${escapeHtml(site.content.phone)}</a></li>` : ''}
          ${site.content && site.content.email ? `<li><a href="mailto:${escapeHtml(site.content.email)}">✉️ ${escapeHtml(site.content.email)}</a></li>` : ''}
          ${site.content && site.content.address ? `<li>📍 ${escapeHtml(site.content.address)}</li>` : ''}
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} ${escapeHtml(site.site_name)} — Tous droits réservés</p>
      <p>Propulsé par Command Center™</p>
    </div>
  </div>
</footer>
${wa ? `<a href="https://wa.me/${wa}" class="wa-float" target="_blank">💬</a>` : ''}
<script>
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.1)' : '0 2px 20px rgba(0,0,0,0.06)';
});
</script>
</body>
</html>`;
}

// PAGE ACCUEIL
function buildHomePage(site, images = {}) {
  const { nav, primary, baseUrl, c } = buildSharedAssets(site, 'home');
  const wa = site.content && site.content.phone ? site.content.phone.replace(/\D/g,'') : '';
  const waMsg = encodeURIComponent(c.whatsapp_message || `Bonjour, je souhaite en savoir plus sur ${site.site_name}`);

  const stats = (c.stats || []).map(s => `
    <div style="text-align:center;">
      <div style="font-size:2rem;font-weight:900;color:${primary};">${escapeHtml(s.number)}</div>
      <div style="font-size:.8rem;color:#6b7280;margin-top:4px;">${escapeHtml(s.label)}</div>
    </div>`).join('');

  const services = (c.services || []).slice(0,3).map(s => `
    <div class="card">
      <div style="font-size:2rem;margin-bottom:14px;">${escapeHtml(s.icon||'✦')}</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:8px;">${escapeHtml(s.title)}</h3>
      <p style="color:#6b7280;font-size:.875rem;line-height:1.7;">${escapeHtml(s.description)}</p>
      ${s.price_hint ? `<div style="margin-top:12px;font-size:.8rem;font-weight:600;color:${primary};">${escapeHtml(s.price_hint)}</div>` : ''}
    </div>`).join('');

  const testimonials = (c.testimonials || []).slice(0,2).map(t => `
    <div class="card">
      <div style="color:#f59e0b;margin-bottom:10px;">★★★★★</div>
      <p style="font-style:italic;color:#6b7280;font-size:.9rem;line-height:1.7;margin-bottom:16px;">"${escapeHtml(t.text)}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:38px;height:38px;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">${escapeHtml((t.name||'A')[0])}</div>
        <div>
          <div style="font-weight:700;font-size:.875rem;">${escapeHtml(t.name)}</div>
          <div style="font-size:.75rem;color:#9ca3af;">${escapeHtml(t.role||'')}</div>
        </div>
      </div>
    </div>`).join('');

  return nav + `
  <!-- HERO -->
  <section style="min-height:100vh;background:linear-gradient(135deg,${primary},${primary}cc);display:flex;align-items:center;padding:100px 5% 60px;position:relative;overflow:hidden;${images.hero?`background-image:linear-gradient(135deg,${primary}ee,${primary}99),url('${images.hero}');background-size:cover;background-position:center;`:''}" >
    <div style="max-width:700px;position:relative;z-index:1;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);color:#fff;padding:6px 16px;border-radius:50px;font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:24px;">✦ Bienvenue</div>
      <h1 style="font-size:clamp(2rem,5vw,3.2rem);font-weight:900;color:#fff;line-height:1.15;margin-bottom:20px;letter-spacing:-1px;">${escapeHtml(c.tagline||site.site_name)}</h1>
      <p style="font-size:1.05rem;color:rgba(255,255,255,0.85);line-height:1.7;margin-bottom:36px;max-width:540px;">${escapeHtml(c.hero_subtitle||'')}</p>
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <a href="${baseUrl}/contact" class="btn btn-primary" style="background:#fff;color:${primary};">📞 ${escapeHtml(c.cta_primary||'Nous contacter')}</a>
        <a href="${baseUrl}/services" class="btn btn-outline" style="border-color:rgba(255,255,255,0.6);color:#fff;">${escapeHtml(c.cta_secondary||'Nos services')}</a>
      </div>
    </div>
  </section>

  <!-- STATS -->
  ${stats ? `<section style="background:#fff;padding:48px 5%;border-bottom:1px solid #e5e7eb;">
    <div class="container" style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">${stats}</div>
  </section>` : ''}

  <!-- SERVICES APERÇU -->
  <section class="section" style="background:#f8fafc;">
    <div class="container">
      <span class="section-label">Ce que nous faisons</span>
      <h2 class="section-title">${escapeHtml(c.services_title||'Nos Services')}</h2>
      <p class="section-sub" style="margin-bottom:40px;">${escapeHtml(c.hero_subtitle||'')}</p>
      <div class="grid-3">${services}</div>
      <div style="text-align:center;margin-top:36px;">
        <a href="${baseUrl}/services" class="btn btn-primary">Voir tous nos services →</a>
      </div>
    </div>
  </section>

  <!-- TÉMOIGNAGES -->
  ${testimonials ? `<section class="section">
    <div class="container">
      <span class="section-label">Ils nous font confiance</span>
      <h2 class="section-title">Ce que disent nos clients</h2>
      <div class="grid-3" style="margin-top:32px;">${testimonials}</div>
    </div>
  </section>` : ''}

  <!-- CTA FINAL -->
  <section style="background:${primary};padding:72px 5%;text-align:center;">
    <h2 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;">Prêt à démarrer ?</h2>
    <p style="color:rgba(255,255,255,0.8);margin-bottom:32px;font-size:1rem;">Contactez-nous aujourd'hui et obtenez une réponse rapide.</p>
    <a href="${baseUrl}/contact" class="btn" style="background:#fff;color:${primary};font-size:1rem;padding:15px 36px;">🚀 Nous contacter</a>
  </section>
` + buildFooter(site, wa);
}

// PAGE À PROPOS
function buildAboutPage(site, images = {}) {
  const { nav, primary, baseUrl, c } = buildSharedAssets(site, 'about');
  const wa = site.content && site.content.phone ? site.content.phone.replace(/\D/g,'') : '';

  return nav + `
  <section class="section" style="padding-top:100px;">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
        <div>
          ${images.about
            ? `<img src="${images.about}" alt="${escapeHtml(site.site_name)}" style="width:100%;border-radius:20px;object-fit:cover;height:400px;">`
            : `<div style="background:linear-gradient(135deg,${primary},${primary}99);border-radius:20px;height:400px;display:flex;align-items:center;justify-content:center;font-size:5rem;">🏢</div>`}
        </div>
        <div>
          <span class="section-label">À propos de nous</span>
          <h1 class="section-title">${escapeHtml(c.about_title||'Notre histoire')}</h1>
          <p style="color:#6b7280;line-height:1.8;margin-bottom:24px;">${escapeHtml(c.about||'')}</p>
          ${c.about_highlight ? `
          <div style="display:flex;align-items:center;gap:12px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <div style="width:40px;height:40px;background:${primary};border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1rem;">⭐</div>
            <div>
              <div style="font-weight:700;font-size:.95rem;">${escapeHtml(c.about_highlight)}</div>
              <div style="font-size:.8rem;color:#9ca3af;">Notre engagement qualité</div>
            </div>
          </div>` : ''}
        </div>
      </div>
    </div>
  </section>

  <!-- VALEURS -->
  <section class="section" style="background:#f8fafc;">
    <div class="container">
      <span class="section-label">Nos valeurs</span>
      <h2 class="section-title">Ce qui nous distingue</h2>
      <div class="grid-3" style="margin-top:32px;">
        <div class="card"><div style="font-size:2rem;margin-bottom:12px;">🎯</div><h3 style="font-weight:700;margin-bottom:8px;">Excellence</h3><p style="color:#6b7280;font-size:.875rem;line-height:1.7;">Chaque projet est traité avec le plus haut niveau de professionnalisme.</p></div>
        <div class="card"><div style="font-size:2rem;margin-bottom:12px;">🤝</div><h3 style="font-weight:700;margin-bottom:8px;">Confiance</h3><p style="color:#6b7280;font-size:.875rem;line-height:1.7;">Une relation durable basée sur la transparence et l'honnêteté.</p></div>
        <div class="card"><div style="font-size:2rem;margin-bottom:12px;">⚡</div><h3 style="font-weight:700;margin-bottom:8px;">Réactivité</h3><p style="color:#6b7280;font-size:.875rem;line-height:1.7;">Des réponses rapides et des solutions adaptées à vos besoins.</p></div>
      </div>
    </div>
  </section>
` + buildFooter(site, wa);
}

// PAGE SERVICES
function buildServicesPage(site) {
  const { nav, primary, baseUrl, c } = buildSharedAssets(site, 'services');
  const wa = site.content && site.content.phone ? site.content.phone.replace(/\D/g,'') : '';

  const services = (c.services || []).map(s => `
    <div class="card" style="overflow:hidden;padding:0;">
      ${s.image ? `<div style="width:100%;height:200px;overflow:hidden;"><img src="${s.image}" alt="${escapeHtml(s.title)}" style="width:100%;height:100%;object-fit:cover;transition:transform .4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/></div>` : ''}
      <div style="padding:24px;display:flex;gap:16px;align-items:flex-start;">
        <div style="font-size:2rem;flex-shrink:0;">${escapeHtml(s.icon||'✦')}</div>
        <div>
          <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:8px;">${escapeHtml(s.title)}</h3>
          <p style="color:#6b7280;font-size:.875rem;line-height:1.7;margin-bottom:12px;">${escapeHtml(s.description)}</p>
          ${s.price_hint ? `<span style="display:inline-block;background:rgba(99,102,241,0.08);color:${primary};padding:4px 12px;border-radius:50px;font-size:.8rem;font-weight:600;">${escapeHtml(s.price_hint)}</span>` : ''}
        </div>
      </div>
    </div>`).join('');

  const faq = (c.faq || []).map((f,i) => `
    <details style="border:1px solid #e5e7eb;border-radius:12px;margin-bottom:10px;overflow:hidden;">
      <summary style="padding:18px 20px;cursor:pointer;font-weight:600;font-size:.95rem;list-style:none;display:flex;justify-content:space-between;align-items:center;">
        ${escapeHtml(f.question)} <span style="color:${primary};font-size:1.2rem;">+</span>
      </summary>
      <div style="padding:0 20px 18px;color:#6b7280;font-size:.875rem;line-height:1.7;">${escapeHtml(f.answer)}</div>
    </details>`).join('');

  return nav + `
  <section style="background:linear-gradient(135deg,#f8fafc,#fff);padding:100px 5% 60px;">
    <div class="container">
      <span class="section-label">Ce que nous offrons</span>
      <h1 class="section-title">${escapeHtml(c.services_title||'Nos Services')}</h1>
      <p class="section-sub">${escapeHtml(c.hero_subtitle||'')}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div style="display:flex;flex-direction:column;gap:20px;">${services}</div>
    </div>
  </section>

  ${faq ? `<section class="section" style="background:#f8fafc;">
    <div class="container">
      <span class="section-label">Questions fréquentes</span>
      <h2 class="section-title">Tout ce que vous voulez savoir</h2>
      <div style="margin-top:32px;max-width:720px;">${faq}</div>
    </div>
  </section>` : ''}

  <section style="background:${primary};padding:60px 5%;text-align:center;">
    <h2 style="font-size:1.6rem;font-weight:800;color:#fff;margin-bottom:16px;">Prêt à commencer ?</h2>
    <a href="${baseUrl}/contact" class="btn" style="background:#fff;color:${primary};">Nous contacter →</a>
  </section>
` + buildFooter(site, wa);
}

// PAGE ÉQUIPE
function buildTeamPage(site, team = []) {
  const { nav, primary, baseUrl, c } = buildSharedAssets(site, 'team');
  const wa = site.content && site.content.phone ? site.content.phone.replace(/\D/g,'') : '';

  const members = team.length > 0
    ? team.map(m => `
      <div class="card" style="text-align:center;">
        ${m.photo_url
          ? `<img src="${escapeHtml(m.photo_url)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 16px;display:block;border:4px solid ${primary};">`
          : `<div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,${primary},${primary}99);display:flex;align-items:center;justify-content:center;color:#fff;font-size:2.5rem;font-weight:700;margin:0 auto 16px;">${escapeHtml((m.name||'?')[0])}</div>`}
        <h3 style="font-weight:700;margin-bottom:4px;">${escapeHtml(m.name)}</h3>
        <p style="color:#9ca3af;font-size:.85rem;">${escapeHtml(m.role||'')}</p>
      </div>`).join('')
    : `<div style="text-align:center;padding:60px;color:#9ca3af;grid-column:1/-1;">
        <p style="font-size:3rem;margin-bottom:16px;">👥</p>
        <p>L'équipe sera présentée prochainement.</p>
      </div>`;

  return nav + `
  <section style="background:linear-gradient(135deg,#f8fafc,#fff);padding:100px 5% 60px;">
    <div class="container">
      <span class="section-label">Notre équipe</span>
      <h1 class="section-title">Les experts à votre service</h1>
      <p class="section-sub">Des professionnels dévoués qui mettent leur expertise à votre disposition.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid-3">${members}</div>
    </div>
  </section>
` + buildFooter(site, wa);
}

// PAGE CONTACT
function buildContactPage(site) {
  const { nav, primary, baseUrl, c } = buildSharedAssets(site, 'contact');
  const contact = site.content || {};
  const wa = contact.phone ? contact.phone.replace(/\D/g,'') : '';
  const waMsg = encodeURIComponent(c.whatsapp_message || `Bonjour, je souhaite en savoir plus sur ${site.site_name}`);
  const address = contact.address || '';

  return nav + `
  <section style="background:linear-gradient(135deg,#f8fafc,#fff);padding:100px 5% 60px;">
    <div class="container">
      <span class="section-label">Parlons de votre projet</span>
      <h1 class="section-title">Contactez-nous</h1>
      <p class="section-sub">Nous répondons dans les 24h. N'hésitez pas à nous joindre par téléphone, email ou WhatsApp.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;">
        
        <!-- INFOS CONTACT -->
        <div>
          <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:24px;">Nos coordonnées</h2>
          <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:32px;">
            ${contact.phone ? `<a href="tel:${escapeHtml(contact.phone)}" style="display:flex;align-items:center;gap:14px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb;text-decoration:none;color:inherit;"><span style="font-size:1.3rem;">📞</span><div><div style="font-size:.75rem;color:#9ca3af;margin-bottom:2px;">Téléphone</div><div style="font-weight:600;">${escapeHtml(contact.phone)}</div></div></a>` : ''}
            ${contact.email ? `<a href="mailto:${escapeHtml(contact.email)}" style="display:flex;align-items:center;gap:14px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb;text-decoration:none;color:inherit;"><span style="font-size:1.3rem;">✉️</span><div><div style="font-size:.75rem;color:#9ca3af;margin-bottom:2px;">Email</div><div style="font-weight:600;">${escapeHtml(contact.email)}</div></div></a>` : ''}
            ${wa ? `<a href="https://wa.me/${wa}?text=${waMsg}" target="_blank" style="display:flex;align-items:center;gap:14px;padding:16px;background:#dcfce7;border-radius:12px;border:1px solid #bbf7d0;text-decoration:none;color:inherit;"><span style="font-size:1.3rem;">💬</span><div><div style="font-size:.75rem;color:#9ca3af;margin-bottom:2px;">WhatsApp</div><div style="font-weight:600;color:#16a34a;">Écrire sur WhatsApp</div></div></a>` : ''}
            ${address ? `<div style="display:flex;align-items:center;gap:14px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb;"><span style="font-size:1.3rem;">📍</span><div><div style="font-size:.75rem;color:#9ca3af;margin-bottom:2px;">Adresse</div><div style="font-weight:600;">${escapeHtml(address)}</div></div></div>` : ''}
          </div>

          ${address ? `<div style="border-radius:16px;overflow:hidden;height:250px;">
            <iframe width="100%" height="250" style="border:0;" loading="lazy"
              src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed">
            </iframe>
          </div>` : ''}
        </div>

        <!-- FORMULAIRE -->
        <div>
          <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:24px;">Envoyez un message</h2>
          <form id="contactForm" onsubmit="sendMsg(event)" style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="font-size:.8rem;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Nom complet *</label>
              <input id="fName" required placeholder="Votre nom" style="width:100%;padding:12px 16px;border:1px solid #e5e7eb;border-radius:10px;font-family:'Poppins',sans-serif;font-size:.9rem;outline:none;transition:border .2s;" onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'">
            </div>
            <div>
              <label style="font-size:.8rem;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Téléphone</label>
              <input id="fPhone" placeholder="+228..." style="width:100%;padding:12px 16px;border:1px solid #e5e7eb;border-radius:10px;font-family:'Poppins',sans-serif;font-size:.9rem;outline:none;transition:border .2s;" onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'">
            </div>
            <div>
              <label style="font-size:.8rem;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Sujet</label>
              <input id="fSubject" placeholder="Objet de votre message" style="width:100%;padding:12px 16px;border:1px solid #e5e7eb;border-radius:10px;font-family:'Poppins',sans-serif;font-size:.9rem;outline:none;transition:border .2s;" onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'">
            </div>
            <div>
              <label style="font-size:.8rem;font-weight:600;color:#374151;display:block;margin-bottom:6px;">Message *</label>
              <textarea id="fMsg" required rows="4" placeholder="Votre message..." style="width:100%;padding:12px 16px;border:1px solid #e5e7eb;border-radius:10px;font-family:'Poppins',sans-serif;font-size:.9rem;outline:none;resize:vertical;transition:border .2s;" onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
            </div>
            <button type="submit" style="background:${primary};color:#fff;padding:14px;border-radius:50px;font-weight:700;font-size:.95rem;border:none;cursor:pointer;font-family:'Poppins',sans-serif;">
              📨 Envoyer le message
            </button>
            <div id="fSuccess" style="display:none;background:#dcfce7;color:#16a34a;padding:14px;border-radius:10px;text-align:center;font-weight:600;">
              ✅ Message envoyé ! Nous vous répondrons sous 24h.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <script>
  async function sendMsg(e) {
    e.preventDefault();
    const name = document.getElementById('fName').value;
    const phone = document.getElementById('fPhone').value;
    const message = document.getElementById('fMsg').value;
    const wa = '${wa}';
    const siteId = '${site.id || ''}';
    try { await fetch('/api/messages', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ site_id: siteId, name, phone, message }) }); } catch(e) {}
    if (wa) {
      const text = encodeURIComponent('Bonjour, je suis ' + name + (phone?' ('+phone+')':'') + '.\n\n' + message);
      window.open('https://wa.me/${wa}?text=' + text, '_blank');
    }
    document.getElementById('fSuccess').style.display = 'block';
    document.getElementById('contactForm').reset();
  }
  </script>
` + buildFooter(site, wa);
}

module.exports = { buildHomePage, buildAboutPage, buildServicesPage, buildTeamPage, buildContactPage };
