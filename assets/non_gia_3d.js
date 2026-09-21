/* Lesson 2 · Map 2.2 — land prices and the price surface of the monocentric model (QĐ 163, M2; owner
   09-17 d asked for a land price map drawn as the graph of the monocentric model).

   Each ward's median residential price stands as a column over the centroid of its boundary. The
   fitted line of Figure 2.1, ln p = a + b·x, is turned around Ben Thanh into a surface; on a
   logarithmic height scale that surface is a cone. As in Figure 1.2 of Lesson 1, a quarter of the
   surface is cut away so that its profile shows on the cut faces. Four steps: prices, the surface,
   each ward's ratio to the surface, and farmland prices (the r_A of equation 1.5) with the surface
   extended to meet them. Height can be switched between the logarithmic scale of Figure 2.1 and an
   ordinary scale, on which the surface becomes the curved tent of Figure 1.2.
   Data: du_lieu/l2_non_gia.js (kich_ban/l2_non_gia.mjs). Drawn with assets/lop3d.js. */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const PRICE = ['#FDF7DB', '#ECB63A', '#BE792B', '#8D4117', '#5C0000'];
  const RATIO = ['#0B5394', '#8DB8DE', '#EFEFEF', '#E8A28C', '#B3261E'];      // far below … far above the surface
  const O = '#BE792B', NN = '#27795A', LEVEL = '#3E7D4F', UC = '#0B3C8C', XA = '#9AA5AE', TREN = '#B3261E', DUOI = '#0B5394';
  const MAT = '#51606E', CUT = '#E4DCC8', PROFILE = '#5C0000', COT = '#B3BBC2';   // surface, cut faces (paper, as Figure 1.2), profile, stems
  const M_THAP_KY = 12000;                        // metres of height for one power of ten in price
  const DAY = 2.5;                                 // log10 of the price at ground level: about 316 thousand VND/m²
  const R_KHOP = 40, R_NGOAI = 56;                 // km: surface used in the fit; extended surface
  const RAD = Math.PI / 180;

  K.nonGia3d = function () {
    const fig = document.getElementById('map-cone');
    if (!fig) return;
    const G = K.duLieu.l2_non_gia, P = K.duLieu.l2_tphcm, V = K.duLieu.l2_vung_do_thi;
    if (!G || !P || !V) throw new Error('L1: Map 2.2 needs l2_non_gia, l2_tphcm, l2_vung_do_thi');
    const T = window.THREE, k = G.k40, tam = G.tam;
    const kmLon = 111.32 * Math.cos(tam[1] * RAD), kmLat = 110.574;
    const diem = (r, goc) => [tam[0] + r * Math.sin(goc) / kmLon, tam[1] + r * Math.cos(goc) / kmLat];   // goc: clockwise from north
    const giaMoHinh = (x) => Math.exp(k.a + k.b * x);
    const ten = (d) => (K.lang === 'vi' ? d.ten : d.en);

    /* height of a price: u = 0 logarithmic, u = 1 ordinary (both scales agree at the centre of the surface) */
    const P0 = giaMoHinh(0), hLog = (p) => Math.max(0, (Math.log10(p) - DAY) * M_THAP_KY), H0 = hLog(P0);
    let u = 0;
    const cao = (p) => (1 - u) * hLog(p) + u * (p / P0) * H0;

    /* the camera looks north-north-west; the quarter facing it is removed */
    const BEARING = -20, GOC_CAT = (BEARING + 180) * RAD, CAT_A = GOC_CAT + 45 * RAD, CAT_B = GOC_CAT - 45 * RAD + 2 * Math.PI;
    const NA = 90;                                    // angular steps over the remaining three quarters

    const stage = fig.querySelector('.s3d-stage');
    const map = new maplibregl.Map({
      container: fig.querySelector('.map'), center: tam, zoom: 8.6, pitch: 55, bearing: BEARING,
      attributionControl: false, fadeDuration: 0, maxPitch: 80, minZoom: 6, maxZoom: 13,
      style: { version: 8, sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } }, layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#F4F5F6' } },
        { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#D3DEE6' } },
      ] },
    });
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.on('error', (e) => { if (!/tiles\.openfreemap|Failed to fetch/.test(String(e.error && e.error.message))) console.warn(e.error); });
    if (window.ResizeObserver) new ResizeObserver(() => map.resize()).observe(stage);

    const theoTen = new Map(G.phuong.map((d) => [d.ten, d]));
    const lopTiLe = (r) => { let i = 0; while (i < G.mocDu.length && r >= G.mocDu[i]) i++; return i; };
    let lop = null, buoc = 0, sanSang = false;
    const vat = {};                                   // three.js objects, filled in dung()

    map.on('load', () => {
      const phuong = { type: 'FeatureCollection', features: P.gia.phuong.features.filter((f) => theoTen.has(f.properties.ten)).map((f) => {
        const d = theoTen.get(f.properties.ten);
        return { type: 'Feature', geometry: f.geometry, properties: { tv: d.o, lop: d.trong40 ? lopTiLe(Math.exp(d.du)) : -1 } };
      }) };
      map.addSource('phuong', { type: 'geojson', data: phuong });
      map.addLayer({ id: 'phuong-fill', type: 'fill', source: 'phuong', paint: { 'fill-color': K.stepColor('tv', P.gia.moc, PRICE), 'fill-opacity': 0.6 } });
      map.addLayer({ id: 'phuong-line', type: 'line', source: 'phuong', paint: { 'line-color': '#FFFFFF', 'line-width': 0.5 } });
      map.addLayer({ id: 'water-top', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#D3DEE6', 'fill-opacity': 0.9 } });
      map.addSource('uc20', { type: 'geojson', data: V.ttdt.hinh.features.find((f) => f.properties.nam === 2020) });
      map.addLayer({ id: 'uc20-line', type: 'line', source: 'uc20', paint: { 'line-color': UC, 'line-width': 1.6, 'line-opacity': 0.8 } });
      K.mapRings(map, 'rings', tam, [10, 20, R_KHOP], (r) => K.fmt(r, '0') + ' km', GOC_CAT);

      lop = K.lop3d(map, { id: 'non-gia-3d', origin: tam, build: dung });
      sanSang = true;
      datBuoc(buoc, false);
    });

    /* ---------- the scene ---------- */
    const trongSuot = (mau, op) => new T.MeshBasicMaterial({ color: mau, transparent: true, opacity: op, depthWrite: false, side: T.DoubleSide });
    const vungR = (a, b, buocR) => { const r = []; for (let x = a; x < b - 1e-9; x += buocR) r.push(+x.toFixed(3)); r.push(b); return r; };

    function dung(h) {
      const S = h.scene, m4 = new T.Matrix4();
      S.add(new T.AmbientLight(0xffffff, 0.72));
      const den = new T.DirectionalLight(0xffffff, 0.42); den.position.set(-0.4, 0.5, 1); S.add(den);
      const n = G.phuong.length;

      /* columns: stem, head (residential price), disc (farmland price) */
      const gTru = new T.CylinderGeometry(1, 1, 1, 6, 1, true); gTru.rotateX(Math.PI / 2); gTru.translate(0, 0, 0.5);
      vat.cot = new T.InstancedMesh(gTru, new T.MeshBasicMaterial({ color: COT }), n);
      vat.dau = new T.InstancedMesh(new T.SphereGeometry(1, 16, 12), new T.MeshLambertMaterial({ color: 0xffffff }), n);
      const gDia = new T.CylinderGeometry(1, 1, 1, 24); gDia.rotateX(Math.PI / 2);
      vat.dia = new T.InstancedMesh(gDia, new T.MeshLambertMaterial({ color: 0xffffff }), n);
      for (let i = 0; i < n; i++) { vat.dau.setColorAt(i, new T.Color(O)); vat.dia.setColorAt(i, new T.Color(NN)); vat.cot.setMatrixAt(i, m4); vat.dau.setMatrixAt(i, m4); vat.dia.setMatrixAt(i, m4); }
      [vat.cot, vat.dau, vat.dia].forEach((m) => { m.frustumCulled = false; S.add(m); });

      /* surface over three quarters: polar grid, radii × angles from CAT_A to CAT_B */
      const beMat = (radii, mau, op) => {
        const g = new T.BufferGeometry(), idx = [];
        g.setAttribute('position', new T.Float32BufferAttribute(new Float32Array(radii.length * (NA + 1) * 3), 3));
        for (let i = 0; i + 1 < radii.length; i++) for (let j = 0; j < NA; j++) { const a = i * (NA + 1) + j, b = a + NA + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
        g.setIndex(idx);
        const me = new T.Mesh(g, trongSuot(mau, op)); me.userData = { radii }; me.frustumCulled = false; S.add(me); return me;
      };
      vat.mat = beMat(vungR(0, R_KHOP, 0.5), MAT, 0.16);
      vat.matNgoai = beMat(vungR(R_KHOP, R_NGOAI, 0.5), MAT, 0.07);
      vat.dai = beMat(vungR(G.gap.I, G.gap.IV, 0.25), NN, 0.3);

      /* cut faces along the two radii that bound the removed quarter, and the outer wall at 40 km */
      const matCat = (radii, goc, op) => {
        const g = new T.BufferGeometry(), idx = [];
        g.setAttribute('position', new T.Float32BufferAttribute(new Float32Array(radii.length * 2 * 3), 3));
        for (let i = 0; i + 1 < radii.length; i++) { const a = 2 * i; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
        g.setIndex(idx);
        const me = new T.Mesh(g, trongSuot(CUT, op)); me.userData = { radii, goc }; me.frustumCulled = false; S.add(me); return me;
      };
      vat.cat = [CAT_A, CAT_B].map((g) => matCat(vungR(0, R_KHOP, 0.5), g, 0.55));
      vat.catNgoai = [CAT_A, CAT_B].map((g) => matCat(vungR(R_KHOP, R_NGOAI, 0.5), g, 0.28));
      {
        const g = new T.BufferGeometry(), idx = [];
        g.setAttribute('position', new T.Float32BufferAttribute(new Float32Array((NA + 1) * 2 * 3), 3));
        for (let j = 0; j < NA; j++) { const a = 2 * j; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
        g.setIndex(idx);
        vat.tuong = new T.Mesh(g, trongSuot(MAT, 0.07)); vat.tuong.frustumCulled = false; S.add(vat.tuong);
      }

      /* price contours on the surface, at the class breaks of the ground colours */
      vat.duongGia = P.gia.moc.map((p) => {
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(new Float32Array((NA + 1) * 3), 3));
        const l = new T.Line(g, new T.LineBasicMaterial({ color: MAT, transparent: true, opacity: 0.8 })); l.frustumCulled = false; S.add(l);
        return { p, r: (Math.log(p) - k.a) / k.b, l };
      });

      /* labels */
      vat.nhanGia = vat.duongGia.map((x) => ({ ...x, a: h.nhan(tam[0], tam[1], 0, K.fmt(x.p, '0'), 'gia', 6, 0) }));
      vat.nhanMat = h.nhan(tam[0], tam[1], 0, t('fitted surface, to 40 km', 'bề mặt khớp, tới 40 km'), 'fit', 8, 0);
      vat.hep = stage.clientWidth < 560;
      const hep = stage.clientWidth < 560;                // phone: short labels
      vat.nhanNN = ['I', 'IV'].map((kv) => ({ kv, a: h.nhan(tam[0], tam[1], 0, (hep ? t('zone ', 'khu vực ') : t('farmland, zone ', 'đất nông nghiệp, khu vực ')) + kv + ': ' + K.fmt(G.bang1[kv][0], '0'), 'nn', 8, 0) }));
      vat.nhanDai = h.nhan(tam[0], tam[1], 0, t('extended surface meets farmland prices', 'bề mặt kéo dài gặp giá đất nông nghiệp'), 'nn', 0, -8);
      const tk = G.thongKe, tim = (vi) => G.phuong.find((d) => d.ten === vi);
      vat.nhanDiem = [
        { d: tim(tk.caoNhat.ten.vi), buoc: [1] },
        ...P.gia.trungTamPhu.filter((x) => x.tySo > 1.5).map((x) => ({ d: G.phuong.find((d) => /^Phường /.test(d.ten) && d.ten.slice(7) === x.vi), buoc: [0] })),
        { d: tim(tk.cao[0].ten.vi), buoc: [2] }, { d: tim(tk.cao[1].ten.vi), buoc: [2] },
        { d: tim(tk.thap[0].ten.vi), buoc: [2] }, { d: tim(tk.thap[1].ten.vi), buoc: [2] },
      ].filter((x) => x.d).map((x) => { const a = h.nhan(x.d.tam[0], x.d.tam[1], 0, ten(x.d), 'moc', 0, -9); a.tranh = true; return { ...x, a }; });
      vat.ong = [];
      capNhat();
    }

    /* metres per CSS pixel at the current zoom, for marks that keep a constant size on screen */
    const mpp = () => 40075016.686 * Math.cos(tam[1] * RAD) / (512 * Math.pow(2, map.getZoom()));

    /* columns: size follows the zoom, height follows the scale */
    function datCot() {
      const P3 = lop.P, m4 = new T.Matrix4(), q = new T.Quaternion(), s = new T.Vector3(), px = mpp();
      const rDau = lop.met(3.1 * px), rCot = lop.met(0.6 * px), rDia = lop.met(1000), dayDia = lop.met(Math.max(60, 1.2 * px));
      G.phuong.forEach((d, i) => {
        const goc = P3(d.tam[0], d.tam[1], 0), dinh = P3(d.tam[0], d.tam[1], cao(d.o));
        m4.compose(goc, q, s.set(rCot, rCot, Math.max(1e-12, dinh.z - goc.z))); vat.cot.setMatrixAt(i, m4);
        m4.compose(dinh, q, s.set(rDau, rDau, rDau)); vat.dau.setMatrixAt(i, m4);
        m4.compose(P3(d.tam[0], d.tam[1], cao(d.nn)), q, s.set(rDia, rDia, dayDia)); vat.dia.setMatrixAt(i, m4);
      });
      [vat.cot, vat.dau, vat.dia].forEach((m) => { m.instanceMatrix.needsUpdate = true; });
    }

    function capNhat() {
      if (!lop) return;
      const P3 = lop.P;
      datCot();
      const gocJ = (j) => CAT_A + (CAT_B - CAT_A) * j / NA;
      [vat.mat, vat.matNgoai, vat.dai].forEach((me) => {
        const a = me.geometry.attributes.position;
        me.userData.radii.forEach((r, i) => { const z = cao(giaMoHinh(r)); for (let j = 0; j <= NA; j++) { const [x, y] = diem(r, gocJ(j)); const v = P3(x, y, z); a.setXYZ(i * (NA + 1) + j, v.x, v.y, v.z); } });
        a.needsUpdate = true;
      });
      [...vat.cat, ...vat.catNgoai].forEach((me) => {
        const a = me.geometry.attributes.position;
        me.userData.radii.forEach((r, i) => { const [x, y] = diem(r, me.userData.goc); const v0 = P3(x, y, 0), v1 = P3(x, y, cao(giaMoHinh(r))); a.setXYZ(2 * i, v0.x, v0.y, v0.z); a.setXYZ(2 * i + 1, v1.x, v1.y, v1.z); });
        a.needsUpdate = true;
      });
      { const a = vat.tuong.geometry.attributes.position, z = cao(giaMoHinh(R_KHOP));
        for (let j = 0; j <= NA; j++) { const [x, y] = diem(R_KHOP, gocJ(j)); const v0 = P3(x, y, 0), v1 = P3(x, y, z); a.setXYZ(2 * j, v0.x, v0.y, v0.z); a.setXYZ(2 * j + 1, v1.x, v1.y, v1.z); }
        a.needsUpdate = true; }
      vat.duongGia.forEach(({ r, l }) => { const a = l.geometry.attributes.position, z = cao(giaMoHinh(r));
        for (let j = 0; j <= NA; j++) { const [x, y] = diem(r, gocJ(j)); const v = P3(x, y, z); a.setXYZ(j, v.x, v.y, v.z); } a.needsUpdate = true; });

      /* tubes on the cut faces: the profile of the surface; in step 4 also the farmland levels */
      vat.ong.forEach((m) => { lop.scene.remove(m); m.geometry.dispose(); });
      vat.ong = [];
      const rMax = buoc === 3 ? R_NGOAI : R_KHOP, rOng = Math.max(150, 1.1 * mpp());
      for (const g of [CAT_A, CAT_B]) {
        const pts = vungR(0, rMax, 0.5).map((r) => { const [x, y] = diem(r, g); return [x, y, cao(giaMoHinh(r))]; });
        if (buoc >= 1 && buoc !== 2) vat.ong.push(lop.ong(pts, rOng, PROFILE));
        if (buoc === 3) for (const kv of ['I', 'IV']) { const z = cao(G.bang1[kv][0]); vat.ong.push(lop.ong([0, rMax].map((r) => { const [x, y] = diem(r, g); return [x, y, z]; }), rOng * 0.8, LEVEL)); }
      }

      const tren = (r, g) => { const [x, y] = diem(r, g); return P3(x, y, cao(giaMoHinh(r))); };
      vat.nhanGia.forEach((x) => { x.a.p = tren(x.r, CAT_B); });
      vat.nhanMat.p = tren(R_KHOP, CAT_B);
      vat.nhanNN.forEach((x) => { const [xx, yy] = diem(R_NGOAI, CAT_B); x.a.p = P3(xx, yy, cao(G.bang1[x.kv][0])); });
      vat.nhanDai.p = tren((G.gap.I + G.gap.IV) / 2, GOC_CAT + Math.PI);
      vat.nhanDiem.forEach((x) => { x.a.p = P3(x.d.tam[0], x.d.tam[1], cao(x.d.o)); });
      lop.veLai();
    }

    /* ---------- steps ---------- */
    const mauDau = (d, b) => ((b === 1 || b === 2) ? (d.trong40 ? (d.du > 0 ? TREN : DUOI) : XA) : O);
    function datBuoc(b, bay) {
      buoc = b;
      if (!sanSang) return;
      if (b === 2) {
        map.setPaintProperty('phuong-fill', 'fill-color', ['case', ['<', ['get', 'lop'], 0], '#DADFE4', ['match', ['get', 'lop'], 0, RATIO[0], 1, RATIO[1], 2, RATIO[2], 3, RATIO[3], RATIO[4]]]);
        map.setPaintProperty('phuong-fill', 'fill-opacity', 0.9);
      } else {
        map.setPaintProperty('phuong-fill', 'fill-color', K.stepColor('tv', P.gia.moc, PRICE));
        map.setPaintProperty('phuong-fill', 'fill-opacity', b === 0 ? 0.65 : 0.45);
      }
      G.phuong.forEach((d, i) => { vat.dau.setColorAt(i, new T.Color(mauDau(d, b))); });
      vat.dau.instanceColor.needsUpdate = true;
      vat.mat.visible = b >= 1; vat.mat.material.opacity = b === 2 ? 0.06 : 0.16;
      vat.tuong.visible = b === 1;
      vat.cat.forEach((m) => { m.visible = b === 1 || b === 3; });
      vat.catNgoai.forEach((m) => { m.visible = b === 3; });
      vat.matNgoai.visible = vat.dai.visible = vat.dia.visible = b === 3;
      vat.duongGia.forEach((x) => { x.l.visible = b === 1; });
      vat.nhanGia.forEach((x) => { x.a.an = b !== 1; });
      vat.nhanMat.an = b !== 1;
      vat.nhanNN.forEach((x) => { x.a.an = b !== 3; });
      vat.nhanDai.an = b !== 3 || vat.hep;
      vat.nhanDiem.forEach((x) => { x.a.an = !x.buoc.includes(b); });
      veChuGiai(b);
      capNhat();
      if (bay) map.easeTo({ ...camera(b), duration: 1300 });
    }

    /* camera for each step, zoom adjusted to the width of the stage */
    const CAM = [
      { center: [106.80, 10.92], zoom: 8.6, pitch: 64, bearing: BEARING },
      { center: [106.72, 10.98], zoom: 8.8, pitch: 70, bearing: BEARING },
      { center: [106.68, 10.88], zoom: 8.8, pitch: 32, bearing: -10 },
      { center: [106.72, 10.98], zoom: 8.55, pitch: 70, bearing: BEARING },
    ];
    /* on a tall, narrow stage (a phone) the scene can be larger and sit lower; on the ordinary scale the tallest column is about twice as high */
    const LUI = 0.7;
    const camera = (b) => {
      const w = stage.clientWidth, doc = stage.clientHeight / Math.max(1, w) > 1.2;
      const c = CAM[b], z = c.zoom - (b === 2 ? 0 : LUI * u) + Math.max(-1.6, Math.min(0.3, Math.log2(Math.max(320, w) / 950))) + (doc ? 0.3 : 0);
      return { ...c, zoom: z, center: doc && b !== 2 ? [c.center[0], c.center[1] + 0.28] : c.center };
    };
    let henZoom = null;
    map.on('zoom', () => { if (!lop) return; datCot(); lop.veLai(); if (!henZoom) henZoom = setTimeout(() => { henZoom = null; capNhat(); }, 200); });

    /* legend */
    const hang = (sym, chu) => '<div class="row">' + sym + '<span>' + chu + '</span></div>';
    const cham = (c, r) => '<svg width="22" height="12"><circle cx="11" cy="6" r="' + (r || 5) + '" fill="' + c + '"/></svg>';
    const o = (c, op) => '<svg width="22" height="12"><rect width="22" height="12" fill="' + c + '" fill-opacity="' + (op || 1) + '"/></svg>';
    const net = (c, w) => '<svg width="22" height="12"><line x1="0" x2="22" y1="6" y2="6" stroke="' + c + '" stroke-width="' + (w || 2.5) + '"/></svg>';
    const chuGiai = fig.querySelector('.s3d-legend');
    function veChuGiai(b) {
      if (!chuGiai) return;
      let s = '<div class="nhom">';
      if (b === 0 || b === 3) s += hang(cham(O), t('residential land, ward median', 'đất ở, trung vị của phường, xã'));
      if (b === 1 || b === 2) s += hang(cham(TREN), t('above the fitted surface', 'cao hơn bề mặt khớp')) + hang(cham(DUOI), t('below the fitted surface', 'thấp hơn bề mặt khớp')) + hang(cham(XA), t('beyond 40 km, not used in the fit', 'ngoài 40 km, không dùng để khớp'));
      if (b >= 1) s += hang(o(MAT, 0.3), t('fitted surface, equation (2.1), within 40 km', 'bề mặt khớp theo phương trình (2.1), trong 40 km'));
      if (b === 1 || b === 3) s += hang(net(PROFILE), t('its profile on the cut faces', 'mặt cắt dọc của bề mặt'));
      if (b === 3) s += hang('<svg width="22" height="12"><ellipse cx="11" cy="6" rx="8" ry="3.5" fill="' + NN + '"/></svg>', t('farmland, annual crops, position 1', 'đất trồng cây hàng năm, vị trí 1')) +
        hang(net(LEVEL, 2), t('farmland price, zones I and IV', 'giá đất nông nghiệp, khu vực I và IV')) + hang(o(NN, 0.4), t('extended surface at farmland prices', 'bề mặt kéo dài ở mức giá đất nông nghiệp'));
      s += '</div><div class="nhom-mau">';
      if (b === 2) {
        s += '<div class="t">' + t('Ground: price ÷ price on the surface', 'Mặt đất: giá ÷ giá trên bề mặt khớp') + '</div><div class="bins3">' + RATIO.map((c) => '<i style="background:' + c + '"></i>').join('') + '</div><div class="ticks3">' +
          G.mocDu.map((m, i) => '<span style="left:' + ((i + 1) * 20) + '%">' + K.fmt(m, m % 1 ? (Math.round(m * 100) % 10 ? '2' : '1') : '0') + '</span>').join('') + '</div>';
      } else {
        s += '<div class="t">' + t('Ground: residential land price, thousand VND/m²', 'Mặt đất: giá đất ở, nghìn đồng/m²') + '</div><div class="bins3">' + PRICE.map((c) => '<i style="background:' + c + '"></i>').join('') + '</div><div class="ticks3">' +
          P.gia.moc.map((m, i) => '<span style="left:' + ((i + 1) * 20) + '%">' + K.fmt(m, '0') + '</span>').join('') + '</div>';
      }
      s += '</div><div class="ghi">' + (u < 0.5 ? t('Height: logarithmic scale, as Figure 2.1; a tenfold rise in price adds the same height.', 'Chiều cao: thang loga như Hình 2.1; giá gấp mười thì cao thêm một đoạn như nhau.')
        : t('Height: ordinary scale, equal to the logarithmic scale at the centre of the surface.', 'Chiều cao: thang thường, bằng thang loga ở tâm bề mặt.')) + '</div>';
      chuGiai.innerHTML = s;
    }

    /* scale switch: morph between the two height scales */
    const nutThang = [...fig.querySelectorAll('[data-scale]')];
    let hen = null;
    nutThang.forEach((btn) => btn.addEventListener('click', () => {
      const dich = btn.dataset.scale === 'lin' ? 1 : 0;
      nutThang.forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
      if (hen) clearTimeout(hen);
      const u0 = u, t0 = performance.now(), D = 900;
      if (buoc !== 2) { const c = camera(buoc); map.easeTo({ center: c.center, zoom: c.zoom - LUI * (dich - u), duration: D }); }
      const tick = () => {
        const x = Math.min(1, (performance.now() - t0) / D), e = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
        u = u0 + (dich - u0) * e; capNhat();
        if (x < 1) hen = setTimeout(tick, 16); else { hen = null; veChuGiai(buoc); }
      };
      tick();
    }));
    if (nutThang[0]) nutThang[0].setAttribute('aria-pressed', 'true');

    /* hover: nearest column top on screen */
    const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; stage.appendChild(tip);
    map.on('mousemove', (e) => {
      if (!lop) return;
      let best = null, bd = 196;
      for (const d of G.phuong) {
        const sc = lop.chieu(lop.P(d.tam[0], d.tam[1], cao(d.o))); if (!sc) continue;
        const dd = (sc[0] - e.point.x) ** 2 + (sc[1] - e.point.y) ** 2;
        if (dd < bd) { bd = dd; best = d; }
      }
      if (!best) { tip.style.display = 'none'; return; }
      const d = best, mh = giaMoHinh(d.kc), tl = d.o / mh;
      tip.innerHTML = '<div class="k">' + ten(d) + ' · ' + K.fmt(d.kc, '1') + ' km</div><div class="v">' + K.fmt(d.o, '0') + '</div><div class="k">' + t('residential land, thousand VND/m²', 'đất ở, nghìn đồng/m²') + '</div>' +
        (d.trong40 ? '<div class="k">' + t('on the fitted surface: ', 'trên bề mặt khớp: ') + K.fmt(mh, '0') + ' · ' + K.fmt(tl, tl < 1 ? 'x2' : 'x1') + '</div>' : '<div class="k">' + t('beyond 40 km: not compared', 'ngoài 40 km: không so') + '</div>') +
        '<div class="k">' + t('farmland, zone ', 'đất nông nghiệp, khu vực ') + d.kv + ': ' + K.fmt(d.nn, '0') + '</div>';
      tip.style.display = 'block';
      tip.style.left = Math.min(stage.clientWidth - tip.offsetWidth - 6, e.point.x + 14) + 'px';
      tip.style.top = Math.max(4, e.point.y - 70) + 'px';
    });
    map.getCanvas().addEventListener('mouseleave', () => { tip.style.display = 'none'; });

    K.buoc(fig, (i) => datBuoc(i, sanSang));
    map.once('load', () => map.jumpTo(camera(buoc)));
  };
})();
