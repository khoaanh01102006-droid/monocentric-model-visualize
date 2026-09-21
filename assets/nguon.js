/* Urban Economics (V2) · "About this data" — plain-language descriptions of every dataset,
   following the Sources panel of Our World in Data (what it is → who made it → how it was made
   → what you should know → licence and citation → what this course did with it).

   These are descriptions, not results: no number measured by the course appears here (L2).
   Citations and DOIs were checked 09-17 against the producers' own documentation
   (atlas/05_DU_LIEU_THO/the_gioi/tai_lieu/ghsl_ucdb_r2024.pdf, readme_V1_2.txt). */
(function () {
  'use strict';
  const K = window.KTDT;
  const L = (en, vi) => ({ en, vi });

  K.nguonMoTa = {
    ghs_pop: {
      ten: L('GHS-POP — population grid', 'GHS-POP — lưới dân số'),
      laGi: L('The estimated number of residents living in each cell of a regular grid of about 100 × 100 m, covering the whole world, for every fifth year from 1975 to 2020, with projections to 2030.',
        'Số người ước tính sống trong mỗi ô của một lưới đều khoảng 100 × 100 m, phủ toàn thế giới, cho từng mốc năm năm một từ 1975 đến 2020, kèm dự báo tới 2030.'),
      ai: L('European Commission, Joint Research Centre (JRC), Global Human Settlement Layer programme. Release R2023A.',
        'Uỷ ban châu Âu, Trung tâm Nghiên cứu Chung (JRC), chương trình Global Human Settlement Layer. Bản R2023A.'),
      cachLam: L('Census counts for administrative areas are shared out among grid cells according to the built-up area and building volume in each cell, which are mapped from Landsat and Sentinel-2 satellite imagery.',
        'Số dân điều tra của từng đơn vị hành chính được chia xuống các ô lưới theo diện tích và khối tích xây dựng trong mỗi ô, vốn được đo từ ảnh vệ tinh Landsat và Sentinel-2.'),
      nenBiet: [
        L('It is a modelled estimate, not a head count. Totals over many cells are more reliable than the value of a single cell.', 'Đây là ước lượng của mô hình, không phải đếm từng người. Tổng của nhiều ô đáng tin hơn giá trị của một ô.'),
        L('Because the grid ignores administrative boundaries, it shows where people live on both sides of a provincial border.', 'Vì lưới không theo ranh hành chính, nó cho thấy người sống ở đâu ở cả hai bên một ranh tỉnh.'),
        L('Figures for 2025 and 2030 are projections.', 'Số của 2025 và 2030 là dự báo.'),
      ],
      nam: L('1975–2030, every 5 years', '1975–2030, 5 năm một mốc'),
      doPhanGiai: L('3 arc-seconds (about 92 m in Ho Chi Minh City)', '3 giây cung (khoảng 92 m ở TP.HCM)'),
      giayPhep: 'CC BY 4.0', url: 'https://human-settlement.emergency.copernicus.eu/ghs_pop2023.php',
      trichDan: 'Schiavina, M., Freire, S., Carioli, A., & MacManus, K. (2023). GHS-POP R2023A – GHS population grid multitemporal (1975–2030). European Commission, Joint Research Centre. doi:10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE',
    },
    ghs_ucdb: {
      ten: L('GHS Urban Centre Database — where each city actually is', 'Cơ sở dữ liệu Trung tâm đô thị GHS — thành phố thật sự nằm ở đâu'),
      laGi: L('The outline, area and population of every “urban centre” in the world, drawn from population density rather than from administrative boundaries, for every fifth year from 1975 to 2030.',
        'Đường ranh, diện tích và dân số của mọi “trung tâm đô thị” trên thế giới, vẽ theo mật độ dân chứ không theo ranh hành chính, cho từng mốc năm năm một từ 1975 đến 2030.'),
      ai: L('European Commission, Joint Research Centre. GHS-UCDB R2024A, multi-temporal urban centres, version 1.2 (2025).',
        'Uỷ ban châu Âu, Trung tâm Nghiên cứu Chung. GHS-UCDB R2024A, trung tâm đô thị đa thời điểm, phiên bản 1.2 (2025).'),
      cachLam: L('The same rule is applied everywhere (the “Degree of Urbanisation”, endorsed by the UN Statistical Commission in 2020): an urban centre is a group of adjacent 1 km² grid cells, each with at least 1,500 residents per km², that together hold at least 50,000 people. Gaps are filled and edges smoothed. The rule is applied to the GHS-POP grid separately in each year.',
        'Cùng một quy tắc được áp dụng ở mọi nơi (“Degree of Urbanisation”, được Uỷ ban Thống kê Liên Hợp Quốc chấp thuận năm 2020): trung tâm đô thị là một cụm ô lưới 1 km² liền nhau, mỗi ô có ít nhất 1.500 người/km², cùng chứa ít nhất 50.000 người. Lỗ hổng được lấp, mép được làm trơn. Quy tắc áp dụng lên lưới GHS-POP riêng cho từng năm.'),
      nenBiet: [
        L('The outline follows where many people live, not land use and not legal boundaries. The edge of the city in the monocentric model is where land stops being in urban use, which built-up land and commuting zones measure more directly (Map 2.3, steps 4 and 5).', 'Đường ranh theo nơi có nhiều người sống, không theo sử dụng đất hay ranh pháp lý. Ranh thành phố trong mô hình đơn tâm là nơi đất thôi được dùng cho đô thị — đất xây dựng và vùng đi làm đo điều đó trực tiếp hơn (Bản đồ 2.3, bước 4 và 5).'),
        L('Built-up land is observed from satellites only in 1975, 1990, 2000, 2014 and 2018; the other years are interpolated, and by construction the built-up area can only shrink going back in time.', 'Đất xây dựng chỉ được quan sát từ vệ tinh ở 1975, 1990, 2000, 2014 và 2018; các năm khác là nội suy, và theo cách làm diện tích xây dựng chỉ có thể nhỏ đi khi lùi về quá khứ.'),
        L('Population in past years is modelled from census counts and growth rates, then matched to UN city population estimates.', 'Dân số các năm trước là mô hình từ số điều tra và tỷ lệ tăng, rồi khớp với ước lượng dân số đô thị của Liên Hợp Quốc.'),
        L('Cells that are densely built up but have few residents, such as factories, office parks or shopping centres, can also be included, so that one city is not split into several urban centres.', 'Các ô xây dựng dày đặc nhưng ít người ở, như nhà máy, khu văn phòng hay trung tâm thương mại, cũng có thể được tính vào, để một thành phố không bị tách thành nhiều trung tâm đô thị.'),
        L('As a city grows it can absorb its neighbours: the Ho Chi Minh City urban centre includes Thu Duc, Thu Dau Mot, Thuan An, Di An and Bien Hoa. Towns that merged later carry the same identifier in earlier years, even when they were still separate.', 'Khi thành phố lớn lên nó có thể nuốt các đô thị lân cận: trung tâm đô thị TP.HCM gồm cả Thủ Đức, Thủ Dầu Một, Thuận An, Dĩ An và Biên Hoà. Các đô thị nhập vào về sau mang cùng mã số ở những năm trước, kể cả khi còn tách rời.'),
        L('The producers warn that boundaries change with population in each year, so areas from different years measure different outlines.', 'Đơn vị sản xuất lưu ý rằng ranh thay đổi theo dân số từng năm, nên diện tích của các năm là của những đường ranh khác nhau.'),
        L('2025 and 2030 are projections.', '2025 và 2030 là dự báo.'),
      ],
      nam: L('1975–2030, every 5 years', '1975–2030, 5 năm một mốc'),
      doPhanGiai: L('1 km grid cells', 'ô lưới 1 km'),
      giayPhep: 'CC BY 4.0', url: 'https://human-settlement.emergency.copernicus.eu/ghs_ucdb_2024.php',
      trichDan: 'Mari Rivero, I., Melchiorri, M., Florio, P., Schiavina, M., et al. (2025). GHS Urban Centre Database 2025 (GHS-UCDB R2024A), version 1.2. European Commission, Joint Research Centre. doi:10.2905/1A338BE6-7EAF-480C-9664-3A8ADE88CBCD · Method: European Commission, FAO, UN-Habitat, ILO, OECD & World Bank (2021), Applying the Degree of Urbanisation, doi:10.2785/706535',
    },
    osm_wards: {
      ten: L('Ward and commune boundaries', 'Ranh phường, xã'),
      laGi: L('The boundaries of the 168 wards, communes and special zone of Ho Chi Minh City after the merger of 1 July 2025; joined together they give the administrative boundary of the city.',
        'Ranh của 168 phường, xã và đặc khu của TP.HCM sau sáp nhập ngày 01/07/2025; ghép lại cho ranh hành chính của thành phố.'),
      ai: L('OpenStreetMap contributors, an open mapping project maintained by volunteers.', 'Những người đóng góp OpenStreetMap, dự án bản đồ mở do tình nguyện viên duy trì.'),
      cachLam: L('Drawn by volunteers from official announcements and imagery, and tagged as administrative level 6.', 'Tình nguyện viên vẽ theo thông báo chính thức và ảnh, gắn nhãn cấp hành chính 6.'),
      nenBiet: [
        L('Suitable for display, not a legal survey. One commune (Thanh An) had no boundary when the data were downloaded, so the joined area is a little below the official 6,772.59 km².', 'Dùng để hiển thị, không phải đo đạc pháp lý. Một xã (Thanh An) chưa có ranh khi tải dữ liệu, nên diện tích ghép thấp hơn một chút so với con số chính thức 6.772,59 km².'),
        L('The administrative boundary is a legal line. In the model, the edge of the city is where land stops being used for housing — the two need not coincide.', 'Ranh hành chính là một đường pháp lý. Trong mô hình, ranh thành phố là nơi đất thôi được dùng làm nhà ở — hai đường không nhất thiết trùng nhau.'),
      ],
      nam: L('downloaded 2026', 'tải năm 2026'), doPhanGiai: L('vector outlines', 'đường ranh vector'),
      giayPhep: 'ODbL 1.0', url: 'https://www.openstreetmap.org/copyright',
      trichDan: '© OpenStreetMap contributors, available under the Open Database Licence (ODbL 1.0).',
    },
    gia_dat_o: {
      ten: L('Land price table — residential land', 'Bảng giá đất — đất ở'),
      laGi: L('The price per m² that the city government sets for residential land along each named street segment. It is used to calculate land-use fees, taxes and compensation. It is not a record of what buyers pay.',
        'Giá mỗi m² mà chính quyền thành phố quy định cho đất ở dọc từng đoạn đường có tên. Nó dùng để tính tiền sử dụng đất, thuế và bồi thường. Nó không phải là ghi chép giá người mua thật sự trả.'),
      ai: L('Ho Chi Minh City People’s Council, Resolution 87/2025/NQ-HĐND of 26 December 2025, applied from 1 January 2026.', 'HĐND TP.HCM, Nghị quyết 87/2025/NQ-HĐND ngày 26/12/2025, áp dụng từ 01/01/2026.'),
      cachLam: L('A legal document. Prices are listed street by street in the appendices, in thousand VND per m².', 'Văn bản pháp luật. Giá liệt kê theo từng đường trong các phụ lục, đơn vị nghìn đồng/m².'),
      nenBiet: [
        L('An administered price: market prices are often much higher (World Bank 2011, Box 3.3).', 'Giá do Nhà nước quy định: giá thị trường thường cao hơn nhiều (World Bank 2011, Hộp 3.3).'),
        L('The value shown for a ward is the median over its street segments, for plots facing the street.', 'Giá trị của mỗi phường/xã trên bản đồ là trung vị các đoạn đường của nó, cho thửa đất mặt tiền.'),
        L('The table exists only inside the administrative boundary; it says nothing about prices in Bien Hoa, which lies inside the urban area but outside the administrative boundary of Ho Chi Minh City.', 'Bảng chỉ có trong ranh hành chính; nó không nói gì về giá ở Biên Hoà, nơi nằm trong vùng đô thị nhưng ngoài ranh hành chính TP.HCM.'),
      ],
      nam: L('2026', '2026'), doPhanGiai: L('street segments, summarised by ward', 'đoạn đường, tóm tắt theo phường/xã'),
      giayPhep: L('Public legal document', 'Văn bản pháp luật công khai'),
      url: 'https://xaydungchinhsach.chinhphu.vn/bang-gia-dat-tai-tphcm-ap-dung-tu-1-1-2026-tren-dia-ban-tphcm-119251227190324013.htm',
      trichDan: 'Ho Chi Minh City People’s Council (2025). Resolution 87/2025/NQ-HĐND on the land price table applied from 1 January 2026.',
    },
    gia_dat_nn: {
      ten: L('Land price table — agricultural land', 'Bảng giá đất — đất nông nghiệp'),
      laGi: L('The price per m² that the city sets for agricultural land (annual crops, including rice), by zone and by distance from a named road.',
        'Giá mỗi m² mà thành phố quy định cho đất nông nghiệp (cây hàng năm, gồm lúa), theo khu vực và theo khoảng cách tới đường có tên.'),
      ai: L('Ho Chi Minh City People’s Council, Resolution 87/2025/NQ-HĐND, attached regulation, Articles 3 and 5.', 'HĐND TP.HCM, Nghị quyết 87/2025/NQ-HĐND, Quy định kèm theo, Điều 3 và Điều 5.'),
      cachLam: L('Every ward and commune is assigned to one of four zones; each zone has three prices, for plots within 200 m of a named road, 200–400 m, and further away.', 'Mỗi phường/xã được xếp vào một trong bốn khu vực; mỗi khu vực có ba mức giá, cho thửa trong 200 m tiếp giáp đường có tên, 200–400 m, và xa hơn.'),
      nenBiet: [L('Twelve administered prices for the whole city, not a market measure of agricultural rent.', 'Mười hai mức giá quy định cho cả thành phố, không phải thước đo thị trường của giá thuê đất nông nghiệp.')],
      nam: L('2026', '2026'), doPhanGiai: L('4 zones × 3 positions', '4 khu vực × 3 vị trí'),
      giayPhep: L('Public legal document', 'Văn bản pháp luật công khai'),
      url: 'https://xaydungchinhsach.chinhphu.vn/bang-gia-dat-tai-tphcm-ap-dung-tu-1-1-2026-tren-dia-ban-tphcm-119251227190324013.htm',
      trichDan: 'Ho Chi Minh City People’s Council (2025). Resolution 87/2025/NQ-HĐND, regulation, Article 3 and Article 5, Table 1.',
    },
    wsf_evolution: {
      ten: L('World Settlement Footprint Evolution — built-up land year by year', 'World Settlement Footprint Evolution — đất xây dựng từng năm'),
      laGi: L('For every 30 m square on Earth, the first year between 1985 and 2015 in which buildings or other built surfaces were detected there, or none. It measures land covered by construction, not residents.',
        'Với mỗi ô vuông 30 m trên Trái Đất: năm đầu tiên trong giai đoạn 1985–2015 phát hiện nhà cửa hoặc bề mặt xây dựng ở đó, hoặc chưa bao giờ. Nó đo đất bị xây phủ, không đo người ở.'),
      ai: L('WSF Team, German Aerospace Center (DLR), Earth Observation Center. Version 1.', 'Nhóm WSF, Trung tâm Hàng không Vũ trụ Đức (DLR), Trung tâm Quan sát Trái Đất. Bản 1.'),
      cachLam: L('The method starts from the settlement map of 2015 and works back one year at a time: for each year it summarises all available Landsat-5 and -7 images and a random-forest classifier decides which of the squares built up in the following year were already built up.',
        'Phương pháp bắt đầu từ bản đồ khu dân cư năm 2015 rồi lùi từng năm: với mỗi năm, nó tóm tắt mọi ảnh Landsat-5 và -7 có được, và một bộ phân loại rừng ngẫu nhiên quyết định trong các ô đã xây dựng ở năm sau, ô nào đã xây dựng từ năm đó.'),
      nenBiet: [
        L('Built-up before 1985 is shown as 1985: the series cannot tell 1950 from 1985.', 'Đất xây dựng trước 1985 hiện là 1985: chuỗi không phân biệt được 1950 với 1985.'),
        L('By construction a square that is not built up in 2015 is never built up earlier, so the series cannot show land that was built on and later cleared.', 'Theo cách làm, ô chưa xây dựng năm 2015 thì không bao giờ được coi là xây dựng trước đó, nên chuỗi không thể cho thấy đất từng xây rồi bị giải toả.'),
        L('Landsat images of Viet Nam are scarce in the late 1980s, so the earliest years are less certain; the course checked that central Ho Chi Minh City appears as built up from the first year.', 'Ảnh Landsat của Việt Nam cuối thập niên 1980 thưa, nên các năm đầu kém chắc chắn hơn; học phần đã kiểm rằng trung tâm TP.HCM hiện là đất xây dựng ngay từ năm đầu.'),
        L('Very small or low buildings in dense neighbourhoods can be missed at 30 m.', 'Nhà rất nhỏ hoặc thấp trong khu dày đặc có thể bị sót ở độ phân giải 30 m.'),
      ],
      nam: L('1985–2015, every year', '1985–2015, từng năm'), doPhanGiai: L('30 m, grouped by the course into cells of about 90 m', '30 m, học phần gộp thành ô khoảng 90 m'),
      giayPhep: 'CC BY 4.0', url: 'https://geoservice.dlr.de/web/datasets/wsf_evo',
      trichDan: 'World Settlement Footprint (WSF®) Evolution, © 2024 DLR, CC BY 4.0, https://geoservice.dlr.de/web/datasets/wsf_evo · Base layer: Marconcini, M., Metz-Marconcini, A., Üreyen, S., et al. (2020). Outlining where humans live, the World Settlement Footprint 2015. Scientific Data, 7, 242.',
    },
    ghs_fua: {
      ten: L('GHS Functional Urban Areas — the city and its commuting zone', 'Vùng đô thị chức năng GHS — thành phố và vùng đi làm'),
      laGi: L('For every urban centre in the world, the surrounding area whose residents are likely to commute to it, drawn for 2015.',
        'Với mỗi trung tâm đô thị trên thế giới, vùng xung quanh có cư dân nhiều khả năng đi làm vào đó, vẽ cho năm 2015.'),
      ai: L('European Commission, Joint Research Centre, with the OECD. Release R2019A.', 'Uỷ ban châu Âu, Trung tâm Nghiên cứu Chung, cùng OECD. Bản R2019A.'),
      cachLam: L('Where commuting surveys exist, the OECD and EU add to a city every local unit from which at least 15% of employed residents commute to it. Because most countries lack such data, this global version predicts the commuting zone from travel time to the urban centre, its size and population, trained on countries that do have commuting data.',
        'Nơi có điều tra đi làm, OECD và EU thêm vào thành phố mọi đơn vị có ít nhất 15% người có việc làm đi làm vào đó. Vì phần lớn các nước không có số liệu này, bản toàn cầu dự đoán vùng đi làm từ thời gian đi lại tới trung tâm đô thị, cỡ và dân số của nó, học từ các nước có số liệu.'),
      nenBiet: [
        L('The commuting zone is modelled, not observed: no commuting survey for Ho Chi Minh City was used.', 'Vùng đi làm là mô hình, không phải quan sát: không có điều tra đi làm nào của TP.HCM được dùng.'),
        L('It is built on the 2015 urban centres of an earlier release, so its urban-centre area differs slightly from the outlines used elsewhere on this page.', 'Nó dựng trên trung tâm đô thị 2015 của một bản trước, nên diện tích trung tâm đô thị hơi khác các đường ranh dùng ở chỗ khác trên trang.'),
      ],
      nam: L('2015', '2015'), doPhanGiai: L('1 km grid, vector outline', 'lưới 1 km, đường ranh vector'),
      giayPhep: 'CC BY 4.0', url: 'https://human-settlement.emergency.copernicus.eu/ghs_fua.php',
      trichDan: 'Schiavina, M., Moreno-Monroy, A., Maffenini, L., & Veneri, P. (2019). GHSL-OECD Functional Urban Areas 2019. EUR 30001 EN, Publications Office of the European Union. doi:10.2760/67415 · Method: Moreno-Monroy, A. I., Schiavina, M., & Veneri, P. (2021). Metropolitan areas in the world. Delineation and population trends. Journal of Urban Economics, 125.',
    },
    worldpop: {
      ten: L('WorldPop — a second population grid', 'WorldPop — lưới dân số thứ hai'),
      laGi: L('The estimated number of residents in each cell of a grid of about 100 × 100 m, for Viet Nam in 2020. The course uses it only to check whether results from GHS-POP depend on the choice of grid.',
        'Số người ước tính trong mỗi ô của một lưới khoảng 100 × 100 m, cho Việt Nam năm 2020. Học phần chỉ dùng nó để kiểm xem kết quả từ GHS-POP có phụ thuộc vào việc chọn lưới hay không.'),
      ai: L('WorldPop, University of Southampton. “Unconstrained” individual-country dataset, 2020.', 'WorldPop, Đại học Southampton. Bộ dữ liệu từng nước, bản “không ràng buộc” (unconstrained), 2020.'),
      cachLam: L('Census counts are shared out among grid cells with a statistical model (random forest) that uses mapped features such as land cover, roads, night-time lights and settlements.',
        'Số dân điều tra được chia xuống các ô lưới bằng một mô hình thống kê (rừng ngẫu nhiên) dùng các đặc trưng đã lập bản đồ như lớp phủ mặt đất, đường sá, ánh sáng ban đêm và khu dân cư.'),
      nenBiet: [
        L('“Unconstrained” means that some population can be placed in cells where no building has been detected, so rural areas look smoother than in GHS-POP.', '“Không ràng buộc” nghĩa là một phần dân số có thể được đặt vào ô không phát hiện được nhà nào, nên vùng nông thôn trông mịn hơn so với GHS-POP.'),
        L('Like GHS-POP, it is a modelled estimate, not a count.', 'Cũng như GHS-POP, đây là ước lượng của mô hình, không phải đếm.'),
      ],
      nam: L('2020', '2020'), doPhanGiai: L('3 arc-seconds (about 92 m)', '3 giây cung (khoảng 92 m)'),
      giayPhep: 'CC BY 4.0', url: 'https://www.worldpop.org',
      trichDan: 'WorldPop (2018). Global 100m population. University of Southampton. doi:10.5258/SOTON/WP00645',
    },
    liotta_2022: {
      ten: L('192 cities — Liotta, Viguié and Lepetit (2022)', '192 thành phố — Liotta, Viguié và Lepetit (2022)'),
      laGi: L('Density and rent gradients estimated with the same method for 192 cities on five continents, published in a peer-reviewed journal. The course uses the summary of their density gradients (minimum, quartiles, maximum, mean).',
        'Độ dốc mật độ và giá thuê ước lượng bằng cùng một phương pháp cho 192 thành phố ở năm châu lục, đăng trên tạp chí có bình duyệt. Học phần dùng bảng tóm tắt độ dốc mật độ của họ (nhỏ nhất, tứ phân vị, lớn nhất, trung bình).'),
      ai: L('Charlotte Liotta, Vincent Viguié and Quentin Lepetit, CIRED (École des Ponts ParisTech), France. Regional Science and Urban Economics, 2022.',
        'Charlotte Liotta, Vincent Viguié và Quentin Lepetit, CIRED (École des Ponts ParisTech), Pháp. Regional Science and Urban Economics, 2022.'),
      cachLam: L('Each city is divided into 1 km² cells covering its whole urban area. Population comes from an earlier release of the GHSL population grid; rents come from real-estate websites scraped between 2017 and 2020. For each city a regression of the form of equation (2.1) is estimated.',
        'Mỗi thành phố được chia thành ô 1 km² phủ toàn vùng đô thị. Dân số lấy từ một bản GHSL cũ hơn; giá thuê lấy bằng cách thu thập tự động từ các trang rao bất động sản trong 2017–2020. Với mỗi thành phố, một hồi quy dạng phương trình (2.1) được ước lượng.'),
      nenBiet: [
        L('Ho Chi Minh City is not in their sample: the comparison in Figure 2.4 places an estimate from this course among theirs.', 'TP.HCM không có trong mẫu của họ: phép so ở Hình 2.4 đặt một ước lượng của học phần vào giữa các ước lượng của họ.'),
        L('They locate each city centre with their own rule and use an older population grid (Section 2.5), so small differences should not be read as real.', 'Họ xác định trung tâm mỗi thành phố theo quy tắc riêng và dùng lưới dân số cũ hơn (mục 2.5), nên chênh lệch nhỏ không nên đọc là khác biệt thật.'),
      ],
      nam: L('population grid up to 2015; rents 2017–2020', 'lưới dân số tới 2015; giá thuê 2017–2020'), doPhanGiai: L('1 km² cells', 'ô 1 km²'),
      giayPhep: 'CC BY 4.0', url: 'https://arxiv.org/abs/2111.02112',
      trichDan: 'Liotta, C., Viguié, V., & Lepetit, Q. (2022). Testing the monocentric standard urban model in a global sample of cities. Regional Science and Urban Economics, 97, 103832. doi:10.1016/j.regsciurbeco.2022.103832',
    },
    mo_hinh: {
      ten: L('The model of Lesson 1 — computed, not measured', 'Mô hình của Bài 1 — tính ra, không đo'),
      laGi: L('Housing prices, dwelling sizes, building heights, densities and the edge of a city computed from the closed-city version of the Alonso–Muth–Mills model. No observation of any real city enters the calculation.',
        'Giá nhà, diện tích nhà, chiều cao công trình, mật độ và ranh của một thành phố, tính từ phiên bản thành phố đóng của mô hình Alonso–Muth–Mills. Không có quan sát nào về một thành phố thật đi vào phép tính.'),
      ai: L('This course, with the notation of Brueckner (2011), chapter 2.', 'Học phần này, theo ký hiệu của Brueckner (2011), chương 2.'),
      cachLam: L('Identical households choose where to live and how much housing to consume; developers combine land and capital. The equations of Sections 1.3–1.5 are solved numerically until all households are housed and rent at the edge equals agricultural rent.',
        'Các hộ giống hệt nhau chọn nơi ở và lượng nhà ở tiêu dùng; nhà phát triển kết hợp đất và vốn. Các phương trình ở mục 1.3–1.5 được giải bằng số cho tới khi mọi hộ đều có chỗ ở và giá thuê tại ranh bằng giá thuê đất nông nghiệp.'),
      nenBiet: [
        L('The parameters in Table 1.2 are illustrative, not estimated for Ho Chi Minh City or any other city. Units of income and price are arbitrary.', 'Tham số ở Bảng 1.2 là để minh hoạ, không ước lượng cho TP.HCM hay thành phố nào. Đơn vị thu nhập và giá là tuỳ ý.'),
        L('In charts, model output is drawn with dashed lines and measured data with solid lines.', 'Trên biểu đồ, kết quả mô hình vẽ nét đứt, số liệu đo vẽ nét liền.'),
      ],
      nam: L('not applicable', 'không áp dụng'), doPhanGiai: L('continuous distance', 'khoảng cách liên tục'),
      giayPhep: L('Course material', 'Tài liệu của học phần'), url: '../js/mo_hinh.js',
      trichDan: 'Brueckner, J. K. (2011). Lectures on urban economics. MIT Press, chapter 2.',
    },
    osm_geofabrik: {
      ten: L('OpenStreetMap road network (Geofabrik extract)', 'Mạng lưới đường OpenStreetMap (bản trích Geofabrik)'),
      laGi: L('Every road, bridge, tunnel and ferry that volunteers have mapped in OpenStreetMap, with its class (expressway, main road, local street…), direction of travel and access rules, such as roads closed to motorcycles.',
        'Mọi con đường, cây cầu, đường hầm và tuyến phà mà các tình nguyện viên đã vẽ trên OpenStreetMap, kèm cấp đường (cao tốc, đường chính, đường nội bộ…), chiều lưu thông và quy định cho phép, ví dụ đường cấm xe máy.'),
      ai: L('OpenStreetMap contributors; extract of Vietnam prepared by Geofabrik GmbH.', 'Những người đóng góp OpenStreetMap; bản trích Việt Nam do Geofabrik GmbH chuẩn bị.'),
      cachLam: L('Mapped by hand, largely from satellite imagery and local knowledge, and updated continually; the extract is a snapshot of one day.', 'Vẽ tay, chủ yếu dựa trên ảnh vệ tinh và hiểu biết tại chỗ, cập nhật liên tục; bản trích là ảnh chụp của một ngày.'),
      nenBiet: [
        L('It shows the network of September 2026 only. Earlier networks in this lesson are built by removing the links opened later, not from old maps.', 'Nó chỉ cho mạng lưới tháng 9/2026. Mạng lưới các năm trước trong bài này được dựng bằng cách gỡ các công trình mở sau, không phải từ bản đồ cũ.'),
        L('It records no speeds or traffic. The travel times of this lesson use speeds assumed for each class of road.', 'Nó không ghi tốc độ hay lưu lượng xe. Thời gian đi lại trong bài dùng tốc độ giả định cho từng cấp đường.'),
      ],
      nam: L('16 September 2026', '16/9/2026'), doPhanGiai: L('individual road segments', 'từng đoạn đường'),
      giayPhep: L('ODbL 1.0', 'ODbL 1.0'), url: 'https://www.openstreetmap.org/copyright',
      trichDan: 'OpenStreetMap contributors (2026). Vietnam extract, 16 September 2026. Geofabrik, https://download.geofabrik.de/asia/vietnam.html',
    },
    gtfs_buyt: {
      ten: L('Bus routes and timetables (assembled into GTFS)', 'Tuyến và lịch chạy xe buýt (dựng thành GTFS)'),
      laGi: L('Every bus route of the city with its stops, its trips and the start and end time of each trip, arranged in the General Transit Feed Specification used by journey planners.', 'Mọi tuyến xe buýt của thành phố cùng các trạm, các chuyến và giờ bắt đầu, giờ kết thúc của từng chuyến, sắp theo chuẩn GTFS mà các ứng dụng tìm đường dùng.'),
      ai: L('Ho Chi Minh City Public Transport Management Centre (public information service); assembled for this project.', 'Trung tâm Quản lý giao thông công cộng TP.HCM (dịch vụ thông tin công khai); dự án tự dựng thành GTFS.'),
      cachLam: L('Routes, stops and trips were read from the public service; the time at each stop was interpolated by distance between the start and end times of the trip.', 'Tuyến, trạm và chuyến được đọc từ dịch vụ công khai; giờ tới từng trạm được nội suy theo khoảng cách giữa giờ bắt đầu và giờ kết thúc của chuyến.'),
      nenBiet: [
        L('Vietnam has no published GTFS feed; this is a reconstruction, and the times at individual stops are estimates.', 'Việt Nam chưa có nguồn GTFS nào được công bố; đây là bản dựng lại, và giờ tại từng trạm là ước tính.'),
        L('Traffic delays are not included, so real journeys at the morning peak take longer.', 'Không tính chậm trễ do ùn tắc, nên hành trình thật vào giờ cao điểm sáng lâu hơn.'),
      ],
      nam: L('September 2026', 'Tháng 9/2026'), doPhanGiai: L('178 routes, about 5,900 stops', '178 tuyến, khoảng 5.900 trạm'),
      giayPhep: L('Public service of a state body; results only are shown', 'Dịch vụ công khai của cơ quan nhà nước; chỉ trình bày kết quả'), url: 'http://apicms.ebms.vn/businfo',
      trichDan: 'Ho Chi Minh City Public Transport Management Centre, bus information service (apicms.ebms.vn), accessed 5 September 2026.',
    },
    l3_moc: {
      ten: L('Opening dates of major road links', 'Ngày thông xe của các công trình giao thông lớn'),
      laGi: L('The date on which each bridge, tunnel or expressway of Table 3.2 opened to traffic, and the date the Thu Thiem ferry closed.', 'Ngày thông xe của từng cây cầu, đường hầm, đường cao tốc trong Bảng 3.2, và ngày phà Thủ Thiêm ngừng hoạt động.'),
      ai: L('Compiled for this course from reports by government portals and national newspapers.', 'Học phần tự tổng hợp từ bài đăng của cổng thông tin nhà nước và báo chí trong nước.'),
      cachLam: L('Each report was downloaded and kept; a date is accepted only if the report contains, word for word, the sentence that states it.', 'Mỗi bài đăng được tải về và lưu lại; một ngày chỉ được nhận khi bài có đúng từng chữ của câu nêu ngày ấy.'),
      nenBiet: [
        L('Some links opened in sections. The table gives the date used by the model and says so where a link opened in stages.', 'Một số công trình thông xe từng đoạn. Bảng ghi ngày mà mô hình dùng và nói rõ khi công trình mở theo giai đoạn.'),
      ],
      nam: L('2008–2026', '2008–2026'), doPhanGiai: L('one date per link', 'một ngày cho mỗi công trình'),
      giayPhep: L('Short quotation with attribution', 'Trích dẫn ngắn, ghi nguồn'), url: 'https://baochinhphu.vn/',
      trichDan: 'Reports listed in Table 3.2, each with its date of publication.',
    },
    l3_co_gioi: {
      ten: L('Vehicles, commuting and public transport: reported figures', 'Phương tiện, đi làm và vận tải công cộng: số liệu được công bố'),
      laGi: L('Figures on registered vehicles, commuting times, travel speeds, bus and metro passengers and the share of public transport in Ho Chi Minh City, each for the year its source states.', 'Số liệu về xe đăng ký, thời gian đi làm, tốc độ lưu thông, lượt khách xe buýt và metro, và tỷ lệ vận tải công cộng ở TP.HCM, mỗi con số cho đúng năm mà nguồn nêu.'),
      ai: L('The World Bank (2011), citing ALMEC surveys; Nguyen and Nguyen (2017), citing the city Department of Transport; newspapers and the government portal, citing public bodies.', 'Ngân hàng Thế giới (2011), dẫn khảo sát của ALMEC; Nguyễn và Nguyễn (2017), dẫn Sở GTVT TP.HCM; báo chí và cổng thông tin chính phủ, dẫn các cơ quan nhà nước.'),
      cachLam: L('Numbers are taken from sentences checked word for word against the PDF or the saved web page.', 'Con số lấy từ những câu đã đối chiếu từng chữ với tệp PDF hoặc trang web đã lưu.'),
      nenBiet: [
        L('There is no official annual series; the figures come from different sources and measure slightly different things.', 'Không có chuỗi số liệu chính thức hằng năm; các con số đến từ nhiều nguồn và đo những thứ hơi khác nhau.'),
        L('The commuting time of 20 minutes comes from a household survey of 2002, as a footnote of the World Bank report states.', 'Thời gian đi làm 20 phút lấy từ khảo sát hộ gia đình năm 2002, như chú thích của báo cáo Ngân hàng Thế giới ghi rõ.'),
      ],
      nam: L('2001–2025', '2001–2025'), doPhanGiai: L('whole city', 'toàn thành phố'),
      giayPhep: L('Short quotation with attribution', 'Trích dẫn ngắn, ghi nguồn'), url: 'https://openknowledge.worldbank.org/entities/publication/a2b30aef-198f-56e3-bfec-aa88c51ef67e',
      trichDan: 'World Bank (2011); Nguyen and Nguyen (2017); reports listed under Data and code.',
    },
    ghs_land: {
      ten: L('GHS-LAND — how much of each cell is land', 'GHS-LAND — mỗi ô có bao nhiêu đất liền'),
      laGi: L('For every cell of a 100 m grid covering the world, the number of square metres that are land rather than sea, river or lake.',
        'Với mỗi ô của một lưới 100 m phủ toàn thế giới, số mét vuông là đất liền chứ không phải biển, sông hay hồ.'),
      ai: L('European Commission, Joint Research Centre (JRC), Global Human Settlement Layer programme. Release R2022A.',
        'Uỷ ban châu Âu, Trung tâm Nghiên cứu Chung (JRC), chương trình Global Human Settlement Layer. Bản R2022A.'),
      cachLam: L('Water is detected in a cloud-free Sentinel-2 satellite composite of 2017–2018; gaps are filled with Landsat images and, where no image is available, with OpenStreetMap.',
        'Mặt nước được nhận ra trên ảnh ghép Sentinel-2 không mây của 2017–2018; chỗ thiếu được bù bằng ảnh Landsat và, nơi không có ảnh, bằng OpenStreetMap.'),
      nenBiet: [
        L('It describes one moment, around 2018. Land reclaimed from rivers or the sea before or after that date is not traced.', 'Nó mô tả một thời điểm, khoảng năm 2018. Đất lấn sông, lấn biển trước hay sau thời điểm ấy không được theo dõi.'),
        L('In this lesson it is used only to leave water out of the area of each ring, so that the Red River, West Lake or the Saigon River do not count as empty land.', 'Trong bài này nó chỉ được dùng để bỏ mặt nước ra khỏi diện tích của từng vành, để sông Hồng, Hồ Tây hay sông Sài Gòn không bị tính như đất trống.'),
      ],
      nam: L('2018', '2018'), doPhanGiai: L('100 m', '100 m'),
      giayPhep: 'CC BY 4.0', url: 'https://human-settlement.emergency.copernicus.eu/download.php?ds=land',
      trichDan: 'Pesaresi, M., & Politis, P. (2022). GHS-LAND R2022A – Land fraction as derived from Sentinel-2 image composite (2018) and OSM data. European Commission, Joint Research Centre. doi:10.2905/AB7AD451-5ED5-44A6-A4D0-9F7A4E848CEE',
    },
    tam_lich_su: {
      ten: L('Historical centres of Hanoi and Ho Chi Minh City', 'Trung tâm lâu đời của Hà Nội và TP.HCM'),
      laGi: L('The points from which distances are measured in Section 4.3: the centre of Hoan Kiem Lake in Hanoi and Ben Thanh metro station in Ho Chi Minh City.',
        'Hai điểm dùng để đo khoảng cách ở Mục 4.3: tâm hồ Hoàn Kiếm ở Hà Nội và ga metro Bến Thành ở TP.HCM.'),
      ai: L('OpenStreetMap contributors; the lake was located with the Nominatim search service.', 'Những người đóng góp OpenStreetMap; vị trí hồ được tra bằng dịch vụ tìm kiếm Nominatim.'),
      cachLam: L('The coordinates returned by Nominatim for the lake, and the station used as the centre in Lessons 2 and 3, are stored with the course data.', 'Toạ độ Nominatim trả về cho hồ, và nhà ga dùng làm tâm ở Bài 2 và Bài 3, được lưu cùng dữ liệu của học phần.'),
      nenBiet: [
        L('A centre is a choice. Section 4.2 uses population-weighted centres instead, and Table 4.2 shows the gradients of Hanoi and Ho Chi Minh City from both.', 'Tâm là một lựa chọn. Mục 4.2 dùng tâm theo dân số, và Bảng 4.2 cho độ dốc của Hà Nội và TP.HCM tính từ cả hai loại tâm.'),
      ],
      nam: L('2026', '2026'), doPhanGiai: L('one point per city', 'một điểm cho mỗi thành phố'),
      giayPhep: 'ODbL 1.0', url: 'https://www.openstreetmap.org/relation/198437',
      trichDan: 'OpenStreetMap contributors. Hoan Kiem Lake, relation 198437, via Nominatim (nominatim.openstreetmap.org), accessed 18 September 2026.',
    },
    wdi_urban: {
      ten: L('Urban population, official definition (World Development Indicators)', 'Dân số đô thị theo định nghĩa chính thức (Bộ chỉ số Phát triển Thế giới)'),
      laGi: L('The share of the population of Vietnam living in areas that the country itself defines as urban, for every year since 1960.', 'Tỷ lệ dân số Việt Nam sống ở những nơi mà chính Việt Nam định nghĩa là đô thị, cho từng năm từ 1960.'),
      ai: L('World Bank, from World Urbanization Prospects of the United Nations Population Division.', 'Ngân hàng Thế giới, lấy từ Triển vọng Đô thị hoá Thế giới của Vụ Dân số Liên Hợp Quốc.'),
      cachLam: L('The urban population counted in each census is taken as given; the United Nations smooths the years between censuses.', 'Dân số đô thị đếm trong mỗi kỳ tổng điều tra được giữ nguyên; Liên Hợp Quốc làm trơn các năm giữa hai kỳ.'),
      nenBiet: [
        L('In Vietnam, urban means living in a ward (phường) or a township (thị trấn), an administrative status rather than a measure of density.', 'Ở Việt Nam, đô thị nghĩa là sống ở phường hoặc thị trấn — một địa vị hành chính, không phải thước đo mật độ.'),
        L('Only the census years (1979, 1989, 1999, 2009, 2019) are counts; the other years are estimates.', 'Chỉ các năm tổng điều tra (1979, 1989, 1999, 2009, 2019) là số đếm; các năm khác là ước lượng.'),
      ],
      nam: L('1960–2025', '1960–2025'), doPhanGiai: L('whole country', 'cả nước'),
      giayPhep: 'CC BY 4.0', url: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=VN',
      trichDan: 'World Bank, World Development Indicators, SP.URB.TOTL.IN.ZS, based on United Nations Population Division, World Urbanization Prospects.',
    },
    ghs_duc: {
      ten: L('GHS-DUC — the Degree of Urbanisation by country', 'GHS-DUC — Mức độ đô thị hoá theo từng nước'),
      laGi: L('For every country and administrative unit of the world, the share of the population living in cities, in towns and semi-dense areas, and in rural areas, every fifth year from 1975 to 2030.', 'Với mọi nước và mọi đơn vị hành chính trên thế giới, tỷ lệ dân sống ở thành phố, ở thị trấn và vùng bán dày đặc, và ở nông thôn, năm năm một mốc từ 1975 đến 2030.'),
      ai: L('European Commission, Joint Research Centre. Release R2023A, version 2.0.', 'Uỷ ban châu Âu, Trung tâm Nghiên cứu Chung. Bản R2023A, phiên bản 2.0.'),
      cachLam: L('The grid classes of GHS-SMOD are combined with the GHS-POP population grid inside the boundaries of the GADM database.', 'Các lớp ô lưới của GHS-SMOD được ghép với lưới dân số GHS-POP trong ranh giới của cơ sở dữ liệu GADM.'),
      nenBiet: [
        L('The method is the one endorsed by the United Nations Statistical Commission in 2020 for international comparison; it is not meant to replace national definitions.', 'Phương pháp này được Uỷ ban Thống kê Liên Hợp Quốc chấp thuận năm 2020 để so sánh quốc tế; nó không nhằm thay thế định nghĩa của từng nước.'),
        L('Earlier releases gave different figures for the same years, because the population grids were revised.', 'Các bản phát hành trước cho số khác cho cùng một năm, vì lưới dân số đã được sửa.'),
      ],
      nam: L('1975–2030, every 5 years', '1975–2030, 5 năm một mốc'), doPhanGiai: L('countries and administrative units', 'nước và đơn vị hành chính'),
      giayPhep: 'CC BY 4.0', url: 'https://human-settlement.emergency.copernicus.eu/download.php?ds=DUC',
      trichDan: 'Schiavina, M., Melchiorri, M., & Freire, S. (2023). GHS-DUC R2023A. European Commission, Joint Research Centre. doi:10.2905/DC0EB21D-472C-4F5A-8846-823C50836305',
    },
    ghs_smod: {
      ten: L('GHS-SMOD — the Degree of Urbanisation grid', 'GHS-SMOD — lưới Mức độ đô thị hoá'),
      laGi: L('A class for every grid cell of about 1 km: part of a city, of a town or semi-dense area (three sub-classes), or of a rural area (three sub-classes), or water.', 'Một lớp cho mỗi ô lưới khoảng 1 km: thuộc thành phố, thuộc thị trấn hay vùng bán dày đặc (ba lớp con), thuộc nông thôn (ba lớp con), hoặc mặt nước.'),
      ai: L('European Commission, Joint Research Centre. Release R2023A.', 'Uỷ ban châu Âu, Trung tâm Nghiên cứu Chung. Bản R2023A.'),
      cachLam: L('Thresholds of population density and cluster size are applied to the GHS-POP grid, with the built-up area of GHS-BUILT used to fill gaps.', 'Các ngưỡng mật độ dân và quy mô cụm được áp lên lưới GHS-POP; diện tích xây dựng của GHS-BUILT dùng để lấp chỗ trống.'),
      nenBiet: [
        L('A cell is classified by the people who live there, not by what the land is used for: a dense farming village can be part of an urban cluster.', 'Một ô được xếp lớp theo số người sống ở đó, không theo cách dùng đất: một làng nông nghiệp đông đúc có thể thuộc một cụm đô thị.'),
        L('The grid of 30 arc-seconds used here is the producer’s own version in geographic coordinates of the 1 km grid.', 'Lưới 30 giây cung dùng ở đây là bản toạ độ địa lý do chính đơn vị sản xuất làm từ lưới 1 km.'),
      ],
      nam: L('1975–2030, every 5 years (1990 and 2020 used here)', '1975–2030, 5 năm một mốc (dùng 1990 và 2020)'), doPhanGiai: L('30 arc-seconds (about 1 km)', '30 giây cung (khoảng 1 km)'),
      giayPhep: 'CC BY 4.0', url: 'https://human-settlement.emergency.copernicus.eu/download.php?ds=smod',
      trichDan: 'Schiavina, M., Melchiorri, M., & Pesaresi, M. (2023). GHS-SMOD R2023A. European Commission, Joint Research Centre. doi:10.2905/A0DF7A6F-49DE-46EA-9BDE-563437A6E2BA',
    },
    ntl_harmonized: {
      ten: L('Night-time lights, harmonised DMSP and VIIRS series', 'Ánh sáng ban đêm, chuỗi hài hoà DMSP và VIIRS'),
      laGi: L('The brightness of light at night seen from space, for every year from 1992 to 2024, on one scale from 0 to 63.', 'Độ sáng ban đêm nhìn từ không gian, cho từng năm từ 1992 đến 2024, trên một thang từ 0 đến 63.'),
      ai: L('Li, Zhou, Zhao and Zhao (2020), updated by the authors; published on figshare.', 'Li, Zhou, Zhao và Zhao (2020), được các tác giả cập nhật; công bố trên figshare.'),
      cachLam: L('Yearly images of the DMSP satellites (1992–2013) are calibrated against each other; images of the VIIRS instrument (from 2014) are converted to the DMSP scale with a model fitted to the years when both flew.', 'Ảnh hằng năm của vệ tinh DMSP (1992–2013) được hiệu chỉnh cho khớp nhau; ảnh của thiết bị VIIRS (từ 2014) được quy về thang DMSP bằng một mô hình khớp trên những năm cả hai cùng bay.'),
      nenBiet: [
        L('The DMSP sensor saturates in bright centres (value 63), so a city centre cannot grow brighter in these data.', 'Cảm biến DMSP bão hoà ở các trung tâm sáng (giá trị 63), nên trong dữ liệu này trung tâm thành phố không thể sáng thêm.'),
        L('The two instruments are joined between 2013 and 2014; growth measured across that join should be checked with another source.', 'Hai thiết bị được nối giữa 2013 và 2014; tăng trưởng đo qua chỗ nối cần được kiểm bằng một nguồn khác.'),
        L('Light measures electricity use and brightness as well as urban land.', 'Ánh sáng đo cả mức dùng điện và độ sáng, không chỉ đất đô thị.'),
      ],
      nam: L('1992–2024, every year', '1992–2024, mỗi năm'), doPhanGiai: L('30 arc-seconds, shown at 1 arc-minute', '30 giây cung, hiển thị ở 1 phút cung'),
      giayPhep: 'CC BY 4.0', url: 'https://doi.org/10.6084/m9.figshare.9828827',
      trichDan: 'Li, X., Zhou, Y., Zhao, M., & Zhao, X. (2020). A harmonized global nighttime light dataset 1992–2018. Scientific Data, 7, 168. doi:10.1038/s41597-020-0510-y',
    },
    geoboundaries: {
      ten: L('Boundaries of Vietnam and its provinces (geoBoundaries)', 'Ranh giới Việt Nam và các tỉnh (geoBoundaries)'),
      laGi: L('The outline of the country and of its 63 provinces before the mergers of 2025.', 'Đường ranh cả nước và 63 tỉnh trước khi sáp nhập năm 2025.'),
      ai: L('geoBoundaries project, William & Mary (Runfola et al. 2020).', 'Dự án geoBoundaries, Đại học William & Mary (Runfola và cộng sự 2020).'),
      cachLam: L('Compiled from open sources and checked by the project; the country outline follows the coast.', 'Tổng hợp từ các nguồn mở và được dự án kiểm tra; ranh cả nước đi theo bờ biển.'),
      nenBiet: [
        L('Used only to decide which grid cells are in Vietnam and in which region; offshore islands far from the coast are not part of the maps.', 'Chỉ dùng để xác định ô lưới nào thuộc Việt Nam và thuộc vùng nào; các đảo xa bờ không có trên bản đồ.'),
      ],
      nam: L('2016 (country), 2008 (provinces)', '2016 (cả nước), 2008 (tỉnh)'), doPhanGiai: L('vector outlines', 'đường ranh vector'),
      giayPhep: 'CC BY 4.0', url: 'https://www.geoboundaries.org',
      trichDan: 'Runfola, D., et al. (2020). geoBoundaries: A global database of political administrative boundaries. PLoS ONE, 15(4), e0231866.',
    },
    nen_ban_do: {
      ten: L('Base map', 'Nền bản đồ'),
      laGi: L('Water bodies and main roads, drawn in pale colours behind the data.', 'Mặt nước và đường chính, vẽ màu nhạt phía sau dữ liệu.'),
      ai: L('OpenFreeMap, serving OpenStreetMap data (© OpenStreetMap contributors).', 'OpenFreeMap, phục vụ dữ liệu OpenStreetMap (© những người đóng góp OpenStreetMap).'),
      cachLam: L('Loaded from the internet when the page opens; if there is no connection, the data layers still appear on a grey background.', 'Nạp từ internet khi mở trang; nếu mất mạng, các lớp dữ liệu vẫn hiện trên nền xám.'),
      nenBiet: [], nam: L('current', 'hiện hành'), doPhanGiai: L('vector tiles', 'ô vector'),
      giayPhep: 'ODbL 1.0', url: 'https://openfreemap.org', trichDan: 'OpenFreeMap · © OpenStreetMap contributors',
    },
  };

  /* "About this data" block under a figure: <div class="about-data" data-sources="ghs_pop ghs_ucdb" data-script="kich_ban/…"> */
  K.veVeDuLieu = function (goc) {
    const L2 = (x) => (typeof x === 'string' ? x : x[K.lang]);
    (goc || document).querySelectorAll('.about-data[data-sources]').forEach((host) => {
      const ids = host.dataset.sources.split(/\s+/).filter(Boolean);
      const thieu = ids.filter((id) => !K.nguonMoTa[id]);
      if (thieu.length) { host.textContent = '⚠ ' + thieu.join(', '); host.classList.add('missing'); return; }
      const nhan = { laGi: K.t('What it is', 'Đây là gì'), ai: K.t('Produced by', 'Ai làm'), cachLam: K.t('How it is made', 'Làm thế nào'),
        nenBiet: K.t('What you should know about this data', 'Điều nên biết về dữ liệu này'), nam: K.t('Years', 'Năm'), dp: K.t('Resolution', 'Độ phân giải'),
        gp: K.t('Licence', 'Giấy phép'), td: K.t('Citation', 'Trích dẫn'), xl: K.t('What this course did with it', 'Học phần đã xử lý thế nào') };
      const tieuDe = K.t('About the data in this figure', 'Về dữ liệu trong hình này');
      host.innerHTML = '<details><summary>' + tieuDe + ' <span>(' + ids.map((id) => L2(K.nguonMoTa[id].ten)).join(' · ') + ')</span></summary>' +
        ids.map((id) => { const n = K.nguonMoTa[id];
          return '<section><h5>' + L2(n.ten) + '</h5><dl>' +
            '<dt>' + nhan.laGi + '</dt><dd>' + L2(n.laGi) + '</dd>' +
            '<dt>' + nhan.ai + '</dt><dd>' + L2(n.ai) + '</dd>' +
            '<dt>' + nhan.cachLam + '</dt><dd>' + L2(n.cachLam) + '</dd>' +
            (n.nenBiet.length ? '<dt>' + nhan.nenBiet + '</dt><dd><ul>' + n.nenBiet.map((b) => '<li>' + L2(b) + '</li>').join('') + '</ul></dd>' : '') +
            '<dt>' + nhan.nam + ' · ' + nhan.dp + '</dt><dd>' + L2(n.nam) + ' · ' + L2(n.doPhanGiai) + '</dd>' +
            '<dt>' + nhan.gp + '</dt><dd><a href="' + n.url + '">' + L2(n.giayPhep) + '</a></dd>' +
            '<dt>' + nhan.td + '</dt><dd class="cite">' + n.trichDan + '</dd></dl></section>'; }).join('') +
        (host.dataset.script ? '<p class="proc"><b>' + nhan.xl + ':</b> ' + (host.dataset.note ? host.dataset.note + ' ' : '') + K.t('Script', 'Kịch bản') + ' <code>' + host.dataset.script + '</code>.</p>' : '') +
        '</details>';
    });
  };
})();
