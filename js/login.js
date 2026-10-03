/* login.js — username + password sign-in with Supabase Auth */
const LANGS = {
  ku: {
    dir:'rtl', htmlLang:'ku',
    hInstName:'پەیمانگە',
    hSub:'سیستەما تومارکرنا نەهاتنێ',
    loginTitle:'چوونا ژوورێ سیستەمێ',
    loginSub:'تومارکرنا نەهاتنا قوتابیان',
    labelUser:'ناڤێ بکارهێنەر', labelPass:'وشەی نهێنی',
    btnLogin:'چوونا ژوورێ ←', userPH:'ناڤێ مامۆستای...',
    loading:'خۆراستکرن و خواندنا داتایان...',
    loggingIn:'چوونا ژوورێ...',
    errFill:'تکایە هەمی خانەیێن پێدڤی داگرە!',
    errWrong:'ناڤ یا شێفرە شاشە! دیسا تاقی بکەڤە.',
    errConn:'پەيوەندی ب سێرڤەری نەهاتە کرن! تکایە دوبارە تاقی بکەڤە.',
    academicYearLabel:'ساڵا خوێندنی',
  },
  ar: {
    dir:'rtl', htmlLang:'ar',
    hInstName:'المعهد',
    hSub:'نظام تسجيل الغياب',
    loginTitle:'تسجيل الدخول',
    loginSub:'تسجيل غياب الطلاب',
    labelUser:'اسم المستخدم', labelPass:'كلمة المرور',
    btnLogin:'دخول ←', userPH:'اسم المستخدم...',
    loading:'جارٍ تحميل البيانات...',
    loggingIn:'جارٍ تسجيل الدخول...',
    errFill:'يرجى ملء جميع الحقول المطلوبة!',
    errWrong:'اسم المستخدم أو كلمة المرور غير صحيحة!',
    errConn:'فشل الاتصال بالخادم! يرجى المحاولة مرة أخرى.',
    academicYearLabel:'السنة الدراسية',
  },
  en: {
    dir:'ltr', htmlLang:'en',
    hInstName:'Institute',
    hSub:'Absence Registration System',
    loginTitle:'Sign In',
    loginSub:'Student Absence Registration',
    labelUser:'Username', labelPass:'Password',
    btnLogin:'Sign In →', userPH:'Username...',
    loading:'Loading system data...',
    loggingIn:'Signing in...',
    errFill:'Please fill all required fields!',
    errWrong:'Wrong username or password!',
    errConn:'Could not connect to server! Please try again.',
    academicYearLabel:'Academic Year',
  }
};

LANGS.ku.errBlocked = 'ئەڤ هەژمارە ئامادە نینە. پەیوەندی ب بەڕێوەبەری بکە.';
LANGS.ar.errBlocked = 'هذا الحساب غير مُعدّ. تواصل مع المسؤول.';
LANGS.en.errBlocked = 'This account is not set up. Contact the administrator.';
LANGS.ku.errRate = 'زۆر هەول هاتنە دان. کەمەک چاڤەڕێ بکە.';
LANGS.ar.errRate = 'محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.';
LANGS.en.errRate = 'Too many attempts. Please wait a moment and try again.';

let currentLang = localStorage.getItem('aci_lang') || 'ku';
let publicSettingsReady = null;   // promise: public branding + login-email domain

function getAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function setLang(lang) {
  if (!LANGS[lang]) return;
  currentLang = lang;
  localStorage.setItem('aci_lang', lang);
  const L = LANGS[lang];
  document.documentElement.dir = L.dir;
  document.documentElement.lang = L.htmlLang;
  document.getElementById('hYear').textContent = (L.academicYearLabel || 'Academic Year') + ': ' + getAcademicYear();
  document.getElementById('hInstName').textContent = L.hInstName;
  document.getElementById('hSub').textContent = L.hSub;
  document.getElementById('loginTitle').textContent = L.loginTitle;
  document.getElementById('loginSub').textContent = L.loginSub;
  document.getElementById('labelUser').textContent = L.labelUser;
  document.getElementById('labelPass').textContent = L.labelPass;
  document.getElementById('btnLoginText').textContent = L.btnLogin;
  document.getElementById('loginUsername').placeholder = L.userPH;
  document.querySelectorAll('.lang-btn').forEach((b, i) => {
    b.classList.toggle('active', ['ku', 'ar', 'en'][i] === lang);
  });
}

// Public branding (institute names + logo) — readable without signing in.
function applyPublicBranding(settings) {
  if (!settings) return;
  if (settings.institute_name_en) {
    const badge = document.getElementById('loginBadge');
    if (badge) badge.textContent = brandInitials(settings.institute_name_en);
  }
  if (settings.institute_name_ku) LANGS.ku.hInstName = settings.institute_name_ku;
  if (settings.institute_name_ar) LANGS.ar.hInstName = settings.institute_name_ar;
  if (settings.institute_name_en) LANGS.en.hInstName = settings.institute_name_en;
  const logo = Api.logoUrl(settings.institute_logo_path);
  if (logo) {
    const logoEl = document.getElementById('loginInstituteLogo');
    if (logoEl) logoEl.src = logo;
  }
  setLang(currentLang);
}

// Already signed in? Go straight to the right page (role is read from the database).
async function checkAutoLogin() {
  try {
    const session = await Api.session();
    if (!session) return;
    const profile = await Api.profile();
    if (profile) navigateTo(profile.role === 'admin' ? 'dashboard' : 'portal');
  } catch (e) { /* stay on the login page */ }
}

function showLoading(msg) {
  document.getElementById('loadingText').textContent = msg || '...';
  document.getElementById('loadingOverlay').classList.add('show');
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}

function showLoginError(text) {
  document.getElementById('loginErrorText').textContent = text;
  document.getElementById('loginError').classList.add('show');
}

async function doLogin() {
  const L = LANGS[currentLang];
  const u = document.getElementById('loginUsername').value.trim().toLowerCase();
  const p = document.getElementById('loginPassword').value;   // passwords are never trimmed or altered
  const btn = document.getElementById('btnLogin');

  document.getElementById('loginError').classList.remove('show');
  document.getElementById('loginUsername').classList.remove('error');
  document.getElementById('loginPassword').classList.remove('error');

  if (!u || !p) { showLoginError(L.errFill); return; }

  btn.disabled = true;
  document.getElementById('btnLoginText').textContent = L.loggingIn;
  showLoading(L.loggingIn);

  const reset = () => {
    hideLoading();
    btn.disabled = false;
    document.getElementById('btnLoginText').textContent = L.btnLogin;
  };

  try {
    try { await publicSettingsReady; } catch (e) {}   // the login-email domain comes from here
    await Api.login(u, p);
    const profile = await Api.profile();
    if (!profile) {                       // Auth user without a profile row = account not set up
      await Api.logout();
      reset();
      showLoginError(L.errBlocked);
      return;
    }
    navigateTo(profile.role === 'admin' ? 'dashboard' : 'portal');
  } catch (err) {
    reset();
    if (err.badCredentials) {
      showLoginError(L.errWrong);
      document.getElementById('loginUsername').classList.add('error');
      document.getElementById('loginPassword').classList.add('error');
    } else if (err.isRate) {
      showLoginError(L.errRate);
    } else {
      showLoginError(L.errConn);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try { applyPublicBranding(JSON.parse(localStorage.getItem('aci_public_settings') || 'null')); } catch (e) {}
  setLang(currentLang);
  checkAutoLogin();
  publicSettingsReady = Api.publicSettings().then(applyPublicBranding).catch(() => {});
  document.getElementById('loginPassword').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
