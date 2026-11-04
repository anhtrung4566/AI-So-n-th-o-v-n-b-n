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
  Maximize2,
  Eye,
  Sliders
} from 'lucide-react';
import { PARTY_SAMPLE_DOCUMENTS, SamplePartyDocument } from '../data/partyHandbook';
import { PartyLogoConfig } from '../types';
import {
  PartyLogoDisplay,
  PartyWatermarkDisplay,
  DEFAULT_LOGO_CONFIG,
  PartyEmblemSvg,
  EditablePartyLogoSpot,
  PartyLogoModal
} from './PartyLogo';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentText?: string;
  logoConfig?: PartyLogoConfig;
  onLogoConfigChange?: (config: PartyLogoConfig) => void;
  onApplyReference?: (text: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentText,
  logoConfig: initialLogoConfig,
  onLogoConfigChange,
  onApplyReference,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    PARTY_SAMPLE_DOCUMENTS[0].id
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [modalLogoConfig, setModalLogoConfig] = useState<PartyLogoConfig>(
    initialLogoConfig || DEFAULT_LOGO_CONFIG
  );

  const handleUpdateLogoConfig = (newConfig: PartyLogoConfig) => {
    setModalLogoConfig(newConfig);
    onLogoConfigChange?.(newConfig);
  };

  if (!isOpen) return null;

  const activeLogoConfig = modalLogoConfig;

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

    let logoHtml = '';
    if (activeLogoConfig.enabled) {
      const sizePx = activeLogoConfig.size === 'sm' ? 40 : activeLogoConfig.size === 'lg' ? 68 : 52;
      if (activeLogoConfig.position === 'top-center') {
        if (activeLogoConfig.type === 'custom' && activeLogoConfig.customImageDataUrl) {
          logoHtml = `<div style="text-align: center; margin-bottom: 12px;"><img src="${activeLogoConfig.customImageDataUrl}" style="height: ${sizePx}px; object-fit: contain;" /></div>`;
        } else {
          logoHtml = `<div style="text-align: center; margin-bottom: 12px;"><svg width="${sizePx}" height="${sizePx}" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="#DC2626" stroke="#B45309" stroke-width="2"/><g fill="#FDE047"><path d="M26 77 C24 75, 25 72, 28 69 L67 30 C70 27, 73 28, 75 30 L77 32 C79 34, 78 37, 75 40 L36 79 C33 82, 30 81, 28 79 Z"/><path d="M58 21 L77 40 L70 47 L65 42 L62 45 L58 41 L61 38 L56 33 L51 38 L47 34 L54 27 L51 24 Z"/></g><g fill="#FACC15"><path d="M74 74 C72 72, 73 68, 76 65 L81 60 C83 58, 86 59, 88 61 L89 62 C91 64, 90 67, 88 70 L83 75 C80 78, 77 77, 74 74 Z"/><path d="M77 62 C74 48, 62 33, 47 26 C35 20, 23 23, 19 28 C16 32, 19 36, 24 35 C32 34, 43 38, 50 48 C55 55, 56 65, 53 72 C50 78, 43 83, 37 83 C33 83, 30 80, 27 76 C25 73, 21 73, 20 76 C19 79, 21 84, 26 88 C34 94, 46 93, 56 86 C67 79, 75 70, 77 62 Z"/></g></svg></div>`;
        }
      }
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
              line-height: 1.45;
              color: #000;
              margin: 0;
              padding: 10px;
            }
            .content {
              text-align: justify;
              white-space: pre-wrap;
              font-size: 14pt;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${logoHtml}
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

        {/* Preset Picker Bar & Quick Logo Toolbar */}
        <div className="bg-slate-950 px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {!documentText ? (
            <div className="flex items-center gap-2 overflow-x-auto">
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
          ) : (
            <div className="flex items-center gap-2 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="font-semibold text-white">Chế độ xem trước văn kiện:</span>
              <span className="text-amber-300 italic font-serif truncate max-w-sm">{activeTitle}</span>
            </div>
          )}

          {/* Quick Logo Options inside Modal */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-red-900/40 ml-auto">
            <PartyEmblemSvg type={activeLogoConfig.type} sizePx={16} />
            <span className="text-amber-200 font-medium text-[11px]">Huy hiệu / Logo:</span>
            <button
              type="button"
              onClick={() => handleUpdateLogoConfig({ ...activeLogoConfig, enabled: !activeLogoConfig.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                activeLogoConfig.enabled
                  ? 'bg-red-700 text-white'
                  : 'bg-slate-800 text-stone-400 hover:text-white'
              }`}
            >
              {activeLogoConfig.enabled ? 'Bật' : 'Tắt'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-1 shadow-2xs"
              title="Mở bảng chọn biểu trưng hoặc tải ảnh logo riêng"
            >
              <span>✏️ Thay đổi / Tải ảnh</span>
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-stone-800/90 overflow-y-auto p-4 sm:p-8 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150 ease-out"
          >
            {/* The A4 Simulation Sheet */}
            <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl p-[20mm_15mm_20mm_25mm] font-serif text-[14pt] leading-[1.45] relative border border-stone-300 overflow-hidden">
              {/* Optional Background Watermark */}
              <PartyWatermarkDisplay config={activeLogoConfig} />

              {/* Editable Logo / Emblem Spot directly on the A4 PDF sheet */}
              <EditablePartyLogoSpot
                config={activeLogoConfig}
                onChange={handleUpdateLogoConfig}
              />

              {/* Document Content */}
              <div className="font-['Times_New_Roman',serif] text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-red-100 relative z-10 text-justify">
                {activeContent}
              </div>

              {/* PDF Footer Rule */}
              <div className="mt-16 pt-3 border-t border-stone-300 flex items-center justify-between text-[11px] text-stone-500 font-sans relative z-10">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Chuẩn Hướng dẫn số 05-HD/VPTW (27/5/2026) & Quy định 399-QĐ/TW của Ban Bí thư
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

      {/* Direct Party Logo Modal */}
      <PartyLogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        config={activeLogoConfig}
        onChange={handleUpdateLogoConfig}
      />
    </div>
  );
};
