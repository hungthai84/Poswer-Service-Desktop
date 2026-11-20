import React, { useEffect, useRef, useState } from 'react';
import { LanguageId, WEATHER_DATA, WindowId } from '../data/desktopData';
import {
  BUILTIN_WALLPAPERS,
  DEFAULT_WIDGET_STYLE,
  DesktopWidgetInstance,
  WIDGET_CATALOG,
  WidgetStyleSettings,
  WidgetVisualStyle,
} from '../data/osConfig';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { useViewport } from '../hooks/useViewport';

interface DesktopWidgetsLayerProps {
  language: LanguageId;
  widgets: DesktopWidgetInstance[];
  visible: boolean;
  snapToGrid: boolean;
  quickSettingsBatterySaver: boolean;
  onUpdateWidget: (id: string, patch: Partial<DesktopWidgetInstance>) => void;
  onRemoveWidget: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onResetWidget: (id: string) => void;
  onOpenWindow: (id: WindowId) => void;
}

const GRID_STEP = 20;

function getWidgetSurfaceStyle(
  style: WidgetStyleSettings,
  type: DesktopWidgetInstance['type']
): React.CSSProperties {
  const alpha = Math.max(0.08, Math.min(0.98, style.opacity / 100));
  const isSticky = type === 'sticky-note' && style.visualStyle !== 'solid';

  let backgroundColor = `rgba(255, 255, 255, ${alpha * 0.72})`;
  let backdropFilter = `blur(${style.blur}px) saturate(160%)`;
  let border = '1px solid rgba(255,255,255,0.45)';

  if (isSticky) {
    backgroundColor = `rgba(254, 240, 138, ${Math.max(0.75, alpha)})`;
    border = '1px solid rgba(217, 119, 6, 0.35)';
  } else if (style.visualStyle === 'mica') {
    backgroundColor = `rgba(241, 245, 249, ${Math.min(0.94, alpha * 0.88)})`;
    backdropFilter = `blur(${Math.max(24, style.blur)}px) saturate(120%)`;
  } else if (style.visualStyle === 'glass') {
    backgroundColor = `rgba(255, 255, 255, ${alpha * 0.38})`;
    backdropFilter = `blur(${style.blur + 8}px) saturate(185%)`;
  } else if (style.visualStyle === 'flat') {
    backgroundColor = 'var(--win-surface-solid)';
    backdropFilter = 'none';
  } else if (style.visualStyle === 'transparent') {
    backgroundColor = `rgba(15, 23, 42, ${alpha * 0.12})`;
    backdropFilter = `blur(${Math.min(10, style.blur)}px)`;
    border = '1px solid rgba(255,255,255,0.22)';
  } else if (style.visualStyle === 'solid') {
    backgroundColor = style.solidBgColor || '#1e293b';
    backdropFilter = 'none';
    border = '1px solid rgba(255,255,255,0.16)';
  }

  return {
    borderRadius: `${style.borderRadius}px`,
    backgroundColor,
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    border,
    boxShadow: style.shadow ? '0 14px 34px -8px rgba(15, 23, 42, 0.28)' : 'none',
    color:
      isSticky
        ? '#451a03'
        : style.textColor ||
          (style.visualStyle === 'solid' || style.visualStyle === 'transparent'
            ? '#f8fafc'
            : '#0f172a'),
  };
}

