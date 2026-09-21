/* Lesson 2 · Map 2.3 — the administrative city and the urban centre (QĐ 161)

   Eight scenes. Each encodes one quantity on one scale:
     1 administrative boundary (legal line)            2 population density, 100 m grid, across the line
     3 edge by population density: GHSL urban centre   4 edge by built-up land: WSF Evolution, 2015
     5 edge by commuting: GHS functional urban area    6 growth OBSERVED from Landsat, 1985 → 2015
     7 density as column height, 500 m grid             8 land prices by ward, framed by the urban centre
   QĐ 162 (owner 09-17 c): the old scene "urban centre 1975 → 2030" mixed interpolated years with observed
   ones and coloured Bien Hoa as part of Ho Chi Minh City in 1975, when it was a separate town. Growth is now
   drawn from satellite observation year by year; the GHSL outline is shown only for 1990, an observed year.
   The administrative boundary stays on the map as a reference line throughout (owner 09-17 b).

   Built after studying Luminocity3D (fine continuous grid, many classes), The Pudding's
   Population Mountains (2D → 3D, one variable, one scale) and Our World in Data (sources).
   Scenes are data; scrolling, step buttons and ← → keys all call go(i). Animations use timers,
   not requestAnimationFrame alone, so they also finish when the page is not being painted.
   The camera leaves room for the text card by measuring the card in the DOM. */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const BT = [106.697513, 10.770838];
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const UC = '#0B3C8C';                                    // urban centre outline
  const FUA = '#7A3E9D';                                   // functional urban area outline
  const UC90 = '#C8102E';                                  // urban centre 1990 (observed year)
  const PRICE = ['#FDF7DB', '#ECB63A', '#BE792B', '#8D4117', '#5C0000'];   // as Map 2.1
  const H_PER = 0.12;                                      // metres of column height per resident/km²

  K.canhRanh = function () {
    const fig = document.getElementById('map-2-2');
    if (!fig) return;
    const V = K.duLieu.l2_vung_do_thi, G = K.duLieu.l2_luoi_dan_so, P = K.duLieu.l2_tphcm, S = K.duLieu.l2_ve_tinh;
    if (!V || !G || !P || !S) throw new Error('L1: Map 2.3 needs l2_vung_do_thi, l2_luoi_dan_so, l2_tphcm, l2_ve_tinh');
    const KY = S.anh.filter((a) => !a.don), DON = S.anh.find((a) => a.don);
    const stage = fig.querySelector('.sc2-stage'), cards = [...fig.querySelectorAll('.sc2-card')];
    const buttons = [...fig.querySelectorAll('.steps button[data-go]')];
    const legend = fig.querySelector('.sc2-legend'), yearBox = fig.querySelector('.sc2-year');
    const narrow = () => innerWidth <= 900;
    const f0 = (x) => K.fmt(x, '0');

    /* ── geometry ── */
    const bboxOf = (geom) => { let w = 180, s = 90, e = -180, n = -90;
      JSON.stringify(geom).replace(/\[(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\]/g, (_, x, y) => { x = +x; y = +y; if (y < 9.5) return ''; w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); return ''; });
      return [[w, s], [e, n]]; };
    const hcBox = bboxOf(V.hanhChinh.hinh);
    const ucBox = bboxOf(V.ttdt.hinh.features.find((f) => f.properties.nam === 2030).geometry);
    const fuaBox = bboxOf(V.fua.hinh);
    const m2020 = V.ttdt.moc.find((m) => m.nam === 2020);

    /* 500 m cells → polygons (row, column, density) */
    const L = G.luoi500, dx = L.buoc * L.sx, dy = L.buoc * L.sy, r5 = (v) => +v.toFixed(5);
    const cells = { type: 'FeatureCollection', features: L.o.map(([r, c, d]) => {
      const x0 = L.W + c * dx, y0 = L.N - r * dy;
      return { type: 'Feature', properties: { d, h: d * H_PER }, geometry: { type: 'Polygon', coordinates: [[[r5(x0), r5(y0)], [r5(x0 + dx), r5(y0)], [r5(x0 + dx), r5(y0 - dy)], [r5(x0), r5(y0 - dy)], [r5(x0), r5(y0)]]] } };
    }) };
    const densityColor = ['step', ['get', 'd'], G.mau[0]];
    G.moc.slice(1).forEach((m, i) => densityColor.push(m, G.mau[i + 1]));

    /* ── map ── */
    const map = new maplibregl.Map({
      container: fig.querySelector('.map'), bounds: hcBox, fitBoundsOptions: { padding: 30 },
      attributionControl: false, fadeDuration: 0, maxPitch: 70, minZoom: 6, maxZoom: 14,
      style: { version: 8, sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } }, layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#F4F5F6' } },
        { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#D3DEE6' } },
        { id: 'roads', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 7, filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary']]],
          paint: { 'line-color': '#FFFFFF', 'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.4, 12, 1.8] } },
      ] },
    });
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'GHSL © European Commission JRC (CC BY 4.0)' }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');
    map.on('error', (e) => { if (!/tiles\.openfreemap|Failed to fetch/.test(String(e.error && e.error.message))) console.warn(e.error); });
    if (window.ResizeObserver) new ResizeObserver(() => map.resize()).observe(stage);

    /* layer → [paint property, full opacity]; every scene lists the groups it shows */
    const LAYERS = {
      hc: { 'hc-fill': ['fill-opacity', 0.04], 'hc-casing': ['line-opacity', 0.9], 'hc-line': ['line-opacity', 1] },
      density: { density: ['raster-opacity', 0.95] },
      uc20: { 'uc20-fill': ['fill-opacity', 0.08], 'uc20-casing': ['line-opacity', 0.9], 'uc20-line': ['line-opacity', 1] },
      circle: { circle: ['line-opacity', 1] },
      built: { 'xay-don': ['raster-opacity', 0.85] },
      fua: { 'fua-fill': ['fill-opacity', 0.06], 'fua-casing': ['line-opacity', 0.9], 'fua-line': ['line-opacity', 1] },
      uc90: { 'uc90-casing': ['line-opacity', 0.9], 'uc90-line': ['line-opacity', 1] },
      price: { 'price-fill': ['fill-opacity', 0.92], 'price-line': ['line-opacity', 0.7] },
    };
    const TR = { duration: reduce ? 0 : 650, delay: 0 };
    const OP = {};
    let ready = false, places = [];

    map.on('load', () => {
      const c = G.anh.khung;
      const src = (K.anhNhung && K.anhNhung[G.anh.tep]) || '../' + G.anh.tep;     // embedded copy works from file://
      map.addSource('density', { type: 'image', url: src, coordinates: [[c.W, c.N], [c.E, c.N], [c.E, c.S], [c.W, c.S]] });
      map.addLayer({ id: 'density', type: 'raster', source: 'density', paint: { 'raster-opacity': 0, 'raster-opacity-transition': TR, 'raster-fade-duration': 0, 'raster-resampling': 'nearest' } });

      map.addSource('price', { type: 'geojson', data: { type: 'FeatureCollection', features: P.gia.phuong.features.filter((f) => f.properties.kc <= 150) } });
      map.addLayer({ id: 'price-fill', type: 'fill', source: 'price', paint: { 'fill-color': K.stepColor('tv', P.gia.moc, PRICE), 'fill-opacity': 0, 'fill-opacity-transition': TR } });
      map.addLayer({ id: 'price-line', type: 'line', source: 'price', paint: { 'line-color': '#FFFFFF', 'line-width': 0.5, 'line-opacity': 0, 'line-opacity-transition': TR } });

      /* built-up land from Landsat (WSF Evolution): one cumulative image per period, and one single-colour image for 2015 */
      const sk = S.khung, goc4 = [[sk.W, sk.N], [sk.E, sk.N], [sk.E, sk.S], [sk.W, sk.S]];
      const nguonAnh = (a) => (K.anhNhung && K.anhNhung[a.tep]) || '../' + a.tep;
      map.addSource('xay-don', { type: 'image', url: nguonAnh(DON), coordinates: goc4 });
      map.addLayer({ id: 'xay-don', type: 'raster', source: 'xay-don', paint: { 'raster-opacity': 0, 'raster-opacity-transition': TR, 'raster-fade-duration': 0, 'raster-resampling': 'nearest' } });
      KY.forEach((a) => {
        map.addSource('xay-' + a.nam, { type: 'image', url: nguonAnh(a), coordinates: goc4 });
        map.addLayer({ id: 'xay-' + a.nam, type: 'raster', source: 'xay-' + a.nam, paint: { 'raster-opacity': 0, 'raster-opacity-transition': { duration: reduce ? 0 : 350, delay: 0 }, 'raster-fade-duration': 0, 'raster-resampling': 'nearest' } });
      });
      map.addSource('fua', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: V.fua.hinh } });
      map.addLayer({ id: 'fua-fill', type: 'fill', source: 'fua', paint: { 'fill-color': FUA, 'fill-opacity': 0, 'fill-opacity-transition': TR } });

      map.addLayer({ id: 'water-over', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#D3DEE6', 'fill-opacity': 0.85 } });

      map.addSource('hc', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: V.hanhChinh.hinh } });
      map.addLayer({ id: 'hc-fill', type: 'fill', source: 'hc', paint: { 'fill-color': '#111111', 'fill-opacity': 0, 'fill-opacity-transition': TR } });

      map.addSource('cols', { type: 'geojson', data: cells });
      map.setLight({ anchor: 'map', position: [1.4, 210, 45], color: '#FFFFFF', intensity: 0.4 });
      /* cells below the urban-centre density are kept but faded, so the dense city reads first */
      map.addLayer({ id: 'cols-lo', type: 'fill-extrusion', source: 'cols', layout: { visibility: 'none' }, filter: ['<', ['get', 'd'], V.dinhNghia.matDo],
        paint: { 'fill-extrusion-color': densityColor, 'fill-extrusion-height': ['get', 'h'], 'fill-extrusion-opacity': 0.35 } });
      map.addLayer({ id: 'cols', type: 'fill-extrusion', source: 'cols', layout: { visibility: 'none' }, filter: ['>=', ['get', 'd'], V.dinhNghia.matDo],
        paint: { 'fill-extrusion-color': densityColor, 'fill-extrusion-height': ['get', 'h'], 'fill-extrusion-opacity': 0.96, 'fill-extrusion-vertical-gradient': true } });

      map.addSource('uc20', { type: 'geojson', data: V.ttdt.hinh.features.find((f) => f.properties.nam === 2020) });
      map.addLayer({ id: 'uc20-fill', type: 'fill', source: 'uc20', paint: { 'fill-color': UC, 'fill-opacity': 0, 'fill-opacity-transition': TR } });
      map.addLayer({ id: 'uc20-casing', type: 'line', source: 'uc20', paint: { 'line-color': '#FFFFFF', 'line-width': 5, 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addLayer({ id: 'uc20-line', type: 'line', source: 'uc20', paint: { 'line-color': UC, 'line-width': 2.6, 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addSource('circle', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: K.circle(BT, m2020.banKinh, 180) } } });
      map.addLayer({ id: 'fua-casing', type: 'line', source: 'fua', paint: { 'line-color': '#FFFFFF', 'line-width': 5, 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addLayer({ id: 'fua-line', type: 'line', source: 'fua', paint: { 'line-color': FUA, 'line-width': 2.4, 'line-dasharray': [3, 1.5], 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addSource('uc90', { type: 'geojson', data: V.ttdt.hinh.features.find((f) => f.properties.nam === 1990) });
      map.addLayer({ id: 'uc90-casing', type: 'line', source: 'uc90', paint: { 'line-color': '#FFFFFF', 'line-width': 4.5, 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addLayer({ id: 'uc90-line', type: 'line', source: 'uc90', paint: { 'line-color': UC90, 'line-width': 2.2, 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addLayer({ id: 'circle', type: 'line', source: 'circle', paint: { 'line-color': '#111111', 'line-width': 1.6, 'line-dasharray': [4, 3], 'line-opacity': 0, 'line-opacity-transition': TR } });

      map.addLayer({ id: 'hc-casing', type: 'line', source: 'hc', paint: { 'line-color': '#FFFFFF', 'line-width': 4, 'line-opacity': 0, 'line-opacity-transition': TR } });
      map.addLayer({ id: 'hc-line', type: 'line', source: 'hc', paint: { 'line-color': '#222222', 'line-width': 1.5, 'line-opacity': 0, 'line-opacity-transition': TR } });

      const nhan = (en) => P.nhan.find((n) => n.en === en) || V.nhanNgoai.find((n) => n.en === en);
      const PL = ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa', 'Vung Tau', 'Can Gio'];
      places = K.mapPlaces(map, PL.map((en) => ({ name: nhan(en)[K.lang], at: nhan(en).toaDo, dot: true }))).map((m, i) => ({ en: PL[i], m }));

      /* on a phone the expanded credit line covers the map: start collapsed (the credits are also under the figure) */
      if (narrow()) { const a = stage.querySelector('.maplibregl-ctrl-attrib'); if (a) a.classList.remove('maplibregl-compact-show'); }

      ready = true;
      const i = cur < 0 ? 0 : cur; cur = -1; go(i, true);
      hover();
      setTimeout(onScroll, 50);
    });

    function show(groups, op) {
      for (const [g, layers] of Object.entries(LAYERS)) {
        const on = groups.includes(g);
        for (const [id, [prop, full]] of Object.entries(layers)) {
          const v = on ? (op && op[id] != null ? op[id] : full) : 0;
          if (OP[id] !== v) { map.setPaintProperty(id, prop, v); OP[id] = v; }
        }
      }
      for (const id of ['cols', 'cols-lo']) map.setLayoutProperty(id, 'visibility', groups.includes('cols') ? 'visible' : 'none');
    }

    /* ── scene 6: built-up land period by period (each image is cumulative) ── */
    let timer = null, kyHien = -1;
    function setKy(k, anHet) {
      KY.forEach((a, i) => { const v = !anHet && i === k ? 0.92 : 0; if (OP['xay-' + a.nam] !== v) { map.setPaintProperty('xay-' + a.nam, 'raster-opacity', v); OP['xay-' + a.nam] = v; } });
      kyHien = anHet ? -1 : k;
      const a = KY[k];
      if (yearBox && a) yearBox.innerHTML = (k ? S.giaiDoan[k - 1].den + 1 + '–' : '≤ ') + K.fmt(a.nam, 'y') + '<small>' + f0(S.km2TheoNam[a.nam]) + t(' km² built up in the functional urban area', ' km² đất xây dựng trong vùng đô thị chức năng') + '</small>';
    }
    function playKy() {
      clearInterval(timer);
      if (reduce) { setKy(KY.length - 1); return; }
      let k = 0; setKy(0);
      timer = setInterval(() => { k++; if (k >= KY.length) { clearInterval(timer); return; } setKy(k); }, 900);
    }

    /* ── scenes as data ── */
    const SCENES = [
      { layers: ['hc'], box: hcBox, legend: 'hc', labels: ['Ben Thanh', 'Vung Tau', 'Can Gio', 'Thu Dau Mot'] },
      { layers: ['hc', 'density'], box: hcBox, legend: 'density', labels: ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa', 'Vung Tau', 'Can Gio'] },
      { layers: ['hc', 'density', 'uc20', 'circle'], op: { density: 0.3, 'hc-line': 0.7, 'uc20-fill': 0 }, box: ucBox, legend: 'uc', labels: ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa'] },
      { layers: ['hc', 'built', 'uc20'], op: { 'hc-line': 0.6, 'uc20-fill': 0 }, box: fuaBox, legend: 'built', labels: ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa'] },
      { layers: ['hc', 'built', 'uc20', 'fua'], op: { 'hc-line': 0.6, 'uc20-fill': 0, 'xay-don': 0.3 }, box: fuaBox, legend: 'fua', labels: ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa'] },
      { layers: ['hc', 'uc90'], op: { 'hc-line': 0.5, 'hc-casing': 0.5 }, box: fuaBox, legend: 'growth', labels: ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa'], growth: true },
      { layers: ['cols', 'uc20', 'hc'], op: { 'uc20-fill': 0, 'hc-line': 0.5, 'hc-casing': 0 }, cam: { center: [106.73, 10.87], zoom: 9.45, pitch: 60, bearing: -20 }, legend: 'cols', labels: [] },
      { layers: ['hc', 'price', 'uc20'], op: { 'uc20-fill': 0 }, box: ucBox, legend: 'price', labels: ['Ben Thanh', 'Thu Dau Mot', 'Bien Hoa'] },
    ];
    /* room for the text card: its right edge, measured, plus a gutter (desktop); a band at the bottom (mobile) */
    function pad() {
      if (narrow()) return { top: 24, bottom: Math.round(stage.clientHeight * 0.12), left: 16, right: 16 };
      const cr = cards[0].getBoundingClientRect(), sr = stage.getBoundingClientRect();
      return { top: 36, bottom: 36, left: Math.max(40, Math.round(cr.right - sr.left + 28)), right: 56 };
    }
    /* north-up camera that fits a box inside the padded area. Computed from Web Mercator directly:
       map.cameraForBounds reads the current pitch and padding, so after the tilted scene 5 it
       returned a camera zoomed far out (seen in the 09-17 screenshots). */
    const mx = (lon) => (lon + 180) / 360;
    const my = (lat) => (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2;
    const lonOf = (x) => x * 360 - 180;
    const latOf = (y) => (360 / Math.PI) * Math.atan(Math.exp(Math.PI * (1 - 2 * y))) - 90;
    function camFor(box, p) {
      const W = stage.clientWidth, H = stage.clientHeight;
      const x1 = mx(box[0][0]), x2 = mx(box[1][0]), y1 = my(box[1][1]), y2 = my(box[0][1]);
      const zoom = Math.min(map.getMaxZoom(), Math.log2(Math.min((W - p.left - p.right) / ((x2 - x1) * 512), (H - p.top - p.bottom) / ((y2 - y1) * 512))));
      const world = 512 * Math.pow(2, zoom);
      const cx = (x1 + x2) / 2 - (p.left - p.right) / 2 / world, cy = (y1 + y2) / 2 - (p.top - p.bottom) / 2 / world;
      return { center: [lonOf(cx), latOf(cy)], zoom };
    }
    let cur = -1;
    function go(i, instant) {
      i = Math.max(0, Math.min(SCENES.length - 1, i));
      if (i === cur) return;
      cur = i;
      const s = SCENES[i];
      cards.forEach((c, k) => c.classList.toggle('on', k === i));
      buttons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      drawLegend(s.legend);
      if (yearBox) yearBox.hidden = !s.growth;
      if (!ready) return;
      show(s.layers, s.op);
      places.forEach((p) => { p.m.getElement().style.visibility = s.labels.includes(p.en) ? 'visible' : 'hidden'; });
      const duration = instant || reduce ? 0 : 1600;
      if (s.cam) {
        map.easeTo({ ...s.cam, padding: pad(), duration });
      } else {
        const cam = camFor(s.box, pad());
        map.easeTo({ center: cam.center, zoom: cam.zoom, pitch: 0, bearing: 0, padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration });
      }
      if (s.growth) playKy(); else { clearInterval(timer); if (kyHien >= 0) setKy(0, true); }
    }

    /* scroll: the last card whose top has passed the reading line */
    const line = () => innerHeight * (narrow() ? 0.8 : 0.62);
    let hen = null, khoa = 0;
    function onScroll() {
      if (Date.now() < khoa) return;
      const r = fig.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      let best = 0; cards.forEach((c, k) => { if (c.getBoundingClientRect().top < line()) best = k; });
      go(best);
    }
    window.addEventListener('scroll', () => { if (hen) return; hen = setTimeout(() => { hen = null; onScroll(); }, 90); }, { passive: true });
    const toCard = (i) => {
      i = Math.max(0, Math.min(cards.length - 1, i));
      khoa = Date.now() + (reduce ? 0 : 900);
      window.scrollTo({ top: scrollY + cards[i].getBoundingClientRect().top - line() + 30, behavior: reduce ? 'auto' : 'smooth' });
      go(i);
    };
    buttons.forEach((b) => b.addEventListener('click', () => toCard(+b.dataset.go)));
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      const r = stage.getBoundingClientRect();
      if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.3) return;
      if (e.key === 'ArrowRight') { toCard(cur + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { toCard(cur - 1); e.preventDefault(); }
    });
    const replay = fig.querySelector('[data-act="replay"]');
    if (replay) replay.addEventListener('click', () => { if (cur !== 5) go(5); playKy(); });

    /* ── legends ── */
    const sw = (inner) => '<svg width="28" height="12" style="flex:none">' + inner + '</svg>';
    const KEY_HC = sw('<line x1="0" x2="28" y1="6" y2="6" stroke="#fff" stroke-width="4"/><line x1="0" x2="28" y1="6" y2="6" stroke="#222" stroke-width="1.5"/>');
    const KEY_UC = sw('<rect x="1.5" y="1.5" width="25" height="9" fill="' + UC + '" fill-opacity=".1" stroke="' + UC + '" stroke-width="2.4"/>');
    const KEY_CIRCLE = sw('<line x1="0" x2="28" y1="6" y2="6" stroke="#111" stroke-width="1.6" stroke-dasharray="4 3"/>');
    const KEY_FUA = sw('<line x1="0" x2="28" y1="6" y2="6" stroke="#fff" stroke-width="5"/><line x1="0" x2="28" y1="6" y2="6" stroke="' + FUA + '" stroke-width="2.4" stroke-dasharray="7 3"/>');
    const KEY_UC90 = sw('<line x1="0" x2="28" y1="6" y2="6" stroke="#fff" stroke-width="4.5"/><line x1="0" x2="28" y1="6" y2="6" stroke="' + UC90 + '" stroke-width="2.2"/>');
    const KEY_BUILT = sw('<rect x="1.5" y="1.5" width="25" height="9" fill="' + DON.mau + '"/>');
    const row = (key, text) => '<div class="row">' + key + '<span>' + text + '</span></div>';
    const rowHC = () => row(KEY_HC, t('administrative boundary of Ho Chi Minh City (2025)', 'ranh hành chính TP.HCM (2025)'));
    const rowUC = () => row(KEY_UC, t('urban centre, 2020 (GHSL)', 'trung tâm đô thị 2020 (GHSL)'));
    function bins(title, colors, breaks, fmt, w) {
      return '<div class="t">' + title + '</div><div class="bins">' + colors.map((c) => '<i style="background:' + c + ';width:' + w + 'px"></i>').join('') +
        '</div>' + (breaks.length ? '<div class="ticks" style="width:' + (colors.length * w) + 'px">' + breaks.map((m, k) => '<span style="left:' + ((k + 1) * w) + 'px">' + fmt(m) + '</span>').join('') + '</div>' : '');
    }
    const kFmt = (m) => (m >= 1000 ? K.fmt(m / 1000, '0') + 'k' : f0(m));
    function densityLegend() {
      const w = narrow() ? 24 : 32, i1500 = G.moc.indexOf(V.dinhNghia.matDo);
      return bins(t('Residents per km², 2020', 'Người/km², 2020'), G.mau, G.moc.slice(1), kFmt, w) +
        (i1500 > 0 ? '<div class="brace" style="margin-left:' + (i1500 * w) + 'px;width:' + ((G.mau.length - i1500) * w) + 'px">' + t('dense enough for an urban centre', 'đủ dày cho trung tâm đô thị') + '</div>' : '');
    }
    function drawLegend(kind) {
      if (!legend) return;
      const w = narrow() ? 24 : 32, wy = Math.round(w * 0.8);
      const html = {
        hc: '<div class="t">' + t('The administrative city', 'Thành phố hành chính') + '</div>' + rowHC(),
        density: densityLegend() + '<div class="h">' + rowHC() + '</div>',
        uc: rowUC() + row(KEY_CIRCLE, t('circle of the same area around Ben Thanh', 'vòng tròn cùng diện tích quanh Bến Thành')) + rowHC(),
        built: row(KEY_BUILT, t('built up by 2015 (Landsat, cells of 90 m)', 'đã xây dựng tới 2015 (Landsat, ô 90 m)')) + rowUC() + rowHC(),
        fua: row(KEY_FUA, t('functional urban area, 2015: city and commuting zone', 'vùng đô thị chức năng 2015: thành phố và vùng đi làm')) + rowUC() + rowHC(),
        growth: bins(t('Built up in', 'Xây dựng trong giai đoạn'), S.giaiDoan.map((g) => g.mau), [], f0, wy + 6) +
          '<div class="ticks" style="width:' + (S.giaiDoan.length * (wy + 6)) + 'px">' + S.giaiDoan.map((g, k) => '<span style="left:' + ((k + 0.5) * (wy + 6)) + 'px">' + (k ? String(g.den).slice(2) : '≤85') + '</span>').join('') + '</div>' +
          row(KEY_UC90, t('urban centre in 1990 (GHSL, observed year)', 'trung tâm đô thị năm 1990 (GHSL, năm quan sát)')) + rowHC(),
        cols: densityLegend() + '<div class="h">' + t('Height: 1 km for every ', 'Chiều cao: 1 km cho mỗi ') + f0(1000 / H_PER) + t(' residents per km² · cells of 500 m', ' người/km² · ô 500 m') + '</div>' + rowUC(),
        price: bins(t('Residential land price, 2026, thousand VND per m²', 'Giá đất ở 2026, nghìn đồng/m²'), PRICE, P.gia.moc, kFmt, w) + '<div class="h">' + rowUC() + rowHC() + '</div>',
      }[kind];
      legend.innerHTML = html || '';
    }

    /* ── hover: column density, year of an outline, or ward price ── */
    function hover() {
      const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; stage.appendChild(tip);
      map.on('mousemove', (e) => {
        let html = '';
        if (cur === 7) { const f = map.queryRenderedFeatures(e.point, { layers: ['price-fill'] })[0];
          if (f) html = '<div class="k">' + f.properties.ten + '</div><div class="v">' + f0(f.properties.tv) + '</div><div class="k">' + t('thousand VND/m²', 'nghìn đồng/m²') + '</div>'; }
        else if (cur === 6) { const f = map.queryRenderedFeatures(e.point, { layers: ['cols'] })[0];
          if (f) html = '<div class="v">' + f0(f.properties.d) + '</div><div class="k">' + t('residents per km², 500 m cell', 'người/km², ô 500 m') + '</div>'; }
        if (!html) { tip.style.display = 'none'; return; }
        tip.innerHTML = html; tip.style.display = 'block';
        tip.style.left = Math.min(stage.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
        tip.style.top = Math.max(4, e.point.y - 64) + 'px';
      });
      map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    }

    /* ── card 6: built-up land in the functional urban area, every year 1985–2015 (Landsat) ── */
    const host = document.getElementById('c-2-2b');
    if (host) {
      const pts = Object.entries(S.km2TheoNam).map(([y, v]) => [+y, v]);
      K.chart(host, { sources: ['l2_ve_tinh'], height: 180, rightMargin: 40, alt: t('Built-up land in the functional urban area, 1985–2015', 'Đất xây dựng trong vùng đô thị chức năng, 1985–2015'),
        x: { min: 1985, max: 2015, ticks: [1985, 1995, 2005, 2015], fmt: 'y' },
        y: { min: 0, max: 1400, ticks: [0, 350, 700, 1050, 1400], label: t('Built-up land, km²', 'Đất xây dựng, km²') },
        series: [
          { id: 'b', kind: 'data', type: 'line', color: '#3A4657', points: pts, hover: true },
        ],
        tip: (s, p) => '<div class="k">' + K.fmt(p[0], 'y') + '</div><div class="v">' + f0(p[1]) + ' km²</div>',
      });
    }

    drawLegend(SCENES[0].legend);
    if (buttons[0]) buttons[0].setAttribute('aria-pressed', 'true');
  };
})();
