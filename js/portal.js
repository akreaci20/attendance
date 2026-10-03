/* portal.js — teacher attendance portal (Supabase: RPC + RLS; no trust in the browser) */
const LANGS = {
  ku: {
    dir:'rtl', htmlLang:'ku',
    hInstName:'پەیمانگە',
    hSub:'سیستەما تومارکرنا نەهاتنێ',
    teacherPrefix:'مامۆستا ',
    welcomeSub:'تکایە زانیاریێن دەرسێ داخل بکە و قوتابیێن نەهاتی هلبژێرە',
    step1:'زانیارییێن دەرسێ', step2:'قوتابیێن نەهاتی',
    labelDate:'بەروار', labelLecture:'ژمارەیا دەرسێ', labelSubject:'بابەت', labelClass:'گروپا پۆلێ',
    placeholder:'— هلبژێرە —',
    noStudents:'پۆلێ هلبژێرە دا کو لیستا قوتابیان دەرکەڤە',
    studentsTitle:'هلبژارنا پۆلێ', absentLabel:'نەهاتی',
    vacationLabel:'مولەت',
    absentPreview:'✗ قوتابیێن نەهاتی:',
    btnReset:'🔄 سفرکرن', btnSubmit:'📤 شاندن و پاشەکەفتکرن', btnUpdate:'💾 نویکرن و پاشەکەفتکرن',
    successTitle:'سەرکەفتن! تومار کرا',
    successSub:'نەهاتنا قوتابیان ب سەرکەفتی هاتە تومارکرن.',
    btnNew:'✓ باشە', btnLogout:'🚪 دەرچوون',
    fDate:'بەروار', fTeacher:'مامۆستە', fSubject:'بابەت', fLecture:'دەرس',
    fClass:'پۆل', fAbsent:'ژمارەیا نەهاتی', students:'قوتابی',
    loadingSubmit:'تومارکرنا نەهاتنێ...',
    loadingData:'بارکرنا زانیاریان...',
    loadingDel:'سڕینەوەی تومارکرن...',
    loadingEdit:'ئامادەکرنا دەستکاریکرنێ...',
    toastFill:'⚠️ تکایە هەمی خانەیێن پێدڤی داگرە!',
    toastWeekend:'🚫 ئەمرۆ ڕۆژی کار نییە. تومارکرن نابێت.',
    toastDate:'⚠️ بەروارا تومارکرنێ دڤێت ئەمرۆ بیت.',
    toastDuplicate:'⚠️ ئەم دەرسێ پێشتر تومار کراوە!',
    toastUnauthorized:'❌ دەستگەهشتن نەهاتیە پەسەندکرن. تکایە دوبارە بچۆ ژوور.',
    toastError:'❌ پەیوەندی ب سێرڤەری نەهاتە کرن!',
    recentTitle:'تومارکرنێن ئەمرۆ',
    thLecture:'دەرس', thSubject:'بابەت', thClass:'پۆل', thAbsentStudents:'قوتابیێن نەهاتی',
    thActions:'کارەکان',
    btnEdit:'✏️ دەستکاری', confirmDelete:'🗑️ بسڕەوە',
    confirmTitle:'تومارکرن بسڕەوە؟', confirmMsg:'ئەم کارە نابێتە پووچەلکرن.',
    confirmCancel:'هەڵوەستان',
    toastDelOk:'✅ تومارکرن هاتە سڕینەوە.', toastDelFail:'❌ سڕینەوە سەرنەکەفت!',
    toastEditReady:'✏️ زانیاری هاتە داخلکرن — دەستکاری بکە و دوبارە بنێرە.',
    noneAbsent:'هیچ نەهاتنێک نەبوو',
    academicYearLabel:'ساڵا خوێندنی', todayLabel:'ئەمرۆ', studentsHint:'بۆ گۆرینا دۆخێ، دووبارە بکەڤە سەر ناڤێ قوتابی (نەهاتی ← مولەت ← ئامادە)',
    studentSearchPH:'🔍 گەڕان ب ناڤێ قوتابی...', noSearchResults:'قوتابیەک ب ڤی ناڤی نەهاتە دیتن'
  },
  ar: {
    dir:'rtl', htmlLang:'ar',
    hInstName:'المعهد', hSub:'نظام تسجيل الغياب',
    teacherPrefix:'الأستاذ ', welcomeSub:'يرجى إدخال معلومات الدرس واختيار الطلاب الغائبين',
    step1:'معلومات الدرس', step2:'الطلاب الغائبون',
    labelDate:'التاريخ', labelLecture:'رقم المحاضرة', labelSubject:'المادة', labelClass:'المجموعة',
    placeholder:'— اختر —', noStudents:'اختر المجموعة لعرض قائمة الطلاب',
    studentsTitle:'اختيار المجموعة', absentLabel:'غائب',
    vacationLabel:'اجازة',
    absentPreview:'✗ الطلاب الغائبون:',
    btnReset:'🔄 إعادة تعيين', btnSubmit:'📤 إرسال وحفظ', btnUpdate:'💾 تحديث وحفظ',
    successTitle:'تم الحفظ بنجاح!', successSub:'تم تسجيل غياب الطلاب بنجاح.',
    btnNew:'✓ حسناً', btnLogout:'🚪 تسجيل الخروج',
    fDate:'التاريخ', fTeacher:'المعلم', fSubject:'المادة', fLecture:'المحاضرة',
    fClass:'المجموعة', fAbsent:'عدد الغائبين', students:'طالب',
    loadingSubmit:'جارٍ حفظ الغياب...', loadingData:'جارٍ تحميل البيانات...',
    loadingDel:'جارٍ حذف السجل...', loadingEdit:'جارٍ تحضير التعديل...',
    toastFill:'⚠️ يرجى ملء جميع الحقول المطلوبة!',
    toastWeekend:'🚫 اليوم يوم عطلة حسب إعدادات المعهد. لا يمكن التسجيل.',
    toastDate:'⚠️ يجب أن يكون تاريخ التسجيل هو تاريخ اليوم.',
    toastDuplicate:'⚠️ تم تسجيل هذه المحاضرة مسبقاً!',
    toastUnauthorized:'❌ انتهت صلاحية الدخول. يرجى تسجيل الدخول مرة أخرى.',
    toastError:'❌ فشل الاتصال بالخادم!',
    recentTitle:'سجلات اليوم',
    thLecture:'المحاضرة', thSubject:'المادة', thClass:'المجموعة', thAbsentStudents:'الطلاب الغائبون',
    thActions:'الإجراءات', btnEdit:'✏️ تعديل', confirmDelete:'🗑️ حذف',
    confirmTitle:'حذف السجل؟', confirmMsg:'لا يمكن التراجع عن هذا.',
    confirmCancel:'إلغاء', toastDelOk:'✅ تم حذف السجل.', toastDelFail:'❌ فشل الحذف!',
    toastEditReady:'✏️ تم تحميل البيانات — عدّل وأعد الإرسال.',
    noneAbsent:'لا غياب', academicYearLabel:'السنة الدراسية', todayLabel:'اليوم', studentsHint:'اضغط على اسم الطالب لتبديل حالته (غائب ← اجازة ← حاضر)',
    studentSearchPH:'🔍 ابحث عن اسم الطالب...', noSearchResults:'لا يوجد طالب بهذا الاسم'
  },
  en: {
    dir:'ltr', htmlLang:'en',
    hInstName:'Institute', hSub:'Absence Registration System',
    teacherPrefix:'Teacher ', welcomeSub:'Fill in lesson details and select absent students',
    step1:'Lesson Details', step2:'Absent Students',
    labelDate:'Date', labelLecture:'Lecture No.', labelSubject:'Subject', labelClass:'Class Group',
    placeholder:'— Select —', noStudents:'Select a class to show the student list',
    studentsTitle:'Select Class', absentLabel:'absent',
    vacationLabel:'Vacation',
    absentPreview:'✗ Absent students:',
    btnReset:'🔄 Reset', btnSubmit:'📤 Submit', btnUpdate:'💾 Update & Save',
    successTitle:'Submitted Successfully!', successSub:'Student absences have been recorded.',
    btnNew:'✓ OK', btnLogout:'🚪 Logout',
    fDate:'Date', fTeacher:'Teacher', fSubject:'Subject', fLecture:'Lecture',
    fClass:'Class', fAbsent:'Absent Count', students:'students',
    loadingSubmit:'Saving absence...', loadingData:'Loading data...',
    loadingDel:'Deleting submission...', loadingEdit:'Preparing edit...',
    toastFill:'⚠️ Please fill all required fields!',
    toastWeekend:'🚫 Today is a configured non-working day. No submissions.',
    toastDate:'⚠️ Attendance date must be today.',
    toastDuplicate:'⚠️ This lesson was already submitted!',
    toastUnauthorized:'❌ Your session is no longer valid. Please log in again.',
    toastError:'❌ Connection failed! Please try again.',
    recentTitle:"Today's Submissions",
    thLecture:'Lecture', thSubject:'Subject', thClass:'Class', thAbsentStudents:'Absent Students',
    thActions:'Actions', btnEdit:'✏️ Edit', confirmDelete:'🗑️ Delete',
    confirmTitle:'Delete submission?', confirmMsg:'This cannot be undone.',
    confirmCancel:'Cancel', toastDelOk:'✅ Submission deleted.', toastDelFail:'❌ Delete failed!',
    toastEditReady:'✏️ Data loaded — fix and resubmit.',
    noneAbsent:'No absences', academicYearLabel:'Academic Year', todayLabel:'Today', studentsHint:'Tap a student row to cycle: absent → vacation → present',
    studentSearchPH:'🔍 Search student name...', noSearchResults:'No student matches that name'
  }
};

