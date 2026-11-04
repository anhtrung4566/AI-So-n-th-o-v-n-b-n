import React from 'react';
import { Sparkles, Bot, Zap, Cpu, Check, Info } from 'lucide-react';

export type AiEngineType = 'gemini' | 'chatgpt';
export type AiModelType = 'gemini-flash' | 'gemini-pro' | 'gpt-4o';

interface AiEngineSelectorProps {
  selectedEngine: AiEngineType;
  onChangeEngine: (engine: AiEngineType) => void;
  selectedModel?: AiModelType;
  onChangeModel?: (model: AiModelType) => void;
  compact?: boolean;
  className?: string;
}

export const AiEngineSelector: React.FC<AiEngineSelectorProps> = ({
  selectedEngine,
  onChangeEngine,
  selectedModel = selectedEngine === 'chatgpt' ? 'gpt-4o' : 'gemini-flash',
  onChangeModel,
  compact = false,
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-xl p-3 border border-red-900/40 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-700 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
              <span>Động cơ AI phân tích & tạo văn bản:</span>
              <span className="text-[10px] font-semibold text-amber-300 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-800">
                Song song Gemini & ChatGPT
              </span>
            </div>
            {!compact && (
              <p className="text-[11px] text-stone-400">
                Lựa chọn mô hình trí tuệ nhân tạo để thẩm định thể thức và biên soạn văn kiện
              </p>
            )}
          </div>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 text-xs">
          <button
            type="button"
            onClick={() => {
              onChangeEngine('gemini');
              if (onChangeModel) onChangeModel('gemini-flash');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
              selectedEngine === 'gemini'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs font-bold'
                : 'text-stone-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Google Gemini AI</span>
            {selectedEngine === 'gemini' && <Check className="w-3 h-3 text-cyan-200" />}
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeEngine('chatgpt');
              if (onChangeModel) onChangeModel('gpt-4o');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
              selectedEngine === 'chatgpt'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs font-bold'
                : 'text-stone-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-300" />
            <span>OpenAI ChatGPT-4o</span>
            {selectedEngine === 'chatgpt' && <Check className="w-3 h-3 text-emerald-200" />}
          </button>
        </div>
      </div>

      {/* Model Spec Sub-bar */}
      {selectedEngine === 'gemini' && onChangeModel && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span>Phiên bản mô hình:</span>
            <button
              type="button"
              onClick={() => onChangeModel('gemini-flash')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                selectedModel === 'gemini-flash'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-stone-300 hover:bg-slate-700'
              }`}
            >
              Gemini 3.8 Flash (Tốc độ cao)
            </button>
            <button
              type="button"
              onClick={() => onChangeModel('gemini-pro')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                selectedModel === 'gemini-pro'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-stone-300 hover:bg-slate-700'
              }`}
            >
              Gemini Pro (Lý luận sâu)
            </button>
          </div>
          <span className="text-cyan-300/80 italic font-mono text-[10px]">
            ✓ Tối ưu Hướng dẫn 05-HD/VPTW 2026
          </span>
        </div>
      )}

      {selectedEngine === 'chatgpt' && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/90 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">ChatGPT-4o Đảng Bộ:</span>
            <span>Chuyên sâu văn phong chính luận, tính chỉ đạo & lập luận của Đảng</span>
          </div>
          <span className="text-emerald-300/80 italic font-mono text-[10px]">
            ✓ Chuẩn Quy định 399-QĐ/TW
          </span>
        </div>
      )}
    </div>
  );
};

// AI Badge displayed on the generated/reviewed document
export const AiModelBadge: React.FC<{
  engine?: 'gemini' | 'chatgpt';
  model?: string;
  actionText?: string;
  className?: string;
}> = ({ engine = 'gemini', model, actionText, className = '' }) => {
  const isGpt = engine === 'chatgpt';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs border ${
        isGpt
          ? 'bg-emerald-950/90 text-emerald-200 border-emerald-600/70'
          : 'bg-blue-950/90 text-cyan-200 border-blue-600/70'
      } ${className}`}
    >
      {isGpt ? (
        <Bot className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
      )}
      <span>
        {actionText ? `${actionText}: ` : ''}
        {isGpt ? (model || 'OpenAI ChatGPT-4o') : (model || 'Google Gemini 3.8 Flash')}
      </span>
    </div>
  );
};
