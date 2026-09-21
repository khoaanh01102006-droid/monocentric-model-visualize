/* Lesson 4 · figures. Data: du_lieu/l4_do_thi.js (kich_ban/l4_do_thi_chau_a.py) and, for Section 4.3,
   du_lieu/l4_ha_noi.js (kich_ban/l4_ha_noi.py).

   Map 4.1 shows one city at a time, always at the same ground scale: the zoom of each city is corrected
   for latitude, because a Web Mercator map at a fixed zoom enlarges places farther from the equator.
   Figure 4.1 draws all six cities side by side, each in a 90 × 90 km square. */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  /* persons per km²: 300 and 1,500 are the thresholds of the Degree of Urbanisation (urban cluster, urban centre) */
  const MOC = [300, 1500, 5000, 10000, 20000];
  const MAU = [null, '#E3F6FD', '#75CCEC', '#089BD4', '#0169A1', '#023B6F'];
  const UC = '#C8102E';

  K.khoiDong(() => {
    const D = K.duLieu.l4_do_thi;
    if (!D) throw new Error('L1: Lesson 4 needs du_lieu/l4_do_thi.js');
    dataRows();
    const luoi = D.thanhPho.map(docLuoi);
    map41(D, luoi);
    fig41(D, luoi);
    const H = K.duLieu.l4_ha_noi;
    if (H) { map42(H); fig42(H); fig43(H); tab42(H); }
    const Dg = K.duLieu.l4_duong;
    if (Dg) { map43(Dg); fig44(Dg); tab43(Dg); }
    K.veVeDuLieu();
  });

  function dataRows() {
    const seen = new Set();
    const rows = ['l4_do_thi', 'l4_ha_noi', 'l4_duong'].filter((k) => K.duLieu[k]).flatMap((k) => K.duLieu[k].nguon)
      .filter((n) => { const k = n.ma || n.ten; if (seen.has(k)) return false; seen.add(k); return true; });
    document.getElementById('data-rows').innerHTML = rows.map((n) => '<tr><td>' + (K.lang === 'vi' && n.tenVi ? n.tenVi : n.ten) +
      ' <a href="' + n.url + '">' + t('link', 'liên kết') + '</a></td><td>' + n.giayPhep + '</td><td class="r">' + n.truyCap + '</td></tr>').join('');
  }

  const lop = (v) => { let i = 0; while (i < MOC.length && v >= MOC[i]) i++; return i; };
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const RGB = MAU.map((c) => (c ? hex(c) : null));
  function docLuoi(c) {
    const s = atob(c.matDo10), a = new Uint16Array(s.length / 2);
    for (let i = 0; i < a.length; i++) a[i] = s.charCodeAt(2 * i) | (s.charCodeAt(2 * i + 1) << 8);
    if (a.length !== c.khung.cot * c.khung.hang) throw new Error('L1: density grid of ' + c.ten.en + ' has the wrong size');
    return a;                                            /* density in units of 10 persons per km² */
  }
  function anh(c, a) {
    const cv = document.createElement('canvas'); cv.width = c.khung.cot; cv.height = c.khung.hang;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(cv.width, cv.height);
    for (let i = 0; i < a.length; i++) { const m = RGB[lop(a[i] * 10)]; if (!m) continue; img.data.set([m[0], m[1], m[2], 255], 4 * i); }
    ctx.putImageData(img, 0, 0);
    return cv;
  }
  const chuGiai = () => { const w = 44;
    return '<div class="t">' + t('Persons per km², 2020', 'Người/km², 2020') + '</div><div class="bins">' + MAU.map((c) => '<i style="width:' + w + 'px;background:' + (c || '#fff') + '"></i>').join('') + '</div>' +
      '<div class="ticks" style="width:' + (MAU.length * w) + 'px">' + MOC.map((b, i) => '<span style="left:' + ((i + 1) * w) + 'px">' + K.fmt(b, '0') + '</span>').join('') + '</div>' +
      '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="' + UC + '" stroke-width="2.4"/></svg>' + t('urban centre, 2020', 'trung tâm đô thị, 2020') + '</div>' +
      '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#111" stroke-width="1.6" stroke-dasharray="4 3"/></svg>' + t('urban centre, 1990', 'trung tâm đô thị, 1990') + '</div>'; };

  /* Map 4.1 — one city at a time, same ground scale */
  function map41(D, luoi) {
    const fig = document.getElementById('map-4-1');
    if (!fig) return;
    const C = D.thanhPho, c0 = C[0];
    const map = K.map('m-4-1', { center: c0.tam, zoom: 9, minZoom: 5 });
    const goc = (c) => [[c.khung.tay, c.khung.bac], [c.khung.dong, c.khung.bac], [c.khung.dong, c.khung.nam], [c.khung.tay, c.khung.nam]];
    let zGoc = null, cur = 0;
    const zoomCua = (c) => zGoc + Math.log2(Math.cos(c.tam[1] * Math.PI / 180) / Math.cos(c0.tam[1] * Math.PI / 180));
    const hienThanhPho = (i) => {
      cur = i; const c = C[i];
      const src = map.getSource('md'); if (!src) return;
      src.updateImage({ url: anh(c, luoi[i]).toDataURL(), coordinates: goc(c) });
      ['1990', '2020'].forEach((y) => map.getSource('uc' + y).setData(c.uc[y]));
      map.getSource('vong').setData({ type: 'FeatureCollection', features: [10, 20, 40].map((r) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: K.circle(c.tam, r) } })) });
      map.jumpTo({ center: c.tam, zoom: zoomCua(c) });
    };
    map.on('load', () => {
      map.addSource('md', { type: 'image', url: anh(c0, luoi[0]).toDataURL(), coordinates: goc(c0) });
      map.addLayer({ id: 'md', type: 'raster', source: 'md', paint: { 'raster-opacity': 0.88, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'water');
      K.mapTopLayers(map);
      map.addSource('vong', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'vong', type: 'line', source: 'vong', paint: { 'line-color': '#111', 'line-opacity': 0.4, 'line-width': 0.8, 'line-dasharray': [4, 3] } });
      map.addSource('uc1990', { type: 'geojson', data: c0.uc['1990'] });
      map.addSource('uc2020', { type: 'geojson', data: c0.uc['2020'] });
      map.addLayer({ id: 'uc2020-vien', type: 'line', source: 'uc2020', paint: { 'line-color': '#FFFFFF', 'line-width': 4.5 } });
      map.addLayer({ id: 'uc2020', type: 'line', source: 'uc2020', paint: { 'line-color': UC, 'line-width': 2.4 } });
      map.addLayer({ id: 'uc1990', type: 'line', source: 'uc1990', paint: { 'line-color': '#111', 'line-width': 1.6, 'line-dasharray': [2, 1.5] } });
      const kmLon = 111.32 * Math.cos(c0.tam[1] * Math.PI / 180), kmLat = 110.574, r = D.banKinh;
      map.fitBounds([[c0.tam[0] - r / kmLon, c0.tam[1] - r / kmLat], [c0.tam[0] + r / kmLon, c0.tam[1] + r / kmLat]], { duration: 0, padding: 0 });
      zGoc = map.getZoom();
      hienThanhPho(cur);
    });
    /* hover: density of the cell */
    const box = map.getContainer();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; box.appendChild(tip);
    map.on('mousemove', (e) => {
      const c = C[cur], k = c.khung;
      const col = Math.floor((e.lngLat.lng - k.tay) / (k.dong - k.tay) * k.cot), row = Math.floor((k.bac - e.lngLat.lat) / (k.bac - k.nam) * k.hang);
      if (col < 0 || col >= k.cot || row < 0 || row >= k.hang) { tip.style.display = 'none'; return; }
      tip.innerHTML = '<div class="k">' + c.ten[K.lang] + '</div><div class="v">' + K.fmt(luoi[cur][row * k.cot + col] * 10, '0') + '</div><div class="k">' + t('persons per km², 2020', 'người/km², 2020') + '</div>';
      tip.style.display = 'block';
      tip.style.left = Math.min(box.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
      tip.style.top = Math.max(4, e.point.y - 60) + 'px';
    });
    map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    const lg = document.createElement('div'); lg.className = 'legend outside'; lg.innerHTML = chuGiai(); fig.querySelector('.fig-body').appendChild(lg);
    K.buoc(fig, (i) => { if (zGoc != null) hienThanhPho(i); else cur = i; });
  }

  /* Figure 4.1 — the six cities side by side, 90 × 90 km each */
  function fig41(D, luoi) {
    const host = document.getElementById('f-4-1');
    if (!host) return;
    host.innerHTML = '';
    D.thanhPho.forEach((c, i) => {
      const o = document.createElement('div'); o.className = 'sm';
      const cv = document.createElement('canvas'), S = 2 * c.khung.hang;
      cv.width = S; cv.height = S;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#F2F3F5'; ctx.fillRect(0, 0, S, S);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(anh(c, luoi[i]), 0, 0, S, S);
      const k = c.khung, px = (x, y) => [(x - k.tay) / (k.dong - k.tay) * S, (k.bac - y) / (k.bac - k.nam) * S];
      const ve = (g, mau, rong, dut) => {
        ctx.strokeStyle = mau; ctx.lineWidth = rong; ctx.setLineDash(dut || []);
        const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
        for (const p of polys) for (const ring of p) { ctx.beginPath(); ring.forEach(([x, y], j) => { const [a, b] = px(x, y); j ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); ctx.stroke(); }
      };
      ve(c.uc['1990'].geometry || c.uc['1990'], '#111', 1.5, [4, 3]);
      ve(c.uc['2020'].geometry || c.uc['2020'], UC, 2.4);
      const tk = c.thongKe['2020'];
      o.appendChild(cv);
      const cap = document.createElement('div'); cap.className = 'sm-cap';
      cap.innerHTML = '<b>' + c.ten[K.lang] + '</b><span>' + K.fmt(tk.dan, 'M1') + t(' million · ', ' triệu người · ') + K.fmt(tk.dienTich, '0') + ' km²</span>';
      o.appendChild(cap);
      host.appendChild(o);
    });
    const lg = document.createElement('div'); lg.className = 'legend outside'; lg.innerHTML = chuGiai(); host.parentNode.appendChild(lg);
  }

  /* ── Section 4.3 · Hanoi and Ho Chi Minh City (du_lieu/l4_ha_noi.js, kich_ban/l4_ha_noi.py) ── */
  const MAU_TP = { hn: '#D55E00', hcm: '#0071BC' };
  const VONG = [5, 10, 20, 30];                              /* km, the circles of Map 4.2 */
  const kmTu = (tam, lng, lat) => Math.hypot((lng - tam[0]) * 111.32 * Math.cos(tam[1] * Math.PI / 180), (lat - tam[1]) * 110.574);

  /* Map 4.2 — built-up land by period, one city at a time, same ground scale */
  function map42(H) {
    const fig = document.getElementById('map-4-2');
    if (!fig) return;
    const C = H.thanhPho, c0 = C[0];
    const map = K.map('m-4-2', { center: c0.tam, zoom: 9, minZoom: 5 });
    const goc = (c) => [[c.khung.tay, c.khung.bac], [c.khung.dong, c.khung.bac], [c.khung.dong, c.khung.nam], [c.khung.tay, c.khung.nam]];
    let zGoc = null, cur = 0, nhan = [];
    const zoomCua = (c) => zGoc + Math.log2(Math.cos(c.tam[1] * Math.PI / 180) / Math.cos(c0.tam[1] * Math.PI / 180));
    const hien = (i) => {
      cur = i; const c = C[i];
      const src = map.getSource('xay'); if (!src) return;
      nhan.forEach((m) => m.remove());
      const kx = 111.32 * Math.cos(c.tam[1] * Math.PI / 180);
      nhan = VONG.map((r) => { const d = document.createElement('div'); d.className = 'ring-label'; d.textContent = r + ' km';
        return new maplibregl.Marker({ element: d, anchor: 'bottom-left' }).setLngLat([c.tam[0] + r / kx * Math.SQRT1_2, c.tam[1] + r / 110.574 * Math.SQRT1_2]).addTo(map); })
        .concat(K.mapPlaces(map, [{ name: c.tenTam[K.lang], at: c.tam, dot: true }]));
      src.updateImage({ url: c.anh, coordinates: goc(c) });
      map.getSource('uc').setData(c.uc2020);
      map.getSource('vong').setData({ type: 'FeatureCollection', features: VONG.map((r) => ({ type: 'Feature', properties: { r }, geometry: { type: 'LineString', coordinates: K.circle(c.tam, r) } })) });
      map.jumpTo({ center: c.tam, zoom: zoomCua(c) });
    };
    map.on('load', () => {
      map.addSource('xay', { type: 'image', url: c0.anh, coordinates: goc(c0) });
      map.addLayer({ id: 'xay', type: 'raster', source: 'xay', paint: { 'raster-opacity': 0.9, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'water');
      K.mapTopLayers(map);
      map.addSource('vong', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'vong', type: 'line', source: 'vong', paint: { 'line-color': '#111', 'line-opacity': 0.55, 'line-width': 0.9, 'line-dasharray': [4, 3] } });
      map.addSource('uc', { type: 'geojson', data: c0.uc2020 });
      map.addLayer({ id: 'uc-vien', type: 'line', source: 'uc', paint: { 'line-color': '#FFFFFF', 'line-width': 4.5 } });
      map.addLayer({ id: 'uc', type: 'line', source: 'uc', paint: { 'line-color': UC, 'line-width': 2.2 } });
      const kx = 111.32 * Math.cos(c0.tam[1] * Math.PI / 180), r = H.banKinhAnh * 0.8;
      map.fitBounds([[c0.tam[0] - r / kx, c0.tam[1] - r / 110.574], [c0.tam[0] + r / kx, c0.tam[1] + r / 110.574]], { duration: 0, padding: 0 });
      zGoc = map.getZoom();
      hien(cur);
    });
    /* hover: distance from the centre */
    const box = map.getContainer();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; box.appendChild(tip);
    map.on('mousemove', (e) => {
      const c = C[cur], d = kmTu(c.tam, e.lngLat.lng, e.lngLat.lat);
      tip.innerHTML = '<div class="v">' + K.fmt(d, '1') + ' km</div><div class="k">' + t('from ', 'tới ') + c.tenTam[K.lang] + '</div>';
      tip.style.display = 'block';
      tip.style.left = Math.min(box.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
      tip.style.top = Math.max(4, e.point.y - 50) + 'px';
    });
    map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    const w = 46, G = H.giaiDoan;
    const lg = document.createElement('div'); lg.className = 'legend outside';
    lg.innerHTML = '<div class="t">' + t('First recorded as built up, period ending in', 'Lần đầu ghi nhận đã xây dựng, giai đoạn kết thúc năm') + '</div><div class="bins">' +
      G.map((g) => '<i style="width:' + w + 'px;background:' + g.mau + '"></i>').join('') + '</div>' +
      '<div class="ticks" style="width:' + (G.length * w) + 'px">' + G.map((g, k) => '<span style="left:' + ((k + 0.5) * w) + 'px">' + (k ? K.fmt(g.den, 'y') : '≤ ' + K.fmt(g.den, 'y')) + '</span>').join('') + '</div>' +
      '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="' + UC + '" stroke-width="2.4"/></svg>' + t('urban centre, 2020', 'trung tâm đô thị, 2020') + '</div>' +
      '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#111" stroke-width="1" stroke-dasharray="4 3"/></svg>' + t('distance from the centre', 'khoảng cách tới trung tâm') + '</div>';
    fig.querySelector('.fig-body').appendChild(lg);
    K.buoc(fig, (i) => { if (zGoc != null) hien(i); else cur = i; });
  }

  /* Figure 4.2 — share of land built up by ring, two panels */
  function fig42(H) {
    const NAM = ['1990', '2000', '2015'];
    const mau = (y) => H.giaiDoan.find((g) => String(g.den) === y).mau;
    H.thanhPho.forEach((c, i) => {
      const host = document.getElementById('c-4-2' + 'ab'[i]);
      if (!host) return;
      const series = NAM.map((y) => ({ id: y, kind: 'data', label: y, color: mau(y), points: c.tyLe[y].map((v, k) => [k + 0.5, v]) }));
      series.push({ id: 'nua', kind: 'reference', labelAt: 'none', points: [[0, 0.5], [H.banKinh, 0.5]] });
      K.chart(host, {
        sources: ['l4_ha_noi'], height: 300, rightMargin: 52, showKinds: false,
        alt: t('Share of land built up by distance from ', 'Tỷ lệ đất đã xây dựng theo khoảng cách tới ') + c.tenTam[K.lang],
        x: { min: 0, max: H.banKinh, label: t('Distance from the centre (km)', 'Khoảng cách tới trung tâm (km)') },
        y: { min: 0, max: 1, fmt: '%0', label: c.ten[K.lang] + t(' · from ', ' · tính từ ') + c.tenTam[K.lang] },
        series,
      });
    });
  }

  /* Figure 4.3 — population density by ring (log scale), all land or built-up land only */
  function fig43(H) {
    const host = document.getElementById('c-4-3');
    if (!host) return;
    const fig = document.getElementById('fig-4-3');
    const C = H.thanhPho, R = H.banKinh;
    const dung = (md) => C.flatMap((c) => {
      const v = md === 'dat' ? c.matDo : c.matDoRong, f = md === 'dat' ? c.hoiQuy : c.rong;
      return [
        { id: c.ma, kind: 'data', label: c.ten[K.lang], color: MAU_TP[c.ma], points: v.map((d, k) => [k + 0.5, d]), hover: true },
        { id: c.ma + '-f', kind: 'estimate', labelAt: 'none', color: MAU_TP[c.ma], points: [[0, Math.exp(f.a)], [R, Math.exp(f.a - f.b * R)]] },
      ];
    });
    const ch = K.chart(host, {
      sources: ['l4_ha_noi'], height: 380, rightMargin: 150,
      alt: t('Population density by distance from the centre, Hanoi and Ho Chi Minh City, 2020', 'Mật độ dân theo khoảng cách tới trung tâm, Hà Nội và TP.HCM, 2020'),
      x: { min: 0, max: R, label: t('Distance from the centre (km)', 'Khoảng cách tới trung tâm (km)') },
      y: { min: 500, max: 100000, log: true, fmt: '0', label: t('Persons per km² (logarithmic scale)', 'Người/km² (thang logarit)') },
      series: dung('dat'),
      tip: (s, p) => '<div class="k">' + s.label + '</div><div class="v">' + K.fmt(p[1], '0') + '</div><div class="k">' + t('persons per km², ', 'người/km², ') + K.fmt(p[0] - 0.5, '0') + '–' + K.fmt(p[0] + 0.5, '0') + ' km</div>',
    });
    const nut = [...fig.querySelectorAll('[data-md]')];
    const bat = (b) => nut.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    nut.forEach((b) => b.addEventListener('click', () => { bat(b); ch.update(dung(b.dataset.md)); }));
    bat(nut[0]);
  }

  /* Table 4.2 — density gradients of the six cities, then Hanoi and HCMC from their historical centres */
  function tab42(H) {
    const body = document.getElementById('tab-4-2-rows');
    if (!body) return;
    const o = (v) => '<td class="r">' + K.fmt(v, '3') + '</td>';
    const hang = (ten, dan, a10, a30, r10, r30, cls) => '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + ten + '</td><td class="r">' + K.fmt(dan, 'M1') + '</td>' + o(a10) + o(a30) + o(r10) + o(r30) + '</tr>';
    body.innerHTML = H.sauDoThi.map((s) => hang(s.ten[K.lang], s.dan30, s.hoiQuy10.b, s.hoiQuy.b, s.rong10.b, s.rong.b)).join('') +
      H.thanhPho.map((c, i) => hang(c.ten[K.lang] + t(' (from ', ' (từ ') + c.tenTam[K.lang] + ')', c.dan30, c.hoiQuy10.b, c.hoiQuy.b, c.rong10.b, c.rong.b, i ? '' : 'sep')).join('');
  }

  /* ── Section 4.4 · road network density (du_lieu/l4_duong.js, kich_ban/l4_mang_duong.py) ── */
  const MAU_D = { hcm: '#0071BC', hn: '#D55E00', bkk: '#7A3B9A', jkt: '#2E8B57', mnl: '#A87000', kl: '#8A969F', sel: '#C8102E' };

  /* Map 4.3 — one city at a time, same ground scale, cells of 1 km */
  function map43(D) {
    const fig = document.getElementById('map-4-3');
    if (!fig) return;
    const C = D.thanhPho, c0 = C[0];
    const map = K.map('m-4-3', { center: c0.tam, zoom: 9, minZoom: 5 });
    const goc = (c) => [[c.khung.tay, c.khung.bac], [c.khung.dong, c.khung.bac], [c.khung.dong, c.khung.nam], [c.khung.tay, c.khung.nam]];
    let zGoc = null, cur = 0, nhan = [];
    const zoomCua = (c) => zGoc + Math.log2(Math.cos(c.tam[1] * Math.PI / 180) / Math.cos(c0.tam[1] * Math.PI / 180));
    const hien = (i) => {
      cur = i; const c = C[i];
      const src = map.getSource('d'); if (!src) return;
      src.updateImage({ url: c.anh, coordinates: goc(c) });
      map.getSource('vong').setData({ type: 'FeatureCollection', features: [10, 25, D.banKinh].map((r) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: K.circle(c.tam, r) } })) });
      nhan.forEach((m) => m.remove());
      const kx = 111.32 * Math.cos(c.tam[1] * Math.PI / 180);
      nhan = [10, 25, D.banKinh].map((r) => { const d = document.createElement('div'); d.className = 'ring-label'; d.textContent = r + ' km';
        return new maplibregl.Marker({ element: d, anchor: 'bottom-left' }).setLngLat([c.tam[0] + r / kx * Math.SQRT1_2, c.tam[1] + r / 110.574 * Math.SQRT1_2]).addTo(map); });
      map.jumpTo({ center: c.tam, zoom: zoomCua(c) });
    };
    map.on('load', () => {
      map.addSource('d', { type: 'image', url: c0.anh, coordinates: goc(c0) });
      map.addLayer({ id: 'd', type: 'raster', source: 'd', paint: { 'raster-opacity': 0.9, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'water');
      K.mapTopLayers(map);
      map.addSource('vong', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'vong', type: 'line', source: 'vong', paint: { 'line-color': '#111', 'line-opacity': 0.5, 'line-width': 0.9, 'line-dasharray': [4, 3] } });
      const kmLon = 111.32 * Math.cos(c0.tam[1] * Math.PI / 180), r = D.banKinh * 1.05;
      map.fitBounds([[c0.tam[0] - r / kmLon, c0.tam[1] - r / 110.574], [c0.tam[0] + r / kmLon, c0.tam[1] + r / 110.574]], { duration: 0, padding: 0 });
      zGoc = map.getZoom();
      hien(cur);
    });
    const w = 40;
    const lg = document.createElement('div'); lg.className = 'legend outside';
    lg.innerHTML = '<div class="t">' + t('Kilometres of road per km² of land', 'Ki-lô-mét đường trên mỗi km² đất liền') + '</div><div class="bins">' +
      D.mau.map((c) => '<i style="width:' + w + 'px;background:' + c + '"></i>').join('') + '</div>' +
      '<div class="ticks" style="width:' + (D.mau.length * w) + 'px">' + D.moc.map((b, i) => '<span style="left:' + ((i + 1) * w) + 'px">' + K.fmt(b, b < 10 ? '1' : '0') + '</span>').join('') + '</div>' +
      '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#111" stroke-width="1" stroke-dasharray="4 3"/></svg>' + t('distance from the centre', 'khoảng cách tới trung tâm') + '</div>';
    fig.querySelector('.fig-body').appendChild(lg);
    K.buoc(fig, (i) => { if (zGoc != null) hien(i); else cur = i; });
  }

  /* Figure 4.4 — road density by distance from the centre */
  function fig44(D) {
    const host = document.getElementById('c-4-4');
    if (!host) return;
    K.chart(host, {
      sources: ['l4_duong'], height: 380, rightMargin: 150, showKinds: false,
      alt: t('Road density by distance from the centre, seven cities', 'Mật độ mạng lưới đường theo khoảng cách tới trung tâm, bảy đô thị'),
      x: { min: 0, max: D.banKinh, label: t('Distance from the centre (km)', 'Khoảng cách tới trung tâm (km)') },
      y: { min: 0, max: Math.ceil(Math.max(...D.thanhPho.flatMap((c) => c.vanh.map((v) => v.chinh))) / 5) * 5, fmt: '0', label: t('Km of road per km² of land', 'Km đường trên mỗi km² đất liền') },
      series: D.thanhPho.map((c) => ({ id: c.ma, kind: 'data', color: MAU_D[c.ma], label: c.ten[K.lang],
        points: c.vanh.map((v, k) => [k + 0.5, v.chinh]), hover: true })),
      tip: (s, p) => '<div class="k">' + s.label + '</div><div class="v">' + K.fmt(p[1], '1') + '</div><div class="k">' + t('km/km², ', 'km/km², ') + K.fmt(p[0] - 0.5, '0') + '–' + K.fmt(p[0] + 0.5, '0') + ' km</div>',
    });
  }

  /* Table 4.3 — totals within 50 km */
  function tab43(D) {
    const body = document.getElementById('tab-4-3-rows');
    if (!body) return;
    body.innerHTML = D.thanhPho.map((c) => '<tr><td>' + c.ten[K.lang] + '</td><td class="r">' + K.fmt(c.kmChinh, '0') + '</td><td class="r">' + K.fmt(c.matDoChinh, '1') +
      '</td><td class="r">' + K.fmt(c.matDoMoi, '1') + '</td><td class="r">' + K.fmt(c.oCaoNhatChinh, '0') + '</td><td class="r">' + K.fmt(c.oCaoNhatMoi, '0') + '</td></tr>').join('');
  }

})();