const LECTURE_VALUES = ['Lecture 1','Lecture 2','Lecture 3','Lecture 4','Lecture 5','Lecture 6',
  'Lectures 1-2 (Merged)','Lectures 3-4 (Merged)','Lectures 5-6 (Merged)'];
const LECTURE_LABELS = {
  ku: ['دەرسا ١','دەرسا ٢','دەرسا ٣','دەرسا ٤','دەرسا ٥','دەرسا ٦',
    'دەرسا ١-٢ (تێکەلکری)','دەرسا ٣-٤ (تێکەلکری)','دەرسا ٥-٦ (تێکەلکری)'],
  ar: ['المحاضرة 1','المحاضرة 2','المحاضرة 3','المحاضرة 4','المحاضرة 5','المحاضرة 6',
    'المحاضرة 1-2 (مدمجة)','المحاضرة 3-4 (مدمجة)','المحاضرة 5-6 (مدمجة)'],
  en: ['Lecture 1','Lecture 2','Lecture 3','Lecture 4','Lecture 5','Lecture 6',
    'Lectures 1-2 (Merged)','Lectures 3-4 (Merged)','Lectures 5-6 (Merged)']
};

Object.assign(LANGS.ku, {
  toastNotAssigned:'❌ تە ئەڤ پۆل یان بابەتە نینە.',
  toastRate:'⚠️ زۆر داخوازی هاتنە دان. کەمەک چاڤەڕێ بکە.',
  toastBadStudents:'❌ قوتابییەک ل ڤی پۆلی نینە. لاپەڕێ نوی بکەڤە.',
  toastOnlyToday:'⚠️ تەنێ تومارکرنێن ئەمرۆ دکارن بهێنە دەستکاریکرن.'
});
Object.assign(LANGS.ar, {
  toastNotAssigned:'❌ لست مُعيَّناً لهذه الشعبة أو المادة.',
  toastRate:'⚠️ طلبات كثيرة. انتظر قليلاً.',
  toastBadStudents:'❌ أحد الطلاب ليس في هذه الشعبة. حدّث الصفحة.',
  toastOnlyToday:'⚠️ يمكن تعديل سجلات اليوم فقط.'
});
Object.assign(LANGS.en, {
  toastNotAssigned:'❌ You are not assigned to this class or subject.',
  toastRate:'⚠️ Too many requests. Please wait a moment.',
  toastBadStudents:'❌ A student is not in this class. Reload the page.',
  toastOnlyToday:"⚠️ Only today's records can be edited."
});

