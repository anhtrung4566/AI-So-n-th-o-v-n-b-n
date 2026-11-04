import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  FileDown,
  Printer,
  RefreshCw,
  Info,
  CheckCircle2,
  FileText,
  Building2,
  Flag,
  BookMarked,
  Upload,
  ChevronDown,
  ChevronUp,
  Wand2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { GeneratedDocument, PartyLogoConfig } from '../types';
import { PARTY_SAMPLE_DOCUMENTS, PARTY_DOCUMENT_TYPES_CATALOG } from '../data/partyHandbook';
import { exportToWordDocument, copyToClipboard } from '../utils/docxExporter';
import { PdfViewerModal } from './PdfViewerModal';
import {
  PartyLogoSelector,
  PartyLogoDisplay,
  PartyWatermarkDisplay,
  DEFAULT_LOGO_CONFIG,
  EditablePartyLogoSpot
} from './PartyLogo';
import {
  generateClientSidePartyDocument,
  extractClientSideTemplateInfo
} from '../utils/partyDocumentEngine';
import { AiEngineSelector, AiModelBadge, AiEngineType, AiModelType } from './AiEngineSelector';
import { Bot } from 'lucide-react';

export const DraftingTab: React.FC = () => {
  const [docType, setDocType] = useState<string>('Nghị quyết');
  const [issuingOrg, setIssuingOrg] = useState<string>('BAN THƯỜNG VỤ HUYỆN ỦY NAM ĐÀN');
  const [parentOrg, setParentOrg] = useState<string>('TỈNH ỦY NGHỆ AN');
  const [place, setPlace] = useState<string>('Nam Đàn');
  const [recipient, setRecipient] = useState<string>('Thường trực Huyện ủy; các ban xây dựng Đảng; các chi, đảng bộ cơ sở trực thuộc');
  const [selectedEngine, setSelectedEngine] = useState<AiEngineType>('gemini');
  const [selectedModel, setSelectedModel] = useState<AiModelType>('gemini-flash');
  const [subject, setSubject] = useState<string>('Về nâng cao năng lực lãnh đạo và sức chiến đấu của tổ chức cơ sở đảng giai đoạn 2026 - 2030');
  const [keyPoints, setKeyPoints] = useState<string>(
    '1. Đánh giá chất lượng sinh hoạt chi bộ và kết quả thực hiện nghị quyết nhiệm kỳ qua.\n2. Mục tiêu 100% bí thư chi bộ được bồi dưỡng nghiệp vụ công tác Đảng theo Hướng dẫn 05-HD/VPTW.\n3. Giao Ban Tổ chức Huyện ủy chủ trì thẩm tra tiêu chuẩn chính trị và hướng dẫn đánh giá xếp loại cuối năm.\n4. Giao Cơ quan Ủy ban Kiểm tra Huyện ủy tăng cường giám sát thường xuyên.'
  );
  const [signerTitle, setSignerTitle] = useState<string>('T/M BAN THƯỜNG VỤ\nBÍ THƯ');
  const [signerName, setSignerName] = useState<string>('Trần Đình Sơn');

  // Party Logo & Emblem Configuration State
  const [logoConfig, setLogoConfig] = useState<PartyLogoConfig>(DEFAULT_LOGO_CONFIG);

  // Reference Template State (Tính năng thêm văn bản mẫu tham khảo)
  const [referenceText, setReferenceText] = useState<string>('');
  const [showReferenceBox, setShowReferenceBox] = useState<boolean>(true);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);

  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfModalTitle, setPdfModalTitle] = useState<string>('');
  const [pdfModalContent, setPdfModalContent] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      setErrorMessage('Vui lòng nhập trích yếu / tiêu đề văn bản Đảng.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // 1. Attempt Backend API with 2500ms timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          issuingOrg,
          parentOrg,
          place,
          recipient,
          subject,
          keyPoints,
          signerTitle,
          signerName,
          referenceText,
          aiEngine: selectedEngine,
          aiModel: selectedModel,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: GeneratedDocument = await response.json();
        if (data && data.full_text && data.document_title) {
          setGeneratedDoc(data);
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend generate failed or timed out, activating instant deterministic Party drafting engine:', err);
    }

    // 2. Guaranteed 100% Uptime Deterministic Party Drafting (Hướng dẫn 05-HD/VPTW 2026 & Quy định 399-QĐ/TW)
    try {
      const localDoc = generateClientSidePartyDocument({
        docType,
        issuingOrg,
        parentOrg,
        place,
        recipient,
        subject,
        keyPoints,
        signerTitle,
        signerName,
        referenceText,
        aiEngine: selectedEngine,
        aiModel: selectedModel,
      });
      setGeneratedDoc(localDoc);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Đã có lỗi xảy ra: ' + (err.message || 'Lỗi soạn thảo'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    copyToClipboard(generatedDoc.full_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = () => {
    if (!generatedDoc) return;
    exportToWordDocument(
      `${docType}_${subject.slice(0, 30).trim()}`,
      generatedDoc.full_text
    );
  };

  // Upload file to reference box (Supports PDF, Word DOCX, and TXT)
  const handleRefFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.pdf')) {
      setIsUploadingRef(true);
      setErrorMessage(null);
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const dataUrl = event.target?.result as string;
            const base64Data = dataUrl.split(',')[1] || '';

            const res = await fetch('/api/parse-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ base64Data }),
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || 'Không thể trích xuất văn bản từ file PDF');
            }
            const data = await res.json();
            setReferenceText(data.text);
          } catch (err: any) {
            setErrorMessage('Lỗi khi đọc file PDF: ' + (err.message || 'Lỗi xử lý PDF'));
          } finally {
            setIsUploadingRef(false);
          }
        };
        reader.onerror = () => {
          setErrorMessage('Không thể đọc file PDF đã chọn');
          setIsUploadingRef(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setErrorMessage('Lỗi khi tải file PDF: ' + err.message);
        setIsUploadingRef(false);
      }
    } else if (file.name.endsWith('.docx')) {
      setIsUploadingRef(true);
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const dataUrl = event.target?.result as string;
            const base64Data = dataUrl.split(',')[1] || '';

            const res = await fetch('/api/parse-docx', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ base64Data }),
            });

            if (!res.ok) throw new Error('Không thể đọc file Word .docx');
            const data = await res.json();
            setReferenceText(data.text);
          } catch (err: any) {
            setErrorMessage('Lỗi khi đọc file mẫu: ' + (err.message || 'Lỗi xử lý file Word'));
          } finally {
            setIsUploadingRef(false);
          }
        };
        reader.onerror = () => {
          setErrorMessage('Không thể đọc tệp tin đã chọn');
          setIsUploadingRef(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setErrorMessage('Lỗi khi tải file mẫu: ' + err.message);
        setIsUploadingRef(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceText(event.target?.result as string);
      };
      reader.onerror = () => {
        setErrorMessage('Không thể đọc tệp văn bản đã chọn');
      };
      reader.readAsText(file);
    }
  };

  // Extract info from reference template and auto-fill form
  const handleExtractFromReference = async () => {
    if (!referenceText.trim()) {
      setErrorMessage('Vui lòng dán hoặc chọn văn bản mẫu tham khảo trước.');
      return;
    }

    setIsExtracting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/extract-template-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateText: referenceText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.docType) setDocType(data.docType);
        if (data.issuingOrg) setIssuingOrg(data.issuingOrg);
        if (data.parentOrg) setParentOrg(data.parentOrg);
        if (data.place) setPlace(data.place);
        if (data.recipient) setRecipient(data.recipient);
        if (data.subject) setSubject(data.subject);
        if (data.signerTitle) setSignerTitle(data.signerTitle);
        if (data.signerName) setSignerName(data.signerName);
        if (data.keyPoints) setKeyPoints(data.keyPoints);
        setIsExtracting(false);
        return;
      }
    } catch (err: any) {
      console.warn('Backend extraction failed, using client-side extractor:', err);
    }

    // Guaranteed instant client-side extractor
    try {
      const data = extractClientSideTemplateInfo(referenceText);
      if (data.docType) setDocType(data.docType);
      if (data.issuingOrg) setIssuingOrg(data.issuingOrg);
      if (data.parentOrg) setParentOrg(data.parentOrg);
      if (data.place) setPlace(data.place);
      if (data.recipient) setRecipient(data.recipient);
      if (data.subject) setSubject(data.subject);
      if (data.signerTitle) setSignerTitle(data.signerTitle);
      if (data.signerName) setSignerName(data.signerName);
      if (data.keyPoints) setKeyPoints(data.keyPoints);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Không thể trích xuất thông số: ' + (err.message || 'Lỗi xử lý'));
    } finally {
      setIsExtracting(false);
    }
  };

  // Quick preset loader into reference box
  const loadPresetIntoReference = (sampleId: string) => {
    const sample = PARTY_SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (sample) {
      setReferenceText(sample.rawText);
      setShowReferenceBox(true);
    }
  };

  const documentTypesList = PARTY_DOCUMENT_TYPES_CATALOG.map((item) => item.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-2 border border-red-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Soạn Thảo Thể Thức Cơ Quan Đảng (Hướng dẫn 05-HD/VPTW 27/5/2026 & Quy định 399-QĐ/TW)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Soạn Thảo Văn Kiện & Văn Bản Đảng Chuẩn Thể Thức 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kế thừa mẫu văn bản Đảng có sẵn để AI tham khảo cấu trúc và căn cứ Điều lệ Đảng, hoặc tự nhập thông số cấp ủy để tạo văn bản chuẩn xác tuyệt đối.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-red-50/80 px-3.5 py-2 rounded-xl border border-red-200 text-xs text-red-800 font-semibold">
            <Flag className="w-4 h-4 text-red-600" />
            <span>Chuẩn Tiêu Ngữ: ĐẢNG CỘNG SẢN VIỆT NAM</span>
          </div>
        </div>
      </div>

      {/* FEATURE MỚI: REFERENCE TEMPLATE SECTION (VĂN BẢN MẪU ĐỂ THAM KHẢO TRƯỚC KHI VIẾT) */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-slate-50 rounded-2xl border-2 border-amber-300/80 shadow-sm overflow-hidden">
        {/* Toggle header */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-amber-200/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Văn Bản Mẫu Tham Khảo (Tham khảo mẫu trước khi viết)
                </h3>
                {referenceText.trim() && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Đã nạp mẫu tham khảo ({referenceText.trim().split(/\s+/).length} từ)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Dán văn bản mẫu, tải file Word hoặc chọn mẫu có sẵn để AI học bố cục, văn phong và căn cứ trước khi soạn văn bản mới.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReferenceBox(!showReferenceBox)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors"
            >
              <span>{showReferenceBox ? 'Thu gọn' : 'Mở rộng mẫu'}</span>
              {showReferenceBox ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reference Content Body */}
        {showReferenceBox && (
          <div className="p-4 sm:p-5 space-y-4 bg-white/60">
            {/* Quick preset selector for reference document */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Nạp nhanh mẫu tham khảo:</span>
              <button
                onClick={() => loadPresetIntoReference('sample-dang-hd05')}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition-colors border border-amber-300 flex items-center gap-1"
              >
                <Flag className="w-3 h-3 text-red-600" />
                <span>Mẫu Hướng dẫn 05-HD/VPTW 2026</span>
              </button>
              <button
                onClick={() => loadPresetIntoReference('sample-dang-nghiquyet-chuan')}
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 font-medium transition-colors border border-red-200 flex items-center gap-1"
              >
                <Flag className="w-3 h-3 text-red-600" />
                <span>Mẫu Nghị quyết Tỉnh ủy</span>
              </button>
              <button
                onClick={() => loadPresetIntoReference('sample-dang-quyetdinh-chuan')}
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 font-medium transition-colors border border-red-200 flex items-center gap-1"
              >
                <Flag className="w-3 h-3 text-red-600" />
                <span>Mẫu Quyết định Cấp ủy</span>
              </button>
              <button
                onClick={() => loadPresetIntoReference('sample-dang-congvan-chuan')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium transition-colors border border-amber-200 flex items-center gap-1"
              >
                <Flag className="w-3 h-3 text-red-600" />
                <span>Mẫu Công văn Đảng</span>
              </button>
              <button
                onClick={() => loadPresetIntoReference('sample-dang-kehoach-chuan')}
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 font-medium transition-colors border border-red-200 flex items-center gap-1"
              >
                <Flag className="w-3 h-3 text-red-600" />
                <span>Mẫu Kế hoạch Huyện ủy</span>
              </button>
              <button
                onClick={() => loadPresetIntoReference('sample-dang-totrinh-chuan')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium transition-colors border border-amber-200 flex items-center gap-1"
              >
                <Flag className="w-3 h-3 text-red-600" />
                <span>Mẫu Tờ trình Ban Đảng</span>
              </button>
            </div>

            {/* Textarea for reference document */}
            <div className="relative">
              <textarea
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                rows={7}
                placeholder="Dán toàn bộ nội dung văn bản mẫu cần tham khảo vào đây (AI sẽ đọc hiểu cách bố cục, các điều khoản, thẩm quyền ký, căn cứ pháp lý để viết văn bản mới theo đúng phong cách này)..."
                className="w-full text-xs font-admin p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-slate-900 leading-relaxed resize-none selection:bg-amber-100"
              />
            </div>

            {/* Action buttons for reference */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isUploadingRef ? 'Đang đọc file PDF / Word...' : 'Tải file mẫu (.pdf, .docx, .txt)'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleRefFileUpload}
                    className="hidden"
                    disabled={isUploadingRef}
                  />
                </label>

                {/* View PDF Reference button */}
                <button
                  type="button"
                  onClick={() => {
                    setPdfModalTitle('Văn Bản Mẫu Tham Khảo (Chuẩn Hướng Dẫn 05-HD/VPTW)');
                    setPdfModalContent(referenceText.trim() || PARTY_SAMPLE_DOCUMENTS[0].rawText);
                    setIsPdfModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-900 bg-red-50 hover:bg-red-100 rounded-lg border border-red-300 transition-colors"
                  title="Xem toàn văn dưới định dạng trang A4 PDF chuẩn thể thức Đảng"
                >
                  <FileText className="w-3.5 h-3.5 text-red-700" />
                  <span>Xem file PDF mẫu tham khảo</span>
                </button>

                {referenceText.trim() && (
                  <button
                    onClick={() => setReferenceText('')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa mẫu</span>
                  </button>
                )}
              </div>

              {referenceText.trim() && (
                <button
                  onClick={handleExtractFromReference}
                  disabled={isExtracting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 shadow-2xs transition-all active:scale-95"
                  title="Tự động đọc thông tin từ mẫu để điền nhanh vào form bên dưới"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-900" />
                      <span>Đang trích xuất thông số...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-amber-900" />
                      <span>Trích Xuất Thông Số Từ Mẫu Điền Vào Form</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Form & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Input */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PenTool className="w-4 h-4 text-red-700" />
              <span>Nội dung văn bản mới cần soạn</span>
            </h3>
            {referenceText.trim() && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Có mẫu tham khảo
              </span>
            )}
          </div>

          {/* Doc Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Loại văn bản <span className="text-red-500">*</span>
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white text-slate-800"
            >
              {documentTypesList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Org & Parent Org */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cơ quan Đảng ban hành <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={issuingOrg}
                onChange={(e) => setIssuingOrg(e.target.value)}
                placeholder="VD: HUYỆN ỦY NAM ĐÀN, ĐẢNG ỦY KHỐI..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cấp ủy / Cơ quan Đảng cấp trên (nếu có)
              </label>
              <input
                type="text"
                value={parentOrg}
                onChange={(e) => setParentOrg(e.target.value)}
                placeholder="VD: TỈNH ỦY NGHỆ AN, BAN CHẤP HÀNH TRUNG ƯƠNG..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
              />
            </div>
          </div>

          {/* Place & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa danh ban hành
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="VD: Hà Nội / Nghệ An"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nơi nhận / Kính gửi
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="VD: Các ban Đảng; các chi bộ trực thuộc..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
              />
            </div>
          </div>

          {/* Subject / Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trích yếu / Nội dung chính <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: V/v triển khai công tác..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
            />
          </div>

          {/* Key points / Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Các ý chính hoặc nội dung chỉ đạo cần thể hiện
            </label>
            <textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={5}
              placeholder="Nhập các ý chính, yêu cầu, căn cứ pháp lý, nhiệm vụ trọng tâm hoặc giải pháp cần triển khai..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800 leading-relaxed resize-none font-admin"
            />
          </div>

          {/* Signer */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thẩm quyền ký / Đề ký
                </label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  placeholder="VD: T/M BAN THƯỜNG VỤ&#10;BÍ THƯ"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên người ký
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="VD: Trần Đình Sơn"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            {/* Quick Party Signer Selectors */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-medium">Mẫu đề ký:</span>
              <button
                type="button"
                onClick={() => setSignerTitle('T/M BAN BÍ THƯ\nTỔNG BÍ THƯ')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                T/M Ban Bí thư
              </button>
              <button
                type="button"
                onClick={() => setSignerTitle('T/M BAN THƯỜNG VỤ\nBÍ THƯ')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                T/M Ban Thường vụ
              </button>
              <button
                type="button"
                onClick={() => setSignerTitle('T/M ĐẢNG ỦY\nBÍ THƯ')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                T/M Đảng ủy
              </button>
              <button
                type="button"
                onClick={() => setSignerTitle('K/T CHÁNH VĂN PHÒNG\nPHÓ CHÁNH VĂN PHÒNG')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                K/T Chánh Văn phòng
              </button>
            </div>
          </div>

          {/* Party Logo & Emblem Configuration Card */}
          <PartyLogoSelector config={logoConfig} onChange={setLogoConfig} />

          {errorMessage && (
            <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors border border-rose-300"
              >
                Thử lại ngay
              </button>
            </div>
          )}

          {/* AI Engine Selector (Gemini / ChatGPT) */}
          <AiEngineSelector
            selectedEngine={selectedEngine}
            onChangeEngine={setSelectedEngine}
            selectedModel={selectedModel}
            onChangeModel={setSelectedModel}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedEngine === 'chatgpt'
                ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 shadow-emerald-900/30'
                : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-red-700/20'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Đang Soạn Thảo Với {selectedEngine === 'chatgpt' ? 'ChatGPT-4o' : 'Gemini AI'}...</span>
              </>
            ) : (
              <>
                {selectedEngine === 'chatgpt' ? (
                  <Bot className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>
                  {referenceText.trim()
                    ? `Soạn Thảo Theo Mẫu Với ${selectedEngine === 'chatgpt' ? 'ChatGPT-4o' : 'Gemini AI'}`
                    : `Soạn Thảo Chuẩn Thể Thức Với ${selectedEngine === 'chatgpt' ? 'ChatGPT-4o' : 'Gemini AI'}`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Top toolbar */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="w-4 h-4 text-red-700" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Xem Trước Văn Kiện Đảng (Chuẩn Hướng Dẫn 05)
              </span>
              {generatedDoc && (
                <AiModelBadge
                  engine={generatedDoc.engineUsed || selectedEngine}
                  model={generatedDoc.modelUsed}
                />
              )}
            </div>

            {generatedDoc && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
                <button
                  onClick={() => {
                    setPdfModalTitle(`${docType} - ${subject}`);
                    setPdfModalContent(generatedDoc.full_text);
                    setIsPdfModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-950 bg-red-100 hover:bg-red-200 border border-red-300 transition-colors shadow-2xs"
                  title="Xem bản PDF mô phỏng A4 và In / Lưu file PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-red-700" />
                  <span>Xem & In PDF</span>
                </button>
                <button
                  onClick={handleExportWord}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Xuất file Word (.doc)</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Content rendered with crisp font-admin (Tinos / Times New Roman) */}
          <div className="p-6 bg-slate-200/60 min-h-[580px] flex justify-center overflow-x-auto">
            {generatedDoc ? (
              <div className="w-full max-w-2xl bg-white p-8 sm:p-12 shadow-md rounded-lg border border-slate-300 font-admin text-slate-900 text-sm leading-relaxed whitespace-pre-wrap selection:bg-amber-100 text-justify relative overflow-hidden">
                {/* Optional Watermark */}
                <PartyWatermarkDisplay config={logoConfig} />

                {/* Direct Editable Logo / Emblem Spot on Document Sheet */}
                <EditablePartyLogoSpot
                  config={logoConfig}
                  onChange={setLogoConfig}
                />

                <div className="relative z-10">
                  {generatedDoc.full_text}
                </div>

                {/* Notes */}
                {generatedDoc.notes && generatedDoc.notes.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-dashed border-slate-300 font-sans text-xs text-slate-600 space-y-1 bg-amber-50/80 p-4 rounded-lg relative z-10">
                    <span className="font-bold text-amber-900 flex items-center gap-1 mb-2">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      Lưu ý kỹ thuật trình bày theo quy định thể thức:
                    </span>
                    {generatedDoc.notes.map((note, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-700">•</span>
                        <span>{note}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-slate-400 p-8 my-auto">
                <PenTool className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm mb-1">Chưa có nội dung soạn thảo</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {referenceText.trim()
                    ? 'Bạn đã nạp mẫu tham khảo! Hãy kiểm tra các thông số và bấm nút "Soạn Thảo Chuẩn Theo Mẫu Tham Khảo".'
                    : 'Điền thông số hoặc dán văn bản mẫu tham khảo ở khung màu vàng phía trên, sau đó bấm soạn thảo.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Simulation & Print Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        documentTitle={pdfModalTitle}
        documentText={pdfModalContent}
        logoConfig={logoConfig}
        onLogoConfigChange={setLogoConfig}
        onApplyReference={(text) => {
          setReferenceText(text);
          setShowReferenceBox(true);
        }}
      />
    </div>
  );
};
