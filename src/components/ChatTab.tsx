import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  Trash2,
  Cpu,
  Layers,
  Zap,
  CheckCircle,
  ExternalLink,
  Key,
  Info,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  engineUsed?: string;
  modelUsed?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    text: `**Xin chào đồng chí! Tôi là Trợ Lý Trực Tuyến AI đa nền tảng (tích hợp song song Gemini & ChatGPT) chuyên trách Thể thức & Nghiệp vụ Văn bản Khối Cơ Quan Đảng.**

Hệ thống được thiết lập chuyên sâu theo:
- **Hướng dẫn số 05-HD/VPTW ngày 27/5/2026** của Văn phòng Trung ương Đảng về thể thức và kỹ thuật trình bày văn bản của Đảng *(thay thế Hướng dẫn 36-HD/VPTW năm 2018)*.
- **Quy định số 399-QĐ/TW ngày 09/01/2026** của Ban Bí thư về thể loại, thẩm quyền ban hành và thể thức văn bản của Đảng.

Đồng chí có thể linh hoạt chuyển đổi giữa **Google Gemini (Flash / Pro)** và **OpenAI ChatGPT-4o** ở thanh công cụ phía trên để nhận câu trả lời phù hợp nhất.

Đồng chí có thể hỏi tôi bất kỳ vấn đề gì về:
1. **Thể thức tiêu ngữ, kẻ chỉ, số ký hiệu, trích yếu, địa danh ngày tháng**.
2. **Thẩm quyền ký văn bản** (*T/M, K/T, Đ/D...*) cho Ban Chấp hành, Ban Thường vụ, Bí thư, Phó Bí thư, Văn phòng cấp ủy.
3. **Soạn thảo nhanh biểu mẫu** hoặc kiểm tra tính pháp lý, căn cứ ban hành cho 25 thể loại văn bản Đảng.
4. **Chuẩn hóa văn phong công vụ Đảng** trang trọng, cô đọng, chặt chẽ.`,
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    engineUsed: 'gemini',
    modelUsed: 'Gemini 2.5 Flash',
  },
];

const SUGGESTED_PROMPTS = [
  {
    category: 'Hướng dẫn 05/2026',
    label: 'Điểm mới Hướng dẫn 05 so với Hướng dẫn 36',
    prompt: 'Nêu các điểm mới quan trọng nhất của Hướng dẫn số 05-HD/VPTW ngày 27/5/2026 so với Hướng dẫn 36-HD/VPTW năm 2018 của Văn phòng Trung ương Đảng?',
  },
  {
    category: 'Thể thức tiêu ngữ',
    label: 'Quy tắc trình bày Tiêu ngữ Đảng 2026',
    prompt: 'Quy tắc trình bày Tiêu ngữ "ĐẢNG CỘNG SẢN VIỆT NAM", phông chữ, cỡ chữ và đường kẻ ngang theo Hướng dẫn số 05-HD/VPTW quy định như thế nào?',
  },
  {
    category: 'Thẩm quyền ký',
    label: 'Phân biệt quyền ký T/M và K/T',
    prompt: 'Theo Quy định số 399-QĐ/TW của Ban Bí thư, cách ghi thẩm quyền và chức vụ ký (T/M, K/T, Đ/D) trong cơ quan Đảng được phân biệt cụ thể ra sao?',
  },
  {
    category: 'Số và ký hiệu',
    label: 'Cú pháp số ký hiệu văn bản cấp Đảng ủy',
    prompt: 'Hướng dẫn cách ghi Số và ký hiệu cho Công văn, Quyết định, Nghị quyết của Đảng ủy và Chi bộ cơ sở chuẩn theo Hướng dẫn 05-HD/VPTW?',
  },
  {
    category: 'Soạn thảo nhanh',
    label: 'Mẫu Công văn triệu tập hội nghị',
    prompt: 'Soạn giúp tôi toàn văn một mẫu Công văn triệu tập Hội nghị sơ kết công tác Đảng 6 tháng đầu năm của Đảng ủy cơ sở chuẩn thể thức Hướng dẫn 05-HD/VPTW.',
  },
  {
    category: 'Văn phong Đảng',
    label: 'Chuẩn hóa văn phong chỉ đạo',
    prompt: 'Những từ ngữ, cụm từ và phong cách hành văn nào cần đặc biệt lưu ý khi biên tập văn bản chỉ đạo của cấp ủy Đảng để đảm bảo chuẩn mực công tác Đảng?',
  },
];

