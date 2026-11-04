import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Sliders,
  Sparkles,
  Eye,
  EyeOff,
  Maximize2,
  X,
  Edit3,
  Layers,
  Move,
  Settings2,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { PartyLogoConfig, LogoType, LogoPosition, LogoSize } from '../types';

export const OFFICIAL_PARTY_LOGO_PATH = '/assets/aistudio/Logo_Van_Phong_Dang_Uy_3a47be70.svg';

export const DEFAULT_LOGO_CONFIG: PartyLogoConfig = {
  enabled: true,
  type: 'custom',
  customImageDataUrl: OFFICIAL_PARTY_LOGO_PATH,
  position: 'top-center',
  size: 'md',
  opacity: 1,
  showInPrint: true,
};

// Official Communist Party of Vietnam Hammer and Sickle (Búa Liềm) SVG Icon
export const PartyEmblemSvg: React.FC<{
  type: LogoType;
  sizePx: number;
  className?: string;
  opacity?: number;
}> = ({ type, sizePx, className = '', opacity = 1 }) => {
  const isGold = type === 'party-emblem-gold';
  const isMonochrome = type === 'party-emblem-monochrome';
  const isRed = type === 'party-emblem-red';

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      style={{ opacity }}
      role="img"
      aria-label="Huy hiệu Búa Liềm Đảng Cộng sản Việt Nam"
    >
      {/* Optional Gold circular background */}
      {isGold && (
        <>
          <circle cx="50" cy="50" r="48" fill="#DC2626" stroke="#B45309" strokeWidth="2" />
          <circle cx="50" cy="50" r="45" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        </>
      )}

      {/* Hammer (Búa) */}
      <g
        fill={isGold ? '#FDE047' : isMonochrome ? '#1E293B' : '#DC2626'}
        stroke={isGold ? '#B45309' : isMonochrome ? '#0F172A' : '#991B1B'}
        strokeWidth={isGold ? '1' : '0.5'}
      >
        {/* Hammer Handle (Cán búa chéo 45 độ) */}
        <path
          d="M26 77 C24 75, 25 72, 28 69 L67 30 C70 27, 73 28, 75 30 L77 32 C79 34, 78 37, 75 40 L36 79 C33 82, 30 81, 28 79 Z"
        />
        {/* Hammer Head (Đầu búa) */}
        <path
          d="M58 21 L77 40 L70 47 L65 42 L62 45 L58 41 L61 38 L56 33 L51 38 L47 34 L54 27 L51 24 Z"
        />
      </g>

      {/* Sickle (Liềm) */}
      <g
        fill={isGold ? '#FACC15' : isMonochrome ? '#0F172A' : '#B91C1C'}
        stroke={isGold ? '#92400E' : isMonochrome ? '#000000' : '#7F1D1D'}
        strokeWidth={isGold ? '1' : '0.5'}
      >
        {/* Sickle Handle (Cán liềm) */}
        <path
          d="M74 74 C72 72, 73 68, 76 65 L81 60 C83 58, 86 59, 88 61 L89 62 C91 64, 90 67, 88 70 L83 75 C80 78, 77 77, 74 74 Z"
        />
        {/* Sickle Blade (Lưỡi liềm vòng cung uốn lượn uyển chuyển) */}
        <path
          d="M77 62 C74 48, 62 33, 47 26 C35 20, 23 23, 19 28 C16 32, 19 36, 24 35 C32 34, 43 38, 50 48 C55 55, 56 65, 53 72 C50 78, 43 83, 37 83 C33 83, 30 80, 27 76 C25 73, 21 73, 20 76 C19 79, 21 84, 26 88 C34 94, 46 93, 56 86 C67 79, 75 70, 77 62 Z"
        />
      </g>
    </svg>
  );
};