// ── state ───────────────────────────────────────────────
let currentLang = localStorage.getItem('aci_lang') || 'ku';
let profile = null;                 // signed-in teacher's profile (from the database)
let CLASSES = [];                   // [{id, name, subjects:[{id,name}], students:[{id,name}]}]
let selectedAbsent = new Set();     // student IDs
let selectedExcused = new Set();    // subset of selectedAbsent marked vacation/sick
let takenLectureNumbers = new Set();
let todayRows = [];
let pendingDeleteRow = null;        // absence id
let pendingEditRow = null;          // row object being edited
let WORKING_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
let SERVER_DATE = '';               // 'YYYY-MM-DD' from the server (the device clock is never trusted)

function getAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function classById(id) { return CLASSES.find(c => String(c.id) === String(id)) || null; }
function teacherName() {
  return profile ? (profile.arabic_name || profile.display_name || profile.username || '') : '';
}
function normalize(v) { return String(v == null ? '' : v).trim().toLowerCase(); }
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value == null ? '' : value;
}
function todayISO() {
  if (SERVER_DATE) return SERVER_DATE;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function formatDateForDisplay(iso) { return formatDMY(iso); }

function lectureLabel(value) {
  const i = LECTURE_VALUES.indexOf(value);
  return i === -1 ? value : (LECTURE_LABELS[currentLang] || LECTURE_LABELS.en)[i];
}

// ── errors from the database ────────────────────────────
function handleRpcError(err, fallbackKey) {
  const L = LANGS[currentLang];
  if (err && err.isAuth) {
    showToast(L.toastUnauthorized, 'error');
    setTimeout(doLogout, 1200);
    return;
  }
  const msg = String((err && err.message) || '').toLowerCase();
  if (err && err.isRate) showToast(L.toastRate, 'error');
  else if (msg.indexOf('not assigned') !== -1) showToast(L.toastNotAssigned, 'error');
  else if (msg.indexOf('not in the selected class') !== -1) showToast(L.toastBadStudents, 'error');
  else if (msg.indexOf("today's records") !== -1) showToast(L.toastOnlyToday, 'error');
  else showToast(L[fallbackKey || 'toastError'], 'error');
}

async function doLogout() {
  await Api.logout();
  navigateTo('login');
}

// ── language ────────────────────────────────────────────
function setLang(lang) {
  if (!LANGS[lang]) return;
  currentLang = lang;
  localStorage.setItem('aci_lang', lang);

  const L = LANGS[lang];
  document.documentElement.dir = L.dir;
  document.documentElement.lang = L.htmlLang;

  setText('hInstName', L.hInstName);
  setText('hSub', L.hSub);
  setText('hYear', `${L.academicYearLabel}: ${getAcademicYear()}`);
  setText('step1', L.step1);
  setText('step2', L.step2);
  setText('labelLecture', L.labelLecture);
  setText('labelSubject', L.labelSubject);
  setText('labelClass', L.labelClass);
  setText('studentsHint', L.studentsHint || '');
  document.getElementById('studentSearch').placeholder = L.studentSearchPH || '';
  setText('todayLabel', L.todayLabel || 'Today');
  setText('todayValue', formatDateForDisplay(todayISO()));
  setText('welcomeSub', L.welcomeSub);
  setText('btnReset', L.btnReset);
  setText('btnSubmitText', pendingEditRow ? (L.btnUpdate || L.btnSubmit) : L.btnSubmit);
  setText('successTitle', L.successTitle);
  setText('successSub', L.successSub);
  setText('btnNew', L.btnNew);
  setText('btnLogout', L.btnLogout);
  setText('recentTitle', L.recentTitle);
  setText('noStudentsText', L.noStudents);
  setText('absentPreviewTitle', L.absentPreview);
  setText('confirmTitle', L.confirmTitle);
  setText('confirmMsg', L.confirmMsg);
  setText('confirmCancelBtn', L.confirmCancel);
  setText('confirmDeleteBtn', L.confirmDelete);

  document.querySelectorAll('select.form-control option[value=""]').forEach(o => { o.textContent = L.placeholder; });
  populateLectureOptions();
  updateWorkingDayStatus();

  if (profile) {
    setText('welcomeName', L.teacherPrefix + teacherName());
    setText('headerUserName', teacherName());
  }

  document.querySelectorAll('.lang-btn').forEach((b, i) => {
    b.classList.toggle('active', ['ku', 'ar', 'en'][i] === lang);
  });

  updateAbsentCount();
  renderAbsentPreview();
  const cls = document.getElementById('fClass').value;
  if (cls) renderStudents(cls);
  if (todayRows.length) renderRecentRows();
}

// ── working day (decided by the server date + the saved working days) ──
function isWorkingDay() {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(todayISO() + 'T00:00:00');
  const today = names[d.getDay()];
  return WORKING_DAYS.some(x => normalize(x) === normalize(today));
}
function isWeekend() { return !isWorkingDay(); }

function updateWorkingDayStatus() {
  const el = document.getElementById('workingDayStatus');
  if (!el) return;
  const ok = isWorkingDay();
  el.textContent = ok
    ? '✓ ' + (currentLang === 'ar' ? 'يوم دوام' : currentLang === 'en' ? 'Working day' : 'ڕۆژی کارە')
    : '🚫 ' + (currentLang === 'ar' ? 'عطلة' : currentLang === 'en' ? 'Non-working day' : 'ڕۆژی پشوویە');
  el.style.color = ok ? '#24864c' : '#c83b42';
}

function applyPublicSettings(settings) {
  if (!settings) return;
  if (settings.institute_name_ku) LANGS.ku.hInstName = settings.institute_name_ku;
  if (settings.institute_name_ar) LANGS.ar.hInstName = settings.institute_name_ar;
  if (settings.institute_name_en) LANGS.en.hInstName = settings.institute_name_en;
  try { localStorage.setItem('aci_public_settings', JSON.stringify(settings)); } catch (_) {}
  const badge = document.getElementById('brandBadge');
  if (badge && settings.institute_name_en) badge.textContent = brandInitials(settings.institute_name_en);
  setLang(currentLang);
}

// ── lectures ────────────────────────────────────────────
function populateLectureOptions() {
  const sel = document.getElementById('fLecture');
  const current = sel.value;
  const labels = LECTURE_LABELS[currentLang] || LECTURE_LABELS.en;
  const submittedSuffix = currentLang === 'ar' ? ' (مسجّلة)' : currentLang === 'en' ? ' (submitted)' : ' (هاتیە تومارکرن)';
  sel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = LANGS[currentLang].placeholder;
  sel.appendChild(ph);
  LECTURE_VALUES.forEach((value, i) => {
    const o = document.createElement('option');
    o.value = value;
    const nums = (value.match(/\d+/g) || []).map(n => parseInt(n, 10));
    const isTaken = nums.some(n => takenLectureNumbers.has(n));
    o.textContent = (labels[i] || value) + (isTaken ? submittedSuffix : '');
    if (isTaken) o.disabled = true;
    sel.appendChild(o);
  });
  if (LECTURE_VALUES.includes(current)) sel.value = current;
}

// Which lecture numbers are already logged TODAY for this class (any teacher, any subject)
async function refreshLectureAvailability(classId) {
  if (!classId) {
    takenLectureNumbers = new Set();
    populateLectureOptions();
    return;
  }
  try {
    const nums = await Api.rpc('taken_lectures', {
      p_class_id: Number(classId),
      p_exclude_absence_id: pendingEditRow ? pendingEditRow.id : null
    });
    takenLectureNumbers = new Set(Array.isArray(nums) ? nums.map(Number) : []);
  } catch (err) {
    console.warn('refreshLectureAvailability:', err);
    takenLectureNumbers = new Set();   // fail open: the server still blocks real conflicts
  }
  populateLectureOptions();
}

// ── bootstrap (one RPC after login) ─────────────────────
function bootKey() { return `aci_boot_${profile ? profile.id : 'x'}`; }

function applyBootstrap(data) {
  if (data.teacher) {
    profile = Object.assign({}, profile, data.teacher);
  }
  if (data.settings) applyPublicSettings(data.settings);
  CLASSES = Array.isArray(data.classes) ? data.classes : [];
  if (Array.isArray(data.working_days) && data.working_days.length) WORKING_DAYS = data.working_days;
  if (data.server_date) SERVER_DATE = data.server_date;
  document.getElementById('fDate').value = todayISO();
  if (Array.isArray(data.today_rows)) {
    todayRows = data.today_rows;
    renderRecentRows();
  }
  updateWorkingDayStatus();
  setText('todayValue', formatDateForDisplay(todayISO()));
  updateTeacherHeader();
  populateTeacherFields();
}

async function loadTeacherData() {
  const L = LANGS[currentLang];
  if (!CLASSES.length) showLoading(L.loadingData);
  try {
    const data = await Api.rpc('teacher_bootstrap');
    if (!data) throw new Error('Teacher data unavailable');
    applyBootstrap(data);
    try { localStorage.setItem(bootKey(), JSON.stringify(data)); } catch (_) {}
    await restoreFormState();
  } catch (err) {
    console.error('loadTeacherData:', err);
    if (err.isAuth) { handleRpcError(err); return; }
    if (!CLASSES.length) showToast(L.toastError, 'error');   // keep cached data when offline
  } finally {
    hideLoading();
  }
}

function updateTeacherHeader() {
  const name = teacherName();
  setText('welcomeName', LANGS[currentLang].teacherPrefix + name);
  setText('welcomeAvatar', name.charAt(0) || 'م');
  setText('headerUserName', name);
}

async function init() {
  const guard = await Api.requireRole('teacher');
  if (!guard) return;
  profile = guard.profile;
  sb.auth.onAuthStateChange(event => { if (event === 'SIGNED_OUT') navigateTo('login'); });

  try { applyPublicSettings(JSON.parse(localStorage.getItem('aci_public_settings') || 'null')); } catch (_) {}
  setLang(currentLang);
  document.getElementById('screenSubmit').style.display = '';

  // Show the cached roster immediately; the fresh copy loads in the background.
  try {
    const cached = JSON.parse(localStorage.getItem(bootKey()) || 'null');
    if (cached) applyBootstrap(cached);
  } catch (_) {}
  await restoreFormState();
  Api.publicSettings().then(applyPublicSettings).catch(() => {});
  loadTeacherData();
}

// ── class / subject pickers ─────────────────────────────
function populateTeacherFields() {
  const classSel = document.getElementById('fClass');
  const keep = classSel.value;
  classSel.innerHTML = '';
  const co = document.createElement('option');
  co.value = '';
  co.textContent = LANGS[currentLang].placeholder;
  classSel.appendChild(co);
  CLASSES.forEach(c => {
    const o = document.createElement('option');
    o.value = String(c.id);
    o.textContent = c.name;
    classSel.appendChild(o);
  });
  if (keep && classById(keep)) classSel.value = keep;
  filterSubjectsForClass();
}

function filterSubjectsForClass() {
  const cls = classById(document.getElementById('fClass').value);
  const subjectSel = document.getElementById('fSubject');
  const current = subjectSel.value;
  subjectSel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = LANGS[currentLang].placeholder;
  subjectSel.appendChild(ph);
  (cls ? cls.subjects : []).forEach(s => {
    const o = document.createElement('option');
    o.value = String(s.id);
    o.textContent = s.name;
    subjectSel.appendChild(o);
  });
  if (current && [...subjectSel.options].some(o => o.value === current)) subjectSel.value = current;
}

function onClassChange() {
  selectedAbsent.clear();
  selectedExcused.clear();
  filterSubjectsForClass();
  const cls = document.getElementById('fClass').value;
  renderStudents(cls);
  updateAbsentCount();
  renderAbsentPreview();
  saveFormState();
  refreshLectureAvailability(cls);
}
function onSubjectChange() { saveFormState(); }

// ── students (3-state tap: present -> absent -> vacation -> present) ──
function applyRowState(row, cb, id) {
  const L = LANGS[currentLang];
  const isAbsent = selectedAbsent.has(id);
  const isVacation = selectedExcused.has(id);

  row.classList.toggle('checked', isAbsent && !isVacation);
  row.classList.toggle('excused', isVacation);
  cb.checked = isAbsent;
  row.setAttribute('aria-pressed', isAbsent ? 'true' : 'false');
  row.style.background = isVacation ? '#fff4e6' : '';
  row.style.borderColor = isVacation ? '#ffb877' : '';

  let tag = row.querySelector('.status-tag');
  if (isAbsent) {
    if (!tag) {
      tag = document.createElement('span');
      tag.className = 'status-tag';
      row.appendChild(tag);
    }
    tag.textContent = isVacation ? L.vacationLabel : L.absentLabel;
    tag.style.cssText = `margin-inline-start:8px;font-size:0.76em;font-weight:700;color:${isVacation ? '#b35900' : '#c8402a'};`;
  } else if (tag) {
    tag.remove();
  }
}

function emptyStudentsBox(text) {
  const box = document.createElement('div');
  box.className = 'no-students';
  const icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = '🎓';
  const msg = document.createElement('span'); msg.id = 'noStudentsText'; msg.textContent = text;
  box.appendChild(icon); box.appendChild(msg);
  return box;
}

function renderStudents(classId) {
  const L = LANGS[currentLang];
  const con = document.getElementById('studentsContainer');
  const searchBox = document.getElementById('studentSearch');
  const cls = classById(classId);

  if (!cls) {
    con.innerHTML = '';
    con.appendChild(emptyStudentsBox(L.noStudents));
    setText('studentsAreaTitle', '📋 ' + L.studentsTitle);
    searchBox.style.display = 'none';
    searchBox.value = '';
    return;
  }

  const list = cls.students;
  setText('studentsAreaTitle', `📋 ${cls.name} — ${list.length} ${L.students}`);
  searchBox.value = '';
  searchBox.style.display = list.length > 6 ? '' : 'none';

  const grid = document.createElement('div');
  grid.className = 'students-grid';

  list.forEach((st, index) => {
    const row = document.createElement('label');
    row.className = 'student-check';
    row.dataset.name = st.name.toLowerCase();
    row.dataset.id = String(st.id);
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');

    const number = document.createElement('span');
    number.className = 'student-no';
    number.textContent = String(index + 1).padStart(2, '0');

    const span = document.createElement('span');
    span.className = 'sname';
    span.textContent = st.name;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = String(st.id);

    row.appendChild(number); row.appendChild(span); row.appendChild(cb);

    const cycle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectedAbsent.has(st.id)) {
        selectedAbsent.add(st.id);
      } else if (!selectedExcused.has(st.id)) {
        selectedExcused.add(st.id);
      } else {
        selectedAbsent.delete(st.id);
        selectedExcused.delete(st.id);
      }
      applyRowState(row, cb, st.id);
      updateAbsentCount();
      renderAbsentPreview();
    };

    row.addEventListener('click', cycle);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') cycle(e); });

    applyRowState(row, cb, st.id);
    grid.appendChild(row);
  });

  con.innerHTML = '';
  con.appendChild(grid);
}

