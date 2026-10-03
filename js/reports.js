
// ══════════════════════════════════════════════════════
// PDF EXPORT ENGINE
// Browser-only PDF generation. Files are NOT saved to Google Drive.
// Snapshots HTML blocks for reliable Kurdish/Arabic text rendering.
// Depends on globals from dashboard.js:
// LANGS, currentLang, mgmtData, classes, weeks, months, call(), isoDate(),
// getSeverity, showToast, formatDate, getAcademicYear, instituteLogoUrl, ministryLogoUrl.
// Requires jsPDF and html2canvas.
// ══════════════════════════════════════════════════════

function escapeHtml(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(value ?? '').split('').map(function (ch) {
    return Object.prototype.hasOwnProperty.call(map, ch) ? map[ch] : ch;
  }).join('');
}

function sanitizeFileName(value, fallback = 'Report') {
  const banned = '\\/:*?"<>|';
  const cleaned = String(value ?? '').trim().split('').map(function (ch) {
    return banned.indexOf(ch) !== -1 ? '_' : ch;
  }).join('');
  const name = cleaned
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[_ .]+|[_ .]+$/g, '');
  return name || fallback;
}

function buildEmptyStateHTML(message) {
  return `<div style="margin:24px 0;padding:18px;text-align:center;color:#777;
    background:#f8f9fa;border:1px solid #e5e7eb;border-radius:8px;">
    ${escapeHtml(message || 'No data available')}
  </div>`;
}

function handlePDFExportError(error) {
  console.error('PDF export error:', error);
  const message = (LANGS[currentLang] && LANGS[currentLang].pdfExportError)
    || 'Unable to generate the PDF report.';
  showToast(message, 'error');
}

// ── PDF renderer ────────────────────────────────────────
// Renders the report in the browser, creates the PDF locally,
// and downloads it with pdf.save(). Nothing is uploaded to Drive.

async function renderHtmlToPDF(contentHTML, filename) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    throw new Error('jsPDF is not loaded.');
  }
  if (typeof html2canvas !== 'function') {
    throw new Error('html2canvas is not loaded.');
  }

  const { jsPDF } = window.jspdf;

  // Swap Drive-hosted logo URLs for embedded data URIs (html2canvas cannot load them: CORS).
  if (typeof ensurePdfLogos === 'function') {
    const logos = await ensurePdfLogos();
    if (logos.institute && instituteLogoUrl) contentHTML = contentHTML.split(escapeHtml(instituteLogoUrl)).join(logos.institute);
    if (logos.ministry && ministryLogoUrl) contentHTML = contentHTML.split(escapeHtml(ministryLogoUrl)).join(logos.ministry);
  }

  // Load the web font (Arabic/Kurdish subset) before drawing so the PDF matches the screen on every device.
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        document.fonts.load("400 14px Vazirmatn", "ڕۆژێ ەڵ"),
        document.fonts.load("600 14px Vazirmatn", "ڕۆژێ ەڵ"),
        document.fonts.load("700 14px Vazirmatn", "ڕۆژێ ەڵ")
      ]);
    }
  } catch (e) {}

  const holder = document.createElement('div');

  holder.style.position = 'fixed';
  holder.style.top = '0';
  holder.style.left = '-99999px';
  holder.style.width = '794px'; // A4 width @ 96dpi
  holder.style.background = '#ffffff';
  holder.style.color = '#222';
  holder.style.padding = '0';
  holder.style.margin = '0';
  holder.style.boxSizing = 'border-box';
  holder.innerHTML = contentHTML;

  document.body.appendChild(holder);

  try {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    const canvas = await html2canvas(holder, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    if (canvas.height === 0) {
      throw new Error('Canvas rendering failed (zero height).');
    }

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth  = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = pageWidth / canvas.width;
    const pageHeightInCanvasPx = pageHeight / ratio;

    let y = 0;
    let first = true;

    while (y < canvas.height) {
      const sliceH = Math.min(pageHeightInCanvasPx, canvas.height - y);
      if (sliceH <= 0) break;

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width  = canvas.width;
      sliceCanvas.height = sliceH;

      const ctx = sliceCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

      const imgData = sliceCanvas.toDataURL('image/jpeg', 0.95);

      if (!first) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, sliceH * ratio);

      first = false;
      y += sliceH;
    }

    pdf.save(sanitizeFileName(filename, 'Report.pdf'));
  } finally {
    if (holder.parentNode) holder.parentNode.removeChild(holder);
  }
}

