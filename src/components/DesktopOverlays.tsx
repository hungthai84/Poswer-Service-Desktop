import React, { useState } from 'react';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { WindowStateItem } from './Taskbar';

interface AltTabOverlayProps {
  isOpen: boolean;
  language: LanguageId;
  windows: WindowStateItem[];
  selectedIndex: number;
  onSelectWindow: (id: WindowId) => void;
  onClose: () => void;
}

export const AltTabOverlay: React.FC<AltTabOverlayProps> = ({
  isOpen,
  language,
  windows,
  selectedIndex,
  onSelectWindow,
  onClose,
}) => {
  if (!isOpen) return null;

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
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1095] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="win-acrylic flex max-w-2xl flex-wrap justify-center gap-3 rounded-2xl p-4 shadow-2xl"
      >
        {windows.length === 0 ? (
          <div className="px-4 py-2 text-xs font-semibold">
            {language === 'vi' ? 'Không có cửa sổ nào đang mở' : 'No open windows'}
          </div>
        ) : (
          windows.map((w, idx) => {
            const active = idx === selectedIndex % windows.length;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  onSelectWindow(w.id);
                  onClose();
                }}
                className={`flex w-32 flex-col items-center gap-2 rounded-xl p-3 text-center transition-all ${
                  active
                    ? 'bg-[var(--win-accent-bright)] text-white shadow-md'
                    : 'win-card text-[var(--win-text-primary)]'
                }`}
              >
                <WindowsSystemIcon name="apps" active={active} size={24} />
                <span className="w-full truncate text-xs font-semibold">{getTitle(w.id)}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

interface RunDialogProps {
  isOpen: boolean;
  language: LanguageId;
  onExecute: (command: string) => void;
  onClose: () => void;
}

export const RunDialog: React.FC<RunDialogProps> = ({
  isOpen,
  language,
  onExecute,
  onClose,
}) => {
  const [cmd, setCmd] = useState('calc');

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[1095] flex items-end justify-start bg-black/20 p-6 pb-20"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onExecute(cmd.trim());
          onClose();
        }}
        className="win-acrylic w-full max-w-sm space-y-3 rounded-2xl p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Run (Windows + R)</span>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-black/10">
            <WindowsSystemIcon name="close" size={14} />
          </button>
        </div>
        <p className="text-[11px] text-[var(--win-text-secondary)]">
          {language === 'vi'
            ? 'Thử nhập: calc, mspaint, notepad, explorer, ms-settings:, taskmgr'
            : 'Try: calc, mspaint, notepad, explorer, ms-settings:, taskmgr'}
        </p>
        <input
          type="text"
          value={cmd}
          autoFocus
          onChange={(e) => setCmd(e.target.value)}
          className="w-full rounded-xl border border-[var(--win-border-subtle)] bg-white/75 px-3 py-2 text-xs font-semibold text-[var(--win-text-primary)] focus:outline-none dark:bg-black/35"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="win-card rounded-xl px-3 py-1.5 text-xs font-semibold">
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[var(--win-accent-bright)] px-4 py-1.5 text-xs font-semibold text-white"
          >
            OK
          </button>
        </div>
      </form>
    </div>
  );
};