function updateAbsentCount() {
  const L = LANGS[currentLang];
  const vac = selectedExcused.size;
  const unexcused = selectedAbsent.size - vac;
  setText('absentCount', vac
    ? `${unexcused} ${L.absentLabel} • ${vac} ${L.vacationLabel}`
    : `${selectedAbsent.size} ${L.absentLabel}`);
}

function studentNameById(id) {
  const cls = classById(document.getElementById('fClass').value);
  const st = cls && cls.students.find(s => s.id === id);
  return st ? st.name : '';
}

function renderAbsentPreview() {
  const preview = document.getElementById('absentPreview');
  const pills = document.getElementById('absentPills');
  const L = LANGS[currentLang];

  if (!selectedAbsent.size) {
    preview.classList.remove('show');
    pills.innerHTML = '';
    return;
  }

  preview.classList.add('show');
  pills.innerHTML = '';

  [...selectedAbsent].forEach(id => {
    const name = studentNameById(id);
    const isVacation = selectedExcused.has(id);
    const pill = document.createElement('span');
    pill.className = 'absent-pill';
    if (isVacation) {
      pill.style.background = '#fff4e6';
      pill.style.borderColor = '#ffb877';
      pill.style.color = '#b35900';
    }
    const text = document.createElement('span');
    text.textContent = isVacation ? `${name} (${L.vacationLabel})` : name;

    const remove = document.createElement('span');
    remove.className = 'remove-pill';
    remove.textContent = '✕';
    remove.title = 'Remove';
    remove.addEventListener('click', e => { e.stopPropagation(); removeAbsent(id); });

    pill.appendChild(text);
    pill.appendChild(remove);
    pills.appendChild(pill);
  });
}

