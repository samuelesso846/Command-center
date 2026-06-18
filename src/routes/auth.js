const express = require('express');
const router = express.Router();
const { getAdminClient } = require('../supabaseClient');

router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null }));

router.post('/register', async (req, res) => {
  const { agency_name, full_name, email, password, phone } = req.body;
  const admin = getAdminClient();

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email, password, email_confirm: true
  });
  if (authError) return res.render('register', { error: authError.message });

  const { data: agency, error: agencyError } = await admin
    .from('agencies')
    .insert({ name: agency_name, email, phone })
    .select()
    .single();
  if (agencyError) return res.render('register', { error: agencyError.message });

  await admin.from('profiles').insert({
    id: authUser.user.id,
    agency_id: agency.id,
    full_name,
    role: 'owner'
  });

  res.redirect('/login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = getAdminClient();

  const { data, error } = await admin.auth.signInWithPassword({ email, password });
  if (error) return res.render('login', { error: error.message });

  req.session.user = data.user;
  req.session.access_token = data.session.access_token;
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
