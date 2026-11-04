import React, { useState } from 'react';
import { parsePartyDocumentText, ParsedPartyDocument } from '../utils/partyDocumentFormatter';
import { Columns, FileText, Check, Copy } from 'lucide-react';

interface PartyDocumentSheetViewProps {
  content: string;
  fontSize?: '13pt' | '14pt';
  className?: string;
}

export const PartyDocumentSheetView: React.FC<PartyDocumentSheetViewProps> = ({
  content,
  fontSize = '13pt',
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState<boolean>(false);

  const parsed: ParsedPartyDocument = parsePartyDocumentText(content);
  const fontPt = fontSize === '13pt' ? '13pt' : '14pt';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full max-w-2xl bg-white shadow-md rounded-lg border border-slate-300 relative ${className}`}>
      {/* Mode Switcher floating bar */}
      <div className="bg-stone-100 border-b border-stone-200 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setViewMode('formatted')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
              viewMode === 'formatted'
                ? 'bg-white text-red-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns className="w-3 h-3 text-red-700" />
            <span>Trình bày thể thức 2 cột (05-HD/VPTW)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
              viewMode === 'raw'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3 h-3 text-stone-600" />
            <span>Văn bản dạng thô (Plain Text)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-red-700 px-2 py-1 rounded hover:bg-white transition"
          title="Sao chép toàn văn bản"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>

      {viewMode === 'raw' ? (
        <div
          className="p-8 sm:p-12 font-admin text-slate-900 leading-relaxed whitespace-pre-wrap selection:bg-amber-100 text-justify"
          style={{ fontSize: fontPt, lineHeight: 1.45 }}
        >
          {content}
        </div>
      ) : (
        <div
          className="p-8 sm:p-12 font-admin text-slate-900 leading-relaxed selection:bg-amber-100"
          style={{ fontSize: fontPt, lineHeight: 1.45 }}
        >
          {/* HEADER 2-COLUMN TABLE (Chuẩn Hướng dẫn 05-HD/VPTW) */}
          <div className="grid grid-cols-12 gap-3 mb-6 pb-2">
            {/* Header Left (45%) */}
            <div className="col-span-5 text-center flex flex-col items-center">
              {parsed.parentOrg && (
                <div className="text-[12pt] font-normal uppercase leading-tight mb-0.5">
                  {parsed.parentOrg}
                </div>
              )}
              <div className="text-[12pt] font-bold uppercase leading-tight">
                {parsed.issuingOrg}
              </div>
              {/* Short line under issuing org (1/3 to 1/2 text width) */}
              <div className="w-24 h-[1.5px] bg-black my-1"></div>
              <div className="text-[12pt] font-normal mt-0.5 tracking-tight">
                {parsed.docNumber}
              </div>
              {parsed.isCongVan && parsed.subject && (
                <div className="text-[11pt] italic mt-1 leading-snug px-1">
                  {parsed.subject.startsWith('V/v') || parsed.subject.startsWith('Về việc')
                    ? parsed.subject
                    : `V/v ${parsed.subject}`}
                </div>
              )}
            </div>

            {/* Header Right (55%) */}
            <div className="col-span-7 text-center flex flex-col items-center">
              <div className="text-[12.5pt] font-bold uppercase tracking-tight leading-tight">
                ĐẢNG CỘNG SẢN VIỆT NAM
              </div>
              {/* Full line under Party motto */}
              <div className="w-48 sm:w-56 h-[1.5px] bg-black my-1"></div>
              <div className="text-[13pt] italic font-normal mt-0.5">
                {parsed.placeDate}
              </div>
            </div>
          </div>

          {/* TITLE & SUBJECT AREA */}
          {parsed.isCongVan ? (
            parsed.congVanRecipient ? (
              <div className="my-5 text-center">
                <div className="text-[13pt] font-bold">
                  Kính gửi: {parsed.congVanRecipient}
                </div>
              </div>
            ) : null
          ) : (
            <div className="text-center my-6">
              <div className="text-[14pt] font-bold uppercase tracking-wide">
                {parsed.docType}
              </div>
              <div className="text-[13pt] font-bold mt-1.5 max-w-lg mx-auto">
                {parsed.subject}
              </div>
              <div className="w-28 h-[1.5px] bg-black mx-auto mt-2 mb-4"></div>
              {parsed.congVanRecipient && (
                <div className="text-[13pt] font-bold text-center mt-3">
                  Kính gửi: {parsed.congVanRecipient}
                </div>
              )}
            </div>
          )}

          {/* BASES (Căn cứ...) */}
          {parsed.bases.length > 0 && (
            <div className="my-3 space-y-1">
              {parsed.bases.map((basis, idx) => (
                <p key={idx} className="text-[13pt] italic text-justify indent-8 leading-snug">
                  {basis}
                </p>
              ))}
            </div>
          )}

          {/* BODY PARAGRAPHS */}
          <div className="my-4 space-y-2">
            {parsed.bodyParagraphs.map((para, idx) => {
              const trimmed = para.trim();
              if (!trimmed) return <div key={idx} className="h-2"></div>;

              if (/^(BAN CHẤP HÀNH|BAN THƯỜNG VỤ|ĐẢNG ỦY)[\s\w]+(QUYẾT NGHỊ|QUYẾT ĐỊNH):/i.test(trimmed)) {
                return (
                  <p key={idx} className="text-[13pt] font-bold text-center uppercase my-3">
                    {trimmed}
                  </p>
                );
              }
              if (/^[I|V|X]+\.\s+/i.test(trimmed)) {
                return (
                  <p key={idx} className="text-[13pt] font-bold indent-8 mt-3 mb-1">
                    {trimmed}
                  </p>
                );
              }
              if (/^Điều \d+\./.test(trimmed)) {
                const dotIdx = trimmed.indexOf('.');
                return (
                  <p key={idx} className="text-[13pt] text-justify indent-8 leading-relaxed my-2">
                    <strong className="font-bold">{trimmed.slice(0, dotIdx + 1)}</strong>
                    {trimmed.slice(dotIdx + 1)}
                  </p>
                );
              }

              return (
                <p key={idx} className="text-[13pt] text-justify indent-8 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* FOOTER 2-COLUMN TABLE (Nơi nhận & Chữ ký) */}
          <div className="grid grid-cols-12 gap-3 mt-10 pt-4">
            {/* Left Column: Nơi nhận (48%) */}
            <div className="col-span-6 text-left">
              <div className="text-[11.5pt] font-bold italic mb-1">
                Nơi nhận:
              </div>
              <div className="text-[10.5pt] leading-tight space-y-0.5 text-stone-800">
                {parsed.recipients.map((rec, idx) => (
                  <div key={idx}>{rec}</div>
                ))}
              </div>
            </div>

            {/* Right Column: Thẩm quyền & Chữ ký (52%) */}
            <div className="col-span-6 text-center flex flex-col items-center justify-between min-h-[140px]">
              <div>
                {parsed.signerAuthority && (
                  <div className="text-[13pt] font-bold uppercase leading-tight">
                    {parsed.signerAuthority}
                  </div>
                )}
                {parsed.signerRole && (
                  <div className="text-[13pt] font-bold uppercase leading-tight mt-0.5">
                    {parsed.signerRole}
                  </div>
                )}
              </div>

              {/* Signature space (for physical signature & official red seal) */}
              <div className="h-14 sm:h-18 flex items-center justify-center text-xs text-stone-400 italic">
                (Chữ ký, dấu)
              </div>

              <div className="text-[13pt] font-bold">
                {parsed.signerName}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