function removeAbsent(id) {
  selectedAbsent.delete(id);
  selectedExcused.delete(id);
  document.querySelectorAll('.student-check').forEach(label => {
    if (label.dataset.id === String(id)) applyRowState(label, label.querySelector('input'), id);
  });
  updateAbsentCount();
  renderAbsentPreview();
}

function resetStudents() {
  selectedAbsent.clear();
  selectedExcused.clear();
  const cls = document.getElementById('fClass').value;
  if (cls) renderStudents(cls);
  else {
    const con = document.getElementById('studentsContainer');
    con.innerHTML = '';
    con.appendChild(emptyStudentsBox(LANGS[currentLang].noStudents));
    document.getElementById('studentSearch').style.display = 'none';
  }
  updateAbsentCount();
  renderAbsentPreview();
}

function filterStudentRows(query) {
  const q = String(query || '').trim().toLowerCase();
  const rows = document.querySelectorAll('#studentsContainer .student-check');
  let visibleCount = 0;
  rows.forEach(row => {
    const match = !q || (row.dataset.name || '').includes(q);
    row.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });
  const con = document.getElementById('studentsContainer');
  let emptyMsg = con.querySelector('.search-empty');
  if (q && visibleCount === 0) {
    if (!emptyMsg) {
      emptyMsg = document.createElement('div');
      emptyMsg.className = 'no-students search-empty';
      const icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = '🔍';
      const msg = document.createElement('span'); msg.textContent = LANGS[currentLang].noSearchResults;
      emptyMsg.appendChild(icon); emptyMsg.appendChild(msg);
      con.appendChild(emptyMsg);
    }
  } else if (emptyMsg) {
    emptyMsg.remove();
  }
}

