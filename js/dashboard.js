/* dashboard.js — admin dashboard (Supabase RPC + RLS; every action is re-checked by the database) */
const LANGS = {
  ku: {
    dir:'rtl', htmlLang:'ku',
    dInstName:'پەیمانگە', dSub:'تومارا نەهاتنا قوتابیان',
    btnLogout:'🚪 دەرچوون', searchPH:'🔍 ناڤێ یەکەم ی قوتابی بنووسە...',
    sTotalAbs:'📚 کۆی نەهاتن', sStudents:'👥 قوتابیان', sHighRisk:'🔴 مەترسیدار',
    sAtRisk:'🟠 فریادرەس', sClasses:'🏫 پۆلان',
    sHighRiskSub:'≥15 نەهاتن', sAtRiskSub:'8-14 نەهاتن',
    tabDaily:'📅 ڕۆژانە', tabWeekly:'📊 هەفتانە', tabMonthly:'📅 مانگانە',
    tabRoster:'📋 لیست', tabAnalytics:'📈 شیکاری',
    tabTeachers:'👨‍🏫 مامۆستایان', tabStudents:'👨‍🎓 قوتابیان', tabSubjects:'🏫 پۆل و بابەت', tabGraduates:'🎓 دەرچووان',
    dDailyTitle:'📅 ڕاپۆرتی ڕۆژانە', dDailySub:'کاتژمێر بە کاتژمێر نەهاتنی قوتابیان ببینە',
    dDateLabel:'📆 بەروار:', btnToday:'ئەمرۆ', btnYesterday:'دووێ',
    dWeeklyTitle:'📊 ڕاپۆرتی هەفتانە', dWeeklySub:'کۆی نەهاتنی هەفتەیەک',
    dWeekLabel:'📅 هەفتە:', btnPrint:'🖨️ چاپکرن',
    dMonthlyTitle:'📅 ڕاپۆرتی مانگانە', dMonthlySub:'کۆی نەهاتنی مانگێک',
    dMonthLabel:'📆 مانگ:',
    dRosterTitle:'📋 لیستی پۆل', dRosterSub:'ناڤی قوتابی کلیک بکە پرۆفایلی ببینیت',
    dClassLabel:'🏫 پۆل:', dMinAbsLabel:'🔢 کەمترین نەهاتن:',
    dAnalyticsTitle:'📈 شیکاری', dAnalyticsSub:'ئامارێن بەرفراوان',
    dPolicyTitle:'ڕێکخستنا سیاسەتی دەرکرن',
    dLecPerDay:'ژمارەی وانەیێن دابراون بۆ ١ ڕۆژ:',
    dExpDays:'ژمارەی ڕۆژانی دابراون بۆ دەرکرن:',
    dTeachersTitle:'👨‍🏫 بەڕێوەبردنی مامۆستایان', dTeachersSub:'زیادکرن، دەسکاریکرن و بینینی هەموو مامۆستایان',
    dStudentsTitle:'👨‍🎓 بەڕێوەبردنی قوتابیان', dStudentsSub:'بینین، زیادکرن، گواستنەوە و سڕینەوەی قوتابیان',
    btnAddTeacher:'➕ مامۆستایێ نوی', thTName:'ناڤ', thTUser:'یوزەرناڤ', thTPass:'پاسۆرد',
    thTClasses:'پۆلان', thTSubjects:'بابەت',
    cacheNote1:'📡 دوای هەر گۆڕانێ داتا دەبێت نوێ بکرێتەوە',
    cacheNote2:'📡 دوای هەر گۆڕانێ داتا دەبێت نوێ بکرێتەوە',
    btnClearCache1:'🔄 نوێکرنەوەی داتا', btnClearCache2:'🔄 نوێکرنەوەی داتا',
    classListTitle:'🏫 پۆلان', btnNewClass:'➕ پۆلێ نوی',
    selectClassHint:'← پۆلێک هەلبژێرە',
    editBtn:'✏️ دەسکاری', teacherModalTitle:'➕ مامۆستایێ نوی',
    editTeacherTitle:'✏️ دەسکاریکرنی مامۆستا',
    tmLblName:'ناڤی مامۆستا', tmLblUser:'یوزەرناڤ', tmLblPass:'پاسۆرد (بەتاڵ بهێلە بۆ نەگۆڕان)',
    tmLblClasses:'🏫 پۆلان و بابەتان',
    btnSaveTeacher:'تۆمارکرن',
    addStudentTitle:'➕ قوتابی زیادبکە', addStudentLbl:'ناڤی قوتابی',
    bulkStudentTitle:'➕ زیادکرنی چەند قوتابیێ',
    bulkStudentLbl:'ناڤەکان بنووسە یان کۆپی بکە (هەر ناڤێ لە ستوری جیا)',
    bulkHint:'دەتوانی ڕێزیکان لە Excel یان Word کۆپی بکەی — بە خودی خو پاک دەبێتەوە',
    moveStudentTitle:'↔️ گواستنەوەی قوتابی', moveToLbl:'بۆ کام پۆل؟',
    newClassTitle:'🏫 پۆلێ نوی دروستبکە', newClassLbl:'ناڤی پۆل',
    newClassStudentsLbl:'ناڤێن قوتابیان (هەر ناڤێ لە ستوری جیا)',
    newClassHint:'دەتوانی ڕێزیکان لە Excel یان Word کۆپی بکەی',
    mgmtConfirmTitle:'دڵنیایت؟',
    dSubjectsTitle:'🏫 بەڕێوەبردنی پۆل و بابەتان', dSubjectsSub:'پۆلی نوی زیادبکە و بابەتێن وی دیاربکە، یان یێن هەبوو دەسکاری بکە',
    btnAddSubject:'➕ زیادکرنی پۆل/بابەت', thSClass:'پۆل / قۆناغ', thSSubjects:'بابەتان',
    cacheNote3:'📡 دوای هەر گۆڕانێ داتا دەبێت نوێ بکرێتەوە', btnClearCache3:'🔄 نوێکرنەوەی داتا',
    subjectModalTitle:'➕ زیادکرنی پۆل/بابەت', editSubjectTitle:'✏️ دەسکاریکرنی پۆل/بابەت',
    smLblClass:'پۆل / قۆناغ (مثال: 1 یان 4pro)', smLblSubjects:'بابەتان (پارچەکراو ب +)',
    btnSaveSubject:'تۆمارکرن',
    renameClassTitle:'✏️ ناڤێ پۆلی بگۆڕە', renameClassOldLbl:'ناڤێ ئێستا', renameClassNewLbl:'ناڤێ نوی',
    renameClassHistoryLbl:'هەروەها تۆمارێن نەهاتنێ یێن پێشتر نوی بکە', btnSaveRenameClass:'تۆمارکرن',
    dGraduatesTitle:'🎓 دەرچووان', dGraduatesSub:'لیستا قوتابیێن دەرچوویی، بەپێی ساڵێ', gradYearLabel:'📆 ساڵ:',
    allYears:'هەمی ساڵان', promoteTitleGrad:'🎓 دەرچوون', promoteTitleMove:'➡️ بەرزکرن بۆ پۆلێ دی',
    promoteModeMoveBtn:'➡️ بەرزکرن بۆ پۆلێ دی', promoteModeGradBtn:'🎓 دەرچوون (ئارشیڤکرن)',
    promoteDestLbl:'بۆ کام پۆل؟', promoteYearLbl:'ساڵا دەرچوونێ',
    promoteStudentsLbl:'قوتابیان هەلبژێرە (هەمی بەسەرکەوتی هاتینە هەلبژارتن)',
    promoteCheckAll:'هەمی هەلبژێرە', promoteCheckNone:'هیچ هەلمەبژێرە', btnConfirmPromote:'تۆمارکرن',
    weekend:'🏖️ دەرفەت — مکتەب نییە', noAbsences:'هیچ نەهاتنێک نینە',
    selectWeek:'هەفتەیەک هەلبژێرە', selectMonth:'مانگێک هەلبژێرە', selectClass:'پۆلێک هەلبژێرە',
    weekLabel:'هەفتە', manageLabel:'🗑️ رێکخستنی تومارکرنان',
    noneAbsent:'هیچ', classLabel:'پۆل', totalLabel:'کۆ',
    studentLabel:'قوتابی', subjectLabel:'بابەت',
    vacationLabel:'مولەت',
    vacationReportTitle:'🏖️ ڕاپۆرتی مولەت', colVacationDays:'ڕۆژانی مولەت',
    badgeHigh:'مەترسیدار', badgeMedium:'ئاگاداربە', badgeLow:'باشە',
    profileClass:'🏫 پۆل', profileTotal:'📚 کۆی نەهاتن',
    profileSubjects:'📖 بابەتان', profileEntries:'📋 تومارکرن',
    profileHistory:'📋 مێژووی نەهاتن',
    colDate:'بەروار', colLecture:'وانە', colSubject:'بابەت', colTeacher:'مامۆستە',
    riskDismissed:'دەرکراو', riskHigh:'مەترسیدار', riskLow:'باشە',
    colDaysMissed:'ڕۆژانی دابراو', colRemaining:'ماوەی مایە', colStatus:'دۆخ',
    expulsionReport:'⚠️ ڕاپۆرتی مەترسی دەرکرن', expulsionDesc:'قوتابیانێ کە ب مەترسیدار',
    absByClass:'📊 نەهاتن بە پۆل', absByLec:'⏰ نەهاتن بە وانە', absBySubj:'📚 نەهاتن بە بابەت',
    pctLabel:'%', noResults:'هیچ قوتابیێک نەدۆزرایەوە',
    adminConfTitle:'تومارکرن بسڕەوە؟', adminConfWarning:'ئەم کارە نابێتە پووچەلکرن.',
    adminCancelBtn:'هەڵوەستان', adminDeleteBtn:'🗑️ بسڕەوە',
    toastDeleted:'✅ سڕایەوە.', toastDeleteFail:'❌ سڕینەوە سەرنەکەفت!',
    toastSaved:'✅ تۆمارکرا.', toastSaveFail:'❌ تۆمارکرن سەرنەکەفت!',
    toastCacheCleared:'✅ داتا نوێبویەوە.', toastCacheFail:'❌ نوێکرنەوە سەرنەکەفت!',
    lastUpdated:'✅ دوایین نوێکرنەوە:', loading:'⏳ بارکرن...',
    students:'قوتابی', academicYearLabel:'ساڵا خوێندنی',
    exportingPdf:'⏳ دروستکرنا PDF...', certTitle:'بەڵگەنامەیا نەهاتنێ',
    certSignature:'واژووی بەڕێوەبەر', certDate:'بەروار',
    reportGenerated:'ڕاپۆرت دروستکرا لە',
    tabSettings:'⚙️ ڕێکخستن',
    dSettingsTitle:'⚙️ ڕێکخستنێن سیستەمێ', dSettingsSub:'سیاسەتا نەهاتنێ، ساڵا خوێندنی و ناسنامەیا پەیمانگەهێ',
    stPolicyTitle:'🎯 سیاسەتا نەهاتنێ',
    setLecPerDayLbl:'ژمارەی وانەیێن دابراون بۆ ١ ڕۆژ:', setExpDaysLbl:'ژمارەی ڕۆژانی دابراون بۆ دەرکرن:',
    setAtRiskLbl:'سنوورێ ئاگاداریێ:', setHighRiskLbl:'سنوورێ مەترسیێ:',
    btnSavePolicy:'تۆمارکرنا سیاسەتێ',
    stAcademicTitle:'📅 ساڵا خوێندنی',
    setSchoolStartLbl:'دەستپێکا ساڵا خوێندنی:', btnSaveAcademicYear:'تۆمارکرنا ساڵا خوێندنی',
    stBrandingTitle:'🏫 ناسنامەیا پەیمانگەهێ',
    setNameKuLbl:'ناڤێ پەیمانگەهێ (کوردی)', setNameArLbl:'ناڤێ پەیمانگەهێ (عەرەبی)', setNameEnLbl:'ناڤێ پەیمانگەهێ (ئینگلیزی)',
    btnSaveNames:'تۆمارکرنا ناڤان',
    instituteLogoLbl:'لۆگۆیێ پەیمانگەهێ', ministryLogoLbl:'لۆگۆیێ وەزارەتێ',
    btnUploadInstituteLogo:'⬆️ بارکرن', btnUploadMinistryLogo:'⬆️ بارکرن',
    cacheNote4:'📡 دوای هەر گۆڕانێ داتا دەبێت نوێ بکرێتەوە', btnClearCache4:'🔄 نوێکرنەوەی داتا',
    policyDisabledNote:'⚙️ ئەڤێن ژ ڕێکخستن ⚙️ Settings دەستکاری دبن',
  },
  ar: {
    dir:'rtl', htmlLang:'ar',
    dInstName:'المعهد', dSub:'تسجيل غياب الطلاب',
    btnLogout:'🚪 تسجيل الخروج', searchPH:'🔍 ابحث باسم الطالب الأول...',
    sTotalAbs:'📚 إجمالي الغياب', sStudents:'👥 الطلاب', sHighRisk:'🔴 خطر عالٍ',
    sAtRisk:'🟠 تحت المراقبة', sClasses:'🏫 الشعب',
    sHighRiskSub:'≥15 غياب', sAtRiskSub:'8-14 غياب',
    tabDaily:'📅 يومي', tabWeekly:'📊 أسبوعي', tabMonthly:'📅 شهري',
    tabRoster:'📋 كشف', tabAnalytics:'📈 تحليلات',
    tabTeachers:'👨‍🏫 الأساتذة', tabStudents:'👨‍🎓 الطلاب', tabSubjects:'🏫 الشعب والمواد', tabGraduates:'🎓 الخريجون',
    dDailyTitle:'📅 التقرير اليومي', dDailySub:'عرض الغياب حصة بحصة',
    dDateLabel:'📆 التاريخ:', btnToday:'اليوم', btnYesterday:'أمس',
    dWeeklyTitle:'📊 التقرير الأسبوعي', dWeeklySub:'ملخص غياب الأسبوع',
    dWeekLabel:'📅 الأسبوع:', btnPrint:'🖨️ طباعة',
    dMonthlyTitle:'📅 التقرير الشهري', dMonthlySub:'ملخص غياب الشهر',
    dMonthLabel:'📆 الشهر:',
    dRosterTitle:'📋 كشف الصف', dRosterSub:'انقر على اسم الطالب لعرض ملفه',
    dClassLabel:'🏫 الشعبة:', dMinAbsLabel:'🔢 الحد الأدنى للغياب:',
    dAnalyticsTitle:'📈 التحليلات', dAnalyticsSub:'إحصاءات الغياب التفصيلية',
    dPolicyTitle:'إعداد سياسة الفصل',
    dLecPerDay:'عدد الحصص الغائبة لتحتسب يوماً:',
    dExpDays:'عدد الأيام لاتخاذ قرار الفصل:',
    dTeachersTitle:'👨‍🏫 إدارة الأساتذة', dTeachersSub:'إضافة وتعديل وعرض جميع الأساتذة',
    dStudentsTitle:'👨‍🎓 إدارة الطلاب', dStudentsSub:'عرض، إضافة، نقل وحذف الطلاب',
    btnAddTeacher:'➕ إضافة أستاذ', thTName:'الاسم', thTUser:'اسم المستخدم', thTPass:'كلمة المرور',
    thTClasses:'الشعب', thTSubjects:'المواد',
    cacheNote1:'📡 بعد كل تغيير يجب تحديث البيانات',
    cacheNote2:'📡 بعد كل تغيير يجب تحديث البيانات',
    btnClearCache1:'🔄 تحديث البيانات', btnClearCache2:'🔄 تحديث البيانات',
    classListTitle:'🏫 الشعب', btnNewClass:'➕ شعبة جديدة',
    selectClassHint:'← اختر شعبة',
    editBtn:'✏️ تعديل', teacherModalTitle:'➕ إضافة أستاذ جديد',
    editTeacherTitle:'✏️ تعديل الأستاذ',
    tmLblName:'اسم الأستاذ', tmLblUser:'اسم المستخدم', tmLblPass:'كلمة المرور (اتركها فارغة لعدم التغيير)',
    tmLblClasses:'🏫 الشعب والمواد',
    btnSaveTeacher:'حفظ',
    addStudentTitle:'➕ إضافة طالب', addStudentLbl:'اسم الطالب',
    bulkStudentTitle:'➕ إضافة عدة طلاب',
    bulkStudentLbl:'اكتب أو الصق الأسماء (اسم في كل سطر)',
    bulkHint:'يمكنك نسخ الأسماء من Excel أو Word — سيتم التنظيف تلقائياً',
    moveStudentTitle:'↔️ نقل الطالب', moveToLbl:'إلى أي شعبة؟',
    newClassTitle:'🏫 إنشاء شعبة جديدة', newClassLbl:'اسم الشعبة',
    newClassStudentsLbl:'أسماء الطلاب (اسم في كل سطر)',
    newClassHint:'يمكنك نسخ الأسماء من Excel أو Word',
    mgmtConfirmTitle:'هل أنت متأكد؟',
    dSubjectsTitle:'🏫 إدارة الشعب والمواد', dSubjectsSub:'أضف شعبة جديدة وحدد موادها، أو عدّل الموجود منها',
    btnAddSubject:'➕ إضافة شعبة/مواد', thSClass:'الشعبة / المرحلة', thSSubjects:'المواد',
    cacheNote3:'📡 بعد كل تغيير يجب تحديث البيانات', btnClearCache3:'🔄 تحديث البيانات',
    subjectModalTitle:'➕ إضافة شعبة/مواد', editSubjectTitle:'✏️ تعديل الشعبة/المواد',
    smLblClass:'الشعبة / المرحلة (مثال: 1 أو 4pro)', smLblSubjects:'المواد (مفصولة بـ +)',
    btnSaveSubject:'حفظ',
    renameClassTitle:'✏️ إعادة تسمية الشعبة', renameClassOldLbl:'الاسم الحالي', renameClassNewLbl:'الاسم الجديد',
    renameClassHistoryLbl:'تحديث سجلات الغياب السابقة أيضًا', btnSaveRenameClass:'حفظ',
    dGraduatesTitle:'🎓 الخريجون', dGraduatesSub:'قائمة الطلاب الخريجين، حسب السنة', gradYearLabel:'📆 السنة:',
    allYears:'كل السنوات', promoteTitleGrad:'🎓 تخريج', promoteTitleMove:'➡️ ترفيع إلى شعبة أخرى',
    promoteModeMoveBtn:'➡️ ترفيع إلى شعبة أخرى', promoteModeGradBtn:'🎓 تخريج (أرشفة)',
    promoteDestLbl:'إلى أي شعبة؟', promoteYearLbl:'سنة التخرج',
    promoteStudentsLbl:'اختر الطلاب (الجميع محدد افتراضيًا كناجحين)',
    promoteCheckAll:'تحديد الكل', promoteCheckNone:'إلغاء التحديد', btnConfirmPromote:'حفظ',
    weekend:'🏖️ عطلة — لا دوام', noAbsences:'لا يوجد غياب',
    selectWeek:'اختر أسبوعاً', selectMonth:'اختر شهراً', selectClass:'اختر شعبة',
    weekLabel:'أسبوع', manageLabel:'🗑️ إدارة التسجيلات',
    noneAbsent:'لا غياب', classLabel:'الشعبة', totalLabel:'الإجمالي',
    studentLabel:'الطالب', subjectLabel:'المادة',
    vacationLabel:'اجازة',
    vacationReportTitle:'🏖️ تقرير الإجازات', colVacationDays:'أيام الإجازة',
    badgeHigh:'خطر', badgeMedium:'مراقبة', badgeLow:'جيد',
    profileClass:'🏫 الشعبة', profileTotal:'📚 إجمالي الغياب',
    profileSubjects:'📖 المواد المتأثرة', profileEntries:'📋 عدد السجلات',
    profileHistory:'📋 سجل الغياب الكامل',
    colDate:'التاريخ', colLecture:'الحصة', colSubject:'المادة', colTeacher:'الأستاذ',
    riskDismissed:'مفصول', riskHigh:'خطر', riskLow:'جيد',
    colDaysMissed:'أيام الغياب', colRemaining:'المتبقي', colStatus:'الحالة',
    expulsionReport:'⚠️ تقرير خطر الفصل', expulsionDesc:'تتبع الطلاب المعرضين لخطر الفصل',
    absByClass:'📊 الغياب حسب الشعبة', absByLec:'⏰ الغياب حسب الحصة', absBySubj:'📚 الغياب حسب المادة',
    pctLabel:'%', noResults:'لا يوجد طلاب مطابقون',
    adminConfTitle:'حذف التسجيل؟', adminConfWarning:'لا يمكن التراجع عن هذا.',
    adminCancelBtn:'إلغاء', adminDeleteBtn:'🗑️ حذف',
    toastDeleted:'✅ تم الحذف.', toastDeleteFail:'❌ فشل الحذف!',
    toastSaved:'✅ تم الحفظ.', toastSaveFail:'❌ فشل الحفظ!',
    toastCacheCleared:'✅ تم تحديث البيانات.', toastCacheFail:'❌ فشل التحديث!',
    lastUpdated:'✅ آخر تحديث:', loading:'⏳ جارٍ التحميل...',
    students:'طالب', academicYearLabel:'السنة الدراسية',
    exportingPdf:'⏳ جارٍ إنشاء PDF...', certTitle:'شهادة الغياب',
    certSignature:'توقيع الإدارة', certDate:'التاريخ',
    reportGenerated:'تم إنشاء التقرير في',
    tabSettings:'⚙️ الإعدادات',
    dSettingsTitle:'⚙️ إعدادات النظام', dSettingsSub:'سياسة الغياب، السنة الدراسية، وهوية المعهد',
    stPolicyTitle:'🎯 سياسة الغياب',
    setLecPerDayLbl:'عدد الحصص الغائبة لتحتسب يوماً:', setExpDaysLbl:'عدد الأيام لاتخاذ قرار الفصل:',
    setAtRiskLbl:'حد التحذير:', setHighRiskLbl:'حد الخطر:',
    btnSavePolicy:'حفظ السياسة',
    stAcademicTitle:'📅 السنة الدراسية',
    setSchoolStartLbl:'بداية السنة الدراسية:', btnSaveAcademicYear:'حفظ السنة الدراسية',
    stBrandingTitle:'🏫 هوية المعهد',
    setNameKuLbl:'اسم المعهد (كردي)', setNameArLbl:'اسم المعهد (عربي)', setNameEnLbl:'اسم المعهد (إنجليزي)',
    btnSaveNames:'حفظ الأسماء',
    instituteLogoLbl:'شعار المعهد', ministryLogoLbl:'شعار الوزارة',
    btnUploadInstituteLogo:'⬆️ رفع', btnUploadMinistryLogo:'⬆️ رفع',
    cacheNote4:'📡 بعد كل تغيير يجب تحديث البيانات', btnClearCache4:'🔄 تحديث البيانات',
    policyDisabledNote:'⚙️ يتم تعديل هذه القيم من تبويب ⚙️ الإعدادات',
  },
  en: {
    dir:'ltr', htmlLang:'en',
    dInstName:'Institute', dSub:'Student Absence Dashboard',
    btnLogout:'🚪 Logout', searchPH:'🔍 Search by first name...',
    sTotalAbs:'📚 Total Absences', sStudents:'👥 Students', sHighRisk:'🔴 High Risk',
    sAtRisk:'🟠 At Risk', sClasses:'🏫 Classes',
    sHighRiskSub:'≥15 absences', sAtRiskSub:'8-14 absences',
    tabDaily:'📅 Daily', tabWeekly:'📊 Weekly', tabMonthly:'📅 Monthly',
    tabRoster:'📋 Roster', tabAnalytics:'📈 Analytics',
    tabTeachers:'👨‍🏫 Teachers', tabStudents:'👨‍🎓 Students', tabSubjects:'🏫 Classes & Subjects', tabGraduates:'🎓 Graduates',
    dDailyTitle:'📅 Daily Absence Report', dDailySub:'View absence breakdown by lecture and class',
    dDateLabel:'📆 Date:', btnToday:'Today', btnYesterday:'Yesterday',
    dWeeklyTitle:'📊 Weekly Report', dWeeklySub:'Weekly absence summaries',
    dWeekLabel:'📅 Week:', btnPrint:'🖨️ Print',
    dMonthlyTitle:'📅 Monthly Report', dMonthlySub:'Monthly absence trends',
    dMonthLabel:'📆 Month:',
    dRosterTitle:'📋 Class Roster', dRosterSub:'Click a student name to view their profile',
    dClassLabel:'🏫 Class:', dMinAbsLabel:'🔢 Min Absences:',
    dAnalyticsTitle:'📈 Analytics', dAnalyticsSub:'Data-driven insights across classes',
    dPolicyTitle:'Policy Risk Configuration',
    dLecPerDay:'Lectures missed to count as 1 day:',
    dExpDays:'Days missed threshold for dismissal:',
    dTeachersTitle:'👨‍🏫 Teacher Management', dTeachersSub:'Add, edit and view all teachers',
    dStudentsTitle:'👨‍🎓 Student Management', dStudentsSub:'View, add, move and remove students',
    btnAddTeacher:'➕ Add Teacher', thTName:'Name', thTUser:'Username', thTPass:'Password',
    thTClasses:'Classes', thTSubjects:'Subjects',
    cacheNote1:'📡 After any change, refresh data so teachers see updates immediately',
    cacheNote2:'📡 After any change, refresh data so teachers see updates immediately',
    btnClearCache1:'🔄 Refresh Data', btnClearCache2:'🔄 Refresh Data',
    classListTitle:'🏫 Classes', btnNewClass:'➕ New Class',
    selectClassHint:'← Select a class',
    editBtn:'✏️ Edit', teacherModalTitle:'➕ Add New Teacher',
    editTeacherTitle:'✏️ Edit Teacher',
    tmLblName:'Teacher Name', tmLblUser:'Username', tmLblPass:'Password (leave blank to keep unchanged)',
    tmLblClasses:'🏫 Classes & Subjects',
    btnSaveTeacher:'Save',
    addStudentTitle:'➕ Add Student', addStudentLbl:'Student Name',
    bulkStudentTitle:'➕ Add Multiple Students',
    bulkStudentLbl:'Type or paste names (one per line)',
    bulkHint:'You can copy names from Excel or Word — auto-cleaned',
    moveStudentTitle:'↔️ Move Student', moveToLbl:'Move to which class?',
    newClassTitle:'🏫 Create New Class', newClassLbl:'Class Name',
    newClassStudentsLbl:'Student Names (one per line)',
    newClassHint:'You can paste names from Excel or Word',
    mgmtConfirmTitle:'Are you sure?',
    dSubjectsTitle:'🏫 Manage Classes & Subjects', dSubjectsSub:'Add a new class and set its subjects, or edit an existing one',
    btnAddSubject:'➕ Add Class/Subjects', thSClass:'Class / Stage', thSSubjects:'Subjects',
    cacheNote3:'📡 After any change, refresh data so teachers see updates immediately',
    btnClearCache3:'🔄 Refresh Data',
    subjectModalTitle:'➕ Add Class/Subjects', editSubjectTitle:'✏️ Edit Class/Subjects',
    smLblClass:'Class / Stage (e.g. 1 or 4pro)', smLblSubjects:'Subjects (separated by +)',
    btnSaveSubject:'Save',
    renameClassTitle:'✏️ Rename Class', renameClassOldLbl:'Current Name', renameClassNewLbl:'New Name',
    renameClassHistoryLbl:'Also update past absence records', btnSaveRenameClass:'Save',
    dGraduatesTitle:'🎓 Graduates', dGraduatesSub:'List of graduated students, by year', gradYearLabel:'📆 Year:',
    allYears:'All Years', promoteTitleGrad:'🎓 Graduate', promoteTitleMove:'➡️ Promote to another class',
    promoteModeMoveBtn:'➡️ Promote to another class', promoteModeGradBtn:'🎓 Graduate (archive)',
    promoteDestLbl:'To which class?', promoteYearLbl:'Graduation Year',
    promoteStudentsLbl:'Select students (everyone is checked as passing by default)',
    promoteCheckAll:'Select All', promoteCheckNone:'Select None', btnConfirmPromote:'Save',
    weekend:'🏖️ Weekend — No School', noAbsences:'No absences recorded',
    selectWeek:'Select a week', selectMonth:'Select a month', selectClass:'Select a class',
    weekLabel:'Week', manageLabel:'🗑️ Manage Submissions',
    noneAbsent:'None', classLabel:'Class', totalLabel:'TOTAL',
    studentLabel:'Student', subjectLabel:'Subject',
    vacationLabel:'Vacation',
    vacationReportTitle:'🏖️ Vacation Days Report', colVacationDays:'Vacation Days',
    badgeHigh:'HIGH RISK', badgeMedium:'AT RISK', badgeLow:'GOOD',
    profileClass:'🏫 Class', profileTotal:'📚 Total Absences',
    profileSubjects:'📖 Subjects Affected', profileEntries:'📋 Total Entries',
    profileHistory:'📋 Complete Absence History',
    colDate:'Date', colLecture:'Lecture', colSubject:'Subject', colTeacher:'Teacher',
    riskDismissed:'DISMISSED', riskHigh:'HIGH RISK', riskLow:'LOW RISK',
    colDaysMissed:'Days Missed', colRemaining:'Days Left', colStatus:'Status',
    expulsionReport:'⚠️ Expulsion Risk Report', expulsionDesc:'Students flagged based on configured policy',
    absByClass:'📊 Absences by Class', absByLec:'⏰ Absences by Lecture', absBySubj:'📚 Absences by Subject',
    pctLabel:'%', noResults:'No students found',
    adminConfTitle:'Delete this submission?', adminConfWarning:'This cannot be undone.',
    adminCancelBtn:'Cancel', adminDeleteBtn:'🗑️ Delete',
    toastDeleted:'✅ Deleted.', toastDeleteFail:'❌ Delete failed!',
    toastSaved:'✅ Saved successfully.', toastSaveFail:'❌ Save failed!',
    toastCacheCleared:'✅ Data refreshed.', toastCacheFail:'❌ Refresh failed!',
    lastUpdated:'✅ Last updated:', loading:'⏳ Loading...',
    students:'students', academicYearLabel:'Academic Year',
    exportingPdf:'⏳ Generating PDF...', certTitle:'Absence Certificate',
    certSignature:'Admin Signature', certDate:'Date',
    reportGenerated:'Report generated on',
    tabSettings:'⚙️ Settings',
    dSettingsTitle:'⚙️ System Settings', dSettingsSub:'Absence policy, academic year and institute identity',
    stPolicyTitle:'🎯 Absence Policy',
    setLecPerDayLbl:'Lectures missed to count as 1 day:', setExpDaysLbl:'Days missed threshold for dismissal:',
    setAtRiskLbl:'At-risk threshold:', setHighRiskLbl:'High-risk threshold:',
    btnSavePolicy:'Save Policy',
    stAcademicTitle:'📅 Academic Year',
    setSchoolStartLbl:'School year start date:', btnSaveAcademicYear:'Save Academic Year',
    stBrandingTitle:'🏫 Institute Branding',
    setNameKuLbl:'Institute Name (Kurdish)', setNameArLbl:'Institute Name (Arabic)', setNameEnLbl:'Institute Name (English)',
    btnSaveNames:'Save Names',
    instituteLogoLbl:'Institute Logo', ministryLogoLbl:'Ministry Logo',
    btnUploadInstituteLogo:'⬆️ Upload', btnUploadMinistryLogo:'⬆️ Upload',
    cacheNote4:'📡 After any change, refresh data so teachers see updates immediately',
    btnClearCache4:'🔄 Refresh Data',
    policyDisabledNote:'⚙️ These values are edited from the ⚙️ Settings tab',
  }
};

