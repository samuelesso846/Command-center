const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { TEMPLATES } = require('../services/siteTemplates');
const { getAdminClient } = require('../supabaseClient');
const { generateSiteContent } = require('../services/groqClient');
const { renderPremiumSite } = require('../services/siteRenderer');

function generateSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

router.get('/sites/new', requireAuth, (req, res) => {
  res.render('sites/new', { templates: TEMPLATES, error: null });
});

router.post('/sites/generate', requireAuth, async (req, res) => {
  const { template, businessName, niche, description, color, email, phone, address, horaires } = req.body;
  try {
    const content = await generateSiteContent({ businessName, niche, description, templateType: template });
    
    // Images Unsplash cohérentes par secteur
    const SECTOR_QUERIES = {
      restaurant: { hero: 'african restaurant interior elegant', about: 'african food cuisine delicious' },
      boutique: { hero: 'fashion boutique store modern', about: 'clothing fashion shopping retail' },
      avocat: { hero: 'law office professional modern', about: 'lawyer justice legal professional' },
      coach: { hero: 'coaching training motivation professional', about: 'personal development success' },
      agence: { hero: 'digital agency office team creative', about: 'web design creative team work' },
      portfolio: { hero: 'creative professional workspace design', about: 'portfolio creative work art' },
      landing: { hero: 'business professional success modern', about: 'team work office professional' },
      blog: { hero: 'writing blogging content creation', about: 'reading writing inspiration desk' }
    };
    
    let images = { hero: null, about: null };
    try {
      const queries = SECTOR_QUERIES[template] || { hero: niche || businessName, about: niche || 'business professional' };
      const [heroRes, aboutRes] = await Promise.all([
        fetch('https://api.unsplash.com/photos/random?query=' + encodeURIComponent(queries.hero) + '&orientation=landscape', {
          headers: { 'Authorization': 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
        }),
        fetch('https://api.unsplash.com/photos/random?query=' + encodeURIComponent(queries.about) + '&orientation=landscape', {
          headers: { 'Authorization': 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
        })
      ]);
      const [heroData, aboutData] = await Promise.all([heroRes.json(), aboutRes.json()]);
      if (heroData.urls) images.hero = heroData.urls.regular;
      if (aboutData.urls) images.about = aboutData.urls.regular;

      // Images par service
      if (content && content.services && content.services.length > 0) {
        const serviceImgPromises = content.services.map(s => {
          const q = s.image_query || s.title || niche || 'business professional';
          return fetch('https://api.unsplash.com/photos/random?query=' + encodeURIComponent(q) + '&orientation=landscape', {
            headers: { 'Authorization': 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
          }).then(r => r.json()).catch(() => null);
        });
        const serviceImgs = await Promise.all(serviceImgPromises);
        content.services = content.services.map((s, i) => ({
          ...s,
          image: (serviceImgs[i] && serviceImgs[i].urls) ? serviceImgs[i].urls.small : null
        }));
      }
    } catch(e) { console.log('Unsplash error:', e.message); }

    // Sauvegarder images + contact dans content pour pageRenderer
    if (content) {
      content.images = images;
      content.phone = phone || '';
      content.email = email || '';
      content.address = address || '';
      content.horaires = horaires || '';
    }

    const html = renderPremiumSite({
      businessName,
      sector: template,
      heroImage: images.hero || null,
      phone: phone || '',
      email: email || '',
      address: address || '',
      whatsapp: phone || '',
      services: (content && content.services) ? content.services : [],
      stats: (content && content.stats) ? content.stats : [],
      faqs: (content && (content.faqs || content.faq)) ? (content.faqs || content.faq) : [],
      testimonials: (content && content.testimonials) ? content.testimonials : [],
      team: (content && content.team) ? content.team : [],
      heroTitle: (content && content.heroTitle) ? content.heroTitle : businessName,
      heroSubtitle: (content && content.heroSubtitle) ? content.heroSubtitle : ''
    });

    const baseSlug = generateSlug(businessName);
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const { data: existing } = await getAdminClient().from('sites').select('id').eq('slug', slug).single();
      if (!existing) break;
      attempt++;
      slug = baseSlug + '-' + attempt;
    }

    const adminToken = crypto.randomBytes(32).toString('hex');

    const { data, error } = await getAdminClient().from('sites').insert({
      agency_id: req.agencyId,
      template,
      site_name: businessName,
      slug,
      tagline: content.tagline,
      colors: { primary: color || '#4285f4' },
      sections: { services: true, gallery: true, testimonials: true, faq: true },
      content,
      html_output: html,
      published: true,
      admin_token: adminToken
    }).select().single();

    if (error) throw error;
    res.redirect('/sites/' + data.id + '/success');
  } catch (err) {
    console.error(err);
    res.render('sites/new', { templates: TEMPLATES, error: 'Erreur generation : ' + err.message });
  }
});

router.get('/sites/:id/success', requireAuth, async (req, res) => {
  const { data: site, error } = await getAdminClient().from('sites').select('*').eq('id', req.params.id).eq('agency_id', req.agencyId).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  const baseUrl = process.env.APP_URL || 'https://' + req.headers.host;
  const publicUrl = baseUrl + '/s/' + site.slug;
  const adminUrl = site.admin_token
    ? (process.env.APP_URL || 'https://' + req.headers.host) + '/client-admin/' + site.admin_token
    : null;
  res.render('sites/success', { site, publicUrl, adminUrl });
});

router.get('/sites', requireAuth, async (req, res) => {
  const { data: sites, error: sitesError } = await getAdminClient()
    .from('sites')
    .select('*')
    .eq('agency_id', req.agencyId)
    .order('created_at', { ascending: false });
  if (sitesError) console.error('Erreur sites:', sitesError);
  res.render('sites/list', { sites: sites || [] });
});

router.get('/sites/:id/preview', requireAuth, async (req, res) => {
  const { data: site, error } = await getAdminClient().from('sites').select('*').eq('id', req.params.id).eq('agency_id', req.agencyId).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  res.send(site.html_output);
});
// FIN routes

const { buildHomePage, buildAboutPage, buildServicesPage, buildTeamPage, buildContactPage } = require('../services/pageRenderer');

router.get('/s/:slug', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  const images = (site.content && site.content.images) ? site.content.images : {};
  res.send(buildHomePage(site, images));
});

router.get('/s/:slug/a-propos', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  const images = (site.content && site.content.images) ? site.content.images : {};
  res.send(buildAboutPage(site, images));
});

