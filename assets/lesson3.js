/* Lesson 3 · figures. Data: du_lieu/l3_thoi_gian.js (kich_ban/l3_thoi_gian_di_lai.py), l3_moc.js
   (kich_ban/l3_moc_ha_tang.mjs), l3_co_gioi.js (kich_ban/l3_co_gioi.mjs), trich_dan.js, l2_tphcm.js (place names).

   Map 3.1 draws the modelled travel time to Ben Thanh on a 500 m grid for the road network of each
   milestone year. The grid arrives as bytes (minutes, 255 = no road in the cell) and is coloured here, in
   the browser, into an image laid over the map; hovering reads the four years of the cell under the
   pointer. Nothing in this file computes a travel time. */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  /* travel time, minutes: short = dark (viridis, colour-blind safe) */
  const MOC_TG = [10, 20, 30, 45, 60, 90];
  const MAU_TG = ['#2D0B59', '#3E4A89', '#31688E', '#26828E', '#35B779', '#90D743', '#FDE725'];
  /* minutes saved since 2005 */
  const MOC_GIAM = [1, 5, 10, 20, 40];
  const MAU_GIAM = [null, '#FDD9B5', '#FDAE6B', '#F16913', '#C23B0B', '#7F1D04'];
  const DO_MO = 0.82;

  K.khoiDong(() => {
    const B = K.duLieu.l3_thoi_gian;
    if (!B) throw new Error('L1: Lesson 3 needs du_lieu/l3_thoi_gian.js');
    dataRows();
    map31(B);
    fig31(B);
    if (K.duLieu.l3_cong_cong) map32(K.duLieu.l3_cong_cong, B);
    K.veVeDuLieu();
  });

  function dataRows() {
    const rows = ['l3_thoi_gian', 'l3_moc', 'l3_co_gioi', 'l3_cong_cong'].filter((k) => K.duLieu[k]).flatMap((k) => K.duLieu[k].nguon);
    const seen = new Set();
    document.getElementById('data-rows').innerHTML = rows.filter((n) => !seen.has(n.url) && seen.add(n.url)).map((n) => '<tr><td>' + (K.lang === 'vi' && n.tenVi ? n.tenVi : n.ten) +
      ' <a href="' + n.url + '">' + t('link', 'liên kết') + '</a></td><td>' + n.giayPhep + '</td><td class="r">' + n.truyCap + '</td></tr>').join('');
  }

  const lop = (v, moc) => { let i = 0; while (i < moc.length && v >= moc[i]) i++; return i; };
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

  /* Map 3.1 — travel time to Ben Thanh by year and mode */
  function map31(B) {
    const fig = document.getElementById('map-3-1');
    if (!fig) return;
    const KH = B.khung, nr = KH.hang, nc = KH.cot, NAM = B.nam;
    const grid = {};
    for (const pt of ['xe_may', 'o_to']) for (const y of NAM) {
      const s = atob(B.luoi[pt][y]), a = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
      if (a.length !== nr * nc) throw new Error('L1: grid ' + pt + ' ' + y + ' has the wrong size');
      grid[pt + y] = a;
    }
    const st = { nam: NAM[0], pt: 'xe_may', xem: 'tg' };     // xem: 'tg' travel time · 'giam' minutes saved since the first year

    const cv = document.createElement('canvas'); cv.width = nc; cv.height = nr;
    const ctx = cv.getContext('2d');
    const RGB_TG = MAU_TG.map(hex), RGB_GIAM = MAU_GIAM.map((c) => (c ? hex(c) : null));
    function ve() {
      const img = ctx.createImageData(nc, nr), g = grid[st.pt + st.nam], g0 = grid[st.pt + NAM[0]];
      for (let i = 0; i < nr * nc; i++) {
        const v = g[i]; if (v === 255) continue;
        let c;
        if (st.xem === 'tg') c = RGB_TG[lop(v, MOC_TG)];
        else { if (g0[i] === 255) continue; c = RGB_GIAM[lop(g0[i] - v, MOC_GIAM)]; if (!c) continue; }
        img.data[4 * i] = c[0]; img.data[4 * i + 1] = c[1]; img.data[4 * i + 2] = c[2]; img.data[4 * i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      return cv.toDataURL('image/png');
    }

    const P = K.duLieu.l2_tphcm;
    const map = K.map('m-3-1', { center: B.benThanh, zoom: 8.6 });
    const goc = [[KH.tay, KH.bac], [KH.dong, KH.bac], [KH.dong, KH.nam], [KH.tay, KH.nam]];
    const loc = (nam, dk) => ['all', ['!=', ['get', 'ma'], 'pha_thu_thiem'], [dk, ['get', 'nam'], nam]];
    map.on('load', () => {
      map.addSource('tg', { type: 'image', url: ve(), coordinates: goc });
      map.addLayer({ id: 'tg', type: 'raster', source: 'tg', paint: { 'raster-opacity': DO_MO, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'water');
      K.mapTopLayers(map);
      map.addSource('ct', { type: 'geojson', data: B.congTrinh });
      map.addLayer({ id: 'ct-sau', type: 'line', source: 'ct', filter: loc(st.nam, '>'), paint: { 'line-color': '#5A6570', 'line-width': 1.6, 'line-dasharray': [2, 2], 'line-opacity': 0.8 } });
      map.addLayer({ id: 'ct-vien', type: 'line', source: 'ct', filter: loc(st.nam, '<='), paint: { 'line-color': '#FFFFFF', 'line-width': 5 } });
      map.addLayer({ id: 'ct', type: 'line', source: 'ct', filter: loc(st.nam, '<='), paint: { 'line-color': '#C8102E', 'line-width': 2.6 } });
      map.addLayer({ id: 'pha', type: 'line', source: 'ct', filter: ['==', ['get', 'ma'], 'pha_thu_thiem'], paint: { 'line-color': '#111111', 'line-width': 2.4, 'line-dasharray': [1, 1.2] } });
      K.mapRings(map, 'rings', B.benThanh, [10, 20, 40], (r) => K.fmt(r, '0') + ' km', -Math.PI * 0.72);
      if (P) K.mapPlaces(map, P.nhan.filter((n) => n.kc < 70).map((n) => ({ name: n[K.lang], at: n.toaDo, dot: true, minor: n.cap > 1 })));
      /* 42 km east–west keeps the western edge of the modelled area (43 km from Ben Thanh) at the edge of the frame */
      const kmLon = 111.32 * Math.cos(B.benThanh[1] * Math.PI / 180), kmLat = 110.574, rx = 42, ry = 28;
      map.fitBounds([[B.benThanh[0] - rx / kmLon, B.benThanh[1] - ry / kmLat], [B.benThanh[0] + rx / kmLon, B.benThanh[1] + ry / kmLat]], { duration: 0, padding: 0 });
      capNhat();
    });

    /* hover: the four years of the cell under the pointer, and the name of a link */
    const box = map.getContainer();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; box.appendChild(tip);
    const kmLon = 111.32 * Math.cos(10.8 * Math.PI / 180), kmLat = 110.574;
    map.on('mousemove', (e) => {
      const f = map.getLayer('ct') ? map.queryRenderedFeatures([[e.point.x - 4, e.point.y - 4], [e.point.x + 4, e.point.y + 4]], { layers: ['ct', 'ct-sau', 'pha'] })[0] : null;
      const c = Math.floor((e.lngLat.lng - KH.tay) * kmLon / KH.oKm), r = Math.floor((KH.bac - e.lngLat.lat) * kmLat / KH.oKm);
      let html = '';
      if (f) html += '<div class="v" style="font-size:14px">' + f.properties[K.lang] + '</div><div class="k">' + t('opened ', 'thông xe ') + (f.properties.ma === 'pha_thu_thiem' ? t('— closed 1 January 2012', '— ngừng từ 1/1/2012') : f.properties.nam) + '</div>';
      if (r >= 0 && r < nr && c >= 0 && c < nc && grid[st.pt + NAM[0]][r * nc + c] !== 255) {
        html += '<div class="k">' + (st.pt === 'xe_may' ? t('By motorcycle, minutes to Ben Thanh', 'Xe máy, số phút tới Bến Thành') : t('By car, minutes to Ben Thanh', 'Ô tô, số phút tới Bến Thành')) + '</div>' +
          '<table class="tip-t">' + NAM.map((y) => '<tr' + (y === st.nam ? ' class="on"' : '') + '><td>' + y + '</td><td class="r">' + grid[st.pt + y][r * nc + c] + '</td></tr>').join('') + '</table>';
      }
      if (!html) { tip.style.display = 'none'; return; }
      tip.innerHTML = html; tip.style.display = 'block';
      tip.style.left = Math.min(box.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
      tip.style.top = Math.max(4, e.point.y - tip.offsetHeight - 8) + 'px';
    });
    map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });

    /* legend */
    const lg = document.createElement('div'); lg.className = 'legend outside'; fig.querySelector('.fig-body').appendChild(lg);
    function veChuGiai() {
      const bins = (mau, moc, tieuDe) => { const w = 44;
        return '<div class="t">' + tieuDe + '</div><div class="bins">' + mau.map((c) => '<i style="width:' + w + 'px;' + (c ? 'background:' + c : 'background:#fff') + '"></i>').join('') + '</div>' +
          '<div class="ticks" style="width:' + (mau.length * w) + 'px">' + moc.map((b, i) => '<span style="left:' + ((i + 1) * w) + 'px">' + b + '</span>').join('') + '</div>'; };
      const kho = st.xem === 'tg' ? bins(MAU_TG, MOC_TG, (st.pt === 'xe_may' ? t('Minutes to Ben Thanh by motorcycle, ', 'Số phút tới Bến Thành bằng xe máy, ') : t('Minutes to Ben Thanh by car, ', 'Số phút tới Bến Thành bằng ô tô, ')) + st.nam)
        : bins(MAU_GIAM, MOC_GIAM, (st.pt === 'xe_may' ? t('Minutes saved by motorcycle, ', 'Số phút tiết kiệm được khi đi xe máy, ') : t('Minutes saved by car, ', 'Số phút tiết kiệm được khi đi ô tô, ')) + NAM[0] + '–' + st.nam);
      lg.innerHTML = kho +
        '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#C8102E" stroke-width="2.6"/></svg>' + t('major link open in ', 'công trình lớn đã thông xe năm ') + st.nam + '</div>' +
        '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#5A6570" stroke-width="1.6" stroke-dasharray="4 4"/></svg>' + t('opened later', 'thông xe sau đó') + '</div>' +
        (st.nam < 2012 ? '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#111" stroke-width="2.4" stroke-dasharray="2 2.4"/></svg>' + t('Thu Thiem ferry (closed 2012)', 'phà Thủ Thiêm (đóng năm 2012)') + '</div>' : '');
    }

    function capNhat() {
      veChuGiai();
      const src = map.getSource && map.getSource('tg');
      if (!src) return;
      src.updateImage({ url: ve(), coordinates: goc });
      map.setFilter('ct', loc(st.nam, '<=')); map.setFilter('ct-vien', loc(st.nam, '<=')); map.setFilter('ct-sau', loc(st.nam, '>'));
      map.setLayoutProperty('pha', 'visibility', st.nam < 2012 ? 'visible' : 'none');
    }

    /* controls: year = steps (with ← →), mode and view = toggles */
    K.buoc(fig, (i) => { st.nam = NAM[i]; if (st.nam === NAM[0] && st.xem === 'giam') datXem('tg'); capNhat(); });
    const nutPt = [...fig.querySelectorAll('[data-pt]')], nutXem = [...fig.querySelectorAll('[data-xem]')];
    const bat = (ds, b) => ds.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    nutPt.forEach((b) => b.addEventListener('click', () => { st.pt = b.dataset.pt; bat(nutPt, b); capNhat(); }));
    function datXem(x) { st.xem = x; bat(nutXem, nutXem.find((b) => b.dataset.xem === x)); }
    nutXem.forEach((b) => b.addEventListener('click', () => { datXem(b.dataset.xem); if (st.xem === 'giam' && st.nam === NAM[0]) { const n = fig.querySelector('.steps button[data-go="' + (NAM.length - 1) + '"]'); if (n) n.click(); } capNhat(); }));
    bat(nutPt, nutPt[0]); datXem('tg');
  }

  /* Figure 3.1 — land within 30 and 45 minutes of Ben Thanh, by year and mode */
  function fig31(B) {
    const host = document.getElementById('c-3-1');
    if (!host) return;
    const D = B.thongKe.dienTich, NAM = B.nam;
    const diem = (pt, p) => NAM.map((y) => [y, D[pt][y][p]]), cuoi = NAM[NAM.length - 1];
    K.chart(host, {
      sources: ['l3_thoi_gian'], height: 360, rightMargin: 170, showKinds: false,
      x: { min: 2004, max: 2027, ticks: NAM, fmt: 'y', label: t('Road network of the year', 'Mạng đường của năm') },
      y: { min: 0, max: Math.ceil(D.o_to[NAM[NAM.length - 1]]['45'] / 200) * 200, label: t('km² of land with roads', 'km² đất có đường') },
      series: [
        { id: 'o_to45', kind: 'model', type: 'line', color: '#0B3C8C', width: 3, hover: true, points: diem('o_to', '45'), label: t('car, 45 min', 'ô tô, 45 phút'), labelAt: cuoi },
        { id: 'xe_may45', kind: 'model', type: 'line', color: '#C8102E', width: 3, hover: true, points: diem('xe_may', '45'), label: t('motorcycle, 45 min', 'xe máy, 45 phút'), labelAt: cuoi },
        { id: 'o_to30', kind: 'model', type: 'line', color: '#0B3C8C', width: 1.6, hover: true, points: diem('o_to', '30'), label: t('car, 30 min', 'ô tô, 30 phút'), labelAt: cuoi },
        { id: 'xe_may30', kind: 'model', type: 'line', color: '#C8102E', width: 1.6, hover: true, points: diem('xe_may', '30'), label: t('motorcycle, 30 min', 'xe máy, 30 phút'), labelAt: cuoi },
      ],
      tip: (se, p) => '<div class="k">' + se.label + '</div><div class="v">' + K.fmt(p[1], '0') + ' km²</div><div class="k">' + t('network of ', 'mạng đường năm ') + p[0] + '</div>',
    });
  }

  /* Map 3.2 — public transport to Ben Thanh on a weekday morning: bus only, bus and Metro Line 1, minutes the metro saves */
  function map32(C, B) {
    const fig = document.getElementById('map-3-2');
    if (!fig) return;
    const KH = C.khung, n = KH.cot;
    const doc = (b64) => { const s = atob(b64), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; };
    const buyt = doc(C.luoi.buyt), metro = doc(C.luoi.metro);
    if (buyt.length !== n * KH.hang) throw new Error('L1: public transport grid has the wrong size');
    /* motorcycle time from the road model of Map 3.1, for the tooltip */
    const K5 = B.khung, xm = doc(B.luoi.xe_may[B.nam[B.nam.length - 1]]);
    const kmLon = 111.32 * Math.cos(10.8 * Math.PI / 180), kmLat = 110.574;
    const xeMay = (lng, lat) => { const c = Math.floor((lng - K5.tay) * kmLon / K5.oKm), r = Math.floor((K5.bac - lat) * kmLat / K5.oKm); const v = xm[r * K5.cot + c]; return v === 255 || v == null ? null : v; };
    const MOC = [30, 45, 60, 75, 90, 120], MAU = ['#2D0B59', '#3E4A89', '#31688E', '#26828E', '#35B779', '#90D743', '#FDE725'];
    const MOC_G = [1, 5, 10, 20], MAU_G = [null, '#D6E4F0', '#8DB8DE', '#3B7FC4', '#0B3C8C'];
    const RGB = MAU.map(hex), RGB_G = MAU_G.map((c) => (c ? hex(c) : null));
    const st = { xem: 'buyt' };
    const cv = document.createElement('canvas'); cv.width = n; cv.height = KH.hang;
    const ctx = cv.getContext('2d');
    function ve() {
      const img = ctx.createImageData(n, KH.hang);
      for (let i = 0; i < n * KH.hang; i++) {
        let c = null;
        if (st.xem === 'giam') { if (buyt[i] !== 255 && metro[i] !== 255) c = RGB_G[lop(buyt[i] - metro[i], MOC_G)]; }
        else { const v = (st.xem === 'buyt' ? buyt : metro)[i]; if (v !== 255) c = RGB[lop(v, MOC)]; }
        if (!c) continue;
        img.data[4 * i] = c[0]; img.data[4 * i + 1] = c[1]; img.data[4 * i + 2] = c[2]; img.data[4 * i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      return cv.toDataURL('image/png');
    }
    const goc = [[KH.tay, KH.bac], [KH.dong, KH.bac], [KH.dong, KH.nam], [KH.tay, KH.nam]];
    const map = K.map('m-3-2', { center: B.benThanh, zoom: 9 });
    map.on('load', () => {
      map.addSource('cc', { type: 'image', url: ve(), coordinates: goc });
      map.addLayer({ id: 'cc', type: 'raster', source: 'cc', paint: { 'raster-opacity': DO_MO, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'water');
      K.mapTopLayers(map);
      map.addSource('ray', { type: 'geojson', data: C.duongRay });
      map.addLayer({ id: 'ray-vien', type: 'line', source: 'ray', paint: { 'line-color': '#FFFFFF', 'line-width': 6 } });
      map.addLayer({ id: 'ray', type: 'line', source: 'ray', paint: { 'line-color': '#C8102E', 'line-width': 3 } });
      map.addSource('ga', { type: 'geojson', data: { type: 'FeatureCollection', features: C.ga.map((g) => ({ type: 'Feature', properties: { ten: g.ten }, geometry: { type: 'Point', coordinates: g.toaDo } })) } });
      map.addLayer({ id: 'ga', type: 'circle', source: 'ga', paint: { 'circle-radius': 4, 'circle-color': '#FFFFFF', 'circle-stroke-color': '#C8102E', 'circle-stroke-width': 2 } });
      K.mapRings(map, 'rings', B.benThanh, [10, 20], (r) => K.fmt(r, '0') + ' km', -Math.PI * 0.72);
      const kmLon0 = 111.32 * Math.cos(B.benThanh[1] * Math.PI / 180), rx = 24, ry = 17;
      map.fitBounds([[B.benThanh[0] - rx / kmLon0, B.benThanh[1] - ry / kmLat], [B.benThanh[0] + rx / kmLon0, B.benThanh[1] + ry / kmLat]], { duration: 0, padding: 0 });
      capNhat();
    });
    const box = map.getContainer();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; box.appendChild(tip);
    map.on('mousemove', (e) => {
      const c = Math.floor((e.lngLat.lng - KH.tay) * kmLon / KH.oKm), r = Math.floor((KH.bac - e.lngLat.lat) * kmLat / KH.oKm);
      const g = map.getLayer('ga') ? map.queryRenderedFeatures([[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]], { layers: ['ga'] })[0] : null;
      let html = g ? '<div class="v" style="font-size:14px">' + t('Metro station ', 'Ga ') + g.properties.ten + '</div>' : '';
      if (r >= 0 && r < KH.hang && c >= 0 && c < n && buyt[r * n + c] !== 255) {
        const x = xeMay(e.lngLat.lng, e.lngLat.lat);
        html += '<div class="k">' + t('Minutes to Ben Thanh, 7–8 am', 'Số phút tới Bến Thành, 7–8 giờ sáng') + '</div><table class="tip-t">' +
          '<tr' + (st.xem === 'buyt' ? ' class="on"' : '') + '><td>' + t('bus', 'xe buýt') + '</td><td class="r">' + buyt[r * n + c] + '</td></tr>' +
          '<tr' + (st.xem !== 'buyt' ? ' class="on"' : '') + '><td>' + t('bus and metro', 'buýt và metro') + '</td><td class="r">' + (metro[r * n + c] === 255 ? '–' : metro[r * n + c]) + '</td></tr>' +
          (x != null ? '<tr><td>' + t('motorcycle (Map 3.1)', 'xe máy (Bản đồ 3.1)') + '</td><td class="r">' + x + '</td></tr>' : '') + '</table>';
      }
      if (!html) { tip.style.display = 'none'; return; }
      tip.innerHTML = html; tip.style.display = 'block';
      tip.style.left = Math.min(box.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
      tip.style.top = Math.max(4, e.point.y - tip.offsetHeight - 8) + 'px';
    });
    map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    const lg = document.createElement('div'); lg.className = 'legend outside'; fig.querySelector('.fig-body').appendChild(lg);
    function capNhat() {
      const w = 44, bins = (mau, moc, tieuDe) => '<div class="t">' + tieuDe + '</div><div class="bins">' + mau.map((c) => '<i style="width:' + w + 'px;background:' + (c || '#fff') + '"></i>').join('') + '</div>' +
        '<div class="ticks" style="width:' + (mau.length * w) + 'px">' + moc.map((b, i) => '<span style="left:' + ((i + 1) * w) + 'px">' + b + '</span>').join('') + '</div>';
      lg.innerHTML = (st.xem === 'giam' ? bins(MAU_G, MOC_G, t('Minutes the metro saves, 7–8 am', 'Số phút metro rút ngắn, 7–8 giờ sáng'))
        : bins(MAU, MOC, st.xem === 'buyt' ? t('Minutes to Ben Thanh by bus, 7–8 am', 'Số phút tới Bến Thành bằng xe buýt, 7–8 giờ sáng') : t('Minutes to Ben Thanh by bus and metro, 7–8 am', 'Số phút tới Bến Thành bằng buýt và metro, 7–8 giờ sáng'))) +
        '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#C8102E" stroke-width="3"/></svg>' + t('Metro Line 1 and its stations', 'Metro số 1 và các ga') + '</div>';
      const src = map.getSource && map.getSource('cc'); if (src) src.updateImage({ url: ve(), coordinates: goc });
    }
    const nut = [...fig.querySelectorAll('[data-cc]')];
    nut.forEach((b) => b.addEventListener('click', () => { st.xem = b.dataset.cc; nut.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); capNhat(); }));
    if (nut[0]) nut[0].setAttribute('aria-pressed', 'true');
  }
})();