Object.assign(LANGS.ku, {
  stStagesTitle:'🏫 ژمارا قۆناغان', setStagesCountLbl:'ژمارا قۆناغان (نموونە: 5)',
  stStagesNote:'قۆناغا دواهیێ بۆ دەرچوون (Graduate) دهێتە بکارئینان، نە بۆ بەرزکرن.', btnSaveStages:'تۆمارکرنا قۆناغان'
});
Object.assign(LANGS.ar, {
  stStagesTitle:'🏫 عدد المراحل', setStagesCountLbl:'عدد المراحل الدراسية (مثال: 5)',
  stStagesNote:'المرحلة الأخيرة تُستخدم للتخريج بدلاً من الترفيع.', btnSaveStages:'حفظ عدد المراحل'
});
Object.assign(LANGS.en, {
  stStagesTitle:'🏫 Number of Stages', setStagesCountLbl:'Number of stages (e.g. 5)',
  stStagesNote:'The last stage is used for graduation instead of promotion.', btnSaveStages:'Save Stages'
});

// ── extra strings (password handling, working days) ───────────────────
Object.assign(LANGS.ku, {
  credTitle:'🔑 زانیارییێن چوونا ژوور', credUserLbl:'یوزەرناڤ:', credPassLbl:'پاسۆردێ دەمکی:',
  credNote:'ئەڤ پاسۆرده تەنێ جارەکێ دهێتە نیشاندان و ناهێتە پاشەکەفتکرن. بدە مامۆستای.',
  btnCopyCred:'کۆپی بکە', btnCloseCred:'داخستن', resetConfirm:'پاسۆردەکێ دەمکی یێ نوی بۆ ئەڤ مامۆستایە دروست بکەم؟',
  workingDaysTitle:'📅 ڕۆژێن کاری', btnSaveWorkingDays:'💾 تۆمارکرنا ڕۆژێن کاری',
  workingDaysHint:'تەنێ ئەو ڕۆژان هەلبژێرە کو پەیمانگە تێدا کار دکەت. ل ڕۆژێن دی تومارکرن ناهێتە کرن.',
  dayNames:{Sunday:'یەکشەمب',Monday:'دووشەمب',Tuesday:'سێشەمب',Wednesday:'چوارشەمب',Thursday:'پێنجشەمب',Friday:'هەینی',Saturday:'شەمی'},
  toastCopied:'✅ هاتە کۆپیکرن.', selectOneDay:'❌ کەمەک ڕۆژەکێ هەلبژێرە.'
});
Object.assign(LANGS.ar, {
  credTitle:'🔑 بيانات الدخول', credUserLbl:'اسم المستخدم:', credPassLbl:'كلمة المرور المؤقتة:',
  credNote:'تظهر كلمة المرور هذه مرة واحدة فقط ولا يتم حفظها. سلّمها للأستاذ.',
  btnCopyCred:'نسخ', btnCloseCred:'إغلاق', resetConfirm:'إنشاء كلمة مرور مؤقتة جديدة لهذا الأستاذ؟',
  workingDaysTitle:'📅 أيام الدوام', btnSaveWorkingDays:'💾 حفظ أيام الدوام',
  workingDaysHint:'اختر فقط الأيام التي يعمل فيها المعهد. يُمنع تسجيل الغياب في الأيام الأخرى.',
  dayNames:{Sunday:'الأحد',Monday:'الاثنين',Tuesday:'الثلاثاء',Wednesday:'الأربعاء',Thursday:'الخميس',Friday:'الجمعة',Saturday:'السبت'},
  toastCopied:'✅ تم النسخ.', selectOneDay:'❌ اختر يوماً واحداً على الأقل.'
});
Object.assign(LANGS.en, {
  credTitle:'🔑 Login details', credUserLbl:'Username:', credPassLbl:'Temporary password:',
  credNote:'This password is shown once and is not stored. Give it to the teacher.',
  btnCopyCred:'Copy', btnCloseCred:'Close', resetConfirm:'Create a new temporary password for this teacher?',
  workingDaysTitle:'📅 Working Days', btnSaveWorkingDays:'💾 Save Working Days',
  workingDaysHint:'Select only the days when the institute operates. Attendance submission is blocked on other days.',
  dayNames:{Sunday:'Sunday',Monday:'Monday',Tuesday:'Tuesday',Wednesday:'Wednesday',Thursday:'Thursday',Friday:'Friday',Saturday:'Saturday'},
  toastCopied:'✅ Copied.', selectOneDay:'❌ Select at least one working day.'
});