// Render Logo or Custom Image based on config
export const PartyLogoDisplay: React.FC<{
  config: PartyLogoConfig;
  className?: string;
}> = ({ config, className = '' }) => {
  if (!config.enabled) return null;

  const sizeMap: Record<LogoSize, number> = {
    sm: 38,
    md: 52,
    lg: 68,
  };
  const sizePx = sizeMap[config.size] || 52;

  if (config.type === 'custom' && config.customImageDataUrl) {
    return (
      <img
        src={config.customImageDataUrl}
        alt="Logo Cơ Quan Đảng"
        style={{
          width: `${sizePx}px`,
          height: `${sizePx}px`,
          opacity: config.opacity ?? 1,
        }}
        className={`object-contain inline-block drop-shadow-xs transition-all ${className}`}
      />
    );
  }

  return (
    <PartyEmblemSvg
      type={config.type}
      sizePx={sizePx}
      opacity={config.opacity ?? 1}
      className={className}
    />
  );
};

// Watermark Display Component for Center Background
export const PartyWatermarkDisplay: React.FC<{
  config: PartyLogoConfig;
}> = ({ config }) => {
  if (!config.enabled || config.position !== 'watermark-center') return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="opacity-[0.06] transform scale-125 select-none print:opacity-[0.08]">
        {config.type === 'custom' && config.customImageDataUrl ? (
          <img
            src={config.customImageDataUrl}
            alt=""
            className="w-80 h-80 object-contain grayscale"
          />
        ) : (
          <PartyEmblemSvg
            type={config.type === 'party-emblem-gold' ? 'party-emblem-red' : config.type}
            sizePx={320}
          />
        )}
      </div>
    </div>
  );
};

