import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  FileText,
  ShieldCheck,
  Flag,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PARTY_SAMPLE_DOCUMENTS, SamplePartyDocument } from '../data/partyHandbook';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentText?: string;
  onApplyReference?: (text: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentText,
  onApplyReference,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    PARTY_SAMPLE_DOCUMENTS[0].id
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Determine current document
  const currentPreset = PARTY_SAMPLE_DOCUMENTS.find((p) => p.id === selectedPresetId);
  const activeTitle = documentTitle || currentPreset?.title || 'Văn Bản Đảng Chuẩn Hướng Dẫn 05-HD/VPTW';
  const activeContent = documentText || currentPreset?.rawText || '';

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 15mm 20mm 25mm; /* Chuẩn thể thức Đảng: Trên 20, Dưới 20, Phải 15, Trái 25 */
            }
            body {
              font-family: "Times New Roman", Times, serif;
              font-size: 14pt;
              line-height: 1.4;
              color: #000;
              margin: 0;
              padding: 10px;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .header-table td {
              vertical-align: top;
            }
            .org-cell {
              width: 45%;
              text-align: center;
              font-size: 12pt;
              font-weight: bold;
            }
            .motto-cell {
              width: 55%;
              text-align: center;
            }
            .motto-country {
              font-size: 11pt;
              font-weight: bold;
              text-transform: uppercase;
            }
            .motto-party {
              font-size: 13pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 4px;
            }
            .motto-line {
              width: 160px;
              height: 1px;
              background-color: #000;
              margin: 4px auto 8px auto;
            }
            .place-date {
              font-style: italic;
              font-size: 13pt;
              margin-top: 6px;
            }
            .doc-type {
              text-align: center;
              font-size: 15pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 25px;
            }
            .doc-subject {
              text-align: center;
              font-size: 14pt;
              font-weight: bold;
              margin: 8px 0 25px 0;
            }
            .content {
              text-align: justify;
              text-indent: 1.27cm;
              white-space: pre-wrap;
              font-size: 13.5pt;
            }
            .footer-info {
              margin-top: 35px;
              display: flex;
              justify-content: space-between;
            }
            .recipient {
              font-size: 11pt;
              font-style: italic;
              width: 45%;
            }
            .signer {
              text-align: center;
              width: 45%;
              font-size: 13pt;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="content">${activeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTitle.replace(/[\/\\?%*:|"<>]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-red-900/60 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-red-950 via-slate-950 to-stone-950 px-5 py-3.5 border-b border-red-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-900 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide truncate max-w-md">
                  XEM TRƯỚC VĂN BẢN PDF CHUẨN THỂ THỨC ĐẢNG (2026)
                </span>
                <span className="bg-red-800/80 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-amber-500/30">
                  A4 • HD 05-HD/VPTW
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {activeTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs text-stone-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              title="In ra giấy hoặc Lưu dưới dạng file PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>In / Lưu PDF</span>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-stone-200 rounded-lg text-xs font-medium border border-slate-700 transition"
              title="Sao chép toàn bộ văn bản"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Picker Bar (if viewing sample references) */}
        {!documentText && (
          <div className="bg-slate-950 px-5 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-stone-400 font-semibold shrink-0 flex items-center gap-1">
              <Flag className="w-3 h-3 text-red-500" />
              Chọn mẫu PDF tham khảo:
            </span>
            {PARTY_SAMPLE_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedPresetId(doc.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedPresetId === doc.id
                    ? 'bg-red-700 text-white shadow-xs font-bold border border-red-500'
                    : 'bg-slate-800/80 text-stone-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                }`}
              >
                {doc.type}: {doc.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        )}

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-stone-800/90 overflow-y-auto p-4 sm:p-8 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150 ease-out"
          >
            {/* The A4 Simulation Sheet */}
            <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl p-[20mm_15mm_20mm_25mm] font-serif text-[14pt] leading-[1.4] relative border border-stone-300">
              {/* Official Seal / Watermark hint */}
              <div className="absolute top-8 right-8 pointer-events-none opacity-5">
                <div className="w-32 h-32 rounded-full border-4 border-red-700 flex items-center justify-center text-red-700 text-4xl font-black">
                  ★
                </div>
              </div>

              {/* Standard Header layout according to Huong dan 05-HD/VPTW */}
              <div className="border-b border-stone-200/50 pb-4 mb-4">
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <div className="w-1/2 text-center font-bold text-slate-900 uppercase tracking-tight">
                    <p className="text-xs">CƠ QUAN / CẤP ỦY ĐẢNG</p>
                    <p className="text-[11px] text-stone-600 font-normal">HỆ THỐNG VĂN BẢN ĐẢNG 2026</p>
                    <div className="w-16 h-[0.5px] bg-black mx-auto mt-1 mb-1"></div>
                    <p className="text-[11px] font-normal italic">Căn cứ: Hướng dẫn 05-HD/VPTW</p>
                  </div>
                  <div className="w-1/2 text-center">
                    <p className="font-bold text-xs uppercase tracking-tight">ĐỘC LẬP - TỰ DO - HẠNH PHÚC</p>
                    <p className="font-bold text-sm text-red-950 uppercase mt-0.5">ĐẢNG CỘNG SẢN VIỆT NAM</p>
                    <div className="w-24 h-[1px] bg-red-900 mx-auto mt-1 mb-1"></div>
                    <p className="text-xs italic text-stone-700 mt-1">Ngày 27 tháng 5 năm 2026</p>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="font-['Times_New_Roman',serif] text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-red-100">
                {activeContent}
              </div>

              {/* PDF Footer Rule */}
              <div className="mt-16 pt-3 border-t border-stone-300 flex items-center justify-between text-[11px] text-stone-500 font-sans">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Chuẩn Hướng dẫn số 05-HD/VPTW (27/5/2026) & Quy định 399-QĐ/TW
                </span>
                <span>Trang 1/1 • Khổ chuẩn A4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>Khổ A4 chuẩn thể thức văn bản Đảng • Căn lề Trái 25mm, Phải 15mm, Trên 20mm, Dưới 20mm</span>
          </div>

          <div className="flex items-center gap-2.5">
            {onApplyReference && (
              <button
                onClick={() => {
                  onApplyReference(activeContent);
                  onClose();
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Nạp văn bản này vào ô tham khảo</span>
              </button>
            )}
            <button
              onClick={handleDownloadTxt}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-stone-200 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file văn bản (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
