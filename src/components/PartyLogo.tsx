import React, { useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Sliders,
  Sparkles,
  Eye,
  EyeOff,
  Maximize2
} from 'lucide-react';
import { PartyLogoConfig, LogoType, LogoPosition, LogoSize } from '../types';

export const DEFAULT_LOGO_CONFIG: PartyLogoConfig = {
  enabled: true,
  type: 'party-emblem-gold',
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
        className={`object-contain inline-block drop-shadow-xs ${className}`}
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

// Interactive Selector Component for Drafting / Review Tabs
export const PartyLogoSelector: React.FC<{
  config: PartyLogoConfig;
  onChange: (newConfig: PartyLogoConfig) => void;
}> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                Tính năng mới
              </span>
            </h4>
            <p className="text-[11px] text-amber-800">
              Tự động chèn Huy hiệu Búa Liềm hoặc tải lên Logo / Biểu trưng Đảng bộ
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
              Chọn mẫu biểu trưng / Huy hiệu:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  if (config.customImageDataUrl) {
                    onChange({ ...config, type: 'custom' });
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                  config.type === 'custom'
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-1 ring-red-500'
                    : 'bg-white border-amber-200 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                {config.customImageDataUrl ? (
                  <img
                    src={config.customImageDataUrl}
                    alt=""
                    className="w-6 h-6 object-contain rounded"
                  />
                ) : (
                  <Upload className="w-5 h-5 text-amber-700 shrink-0" />
                )}
                <span className="text-[11px] leading-tight">
                  {config.customImageDataUrl ? 'Logo Tự Tải' : 'Tải Logo Lên...'}
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
    </div>
  );
};
