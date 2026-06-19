const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { TEMPLATES } = require('../services/siteTemplates');
const { generateSiteContent } = require('../services/groqClient');
const { buildSiteHtml } = require('../services/siteRenderer');

router.get('/sites/new', requireAuth, (req, res) => {
  res.render('sites/new', { templates: TEMPLATES, error: null });
});

router.post('/sites/generate', requireAuth, async (req, res) => {
  const { template, businessName, niche, description, color, email, phone } = req.body;
  try {
    const content = await generateSiteContent({ businessName, niche, description, templateType: template });
    const html = buildSiteHtml({ businessName, color: color || '#4285f4', content, contact: { email, phone } });

    const { data, error } = await req.supabase.from('sites').insert({
      agency_id: req.agencyId,
      template,
      site_name: businessName,
      tagline: content.tagline,
      colors: { primary: color || '#4285f4' },
      sections: { services: true, gallery: true, testimonials: true, faq: true },
      content,
      html_output: html
    }).select().single();

    if (error) throw error;
    res.redirect(`/sites/${data.id}/preview`);
  } catch (err) {
    console.error(err);
    res.render('sites/new', { templates: TEMPLATES, error: 'Erreur génération : ' + err.message });
  }
});

router.get('/sites', requireAuth, async (req, res) => {
  const { data: sites, error: sitesError } = await req.supabase
    .from('sites')
    .select('*')
    .eq('agency_id', req.agencyId)
    .order('created_at', { ascending: false });
  if (sitesError) console.error('Erreur sites:', sitesError);
  res.render('sites/list', { sites: sites || [] });
});

router.get('/sites/:id/preview', requireAuth, async (req, res) => {
  const { data: site, error } = await req.supabase.from('sites').select('*').eq('id', req.params.id).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  res.send(site.html_output);
});

router.get('/sites/:id/download', requireAuth, async (req, res) => {
  const { data: site, error } = await req.supabase.from('sites').select('*').eq('id', req.params.id).single();
  if (error || !site) return res.status(404).send('Site introuvable');
  res.setHeader('Content-Disposition', `attachment; filename="${site.site_name.replace(/\s+/g,'-')}.html"`);
  res.setHeader('Content-Type', 'text/html');
  res.send(site.html_output);
});

module.exports = router;
