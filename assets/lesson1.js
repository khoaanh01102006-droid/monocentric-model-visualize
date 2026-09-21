/* Lesson 1 · figures. Model: js/mo_hinh.js (checked by kich_ban/l1_mo_hinh.mjs). */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const COL = { p: '#106CA1', q: '#B65F0C', h: '#664AB6', D: '#208383', r: '#BB3B64' };

  K.khoiDong(() => {
    fig11();
    fig12();
    K.veVeDuLieu();
  });

  /* ── Figure 1.1: five gradients, one highlighted per step ── */
  function fig11() {
    const g = K.moHinh.giai(), d = g.duong, c = d[0];
    const idx = (k) => d.map((o) => [o.x, 100 * o[k] / c[k]]);
    const S = [
      { id: 'p', label: t('Housing price p', 'Giá sàn nhà ở p') },
      { id: 'q', label: t('Dwelling size q', 'Diện tích ở của hộ q') },
      { id: 'h', label: t('Floor space per\nunit of land h', 'Diện tích sàn trên\nmột đơn vị đất h') },
      { id: 'D', label: t('Population density D', 'Mật độ dân D') },
      { id: 'r', label: t('Land rent r', 'Giá thuê đất r') },
    ].map((s) => ({ ...s, kind: 'model', type: 'line', color: COL[s.id], points: idx(s.id), hover: true }));
    const yMax = Math.ceil(Math.max(...S.flatMap((s) => s.points.map((p) => p[1]))) / 20) * 20;
    const ch = K.chart(document.getElementById('chart-1-1'), {
      sources: ['l1_mo_hinh'], series: S, rightMargin: 170,
      x: { min: 0, max: Math.ceil(g.ranh), label: t('Distance from the CBD (km)', 'Khoảng cách tới trung tâm (km)') },
      y: { min: 0, max: yMax, label: t('Index, value at the centre = 100', 'Chỉ số, giá trị ở trung tâm = 100') },
      alt: t('Model gradients of housing price, dwelling size, floor space per unit of land, density and land rent', 'Các đường dốc của mô hình'),
      tip: (s, p) => '<div class="k">' + s.label.replace('\n', ' ') + '</div><div class="v">' + K.fmt(p[1], '0') + '</div><div class="k">' + K.fmt(p[0], '1') + ' km</div>',
    });
    K.buoc(document.getElementById('fig-1-1'), (i) => ch.focus([S[i].id]));
  }

  /* ── Figure 1.2: comparative statics — land rent as a surface (assets/mat_gia_thue.js) and as a profile ── */
  function fig12() {
    const P = [
      { k: 'N', name: t('Population N', 'Dân số N') },
      { k: 'y', name: t('Income y', 'Thu nhập y') },
      { k: 't', name: t('Commuting cost t', 'Chi phí đi lại t') },
      { k: 'rA', name: t('Agricultural rent r_A', 'Giá thuê đất nông nghiệp r_A') },
    ];
    const base = K.moHinh.MAC_DINH, g0 = K.moHinh.giai();
    const r00 = g0.ham.r(0);
    const mult = { N: 1, y: 1, t: 1, rA: 1 };
    const pc = (v) => K.fmt(v, '+%0');
    const idx = (v) => 100 * v / r00;

    /* fixed axes and a fixed 3D scale: widest edge and highest central rent over single-parameter extremes */
    let xMax = g0.ranh, yMax = 100;
    for (const p of P) for (const m of [0.5, 1.5]) {
      const g = K.moHinh.giai({ [p.k]: base[p.k] * m });
      xMax = Math.max(xMax, g.ranh); yMax = Math.max(yMax, idx(g.ham.r(0)));
    }
    xMax = Math.ceil(xMax / 5) * 5; yMax = Math.ceil(yMax / 25) * 25;

    const box = document.getElementById('controls-1-2');
    box.innerHTML = P.map((p) => '<div class="control"><label for="s-' + p.k + '"><span>' + p.name.replace('r_A', 'r<sub>A</sub>') + '</span>' +
      '<output id="o-' + p.k + '">' + pc(0) + '</output></label><input id="s-' + p.k + '" type="range" min="0.5" max="1.5" step="0.05" value="1"></div>').join('') +
      '<div class="control" style="align-self:end"><button class="btn" type="button" id="reset-1-2">' + t('Reset', 'Đặt lại') + '</button></div>';

    const M = K.matGiaThue.MAU;
    const profile = (g) => { const pts = []; for (let i = 0; i <= 80; i++) { const x = g.ranh * i / 80; pts.push([x, idx(g.ham.r(x))]); } return pts; };
    const series = (g) => [
      { id: 'base', kind: 'baseline', type: 'line', points: profile(g0), labelAt: 'none' },
      { id: 'rA', kind: 'reference', type: 'line', color: M.LEVEL, points: [[0, idx(g.thamSo.rA)], [xMax, idx(g.thamSo.rA)]], label: t('agricultural\nrent', 'giá thuê đất\nnông nghiệp') },
      { id: 'now', kind: 'model', type: 'line', color: M.PROFILE, points: profile(g), label: t('land rent r(x)', 'giá thuê đất r(x)'), labelAt: g.ranh * 0.22, hover: true },
    ];
    const marks = (g) => [{ type: 'vline', x: g.ranh, color: '#111111', text: t('edge x̄', 'ranh x̄') }];
    const host = document.getElementById('chart-1-2');
    const ch = K.chart(host, {
      sources: ['l1_mo_hinh'], series: series(g0), rightMargin: 118, height: 380, marks: marks(g0),
      x: { min: 0, max: xMax, label: t('Distance from the centre (km)', 'Khoảng cách tới trung tâm (km)') },
      y: { min: 0, max: yMax, label: t('Land rent, index: centre before the change = 100', 'Giá thuê đất, chỉ số: trung tâm trước khi đổi = 100') },
      tip: (s, p) => '<div class="k">' + K.fmt(p[0], '1') + ' km</div><div class="v">' + K.fmt(p[1], '0') + '</div>',
    });

    const surf = K.matGiaThue(document.getElementById('surface-1-2'), { R: xMax, H: xMax * 0.55, r0: r00 });
    K.matGiaThueChuGiai(document.getElementById('surface-key-1-2'));

    const readout = document.getElementById('readout-1-2');
    let hen = null;
    function update() {
      const th = {}; P.forEach((p) => { th[p.k] = base[p.k] * mult[p.k]; });
      const g = K.moHinh.giai(th);
      ch.update(series(g), { marks: marks(g) });
      surf.update(g);
      readout.innerHTML = t('Edge of the city', 'Ranh thành phố') + ' <b>' + K.fmt(g.ranh, '1') + ' km</b> (' + t('before', 'trước') + ' ' + K.fmt(g0.ranh, '1') + ' km) · ' +
        t('land rent at the centre', 'giá thuê đất ở trung tâm') + ' <b>' + K.fmt(g.ham.r(0) / r00 - 1, '+%1') + '</b> · ' +
        t('housing price at the centre', 'giá sàn ở trung tâm') + ' <b>' + K.fmt(g.duong[0].p / g0.duong[0].p - 1, '+%1') + '</b>';
    }
    P.forEach((p) => {
      const s = document.getElementById('s-' + p.k), o = document.getElementById('o-' + p.k);
      s.addEventListener('input', () => { mult[p.k] = +s.value; o.textContent = pc(mult[p.k] - 1); clearTimeout(hen); hen = setTimeout(update, 40); });
    });
    document.getElementById('reset-1-2').addEventListener('click', () => {
      P.forEach((p) => { mult[p.k] = 1; document.getElementById('s-' + p.k).value = 1; document.getElementById('o-' + p.k).textContent = pc(0); });
      update();
    });
    update();
  }
})();
