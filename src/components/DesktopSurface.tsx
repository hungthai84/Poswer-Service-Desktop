import React, { useMemo, useRef, useState } from 'react';
import { LanguageId, WindowId } from '../data/desktopData';
import {
  DesktopIconSortBy,
  DesktopLayoutConfig,
  DesktopShortcutItem,
} from '../data/osConfig';
import { TaskbarPositionId } from '../data/customization';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { useViewport } from '../hooks/useViewport';

interface DesktopSurfaceProps {
  language: LanguageId;
  shortcuts: DesktopShortcutItem[];
  layout: DesktopLayoutConfig;
  taskbarPosition: TaskbarPositionId;
  onUpdateShortcuts: (next: DesktopShortcutItem[]) => void;
  onUpdateLayout: (patch: Partial<DesktopLayoutConfig>) => void;
  onOpenShortcut: (item: DesktopShortcutItem) => void;
  onOpenSettingsTab: (tabId: string) => void;
  onOpenWidgetLibrary: () => void;
  onCreateDesktopNote: () => void;
  onPinToTaskbar?: (windowId: WindowId) => void;
  onRefreshDesktop: () => void;
}

export const DesktopSurface: React.FC<DesktopSurfaceProps> = ({
  language,
  shortcuts,
  layout,
  taskbarPosition,
  onUpdateShortcuts,
  onUpdateLayout,
  onOpenShortcut,
  onOpenSettingsTab,
  onOpenWidgetLibrary,
  onCreateDesktopNote,
  onPinToTaskbar,
  onRefreshDesktop,
}) => {
  const viewport = useViewport();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    shortcut?: DesktopShortcutItem;
  } | null>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  const gapStep =
    layout.iconGap === 'compact' ? 80 : layout.iconGap === 'relaxed' ? 108 : 92;

  const displayedShortcuts = useMemo(() => {
    const minX = taskbarPosition === 'left' ? 72 : 12;
    const minY = taskbarPosition === 'top' ? 68 : 12;
    const maxX = Math.max(minX + 40, viewport.width - (taskbarPosition === 'right' ? 170 : 105));
    const maxY = Math.max(minY + 40, viewport.height - (taskbarPosition === 'bottom' ? 160 : 100));

    if (!layout.autoArrange) {
      return shortcuts.map((item) => ({
        ...item,
        x: Math.max(minX, Math.min(maxX, item.x)),
        y: Math.max(minY, Math.min(maxY, item.y)),
      }));
    }
    const maxRows = Math.max(2, Math.floor((viewport.height - minY - 96) / gapStep));
    const cols = layout.iconView === 'list' ? 1 : 2;
    return shortcuts.map((item, idx) => {
      const col = Math.floor(idx / maxRows);
      const row = idx % maxRows;
      return {
        ...item,
        x: Math.min(maxX, minX + col * (layout.iconView === 'list' ? 210 : gapStep * cols * 0.5)),
        y: Math.min(maxY, minY + row * gapStep),
      };
    });
  }, [shortcuts, layout.autoArrange, layout.iconView, gapStep, viewport.width, viewport.height, taskbarPosition]);

  const iconSizePx =
    layout.iconSize === 'small' ? 24 : layout.iconSize === 'large' ? 40 : 32;
  const tileWidth = layout.iconView === 'list' ? 190 : layout.iconSize === 'large' ? 92 : 80;

  const sortShortcuts = (by: DesktopIconSortBy) => {
    const sorted = [...shortcuts].sort((a, b) => {
      if (by === 'name') return a.label[language].localeCompare(b.label[language]);
      if (by === 'type') return a.type.localeCompare(b.type);
      return b.modifiedAt - a.modifiedAt;
    });
    const arranged = sorted.map((item, idx) => ({
      ...item,
      x: 20 + Math.floor(idx / 5) * gapStep,
      y: 20 + (idx % 5) * gapStep,
    }));
    onUpdateShortcuts(arranged);
  };

  const handlePointerDownIcon = (
    e: React.PointerEvent<HTMLButtonElement>,
    item: DesktopShortcutItem
  ) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedId(item.id);
    setContextMenu(null);
    if (layout.autoArrange) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
      moved: false,
    };
  };

  const handlePointerMoveIcon = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;

    const minX = taskbarPosition === 'left' ? 72 : 10;
    const minY = taskbarPosition === 'top' ? 68 : 10;
    const maxX = Math.max(minX + 40, window.innerWidth - (taskbarPosition === 'right' ? 170 : 105));
    const maxY = Math.max(minY + 40, window.innerHeight - (taskbarPosition === 'bottom' ? 160 : 100));

    let nx = Math.max(minX, Math.min(maxX, d.origX + dx));
    let ny = Math.max(minY, Math.min(maxY, d.origY + dy));

    if (layout.snapToGrid) {
      nx = Math.round((nx - 20) / gapStep) * gapStep + 20;
      ny = Math.round((ny - 20) / gapStep) * gapStep + 20;
    }

    onUpdateShortcuts(
      shortcuts.map((s) => (s.id === d.id ? { ...s, x: nx, y: ny } : s))
    );
  };

  const handlePointerUpIcon = () => {
    dragRef.current = null;
  };

  const handleBackgroundContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setSelectedId(null);
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 235),
      y: Math.min(e.clientY, window.innerHeight - 290),
    });
  };

  const insetTop = taskbarPosition === 'top' ? 56 : 0;
  const insetBottom = taskbarPosition === 'bottom' ? 64 : 0;
  const insetLeft = taskbarPosition === 'left' ? 64 : 0;
  const insetRight = taskbarPosition === 'right' ? 64 : 0;

  return (
    <div
      data-desktop-surface="true"
      className="fixed inset-0 z-[2]"
      style={{
        paddingTop: insetTop,
        paddingBottom: insetBottom,
        paddingLeft: insetLeft,
        paddingRight: insetRight,
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedId(null);
          setContextMenu(null);
        }
      }}
      onContextMenu={handleBackgroundContextMenu}
    >
      {/* Desktop Icons */}
      {layout.showIcons &&
        (viewport.isMobile ? (
          <div
            data-desktop-surface="true"
            className="grid grid-cols-4 gap-2 px-3 pt-3"
          >
            {shortcuts.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item.id);
                    onOpenShortcut(item);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedId(item.id);
                    setContextMenu({
                      x: Math.min(e.clientX, viewport.width - 235),
                      y: Math.min(e.clientY, viewport.height - 240),
                      shortcut: item,
                    });
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl p-1.5 text-center transition-colors focus:outline-none ${
                    isSelected
                      ? 'border border-white/45 bg-white/28 backdrop-blur-md dark:bg-white/18'
                      : 'border border-transparent active:bg-white/20'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/25 text-white shadow-sm backdrop-blur-xs dark:bg-black/25">
                    <WindowsSystemIcon
                      name={item.iconKey}
                      active={isSelected}
                      size={24}
                      className="drop-shadow-sm"
                    />
                  </div>
                  {layout.showLabels && (
                    <span className="mt-1 line-clamp-1 w-full text-[10px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                      {item.label[language]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          displayedShortcuts.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onPointerDown={(e) => handlePointerDownIcon(e, item)}
                onPointerMove={handlePointerMoveIcon}
                onPointerUp={handlePointerUpIcon}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onOpenShortcut(item);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedId(item.id);
                  setContextMenu({
                    x: Math.min(e.clientX, viewport.width - 235),
                    y: Math.min(e.clientY, viewport.height - 240),
                    shortcut: item,
                  });
                }}
                style={{
                  left: item.x,
                  top: item.y,
                  width: tileWidth,
                }}
                className={`absolute flex rounded-xl p-1.5 transition-colors focus:outline-none ${
                  layout.iconView === 'list'
                    ? 'flex-row items-center gap-2.5 text-left'
                    : 'flex-col items-center justify-center text-center'
                } ${
                  isSelected
                    ? 'border border-white/45 bg-white/28 backdrop-blur-md dark:bg-white/18'
                    : 'border border-transparent hover:bg-white/18 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-white shadow-sm backdrop-blur-xs dark:bg-black/25">
                  <WindowsSystemIcon
                    name={item.iconKey}
                    active={isSelected}
                    size={iconSizePx}
                    className="drop-shadow-sm"
                  />
                </div>
                {layout.showLabels && (
                  <span className="mt-1 line-clamp-2 text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                    {item.label[language]}
                  </span>
                )}
              </button>
            );
          })
        ))}

      {/* Windows 11 Acrylic Context Menu */}
      {contextMenu && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          className="win-acrylic fixed z-[1060] w-[225px] rounded-2xl p-1.5 text-xs shadow-xl"
          role="menu"
        >
          {contextMenu.shortcut ? (
            <>
              <button
                type="button"
                onClick={() => {
                  onOpenShortcut(contextMenu.shortcut!);
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-semibold text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name={contextMenu.shortcut.iconKey} size={16} />
                <span>{language === 'vi' ? 'Mở' : 'Open'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenShortcut(contextMenu.shortcut!);
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="privacy" size={16} />
                <span>
                  {language === 'vi' ? 'Chạy quyền Admin (Mô phỏng)' : 'Run as Admin (Sim)'}
                </span>
              </button>
              {contextMenu.shortcut.targetWindow &&
                contextMenu.shortcut.targetWindow !== 'startMenu' &&
                onPinToTaskbar && (
                  <button
                    type="button"
                    onClick={() => {
                      onPinToTaskbar(contextMenu.shortcut!.targetWindow!);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
                  >
                    <WindowsSystemIcon name="taskbar" size={16} />
                    <span>{language === 'vi' ? 'Ghim vào Taskbar' : 'Pin to Taskbar'}</span>
                  </button>
                )}
              <div className="my-1 h-px bg-[var(--win-border-subtle)]" />
              <button
                type="button"
                onClick={() => {
                  onOpenSettingsTab('apps');
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="settings" size={16} />
                <span>{language === 'vi' ? 'Cài đặt ứng dụng' : 'App settings'}</span>
              </button>
            </>
          ) : (
            <>
              <div className="px-3 py-1 text-[10px] font-bold text-[var(--win-text-secondary)]">
                {language === 'vi' ? 'Chế độ xem' : 'View'}
              </div>
              <div className="grid grid-cols-3 gap-1 px-1.5 pb-1">
                {(['small', 'medium', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      onUpdateLayout({ iconSize: sz });
                      setContextMenu(null);
                    }}
                    className={`rounded-lg py-1 text-[11px] font-medium ${
                      layout.iconSize === sz
                        ? 'bg-[var(--win-accent-bright)] text-white'
                        : 'hover:bg-black/6 dark:hover:bg-white/10'
                    }`}
                  >
                    {sz === 'small'
                      ? language === 'vi'
                        ? 'Nhỏ'
                        : 'Small'
                      : sz === 'large'
                      ? language === 'vi'
                        ? 'Lớn'
                        : 'Large'
                      : language === 'vi'
                      ? 'Vừa'
                      : 'Med'}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateLayout({ showIcons: !layout.showIcons });
                  setContextMenu(null);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <span>
                  {layout.showIcons
                    ? language === 'vi'
                      ? 'Ẩn icon Desktop'
                      : 'Hide desktop icons'
                    : language === 'vi'
                    ? 'Hiện icon Desktop'
                    : 'Show desktop icons'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateLayout({ showWidgets: !layout.showWidgets });
                  setContextMenu(null);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <span>
                  {layout.showWidgets
                    ? language === 'vi'
                      ? 'Ẩn Widget Desktop'
                      : 'Hide desktop widgets'
                    : language === 'vi'
                    ? 'Hiện Widget Desktop'
                    : 'Show desktop widgets'}
                </span>
              </button>

              <div className="my-1 h-px bg-[var(--win-border-subtle)]" />

              <div className="px-3 py-1 text-[10px] font-bold text-[var(--win-text-secondary)]">
                {language === 'vi' ? 'Sắp xếp theo' : 'Sort by'}
              </div>
              <div className="grid grid-cols-3 gap-1 px-1.5 pb-1">
                {(
                  [
                    { id: 'name', vi: 'Tên', en: 'Name' },
                    { id: 'type', vi: 'Loại', en: 'Type' },
                    { id: 'dateModified', vi: 'Ngày', en: 'Date' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      sortShortcuts(opt.id);
                      setContextMenu(null);
                    }}
                    className="rounded-lg py-1 text-[11px] font-medium hover:bg-black/6 dark:hover:bg-white/10"
                  >
                    {language === 'vi' ? opt.vi : opt.en}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onRefreshDesktop();
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="restart" size={15} />
                <span>{language === 'vi' ? 'Làm mới (Refresh)' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onCreateDesktopNote();
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="add" size={15} />
                <span>{language === 'vi' ? 'Tạo mới Ghi chú' : 'New Quick Note'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenWidgetLibrary();
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="sparkle" size={15} />
                <span>{language === 'vi' ? 'Thêm Widget Desktop' : 'Add Desktop Widget'}</span>
              </button>

              <div className="my-1 h-px bg-[var(--win-border-subtle)]" />

              <button
                type="button"
                onClick={() => {
                  onOpenSettingsTab('system');
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-[var(--win-text-primary)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="thisPc" size={15} />
                <span>{language === 'vi' ? 'Cài đặt hiển thị' : 'Display settings'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenSettingsTab('personalization');
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left font-semibold text-[var(--win-accent)] hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="personalization" size={15} />
                <span>{language === 'vi' ? 'Cá nhân hóa (Personalize)' : 'Personalize'}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
