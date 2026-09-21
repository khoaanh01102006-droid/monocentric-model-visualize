/* MÔ HÌNH THÀNH PHỐ ĐƠN TÂM — Alonso · Muth · Mills, ký hiệu theo Brueckner (2011),
   "Lectures on Urban Economics", ch. 2 (cấu trúc không gian đô thị).

   ⚠ ĐÂY LÀ MÔ HÌNH MINH HOẠ. Tham số KHÔNG hiệu chuẩn cho TP.HCM hay bất kỳ đâu. Mọi
   hình vẽ từ tệp này phải mang nhãn "mô hình" và vẽ nét đứt (luật L3 của học phần).

   Hộ gia đình ở khoảng cách x (km) tới trung tâm việc làm:
     thu nhập y, chi phí đi lại t mỗi km ⇒ ngân sách  c + p(x)·q = y − t·x
     độ thoả dụng Cobb–Douglas  v = c^(1−α) · q^α   (α = tỷ phần chi cho nhà ở)
   Cân bằng không gian (mọi hộ giống nhau ⇒ cùng một mức thoả dụng u ở mọi x):
     q(x)  = α·(y − t·x) / p(x)
     p(x)  = K·(y − t·x)^(1/α)                ← K càng lớn thì u càng thấp
     ⇒ điều kiện Muth:  p′(x)·q(x) = −t        (kiểm bằng số trong kiem_mo_hinh.mjs)
   Nhà phát triển xây nhà bằng vốn và đất, H = A·Kv^β·L^(1−β):
     mật độ kết cấu (vốn trên một đơn vị đất)  S(x) = (β·A·p(x)/i)^(1/(1−β))
     diện tích sàn trên một đơn vị đất          h(x) = A·S(x)^β        ← "chiều cao nhà"
     giá thuê đất (lợi nhuận bằng 0)            r(x) = (1−β)·p(x)·h(x)
     mật độ dân                                  D(x) = h(x) / q(x)
   Thành phố ĐÓNG (dân số N cho trước): ranh x̄ nơi r(x̄) = r_A, và
     N = ∫₀^x̄ θ·x·D(x) dx    (θ = góc đất dành cho nhà ở, 2π nếu cả vòng tròn)
   Giải hai điều kiện đó bằng chia đôi trên K.                                    */
(function (goc) {
  'use strict';
  /* Mặc định CHỌN để minh hoạ, không hiệu chuẩn: lưới thử (t × r_A) cho ranh ≈ 21 km và
     mật độ giảm ≈ 9%/km — cùng cỡ trung bình 8,5%/km của 192 thành phố (Liotta và cộng sự
     2022, phụ lục B). Bản đầu t = 0,4, r_A = 1 cho ranh 3 km và mật độ trung tâm gấp đôi
     ranh — quá nhỏ để đặt lên bản đồ một thành phố thật. */
  const MAC_DINH = { y: 20, t: 0.15, rA: 0.01, N: 9, alpha: 0.3, beta: 0.75, A: 1, i: 1, theta: 2 * Math.PI * 0.35 };

  function tinhTaiK(th, K) {
    const { y, t, alpha, beta, A, i } = th;
    const p = (x) => K * Math.pow(Math.max(y - t * x, 1e-9), 1 / alpha);
    const S = (x) => Math.pow((beta * A * p(x)) / i, 1 / (1 - beta));
    const h = (x) => A * Math.pow(S(x), beta);
    const r = (x) => (1 - beta) * p(x) * h(x);
    const q = (x) => (alpha * (y - t * x)) / p(x);
    const D = (x) => h(x) / q(x);
    return { p, S, h, r, q, D };
  }

  /* ranh: r giảm ngặt theo x ⇒ chia đôi trên [0, y/t) */
  function timRanh(th, f) {
    const xMax = th.y / th.t - 1e-6;
    if (f.r(0) <= th.rA) return 0;
    if (f.r(xMax) >= th.rA) return xMax;
    let a = 0, b = xMax;
    for (let k = 0; k < 80; k++) { const m = (a + b) / 2; (f.r(m) > th.rA ? (a = m) : (b = m)); }
    return (a + b) / 2;
  }

  function danSo(th, f, xb) {
    const n = 400, dx = xb / n;
    let s = 0;
    for (let k = 0; k < n; k++) { const x = (k + 0.5) * dx; s += th.theta * x * f.D(x) * dx; }
    return s;
  }

  /* giải thành phố đóng: tìm K sao cho dân số trong ranh = N */
  function giai(thamSo) {
    const th = Object.assign({}, MAC_DINH, thamSo || {});
    let lo = 1e-12, hi = 1e-12;
    const dsTai = (K) => { const f = tinhTaiK(th, K); return danSo(th, f, timRanh(th, f)); };
    while (dsTai(hi) < th.N && hi < 1e12) hi *= 4;
    for (let k = 0; k < 200; k++) {
      const m = Math.sqrt(lo * hi);
      (dsTai(m) < th.N ? (lo = m) : (hi = m));
      if (hi / lo < 1 + 1e-12) break;
    }
    const K = Math.sqrt(lo * hi), f = tinhTaiK(th, K), xb = timRanh(th, f);
    const buoc = 60, duong = [];
    for (let k = 0; k <= buoc; k++) {
      const x = (xb * k) / buoc;
      duong.push({ x, p: f.p(x), r: f.r(x), h: f.h(x), D: f.D(x), q: f.q(x) });
    }
    return { thamSo: th, K, ranh: xb, danSo: danSo(th, f, xb), duong, ham: f };
  }

  const moHinh = { MAC_DINH, giai, loai: 'mo_hinh',
    nguon: 'Brueckner, J. K. (2011). Lectures on Urban Economics. MIT Press, ch. 2 — dạng Cobb–Douglas để minh hoạ' };
  goc.KTDT = goc.KTDT || {};
  goc.KTDT.moHinh = moHinh;
})(typeof window !== 'undefined' ? window : globalThis);
