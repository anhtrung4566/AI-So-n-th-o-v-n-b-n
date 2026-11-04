import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReviewTab } from './components/ReviewTab';
import { DraftingTab } from './components/DraftingTab';
import { ToneConverterTab } from './components/ToneConverterTab';
import { HandbookTab } from './components/HandbookTab';
import { ChatTab } from './components/ChatTab';
import { ShieldCheck, BookOpen, Heart, FileCheck, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'review' | 'draft' | 'tone' | 'handbook' | 'chat'>('review');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-red-200">
      {/* Global Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'draft' && <DraftingTab />}
        {activeTab === 'tone' && <ToneConverterTab />}
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'handbook' && <HandbookTab />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-stone-400 text-xs border-t border-red-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white border border-amber-400/80 flex items-center justify-center overflow-hidden p-0.5 shadow-sm shrink-0">
              <img
                src="/assets/aistudio/Logo_Van_Phong_Dang_Uy_3a47be70.svg"
                alt="Logo Văn Phòng Đảng Ủy"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <p className="font-bold text-stone-200">
                TRỢ LÝ VĂN BẢN ĐẢNG AI • HỆ THỐNG THỂ THỨC VĂN KIỆN CƠ QUAN ĐẢNG 2026
              </p>
              <p className="text-[11px] text-stone-400">
                Chuẩn hóa theo Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 của Văn phòng Trung ương Đảng & Quy định số 399-QĐ/TW của Ban Bí thư
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-stone-300">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Tiêu ngữ: ĐẢNG CỘNG SẢN VIỆT NAM</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Số: [số]-[loại]/[cơ quan]</span>
            </span>
            <span className="text-amber-500 font-bold">Chuẩn 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
