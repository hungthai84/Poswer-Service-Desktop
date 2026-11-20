import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  Pin,
  PinOff,
  Search,
  SlidersHorizontal,
  Sun,
} from 'lucide-react';
import {
  LanguageId,
  PINNED_APPS,
  PinnedApp,
  RECOMMENDED_ITEMS,
  UI_TEXT,
  USER_PROFILE,
  WEATHER_DATA,
  WindowId,
} from '../data/desktopData';
import {
  START_MENU_STYLE_OPTIONS,
  StartMenuStyleId,
  TaskbarPositionId,
} from '../data/customization';
import { StartMenuPrefs } from '../data/osConfig';
import { AppBrandIcon, FluentSystemIcon, UserAvatar } from './FluentIcons';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { useViewport } from '../hooks/useViewport';

interface StartMenuProps {
  isOpen: boolean;
  zIndex: number;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  startMenuStyle: StartMenuStyleId;
  startMenuPrefs: StartMenuPrefs;
  displayName?: string;
  onSetStartMenuStyle: (style: StartMenuStyleId) => void;
  onUpdateStartMenuPrefs: (patch: Partial<StartMenuPrefs>) => void;
  onClose: () => void;
  onLock: () => void;
  onSleep: () => void;
  onRestartSim: () => void;
  onShutdown: () => void;
  onOpenWindow: (id: WindowId) => void;
  onOpenSearch: () => void;
  onAppLaunch: (appName: string) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  zIndex,
  language,
  taskbarPosition,
  startMenuStyle,
  startMenuPrefs,
  displayName,
  onSetStartMenuStyle,
  onUpdateStartMenuPrefs,
  onClose,
  onLock,
  onSleep,
  onRestartSim,
  onShutdown,
  onOpenWindow,
  onOpenSearch,
  onAppLaunch,
}) => {
  const [showAllApps, setShowAllApps] = useState(false);
  const [inlineQuery, setInlineQuery] = useState('');
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [layoutConfigOpen, setLayoutConfigOpen] = useState(false);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const viewport = useViewport();
  const isMobile = viewport.isMobile;
  const copy = UI_TEXT[language].startMenu;
  const activeProfileName = displayName?.trim() || USER_PROFILE.name;

  useEffect(() => {
    if (!isOpen) {
      setPowerMenuOpen(false);
      setLayoutConfigOpen(false);
    }
  }, [isOpen]);

  const activePinnedIds = useMemo(() => {
    if (startMenuPrefs.pinnedOrder && startMenuPrefs.pinnedOrder.length > 0) {
      return startMenuPrefs.pinnedOrder;
    }
    return PINNED_APPS.map((a) => a.id);
  }, [startMenuPrefs.pinnedOrder]);

  const pinnedAppsList = useMemo(() => {
    const map = new Map(PINNED_APPS.map((a) => [a.id, a]));
    return activePinnedIds
      .map((id) => map.get(id))
      .filter((a): a is PinnedApp => Boolean(a));
  }, [activePinnedIds]);

  const q = inlineQuery.trim().toLowerCase();

  const filteredPinned = useMemo(
    () =>
      q
        ? pinnedAppsList.filter((app) => app.name.toLowerCase().includes(q))
        : pinnedAppsList,
    [pinnedAppsList, q]
  );

  const filteredRecommended = useMemo(
    () =>
      q
        ? RECOMMENDED_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.subtitle[language].toLowerCase().includes(q)
          )
        : RECOMMENDED_ITEMS,
    [q, language]
  );

  const sortedAllApps = useMemo(() => {
    const base = [...PINNED_APPS].sort((a, b) => a.name.localeCompare(b.name));
    return q ? base.filter((a) => a.name.toLowerCase().includes(q)) : base;
  }, [q]);

  const handleTogglePin = (appId: string) => {
    const exists = activePinnedIds.includes(appId);
    const nextOrder = exists
      ? activePinnedIds.filter((id) => id !== appId)
      : [...activePinnedIds, appId];
    onUpdateStartMenuPrefs({ pinnedOrder: nextOrder });
  };

  const handleDropReorder = (targetId: string) => {
    if (!draggedAppId || draggedAppId === targetId) return;
    const next = [...activePinnedIds];
    const fromIdx = next.indexOf(draggedAppId);
    const toIdx = next.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, draggedAppId);
    onUpdateStartMenuPrefs({ pinnedOrder: next });
    setDraggedAppId(null);
  };

  const launchApp = (app: PinnedApp) => {
    if (app.linkedWindow) {
      onOpenWindow(app.linkedWindow);
    } else {
      onAppLaunch(app.name);
    }
    onClose();
  };

  const positionClass = isMobile
    ? taskbarPosition === 'top'
      ? 'top-[58px] left-1/2 -translate-x-1/2'
      : 'bottom-[60px] left-1/2 -translate-x-1/2'
    : taskbarPosition === 'top'
    ? 'top-[72px] left-1/2 -translate-x-1/2'
    : taskbarPosition === 'left'
    ? 'left-[74px] top-1/2 -translate-y-1/2'
    : taskbarPosition === 'right'
    ? 'right-[74px] top-1/2 -translate-y-1/2'
    : 'bottom-[74px] left-1/2 -translate-x-1/2';

  const initialOffset =
    taskbarPosition === 'top'
      ? { opacity: 0, y: -20, scale: 0.97 }
      : !isMobile && taskbarPosition === 'left'
      ? { opacity: 0, x: -20, scale: 0.97 }
      : !isMobile && taskbarPosition === 'right'
      ? { opacity: 0, x: 20, scale: 0.97 }
      : { opacity: 0, y: 24, scale: 0.97 };

  const widthPx =
    startMenuStyle === 'compact'
      ? 520
      : startMenuStyle === 'sidebar'
      ? 700
      : startMenuPrefs.pinnedColumns === 8
      ? 720
      : 650;

  const sizeClass = isMobile
    ? 'h-[min(600px,calc(100dvh-76px))] w-[calc(100vw-16px)]'
    : taskbarPosition === 'left' || taskbarPosition === 'right'
    ? `h-[min(650px,calc(100dvh-32px))] w-[min(${widthPx}px,calc(100vw-92px))]`
    : `h-[min(650px,calc(100dvh-92px))] w-[min(${widthPx}px,95vw)]`;

  const pinnedGridClass =
    startMenuPrefs.pinnedColumns === 4
      ? 'grid-cols-3 sm:grid-cols-4'
      : startMenuPrefs.pinnedColumns === 8
      ? 'grid-cols-4 sm:grid-cols-8'
      : 'grid-cols-3 sm:grid-cols-6';

  const renderStyleSwitcher = () => (
    <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--win-border-subtle)] px-5 py-2.5 sm:px-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="mr-1 hidden text-[11px] font-medium text-[var(--win-text-secondary)] sm:inline">
            {copy.layoutLabel}:
          </span>
          {START_MENU_STYLE_OPTIONS.map((opt) => {
            const isActive = startMenuStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setShowAllApps(false);
                  onSetStartMenuStyle(opt.id);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[var(--win-accent-bright)] text-white shadow-xs'
                    : 'bg-black/5 text-[var(--win-text-primary)] hover:bg-black/10 dark:bg-white/8 dark:hover:bg-white/15'
                }`}
              >
                {opt.shortLabel[language]}
              </button>
            );
          })}
        </div>

        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLayoutConfigOpen((p) => !p)}
            title={language === 'vi' ? 'Tùy chỉnh lưới Start' : 'Start grid options'}
            aria-label={language === 'vi' ? 'Tùy chỉnh lưới Start' : 'Start grid options'}
            className={`win-card inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[var(--win-text-primary)] ${
              layoutConfigOpen ? 'ring-1 ring-[var(--win-accent)]' : ''
            }`}
          >
            <SlidersHorizontal size={12} className="text-[var(--win-accent)]" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            title={copy.openSearch}
            aria-label={copy.openSearch}
            className="win-card inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--win-text-primary)]"
          >
            <Search size={12} className="text-[var(--win-accent)]" />
            <span className="hidden sm:inline">{UI_TEXT[language].taskbar.searchLabel}</span>
          </button>

          {layoutConfigOpen && (
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="win-acrylic absolute top-9 right-0 z-30 w-56 space-y-2.5 rounded-xl p-3 shadow-xl"
            >
              <div>
                <div className="mb-1 text-[11px] font-semibold text-[var(--win-text-secondary)]">
                  {language === 'vi' ? 'Số cột ứng dụng ghim' : 'Pinned grid columns'}
                </div>
                <div className="flex gap-1">
                  {([4, 6, 8] as const).map((cols) => (
                    <button
                      key={cols}
                      type="button"
                      onClick={() => onUpdateStartMenuPrefs({ pinnedColumns: cols })}
                      className={`flex-1 rounded-lg py-1 text-xs font-semibold ${
                        startMenuPrefs.pinnedColumns === cols
                          ? 'bg-[var(--win-accent-bright)] text-white'
                          : 'bg-black/5 hover:bg-black/10 dark:bg-white/10'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between text-xs font-medium">
                <span>{language === 'vi' ? 'Hiện mục Đề xuất' : 'Show Recommended'}</span>
                <input
                  type="checkbox"
                  checked={startMenuPrefs.showRecommended}
                  onChange={(e) =>
                    onUpdateStartMenuPrefs({ showRecommended: e.target.checked })
                  }
                  className="accent-[var(--win-accent)]"
                />
              </label>

              <button
                type="button"
                onClick={() => onUpdateStartMenuPrefs({ pinnedOrder: [] })}
                className="w-full rounded-lg bg-black/5 py-1 text-[11px] font-semibold hover:bg-black/10 dark:bg-white/10"
              >
                {language === 'vi' ? 'Đặt lại thứ tự ghim' : 'Reset pinned order'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline Search Bar inside Start Menu */}
      <div className="flex items-center gap-2 rounded-xl border border-black/8 bg-white/55 px-3 py-1.5 dark:border-white/12 dark:bg-white/8">
        <Search size={14} className="shrink-0 text-[var(--win-accent)]" />
        <input
          type="text"
          value={inlineQuery}
          onChange={(e) => setInlineQuery(e.target.value)}
          placeholder={
            language === 'vi'
              ? 'Tìm nhanh ứng dụng hoặc tệp đã ghim...'
              : 'Filter pinned apps or files...'
          }
          className="w-full bg-transparent text-xs text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none"
        />
        {inlineQuery && (
          <button
            type="button"
            onClick={() => setInlineQuery('')}
            className="text-[11px] font-medium text-[var(--win-text-secondary)] hover:text-[var(--win-text-primary)]"
          >
            {language === 'vi' ? 'Xóa' : 'Clear'}
          </button>
        )}
      </div>
    </div>
  );

  const renderPowerPopover = () => {
    if (!powerMenuOpen) return null;
    return (
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="win-acrylic absolute right-6 bottom-[64px] z-30 w-56 space-y-1 rounded-xl p-1.5 shadow-xl"
      >
        <button
          type="button"
          onClick={() => {
            setPowerMenuOpen(false);
            onClose();
            onSleep();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-black/6 dark:hover:bg-white/10"
        >
          <WindowsSystemIcon name="sleep" size={16} />
          <span>{language === 'vi' ? 'Ngủ (Mô phỏng)' : 'Sleep (Sim)'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setPowerMenuOpen(false);
            onClose();
            onLock();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-black/6 dark:hover:bg-white/10"
        >
          <WindowsSystemIcon name="lock" size={16} />
          <span>{copy.lockTooltip}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setPowerMenuOpen(false);
            onClose();
            onRestartSim();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-black/6 dark:hover:bg-white/10"
        >
          <WindowsSystemIcon name="restart" size={16} />
          <span>{language === 'vi' ? 'Khởi động lại (Mô phỏng)' : 'Restart (Sim)'}</span>
        </button>
        <div className="my-0.5 h-px bg-[var(--win-border-subtle)]" />
        <button
          type="button"
          onClick={() => {
            setPowerMenuOpen(false);
            onClose();
            onShutdown();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
        >
          <WindowsSystemIcon name="power" size={16} />
          <span>{copy.shutdownTooltip}</span>
        </button>
      </div>
    );
  };

  const renderFooter = () => (
    <div
      className="relative flex h-[60px] shrink-0 items-center justify-between border-t px-6 sm:px-9"
      style={{
        backgroundColor: 'var(--win-surface-footer)',
        borderColor: 'var(--win-border-subtle)',
      }}
    >
      {renderPowerPopover()}

      <div className="flex items-center gap-3">
        <UserAvatar size={34} initials={USER_PROFILE.initials} />
        <div className="leading-tight">
          <div className="text-[14px] font-bold text-[var(--win-text-primary)] opacity-90">
            {activeProfileName}
          </div>
          <div className="text-[10px] text-[var(--win-text-secondary)]">
            {USER_PROFILE.email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          title={copy.lockTooltip}
          aria-label={copy.lockTooltip}
          onClick={() => {
            onClose();
            onLock();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--win-text-primary)] opacity-85 transition-colors hover:bg-white/50 hover:opacity-100 dark:hover:bg-white/12"
        >
          <WindowsSystemIcon name="lock" size={17} />
        </button>
        <button
          type="button"
          title={copy.shutdownTooltip}
          aria-label={copy.shutdownTooltip}
          onClick={() => setPowerMenuOpen((prev) => !prev)}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-[var(--win-text-primary)] transition-colors hover:bg-white/50 dark:hover:bg-white/12 ${
            powerMenuOpen ? 'bg-white/60 ring-1 ring-[var(--win-accent)] dark:bg-white/15' : ''
          }`}
        >
          <WindowsSystemIcon name="power" size={18} />
        </button>
      </div>
    </div>
  );

  const renderAllAppsView = () => (
    <div className="win-scrollbar flex-1 overflow-y-auto px-6 py-5 sm:px-9">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[var(--win-text-primary)]">
          {copy.allApps}
        </h2>
        <button
          type="button"
          onClick={() => setShowAllApps(false)}
          className="win-card inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--win-text-primary)]"
        >
          <ChevronLeft size={13} />
          <span>{copy.back}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {sortedAllApps.map((app) => {
          const isPinned = activePinnedIds.includes(app.id);
          return (
            <div
              key={app.id}
              className="flex items-center justify-between rounded-xl px-2.5 py-1.5 transition-colors hover:bg-white/50 dark:hover:bg-white/10"
            >
              <button
                type="button"
                onClick={() => launchApp(app)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <AppBrandIcon icon={app.icon} size={24} />
                <span className="truncate text-sm font-medium text-[var(--win-text-primary)]">
                  {app.name}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleTogglePin(app.id)}
                title={
                  isPinned
                    ? language === 'vi'
                      ? 'Bỏ ghim khỏi Start'
                      : 'Unpin from Start'
                    : language === 'vi'
                    ? 'Ghim vào Start'
                    : 'Pin to Start'
                }
                aria-label={isPinned ? 'Unpin' : 'Pin'}
                className="rounded-lg p-1.5 text-[var(--win-text-secondary)] hover:bg-black/8 hover:text-[var(--win-accent)] dark:hover:bg-white/12"
              >
                {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDraggablePinnedButton = (app: PinnedApp, compactTile = false) => (
    <button
      key={app.id}
      type="button"
      draggable
      onDragStart={() => setDraggedAppId(app.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDropReorder(app.id)}
      onDragEnd={() => setDraggedAppId(null)}
      onClick={() => launchApp(app)}
      className={
        compactTile
          ? `win-card group flex flex-col items-center justify-center rounded-2xl px-2 py-3 text-center ${
              draggedAppId === app.id ? 'opacity-45' : ''
            }`
          : `group flex flex-col items-center justify-center rounded-xl px-1 py-2 text-center transition-colors hover:bg-white/50 dark:hover:bg-white/10 ${
              draggedAppId === app.id ? 'opacity-45' : ''
            }`
      }
      title={`${app.name} (${language === 'vi' ? 'Kéo để sắp xếp' : 'Drag to reorder'})`}
    >
      <div className="transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
        <AppBrandIcon icon={app.icon} size={compactTile ? 30 : 34} />
      </div>
      <span className="mt-1.5 w-full truncate text-[12px] text-[var(--win-text-primary)] opacity-90">
        {app.name}
      </span>
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Start Menu"
          initial={initialOffset}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={initialOffset}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex, borderRadius: 'var(--win-radius)' }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`win-acrylic fixed flex flex-col overflow-hidden select-none ${positionClass} ${sizeClass}`}
        >
          {renderStyleSwitcher()}

          {showAllApps ? (
            <>
              {renderAllAppsView()}
              {renderFooter()}
            </>
          ) : startMenuStyle === 'classic' ? (
            <>
              {/* Mẫu 1: Chuẩn Windows 12 */}
              <div className="win-scrollbar flex-1 overflow-y-auto px-6 pt-4 pb-4 sm:px-10 sm:pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-[var(--win-text-primary)]">
                      {copy.pinned}
                    </h2>
                    <span className="text-[10px] text-[var(--win-text-secondary)]">
                      ({language === 'vi' ? 'Kéo để đổi vị trí' : 'Drag to reorder'})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllApps(true)}
                    className="win-card inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--win-text-primary)]"
                  >
                    <span>{copy.allApps}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className={`grid gap-x-2 gap-y-2.5 ${pinnedGridClass}`}>
                  {filteredPinned.map((app) => renderDraggablePinnedButton(app, false))}
                </div>

                {startMenuPrefs.showRecommended && (
                  <>
                    <div className="mt-6 mb-3 flex items-center justify-between">
                      <h2 className="text-[15px] font-bold text-[var(--win-text-primary)]">
                        {copy.recommended}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setShowAllApps(true)}
                        className="win-card inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--win-text-primary)]"
                      >
                        <span>{copy.more}</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2.5">
                      {filteredRecommended.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onAppLaunch(item.title);
                            onClose();
                          }}
                          className="flex items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                            <AppBrandIcon icon={item.icon} size={30} />
                          </div>
                          <div className="min-w-0 leading-tight">
                            <div className="truncate text-[13px] font-semibold text-[var(--win-text-primary)]">
                              {item.title}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-[var(--win-text-secondary)]">
                              {item.subtitle[language]}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {renderFooter()}
            </>
          ) : startMenuStyle === 'compact' ? (
            <>
              {/* Mẫu 2: Danh sách tối giản */}
              <div className="win-scrollbar flex-1 overflow-y-auto px-5 py-4 sm:px-7">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--win-text-primary)]">
                    {copy.pinned}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAllApps(true)}
                    className="text-xs font-medium text-[var(--win-accent)] hover:underline"
                  >
                    {copy.allApps} ({filteredPinned.length})
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {filteredPinned.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      draggable
                      onDragStart={() => setDraggedAppId(app.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDropReorder(app.id)}
                      onDragEnd={() => setDraggedAppId(null)}
                      onClick={() => launchApp(app)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/55 dark:hover:bg-white/10"
                    >
                      <AppBrandIcon icon={app.icon} size={24} />
                      <span className="truncate text-[13px] font-medium text-[var(--win-text-primary)]">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>

                {startMenuPrefs.showRecommended && (
                  <>
                    <div className="mt-5 mb-2 text-xs font-bold text-[var(--win-text-secondary)]">
                      {copy.recommended}
                    </div>
                    <div className="space-y-1">
                      {filteredRecommended.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onAppLaunch(item.title);
                            onClose();
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/55 dark:hover:bg-white/10"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <AppBrandIcon icon={item.icon} size={20} />
                            <span className="truncate text-[13px] font-medium text-[var(--win-text-primary)]">
                              {item.title}
                            </span>
                          </div>
                          <span className="ml-2 shrink-0 text-[11px] text-[var(--win-text-secondary)]">
                            {item.subtitle[language]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {renderFooter()}
            </>
          ) : startMenuStyle === 'tiles' ? (
            <>
              {/* Mẫu 3: Ô thẻ Bento Fluent */}
              <div className="win-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenWindow('weather');
                      onClose();
                    }}
                    className="win-card flex items-center justify-between rounded-2xl p-3.5 text-left sm:col-span-2"
                  >
                    <div>
                      <div className="text-xs font-medium text-[var(--win-text-secondary)]">
                        {WEATHER_DATA.location}
                      </div>
                      <div className="mt-1 flex items-baseline gap-2 tabular-nums">
                        <span className="text-2xl font-bold text-[var(--win-text-primary)]">
                          {WEATHER_DATA.currentTemp}
                        </span>
                        <span className="text-xs text-[var(--win-text-secondary)]">
                          {WEATHER_DATA.condition[language]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sun size={18} className="text-amber-500" />
                      <Cloud size={22} className="text-sky-500" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenWindow('settings');
                      onClose();
                    }}
                    className="win-card flex items-center gap-3 rounded-2xl p-3.5 text-left"
                  >
                    <FluentSystemIcon type="settings" size={28} />
                    <div>
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {UI_TEXT[language].settings.windowTitle}
                      </div>
                      <div className="text-[11px] text-[var(--win-text-secondary)]">
                        Windows 12
                      </div>
                    </div>
                  </button>
                </div>

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[var(--win-text-primary)]">
                      {copy.pinned}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowAllApps(true)}
                      className="text-xs font-medium text-[var(--win-accent)] hover:underline"
                    >
                      {copy.allApps}
                    </button>
                  </div>

                  <div className={`grid gap-2 ${pinnedGridClass}`}>
                    {filteredPinned.map((app) => renderDraggablePinnedButton(app, true))}
                  </div>
                </div>
              </div>
              {renderFooter()}
            </>
          ) : (
            <>
              {/* Mẫu 4: Chia 2 cột hiện đại */}
              <div className="flex flex-1 flex-col overflow-hidden sm:flex-row">
                <div
                  className="flex w-full shrink-0 flex-col gap-2.5 border-b border-[var(--win-border-subtle)] p-3 sm:w-[215px] sm:justify-between sm:border-r sm:border-b-0 sm:p-4"
                  style={{ backgroundColor: 'var(--win-surface-footer)' }}
                >
                  <div className="space-y-2.5 sm:space-y-4">
                    <div className="flex items-center justify-between gap-2.5 sm:justify-start">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <UserAvatar size={34} initials={USER_PROFILE.initials} />
                        <div className="min-w-0">
                          <div className="truncate text-xs font-bold text-[var(--win-text-primary)]">
                            {activeProfileName}
                          </div>
                          <div className="truncate text-[10px] text-[var(--win-text-secondary)]">
                            {USER_PROFILE.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onLock();
                          }}
                          title={copy.lockTooltip}
                          className="win-card flex h-8 w-8 items-center justify-center rounded-lg text-[var(--win-text-primary)]"
                        >
                          <WindowsSystemIcon name="lock" size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onShutdown();
                          }}
                          title={copy.shutdownTooltip}
                          className="win-card flex h-8 w-8 items-center justify-center rounded-lg text-[var(--win-text-primary)]"
                        >
                          <WindowsSystemIcon name="power" size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 hidden text-[11px] font-bold text-[var(--win-text-secondary)] sm:block">
                        {copy.quickAccess}
                      </div>
                      <div className="no-scrollbar flex gap-1.5 overflow-x-auto sm:flex-col sm:space-y-1 sm:overflow-visible">
                        {(
                          [
                            { id: 'explorer', icon: 'explorer', label: UI_TEXT[language].apps.explorerTitle },
                            { id: 'welcome', icon: 'welcome', label: UI_TEXT[language].welcome.windowTitle },
                            { id: 'weather', icon: 'weather', label: UI_TEXT[language].weather.windowTitle },
                            { id: 'settings', icon: 'settings', label: UI_TEXT[language].settings.windowTitle },
                            { id: 'notes', icon: 'notes', label: UI_TEXT[language].apps.notesTitle },
                            { id: 'calculator', icon: 'calculator', label: UI_TEXT[language].apps.calculatorTitle },
                            { id: 'paint', icon: 'paint', label: UI_TEXT[language].apps.paintTitle },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onOpenWindow(item.id);
                              onClose();
                            }}
                            className="flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-medium text-[var(--win-text-primary)] hover:bg-white/50 sm:w-full sm:gap-2.5 dark:hover:bg-white/10"
                          >
                            <FluentSystemIcon type={item.icon} size={18} />
                            <span className="truncate">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hidden space-y-1.5 sm:block">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLock();
                      }}
                      className="win-card flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--win-text-primary)]"
                    >
                      <WindowsSystemIcon name="lock" size={14} />
                      <span>{copy.lockTooltip}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onShutdown();
                      }}
                      className="win-card flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--win-text-primary)]"
                    >
                      <WindowsSystemIcon name="power" size={14} />
                      <span>{copy.shutdownTooltip}</span>
                    </button>
                  </div>
                </div>

                <div className="win-scrollbar flex-1 overflow-y-auto p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[var(--win-text-primary)]">
                      {copy.pinned}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowAllApps(true)}
                      className="text-xs font-medium text-[var(--win-accent)] hover:underline"
                    >
                      {copy.allApps}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {filteredPinned.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        draggable
                        onDragStart={() => setDraggedAppId(app.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropReorder(app.id)}
                        onDragEnd={() => setDraggedAppId(null)}
                        onClick={() => launchApp(app)}
                        className="flex flex-col items-center rounded-xl p-2 text-center transition-colors hover:bg-white/50 dark:hover:bg-white/10"
                      >
                        <AppBrandIcon icon={app.icon} size={30} />
                        <span className="mt-1 w-full truncate text-[11px] font-medium text-[var(--win-text-primary)]">
                          {app.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {startMenuPrefs.showRecommended && (
                    <>
                      <div className="mt-5 mb-2 text-xs font-bold text-[var(--win-text-secondary)]">
                        {copy.recommended}
                      </div>
                      <div className="space-y-1.5">
                        {filteredRecommended.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onAppLaunch(item.title);
                              onClose();
                            }}
                            className="win-card flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left"
                          >
                            <AppBrandIcon icon={item.icon} size={22} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-semibold text-[var(--win-text-primary)]">
                                {item.title}
                              </div>
                              <div className="truncate text-[10px] text-[var(--win-text-secondary)]">
                                {item.subtitle[language]}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
