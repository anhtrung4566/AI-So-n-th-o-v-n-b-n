/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cẩm nang & Dữ liệu Chuẩn Thể thức Văn bản của Đảng (Mới nhất năm 2026)
 * Căn cứ pháp lý cốt lõi:
 * - Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng về thể thức và kỹ thuật trình bày văn bản của Đảng.
 * - Quy định số 399-QĐ/TW ngày 09/01/2026 của Ban Bí thư Trung ương Đảng về thể loại, thẩm quyền ban hành và thể thức văn bản của Đảng.
 */

export interface SamplePartyDocument {
  id: string;
  title: string;
  type: string;
  description: string;
  rawText: string;
}

export const PARTY_SAMPLE_DOCUMENTS: SamplePartyDocument[] = [
  {
    id: 'sample-dang-hd05',
    title: 'Hướng dẫn 05-HD/VPTW của Văn phòng Trung ương Đảng (Chuẩn gốc 2026)',
    type: 'Hướng dẫn',
    description: 'Văn bản mẫu chuẩn mực 100% theo Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng.',
    rawText: `BAN CHẤP HÀNH TRUNG ƯƠNG              ĐẢNG CỘNG SẢN VIỆT NAM
VĂN PHÒNG                             Hà Nội, ngày 27 tháng 5 năm 2026
*
Số: 05-HD/VPTW

                               HƯỚNG DẪN
             thể thức và kỹ thuật trình bày văn bản của Đảng
                                -----

Thực hiện Quy định số 399-QĐ/TW, ngày 09/01/2026 của Ban Bí thư Trung ương Đảng về thể loại, thẩm quyền ban hành và thể thức văn bản của Đảng, Văn phòng Trung ương Đảng hướng dẫn thể thức và kỹ thuật trình bày văn bản của Đảng như sau:

I. QUY ĐỊNH CHUNG
1. Phạm vi điều chỉnh và đối tượng áp dụng
Hướng dẫn này quy định về thể thức, kỹ thuật trình bày văn bản giấy và văn bản điện tử của các cơ quan, tổ chức đảng từ Trung ương đến cơ sở.

2. Tiêu chuẩn phông chữ và kỹ thuật số
Văn bản của Đảng được trình bày trên khổ giấy A4, phông chữ tiếng Việt chuẩn Unicode (Times New Roman), căn lề trang chuẩn xác và tích hợp chữ ký số chứng thư chuyên dùng của Ban Cơ yếu Chính phủ.

II. CÁC THÀNH PHẦN THỂ THỨC BẮT BUỘC
1. Tiêu ngữ Đảng: "ĐẢNG CỘNG SẢN VIỆT NAM" đặt ở góc trên bên phải, in hoa, đậm, cỡ chữ 12-13.
2. Số và ký hiệu văn bản: Số: [số]-[thể loại]/[cơ quan Đảng]. Dùng dấu gạch nối (-) trước tên loại văn bản.

Nơi nhận:
- Thường trực Ban Bí thư (để b/c);
- Các tỉnh ủy, thành ủy, đảng ủy trực thuộc Trung ương;
- Các ban đảng, ban cán sự đảng, đảng đoàn ở Trung ương;
- Lưu: Văn thư.

                                                       CHÁNH VĂN PHÒNG
                                                           (Đã ký số)
                                                        Nguyễn Duy Ngọc`
  },
  {
    id: 'sample-dang-nghiquyet-chuan',
    title: 'Nghị quyết của Ban Chấp hành Đảng bộ Tỉnh (Số 16-NQ/TU)',
    type: 'Nghị quyết',
    description: 'Nghị quyết lãnh đạo phát triển kinh tế - xã hội và xây dựng Đảng chuẩn mực theo Hướng dẫn 05 và Quy định 399.',
    rawText: `TỈNH ỦY NGHỆ AN                       ĐẢNG CỘNG SẢN VIỆT NAM
BAN CHẤP HÀNH                         Nghệ An, ngày 18 tháng 6 năm 2026
*
Số: 16-NQ/TU

                              NGHỊ QUYẾT
   Về nâng cao năng lực lãnh đạo và sức chiến đấu của tổ chức cơ sở đảng
            gắn với xây dựng hệ thống chính trị vững mạnh giai đoạn 2026 - 2030
                                -----

Thực hiện Nghị quyết Đại hội đại biểu toàn quốc lần thứ XIV của Đảng và Nghị quyết Đại hội đại biểu Đảng bộ tỉnh lần thứ XX, Ban Chấp hành Đảng bộ tỉnh quyết nghị:

I. QUAN ĐIỂM CHỈ ĐẠO
1. Tổ chức cơ sở đảng là nền tảng của Đảng, là hạt nhân chính trị ở cơ sở, giữ vai trò lãnh đạo toàn diện trong việc thực hiện đường lối, chủ trương của Đảng.
2. Nâng cao chất lượng sinh hoạt chi bộ, thực hiện nghiêm nguyên tắc tập trung dân chủ, tự phê bình và phê bình.

II. MỤC TIÊU ĐẾN NĂM 2030
- 100% bí thư chi bộ được bồi dưỡng, tập huấn nghiệp vụ công tác Đảng theo Hướng dẫn 05-HD/VPTW.
- Hằng năm có trên 90% tổ chức cơ sở đảng hoàn thành tốt nhiệm vụ trở lên.

III. TỔ CHỨC THỰC HIỆN
1. Các huyện ủy, thành ủy, thị ủy, đảng ủy trực thuộc quán triệt sâu rộng Nghị quyết này đến từng chi bộ.
2. Ban Tổ chức Tỉnh ủy chủ trì, phối hợp với các ban Đảng tham mưu kế hoạch kiểm tra, giám sát hằng năm.

Nơi nhận:
- Thường trực Ban Bí thư (để b/c);
- Ban Tổ chức Trung ương;
- Các ban xây dựng Đảng Tỉnh ủy;
- Các cấp ủy trực thuộc Tỉnh ủy;
- Lưu: Văn phòng Tỉnh ủy.

                                                      T/M TỈNH ỦY
                                                        BÍ THƯ
                                                       (Đã ký)
                                                     Thái Thanh Quý`
  },
  {
    id: 'sample-dang-quyetdinh-chuan',
    title: 'Quyết định của Ban Thường vụ Huyện ủy (Số 58-QĐ/HU)',
    type: 'Quyết định',
    description: 'Quyết định kiểm tra công tác xây dựng Đảng và quản lý đảng viên chuẩn mực thể thức Hướng dẫn 05-HD/VPTW.',
    rawText: `HUYỆN ỦY NAM ĐÀN                      ĐẢNG CỘNG SẢN VIỆT NAM
BAN THƯỜNG VỤ                         Nam Đàn, ngày 10 tháng 8 năm 2026
*
Số: 58-QĐ/HU

                              QUYẾT ĐỊNH
      về việc thành lập Đoàn kiểm tra việc lãnh đạo, chỉ đạo công tác
             phát triển đảng viên tại các Đảng bộ xã vùng bán sơn địa
                                -----

- Căn cứ Điều lệ Đảng Cộng sản Việt Nam;
- Căn cứ Quy chế làm việc của Ban Chấp hành Đảng bộ huyện nhiệm kỳ 2025 - 2030;
- Căn cứ Chương trình kiểm tra, giám sát năm 2026 của Ban Thường vụ Huyện ủy;
- Xét đề nghị của Cơ quan Ủy ban Kiểm tra Huyện ủy,

                      BAN THƯỜNG VỤ QUYẾT ĐỊNH:

Điều 1. Thành lập Đoàn kiểm tra của Ban Thường vụ Huyện ủy gồm các đồng chí sau:
1. Đồng chí Nguyễn Văn Nam, Ủy viên Ban Thường vụ, Chủ nhiệm UBKT Huyện ủy - Trưởng đoàn.
2. Đồng chí Trần Thị Mai, Phó Trưởng Ban Tổ chức Huyện ủy - Phó Trưởng đoàn.
3. Đồng chí Lê Văn Hùng, Chuyên viên Cơ quan UBKT Huyện ủy - Thư ký đoàn.

Điều 2. Đoàn kiểm tra có nhiệm vụ thẩm tra, xác minh và báo cáo kết quả trước ngày 30 tháng 9 năm 2026.

Điều 3. Văn phòng Huyện ủy, các ban xây dựng Đảng của Huyện ủy, Đảng ủy các xã được kiểm tra và các đồng chí có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này.

Nơi nhận:
- Thường trực Tỉnh ủy (để b/c);
- Cơ quan UBKT Tỉnh ủy;
- Như Điều 3;
- Lưu: Văn phòng Huyện ủy.

                                                 T/M BAN THƯỜNG VỤ
                                                      BÍ THƯ
                                                      (Đã ký)
                                                   Trần Đình Sơn`
  },
  {
    id: 'sample-dang-congvan-chuan',
    title: 'Công văn của Ban Tuyên giáo Tỉnh ủy (Số 34-CV/BTGTU)',
    type: 'Công văn',
    description: 'Công văn Đảng trao đổi công tác, trích yếu sau V/v đặt dưới số ký hiệu chuẩn Hướng dẫn 05-HD/VPTW.',
    rawText: `TỈNH ỦY NGHỆ AN                       ĐẢNG CỘNG SẢN VIỆT NAM
BAN TUYÊN GIÁO                        Nghệ An, ngày 05 tháng 9 năm 2026
*
Số: 34-CV/BTGTU
V/v triệu tập cán bộ tham gia Hội nghị trực tuyến
quán triệt các quy định mới của Trung ương

                                 Kính gửi:
                     - Ban Tuyên giáo các huyện, thành, thị ủy;
                     - Trung tâm chính trị các huyện, thành phố.

Thực hiện Kế hoạch số 45-KH/TU của Ban Thường vụ Tỉnh ủy về quán triệt và triển khai thực hiện các quy định mới của Ban Bí thư Trung ương Đảng năm 2026, Ban Tuyên giáo Tỉnh ủy trân trọng triệu tập:

1. Thành phần tham dự:
- Đồng chí Trưởng ban, Phó Trưởng Ban Tuyên giáo các cấp ủy trực thuộc.
- Toàn thể báo cáo viên cấp tỉnh và giảng viên chuyên trách trung tâm chính trị.

2. Thời gian và hình thức:
- Thời gian: Khai mạc lúc 08 giờ 00 phút, ngày 15 tháng 9 năm 2026 (thứ Ba).
- Hình thức: Trực tuyến từ điểm cầu Tỉnh ủy kết nối đến các điểm cầu cấp huyện.

Đề nghị các đơn vị rà soát danh sách đại biểu và đường truyền kỹ thuật trước ngày 14 tháng 9 năm 2026.

Nơi nhận:
- Thường trực Tỉnh ủy (để b/c);
- Như kính gửi;
- Ban Giám đốc VNPT Nghệ An (phối hợp);
- Lưu: Văn thư Ban.

                                                   TRƯỞNG BAN
                                                     (Đã ký)
                                                  Lê Đình Cường`
  },
  {
    id: 'sample-dang-kehoach-chuan',
    title: 'Kế hoạch của Ban Thường vụ Huyện ủy (Số 22-KH/HU)',
    type: 'Kế hoạch',
    description: 'Kế hoạch triển khai công tác xây dựng Đảng và bồi dưỡng cấp ủy viên cơ sở chuẩn mực Hướng dẫn 05-HD/VPTW.',
    rawText: `HUYỆN ỦY NAM ĐÀN                      ĐẢNG CỘNG SẢN VIỆT NAM
BAN THƯỜNG VỤ                         Nam Đàn, ngày 12 tháng 7 năm 2026
*
Số: 22-KH/HU

                                KẾ HOẠCH
                Tập huấn nghiệp vụ công tác Đảng và thể thức
             văn bản theo Hướng dẫn số 05-HD/VPTW năm 2026
                                -----

Thực hiện Quy định số 399-QĐ/TW của Ban Bí thư và Hướng dẫn số 05-HD/VPTW của Văn phòng Trung ương Đảng, Ban Thường vụ Huyện ủy ban hành Kế hoạch tổ chức tập huấn như sau:

I. MỤC ĐÍCH, YÊU CẦU
1. Nâng cao nhận thức và chuẩn hóa kỹ năng soạn thảo, quản lý văn bản của Đảng cho đội ngũ cán bộ, văn thư cấp ủy cơ sở.
2. 100% cấp ủy cơ sở nắm vững và thực hiện nghiêm túc Hướng dẫn số 05-HD/VPTW ngày 27/5/2026.

II. NỘI DUNG VÀ THỜI GIAN TẬP HUẤN
- Nội dung: Thể thức, kỹ thuật trình bày văn bản Đảng, thẩm quyền ký và tích hợp chữ ký số chuyên dùng.
- Thời gian: Dự kiến 02 ngày, từ ngày 25 đến ngày 26 tháng 8 năm 2026.

III. TỔ CHỨC THỰC HIỆN
- Văn phòng Huyện ủy chủ trì biên soạn tài liệu, chuẩn bị cơ sở vật chất.
- Ban Tổ chức Huyện ủy lập danh sách triệu tập học viên đúng đối tượng.

Nơi nhận:
- Thường trực Tỉnh ủy (để b/c);
- Văn phòng Tỉnh ủy;
- Các chi, đảng bộ trực thuộc Huyện ủy;
- Lưu: Văn phòng Huyện ủy.

                                                 T/M BAN THƯỜNG VỤ
                                                   PHÓ BÍ THƯ
                                                     (Đã ký)
                                                  Nguyễn Văn Hòa`
  },
  {
    id: 'sample-dang-totrinh-chuan',
    title: 'Tờ trình của Ban Tổ chức Tỉnh ủy (Số 19-TTr/BTCTU)',
    type: 'Tờ trình',
    description: 'Tờ trình xin chủ trương của Ban Tổ chức Tỉnh ủy trình Thường trực Tỉnh ủy chuẩn Hướng dẫn 05-HD/VPTW.',
    rawText: `TỈNH ỦY NGHỆ AN                       ĐẢNG CỘNG SẢN VIỆT NAM
BAN TỔ CHỨC                           Nghệ An, ngày 20 tháng 10 năm 2026
*
Số: 19-TTr/BTCTU

                                TỜ TRÌNH
         Về việc bổ sung quy hoạch cán bộ lãnh đạo diện Ban Thường vụ
                 Tỉnh ủy quản lý nhiệm kỳ 2025 - 2030
                                -----

Kính gửi: BAN THƯỜNG VỤ TỈNH ỦY

Căn cứ Điều lệ Đảng Cộng sản Việt Nam;
Căn cứ Quy định số 399-QĐ/TW của Ban Bí thư về thể loại, thẩm quyền ban hành văn bản của Đảng;
Căn cứ Quy chế bổ nhiệm, quy hoạch cán bộ của Tỉnh ủy;
Xét yêu cầu nhiệm vụ công tác cán bộ trong tình hình mới,

Ban Tổ chức Tỉnh ủy kính trình Ban Thường vụ Tỉnh ủy xem xét, phê duyệt bổ sung quy hoạch cán bộ theo các nội dung sau:
1. Kết quả rà soát tiêu chuẩn, điều kiện chính trị của nhân sự đề xuất.
2. Danh sách nhân sự được giới thiệu bổ sung quy hoạch các chức danh chủ chốt.

Kính trình Ban Thường vụ Tỉnh ủy xem xét, quyết định.

Nơi nhận:
- Như kính gửi;
- Đồng chí Bí thư Tỉnh ủy (để b/c);
- Đồng chí Phó Bí thư Thường trực Tỉnh ủy;
- Lưu: Văn thư Ban.

                                                   TRƯỞNG BAN
                                                     (Đã ký)
                                                  Lê Hồng Vinh`
  }
];