// Simple, safe markdown-like formatter for chat bubbles
function formatMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="list-disc list-inside space-y-1.5 my-2 ml-1 text-stone-800">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    // Headers
    if (line.startsWith('### ')) {
      flushList(`h3-${index}`);
      elements.push(
        <h4 key={`h-${index}`} className="text-base font-bold text-red-950 mt-3 mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-red-700 rounded-sm inline-block"></span>
          {renderInlineStyles(line.replace('### ', ''))}
        </h4>
      );
      return;
    }
    if (line.startsWith('## ') || line.startsWith('# ')) {
      flushList(`h2-${index}`);
      elements.push(
        <h3 key={`h-${index}`} className="text-lg font-extrabold text-red-950 mt-3.5 mb-2 border-b border-red-200/60 pb-1">
          {renderInlineStyles(line.replace(/^#+\s*/, ''))}
        </h3>
      );
      return;
    }

    // Bullet lists
    if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      inList = true;
      const content = line.replace(/^(-\s+|\*\s+|\d+\.\s+)/, '');
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed">
          {renderInlineStyles(content)}
        </li>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushList(`bq-${index}`);
      elements.push(
        <blockquote key={`bq-${index}`} className="border-l-4 border-amber-600 bg-amber-50/70 text-amber-950 px-3 py-2 rounded-r-md text-sm my-2 italic">
          {renderInlineStyles(line.replace(/^>\s*/, ''))}
        </blockquote>
      );
      return;
    }

    // Normal paragraph
    flushList(`p-${index}`);
    if (line === '') {
      elements.push(<div key={`sp-${index}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${index}`} className="leading-relaxed my-1.5 text-stone-900">
          {renderInlineStyles(line)}
        </p>
      );
    }
  });

  flushList('final');
  return elements;
}

