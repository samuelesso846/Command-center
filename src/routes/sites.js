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
    
    // Récupérer images Unsplash
    let images = { hero: null, about: null };
    try {
      const query = encodeURIComponent(niche || businessName);
      const uRes = await fetch('https://api.unsplash.com/photos/random?query=' + query + '&count=2&orientation=landscape', {
        headers: { 'Authorization': 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
      });
      const uData = await uRes.json();
      if (Array.isArray(uData) && uData.length >= 2) {
        images.hero = uData[0].urls.regular;
        images.about = uData[1].urls.regular;
      } else if (Array.isArray(uData) && uData.length === 1) {
        images.hero = uData[0].urls.regular;
      }
    } catch(e) { console.log('Unsplash error:', e.message); }

    const html = buildSiteHtml({ businessName, color: color || '#4285f4', content, contact: { email, phone, address }, images, templateType: template });

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

router.get('/s/:slug', async (req, res) => {
  const { data: site, error } = await getAdminClient().from('sites').select('*').eq('slug', req.params.slug).eq('published', true).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  res.send(site.html_output);
});

router.get('/sites/:id/download', requireAuth, async (req, res) => {
  const { data: site, error } = await getAdminClient().from('sites').select('*').eq('id', req.params.id).eq('agency_id', req.agencyId).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  res.setHeader('Content-Disposition', 'attachment; filename="' + site.site_name.replace(/\s+/g,'-') + '.html"');
  res.setHeader('Content-Type', 'text/html');
  res.send(site.html_output);
});

module.exports = router;
 