export const PARTY_TYPOGRAPHY_RULES = [
  {
    element: 'Tiêu ngữ Đảng',
    rule: 'ĐẢNG CỘNG SẢN VIỆT NAM',
    fontStyle: 'Chữ in hoa, cỡ 12-13, đứng, đậm',
    position: 'Góc trên bên phải trang đầu tiên',
    notes: 'Quy chuẩn bắt buộc theo Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng.'
  },
  {
    element: 'Địa danh & Ngày tháng ban hành',
    rule: 'Địa danh, ngày ... tháng ... năm ...',
    fontStyle: 'Chữ in thường, cỡ 13-14, nghiêng',
    position: 'Đặt dưới Tiêu ngữ Đảng, canh giữa theo dòng Tiêu ngữ',
    notes: 'Ngày < 10, tháng 1, 2 ghi thêm số 0 phía trước. Ví dụ: Hà Nội, ngày 27 tháng 5 năm 2026.'
  },
  {
    element: 'Tên cơ quan ban hành (Cấp trên)',
    rule: 'Tên cấp ủy/tổ chức đảng cấp trên trực tiếp',
    fontStyle: 'Chữ in hoa, cỡ 12-13, đứng, không đậm',
    position: 'Góc trên bên trái, dòng thứ nhất',
    notes: 'Ví dụ: BAN CHẤP HÀNH TRUNG ƯƠNG hoặc TỈNH ỦY NGHỆ AN.'
  },
  {
    element: 'Tên cơ quan ban hành (Trực tiếp)',
    rule: 'Tên cấp ủy/cơ quan ban hành',
    fontStyle: 'Chữ in hoa, cỡ 12-13, đứng, đậm',
    position: 'Góc trên bên trái, dòng thứ hai dưới tên cấp trên',
    notes: 'Ví dụ: VĂN PHÒNG, BAN THƯỜNG VỤ, BAN TỔ CHỨC. Phía dưới có dấu sao (*) hoặc đường kẻ ngắn.'
  },
  {
    element: 'Số và ký hiệu văn bản',
    rule: 'Số: [số]-<chữ viết tắt thể loại>/<chữ viết tắt cơ quan>',
    fontStyle: 'Chữ in thường, từ "Số:" in đứng, cỡ 13',
    position: 'Đặt dưới tên cơ quan ban hành',
    notes: 'Bắt buộc dùng dấu gạch nối (-) trước tên thể loại: Số: 05-HD/VPTW, Số: 16-NQ/TU, Số: 58-QĐ/HU.'
  },
  {
    element: 'Tên loại văn bản',
    rule: 'NGHỊ QUYẾT, QUYẾT ĐỊNH, HƯỚNG DẪN...',
    fontStyle: 'Chữ in hoa, cỡ 14, đứng, đậm',
    position: 'Canh giữa trang',
    notes: 'Theo danh mục thể loại quy định tại Quy định số 399-QĐ/TW ngày 09/01/2026 của Ban Bí thư.'
  },
  {
    element: 'Trích yếu nội dung',
    rule: 'Tóm tắt nội dung văn bản',
    fontStyle: 'Chữ in thường, cỡ 14, đứng, đậm (đối với văn bản có tên loại); hoặc cỡ 12-13 sau V/v (đối với Công văn)',
    position: 'Đặt dưới tên loại văn bản, có đường kẻ ngang nét đơn ngắn (-----)',
    notes: 'Súc tích, phản ánh chính xác mục tiêu và phạm vi điều chỉnh.'
  },
  {
    element: 'Thẩm quyền ký & Chức danh',
    rule: 'T/M BAN BÍ THƯ, T/M BAN THƯỜNG VỤ, T/M ĐẢNG ỦY',
    fontStyle: 'Chữ in hoa, cỡ 13-14, đứng, đậm',
    position: 'Góc dưới bên phải',
    notes: 'Chức danh người ký: BÍ THƯ, PHÓ BÍ THƯ, CHÁNH VĂN PHÒNG, TRƯỞNG BAN.'
  },
  {
    element: 'Nơi nhận',
    rule: 'Nơi nhận: (nghiêng, đậm, cỡ 12), danh sách (cỡ 11)',
    fontStyle: 'Chữ in thường, cỡ 11, đứng; dòng đầu in nghiêng đậm',
    position: 'Góc dưới bên trái cùng hàng hoặc dưới phần chữ ký',
    notes: 'Dòng cuối cùng bắt buộc là "- Lưu: Văn thư,..." hoặc ban chuyên môn lưu trữ.'
  }
];