export const DesktopWidgetsLayer: React.FC<DesktopWidgetsLayerProps> = ({
  language,
  widgets,
  visible,
  snapToGrid,
  quickSettingsBatterySaver,
  onUpdateWidget,
  onRemoveWidget,
  onBringForward,
  onSendBackward,
  onResetWidget,
  onOpenWindow,
}) => {
  const viewport = useViewport();
  const [now, setNow] = useState(() => new Date());
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [newTodoText, setNewTodoText] = useState<Record<string, string>>({});
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicTrackIdx, setMusicTrackIdx] = useState(0);
  const [focusRemaining, setFocusRemaining] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const [simCpu, setSimCpu] = useState(22);
  const [simRam, setSimRam] = useState(48);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const resizeRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
  } | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSimCpu((v) => Math.max(8, Math.min(76, v + Math.round((Math.random() - 0.5) * 10))));
      setSimRam((v) => Math.max(30, Math.min(78, v + Math.round((Math.random() - 0.5) * 4))));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!focusRunning) return;
    const t = setInterval(() => {
      setFocusRemaining((prev) => {
        if (prev <= 1) {
          setFocusRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [focusRunning]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragRef.current) {
        const d = dragRef.current;
        let nx = Math.max(12, Math.min(window.innerWidth - 160, d.origX + (e.clientX - d.startX)));
        let ny = Math.max(12, Math.min(window.innerHeight - 120, d.origY + (e.clientY - d.startY)));
        if (snapToGrid) {
          nx = Math.round(nx / GRID_STEP) * GRID_STEP;
          ny = Math.round(ny / GRID_STEP) * GRID_STEP;
        }
        onUpdateWidget(d.id, { x: nx, y: ny });
      } else if (resizeRef.current) {
        const r = resizeRef.current;
        const nw = Math.max(190, Math.min(480, r.origW + (e.clientX - r.startX)));
        const nh = Math.max(120, Math.min(440, r.origH + (e.clientY - r.startY)));
        onUpdateWidget(r.id, { width: nw, height: nh });
      }
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [snapToGrid, onUpdateWidget]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [contextMenu]);

  const toggleMusicTone = () => {
    const next = !musicPlaying;
    setMusicPlaying(next);
    if (next) {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioCtxRef.current ?? new Ctx();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 432;
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch {
        // Audio optional
      }
    }
  };

  if (!visible) return null;

  const tracks = [
    { title: 'Fluent Horizon', artist: 'Ambient Studio' },
    { title: 'Bloom Morning', artist: 'Windows Lo-Fi' },
    { title: 'Mica Rain', artist: 'Focus Waves' },
  ];

  const renderWidgetBody = (w: DesktopWidgetInstance) => {
    const textSizeClass =
      w.style.fontSize === 'sm' ? 'text-xs' : w.style.fontSize === 'lg' ? 'text-base' : 'text-sm';
    const accent = w.style.accentColor || 'var(--win-accent-bright)';

    switch (w.type) {
      case 'digital-clock':
        return (
          <div className="flex h-full flex-col justify-center px-1">
            <div className="text-4xl font-bold tracking-tight tabular-nums">
              {now.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
            <div className={`mt-1 capitalize opacity-80 ${textSizeClass}`}>
              {now.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        );

      case 'analog-clock': {
        const sec = now.getSeconds() * 6;
        const min = now.getMinutes() * 6 + now.getSeconds() * 0.1;
        const hr = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
        return (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-32 w-32">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="60"
                  y1="10"
                  x2="60"
                  y2="15"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  transform={`rotate(${deg} 60 60)`}
                />
              ))}
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="30"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${hr} 60 60)`}
              />
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="20"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                transform={`rotate(${min} 60 60)`}
              />
              <line
                x1="60"
                y1="66"
                x2="60"
                y2="16"
                stroke={accent}
                strokeWidth="1.6"
                strokeLinecap="round"
                transform={`rotate(${sec} 60 60)`}
              />
              <circle cx="60" cy="60" r="3.5" fill={accent} />
            </svg>
          </div>
        );
      }

      case 'calendar': {
        const y = now.getFullYear();
        const m = now.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const days = new Date(y, m + 1, 0).getDate();
        return (
          <div className="space-y-1.5 text-[11px]">
            <div className="font-bold capitalize">
              {now.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center opacity-70">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center tabular-nums">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const today = day === now.getDate();
                return (
                  <div
                    key={day}
                    style={today ? { backgroundColor: accent, color: '#fff' } : undefined}
                    className={`rounded py-0.5 ${today ? 'font-bold' : ''}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'weather':
        return (
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold opacity-80">{WEATHER_DATA.location}</div>
                <div className="mt-1 text-3xl font-bold tabular-nums">{WEATHER_DATA.currentTemp}</div>
                <div className="text-xs opacity-85">{WEATHER_DATA.condition[language]}</div>
              </div>
              <WindowsSystemIcon name="weather" size={30} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] opacity-80 tabular-nums">
              <span>{WEATHER_DATA.high[language]}</span>
              <span>{WEATHER_DATA.low[language]}</span>
            </div>
          </div>
        );

      case 'todo': {
        const tasks =
          (w.data?.tasks as { id: string; text: string; done: boolean }[] | undefined) ?? [
            {
              id: 't1',
              text: language === 'vi' ? 'Tùy chỉnh giao diện Desktop' : 'Customize Desktop theme',
              done: true,
            },
            {
              id: 't2',
              text: language === 'vi' ? 'Thử Snap Layout cửa sổ' : 'Try Window Snap Layouts',
              done: false,
            },
          ];
        const draft = newTodoText[w.id] ?? '';
        return (
          <div className="flex h-full flex-col gap-2 overflow-hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                onUpdateWidget(w.id, {
                  data: {
                    ...w.data,
                    tasks: [...tasks, { id: `t-${Date.now()}`, text: draft.trim(), done: false }],
                  },
                });
                setNewTodoText((p) => ({ ...p, [w.id]: '' }));
              }}
              className="flex gap-1"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setNewTodoText((p) => ({ ...p, [w.id]: e.target.value }))}
                placeholder={language === 'vi' ? 'Thêm việc...' : 'Add task...'}
                className="w-full rounded-lg border border-black/15 bg-white/55 px-2 py-1 text-xs text-slate-900 focus:outline-none dark:border-white/15 dark:bg-black/30 dark:text-white"
              />
              <button
                type="submit"
                style={{ backgroundColor: accent }}
                className="rounded-lg px-2 text-xs font-bold text-white"
              >
                +
              </button>
            </form>
            <div className="win-scrollbar flex-1 space-y-1 overflow-y-auto pr-0.5 text-xs">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-1.5 rounded-lg bg-black/5 px-2 py-1">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateWidget(w.id, {
                        data: {
                          ...w.data,
                          tasks: tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                        },
                      })
                    }
                    className={`flex-1 truncate text-left ${t.done ? 'line-through opacity-55' : ''}`}
                  >
                    {t.done ? '✓ ' : '○ '}
                    {t.text}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateWidget(w.id, {
                        data: { ...w.data, tasks: tasks.filter((x) => x.id !== t.id) },
                      })
                    }
                    className="opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'notes':
      case 'sticky-note': {
        const noteText =
          (w.data?.text as string | undefined) ??
          (language === 'vi'
            ? 'Ghi chú nhanh trên màn hình Desktop...'
            : 'Quick desktop sticky note...');
        return (
          <textarea
            value={noteText}
            onChange={(e) => onUpdateWidget(w.id, { data: { ...w.data, text: e.target.value } })}
            className={`win-scrollbar h-full w-full resize-none bg-transparent leading-relaxed focus:outline-none ${textSizeClass}`}
          />
        );
      }

      case 'system-monitor':
        return (
          <div className="space-y-2.5 text-xs">
            <div className="text-[10px] opacity-70">
              {language === 'vi' ? 'Số liệu mô phỏng trong app' : 'Simulated in-app telemetry'}
            </div>
            <div>
              <div className="flex justify-between font-semibold tabular-nums">
                <span>CPU</span>
                <span>{simCpu}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-black/15">
                <div className="h-full rounded-full transition-all" style={{ width: `${simCpu}%`, backgroundColor: accent }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold tabular-nums">
                <span>RAM</span>
                <span>{simRam}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-black/15">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${simRam}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-[11px] opacity-80 tabular-nums">
              <span>SSD</span>
              <span>38% · 192 GB free</span>
            </div>
          </div>
        );

      case 'battery':
        return (
          <div className="flex h-full flex-col justify-between text-xs">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tabular-nums">86%</span>
              <WindowsSystemIcon
                name={quickSettingsBatterySaver ? 'batterySaver' : 'batteryCharging'}
                size={24}
              />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/15">
              <div
                className="h-full rounded-full"
                style={{
                  width: '86%',
                  backgroundColor: quickSettingsBatterySaver ? '#f59e0b' : '#22c55e',
                }}
              />
            </div>
            <div className="text-[11px] opacity-75">
              {quickSettingsBatterySaver
                ? language === 'vi'
                  ? 'Tiết kiệm pin đang bật (Mô phỏng)'
                  : 'Battery saver ON (Sim)'
                : language === 'vi'
                ? 'Còn ~4 giờ 20 phút (Mô phỏng)'
                : '~4h 20m remaining (Sim)'}
            </div>
          </div>
        );

      case 'quick-links':
        return (
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {(
              [
                { id: 'explorer', label: 'Explorer', icon: 'explorer' },
                { id: 'settings', label: language === 'vi' ? 'Cài đặt' : 'Settings', icon: 'settings' },
                { id: 'notes', label: language === 'vi' ? 'Ghi chú' : 'Notes', icon: 'notes' },
                { id: 'paint', label: 'Paint', icon: 'paint' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenWindow(item.id)}
                className="flex items-center gap-1.5 rounded-xl bg-black/6 px-2.5 py-2 font-semibold hover:bg-black/12"
              >
                <WindowsSystemIcon name={item.icon} size={15} />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        );

      case 'recent-apps':
        return (
          <div className="space-y-1.5 text-xs">
            {(
              [
                { id: 'notes', label: language === 'vi' ? 'Ghi chú' : 'Notes', sub: '2m ago' },
                { id: 'calculator', label: language === 'vi' ? 'Máy tính' : 'Calculator', sub: '8m ago' },
                { id: 'explorer', label: 'File Explorer', sub: '15m ago' },
              ] as const
            ).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => onOpenWindow(app.id)}
                className="flex w-full items-center justify-between rounded-xl bg-black/6 px-2.5 py-1.5 text-left hover:bg-black/12"
              >
                <span className="font-semibold">{app.label}</span>
                <span className="text-[10px] opacity-70">{app.sub}</span>
              </button>
            ))}
          </div>
        );

      case 'world-clock': {
        const zones = [
          { city: 'Hà Nội', tz: 'Asia/Ho_Chi_Minh' },
          { city: 'Tokyo', tz: 'Asia/Tokyo' },
          { city: 'London', tz: 'Europe/London' },
          { city: 'New York', tz: 'America/New_York' },
        ];
        return (
          <div className="space-y-1.5 text-xs tabular-nums">
            {zones.map((z) => (
              <div key={z.city} className="flex items-center justify-between rounded-lg bg-black/5 px-2.5 py-1">
                <span className="font-semibold">{z.city}</span>
                <span>
                  {now.toLocaleTimeString('en-GB', {
                    timeZone: z.tz,
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        );
      }

      case 'photo-gallery': {
        const current = BUILTIN_WALLPAPERS[galleryIndex % BUILTIN_WALLPAPERS.length];
        return (
          <div className="flex h-full flex-col gap-1.5">
            <div
              className="relative flex-1 overflow-hidden rounded-xl"
              style={{ background: current.previewBg }}
            >
              <div className="absolute inset-x-0 bottom-0 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white">
                {current.name[language]}
              </div>
            </div>
            <div className="flex justify-between text-[11px]">
              <button
                type="button"
                onClick={() =>
                  setGalleryIndex((i) => (i - 1 + BUILTIN_WALLPAPERS.length) % BUILTIN_WALLPAPERS.length)
                }
                className="rounded-lg bg-black/8 px-2.5 py-1 font-semibold"
              >
                ←
              </button>
              <span className="opacity-70 tabular-nums">
                {(galleryIndex % BUILTIN_WALLPAPERS.length) + 1}/{BUILTIN_WALLPAPERS.length}
              </span>
              <button
                type="button"
                onClick={() => setGalleryIndex((i) => (i + 1) % BUILTIN_WALLPAPERS.length)}
                className="rounded-lg bg-black/8 px-2.5 py-1 font-semibold"
              >
                →
              </button>
            </div>
          </div>
        );
      }

      case 'music-player': {
        const track = tracks[musicTrackIdx % tracks.length];
        return (
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="truncate text-sm font-bold">{track.title}</div>
              <div className="text-xs opacity-75">{track.artist}</div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMusicTrackIdx((i) => (i - 1 + tracks.length) % tracks.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/8"
              >
                <WindowsSystemIcon name="prev" size={16} />
              </button>
              <button
                type="button"
                onClick={toggleMusicTone}
                style={{ backgroundColor: accent }}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
              >
                <WindowsSystemIcon name={musicPlaying ? 'pause' : 'play'} size={18} />
              </button>
              <button
                type="button"
                onClick={() => setMusicTrackIdx((i) => (i + 1) % tracks.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/8"
              >
                <WindowsSystemIcon name="next" size={16} />
              </button>
            </div>
          </div>
        );
      }

      case 'focus-timer': {
        const mins = Math.floor(focusRemaining / 60)
          .toString()
          .padStart(2, '0');
        const secs = (focusRemaining % 60).toString().padStart(2, '0');
        return (
          <div className="flex h-full flex-col items-center justify-between py-1">
            <div className="text-3xl font-bold tabular-nums">
              {mins}:{secs}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFocusRunning((r) => !r)}
                style={{ backgroundColor: accent }}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
              >
                {focusRunning
                  ? language === 'vi'
                    ? 'Tạm dừng'
                    : 'Pause'
                  : language === 'vi'
                  ? 'Bắt đầu'
                  : 'Start'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFocusRunning(false);
                  setFocusRemaining(25 * 60);
                }}
                className="rounded-xl bg-black/10 px-3 py-1.5 text-xs font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        );
      }

      case 'productivity': {
        const todoWidgets = widgets.filter((x) => x.type === 'todo');
        const allTasks = todoWidgets.flatMap(
          (x) => (x.data?.tasks as { done: boolean }[] | undefined) ?? []
        );
        const doneCount = allTasks.filter((t) => t.done).length;
        return (
          <div className="flex h-full flex-col justify-between text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-black/6 p-2.5">
                <div className="opacity-70">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</div>
                <div className="mt-0.5 text-xl font-bold tabular-nums">
                  {doneCount}/{allTasks.length || 2}
                </div>
              </div>
              <div className="rounded-xl bg-black/6 p-2.5">
                <div className="opacity-70">{language === 'vi' ? 'Tập trung' : 'Focus'}</div>
                <div className="mt-0.5 text-xl font-bold tabular-nums">
                  {Math.round((25 * 60 - focusRemaining) / 60)}m
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenWindow('notes')}
              style={{ backgroundColor: accent }}
              className="w-full rounded-xl py-1.5 font-semibold text-white"
            >
              {language === 'vi' ? 'Mở Ghi chú làm việc' : 'Open Notes'}
            </button>
          </div>
        );
      }
    }
  };

  const editingWidget = widgets.find((w) => w.id === editingWidgetId) ?? null;
  const visibleWidgets = widgets.filter((w) => w.visible);

  const renderWidgetCard = (w: DesktopWidgetInstance, mobileFlow: boolean) => {
    const catalogItem = WIDGET_CATALOG.find((c) => c.type === w.type);
    const surface = getWidgetSurfaceStyle(w.style, w.type);

    const clampedWidth = Math.min(w.width, Math.max(200, viewport.width - 28));
    const clampedX = Math.max(12, Math.min(viewport.width - clampedWidth - 12, w.x));
    const clampedY = Math.max(12, Math.min(viewport.height - 100, w.y));

    return (
      <section
        key={w.id}
        aria-label={catalogItem?.title[language] ?? w.type}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setContextMenu({
            id: w.id,
            x: Math.min(e.clientX, viewport.width - 210),
            y: Math.min(e.clientY, viewport.height - 250),
          });
        }}
        style={
          mobileFlow
            ? {
                height: w.collapsed ? 42 : Math.min(w.height, 260),
                ...surface,
              }
            : {
                left: clampedX,
                top: clampedY,
                width: clampedWidth,
                height: w.collapsed ? 42 : w.height,
                zIndex: w.alwaysOnTop ? 860 + w.zOrder : 4 + w.zOrder,
                ...surface,
              }
        }
        className={`${
          mobileFlow ? 'pointer-events-auto relative w-full shrink-0' : 'fixed'
        } flex flex-col overflow-hidden transition-[height] duration-150 select-none`}
      >
        {/* Widget Drag Header */}
        <div
          onPointerDown={(e) => {
            if (mobileFlow || w.locked || (e.target as HTMLElement).closest('button')) return;
            e.stopPropagation();
            onBringForward(w.id);
            e.currentTarget.setPointerCapture(e.pointerId);
            dragRef.current = {
              id: w.id,
              startX: e.clientX,
              startY: e.clientY,
              origX: clampedX,
              origY: clampedY,
            };
          }}
          onDoubleClick={() => setEditingWidgetId(w.id)}
          className={`flex h-9 shrink-0 items-center justify-between px-3 ${
            mobileFlow || w.locked ? 'cursor-default' : 'cursor-move'
          }`}
        >
                <div className="flex min-w-0 items-center gap-1.5 text-xs font-bold">
                  <WindowsSystemIcon name={catalogItem?.iconKey ?? 'sparkle'} size={14} />
                  <span className="truncate">{catalogItem?.title[language]}</span>
                  {w.locked && <WindowsSystemIcon name="lock" size={11} className="opacity-70" />}
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    title={language === 'vi' ? 'Thu gọn / Mở rộng' : 'Collapse / Expand'}
                    onClick={() => onUpdateWidget(w.id, { collapsed: !w.collapsed })}
                    className="flex h-6 w-6 items-center justify-center rounded-md opacity-70 hover:bg-black/10 hover:opacity-100"
                  >
                    <WindowsSystemIcon name="minimize" size={12} />
                  </button>
                  <button
                    type="button"
                    title={language === 'vi' ? 'Tùy chỉnh Widget' : 'Widget Settings'}
                    onClick={() => setEditingWidgetId(w.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-md opacity-70 hover:bg-black/10 hover:opacity-100"
                  >
                    <WindowsSystemIcon name="settings" size={12} />
                  </button>
                  <button
                    type="button"
                    title={language === 'vi' ? 'Xóa Widget' : 'Remove Widget'}
                    onClick={() => onRemoveWidget(w.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-md opacity-70 hover:bg-rose-500/20 hover:text-rose-600 hover:opacity-100"
                  >
                    <WindowsSystemIcon name="close" size={12} />
                  </button>
                </div>
              </div>

              {/* Widget Content */}
              {!w.collapsed && (
                <div className="flex-1 overflow-hidden px-3.5 pb-3">{renderWidgetBody(w)}</div>
              )}

              {/* Resize Handle */}
              {!mobileFlow && !w.collapsed && !w.locked && (
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    resizeRef.current = {
                      id: w.id,
                      startX: e.clientX,
                      startY: e.clientY,
                      origW: w.width,
                      origH: w.height,
                    };
                  }}
                  title={language === 'vi' ? 'Kéo để đổi kích thước' : 'Drag to resize'}
                  className="absolute right-0.5 bottom-0.5 flex h-4 w-4 cursor-nwse-resize items-center justify-center opacity-45 hover:opacity-100"
                >
                  <WindowsSystemIcon name="resize" size={11} />
                </div>
              )}
      </section>
    );
  };

  return (
    <>
      {viewport.isMobile ? (
        <div className="no-scrollbar pointer-events-none fixed inset-x-3 top-[178px] bottom-[72px] z-[4] flex flex-col gap-3 overflow-y-auto pb-2">
          {visibleWidgets.map((w) => renderWidgetCard(w, true))}
        </div>
      ) : (
        visibleWidgets.map((w) => renderWidgetCard(w, false))
      )}

      {/* Widget Context Menu */}
      {contextMenu && (() => {
        const target = widgets.find((w) => w.id === contextMenu.id);
        if (!target) return null;
        return (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            className="win-acrylic fixed z-[1070] w-[205px] rounded-2xl p-1.5 text-xs shadow-xl"
          >
            <button
              type="button"
              onClick={() => {
                setEditingWidgetId(target.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left font-semibold hover:bg-black/6 dark:hover:bg-white/10"
            >
              <WindowsSystemIcon name="settings" size={14} />
              <span>{language === 'vi' ? 'Cấu hình Widget' : 'Configure widget'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateWidget(target.id, { locked: !target.locked });
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left hover:bg-black/6 dark:hover:bg-white/10"
            >
              <WindowsSystemIcon name="lock" size={14} />
              <span>
                {target.locked
                  ? language === 'vi'
                    ? 'Mở khóa vị trí'
                    : 'Unlock position'
                  : language === 'vi'
                  ? 'Khóa vị trí'
                  : 'Lock position'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateWidget(target.id, { alwaysOnTop: !target.alwaysOnTop });
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left hover:bg-black/6 dark:hover:bg-white/10"
            >
              <WindowsSystemIcon name="taskView" size={14} />
              <span>
                {target.alwaysOnTop
                  ? language === 'vi'
                    ? 'Bỏ luôn trên cùng'
                    : 'Disable Always on Top'
                  : language === 'vi'
                  ? 'Luôn ở trên cùng'
                  : 'Always on Top'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onBringForward(target.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left hover:bg-black/6 dark:hover:bg-white/10"
            >
              <span>{language === 'vi' ? 'Đưa lên trước' : 'Bring forward'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSendBackward(target.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left hover:bg-black/6 dark:hover:bg-white/10"
            >
              <span>{language === 'vi' ? 'Đưa xuống sau' : 'Send backward'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onResetWidget(target.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left hover:bg-black/6 dark:hover:bg-white/10"
            >
              <span>{language === 'vi' ? 'Khôi phục mặc định' : 'Reset widget'}</span>
            </button>
            <div className="my-1 h-px bg-[var(--win-border-subtle)]" />
            <button
              type="button"
              onClick={() => {
                onRemoveWidget(target.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left font-semibold text-rose-600 hover:bg-rose-500/12"
            >
              <WindowsSystemIcon name="close" size={14} />
              <span>{language === 'vi' ? 'Xóa Widget' : 'Remove'}</span>
            </button>
          </div>
        );
      })()}

      {/* Per-Widget Appearance Configurator Modal */}
      {editingWidget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingWidgetId(null);
          }}
          className="fixed inset-0 z-[1090] flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs"
        >
          <div className="win-acrylic w-full max-w-md space-y-4 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {language === 'vi' ? 'Tùy chỉnh giao diện Widget' : 'Widget Appearance'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingWidgetId(null)}
                className="rounded-lg p-1 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="close" size={16} />
              </button>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-semibold">
                {language === 'vi' ? 'Chất liệu hiển thị' : 'Visual Style'}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'acrylic', label: 'Acrylic' },
                    { id: 'mica', label: 'Fluent Mica' },
                    { id: 'glass', label: 'Glass UI' },
                    { id: 'flat', label: 'Flat UI' },
                    { id: 'transparent', label: 'Transparent' },
                    { id: 'solid', label: 'Solid Color' },
                  ] as { id: WidgetVisualStyle; label: string }[]
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() =>
                      onUpdateWidget(editingWidget.id, {
                        style: { ...editingWidget.style, visualStyle: st.id },
                      })
                    }
                    className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold ${
                      editingWidget.style.visualStyle === st.id
                        ? 'bg-[var(--win-accent-bright)] text-white'
                        : 'win-card'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span>
                  {language === 'vi' ? 'Bo góc' : 'Border radius'}: {editingWidget.style.borderRadius}px
                </span>
                <input
                  type="range"
                  min={4}
                  max={28}
                  value={editingWidget.style.borderRadius}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, borderRadius: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-[var(--win-accent-bright)]"
                />
              </label>

              <label className="space-y-1">
                <span>
                  {language === 'vi' ? 'Độ mờ nền' : 'Opacity'}: {editingWidget.style.opacity}%
                </span>
                <input
                  type="range"
                  min={15}
                  max={100}
                  value={editingWidget.style.opacity}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, opacity: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-[var(--win-accent-bright)]"
                />
              </label>

              <label className="space-y-1">
                <span>Blur: {editingWidget.style.blur}px</span>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={editingWidget.style.blur}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, blur: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-[var(--win-accent-bright)]"
                />
              </label>

              <div className="space-y-1">
                <span>{language === 'vi' ? 'Cỡ chữ' : 'Font size'}</span>
                <div className="flex gap-1">
                  {(['sm', 'md', 'lg'] as const).map((fs) => (
                    <button
                      key={fs}
                      type="button"
                      onClick={() =>
                        onUpdateWidget(editingWidget.id, {
                          style: { ...editingWidget.style, fontSize: fs },
                        })
                      }
                      className={`flex-1 rounded-lg py-1 font-semibold uppercase ${
                        editingWidget.style.fontSize === fs
                          ? 'bg-[var(--win-accent-bright)] text-white'
                          : 'win-card'
                      }`}
                    >
                      {fs}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <label className="flex items-center justify-between rounded-xl border border-[var(--win-border-subtle)] px-2.5 py-1.5">
                <span>{language === 'vi' ? 'Màu nền' : 'Bg'}</span>
                <input
                  type="color"
                  value={editingWidget.style.solidBgColor || '#1e293b'}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, solidBgColor: e.target.value },
                    })
                  }
                  className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-[var(--win-border-subtle)] px-2.5 py-1.5">
                <span>{language === 'vi' ? 'Chữ' : 'Text'}</span>
                <input
                  type="color"
                  value={editingWidget.style.textColor || '#0f172a'}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, textColor: e.target.value },
                    })
                  }
                  className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-[var(--win-border-subtle)] px-2.5 py-1.5">
                <span>Accent</span>
                <input
                  type="color"
                  value={editingWidget.style.accentColor || '#0078d4'}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, accentColor: e.target.value },
                    })
                  }
                  className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--win-border-subtle)] pt-3 text-xs">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingWidget.style.shadow}
                  onChange={(e) =>
                    onUpdateWidget(editingWidget.id, {
                      style: { ...editingWidget.style, shadow: e.target.checked },
                    })
                  }
                />
                <span>{language === 'vi' ? 'Đổ bóng' : 'Shadow'}</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateWidget(editingWidget.id, { style: { ...DEFAULT_WIDGET_STYLE } })
                  }
                  className="win-card rounded-xl px-3 py-1.5 font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setEditingWidgetId(null)}
                  className="rounded-xl bg-[var(--win-accent-bright)] px-4 py-1.5 font-semibold text-white"
                >
                  {language === 'vi' ? 'Xong' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