// ── remember the form while the page reloads ────────────
function saveFormState() {
  if (!profile) return;
  sessionStorage.setItem('formState', JSON.stringify({
    uid: profile.id,
    subject: document.getElementById('fSubject').value,
    lecture: document.getElementById('fLecture').value,
    cls: document.getElementById('fClass').value
  }));
}

async function restoreFormState() {
  try {
    const s = JSON.parse(sessionStorage.getItem('formState') || 'null');
    if (!s || !profile || s.uid !== profile.id || pendingEditRow) return;
    if (s.cls && classById(s.cls)) {
      document.getElementById('fClass').value = s.cls;
      filterSubjectsForClass();
      await refreshLectureAvailability(s.cls);
      renderStudents(s.cls);
    }
    if (s.subject) document.getElementById('fSubject').value = s.subject;
    if (s.lecture) document.getElementById('fLecture').value = s.lecture;
  } catch (_) {}
}

function resetForm(keepClassSubject) {
  pendingEditRow = null;
  setText('btnSubmitText', LANGS[currentLang].btnSubmit);
  document.getElementById('fLecture').value = '';

  if (keepClassSubject) {
    const subj = document.getElementById('fSubject').value;
    filterSubjectsForClass();
    document.getElementById('fSubject').value = subj;
    resetStudents();
    saveFormState();
    refreshLectureAvailability(document.getElementById('fClass').value);
  } else {
    document.getElementById('fSubject').value = '';
    document.getElementById('fClass').value = '';
    sessionStorage.removeItem('formState');
    populateTeacherFields();
    resetStudents();
    refreshLectureAvailability('');
  }
}