export const PARTY_CAPITALIZATION_RULES = [
  {
    category: 'Tên tổ chức và cơ quan Đảng',
    rule: 'Viết hoa chữ cái đầu của các từ, cụm từ chỉ loại hình cơ quan, chức năng và cấp hành chính',
    examples: 'Ban Chấp hành Trung ương Đảng, Bộ Chính trị, Ban Bí thư, Ban Tổ chức Trung ương, Tỉnh ủy, Huyện ủy, Đảng ủy khối, Chi bộ.'
  },
  {
    category: 'Chức vụ lãnh đạo cao cấp của Đảng',
    rule: 'Viết hoa chức danh lãnh đạo Đảng',
    examples: 'Tổng Bí thư, Thường trực Ban Bí thư, Ủy viên Bộ Chính trị, Bí thư Tỉnh ủy, Phó Bí thư Thường trực, Bí thư Chi bộ.'
  },
  {
    category: 'Văn kiện và sự kiện chính trị của Đảng',
    rule: 'Viết hoa danh từ riêng chỉ văn kiện nền tảng và đại hội Đảng',
    examples: 'Điều lệ Đảng Cộng sản Việt Nam, Cương lĩnh xây dựng đất nước, Đại hội đại biểu toàn quốc lần thứ XIV của Đảng.'
  },
  {
    category: 'Nguyên tắc sinh hoạt Đảng',
    rule: 'Viết hoa danh từ riêng khi chỉ tên gọi chính thức, viết thường khi dùng làm tính từ trong câu',
    examples: 'Nguyên tắc tập trung dân chủ, tinh thần tự phê bình và phê bình, công tác kiểm tra, giám sát của Đảng.'
  }
];