// Fallback only; overwritten by loadSettings() from the database value.
let SCHOOL_START = (function () { const n = new Date(); return '9/1/' + (n.getMonth() >= 8 ? n.getFullYear() : n.getFullYear() - 1); })();

let currentLang = localStorage.getItem('aci_lang') || 'ku';
let classes = [], weeks = [], months = [];
let adminProfile = null;
let adminPendingId = null;
let dailyRows = [];            // rows of the day shown in the Daily tab
let mgmtData = null;           // normalised result of admin_manage_data
let appSettings = null;        // key/value map from get_settings
let instituteLogoUrl = DEFAULT_LOGO_DATA_URI;
let ministryLogoUrl = DEFAULT_LOGO_DATA_URI;

// ── server calls ───────────────────────────────────────
// All data comes from SECURITY DEFINER functions that re-check "is admin" in the database.
async function call(name, args) {
  try {
    return await Api.rpc(name, args);
  } catch (err) {
    if (err.isAuth) {
      showToast('❌ Session expired — please log in again.', 'error');
      setTimeout(doLogout, 1200);
    }
    throw err;
  }
}
async function doLogout() { await Api.logout(); navigateTo('login'); }

// ── i18n ───────────────────────────────────────────────
function getAcademicYear() {
  const now = new Date(); const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function setLang(lang) {
  if (!LANGS[lang]) return;
  currentLang = lang;
  localStorage.setItem('aci_lang', lang);
  const L = LANGS[lang];
  document.documentElement.dir = L.dir;
  document.documentElement.lang = L.htmlLang;
  document.getElementById('dAcademicYear').textContent = (L.academicYearLabel || 'Academic Year') + ': ' + getAcademicYear();

  const ids = ['dInstName','dSub','btnLogout','sTotalAbs','sStudents','sHighRisk','sAtRisk',
    'sClasses','sHighRiskSub','sAtRiskSub','dDailyTitle','dDailySub','dDateLabel',
    'btnToday','btnYesterday','dWeeklyTitle','dWeeklySub','dWeekLabel','dMonthlyTitle',
    'dMonthlySub','dMonthLabel','dRosterTitle','dRosterSub','dClassLabel','dMinAbsLabel',
    'dAnalyticsTitle','dAnalyticsSub','dPolicyTitle','dLecPerDay','dExpDays','policyDisabledNote',
    'adminConfTitle','adminConfWarning','adminCancelBtn','adminDeleteBtn',
    'dTeachersTitle','dTeachersSub','dStudentsTitle','dStudentsSub',
    'btnAddTeacher','thTName','thTUser','thTPass','thTClasses','thTSubjects',
    'cacheNote1','cacheNote2','btnClearCache1','btnClearCache2',
    'classListTitle','btnNewClass','selectClassHint',
    'teacherModalTitle','tmLblName','tmLblUser','tmLblPass','tmLblClasses','btnSaveTeacher',
    'addStudentTitle','addStudentLbl','bulkStudentTitle','bulkStudentLbl','bulkHint',
    'moveStudentTitle','moveToLbl','newClassTitle','newClassLbl','newClassStudentsLbl','newClassHint',
    'mgmtConfirmTitle',
    'dSubjectsTitle','dSubjectsSub','btnAddSubject','thSClass','thSSubjects',
    'cacheNote3','btnClearCache3','subjectModalTitle','smLblClass','smLblSubjects','btnSaveSubject',
    'renameClassTitle','renameClassOldLbl','renameClassNewLbl','renameClassHistoryLbl','btnSaveRenameClass',
    'dGraduatesTitle','dGraduatesSub','gradYearLabel',
    'promoteModeMoveBtn','promoteModeGradBtn','promoteDestLbl','promoteYearLbl','promoteStudentsLbl',
    'promoteCheckAll','promoteCheckNone','btnConfirmPromote',
    'dSettingsTitle','dSettingsSub','stPolicyTitle','setLecPerDayLbl','setExpDaysLbl','setAtRiskLbl',
    'setHighRiskLbl','btnSavePolicy','stAcademicTitle','setSchoolStartLbl','btnSaveAcademicYear',
    'stBrandingTitle','setNameKuLbl','setNameArLbl','setNameEnLbl','btnSaveNames',
    'instituteLogoLbl','ministryLogoLbl','btnUploadInstituteLogo','btnUploadMinistryLogo',
    'cacheNote4','btnClearCache4','stStagesTitle','setStagesCountLbl','stStagesNote','btnSaveStages',
    'workingDaysTitle','btnSaveWorkingDays','workingDaysHint','credTitle','credUserLbl','credPassLbl','credNote',
    'btnCopyCred','btnCloseCred'];
  ids.forEach(id => { const el = document.getElementById(id); if (el && L[id]) el.textContent = L[id]; });

  document.querySelectorAll('#workingDaysBox .working-day-item').forEach(item => {
    const nameEl = item.querySelector('.working-day-name');
    if (nameEl && L.dayNames) nameEl.textContent = L.dayNames[item.dataset.day] || item.dataset.day;
  });

  ['daily','weekly','monthly','roster','analytics','teachers','students','subjects','graduates','settings'].forEach(t => {
    const key = 'tab' + t.charAt(0).toUpperCase() + t.slice(1);
    const el = document.getElementById('tab-' + t);
    if (el && L[key]) el.textContent = L[key];
  });
  ['btnPrintD','btnPrintW','btnPrintM','btnPrintR','btnPrintGrad'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = L.btnPrint;
  });

  document.getElementById('searchInput').placeholder = L.searchPH;
  populateStageSelect();
  document.querySelectorAll('.lang-btn').forEach((b, i) => { b.classList.toggle('active', ['ku','ar','en'][i] === lang); });

  const active = document.querySelector('.content-section.active');
  if (active) {
    const id = active.id;
    if (id === 'daily') renderDaily();
    if (id === 'weekly') loadWeekly();
    if (id === 'monthly') loadMonthly();
    if (id === 'roster') filterRoster();
    if (id === 'analytics') loadAnalytics();
    if (id === 'teachers') renderTeacherTable();
    if (id === 'students') renderStudentTab();
    if (id === 'subjects') renderSubjectTable();
    if (id === 'graduates') renderGraduatesList();
    if (id === 'settings') renderSettingsForm();
  }
}

