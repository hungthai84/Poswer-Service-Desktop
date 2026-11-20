import React, { useState } from 'react';
import { WindowFrame } from './WindowFrame';
import { FluentSystemIcon } from './FluentIcons';
import { WindowsIconKey, WindowsSystemIcon } from '../config/windowsIcons';
import { LanguageId, RECOMMENDED_ITEMS, UI_TEXT, WindowId } from '../data/desktopData';
import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';
import { BUILTIN_WALLPAPERS } from '../data/osConfig';

interface ExplorerWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  language: LanguageId;
  initialPath: string;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onOpenWindow: (id: WindowId) => void;
  onSelectWallpaper?: (wallpaperId: string) => void;
}

type FolderId = 'This PC' | 'Documents' | 'Downloads' | 'Pictures' | 'Recycle Bin';

const SIDEBAR_FOLDERS: { id: FolderId; label: Record<LanguageId, string>; icon: WindowsIconKey }[] = [
  { id: 'This PC', label: { vi: 'This PC', en: 'This PC' }, icon: 'thisPc' },
  { id: 'Documents', label: { vi: 'Tài liệu', en: 'Documents' }, icon: 'documents' },
  { id: 'Downloads', label: { vi: 'Tải xuống', en: 'Downloads' }, icon: 'downloads' },
  { id: 'Pictures', label: { vi: 'Hình ảnh', en: 'Pictures' }, icon: 'pictures' },
  { id: 'Recycle Bin', label: { vi: 'Thùng rác', en: 'Recycle Bin' }, icon: 'recycleBin' },
];