router.get('/s/:slug/services', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  const images = (site.content && site.content.images) ? site.content.images : {};
  res.send(buildServicesPage(site, images));
});

router.get('/s/:slug/equipe', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  const { data: team } = await getAdminClient().from('site_team').select('*').eq('site_id', site.id).order('order_num');
  res.send(buildTeamPage(site, team || []));
});

router.get('/s/:slug/contact', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  res.send(buildContactPage(site));
});

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/sites/:id/upload-image', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { type } = req.body;
    const ext = req.file.mimetype.split('/')[1];
    const filePath = `sites/${req.params.id}/${type}-${Date.now()}.${ext}`;
    const { error } = await getAdminClient().storage
      .from('sites-images')
      .upload(filePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
    if (error) throw error;
    const { data } = getAdminClient().storage.from('sites-images').getPublicUrl(filePath);
    res.json({ url: data.publicUrl });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/sites/:id/update', requireAuth, async (req, res) => {
  const { name, color, phone, email, address, horaires, desc, template, heroUrl, aboutUrl } = req.body;
  try {
    const content = await generateSiteContent({
      businessName: name,
      niche: template,
      description: desc,
      templateType: template
    });
    const html = renderPremiumSite({
      businessName: name,
      sector: template,
      heroImage: heroUrl || null,
      phone, email, address,
      whatsapp: phone,
      services: content.services || [],
      stats: content.stats || [],
      faqs: content.faqs || content.faq || [],
      testimonials: content.testimonials || [],
      team: content.team || [],
      heroTitle: content.heroTitle || name,
      heroSubtitle: content.heroSubtitle || ''
    });
    const { error } = await getAdminClient().from('sites').update({
      site_name: name,
      colors: { primary: color },
      html_output: html,
      content
    }).eq('id', req.params.id).eq('agency_id', req.agencyId);
    if (error) throw error;
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/sites/:id/download', requireAuth, async (req, res) => {
  const { data: site, error } = await getAdminClient().from('sites').select('*').eq('id', req.params.id).eq('agency_id', req.agencyId).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  res.setHeader('Content-Disposition', 'attachment; filename="' + site.site_name.replace(/\s+/g,'-') + '.html"');
  res.setHeader('Content-Type', 'text/html');
  res.send(site.html_output);
});

