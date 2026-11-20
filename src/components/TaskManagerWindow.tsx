import React, { useEffect, useState } from 'react';
import { WindowFrame } from './WindowFrame';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';
import { WindowStateItem } from './Taskbar';

interface TaskManagerWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  language: LanguageId;
  windows: Record<WindowId, WindowStateItem>;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onEndTask: (id: WindowId) => void;
}

export const TaskManagerWindow: React.FC<TaskManagerWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  language,
  windows,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
  onEndTask,
}) => {
  const [cpuSim, setCpuSim] = useState(18);
  const [ramSim, setRamSim] = useState(44);

  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => {
      setCpuSim((c) => Math.max(8, Math.min(62, c + Math.round((Math.random() - 0.5) * 8))));
      setRamSim((r) => Math.max(32, Math.min(68, r + Math.round((Math.random() - 0.5) * 4))));
    }, 2000);
    return () => clearInterval(t);
  }, [isOpen]);

  const running = (Object.values(windows) as WindowStateItem[]).filter(
    (w) => w.isOpen && w.id !== 'startMenu'
  );

  const getTitle = (id: WindowId): string => {
    switch (id) {
      case 'welcome':
        return UI_TEXT[language].welcome.windowTitle;
      case 'weather':
        return UI_TEXT[language].weather.windowTitle;
      case 'settings':
        return UI_TEXT[language].settings.windowTitle;
      case 'notes':
        return UI_TEXT[language].apps.notesTitle;
      case 'calculator':
        return UI_TEXT[language].apps.calculatorTitle;
      case 'paint':
        return UI_TEXT[language].apps.paintTitle;
      case 'explorer':
        return UI_TEXT[language].apps.explorerTitle;
      case 'taskManager':
        return UI_TEXT[language].apps.taskManagerTitle;
      default:
        return id;
    }
  };

  return (
    <WindowFrame
      id="taskManager"
      title={UI_TEXT[language].apps.taskManagerTitle}
      icon={<WindowsSystemIcon name="systemMonitor" size={18} className="text-[var(--win-accent)]" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={560}
      height={430}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex h-full flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="win-card rounded-xl p-3">
            <div className="text-[11px] font-semibold text-[var(--win-text-secondary)]">
              CPU ({language === 'vi' ? 'Mô phỏng' : 'Simulated'})
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{cpuSim}%</div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-[var(--win-accent-bright)] transition-all" style={{ width: `${cpuSim}%` }} />
            </div>
          </div>
          <div className="win-card rounded-xl p-3">
            <div className="text-[11px] font-semibold text-[var(--win-text-secondary)]">
              RAM ({language === 'vi' ? 'Mô phỏng' : 'Simulated'})
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{ramSim}%</div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${ramSim}%` }} />
            </div>
          </div>
        </div>

        <div className="text-xs font-bold text-[var(--win-text-secondary)]">
          {language === 'vi' ? `Tiến trình đang chạy (${running.length})` : `Running apps (${running.length})`}
        </div>

        <div className="win-scrollbar flex-1 space-y-1.5 overflow-y-auto">
          {running.map((win) => (
            <div
              key={win.id}
              className="win-card flex items-center justify-between rounded-xl px-3.5 py-2.5"
            >
              <div>
                <div className="text-xs font-bold text-[var(--win-text-primary)]">
                  {getTitle(win.id)}
                </div>
                <div className="text-[11px] text-[var(--win-text-secondary)]">
                  {win.isMinimized
                    ? language === 'vi'
                      ? 'Đang thu nhỏ'
                      : 'Minimized'
                    : win.hasFocus
                    ? language === 'vi'
                      ? 'Đang hoạt động'
                      : 'Active'
                    : language === 'vi'
                    ? 'Đang chạy nền'
                    : 'Running'}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onFocus(win.id)}
                  className="rounded-lg bg-black/6 px-2.5 py-1 text-[11px] font-semibold hover:bg-black/12 dark:bg-white/10 dark:hover:bg-white/18"
                >
                  {language === 'vi' ? 'Chuyển tới' : 'Switch'}
                </button>
                <button
                  type="button"
                  onClick={() => onEndTask(win.id)}
                  className="rounded-lg bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-500/25 dark:text-rose-300"
                >
                  {language === 'vi' ? 'Kết thúc' : 'End task'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};
