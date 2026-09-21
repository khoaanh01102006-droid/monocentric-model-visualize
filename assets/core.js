/* Urban Economics (V2) · core: data registry, number formatting, verified quotations,
   equations, table of contents, stepped figures.

   Rules enforced here (see ../TIEN_DO.md):
   L1 — a data bundle without source, licence, access date and script is refused.
   L2 — numbers in the text are never typed: <span data-num="bundle.path" data-fmt="…">.
   Quotations are never typed either: <blockquote data-quote="bundle.key"> takes the text
   that kich_ban/trich_dan.mjs found in the source PDF. */
(function () {
  'use strict';
  const K = (window.KTDT = window.KTDT || {});
  K.duLieu = K.duLieu || {};
  K.lang = document.documentElement.lang === 'vi' ? 'vi' : 'en';
  K.t = (en, vi) => (K.lang === 'vi' ? vi : en);

  K.dangKy = function (ten, bo) {
    const thieu = ['tieuDe', 'loai', 'kichBan', 'nguon'].filter((k) => !bo[k]);
    (bo.nguon || []).forEach((n, i) => ['ten', 'url', 'giayPhep', 'truyCap'].forEach((k) => { if (!n[k]) thieu.push('nguon[' + i + '].' + k); }));
    if (thieu.length) throw new Error('L1: data bundle "' + ten + '" lacks ' + thieu.join(', '));
    K.duLieu[ten] = bo;
  };

  K.lay = function (duong) {
    return String(duong).split('.').reduce((o, k) => (o == null ? undefined : o[k]), K.duLieu);
  };

  /* number formats: "0" "1" "2" "3" decimals · "%0" "%1" fraction as percent ·
     "e%1" log-point coefficient b shown as 100·(e^b − 1) percent · "x1" ratio ·
     "abs…" prefix drops the sign · "+…" prefix forces a sign · "M1" millions · "y" a year */
  const nf = {};
  K.fmt = function (v, dang) {
    if (v == null || Number.isNaN(+v)) return '⚠';
    dang = dang || '0';
    let abs = false, dau = false;
    if (dang.startsWith('abs')) { abs = true; dang = dang.slice(3); }
    if (dang.startsWith('+')) { dau = true; dang = dang.slice(1); }
    let x = +v, hau = '';
    if (dang === 'sci') { const [mm, ee] = x.toExponential(1).split('e'); return K.fmt(+mm, '1') + ' × 10' + String(+ee).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]); }
    if (dang === 'y') return String(Math.round(x));
    const m = /^(e%|%|x|M)?(\d)$/.exec(dang);
    if (!m) throw new Error('unknown number format ' + dang);
    if (m[1] === '%') { x *= 100; hau = K.lang === 'vi' ? '%' : '%'; }
    if (m[1] === 'e%') { x = 100 * (Math.exp(x) - 1); hau = '%'; }
    if (m[1] === 'x') hau = '×';
    if (m[1] === 'M') x /= 1e6;
    if (abs) x = Math.abs(x);
    const d = +m[2], key = K.lang + d;
    nf[key] = nf[key] || new Intl.NumberFormat(K.lang === 'vi' ? 'vi-VN' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    let s = nf[key].format(x).replace('-', '−');
    if (dau && x > 0) s = '+' + s;
    return s + hau;
  };

  K.dienSo = function (goc) {
    (goc || document).querySelectorAll('[data-num]').forEach((el) => {
      const v = K.lay(el.dataset.num);
      if (typeof v !== 'number') { el.textContent = '⚠'; el.classList.add('missing'); console.error('L2: no number at ' + el.dataset.num); return; }
      el.textContent = K.fmt(v, el.dataset.fmt);
      el.classList.add('num');
    });
    (goc || document).querySelectorAll('[data-str]').forEach((el) => {
      const v = K.lay(el.dataset.str);
      if (v == null) { el.textContent = '⚠'; el.classList.add('missing'); return; }
      el.textContent = typeof v === 'object' ? v[K.lang] : v;
    });
  };

  /* quotations: English original always; Vietnamese pages add the course's translation,
     written inside the blockquote as <p class="tr">…</p>, labelled as a translation */
  K.dienTrich = function () {
    document.querySelectorAll('blockquote[data-quote]').forEach((bq) => {
      const [bo, nhom, ma] = bq.dataset.quote.split('.');
      const q = K.duLieu[bo] && K.duLieu[bo][nhom] && K.duLieu[bo][nhom][ma];
      if (!q) { bq.textContent = '⚠ quotation ' + bq.dataset.quote + ' not verified'; bq.classList.add('missing'); return; }
      const src = K.duLieu[bo].nguon[{ liotta: 0, vur: 1, ucdb: 2, degurba: 3, bellefon: 4, ghsldp: 5, easts: 6, wb20: 7 }[nhom]];
      const tr = bq.querySelector('.tr');
      const who = bq.dataset.who || '';
      bq.classList.add('quote');
      bq.innerHTML = '';
      const p = document.createElement('p'); p.lang = 'en'; p.textContent = '“' + q.chu + '”'; bq.appendChild(p);
      if (tr) { tr.insertAdjacentHTML('afterbegin', '<b>' + K.t('Translation: ', 'Bản dịch của học phần: ') + '</b>'); bq.appendChild(tr); }
      const c = document.createElement('p'); c.className = 'cite';
      c.innerHTML = '— ' + who + ', ' + K.t('p. ', 'tr. ') + q.trang + '. <a href="' + src.url + '">' + src.giayPhep + '</a>. ' +
        '<span class="checked">' + K.t('Wording checked against the source PDF by', 'Nguyên văn đã đối chiếu với PDF gốc bằng') + ' <code>kich_ban/trich_dan.mjs</code>.</span>';
      bq.appendChild(c);
    });
  };

  /* KaTeX: \( … \) inline, \[ … \] display */
  K.dungCongThuc = function () {
    if (!window.renderMathInElement) { console.warn('KaTeX not loaded'); return; }
    window.renderMathInElement(document.querySelector('.main') || document.body, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false,
    });
  };

  /* table of contents from h2[id] */
  K.dungMucLuc = function () {
    const toc = document.querySelector('.toc nav');
    if (!toc) return;
    const hs = [...document.querySelectorAll('.main h2[id]')];
    toc.innerHTML = '<div class="toc-title">' + K.t('On this page', 'Trong bài') + '</div>' +
      hs.map((h) => { const s = h.querySelector('.sec'); const rest = [...h.childNodes].filter((n) => n !== s).map((n) => n.textContent).join(''); return '<a href="#' + h.id + '">' + (s ? s.textContent + '&ensp;' : '') + rest + '</a>'; }).join('');
    const links = [...toc.querySelectorAll('a')];
    const mark = () => {
      let cur = 0;
      hs.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) cur = i; });
      links.forEach((a, i) => a.classList.toggle('active', i === cur));
    };
    let hen = null;
    window.addEventListener('scroll', () => { if (hen) return; hen = setTimeout(() => { hen = null; mark(); }, 80); }, { passive: true });
    mark();
  };

  /* stepped figure: buttons + ←/→ keys while the figure has focus or is in view */
  K.buoc = function (fig, onStep) {
    const nut = [...fig.querySelectorAll('.steps button[data-go]')];
    const chu = [...fig.querySelectorAll('.step-text [data-step]')];
    let cur = -1;
    const go = (i) => {
      i = Math.max(0, Math.min(nut.length - 1, i));
      if (i === cur) return;
      cur = i;
      nut.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      chu.forEach((c) => c.classList.toggle('on', +c.dataset.step === i));
      onStep(i);
    };
    nut.forEach((b) => b.addEventListener('click', () => go(+b.dataset.go)));
    fig.tabIndex = 0;
    const trongTam = () => { const r = fig.getBoundingClientRect(); return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4; };
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (!(fig.contains(document.activeElement) || trongTam())) return;
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); }
    });
    go(0);
    return { go, get cur() { return cur; } };
  };

  K.khoiDong = function (fn) {
    const chay = () => {
      try { K.dienSo(); K.dienTrich(); K.dungCongThuc(); K.dungMucLuc(); if (fn) fn(); }
      catch (e) { console.error(e); const b = document.createElement('div'); b.className = 'missing'; b.textContent = 'Error: ' + e.message; document.body.prepend(b); }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay); else chay();
  };
})();
