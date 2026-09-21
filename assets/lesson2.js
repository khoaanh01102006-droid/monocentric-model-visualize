/* Lesson 2 · figures. Data: du_lieu/l2_tphcm.js (kich_ban/l2_tphcm.mjs), l2_nong_nghiep.js, l2_vung_do_thi.js,
   l2_luoi_dan_so.js, trich_dan.js. Map 2.2 is drawn by assets/non_gia_3d.js, Map 2.3 by assets/canh_ranh.js,
   Map 2.4 by assets/mat_cat_3d.js. */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const PRICE = ['#FDF7DB', '#ECB63A', '#BE792B', '#8D4117', '#5C0000'];   // WB monochrome yellow
  const DENS = ['#E3F6FD', '#75CCEC', '#089BD4', '#0169A1', '#023B6F'];    // WB monochrome blue
  const UC = '#0B3C8C';                                                      // urban centre outline (Map 2.3)

  K.khoiDong(() => {
    const b = K.duLieu.l2_tphcm;
    const places = b.nhan.map((n) => ({ name: n[K.lang], at: n.toaDo, dot: true, minor: n.cap > 1, kc: n.kc }));
    dataRows(b);
    map21(b, places);
    fig22(b);
    K.nonGia3d();
    K.canhRanh();
    K.matCat3d();
    section22(b, K.duLieu.l2_nong_nghiep);
    map23(b, places);
    fig24(b);
    fig25(b);
    K.veVeDuLieu();
  });

  const km = (v) => K.fmt(v, '0') + ' km';
  const kmLat = 110.574;
  const boundsAround = (c, r) => { const kmLon = 111.32 * Math.cos(c[1] * Math.PI / 180); return [[c[0] - r / kmLon, c[1] - r / kmLat], [c[0] + r / kmLon, c[1] + r / kmLat]]; };

  function dataRows(b) {
    const rows = [...b.nguon, ...K.duLieu.l2_nong_nghiep.nguon, ...K.duLieu.l2_vung_do_thi.nguon, ...K.duLieu.l2_luoi_dan_so.nguon, ...K.duLieu.trich_dan.nguon];
    document.getElementById('data-rows').innerHTML = rows.map((n) => '<tr><td>' + (K.lang === 'vi' && n.tenVi ? n.tenVi : n.ten) +
      ' <a href="' + n.url + '">' + t('link', 'liên kết') + '</a></td><td>' + n.giayPhep + '</td><td class="r">' + n.truyCap + '</td></tr>').join('');
  }

  /* outline of the 2020 urban centre (GHSL), drawn over a data map; returns the legend row */
  function ucOutline(map) {
    const f = K.duLieu.l2_vung_do_thi.ttdt.hinh.features.find((q) => q.properties.nam === 2020);
    map.addSource('uc20', { type: 'geojson', data: f });
    map.addLayer({ id: 'uc20-casing', type: 'line', source: 'uc20', paint: { 'line-color': '#FFFFFF', 'line-width': 4.5, 'line-opacity': 0.9 } });
    map.addLayer({ id: 'uc20-line', type: 'line', source: 'uc20', paint: { 'line-color': UC, 'line-width': 2.2 } });
  }
  const ucKey = () => '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#fff" stroke-width="4.5"/><line x1="0" x2="28" y1="5" y2="5" stroke="' + UC + '" stroke-width="2.2"/></svg>' +
    t('urban centre, 2020 (GHSL)', 'trung tâm đô thị 2020 (GHSL)') + '</div>';

  /* Map 2.1 — ward land prices */
  function map21(b, places) {
    const feats = b.gia.phuong.features.filter((f) => f.properties.kc <= 150);
    const map = K.map('m-2-1', { center: b.tam, zoom: 8 });
    const unit = t('thousand VND/m²', 'nghìn đồng/m²');
    map.on('load', () => {
      K.mapChoropleth(map, { id: 'gia', data: { type: 'FeatureCollection', features: feats }, prop: 'tv', breaks: b.gia.moc, colors: PRICE, lineColor: '#FFFFFF', lineWidth: 0.6,
        tip: (p) => '<div class="k">' + p.ten + '</div><div class="v">' + K.fmt(p.tv, '0') + '</div><div class="k">' + unit + ' · ' + K.fmt(p.kc, '1') + ' km</div>' });
      K.mapTopLayers(map);
      ucOutline(map);
      K.mapRings(map, 'rings', b.tam, [10, 20, 40, 60], km, -Math.PI * 0.72);
      K.mapPlaces(map, places);
      let w = 180, s = 90, e = -180, n = -90;
      feats.forEach((f) => JSON.stringify(f.geometry.coordinates).replace(/\[(-?[\d.]+),(-?[\d.]+)\]/g, (_, x, y) => { x = +x; y = +y; w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }));
      map.fitBounds([[w, s], [e, n]], { duration: 0, padding: { top: 20, bottom: 20, left: 20, right: 20 } });
    });
    K.legendBins(document.getElementById('m-2-1').parentNode, { outside: true, title: t('Residential land price, thousand VND per m²', 'Giá đất ở, nghìn đồng/m²'), breaks: b.gia.moc, colors: PRICE, fmt: (v) => K.fmt(v, '0'), extra: ucKey() });
  }

  /* Figure 2.2 — scatter of ward prices, fit within 40 km */
  function fig22(b) {
    const pts = b.gia.phuong.features.filter((f) => f.properties.kc <= 150).map((f) => [f.properties.kc, f.properties.tv, f.properties.ten]);
    const k = b.gia.k40, fit = [];
    for (let x = 0; x <= 40; x += 1) fit.push([x, Math.exp(k.a + k.b * x)]);
    const xMax = Math.ceil(Math.max(...pts.map((p) => p[0])) / 10) * 10;
    K.chart(document.getElementById('c-2-1'), {
      sources: ['l2_tphcm'], height: 420, rightMargin: 150,
      x: { min: 0, max: xMax, label: t('Distance from Ben Thanh (km)', 'Khoảng cách tới Bến Thành (km)') },
      y: { min: 1000, max: 500000, log: true, label: t('Thousand VND per m²', 'Nghìn đồng/m²') },
      bands: [{ x0: 40, x1: xMax, text: t('beyond 40 km: not used in the fit', 'ngoài 40 km: không dùng để khớp') }],
      series: [
        { id: 'w', kind: 'data', type: 'points', points: pts, color: '#BE792B', r: 4, opacity: 0.8 },
        { id: 'fit', kind: 'estimate', type: 'line', points: fit, label: t('Fitted, 0–40 km', 'Đường khớp, 0–40 km'), labelAt: 40 },
      ],
      tip: (s, p) => s.id === 'w' ? '<div class="k">' + p[2] + '</div><div class="v">' + K.fmt(p[1], '0') + '</div><div class="k">' + K.fmt(p[0], '1') + ' km</div>' : '',
    });
  }

  /* Figure 2.2 — residential and agricultural prices along a section; band = inside the 2020 urban centre */
  function section22(b, n) {
    const host = document.getElementById('c-2-2');
    if (!host || !n) return;
    const k = b.gia.k40, fit = [], ra = K.duLieu.l2_vung_do_thi.matCatRa;
    for (let x = -40; x <= 40; x += 1) fit.push([x, Math.exp(k.a + k.b * Math.abs(x))]);
    const pick = (ten) => n.matCat.find((m) => m.ten === ten);
    const TEN = { 'Phường Bến Thành': ['Ben Thanh', 'Bến Thành'], 'Phường Thủ Dầu Một': ['Thu Dau Mot', 'Thủ Dầu Một'], 'Xã Cần Giờ': ['Can Gio', 'Cần Giờ'], 'Xã Bàu Bàng': ['Bau Bang', 'Bàu Bàng'] };
    const name = (ten) => (TEN[ten] ? TEN[ten][K.lang === 'vi' ? 1 : 0] : ten);
    const marks = ['Phường Bến Thành', 'Phường Thủ Dầu Một', 'Xã Cần Giờ', 'Xã Bàu Bàng'].map(pick).filter(Boolean)
      .map((m) => ({ type: 'dot', x: m.s, y: m.o, color: '#5C0000', text: name(m.ten) }));
    K.chart(host, {
      sources: ['l2_nong_nghiep', 'l2_tphcm', 'l2_vung_do_thi'], height: 440, rightMargin: 150,
      x: { min: -50, max: 62, label: t('Distance along the section from Ben Thanh (km); south negative, north positive', 'Khoảng cách dọc mặt cắt tính từ Bến Thành (km); âm về phía nam, dương về phía bắc') },
      y: { min: 100, max: 500000, log: true, label: t('Thousand VND per m²', 'Nghìn đồng/m²') },
      bands: [{ x0: ra.nam, x1: ra.bac, text: t('inside the urban centre, 2020', 'trong trung tâm đô thị 2020'), textAt: 'bottom' }], showKinds: false,
      series: [
        { id: 'o', kind: 'data', type: 'points', points: n.matCat.map((m) => [m.s, m.o, m.ten]), color: '#BE792B', r: 4, opacity: 0.85 },
        { id: 'nn', kind: 'data', type: 'points', points: n.matCat.map((m) => [m.s, m.nn, m.ten, m.kv]), color: '#27795A', r: 3.5, opacity: 0.9 },
        { id: 'fit', kind: 'estimate', type: 'line', points: fit, label: t('Fitted, 0–40 km', 'Đường khớp, 0–40 km'), labelAt: 40 },
      ],
      marks,
      tip: (s, p) => (s.id === 'o' || s.id === 'nn') ? '<div class="k">' + p[2] + '</div><div class="v">' + K.fmt(p[1], '0') + '</div><div class="k">' +
        (s.id === 'o' ? t('residential', 'đất ở') : t('agricultural, zone ', 'nông nghiệp, khu vực ') + p[3]) + ' · ' + K.fmt(p[0], '1') + ' km</div>' : '',
    });
    const key = document.createElement('div'); key.className = 'kinds';
    key.innerHTML = '<span><svg width="14" height="10"><circle cx="7" cy="5" r="4" fill="#BE792B"/></svg>' + t('residential land, ward median', 'đất ở, trung vị phường/xã') + '</span>' +
      '<span><svg width="14" height="10"><circle cx="7" cy="5" r="3.5" fill="#27795A"/></svg>' + t('agricultural land, annual crops, position 1', 'đất nông nghiệp, cây hàng năm, vị trí 1') + '</span>' +
      '<span><svg width="30" height="10"><line x1="1" x2="29" y1="5" y2="5" stroke="#111" stroke-width="2" stroke-dasharray="6 4"/></svg>' + t('fitted line (estimate)', 'đường khớp (ước lượng)') + '</span>' +
      '<span><svg width="18" height="10"><rect width="18" height="10" fill="#EBEEF4"/></svg>' + t('inside the urban centre, 2020', 'trong trung tâm đô thị 2020') + '</span>';
    host.appendChild(key);
  }

  /* Map 2.5 — density grid */
  function map23(b, places) {
    const L = b.matDo.luoi, dLat = 1 / L.kmLat, dLon = 1 / L.kmLon, c = L.tam;
    const f5 = (v) => +v.toFixed(5);
    const cells = { type: 'FeatureCollection', features: b.matDo.o.map(([i, j, md, kc]) => {
      const la = c[1] - i * dLat, lb = c[1] - (i + 1) * dLat, oa = c[0] + j * dLon, ob = c[0] + (j + 1) * dLon;
      return { type: 'Feature', properties: { md, kc }, geometry: { type: 'Polygon', coordinates: [[[f5(oa), f5(la)], [f5(ob), f5(la)], [f5(ob), f5(lb)], [f5(oa), f5(lb)], [f5(oa), f5(la)]]] } };
    }) };
    const map = K.map('m-2-3', { center: c, zoom: 9 });
    map.on('load', () => {
      K.mapChoropleth(map, { id: 'md', data: cells, prop: 'md', breaks: b.matDo.moc, colors: DENS, lineWidth: 0,
        tip: (p) => '<div class="v">' + K.fmt(p.md, '0') + '</div><div class="k">' + t('persons per km²', 'người/km²') + ' · ' + K.fmt(p.kc, '1') + ' km</div>' });
      K.mapTopLayers(map);
      ucOutline(map);
      K.mapRings(map, 'rings', c, [10, 20, 30, 40], km, -Math.PI * 0.72);
      K.mapPlaces(map, places.filter((p) => p.kc < 40));
      map.fitBounds(boundsAround(c, 41), { duration: 0, padding: 10 });
    });
    K.legendBins(document.getElementById('m-2-3').parentNode, { outside: true, title: t('Persons per km²', 'Người/km²'), breaks: b.matDo.moc, colors: DENS, fmt: (v) => K.fmt(v, '0'), extra: ucKey() });
  }

  /* Figure 2.4 — density against distance */
  function fig24(b) {
    const k = b.matDo.khop, fit = [];
    for (let x = 0; x <= 40; x += 1) fit.push([x, Math.exp(k.a + k.b * x)]);
    K.chart(document.getElementById('c-2-3'), {
      sources: ['l2_tphcm'], height: 420, rightMargin: 170,
      x: { min: 0, max: 40, label: t('Distance from Ben Thanh (km)', 'Khoảng cách tới Bến Thành (km)') },
      y: { min: 100, max: 100000, log: true, label: t('Persons per km²', 'Người/km²') },
      series: [
        { id: 'cells', kind: 'data', type: 'points', points: b.matDo.o.filter((o) => o[2] >= 300).map((o) => [o[3], o[2]]), color: '#089BD4', r: 2, opacity: 0.22, hover: false },
        { id: 'ring', kind: 'data', type: 'line', points: b.matDo.vanh, color: '#023B6F', label: t('Average of each\n1 km ring', 'Mật độ bình quân\ntừng vành 1 km'), hover: true },
        { id: 'fit', kind: 'estimate', type: 'line', points: fit, label: t('Fitted, cells ≥ 300', 'Đường khớp, ô ≥ 300') },
      ],
      tip: (s, p) => '<div class="k">' + K.fmt(p[0] - 0.5, '0') + '–' + K.fmt(p[0] + 0.5, '0') + ' km</div><div class="v">' + K.fmt(p[1], '0') + '</div><div class="k">' + t('persons per km²', 'người/km²') + '</div>',
    });
  }

  /* Figure 2.5 — box plot of 192 cities with Ho Chi Minh City */
  function fig25(b) {
    const host = document.getElementById('c-2-4');
    const L = K.duLieu.trich_dan.phanBoLiotta, h = b.matDo;
    if (!L) throw new Error('L1: distribution not verified');
    const NS = 'http://www.w3.org/2000/svg';
    const draw = () => {
      const W = host.clientWidth || 800, H = 250, m = { l: 18, r: 24, t: 20, b: 46 };
      const x0 = -0.32, x1 = 0, sx = (v) => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
      const el = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
      host.innerHTML = '';
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.fontFamily = 'var(--sans)'; host.appendChild(svg);
      for (let k = -30; k <= 0; k += 5) {
        const v = k / 100, x = sx(v);
        el('line', { x1: x, x2: x, y1: m.t, y2: H - m.b, stroke: Math.abs(v) < 1e-9 ? '#8A969F' : '#CED4DE', 'stroke-dasharray': Math.abs(v) < 1e-9 ? '' : '4 2' });
        el('text', { x, y: H - m.b + 18, 'text-anchor': 'middle', 'font-size': 13, fill: '#666' }).textContent = K.fmt(v, '2');
      }
      el('text', { x: (W + m.l - m.r) / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600, fill: '#111' }).textContent =
        t('Coefficient b, per km (more negative = steeper)', 'Hệ số b, mỗi km (càng âm càng dốc)');
      /* row 1: 192 cities */
      const y1 = 78;
      el('text', { x: sx(x0), y: y1 - 30, 'font-size': 14, 'font-weight': 600, fill: '#111' }).textContent = t('192 cities (Liotta, Viguié and Lepetit, 2022)', '192 thành phố (Liotta, Viguié và Lepetit, 2022)');
      el('line', { x1: sx(L.nhoNhat), x2: sx(L.lonNhat), y1, y2: y1, stroke: '#8A969F', 'stroke-width': 1.5 });
      [L.nhoNhat, L.lonNhat].forEach((v) => el('line', { x1: sx(v), x2: sx(v), y1: y1 - 8, y2: y1 + 8, stroke: '#8A969F', 'stroke-width': 1.5 }));
      el('rect', { x: sx(L.q1), y: y1 - 16, width: sx(L.q3) - sx(L.q1), height: 32, fill: '#EBEEF4', stroke: '#8A969F' });
      el('line', { x1: sx(L.trungVi), x2: sx(L.trungVi), y1: y1 - 16, y2: y1 + 16, stroke: '#111', 'stroke-width': 3 });
      el('circle', { cx: sx(L.trungBinh), cy: y1, r: 4.5, fill: '#fff', stroke: '#111', 'stroke-width': 1.5 });
      /* row 2: Ho Chi Minh City */
      const y2 = 158;
      el('text', { x: sx(x0), y: y2 - 26, 'font-size': 14, 'font-weight': 600, fill: '#106CA1' }).textContent = t('Ho Chi Minh City (this lesson, Table 2.1)', 'TP.HCM (bài này, Bảng 2.1)');
      el('line', { x1: sx(h.bMin), x2: sx(h.bMax), y1: y2, y2, stroke: '#0071BC', 'stroke-width': 8, 'stroke-opacity': 0.3, 'stroke-linecap': 'round' });
      el('circle', { cx: sx(h.khop.b), cy: y2, r: 6, fill: '#0071BC', stroke: '#fff', 'stroke-width': 1.5 });
      el('text', { x: sx(h.bMin) - 10, y: y2 + 5, 'text-anchor': 'end', 'font-size': 13, fill: '#106CA1' }).textContent = t('range of six estimates', 'khoảng của sáu ước lượng');
      /* guides at quartiles */
      [L.q1, L.q3].forEach((v) => el('line', { x1: sx(v), x2: sx(v), y1: y1 + 16, y2: y2 + 14, stroke: '#8A969F', 'stroke-dasharray': '2 3' }));
    };
    draw();
    if (window.ResizeObserver) { let w = host.clientWidth; new ResizeObserver(() => { if (Math.abs(host.clientWidth - w) > 2) { w = host.clientWidth; draw(); } }).observe(host); }
  }
})();
