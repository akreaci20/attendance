/* ======================================================================
   supabase.js — Supabase client + API layer (replaces google.script.run / apiRequest)
   Load order:  supabase-js (CDN)  ->  config.js  ->  common.js  ->  supabase.js
   Security: the browser only holds the PUBLISHABLE key. All authorization is enforced
   by PostgreSQL (RLS + SECURITY DEFINER functions); nothing here is trusted.
   ====================================================================== */
(function () {
  var cfg = window.APP_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_PUBLISHABLE_KEY) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.innerHTML = '<p style="font-family:sans-serif;padding:40px;text-align:center">Configuration missing: js/config.js</p>';
    });
    throw new Error('APP_CONFIG missing');
  }
  window.sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'aci-auth' }
  });
})();

/* Turn a Supabase/PostgREST error into an Error with helpful flags. */
function apiError(err) {
  var e = new Error((err && err.message) || 'Request failed');
  e.code = err && err.code;
  e.status = err && err.status;
  var msg = String(e.message).toLowerCase();
  e.isAuth = e.code === '42501' || e.status === 401 || e.status === 403 ||
             msg.indexOf('jwt') !== -1 || msg === 'unauthorized' || msg.indexOf('not authenticated') !== -1;
  e.isRate = e.code === 'P0429' || msg.indexOf('rate limit') !== -1;
  return e;
}

var Api = {
  /** Call a PostgreSQL function (RPC). Returns data or throws. */
  rpc: async function (name, args) {
    var r = await sb.rpc(name, args || {});
    if (r.error) throw apiError(r.error);
    return r.data;
  },
  session: async function () {
    var r = await sb.auth.getSession();
    return r.data && r.data.session ? r.data.session : null;
  },
  /** The signed-in user's profile row (RLS: a user can read only their own, admin reads all). */
  profile: async function () {
    var s = await Api.session();
    if (!s) return null;
    var r = await sb.from('profiles').select('id, username, arabic_name, display_name, role')
      .eq('id', s.user.id).maybeSingle();
    if (r.error) throw apiError(r.error);
    return r.data;
  },
  authDomain: function () {
    try {
      var s = JSON.parse(localStorage.getItem('aci_public_settings') || 'null');
      if (s && s.auth_email_domain) return s.auth_email_domain;
    } catch (e) {}
    return (window.APP_CONFIG && window.APP_CONFIG.AUTH_EMAIL_DOMAIN) || 'login.local';
  },
  /** Username login: username -> internal email, then Supabase Auth. */
  login: async function (username, password) {
    var email = String(username).trim().toLowerCase() + '@' + Api.authDomain();
    var r = await sb.auth.signInWithPassword({ email: email, password: password });
    if (r.error) {
      var e = apiError(r.error);
      e.badCredentials = r.error.status === 400 || /invalid login credentials/i.test(r.error.message || '');
      throw e;
    }
    return r.data;
  },
  logout: async function () {
    try { await sb.auth.signOut(); } catch (e) {}
    ['aci_students', 'aci_class_subject_map', 'aci_teacher', 'aci_token', 'aci_role'].forEach(function (k) {
      localStorage.removeItem(k);
    });
    Object.keys(localStorage).forEach(function (k) { if (k.indexOf('aci_boot_') === 0) localStorage.removeItem(k); });
    sessionStorage.removeItem('formState');
  },
  publicSettings: async function () {
    var s = await Api.rpc('get_public_settings');
    try { localStorage.setItem('aci_public_settings', JSON.stringify(s)); } catch (e) {}
    return s;
  },
  logoUrl: function (path) {
    if (!path) return null;
    return sb.storage.from('branding').getPublicUrl(path).data.publicUrl;
  },
  /** Page guard: returns {session, profile} or redirects. The role comes from the DATABASE, not localStorage. */
  requireRole: async function (role) {
    var session = await Api.session();
    if (!session) { navigateTo('login'); return null; }
    var profile;
    try { profile = await Api.profile(); } catch (e) { profile = null; }
    if (!profile) { await Api.logout(); navigateTo('login'); return null; }
    if (profile.role !== role) { navigateTo(profile.role === 'admin' ? 'dashboard' : 'portal'); return null; }
    return { session: session, profile: profile };
  }
};
