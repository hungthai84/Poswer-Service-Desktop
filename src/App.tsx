/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LANGUAGE_STORAGE_KEY,
  LanguageId,
  TASKBAR_APPS,
  UI_TEXT,
  WindowId,
} from './data/desktopData';
import {
  DEFAULT_TASKBAR_CONFIG,
  FONT_OPTIONS,
  FONT_STORAGE_KEY,
  FontId,
  START_MENU_STYLE_OPTIONS,
  START_MENU_STYLE_STORAGE_KEY,
  StartMenuStyleId,
  TASKBAR_CONFIG_STORAGE_KEY,
  TASKBAR_POS_STORAGE_KEY,
  TASKBAR_STYLE_STORAGE_KEY,
  TaskbarConfig,
  TaskbarPositionId,
  TaskbarStyleId,
} from './data/customization';
import { THEME_STORAGE_KEY, ThemeId, THEMES } from './data/themes';
import {
  AppearanceConfig,
  BUILTIN_WALLPAPERS,
  CustomThemePreset,
  DEFAULT_APPEARANCE,
  DEFAULT_DESKTOP_LAYOUT,
  DEFAULT_DESKTOP_SHORTCUTS,
  DEFAULT_DESKTOP_WIDGETS,
  DEFAULT_EXTENDED_TASKBAR,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_QUICK_SETTINGS,
  DEFAULT_START_MENU_PREFS,
  DEFAULT_VIRTUAL_DESKTOPS,
  DesktopLayoutConfig,
  DesktopNotification,
  DesktopShortcutItem,
  DesktopWidgetInstance,
  ExtendedTaskbarPrefs,
  OS_CONFIG_SCHEMA_VERSION,
  OS_CONFIG_STORAGE_KEY,
  QuickSettingsState,
  SavedWindowBounds,
  StartMenuPrefs,
  ThemeModePreference,
  VirtualDesktop,
  WIDGET_CATALOG,
  WallpaperFitMode,
  WallpaperPreset,
  WidgetType,
  WindowBoundsMap,
  WindowDesktopMap,
} from './data/osConfig';
import {
  deleteCustomWallpaper,
  loadCustomWallpapers,
  saveCustomWallpaper,
} from './utils/wallpaperDb';
import { Win11Wallpaper } from './components/Win11Wallpaper';
import { DesktopSurface } from './components/DesktopSurface';
import { DesktopWidgetsLayer } from './components/DesktopWidgetsLayer';
import { WidgetLibraryDrawer } from './components/WidgetLibraryDrawer';
import { WelcomeWindow } from './components/WelcomeWindow';
import { WeatherWindow } from './components/WeatherWindow';
import { SettingsWindow } from './components/SettingsWindow';
import { NotesWindow } from './components/NotesWindow';
import { CalculatorWindow } from './components/CalculatorWindow';
import { PaintWindow } from './components/PaintWindow';
import { ExplorerWindow } from './components/ExplorerWindow';
import { TaskManagerWindow } from './components/TaskManagerWindow';
import { StartMenu } from './components/StartMenu';
import { SearchPanel } from './components/SearchPanel';
import { QuickSettingsPanel } from './components/QuickSettingsPanel';
import { NotificationCenter } from './components/NotificationCenter';
import { TaskViewOverlay } from './components/TaskViewOverlay';
import { AltTabOverlay, RunDialog } from './components/DesktopOverlays';
import { Taskbar, WindowStateItem } from './components/Taskbar';
import { ShutdownScreen } from './components/ShutdownScreen';
import { LoginScreen } from './components/LoginScreen';
import { useViewport } from './hooks/useViewport';

const INITIAL_WINDOWS: Record<WindowId, WindowStateItem> = {
  welcome: { id: 'welcome', isOpen: false, isMinimized: false, hasFocus: false },
  settings: { id: 'settings', isOpen: false, isMinimized: false, hasFocus: false },
  weather: { id: 'weather', isOpen: false, isMinimized: false, hasFocus: false },
  startMenu: { id: 'startMenu', isOpen: false, isMinimized: false, hasFocus: false },
  notes: { id: 'notes', isOpen: false, isMinimized: false, hasFocus: false },
  calculator: { id: 'calculator', isOpen: false, isMinimized: false, hasFocus: false },
  paint: { id: 'paint', isOpen: false, isMinimized: false, hasFocus: false },
  explorer: { id: 'explorer', isOpen: false, isMinimized: false, hasFocus: false },
  taskManager: { id: 'taskManager', isOpen: false, isMinimized: false, hasFocus: false },
};

interface PersistedOSConfig {
  schemaVersion: number;
  themeMode: ThemeModePreference;
  appearance: AppearanceConfig;
  customThemes: CustomThemePreset[];
  activeWallpaperId: string;
  wallpaperFitMode: WallpaperFitMode;
  favoriteWallpapers: string[];
  urlWallpapers: WallpaperPreset[];
  desktopShortcuts: DesktopShortcutItem[];
  desktopLayout: DesktopLayoutConfig;
  widgets: DesktopWidgetInstance[];
  virtualDesktops: VirtualDesktop[];
  activeDesktopId: string;
  extendedTaskbar: ExtendedTaskbarPrefs;
  startMenuPrefs: StartMenuPrefs;
  quickSettings: QuickSettingsState;
  windowBounds: WindowBoundsMap;
  displayNameOverride: string;
}

const DEFAULT_PERSISTED_OS_CONFIG: PersistedOSConfig = {
  schemaVersion: OS_CONFIG_SCHEMA_VERSION,
  themeMode: 'light',
  appearance: DEFAULT_APPEARANCE,
  customThemes: [],
  activeWallpaperId: 'win11-bloom',
  wallpaperFitMode: 'fill',
  favoriteWallpapers: ['win11-bloom'],
  urlWallpapers: [],
  desktopShortcuts: DEFAULT_DESKTOP_SHORTCUTS,
  desktopLayout: DEFAULT_DESKTOP_LAYOUT,
  widgets: DEFAULT_DESKTOP_WIDGETS,
  virtualDesktops: DEFAULT_VIRTUAL_DESKTOPS,
  activeDesktopId: 'desktop-1',
  extendedTaskbar: DEFAULT_EXTENDED_TASKBAR,
  startMenuPrefs: DEFAULT_START_MENU_PREFS,
  quickSettings: DEFAULT_QUICK_SETTINGS,
  windowBounds: {},
  displayNameOverride: '',
};

