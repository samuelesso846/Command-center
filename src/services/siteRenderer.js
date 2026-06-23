
'use strict';

// ============================================================
// COMMAND CENTER — siteRenderer.js v3.0 PREMIUM
// Hero image Unsplash | Logo SVG | Equipe photos | Multi-pages
// ============================================================

const SECTOR_CONFIG = {
  restaurant: {
    primaryColor: '#C0392B',
    secondaryColor: '#E67E22',
    accentColor: '#F39C12',
    textDark: '#1A0A00',
    heroQuery: 'restaurant food fine dining elegant',
    logoIcon: '🍽️',
    tagline: 'Une expérience culinaire inoubliable',
    statsLabel: ['Plats signature', 'Années d\'expérience', 'Clients satisfaits', 'Étoiles'],
  },
  boutique: {
    primaryColor: '#8E44AD',
    secondaryColor: '#9B59B6',
    accentColor: '#F1C40F',
    textDark: '#1A0010',
    heroQuery: 'fashion boutique luxury clothing store',
    logoIcon: '👗',
    tagline: 'Style & élégance à votre portée',
    statsLabel: ['Créations exclusives', 'Marques partenaires', 'Clientes fidèles', 'Ans de mode'],
  },
  avocat: {
    primaryColor: '#1A2A4A',
    secondaryColor: '#2C3E6A',
    accentColor: '#C9A84C',
    textDark: '#0A0F1E',
    heroQuery: 'law office justice legal professional',
    logoIcon: '⚖️',
    tagline: 'Votre défense, notre engagement',
    statsLabel: ['Dossiers traités', 'Années d\'expérience', 'Clients défendus', 'Taux de succès'],
  },
  coach: {
    primaryColor: '#16A085',
    secondaryColor: '#1ABC9C',
    accentColor: '#F39C12',
    textDark: '#001A15',
    heroQuery: 'coaching success motivation professional',
    logoIcon: '🎯',
    tagline: 'Libérez votre potentiel',
    statsLabel: ['Clients accompagnés', 'Heures de coaching', 'Programmes créés', 'Pays'],
  },
  agence: {
    primaryColor: '#2C3E50',
    secondaryColor: '#34495E',
    accentColor: '#3498DB',
    textDark: '#0A0F15',
    heroQuery: 'digital agency modern office team creative',
    logoIcon: '🚀',
    tagline: 'Votre croissance digitale commence ici',
    statsLabel: ['Projets livrés', 'Clients actifs', 'Experts dédiés', 'Pays couverts'],
  },
  portfolio: {
    primaryColor: '#212121',
    secondaryColor: '#424242',
    accentColor: '#FF5722',
    textDark: '#0A0A0A',
    heroQuery: 'creative portfolio design studio workspace',
    logoIcon: '✏️',
    tagline: 'Créativité sans limites',
    statsLabel: ['Projets réalisés', 'Prix remportés', 'Clients satisfaits', 'Années'],
  },
  landing: {
    primaryColor: '#1565C0',
    secondaryColor: '#1976D2',
    accentColor: '#FF6F00',
    textDark: '#000D1A',
    heroQuery: 'startup launch product modern technology',
    logoIcon: '💡',
    tagline: 'La solution dont vous avez besoin',
    statsLabel: ['Utilisateurs actifs', 'Fonctionnalités', 'Uptime', 'Support'],
  },
  blog: {
    primaryColor: '#2E7D32',
    secondaryColor: '#388E3C',
    accentColor: '#FDD835',
    textDark: '#001A00',
    heroQuery: 'blog writing content editorial desk',
    logoIcon: '📝',
    tagline: 'Des idées qui inspirent',
    statsLabel: ['Articles publiés', 'Lecteurs mensuels', 'Thématiques', 'Abonnés'],
  }
};