module.exports = router;
 

// ── ESPACE ADMIN CLIENT ─────────────────────────────────────
router.get('/client-admin/:token', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites')
    .select('*').eq('admin_token', req.params.token).single();
  if (!site) return res.status(404).send('Lien invalide ou expiré');
  const publicUrl = '/s/' + site.slug;
  res.render('client-admin', { site, publicUrl });
});

router.post('/client-admin/:token/save', async (req, res) => {
  try {
    const { data: site } = await getAdminClient().from('sites')
      .select('*').eq('admin_token', req.params.token).single();
    if (!site) return res.status(404).json({ error: 'Token invalide' });
    const { name, phone, email, address, horaires } = req.body;
    const content = { ...(site.content || {}), phone, email, address, horaires };
    await getAdminClient().from('sites')
      .update({ site_name: name, content }).eq('id', site.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/client-admin/:token/messages', async (req, res) => {
  try {
    const { data: site } = await getAdminClient().from('sites')
      .select('id').eq('admin_token', req.params.token).single();
    if (!site) return res.status(404).json({ error: 'Token invalide' });
    const { data: messages } = await getAdminClient().from('site_messages')
      .select('*').eq('site_id', site.id).order('created_at', { ascending: false });
    res.json({ messages: messages || [] });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/client-admin/:token/publish', async (req, res) => {
  try {
    const { data: site } = await getAdminClient().from('sites')
      .select('*').eq('admin_token', req.params.token).single();
    if (!site) return res.status(404).json({ error: 'Token invalide' });
    if (!process.env.VERCEL_TOKEN) return res.status(500).json({ error: 'Vercel non configuré' });

    const { buildHomePage, buildAboutPage, buildServicesPage, buildTeamPage, buildContactPage } = require('../services/pageRenderer');
    const images = (site.content && site.content.images) ? site.content.images : {};
    if (typeof site.content === 'string') site.content = JSON.parse(site.content);

    const projectName = ('cc-' + site.slug).slice(0,52).replace(/[^a-z0-9-]/g,'-');
    const fixLinks = (html, depth=0) => {
      const p = depth === 0 ? '' : '../';
      return html
        .replace(/href="\/s\/[^/]+\/a-propos"/g, `href="${p}a-propos/"`)
        .replace(/href="\/s\/[^/]+\/services"/g, `href="${p}services/"`)
        .replace(/href="\/s\/[^/]+\/equipe"/g, `href="${p}equipe/"`)
        .replace(/href="\/s\/[^/]+\/contact"/g, `href="${p}contact/"`)
        .replace(/href="\/s\/[^\/]+"/g, `href="${p === '' ? './' : '../'}"`);
    };

    const pages = [
      { file: 'index.html', data: buildHomePage(site, images) },
      { file: 'a-propos/index.html', data: buildAboutPage(site, images) },
      { file: 'services/index.html', data: buildServicesPage(site, images) },
      { file: 'equipe/index.html', data: buildTeamPage(site) },
      { file: 'contact/index.html', data: buildContactPage(site) },
    ];

    const files = pages.map((p,i) => ({
      file: p.file,
      data: Buffer.from(fixLinks(p.data, i===0?0:1)).toString('base64'),
      encoding: 'base64'
    }));

    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.VERCEL_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName, files, projectSettings: { framework: null }, target: 'production' })
    });
    const deploy = await deployRes.json();
    if (deploy.error) throw new Error(deploy.error.message);
    const url = 'https://' + deploy.url;
    await getAdminClient().from('sites').update({ custom_domain: url }).eq('id', site.id);
    res.json({ success: true, url });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