// Full In-Place Quick Customization Modal for Party Logo
export const PartyLogoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  config: PartyLogoConfig;
  onChange: (newConfig: PartyLogoConfig) => void;
}> = ({ isOpen, onClose, config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...config,
        enabled: true,
        type: 'custom',
        customImageDataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-amber-200/80 w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-red-800 via-red-700 to-amber-700 text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden border border-amber-300 p-0.5">
              <img
                src={OFFICIAL_PARTY_LOGO_PATH}
                alt="Logo Đảng"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-100 flex items-center gap-2">
                <span>Tùy Chỉnh & Thay Đổi Logo Văn Bản Đảng</span>
                <span className="text-[10px] font-semibold bg-amber-300 text-red-950 px-2 py-0.5 rounded-full">
                  Trực Tiếp
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/90">
                Chuẩn Hướng dẫn số 05-HD/VPTW và Quy định 399-QĐ/TW
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Status and Master Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950">
                Trạng thái hiển thị logo trên trang văn bản:
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...config, enabled: !config.enabled })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                config.enabled
                  ? 'bg-red-700 text-white hover:bg-red-800'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {config.enabled ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>Đang Hiển Thị</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Đang Tắt</span>
                </>
              )}
            </button>
          </div>

          {/* Section 1: Upload Custom Logo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-red-700" />
                <span>Cách 1: Tải ảnh Logo riêng của cơ quan / đảng bộ</span>
              </label>
              {config.customImageDataUrl && (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Đang dùng ảnh tự nạp
                </span>
              )}
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-red-600 bg-red-50/70 scale-[0.99]'
                  : config.type === 'custom' && config.customImageDataUrl
                  ? 'border-amber-400 bg-amber-50/40'
                  : 'border-slate-300 hover:border-red-500 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomImageUpload}
                accept="image/*"
                className="hidden"
              />

              {config.customImageDataUrl ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-amber-300 shadow-xs">
                    <img
                      src={config.customImageDataUrl}
                      alt="Logo đã tải"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-slate-900">
                      Ảnh Logo tùy chỉnh của bạn đã sẵn sàng
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Nhấp vào đây để thay đổi ảnh khác (PNG, JPG, SVG, WebP)
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="text-xs font-semibold text-red-700 hover:text-red-800 underline"
                      >
                        Chọn ảnh khác
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange({
                            ...config,
                            type: 'party-emblem-gold',
                            customImageDataUrl: undefined,
                          });
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa ảnh tự nạp</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-red-700 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Bấm để tải tệp ảnh từ máy tính hoặc kéo thả ảnh vào đây
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hỗ trợ định dạng PNG, JPG, JPEG, SVG, WebP (Nên dùng ảnh nền trong suốt)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Choose Official Party Emblems & Logos */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Cách 2: Hoặc chọn mẫu Biểu trưng / Logo chuẩn:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    enabled: true,
                    type: 'custom',
                    customImageDataUrl: OFFICIAL_PARTY_LOGO_PATH,
                  })
                }
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  config.enabled &&
                  config.type === 'custom' &&
                  config.customImageDataUrl === OFFICIAL_PARTY_LOGO_PATH
                    ? 'border-red-600 bg-red-50/70 ring-2 ring-red-500 font-bold'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 bg-white'
                }`}
              >
                <img
                  src={OFFICIAL_PARTY_LOGO_PATH}
                  alt="Logo Văn Phòng Đảng Ủy"
                  className="w-9 h-9 object-contain rounded-full border border-amber-400 bg-white shadow-2xs"
                />
                <div>
                  <div className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                    <span>Logo VP Đảng Ủy</span>
                    <span className="text-[9px] bg-red-700 text-amber-200 px-1.5 py-0.2 rounded font-semibold">
                      Chính thức
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Phường Tân Sơn Nhất (Vector tròn)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, enabled: true, type: 'party-emblem-gold' })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  config.enabled && config.type === 'party-emblem-gold'
                    ? 'border-red-600 bg-red-50/70 ring-2 ring-red-500 font-bold'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 bg-white'
                }`}
              >
                <PartyEmblemSvg type="party-emblem-gold" sizePx={32} />
                <div>
                  <div className="text-xs text-slate-900 font-bold">Búa Liềm Vàng-Đỏ</div>
                  <div className="text-[10px] text-slate-500">Mẫu trang trọng chuẩn</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({ ...config, enabled: true, type: 'party-emblem-monochrome' })
                }
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  config.enabled && config.type === 'party-emblem-monochrome'
                    ? 'border-red-600 bg-red-50/70 ring-2 ring-red-500 font-bold'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 bg-white'
                }`}
              >
                <PartyEmblemSvg type="party-emblem-monochrome" sizePx={32} />
                <div>
                  <div className="text-xs text-slate-900 font-bold">Đơn Sắc (In Ấn)</div>
                  <div className="text-[10px] text-slate-500">Tối ưu in ấn đen trắng</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, enabled: true, type: 'party-emblem-red' })}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  config.enabled && config.type === 'party-emblem-red'
                    ? 'border-red-600 bg-red-50/70 ring-2 ring-red-500 font-bold'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 bg-white'
                }`}
              >
                <PartyEmblemSvg type="party-emblem-red" sizePx={32} />
                <div>
                  <div className="text-xs text-slate-900 font-bold">Búa Liềm Đỏ</div>
                  <div className="text-[10px] text-slate-500">Nền trong suốt</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Position on Document */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-blue-600" />
              <span>Vị trí hiển thị trên trang văn bản:</span>
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onChange({ ...config, position: 'top-center' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition ${
                  config.position === 'top-center'
                    ? 'bg-red-700 text-white border-red-700 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Đỉnh giữa trang
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...config, position: 'top-left' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition ${
                  config.position === 'top-left'
                    ? 'bg-red-700 text-white border-red-700 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Góc trên bên trái
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...config, position: 'watermark-center' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition ${
                  config.position === 'watermark-center'
                    ? 'bg-red-700 text-white border-red-700 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Dấu chìm Watermark
              </button>
            </div>
          </div>

          {/* Section 4: Size and Opacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Kích thước Logo:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['sm', 'md', 'lg'] as LogoSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChange({ ...config, size: s })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition font-semibold ${
                      config.size === s
                        ? 'bg-red-700 text-white border-red-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s === 'sm' ? 'Nhỏ (38px)' : s === 'md' ? 'Vừa (52px)' : 'Lớn (68px)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">Độ rõ nét / Mờ:</label>
                <span className="text-xs font-mono font-semibold text-red-700">
                  {Math.round((config.opacity ?? 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={config.opacity ?? 1}
                onChange={(e) => onChange({ ...config, opacity: parseFloat(e.target.value) })}
                className="w-full accent-red-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mọi thay đổi sẽ cập nhật tức thì trên văn bản và file in PDF</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
          >
            Áp Dụng & Xong
          </button>
        </div>
      </div>
    </div>
  );
};

// Interactive Editable Logo Spot placed directly on the document sheet
export const EditablePartyLogoSpot: React.FC<{
  config: PartyLogoConfig;
  onChange: (newConfig: PartyLogoConfig) => void;
  className?: string;
  showPlaceholderWhenDisabled?: boolean;
}> = ({ config, onChange, className = '', showPlaceholderWhenDisabled = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If enabled and positioned top-center
  if (config.enabled && config.position === 'top-center') {
    return (
      <>
        <div
          className={`mb-4 text-center select-none print:mb-2 relative z-20 group inline-block mx-auto ${className}`}
        >
          <div
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsModalOpen(true);
              }
            }}
            title="Nhấp vào đây để thay đổi hoặc tải ảnh Logo mới"
            className="cursor-pointer relative inline-block p-1.5 rounded-xl border-2 border-transparent hover:border-red-500/70 hover:bg-red-50/50 hover:shadow-md transition-all duration-200"
          >
            <PartyLogoDisplay config={config} className="mx-auto" />

            {/* Floating edit badge on hover */}
            <div className="print:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-red-700 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
              <Edit3 className="w-3 h-3" />
              <span>Đổi logo / Tải ảnh</span>
            </div>
          </div>
        </div>

        <PartyLogoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          config={config}
          onChange={onChange}
        />
      </>
    );
  }

  // If enabled and positioned top-left
  if (config.enabled && config.position === 'top-left') {
    return (
      <>
        <div
          className={`mb-3 select-none relative z-20 group inline-block ${className}`}
        >
          <div
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsModalOpen(true);
              }
            }}
            title="Nhấp vào đây để thay đổi hoặc tải ảnh Logo mới"
            className="cursor-pointer relative inline-block p-1.5 rounded-xl border-2 border-transparent hover:border-red-500/70 hover:bg-red-50/50 hover:shadow-md transition-all duration-200"
          >
            <PartyLogoDisplay config={config} />

            {/* Floating edit badge on hover */}
            <div className="print:hidden absolute -bottom-3 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-red-700 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
              <Edit3 className="w-3 h-3" />
              <span>Đổi logo / Tải ảnh</span>
            </div>
          </div>
        </div>

        <PartyLogoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          config={config}
          onChange={onChange}
        />
      </>
    );
  }

  // If enabled as watermark, show an interactive watermark pill at the top of the paper
  if (config.enabled && config.position === 'watermark-center') {
    return (
      <>
        <div className="print:hidden mb-3 flex items-center justify-center relative z-20">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100/80 text-amber-900 border border-amber-300 hover:bg-amber-200/90 shadow-2xs transition group"
            title="Nhấp để đổi sang dạng logo đỉnh hoặc tải ảnh logo riêng"
          >
            <PartyEmblemSvg type={config.type} sizePx={14} />
            <span>Đang bật Dấu chìm Huy hiệu Đảng •</span>
            <span className="text-red-700 font-bold group-hover:underline flex items-center gap-0.5">
              <Edit3 className="w-3 h-3 inline" /> Thay đổi / Tải ảnh
            </span>
          </button>
        </div>

        <PartyLogoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          config={config}
          onChange={onChange}
        />
      </>
    );
  }

  // If disabled, show a subtle placeholder button directly at the top of the document
  if (!config.enabled && showPlaceholderWhenDisabled) {
    return (
      <>
        <div className="print:hidden mb-4 text-center relative z-20">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-800 bg-slate-50 hover:bg-red-50 border border-dashed border-slate-300 hover:border-red-400 transition group shadow-2xs"
            title="Nhấp để chèn Huy hiệu Đảng hoặc tải logo riêng lên đầu trang"
          >
            <PartyEmblemSvg type="party-emblem-gold" sizePx={15} />
            <span>+ Chèn Logo / Huy hiệu Đảng vào đây (Nhấp để chọn hoặc tải ảnh)</span>
          </button>
        </div>

        <PartyLogoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          config={config}
          onChange={onChange}
        />
      </>
    );
  }

  return null;
};