// ── submit (save / update) ──────────────────────────────
async function doSubmit() {
  const L = LANGS[currentLang];
  const classId = document.getElementById('fClass').value;
  const subjectId = document.getElementById('fSubject').value;
  const lecture = document.getElementById('fLecture').value;

  if (!classId || !subjectId || !lecture) { showToast(L.toastFill, 'error'); return; }
  if (isWeekend()) { showToast(L.toastWeekend, 'error'); return; }

  showLoading(L.loadingSubmit);
  try {
    const args = {
      p_class_id: Number(classId),
      p_subject_id: Number(subjectId),
      p_lecture: lecture,
      p_absent_ids: [...selectedAbsent],
      p_excused_ids: [...selectedExcused]
    };
    const res = pendingEditRow
      ? await Api.rpc('update_absence', Object.assign({ p_absence_id: pendingEditRow.id }, args))
      : await Api.rpc('save_absence', args);

    const status = res && res.status;
    if (status === 'BLOCKED') { hideLoading(); showToast(L.toastWeekend, 'error'); return; }
    if (status === 'DUPLICATE') {
      hideLoading();
      showToast(L.toastDuplicate, 'error');
      refreshLectureAvailability(classId);
      return;
    }
    if (status !== 'OK' && status !== 'UPDATED') throw new Error('Unexpected server response');

    const cls = classById(classId);
    const subjOpt = document.getElementById('fSubject');
    const details = {
      date: todayISO(),
      subject: subjOpt.options[subjOpt.selectedIndex].textContent,
      lecture,
      cls: cls ? cls.name : '',
      absent: selectedAbsent.size
    };

    pendingEditRow = null;
    sessionStorage.removeItem('formState');
    resetForm(true);
    hideLoading();
    showSuccess(details);
    await loadTodayRows();
  } catch (err) {
    hideLoading();
    console.error('doSubmit:', err);
    handleRpcError(err);
  }
}

function showSuccess(details) {
  const L = LANGS[currentLang];
  document.getElementById('successDetails').innerHTML = '';
  addDetail(L.fDate, formatDateForDisplay(details.date));
  addDetail(L.fTeacher, teacherName());
  addDetail(L.fSubject, details.subject);
  addDetail(L.fLecture, lectureLabel(details.lecture));
  addDetail(L.fClass, details.cls);
  addDetail(L.fAbsent, `${details.absent} ${L.students}`);

  document.getElementById('screenSubmit').style.display = 'none';
  document.getElementById('screenSuccess').style.display = '';

  clearTimeout(showSuccess._timer);
  showSuccess._timer = setTimeout(() => {
    if (document.getElementById('screenSuccess').style.display !== 'none') newSubmission();
  }, 1600);
}

function addDetail(label, value) {
  const row = document.createElement('div');
  row.className = 'detail-row';
  const l = document.createElement('span'); l.className = 'label'; l.textContent = label;
  const v = document.createElement('span'); v.className = 'val'; v.textContent = value;
  row.appendChild(l); row.appendChild(v);
  document.getElementById('successDetails').appendChild(row);
}

function newSubmission() {
  clearTimeout(showSuccess._timer);
  document.getElementById('screenSuccess').style.display = 'none';
  document.getElementById('screenSubmit').style.display = '';
}

// ── today's submissions ─────────────────────────────────
async function loadTodayRows() {
  try {
    const rows = await Api.rpc('my_today_rows');
    todayRows = Array.isArray(rows) ? rows : [];
    renderRecentRows();
  } catch (err) {
    console.warn('loadTodayRows:', err);
    if (err.isAuth) handleRpcError(err);
  }
}