export const ExplorerWindow: React.FC<ExplorerWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  language,
  initialPath,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
  onOpenWindow,
  onSelectWallpaper,
}) => {
  const [currentPath, setCurrentPath] = useState<FolderId>(
    (SIDEBAR_FOLDERS.some((f) => f.id === initialPath) ? initialPath : 'This PC') as FolderId
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    if (SIDEBAR_FOLDERS.some((f) => f.id === initialPath)) {
      setCurrentPath(initialPath as FolderId);
    }
  }, [initialPath]);

  const query = search.trim().toLowerCase();

  return (
    <WindowFrame
      id="explorer"
      title={UI_TEXT[language].apps.explorerTitle}
      icon={<FluentSystemIcon type="explorer" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={780}
      height={520}
      initialOffset={{ x: -20, y: -15 }}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Address & Search Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--win-border-subtle)] px-4 py-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--win-border-subtle)] bg-white/60 px-3 py-1.5 text-xs font-semibold dark:bg-black/25">
            <WindowsSystemIcon name="explorer" size={15} className="text-amber-500" />
            <span>{SIDEBAR_FOLDERS.find((f) => f.id === currentPath)?.label[language]}</span>
          </div>

          <div className="flex flex-1 items-center gap-2 sm:flex-none">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm trong thư mục...' : 'Search folder...'}
              className="min-w-0 flex-1 rounded-xl border border-[var(--win-border-subtle)] bg-white/65 px-3 py-1.5 text-xs text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none sm:w-52 sm:flex-none dark:bg-black/25"
            />
            <button
              type="button"
              onClick={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}
              className="win-card flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold"
            >
              <WindowsSystemIcon name="grid" size={14} />
              <span>{viewMode === 'grid' ? 'Grid' : 'List'}</span>
            </button>
          </div>
        </div>

        {/* Two-pane Explorer Body */}
        <div className="flex flex-1 flex-col overflow-hidden sm:flex-row">
          <aside className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--win-border-subtle)] bg-black/3 p-2 sm:w-[165px] sm:flex-col sm:space-y-1 sm:overflow-visible sm:border-r sm:border-b-0 sm:p-2.5 dark:bg-white/3">
            {SIDEBAR_FOLDERS.map((folder) => {
              const active = currentPath === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setCurrentPath(folder.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors sm:w-full sm:gap-2.5 sm:py-2 ${
                    active
                      ? 'bg-[var(--win-accent)]/15 font-bold text-[var(--win-accent)]'
                      : 'text-[var(--win-text-primary)] hover:bg-black/5 dark:hover:bg-white/8'
                  }`}
                >
                  <WindowsSystemIcon name={folder.icon} active={active} size={16} />
                  <span className="truncate">{folder.label[language]}</span>
                </button>
              );
            })}
          </aside>

          <div className="win-scrollbar flex-1 overflow-y-auto p-4">
            {currentPath === 'This PC' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[var(--win-text-secondary)]">
                  {language === 'vi' ? 'Thư mục hệ thống' : 'Folders'}
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {SIDEBAR_FOLDERS.filter((f) => f.id !== 'This PC').map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setCurrentPath(folder.id)}
                      className="win-card flex items-center gap-2.5 rounded-xl p-3 text-left"
                    >
                      <WindowsSystemIcon name={folder.icon} size={22} className="text-[var(--win-accent)]" />
                      <span className="truncate text-xs font-semibold">{folder.label[language]}</span>
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-[var(--win-text-secondary)]">
                  {language === 'vi' ? 'Ổ đĩa (Mô phỏng)' : 'Drives (Simulated)'}
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="win-card rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Windows (C:)</span>
                      <span className="tabular-nums text-[var(--win-text-secondary)]">128 / 256 GB</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full w-1/2 rounded-full bg-[var(--win-accent-bright)]" />
                    </div>
                  </div>
                  <div className="win-card rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Data & Work (D:)</span>
                      <span className="tabular-nums text-[var(--win-text-secondary)]">64 / 512 GB</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full w-1/5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPath === 'Documents' && (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-2 sm:grid-cols-2' : 'space-y-1.5'}>
                {RECOMMENDED_ITEMS.filter(
                  (i) => !query || i.title.toLowerCase().includes(query)
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenWindow('notes')}
                    className="win-card flex items-center justify-between rounded-xl p-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold">{item.title}</div>
                      <div className="text-[11px] text-[var(--win-text-secondary)]">
                        {item.subtitle[language]}
                      </div>
                    </div>
                    <WindowsSystemIcon name="documents" size={18} className="text-[var(--win-accent)]" />
                  </button>
                ))}
              </div>
            )}

            {currentPath === 'Pictures' && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {BUILTIN_WALLPAPERS.filter(
                  (w) => !query || w.name[language].toLowerCase().includes(query)
                ).map((wp) => (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => onSelectWallpaper?.(wp.id)}
                    className="win-card overflow-hidden rounded-xl text-left"
                  >
                    <div className="h-20 w-full" style={{ background: wp.previewBg }} />
                    <div className="truncate p-2 text-[11px] font-semibold">
                      {wp.name[language]}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentPath === 'Downloads' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenWindow('paint')}
                  className="win-card flex w-full items-center justify-between rounded-xl p-3 text-left"
                >
                  <div>
                    <div className="text-xs font-bold">Paint Sketch Studio</div>
                    <div className="text-[11px] text-[var(--win-text-secondary)]">
                      {language === 'vi' ? 'Bấm để mở ứng dụng Vẽ' : 'Click to launch Paint'}
                    </div>
                  </div>
                  <WindowsSystemIcon name="paint" size={20} className="text-[var(--win-accent)]" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenWindow('calculator')}
                  className="win-card flex w-full items-center justify-between rounded-xl p-3 text-left"
                >
                  <div>
                    <div className="text-xs font-bold">Calculator Fluent</div>
                    <div className="text-[11px] text-[var(--win-text-secondary)]">
                      {language === 'vi' ? 'Bấm để mở Máy tính' : 'Click to launch Calculator'}
                    </div>
                  </div>
                  <WindowsSystemIcon name="calculator" size={20} className="text-[var(--win-accent)]" />
                </button>
              </div>
            )}

            {currentPath === 'Recycle Bin' && (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <WindowsSystemIcon name="recycleBin" size={34} className="mb-2 opacity-50" />
                <div className="text-xs font-semibold">
                  {language === 'vi' ? 'Thùng rác hiện đang trống' : 'Recycle Bin is empty'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
