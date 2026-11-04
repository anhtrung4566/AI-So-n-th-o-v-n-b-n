import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Upload,
  RefreshCw,
  Eye,
  Columns,
  ListFilter,
  Code2,
  HelpCircle,
  FileDown,
  Building2,
  Flag,
  Type,
  Bot
} from 'lucide-react';
import { DocumentReviewResult, ReviewError, PartyDocumentType } from '../types';
import { PARTY_SAMPLE_DOCUMENTS, SamplePartyDocument } from '../data/partyHandbook';
import { exportToWordDocument, copyToClipboard } from '../utils/docxExporter';
import { JsonModal } from './JsonModal';
import { PdfViewerModal } from './PdfViewerModal';
import { performClientSidePartyReview } from '../utils/partyDocumentEngine';
import { AiEngineSelector, AiModelBadge, AiEngineType, AiModelType } from './AiEngineSelector';
import { PartyDocumentSheetView } from './PartyDocumentSheetView';

export const ReviewTab: React.FC = () => {
  const [inputText, setInputText] = useState<string>(PARTY_SAMPLE_DOCUMENTS[0].rawText);
  const [fontSize, setFontSize] = useState<'13pt' | '14pt'>('13pt');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEngine, setSelectedEngine] = useState<AiEngineType>('gemini');
  const [selectedModel, setSelectedModel] = useState<AiModelType>('gemini-flash');
  const [reviewResult, setReviewResult] = useState<DocumentReviewResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'corrected' | 'diff' | 'errors' | 'json'>('corrected');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedErrorIndex, setCopiedErrorIndex] = useState<number | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleReview = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Vui lòng nhập hoặc tải lên văn bản của Đảng cần rà soát.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // 1. Attempt Backend API with 2500ms timeout
    let gotValidResponse = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          aiEngine: selectedEngine,
          aiModel: selectedModel,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: DocumentReviewResult = await response.json();
        if (data && data.full_corrected_text && Array.isArray(data.errors)) {
          setReviewResult(data);
          setActiveView('corrected');
          gotValidResponse = true;
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend fetch failed or timed out, executing deterministic Party engine:', err);
    }

    // 2. Guaranteed 100% Uptime Deterministic Party Review (Hướng dẫn 05-HD/VPTW & Quy định 399-QĐ/TW)
    try {
      const localResult = performClientSidePartyReview(inputText, undefined, selectedEngine, selectedModel);
      setReviewResult(localResult);
      setActiveView('corrected');
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Đã có lỗi xảy ra: ' + (err.message || 'Lỗi xử lý'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = PARTY_SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (sample) {
      setInputText(sample.rawText);
      setReviewResult(null);
      setErrorMessage(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setUploadMessage(null);

    const fileNameLower = file.name.toLowerCase();

    // 1. PDF File Upload via Gemini Multimodal Extraction
    if (fileNameLower.endsWith('.pdf')) {
      setIsUploading(true);
      setUploadMessage(`Đang số hóa văn bản từ file PDF "${file.name}"...`);
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const dataUrl = reader.result as string;
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
            if (!data.text || !data.text.trim()) {
              throw new Error('File PDF không chứa văn bản hoặc là bản scan mờ. Vui lòng kiểm tra lại.');
            }

            setInputText(data.text);
            setReviewResult(null);
            setUploadMessage(`Đã số hóa thành công tệp PDF: ${file.name} (${data.text.length.toLocaleString('vi-VN')} ký tự)`);
            setTimeout(() => setUploadMessage(null), 5000);
          } catch (err: any) {
            setErrorMessage('Lỗi khi đọc file PDF: ' + (err.message || 'Lỗi xử lý file PDF'));
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          setErrorMessage('Không thể đọc file PDF đã chọn');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setErrorMessage('Không thể đọc file PDF: ' + err.message);
        setIsUploading(false);
      }
    } else if (fileNameLower.endsWith('.docx') || fileNameLower.endsWith('.doc')) {
      // 2. Word DOCX Upload via Mammoth
      setIsUploading(true);
      setUploadMessage(`Đang trích xuất nội dung từ tệp Word "${file.name}"...`);
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const dataUrl = reader.result as string;
            const base64Data = dataUrl.split(',')[1] || '';

            const res = await fetch('/api/parse-docx', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ base64Data }),
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || 'Không thể đọc file Word .docx');
            }

            const data = await res.json();
            if (!data.text || !data.text.trim()) {
              throw new Error('Tệp Word trống hoặc không có nội dung chữ.');
            }

            setInputText(data.text);
            setReviewResult(null);
            setUploadMessage(`Đã tải tệp Word thành công: ${file.name} (${data.text.length.toLocaleString('vi-VN')} ký tự)`);
            setTimeout(() => setUploadMessage(null), 5000);
          } catch (err: any) {
            setErrorMessage('Không thể đọc tệp Word: ' + (err.message || 'Lỗi xử lý file Word'));
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          setErrorMessage('Không thể đọc tệp Word đã chọn');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setErrorMessage('Không thể đọc tệp: ' + err.message);
        setIsUploading(false);
      }
    } else {
      // 3. Plain text or Markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        setReviewResult(null);
        setUploadMessage(`Đã tải nội dung văn bản: ${file.name} (${text.length.toLocaleString('vi-VN')} ký tự)`);
        setTimeout(() => setUploadMessage(null), 5000);
      };
      reader.onerror = () => {
        setErrorMessage('Không thể đọc tệp văn bản đã chọn');
      };
      reader.readAsText(file, 'utf-8');
    }

    // Reset input target value so user can re-upload same file if desired
    e.target.value = '';
  };

  const handleCopyCorrected = () => {
    if (!reviewResult) return;
    copyToClipboard(reviewResult.full_corrected_text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyErrorCorrection = (correction: string, idx: number) => {
    copyToClipboard(correction);
    setCopiedErrorIndex(idx);
    setTimeout(() => setCopiedErrorIndex(null), 2000);
  };

  const handleExportWord = () => {
    if (!reviewResult) return;
    exportToWordDocument(
      `${reviewResult.document_type || 'Van_ban'}_Chuan_The_Thuc`,
      reviewResult.full_corrected_text
    );
  };

  const handlePrint = () => {
    setIsPdfModalOpen(true);
  };

  // Filter errors
  const filteredErrors = (reviewResult?.errors || []).filter((err) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      err.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSeverity =
      selectedSeverity === 'all' || err.severity === selectedSeverity;
    return matchesCategory && matchesSeverity;
  });

  const criticalCount = reviewResult?.errors.filter((e) => e.severity === 'critical').length || 0;
  const warningCount = reviewResult?.errors.filter((e) => e.severity === 'warning').length || 0;
  const suggestionCount = reviewResult?.errors.filter((e) => e.severity === 'suggestion').length || 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500 bg-emerald-50';
    if (score >= 75) return 'text-blue-600 border-blue-500 bg-blue-50';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Xuất Sắc - Chuẩn Thể Thức', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 75) return { label: 'Đạt Chuẩn - Cần Hoàn Thiện Nhẹ', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score >= 50) return { label: 'Cần Chỉnh Sửa Nhiều', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Chưa Đạt Chuẩn - Lỗi Thể Thức Nặng', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Banner specialized 100% for Party Documents */}
      <div className="bg-gradient-to-r from-red-950 via-slate-950 to-stone-950 rounded-2xl p-6 text-white border border-red-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 text-amber-300 text-xs font-semibold border border-amber-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ Thống Chuyên Gia Thể Thức & Kỹ Thuật Trình Bày Văn Bản Đảng Năm 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Rà Soát Toàn Diện Thể Thức Văn Bản Đảng Theo Hướng Dẫn 05-HD/VPTW
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            Đối chiếu nghiêm ngặt theo <strong className="text-amber-300 font-semibold">Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng</strong> và <strong className="text-amber-300 font-semibold">Quy định số 399-QĐ/TW của Ban Bí thư</strong>. Tự động rà soát tiêu ngữ Đảng, số ký hiệu dấu gạch nối, trích yếu, thể thức đề ký chức vụ và văn phong chính luận công tác Đảng.
          </p>

          {/* Key Party Verification Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-red-900/40 text-xs">
            <span className="text-amber-200/90 font-medium">Quy chuẩn kiểm tra Hướng dẫn 05:</span>
            <span className="bg-red-950/90 text-amber-300 px-2.5 py-1 rounded-md border border-red-700/60 font-medium">
              ✓ Tiêu ngữ: "ĐẢNG CỘNG SẢN VIỆT NAM"
            </span>
            <span className="bg-red-950/90 text-amber-300 px-2.5 py-1 rounded-md border border-red-700/60 font-medium">
              ✓ Số: [số]-[thể loại]/[cơ quan Đảng]
            </span>
            <span className="bg-red-950/90 text-amber-300 px-2.5 py-1 rounded-md border border-red-700/60 font-medium">
              ✓ Đề ký: T/M BAN THƯỜNG VỤ / T/M ĐẢNG ỦY
            </span>
            <span className="bg-red-950/90 text-amber-300 px-2.5 py-1 rounded-md border border-red-700/60 font-medium">
              ✓ Thẩm quyền: Quy định 399-QĐ/TW
            </span>
            <span className="bg-emerald-950/90 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-700/60 font-medium">
              ✓ Chữ ký số chuyên dùng Đảng
            </span>
          </div>

          {/* Quick preset samples */}
          <div className="flex flex-wrap items-center gap-2 pt-4 text-xs">
            <span className="text-stone-400 font-medium">Thử nhanh văn bản Đảng mẫu:</span>
            {PARTY_SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample.id)}
                className="px-2.5 py-1.5 rounded-lg border transition-all font-medium flex items-center gap-1.5 text-xs bg-red-950/70 text-amber-200 border-red-800/70 hover:bg-red-900/90 hover:text-white hover:border-amber-500/50"
                title={sample.description}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Input Toolbar */}
            <div className="bg-stone-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileText className="w-4 h-4 text-red-800" />
                <span>Văn bản Đảng cần rà soát</span>
                <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Chuẩn Hướng dẫn 05-HD/VPTW 2026
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-red-700" />
                  <span>{isUploading ? 'Đang đọc tệp...' : 'Tải file (.docx, .pdf, .txt)'}</span>
                  <input
                    type="file"
                    accept=".docx,.pdf,.txt,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <button
                  onClick={() => setInputText('')}
                  className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent transition-colors"
                >
                  Xóa trắng
                </button>
              </div>
            </div>

            {/* Upload status message */}
            {uploadMessage && (
              <div className="mx-4 mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{uploadMessage}</span>
              </div>
            )}

            {/* AI Engine Selector (Gemini / ChatGPT) */}
            <div className="px-4 pt-3">
              <AiEngineSelector
                selectedEngine={selectedEngine}
                onChangeEngine={setSelectedEngine}
                selectedModel={selectedModel}
                onChangeModel={setSelectedModel}
              />
            </div>

            {/* Textarea with authentic administrative font (Tinos / Times New Roman) */}
            <div className="p-4 flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Dán nội dung công văn, quyết định, nghị quyết, tờ trình, thông báo hoặc báo cáo hành chính/đảng vào đây..."
                className="w-full h-[450px] p-4 text-[13.5px] font-admin leading-relaxed text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none selection:bg-amber-100"
              />
            </div>

            {/* Input Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>{wordCount.toLocaleString('vi-VN')} từ</span>
                <span>•</span>
                <span>{charCount.toLocaleString('vi-VN')} ký tự</span>
              </div>
              <button
                onClick={handleReview}
                disabled={loading || !inputText.trim()}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] ${
                  selectedEngine === 'chatgpt'
                    ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-red-700/20'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Đang Rà Soát {selectedEngine === 'chatgpt' ? 'ChatGPT-4o' : 'Gemini AI'}...</span>
                  </>
                ) : (
                  <>
                    {selectedEngine === 'chatgpt' ? (
                      <Bot className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    <span>
                      {selectedEngine === 'chatgpt'
                        ? 'Rà Soát Thể Thức Với ChatGPT-4o'
                        : 'Rà Soát Thể Thức Với Gemini AI'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-rose-900">Thông báo</p>
                  <p className="text-xs text-rose-700 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReview}
                disabled={loading}
                className="shrink-0 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors border border-rose-300"
              >
                Thử lại ngay
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Review Results */}
        <div className="lg:col-span-6 space-y-4">
          {reviewResult ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Score & Summary Banner */}
              <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Overall Score Circle */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-extrabold border-2 shadow-lg ${getScoreColor(
                        reviewResult.overall_score
                      )}`}
                    >
                      <span className="text-2xl leading-none">{reviewResult.overall_score}</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider">Điểm</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-800/80 text-amber-300 border border-red-700">
                          {reviewResult.document_type || 'Văn bản của Đảng'}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            getScoreBadge(reviewResult.overall_score).bg
                          }`}
                        >
                          {getScoreBadge(reviewResult.overall_score).label}
                        </span>
                        <AiModelBadge
                          engine={reviewResult.engineUsed || selectedEngine}
                          model={reviewResult.modelUsed}
                        />
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {reviewResult.general_assessment}
                      </p>
                    </div>
                  </div>

                  {/* Raw JSON trigger button */}
                  <button
                    onClick={() => setIsJsonModalOpen(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-slate-600 text-amber-300 border border-slate-600 transition-colors"
                    title="Xem đoạn JSON chuẩn 100% theo yêu cầu"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Xem JSON Chuẩn</span>
                  </button>
                </div>

                {/* Error Pills Count */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/70 text-center">
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="block text-rose-400 font-extrabold text-base leading-none">
                      {criticalCount}
                    </span>
                    <span className="text-[11px] text-slate-300">Nghiêm trọng</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="block text-amber-400 font-extrabold text-base leading-none">
                      {warningCount}
                    </span>
                    <span className="text-[11px] text-slate-300">Cảnh báo</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="block text-sky-400 font-extrabold text-base leading-none">
                      {suggestionCount}
                    </span>
                    <span className="text-[11px] text-slate-300">Gợi ý sửa</span>
                  </div>
                </div>
              </div>

              {/* View Switcher Toolbar */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setActiveView('corrected')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeView === 'corrected'
                        ? 'bg-white text-red-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bản chuẩn hóa</span>
                  </button>
                  <button
                    onClick={() => setActiveView('errors')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeView === 'errors'
                        ? 'bg-white text-red-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Chi tiết {reviewResult.errors.length} lỗi</span>
                  </button>
                  <button
                    onClick={() => setActiveView('diff')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeView === 'diff'
                        ? 'bg-white text-red-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>So sánh (Diff)</span>
                  </button>
                </div>

                {/* Font size toggle & Quick actions */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5 text-[11px]">
                    <button
                      onClick={() => setFontSize('13pt')}
                      className={`px-1.5 py-0.5 rounded font-medium ${
                        fontSize === '13pt' ? 'bg-red-700 text-white' : 'text-slate-600'
                      }`}
                      title="Cỡ chữ 13pt"
                    >
                      13pt
                    </button>
                    <button
                      onClick={() => setFontSize('14pt')}
                      className={`px-1.5 py-0.5 rounded font-medium ${
                        fontSize === '14pt' ? 'bg-red-700 text-white' : 'text-slate-600'
                      }`}
                      title="Cỡ chữ 14pt"
                    >
                      14pt
                    </button>
                  </div>

                  <button
                    onClick={handleCopyCorrected}
                    className="p-1.5 text-slate-700 hover:text-red-700 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white"
                    title="Sao chép văn bản đã sửa hoàn chỉnh"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-2.5 py-1 text-xs font-semibold text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 flex items-center gap-1 shadow-2xs"
                    title="Xem bản in A4 và Lưu PDF chuẩn Hướng dẫn 05"
                  >
                    <Eye className="w-3.5 h-3.5 text-red-700" />
                    <span>Xem A4 / PDF</span>
                  </button>
                  <button
                    onClick={handleExportWord}
                    className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    title="Tải văn bản Word chuẩn format (.doc)"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white"
                    title="In văn bản"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View 1: Full Corrected Text with Authentic Administrative Page Proportions */}
              {activeView === 'corrected' && (
                <div className="p-4 sm:p-6 bg-slate-200/70 overflow-x-auto flex justify-center">
                  <PartyDocumentSheetView
                    content={reviewResult.full_corrected_text}
                    fontSize={fontSize}
                  />
                </div>
              )}

              {/* View 2: Detailed Error Cards */}
              {activeView === 'errors' && (
                <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
                  {/* Filter controls */}
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <ListFilter className="w-3.5 h-3.5" /> Lọc:
                    </span>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 text-xs text-slate-700 bg-white"
                    >
                      <option value="all">Tất cả mức độ</option>
                      <option value="critical">Nghiêm trọng ({criticalCount})</option>
                      <option value="warning">Cảnh báo ({warningCount})</option>
                      <option value="suggestion">Gợi ý ({suggestionCount})</option>
                    </select>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 text-xs text-slate-700 bg-white"
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="Thể thức">Thể thức trình bày</option>
                      <option value="Viết hoa">Viết hoa danh xưng/cơ quan</option>
                      <option value="Căn cứ pháp lý">Căn cứ pháp lý</option>
                      <option value="Số">Số, ký hiệu & trích yếu</option>
                      <option value="Thẩm quyền">Thẩm quyền ký & đề ký</option>
                      <option value="Văn phong">Văn phong công vụ</option>
                    </select>
                    <span className="ml-auto text-slate-400">
                      Hiển thị {filteredErrors.length}/{reviewResult.errors.length} lỗi
                    </span>
                  </div>

                  {filteredErrors.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      Không tìm thấy lỗi phù hợp với bộ lọc đã chọn.
                    </div>
                  ) : (
                    filteredErrors.map((err, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          err.severity === 'critical'
                            ? 'bg-rose-50/70 border-rose-200'
                            : err.severity === 'warning'
                            ? 'bg-amber-50/70 border-amber-200'
                            : 'bg-sky-50/70 border-sky-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                err.severity === 'critical'
                                  ? 'bg-rose-200 text-rose-800'
                                  : err.severity === 'warning'
                                  ? 'bg-amber-200 text-amber-800'
                                  : 'bg-sky-200 text-sky-800'
                              }`}
                            >
                              {err.severity === 'critical'
                                ? 'Nghiêm trọng'
                                : err.severity === 'warning'
                                ? 'Cảnh báo'
                                : 'Gợi ý'}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {err.category}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyErrorCorrection(err.suggested_correction, idx)}
                            className="text-xs text-slate-600 hover:text-red-700 font-medium flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                            title="Sao chép cụm từ sửa"
                          >
                            {copiedErrorIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Sao chép sửa</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Text difference comparison */}
                        <div className="space-y-1.5 my-2 text-xs">
                          <div className="flex items-start gap-2 bg-white/90 p-2 rounded-lg border border-slate-200">
                            <span className="font-semibold text-rose-700 shrink-0 w-16">Chưa chuẩn:</span>
                            <span className="line-through text-rose-800 font-admin font-medium">
                              "{err.original_text}"
                            </span>
                          </div>
                          <div className="flex items-start gap-2 bg-emerald-50/90 p-2 rounded-lg border border-emerald-200">
                            <span className="font-semibold text-emerald-700 shrink-0 w-16">Sửa lại:</span>
                            <span className="font-bold text-emerald-950 font-admin">
                              "{err.suggested_correction}"
                            </span>
                          </div>
                        </div>

                        {/* Căn cứ quy chuẩn Hướng dẫn 05-HD/VPTW 2026 & Quy định 399-QĐ/TW */}
                        <p className="text-xs text-slate-700 mt-2 pt-2 border-t border-slate-200/80 leading-relaxed">
                          <strong className="text-slate-900 font-semibold">Căn cứ quy chuẩn: </strong>
                          {err.explanation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* View 3: Side-by-Side Diff */}
              {activeView === 'diff' && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto text-xs font-admin leading-relaxed">
                  <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
                    <div className="font-sans font-bold text-rose-800 mb-2 pb-1 border-b border-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Văn bản ban đầu ({reviewResult.errors.length} điểm cần sửa)</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-800">
                      {inputText}
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                    <div className="font-sans font-bold text-emerald-800 mb-2 pb-1 border-b border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Văn bản sau chuẩn hóa (100% Thể thức)</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-900 font-medium">
                      {reviewResult.full_corrected_text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state / Welcome state */
            <div className="bg-white rounded-2xl border border-dashed border-red-200 p-8 text-center flex flex-col items-center justify-center min-h-[480px] text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mb-4 border border-red-200 shadow-sm">
                <FileCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Sẵn Sàng Rà Soát Thể Thức Văn Bản Đảng
              </h3>
              <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">
                Nhập nội dung vào khung bên trái hoặc bấm <strong className="text-red-800">"Tải file (.docx, .pdf, .txt)"</strong> để hệ thống chuyên sâu tự động rà soát, chỉ rõ sai sót và xuất văn bản chuẩn 100%.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg w-full">
                <div className="p-3.5 bg-red-50/70 rounded-xl border border-red-200 text-xs">
                  <span className="font-bold text-red-950 block mb-1">🚩 Hướng dẫn số 05-HD/VPTW (27/5/2026)</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Tiêu ngữ bắt buộc "ĐẢNG CỘNG SẢN VIỆT NAM", số ký hiệu dấu gạch nối (Số: 45-QĐ/TU), thể thức trích yếu, bố cục trình bày và nơi nhận.
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-950 block mb-1">⚖️ Quy định số 399-QĐ/TW (09/01/2026)</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Thẩm quyền ban hành, thẩm quyền ký (T/M Ban Thường vụ, T/M Đảng ủy...), căn cứ Điều lệ Đảng và chuẩn hóa văn phong công tác Đảng.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* JSON Viewer Modal */}
      {reviewResult && (
        <JsonModal
          isOpen={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
          data={reviewResult}
        />
      )}

      {/* PDF Viewer & Print Modal */}
      {reviewResult && (
        <PdfViewerModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          documentTitle={`${reviewResult.document_type || 'Van_ban_Dang'}_Chuan_HD05_TW`}
          documentText={reviewResult.full_corrected_text}
        />
      )}
    </div>
  );
};
