/* Urban Economics (V2) · charts in SVG, drawn to the World Bank Data Visualization Style Guide:
   horizontal gridlines grey-200 dashed 4 2, zero/base line grey-300, ~5 round ticks, tick
   labels subtle, axis labels semibold, series labelled directly instead of a legend box.

   L3 — every series declares what it is, and the line style follows from that alone:
     data      solid                    (measured)
     estimate  dashed 6 4, dark         (fitted to data: a regression line)
     model     dashed 8 5               (theory: output of the model, not a measurement)
     baseline  dashed 4 4, grey         (the model before the reader changed a parameter)
     reference dotted, grey
   A series without a kind is refused, and so is a chart without sources.            */
(function () {
  'use strict';
  const K = window.KTDT;
  const NS = 'http://www.w3.org/2000/svg';
  const KIND = {
    data: { dash: null, width: 2.5 },
    estimate: { dash: '6 4', width: 2, color: '#111111' },
    model: { dash: '8 5', width: 2.5 },
    baseline: { dash: '4 4', width: 2, color: '#8A969F' },
    reference: { dash: '2 3', width: 1.5, color: '#8A969F' },
  };
  const KIND_NAME = {
    data: ['measured data', 'số liệu đo'], estimate: ['fitted line (estimate)', 'đường khớp (ước lượng)'],
    model: ['model output', 'kết quả mô hình'], baseline: ['model before the change', 'mô hình trước khi đổi'],
  };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10);
  }
  function linTicks(a, b, n) {
    const s = niceStep((b - a) / (n || 5)), t = [];
    for (let v = Math.ceil(a / s - 1e-9) * s; v <= b + s * 1e-9; v += s) t.push(+v.toFixed(10));
    return t;
  }
  function logTicks(a, b) {
    const t = [];
    for (let k = Math.floor(Math.log10(a)); k <= Math.ceil(Math.log10(b)); k++)
      for (const m of [1, 2, 5]) { const v = m * Math.pow(10, k); if (v >= a * 0.999 && v <= b * 1.001) t.push(v); }
    return t.length > 7 ? t.filter((v) => Math.abs(Math.log10(v) % 1) < 1e-9) : t;
  }

  K.chart = function (host, spec) {
    if (!spec.sources || !spec.sources.length) throw new Error('L1: chart without sources');
    spec.sources.forEach((s) => { if (!K.duLieu[s]) throw new Error('L1: chart source "' + s + '" is not a registered bundle'); });
    const check = (ss) => ss.forEach((s) => { if (!KIND[s.kind]) throw new Error('L3: series "' + (s.id || s.label) + '" has no valid kind'); });
    check(spec.series);
    host.classList.add('chart');
    let series = spec.series, focus = null, tip = null, lastW = 0;

    function draw() {
      const W = host.clientWidth || 600;
      lastW = W;
      const H = spec.height || Math.round(Math.max(240, Math.min(430, W * 0.58)));
      const X = spec.x, Y = spec.y;
      const yt = Y.ticks || (Y.log ? logTicks(Y.min, Y.max) : linTicks(Y.min, Y.max, Y.n || 5));
      const xt = X.ticks || linTicks(X.min, X.max, X.n || (W < 420 ? 4 : 6));
      const fy = (v) => K.fmt(v, Y.fmt || '0'), fx = (v) => K.fmt(v, X.fmt || '0');
      const labW = Math.max(...yt.map((v) => fy(v).length)) * 7.4 + 10;
      const hasDirect = series.some((s) => s.label && s.labelAt !== 'none');
      const m = { t: Y.label ? 30 : 12, r: hasDirect ? (spec.rightMargin || 150) : 18, b: X.label ? 50 : 30, l: labW };
      if (W < 480 && hasDirect) m.r = Math.min(m.r, 110);
      const pw = W - m.l - m.r, ph = H - m.t - m.b;
      const sx = (v) => m.l + ((v - X.min) / (X.max - X.min)) * pw;
      const sy = Y.log
        ? (v) => m.t + ph - ((Math.log(Math.max(v, 1e-12)) - Math.log(Y.min)) / (Math.log(Y.max) - Math.log(Y.min))) * ph
        : (v) => m.t + ph - ((v - Y.min) / (Y.max - Y.min)) * ph;

      host.innerHTML = '';
      const svg = el('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': spec.alt || '' }, host);
      if (spec.title) el('text', { x: 0, y: 14, class: 'panel-title' }, svg).textContent = spec.title;
      const g = el('g', {}, svg);
      yt.forEach((v) => {
        const y = sy(v);
        const base = (!Y.log && Math.abs(v) < 1e-12) || v === yt[0];
        el('line', { x1: m.l, x2: m.l + pw, y1: y, y2: y, stroke: base ? '#8A969F' : '#CED4DE', 'stroke-width': 1, 'stroke-dasharray': base ? null : '4 2' }, g);
        const t = el('g', { class: 'tick' }, g);
        el('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end' }, t).textContent = fy(v);
      });
      if (Y.label) el('text', { x: 0, y: m.t - 14, class: 'axis-label' }, g).textContent = Y.label;
      el('line', { x1: m.l, x2: m.l + pw, y1: m.t + ph, y2: m.t + ph, stroke: '#8A969F', 'stroke-width': 1 }, g);
      xt.forEach((v) => {
        const x = sx(v); if (x < m.l - 1 || x > m.l + pw + 1) return;
        el('line', { x1: x, x2: x, y1: m.t + ph, y2: m.t + ph + 4, stroke: '#8A969F' }, g);
        const t = el('g', { class: 'tick' }, g);
        el('text', { x, y: m.t + ph + 18, 'text-anchor': 'middle' }, t).textContent = fx(v);
      });
      if (X.label) el('text', { x: m.l + pw / 2, y: H - 8, 'text-anchor': 'middle', class: 'axis-label' }, g).textContent = X.label;

      (spec.bands || []).forEach((b) => {
        el('rect', { x: sx(b.x0), y: m.t, width: Math.max(0, sx(b.x1) - sx(b.x0)), height: ph, fill: '#EBEEF4' }, g);
        if (b.text) el('text', { x: sx(b.x0) + 6, y: b.textAt === 'bottom' ? m.t + ph - 8 : m.t + 14, class: 'tick', fill: '#666', 'font-size': 12.5 }, g).textContent = b.text;
      });
      const clipId = 'c' + Math.random().toString(36).slice(2);
      const cp = el('clipPath', { id: clipId }, el('defs', {}, svg));
      el('rect', { x: m.l, y: m.t - 2, width: pw, height: ph + 4 }, cp);
      const plot = el('g', { 'clip-path': 'url(#' + clipId + ')' }, svg);
      const labels = [];
      const pts = [];
      series.forEach((s) => {
        const k = KIND[s.kind], color = s.color || k.color || '#0071BC';
        const sg = el('g', { class: 'series', 'data-id': s.id || '' }, plot);
        if (focus && !focus.includes(s.id)) sg.setAttribute('opacity', 0.18);
        const inRange = s.points.filter((p) => p[0] >= X.min && p[0] <= X.max && p[1] != null && (!Y.log || p[1] > 0));
        if (s.type === 'points') {
          inRange.forEach((p) => {
            el('circle', { cx: sx(p[0]), cy: sy(p[1]), r: s.r || 3, fill: color, 'fill-opacity': s.opacity ?? 0.75, stroke: '#fff', 'stroke-width': s.r > 2.5 ? 0.75 : 0 }, sg);
            if (s.hover !== false) pts.push({ s, p, x: sx(p[0]), y: sy(p[1]) });
          });
        } else {
          const d = inRange.map((p, i) => (i ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1)).join('');
          el('path', { d, class: 'line', stroke: color, 'stroke-width': s.width || k.width, 'stroke-dasharray': k.dash }, sg);
          if (s.hover) inRange.forEach((p) => pts.push({ s, p, x: sx(p[0]), y: sy(p[1]) }));
          if (s.label && s.labelAt !== 'none' && inRange.length) {
            const last = s.labelAt != null ? inRange.reduce((a, b) => (Math.abs(b[0] - s.labelAt) < Math.abs(a[0] - s.labelAt) ? b : a)) : inRange[inRange.length - 1];
            labels.push({ s, color: s.labelColor || color, x: sx(last[0]), y: sy(last[1]) });
          }
        }
      });
      /* direct labels to the right of the line ends, pushed apart vertically */
      labels.sort((a, b) => a.y - b.y);
      const hLab = (l) => String(l.s.label).split('\n').length * 15 + 2;
      for (let i = 1; i < labels.length; i++) { const min = labels[i - 1].y + hLab(labels[i - 1]); if (labels[i].y < min) labels[i].y = min; }
      const tran = labels.length ? labels[labels.length - 1].y + hLab(labels[labels.length - 1]) - (m.t + ph + 18) : 0;
      if (tran > 0) { labels.forEach((l) => { l.y -= tran; }); for (let i = labels.length - 2; i >= 0; i--) { const max = labels[i + 1].y - hLab(labels[i]); if (labels[i].y > max) labels[i].y = max; } }
      labels.forEach((l) => {
        const lines = String(l.s.label).split('\n');
        const tx = el('text', { x: Math.min(l.x + 8, W - m.r + 8), y: l.y + 4, class: 'direct', fill: l.color, opacity: focus && !focus.includes(l.s.id) ? 0.25 : 1 }, svg);
        lines.forEach((ln, i) => { const ts = el('tspan', { x: Math.min(l.x + 8, W - m.r + 8), dy: i ? 15 : 0 }, tx); ts.textContent = ln; });
      });
      (spec.marks || []).forEach((mk) => {
        const x = sx(mk.x), y = mk.y != null ? sy(mk.y) : null;
        if (mk.type === 'vline') {
          el('line', { x1: x, x2: x, y1: m.t, y2: m.t + ph, stroke: mk.color || '#111', 'stroke-width': 1, 'stroke-dasharray': '3 3' }, svg);
          if (mk.text) el('text', { x: x + 6, y: m.t + 12, class: 'direct', fill: mk.color || '#111' }, svg).textContent = mk.text;
        }
        if (mk.type === 'dot' && y != null) {
          el('circle', { cx: x, cy: y, r: 4.5, fill: mk.color || '#111', stroke: '#fff', 'stroke-width': 1.5 }, svg);
          if (mk.text) el('text', { x: x + 9, y: y - 8, class: 'direct', fill: mk.color || '#111' }, svg).textContent = mk.text;
        }
      });

      /* hover: nearest point within 14 px */
      if (pts.length && spec.tip) {
        svg.addEventListener('mousemove', (e) => {
          const r = svg.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
          let best = null, bd = 196;
          for (const q of pts) { const d = (q.x - mx) ** 2 + (q.y - my) ** 2; if (d < bd) { bd = d; best = q; } }
          if (!best) { if (tip) tip.style.display = 'none'; return; }
          if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
          tip.innerHTML = spec.tip(best.s, best.p);
          tip.style.display = 'block';
          const tw = tip.offsetWidth;
          tip.style.left = Math.min(W - tw - 4, Math.max(0, best.x + 12)) + 'px';
          tip.style.top = Math.max(0, best.y - 46) + 'px';
        });
        svg.addEventListener('mouseleave', () => { if (tip) tip.style.display = 'none'; });
        tip = null;
      }
    }

    /* key of line styles, only when a chart mixes kinds */
    function drawKinds() {
      const kinds = [...new Set(series.map((s) => s.kind))].filter((k) => KIND_NAME[k]);
      if ((kinds.length < 2 && !spec.showKinds) || spec.showKinds === false) return;   // false: the figure draws its own key
      const box = document.createElement('div'); box.className = 'kinds';
      kinds.forEach((k) => {
        const s = series.find((q) => q.kind === k), c = (KIND[k].color || s.color || '#0071BC');
        const sp = document.createElement('span');
        sp.innerHTML = s.type === 'points'
          ? '<svg width="14" height="10"><circle cx="7" cy="5" r="3.5" fill="' + c + '"/></svg>'
          : '<svg width="30" height="10"><line x1="1" x2="29" y1="5" y2="5" stroke="' + c + '" stroke-width="2.5"' + (KIND[k].dash ? ' stroke-dasharray="' + KIND[k].dash + '"' : '') + '/></svg>';
        sp.appendChild(document.createTextNode(KIND_NAME[k][K.lang === 'vi' ? 1 : 0]));
        box.appendChild(sp);
      });
      host.appendChild(box);
    }

    function render() { draw(); drawKinds(); }
    render();
    let hen = null;
    if (window.ResizeObserver) new ResizeObserver(() => { if (Math.abs((host.clientWidth || 0) - lastW) < 2) return; clearTimeout(hen); hen = setTimeout(render, 120); }).observe(host);
    return {
      update(ss, patch) { check(ss); series = ss; if (patch) Object.assign(spec, patch); render(); },   // patch: e.g. new marks
      focus(ids) { focus = ids; render(); },
    };
  };
})();
