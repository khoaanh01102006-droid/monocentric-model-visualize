/* Lesson 5 · figures. Data: du_lieu/l5_do_thi_hoa.js (kich_ban/l5_do_thi_hoa.py).

   Figure 5.1  share of the population that is urban, three definitions
   Map 5.1     the Degree of Urbanisation grid (GHS-SMOD), 2020 and 1990
   Table 5.1   the three classes by region, 2020
   Map 5.2     night-time lights, 1992–2024, drawn on a dark ground
   Figure 5.2  lit area and the share of light near the two largest cities */
(function () {
  'use strict';
  const K = window.KTDT, t = K.t;
  const MAU = { ct: '#0071BC', tp: '#C8102E', tt: '#A87000', hcm: '#0071BC', hn: '#D55E00' };
  /* level-2 classes of the Degree of Urbanisation, in the order of the palette written by the script */
  const TEN_LOP = {
    30: ['Urban centre (city)', 'Trung tâm đô thị (thành phố)'],
    23: ['Dense urban cluster', 'Cụm đô thị dày đặc'],
    22: ['Semi-dense urban cluster', 'Cụm đô thị bán dày đặc'],
    21: ['Suburban or peri-urban cells', 'Ô ven đô, ngoại vi'],
    13: ['Rural cluster', 'Cụm dân cư nông thôn'],
    12: ['Low-density rural cells', 'Ô nông thôn mật độ thấp'],
    11: ['Very low-density rural cells', 'Ô nông thôn mật độ rất thấp'],
  };
  const NHOM = [[30, ['City', 'Thành phố']], [23, ['Towns and semi-dense areas', 'Thị trấn và vùng bán dày đặc']], [13, ['Rural areas', 'Nông thôn']]];

  K.khoiDong(() => {
    const B = K.duLieu.l5_do_thi_hoa;
    if (!B) throw new Error('L1: Lesson 5 needs du_lieu/l5_do_thi_hoa.js');
    dataRows();
    fig51(B); map51(B); tab51(B); map52(B); fig52(B);
    K.veVeDuLieu();
  });

  function dataRows() {
    const rows = ['l5_do_thi_hoa'].filter((k) => K.duLieu[k]).flatMap((k) => K.duLieu[k].nguon);
    document.getElementById('data-rows').innerHTML = rows.map((n) => '<tr><td>' + (K.lang === 'vi' && n.tenVi ? n.tenVi : n.ten) +
      ' <a href="' + n.url + '">' + t('link', 'liên kết') + '</a></td><td>' + n.giayPhep + '</td><td class="r">' + n.truyCap + '</td></tr>').join('');
  }

  /* Figure 5.1 — three definitions, 1975–2024 */
  function fig51(B) {
    const host = document.getElementById('c-5-1');
    if (!host) return;
    const G = B.degurba, dt = G.nam.map((y, i) => [y, G.thanhPho[i] + G.thiTran[i]]);
    const ct = B.chinhThuc, dieuTra = ct.filter(([y]) => B.namDieuTra.includes(y));
    K.chart(host, {
      sources: ['l5_do_thi_hoa'], height: 380, rightMargin: 190, showKinds: false,
      alt: t('Share of the population of Vietnam that is urban under three definitions, 1975–2024', 'Tỷ lệ dân số Việt Nam là đô thị theo ba định nghĩa, 1975–2024'),
      x: { min: 1975, max: 2024, fmt: 'y', label: t('Year', 'Năm') },
      y: { min: 0, max: 1, fmt: '%0', label: t('Share of the population', 'Tỷ lệ dân số') },
      series: [
        { id: 'dt', kind: 'data', color: MAU.tt, label: t('Cities, towns and\nsemi-dense areas', 'Thành phố, thị trấn\nvà vùng bán dày đặc'), points: dt, hover: true },
        { id: 'tp', kind: 'data', color: MAU.tp, label: t('Cities only', 'Chỉ thành phố'), points: G.nam.map((y, i) => [y, G.thanhPho[i]]), hover: true },
        { id: 'ct', kind: 'data', color: MAU.ct, label: t('Official definition', 'Định nghĩa chính thức'), points: ct },
        { id: 'dtra', kind: 'data', type: 'points', r: 4.5, color: MAU.ct, labelAt: 'none', points: dieuTra },
      ],
      marks: [{ type: 'dot', x: 2015, y: B.thongKe.wb.dt2015, color: '#111' }],   /* explained in the source line under the figure */
      tip: (s, p) => '<div class="k">' + (s.id === 'dtra' ? t('Census year', 'Năm tổng điều tra') : s.label.replace('\n', ' ')) + '</div><div class="v">' + K.fmt(p[1], '%1') + '</div><div class="k">' + K.fmt(p[0], 'y') + '</div>',
    });
  }

  /* Map 5.1 — the grid of the Degree of Urbanisation */
  function map51(B) {
    const fig = document.getElementById('map-5-1');
    if (!fig) return;
    const S = B.smod, k = S.khung;
    const goc = [[k.tay, k.bac], [k.dong, k.bac], [k.dong, k.nam], [k.tay, k.nam]];
    const map = K.map('m-5-1', { center: [106, 16], zoom: 5, minZoom: 4 });
    const BUOC = [
      { nam: '2020', box: [[102.1, 8.4], [109.6, 23.45]] },
      { nam: '2020', box: [[105.2, 19.8], [107.2, 21.7]] },
      { nam: '2020', box: [[104.4, 8.5], [107.7, 11.7]] },
      { nam: '1990', box: [[102.1, 8.4], [109.6, 23.45]] },
    ];
    let cur = 0, san = false;
    const hien = (i) => {
      cur = i; if (!san) return;
      const b = BUOC[i];
      map.getSource('smod').updateImage({ url: S.anh[b.nam], coordinates: goc });
      map.fitBounds(b.box, { duration: 700, padding: 18 });
    };
    map.on('load', () => {
      map.addSource('smod', { type: 'image', url: S.anh['2020'], coordinates: goc });
      map.addLayer({ id: 'smod', type: 'raster', source: 'smod', paint: { 'raster-opacity': 0.92, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'water');
      K.mapTopLayers(map);
      map.addSource('vn', { type: 'geojson', data: B.ranhVN });
      map.addLayer({ id: 'vn', type: 'line', source: 'vn', paint: { 'line-color': '#333', 'line-width': 0.8 } });
      san = true; map.fitBounds(BUOC[cur].box, { duration: 0, padding: 18 }); hien(cur);
    });
    const byMa = Object.fromEntries(S.lop.map((l) => [l.ma, l.mau]));
    const lg = document.createElement('div'); lg.className = 'legend outside legend-cols';
    lg.innerHTML = NHOM.map(([dau, ten], g) => {
      const ma = g === 0 ? [30] : g === 1 ? [23, 22, 21] : [13, 12, 11];
      return '<div class="col"><div class="t">' + ten[K.lang === 'vi' ? 1 : 0] + '</div>' + ma.map((m) => '<div class="sym"><i style="background:' + byMa[m] + '"></i>' + TEN_LOP[m][K.lang === 'vi' ? 1 : 0] + '</div>').join('') + '</div>';
    }).join('');
    fig.querySelector('.fig-body').appendChild(lg);
    K.buoc(fig, hien);
  }

  /* Table 5.1 — the three classes by region, 2020 */
  function tab51(B) {
    const body = document.getElementById('tab-5-1-rows');
    if (!body) return;
    body.innerHTML = B.vung.map((v) => '<tr><td>' + v.ten[K.lang] + '</td><td class="r">' + K.fmt(v.dan, 'M1') + '</td><td class="r">' + K.fmt(v.thanhPho, '%0') +
      '</td><td class="r">' + K.fmt(v.thiTran, '%0') + '</td><td class="r">' + K.fmt(v.nongThon, '%0') + '</td></tr>').join('');
  }

  /* Map 5.2 — night-time lights on a dark ground */
  const DN_MIN = 7;                                  /* cells below DN 7 are not drawn (dim noise) */
  const RAMP = [[7, [70, 58, 20]], [20, [150, 110, 20]], [35, [230, 170, 40]], [53, [255, 225, 110]], [63, [255, 250, 225]]];
  function mauDN(v) {
    for (let i = 1; i < RAMP.length; i++) if (v <= RAMP[i][0]) {
      const [a, ca] = RAMP[i - 1], [b, cb] = RAMP[i], f = (v - a) / (b - a);
      return ca.map((c, j) => Math.round(c + f * (cb[j] - c)));
    }
    return RAMP[RAMP.length - 1][1];
  }
  const LUT = Array.from({ length: 64 }, (_, v) => (v < DN_MIN ? null : mauDN(v)));
  function toMau(url) {
    return new Promise((ok) => {
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
        const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, cv.width, cv.height), a = d.data;
        for (let i = 0; i < a.length; i += 4) { const c = LUT[a[i]]; if (!c) { a[i + 3] = 0; continue; } a[i] = c[0]; a[i + 1] = c[1]; a[i + 2] = c[2]; a[i + 3] = 255; }
        ctx.putImageData(d, 0, 0); ok(cv.toDataURL());
      };
      img.src = url;
    });
  }
  function map52(B) {
    const fig = document.getElementById('map-5-2');
    if (!fig) return;
    const N = B.ntl, k = N.khungAnh;
    const goc = [[k.tay, k.bac], [k.dong, k.bac], [k.dong, k.nam], [k.tay, k.nam]];
    const map = K.map('m-5-2', { center: [106, 16], zoom: 5, minZoom: 4 });
    const cache = {};
    let cur = N.namAnh.length - 1, san = false;
    const hien = async (i) => {
      cur = i; if (!san) return;
      const y = String(N.namAnh[i]);
      cache[y] = cache[y] || await toMau(N.anh[y]);
      if (cur === i) map.getSource('ntl').updateImage({ url: cache[y], coordinates: goc });
      const nhan = fig.querySelector('.year-now'); if (nhan) nhan.textContent = K.fmt(N.namAnh[i], 'y');
    };
    map.on('load', async () => {
      map.setPaintProperty('bg', 'background-color', '#0B1020');
      map.setPaintProperty('water', 'fill-color', '#131A2E');
      map.setLayoutProperty('roads', 'visibility', 'none');
      map.setPaintProperty('admin', 'line-color', '#3A4560');
      const y0 = String(N.namAnh[cur]);
      cache[y0] = await toMau(N.anh[y0]);
      map.addSource('ntl', { type: 'image', url: cache[y0], coordinates: goc });
      map.addLayer({ id: 'ntl', type: 'raster', source: 'ntl', paint: { 'raster-resampling': 'linear', 'raster-fade-duration': 0 } });
      map.addSource('vn', { type: 'geojson', data: B.ranhVN });
      map.addLayer({ id: 'vn', type: 'line', source: 'vn', paint: { 'line-color': '#7A869E', 'line-width': 0.7 } });
      map.addSource('vung', { type: 'geojson', data: { type: 'FeatureCollection', features: ['hcm', 'hn'].map((m) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: K.circle(B.tam[m], N.banKinhVung) } })) } });
      map.addLayer({ id: 'vung', type: 'line', source: 'vung', paint: { 'line-color': '#C9D2E3', 'line-width': 1, 'line-dasharray': [3, 2] } });
      map.fitBounds([[102.1, 8.4], [109.6, 23.45]], { duration: 0, padding: 12 });
      san = true; hien(cur);
    });
    const w = 260;
    const lg = document.createElement('div'); lg.className = 'legend outside';
    const stops = RAMP.map(([v, c]) => 'rgb(' + c.join(',') + ') ' + ((v - DN_MIN) / (63 - DN_MIN) * 100).toFixed(1) + '%').join(',');
    const pos = (v) => ((v - DN_MIN) / (63 - DN_MIN) * w).toFixed(1);
    lg.innerHTML = '<div class="t">' + t('Brightness of night-time light, digital number (0–63)', 'Độ sáng ban đêm, giá trị số (0–63)') + ' · <span class="year-now"></span></div>' +
      '<div class="ramp" style="width:' + w + 'px;height:10px;background:linear-gradient(90deg,' + stops + ');border:.5px solid #8A969F"></div>' +
      '<div class="ticks" style="width:' + w + 'px">' + [DN_MIN, 30, N.nguong, 63].map((v) => '<span style="left:' + pos(v) + 'px">' + K.fmt(v, '0') + '</span>').join('') + '</div>' +
      '<div class="sym"><svg width="28" height="10"><line x1="0" x2="28" y1="5" y2="5" stroke="#555" stroke-width="1" stroke-dasharray="3 2"/></svg>' +
      t('within ', 'trong bán kính ') + K.fmt(N.banKinhVung, '0') + t(' km of Ben Thanh and of Hoan Kiem Lake', ' km quanh Bến Thành và hồ Hoàn Kiếm') + '</div>';
    fig.querySelector('.fig-body').appendChild(lg);
    K.buoc(fig, hien);
  }

  /* Figure 5.2 — lit area (log scale) and the share of light near the two cities */
  function fig52(B) {
    const N = B.ntl, noi = 2013.5;
    const vach = [{ type: 'vline', x: noi, color: '#8A969F', text: t('change of satellite', 'đổi vệ tinh') }];
    const a = document.getElementById('c-5-2a');
    if (a) K.chart(a, {
      sources: ['l5_do_thi_hoa'], height: 320, rightMargin: 70, showKinds: false,
      alt: t('Area of Vietnam lit above two thresholds, 1992–2024', 'Diện tích Việt Nam sáng trên hai ngưỡng, 1992–2024'),
      x: { min: 1992, max: 2024, fmt: 'y', ticks: [1992, 2000, 2008, 2016, 2024] },
      y: { min: 100, max: 100000, log: true, fmt: '0', label: t('Lit area, km² (logarithmic scale)', 'Diện tích sáng, km² (thang logarit)') },
      series: [
        { id: 's30', kind: 'data', color: '#A87000', label: 'DN ≥ 30', points: N.nam.map((y, i) => [y, N.sang30[i]]), hover: true },
        { id: 's53', kind: 'data', color: '#C8102E', label: 'DN ≥ ' + K.fmt(N.nguong, '0'), points: N.nam.map((y, i) => [y, N.sang53[i]]), hover: true },
      ],
      marks: vach,
      tip: (s, p) => '<div class="k">' + s.label + ' · ' + K.fmt(p[0], 'y') + '</div><div class="v">' + K.fmt(p[1], '0') + ' km²</div>',
    });
    const b = document.getElementById('c-5-2b');
    if (b) K.chart(b, {
      sources: ['l5_do_thi_hoa'], height: 320, rightMargin: 110, showKinds: false,
      alt: t('Share of the night-time light of Vietnam within 50 km of the two largest cities', 'Phần ánh sáng ban đêm của Việt Nam trong bán kính 50 km quanh hai thành phố lớn nhất'),
      x: { min: 1992, max: 2024, fmt: 'y', ticks: [1992, 2000, 2008, 2016, 2024] },
      y: { min: 0, max: 0.3, fmt: '%0', label: t('Share of the country’s light', 'Phần ánh sáng của cả nước') },
      series: [
        { id: 'hcm', kind: 'data', color: MAU.hcm, label: t('Ho Chi Minh City', 'TP.HCM'), points: N.nam.map((y, i) => [y, N.phanHcm[i]]), hover: true },
        { id: 'hn', kind: 'data', color: MAU.hn, label: t('Hanoi', 'Hà Nội'), points: N.nam.map((y, i) => [y, N.phanHn[i]]), hover: true },
      ],
      marks: vach,
      tip: (s, p) => '<div class="k">' + s.label + ' · ' + K.fmt(p[0], 'y') + '</div><div class="v">' + K.fmt(p[1], '%0') + '</div>',
    });
  }
})();