// ── Shared HTML builders ────────────────────────────────

function buildReportHeaderHTML(title, subtitle) {
  const L = LANGS[currentLang] || {};

  return `
    <div dir="${escapeHtml(L.dir || 'ltr')}" lang="${escapeHtml(L.htmlLang || 'en')}"
      style="font-family:'Vazirmatn','Noto Sans Arabic',sans-serif;
      padding:28px 28px 20px;color:#222;box-sizing:border-box;">

      <div style="display:flex;align-items:center;justify-content:space-between;
        gap:18px;border-bottom:3px solid #667eea;padding-bottom:18px;margin-bottom:20px;">

        <img src="${escapeHtml(instituteLogoUrl)}"
          style="width:96px;height:96px;object-fit:contain;flex-shrink:0;">

        <div style="text-align:center;flex:1;min-width:0;padding:0 10px;">
          <div style="font-size:20px;font-weight:700;color:#333;line-height:1.3;">
            ${escapeHtml(L.dInstName)}
          </div>
          <div style="font-size:14px;color:#667eea;font-weight:600;margin-top:6px;">
            ${escapeHtml((L.academicYearLabel || 'Academic Year') + ': ' + (typeof getAcademicYear === 'function' ? getAcademicYear() : ''))}
          </div>
        </div>

        <img src="${escapeHtml(ministryLogoUrl)}"
          style="width:96px;height:96px;object-fit:contain;flex-shrink:0;">
      </div>

      <h2 style="color:#667eea;margin:0 0 6px;font-size:22px;line-height:1.3;">
        ${escapeHtml(title)}
      </h2>

      ${subtitle ? `
        <p style="color:#666;margin:0 0 18px;font-size:13px;line-height:1.5;">
          ${escapeHtml(subtitle)}
        </p>
      ` : ''}
  `;
}
function buildReportFooterHTML() {
  const L = LANGS[currentLang] || {};
  const now = new Date();

  return `
      <p style="margin:28px 0 0;color:#999;font-size:10px;
        border-top:1px solid #e5e7eb;padding-top:9px;">
        ${escapeHtml(L.reportGenerated || 'Generated')}:
        ${escapeHtml(formatDMY(now))}
        ${escapeHtml(now.toLocaleTimeString())}
      </p>
    </div>
  `;
}

function buildSimpleTableHTML(headers, rows) {
  let html = `
    <table style="width:100%;border-collapse:collapse;font-size:11px;
      table-layout:auto;margin:0 0 16px;">
      <thead>
        <tr>
  `;

  headers.forEach(h => {
    html += `
      <th style="background:#667eea;color:#fff;padding:8px 9px;
        text-align:start;border:1px solid #667eea;font-weight:600;
        line-height:1.35;">
        ${escapeHtml(h)}
      </th>
    `;
  });

  html += `</tr></thead><tbody>`;

  rows.forEach((row, i) => {
    html += `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f8f9ff'};">
    `;

    row.forEach(cell => {
      html += `
        <td style="padding:7px 9px;border:1px solid #e8eaf0;
          vertical-align:top;line-height:1.4;word-break:break-word;">
          ${escapeHtml(cell)}
        </td>
      `;
    });

    html += `</tr>`;
  });

  html += `</tbody></table>`;
  return html;
}

// ── Logos: the PDF renderer cannot draw cross-origin images reliably, so embed them as data URIs ──
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
async function ensurePdfLogos() {
  if (window._pdfLogos) return window._pdfLogos;
  const out = {};
  for (const [key, url] of [['institute', instituteLogoUrl], ['ministry', ministryLogoUrl]]) {
    if (!url || url.indexOf('data:') === 0) continue;
    try { const res = await fetch(url); out[key] = await blobToDataURL(await res.blob()); } catch (e) { /* keep the URL */ }
  }
  window._pdfLogos = out;
  return out;
}

