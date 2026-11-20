import React, { useEffect, useMemo, useState } from 'react';
import { Globe, Moon, Search, Sun } from 'lucide-react';
import {
  LanguageId,
  TASKBAR_APPS,
  TaskbarPinnedApp,
  UI_TEXT,
  WEATHER_DATA,
  WindowId,
} from '../data/desktopData';
import { TaskbarConfig, TaskbarPositionId, TaskbarStyleId } from '../data/customization';
import { ExtendedTaskbarPrefs, QuickSettingsState } from '../data/osConfig';
import { ThemeId } from '../data/themes';
import { AppBrandIcon, FluentSystemIcon, WindowsLogo } from './FluentIcons';
import { WindowsSystemIcon } from '../config/windowsIcons';
import { useViewport } from '../hooks/useViewport';

export interface WindowStateItem {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  hasFocus: boolean;
}

interface TaskbarProps {
  windows: Record<WindowId, WindowStateItem>;
  theme: ThemeId;
  language: LanguageId;
  taskbarStyle: TaskbarStyleId;
  taskbarPosition: TaskbarPositionId;
  taskbarConfig: TaskbarConfig;
  extendedTaskbar: ExtendedTaskbarPrefs;
  quickSettings: QuickSettingsState;
  activeDesktopName: string;
  unreadNotificationsCount: number;
  isSearchOpen: boolean;
  isQuickSettingsOpen: boolean;
  isNotificationsOpen: boolean;
  onToggleWindow: (id: WindowId) => void;
  onMinimizeWindow: (id: WindowId) => void;
  onCloseWindow: (id: WindowId) => void;
  onToggleSearch: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onOpenTaskbarSettings: () => void;
  onOpenQuickSettings: () => void;
  onOpenNotifications: () => void;
  onOpenTaskView: () => void;
  onOpenTaskManager: () => void;
  onShowDesktop: () => void;
  onReorderPinnedApps: (nextPinnedIds: string[]) => void;
  onAppLaunch: (appName: string) => void;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;
  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minStr} ${ampm}`;
}

function formatDate(date: Date, language: LanguageId): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return language === 'vi' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return '';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return '';
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  theme,
  language,
  taskbarStyle,
  taskbarPosition,
  taskbarConfig,
  extendedTaskbar,
  quickSettings,
  activeDesktopName,
  unreadNotificationsCount,
  isSearchOpen,
  isQuickSettingsOpen,
  isNotificationsOpen,
  onToggleWindow,
  onMinimizeWindow,
  onCloseWindow,
  onToggleSearch,
  onToggleTheme,
  onToggleLanguage,
  onOpenTaskbarSettings,
  onOpenQuickSettings,
  onOpenNotifications,
  onOpenTaskView,
  onOpenTaskManager,
  onShowDesktop,
  onReorderPinnedApps,
  onAppLaunch,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [hiddenTrayOpen, setHiddenTrayOpen] = useState(false);

  const viewport = useViewport();
  const isMobile = viewport.isMobile;
  const copy = UI_TEXT[language].taskbar;
  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';
  const isCompact = taskbarStyle === 'compact' || extendedTaskbar.size === 'small' || isMobile;
  const isLarge = extendedTaskbar.size === 'large' && taskbarStyle !== 'compact' && !isMobile;
  const isFull = taskbarStyle === 'full';
  const isPill = taskbarStyle === 'pill';

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!contextMenuOpen && !hiddenTrayOpen) return;
    const dismiss = () => {
      setContextMenuOpen(false);
      setHiddenTrayOpen(false);
    };
    window.addEventListener('pointerdown', dismiss);
    return () => window.removeEventListener('pointerdown', dismiss);
  }, [contextMenuOpen, hiddenTrayOpen]);

  const iconSize = isCompact ? 19 : isLarge ? 26 : 22;
  const btnSizeClass = isCompact
    ? 'h-8 w-8 rounded-lg'
    : isLarge
    ? 'h-11 w-11 rounded-xl'
    : 'h-10 w-10 rounded-xl';

  const startBtnSizeClass =
    extendedTaskbar.startButtonSize === 'small'
      ? 'h-8 w-8 rounded-lg'
      : extendedTaskbar.startButtonSize === 'large'
      ? 'h-11 w-11 rounded-xl'
      : btnSizeClass;

  const barHeightClass = isCompact ? 'h-10' : isLarge ? 'h-14' : 'h-12';
  const verticalWidthClass = isCompact ? 'w-11' : isLarge ? 'w-16' : 'w-13';

  // Build ordered visible apps using taskbarConfig.pinnedAppIds order
  const visibleApps = useMemo(() => {
    const appById = new Map(TASKBAR_APPS.map((a) => [a.id, a]));
    const ordered: TaskbarPinnedApp[] = [];
    const seen = new Set<string>();

    // Start button first if enabled
    const startApp = appById.get('start');
    if (startApp && extendedTaskbar.showStartButton) {
      ordered.push(startApp);
      seen.add('start');
    }

    // Then pinned apps in user's saved order
    for (const id of taskbarConfig.pinnedAppIds) {
      if (seen.has(id)) continue;
      const found = appById.get(id);
      if (found) {
        ordered.push(found);
        seen.add(id);
      }
    }

    // Ensure locked apps (like settings) and any currently open unpinned windows are visible
    for (const app of TASKBAR_APPS) {
      if (seen.has(app.id)) continue;
      if (app.id === 'start') continue;
      if (app.locked || (app.windowId && windows[app.windowId]?.isOpen)) {
        ordered.push(app);
        seen.add(app.id);
      }
    }

    return ordered;
  }, [taskbarConfig.pinnedAppIds, windows, extendedTaskbar.showStartButton]);

  const dockCustomStyle: React.CSSProperties = useMemo(() => {
    const alpha = Math.max(0.35, Math.min(0.98, extendedTaskbar.transparency / 100));
    const defaultBg =
      theme === 'dark' ? `rgba(24, 26, 34, ${alpha})` : `rgba(246, 248, 253, ${alpha})`;
    const customBg = extendedTaskbar.bgColor
      ? hexToRgba(extendedTaskbar.bgColor, alpha) || defaultBg
      : defaultBg;

    const blurPx = extendedTaskbar.acrylic ? 32 : extendedTaskbar.mica ? 18 : 0;
    const radiusPx = isFull
      ? undefined
      : isPill || extendedTaskbar.cornerStyle === 'pill'
      ? '9999px'
      : extendedTaskbar.cornerStyle === 'square'
      ? '4px'
      : '16px';

    return {
      backgroundColor: customBg,
      backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(180%)` : 'none',
      WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(180%)` : 'none',
      border: extendedTaskbar.showBorder ? '1px solid var(--win-border)' : 'none',
      boxShadow: extendedTaskbar.showShadow
        ? 'var(--win-shadow), var(--win-specular)'
        : 'none',
      ...(radiusPx ? { borderRadius: radiusPx } : {}),
    };
  }, [extendedTaskbar, theme, isFull, isPill]);

  const handleDropApp = (targetId: string) => {
    if (!draggedId || draggedId === targetId || targetId === 'start') return;
    const base = [...taskbarConfig.pinnedAppIds];
    if (!base.includes(draggedId)) base.push(draggedId);
    if (!base.includes(targetId)) base.push(targetId);
    const fromIdx = base.indexOf(draggedId);
    const toIdx = base.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    base.splice(fromIdx, 1);
    base.splice(toIdx, 0, draggedId);
    onReorderPinnedApps(base);
    setDraggedId(null);
  };

  const renderTaskbarIcon = (app: TaskbarPinnedApp) => {
    if (app.systemIcon === 'start') {
      const startPx =
        extendedTaskbar.startButtonSize === 'small'
          ? 18
          : extendedTaskbar.startButtonSize === 'large'
          ? 25
          : iconSize;
      if (extendedTaskbar.startIconStyle === 'minimal') {
        return <WindowsSystemIcon name="apps" size={startPx} className="text-[var(--win-accent)]" />;
      }
      if (extendedTaskbar.startIconStyle === 'classic') {
        return <WindowsLogo size={startPx} color="var(--win-accent)" />;
      }
      return <WindowsLogo size={startPx} color="fluent" />;
    }
    if (app.systemIcon) {
      return <FluentSystemIcon type={app.systemIcon} size={iconSize} />;
    }
    if (app.icon) {
      return <AppBrandIcon icon={app.icon} size={iconSize} />;
    }
    return null;
  };

  const renderSearchButton = () => {
    if (taskbarConfig.searchMode === 'hidden') return null;
    const showPillLabel =
      taskbarConfig.searchMode === 'pill' && !isVertical && !isCompact && !isPill;

    return (
      <button
        key="taskbar-search"
        type="button"
        title={copy.searchLabel}
        aria-label={copy.searchLabel}
        aria-pressed={isSearchOpen}
        onClick={onToggleSearch}
        className={`relative flex shrink-0 items-center justify-center transition-all duration-150 active:scale-92 ${
          showPillLabel
            ? 'h-9 gap-2 rounded-xl border border-black/8 bg-white/55 px-3 text-xs font-medium text-[var(--win-text-primary)] hover:bg-white/80 dark:border-white/12 dark:bg-white/8 dark:hover:bg-white/15'
            : btnSizeClass
        } ${
          isSearchOpen
            ? 'bg-white/75 ring-1 ring-[var(--win-accent)] dark:bg-white/18'
            : !showPillLabel
            ? 'hover:bg-white/55 dark:hover:bg-white/12'
            : ''
        }`}
      >
        <Search size={isCompact ? 15 : 16} className="text-[var(--win-accent)]" />
        {showPillLabel && (
          <span className="hidden text-[var(--win-text-secondary)] md:inline">
            {copy.searchLabel}
          </span>
        )}
      </button>
    );
  };

  const renderTaskViewButton = () => {
    if (!extendedTaskbar.showTaskView) return null;
    return (
      <button
        key="taskbar-taskview"
        type="button"
        title={`${language === 'vi' ? 'Chuyển Desktop' : 'Task View'} (${activeDesktopName})`}
        aria-label="Task View"
        onClick={onOpenTaskView}
        className={`relative flex shrink-0 items-center justify-center text-[var(--win-text-primary)] transition-all duration-150 hover:bg-white/55 active:scale-92 dark:hover:bg-white/12 ${btnSizeClass}`}
      >
        <WindowsSystemIcon name="taskView" size={isCompact ? 16 : 19} />
      </button>
    );
  };

  const renderAppButtons = (): React.ReactNode[] =>
    visibleApps.flatMap<React.ReactNode>((app) => {
      const winState = app.windowId ? windows[app.windowId] : undefined;
      const isOpen = winState?.isOpen ?? false;
      const isFocused = winState?.hasFocus && !winState?.isMinimized;
      const isMinimized = winState?.isMinimized ?? false;
      const showIndicator =
        taskbarConfig.showRunningIndicator &&
        app.windowId &&
        app.windowId !== 'startMenu' &&
        isOpen;
      const label = app.label[language];

      const indicatorPosClass =
        taskbarPosition === 'left'
          ? `left-[2px] top-1/2 -translate-y-1/2 w-[3px] ${isMinimized ? 'h-1.5' : 'h-4'}`
          : taskbarPosition === 'right'
          ? `right-[2px] top-1/2 -translate-y-1/2 w-[3px] ${isMinimized ? 'h-1.5' : 'h-4'}`
          : taskbarPosition === 'top'
          ? `top-[2px] left-1/2 -translate-x-1/2 h-[3px] ${isMinimized ? 'w-1.5' : 'w-4'}`
          : `bottom-[2px] left-1/2 -translate-x-1/2 h-[3px] ${isMinimized ? 'w-1.5' : 'w-4'}`;

      const showPreview = hoveredAppId === app.id && isOpen && app.windowId && app.windowId !== 'startMenu';
      const previewPosClass =
        taskbarPosition === 'top'
          ? 'top-full mt-2 left-1/2 -translate-x-1/2'
          : taskbarPosition === 'left'
          ? 'left-full ml-2 top-1/2 -translate-y-1/2'
          : taskbarPosition === 'right'
          ? 'right-full mr-2 top-1/2 -translate-y-1/2'
          : 'bottom-full mb-2 left-1/2 -translate-x-1/2';

      const btn = (
        <div
          key={app.id}
          className="relative shrink-0"
          onMouseEnter={() => setHoveredAppId(app.id)}
          onMouseLeave={() => setHoveredAppId((prev) => (prev === app.id ? null : prev))}
        >
          <button
            type="button"
            draggable={app.id !== 'start'}
            onDragStart={() => setDraggedId(app.id)}
            onDragOver={(e) => {
              if (app.id !== 'start') e.preventDefault();
            }}
            onDrop={() => handleDropApp(app.id)}
            onDragEnd={() => setDraggedId(null)}
            title={label}
            aria-label={label}
            onClick={() => {
              if (app.windowId) {
                onToggleWindow(app.windowId);
              } else {
                onAppLaunch(label);
              }
            }}
            className={`relative flex shrink-0 items-center justify-center transition-all duration-150 active:scale-92 ${
              app.id === 'start' ? startBtnSizeClass : btnSizeClass
            } ${draggedId === app.id ? 'opacity-45' : ''} ${
              isFocused
                ? 'bg-white/65 dark:bg-white/16'
                : isOpen
                ? 'bg-white/30 hover:bg-white/55 dark:bg-white/8 dark:hover:bg-white/14'
                : 'hover:bg-white/55 dark:hover:bg-white/12'
            }`}
          >
            {renderTaskbarIcon(app)}

            {showIndicator && (
              <span
                aria-hidden="true"
                className={`absolute rounded-full transition-all duration-200 ${indicatorPosClass} ${
                  isMinimized ? 'bg-[#777777] dark:bg-[#999999]' : 'bg-[var(--win-accent)]'
                }`}
              />
            )}
          </button>

          {/* Hover Window Preview Card */}
          {showPreview && app.windowId && (
            <div
              className={`win-acrylic absolute ${previewPosClass} z-[1060] hidden w-48 rounded-xl p-2.5 shadow-xl sm:block`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-bold text-[var(--win-text-primary)]">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseWindow(app.windowId!);
                  }}
                  aria-label="Close window"
                  className="rounded p-0.5 text-rose-500 hover:bg-rose-500/15"
                >
                  <WindowsSystemIcon name="close" size={12} />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px] text-[var(--win-text-secondary)]">
                <span>
                  {isMinimized
                    ? language === 'vi'
                      ? 'Đang thu nhỏ'
                      : 'Minimized'
                    : isFocused
                    ? language === 'vi'
                      ? 'Đang hoạt động'
                      : 'Active'
                    : language === 'vi'
                    ? 'Đang mở'
                    : 'Open'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMinimized || !isFocused) {
                      onToggleWindow(app.windowId!);
                    } else {
                      onMinimizeWindow(app.windowId!);
                    }
                  }}
                  className="rounded bg-black/6 px-1.5 py-0.5 font-semibold text-[var(--win-text-primary)] hover:bg-black/12 dark:bg-white/10"
                >
                  {isMinimized || !isFocused
                    ? language === 'vi'
                      ? 'Hiện'
                      : 'Focus'
                    : language === 'vi'
                    ? 'Thu nhỏ'
                    : 'Min'}
                </button>
              </div>
            </div>
          )}
        </div>
      );

      if (app.id === 'start') {
        const extras: React.ReactNode[] = [btn];
        const searchBtn = renderSearchButton();
        if (searchBtn) extras.push(searchBtn);
        const tvBtn = renderTaskViewButton();
        if (tvBtn) extras.push(tvBtn);
        return extras;
      }
      return [btn];
    });

  const hasSystemStatusIcons =
    extendedTaskbar.showWifi ||
    extendedTaskbar.showVolume ||
    extendedTaskbar.showBattery ||
    extendedTaskbar.showBluetooth;

  const hasTrayContent =
    taskbarConfig.showWeather ||
    taskbarConfig.showLanguageToggle ||
    taskbarConfig.showThemeToggle ||
    taskbarConfig.showClock ||
    hasSystemStatusIcons ||
    extendedTaskbar.showNotifications;

  const renderTrayControls = (vertical: boolean, compactMode: boolean) => {
    if (!hasTrayContent) return null;
    return (
      <div
        className={`relative flex items-center ${
          vertical ? 'flex-col gap-1.5' : 'flex-row gap-1'
        }`}
      >
        {taskbarConfig.showWeather && (
          <button
            type="button"
            onClick={() => onToggleWindow('weather')}
            className={`flex items-center justify-center rounded-xl text-xs font-semibold text-[var(--win-text-primary)] tabular-nums transition-colors hover:bg-white/50 dark:hover:bg-white/12 ${
              vertical
                ? 'h-9 w-9 flex-col gap-0.5 text-[10px]'
                : compactMode
                ? 'h-7 gap-1 px-1.5'
                : 'h-9 gap-1.5 px-2'
            }`}
            aria-label={`Weather ${WEATHER_DATA.taskbarTemp}`}
          >
            <FluentSystemIcon type="weather" size={vertical || compactMode ? 15 : 18} />
            {!vertical && <span>{WEATHER_DATA.taskbarTemp}</span>}
          </button>
        )}

        {/* Hidden Tray Chevron */}
        {!vertical && (
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHiddenTrayOpen((prev) => !prev);
              }}
              title={language === 'vi' ? 'Biểu tượng ẩn' : 'Hidden icons'}
              aria-label="Hidden tray icons"
              className="flex h-7 w-6 items-center justify-center rounded-lg text-[var(--win-text-primary)] hover:bg-white/50 dark:hover:bg-white/12"
            >
              <WindowsSystemIcon name="hiddenIcons" size={14} />
            </button>
            {hiddenTrayOpen && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="win-acrylic absolute right-0 bottom-10 z-[1060] flex w-48 flex-col gap-1 rounded-xl p-2 shadow-xl"
              >
                <div className="px-2 py-1 text-[10px] font-semibold text-[var(--win-text-secondary)]">
                  Desktop: {activeDesktopName}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHiddenTrayOpen(false);
                    onOpenTaskManager();
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium hover:bg-black/6 dark:hover:bg-white/10"
                >
                  <WindowsSystemIcon name="systemMonitor" size={15} />
                  <span>{UI_TEXT[language].apps.taskManagerTitle}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHiddenTrayOpen(false);
                    onOpenTaskbarSettings();
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium hover:bg-black/6 dark:hover:bg-white/10"
                >
                  <WindowsSystemIcon name="settings" size={15} />
                  <span>{copy.openTaskbarSettings}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {taskbarConfig.showLanguageToggle && (
          <button
            type="button"
            onClick={onToggleLanguage}
            title={copy.switchLanguage}
            aria-label={copy.switchLanguage}
            className={`flex items-center justify-center gap-1 rounded-xl text-xs font-semibold text-[var(--win-text-primary)] transition-colors hover:bg-white/50 dark:hover:bg-white/12 ${
              vertical ? 'h-8 w-9 text-[11px]' : compactMode ? 'h-7 px-1.5' : 'h-9 px-2'
            }`}
          >
            {!vertical && <Globe size={13} className="text-[var(--win-accent)]" />}
            <span>{language === 'vi' ? 'Vi' : 'En'}</span>
          </button>
        )}

        {taskbarConfig.showThemeToggle && (
          <button
            type="button"
            onClick={onToggleTheme}
            title={copy.toggleTheme}
            aria-label={copy.toggleTheme}
            className={`flex items-center justify-center rounded-xl text-[var(--win-text-primary)] transition-colors hover:bg-white/50 dark:hover:bg-white/12 ${
              vertical ? 'h-8 w-9' : compactMode ? 'h-7 w-7' : 'h-9 w-9'
            }`}
          >
            {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
          </button>
        )}

        {/* Quick Settings Cluster (Wi-Fi / Volume / Battery / Bluetooth) */}
        {hasSystemStatusIcons && (
          <button
            type="button"
            onClick={onOpenQuickSettings}
            title={language === 'vi' ? 'Cài đặt nhanh (Mô phỏng)' : 'Quick Settings (Sim)'}
            aria-label="Quick Settings"
            className={`flex items-center justify-center gap-1.5 rounded-xl text-[var(--win-text-primary)] transition-colors hover:bg-white/50 dark:hover:bg-white/12 ${
              vertical ? 'flex-col py-1.5 px-1.5' : compactMode ? 'h-7 px-1.5' : 'h-9 px-2'
            } ${isQuickSettingsOpen ? 'bg-white/65 ring-1 ring-[var(--win-accent)] dark:bg-white/15' : ''}`}
          >
            {extendedTaskbar.showWifi && (
              <WindowsSystemIcon
                name={quickSettings.airplaneMode ? 'airplane' : 'wifi'}
                active={quickSettings.wifi && !quickSettings.airplaneMode}
                size={15}
                className={
                  quickSettings.wifi && !quickSettings.airplaneMode
                    ? 'text-[var(--win-text-primary)]'
                    : 'opacity-45'
                }
              />
            )}
            {extendedTaskbar.showBluetooth && !vertical && (
              <WindowsSystemIcon
                name="bluetooth"
                active={quickSettings.bluetooth && !quickSettings.airplaneMode}
                size={14}
                className={
                  quickSettings.bluetooth && !quickSettings.airplaneMode
                    ? 'text-[var(--win-accent)]'
                    : 'opacity-40'
                }
              />
            )}
            {extendedTaskbar.showVolume && (
              <WindowsSystemIcon name="volume" size={15} />
            )}
            {extendedTaskbar.showBattery && (
              <WindowsSystemIcon
                name={quickSettings.batterySaver ? 'batterySaver' : 'battery'}
                size={15}
                className={quickSettings.batterySaver ? 'text-amber-500' : ''}
              />
            )}
          </button>
        )}

        {/* Clock & Notification Center Trigger */}
        {(taskbarConfig.showClock || extendedTaskbar.showNotifications) && !vertical && (
          <button
            type="button"
            onClick={onOpenNotifications}
            title={language === 'vi' ? 'Thông báo & Lịch' : 'Notifications & Calendar'}
            aria-label="Notifications and Clock"
            className={`relative flex items-center gap-1.5 rounded-xl px-1.5 py-1 text-right transition-colors hover:bg-white/50 sm:gap-2 sm:px-2 dark:hover:bg-white/12 ${
              isNotificationsOpen ? 'bg-white/65 ring-1 ring-[var(--win-accent)] dark:bg-white/15' : ''
            }`}
          >
            {taskbarConfig.showClock && (
              <div className="hidden text-[11px] leading-[1.2] text-[var(--win-text-primary)] tabular-nums sm:block">
                <div className="font-bold">{formatTime(now)}</div>
                {!compactMode && <div className="opacity-80">{formatDate(now, language)}</div>}
              </div>
            )}
            {extendedTaskbar.showNotifications && (
              <div className="relative flex items-center justify-center">
                <WindowsSystemIcon
                  name="notification"
                  active={unreadNotificationsCount > 0}
                  size={15}
                />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--win-accent-bright)] px-0.5 text-[9px] font-bold text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
            )}
          </button>
        )}

        {taskbarConfig.showClock && vertical && (
          <button
            type="button"
            onClick={onOpenNotifications}
            className="rounded-lg px-1 py-1 text-center text-[10px] font-bold leading-tight text-[var(--win-text-primary)] tabular-nums hover:bg-white/40"
          >
            <div>{formatTime(now).replace(' ', '')}</div>
          </button>
        )}

        {/* Windows Show Desktop thin edge */}
        {!vertical && (
          <button
            type="button"
            onClick={onShowDesktop}
            title={language === 'vi' ? 'Thu gọn tất cả về Desktop' : 'Show Desktop'}
            aria-label="Show Desktop"
            className="ml-0.5 hidden h-7 w-1.5 rounded-full bg-black/15 transition-colors hover:bg-[var(--win-accent)] sm:block dark:bg-white/20"
          />
        )}
      </div>
    );
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuOpen(true);
  };

  const renderContextMenuPopup = () => {
    if (!contextMenuOpen) return null;
    const posClass =
      taskbarPosition === 'top'
        ? 'top-14 left-1/2 -translate-x-1/2'
        : taskbarPosition === 'left'
        ? 'left-16 bottom-6'
        : taskbarPosition === 'right'
        ? 'right-16 bottom-6'
        : 'bottom-16 left-1/2 -translate-x-1/2';

    return (
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className={`win-acrylic fixed ${posClass} z-[1050] min-w-[205px] space-y-0.5 rounded-xl p-1.5 shadow-lg`}
      >
        <button
          type="button"
          onClick={() => {
            setContextMenuOpen(false);
            onOpenTaskbarSettings();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-[var(--win-text-primary)] whitespace-nowrap hover:bg-black/6 dark:hover:bg-white/10"
        >
          <WindowsSystemIcon name="taskbar" size={15} className="text-[var(--win-accent)]" />
          <span>{copy.openTaskbarSettings}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setContextMenuOpen(false);
            onOpenTaskManager();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-[var(--win-text-primary)] whitespace-nowrap hover:bg-black/6 dark:hover:bg-white/10"
        >
          <WindowsSystemIcon name="systemMonitor" size={15} className="text-[var(--win-accent)]" />
          <span>{UI_TEXT[language].apps.taskManagerTitle}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setContextMenuOpen(false);
            onShowDesktop();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-[var(--win-text-primary)] whitespace-nowrap hover:bg-black/6 dark:hover:bg-white/10"
        >
          <WindowsSystemIcon name="thisPc" size={15} className="text-[var(--win-accent)]" />
          <span>{language === 'vi' ? 'Hiện màn hình nền' : 'Show Desktop'}</span>
        </button>
      </div>
    );
  };

  const keepVisible =
    !taskbarConfig.autoHide ||
    windows.startMenu.isOpen ||
    isSearchOpen ||
    isQuickSettingsOpen ||
    isNotificationsOpen ||
    contextMenuOpen;

  const autoHideClass = keepVisible
    ? 'translate-x-0 translate-y-0 opacity-100'
    : taskbarPosition === 'top'
    ? '-translate-y-[calc(100%-6px)] hover:translate-y-0 focus-within:translate-y-0 opacity-40 hover:opacity-100'
    : taskbarPosition === 'left'
    ? '-translate-x-[calc(100%-6px)] hover:translate-x-0 focus-within:translate-x-0 opacity-40 hover:opacity-100'
    : taskbarPosition === 'right'
    ? 'translate-x-[calc(100%-6px)] hover:translate-x-0 focus-within:translate-x-0 opacity-40 hover:opacity-100'
    : 'translate-y-[calc(100%-6px)] hover:translate-y-0 focus-within:translate-y-0 opacity-40 hover:opacity-100';

  if (!isVertical) {
    const edgePosClass = taskbarPosition === 'top' ? 'top-0' : 'bottom-0';
    const floatOffsetClass =
      taskbarPosition === 'top'
        ? isCompact
          ? 'top-2'
          : 'top-3'
        : isCompact
        ? 'bottom-2'
        : 'bottom-3';

    if (isFull) {
      return (
        <>
          {renderContextMenuPopup()}
          <footer
            aria-label="Taskbar"
            onContextMenu={handleContextMenu}
            style={dockCustomStyle}
            className={`win-dock fixed inset-x-0 ${edgePosClass} z-[1000] flex ${barHeightClass} items-center justify-between rounded-none border-x-0 px-3 transition-all duration-200 select-none ${autoHideClass}`}
          >
            {taskbarConfig.alignment === 'center' && <div className="hidden w-40 lg:block" />}
            <div
              className={`no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto sm:gap-1 ${
                taskbarConfig.alignment === 'left' ? 'mr-auto' : ''
              }`}
            >
              {renderAppButtons()}
            </div>
            <div className="flex shrink-0 items-center">{renderTrayControls(false, isCompact)}</div>
          </footer>
        </>
      );
    }

    if (isPill) {
      return (
        <>
          {renderContextMenuPopup()}
          <footer
            aria-label="Taskbar"
            onContextMenu={handleContextMenu}
            className={`pointer-events-none fixed inset-x-0 ${floatOffsetClass} z-[1000] flex items-center justify-center px-2 transition-all duration-200 select-none sm:px-3 ${autoHideClass}`}
          >
            <div
              style={dockCustomStyle}
              className={`win-dock no-scrollbar pointer-events-auto flex ${barHeightClass} max-w-[calc(100vw-16px)] items-center gap-1 overflow-x-auto rounded-full px-2.5 sm:overflow-visible sm:px-3`}
            >
              {renderAppButtons()}
              {hasTrayContent && (
                <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-black/10 dark:bg-white/15" />
              )}
              {renderTrayControls(false, isCompact)}
            </div>
          </footer>
        </>
      );
    }

    return (
      <>
        {renderContextMenuPopup()}
        <footer
          aria-label="Taskbar"
          onContextMenu={handleContextMenu}
          className={`pointer-events-none fixed inset-x-0 ${floatOffsetClass} z-[1000] flex items-center justify-center px-2 transition-all duration-200 select-none sm:px-3 ${autoHideClass}`}
        >
          <div
            style={dockCustomStyle}
            className={`win-dock no-scrollbar pointer-events-auto flex max-w-[calc(100vw-16px)] items-center overflow-x-auto sm:overflow-visible ${barHeightClass} ${
              isCompact ? 'gap-0.5 px-1.5' : 'gap-0.5 px-2 sm:gap-1'
            }`}
          >
            {renderAppButtons()}

            {hasTrayContent && (
              <div className="ml-1 flex shrink-0 items-center gap-0.5 border-l border-black/10 pl-1 lg:hidden dark:border-white/15">
                {taskbarConfig.showLanguageToggle && (
                  <button
                    type="button"
                    onClick={onToggleLanguage}
                    title={copy.switchLanguage}
                    aria-label={copy.switchLanguage}
                    className="flex h-7 items-center justify-center rounded-lg px-1.5 text-xs font-bold text-[var(--win-text-primary)] hover:bg-white/50 dark:hover:bg-white/12"
                  >
                    {language === 'vi' ? 'Vi' : 'En'}
                  </button>
                )}
                {taskbarConfig.showThemeToggle && (
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    title={copy.toggleTheme}
                    aria-label={copy.toggleTheme}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--win-text-primary)] hover:bg-white/50 dark:hover:bg-white/12"
                  >
                    {theme === 'dark' ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} />}
                  </button>
                )}
                {hasSystemStatusIcons && (
                  <button
                    type="button"
                    onClick={onOpenQuickSettings}
                    title={language === 'vi' ? 'Cài đặt nhanh' : 'Quick Settings'}
                    aria-label="Quick Settings"
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-[var(--win-text-primary)] hover:bg-white/50 dark:hover:bg-white/12 ${
                      isQuickSettingsOpen ? 'bg-white/65 ring-1 ring-[var(--win-accent)] dark:bg-white/15' : ''
                    }`}
                  >
                    <WindowsSystemIcon
                      name={quickSettings.airplaneMode ? 'airplane' : 'wifi'}
                      active={quickSettings.wifi && !quickSettings.airplaneMode}
                      size={14}
                    />
                  </button>
                )}
                {(extendedTaskbar.showNotifications || taskbarConfig.showClock) && (
                  <button
                    type="button"
                    onClick={onOpenNotifications}
                    title={language === 'vi' ? 'Thông báo & Lịch' : 'Notifications & Calendar'}
                    aria-label="Notifications"
                    className={`relative flex h-7 w-7 items-center justify-center rounded-lg text-[var(--win-text-primary)] hover:bg-white/50 dark:hover:bg-white/12 ${
                      isNotificationsOpen ? 'bg-white/65 ring-1 ring-[var(--win-accent)] dark:bg-white/15' : ''
                    }`}
                  >
                    <WindowsSystemIcon
                      name="notification"
                      active={unreadNotificationsCount > 0}
                      size={14}
                    />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-[var(--win-accent-bright)]" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {hasTrayContent && (
            <div
              style={dockCustomStyle}
              className={`win-dock pointer-events-auto fixed right-3 ${floatOffsetClass} hidden items-center lg:flex ${barHeightClass} ${
                isCompact ? 'px-2' : 'px-2.5'
              }`}
            >
              {renderTrayControls(false, isCompact)}
            </div>
          )}
        </footer>
      </>
    );
  }

  // Vertical Taskbar (left or right)
  const sidePosClass = taskbarPosition === 'left' ? 'left-0' : 'right-0';
  const sideFloatClass =
    taskbarPosition === 'left'
      ? isCompact
        ? 'left-2'
        : 'left-3'
      : isCompact
      ? 'right-2'
      : 'right-3';

  if (isFull) {
    return (
      <>
        {renderContextMenuPopup()}
        <footer
          aria-label="Taskbar"
          onContextMenu={handleContextMenu}
          style={dockCustomStyle}
          className={`win-dock fixed inset-y-0 ${sidePosClass} z-[1000] flex ${verticalWidthClass} flex-col items-center justify-between rounded-none border-y-0 py-3 transition-all duration-200 select-none ${autoHideClass}`}
        >
          <div className="win-scrollbar flex max-h-[70dvh] flex-col items-center gap-1 overflow-y-auto">
            {renderAppButtons()}
          </div>
          <div className="shrink-0">{renderTrayControls(true, isCompact)}</div>
        </footer>
      </>
    );
  }

  if (isPill) {
    return (
      <>
        {renderContextMenuPopup()}
        <footer
          aria-label="Taskbar"
          onContextMenu={handleContextMenu}
          className={`pointer-events-none fixed inset-y-3 ${sideFloatClass} z-[1000] flex items-center transition-all duration-200 select-none ${autoHideClass}`}
        >
          <div
            style={dockCustomStyle}
            className="win-dock win-scrollbar pointer-events-auto flex max-h-full w-12 flex-col items-center gap-1.5 overflow-y-auto rounded-full py-3"
          >
            {renderAppButtons()}
            {hasTrayContent && (
              <span aria-hidden="true" className="my-0.5 h-px w-5 shrink-0 bg-black/10 dark:bg-white/15" />
            )}
            {renderTrayControls(true, true)}
          </div>
        </footer>
      </>
    );
  }

  return (
    <>
      {renderContextMenuPopup()}
      <footer
        aria-label="Taskbar"
        onContextMenu={handleContextMenu}
        className={`pointer-events-none fixed inset-y-3 ${sideFloatClass} z-[1000] flex flex-col items-center justify-between gap-2 transition-all duration-200 select-none ${autoHideClass}`}
      >
        <div className="hidden h-2 sm:block" />
        <div
          style={dockCustomStyle}
          className={`win-dock win-scrollbar pointer-events-auto flex max-h-[calc(100dvh-180px)] flex-col items-center overflow-y-auto ${verticalWidthClass} ${
            isCompact ? 'gap-0.5 py-1.5' : 'gap-1 py-2'
          }`}
        >
          {renderAppButtons()}
        </div>
        {hasTrayContent && (
          <div
            style={dockCustomStyle}
            className={`win-dock pointer-events-auto flex flex-col items-center ${verticalWidthClass} ${
              isCompact ? 'py-2' : 'py-2.5'
            }`}
          >
            {renderTrayControls(true, isCompact)}
          </div>
        )}
      </footer>
    </>
  );
};
