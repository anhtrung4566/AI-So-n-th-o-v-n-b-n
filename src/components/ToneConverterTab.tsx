import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { FormalRewriteResult } from '../types';
import { copyToClipboard } from '../utils/docxExporter';
import { rewriteClientSidePartyTone } from '../utils/partyDocumentEngine';

export const ToneConverterTab: React.FC = () => {
  const [rawText, setRawText] = useState<string>(
    'Đợt sinh hoạt chi bộ vừa rồi một số đồng chí đảng viên trẻ còn đi muộn, chưa chịu phát biểu ý kiến gì cả. Chi bộ cần nhắc nhở nghiêm khắc và trừ điểm thi đua cuối năm chứ để thế này mãi là không được.'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FormalRewriteResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRewrite = async () => {
    if (!rawText.trim()) {
      setErrorMessage('Vui lòng nhập đoạn văn bản cần chuyển đổi sang văn phong công tác Đảng.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // 1. Attempt Backend API with 45000ms timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const response = await fetch('/api/rewrite-formal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: FormalRewriteResult = await response.json();
        if (data && data.formal_text) {
          setResult(data);
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend rewrite failed or timed out, activating instant deterministic Party tone engine:', err);
    }

    // 2. Guaranteed zero-failure deterministic Party Tone Converter
    try {
      const localResult = rewriteClientSidePartyTone(rawText);
      setResult(localResult);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Đã có lỗi xảy ra: ' + (err.message || 'Lỗi chuyển đổi'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    copyToClipboard(result.formal_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleInputs = [
    {
      title: 'Chấn chỉnh sinh hoạt chi bộ',
      text: 'Đợt sinh hoạt chi bộ vừa rồi một số đồng chí đảng viên trẻ còn đi muộn, chưa chịu phát biểu ý kiến gì cả. Chi bộ cần nhắc nhở nghiêm khắc và trừ điểm thi đua cuối năm chứ để thế này mãi là không được.'
    },
    {
      title: 'Phát triển đảng viên mới',
      text: 'Đoàn thanh niên xã mình nhiều bạn làm kinh tế giỏi lắm nhưng chưa thấy ai vào Đảng. Đề nghị chi ủy phối hợp Đoàn xã rà soát mấy em tích cực rồi cho đi học lớp cảm tình Đảng để kết nạp trước Đại hội.'
    },
    {
      title: 'Đôn đốc kiểm tra giám sát',
      text: 'Đã hết quý 3 rồi mà tổ kiểm tra chưa nộp biên bản giám sát đảng viên phụ trách địa bàn. Đồng chí trưởng đoàn khẩn trương hoàn thành báo cáo nộp về Ban Thường vụ Đảng ủy trong tuần này.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-2 border border-red-200">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Văn Kiện Hóa & Chuẩn Mực Văn Phong Công Tác Đảng</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Chuyển Đổi Sang Văn Phong Chính Luận & Công Tác Đảng Chuẩn Mực
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Biến các ý kiến thảo luận thô, ghi chú cuộc họp hay biên bản sơ bộ thành các mệnh đề chính luận sắc sảo, đúng nguyên tắc tập trung dân chủ, tinh thần nghị quyết và phong cách văn kiện của Đảng Cộng sản Việt Nam.
        </p>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Thử nhanh tình huống công tác Đảng:</span>
          {sampleInputs.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRawText(sample.text);
                setResult(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 font-medium transition-colors border border-red-200"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Nội dung nháp / khẩu ngữ / ngôn ngữ thường</span>
            </span>
            <button
              onClick={() => setRawText('')}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
            >
              Xóa
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={8}
            placeholder="Nhập hoặc dán ý kiến, báo cáo sơ bộ hoặc nội dung chưa chuẩn văn phong hành chính..."
            className="w-full text-sm p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 focus:border-transparent bg-slate-50/50 resize-none text-slate-900 leading-relaxed"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1 px-1">
            <span>Hỗ trợ đoạn văn bản lên đến 10.000 ký tự</span>
            <span className="font-semibold text-slate-700">{rawText.length.toLocaleString('vi-VN')} / 10.000 ký tự</span>
          </div>

          {errorMessage && (
            <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleRewrite}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors border border-rose-300"
              >
                Thử lại ngay
              </button>
            </div>
          )}

          <button
            onClick={handleRewrite}
            disabled={loading || !rawText.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-md shadow-red-700/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Đang Chuyển Đổi Văn Phong...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Chuyển Sang Văn Phong Công Vụ</span>
              </>
            )}
          </button>
        </div>

        {/* Output Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Văn phong công vụ chuẩn mực</span>
            </span>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              {/* Converted text */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-xl text-slate-900 text-sm font-serif leading-relaxed whitespace-pre-wrap">
                {result.formal_text}
              </div>

              {/* Analysis */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-800 block">
                  Đánh giá chuyển đổi:
                </span>
                <p className="leading-relaxed">{result.original_analysis}</p>
              </div>

              {/* Key improvements */}
              {result.key_improvements && result.key_improvements.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Các điểm chuẩn hóa chính:
                  </span>
                  {result.key_improvements.map((imp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-400 p-8 my-auto min-h-[300px]">
              <ArrowRight className="w-10 h-10 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-700 text-sm mb-1">Kết quả văn phong công vụ</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Nội dung chuyển đổi với tính chuẩn xác, khách quan và trang trọng sẽ xuất hiện ở đây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