function generateLogoSVG(businessName, sector) {
  const cfg = SECTOR_CONFIG[sector] || SECTOR_CONFIG.agence;
  const initials = (businessName || "XX").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
    <defs>
      <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${cfg.primaryColor}"/>
        <stop offset="100%" style="stop-color:${cfg.accentColor}"/>
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="12" fill="url(#lg)"/>
    <text x="28" y="36" font-family="Georgia,serif" font-size="22" font-weight="700"
      fill="white" text-anchor="middle" letter-spacing="1">${initials}</text>
  </svg>`;
}

function generateTeamSection(teamMembers, primaryColor, accentColor) {
  if (!teamMembers || teamMembers.length === 0) return '';

  const cards = teamMembers.map(member => `
    <div class="team-card">
      <div class="team-photo-wrap">
        ${member.photo
          ? `<img src="${member.photo}" alt="${member.name}" class="team-photo" loading="lazy"/>`
          : `<div class="team-photo-placeholder" style="background:linear-gradient(135deg,${primaryColor},${accentColor})">
               <span>${(member.name||"XX").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
             </div>`
        }
      </div>
      <div class="team-info">
        <h3>${member.name}</h3>
        <p class="team-role" style="color:${accentColor}">${member.role || ''}</p>
        ${member.bio ? `<p class="team-bio">${member.bio}</p>` : ''}
      </div>
    </div>
  `).join('');

  return `
    <section class="section team-section">
      <div class="section-eyebrow">Notre Équipe</div>
      <h2 class="section-title">Des experts à votre service</h2>
      <div class="team-grid">${cards}</div>
    </section>
  `;
}

function generateFAQSection(faqs, accentColor) {
  if (!faqs || faqs.length === 0) return '';
  const items = faqs.map((faq, i) => `
    <details class="faq-item" ${i === 0 ? 'open' : ''}>
      <summary class="faq-q" style="--accent:${accentColor}">${faq.question}</summary>
      <div class="faq-a">${faq.answer}</div>
    </details>
  `).join('');
  return `
    <section class="section faq-section">
      <div class="section-eyebrow">FAQ</div>
      <h2 class="section-title">Questions fréquentes</h2>
      <div class="faq-list">${items}</div>
    </section>
  `;
}

function generateTestimonialsSection(testimonials, primaryColor, accentColor) {
  if (!testimonials || testimonials.length === 0) return '';
  const cards = testimonials.map(t => `
    <div class="testi-card">
      <div class="testi-stars" style="color:${accentColor}">★★★★★</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-author">
        <div class="testi-avatar" style="background:linear-gradient(135deg,${primaryColor},${accentColor})">
          ${(t.author||"XX").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
        </div>
        <div>
          <strong>${t.author}</strong>
          ${t.role ? `<span class="testi-role">${t.role}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
  return `
    <section class="section testi-section">
      <div class="section-eyebrow">Témoignages</div>
      <h2 class="section-title">Ce que disent nos clients</h2>
      <div class="testi-grid">${cards}</div>
    </section>
  `;
}

function generateServicesSection(services, primaryColor, accentColor) {
  if (!services || services.length === 0) return '';
  const icons = ['⚡','🎯','🔒','📈','💼','🌟','🛡️','✅'];
  const cards = services.map((s, i) => `
    <div class="service-card" style="--accent:${accentColor};--primary:${primaryColor}">
      <div class="service-icon">${icons[i % icons.length]}</div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>
  `).join('');
  return `
    <section class="section services-section">
      <div class="section-eyebrow">Services</div>
      <h2 class="section-title">Ce que nous proposons</h2>
      <div class="services-grid">${cards}</div>
    </section>
  `;
}

function generateStatsSection(stats, statLabels, primaryColor, accentColor) {
  if (!stats || stats.length === 0) return '';
  const items = stats.map((s, i) => `
    <div class="stat-item">
      <div class="stat-number" style="color:${accentColor}" data-target="${s.value}">${s.value}</div>
      <div class="stat-label">${statLabels[i] || s.label || ''}</div>
    </div>
  `).join('');
  return `
    <section class="stats-band" style="background:linear-gradient(135deg,${primaryColor} 0%,${primaryColor}ee 100%)">
      <div class="stats-inner">${items}</div>
    </section>
  `;
}

function renderPremiumSite(data) {
  const sector = data.sector || 'agence';
  const cfg = SECTOR_CONFIG[sector] || SECTOR_CONFIG.agence;
  const {
    primaryColor, secondaryColor, accentColor, textDark, heroQuery
  } = cfg;

  const businessName = data.businessName || 'Mon Entreprise';
  const heroImage = data.heroImage || `https://source.unsplash.com/1600x900/?${encodeURIComponent(heroQuery)}`;
  const logoSVG = generateLogoSVG(businessName, sector);
  const whatsappNumber = (data.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=Bonjour, je vous contacte depuis votre site web.`
    : '#contact';

  const heroTitle = data.heroTitle || businessName;
  const heroSubtitle = data.heroSubtitle || cfg.tagline;

  const servicesHTML = generateServicesSection(data.services, primaryColor, accentColor);
  const statsHTML = generateStatsSection(data.stats, cfg.statsLabel, primaryColor, accentColor);
  const teamHTML = generateTeamSection(data.team, primaryColor, accentColor);
  const testiHTML = generateTestimonialsSection(data.testimonials, primaryColor, accentColor);
  const faqHTML = generateFAQSection(data.faqs, accentColor);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${businessName}</title>
  <meta name="description" content="${heroSubtitle}"/>
  <meta property="og:title" content="${businessName}"/>
  <meta property="og:description" content="${heroSubtitle}"/>
  <meta property="og:image" content="${heroImage}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor};
      --text-dark: ${textDark};
      --text-body: #2d2d2d;
      --text-light: #666;
      --bg: #FAFAFA;
      --bg-alt: #F3F4F6;
      --white: #ffffff;
      --radius: 16px;
      --shadow: 0 8px 40px rgba(0,0,0,0.10);
      --shadow-lg: 0 20px 60px rgba(0,0,0,0.15);
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'Inter', system-ui, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-body);
      color: var(--text-body);
      background: var(--bg);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* ── NAV ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5%;
      height: 70px;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      box-shadow: 0 2px 20px rgba(0,0,0,0.08);
    }
    .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .nav-logo svg { border-radius: 10px; }
    .nav-brand { font-family: var(--font-display); font-size: 1.1rem; color: var(--primary); font-weight: 700; }
    .nav-links { display: flex; gap: 28px; list-style: none; }
    .nav-links a { text-decoration: none; color: var(--text-body); font-size: 0.88rem; font-weight: 500; transition: color .2s; }
    .nav-links a:hover { color: var(--accent); }
    .nav-cta {
      background: var(--accent); color: var(--white);
      padding: 9px 22px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
      text-decoration: none; transition: opacity .2s; white-space: nowrap;
    }
    .nav-cta:hover { opacity: 0.85; }
    .burger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; }
    .burger span { display: block; width: 24px; height: 2px; background: var(--primary); border-radius: 2px; transition: .3s; }

    /* ── HERO ── */
    .hero {
      position: relative; min-height: 100vh;
      display: flex; align-items: center;
      padding: 70px 5% 0;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0; z-index: 0;
      background-image: url('${heroImage}');
      background-size: cover; background-position: center;
    }
    .hero-overlay {
      position: absolute; inset: 0; z-index: 1;
      background: linear-gradient(135deg,
        ${primaryColor}F0 0%,
        ${primaryColor}C0 40%,
        ${primaryColor}80 70%,
        transparent 100%);
    }
    .hero-content {
      position: relative; z-index: 2;
      max-width: 680px;
      color: var(--white);
    }
    .hero-badge {
      display: inline-block;
      background: ${accentColor}30;
      border: 1px solid ${accentColor}80;
      color: ${accentColor};
      padding: 6px 16px; border-radius: 50px;
      font-size: 0.8rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
      margin-bottom: 24px;
    }
    .hero h1 {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5vw, 4rem);
      font-weight: 900; line-height: 1.1;
      margin-bottom: 20px;
      text-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }
    .hero h1 span { color: ${accentColor}; }
    .hero-sub {
      font-size: clamp(1rem, 2vw, 1.2rem);
      opacity: 0.9; margin-bottom: 36px;
      max-width: 520px; line-height: 1.7;
    }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: ${accentColor}; color: ${textDark};
      padding: 14px 30px; border-radius: 10px;
      font-weight: 700; font-size: 0.95rem;
      text-decoration: none; transition: transform .2s, box-shadow .2s;
      box-shadow: 0 4px 20px ${accentColor}60;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${accentColor}80; }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.6);
      color: white; padding: 14px 30px; border-radius: 10px;
      font-weight: 600; font-size: 0.95rem;
      text-decoration: none; transition: background .2s;
      backdrop-filter: blur(4px);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.25); }
    .hero-scroll {
      position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
      z-index: 2; text-align: center; color: rgba(255,255,255,0.7);
      font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase;
    }
    .hero-scroll-arrow {
      display: block; margin: 8px auto 0;
      width: 24px; height: 24px;
      border-right: 2px solid rgba(255,255,255,0.7);
      border-bottom: 2px solid rgba(255,255,255,0.7);
      transform: rotate(45deg);
      animation: scrollBounce 1.5s ease infinite;
    }
    @keyframes scrollBounce {
      0%,100% { transform: rotate(45deg) translateY(0); }
      50% { transform: rotate(45deg) translateY(6px); }
    }

    /* ── STATS BAND ── */
    .stats-band { padding: 52px 5%; }
    .stats-inner {
      display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;
      max-width: 900px; margin: 0 auto;
    }
    .stat-item {
      flex: 1; min-width: 140px;
      text-align: center; padding: 24px 16px;
      background: rgba(255,255,255,0.12);
      border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
    }
    .stat-number {
      font-family: var(--font-display);
      font-size: 2.4rem; font-weight: 900;
      line-height: 1;
    }
    .stat-label {
      font-size: 0.8rem; color: rgba(255,255,255,0.8);
      margin-top: 6px; font-weight: 500;
    }

    /* ── SECTIONS ── */
    .section { padding: 80px 5%; max-width: 1100px; margin: 0 auto; }
    .section-eyebrow {
      font-size: 0.75rem; font-weight: 700; letter-spacing: 2.5px;
      text-transform: uppercase; color: var(--accent);
      margin-bottom: 12px;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      color: var(--text-dark); margin-bottom: 48px;
      font-weight: 700; max-width: 600px; line-height: 1.2;
    }

    /* ── SERVICES ── */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .service-card {
      background: var(--white);
      border-radius: var(--radius);
      padding: 32px;
      box-shadow: var(--shadow);
      transition: transform .3s, box-shadow .3s;
      border-top: 3px solid var(--accent);
    }
    .service-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
    .service-icon { font-size: 2rem; margin-bottom: 16px; }
    .service-card h3 {
      font-family: var(--font-display); font-size: 1.2rem;
      color: var(--primary); margin-bottom: 10px;
    }
    .service-card p { font-size: 0.9rem; color: var(--text-light); line-height: 1.7; }

    /* ── TEAM ── */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 28px;
    }
    .team-card {
      background: var(--white);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      text-align: center;
      transition: transform .3s;
    }
    .team-card:hover { transform: translateY(-4px); }
    .team-photo-wrap { width: 100%; height: 220px; overflow: hidden; }
    .team-photo { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
    .team-card:hover .team-photo { transform: scale(1.05); }
    .team-photo-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
    }
    .team-photo-placeholder span {
      font-size: 3rem; font-weight: 700; color: white;
      font-family: var(--font-display);
    }
    .team-info { padding: 20px 16px 24px; }
    .team-info h3 { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 4px; }
    .team-role { font-size: 0.82rem; font-weight: 600; margin-bottom: 8px; }
    .team-bio { font-size: 0.85rem; color: var(--text-light); line-height: 1.6; }

    /* ── TESTIMONIALS ── */
    .testi-section { background: var(--bg-alt); padding: 80px 5%; max-width: 100%; }
    .testi-section .section-title, .testi-section .section-eyebrow {
      max-width: 1100px; margin-left: auto; margin-right: auto; display: block;
    }
    .testi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px; max-width: 1100px; margin: 0 auto;
    }
    .testi-card {
      background: var(--white); border-radius: var(--radius);
      padding: 28px; box-shadow: var(--shadow);
    }
    .testi-stars { font-size: 1.1rem; margin-bottom: 14px; }
    .testi-text { font-size: 0.95rem; line-height: 1.7; color: var(--text-body); margin-bottom: 20px; font-style: italic; }
    .testi-author { display: flex; align-items: center; gap: 12px; }
    .testi-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
    }
    .testi-author strong { display: block; font-size: 0.9rem; }
    .testi-role { font-size: 0.78rem; color: var(--text-light); }

    /* ── FAQ ── */
    .faq-list { max-width: 740px; }
    .faq-item {
      border-bottom: 1px solid #E5E7EB;
      margin-bottom: 4px;
    }
    .faq-q {
      list-style: none;
      padding: 20px 0; cursor: pointer;
      font-weight: 600; font-size: 0.95rem;
      color: var(--text-dark);
      display: flex; justify-content: space-between; align-items: center;
      gap: 12px;
    }
    .faq-q::-webkit-details-marker { display: none; }
    .faq-q::after {
      content: '+'; font-size: 1.3rem; color: var(--accent);
      transition: transform .3s; flex-shrink: 0;
    }
    details[open] .faq-q::after { content: '−'; }
    .faq-a { padding: 0 0 20px; font-size: 0.9rem; color: var(--text-light); line-height: 1.8; }

    /* ── CONTACT ── */
    .contact-section {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
      padding: 80px 5%; text-align: center; color: white;
    }
    .contact-section .section-eyebrow { color: ${accentColor}; }
    .contact-section .section-title { color: white; margin: 0 auto 16px; }
    .contact-section p { opacity: 0.85; margin-bottom: 36px; }
    .contact-grid {
      display: flex; justify-content: center; flex-wrap: wrap; gap: 16px;
      max-width: 700px; margin: 0 auto;
    }
    .contact-btn {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 28px; border-radius: 10px;
      font-weight: 600; font-size: 0.9rem;
      text-decoration: none; transition: transform .2s, opacity .2s;
    }
    .contact-btn:hover { transform: translateY(-2px); opacity: 0.9; }
    .contact-btn.whatsapp { background: #25D366; color: white; }
    .contact-btn.phone { background: white; color: var(--primary); }
    .contact-btn.email { background: rgba(255,255,255,0.15); color: white; border: 2px solid rgba(255,255,255,0.5); }

    /* ── FOOTER ── */
    footer {
      background: ${textDark}; color: rgba(255,255,255,0.7);
      text-align: center; padding: 32px 5%;
      font-size: 0.82rem;
    }
    footer strong { color: white; }
    footer a { color: ${accentColor}; text-decoration: none; }

    /* ── WHATSAPP FLOAT ── */
    .wa-float {
      position: fixed; bottom: 24px; right: 24px; z-index: 200;
      width: 56px; height: 56px; border-radius: 50%;
      background: #25D366;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(37,211,102,0.5);
      text-decoration: none; font-size: 1.5rem;
      animation: waPulse 2s ease infinite;
    }
    @keyframes waPulse {
      0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,0.5); }
      50% { box-shadow: 0 4px 30px rgba(37,211,102,0.8); }
    }

    /* ── REVEAL ANIMATIONS ── */
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity .6s ease, transform .6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* ── MOBILE ── */
    @media (max-width: 768px) {
      .nav-links { display: none; flex-direction: column; position: absolute; top: 70px; left: 0; right: 0; background: white; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
      .nav-links.open { display: flex; }
      .burger { display: flex; }
      .nav-cta { display: none; }
      .hero { min-height: 90vh; }
      .hero h1 { font-size: 2rem; }
      .stats-inner { gap: 12px; }
      .stat-item { min-width: 120px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal { transition: none; }
      .wa-float { animation: none; }
    }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav>
    <a href="#" class="nav-logo">
      ${logoSVG}
      <span class="nav-brand">${businessName}</span>
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="#services">Services</a></li>
      ${data.team && data.team.length > 0 ? '<li><a href="#equipe">Équipe</a></li>' : ''}
      ${data.testimonials && data.testimonials.length > 0 ? '<li><a href="#avis">Avis</a></li>' : ''}
      <li><a href="#contact">Contact</a></li>
    </ul>
    <a href="${whatsappUrl}" class="nav-cta" target="_blank">📞 Nous contacter</a>
    <button class="burger" id="burgerBtn" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <!-- HERO -->
  <section class="hero" id="top">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-badge">${cfg.logoIcon} ${sector.charAt(0).toUpperCase() + sector.slice(1)}</div>
      <h1>${(() => { const t = (heroTitle || businessName || 'Bienvenue').trim(); const w = t.split(' '); return w.length === 1 ? '<span>' + t + '</span>' : w.slice(0,-1).join(' ') + ' <span>' + w[w.length-1] + '</span>'; })()}</h1>
      <p class="hero-sub">${heroSubtitle}</p>
      <div class="hero-actions">
        <a href="${whatsappUrl}" class="btn-primary" target="_blank">💬 Nous contacter</a>
        <a href="#services" class="btn-secondary">Découvrir →</a>
      </div>
    </div>
    <div class="hero-scroll">Défiler<span class="hero-scroll-arrow"></span></div>
  </section>

  <!-- STATS -->
  ${statsHTML}

  <!-- SERVICES -->
  <div id="services" class="reveal">${servicesHTML}</div>

  <!-- TEAM -->
  ${data.team && data.team.length > 0 ? `<div id="equipe" class="reveal">${teamHTML}</div>` : ''}

  <!-- TESTIMONIALS -->
  ${data.testimonials && data.testimonials.length > 0 ? `<div id="avis" class="reveal">${testiHTML}</div>` : ''}

  <!-- FAQ -->
  ${data.faqs && data.faqs.length > 0 ? `<div class="reveal">${faqHTML}</div>` : ''}

  <!-- CONTACT -->
  <section class="contact-section reveal" id="contact">
    <div class="section-eyebrow">Contact</div>
    <h2 class="section-title">Prêt à collaborer ?</h2>
    <p>Contactez-nous dès aujourd'hui pour discuter de votre projet.</p>
    <div class="contact-grid">
      ${whatsappNumber ? `<a href="${whatsappUrl}" class="contact-btn whatsapp" target="_blank">📱 WhatsApp</a>` : ''}
      ${data.phone ? `<a href="tel:${data.phone}" class="contact-btn phone">📞 ${data.phone}</a>` : ''}
      ${data.email ? `<a href="mailto:${data.email}" class="contact-btn email">✉️ ${data.email}</a>` : ''}
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p>© ${new Date().getFullYear()} <strong>${businessName}</strong> · Site créé avec <a href="https://command-center-s25s.onrender.com">Command Center</a></p>
  </footer>

  <!-- WhatsApp Flottant -->
  ${whatsappNumber ? `<a href="${whatsappUrl}" class="wa-float" target="_blank" aria-label="WhatsApp">💬</a>` : ''}

  <script>
    // Burger menu
    document.addEventListener('DOMContentLoaded', function() {
      var btn = document.getElementById('burgerBtn');
      var nav = document.getElementById('navLinks');
      if (btn && nav) {
        btn.addEventListener('click', function() {
          nav.classList.toggle('open');
        });
      }

      // Reveal on scroll
      var reveals = document.querySelectorAll('.reveal');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function(el) { observer.observe(el); });

      // Counter animation
      var counters = document.querySelectorAll('.stat-number');
      counters.forEach(function(c) {
        var raw = c.textContent.replace(/[^0-9]/g, '');
        if (!raw) return;
        var target = parseInt(raw);
        var suffix = c.textContent.replace(/[0-9]/g, '');
        var start = 0;
        var step = Math.ceil(target / 40);
        var timer = setInterval(function() {
          start = Math.min(start + step, target);
          c.textContent = start + suffix;
          if (start >= target) clearInterval(timer);
        }, 40);
      });
    });
  </script>
</body>
</html>`;
}

module.exports = { renderPremiumSite, generateLogoSVG, SECTOR_CONFIG };
