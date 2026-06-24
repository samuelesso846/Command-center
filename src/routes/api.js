const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// CLIENTS
router.get('/api/clients', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('clients').select('*')
    .eq('agency_id', req.agencyId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ clients: data });
});

router.post('/api/clients', requireAuth, async (req, res) => {
  const body = { ...req.body }; delete body.agency_id;
  const { data, error } = await req.supabase.from('clients')
    .insert({ ...body, agency_id: req.agencyId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ client: data });
});

router.patch('/api/clients/:id', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('clients').update(req.body)
    .eq('id', req.params.id).eq('agency_id', req.agencyId).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ client: data });
});

router.delete('/api/clients/:id', requireAuth, async (req, res) => {
  await req.supabase.from('clients').delete()
    .eq('id', req.params.id).eq('agency_id', req.agencyId);
  res.json({ success: true });
});

// QUOTES
router.get('/api/quotes', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('quotes').select('*')
    .eq('agency_id', req.agencyId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ quotes: data });
});

router.post('/api/quotes', requireAuth, async (req, res) => {
  const body = { ...req.body }; delete body.agency_id;
  const { data, error } = await req.supabase.from('quotes')
    .insert({ ...body, agency_id: req.agencyId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ quote: data });
});

// SITES
router.get('/api/sites', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('sites').select('*')
    .eq('agency_id', req.agencyId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ sites: data });
});

router.post('/api/sites', requireAuth, async (req, res) => {
  const body = { ...req.body }; delete body.agency_id;
  const { data, error } = await req.supabase.from('sites')
    .insert({ ...body, agency_id: req.agencyId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ site: data });
});

router.delete('/api/sites/:id', requireAuth, async (req, res) => {
  await req.supabase.from('sites').delete()
    .eq('id', req.params.id).eq('agency_id', req.agencyId);
  res.json({ success: true });
});

// TASKS
router.get('/api/tasks', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('tasks').select('*')
    .eq('agency_id', req.agencyId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ tasks: data });
});

// MESSAGES
router.get('/api/messages', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('site_messages').select('*, sites(site_name)')
    .eq('agency_id', req.agencyId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ messages: data });
});

router.post('/api/messages', async (req, res) => {
  const { site_id, name, phone, message } = req.body;
  if (!site_id || !name || !message) return res.status(400).json({ error: 'Champs manquants' });
  // Récupérer agency_id du site
  const { createClient } = require('@supabase/supabase-js');
  const admin = require('../supabaseClient').getAdminClient();
  const { data: site } = await admin.from('sites').select('agency_id').eq('id', site_id).single();
  if (!site) return res.status(404).json({ error: 'Site introuvable' });
  await admin.from('site_messages').insert({ site_id, agency_id: site.agency_id, name, phone, message });
  res.json({ success: true });
});

router.patch('/api/messages/:id/read', requireAuth, async (req, res) => {
  await req.supabase.from('site_messages').update({ read: true }).eq('id', req.params.id).eq('agency_id', req.agencyId);
  res.json({ success: true });
});

// TÉMOIGNAGES
router.get('/api/testimonials/:siteId', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('site_testimonials').select('*')
    .eq('site_id', req.params.siteId).eq('agency_id', req.agencyId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ testimonials: data });
});

router.post('/api/testimonials', requireAuth, async (req, res) => {
  const { site_id, name, role, text, rating } = req.body;
  const { data, error } = await req.supabase.from('site_testimonials')
    .insert({ site_id, agency_id: req.agencyId, name, role, text, rating: rating || 5 }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ testimonial: data });
});

router.delete('/api/testimonials/:id', requireAuth, async (req, res) => {
  await req.supabase.from('site_testimonials').delete().eq('id', req.params.id).eq('agency_id', req.agencyId);
  res.json({ success: true });
});


// ── DÉPLOIEMENT VERCEL ──────────────────────────────────────
router.post('/sites/:id/deploy/vercel', requireAuth, async (req, res) => {
  try {
    const { data: site } = await supabase.from('sites').select('*').eq('id', req.params.id).eq('agency_id', req.agencyId).single();
    if (!site) return res.status(404).json({ error: 'Site introuvable' });

    const projectName = 'cc-' + site.slug;
    const htmlContent = site.html_output || '<h1>Site en construction</h1>';

    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.VERCEL_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        files: [{ file: 'index.html', data: Buffer.from(htmlContent).toString('base64'), encoding: 'base64' }],
        projectSettings: { framework: null },
        target: 'production'
      })
    });

    const deploy = await deployRes.json();
    if (deploy.error) throw new Error(deploy.error.message);
    const url = 'https://' + deploy.url;
    await supabase.from('sites').update({ custom_domain: url }).eq('id', site.id);
    res.json({ success: true, url });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