function loadInitialOSConfig(): PersistedOSConfig {
  try {
    const raw = localStorage.getItem(OS_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED_OS_CONFIG;
    const parsed = JSON.parse(raw) as Partial<PersistedOSConfig>;
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PERSISTED_OS_CONFIG;
    return {
      ...DEFAULT_PERSISTED_OS_CONFIG,
      ...parsed,
      schemaVersion: OS_CONFIG_SCHEMA_VERSION,
      appearance: { ...DEFAULT_APPEARANCE, ...(parsed.appearance ?? {}) },
      desktopLayout: { ...DEFAULT_DESKTOP_LAYOUT, ...(parsed.desktopLayout ?? {}) },
      extendedTaskbar: { ...DEFAULT_EXTENDED_TASKBAR, ...(parsed.extendedTaskbar ?? {}) },
      startMenuPrefs: { ...DEFAULT_START_MENU_PREFS, ...(parsed.startMenuPrefs ?? {}) },
      quickSettings: { ...DEFAULT_QUICK_SETTINGS, ...(parsed.quickSettings ?? {}) },
      desktopShortcuts:
        Array.isArray(parsed.desktopShortcuts) && parsed.desktopShortcuts.length > 0
          ? parsed.desktopShortcuts
          : DEFAULT_DESKTOP_SHORTCUTS,
      widgets: Array.isArray(parsed.widgets) ? parsed.widgets : DEFAULT_DESKTOP_WIDGETS,
      virtualDesktops:
        Array.isArray(parsed.virtualDesktops) && parsed.virtualDesktops.length > 0
          ? parsed.virtualDesktops
          : DEFAULT_VIRTUAL_DESKTOPS,
      urlWallpapers: Array.isArray(parsed.urlWallpapers) ? parsed.urlWallpapers : [],
      customThemes: Array.isArray(parsed.customThemes) ? parsed.customThemes : [],
      favoriteWallpapers: Array.isArray(parsed.favoriteWallpapers)
        ? parsed.favoriteWallpapers
        : ['win11-bloom'],
      windowBounds: parsed.windowBounds ?? {},
    };
  } catch {
    return DEFAULT_PERSISTED_OS_CONFIG;
  }
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

export default function App() {
  const viewport = useViewport();
  const [osConfig, setOsConfig] = useState<PersistedOSConfig>(() => loadInitialOSConfig());
  const [uploadedWallpapers, setUploadedWallpapers] = useState<WallpaperPreset[]>([]);

  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore storage read error
    }
    return 'light';
  });

  const [language, setLanguage] = useState<LanguageId>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'vi' || saved === 'en') return saved;
    } catch {
      // Ignore storage read error
    }
    return 'vi';
  });

  const [fontId, setFontId] = useState<FontId>(() => {
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY) as FontId | null;
      if (saved && FONT_OPTIONS.some((f) => f.id === saved)) return saved;
    } catch {
      // Ignore storage read error
    }
    return 'play';
  });

  const [taskbarStyle, setTaskbarStyle] = useState<TaskbarStyleId>(() => {
    try {
      const saved = localStorage.getItem(TASKBAR_STYLE_STORAGE_KEY) as TaskbarStyleId | null;
      if (saved === 'floating' || saved === 'full' || saved === 'pill' || saved === 'compact') {
        return saved;
      }
    } catch {
      // Ignore storage read error
    }
    return 'floating';
  });

  const [taskbarPosition, setTaskbarPosition] = useState<TaskbarPositionId>(() => {
    try {
      const saved = localStorage.getItem(TASKBAR_POS_STORAGE_KEY) as TaskbarPositionId | null;
      if (saved === 'bottom' || saved === 'top' || saved === 'left' || saved === 'right') {
        return saved;
      }
    } catch {
      // Ignore storage read error
    }
    return 'bottom';
  });

  const [startMenuStyle, setStartMenuStyle] = useState<StartMenuStyleId>(() => {
    try {
      const saved = localStorage.getItem(START_MENU_STYLE_STORAGE_KEY) as StartMenuStyleId | null;
      if (saved && START_MENU_STYLE_OPTIONS.some((s) => s.id === saved)) return saved;
    } catch {
      // Ignore storage read error
    }
    return 'classic';
  });

  const [taskbarConfig, setTaskbarConfig] = useState<TaskbarConfig>(() => {
    try {
      const saved = localStorage.getItem(TASKBAR_CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_TASKBAR_CONFIG, ...(JSON.parse(saved) as Partial<TaskbarConfig>) };
      }
    } catch {
      // Ignore storage read error
    }
    return DEFAULT_TASKBAR_CONFIG;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [windows, setWindows] = useState<Record<WindowId, WindowStateItem>>(INITIAL_WINDOWS);
  const [windowStack, setWindowStack] = useState<WindowId[]>([]);
  const [windowDesktopMap, setWindowDesktopMap] = useState<WindowDesktopMap>({});
  const [explorerPath, setExplorerPath] = useState<string>('This PC');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [isWidgetDrawerOpen, setIsWidgetDrawerOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [altTabState, setAltTabState] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  const [notifications, setNotifications] = useState<DesktopNotification[]>(DEFAULT_NOTIFICATIONS);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('personalization');
  const [isSleeping, setIsSleeping] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate uploaded binary wallpapers from IndexedDB
  useEffect(() => {
    let active = true;
    loadCustomWallpapers().then((records) => {
      if (!active) return;
      const mapped: WallpaperPreset[] = records.map((rec) => ({
        id: rec.id,
        name: { vi: rec.name, en: rec.name },
        category: 'personal',
        kind: 'image',
        value: rec.dataUrl,
        previewBg: `url("${rec.dataUrl}") center/cover no-repeat`,
        isCustom: true,
      }));
      setUploadedWallpapers(mapped);
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist unified OS config
  useEffect(() => {
    try {
      localStorage.setItem(OS_CONFIG_STORAGE_KEY, JSON.stringify(osConfig));
    } catch {
      // Ignore storage quota error
    }
  }, [osConfig]);

  // System Dark/Light auto tracking when themeMode === 'system'
  useEffect(() => {
    if (osConfig.themeMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setTheme(mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [osConfig.themeMode]);

  // Apply Dark class & Dynamic Fluent CSS Variables globally
  useEffect(() => {
    const isDark = THEMES[theme].isDark;
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('reduce-motion', !osConfig.appearance.motionEnabled);

    const app = osConfig.appearance;
    const accent = app.accentColor || (isDark ? '#60cdff' : '#0067c0');
    root.style.setProperty('--win-accent', accent);
    root.style.setProperty('--win-accent-bright', accent);
    root.style.setProperty('--win-radius', `${app.borderRadius}px`);

    const blurVal = app.acrylicEnabled ? (app.micaEnabled ? 32 : 24) : app.micaEnabled ? 14 : 0;
    root.style.setProperty('--win-blur', `${blurVal}px`);

    const alpha = Math.max(0.4, Math.min(0.96, app.transparency / 100));
    if (app.windowSurfaceColor) {
      const rgba = hexToRgba(app.windowSurfaceColor, alpha);
      if (rgba) root.style.setProperty('--win-surface', rgba);
    } else {
      root.style.setProperty(
        '--win-surface',
        isDark ? `rgba(26, 28, 36, ${alpha})` : `rgba(246, 248, 252, ${alpha})`
      );
    }

    if (app.taskbarBgColor) {
      const rgba = hexToRgba(app.taskbarBgColor, alpha);
      if (rgba) root.style.setProperty('--win-taskbar-bg', rgba);
    } else {
      root.style.removeProperty('--win-taskbar-bg');
    }

    const shadowMap = {
      soft: '0 10px 26px -6px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(15, 23, 42, 0.06)',
      medium: isDark
        ? '0 24px 54px -8px rgba(0, 0, 0, 0.58), 0 4px 16px rgba(0, 0, 0, 0.35)'
        : '0 20px 48px -8px rgba(15, 23, 42, 0.22), 0 4px 14px rgba(15, 23, 42, 0.08)',
      deep: isDark
        ? '0 32px 72px -6px rgba(0, 0, 0, 0.78), 0 8px 24px rgba(0, 0, 0, 0.45)'
        : '0 30px 64px -6px rgba(15, 23, 42, 0.36), 0 8px 22px rgba(15, 23, 42, 0.14)',
    };
    root.style.setProperty('--win-shadow', shadowMap[app.shadowIntensity]);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write error
    }
  }, [theme, osConfig.appearance]);

  // Dynamic Responsive Root UI Scale (--win-root-size)
  useEffect(() => {
    const mode = osConfig.appearance.uiScale ?? 'auto';
    let rootPx = '16px';
    if (mode === 'compact') {
      rootPx = '14.5px';
    } else if (mode === 'default') {
      rootPx = '16px';
    } else if (mode === 'comfortable') {
      rootPx = '17.5px';
    } else {
      if (viewport.width < 400) rootPx = '14.5px';
      else if (viewport.width < 640) rootPx = '15px';
      else if (viewport.width >= 1536) rootPx = '17px';
      else rootPx = '16px';
    }
    document.documentElement.style.setProperty('--win-root-size', rootPx);
  }, [osConfig.appearance.uiScale, viewport.width]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage write error
    }
  }, [language]);

  useEffect(() => {
    const selectedFont = FONT_OPTIONS.find((f) => f.id === fontId) ?? FONT_OPTIONS[0];
    document.documentElement.style.setProperty('--win-font-family', selectedFont.fontFamily);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, fontId);
    } catch {
      // Ignore storage write error
    }
  }, [fontId]);

  useEffect(() => {
    try {
      localStorage.setItem(TASKBAR_STYLE_STORAGE_KEY, taskbarStyle);
    } catch {
      // Ignore storage write error
    }
  }, [taskbarStyle]);

  useEffect(() => {
    try {
      localStorage.setItem(TASKBAR_POS_STORAGE_KEY, taskbarPosition);
    } catch {
      // Ignore storage write error
    }
  }, [taskbarPosition]);

  useEffect(() => {
    try {
      localStorage.setItem(START_MENU_STYLE_STORAGE_KEY, startMenuStyle);
    } catch {
      // Ignore storage write error
    }
  }, [startMenuStyle]);

  useEffect(() => {
    try {
      localStorage.setItem(TASKBAR_CONFIG_STORAGE_KEY, JSON.stringify(taskbarConfig));
    } catch {
      // Ignore storage write error
    }
  }, [taskbarConfig]);

  const handleUpdateTaskbarConfig = useCallback((patch: Partial<TaskbarConfig>) => {
    setTaskbarConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const dismissFlyouts = useCallback(() => {
    setIsSearchOpen(false);
    setIsQuickSettingsOpen(false);
    setIsNotificationsOpen(false);
    setWindows((prev) =>
      prev.startMenu.isOpen
        ? { ...prev, startMenu: { ...prev.startMenu, isOpen: false, hasFocus: false } }
        : prev
    );
  }, []);

  const syncFocusFromStack = useCallback(
    (
      nextStack: WindowId[],
      updater: (prev: Record<WindowId, WindowStateItem>) => Record<WindowId, WindowStateItem>
    ) => {
      setWindows((prev) => {
        const updated = updater(prev);
        const topId = nextStack[nextStack.length - 1];
        const result = { ...updated };
        (Object.keys(result) as WindowId[]).forEach((key) => {
          result[key] = { ...result[key], hasFocus: key === topId };
        });
        return result;
      });
    },
    []
  );

  const focusWindow = useCallback(
    (id: WindowId) => {
      setIsSearchOpen(false);
      setIsQuickSettingsOpen(false);
      setIsNotificationsOpen(false);
      setIsTaskViewOpen(false);

      if (id !== 'startMenu') {
        setWindowDesktopMap((prev) => ({
          ...prev,
          [id]: osConfig.activeDesktopId,
        }));
      }

      setWindowStack((prevStack) => {
        const nextStack: WindowId[] = [
          ...prevStack.filter((item) => item !== id && item !== 'startMenu'),
          id,
        ];
        syncFocusFromStack(nextStack, (prev) => ({
          ...prev,
          startMenu: { ...prev.startMenu, isOpen: false, isMinimized: false },
          [id]: { ...prev[id], isOpen: true, isMinimized: false },
        }));
        return nextStack;
      });
    },
    [syncFocusFromStack, osConfig.activeDesktopId]
  );

  const closeWindow = useCallback(
    (id: WindowId) => {
      setWindowStack((prevStack) => {
        const nextStack = prevStack.filter((item) => item !== id);
        syncFocusFromStack(nextStack, (prev) => ({
          ...prev,
          [id]: { ...prev[id], isOpen: false, isMinimized: false },
        }));
        return nextStack;
      });
    },
    [syncFocusFromStack]
  );

  const minimizeWindow = useCallback(
    (id: WindowId) => {
      setWindowStack((prevStack) => {
        const nextStack = prevStack.filter((item) => item !== id);
        syncFocusFromStack(nextStack, (prev) => ({
          ...prev,
          [id]: { ...prev[id], isOpen: true, isMinimized: true },
        }));
        return nextStack;
      });
    },
    [syncFocusFromStack]
  );

  const toggleWindowFromTaskbar = useCallback(
    (id: WindowId) => {
      setIsSearchOpen(false);
      setIsQuickSettingsOpen(false);
      setIsNotificationsOpen(false);
      setIsTaskViewOpen(false);

      if (id === 'startMenu') {
        const isCurrentlyOpen = windows.startMenu.isOpen;
        if (isCurrentlyOpen) {
          closeWindow('startMenu');
        } else {
          setWindowStack((prevStack) => {
            const nextStack: WindowId[] = [
              ...prevStack.filter((item) => item !== 'startMenu'),
              'startMenu',
            ];
            syncFocusFromStack(nextStack, (prev) => ({
              ...prev,
              startMenu: { ...prev.startMenu, isOpen: true, isMinimized: false },
            }));
            return nextStack;
          });
        }
        return;
      }

      const target = windows[id];
      const targetDesktop = windowDesktopMap[id] ?? osConfig.activeDesktopId;
      if (!target.isOpen || target.isMinimized || targetDesktop !== osConfig.activeDesktopId) {
        focusWindow(id);
      } else if (target.hasFocus) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [
      windows,
      windowDesktopMap,
      osConfig.activeDesktopId,
      closeWindow,
      focusWindow,
      minimizeWindow,
      syncFocusFromStack,
    ]
  );

  const handleToggleSearch = useCallback(() => {
    setIsQuickSettingsOpen(false);
    setIsNotificationsOpen(false);
    setIsTaskViewOpen(false);
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (next && windows.startMenu.isOpen) {
        closeWindow('startMenu');
      }
      return next;
    });
  }, [windows.startMenu.isOpen, closeWindow]);

  const handleOpenSettingsTab = useCallback(
    (tabId: string) => {
      setActiveSettingsTab(tabId);
      focusWindow('settings');
    },
    [focusWindow]
  );

  const handleAppLaunch = useCallback(
    (appName: string) => {
      setToastMessage(UI_TEXT[language].taskbar.openingApp(appName));
    },
    [language]
  );

  const handleShowDesktop = useCallback(() => {
    dismissFlyouts();
    setIsTaskViewOpen(false);
    const anyVisible = (Object.values(windows) as WindowStateItem[]).some(
      (w) =>
        w.id !== 'startMenu' &&
        w.isOpen &&
        !w.isMinimized &&
        (windowDesktopMap[w.id] ?? osConfig.activeDesktopId) === osConfig.activeDesktopId
    );
    if (anyVisible) {
      setWindows((prev) => {
        const next = { ...prev };
        (Object.keys(next) as WindowId[]).forEach((k) => {
          if (k !== 'startMenu' && next[k].isOpen) {
            next[k] = { ...next[k], isMinimized: true, hasFocus: false };
          }
        });
        return next;
      });
    } else {
      setWindows((prev) => {
        const next = { ...prev };
        (Object.keys(next) as WindowId[]).forEach((k) => {
          if (k !== 'startMenu' && next[k].isOpen) {
            next[k] = { ...next[k], isMinimized: false };
          }
        });
        return next;
      });
    }
  }, [dismissFlyouts, windows, windowDesktopMap, osConfig.activeDesktopId]);

  // Wallpaper handlers
  const allWallpapers = useMemo(
    () => [...BUILTIN_WALLPAPERS, ...osConfig.urlWallpapers, ...uploadedWallpapers],
    [osConfig.urlWallpapers, uploadedWallpapers]
  );

  const activeDesktop = useMemo(
    () =>
      osConfig.virtualDesktops.find((d) => d.id === osConfig.activeDesktopId) ??
      osConfig.virtualDesktops[0],
    [osConfig.virtualDesktops, osConfig.activeDesktopId]
  );

  const effectiveWallpaperId = activeDesktop?.wallpaperId || osConfig.activeWallpaperId;
  const activeWallpaper = useMemo(
    () => allWallpapers.find((w) => w.id === effectiveWallpaperId) ?? allWallpapers[0],
    [allWallpapers, effectiveWallpaperId]
  );

  const handleSelectWallpaper = useCallback((wallpaperId: string, desktopOnly = false) => {
    setOsConfig((prev) => {
      if (desktopOnly) {
        return {
          ...prev,
          virtualDesktops: prev.virtualDesktops.map((d) =>
            d.id === prev.activeDesktopId ? { ...d, wallpaperId } : d
          ),
        };
      }
      return {
        ...prev,
        activeWallpaperId: wallpaperId,
        virtualDesktops: prev.virtualDesktops.map((d) =>
          d.id === prev.activeDesktopId ? { ...d, wallpaperId: undefined } : d
        ),
      };
    });
  }, []);

  const handleUploadWallpaper = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        if (!dataUrl) return;
        const id = `wp-upload-${Date.now()}`;
        const cleanName = file.name.replace(/\.[^.]+$/, '') || 'Personal Wallpaper';
        try {
          await saveCustomWallpaper({
            id,
            name: cleanName,
            dataUrl,
            createdAt: Date.now(),
          });
        } catch {
          // Even if IndexedDB is blocked, keep in memory for current session
        }
        const preset: WallpaperPreset = {
          id,
          name: { vi: cleanName, en: cleanName },
          category: 'personal',
          kind: 'image',
          value: dataUrl,
          previewBg: `url("${dataUrl}") center/cover no-repeat`,
          isCustom: true,
        };
        setUploadedWallpapers((prev) => [...prev, preset]);
        handleSelectWallpaper(id, false);
        setToastMessage(
          language === 'vi'
            ? `Đã lưu & áp dụng hình nền "${cleanName}"`
            : `Saved & applied "${cleanName}"`
        );
      };
      reader.readAsDataURL(file);
    },
    [handleSelectWallpaper, language]
  );

  const handleAddWallpaperUrl = useCallback(
    (url: string, name: string) => {
      if (!/^https?:\/\//i.test(url) && !/^data:image\//i.test(url)) {
        setToastMessage(
          language === 'vi'
            ? 'URL hình nền phải bắt đầu bằng https:// hoặc http://'
            : 'Wallpaper URL must start with https:// or http://'
        );
        return;
      }
      const id = `wp-url-${Date.now()}`;
      const label = name || (language === 'vi' ? 'Ảnh URL cá nhân' : 'Custom URL Image');
      const preset: WallpaperPreset = {
        id,
        name: { vi: label, en: label },
        category: 'personal',
        kind: 'image',
        value: url,
        previewBg: `url("${url}") center/cover no-repeat`,
        isCustom: true,
      };
      setOsConfig((prev) => ({
        ...prev,
        urlWallpapers: [...prev.urlWallpapers, preset],
        activeWallpaperId: id,
      }));
    },
    [language]
  );

  const handleDeleteCustomWallpaper = useCallback(
    async (wallpaperId: string) => {
      if (wallpaperId.startsWith('wp-upload-')) {
        await deleteCustomWallpaper(wallpaperId).catch(() => undefined);
        setUploadedWallpapers((prev) => prev.filter((w) => w.id !== wallpaperId));
      }
      setOsConfig((prev) => ({
        ...prev,
        urlWallpapers: prev.urlWallpapers.filter((w) => w.id !== wallpaperId),
        favoriteWallpapers: prev.favoriteWallpapers.filter((id) => id !== wallpaperId),
        activeWallpaperId:
          prev.activeWallpaperId === wallpaperId ? 'win11-bloom' : prev.activeWallpaperId,
      }));
    },
    []
  );

  // Desktop Widgets handlers
  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      const meta = WIDGET_CATALOG.find((c) => c.type === type);
      if (!meta) return;
      setOsConfig((prev) => {
        const current = prev.widgets.filter((w) => w.desktopId === prev.activeDesktopId);
        const maxZ = current.reduce((acc, w) => Math.max(acc, w.zOrder), 0);
        const offset = (current.length % 5) * 32;
        const instance: DesktopWidgetInstance = {
          id: `w-${type}-${Date.now()}`,
          type,
          desktopId: prev.activeDesktopId,
          x: Math.max(
            12,
            Math.min(window.innerWidth - meta.defaultSize.width - 16, 260 + offset)
          ),
          y: 36 + offset,
          width: meta.defaultSize.width,
          height: meta.defaultSize.height,
          zOrder: maxZ + 1,
          collapsed: false,
          locked: false,
          alwaysOnTop: false,
          visible: true,
          style: {
            visualStyle: 'acrylic',
            borderRadius: 18,
            opacity: 82,
            blur: 24,
            shadow: true,
            fontSize: 'md',
            textColor: '',
            accentColor: '',
            solidBgColor: '#1e293b',
          },
        };
        return { ...prev, widgets: [...prev.widgets, instance] };
      });
    },
    []
  );

  const handleAutoArrangeWidgets = useCallback(() => {
    setOsConfig((prev) => {
      const startX = window.innerWidth < 768 ? 16 : 250;
      let cursorX = startX;
      let cursorY = 28;
      let colWidth = 0;
      const maxH = Math.max(400, window.innerHeight - 130);
      const arranged = prev.widgets.map((w) => {
        if (w.desktopId !== prev.activeDesktopId || !w.visible) return w;
        if (cursorY + w.height > maxH && cursorY > 30) {
          cursorX = Math.min(cursorX + colWidth + 18, Math.max(16, window.innerWidth - w.width - 16));
          cursorY = 28;
          colWidth = 0;
        }
        const safeX = Math.max(12, Math.min(cursorX, Math.max(12, window.innerWidth - w.width - 12)));
        const nextW = { ...w, x: safeX, y: cursorY };
        cursorY += w.height + 16;
        colWidth = Math.max(colWidth, w.width);
        return nextW;
      });
      return { ...prev, widgets: arranged };
    });
  }, []);

  const handleBoundsChange = useCallback((id: WindowId, bounds: SavedWindowBounds) => {
    setOsConfig((prev) => ({
      ...prev,
      windowBounds: { ...prev.windowBounds, [id]: bounds },
    }));
  }, []);

  // Open Shortcut from DesktopSurface
  const handleOpenDesktopShortcut = useCallback(
    (item: DesktopShortcutItem) => {
      if (item.targetWindow === 'explorer') {
        setExplorerPath(item.explorerPath ?? 'This PC');
        focusWindow('explorer');
        return;
      }
      if (item.targetWindow) {
        if (item.targetWindow === 'startMenu') {
          toggleWindowFromTaskbar('startMenu');
        } else {
          focusWindow(item.targetWindow);
        }
        return;
      }
      handleAppLaunch(item.label[language]);
    },
    [focusWindow, toggleWindowFromTaskbar, handleAppLaunch, language]
  );

  // Virtual Desktop actions
  const handleAddVirtualDesktop = useCallback(() => {
    setOsConfig((prev) => {
      const idx = prev.virtualDesktops.length + 1;
      const newId = `desktop-${Date.now()}`;
      return {
        ...prev,
        virtualDesktops: [
          ...prev.virtualDesktops,
          { id: newId, name: `Desktop ${idx}` },
        ],
        activeDesktopId: newId,
      };
    });
  }, []);

  const handleDeleteVirtualDesktop = useCallback((id: string) => {
    setOsConfig((prev) => {
      if (prev.virtualDesktops.length <= 1) return prev;
      const remaining = prev.virtualDesktops.filter((d) => d.id !== id);
      const nextActive = prev.activeDesktopId === id ? remaining[0].id : prev.activeDesktopId;
      return {
        ...prev,
        virtualDesktops: remaining,
        activeDesktopId: nextActive,
        widgets: prev.widgets.map((w) =>
          w.desktopId === id ? { ...w, desktopId: remaining[0].id } : w
        ),
      };
    });
  }, []);

  // Power Simulation handlers
  const handleRestartSim = useCallback(() => {
    dismissFlyouts();
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
      setIsAuthenticated(false);
    }, 1500);
  }, [dismissFlyouts]);

  // Run Dialog command handler
  const handleRunCommand = useCallback(
    (cmd: string) => {
      const c = cmd.toLowerCase().trim();
      if (c === 'calc' || c === 'calculator') {
        focusWindow('calculator');
      } else if (c === 'mspaint' || c === 'paint') {
        focusWindow('paint');
      } else if (c === 'notepad' || c === 'notes') {
        focusWindow('notes');
      } else if (c === 'explorer') {
        setExplorerPath('This PC');
        focusWindow('explorer');
      } else if (c === 'ms-settings:' || c === 'settings') {
        focusWindow('settings');
      } else if (c === 'taskmgr' || c === 'taskmanager') {
        focusWindow('taskManager');
      } else {
        setToastMessage(
          language === 'vi'
            ? `Không tìm thấy lệnh "${cmd}". Thử: calc, mspaint, notepad, explorer, taskmgr`
            : `Command "${cmd}" not recognized. Try: calc, mspaint, notepad, explorer, taskmgr`
        );
      }
    },
    [focusWindow, language]
  );

  // Backup / Export / Import / Reset
  const handleExportConfig = useCallback(() => {
    const payload = {
      ...osConfig,
      theme,
      language,
      fontId,
      taskbarStyle,
      taskbarPosition,
      taskbarConfig,
      startMenuStyle,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `windows-desktop-config-v${OS_CONFIG_SCHEMA_VERSION}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage(
      language === 'vi' ? 'Đã xuất tệp cấu hình JSON.' : 'Exported JSON configuration.'
    );
  }, [osConfig, theme, language, fontId, taskbarStyle, taskbarPosition, taskbarConfig, startMenuStyle]);

  const handleImportConfig = useCallback(
    (jsonText: string): { ok: boolean; message: string } => {
      try {
        const parsed = JSON.parse(jsonText) as Record<string, unknown>;
        if (!parsed || typeof parsed !== 'object' || parsed.schemaVersion !== OS_CONFIG_SCHEMA_VERSION) {
          return {
            ok: false,
            message:
              language === 'vi'
                ? 'Tệp JSON không đúng cấu trúc schemaVersion = 2.'
                : 'Invalid JSON schema (expected schemaVersion = 2).',
          };
        }
        setOsConfig((prev) => ({
          ...prev,
          ...(parsed as Partial<PersistedOSConfig>),
          appearance: {
            ...DEFAULT_APPEARANCE,
            ...((parsed.appearance as Partial<AppearanceConfig>) ?? {}),
          },
          desktopLayout: {
            ...DEFAULT_DESKTOP_LAYOUT,
            ...((parsed.desktopLayout as Partial<DesktopLayoutConfig>) ?? {}),
          },
          extendedTaskbar: {
            ...DEFAULT_EXTENDED_TASKBAR,
            ...((parsed.extendedTaskbar as Partial<ExtendedTaskbarPrefs>) ?? {}),
          },
          startMenuPrefs: {
            ...DEFAULT_START_MENU_PREFS,
            ...((parsed.startMenuPrefs as Partial<StartMenuPrefs>) ?? {}),
          },
          quickSettings: {
            ...DEFAULT_QUICK_SETTINGS,
            ...((parsed.quickSettings as Partial<QuickSettingsState>) ?? {}),
          },
        }));
        if (parsed.theme === 'light' || parsed.theme === 'dark') setTheme(parsed.theme);
        if (parsed.language === 'vi' || parsed.language === 'en') setLanguage(parsed.language);
        if (typeof parsed.fontId === 'string' && FONT_OPTIONS.some((f) => f.id === parsed.fontId)) {
          setFontId(parsed.fontId as FontId);
        }
        if (
          parsed.taskbarStyle === 'floating' ||
          parsed.taskbarStyle === 'full' ||
          parsed.taskbarStyle === 'pill' ||
          parsed.taskbarStyle === 'compact'
        ) {
          setTaskbarStyle(parsed.taskbarStyle);
        }
        if (
          parsed.taskbarPosition === 'bottom' ||
          parsed.taskbarPosition === 'top' ||
          parsed.taskbarPosition === 'left' ||
          parsed.taskbarPosition === 'right'
        ) {
          setTaskbarPosition(parsed.taskbarPosition);
        }
        if (parsed.taskbarConfig && typeof parsed.taskbarConfig === 'object') {
          setTaskbarConfig({ ...DEFAULT_TASKBAR_CONFIG, ...(parsed.taskbarConfig as Partial<TaskbarConfig>) });
        }
        if (
          typeof parsed.startMenuStyle === 'string' &&
          START_MENU_STYLE_OPTIONS.some((s) => s.id === parsed.startMenuStyle)
        ) {
          setStartMenuStyle(parsed.startMenuStyle as StartMenuStyleId);
        }
        return {
          ok: true,
          message:
            language === 'vi'
              ? 'Đã khôi phục toàn bộ cấu hình thành công!'
              : 'Configuration restored successfully!',
        };
      } catch {
        return {
          ok: false,
          message:
            language === 'vi'
              ? 'Không thể đọc tệp JSON. Vui lòng kiểm tra định dạng.'
              : 'Failed to parse JSON file.',
        };
      }
    },
    [language]
  );

  const handleResetAllConfig = useCallback(() => {
    setOsConfig(DEFAULT_PERSISTED_OS_CONFIG);
    setTheme('light');
    setFontId('play');
    setTaskbarStyle('floating');
    setTaskbarPosition('bottom');
    setTaskbarConfig(DEFAULT_TASKBAR_CONFIG);
    setStartMenuStyle('classic');
    setToastMessage(
      language === 'vi'
        ? 'Đã khôi phục toàn bộ cài đặt về mặc định.'
        : 'All settings restored to defaults.'
    );
  }, [language]);

  // Safe Keyboard Shortcuts
  useEffect(() => {
    if (!isAuthenticated || isShutDown || isSleeping || isRestarting) return;

    const openList = (Object.values(windows) as WindowStateItem[]).filter(
      (w) =>
        w.isOpen &&
        w.id !== 'startMenu' &&
        (windowDesktopMap[w.id] ?? osConfig.activeDesktopId) === osConfig.activeDesktopId
    );

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === 'Escape') {
        if (altTabState.open) setAltTabState({ open: false, index: 0 });
        else if (isRunDialogOpen) setIsRunDialogOpen(false);
        else if (isTaskViewOpen) setIsTaskViewOpen(false);
        else if (isWidgetDrawerOpen) setIsWidgetDrawerOpen(false);
        else dismissFlyouts();
        return;
      }

      if (isTyping) return;

      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        setAltTabState((prev) => ({
          open: true,
          index: openList.length > 0 ? (prev.open ? (prev.index + 1) % openList.length : 0) : 0,
        }));
        return;
      }

      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        const focused = openList.find((w) => w.hasFocus) ?? openList[0];
        if (focused) closeWindow(focused.id);
        return;
      }

      if (e.altKey && e.shiftKey) {
        const k = e.key.toLowerCase();
        if (k === 'e') {
          e.preventDefault();
          setExplorerPath('This PC');
          focusWindow('explorer');
        } else if (k === 'i') {
          e.preventDefault();
          focusWindow('settings');
        } else if (k === 'd') {
          e.preventDefault();
          handleShowDesktop();
        } else if (k === 'l') {
          e.preventDefault();
          dismissFlyouts();
          setIsAuthenticated(false);
        } else if (k === 'r') {
          e.preventDefault();
          setIsRunDialogOpen(true);
        } else if (k === 'w') {
          e.preventDefault();
          setIsWidgetDrawerOpen((p) => !p);
        } else if (k === 'v') {
          e.preventDefault();
          setIsTaskViewOpen((p) => !p);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (altTabState.open && e.key === 'Alt') {
        const picked = openList[altTabState.index];
        setAltTabState({ open: false, index: 0 });
        if (picked) focusWindow(picked.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    isAuthenticated,
    isShutDown,
    isSleeping,
    isRestarting,
    windows,
    windowDesktopMap,
    osConfig.activeDesktopId,
    altTabState,
    isRunDialogOpen,
    isTaskViewOpen,
    isWidgetDrawerOpen,
    dismissFlyouts,
    closeWindow,
    focusWindow,
    handleShowDesktop,
  ]);

  const getZIndex = (id: WindowId): number => {
    const idx = windowStack.indexOf(id);
    return idx === -1 ? 10 : 10 + idx * 10;
  };

  const isWindowVisibleOnCurrentDesktop = (id: WindowId): boolean =>
    windows[id].isOpen && (windowDesktopMap[id] ?? osConfig.activeDesktopId) === osConfig.activeDesktopId;

  const activeDesktopWidgets = useMemo(
    () => osConfig.widgets.filter((w) => w.desktopId === osConfig.activeDesktopId),
    [osConfig.widgets, osConfig.activeDesktopId]
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const openAltTabWindows = useMemo(
    () =>
      (Object.values(windows) as WindowStateItem[]).filter(
        (w) =>
          w.isOpen &&
          w.id !== 'startMenu' &&
          (windowDesktopMap[w.id] ?? osConfig.activeDesktopId) === osConfig.activeDesktopId
      ),
    [windows, windowDesktopMap, osConfig.activeDesktopId]
  );

  const toastPositionClass =
    taskbarPosition === 'top'
      ? 'top-18 right-4'
      : taskbarPosition === 'right'
      ? 'bottom-4 right-20'
      : 'bottom-18 right-4';

  const brightnessOpacity = Math.max(0, (100 - osConfig.quickSettings.brightness) / 135);

  return (
    <main
      className={`relative h-[100dvh] w-screen overflow-hidden ${
        osConfig.quickSettings.accessibilityHighContrast ? 'contrast-125 saturate-110' : ''
      }`}
      style={{
        backgroundColor:
          osConfig.appearance.desktopBgColor || THEMES[theme].desktopBgFallback,
      }}
      onPointerDown={(e) => {
        const el = e.target as HTMLElement | null;
        if (e.target === e.currentTarget || el?.dataset?.desktopSurface === 'true') {
          dismissFlyouts();
        }
      }}
    >
      {/* Dynamic Desktop Wallpaper */}
      <Win11Wallpaper
        theme={theme}
        wallpaper={activeWallpaper}
        fitMode={osConfig.wallpaperFitMode}
        customBgColor={osConfig.appearance.desktopBgColor}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* Login / Lock Screen */}
      <AnimatePresence>
        {!isAuthenticated && (
          <LoginScreen
            theme={theme}
            language={language}
            onLoginSuccess={() => setIsAuthenticated(true)}
            onToggleTheme={() => {
              const next = theme === 'light' ? 'dark' : 'light';
              setOsConfig((p) => ({ ...p, themeMode: next }));
              setTheme(next);
            }}
            onToggleLanguage={() => setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))}
            onShutdown={() => setIsShutDown(true)}
          />
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <>
          {/* Desktop Surface (Icons & Context Menu) */}
          <DesktopSurface
            language={language}
            shortcuts={osConfig.desktopShortcuts}
            layout={osConfig.desktopLayout}
            taskbarPosition={taskbarPosition}
            onUpdateShortcuts={(next) =>
              setOsConfig((prev) => ({ ...prev, desktopShortcuts: next }))
            }
            onUpdateLayout={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                desktopLayout: { ...prev.desktopLayout, ...patch },
              }))
            }
            onOpenShortcut={handleOpenDesktopShortcut}
            onOpenSettingsTab={handleOpenSettingsTab}
            onOpenWidgetLibrary={() => setIsWidgetDrawerOpen(true)}
            onCreateDesktopNote={() => handleAddWidget('notes')}
            onPinToTaskbar={(winId) => {
              const found = TASKBAR_APPS.find((a) => a.windowId === winId);
              if (!found) return;
              setTaskbarConfig((prev) =>
                prev.pinnedAppIds.includes(found.id)
                  ? prev
                  : { ...prev, pinnedAppIds: [...prev.pinnedAppIds, found.id] }
              );
              setToastMessage(
                language === 'vi'
                  ? `Đã ghim ${found.label.vi} lên Taskbar`
                  : `Pinned ${found.label.en} to Taskbar`
              );
            }}
            onRefreshDesktop={() =>
              setToastMessage(
                language === 'vi' ? 'Đã làm mới màn hình Desktop' : 'Desktop refreshed'
              )
            }
          />

          {/* 16 Interactive Desktop Widgets Layer */}
          <DesktopWidgetsLayer
            language={language}
            widgets={activeDesktopWidgets}
            visible={osConfig.desktopLayout.showWidgets}
            snapToGrid={osConfig.desktopLayout.widgetSnapToGrid}
            quickSettingsBatterySaver={osConfig.quickSettings.batterySaver}
            onUpdateWidget={(id, patch) =>
              setOsConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
              }))
            }
            onRemoveWidget={(id) =>
              setOsConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.filter((w) => w.id !== id),
              }))
            }
            onBringForward={(id) =>
              setOsConfig((prev) => {
                const maxZ = prev.widgets.reduce((m, w) => Math.max(m, w.zOrder), 1);
                return {
                  ...prev,
                  widgets: prev.widgets.map((w) =>
                    w.id === id ? { ...w, zOrder: maxZ + 1 } : w
                  ),
                };
              })
            }
            onSendBackward={(id) =>
              setOsConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.map((w) =>
                  w.id === id ? { ...w, zOrder: Math.max(1, w.zOrder - 1) } : w
                ),
              }))
            }
            onResetWidget={(id) =>
              setOsConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.map((w) => {
                  if (w.id !== id) return w;
                  const meta = WIDGET_CATALOG.find((c) => c.type === w.type);
                  return {
                    ...w,
                    width: meta?.defaultSize.width ?? w.width,
                    height: meta?.defaultSize.height ?? w.height,
                    collapsed: false,
                    locked: false,
                    alwaysOnTop: false,
                  };
                }),
              }))
            }
            onOpenWindow={focusWindow}
          />

          {/* Welcome Window */}
          <WelcomeWindow
            isOpen={isWindowVisibleOnCurrentDesktop('welcome')}
            isMinimized={windows.welcome.isMinimized}
            zIndex={getZIndex('welcome')}
            theme={theme}
            language={language}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
          />

          {/* Weather Window */}
          <WeatherWindow
            isOpen={isWindowVisibleOnCurrentDesktop('weather')}
            isMinimized={windows.weather.isMinimized}
            zIndex={getZIndex('weather')}
            language={language}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
          />

          {/* File Explorer Window */}
          <ExplorerWindow
            isOpen={isWindowVisibleOnCurrentDesktop('explorer')}
            isMinimized={windows.explorer.isMinimized}
            zIndex={getZIndex('explorer')}
            language={language}
            initialPath={explorerPath}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
            onOpenWindow={focusWindow}
            onSelectWallpaper={(wpId) => {
              handleSelectWallpaper(wpId, false);
              setToastMessage(
                language === 'vi' ? 'Đã đặt làm hình nền Desktop' : 'Set as Desktop wallpaper'
              );
            }}
          />

          {/* Task Manager Window */}
          <TaskManagerWindow
            isOpen={isWindowVisibleOnCurrentDesktop('taskManager')}
            isMinimized={windows.taskManager.isMinimized}
            zIndex={getZIndex('taskManager')}
            language={language}
            windows={windows}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
            onEndTask={closeWindow}
          />

          {/* Settings Window Hub */}
          <SettingsWindow
            isOpen={isWindowVisibleOnCurrentDesktop('settings')}
            isMinimized={windows.settings.isMinimized}
            zIndex={getZIndex('settings')}
            savedBounds={osConfig.windowBounds.settings}
            theme={theme}
            themeMode={osConfig.themeMode}
            language={language}
            fontId={fontId}
            taskbarStyle={taskbarStyle}
            taskbarPosition={taskbarPosition}
            taskbarConfig={taskbarConfig}
            extendedTaskbar={osConfig.extendedTaskbar}
            startMenuStyle={startMenuStyle}
            startMenuPrefs={osConfig.startMenuPrefs}
            appearance={osConfig.appearance}
            customThemes={osConfig.customThemes}
            wallpapers={allWallpapers}
            activeWallpaperId={effectiveWallpaperId}
            wallpaperFitMode={osConfig.wallpaperFitMode}
            favoriteWallpapers={osConfig.favoriteWallpapers}
            desktops={osConfig.virtualDesktops}
            activeDesktopId={osConfig.activeDesktopId}
            desktopLayout={osConfig.desktopLayout}
            widgets={osConfig.widgets}
            quickSettings={osConfig.quickSettings}
            displayNameOverride={osConfig.displayNameOverride}
            activeTab={activeSettingsTab}
            onSelectTab={setActiveSettingsTab}
            onSetTheme={setTheme}
            onSetThemeMode={(mode) => {
              setOsConfig((prev) => ({ ...prev, themeMode: mode }));
              if (mode === 'light' || mode === 'dark') setTheme(mode);
            }}
            onSetLanguage={setLanguage}
            onSetFont={setFontId}
            onSetTaskbarStyle={setTaskbarStyle}
            onSetTaskbarPosition={setTaskbarPosition}
            onUpdateTaskbarConfig={handleUpdateTaskbarConfig}
            onUpdateExtendedTaskbar={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                extendedTaskbar: { ...prev.extendedTaskbar, ...patch },
              }))
            }
            onSetStartMenuStyle={setStartMenuStyle}
            onUpdateStartMenuPrefs={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                startMenuPrefs: { ...prev.startMenuPrefs, ...patch },
              }))
            }
            onUpdateAppearance={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                appearance: { ...prev.appearance, ...patch },
              }))
            }
            onSaveCustomTheme={(name) =>
              setOsConfig((prev) => ({
                ...prev,
                customThemes: [
                  ...prev.customThemes,
                  {
                    id: `theme-${Date.now()}`,
                    name,
                    baseIsDark: theme === 'dark',
                    appearance: { ...prev.appearance },
                  },
                ],
              }))
            }
            onApplyCustomTheme={(preset) => {
              setTheme(preset.baseIsDark ? 'dark' : 'light');
              setOsConfig((prev) => ({
                ...prev,
                themeMode: 'custom',
                appearance: { ...preset.appearance },
              }));
            }}
            onRenameCustomTheme={(id, name) =>
              setOsConfig((prev) => ({
                ...prev,
                customThemes: prev.customThemes.map((t) =>
                  t.id === id ? { ...t, name } : t
                ),
              }))
            }
            onDeleteCustomTheme={(id) =>
              setOsConfig((prev) => ({
                ...prev,
                customThemes: prev.customThemes.filter((t) => t.id !== id),
              }))
            }
            onSelectWallpaper={handleSelectWallpaper}
            onSetWallpaperFitMode={(mode) =>
              setOsConfig((prev) => ({ ...prev, wallpaperFitMode: mode }))
            }
            onToggleFavoriteWallpaper={(wpId) =>
              setOsConfig((prev) => ({
                ...prev,
                favoriteWallpapers: prev.favoriteWallpapers.includes(wpId)
                  ? prev.favoriteWallpapers.filter((x) => x !== wpId)
                  : [...prev.favoriteWallpapers, wpId],
              }))
            }
            onUploadWallpaper={handleUploadWallpaper}
            onAddWallpaperUrl={handleAddWallpaperUrl}
            onDeleteCustomWallpaper={handleDeleteCustomWallpaper}
            onUpdateDesktopLayout={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                desktopLayout: { ...prev.desktopLayout, ...patch },
              }))
            }
            onResetDesktopShortcuts={() =>
              setOsConfig((prev) => ({
                ...prev,
                desktopShortcuts: DEFAULT_DESKTOP_SHORTCUTS,
              }))
            }
            onOpenWidgetLibrary={() => setIsWidgetDrawerOpen(true)}
            onAutoArrangeWidgets={handleAutoArrangeWidgets}
            onResetWidgets={() =>
              setOsConfig((prev) => ({ ...prev, widgets: DEFAULT_DESKTOP_WIDGETS }))
            }
            onUpdateWidget={(id, patch) =>
              setOsConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
              }))
            }
            onRemoveWidget={(id) =>
              setOsConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.filter((w) => w.id !== id),
              }))
            }
            onUpdateQuickSettings={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                quickSettings: { ...prev.quickSettings, ...patch },
              }))
            }
            onSetDisplayNameOverride={(name) =>
              setOsConfig((prev) => ({ ...prev, displayNameOverride: name }))
            }
            onOpenWindow={focusWindow}
            onLock={() => {
              dismissFlyouts();
              setIsAuthenticated(false);
            }}
            onExportConfig={handleExportConfig}
            onImportConfig={handleImportConfig}
            onResetAllConfig={handleResetAllConfig}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
            onBoundsChange={handleBoundsChange}
          />

          {/* Notes App */}
          <NotesWindow
            isOpen={isWindowVisibleOnCurrentDesktop('notes')}
            isMinimized={windows.notes.isMinimized}
            zIndex={getZIndex('notes')}
            language={language}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
          />

          {/* Calculator App */}
          <CalculatorWindow
            isOpen={isWindowVisibleOnCurrentDesktop('calculator')}
            isMinimized={windows.calculator.isMinimized}
            zIndex={getZIndex('calculator')}
            language={language}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
          />

          {/* Paint App */}
          <PaintWindow
            isOpen={isWindowVisibleOnCurrentDesktop('paint')}
            isMinimized={windows.paint.isMinimized}
            zIndex={getZIndex('paint')}
            language={language}
            taskbarPosition={taskbarPosition}
            taskbarStyle={taskbarStyle}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
          />

          {/* Start Menu (4 Templates + Drag-to-Reorder + Search + Power Menu) */}
          <StartMenu
            isOpen={windows.startMenu.isOpen}
            zIndex={Math.max(getZIndex('startMenu'), 500)}
            language={language}
            taskbarPosition={taskbarPosition}
            startMenuStyle={startMenuStyle}
            startMenuPrefs={osConfig.startMenuPrefs}
            displayName={osConfig.displayNameOverride}
            onSetStartMenuStyle={setStartMenuStyle}
            onUpdateStartMenuPrefs={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                startMenuPrefs: { ...prev.startMenuPrefs, ...patch },
              }))
            }
            onClose={() => closeWindow('startMenu')}
            onLock={() => {
              dismissFlyouts();
              setIsAuthenticated(false);
            }}
            onSleep={() => {
              dismissFlyouts();
              setIsSleeping(true);
            }}
            onRestartSim={handleRestartSim}
            onShutdown={() => setIsShutDown(true)}
            onOpenWindow={focusWindow}
            onOpenSearch={() => {
              closeWindow('startMenu');
              setIsSearchOpen(true);
            }}
            onAppLaunch={handleAppLaunch}
          />

          {/* Taskbar Search Flyout */}
          <SearchPanel
            isOpen={isSearchOpen}
            zIndex={520}
            language={language}
            taskbarPosition={taskbarPosition}
            onClose={() => setIsSearchOpen(false)}
            onOpenWindow={focusWindow}
            onOpenSettingsTab={handleOpenSettingsTab}
            onAppLaunch={handleAppLaunch}
          />

          {/* Quick Settings Panel */}
          <QuickSettingsPanel
            isOpen={isQuickSettingsOpen}
            language={language}
            theme={theme}
            taskbarPosition={taskbarPosition}
            state={osConfig.quickSettings}
            onUpdate={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                quickSettings: { ...prev.quickSettings, ...patch },
              }))
            }
            onToggleTheme={() => {
              const next = theme === 'light' ? 'dark' : 'light';
              setOsConfig((p) => ({ ...p, themeMode: next }));
              setTheme(next);
            }}
            onOpenSettings={() => {
              setIsQuickSettingsOpen(false);
              handleOpenSettingsTab('system');
            }}
            onClose={() => setIsQuickSettingsOpen(false)}
          />

          {/* Notification Center & Monthly Calendar */}
          <NotificationCenter
            isOpen={isNotificationsOpen}
            language={language}
            taskbarPosition={taskbarPosition}
            notifications={notifications}
            onMarkRead={(id) =>
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              )
            }
            onDelete={(id) =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
            onClearAll={() => setNotifications([])}
            onOpenNotificationSettings={() => {
              setIsNotificationsOpen(false);
              handleOpenSettingsTab('system');
            }}
            onClose={() => setIsNotificationsOpen(false)}
          />

          {/* Widget Library Drawer */}
          <WidgetLibraryDrawer
            isOpen={isWidgetDrawerOpen}
            language={language}
            layout={osConfig.desktopLayout}
            onAddWidget={handleAddWidget}
            onAutoArrangeWidgets={handleAutoArrangeWidgets}
            onUpdateLayout={(patch) =>
              setOsConfig((prev) => ({
                ...prev,
                desktopLayout: { ...prev.desktopLayout, ...patch },
              }))
            }
            onClose={() => setIsWidgetDrawerOpen(false)}
          />

          {/* Virtual Desktop & Task View Overlay */}
          <TaskViewOverlay
            isOpen={isTaskViewOpen}
            language={language}
            desktops={osConfig.virtualDesktops}
            activeDesktopId={osConfig.activeDesktopId}
            windows={windows}
            windowDesktopMap={windowDesktopMap}
            onSelectDesktop={(id) => {
              setOsConfig((prev) => ({ ...prev, activeDesktopId: id }));
              setIsTaskViewOpen(false);
            }}
            onAddDesktop={handleAddVirtualDesktop}
            onRenameDesktop={(id, name) =>
              setOsConfig((prev) => ({
                ...prev,
                virtualDesktops: prev.virtualDesktops.map((d) =>
                  d.id === id ? { ...d, name } : d
                ),
              }))
            }
            onDeleteDesktop={handleDeleteVirtualDesktop}
            onMoveWindowToDesktop={(winId, destId) =>
              setWindowDesktopMap((prev) => ({ ...prev, [winId]: destId }))
            }
            onFocusWindow={(winId) => {
              const targetDesktop = windowDesktopMap[winId];
              if (targetDesktop && targetDesktop !== osConfig.activeDesktopId) {
                setOsConfig((prev) => ({ ...prev, activeDesktopId: targetDesktop }));
              }
              focusWindow(winId);
            }}
            onClose={() => setIsTaskViewOpen(false)}
          />

          {/* Alt + Tab & Run Dialog Overlays */}
          <AltTabOverlay
            isOpen={altTabState.open}
            language={language}
            windows={openAltTabWindows}
            selectedIndex={altTabState.index}
            onSelectWindow={(id) => {
              setAltTabState({ open: false, index: 0 });
              focusWindow(id);
            }}
            onClose={() => setAltTabState({ open: false, index: 0 })}
          />

          <RunDialog
            isOpen={isRunDialogOpen}
            language={language}
            onExecute={handleRunCommand}
            onClose={() => setIsRunDialogOpen(false)}
          />

          {/* Launch Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className={`win-acrylic fixed z-[1100] rounded-xl px-4 py-2.5 text-xs font-medium text-[var(--win-text-primary)] ${toastPositionClass}`}
                role="status"
              >
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Windows 12 Customizable Taskbar */}
          <Taskbar
            windows={windows}
            theme={theme}
            language={language}
            taskbarStyle={taskbarStyle}
            taskbarPosition={taskbarPosition}
            taskbarConfig={taskbarConfig}
            extendedTaskbar={osConfig.extendedTaskbar}
            quickSettings={osConfig.quickSettings}
            activeDesktopName={activeDesktop?.name ?? 'Work'}
            unreadNotificationsCount={unreadNotificationsCount}
            isSearchOpen={isSearchOpen}
            isQuickSettingsOpen={isQuickSettingsOpen}
            isNotificationsOpen={isNotificationsOpen}
            onToggleWindow={toggleWindowFromTaskbar}
            onMinimizeWindow={minimizeWindow}
            onCloseWindow={closeWindow}
            onToggleSearch={handleToggleSearch}
            onToggleTheme={() => {
              const next = theme === 'light' ? 'dark' : 'light';
              setOsConfig((p) => ({ ...p, themeMode: next }));
              setTheme(next);
            }}
            onToggleLanguage={() => setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))}
            onOpenTaskbarSettings={() => handleOpenSettingsTab('taskbar')}
            onOpenQuickSettings={() => {
              setIsSearchOpen(false);
              setIsNotificationsOpen(false);
              closeWindow('startMenu');
              setIsQuickSettingsOpen((p) => !p);
            }}
            onOpenNotifications={() => {
              setIsSearchOpen(false);
              setIsQuickSettingsOpen(false);
              closeWindow('startMenu');
              setIsNotificationsOpen((p) => !p);
            }}
            onOpenTaskView={() => {
              dismissFlyouts();
              setIsTaskViewOpen((p) => !p);
            }}
            onOpenTaskManager={() => focusWindow('taskManager')}
            onShowDesktop={handleShowDesktop}
            onReorderPinnedApps={(nextIds) =>
              setTaskbarConfig((prev) => ({ ...prev, pinnedAppIds: nextIds }))
            }
            onAppLaunch={handleAppLaunch}
          />
        </>
      )}

      {/* Night Light & Brightness Hardware-Simulation Screen Overlays */}
      {osConfig.quickSettings.nightLight && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1900] bg-amber-500/18 mix-blend-multiply"
        />
      )}
      {brightnessOpacity > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1901] bg-black"
          style={{ opacity: brightnessOpacity }}
        />
      )}

      {/* Sleep Simulation Overlay */}
      <AnimatePresence>
        {isSleeping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSleeping(false)}
            className="fixed inset-0 z-[2100] flex cursor-pointer flex-col items-center justify-center bg-black/95 text-white select-none"
          >
            <div className="text-sm font-semibold opacity-80">
              {language === 'vi'
                ? 'Windows đang ở chế độ Ngủ (Mô phỏng)'
                : 'Windows is sleeping (Simulation)'}
            </div>
            <div className="mt-2 text-xs opacity-50">
              {language === 'vi' ? 'Nhấn vào màn hình để đánh thức' : 'Click anywhere to wake up'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restart Simulation Overlay */}
      <AnimatePresence>
        {isRestarting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2200] flex flex-col items-center justify-center bg-slate-950/95 text-white select-none"
          >
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-white/25 border-t-sky-400" />
            <div className="mt-4 text-sm font-semibold">
              {language === 'vi'
                ? 'Đang khởi động lại (Mô phỏng)...'
                : 'Restarting (Simulation)...'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shutdown Screen */}
      <ShutdownScreen
        isShutDown={isShutDown}
        language={language}
        onRestart={() => {
          setIsShutDown(false);
          dismissFlyouts();
          setIsAuthenticated(false);
        }}
      />
    </main>
  );
}
