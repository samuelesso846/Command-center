const { getClientForUser } = require('../supabaseClient');

async function requireAuth(req, res, next) {
  if (!req.session.user || !req.session.access_token) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    return res.redirect('/login');
  }
  req.supabase = getClientForUser(req.session.access_token);

  const { data: profile, error } = await req.supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', req.session.user.id)
    .single();

  if (error || !profile) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Session expirée' });
    }
    return res.redirect('/login');
  }
  req.agencyId = profile.agency_id;
  next();
}

module.exports = { requireAuth };
