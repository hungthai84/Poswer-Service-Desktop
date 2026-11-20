import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Brush,
  Circle,
  Download,
  Eraser,
  Highlighter,
  Minus,
  PaintBucket,
  Pipette,
  Redo2,
  Square,
  Trash2,
  Undo2,
} from 'lucide-react';
import { WindowFrame } from './WindowFrame';
import { FluentSystemIcon } from './FluentIcons';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';

type PaintTool =
  | 'brush'
  | 'highlighter'
  | 'eraser'
  | 'line'
  | 'rect'
  | 'circle'
  | 'fill'
  | 'eyedropper';

interface PaintWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
}

const PALETTE_COLORS = [
  '#0f172a',
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#06b6d4',
  '#0078d4',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#64748b',
];

const STROKE_SIZES = [2, 5, 10, 18, 28];

function hexToRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
      .join('')
  );
}

export const PaintWindow: React.FC<PaintWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  language,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);

  const [tool, setTool] = useState<PaintTool>('brush');
  const [color, setColor] = useState('#0078d4');
  const [strokeSize, setStrokeSize] = useState(5);
  const [canvasBg, setCanvasBg] = useState<'#ffffff' | '#0f172a'>('#ffffff');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);

  const initBlankCanvas = useCallback((bgColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([snap]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    if (isOpen && history.length === 0) {
      const timer = setTimeout(() => initBlankCanvas('#ffffff'), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen, history.length, initBlankCanvas]);

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const next = [...sliced, snap].slice(-25);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const nextIdx = historyIndex - 1;
    ctx.putImageData(history[nextIdx], 0, 0);
    setHistoryIndex(nextIdx);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const nextIdx = historyIndex + 1;
    ctx.putImageData(history[nextIdx], 0, 0);
    setHistoryIndex(nextIdx);
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  const floodFill = (startX: number, startY: number, fillHex: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const startIdx = (startY * w + startX) * 4;
    const sr = data[startIdx];
    const sg = data[startIdx + 1];
    const sb = data[startIdx + 2];
    const [fr, fg, fb, fa] = hexToRgba(fillHex);

    if (sr === fr && sg === fg && sb === fb) return;

    const tolerance = 24;
    const matches = (idx: number) =>
      Math.abs(data[idx] - sr) <= tolerance &&
      Math.abs(data[idx + 1] - sg) <= tolerance &&
      Math.abs(data[idx + 2] - sb) <= tolerance;

    const stack: number[] = [startX, startY];
    const visited = new Uint8Array(w * h);

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      const pos = y * w + x;
      if (visited[pos]) continue;
      const idx = pos * 4;
      if (!matches(idx)) continue;

      visited[pos] = 1;
      data[idx] = fr;
      data[idx + 1] = fg;
      data[idx + 2] = fb;
      data[idx + 3] = fa;

      if (x > 0) stack.push(x - 1, y);
      if (x < w - 1) stack.push(x + 1, y);
      if (y > 0) stack.push(x, y - 1);
      if (y < h - 1) stack.push(x, y + 1);
    }

    ctx.putImageData(imgData, 0, 0);
    pushHistory();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const pt = getCanvasPoint(e);

    if (tool === 'eyedropper') {
      const pixel = ctx.getImageData(pt.x, pt.y, 1, 1).data;
      setColor(rgbToHex(pixel[0], pixel[1], pixel[2]));
      setTool('brush');
      return;
    }

    if (tool === 'fill') {
      floodFill(pt.x, pt.y, color);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    startPointRef.current = pt;

    if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1;
    ctx.strokeStyle = tool === 'eraser' ? canvasBg : color;
    ctx.lineWidth = tool === 'highlighter' ? strokeSize * 2.2 : strokeSize;
    ctx.lineTo(pt.x + 0.01, pt.y + 0.01);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const pt = getCanvasPoint(e);
    setCursorCoords(pt);

    if (!isDrawingRef.current || !startPointRef.current) return;

    if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      const start = startPointRef.current;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'line') {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(start.x, start.y, pt.x - start.x, pt.y - start.y);
      } else {
        const rx = Math.abs(pt.x - start.x) / 2;
        const ry = Math.abs(pt.y - start.y) / 2;
        const cx = (start.x + pt.x) / 2;
        const cy = (start.y + pt.y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      return;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1;
    ctx.strokeStyle = tool === 'eraser' ? canvasBg : color;
    ctx.lineWidth = tool === 'highlighter' ? strokeSize * 2.2 : strokeSize;
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    startPointRef.current = null;
    snapshotRef.current = null;
    pushHistory();
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `windows12-paint-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const tools: { id: PaintTool; label: string; icon: React.ReactNode }[] = [
    { id: 'brush', label: language === 'vi' ? 'Cọ vẽ' : 'Brush', icon: <Brush size={15} /> },
    {
      id: 'highlighter',
      label: language === 'vi' ? 'Bút dạ' : 'Highlighter',
      icon: <Highlighter size={15} />,
    },
    { id: 'eraser', label: language === 'vi' ? 'Tẩy' : 'Eraser', icon: <Eraser size={15} /> },
    { id: 'line', label: language === 'vi' ? 'Đường thẳng' : 'Line', icon: <Minus size={15} /> },
    { id: 'rect', label: language === 'vi' ? 'Hình chữ nhật' : 'Rectangle', icon: <Square size={15} /> },
    { id: 'circle', label: language === 'vi' ? 'Hình tròn' : 'Ellipse', icon: <Circle size={15} /> },
    { id: 'fill', label: language === 'vi' ? 'Đổ màu' : 'Fill', icon: <PaintBucket size={15} /> },
    {
      id: 'eyedropper',
      label: language === 'vi' ? 'Lấy màu' : 'Eyedropper',
      icon: <Pipette size={15} />,
    },
  ];

  return (
    <WindowFrame
      id="paint"
      title={UI_TEXT[language].apps.paintTitle}
      icon={<FluentSystemIcon type="paint" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={860}
      height={600}
      initialOffset={{ x: 0, y: 12 }}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex h-full flex-col overflow-hidden select-none">
        {/* Top Paint Ribbon Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--win-border-subtle)] bg-black/3 px-3.5 py-2 dark:bg-white/3">
          {/* Tools */}
          <div className="flex flex-wrap items-center gap-1">
            {tools.map((t) => {
              const active = tool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  title={t.label}
                  aria-label={t.label}
                  onClick={() => setTool(t.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? 'bg-[var(--win-accent-bright)] text-white shadow-xs'
                      : 'text-[var(--win-text-primary)] hover:bg-black/8 dark:hover:bg-white/12'
                  }`}
                >
                  {t.icon}
                </button>
              );
            })}

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-black/10 dark:bg-white/15" />

            {/* Stroke Sizes */}
            <div className="flex items-center gap-1">
              {STROKE_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  title={`${sz}px`}
                  onClick={() => setStrokeSize(sz)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    strokeSize === sz
                      ? 'bg-[var(--win-accent)]/18 ring-1 ring-[var(--win-accent)]'
                      : 'hover:bg-black/6 dark:hover:bg-white/10'
                  }`}
                >
                  <span
                    className="rounded-full bg-[var(--win-text-primary)]"
                    style={{
                      width: Math.max(3, Math.min(14, sz * 0.65)),
                      height: Math.max(3, Math.min(14, sz * 0.65)),
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions: Undo, Redo, Paper Bg, Clear, Download */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title={language === 'vi' ? 'Hoàn tác' : 'Undo'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--win-text-primary)] hover:bg-black/8 disabled:opacity-35 dark:hover:bg-white/12"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title={language === 'vi' ? 'Làm lại' : 'Redo'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--win-text-primary)] hover:bg-black/8 disabled:opacity-35 dark:hover:bg-white/12"
            >
              <Redo2 size={15} />
            </button>

            <button
              type="button"
              onClick={() => {
                const nextBg = canvasBg === '#ffffff' ? '#0f172a' : '#ffffff';
                setCanvasBg(nextBg);
                initBlankCanvas(nextBg);
              }}
              className="win-card rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[var(--win-text-primary)]"
            >
              {canvasBg === '#ffffff'
                ? language === 'vi'
                  ? 'Nền trắng'
                  : 'Light paper'
                : language === 'vi'
                ? 'Nền tối'
                : 'Dark paper'}
            </button>

            <button
              type="button"
              onClick={() => initBlankCanvas(canvasBg)}
              title={language === 'vi' ? 'Xóa toàn bộ' : 'Clear canvas'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/12"
            >
              <Trash2 size={15} />
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--win-accent-bright)] px-3 text-xs font-semibold text-white shadow-xs hover:opacity-95"
            >
              <Download size={14} />
              <span className="hidden sm:inline">
                {language === 'vi' ? 'Lưu PNG' : 'Save PNG'}
              </span>
            </button>
          </div>
        </div>

        {/* Color Palette Strip */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--win-border-subtle)] px-3.5 py-2">
          {PALETTE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`h-6 w-6 rounded-full border border-black/20 transition-transform dark:border-white/25 ${
                color.toLowerCase() === c.toLowerCase()
                  ? 'scale-115 ring-2 ring-[var(--win-accent)] ring-offset-1'
                  : 'hover:scale-105'
              }`}
            />
          ))}

          <label
            title={language === 'vi' ? 'Chọn màu tùy ý' : 'Custom color'}
            className="ml-1 flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--win-border-subtle)] bg-white/70 px-2 py-1 text-[11px] font-medium text-[var(--win-text-primary)] dark:bg-black/30"
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
            />
            <span>{language === 'vi' ? 'Tùy chọn' : 'Custom'}</span>
          </label>
        </div>

        {/* Drawing Canvas Area */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-200/70 p-3 dark:bg-slate-950/60">
          <canvas
            ref={canvasRef}
            width={920}
            height={540}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setCursorCoords(null)}
            className="max-h-full max-w-full touch-none rounded-lg border border-black/15 shadow-md dark:border-white/15"
            style={{
              cursor: tool === 'eyedropper' ? 'copy' : 'crosshair',
              backgroundColor: canvasBg,
            }}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between border-t border-[var(--win-border-subtle)] px-4 py-1.5 text-[11px] text-[var(--win-text-secondary)] tabular-nums">
          <span>
            {tools.find((t) => t.id === tool)?.label} · {strokeSize}px
          </span>
          <span>
            {cursorCoords ? `${cursorCoords.x}, ${cursorCoords.y} px` : '920 × 540 px'}
          </span>
        </div>
      </div>
    </WindowFrame>
  );
};