// Rows for the weekly / monthly / roster tables.  `students` come from report_class_summary:
// [{name, total (unexcused lectures), vacation_days, subjects:{subject: lectures}}]
function summaryTableRows(students, subArr) {
  return students.map(s => {
    const cells = [s.name];
    subArr.forEach(sub => cells.push(String((s.subjects || {})[sub] || '-')));
    cells.push(String(s.total));
    cells.push(String(s.vacation_days || '-'));
    return cells;
  });
}
function buildClassSummaryTablesHTML(summary) {
  const L = LANGS[currentLang] || {};
  let html = '';
  (summary || []).forEach(entry => {
    const subArr = summarySubjects(entry.students);
    html += `
      <h3 style="color:#667eea;font-size:15px;margin:18px 0 8px;">
        🏫 ${escapeHtml(L.classLabel || 'Class')} ${escapeHtml(entry.class)}
      </h3>
    `;
    const headers = [L.studentLabel || 'Student', ...subArr, L.totalLabel || 'Total', L.colVacationDays || 'Vacation Days'];
    html += buildSimpleTableHTML(headers, summaryTableRows(entry.students, subArr));
  });
  return html || buildEmptyStateHTML(L.noAbsences);
}

// ── Daily export ────────────────────────────────────────

async function exportDailyPDF() {
  try {
    const L = LANGS[currentLang] || {};
    const val = (document.getElementById('dailyDate') || {}).value || '';
    if (!val) return;
    if (typeof showToast === 'function') showToast(L.exportingPdf, 'success');

    const rows = await call('report_rows', { p_from: val, p_to: val });
    const names = new Set(classes || []);
    rows.forEach(r => names.add(r.class));
    const byClass = {};
    sortNames([...names]).forEach(c => byClass[c] = {});

    rows.forEach(row => {
      if (!row.class) return;
      (String(row.lecture).match(/\d+/g) || ['1']).forEach(n => {
        const num = parseInt(n, 10);
        if (num < 1 || num > 6) return;
        if (!byClass[row.class][num]) byClass[row.class][num] = { subject: row.subject, teacher: row.teacher, students: [] };
        const cell = byClass[row.class][num];
        (row.students || []).forEach(st => {
          if (!cell.students.some(x => x.name === st.name)) cell.students.push({ name: st.name, excused: !!st.excused });
        });
      });
    });

    let body = buildReportHeaderHTML(L.dDailyTitle, formatDMY(val));
    let any = false;
    const lecPrefix = (typeof LEC_PREFIX !== 'undefined' && LEC_PREFIX[currentLang]) || 'Lec';
    const six = [1, 2, 3, 4, 5, 6];

    Object.keys(byClass).forEach(cls => {
      const lecs = byClass[cls];
      if (!Object.keys(lecs).length) return;
      any = true;
      body += `
        <h3 style="color:#667eea;font-size:15px;margin:18px 0 8px;">
          🏫 ${escapeHtml(L.classLabel || 'Class')} ${escapeHtml(cls)}
        </h3>
      `;
      const headers = six.map(n => `${lecPrefix} ${n}`);
      const subjRow = six.map(n => lecs[n] ? lecs[n].subject : '—');
      const absRow = six.map(n => {
        const l = lecs[n];
        if (l && l.students.length) {
          return l.students.map(s => s.excused ? `${s.name} (${L.vacationLabel || 'Vacation'})` : s.name).join(', ');
        }
        return l ? (L.noneAbsent || 'None') : '';
      });
      const teacherRow = six.map(n => lecs[n] && lecs[n].teacher ? ('👨\u200d🏫 ' + lecs[n].teacher) : '');
      body += buildSimpleTableHTML(headers, [subjRow, absRow, teacherRow]);
    });

    if (!any) body += buildEmptyStateHTML(L.noAbsences);
    body += buildReportFooterHTML();
    await renderHtmlToPDF(body, `Daily_Report_${formatDMY(val).split('/').join('-')}.pdf`);
  } catch (error) {
    handlePDFExportError(error);
  }
}