// ── helpers ────────────────────────────────────────────
function pad2(n) { return String(n).padStart(2, '0'); }
function isoDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function getFirstName(n) { return n ? n.trim().split(/\s+/)[0] : ''; }
function getThreeNames(n) { return n ? n.trim().split(/\s+/).slice(0, 3).join(' ') : ''; }
function formatDate(d) { if (!d || isNaN(d.getTime())) return ''; return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`; }
function escHtml(v) {
  const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  return String(v == null ? '' : v).replace(/[&<>"']/g, ch => map[ch]);
}
function sortNames(list) { return [...list].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })); }

function getWorkingDaysList() {
  const raw = (appSettings && appSettings.working_days) || 'Sunday,Monday,Tuesday,Wednesday,Thursday';
  return raw.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
}
function isConfiguredWorkingDay(date) {
  const names = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  return getWorkingDaysList().indexOf(names[date.getDay()]) !== -1;
}

function getSeverity(n) {
  const high = appSettings ? (parseInt(appSettings.high_risk_threshold) || 15) : 15;
  const at = appSettings ? (parseInt(appSettings.at_risk_threshold) || 8) : 8;
  return n >= high ? 'high' : n >= at ? 'medium' : 'low';
}
function getBadge(n) {
  const L = LANGS[currentLang]; const s = getSeverity(n);
  const t = s === 'high' ? L.badgeHigh : s === 'medium' ? L.badgeMedium : L.badgeLow;
  return `<span class="badge badge-${s}">${t}</span>`;
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

// Smart name cleaner for pasted lists (Excel / Word)
function cleanPastedNames(raw) {
  return raw.split('\n')
    .map(line => line.replace(/^\d+[\.\)\-\s]+/, '').replace(/\t/g, ' ').trim())
    .map(line => {
      const words = line.split(/\s{2,}|\t/).map(w => w.trim()).filter(Boolean);
      const namePart = words.find(w => /[^\d\s]/.test(w) && w.split(' ').length >= 1) || line;
      return namePart.trim();
    })
    .filter(n => n.length > 1 && /\S/.test(n));
}

// ── top stat cards ─────────────────────────────────────
async function updateStats() {
  try {
    const s = await call('dashboard_stats');
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('totalAbsences', s.total_absences);
    set('totalStudents', s.students_total);
    set('highRisk', s.high_risk);
    set('atRisk', s.at_risk);
    set('totalClasses', s.classes_total);
  } catch (e) { console.warn('updateStats:', e.message); }
}

// ── search (database side) ─────────────────────────────
let _searchTimer = null;
function onSearch() {
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(runSearch, 250);
}
async function runSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const dropdown = document.getElementById('dropdownResults');
  const L = LANGS[currentLang];
  if (query.length < 2) { dropdown.classList.remove('show'); return; }
  let list = [];
  try { list = await call('search_absent_students', { p_query: query }); } catch (e) { return; }
  if (document.getElementById('searchInput').value.trim() !== query) return;   // stale answer
  dropdown.classList.add('show');
  if (!list.length) {
    dropdown.innerHTML = `<div class="dropdown-empty">🔍 ${L.noResults} "<strong>${escHtml(query)}</strong>"</div>`;
    return;
  }
  dropdown.innerHTML = list.map(d => {
    const sev = getSeverity(d.total_unexcused);
    const badge = sev === 'high' ? L.badgeHigh : sev === 'medium' ? L.badgeMedium : L.badgeLow;
    return `<div class="dropdown-item" onclick="openStudent(${d.student_id || 'null'},'${encodeURIComponent(d.name)}')">
      <div class="dropdown-name">${escHtml(getThreeNames(d.name))} <span class="badge badge-${sev}">${badge}</span></div>
      <div class="dropdown-info">${L.classLabel} ${escHtml(d.class || '?')} • ${d.total_unexcused} ${L.sTotalAbs || 'abs'} • ${d.subjects} ${L.subjectLabel || 'subj'}</div>
    </div>`;
  }).join('');
}
function openStudent(id, encodedName) {
  document.getElementById('dropdownResults').classList.remove('show');
  document.getElementById('searchInput').value = '';
  showStudentProfile(id, decodeURIComponent(encodedName));
}
document.addEventListener('click', e => {
  if (!e.target.closest('#searchInput') && !e.target.closest('#dropdownResults'))
    document.getElementById('dropdownResults').classList.remove('show');
});

// ── refresh the visible tab (also runs every 5 min during school hours) ──
async function refreshActive() {
  const L = LANGS[currentLang];
  document.getElementById('lastUpdate').innerHTML = `<span style="color:#667eea;">${L.loading}</span>`;
  try {
    await Promise.all([updateStats(), fetchManageData().catch(() => {})]);
    const active = document.querySelector('.content-section.active');
    const id = active ? active.id : 'daily';
    if (id === 'daily') await filterDaily();
    if (id === 'weekly') await loadWeekly();
    if (id === 'monthly') await loadMonthly();
    if (id === 'roster') { loadRosterDropdown(); }
    if (id === 'analytics') await loadAnalytics();
    document.getElementById('lastUpdate').innerHTML = `<span style="color:#4CAF50;">${L.lastUpdated} ${new Date().toLocaleTimeString()}</span>`;
  } catch (err) {
    document.getElementById('lastUpdate').innerHTML = `<span style="color:#ff4444;">❌ ${escHtml(err.message)}</span>`;
  }
}

// ── week / month builders ──────────────────────────────
function getWeeks() {
  const start = new Date(SCHOOL_START); if (isNaN(start.getTime())) return [];
  const arr = []; let cur = new Date(start); let num = 1;
  cur.setDate(cur.getDate() - cur.getDay()); const now = new Date();
  while (cur <= now) { const ws = new Date(cur), we = new Date(cur); we.setDate(we.getDate() + 6); if (ws <= now) arr.push({ number: num++, start: ws, end: we }); cur.setDate(cur.getDate() + 7); }
  return arr.reverse();
}
function getMonths() {
  const start = new Date(SCHOOL_START); if (isNaN(start.getTime())) return [];
  const arr = []; let cur = new Date(start.getFullYear(), start.getMonth(), 1); const now = new Date();
  while (cur <= now) { const ms = new Date(cur), me = new Date(cur.getFullYear(), cur.getMonth() + 1, 0); arr.push({ name: ms.toLocaleString('default', { month: 'long', year: 'numeric' }), start: ms, end: me }); cur.setMonth(cur.getMonth() + 1); }
  return arr.reverse();
}

// ── DAILY ──────────────────────────────────────────────
function setToday() { document.getElementById('dailyDate').value = isoDate(new Date()); filterDaily(); }
function setPrevDay() { const d = new Date(); d.setDate(d.getDate() - 1); document.getElementById('dailyDate').value = isoDate(d); filterDaily(); }
function loadDaily() { if (!document.getElementById('dailyDate').value) setToday(); else filterDaily(); }

async function filterDaily() {
  const L = LANGS[currentLang];
  const val = document.getElementById('dailyDate').value;
  if (!val) return;
  const el = document.getElementById('dailyContent');
  if (!isConfiguredWorkingDay(new Date(val + 'T00:00:00'))) {
    dailyRows = [];
    el.innerHTML = `<div style="text-align:center;padding:80px 20px;"><div style="font-size:5em;margin-bottom:20px;">🏖️</div><h2 style="color:#667eea;font-size:1.8em;">${L.weekend}</h2></div>`;
    return;
  }
  el.innerHTML = `<div style="text-align:center;padding:50px;color:#667eea;font-size:1.1em;">${L.loading}</div>`;
  try {
    dailyRows = await call('report_rows', { p_from: val, p_to: val });
  } catch (err) {
    el.innerHTML = `<div style="text-align:center;padding:50px;color:#c33;">❌ ${escHtml(err.message)}</div>`;
    return;
  }
  renderDaily();
}

function renderDaily() {
  const L = LANGS[currentLang];
  const val = document.getElementById('dailyDate').value;
  const el = document.getElementById('dailyContent');
  if (!val || !isConfiguredWorkingDay(new Date(val + 'T00:00:00'))) { if (val) filterDaily(); return; }

  const names = new Set(classes);
  dailyRows.forEach(r => names.add(r.class));
  const byClass = {};
  sortNames([...names]).forEach(c => { byClass[c] = {}; });

  dailyRows.forEach(row => {
    if (!row.class) return;
    const nums = String(row.lecture).match(/\d+/g) || ['1'];
    nums.forEach(n => {
      const num = parseInt(n, 10);
      if (num < 1 || num > 6) return;
      if (!byClass[row.class][num]) byClass[row.class][num] = { subject: row.subject, teacher: row.teacher, time: row.time, students: [] };
      const cell = byClass[row.class][num];
      (row.students || []).forEach(st => {
        if (!cell.students.some(x => x.fullName === st.name)) {
          cell.students.push({ name: getThreeNames(st.name), fullName: st.name, excused: !!st.excused, asId: st.as_id });
        }
      });
    });
  });

  const rtl = document.documentElement.dir === 'rtl';
  const lecPrefix = (typeof LEC_PREFIX !== 'undefined' && LEC_PREFIX[currentLang]) || 'Lec';
  let html = '';
  Object.keys(byClass).forEach(cls => {
    const lecs = byClass[cls];
    html += `<div class="chart-box"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><h3 style="color:#667eea;font-size:1.3em;margin:0;">🏫 ${L.classLabel} ${escHtml(cls)}</h3><p style="color:#666;margin:0;font-size:0.9em;">📅 ${formatDMY(val)}</p></div>`;
    html += `<div class="table-wrap"><table><thead><tr>`;
    for (let i = 1; i <= 6; i++) html += `<th style="text-align:center;">${lecPrefix} ${i}</th>`;
    html += `</tr></thead><tbody><tr style="background:#f8f9fa;">`;
    for (let i = 1; i <= 6; i++) { const l = lecs[i]; html += `<td style="text-align:center;font-weight:bold;padding:12px;">${l ? escHtml(l.subject) : ''}</td>`; }
    html += `</tr><tr>`;
    for (let i = 1; i <= 6; i++) {
      const l = lecs[i];
      if (l && l.students.length > 0) {
        html += `<td style="vertical-align:top;padding:10px;"><div style="text-align:${rtl ? 'right' : 'left'};direction:rtl;line-height:1.7;">`
          + l.students.map(st => {
            const color = st.excused ? '#b35900' : '#c33';
            const label = st.excused ? ` (${L.vacationLabel})` : '';
            return `<span style="color:${color};font-weight:${st.excused ? 700 : 500};cursor:pointer;" title="${escHtml(L.studentsHint || '')}" onclick="toggleAdminExcused(${st.asId})">${escHtml(st.name)}${label}</span>`;
          }).join('<br>') + `</div></td>`;
      } else if (l) { html += `<td style="text-align:center;color:#4CAF50;padding:10px;font-weight:600;">${L.noneAbsent}</td>`; }
      else { html += `<td style="text-align:center;color:#999;padding:10px;"></td>`; }
    }
    html += `</tr><tr style="background:#f8f9fa;">`;
    for (let i = 1; i <= 6; i++) { const l = lecs[i]; html += `<td style="text-align:center;font-style:italic;color:#666;padding:10px;font-size:0.88em;">${l ? escHtml(l.teacher) : ''}</td>`; }
    html += `</tr><tr>`;
    for (let i = 1; i <= 6; i++) { const l = lecs[i]; html += `<td style="text-align:center;color:#999;padding:8px;font-size:0.78em;">${l && l.time ? '🕐 ' + escHtml(l.time) : ''}</td>`; }
    html += `</tr></tbody></table></div>`;

    const clsRows = dailyRows.filter(r => r.class === cls);
    if (clsRows.length > 0) {
      html += `<details style="margin-top:10px;"><summary style="cursor:pointer;color:#667eea;font-size:0.85em;font-weight:600;padding:6px 0;">${L.manageLabel} ${escHtml(cls)} (${clsRows.length})</summary>`;
      html += `<div class="table-wrap" style="margin-top:8px;"><table style="font-size:0.82em;"><thead><tr style="background:#f0f0f0;"><th>Lec</th><th>Subject</th><th>Teacher</th><th>🕐</th><th>Absent</th><th></th></tr></thead><tbody>`;
      clsRows.forEach(r => {
        const cnt = (r.students || []).length;
        html += `<tr><td>${escHtml(r.lecture || '—')}</td><td>${escHtml(r.subject || '—')}</td><td>${escHtml(r.teacher || '—')}</td><td>${escHtml(r.time || '—')}</td>
          <td style="text-align:center;"><span style="background:${cnt > 0 ? '#c8402a' : '#2d6a4f'};color:#fff;border-radius:100px;padding:2px 8px;font-size:0.78em;font-weight:700;">${cnt}</span></td>
          <td><button onclick="askAdminDelete(${r.id})" style="background:none;border:1.5px solid #ffd0ca;color:#c8402a;border-radius:7px;padding:4px 10px;font-size:0.78em;cursor:pointer;">🗑️</button></td></tr>`;
      });
      html += `</tbody></table></div></details>`;
    }
    html += `</div>`;
  });
  if (!html) html = `<div style="text-align:center;padding:60px;color:#999;font-size:1.1em;">📭 ${L.noAbsences}</div>`;
  el.innerHTML = html;
}

// Admin flips one student's vacation flag on one record
async function toggleAdminExcused(asId) {
  try {
    const res = await call('admin_toggle_excused', { p_absence_student_id: asId });
    dailyRows.forEach(r => (r.students || []).forEach(st => { if (st.as_id === asId) st.excused = (res === 'EXCUSED'); }));
    renderDaily();
    updateStats();
  } catch (err) { showToast('❌ ' + err.message, 'error'); }
}

// ── WEEKLY / MONTHLY ───────────────────────────────────
function loadWeeklyDropdown() {
  const sel = document.getElementById('weekSelect'); const cur = sel.value; sel.innerHTML = ''; const L = LANGS[currentLang];
  weeks.forEach((w, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${L.weekLabel} ${w.number}: ${formatDate(w.start)} - ${formatDate(w.end)}`; sel.appendChild(o); });
  sel.value = cur || 0; loadWeekly();
}
async function loadWeekly() {
  const L = LANGS[currentLang]; const idx = parseInt(document.getElementById('weekSelect').value);
  const el = document.getElementById('weeklyContent');
  if (isNaN(idx) || !weeks[idx]) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#999;">${L.selectWeek}</div>`; return; }
  const week = weeks[idx];
  el.innerHTML = `<div style="text-align:center;padding:50px;color:#667eea;">${L.loading}</div>`;
  try {
    const data = await call('report_class_summary', { p_from: isoDate(week.start), p_to: isoDate(week.end) });
    el.innerHTML = data.length ? buildClassTable(data, `${L.weekLabel} ${week.number}: ${formatDate(week.start)} - ${formatDate(week.end)}`, L)
      : `<div style="text-align:center;padding:50px;color:#999;">📭 ${L.noAbsences}</div>`;
  } catch (err) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#c33;">❌ ${escHtml(err.message)}</div>`; }
}
function loadMonthlyDropdown() {
  const sel = document.getElementById('monthSelect'); const cur = sel.value; sel.innerHTML = '';
  months.forEach((m, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${m.name} (${formatDate(m.start)} - ${formatDate(m.end)})`; sel.appendChild(o); });
  sel.value = cur || 0; loadMonthly();
}
async function loadMonthly() {
  const L = LANGS[currentLang]; const idx = parseInt(document.getElementById('monthSelect').value);
  const el = document.getElementById('monthlyContent');
  if (isNaN(idx) || !months[idx]) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#999;">${L.selectMonth}</div>`; return; }
  const month = months[idx];
  el.innerHTML = `<div style="text-align:center;padding:50px;color:#667eea;">${L.loading}</div>`;
  try {
    const data = await call('report_class_summary', { p_from: isoDate(month.start), p_to: isoDate(month.end) });
    el.innerHTML = data.length ? buildClassTable(data, month.name, L)
      : `<div style="text-align:center;padding:50px;color:#999;">📭 ${L.noAbsences}</div>`;
  } catch (err) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#c33;">❌ ${escHtml(err.message)}</div>`; }
}

// summary = [{class, students:[{student_id,name,total,vacation_days,subjects:{subject:count}}]}] from report_class_summary
function summarySubjects(students) {
  const set = new Set();
  students.forEach(s => Object.keys(s.subjects || {}).forEach(x => set.add(x)));
  return [...set].sort();
}
function studentRowsHTML(students, subArr, L, countColor) {
  return students.map(s => {
    const sev = getSeverity(s.total);
    const cells = subArr.map(sub => { const cnt = (s.subjects || {})[sub] || 0; return `<td style="text-align:center;color:${countColor(cnt)};font-weight:bold;">${cnt || '-'}</td>`; }).join('');
    const vac = s.vacation_days ? ` <span style="color:#b35900;font-size:0.8em;">(+${s.vacation_days} ${L.vacationLabel})</span>` : '';
    return `<tr class="row-${sev}"><td class="clickable" onclick="openStudent(${s.student_id || 'null'},'${encodeURIComponent(s.name)}')">${escHtml(getThreeNames(s.name))}</td>${cells}<td style="text-align:center;"><strong>${s.total}</strong>${vac} ${getBadge(s.total)}</td></tr>`;
  }).join('');
}
function buildClassTable(summary, title, L) {
  let html = `<h3 style="color:#667eea;margin-bottom:20px;font-size:1.3em;">${escHtml(title)}</h3>`;
  summary.forEach(entry => {
    const subArr = summarySubjects(entry.students);
    html += `<div class="chart-box"><h4 style="color:#667eea;margin-bottom:14px;">🏫 ${L.classLabel} ${escHtml(entry.class)}</h4><div class="table-wrap"><table><thead><tr><th>${L.studentLabel}</th>`;
    subArr.forEach(s => html += `<th style="text-align:center;" title="${escHtml(s)}">${escHtml(s.length > 12 ? s.slice(0, 10) + '…' : s)}</th>`);
    html += `<th style="text-align:center;">${L.totalLabel}</th></tr></thead><tbody>`;
    html += studentRowsHTML(entry.students, subArr, L, cnt => cnt >= 6 ? '#c33' : cnt >= 3 ? '#ff8800' : cnt > 0 ? '#667eea' : '#bbb');
    html += `</tbody></table></div></div>`;
  });
  return html;
}

// ── ROSTER ─────────────────────────────────────────────
function loadRosterDropdown() {
  const sel = document.getElementById('rosterClass'); const cur = sel.value; const L = LANGS[currentLang];
  sel.innerHTML = `<option value="">${L.selectClass}</option>`;
  classes.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o); });
  if (classes.includes(cur)) sel.value = cur; else if (classes.length) sel.value = classes[0];
  filterRoster();
}
async function filterRoster() {
  const L = LANGS[currentLang]; const cls = document.getElementById('rosterClass').value; const min = parseInt(document.getElementById('minAbsences').value) || 0;
  const el = document.getElementById('rosterContent');
  if (!cls) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#999;">${L.selectClass}</div>`; return; }
  let data;
  try { data = await call('report_class_summary', { p_class: cls }); }
  catch (err) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#c33;">❌ ${escHtml(err.message)}</div>`; return; }
  const entry = data.find(x => x.class === cls);
  const students = (entry ? entry.students : []).filter(s => s.total >= min);
  if (!students.length) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#999;"><p style="font-size:3em;">✅</p><p>${L.noAbsences}</p></div>`; return; }
  const subArr = summarySubjects(students);
  let html = `<h3 style="color:#667eea;margin-bottom:14px;">🏫 ${L.classLabel} ${escHtml(cls)}</h3><div class="table-wrap"><table><thead><tr><th>${L.studentLabel}</th>`;
  subArr.forEach(s => html += `<th style="text-align:center;" title="${escHtml(s)}">${escHtml(s.length > 12 ? s.slice(0, 10) + '…' : s)}</th>`);
  html += `<th style="text-align:center;">${L.totalLabel}</th></tr></thead><tbody>`;
  html += studentRowsHTML(students, subArr, L, cnt => cnt >= 3 ? '#c33' : cnt > 0 ? '#667eea' : '#bbb');
  html += `</tbody></table></div>`;
  el.innerHTML = html;
}

