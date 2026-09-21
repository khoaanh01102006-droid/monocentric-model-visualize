/* Lesson 1 · Figure 1.2 — land rent of the model city drawn as a surface (QĐ 161: the model is drawn
   on an abstract plane, not on a map of Ho Chi Minh City).

   Height is land rent r(x), on one fixed scale for every slider setting. Beyond the edge the land
   stays in agriculture and earns r_A, so the surface flattens into a green level: the city ends
   where the two meet, equation (1.5). A quarter of the surface is cut away, so the profile of the
   chart beside it appears on the cut faces, together with the level r_A and the profile before
   the change. This is the textbook cross-section and the plan view of the same city at once.

   three.js r149 (MIT), vendor/three.min.js. Drawn on demand — after a slider change or a drag —
   not in a continuous loop. Without WebGL the chart alone still carries the figure.          */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const RAMP = ['#FDF7DB', '#ECB63A', '#BE792B', '#8D4117', '#5C0000'];   // WB monochrome yellow, as the maps
  const BREAKS = [25, 50, 75, 100];                                         // rent index, baseline centre = 100
  const FARM = '#A8C99C', FARM_WALL = '#7EA774', CUT = '#ECE6D8';
  const PROFILE = '#5C0000', BEFORE = '#8A969F', LEVEL = '#3E7D4F';
  const CUT_FROM = Math.PI / 4, CUT_TO = 2 * Math.PI - Math.PI / 4;        // the removed quarter faces +x

  K.matGiaThue = function (host, o) {
    const fail = (why) => { host.classList.add('no-3d'); host.innerHTML = '<p>' + t('The 3D view needs WebGL, which this browser does not provide (' + why + '). The chart shows the same profile.', 'Hình 3D cần WebGL mà trình duyệt này không có (' + why + '). Biểu đồ vẫn cho thấy cùng mặt cắt.') + '</p>'; return { update() {} }; };
    if (!window.THREE) return fail('three.js not loaded');
    const T = window.THREE;
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch (e) { return fail(e.message); }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);
    const labels = document.createElement('div'); labels.className = 's-labels'; host.appendChild(labels);

    const R = o.R;                                   // outer radius of the block, km
    const H = o.H / o.r0;                            // scene units of height per unit of rent (baseline centre → o.H)
    const hex = (c) => new T.Color(c);
    const classOf = (v) => { let i = 0; while (i < BREAKS.length && v >= BREAKS[i]) i++; return i; };
    const classColor = (idx) => hex(RAMP[classOf(idx)]);

    const scene = new T.Scene();
    scene.add(new T.HemisphereLight(0xffffff, 0xbdb6a6, 0.62));
    const sun = new T.DirectionalLight(0xffffff, 0.5); sun.position.set(-30, 70, 45); scene.add(sun);
    const camera = new T.PerspectiveCamera(26, 1, 1, 2000);
    const view = { az: 0.6, el: 0.5, dist: 4.0 * R, target: new T.Vector3(0, o.H * 0.16, 0) };

    const group = new T.Group(); scene.add(group);
    const mat = new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide });
    const flat = new T.MeshBasicMaterial({ vertexColors: true, side: T.DoubleSide });     // cut faces: paper, unlit
    const P = (r, a, y) => new T.Vector3(r * Math.cos(a), y, -r * Math.sin(a));

    /* tube along a list of points */
    const tube = (pts, radius, color) => {
      const curve = new T.CatmullRomCurve3(pts, false, 'catmullrom', 0.05);
      return new T.Mesh(new T.TubeGeometry(curve, Math.max(8, pts.length * 2), radius, 6, false), new T.MeshBasicMaterial({ color }));
    };

    function build(g, g0) {
      while (group.children.length) { const c = group.children[group.children.length - 1]; group.remove(c); c.geometry.dispose(); if (c.material !== mat && c.material !== flat) c.material.dispose(); }
      const f = g.ham, rA = g.thamSo.rA, edge = Math.min(g.ranh, R);
      const height = (x) => H * (x < g.ranh ? f.r(x) : rA);
      /* radii: uniform, plus the exact edge so the colour boundary is sharp */
      const radii = [];
      for (let i = 0; i <= 150; i++) radii.push(R * i / 150);
      radii.push(edge - 1e-3, edge + 1e-3); radii.sort((a, b) => a - b);
      const NA = 180;

      /* surface */
      const pos = [], col = [], idx = [];
      radii.forEach((r) => {
        const inside = r < g.ranh, c = inside ? classColor(100 * f.r(r) / o.r0) : hex(FARM), y = height(r);
        for (let j = 0; j <= NA; j++) { const a = CUT_FROM + (CUT_TO - CUT_FROM) * j / NA; const p = P(r, a, y); pos.push(p.x, p.y, p.z); col.push(c.r, c.g, c.b); }
      });
      for (let i = 0; i + 1 < radii.length; i++) for (let j = 0; j < NA; j++) {
        const a = i * (NA + 1) + j, b = a + NA + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const surf = new T.BufferGeometry();
      surf.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      surf.setAttribute('color', new T.Float32BufferAttribute(col, 3));
      surf.setIndex(idx); surf.computeVertexNormals();
      group.add(new T.Mesh(surf, mat));

      /* the two cut faces and the outer wall */
      const face = (a) => {
        const p2 = [], c2 = [], i2 = [], cc = hex(CUT);
        radii.forEach((r) => { const top = P(r, a, height(r)), bot = P(r, a, 0); p2.push(bot.x, bot.y, bot.z, top.x, top.y, top.z); c2.push(cc.r, cc.g, cc.b, cc.r, cc.g, cc.b); });
        for (let i = 0; i + 1 < radii.length; i++) { const k = 2 * i; i2.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
        const gq = new T.BufferGeometry(); gq.setAttribute('position', new T.Float32BufferAttribute(p2, 3)); gq.setAttribute('color', new T.Float32BufferAttribute(c2, 3)); gq.setIndex(i2); gq.computeVertexNormals();
        group.add(new T.Mesh(gq, flat));
      };
      face(CUT_FROM); face(CUT_TO);
      const wall = new T.CylinderGeometry(R, R, H * rA, 180, 1, true, CUT_FROM + Math.PI / 2, CUT_TO - CUT_FROM);
      wall.translate(0, H * rA / 2, 0);
      group.add(new T.Mesh(wall, new T.MeshLambertMaterial({ color: FARM_WALL, side: T.DoubleSide })));

      /* lines on the cut faces: profile now, profile before, level r_A; ring at the edge */
      const lift = 0.06;
      const profile = (gg, a, n) => { const pts = []; for (let i = 0; i <= n; i++) { const x = Math.min(gg.ranh, R) * i / n; pts.push(P(x, a, H * gg.ham.r(x) + lift)); } return pts; };
      for (const a of [CUT_FROM, CUT_TO]) {
        /* just in front of the face, towards the removed quarter */
        const sg = a === CUT_FROM ? 1 : -1, n = new T.Vector3(sg * Math.sin(a), 0, sg * Math.cos(a)).multiplyScalar(R * 0.006);
        const shift = (pts) => pts.map((p) => p.clone().add(n));
        group.add(tube(shift(profile(g, a, 60)), R * 0.0045, PROFILE));
        if (g0 !== g) group.add(tube(shift(profile(g0, a, 60)), R * 0.003, BEFORE));
        group.add(tube(shift([P(0, a, H * rA + lift), P(R, a, H * rA + lift)]), R * 0.0028, LEVEL));
      }
      /* rings lie on the surface: the old edge may now be inside the city, above the level r_A */
      const ring = (x, color, rad) => { const y = height(x) + lift * 2, pts = []; for (let j = 0; j <= 90; j++) pts.push(P(x, CUT_FROM + (CUT_TO - CUT_FROM) * j / 90, y)); return tube(pts, rad, color); };
      if (g.ranh < R) group.add(ring(g.ranh, '#111111', R * 0.0045));
      if (g0 !== g && g0.ranh < R && Math.abs(g0.ranh - g.ranh) > 0.05) group.add(ring(g0.ranh, BEFORE, R * 0.0035));

      /* label anchors (scene coordinates) */
      anchors = [
        { cls: 'k', html: t('centre', 'trung tâm'), p: new T.Vector3(0, H * f.r(0) + 1.2, 0), dy: -6 },
        { cls: 'k', html: t('edge of the city', 'ranh thành phố') + ' <i>x̄</i>', p: P(edge, CUT_TO, H * rA), dx: 6, dy: -14 },
        { cls: 'g', html: t('agricultural rent', 'giá thuê đất nông nghiệp') + ' <i>r</i><sub>A</sub>', p: P(R, CUT_FROM, 0), dx: 8, dy: 22 },
      ];
      for (let km = 0; km <= R; km += 10) anchors.push({ cls: 'd', html: km + (km ? '' : ' km'), p: P(km, CUT_TO, 0), dx: 0, dy: 4 });
    }

    let anchors = [], cur = null, base = null;
    function size() {
      const w = host.clientWidth || 480, h = Math.round(Math.max(290, Math.min(420, w * 0.74)));
      renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px';
      camera.aspect = w / h; camera.updateProjectionMatrix();
      return [w, h];
    }
    function draw() {
      const [w, h] = size();
      const { az, el, dist, target } = view;
      camera.position.set(target.x + dist * Math.cos(el) * Math.cos(az), target.y + dist * Math.sin(el), target.z - dist * Math.cos(el) * Math.sin(az));
      camera.lookAt(target);
      renderer.render(scene, camera);
      labels.innerHTML = anchors.map((a) => {
        const v = a.p.clone().project(camera);
        if (v.z > 1) return '';
        const x = (v.x + 1) / 2 * w + (a.dx || 0), y = (1 - v.y) / 2 * h + (a.dy || 0);
        return '<span class="' + a.cls + '" style="left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px">' + a.html + '</span>';
      }).join('');
    }
    let queued = false;
    const request = () => { if (queued) return; queued = true; const go = () => { if (!queued) return; queued = false; draw(); }; requestAnimationFrame(go); setTimeout(go, 60); };

    /* drag to turn: horizontal = around the centre, vertical = height of the eye */
    let drag = null;
    renderer.domElement.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, az: view.az, el: view.el }; renderer.domElement.setPointerCapture(e.pointerId); });
    renderer.domElement.addEventListener('pointermove', (e) => {
      if (!drag) return;
      view.az = drag.az - (e.clientX - drag.x) * 0.008;
      view.el = Math.max(0.12, Math.min(1.25, drag.el + (e.clientY - drag.y) * 0.006));
      request();
    });
    const stop = () => { drag = null; };
    renderer.domElement.addEventListener('pointerup', stop); renderer.domElement.addEventListener('pointercancel', stop);
    renderer.domElement.style.touchAction = 'pan-y';
    if (window.ResizeObserver) new ResizeObserver(request).observe(host);

    return {
      update(g) { if (!base) base = g; cur = g; build(g, base); request(); },
      reset() { view.az = 0.6; view.el = 0.5; request(); },
    };
  };

  /* legend for the surface, drawn in HTML under the canvas */
  K.matGiaThueChuGiai = function (host) {
    const w = 36;
    host.innerHTML = '<div class="legend outside">' +
      '<div class="t">' + t('Land rent in the model, index: centre before the change = 100', 'Giá thuê đất trong mô hình, chỉ số: trung tâm trước khi đổi = 100') + '</div>' +
      '<div class="bins">' + RAMP.map((c) => '<i style="background:' + c + ';width:' + w + 'px"></i>').join('') + '</div>' +
      '<div class="ticks" style="width:' + (RAMP.length * w) + 'px">' + BREAKS.map((b, i) => '<span style="left:' + ((i + 1) * w) + 'px">' + K.fmt(b, '0') + '</span>').join('') + '</div>' +
      '<div class="sym"><svg width="26" height="10"><rect width="26" height="10" fill="' + FARM + '"/></svg>' + t('farmland, where rent equals agricultural rent', 'đất nông nghiệp, giá thuê bằng giá thuê đất nông nghiệp') + '</div>' +
      '<div class="sym"><svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" stroke="#111" stroke-width="2.5"/></svg>' + t('edge of the city', 'ranh thành phố') +
      '&nbsp;&nbsp;<svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" stroke="' + BEFORE + '" stroke-width="2"/></svg>' + t('before the change', 'trước khi đổi') + '</div>' +
      '</div>';
  };
  K.matGiaThue.MAU = { PROFILE, BEFORE, LEVEL };
})();