// ── Weekly export ───────────────────────────────────────

async function exportWeeklyPDF() {
  try {
    const L = LANGS[currentLang] || {};
    const idx = parseInt((document.getElementById('weekSelect') || {}).value, 10);
    if (isNaN(idx) || !weeks || !weeks[idx]) return;
    const week = weeks[idx];
    if (typeof showToast === 'function') showToast(L.exportingPdf, 'success');

    const data = await call('report_class_summary', { p_from: isoDate(week.start), p_to: isoDate(week.end) });
    const subtitle = `${L.weekLabel || 'Week'} ${week.number}: ${formatDate(week.start)} - ${formatDate(week.end)}`;
    let body = buildReportHeaderHTML(L.dWeeklyTitle, subtitle);
    body += buildClassSummaryTablesHTML(data);
    body += buildReportFooterHTML();
    await renderHtmlToPDF(body, `Weekly_Report_${week.number}.pdf`);
  } catch (error) {
    handlePDFExportError(error);
  }
}

// ── Monthly export ──────────────────────────────────────

async function exportMonthlyPDF() {
  try {
    const L = LANGS[currentLang] || {};
    const idx = parseInt((document.getElementById('monthSelect') || {}).value, 10);
    if (isNaN(idx) || !months || !months[idx]) return;
    const month = months[idx];
    if (typeof showToast === 'function') showToast(L.exportingPdf, 'success');

    const data = await call('report_class_summary', { p_from: isoDate(month.start), p_to: isoDate(month.end) });
    let body = buildReportHeaderHTML(L.dMonthlyTitle, month.name);
    body += buildClassSummaryTablesHTML(data);
    body += buildReportFooterHTML();
    await renderHtmlToPDF(body, `Monthly_Report_${sanitizeFileName(month.name, 'Month')}.pdf`);
  } catch (error) {
    handlePDFExportError(error);
  }
}

// ── Roster export ───────────────────────────────────────

async function exportRosterPDF() {
  try {
    const L = LANGS[currentLang] || {};
    const cls = (document.getElementById('rosterClass') || {}).value || '';
    const min = parseInt((document.getElementById('minAbsences') || {}).value || '0', 10) || 0;
    if (!cls) return;
    if (typeof showToast === 'function') showToast(L.exportingPdf, 'success');

    const data = await call('report_class_summary', { p_class: cls });
    const entry = data.find(x => x.class === cls);
    const students = (entry ? entry.students : []).filter(s => s.total >= min);
    const subArr = summarySubjects(students);
    const headers = [L.studentLabel || 'Student', ...subArr, L.totalLabel || 'Total', L.colVacationDays || 'Vacation Days'];

    let body = buildReportHeaderHTML(L.dRosterTitle, `${L.classLabel || 'Class'} ${cls}`);
    body += students.length ? buildSimpleTableHTML(headers, summaryTableRows(students, subArr)) : buildEmptyStateHTML(L.noAbsences);
    body += buildReportFooterHTML();
    await renderHtmlToPDF(body, `Roster_${sanitizeFileName(cls, 'Class')}.pdf`);
  } catch (error) {
    handlePDFExportError(error);
  }
}

// ── Graduates export ────────────────────────────────────

async function exportGraduatesPDF() {
  try {
    const L = LANGS[currentLang] || {};
    const yearFilter = (document.getElementById('gradYearFilter') || {}).value || '';
    const list = ((mgmtData && mgmtData.graduates) || []).filter(g => !yearFilter || g.year === yearFilter);
    if (typeof showToast === 'function') showToast(L.exportingPdf, 'success');

    const byClass = {};
    list.forEach(g => {
      const c = g.className || 'Unassigned';
      (byClass[c] = byClass[c] || []).push(g.studentName || '');
    });

    let body = buildReportHeaderHTML(L.dGraduatesTitle, yearFilter || (L.allYears || 'All Years'));
    if (!Object.keys(byClass).length) body += buildEmptyStateHTML(L.noAbsences || 'No graduates found');
    Object.keys(byClass).sort().forEach(cls => {
      body += `
        <h3 style="color:#667eea;font-size:15px;margin:18px 0 8px;">
          🏫 ${escapeHtml(cls)}
        </h3>
      `;
      body += buildSimpleTableHTML(['#', L.studentLabel || 'Student'], byClass[cls].map((name, i) => [String(i + 1), name]));
    });
    body += buildReportFooterHTML();
    await renderHtmlToPDF(body, `Graduates_${sanitizeFileName(yearFilter || 'All', 'All')}.pdf`);
  } catch (error) {
    handlePDFExportError(error);
  }
}