// Inline style renderer for **bold**, *italic*, `code`
function renderInlineStyles(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-red-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-red-50 text-red-800 text-xs px-1.5 py-0.5 rounded font-mono border border-red-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={i} className="italic text-stone-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI Engine & Model Selection
  const [selectedEngine, setSelectedEngine] = useState<'gemini' | 'chatgpt'>('gemini');
  const [selectedModel, setSelectedModel] = useState<'gemini-flash' | 'gemini-pro' | 'gpt-4o'>('gemini-flash');

  // Account linking info modal
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = (customMessage || input).trim();
    if (!textToSend || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customMessage) {
      setInput('');
    }

    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          engine: selectedEngine,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Đã xử lý câu hỏi của đồng chí.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        engineUsed: data.engineUsed || selectedEngine,
        modelUsed: data.modelUsed || (selectedEngine === 'chatgpt' ? 'ChatGPT-4o' : selectedModel),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Không thể kết nối tới Trợ lý AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Đồng chí có chắc muốn xóa lịch sử trò chuyện này?')) {
      setMessages(INITIAL_MESSAGES);
      setErrorMsg(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner with Multi-Engine Switcher & Account Link */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-stone-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-red-800/40 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                  TRỢ LÝ TRỰC TUYẾN AI • GEMINI & CHATGPT
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Đa Mô Hình Trực Tiếp
                </span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Giải đáp 24/7 về Thể thức Hướng dẫn số 05-HD/VPTW (27/5/2026) & Quy định 399-QĐ/TW của Ban Bí thư
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Account Link Badge Button */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/40 transition shadow-2xs"
              title="Xem thông tin kết nối tài khoản Gemini Pro & ChatGPT"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Liên kết Gemini Pro</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-xs font-medium border border-stone-700/60 transition"
              title="Xóa toàn bộ cuộc trò chuyện"
            >
              <Trash2 className="w-3.5 h-3.5 text-stone-400" />
              <span>Xóa hội thoại</span>
            </button>
          </div>
        </div>

        {/* Engine & Model Selector Bar */}
        <div className="mt-5 pt-4 border-t border-red-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-200/90 font-bold uppercase tracking-wider flex items-center gap-1 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Động cơ AI trả lời:
            </span>

            {/* Model Selector Buttons */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-red-900/60 shadow-inner">
              <button
                onClick={() => {
                  setSelectedEngine('gemini');
                  setSelectedModel('gemini-flash');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                  selectedEngine === 'gemini' && selectedModel === 'gemini-flash'
                    ? 'bg-red-800 text-amber-300 shadow-xs font-bold border border-red-600/50'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Gemini 2.5 Flash</span>
                <span className="text-[10px] bg-red-950 px-1.5 py-0.2 rounded text-amber-200">2s</span>
              </button>

              <button
                onClick={() => {
                  setSelectedEngine('gemini');
                  setSelectedModel('gemini-pro');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                  selectedEngine === 'gemini' && selectedModel === 'gemini-pro'
                    ? 'bg-amber-600 text-slate-950 shadow-xs font-bold border border-amber-400'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Gemini Pro</span>
                <span className="text-[10px] bg-amber-950 px-1.5 py-0.2 rounded text-amber-200">Suy luận</span>
              </button>

              <button
                onClick={() => {
                  setSelectedEngine('chatgpt');
                  setSelectedModel('gpt-4o');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                  selectedEngine === 'chatgpt'
                    ? 'bg-emerald-700 text-white shadow-xs font-bold border border-emerald-500'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-300" />
                <span>ChatGPT (GPT-4o)</span>
                <span className="text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded text-emerald-200">OpenAI</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-amber-200/80 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
            <span>
              {selectedEngine === 'chatgpt'
                ? 'Đang áp dụng: Phong cách công vụ OpenAI ChatGPT-4o'
                : selectedModel === 'gemini-pro'
                ? 'Đang áp dụng: Google Gemini Pro (Thẩm định chuyên sâu)'
                : 'Đang áp dụng: Google Gemini Flash (Tốc độ cao 100% uptime)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 flex flex-col h-[650px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-stone-50/50 to-white">
          {messages.map((msg) => {
            const isAI = msg.role === 'model';
            const isChatGPT = msg.engineUsed === 'chatgpt';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div
                    className={`w-9 h-9 rounded-xl p-0.5 shrink-0 shadow-md ${
                      isChatGPT
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-800'
                        : 'bg-gradient-to-br from-red-800 to-amber-700'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-[10px] flex items-center justify-center font-black text-xs ${
                        isChatGPT ? 'bg-slate-950 text-emerald-400' : 'bg-red-950 text-amber-400'
                      }`}
                    >
                      {isChatGPT ? 'G' : '★'}
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-sm relative group ${
                    isAI
                      ? 'bg-stone-50 border border-stone-200/90 text-stone-900'
                      : 'bg-red-800 text-white rounded-tr-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-stone-200/40 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${isAI ? 'text-red-900' : 'text-amber-200'}`}>
                        {isAI
                          ? isChatGPT
                            ? 'Trợ Lý ChatGPT-4o (Khối Đảng)'
                            : 'Trợ Lý Gemini AI (Chuẩn 2026)'
                          : 'Đồng chí'}
                      </span>
                      {isAI && msg.modelUsed && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>
                    <span className={isAI ? 'text-stone-400' : 'text-red-200'}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className={`prose-sm leading-relaxed ${isAI ? 'text-stone-800' : 'text-white'}`}>
                    {isAI ? formatMarkdown(msg.text) : <p className="whitespace-pre-wrap">{msg.text}</p>}
                  </div>

                  {/* Copy button for AI replies */}
                  {isAI && (
                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        Căn cứ: Hướng dẫn 05-HD/VPTW & Quy định 399-QĐ/TW
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition text-[11px] font-medium shadow-2xs"
                        title="Sao chép câu trả lời"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-700">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-500" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-5 h-5 text-stone-300" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 justify-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-800 to-amber-700 p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full bg-red-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black text-xs">
                  ★
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-stone-600 text-sm flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-red-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-red-900 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-semibold text-stone-600">
                  {selectedEngine === 'chatgpt'
                    ? 'ChatGPT-4o đang phân tích nghiệp vụ Hướng dẫn 05...'
                    : selectedModel === 'gemini-pro'
                    ? 'Gemini Pro đang suy luận sâu và đối chiếu Quy định 399...'
                    : 'Gemini 2.5 đang tra cứu Hướng dẫn 05 để soạn câu trả lời...'}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => handleSend()}
                className="text-red-700 hover:text-red-900 font-bold underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Carousel */}
        <div className="px-4 py-2.5 bg-stone-100/80 border-t border-stone-200 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-red-950 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-red-700" />
            Hỏi nhanh:
          </span>
          {SUGGESTED_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 bg-white hover:bg-red-50 hover:text-red-800 text-stone-700 rounded-full border border-stone-300 hover:border-red-400 whitespace-nowrap transition shadow-2xs font-medium disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200">
          <div className="flex items-end gap-2.5">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Nhập câu hỏi hoặc yêu cầu (${selectedEngine === 'chatgpt' ? 'ChatGPT-4o' : selectedModel === 'gemini-pro' ? 'Gemini Pro' : 'Gemini Flash'})... Enter để gửi, Shift+Enter xuống dòng`}
                rows={2}
                disabled={isLoading}
                className="w-full resize-none rounded-xl border border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none transition disabled:bg-stone-50"
              />
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`h-[56px] px-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition shrink-0 ${
                !input.trim() || isLoading
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : selectedEngine === 'chatgpt'
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/20 active:scale-95'
                  : 'bg-red-800 hover:bg-red-900 text-white shadow-red-900/20 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Gửi câu hỏi</span>
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-stone-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>Đang kết nối: Google Gemini & ChatGPT trực tiếp trên máy chủ AI Studio</span>
            </span>
            <span>Phím tắt: Enter để gửi tin nhắn</span>
          </div>
        </div>
      </div>

      {/* Account & Gemini Pro Linking Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-amber-300">
                    Liên Kết Trực Tiếp Tài Khoản Gemini Pro
                  </h3>
                  <p className="text-xs text-stone-400">Trạng thái kết nối Google AI Studio</p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-stone-300 leading-relaxed">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Tài khoản người dùng:</span>
                  <span className="font-mono font-bold text-amber-300">anhtrung4566@gmail.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Trạng thái kết nối máy chủ:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Đã kết nối tự động
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Động cơ hoạt động:</span>
                  <span className="font-semibold text-stone-200">Gemini 2.5 Flash, Gemini Pro & ChatGPT-4o</span>
                </div>
              </div>

              <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-3.5 text-amber-200 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-amber-300 text-xs">
                  <Sparkles className="w-4 h-4" />
                  Hướng dẫn kích hoạt hạn mức Gemini Pro cao nhất:
                </p>
                <p>
                  1. Ứng dụng đã được tích hợp sẵn API Key máy chủ và liên kết với tài khoản <strong>anhtrung4566@gmail.com</strong>.
                </p>
                <p>
                  2. Để sử dụng mô hình <strong>Gemini Pro (gemini-4-argon)</strong> với số lượng request không giới hạn, đồng chí có thể mở bảng <strong>Settings &gt; Secrets</strong> trên AI Studio để gắn Billing Project cá nhân nếu cần.
                </p>
                <p>
                  3. Hệ thống có sẵn thuật toán <strong>Tự động dự phòng thông minh (Auto Failover)</strong>, nếu mô hình Pro đạt giới hạn lượt gọi, hệ thống sẽ tự động chuyển sang mô hình tốc độ cao <strong>Gemini Flash Lite</strong> và <strong>ChatGPT</strong> mà không bao giờ làm gián đoạn công việc của đồng chí!
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
