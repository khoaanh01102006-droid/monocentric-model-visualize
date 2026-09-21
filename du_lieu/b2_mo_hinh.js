/* Nguồn của mô hình sa bàn (Bài 2). Không chứa con số — con số do js/mo_hinh.js
   tính lúc chạy và kich_ban/kiem_mo_hinh.mjs kiểm. */
KTDT.dangKy('b2_mo_hinh', {
  tieuDe: 'Mô hình thành phố đơn tâm, thành phố đóng — dạng Cobb–Douglas để minh hoạ',
  loai: 'mo_hinh',
  kichBan: 'js/mo_hinh.js · kiểm bằng kich_ban/kiem_mo_hinh.mjs',
  canhBao: 'Tham số chọn để minh hoạ, KHÔNG hiệu chuẩn cho TP.HCM. Vành và ranh vẽ quanh ga Bến Thành chỉ để đặt mô hình vào một khung cảnh quen thuộc — chúng không phải dự báo cho thành phố này.',
  nguon: [
    { ten: 'Brueckner, J. K. (2011). Lectures on Urban Economics. MIT Press — chương 2, cấu trúc không gian đô thị (ký hiệu dùng trong bài)',
      url: 'https://mitpress.mit.edu/9780262016360/lectures-on-urban-economics/', giayPhep: 'Trích dẫn học thuật — mô hình tự cài đặt, không chép văn bản', truyCap: '2026-09-15' },
    { ten: 'Alonso, W. (1964). Location and Land Use: Toward a General Theory of Land Rent. Harvard University Press',
      url: 'https://doi.org/10.4159/harvard.9780674730854', giayPhep: 'Trích dẫn học thuật', truyCap: '2026-09-15' },
    { ten: 'Muth, R. F. (1969). Cities and Housing: The Spatial Pattern of Urban Residential Land Use. University of Chicago Press',
      url: 'https://openlibrary.org/works/OL4643310W/Cities_and_housing', giayPhep: 'Trích dẫn học thuật', truyCap: '2026-09-15' },
    { ten: 'Mills, E. S. (1967). An Aggregative Model of Resource Allocation in a Metropolitan Area. American Economic Review 57(2): 197–210',
      url: 'https://www.jstor.org/stable/i331577', giayPhep: 'Trích dẫn học thuật', truyCap: '2026-09-15' },
    { ten: 'Brueckner, J. K. (1987). The Structure of Urban Equilibria: A Unified Treatment of the Muth–Mills Model. Handbook of Regional and Urban Economics 2, ch. 20: 821–845',
      url: 'https://ideas.repec.org/h/eee/regchp/2-20.html', giayPhep: 'Trích dẫn học thuật', truyCap: '2026-09-15' },
  ],
});