// ── Official Certificate export ─────────────────────────

async function exportCertificatePDF(studentId, encodedName) {
  try {
    const L = LANGS[currentLang] || {};
    const name = decodeURIComponent(encodedName || '');
    if (typeof showToast === 'function') showToast(L.exportingPdf, 'success');

    const log = await call('student_log', { p_student_id: studentId || null, p_name: studentId ? null : name });
    const d = summariseLog(log);
    const rowsAsc = [...d.log].reverse();                       // oldest first on the certificate
    const subjects = [...new Set(d.log.map(a => a.subject).filter(Boolean))];
    const sev = getSeverity(d.total);
    const statusText = sev === 'high' ? L.badgeHigh : sev === 'medium' ? L.badgeMedium : L.badgeLow;
    const statusColor = sev === 'high' ? '#c8402a' : sev === 'medium' ? '#ff8800' : '#2d6a4f';
    const shownName = (log[0] && log[0].name) || name;

    let body = buildReportHeaderHTML(L.certTitle, '');
    body += `
      <div style="background:#f8f9ff;border:1px solid #d0d7ff;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
        <div style="font-size:16px;font-weight:700;color:#333;margin-bottom:7px;">👤 ${escapeHtml(shownName)}</div>
        <div style="font-size:13px;color:#555;line-height:1.9;">
          <strong>${escapeHtml(L.profileClass)}:</strong> ${escapeHtml(d.cls || '—')}<br>
          <strong>${escapeHtml(L.profileTotal)}:</strong>
          <span style="color:${statusColor};font-weight:700;">${escapeHtml(d.total)}</span>
          &nbsp;&nbsp;
          <strong>${escapeHtml(L.colStatus || 'Status')}:</strong>
          <span style="color:${statusColor};font-weight:700;">${escapeHtml(statusText)}</span><br>
          <strong>${escapeHtml(L.colVacationDays || 'Vacation Days')}:</strong>
          <span style="color:#b35900;font-weight:700;">${escapeHtml(d.vacationDates.size)}</span><br>
          <strong>${escapeHtml(L.profileSubjects)}:</strong> ${escapeHtml(subjects.join(', ') || '—')}<br>
          <strong>${escapeHtml(L.profileEntries)}:</strong> ${escapeHtml(d.log.length)}
        </div>
      </div>
      <h3 style="color:#667eea;font-size:14px;margin:0 0 8px;">${escapeHtml(L.profileHistory)}</h3>
    `;
    const headers = [L.colDate, L.colLecture, L.colSubject, L.colTeacher, L.colStatus || 'Status'];
    const rows = rowsAsc.map(a => [formatDMY(a.date), a.lecture, a.subject, a.teacher, a.excused ? (L.vacationLabel || 'Vacation') : '']);
    body += rows.length ? buildSimpleTableHTML(headers, rows) : buildEmptyStateHTML(L.noAbsences);
    body += `
      <div style="margin-top:50px;display:flex;justify-content:space-between;gap:40px;">
        <div style="flex:1;"><div style="border-top:1.5px solid #333;padding-top:6px;font-size:12px;color:#555;">${escapeHtml(L.certSignature)}</div></div>
        <div style="flex:1;"><div style="border-top:1.5px solid #333;padding-top:6px;font-size:12px;color:#555;">${escapeHtml(L.certDate)}: _______________</div></div>
      </div>
    `;
    body += buildReportFooterHTML();
    await renderHtmlToPDF(body, `Certificate_${sanitizeFileName(shownName, 'Student')}.pdf`);
  } catch (error) {
    handlePDFExportError(error);
  }
}
