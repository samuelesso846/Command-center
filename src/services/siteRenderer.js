function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSiteHtml({ businessName, color, content, contact }) {
  const services = (content.services || []).map(s => `
    <div class="card"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></div>`).join('');

  const gallery = (content.gallery_captions || []).map(cap => `
    <div><div class="gallery-placeholder">📷</div><p class="gallery-caption">${escapeHtml(cap)}</p></div>`).join('');

  const testimonials = (content.testimonials || []).map(t => `
    <div class="testimonial"><p>"${escapeHtml(t.text)}"</p><span>— ${escapeHtml(t.name)}</span></div>`).join('');

  const faq = (content.faq || []).map(f => `
    <div class="faq-item"><h4>${escapeHtml(f.question)}</h4><p>${escapeHtml(f.answer)}</p></div>`).join('');

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(businessName)}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,Arial,sans-serif; color:#1f2937; line-height:1.5; }
.hero { background:${color}; color:#fff; text-align:center; padding:80px 24px; }
.hero h1 { font-size:2.4rem; margin-bottom:16px; }
section { padding:60px 24px; max-width:1000px; margin:0 auto; }
h2 { text-align:center; font-size:1.8rem; margin-bottom:32px; }
.about-section { max-width:700px; }
.grid-3 { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:24px; }
.services-bg, .testimonials-bg { background:#f8f9fa; }
.gallery-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; }
.gallery-placeholder { background:#e5e7eb; height:140px; display:flex; align-items:center; justify-content:center; font-size:2.5rem; border-radius:8px; }
.gallery-caption { text-align:center; margin-top:8px; font-size:.9rem; color:#6b7280; }
.testimonial { background:#fff; border-radius:12px; padding:20px; font-style:italic; }
.testimonial span { display:block; margin-top:10px; font-weight:600; color:${color}; font-style:normal; }
.faq-item { border-bottom:1px solid #e5e7eb; padding:16px 0; }
.contact { background:${color}; color:#fff; text-align:center; padding:50px 24px; }
</style></head>
<body>
<div class="hero"><h1>${escapeHtml(businessName)}</h1><p>${escapeHtml(content.tagline || '')}</p></div>
<section class="about-section"><h2>À Propos</h2><p>${escapeHtml(content.about || '')}</p></section>
<section class="services-bg"><h2>Nos Services</h2><div class="grid-3">${services}</div></section>
<section><h2>Galerie</h2><div class="gallery-grid">${gallery}</div></section>
<section class="testimonials-bg"><h2>Témoignages</h2><div class="grid-3">${testimonials}</div></section>
<section><h2>FAQ</h2>${faq}</section>
<div class="contact"><h2 style="color:#fff">Contactez-nous</h2><p>${escapeHtml(contact.email || '')} ${contact.phone ? '| ' + escapeHtml(contact.phone) : ''}</p></div>
</body></html>`;
}

module.exports = { buildSiteHtml };