export const PARTY_DOCUMENT_TYPES_CATALOG = [
  { code: 'NQ', name: 'Nghị quyết', authority: 'Ban Chấp hành, Ban Thường vụ, Đảng ủy, Chi bộ', desc: 'Văn bản quyết nghị các chủ trương, đường lối, nhiệm vụ chính trị quan trọng.' },
  { code: 'QĐ', name: 'Quyết định', authority: 'Cấp ủy, Ban Thường vụ, Thường trực cấp ủy, Ban Đảng', desc: 'Quyết định về nhân sự, tổ chức bộ máy, ban hành quy chế hoặc kỷ luật đảng.' },
  { code: 'HD', name: 'Hướng dẫn', authority: 'Văn phòng Trung ương Đảng, các Ban xây dựng Đảng', desc: 'Hướng dẫn nghiệp vụ chuyên môn, thể thức văn thư, công tác tổ chức, tuyên giáo, kiểm tra.' },
  { code: 'QĐ', name: 'Quy định', authority: 'Ban Bí thư, Bộ Chính trị, Ban Thường vụ cấp ủy', desc: 'Quy định chuẩn mực, chế độ làm việc, tiêu chuẩn đảng viên bắt buộc thực hiện.' },
  { code: 'CT', name: 'Chỉ thị', authority: 'Bộ Chính trị, Ban Bí thư, Ban Thường vụ cấp ủy', desc: 'Chỉ đạo các cấp ủy trực thuộc thực hiện các nhiệm vụ trọng tâm, cấp bách.' },
  { code: 'KH', name: 'Kế hoạch', authority: 'Cấp ủy, Ban Đảng, Văn phòng cấp ủy', desc: 'Kế hoạch tổ chức đại hội, học tập nghị quyết, công tác kiểm tra giám sát.' },
  { code: 'KL', name: 'Kết luận', authority: 'Hội nghị Cấp ủy, Ban Thường vụ, Thường trực cấp ủy', desc: 'Kết luận các nội dung thảo luận tại các kỳ họp định kỳ hoặc chuyên đề.' },
  { code: 'TB', name: 'Thông báo', authority: 'Văn phòng Cấp ủy, Thường trực Cấp ủy', desc: 'Thông báo ý kiến chỉ đạo, phân công công tác hoặc kết quả hội nghị.' },
  { code: 'TTr', name: 'Tờ trình', authority: 'Các ban Đảng, cấp ủy cấp dưới', desc: 'Trình cấp ủy, Ban Thường vụ phê duyệt chủ trương, đề án, quy chế hoặc nhân sự.' },
  { code: 'CV', name: 'Công văn', authority: 'Cấp ủy, Văn phòng, các Ban xây dựng Đảng', desc: 'Văn bản trao đổi công việc, chỉ đạo chuyên môn hành chính thường xuyên.' },
  { code: 'BC', name: 'Báo cáo', authority: 'Cấp ủy, cơ quan Đảng các cấp', desc: 'Báo cáo tổng kết công tác xây dựng Đảng, báo cáo chuyên đề, sơ kết quý/năm.' },
  { code: 'BB', name: 'Biên bản', authority: 'Chi bộ, Hội nghị Cấp ủy, Ban Thường vụ', desc: 'Ghi chép diễn biến, ý kiến thảo luận và kết luận tại các cuộc họp của Đảng.' }
];