// ── ANALYTICS ──────────────────────────────────────────
async function loadAnalytics() {
  const L = LANGS[currentLang];
  const el = document.getElementById('analyticsContent');
  let a;
  try { a = await call('analytics_summary'); }
  catch (err) { el.innerHTML = `<div style="text-align:center;padding:50px;color:#c33;">❌ ${escHtml(err.message)}</div>`; return; }
  const lpd = a.lectures_per_day, expD = a.expulsion_days;
  const lpdInput = document.getElementById('lecturesPerDay'), expInput = document.getElementById('expulsionDays');
  if (lpdInput) lpdInput.value = lpd;
  if (expInput) expInput.value = expD;

  const groupBy = (list, key) => { const m = {}; list.forEach(x => { (m[x[key] || '?'] = m[x[key] || '?'] || []).push(x); }); return m; };
  const link = s => `<span class="clickable" onclick="openStudent(${s.student_id || 'null'},'${encodeURIComponent(s.name)}')">${escHtml(getThreeNames(s.name))}</span>`;

  let html = `<div class="chart-box" style="margin-bottom:24px;"><h3 style="color:#ff4444;margin-bottom:12px;font-size:1.4em;">${L.expulsionReport}</h3><p style="color:#666;margin-bottom:16px;">${L.expulsionDesc} — <strong>${lpd}</strong> lec/day • threshold: <strong>${expD}</strong> days</p>`;
  const exp = groupBy(a.expulsion || [], 'class');
  Object.keys(exp).sort().forEach(cls => {
    const students = exp[cls].sort((x, y) => y.days_missed - x.days_missed);
    html += `<div style="margin-bottom:24px;"><h4 style="color:#667eea;margin-bottom:12px;">🏫 ${L.classLabel} ${escHtml(cls)}</h4><div class="table-wrap"><table><thead><tr><th>${L.studentLabel}</th><th style="text-align:center;">${L.colDaysMissed}</th><th style="text-align:center;">${L.colRemaining}</th><th style="text-align:center;">${L.colStatus}</th></tr></thead><tbody>`;
    students.forEach(s => {
      const pct = s.days_missed / expD; let rowCls = 'row-low', status = L.riskLow, col = '#4CAF50';
      if (s.dismissed) { rowCls = 'row-high'; status = L.riskDismissed; col = '#ff4444'; }
      else if (pct >= 0.75) { rowCls = 'row-medium'; status = L.riskHigh; col = '#ff8800'; }
      html += `<tr class="${rowCls}"><td>${link(s)}</td><td style="text-align:center;font-weight:bold;">${s.days_missed}</td><td style="text-align:center;">${Math.max(0, expD - s.days_missed)}</td><td style="text-align:center;font-weight:bold;color:${col};">${status}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;
  });
  html += `</div>`;

  html += `<div class="chart-box" style="margin-bottom:24px;"><h3 style="color:#ff8800;margin-bottom:12px;font-size:1.4em;">${L.vacationReportTitle}</h3>`;
  const vac = groupBy(a.vacation || [], 'class');
  if (!Object.keys(vac).length) html += `<p style="color:#999;padding:10px 0;">${L.noAbsences}</p>`;
  else Object.keys(vac).sort().forEach(cls => {
    html += `<div style="margin-bottom:24px;"><h4 style="color:#667eea;margin-bottom:12px;">🏫 ${L.classLabel} ${escHtml(cls)}</h4><div class="table-wrap"><table><thead><tr><th>${L.studentLabel}</th><th style="text-align:center;">${L.colVacationDays}</th></tr></thead><tbody>`;
    vac[cls].sort((x, y) => y.days - x.days).forEach(s => {
      html += `<tr><td>${link(s)}</td><td style="text-align:center;font-weight:bold;color:#b35900;">${s.days}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;
  });
  html += `</div>`;

  const byLec = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  (a.by_lecture || []).forEach(x => { if (byLec[x.lecture] !== undefined) byLec[x.lecture] = x.total; });
  const subj = (a.by_subject || []).filter(x => x.total > 0);
  const totalSubj = subj.reduce((s, x) => s + Number(x.total), 0);
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
    <div class="chart-box"><h3 style="color:#667eea;margin-bottom:12px;">${L.absByClass}</h3><div class="table-wrap"><table><thead><tr><th>${L.classLabel}</th><th style="text-align:center;">${L.totalLabel}</th></tr></thead><tbody>`;
  (a.by_class || []).filter(x => x.total > 0).forEach(x => { html += `<tr><td><strong>${escHtml(x.class)}</strong></td><td style="text-align:center;"><strong style="color:#667eea;">${x.total}</strong></td></tr>`; });
  html += `</tbody></table></div></div>
    <div class="chart-box"><h3 style="color:#667eea;margin-bottom:12px;">${L.absByLec}</h3><div class="table-wrap"><table><thead><tr><th>Lecture</th><th style="text-align:center;">${L.totalLabel}</th></tr></thead><tbody>`;
  Object.entries(byLec).forEach(([l, cnt]) => { html += `<tr><td><strong>Lecture ${l}</strong></td><td style="text-align:center;"><strong style="color:#667eea;">${cnt}</strong></td></tr>`; });
  html += `</tbody></table></div></div>
    <div class="chart-box" style="grid-column:1/-1;"><h3 style="color:#667eea;margin-bottom:12px;">${L.absBySubj}</h3><div class="table-wrap"><table><thead><tr><th>${L.subjectLabel}</th><th style="text-align:center;">${L.totalLabel}</th><th style="text-align:center;">${L.pctLabel}</th></tr></thead><tbody>`;
  subj.forEach(x => { const pct = ((x.total / totalSubj) * 100).toFixed(1); html += `<tr><td><strong>${escHtml(x.subject)}</strong></td><td style="text-align:center;"><strong style="color:#667eea;">${x.total}</strong></td><td style="text-align:center;color:#ff8800;font-weight:600;">${pct}%</td></tr>`; });
  html += `</tbody></table></div></div></div>`;
  el.innerHTML = html;
}

// ── STUDENT PROFILE ────────────────────────────────────
// Summarise student_log rows (unexcused lectures count toward the total, vacation is counted in days)
function summariseLog(log) {
  const d = { cls: '', total: 0, vacationDates: new Set(), log: [] };
  log.forEach(r => {
    if (!d.cls) d.cls = r.class || '';          // newest row first
    if (r.excused) d.vacationDates.add(r.date); else d.total += Number(r.lecture_count) || 0;
    d.log.push(r);
  });
  return d;
}
async function showStudentProfile(id, name) {
  const L = LANGS[currentLang];
  let log;
  try { log = await call('student_log', { p_student_id: id, p_name: id ? null : name }); }
  catch (err) { showToast('❌ ' + err.message, 'error'); return; }
  const d = summariseLog(log);
  const displayName = (log[0] && log[0].name) || name;
  const subjects = [...new Set(d.log.map(a => a.subject))];
  const sev = getSeverity(d.total);
  const col = sev === 'high' ? '#ff4444' : sev === 'medium' ? '#ff8800' : '#4CAF50';
  const certArgs = `${id || 'null'},'${encodeURIComponent(displayName)}'`;
  let html = `<div class="profile-header"><h2>👤 ${escHtml(displayName)}</h2><div style="margin-top:8px;">${getBadge(d.total)}</div>
  <button class="btn-add" style="margin-top:10px;" onclick="exportCertificatePDF(${certArgs})">📄 ${L.certTitle}</button>
</div>
    <div class="profile-stats">
      <div class="profile-stat"><div class="label">${L.profileClass}</div><div class="value" style="font-size:1.6em;">${escHtml(d.cls || '?')}</div></div>
      <div class="profile-stat"><div class="label">${L.profileTotal}</div><div class="value" style="color:${col};">${d.total}</div></div>
      <div class="profile-stat"><div class="label">${L.colVacationDays}</div><div class="value" style="font-size:1.6em;color:#b35900;">${d.vacationDates.size}</div></div>
      <div class="profile-stat"><div class="label">${L.profileSubjects}</div><div class="value" style="font-size:1.6em;">${subjects.length}</div></div>
      <div class="profile-stat"><div class="label">${L.profileEntries}</div><div class="value" style="font-size:1.6em;">${d.log.length}</div></div>
    </div>
    <div style="margin:20px 0;padding:14px;background:#f8f9fa;border-radius:8px;">
      <strong style="color:#667eea;">${L.subjectLabel}:</strong><br>
      <span style="color:#666;">${escHtml(subjects.join(', ') || '—')}</span>
    </div>
    <h3 style="color:#667eea;margin:20px 0 12px;">${L.profileHistory}</h3>
    <div class="table-wrap"><table><thead><tr>
      <th>${L.colDate}</th><th>${L.colLecture}</th><th>${L.colSubject}</th><th>${L.colTeacher}</th><th>${L.colStatus}</th>
    </tr></thead><tbody>`;
  d.log.forEach(a => {
    html += `<tr><td>${formatDMY(a.date)}</td><td>${escHtml(a.lecture)}</td><td>${escHtml(a.subject)}</td><td>${escHtml(a.teacher)}</td>
      <td>${a.excused ? `<span style="color:#b35900;">${L.vacationLabel}</span>` : ''}</td></tr>`;
  });
  html += `</tbody></table></div>`;
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('studentModal').classList.add('open');
}
function closeModal() { document.getElementById('studentModal').classList.remove('open'); }

// ── ADMIN DELETE (a submitted record) ──────────────────
function askAdminDelete(id) {
  adminPendingId = id;
  const r = dailyRows.find(x => x.id === id);
  document.getElementById('adminConfInfo').textContent = r ? `${r.lecture} | ${r.subject} | ${r.teacher} | ${r.class}` : '';
  document.getElementById('adminConfirm').classList.add('show');
}
function closeAdminConfirm() { document.getElementById('adminConfirm').classList.remove('show'); adminPendingId = null; }
async function executeAdminDelete() {
  if (!adminPendingId) return;
  const id = adminPendingId; closeAdminConfirm();
  const L = LANGS[currentLang];
  try {
    await call('delete_absence', { p_absence_id: id });
    dailyRows = dailyRows.filter(r => r.id !== id);
    renderDaily(); updateStats();
    showToast(L.toastDeleted, 'success');
  } catch (err) { showToast(L.toastDeleteFail + ' ' + err.message, 'error'); }
}

// ── TAB NAVIGATION ─────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
  if (name === 'daily') loadDaily();
  if (name === 'roster') loadRosterDropdown();
  if (name === 'weekly') loadWeeklyDropdown();
  if (name === 'monthly') loadMonthlyDropdown();
  if (name === 'analytics') loadAnalytics();
  if (name === 'teachers') loadTeachersTab();
  if (name === 'students') loadStudentsTab();
  if (name === 'subjects') loadSubjectsTab();
  if (name === 'graduates') loadGraduatesTab();
  if (name === 'settings') loadSettingsTab();
}

// ══════════════════════════════════════════════════════
// ── MANAGEMENT DATA (one RPC: admin_manage_data) ──────
// ══════════════════════════════════════════════════════
async function fetchManageData() {
  const d = await call('admin_manage_data');
  mgmtData = {
    teachers: (d.teachers || []).filter(t => t.role === 'teacher').map(t => ({
      id: t.id, username: t.username, arabicName: t.arabic_name, displayName: t.display_name,
      classes: t.classes || [], classSubjectAssignments: t.assignments || {}
    })),
    classRows: d.classes || [],
    classes: sortClasses((d.classes || []).map(c => c.name)),
    students: d.students || {},                                   // className -> [{id,name}]
    classSubjectMap: Object.fromEntries((d.stages || []).map(s => [s.label, s.subjects])),
    classSubjectRows: (d.stages || []).map(s => ({ classKey: s.label, stageKey: s.stage_key, subjects: s.subjects })),
    graduates: d.graduates || []
  };
  classes = mgmtData.classes;
}
async function ensureManageData() {
  if (!mgmtData) { try { await fetchManageData(); } catch (err) { showToast('❌ ' + err.message, 'error'); } }
}
function classIdByName(name) {
  const c = ((mgmtData && mgmtData.classRows) || []).find(x => x.name === name);
  return c ? c.id : null;
}
function normalize(value) { return String(value == null ? '' : value).trim().toLowerCase(); }

function sortClasses(list) {
  return [...(list || [])].sort((a, b) => {
    const sa = String(a || ''), sb2 = String(b || '');
    const ma = sa.match(/^(\d+)(.*)$/), mb = sb2.match(/^(\d+)(.*)$/);
    if (!ma || !mb) return sa.localeCompare(sb2, undefined, { numeric: true, sensitivity: 'base' });
    const diff = parseInt(ma[1], 10) - parseInt(mb[1], 10);
    if (diff !== 0) return diff;
    return ma[2].localeCompare(mb[2], undefined, { numeric: true, sensitivity: 'base' });
  });
}

// ══════════════════════════════════════════════════════
// ── TEACHERS TAB ──────────────────────────────────────
// ══════════════════════════════════════════════════════
async function loadTeachersTab() { await ensureManageData(); renderTeacherTable(); }

// Admin-only Auth operations (create user, set password, delete user) run in the Edge Function.
async function callTeacherFn(body) {
  const r = await sb.functions.invoke('manage-teachers', { body });
  if (r.error) {
    let msg = r.error.message || 'Request failed';
    try { if (r.error.context && r.error.context.json) { const j = await r.error.context.json(); if (j && j.error) msg = j.error; } } catch (e) {}
    throw new Error(msg);
  }
  if (r.data && r.data.error) throw new Error(r.data.error);
  return r.data;
}

function uniqueValues(list) {
  const out = [];
  (list || []).forEach(v => {
    if (v == null || !String(v).trim()) return;
    if (!out.some(x => normalize(x) === normalize(v))) out.push(String(v).trim());
  });
  return out;
}
// A stage key is the label used in the class-subject list ("1", "4PRO"...).
function getStageKey(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return '';
  const map = (mgmtData && mgmtData.classSubjectMap) || {};
  const exact = Object.keys(map).find(k => normalize(k) === normalize(raw));
  if (exact) return exact;
  const m = raw.match(/^(\d+)/);
  return m ? m[1] : raw;
}
function getStageList() { return sortClasses(Object.keys((mgmtData && mgmtData.classSubjectMap) || {})); }
function getStageSubjects(stage) {
  const map = (mgmtData && mgmtData.classSubjectMap) || {};
  const key = Object.keys(map).find(k => normalize(k) === normalize(stage));
  return key && Array.isArray(map[key]) ? uniqueValues(map[key]) : [];
}
function teacherAssignments(teacher) {
  const stored = teacher && teacher.classSubjectAssignments;
  const result = {};
  if (stored && typeof stored === 'object') {
    Object.keys(stored).forEach(key => {
      const stage = getStageKey(key);
      result[stage] = uniqueValues([...(result[stage] || []), ...(Array.isArray(stored[key]) ? stored[key] : [])]);
    });
  }
  return result;
}

function renderTeacherTable() {
  if (!mgmtData) return;
  const L = LANGS[currentLang];
  const tbody = document.getElementById('teacherTableBody');
  const teachers = mgmtData.teachers || [];
  if (!teachers.length) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#999;">—</td></tr>`; return; }
  tbody.innerHTML = teachers.map((t, i) => {
    const map = teacherAssignments(t);
    const classTags = Object.keys(map).map(c => `<span class="tag">${escHtml(c.toUpperCase())}</span>`).join(' ') || '—';
    const subjectHtml = Object.keys(map).map(c => {
      const subs = map[c] || [];
      return `<div style="margin:2px 0;"><strong>${escHtml(c.toUpperCase())}</strong>${subs.length ? ' <span class="tag" style="background:#fff4e6;color:#ff8800;">' + escHtml(subs.join(' • ')) + '</span>' : ''}</div>`;
    }).join('') || '—';
    return `<tr>
      <td><strong>${escHtml(t.arabicName || t.displayName)}</strong></td>
      <td style="direction:ltr;text-align:start;">${escHtml(t.username)}</td>
      <td style="direction:ltr;text-align:start;color:#999;font-size:0.82em;">••••••</td>
      <td>${classTags}</td>
      <td>${subjectHtml}</td>
      <td style="white-space:nowrap;">
        <button class="btn-sm btn-move" onclick="openEditTeacher(${i})">${L.editBtn || '✏️'}</button>
        <button class="btn-sm btn-move" title="Password" onclick="resetTeacherPassword(${i})">🔑</button>
        <button class="btn-sm btn-del" onclick="askDeleteTeacher(${i})">🗑️</button>
      </td>
    </tr>`;
  }).join('');
}

async function openAddTeacher() {
  await ensureManageData();
  const L = LANGS[currentLang];
  document.getElementById('teacherModalTitle').textContent = L.teacherModalTitle || '➕';
  document.getElementById('tmEditUsername').value = '';
  document.getElementById('tmName').value = '';
  document.getElementById('tmUsername').value = '';
  document.getElementById('tmUsername').disabled = false;
  document.getElementById('tmPassword').value = '';
  document.getElementById('tmPassword').placeholder = currentLang === 'en' ? 'Leave empty to generate' : currentLang === 'ar' ? 'اتركها فارغة للتوليد التلقائي' : 'بەتاڵ بهێلە بۆ دروستکرنا ئۆتۆماتیک';
  document.getElementById('tmLblPass').textContent = (L.tmLblPass || '').replace(/\(.*\)/, '').trim();
  renderTeacherAssignmentRows({ classSubjectAssignments: {} });
  document.getElementById('teacherModal').classList.add('open');
}
async function openEditTeacher(index) {
  await ensureManageData();
  const t = mgmtData.teachers[index];
  if (!t) return;
  const L = LANGS[currentLang];
  document.getElementById('teacherModalTitle').textContent = L.editTeacherTitle || '✏️';
  document.getElementById('tmEditUsername').value = t.id;
  document.getElementById('tmName').value = t.arabicName || t.displayName || '';
  document.getElementById('tmUsername').value = t.username || '';
  document.getElementById('tmUsername').disabled = true;
  document.getElementById('tmPassword').value = '';
  document.getElementById('tmPassword').placeholder = '';
  document.getElementById('tmLblPass').textContent = L.tmLblPass || '';
  renderTeacherAssignmentRows(t);
  document.getElementById('teacherModal').classList.add('open');
}

function injectTeacherAssignmentStyles() {
  if (document.getElementById('aciTeacherAssignmentStyle')) return;
  const style = document.createElement('style');
  style.id = 'aciTeacherAssignmentStyle';
  style.textContent = `
    .teacher-assignment-list{display:flex;flex-direction:column;gap:5px;margin-top:4px}
    .teacher-assignment-row{border-bottom:1px solid #edf0f4;background:#fff}
    .teacher-assignment-row:last-child{border-bottom:0}
    .teacher-assignment-head{display:flex;align-items:center;gap:9px;min-height:42px;padding:7px 4px;cursor:pointer}
    .teacher-assignment-head:hover{background:#fafbfc}
    .teacher-class-check{width:18px;height:18px;flex:0 0 auto;accent-color:#0066cc;cursor:pointer}
    .teacher-class-name{font-size:.88em;font-weight:800;flex:0 0 72px}
    .teacher-subjects{display:none;align-items:center;gap:8px;flex-wrap:wrap;padding:0 4px 9px 31px}
    .teacher-assignment-row.selected .teacher-subjects{display:flex}
    .teacher-subject-item{display:inline-flex;align-items:center;gap:5px;font-size:.78em;font-weight:650;cursor:pointer;white-space:nowrap}
    .teacher-subject-check{width:16px;height:16px;margin:0;accent-color:#0066cc;cursor:pointer}
    .teacher-assignment-empty{padding:8px 4px;color:#999;font-size:.8em}
    .teacher-assignment-note{font-size:.73em;color:#8a929d;line-height:1.4;margin-top:7px}
    @media(max-width:600px){.teacher-class-name{font-size:.84em;flex-basis:58px}.teacher-subjects{gap:7px 14px;padding-left:30px}.teacher-subject-item{font-size:.76em}}`;
  document.head.appendChild(style);
}
function renderTeacherAssignmentRows(teacher) {
  injectTeacherAssignmentStyles();
  const container = document.getElementById('tmClasses');
  if (!container) return;
  container.className = 'teacher-assignment-list';
  const assignments = teacherAssignments(teacher || {});
  const selectedStages = new Set(Object.keys(assignments).map(getStageKey));
  const stages = getStageList();
  if (!stages.length) { container.innerHTML = '<div class="teacher-assignment-empty">—</div>'; return; }

  container.innerHTML = stages.map(stage => {
    const subjects = getStageSubjects(stage);
    const selectedKeys = (assignments[stage] || []).map(normalize);
    const checked = selectedStages.has(getStageKey(stage));
    const subjectHtml = subjects.length
      ? subjects.map(s => `<label class="teacher-subject-item"><input class="teacher-subject-check" type="checkbox" value="${escHtml(s)}" ${selectedKeys.includes(normalize(s)) ? 'checked' : ''}>${escHtml(s)}</label>`).join('')
      : '<span class="teacher-assignment-empty">—</span>';
    return `<div class="teacher-assignment-row ${checked ? 'selected' : ''}" data-stage="${escHtml(stage)}">
      <div class="teacher-assignment-head"><input class="teacher-class-check" type="checkbox" ${checked ? 'checked' : ''}><span class="teacher-class-name">${escHtml(String(stage).toUpperCase())}</span></div>
      <div class="teacher-subjects">${subjectHtml}</div></div>`;
  }).join('');

  container.querySelectorAll('.teacher-assignment-row').forEach(row => {
    const classCheck = row.querySelector('.teacher-class-check');
    const head = row.querySelector('.teacher-assignment-head');
    head.addEventListener('click', e => {
      if (e.target === classCheck) return;
      classCheck.checked = !classCheck.checked;
      row.classList.toggle('selected', classCheck.checked);
      if (!classCheck.checked) row.querySelectorAll('.teacher-subject-check').forEach(s => s.checked = false);
    });
    classCheck.addEventListener('change', () => {
      row.classList.toggle('selected', classCheck.checked);
      if (!classCheck.checked) row.querySelectorAll('.teacher-subject-check').forEach(s => s.checked = false);
    });
    row.querySelectorAll('.teacher-subject-check').forEach(subject => {
      subject.addEventListener('change', () => {
        if (subject.checked) classCheck.checked = true;
        row.classList.toggle('selected', classCheck.checked);
      });
    });
  });

  let note = document.getElementById('teacherAssignmentNote');
  if (!note) { note = document.createElement('div'); note.id = 'teacherAssignmentNote'; container.insertAdjacentElement('afterend', note); }
  note.className = 'teacher-assignment-note';
  note.textContent = currentLang === 'en'
    ? 'Select a class, then select only the subjects this teacher will teach in that class.'
    : currentLang === 'ar' ? 'اختر الشعبة ثم اختر فقط المواد التي سيدرسها الأستاذ في تلك الشعبة.'
    : 'پۆل هەلبژێرە، پاشان تەنێ ئەو بابەتانە هەلبژێرە کو مامۆستا ل وی پۆلێ دبێژیت.';
}
function selectedTeacherAssignments() {
  const result = {};
  document.querySelectorAll('#tmClasses .teacher-assignment-row').forEach(row => {
    const check = row.querySelector('.teacher-class-check');
    if (!check || !check.checked) return;
    result[row.getAttribute('data-stage')] = uniqueValues([...row.querySelectorAll('.teacher-subject-check:checked')].map(x => x.value));
  });
  return result;
}
function closeTeacherModal() {
  document.getElementById('teacherModal').classList.remove('open');
  document.getElementById('tmUsername').disabled = false;
}

function showCred(username, password) {
  document.getElementById('credUser').textContent = username;
  document.getElementById('credPass').textContent = password;
  document.getElementById('credModal').classList.add('open');
}
function closeCred() {
  document.getElementById('credModal').classList.remove('open');
  document.getElementById('credPass').textContent = '';   // the password is not kept anywhere
}
async function copyCred() {
  const text = `${document.getElementById('credUser').textContent} / ${document.getElementById('credPass').textContent}`;
  try { await navigator.clipboard.writeText(text); showToast(LANGS[currentLang].toastCopied, 'success'); } catch (e) {}
}

async function saveTeacher() {
  const L = LANGS[currentLang];
  const editId = document.getElementById('tmEditUsername').value.trim();
  const isEdit = editId !== '';
  const name = document.getElementById('tmName').value.trim();
  const username = document.getElementById('tmUsername').value.trim().toLowerCase();
  const password = document.getElementById('tmPassword').value;
  const assignments = selectedTeacherAssignments();
  const stages = Object.keys(assignments);

  if (!name || !username) { showToast('❌ ناڤ و یوزەرناڤ پێویستە', 'error'); return; }
  if (!/^[a-z0-9._-]{1,60}$/.test(username)) { showToast('❌ a-z 0-9 . _ -', 'error'); return; }
  if (!stages.length) { showToast('❌ کەمەک پۆلێک هەلبژێرە', 'error'); return; }
  if (stages.some(s => (assignments[s] || []).length === 0)) { showToast('❌ بۆ هەر پۆلێک لانیکەم یەک بابەت هەلبژێرە', 'error'); return; }
  if (password && password.length < 6) { showToast('❌ Password ≥ 6', 'error'); return; }

  const btn = document.getElementById('btnSaveTeacher');
  btn.textContent = '⏳'; btn.disabled = true;
  try {
    const body = isEdit
      ? { action: 'update', id: editId, arabic_name: name, display_name: name, assignments }
      : { action: 'create', username, arabic_name: name, display_name: name, assignments };
    if (password) body.password = password;
    const res = await callTeacherFn(body);
    closeTeacherModal();
    await fetchManageData();
    renderTeacherTable();
    showToast(L.toastSaved, 'success');
    if (res && res.temp_password) showCred(username, res.temp_password);
  } catch (err) {
    showToast(L.toastSaveFail + ' ' + err.message, 'error');
  } finally {
    btn.textContent = L.btnSaveTeacher || 'Save'; btn.disabled = false;
  }
}
async function resetTeacherPassword(index) {
  const t = mgmtData.teachers[index]; const L = LANGS[currentLang];
  if (!t || !window.confirm(`${t.arabicName || t.username}\n${L.resetConfirm}`)) return;
  try {
    const res = await callTeacherFn({ action: 'reset_password', id: t.id });
    if (res && res.temp_password) showCred(t.username, res.temp_password);
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
}
function askDeleteTeacher(index) {
  const t = mgmtData.teachers[index]; if (!t) return;
  document.getElementById('mgmtConfirmText').textContent = `${t.arabicName || t.displayName} — ${t.username}`;
  document.getElementById('mgmtConfirmModal').classList.add('open');
  document.getElementById('mgmtConfirmOk').onclick = () => doDeleteTeacher(t.id);
}
async function doDeleteTeacher(id) {
  const L = LANGS[currentLang];
  closeMgmtConfirm();
  try {
    await callTeacherFn({ action: 'delete', id });
    await fetchManageData(); renderTeacherTable();
    showToast(L.toastDeleted, 'success');
  } catch (err) { showToast(L.toastDeleteFail + ' ' + err.message, 'error'); }
}

// ══════════════════════════════════════════════════════
// ── STUDENTS TAB ──────────────────────────────────────
// ══════════════════════════════════════════════════════
let selectedClass = null;

async function loadStudentsTab() { await ensureManageData(); renderStudentTab(); }
async function reloadStudents() { await fetchManageData(); renderStudentTab(); }

function renderStudentTab() {
  if (!mgmtData) return;
  const L = LANGS[currentLang];
  const grid = document.getElementById('classGrid');
  grid.innerHTML = mgmtData.classes.map(cls => {
    const count = (mgmtData.students[cls] || []).length;
    const safe = encodeURIComponent(cls);
    const isFinal = isFinalStage(cls);
    return `<div style="margin-bottom:8px;">
      <button class="class-btn ${selectedClass === cls ? 'selected' : ''}" onclick="selectClass('${safe}')" style="width:100%;">
        <div class="cls-name">${escHtml(cls)}</div><div class="cls-count">${count} ${L.students || ''}</div>
      </button>
      <div style="display:flex;gap:4px;margin-top:4px;">
        <button class="btn-sm btn-move" style="flex:1;" onclick="openRenameClass('${safe}')">✏️</button>
        <button class="btn-sm" style="flex:1;background:#e8f5e9;color:#2e7d32;" onclick="openPromoteClass('${safe}')">${isFinal ? '🎓' : '➡️'}</button>
        <button class="btn-sm btn-del" style="flex:1;" onclick="askDeleteClass('${safe}')">🗑️</button>
      </div></div>`;
  }).join('');
  if (selectedClass && mgmtData.classes.includes(selectedClass)) renderStudentList(selectedClass);
  else document.getElementById('studentPanel').innerHTML = `<div style="text-align:center;padding:40px;color:#999;">${L.selectClassHint || ''}</div>`;
}
function selectClass(safeCls) { selectedClass = decodeURIComponent(safeCls); renderStudentTab(); }

function renderStudentList(cls) {
  const L = LANGS[currentLang];
  const students = mgmtData.students[cls] || [];
  const safeCls = encodeURIComponent(cls);
  let html = `<div class="student-list-header">
    <h3>🏫 ${escHtml(cls)} <span style="color:#999;font-size:0.8em;">(${students.length} ${L.students || ''})</span></h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn-add" onclick="openAddStudent('${safeCls}')" style="font-size:0.78em;padding:7px 14px;">➕ ${L.addStudentTitle || ''}</button>
      <button class="btn-add" onclick="openBulkStudent('${safeCls}')" style="font-size:0.78em;padding:7px 14px;background:#4CAF50;">➕➕</button>
    </div></div>`;
  if (!students.length) html += `<div style="text-align:center;padding:30px;color:#999;">—</div>`;
  else {
    html += `<div style="background:#fff;border-radius:10px;border:1px solid #e9ecef;overflow:hidden;">`;
    students.forEach((st, i) => {
      html += `<div class="student-row"><span class="student-name">${i + 1}. ${escHtml(st.name)}</span>
        <div class="student-actions">
          <button class="btn-sm btn-move" onclick="openMoveStudent(${st.id},'${safeCls}')">↔️</button>
          <button class="btn-sm btn-del" onclick="askDeleteStudent(${st.id},'${safeCls}')">🗑️</button>
        </div></div>`;
    });
    html += `</div>`;
  }
  document.getElementById('studentPanel').innerHTML = html;
}
function studentById(id) {
  for (const cls of Object.keys(mgmtData.students)) {
    const s = mgmtData.students[cls].find(x => x.id === id);
    if (s) return s;
  }
  return null;
}

function openAddStudent(safeCls) {
  document.getElementById('addStudentClass').value = decodeURIComponent(safeCls);
  document.getElementById('addStudentName').value = '';
  document.getElementById('addStudentModal').classList.add('open');
  setTimeout(() => document.getElementById('addStudentName').focus(), 100);
}
function closeAddStudent() { document.getElementById('addStudentModal').classList.remove('open'); }
async function saveAddStudent() {
  const L = LANGS[currentLang];
  const cls = document.getElementById('addStudentClass').value;
  const name = document.getElementById('addStudentName').value.trim();
  if (!name) { showToast('❌ ناڤ بنووسە', 'error'); return; }
  try {
    await call('admin_add_students', { p_class_id: classIdByName(cls), p_names: [name] });
    closeAddStudent(); await reloadStudents();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
}

function openBulkStudent(safeCls) {
  document.getElementById('bulkStudentClass').value = decodeURIComponent(safeCls);
  document.getElementById('bulkStudentText').value = '';
  document.getElementById('bulkPreview').className = 'paste-preview';
  document.getElementById('bulkStudentModal').classList.add('open');
  setTimeout(() => document.getElementById('bulkStudentText').focus(), 100);
}
function closeBulkStudent() { document.getElementById('bulkStudentModal').classList.remove('open'); }
function previewBulk() {
  const names = cleanPastedNames(document.getElementById('bulkStudentText').value);
  const preview = document.getElementById('bulkPreview');
  if (!names.length) { preview.className = 'paste-preview'; return; }
  preview.className = 'paste-preview show';
  preview.innerHTML = `<div style="font-size:0.75em;color:#667eea;font-weight:700;margin-bottom:4px;">✅ ${names.length} ناڤ:</div>` +
    names.map(n => `<div class="paste-preview-item">• ${escHtml(n)}</div>`).join('');
}
async function saveBulkStudents() {
  const L = LANGS[currentLang];
  const cls = document.getElementById('bulkStudentClass').value;
  const names = cleanPastedNames(document.getElementById('bulkStudentText').value);
  if (!names.length) { showToast('❌ هیچ ناڤێک نەدۆزرایەوە', 'error'); return; }
  const btn = document.getElementById('btnSaveBulk');
  btn.textContent = '⏳'; btn.disabled = true;
  try {
    const added = await call('admin_add_students', { p_class_id: classIdByName(cls), p_names: names });
    closeBulkStudent(); await reloadStudents();
    showToast(`✅ ${added} ${L.students || ''}`, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { btn.textContent = 'هەموویان زیادبکە'; btn.disabled = false; }
}

function openMoveStudent(studentId, safeCls) {
  const cls = decodeURIComponent(safeCls);
  const st = studentById(studentId); if (!st) return;
  document.getElementById('moveStudentName').value = studentId;
  document.getElementById('moveStudentFrom').value = cls;
  document.getElementById('moveStudentNameDisplay').textContent = '👤 ' + st.name;
  document.getElementById('moveClassRadios').innerHTML = mgmtData.classes.filter(c => c !== cls).map(c => `
    <label style="display:flex;align-items:center;gap:6px;background:#f4f6ff;border:1.5px solid #d0d7ff;border-radius:8px;padding:6px 12px;cursor:pointer;">
      <input type="radio" name="moveTarget" value="${escHtml(c)}" style="accent-color:#0066cc;"><span style="font-weight:700;">${escHtml(c)}</span></label>`).join('');
  document.getElementById('moveStudentModal').classList.add('open');
}
function closeMoveStudent() { document.getElementById('moveStudentModal').classList.remove('open'); }
async function saveMoveStudent() {
  const L = LANGS[currentLang];
  const studentId = Number(document.getElementById('moveStudentName').value);
  const fromCls = document.getElementById('moveStudentFrom').value;
  const radio = document.querySelector('input[name="moveTarget"]:checked');
  if (!radio) { showToast('❌ پۆلێک هەلبژێرە', 'error'); return; }
  try {
    await call('admin_move_student', { p_student_id: studentId, p_to_class_id: classIdByName(radio.value) });
    closeMoveStudent(); selectedClass = fromCls; await reloadStudents();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
}

function askDeleteStudent(studentId, safeCls) {
  const st = studentById(studentId); const cls = decodeURIComponent(safeCls); if (!st) return;
  document.getElementById('mgmtConfirmText').textContent = `${st.name} — ${cls}`;
  document.getElementById('mgmtConfirmModal').classList.add('open');
  document.getElementById('mgmtConfirmOk').onclick = () => doDeleteStudent(studentId);
}
function closeMgmtConfirm() { document.getElementById('mgmtConfirmModal').classList.remove('open'); }
async function doDeleteStudent(studentId) {
  const L = LANGS[currentLang];
  closeMgmtConfirm();
  try { await call('admin_remove_student', { p_student_id: studentId }); await reloadStudents(); showToast(L.toastDeleted, 'success'); }
  catch (err) { showToast(L.toastDeleteFail + ' ' + err.message, 'error'); }
}

// ── new class ──────────────────────────────────────────
function openNewClass() {
  populateStageSelect('1');
  document.getElementById('newClassGroup').value = '';
  updateClassGroupPreview();
  document.getElementById('newClassModal').classList.add('open');
  setTimeout(() => document.getElementById('newClassGroup').focus(), 100);
}
function closeNewClass() { document.getElementById('newClassModal').classList.remove('open'); }
function updateClassGroupPreview() {
  document.getElementById('newClassPreview').textContent = document.getElementById('newClassStage').value + document.getElementById('newClassGroup').value.trim();
}
async function saveNewClass() {
  const L = LANGS[currentLang];
  const stage = document.getElementById('newClassStage').value;
  const group = document.getElementById('newClassGroup').value.trim();
  if (!stage) { showToast('❌ اختر المرحلة', 'error'); return; }
  if (!group) { showToast('❌ اكتب Group / Program', 'error'); return; }
  const className = stage + group;
  if (mgmtData && mgmtData.classes.some(c => c.toLowerCase() === className.toLowerCase())) { showToast('❌ ئەم پۆلە پێشتر هەیە', 'error'); return; }
  const btn = document.getElementById('btnSaveNewClass');
  btn.textContent = '⏳'; btn.disabled = true;
  try {
    await call('admin_add_class', { p_stage: stage, p_group: group });
    closeNewClass(); selectedClass = className; await reloadStudents();
    showToast(`✅ ${className}`, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { btn.textContent = 'دروستکرن'; btn.disabled = false; }
}

// ── number of stages (Settings -> stages_count) ───────
function getStagesCount() { const n = parseInt(appSettings && appSettings.stages_count, 10); return (n >= 1 && n <= 12) ? n : 5; }
function isFinalStage(cls) { const n = parseInt(getStageKey(cls), 10); return !isNaN(n) && n >= getStagesCount(); }
function stageLabel(i) {
  if (currentLang === 'ku') return 'قۆناغا ' + i;
  if (currentLang === 'ar') return 'المرحلة ' + i;
  const suf = (i % 100 >= 11 && i % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[i % 10] || 'th');
  return i + suf + ' Stage';
}
function populateStageSelect(selected) {
  const sel = document.getElementById('newClassStage'); if (!sel) return;
  const keep = selected || sel.value || '1';
  sel.innerHTML = '';
  for (let i = 1; i <= getStagesCount(); i++) { const o = document.createElement('option'); o.value = String(i); o.textContent = stageLabel(i); sel.appendChild(o); }
  sel.value = (parseInt(keep, 10) <= getStagesCount()) ? String(parseInt(keep, 10) || 1) : '1';
}
async function saveStagesSettings() {
  const L = LANGS[currentLang];
  const v = parseInt(document.getElementById('setStagesCount').value, 10);
  if (!(v >= 1 && v <= 12)) { showToast(L.toastSaveFail, 'error'); return; }
  const btn = document.getElementById('btnSaveStages');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    await saveSettingsRpc({ stages_count: String(v) });
    if (appSettings) appSettings.stages_count = String(v);
    populateStageSelect();
    if (document.getElementById('students').classList.contains('active')) renderStudentTab();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { if (btn) { btn.textContent = L.btnSaveStages || 'Save'; btn.disabled = false; } }
}

// ── rename / delete class ──────────────────────────────
function openRenameClass(safeCls) {
  const cls = decodeURIComponent(safeCls);
  document.getElementById('renameClassOld').value = cls;
  document.getElementById('renameClassOldDisplay').textContent = cls;
  document.getElementById('renameClassNew').value = cls;
  document.getElementById('renameClassHistory').checked = false;
  document.getElementById('renameClassModal').classList.add('open');
  setTimeout(() => { const el = document.getElementById('renameClassNew'); el.focus(); el.select(); }, 100);
}
function closeRenameClass() { document.getElementById('renameClassModal').classList.remove('open'); }
async function saveRenameClass() {
  const L = LANGS[currentLang];
  const oldName = document.getElementById('renameClassOld').value;
  const newName = document.getElementById('renameClassNew').value.trim();
  const updateHistory = document.getElementById('renameClassHistory').checked;
  if (!newName) { showToast('❌ ناڤێ نوی بنووسە', 'error'); return; }
  if (newName === oldName) { closeRenameClass(); return; }
  const btn = document.getElementById('btnSaveRenameClass');
  btn.textContent = '⏳'; btn.disabled = true;
  try {
    await call('admin_rename_class', { p_class_id: classIdByName(oldName), p_new_name: newName, p_update_history: updateHistory });
    closeRenameClass(); selectedClass = newName; await reloadStudents();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { btn.textContent = L.btnSaveRenameClass || 'Save'; btn.disabled = false; }
}
function askDeleteClass(safeCls) {
  const cls = decodeURIComponent(safeCls);
  const L = LANGS[currentLang];
  document.getElementById('mgmtConfirmText').textContent = `${cls} — ${(mgmtData.students[cls] || []).length} ${L.students || ''}`;
  document.getElementById('mgmtConfirmModal').classList.add('open');
  document.getElementById('mgmtConfirmOk').onclick = () => doDeleteClass(cls);
}
async function doDeleteClass(cls) {
  const L = LANGS[currentLang];
  closeMgmtConfirm();
  try {
    await call('admin_delete_class', { p_class_id: classIdByName(cls) });
    if (selectedClass === cls) selectedClass = null;
    await reloadStudents();
    showToast(L.toastDeleted, 'success');
  } catch (err) { showToast(L.toastDeleteFail + ' ' + err.message, 'error'); }
}

// ── promote / graduate ─────────────────────────────────
let promoteMode = 'move';
function openPromoteClass(safeCls) {
  const cls = decodeURIComponent(safeCls);
  const L = LANGS[currentLang];
  const isFinal = isFinalStage(cls);
  document.getElementById('promoteSourceClass').value = cls;
  document.getElementById('promoteTitle').textContent = (isFinal ? (L.promoteTitleGrad || '🎓') : (L.promoteTitleMove || '➡️')) + ' — ' + cls;
  document.getElementById('promoteYear').value = getAcademicYear();
  document.getElementById('promoteDestClass').value = '';
  document.getElementById('promoteDestOptions').innerHTML = mgmtData.classes.filter(c => c !== cls).map(c => `<option value="${escHtml(c)}">`).join('');
  const students = mgmtData.students[cls] || [];
  document.getElementById('promoteStudentList').innerHTML = students.length
    ? students.map((st, i) => `<label style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid #f2f2f2;cursor:pointer;">
        <input type="checkbox" class="promote-student-cb" value="${st.id}" checked style="width:auto;accent-color:#0066cc;"><span>${i + 1}. ${escHtml(st.name)}</span></label>`).join('')
    : `<div style="text-align:center;padding:20px;color:#999;">—</div>`;
  document.getElementById('promoteModeRow').style.display = 'none';
  setPromoteMode(isFinal ? 'graduate' : 'move');
  document.getElementById('promoteModal').classList.add('open');
}
function setPromoteMode(mode) {
  promoteMode = mode;
  document.getElementById('promoteDestField').style.display = mode === 'move' ? '' : 'none';
  document.getElementById('promoteYearField').style.display = mode === 'graduate' ? '' : 'none';
}
function togglePromoteAll(checked) { document.querySelectorAll('.promote-student-cb').forEach(cb => cb.checked = checked); }
function closePromoteModal() { document.getElementById('promoteModal').classList.remove('open'); }
async function confirmPromote() {
  const L = LANGS[currentLang];
  const sourceClass = document.getElementById('promoteSourceClass').value;
  const ids = [...document.querySelectorAll('.promote-student-cb:checked')].map(cb => Number(cb.value));
  if (!ids.length) { showToast('❌ لانی کەم قوتابیەک هەلبژێرە', 'error'); return; }
  const btn = document.getElementById('btnConfirmPromote');
  btn.textContent = '⏳'; btn.disabled = true;
  try {
    if (promoteMode === 'graduate') {
      const year = document.getElementById('promoteYear').value.trim();
      if (!year) throw new Error('ساڵێ بنووسە');
      await call('admin_graduate_class', { p_source_class_id: classIdByName(sourceClass), p_year: year, p_student_ids: ids });
    } else {
      const dest = document.getElementById('promoteDestClass').value.trim();
      if (!dest) throw new Error('پۆلی ئامانج بنووسە');
      if (dest === sourceClass) throw new Error('same class');
      await call('admin_promote_class', { p_source_class_id: classIdByName(sourceClass), p_dest_class_name: dest, p_student_ids: ids });
    }
    closePromoteModal(); await reloadStudents();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { btn.textContent = L.btnConfirmPromote || 'Save'; btn.disabled = false; }
}

// ── graduates tab ──────────────────────────────────────
async function loadGraduatesTab() {
  await ensureManageData();
  const years = [...new Set((mgmtData.graduates || []).map(g => g.year))].sort().reverse();
  const sel = document.getElementById('gradYearFilter'); const L = LANGS[currentLang];
  sel.innerHTML = `<option value="">${L.allYears || ''}</option>` + years.map(y => `<option value="${escHtml(y)}">${escHtml(y)}</option>`).join('');
  renderGraduatesList();
}
function renderGraduatesList() {
  const yearFilter = document.getElementById('gradYearFilter').value;
  const list = ((mgmtData && mgmtData.graduates) || []).filter(g => !yearFilter || g.year === yearFilter);
  const el = document.getElementById('graduatesList');
  if (!list.length) { el.innerHTML = `<div style="text-align:center;padding:40px;color:#999;">—</div>`; return; }
  const byClass = {};
  list.forEach(g => { (byClass[g.className] = byClass[g.className] || []).push(g.studentName); });
  el.innerHTML = Object.keys(byClass).sort().map(cls => `
    <div style="margin-bottom:18px;"><h3 style="color:#667eea;margin-bottom:10px;">🏫 ${escHtml(cls)}</h3>
      <div class="table-wrap"><table><tbody>
        ${byClass[cls].map((s, i) => `<tr><td style="padding:6px 12px;">${i + 1}. ${escHtml(s)}</td></tr>`).join('')}
      </tbody></table></div></div>`).join('');
}

// ══════════════════════════════════════════════════════
// ── CLASSES & SUBJECTS TAB (stages) ───────────────────
// ══════════════════════════════════════════════════════
async function loadSubjectsTab() { await ensureManageData(); renderSubjectTable(); }
function renderSubjectTable() {
  if (!mgmtData) return;
  const tbody = document.getElementById('subjectTableBody');
  const rows = mgmtData.classSubjectRows || [];
  if (!rows.length) { tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:30px;color:#999;">—</td></tr>`; return; }
  tbody.innerHTML = rows.map((row, i) => `
    <tr><td><strong style="color:#667eea;">${escHtml(row.classKey)}</strong></td>
      <td style="font-size:0.85em;">${row.subjects.map(s => `<span class="tag" style="background:#fff4e6;color:#ff8800;">${escHtml(s)}</span>`).join(' ')}</td>
      <td style="white-space:nowrap;">
        <button class="btn-sm btn-move" onclick="openEditSubject(${i})">✏️</button>
        <button class="btn-sm btn-del" onclick="askDeleteSubject(${i})">🗑️</button></td></tr>`).join('');
}
function openAddSubject() {
  const L = LANGS[currentLang];
  document.getElementById('subjectModalTitle').textContent = L.subjectModalTitle || '➕';
  document.getElementById('smRowIndex').value = '';
  document.getElementById('smClassKey').value = '';
  document.getElementById('smSubjects').value = '';
  document.getElementById('subjectModal').classList.add('open');
  setTimeout(() => document.getElementById('smClassKey').focus(), 100);
}
function openEditSubject(index) {
  const row = mgmtData.classSubjectRows[index]; if (!row) return;
  const L = LANGS[currentLang];
  document.getElementById('subjectModalTitle').textContent = L.editSubjectTitle || '✏️';
  document.getElementById('smRowIndex').value = row.stageKey;     // old stage key (identifies the row being edited)
  document.getElementById('smClassKey').value = row.classKey;
  document.getElementById('smSubjects').value = row.subjects.join(' + ');
  document.getElementById('subjectModal').classList.add('open');
}
function closeSubjectModal() { document.getElementById('subjectModal').classList.remove('open'); }
async function saveSubjectRow() {
  const L = LANGS[currentLang];
  const classKey = document.getElementById('smClassKey').value.trim();
  const subjects = uniqueValues(document.getElementById('smSubjects').value.split('+'));
  const oldKey = document.getElementById('smRowIndex').value.trim();
  if (!classKey || !subjects.length) { showToast('❌ پۆل و بابەت پێویستن', 'error'); return; }
  const btn = document.getElementById('btnSaveSubject');
  btn.textContent = '⏳'; btn.disabled = true;
  try {
    await call('admin_save_stage', { p_stage_label: classKey, p_subjects: subjects, p_old_stage_key: oldKey || null });
    closeSubjectModal(); await fetchManageData(); renderSubjectTable();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { btn.textContent = L.btnSaveSubject || 'Save'; btn.disabled = false; }
}
function askDeleteSubject(index) {
  const row = mgmtData.classSubjectRows[index]; if (!row) return;
  document.getElementById('mgmtConfirmText').textContent = row.classKey;
  document.getElementById('mgmtConfirmModal').classList.add('open');
  document.getElementById('mgmtConfirmOk').onclick = () => doDeleteSubject(row.stageKey);
}
async function doDeleteSubject(stageKey) {
  const L = LANGS[currentLang];
  closeMgmtConfirm();
  try { await call('admin_delete_stage', { p_stage_key: stageKey }); await fetchManageData(); renderSubjectTable(); showToast(L.toastDeleted, 'success'); }
  catch (err) { showToast(L.toastDeleteFail + ' ' + err.message, 'error'); }
}

// ══════════════════════════════════════════════════════
// ── SETTINGS TAB ──────────────────────────────────────
// ══════════════════════════════════════════════════════
async function saveSettingsRpc(obj) { return call('save_settings', { p: obj }); }

function applySettings(s) {
  appSettings = s;
  if (s.institute_name_ku) LANGS.ku.dInstName = s.institute_name_ku;
  if (s.institute_name_ar) LANGS.ar.dInstName = s.institute_name_ar;
  if (s.institute_name_en) LANGS.en.dInstName = s.institute_name_en;
  if (s.school_year_start) SCHOOL_START = s.school_year_start;
  instituteLogoUrl = Api.logoUrl(s.institute_logo_path) || DEFAULT_LOGO_DATA_URI;
  ministryLogoUrl = Api.logoUrl(s.ministry_logo_path) || DEFAULT_LOGO_DATA_URI;
  const a = document.getElementById('dashInstituteLogo'), b = document.getElementById('dashMinistryLogo');
  if (a) a.src = instituteLogoUrl;
  if (b) b.src = ministryLogoUrl;
  const nameEl = document.getElementById('dInstName');
  if (nameEl) nameEl.textContent = LANGS[currentLang].dInstName;
}
async function loadSettings() {
  try { applySettings(await call('get_settings')); } catch (err) { console.warn('loadSettings:', err.message); }
}
async function loadSettingsTab() { if (!appSettings) await loadSettings(); renderSettingsForm(); }

function setVal(id, val) { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; }
function normalizeDateForInput(mdy) {
  if (!mdy) return '';
  const d = new Date(mdy); if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function denormalizeDateFromInput(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-'); if (!y || !m || !d) return '';
  return `${parseInt(m)}/${parseInt(d)}/${y}`;
}

function renderSettingsForm() {
  if (!appSettings) return;
  const L = LANGS[currentLang];
  setVal('setLecturesPerDay', appSettings.lectures_per_day);
  setVal('setExpulsionDays', appSettings.expulsion_days);
  setVal('setAtRiskThreshold', appSettings.at_risk_threshold);
  setVal('setHighRiskThreshold', appSettings.high_risk_threshold);
  setVal('setStagesCount', getStagesCount());
  populateStageSelect();
  setVal('setSchoolYearStart', normalizeDateForInput(appSettings.school_year_start));
  const ay = document.getElementById('setAcademicYearDisplay');
  if (ay) ay.textContent = (L.academicYearLabel || 'Academic Year') + ': ' + getAcademicYear();
  setVal('setInstNameKu', appSettings.institute_name_ku);
  setVal('setInstNameAr', appSettings.institute_name_ar);
  setVal('setInstNameEn', appSettings.institute_name_en);
  const ip = document.getElementById('instituteLogoPreview'), mp = document.getElementById('ministryLogoPreview');
  if (ip) ip.src = instituteLogoUrl;
  if (mp) mp.src = ministryLogoUrl;
  applyWorkingDays();
}

async function savePolicySettings() {
  const L = LANGS[currentLang];
  const v = id => document.getElementById(id).value.trim();
  const p = { lectures_per_day: v('setLecturesPerDay'), expulsion_days: v('setExpulsionDays'),
              at_risk_threshold: v('setAtRiskThreshold'), high_risk_threshold: v('setHighRiskThreshold') };
  if (!p.lectures_per_day || !p.expulsion_days || !p.at_risk_threshold || !p.high_risk_threshold) { showToast(L.toastSaveFail, 'error'); return; }
  const btn = document.getElementById('btnSavePolicy');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    await saveSettingsRpc(p);
    Object.assign(appSettings, p);
    updateStats();
    if (document.getElementById('analytics').classList.contains('active')) loadAnalytics();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { if (btn) { btn.textContent = L.btnSavePolicy || 'Save'; btn.disabled = false; } }
}
async function saveAcademicYearSettings() {
  const L = LANGS[currentLang];
  const iso = document.getElementById('setSchoolYearStart').value;
  if (!iso) { showToast(L.toastSaveFail, 'error'); return; }
  const school_year_start = denormalizeDateFromInput(iso);
  const btn = document.getElementById('btnSaveAcademicYear');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    await saveSettingsRpc({ school_year_start });
    appSettings.school_year_start = school_year_start; SCHOOL_START = school_year_start;
    weeks = getWeeks(); months = getMonths();
    if (document.getElementById('weekly').classList.contains('active')) loadWeeklyDropdown();
    if (document.getElementById('monthly').classList.contains('active')) loadMonthlyDropdown();
    updateStats();
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { if (btn) { btn.textContent = L.btnSaveAcademicYear || 'Save'; btn.disabled = false; } }
}
async function saveNamesSettings() {
  const L = LANGS[currentLang];
  const n = { institute_name_ku: document.getElementById('setInstNameKu').value.trim(),
              institute_name_ar: document.getElementById('setInstNameAr').value.trim(),
              institute_name_en: document.getElementById('setInstNameEn').value.trim() };
  if (!n.institute_name_ku || !n.institute_name_ar || !n.institute_name_en) { showToast(L.toastSaveFail, 'error'); return; }
  const btn = document.getElementById('btnSaveNames');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    await saveSettingsRpc(n);
    Object.assign(appSettings, n);
    LANGS.ku.dInstName = n.institute_name_ku; LANGS.ar.dInstName = n.institute_name_ar; LANGS.en.dInstName = n.institute_name_en;
    document.getElementById('dInstName').textContent = LANGS[currentLang].dInstName;
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { if (btn) { btn.textContent = L.btnSaveNames || 'Save'; btn.disabled = false; } }
}

// ── working days ───────────────────────────────────────
function applyWorkingDays() {
  const box = document.getElementById('workingDaysBox'); if (!box) return;
  const selected = getWorkingDaysList();
  box.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    const on = selected.indexOf(cb.value.toLowerCase()) !== -1;
    cb.checked = on;
    const item = cb.closest('.working-day-item'); if (item) item.classList.toggle('checked', on);
  });
}
function installWorkingDayListeners() {
  document.querySelectorAll('#workingDaysBox input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => { const item = cb.closest('.working-day-item'); if (item) item.classList.toggle('checked', cb.checked); });
  });
}
async function saveWorkingDays() {
  const L = LANGS[currentLang];
  const status = document.getElementById('workingDaysStatus'), btn = document.getElementById('btnSaveWorkingDays');
  const selected = [...document.querySelectorAll('#workingDaysBox input[type="checkbox"]:checked')].map(cb => cb.value);
  if (!selected.length) { if (status) status.textContent = L.selectOneDay; return; }
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; }
  try {
    const value = selected.join(',');
    await saveSettingsRpc({ working_days: value });
    appSettings.working_days = value;
    if (status) status.textContent = L.toastSaved;
    applyWorkingDays();
  } catch (err) { if (status) status.textContent = '❌ ' + err.message; }
  finally { if (btn) { btn.disabled = false; btn.textContent = L.btnSaveWorkingDays; } }
}

// ── logos (Supabase Storage bucket "branding": public read, admin write, 2 MB, images only) ──
async function doUploadLogo(logoType) {
  const L = LANGS[currentLang];
  const input = document.getElementById(logoType === 'institute' ? 'instituteLogoFile' : 'ministryLogoFile');
  const btn = document.getElementById(logoType === 'institute' ? 'btnUploadInstituteLogo' : 'btnUploadMinistryLogo');
  const prev = document.getElementById(logoType === 'institute' ? 'instituteLogoPreview' : 'ministryLogoPreview');
  const file = input && input.files && input.files[0];
  if (!file) { showToast(L.toastSaveFail, 'error'); return; }
  if (['image/png', 'image/jpeg', 'image/gif', 'image/webp'].indexOf(file.type) === -1) { showToast(L.toastSaveFail, 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast(L.toastSaveFail + ' (>2MB)', 'error'); return; }

  const key = logoType === 'institute' ? 'institute_logo_path' : 'ministry_logo_path';
  const original = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const path = `${logoType}-${Date.now()}.${ext}`;
    const up = await sb.storage.from('branding').upload(path, file, { contentType: file.type, upsert: false });
    if (up.error) throw new Error(up.error.message);
    const old = appSettings ? appSettings[key] : '';
    await saveSettingsRpc({ [key]: path });
    if (old) { try { await sb.storage.from('branding').remove([old]); } catch (e) {} }
    appSettings[key] = path;
    applySettings(appSettings);
    if (prev) prev.src = logoType === 'institute' ? instituteLogoUrl : ministryLogoUrl;
    if (input) input.value = '';
    window._pdfLogos = null;
    showToast(L.toastSaved, 'success');
  } catch (err) { showToast(L.toastSaveFail + ' ' + err.message, 'error'); }
  finally { if (btn) { btn.textContent = original; btn.disabled = false; } }
}

// There is no server cache any more: "refresh data" simply reloads from the database.
async function doClearCache() {
  const L = LANGS[currentLang];
  try { await fetchManageData(); await refreshActive(); showToast(L.toastCacheCleared, 'success'); }
  catch (err) { showToast(L.toastCacheFail + ' ' + err.message, 'error'); }
}

// ── scheduling (refresh the visible tab every 5 min during school hours) ──
let lastAutoFetch = 0;
function scheduleRefresh() {
  const h = new Date().getHours();
  if (h >= 8 && h < 14) {
    if (document.visibilityState === 'visible') { refreshActive(); lastAutoFetch = Date.now(); }
    setTimeout(scheduleRefresh, 300000);
  } else {
    const next = new Date(); next.setDate(next.getDate() + (h >= 14 ? 1 : 0)); next.setHours(8, 0, 1, 0);
    setTimeout(scheduleRefresh, next.getTime() - Date.now());
  }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const h = new Date().getHours();
    if (h >= 8 && h < 14 && Date.now() - lastAutoFetch > 300000) { refreshActive(); lastAutoFetch = Date.now(); }
  }
});

// ── init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const guard = await Api.requireRole('admin');      // role comes from the database, not localStorage
  if (!guard) return;
  adminProfile = guard.profile;
  sb.auth.onAuthStateChange(event => { if (event === 'SIGNED_OUT') navigateTo('login'); });

  setLang(currentLang);
  installWorkingDayListeners();
  await Promise.all([loadSettings(), fetchManageData().catch(err => showToast('❌ ' + err.message, 'error'))]);
  weeks = getWeeks(); months = getMonths();
  setLang(currentLang);
  updateStats();
  setToday();
  scheduleRefresh();
});