function renderRecentRows() {
  const L = LANGS[currentLang];
  const card = document.getElementById('recentCard');
  const body = document.getElementById('recentCardBody');
  const badge = document.getElementById('recentCountBadge');

  if (!todayRows.length) {
    card.style.display = 'none';
    body.innerHTML = '';
    return;
  }
  card.style.display = '';
  badge.textContent = todayRows.length;

  const wrap = document.createElement('div');
  wrap.className = 'recent-table-wrap';
  const table = document.createElement('table');
  table.className = 'recent-table';

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  [L.thLecture, L.thSubject, L.thClass, L.thAbsentStudents, L.thActions].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  todayRows.forEach(r => {
    const tr = document.createElement('tr');

    const lecture = document.createElement('td');
    const lectureStrong = document.createElement('strong');
    lectureStrong.className = 'rt-lecture';
    lectureStrong.textContent = r.lecture ? lectureLabel(r.lecture) : '—';
    lecture.appendChild(lectureStrong);

    const subject = document.createElement('td');
    subject.textContent = r.subject || '—';

    const cls = document.createElement('td');
    const clsSpan = document.createElement('span');
    clsSpan.className = 'rt-class';
    clsSpan.textContent = r.class_name || '—';
    cls.appendChild(clsSpan);

    const absent = document.createElement('td');
    const pills = document.createElement('div');
    pills.className = 'rt-pills';
    const students = Array.isArray(r.students) ? r.students : [];
    if (students.length) {
      students.forEach(st => {
        const pill = document.createElement('span');
        pill.className = 'rt-name-pill';
        if (st.excused) pill.style.cssText = 'background:#fff4e6;color:#b35900;';
        pill.textContent = String(st.name || '').split(' ').slice(0, 2).join(' ') + (st.excused ? ` (${L.vacationLabel})` : '');
        pills.appendChild(pill);
      });
    } else {
      const none = document.createElement('span');
      none.className = 'rt-none';
      none.textContent = L.noneAbsent;
      pills.appendChild(none);
    }
    absent.appendChild(pills);

    const actions = document.createElement('td');
    const actionWrap = document.createElement('div');
    actionWrap.className = 'rt-actions';
    const edit = document.createElement('button');
    edit.className = 'btn-rt-edit';
    edit.textContent = L.btnEdit;
    edit.addEventListener('click', () => askEdit(r.id));
    const del = document.createElement('button');
    del.className = 'btn-rt-delete';
    del.textContent = L.confirmDelete;
    del.addEventListener('click', () => askDelete(r.id));
    actionWrap.appendChild(edit);
    actionWrap.appendChild(del);
    actions.appendChild(actionWrap);

    tr.appendChild(lecture); tr.appendChild(subject); tr.appendChild(cls);
    tr.appendChild(absent); tr.appendChild(actions);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  body.innerHTML = '';
  body.appendChild(wrap);
}

function askDelete(id) {
  pendingDeleteRow = id;
  pendingEditRow = null;
  document.getElementById('confirmOverlay').classList.add('show');
}
function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('show');
  pendingDeleteRow = null;
}

async function executeDelete() {
  if (!pendingDeleteRow) return;
  const id = pendingDeleteRow;
  closeConfirm();
  const L = LANGS[currentLang];
  showLoading(L.loadingDel);
  try {
    const res = await Api.rpc('delete_absence', { p_absence_id: id });
    if (!res || res.status !== 'DELETED') throw new Error('Unexpected delete response');
    todayRows = todayRows.filter(r => r.id !== id);
    renderRecentRows();
    const currentCls = document.getElementById('fClass').value;
    if (currentCls) refreshLectureAvailability(currentCls);
    hideLoading();
    showToast(L.toastDelOk, 'success');
  } catch (err) {
    hideLoading();
    if (err.isAuth) handleRpcError(err);
    else showToast(L.toastDelFail, 'error');
  }
}

async function askEdit(id) {
  const r = todayRows.find(x => x.id === id);
  if (!r) return;
  const L = LANGS[currentLang];

  pendingEditRow = r;   // set BEFORE refreshing availability so the row's own lecture is not greyed out
  document.getElementById('fClass').value = String(r.class_id || '');
  filterSubjectsForClass();
  document.getElementById('fSubject').value = String(r.subject_id || '');
  await refreshLectureAvailability(String(r.class_id || ''));
  document.getElementById('fLecture').value = r.lecture || '';

  const students = Array.isArray(r.students) ? r.students : [];
  selectedAbsent = new Set(students.map(s => s.id).filter(x => x != null));
  selectedExcused = new Set(students.filter(s => s.excused && s.id != null).map(s => s.id));
  renderStudents(String(r.class_id || ''));
  updateAbsentCount();
  renderAbsentPreview();

  sessionStorage.removeItem('formState');
  setText('btnSubmitText', L.btnUpdate || L.btnSubmit);
  hideLoading();
  showToast(L.toastEditReady, 'success');
  document.getElementById('screenSubmit').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── loading / toast ─────────────────────────────────────
function showLoading(msg) {
  setText('loadingText', msg || '...');
  document.getElementById('loadingOverlay').classList.add('show');
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

document.addEventListener('DOMContentLoaded', init);
