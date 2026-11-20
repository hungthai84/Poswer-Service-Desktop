import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { VirtualDesktop } from '../data/osConfig';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { WindowStateItem } from './Taskbar';

interface TaskViewOverlayProps {
  isOpen: boolean;
  language: LanguageId;
  desktops: VirtualDesktop[];
  activeDesktopId: string;
  windows: Record<WindowId, WindowStateItem>;
  windowDesktopMap: Partial<Record<WindowId, string>>;
  onSelectDesktop: (id: string) => void;
  onAddDesktop: () => void;
  onRenameDesktop: (id: string, name: string) => void;
  onDeleteDesktop: (id: string) => void;
  onMoveWindowToDesktop: (windowId: WindowId, desktopId: string) => void;
  onFocusWindow: (windowId: WindowId) => void;
  onClose: () => void;
}

export const TaskViewOverlay: React.FC<TaskViewOverlayProps> = ({
  isOpen,
  language,
  desktops,
  activeDesktopId,
  windows,
  windowDesktopMap,
  onSelectDesktop,
  onAddDesktop,
  onRenameDesktop,
  onDeleteDesktop,
  onMoveWindowToDesktop,
  onFocusWindow,
  onClose,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const openWindows = (Object.values(windows) as WindowStateItem[]).filter(
    (w) => w.isOpen && w.id !== 'startMenu'
  );

  const getWindowTitle = (id: WindowId): string => {
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[1080] flex flex-col justify-between bg-slate-950/55 p-3 backdrop-blur-xl select-none sm:p-6"
        >
          {/* Open Windows Overview */}
          <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto pt-4">
            <div className="mb-4 flex items-center justify-between text-white">
              <h2 className="text-base font-bold">
                {language === 'vi'
                  ? 'Tổng quan cửa sổ (Task View)'
                  : 'Task View & Active Windows'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>

            {openWindows.length === 0 ? (
              <div className="rounded-2xl border border-white/15 bg-white/8 py-12 text-center text-sm text-white/80">
                {language === 'vi'
                  ? 'Không có cửa sổ nào đang mở trên Desktop này.'
                  : 'No open windows right now.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {openWindows.map((win) => {
                  const assignedDesktop = windowDesktopMap[win.id] ?? desktops[0]?.id;
                  return (
                    <div
                      key={win.id}
                      className="win-acrylic flex flex-col justify-between rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold">{getWindowTitle(win.id)}</span>
                        <span className="rounded-md bg-black/8 px-2 py-0.5 text-[10px] font-semibold dark:bg-white/10">
                          {desktops.find((d) => d.id === assignedDesktop)?.name ?? 'Work'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <select
                          value={assignedDesktop}
                          onChange={(e) => onMoveWindowToDesktop(win.id, e.target.value)}
                          aria-label="Assign desktop"
                          className="rounded-lg border border-[var(--win-border-subtle)] bg-white/70 px-2 py-1 text-[11px] font-medium text-[var(--win-text-primary)] dark:bg-black/40"
                        >
                          {desktops.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            if (assignedDesktop) onSelectDesktop(assignedDesktop);
                            onFocusWindow(win.id);
                            onClose();
                          }}
                          className="rounded-lg bg-[var(--win-accent-bright)] px-3 py-1 text-xs font-semibold text-white"
                        >
                          {language === 'vi' ? 'Mở cửa sổ' : 'Focus'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Virtual Desktops Strip at Bottom */}
          <div className="mx-auto mt-4 w-full max-w-5xl rounded-2xl border border-white/20 bg-slate-900/75 p-4 text-white backdrop-blur-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold">
                {language === 'vi' ? 'Màn hình ảo (Virtual Desktops)' : 'Virtual Desktops'}
              </span>
              <button
                type="button"
                onClick={onAddDesktop}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--win-accent-bright)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
              >
                <WindowsSystemIcon name="add" size={14} />
                <span>{language === 'vi' ? 'Tạo Desktop mới' : 'New Desktop'}</span>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {desktops.map((desk) => {
                const isActive = desk.id === activeDesktopId;
                return (
                  <div
                    key={desk.id}
                    className={`group relative flex w-[144px] shrink-0 flex-col rounded-xl border-2 p-2 transition-all sm:w-[180px] sm:p-2.5 ${
                      isActive
                        ? 'border-[var(--win-accent-bright)] bg-white/16'
                        : 'border-white/15 bg-white/8 hover:bg-white/14'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDesktop(desk.id);
                        onClose();
                      }}
                      className="flex h-16 w-full items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/35 to-indigo-600/35 text-white"
                    >
                      <WindowsSystemIcon name="desktop" size={26} />
                    </button>

                    <div className="mt-2 flex items-center justify-between gap-1">
                      {editingId === desk.id ? (
                        <input
                          type="text"
                          value={draftName}
                          autoFocus
                          onChange={(e) => setDraftName(e.target.value)}
                          onBlur={() => {
                            if (draftName.trim()) onRenameDesktop(desk.id, draftName.trim());
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (draftName.trim()) onRenameDesktop(desk.id, draftName.trim());
                              setEditingId(null);
                            }
                          }}
                          className="w-full rounded bg-black/50 px-1.5 py-0.5 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onDoubleClick={() => {
                            setEditingId(desk.id);
                            setDraftName(desk.name);
                          }}
                          title={language === 'vi' ? 'Nhấn đúp để đổi tên' : 'Double-click to rename'}
                          className="truncate text-xs font-semibold text-white"
                        >
                          {desk.name}
                        </button>
                      )}

                      {desktops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteDesktop(desk.id)}
                          aria-label={`Delete ${desk.name}`}
                          className="rounded p-0.5 text-white/70 hover:bg-rose-500/40 hover:text-white"
                        >
                          <WindowsSystemIcon name="close" size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
