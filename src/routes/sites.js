const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { TEMPLATES } = require('../services/siteTemplates');
const { getAdminClient } = require('../supabaseClient');
const { generateSiteContent } = require('../services/groqClient');
const { buildSiteHtml } = require('../services/siteRenderer');

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
  const { template, businessName, niche, description, color, email, phone, address } = req.body;
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
    } catch(e) { console.log('Unsplash error:', e.message); }

    const html = buildSiteHtml({ businessName, color: color || '#4285f4', content, contact: { email, phone, address, siteId: data ? data.id : '' }, images, templateType: template });

    const baseSlug = generateSlug(businessName);
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const { data: existing } = await getAdminClient().from('sites').select('id').eq('slug', slug).single();
      if (!existing) break;
      attempt++;
      slug = baseSlug + '-' + attempt;
    }

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
      published: true
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
  res.render('sites/success', { site, publicUrl });
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
  res.send(buildHomePage(site));
});

router.get('/s/:slug/a-propos', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  res.send(buildAboutPage(site));
});

router.get('/s/:slug/services', async (req, res) => {
  const { data: site } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (!site) return res.status(404).send('Site introuvable');
  res.send(buildServicesPage(site));
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
  const { name, color, phone, email, address, desc, template, heroUrl, aboutUrl } = req.body;
  try {
    const content = await generateSiteContent({
      businessName: name,
      niche: template,
      description: desc,
      templateType: template
    });
    const html = buildSiteHtml({
      businessName: name,
      color: color || '#6366f1',
      content,
      contact: { email, phone, address },
      images: { hero: heroUrl || null, about: aboutUrl || null },
      contact: { email, phone, address, siteId: req.params.id },
      templateType: template
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
 
