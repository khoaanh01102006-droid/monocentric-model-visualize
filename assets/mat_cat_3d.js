/* Lesson 2 · Map 2.4 — the section of Figure 2.2 raised over the city (QĐ 163; owner 09-17 d asked
   whether the chart could be drawn as a real map).

   The chart's horizontal axis becomes the real line through Can Gio, Ben Thanh, Thu Dau Mot and Bau
   Bang; its vertical axis becomes height above the ground, on the same logarithmic price scale. Each
   ward's residential and agricultural prices stand over its position on the line; the wards used are
   shaded on the ground; the band "inside the urban centre" is drawn where the line actually crosses the
   outline of the 2020 urban centre. Drawn with assets/lop3d.js (three.js in a MapLibre custom layer). */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const PRICE = ['#FDF7DB', '#ECB63A', '#BE792B', '#8D4117', '#5C0000'];
  const O = '#BE792B', NN = '#27795A', MARK = '#5C0000', UC = '#0B3C8C';
  const M_THAP_KY = 9000;                       // metres of height for one power of ten in price
  const DAY = 2;                                 // log10 of the price at ground level: 100 thousand VND/m²

  K.matCat3d = function () {
    const fig = document.getElementById('map-section');
    if (!fig) return;
    const N = K.duLieu.l2_nong_nghiep, P = K.duLieu.l2_tphcm, V = K.duLieu.l2_vung_do_thi;
    if (!N || !N.truc || !P || !V) throw new Error('L1: Map 2.4 needs l2_nong_nghiep (with truc), l2_tphcm, l2_vung_do_thi');
    const truc = N.truc, k = P.gia.k40;
    const cao = (gia) => (Math.log10(gia) - DAY) * M_THAP_KY;
    const kmLon = 111.32 * Math.cos(10.8 * Math.PI / 180), kmLat = 110.574;

    /* position on the section line at distance s (km from Ben Thanh, south negative) */
    function viTri(s) {
      const S = truc.s, X = truc.toaDo;
      let i = 0; while (i < S.length - 2 && s > S[i + 1]) i++;
      const u = (s - S[i]) / (S[i + 1] - S[i]);
      return [X[i][0] + u * (X[i + 1][0] - X[i][0]), X[i][1] + u * (X[i + 1][1] - X[i][1])];
    }
    const s0 = truc.s[0], s1 = truc.s[truc.s.length - 1];
    const duong = (a, b, buoc) => { const v = []; for (let s = a; s < b; s += buoc) v.push(viTri(s)); v.push(viTri(b)); return v; };

    /* side view: the camera looks across the section, south end on the left as in Figure 2.2 */
    const A = truc.toaDo[0], B = truc.toaDo[truc.toaDo.length - 1];
    const huong = Math.atan2((B[0] - A[0]) * kmLon, (B[1] - A[1]) * kmLat) * 180 / Math.PI;
    const giua = viTri((s0 + s1) / 2 - 4);
    const stage = fig.querySelector('.s3d-stage');
    const map = new maplibregl.Map({
      container: fig.querySelector('.map'), center: giua, zoom: 9.05, pitch: 68, bearing: huong - 90,
      attributionControl: false, fadeDuration: 0, maxPitch: 80, minZoom: 6, maxZoom: 13,
      style: { version: 8, sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } }, layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#F4F5F6' } },
        { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#D3DEE6' } },
        { id: 'roads', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 7, filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary']]],
          paint: { 'line-color': '#FFFFFF', 'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.4, 12, 1.8] } },
      ] },
    });
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.on('error', (e) => { if (!/tiles\.openfreemap|Failed to fetch/.test(String(e.error && e.error.message))) console.warn(e.error); });
    if (window.ResizeObserver) new ResizeObserver(() => map.resize()).observe(stage);

    const tenSet = new Set(N.matCat.map((m) => m.ten));
    map.on('load', () => {
      /* ground: every ward faint; the wards on the section shaded by residential price, as Map 2.1 */
      const phuong = { type: 'FeatureCollection', features: P.gia.phuong.features.filter((f) => f.properties.kc <= 150).map((f) => ({ ...f, properties: { ...f.properties, tren: tenSet.has(f.properties.ten) } })) };
      map.addSource('phuong', { type: 'geojson', data: phuong });
      map.addLayer({ id: 'phuong-fill', type: 'fill', source: 'phuong', paint: { 'fill-color': K.stepColor('tv', P.gia.moc, PRICE), 'fill-opacity': ['case', ['get', 'tren'], 0.75, 0.12] } });
      map.addLayer({ id: 'phuong-line', type: 'line', source: 'phuong', paint: { 'line-color': '#FFFFFF', 'line-width': 0.6 } });
      map.addLayer({ id: 'water-top', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#D3DEE6', 'fill-opacity': 0.9 } });
      map.addSource('uc20', { type: 'geojson', data: V.ttdt.hinh.features.find((f) => f.properties.nam === 2020) });
      map.addLayer({ id: 'uc20-line', type: 'line', source: 'uc20', paint: { 'line-color': UC, 'line-width': 2.2 } });
      map.addSource('truc', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: truc.toaDo } } });
      map.addLayer({ id: 'truc-casing', type: 'line', source: 'truc', paint: { 'line-color': '#FFFFFF', 'line-width': 5 } });
      map.addLayer({ id: 'truc', type: 'line', source: 'truc', paint: { 'line-color': '#111111', 'line-width': 2 } });

      K.lop3d(map, {
        id: 'mat-cat-3d', origin: truc.toaDo[3],
        build(h) {
          const wall = duong(s0, s1, 0.5);
          /* backdrop and gridlines: one line for each power of ten */
          h.tuong(wall, 0, cao(1e6), '#FFFFFF', 0.4);
          h.ong(wall.map(([x, y]) => [x, y, cao(1e6)]), 45, '#CED4DE');
          [1e3, 1e4, 1e5].forEach((g) => { h.ong(wall.map(([x, y]) => [x, y, cao(g)]), 45, '#8A969F', 0.9); });
          h.ong(wall.map(([x, y]) => [x, y, 30]), 60, '#8A969F');
          [[1e3, '1,000', '1.000'], [1e4, '10,000', '10.000'], [1e5, '100,000', '100.000']].forEach(([g, en, vi]) => { const [x, y] = viTri(s0); h.nhan(x, y, cao(g), t(en, vi), 'truc-y', -8, 0); });
          { const [x, y] = viTri(s0); h.nhan(x, y, cao(1e6), t('thousand VND per m²', 'nghìn đồng/m²'), 'truc-t', 0, -6); }
          /* band where the line lies inside the 2020 urban centre */
          const ra = V.matCatRa;
          h.tuong(duong(ra.nam, ra.bac, 0.5), 0, cao(1e6), UC, 0.1);
          { const [x, y] = viTri((ra.nam + ra.bac) / 2); h.nhan(x, y, cao(1e6), t('inside the urban centre, 2020', 'trong trung tâm đô thị 2020'), 'uc', 0, -4); }
          /* fitted line within 40 km, drawn in dashes */
          for (let s = -40; s < 40; s += 2) {
            const a = Math.max(-40, s), b = Math.min(40, s + 1.2), pts = [];
            for (let u = a; u <= b + 1e-9; u += 0.3) { const [x, y] = viTri(u); pts.push([x, y, cao(Math.exp(k.a + k.b * Math.abs(u)))]); }
            h.ong(pts, 110, '#111111');
          }
          { const [x, y] = viTri(40); h.nhan(x, y, cao(Math.exp(k.a + k.b * 40)), t('fitted, 0–40 km', 'đường khớp, 0–40 km'), 'fit', 8, 0); }
          /* the wards: residential and agricultural price */
          const MOC = { 'Phường Bến Thành': ['Ben Thanh', 'Bến Thành'], 'Phường Thủ Dầu Một': ['Thu Dau Mot', 'Thủ Dầu Một'], 'Xã Cần Giờ': ['Can Gio', 'Cần Giờ'], 'Xã Bàu Bàng': ['Bau Bang', 'Bàu Bàng'] };
          diem = N.matCat.map((m) => {
            const [x, y] = viTri(m.s), moc = MOC[m.ten];
            h.cau(x, y, cao(m.nn), 380, NN);
            h.cau(x, y, cao(m.o), moc ? 750 : 480, moc ? MARK : O);
            if (moc) { h.nhan(x, y, cao(m.o), moc[K.lang === 'vi' ? 1 : 0], 'moc', 0, -12); h.doan([x, y, 0], [x, y, cao(m.o)], 35, '#5C0000', 0.5); }
            return { m, o: h.P(x, y, cao(m.o)), nn: h.P(x, y, cao(m.nn)) };
          });
          lop = h;
        },
      });

      /* hover: nearest point on screen */
      const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; stage.appendChild(tip);
      map.on('mousemove', (e) => {
        if (!lop) return;
        let best = null, bd = 196;
        for (const d of diem) for (const [p, loai] of [[d.o, 'o'], [d.nn, 'nn']]) {
          const s = lop.chieu(p); if (!s) continue;
          const dd = (s[0] - e.point.x) ** 2 + (s[1] - e.point.y) ** 2;
          if (dd < bd) { bd = dd; best = { d, loai }; }
        }
        if (!best) { tip.style.display = 'none'; return; }
        const m = best.d.m;
        tip.innerHTML = '<div class="k">' + m.ten + ' · ' + K.fmt(m.s, '1') + ' km</div><div class="v">' + K.fmt(best.loai === 'o' ? m.o : m.nn, '0') + '</div><div class="k">' +
          (best.loai === 'o' ? t('residential land, thousand VND/m²', 'đất ở, nghìn đồng/m²') : t('farmland, zone ', 'đất nông nghiệp, khu vực ') + m.kv + t(', thousand VND/m²', ', nghìn đồng/m²')) + '</div>';
        tip.style.display = 'block';
        tip.style.left = Math.min(stage.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
        tip.style.top = Math.max(4, e.point.y - 60) + 'px';
      });
      map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
    let lop = null, diem = [];

    /* camera presets */
    const VIEWS = {
      side: { center: giua, zoom: 9.05, pitch: 68, bearing: huong - 90 },
      oblique: { center: giua, zoom: 9.2, pitch: 58, bearing: huong - 45 },
      above: { center: viTri((s0 + s1) / 2), zoom: 8.9, pitch: 0, bearing: 0 },
    };
    const nut = [...fig.querySelectorAll('[data-view]')];
    nut.forEach((b) => b.addEventListener('click', () => {
      nut.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      map.easeTo({ ...VIEWS[b.dataset.view], duration: 1400 });
    }));
    if (nut[0]) nut[0].setAttribute('aria-pressed', 'true');
  };
})();
