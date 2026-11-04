import React from 'react';
import { FileCheck, ShieldCheck, BookOpen, PenTool, Wand2, Star, MessageSquareText } from 'lucide-react';

interface HeaderProps {
  activeTab: 'review' | 'draft' | 'tone' | 'handbook' | 'chat';
  setActiveTab: (tab: 'review' | 'draft' | 'tone' | 'handbook' | 'chat') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-950 text-white border-b border-red-950/80 shadow-md sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-stone-950 text-amber-200 text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-red-800/40">
        <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto w-full gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">
              CHUYÊN BIỆT KHỐI CƠ QUAN ĐẢNG • HƯỚNG DẪN SỐ 05-HD/VPTW (27/5/2026) & QUY ĐỊNH SỐ 399-QĐ/TW CỦA BAN BÍ THƯ
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="bg-red-900/60 text-amber-300 px-2 py-0.5 rounded border border-red-700/60 font-semibold">
              ★ Hướng dẫn số 05-HD/VPTW
            </span>
            <span className="bg-amber-950/70 text-amber-300 px-2 py-0.5 rounded border border-amber-600/60 font-bold">
              ★ Quy định số 399-QĐ/TW
            </span>
          </div>
        </div>
      </div>

      {/* Main header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center shrink-0 border-2 border-amber-400/80 bg-white overflow-hidden p-0.5 ring-2 ring-red-700/60">
            <img
              src="/assets/aistudio/Logo_Van_Phong_Dang_Uy_3a47be70.svg"
              alt="Logo Văn Phòng Đảng Ủy Phường Tân Sơn Nhất"
              className="w-full h-full object-contain rounded-full select-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                TRỢ LÝ VĂN BẢN ĐẢNG AI
              </h1>
              <span className="bg-red-900/50 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded border border-amber-500/40 uppercase tracking-wider">
                Khối Cơ Quan Đảng 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300">
              Rà soát tiêu ngữ Đảng, bắt lỗi số ký hiệu, trích yếu, thẩm quyền ký, tự thêm Huy hiệu / Logo Đảng và chuẩn hóa văn kiện
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-red-900/30 shadow-inner overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'review'
                ? 'bg-red-800 text-white shadow-md border border-red-600/40'
                : 'text-stone-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Rà Soát Hướng Dẫn 05</span>
          </button>

          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'draft'
                ? 'bg-red-800 text-white shadow-md border border-red-600/40'
                : 'text-stone-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <PenTool className="w-4 h-4 text-amber-300" />
            <span>Soạn Thảo Chuẩn 2026</span>
          </button>

          <button
            onClick={() => setActiveTab('tone')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'tone'
                ? 'bg-red-800 text-white shadow-md border border-red-600/40'
                : 'text-stone-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Văn Phong Công Tác Đảng</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-red-800 text-white shadow-md border border-red-600/40'
                : 'text-stone-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <MessageSquareText className="w-4 h-4 text-amber-300" />
            <span>Trợ Lý Hỏi Đáp AI</span>
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
              Gemini
            </span>
          </button>

          <button
            onClick={() => setActiveTab('handbook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'handbook'
                ? 'bg-red-800 text-white shadow-md border border-red-600/40'
                : 'text-stone-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Cẩm Nang Thể Thức 05</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
