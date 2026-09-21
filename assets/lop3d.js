/* Urban Economics (V2) · 3D graphics standing on a real map (QĐ 163).

   A MapLibre custom layer that draws a three.js scene in the map's own camera, so a chart can be
   raised over the ground it describes: points, lines and panels are placed by longitude, latitude
   and height in metres, and stay attached to the map when the reader pans, tilts or turns it.

   Coordinates: every vertex is stored relative to an origin (Ben Thanh) in Web Mercator units;
   the origin is added back in the projection matrix. Absolute Mercator values (≈ 0.6–0.8) lose
   precision in 32-bit floats at the scale of a few metres, relative values do not.

   Labels are HTML, positioned by projecting their 3D anchor with the same matrix on every frame.
   three.js r149 (MIT), vendor/three.min.js; MapLibre 5.24 custom layer interface.            */
(function () {
  'use strict';
  const K = window.KTDT;

  K.lop3d = function (map, o) {
    const T = window.THREE;
    if (!T) throw new Error('three.js not loaded');
    const origin = maplibregl.MercatorCoordinate.fromLngLat(o.origin, 0);
    const donViMet = origin.meterInMercatorCoordinateUnits();
    const host = map.getContainer();
    const nhan = document.createElement('div'); nhan.className = 'l3d-labels'; host.appendChild(nhan);

    const scene = new T.Scene();
    const camera = new T.Camera();
    const M = new T.Matrix4(), Mo = new T.Matrix4().makeTranslation(origin.x, origin.y, origin.z);
    let renderer = null, anchors = [], matran = null;

    /* local position of (lon, lat, height in metres) */
    const P = (lon, lat, h) => { const c = maplibregl.MercatorCoordinate.fromLngLat([lon, lat], h || 0); return new T.Vector3(c.x - origin.x, c.y - origin.y, c.z - origin.z); };
    const met = (m) => m * donViMet;

    function chieu(v) {                               // local vector → CSS pixels, or null when behind the camera
      if (!matran) return null;
      const p = new T.Vector4(v.x, v.y, v.z, 1).applyMatrix4(matran);
      if (p.w <= 0) return null;
      const w = host.clientWidth, h = host.clientHeight;
      return [(p.x / p.w + 1) / 2 * w, (1 - p.y / p.w) / 2 * h];
    }
    /* labels marked `tranh` (centred above their anchor) are moved up, one line at a time, until they
       no longer cover an earlier one; the width is estimated from the length of the text */
    function veNhan() {
      const daDat = [];
      nhan.innerHTML = anchors.map((a) => {
        if (a.an) return '';
        const s = chieu(a.p); if (!s) return '';
        const x = s[0] + (a.dx || 0);
        let y = s[1] + (a.dy || 0);
        if (a.tranh) {
          const w = String(a.html).replace(/<[^>]+>/g, '').length * 7 + 8, hh = 16;
          for (let lan = 0; lan < 6; lan++) {
            const de = daDat.find((b) => Math.abs(b.x - x) < (b.w + w) / 2 && Math.abs(b.y - y) < hh);
            if (!de) break;
            y = de.y - hh - 1;
          }
          daDat.push({ x, y, w });
        }
        return '<span class="' + (a.cls || '') + '" style="left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px">' + a.html + '</span>';
      }).join('');
    }

    const layer = {
      id: o.id, type: 'custom', renderingMode: '3d',
      onAdd(m, gl) {
        renderer = new T.WebGLRenderer({ canvas: m.getCanvas(), context: gl, antialias: true });
        renderer.autoClear = false;
      },
      render(gl, args) {
        M.fromArray(args.defaultProjectionData.mainMatrix);
        matran = M.clone().multiply(Mo);
        camera.projectionMatrix = matran;
        renderer.resetState();
        renderer.render(scene, camera);
        veNhan();
        if (o.sauKhiVe) o.sauKhiVe();
      },
    };

    /* building blocks, sized in metres */
    const vatLieu = {};
    const mau = (c, op) => { const k = c + '|' + (op ?? 1); if (!vatLieu[k]) vatLieu[k] = new T.MeshBasicMaterial({ color: c, transparent: op != null && op < 1, opacity: op ?? 1, depthWrite: !(op != null && op < 1), side: T.DoubleSide }); return vatLieu[k]; };
    const helpers = {
      T, P, met, scene,
      /* a sphere of radius r metres at (lon, lat, h) */
      cau(lon, lat, h, r, color, op) { const g = new T.SphereGeometry(met(r), 14, 10); const m = new T.Mesh(g, mau(color, op)); m.position.copy(P(lon, lat, h)); scene.add(m); return m; },
      /* a tube through points [[lon, lat, h], …], radius in metres */
      ong(pts, r, color, op) {
        const v = pts.map(([x, y, h]) => P(x, y, h));
        if (v.length < 2) return null;
        const c = new T.CatmullRomCurve3(v, false, 'catmullrom', 0);
        const m = new T.Mesh(new T.TubeGeometry(c, Math.max(4, v.length * 2), met(r), 6, false), mau(color, op)); scene.add(m); return m;
      },
      /* a thin straight segment as a tube */
      doan(a, b, r, color, op) { return helpers.ong([a, b], r, color, op); },
      /* a vertical ribbon along a ground polyline [[lon, lat], …] from height h0 to h1 (metres, may be a function of index) */
      tuong(line, h0, h1, color, op) {
        const pos = [], idx = [];
        line.forEach(([x, y], i) => { const a = P(x, y, typeof h0 === 'function' ? h0(i) : h0), b = P(x, y, typeof h1 === 'function' ? h1(i) : h1); pos.push(a.x, a.y, a.z, b.x, b.y, b.z); });
        for (let i = 0; i + 1 < line.length; i++) { const k = 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
        const m = new T.Mesh(g, mau(color, op)); scene.add(m); return m;
      },
      nhan(lon, lat, h, html, cls, dx, dy) { const a = { p: P(lon, lat, h), html, cls, dx, dy }; anchors.push(a); return a; },
      xoaNhan() { anchors = []; },
      xoaHet() { while (scene.children.length) { const c = scene.children.pop(); if (c.geometry) c.geometry.dispose(); } anchors = []; },
      chieu, veLai() { map.triggerRepaint(); },
    };

    map.addLayer(layer, o.beforeId);
    if (o.build) o.build(helpers);
    map.triggerRepaint();
    return helpers;
  };
})();
