import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Type,
  Layout,
  Flag,
  Search,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  FileCheck2,
  BookmarkCheck,
  Printer,
  Download,
  Eye,
} from 'lucide-react';
import {
  PARTY_TYPOGRAPHY_RULES,
  PARTY_CAPITALIZATION_RULES,
  PARTY_DOCUMENT_TYPES_CATALOG,
  PARTY_SAMPLE_DOCUMENTS,
} from '../data/partyHandbook';
import { PdfViewerModal } from './PdfViewerModal';

export const HandbookTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'rules2026' | 'typography' | 'capitalization' | 'layout' | 'types' | 'pdfLibrary'>('rules2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<{ title: string; text: string } | null>(null);

  const filteredTypography = PARTY_TYPOGRAPHY_RULES.filter(
    (item) =>
      item.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fontStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCapitalization = PARTY_CAPITALIZATION_RULES.filter(
    (item) =>
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.examples.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocTypes = PARTY_DOCUMENT_TYPES_CATALOG.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-2 border border-red-200">
              <Flag className="w-3.5 h-3.5" />
              <span>Cẩm Nang Nghiệp Vụ Văn Thư Khối Cơ Quan Đảng Năm 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tra Cứu Thể Thức & Kỹ Thuật Trình Bày Văn Bản Đảng
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Căn cứ theo <strong>Hướng dẫn số 05-HD/VPTW ngày 27/5/2026</strong> của Văn phòng Trung ương Đảng và <strong>Quy định số 399-QĐ/TW ngày 09/01/2026</strong> của Ban Bí thư.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thành phần, cỡ chữ, quy tắc..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent bg-slate-50 text-slate-800"
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSection('rules2026')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeSection === 'rules2026'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Điểm Mới HD 05-HD/VPTW (2026)</span>
          </button>

          <button
            onClick={() => setActiveSection('typography')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeSection === 'typography'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-amber-300" />
            <span>Phông Chữ & Cỡ Chữ Chuẩn</span>
          </button>

          <button
            onClick={() => setActiveSection('capitalization')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeSection === 'capitalization'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Quy Tắc Viết Hoa Trong Đảng</span>
          </button>

          <button
            onClick={() => setActiveSection('layout')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeSection === 'layout'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5 text-amber-300" />
            <span>Sơ Đồ Bố Cục Trang A4</span>
          </button>

          <button
            onClick={() => setActiveSection('types')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeSection === 'types'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>12 Thể Loại Văn Bản Đảng (QĐ 399)</span>
          </button>

          <button
            onClick={() => setActiveSection('pdfLibrary')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeSection === 'pdfLibrary'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 font-bold'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-red-600" />
            <span>Tủ File PDF Mẫu Tham Khảo (2026)</span>
            <span className="bg-red-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              PDF
            </span>
          </button>
        </div>
      </div>

      {/* Section: Điểm Mới HD 05-HD/VPTW 2026 */}
      {activeSection === 'rules2026' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-stone-900 rounded-2xl p-6 text-white border border-red-800/60 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-400/30 uppercase tracking-wide">
                Văn Bản Quy Phạm Cốt Lõi Năm 2026
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">
              Hướng Dẫn Số 05-HD/VPTW Ngày 27/5/2026 Của Văn Phòng Trung Ương Đảng
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-4xl leading-relaxed">
              Văn bản quy định thể thức và kỹ thuật trình bày văn bản Đảng chính thức hiện hành, đồng thời cụ thể hóa Quy định số 399-QĐ/TW ngày 09/01/2026 của Ban Bí thư về thể loại, thẩm quyền ban hành và thể thức văn bản của Đảng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Tiêu Ngữ Đảng Bắt Buộc</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dòng trên cùng góc bên phải bắt buộc là <strong className="text-red-700">ĐẢNG CỘNG SẢN VIỆT NAM</strong> (in hoa, đậm, cỡ 12-13pt). Phía dưới là ngày tháng năm ban hành văn bản.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tiêu ngữ chuẩn mực bắt buộc trên tất cả văn bản, văn kiện của Đảng.</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Số & Ký Hiệu Văn Bản Đảng</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Định dạng chuẩn: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-700 font-bold font-mono">Số: [số]-[loại]/[cơ quan]</code>. Bắt buộc dùng dấu gạch nối (-) giữa số thứ tự và tên viết tắt thể loại.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-semibold">Ví dụ đúng: </span>
                <span>Số: 05-HD/VPTW, Số: 16-NQ/TU, Số: 20-CV/VPTW, Số: 45-QĐ/HU.</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Thẩm Quyền Ký Đúng Chuẩn</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Văn bản của Cấp ủy phải do Bí thư hoặc Phó Bí thư ký thay mặt: <strong className="text-slate-800">T/M BAN THƯỜNG VỤ</strong> hoặc <strong className="text-slate-800">T/M ĐẢNG ỦY</strong>.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Không dùng chức danh Chủ tịch, Giám đốc ký văn bản của Đảng.</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Tích Hợp Ký Số Điện Tử</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hướng dẫn 05-HD/VPTW tích hợp sâu rộng chứng thư số chuyên dùng của Ban Cơ yếu Chính phủ cho người có thẩm quyền và chứng thư số tổ chức Đảng.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span>Văn bản điện tử có giá trị pháp lý tương đương văn bản giấy gốc.</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                5
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Phông Chữ Unicode Tiêu Chuẩn</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trình bày chuẩn trên font Times New Roman (Unicode TCVN 6909:2001), cỡ chữ từ 13pt đến 14pt cho phần nội dung, căn đều hai bên (justify).
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span>Lề trên & dưới: 20-25mm; Lề trái: 30-35mm; Lề phải: 15-20mm.</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                6
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Văn Phong Chính Luận Đảng</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tính tư tưởng, tính chỉ đạo, tính giáo dục và tính chiến đấu cao. Tuân thủ nghiêm ngặt nguyên tắc tập trung dân chủ và hệ thống thuật ngữ Đảng.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span>Không dùng khẩu ngữ, ngôn ngữ cảm tính hay từ vựng tùy tiện.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Typography */}
      {activeSection === 'typography' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Bảng Tổng Hợp Kiểu Chữ, Cỡ Chữ & Vị Trí Văn Bản Đảng Theo Hướng Dẫn 05-HD/VPTW
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Font chuẩn Unicode Times New Roman
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-100/70 text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-1/4">Thành phần thể thức</th>
                  <th className="py-3 px-4 w-1/4">Nội dung quy định</th>
                  <th className="py-3 px-4 w-1/4">Kiểu chữ & Cỡ chữ (pt)</th>
                  <th className="py-3 px-4">Quy cách & Vị trí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-admin">
                {filteredTypography.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 text-[13px]">{rule.element}</td>
                    <td className="py-3 px-4 text-red-900 font-bold text-[13px]">{rule.rule}</td>
                    <td className="py-3 px-4 font-sans text-xs">
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                        {rule.fontStyle}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-relaxed font-sans text-xs">
                      <div>
                        <strong className="text-slate-800">{rule.position}: </strong>
                        <span>{rule.notes}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section: Capitalization */}
      {activeSection === 'capitalization' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCapitalization.map((rule, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{rule.category}</h4>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                <strong className="text-slate-800">Quy tắc chuẩn: </strong>
                {rule.rule}
              </p>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Ví dụ viết ĐÚNG trong văn kiện Đảng:
                </span>
                <p className="font-semibold text-emerald-950 font-admin text-[13.5px] bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/60">
                  {rule.examples}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section: Layout A4 */}
      {activeSection === 'layout' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Sơ Đồ Bố Trí Trang Khổ Giấy A4 Văn Bản Cơ Quan Đảng Theo Hướng Dẫn 05-HD/VPTW
            </h3>
            <p className="text-xs text-slate-500">
              Kích thước chuẩn khổ A4: 210mm x 297mm. Căn lề chuẩn văn bản Đảng: Lề trên 20-25mm, lề dưới 20-25mm, lề trái 30-35mm, lề phải 15-20mm.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-stone-100 p-6 sm:p-10 rounded-2xl border border-stone-300 shadow-inner flex justify-center">
            {/* Simulated A4 Page */}
            <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md border border-stone-300 font-admin text-slate-900 space-y-6 text-xs leading-relaxed text-justify">
              {/* Header Grid */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-200">
                {/* Top-left: Issuing Org */}
                <div className="space-y-1">
                  <p className="uppercase font-normal text-stone-700 text-[11px] leading-tight">
                    [TÊN CẤP ỦY CẤP TRÊN]
                  </p>
                  <p className="font-bold uppercase text-stone-900 text-[11.5px] leading-tight">
                    [TÊN CƠ QUAN ĐẢNG BAN HÀNH]
                  </p>
                  <p className="text-center w-12 text-stone-500 font-bold">*</p>
                  <p className="text-[11.5px] pt-1">
                    Số: [số]-[thể loại]/[cơ quan]
                  </p>
                </div>

                {/* Top-right: Party Motto */}
                <div className="text-center space-y-1">
                  <p className="font-bold uppercase text-red-800 text-[12px] tracking-wide">
                    ĐẢNG CỘNG SẢN VIỆT NAM
                  </p>
                  <p className="italic text-stone-600 text-[12px]">
                    [Địa danh], ngày ... tháng ... năm ...
                  </p>
                  <p className="text-[10px] text-amber-700 font-sans font-semibold pt-1">
                    (Tuyệt đối không dùng Quốc hiệu)
                  </p>
                </div>
              </div>

              {/* Title & Subject */}
              <div className="text-center space-y-1.5 py-2">
                <h4 className="font-bold uppercase text-sm sm:text-base tracking-wide text-red-900">
                  [TÊN LOẠI VĂN BẢN ĐẢNG]
                </h4>
                <p className="font-bold text-[12.5px] text-stone-800">
                  [Trích yếu nội dung văn bản]
                </p>
                <div className="w-20 mx-auto border-t border-stone-800 pt-1"></div>
              </div>

              {/* Body */}
              <div className="space-y-2 text-stone-800 text-[12.5px]">
                <p className="italic text-stone-600">
                  - Căn cứ Điều lệ Đảng Cộng sản Việt Nam;
                </p>
                <p className="italic text-stone-600">
                  - Căn cứ Quy định số 399-QĐ/TW ngày 09/01/2026 của Ban Bí thư;
                </p>
                <p className="leading-relaxed">
                  [Nội dung văn bản: được trình bày thành các phần (I, II, III), mục (1, 2, 3), điều, khoản, điểm rõ ràng, súc tích, mang tính chính luận và chỉ đạo cao theo chuẩn Hướng dẫn 05-HD/VPTW]...
                </p>
              </div>

              {/* Footer Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-200 items-start">
                {/* Recipients */}
                <div className="text-[10.5px] text-stone-700 space-y-0.5">
                  <p className="font-bold italic text-stone-900 text-[11px]">Nơi nhận:</p>
                  <p>- Thường trực Cấp ủy;</p>
                  <p>- Các ban xây dựng Đảng;</p>
                  <p>- Các chi bộ, đảng bộ trực thuộc;</p>
                  <p>- Lưu: Văn thư.</p>
                </div>

                {/* Signer */}
                <div className="text-center space-y-1">
                  <p className="font-bold uppercase text-[11.5px] text-stone-900">
                    T/M BAN THƯỜNG VỤ
                  </p>
                  <p className="font-bold uppercase text-[11px] text-stone-800">
                    BÍ THƯ
                  </p>
                  <div className="h-10 flex items-center justify-center text-[10px] text-stone-400 italic">
                    (Chữ ký số / Chữ ký tay & Đóng dấu Đảng)
                  </div>
                  <p className="font-bold text-[12px] text-stone-900">
                    [Họ và tên người ký]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: 12 Thể Loại Văn Bản Đảng (Quy định 399-QĐ/TW) */}
      {activeSection === 'types' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Danh Mục Thể Loại Văn Bản Đảng Theo Quy Định Số 399-QĐ/TW Ngày 09/01/2026 Của Ban Bí Thư
            </span>
            <span className="text-xs text-slate-500 font-medium">
              12 Thể loại văn bản chính thức
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredDocTypes.map((t, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-900 font-mono font-bold text-xs shrink-0 border border-red-200">
                    {t.code}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-slate-600 mt-0.5">{t.desc}</p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block font-medium">Thẩm quyền ban hành:</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {t.authority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Tủ File PDF Mẫu Tham Khảo Chuẩn Hướng Dẫn 05-HD/VPTW 2026 */}
      {activeSection === 'pdfLibrary' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-stone-900 rounded-2xl p-6 text-white border border-red-800/60 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-400/30 uppercase tracking-wide">
                Hồ Sơ Mẫu & Tệp PDF Chuẩn Năm 2026
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">
              Bộ Văn Bản Mẫu Khối Đảng Trực Quan Khổ A4 (PDF & In Ấn)
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-4xl leading-relaxed">
              Tất cả các văn bản dưới đây đều được chuẩn hóa 100% theo tiêu chuẩn <strong>Hướng dẫn số 05-HD/VPTW ngày 27/5/2026</strong> và <strong>Quy định số 399-QĐ/TW</strong>. Cán bộ và chuyên viên có thể xem trực quan theo khổ giấy A4, sao chép hoặc in/lưu thành file PDF ngay lập tức.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTY_SAMPLE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-900 font-bold text-xs border border-red-200">
                      {doc.type}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ★ Chuẩn 05-HD/VPTW 2026
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{doc.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{doc.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <span className="text-[11px] text-slate-400">Khổ A4 • Căn lề chuẩn</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPdfDoc({ title: doc.title, text: doc.rawText })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-800 hover:bg-red-900 transition shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>Xem & In PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={!!selectedPdfDoc}
        onClose={() => setSelectedPdfDoc(null)}
        documentTitle={selectedPdfDoc?.title}
        documentText={selectedPdfDoc?.text}
      />
    </div>
  );
};
