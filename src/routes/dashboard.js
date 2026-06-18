const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.get('/dashboard', requireAuth, async (req, res) => {
  const { data: profile } = await req.supabase
    .from('profiles')
    .select('*, agencies(*)')
    .eq('id', req.session.user.id)
    .single();

  res.render('dashboard', { profile });
});

module.exports = router;
