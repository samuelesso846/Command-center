const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// CLIENTS
router.get('/api/clients', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ clients: data });
});

router.post('/api/clients', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('clients').insert({ ...req.body, agency_id: req.agencyId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ client: data });
});

router.patch('/api/clients/:id', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('clients').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ client: data });
});

router.delete('/api/clients/:id', requireAuth, async (req, res) => {
  await req.supabase.from('clients').delete().eq('id', req.params.id);
  res.json({ success: true });
});

// QUOTES
router.get('/api/quotes', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('quotes').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ quotes: data });
});

router.post('/api/quotes', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('quotes').insert({ ...req.body, agency_id: req.agencyId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ quote: data });
});

// SITES
router.get('/api/sites', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('sites').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ sites: data });
});

router.post('/api/sites', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('sites').insert({ ...req.body, agency_id: req.agencyId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ site: data });
});

router.delete('/api/sites/:id', requireAuth, async (req, res) => {
  await req.supabase.from('sites').delete().eq('id', req.params.id);
  res.json({ success: true });
});

// TASKS
router.get('/api/tasks', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ tasks: data });
});

module.exports = router;