// Interactive Selector Component for Sidebar Form
export const PartyLogoSelector: React.FC<{
  config: PartyLogoConfig;
  onChange: (newConfig: PartyLogoConfig) => void;
}> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...config,
        enabled: true,
        type: 'custom',
        customImageDataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 space-y-3">
      {/* Top Header & Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-700 text-amber-300 flex items-center justify-center shadow-2xs">
            <PartyEmblemSvg type={config.type} sizePx={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <span>Huy Hiệu / Logo Cơ Quan Đảng</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-700 text-amber-200 hover:bg-red-800 transition"
              >
                ✏️ Tùy Chỉnh Nhanh
              </button>
            </h4>
            <p className="text-[11px] text-amber-800">
              Nhấp trực tiếp vào logo trên văn bản hoặc chọn bên dưới để thay đổi
            </p>
          </div>
        </div>

        {/* Enable / Disable switch */}
        <button
          type="button"
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
            config.enabled
              ? 'bg-red-700 text-white hover:bg-red-800'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {config.enabled ? (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Đang Bật</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Đang Tắt</span>
            </>
          )}
        </button>
      </div>

      {/* Configuration Controls (Shown when enabled) */}
      {config.enabled && (
        <div className="space-y-3 pt-2 border-t border-amber-200/80">
          {/* Preset / Type selection */}
          <div>
            <span className="block text-[11px] font-bold text-amber-950 mb-1.5">
              Chọn mẫu biểu trưng hoặc tải ảnh:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    type: 'custom',
                    customImageDataUrl: OFFICIAL_PARTY_LOGO_PATH,
                  })
                }
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition text-xs ${
                  config.type === 'custom' &&
                  config.customImageDataUrl === OFFICIAL_PARTY_LOGO_PATH
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-500'
                    : 'bg-white border-amber-200 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                <img
                  src={OFFICIAL_PARTY_LOGO_PATH}
                  alt="Logo VP Đảng Ủy"
                  className="w-6 h-6 object-contain rounded-full border border-amber-300 bg-white shrink-0"
                />
                <span className="text-[11px] leading-tight font-bold text-red-950">VP Đảng Ủy</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, type: 'party-emblem-gold' })}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                  config.type === 'party-emblem-gold'
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-500'
                    : 'bg-white border-amber-200 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                <PartyEmblemSvg type="party-emblem-gold" sizePx={24} />
                <span className="text-[11px] leading-tight">Búa Liềm Vàng-Đỏ</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, type: 'party-emblem-monochrome' })}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                  config.type === 'party-emblem-monochrome'
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-500'
                    : 'bg-white border-amber-200 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                <PartyEmblemSvg type="party-emblem-monochrome" sizePx={24} />
                <span className="text-[11px] leading-tight">Đơn sắc (In ấn)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, type: 'party-emblem-red' })}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                  config.type === 'party-emblem-red'
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-500'
                    : 'bg-white border-amber-200 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                <PartyEmblemSvg type="party-emblem-red" sizePx={24} />
                <span className="text-[11px] leading-tight">Búa Liềm Đỏ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (config.customImageDataUrl && config.customImageDataUrl !== OFFICIAL_PARTY_LOGO_PATH) {
                    onChange({ ...config, type: 'custom' });
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                  config.type === 'custom' && config.customImageDataUrl !== OFFICIAL_PARTY_LOGO_PATH
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-500'
                    : 'bg-white border-amber-200 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                {config.customImageDataUrl && config.customImageDataUrl !== OFFICIAL_PARTY_LOGO_PATH ? (
                  <img
                    src={config.customImageDataUrl}
                    alt=""
                    className="w-6 h-6 object-contain rounded"
                  />
                ) : (
                  <Upload className="w-5 h-5 text-amber-700 shrink-0" />
                )}
                <span className="text-[11px] leading-tight">
                  {config.customImageDataUrl && config.customImageDataUrl !== OFFICIAL_PARTY_LOGO_PATH
                    ? 'Ảnh Khác'
                    : 'Tải Lên...'}
                </span>
              </button>
            </div>

            {/* Hidden file input for custom logo */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* If custom image exists, show controls to re-upload or clear */}
          {config.customImageDataUrl && (
            <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-amber-200 text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={config.customImageDataUrl}
                  alt="Logo"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-slate-700 font-medium text-[11px]">Đã nạp logo riêng của bạn</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-amber-800 hover:text-amber-900 font-semibold text-[11px] underline"
                >
                  Đổi ảnh khác
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...config,
                      type: 'party-emblem-gold',
                      customImageDataUrl: undefined,
                    });
                  }}
                  className="text-rose-700 hover:text-rose-800 text-[11px] flex items-center gap-0.5"
                  title="Xóa logo tùy chỉnh"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          )}

          {/* Position & Size Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Position */}
            <div>
              <span className="block text-[11px] font-bold text-amber-950 mb-1">
                Vị trí hiển thị trên văn bản:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => onChange({ ...config, position: 'top-center' })}
                  className={`py-1.5 px-2 rounded-lg border text-center transition font-medium ${
                    config.position === 'top-center'
                      ? 'bg-red-700 text-white border-red-700 font-bold shadow-2xs'
                      : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                  }`}
                  title="Đặt ở đỉnh trung tâm phía trên tiêu ngữ và cơ quan ban hành"
                >
                  Đỉnh giữa trang
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...config, position: 'top-left' })}
                  className={`py-1.5 px-2 rounded-lg border text-center transition font-medium ${
                    config.position === 'top-left'
                      ? 'bg-red-700 text-white border-red-700 font-bold shadow-2xs'
                      : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                  }`}
                  title="Đặt cạnh tên cơ quan Đảng ban hành ở góc trên bên trái"
                >
                  Góc trên trái
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...config, position: 'watermark-center' })}
                  className={`py-1.5 px-2 rounded-lg border text-center transition font-medium ${
                    config.position === 'watermark-center'
                      ? 'bg-red-700 text-white border-red-700 font-bold shadow-2xs'
                      : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                  }`}
                  title="Hiển thị dấu chìm mờ lớn ở giữa toàn bộ trang văn bản"
                >
                  Dấu chìm mờ
                </button>
              </div>
            </div>

            {/* Size */}
            <div>
              <span className="block text-[11px] font-bold text-amber-950 mb-1">
                Kích thước Huy hiệu / Logo:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['sm', 'md', 'lg'] as LogoSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChange({ ...config, size: s })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition font-medium ${
                      config.size === s
                        ? 'bg-red-700 text-white border-red-700 font-bold shadow-2xs'
                        : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    {s === 'sm' ? 'Nhỏ (38px)' : s === 'md' ? 'Vừa (52px)' : 'Lớn (68px)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Modal trigger */}
      <PartyLogoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={config}
        onChange={onChange}
      />
    </div>
  );
};
