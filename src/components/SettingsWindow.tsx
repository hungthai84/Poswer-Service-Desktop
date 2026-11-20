import React, { useRef, useState } from 'react';
import {
  Accessibility,
  AppWindow,
  ArrowDown,
  ArrowUp,
  Bluetooth,
  Check,
  Clock,
  Download,
  Gamepad2,
  Globe,
  Heart,
  Image as ImageIcon,
  Languages,
  LayoutGrid,
  LayoutPanelTop,
  Lock,
  Monitor,
  Paintbrush,
  Palette,
  PanelBottom,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Type,
  Upload,
  User,
} from 'lucide-react';
import { WindowFrame } from './WindowFrame';
import { AppBrandIcon, FluentSystemIcon, UserAvatar, WindowsLogo } from './FluentIcons';
import { Win11Wallpaper } from './Win11Wallpaper';
import {
  LanguageId,
  PERSONALIZATION_OPTIONS,
  PersonalizationOption,
  SETTINGS_NAV_ITEMS,
  SettingsNavItem,
  TASKBAR_APPS,
  UI_TEXT,
  USER_PROFILE,
  WindowId,
} from '../data/desktopData';
import {
  DEFAULT_TASKBAR_CONFIG,
  FONT_OPTIONS,
  FontId,
  START_MENU_STYLE_OPTIONS,
  StartMenuStyleId,
  TASKBAR_POSITION_OPTIONS,
  TASKBAR_STYLE_OPTIONS,
  TaskbarConfig,
  TaskbarPositionId,
  TaskbarSearchModeId,
  TaskbarStyleId,
} from '../data/customization';
import { THEME_LIST, ThemeId } from '../data/themes';
import {
  ACCENT_PRESETS,
  AppearanceConfig,
  CustomThemePreset,
  DEFAULT_APPEARANCE,
  DEFAULT_EXTENDED_TASKBAR,
  DesktopLayoutConfig,
  DesktopWidgetInstance,
  ExtendedTaskbarPrefs,
  QuickSettingsState,
  SavedWindowBounds,
  StartMenuPrefs,
  ThemeModePreference,
  UiScaleMode,
  VirtualDesktop,
  WALLPAPER_CATEGORIES,
  WALLPAPER_FIT_MODES,
  WallpaperCategory,
  WallpaperFitMode,
  WallpaperPreset,
  WIDGET_CATALOG,
} from '../data/osConfig';
import { useViewport } from '../hooks/useViewport';

interface SettingsWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  savedBounds?: SavedWindowBounds;
  theme: ThemeId;
  themeMode: ThemeModePreference;
  language: LanguageId;
  fontId: FontId;
  taskbarStyle: TaskbarStyleId;
  taskbarPosition: TaskbarPositionId;
  taskbarConfig: TaskbarConfig;
  extendedTaskbar: ExtendedTaskbarPrefs;
  startMenuStyle: StartMenuStyleId;
  startMenuPrefs: StartMenuPrefs;
  appearance: AppearanceConfig;
  customThemes: CustomThemePreset[];
  wallpapers: WallpaperPreset[];
  activeWallpaperId: string;
  wallpaperFitMode: WallpaperFitMode;
  favoriteWallpapers: string[];
  desktops: VirtualDesktop[];
  activeDesktopId: string;
  desktopLayout: DesktopLayoutConfig;
  widgets: DesktopWidgetInstance[];
  quickSettings: QuickSettingsState;
  displayNameOverride: string;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onSetTheme: (theme: ThemeId) => void;
  onSetThemeMode: (mode: ThemeModePreference) => void;
  onSetLanguage: (lang: LanguageId) => void;
  onSetFont: (font: FontId) => void;
  onSetTaskbarStyle: (style: TaskbarStyleId) => void;
  onSetTaskbarPosition: (pos: TaskbarPositionId) => void;
  onUpdateTaskbarConfig: (patch: Partial<TaskbarConfig>) => void;
  onUpdateExtendedTaskbar: (patch: Partial<ExtendedTaskbarPrefs>) => void;
  onSetStartMenuStyle: (style: StartMenuStyleId) => void;
  onUpdateStartMenuPrefs: (patch: Partial<StartMenuPrefs>) => void;
  onUpdateAppearance: (patch: Partial<AppearanceConfig>) => void;
  onSaveCustomTheme: (name: string) => void;
  onApplyCustomTheme: (preset: CustomThemePreset) => void;
  onRenameCustomTheme: (id: string, name: string) => void;
  onDeleteCustomTheme: (id: string) => void;
  onSelectWallpaper: (wallpaperId: string, desktopOnly?: boolean) => void;
  onSetWallpaperFitMode: (mode: WallpaperFitMode) => void;
  onToggleFavoriteWallpaper: (wallpaperId: string) => void;
  onUploadWallpaper: (file: File) => void;
  onAddWallpaperUrl: (url: string, name: string) => void;
  onDeleteCustomWallpaper: (wallpaperId: string) => void;
  onUpdateDesktopLayout: (patch: Partial<DesktopLayoutConfig>) => void;
  onResetDesktopShortcuts: () => void;
  onOpenWidgetLibrary: () => void;
  onAutoArrangeWidgets: () => void;
  onResetWidgets: () => void;
  onUpdateWidget: (id: string, patch: Partial<DesktopWidgetInstance>) => void;
  onRemoveWidget: (id: string) => void;
  onUpdateQuickSettings: (patch: Partial<QuickSettingsState>) => void;
  onSetDisplayNameOverride: (name: string) => void;
  onOpenWindow: (id: WindowId) => void;
  onLock: () => void;
  onExportConfig: () => void;
  onImportConfig: (jsonText: string) => { ok: boolean; message: string };
  onResetAllConfig: () => void;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onBoundsChange?: (id: WindowId, bounds: SavedWindowBounds) => void;
}

const NavIcon: React.FC<{ name: SettingsNavItem['iconName'] }> = ({ name }) => {
  const props = { size: 15, strokeWidth: 1.85 };
  switch (name) {
    case 'system':
      return <Monitor {...props} className="text-sky-600 dark:text-sky-400" />;
    case 'bluetooth':
      return <Bluetooth {...props} className="text-blue-600 dark:text-blue-400" />;
    case 'network':
      return <Globe {...props} className="text-cyan-600 dark:text-cyan-400" />;
    case 'personalization':
      return <Paintbrush {...props} className="text-indigo-600 dark:text-indigo-400" />;
    case 'taskbar':
      return <PanelBottom {...props} className="text-blue-600 dark:text-blue-400" />;
    case 'widgets':
      return <LayoutGrid {...props} className="text-violet-600 dark:text-violet-400" />;
    case 'apps':
      return <AppWindow {...props} className="text-emerald-600 dark:text-emerald-400" />;
    case 'account':
      return <User {...props} className="text-amber-600 dark:text-amber-400" />;
    case 'time':
      return <Clock {...props} className="text-teal-600 dark:text-teal-400" />;
    case 'gaming':
      return <Gamepad2 {...props} className="text-violet-600 dark:text-violet-400" />;
    case 'accessibility':
      return <Accessibility {...props} className="text-sky-600 dark:text-sky-400" />;
    case 'privacy':
      return <Shield {...props} className="text-emerald-600 dark:text-emerald-400" />;
    case 'update':
      return <RefreshCw {...props} className="text-blue-600 dark:text-blue-400" />;
  }
};

const OptionIcon: React.FC<{ name: PersonalizationOption['iconName'] }> = ({ name }) => {
  const props = { size: 22, className: 'text-[var(--win-accent)] shrink-0', strokeWidth: 1.7 };
  switch (name) {
    case 'background':
      return <ImageIcon {...props} />;
    case 'colors':
      return <Palette {...props} />;
    case 'lock':
      return <Lock {...props} />;
    case 'themes':
      return <Sparkles {...props} />;
  }
};

const TaskbarStyleWireframe: React.FC<{ styleId: TaskbarStyleId }> = ({ styleId }) => (
  <div className="relative h-8 w-full overflow-hidden rounded-md bg-gradient-to-br from-sky-200/70 to-indigo-200/70 dark:from-slate-800 dark:to-slate-900">
    {styleId === 'floating' && (
      <>
        <div className="absolute bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 rounded-md bg-white/90 shadow-xs dark:bg-slate-600" />
        <div className="absolute right-1 bottom-1 h-2 w-5 rounded-md bg-white/90 shadow-xs dark:bg-slate-600" />
      </>
    )}
    {styleId === 'full' && (
      <div className="absolute inset-x-0 bottom-0 h-2.5 bg-white/95 shadow-xs dark:bg-slate-600" />
    )}
    {styleId === 'pill' && (
      <div className="absolute bottom-1 left-1/2 h-2.5 w-20 -translate-x-1/2 rounded-full bg-white/95 shadow-xs dark:bg-slate-600" />
    )}
    {styleId === 'compact' && (
      <div className="absolute bottom-1 left-1/2 h-1.5 w-11 -translate-x-1/2 rounded bg-white/90 shadow-xs dark:bg-slate-600" />
    )}
  </div>
);

const TaskbarPosWireframe: React.FC<{ pos: TaskbarPositionId; active: boolean }> = ({
  pos,
  active,
}) => {
  const barColor = active ? 'bg-[var(--win-accent-bright)]' : 'bg-slate-400/70 dark:bg-slate-500';
  return (
    <div className="relative h-6 w-8 rounded border border-black/15 bg-white/60 dark:border-white/15 dark:bg-slate-800/70">
      <div
        className={`absolute rounded-xs ${barColor} ${
          pos === 'bottom'
            ? 'inset-x-1 bottom-0.5 h-1'
            : pos === 'top'
            ? 'inset-x-1 top-0.5 h-1'
            : pos === 'left'
            ? 'inset-y-1 left-0.5 w-1'
            : 'inset-y-1 right-0.5 w-1'
        }`}
      />
    </div>
  );
};

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  savedBounds,
  theme,
  themeMode,
  language,
  fontId,
  taskbarStyle,
  taskbarPosition,
  taskbarConfig,
  extendedTaskbar,
  startMenuStyle,
  startMenuPrefs,
  appearance,
  customThemes,
  wallpapers,
  activeWallpaperId,
  wallpaperFitMode,
  favoriteWallpapers,
  desktops,
  activeDesktopId,
  desktopLayout,
  widgets,
  quickSettings,
  displayNameOverride,
  activeTab,
  onSelectTab,
  onSetTheme,
  onSetThemeMode,
  onSetLanguage,
  onSetFont,
  onSetTaskbarStyle,
  onSetTaskbarPosition,
  onUpdateTaskbarConfig,
  onUpdateExtendedTaskbar,
  onSetStartMenuStyle,
  onUpdateStartMenuPrefs,
  onUpdateAppearance,
  onSaveCustomTheme,
  onApplyCustomTheme,
  onRenameCustomTheme,
  onDeleteCustomTheme,
  onSelectWallpaper,
  onSetWallpaperFitMode,
  onToggleFavoriteWallpaper,
  onUploadWallpaper,
  onAddWallpaperUrl,
  onDeleteCustomWallpaper,
  onUpdateDesktopLayout,
  onResetDesktopShortcuts,
  onOpenWidgetLibrary,
  onAutoArrangeWidgets,
  onResetWidgets,
  onUpdateWidget,
  onRemoveWidget,
  onUpdateQuickSettings,
  onSetDisplayNameOverride,
  onOpenWindow,
  onLock,
  onExportConfig,
  onImportConfig,
  onResetAllConfig,
  onFocus,
  onMinimize,
  onClose,
  onBoundsChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [persSection, setPersSection] = useState<'background' | 'themes' | 'desktop' | 'fonts'>(
    'background'
  );
  const [wpCategory, setWpCategory] = useState<WallpaperCategory | 'all' | 'favorites'>('all');
  const [wpSearch, setWpSearch] = useState('');
  const [wpUrlInput, setWpUrlInput] = useState('');
  const [wpNameInput, setWpNameInput] = useState('');
  const [wpDesktopOnly, setWpDesktopOnly] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [renamingThemeId, setRenamingThemeId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [updateCheckMsg, setUpdateCheckMsg] = useState<string | null>(null);
  const [gameModeSim, setGameModeSim] = useState(true);
  const [activityHistorySim, setActivityHistorySim] = useState(true);
  const [startupApps, setStartupApps] = useState<Record<string, boolean>>({
    notes: true,
    weather: true,
    explorer: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const viewport = useViewport();
  const copy = UI_TEXT[language].settings;
  const activeNavObj = SETTINGS_NAV_ITEMS.find((item) => item.id === activeTab);
  const activeWallpaper = wallpapers.find((w) => w.id === activeWallpaperId) ?? wallpapers[0];
  const activeDesktop = desktops.find((d) => d.id === activeDesktopId);

  const handlePersonalizationClick = (optionId: string) => {
    setSelectedOption(optionId);
    if (optionId === 'background') setPersSection('background');
    if (optionId === 'colors' || optionId === 'themes') setPersSection('themes');
    if (optionId === 'lock-screen') onLock();
  };

  const filteredWallpapers = wallpapers.filter((wp) => {
    if (wpCategory === 'favorites' && !favoriteWallpapers.includes(wp.id)) return false;
    if (wpCategory !== 'all' && wpCategory !== 'favorites' && wp.category !== wpCategory) {
      return false;
    }
    const q = wpSearch.trim().toLowerCase();
    if (!q) return true;
    return wp.name[language].toLowerCase().includes(q) || wp.category.includes(q);
  });

  const handleMoveTaskbarApp = (appId: string, dir: -1 | 1) => {
    const base = [...taskbarConfig.pinnedAppIds];
    const idx = base.indexOf(appId);
    if (idx === -1) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= base.length) return;
    const copyArr = [...base];
    const [removed] = copyArr.splice(idx, 1);
    copyArr.splice(nextIdx, 0, removed);
    onUpdateTaskbarConfig({ pinnedAppIds: copyArr });
  };

  const renderToggleRow = (
    label: string,
    checked: boolean,
    onToggle: () => void,
    subtitle?: string
  ) => (
    <div className="flex items-center justify-between gap-3 rounded-lg py-1">
      <div className="min-w-0">
        <div className="text-xs font-medium text-[var(--win-text-primary)]">{label}</div>
        {subtitle && (
          <div className="text-[11px] text-[var(--win-text-secondary)]">{subtitle}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-[var(--win-accent-bright)]' : 'bg-slate-400/50 dark:bg-slate-600'
        }`}
      >
        <span
          className={`block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
    </div>
  );

  return (
    <WindowFrame
      id="settings"
      title={copy.windowTitle}
      icon={<FluentSystemIcon type="settings" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={860}
      height={640}
      showMaximize={true}
      initialOffset={{ x: 24, y: -12 }}
      savedBounds={savedBounds}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
      onBoundsChange={onBoundsChange}
    >
      <div className="win-scrollbar flex h-full flex-col overflow-y-auto px-5 pt-4 pb-6 select-none sm:px-7">
        {/* Profile Header Row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar size={44} initials={USER_PROFILE.initials} />
            <div className="leading-tight">
              <div className="text-[14px] font-bold text-[var(--win-text-primary)]">
                {displayNameOverride.trim() || USER_PROFILE.name}
              </div>
              <div className="text-xs text-[var(--win-text-secondary)]">{USER_PROFILE.email}</div>
            </div>
          </div>

          {/* Quick Language Pill */}
          <div className="flex items-center gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/8">
            <button
              type="button"
              onClick={() => onSetLanguage('vi')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                language === 'vi'
                  ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                  : 'text-[var(--win-text-secondary)] hover:text-[var(--win-text-primary)]'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => onSetLanguage('en')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                language === 'en'
                  ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                  : 'text-[var(--win-text-secondary)] hover:text-[var(--win-text-primary)]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex flex-1 flex-col gap-5 md:flex-row">
          {/* Left Navigation */}
          <nav
            aria-label="Settings categories"
            className="no-scrollbar flex w-full shrink-0 flex-row gap-1 overflow-x-auto pb-2 md:w-[215px] md:flex-col md:overflow-x-visible md:pb-0"
          >
            {SETTINGS_NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13px] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white/60 font-semibold text-[var(--win-text-primary)] shadow-xs dark:bg-white/14'
                      : 'text-[var(--win-text-primary)] opacity-85 hover:bg-white/40 dark:hover:bg-white/8'
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full bg-[var(--win-accent)]"
                    />
                  )}
                  <NavIcon name={item.iconName} />
                  <span>{item.label[language]}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Content Column */}
          <div className="min-w-0 flex-1 space-y-5 pt-1 pb-4">
            {activeTab === 'personalization' ? (
              <>
                {/* Sub-navigation Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'background', vi: 'Hình nền', en: 'Background' },
                      { id: 'themes', vi: 'Chủ đề & Màu sắc', en: 'Themes & Colors' },
                      { id: 'desktop', vi: 'Biểu tượng & Bố cục', en: 'Desktop Icons' },
                      { id: 'fonts', vi: 'Phông chữ & Start', en: 'Fonts & Start' },
                    ] as const
                  ).map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setPersSection(sub.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                        persSection === sub.id
                          ? 'bg-[var(--win-accent-bright)] text-white shadow-xs'
                          : 'win-card text-[var(--win-text-primary)]'
                      }`}
                    >
                      {language === 'vi' ? sub.vi : sub.en}
                    </button>
                  ))}
                </div>

                {/* Live Theme Preview Banner */}
                <div className="win-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
                  <div className="relative h-[108px] w-[180px] shrink-0 overflow-hidden rounded-xl border-2 border-white/60 shadow-sm dark:border-white/20">
                    <Win11Wallpaper
                      theme={theme}
                      wallpaper={activeWallpaper}
                      fitMode={wallpaperFitMode}
                      customBgColor={appearance.desktopBgColor}
                      className="h-full w-full"
                    />
                    <div
                      className="absolute right-2 bottom-2 left-2 flex h-5 items-center justify-between rounded-md px-2 text-[9px] font-bold text-white shadow"
                      style={{ backgroundColor: 'rgba(15,23,42,0.55)' }}
                    >
                      <span>{activeDesktop?.name ?? 'Desktop'}</span>
                      <span>{activeWallpaper?.name[language]}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5">
                    <div className="text-[14px] font-bold text-[var(--win-text-primary)]">
                      {copy.selectTheme}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {THEME_LIST.map((themeItem) => {
                        const isSelected = theme === themeItem.id && themeMode !== 'system';
                        const label = copy.themeNames[themeItem.id];
                        return (
                          <button
                            key={themeItem.id}
                            type="button"
                            onClick={() => {
                              onSetThemeMode(themeItem.id);
                              onSetTheme(themeItem.id);
                            }}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                              isSelected
                                ? 'border-[var(--win-accent)] bg-[var(--win-accent)]/12 text-[var(--win-text-primary)]'
                                : 'border-[var(--win-border-subtle)] hover:bg-black/5 dark:hover:bg-white/10'
                            }`}
                          >
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-black/15"
                              style={{ background: themeItem.desktopBgFallback }}
                            />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => onSetThemeMode('system')}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          themeMode === 'system'
                            ? 'border-[var(--win-accent)] bg-[var(--win-accent)]/12 text-[var(--win-text-primary)]'
                            : 'border-[var(--win-border-subtle)] hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        <Monitor size={13} />
                        <span>{language === 'vi' ? 'Mặc định hệ thống' : 'System Default'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3.1: Background */}
                {persSection === 'background' && (
                  <div className="space-y-4">
                    <div className="win-card space-y-3 rounded-2xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs font-bold text-[var(--win-text-primary)]">
                          {language === 'vi' ? 'Thư viện hình nền & Ảnh cá nhân' : 'Wallpaper Gallery & Upload'}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-[var(--win-text-secondary)]">
                            <input
                              type="checkbox"
                              checked={wpDesktopOnly}
                              onChange={(e) => setWpDesktopOnly(e.target.checked)}
                              className="accent-[var(--win-accent)]"
                            />
                            <span>
                              {language === 'vi'
                                ? `Chỉ áp dụng cho ${activeDesktop?.name ?? 'Desktop này'}`
                                : `Apply to ${activeDesktop?.name ?? 'current desktop'} only`}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--win-accent-bright)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          >
                            <Upload size={13} />
                            <span>{language === 'vi' ? 'Tải ảnh từ máy' : 'Upload image'}</span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onUploadWallpaper(file);
                              e.target.value = '';
                            }}
                          />
                        </div>
                      </div>

                      {/* Search & Fit Mode */}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--win-border-subtle)] bg-white/50 px-3 py-1.5 dark:bg-white/8">
                          <Search size={14} className="text-[var(--win-text-secondary)]" />
                          <input
                            type="text"
                            value={wpSearch}
                            onChange={(e) => setWpSearch(e.target.value)}
                            placeholder={language === 'vi' ? 'Tìm hình nền...' : 'Search wallpapers...'}
                            className="w-full bg-transparent text-xs focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="shrink-0 text-xs font-medium text-[var(--win-text-secondary)]">
                            {language === 'vi' ? 'Kiểu hiển thị:' : 'Fit mode:'}
                          </span>
                          <select
                            value={wallpaperFitMode}
                            onChange={(e) => onSetWallpaperFitMode(e.target.value as WallpaperFitMode)}
                            className="flex-1 rounded-xl border border-[var(--win-border-subtle)] bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[var(--win-text-primary)] dark:bg-slate-800"
                          >
                            {WALLPAPER_FIT_MODES.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.label[language]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Add by URL */}
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="url"
                          value={wpUrlInput}
                          onChange={(e) => setWpUrlInput(e.target.value)}
                          placeholder={
                            language === 'vi'
                              ? 'Dán URL ảnh hợp lệ (https://...)'
                              : 'Paste valid image URL (https://...)'
                          }
                          className="min-w-[200px] flex-1 rounded-xl border border-[var(--win-border-subtle)] bg-white/50 px-3 py-1.5 text-xs focus:outline-none dark:bg-white/8"
                        />
                        <input
                          type="text"
                          value={wpNameInput}
                          onChange={(e) => setWpNameInput(e.target.value)}
                          placeholder={language === 'vi' ? 'Tên gợi nhớ' : 'Name (optional)'}
                          className="w-36 rounded-xl border border-[var(--win-border-subtle)] bg-white/50 px-3 py-1.5 text-xs focus:outline-none dark:bg-white/8"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!wpUrlInput.trim()) return;
                            onAddWallpaperUrl(wpUrlInput.trim(), wpNameInput.trim());
                            setWpUrlInput('');
                            setWpNameInput('');
                          }}
                          className="win-card inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold"
                        >
                          <Plus size={13} />
                          <span>{language === 'vi' ? 'Thêm URL' : 'Add URL'}</span>
                        </button>
                      </div>

                      {/* Category Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {WALLPAPER_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setWpCategory(cat.id)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              wpCategory === cat.id
                                ? 'bg-[var(--win-accent-bright)] text-white'
                                : 'bg-black/5 hover:bg-black/10 dark:bg-white/8 dark:hover:bg-white/15'
                            }`}
                          >
                            {cat.label[language]}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setWpCategory('favorites')}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                            wpCategory === 'favorites'
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/5 hover:bg-black/10 dark:bg-white/8'
                          }`}
                        >
                          <Heart size={11} />
                          <span>{language === 'vi' ? 'Yêu thích' : 'Favorites'}</span>
                        </button>
                      </div>

                      {/* Wallpaper Thumbnails Grid */}
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {filteredWallpapers.map((wp) => {
                          const isSelected = wp.id === activeWallpaperId;
                          const isFav = favoriteWallpapers.includes(wp.id);
                          return (
                            <div
                              key={wp.id}
                              className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-[var(--win-accent)] shadow-md'
                                  : 'border-white/40 dark:border-white/15'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => onSelectWallpaper(wp.id, wpDesktopOnly)}
                                className="block h-24 w-full text-left"
                              >
                                <div
                                  className="h-full w-full bg-cover bg-center"
                                  style={
                                    wp.kind === 'image'
                                      ? { backgroundImage: `url("${wp.value}")` }
                                      : { background: wp.previewBg }
                                  }
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 py-1.5 text-[11px] font-semibold text-white">
                                  <div className="truncate">{wp.name[language]}</div>
                                </div>
                              </button>
                              <div className="absolute top-1.5 right-1.5 flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => onToggleFavoriteWallpaper(wp.id)}
                                  title={language === 'vi' ? 'Yêu thích' : 'Favorite'}
                                  className={`rounded-lg p-1 backdrop-blur-md transition-colors ${
                                    isFav
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-black/40 text-white/80 hover:bg-black/60'
                                  }`}
                                >
                                  <Heart size={11} fill={isFav ? 'currentColor' : 'none'} />
                                </button>
                                {wp.isCustom && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteCustomWallpaper(wp.id)}
                                    title={language === 'vi' ? 'Xóa ảnh này' : 'Delete image'}
                                    className="rounded-lg bg-black/45 p-1 text-white/90 backdrop-blur-md hover:bg-rose-600"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3.2: Themes & Colors */}
                {persSection === 'themes' && (
                  <div className="space-y-4">
                    {/* Accent Colors */}
                    <div className="win-card space-y-3 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-[var(--win-text-primary)]">
                          {language === 'vi' ? 'Màu nhấn hệ thống (Accent Color)' : 'Accent Color'}
                        </div>
                        <button
                          type="button"
                          onClick={() => onUpdateAppearance(DEFAULT_APPEARANCE)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--win-accent)] hover:underline"
                        >
                          <RotateCcw size={12} />
                          <span>{language === 'vi' ? 'Khôi phục mặc định' : 'Reset'}</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {ACCENT_PRESETS.map((preset) => {
                          const active =
                            appearance.accentColor.toLowerCase() === preset.hex.toLowerCase();
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => onUpdateAppearance({ accentColor: preset.hex })}
                              title={preset.label[language]}
                              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium ${
                                active
                                  ? 'border-[var(--win-accent)] bg-[var(--win-accent)]/12 font-bold'
                                  : 'border-[var(--win-border-subtle)]'
                              }`}
                            >
                              <span
                                className="h-3.5 w-3.5 rounded-full"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>{preset.label[language]}</span>
                            </button>
                          );
                        })}
                        <label className="win-card flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium">
                          <input
                            type="color"
                            value={appearance.accentColor}
                            onChange={(e) => onUpdateAppearance({ accentColor: e.target.value })}
                            className="h-4 w-5 cursor-pointer border-0 bg-transparent p-0"
                          />
                          <span>{language === 'vi' ? 'Tùy chọn' : 'Custom'}</span>
                        </label>
                      </div>

                      {/* Surface Color Overrides */}
                      <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-3">
                        {(
                          [
                            {
                              key: 'desktopBgColor',
                              vi: 'Màu nền Desktop',
                              en: 'Desktop BG',
                              fallback: '#0b4f8a',
                            },
                            {
                              key: 'windowSurfaceColor',
                              vi: 'Màu bề mặt cửa sổ',
                              en: 'Window Surface',
                              fallback: '#f4f6fb',
                            },
                            {
                              key: 'taskbarBgColor',
                              vi: 'Màu nền Taskbar',
                              en: 'Taskbar Color',
                              fallback: '#f6f8fd',
                            },
                          ] as const
                        ).map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between rounded-xl border border-[var(--win-border-subtle)] px-3 py-2"
                          >
                            <span className="text-[11px] font-semibold">
                              {language === 'vi' ? item.vi : item.en}
                            </span>
                            <div className="flex items-center gap-1">
                              <input
                                type="color"
                                value={appearance[item.key] || item.fallback}
                                onChange={(e) => onUpdateAppearance({ [item.key]: e.target.value })}
                                className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                              />
                              {appearance[item.key] && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateAppearance({ [item.key]: '' })}
                                  className="text-[10px] font-semibold text-rose-500 hover:underline"
                                >
                                  {language === 'vi' ? 'Xóa' : 'Clear'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Material Sliders & Toggles */}
                    <div className="win-card space-y-3 rounded-2xl p-4">
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {language === 'vi'
                          ? 'Vật liệu Fluent (Mica, Acrylic, Bo góc, Đổ bóng)'
                          : 'Fluent Materials & Geometry'}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="mb-1 flex justify-between text-xs">
                            <span>{language === 'vi' ? 'Độ trong suốt' : 'Transparency'}</span>
                            <span className="font-bold tabular-nums">{appearance.transparency}%</span>
                          </div>
                          <input
                            type="range"
                            min={45}
                            max={96}
                            value={appearance.transparency}
                            onChange={(e) =>
                              onUpdateAppearance({ transparency: Number(e.target.value) })
                            }
                            className="w-full accent-[var(--win-accent)]"
                          />
                        </div>

                        <div>
                          <div className="mb-1 flex justify-between text-xs">
                            <span>{language === 'vi' ? 'Độ bo góc cửa sổ' : 'Border radius'}</span>
                            <span className="font-bold tabular-nums">{appearance.borderRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min={6}
                            max={24}
                            value={appearance.borderRadius}
                            onChange={(e) =>
                              onUpdateAppearance({ borderRadius: Number(e.target.value) })
                            }
                            className="w-full accent-[var(--win-accent)]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-medium">
                          {language === 'vi' ? 'Cường độ đổ bóng:' : 'Shadow intensity:'}
                        </span>
                        <div className="flex gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                          {(['soft', 'medium', 'deep'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => onUpdateAppearance({ shadowIntensity: lvl })}
                              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                appearance.shadowIntensity === lvl
                                  ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                                  : 'text-[var(--win-text-secondary)]'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {renderToggleRow(
                        language === 'vi' ? 'Hiệu ứng Mica nền cửa sổ' : 'Mica material tint',
                        appearance.micaEnabled,
                        () => onUpdateAppearance({ micaEnabled: !appearance.micaEnabled })
                      )}
                      {renderToggleRow(
                        language === 'vi' ? 'Hiệu ứng kính mờ Acrylic' : 'Acrylic blur translucency',
                        appearance.acrylicEnabled,
                        () => onUpdateAppearance({ acrylicEnabled: !appearance.acrylicEnabled })
                      )}
                      {renderToggleRow(
                        language === 'vi' ? 'Hiệu ứng chuyển động Fluent Motion' : 'Fluent Motion animations',
                        appearance.motionEnabled,
                        () => onUpdateAppearance({ motionEnabled: !appearance.motionEnabled })
                      )}
                    </div>

                    {/* Save & Manage Custom Themes */}
                    <div className="win-card space-y-3 rounded-2xl p-4">
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {language === 'vi' ? 'Chủ đề cá nhân đã lưu' : 'Saved Custom Themes'}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newThemeName}
                          onChange={(e) => setNewThemeName(e.target.value)}
                          placeholder={
                            language === 'vi'
                              ? 'Tên chủ đề mới (VD: Neon Tím)...'
                              : 'New theme name...'
                          }
                          className="flex-1 rounded-xl border border-[var(--win-border-subtle)] bg-white/50 px-3 py-1.5 text-xs focus:outline-none dark:bg-white/8"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newThemeName.trim()) return;
                            onSaveCustomTheme(newThemeName.trim());
                            setNewThemeName('');
                          }}
                          className="rounded-xl bg-[var(--win-accent-bright)] px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                        >
                          {language === 'vi' ? 'Lưu chủ đề' : 'Save theme'}
                        </button>
                      </div>

                      {customThemes.length > 0 && (
                        <div className="space-y-1.5">
                          {customThemes.map((preset) => (
                            <div
                              key={preset.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--win-border-subtle)] px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-4 w-4 rounded-full border border-white/40"
                                  style={{ backgroundColor: preset.appearance.accentColor }}
                                />
                                {renamingThemeId === preset.id ? (
                                  <input
                                    type="text"
                                    value={renameDraft}
                                    onChange={(e) => setRenameDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && renameDraft.trim()) {
                                        onRenameCustomTheme(preset.id, renameDraft.trim());
                                        setRenamingThemeId(null);
                                      }
                                    }}
                                    autoFocus
                                    className="rounded border border-[var(--win-accent)] bg-transparent px-1.5 py-0.5 text-xs"
                                  />
                                ) : (
                                  <span className="text-xs font-semibold">{preset.name}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => onApplyCustomTheme(preset)}
                                  className="rounded-lg bg-[var(--win-accent-bright)] px-2.5 py-1 font-semibold text-white"
                                >
                                  {language === 'vi' ? 'Áp dụng' : 'Apply'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (renamingThemeId === preset.id) {
                                      if (renameDraft.trim()) {
                                        onRenameCustomTheme(preset.id, renameDraft.trim());
                                      }
                                      setRenamingThemeId(null);
                                    } else {
                                      setRenamingThemeId(preset.id);
                                      setRenameDraft(preset.name);
                                    }
                                  }}
                                  className="rounded-lg bg-black/5 px-2 py-1 font-medium dark:bg-white/10"
                                >
                                  {renamingThemeId === preset.id
                                    ? language === 'vi'
                                      ? 'Lưu'
                                      : 'Save'
                                    : language === 'vi'
                                    ? 'Đổi tên'
                                    : 'Rename'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteCustomTheme(preset.id)}
                                  className="rounded-lg px-2 py-1 font-medium text-rose-500 hover:bg-rose-500/10"
                                >
                                  {language === 'vi' ? 'Xóa' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 3.3 & 3.4: Desktop Icons & Layout */}
                {persSection === 'desktop' && (
                  <div className="win-card space-y-3 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {language === 'vi'
                          ? 'Biểu tượng Desktop & Bố cục lưới'
                          : 'Desktop Icons & Layout'}
                      </div>
                      <button
                        type="button"
                        onClick={onResetDesktopShortcuts}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--win-accent)] hover:underline"
                      >
                        <RotateCcw size={12} />
                        <span>{language === 'vi' ? 'Đặt lại vị trí icon' : 'Reset positions'}</span>
                      </button>
                    </div>

                    {renderToggleRow(
                      language === 'vi' ? 'Hiển thị biểu tượng Desktop' : 'Show Desktop icons',
                      desktopLayout.showIcons,
                      () => onUpdateDesktopLayout({ showIcons: !desktopLayout.showIcons })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Hiển thị nhãn tên biểu tượng' : 'Show icon labels',
                      desktopLayout.showLabels,
                      () => onUpdateDesktopLayout({ showLabels: !desktopLayout.showLabels })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Tự động sắp xếp biểu tượng' : 'Auto arrange icons',
                      desktopLayout.autoArrange,
                      () => onUpdateDesktopLayout({ autoArrange: !desktopLayout.autoArrange })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Căn chỉnh theo lưới (Snap to Grid)' : 'Align icons to grid',
                      desktopLayout.snapToGrid,
                      () => onUpdateDesktopLayout({ snapToGrid: !desktopLayout.snapToGrid })
                    )}

                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                      <div>
                        <div className="mb-1 text-[11px] font-semibold text-[var(--win-text-secondary)]">
                          {language === 'vi' ? 'Kích thước icon' : 'Icon size'}
                        </div>
                        <div className="flex gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                          {(['small', 'medium', 'large'] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => onUpdateDesktopLayout({ iconSize: sz })}
                              className={`flex-1 rounded-md py-1 text-[11px] font-semibold capitalize ${
                                desktopLayout.iconSize === sz
                                  ? 'bg-white shadow-xs dark:bg-white/20'
                                  : 'text-[var(--win-text-secondary)]'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-[11px] font-semibold text-[var(--win-text-secondary)]">
                          {language === 'vi' ? 'Kiểu hiển thị' : 'View mode'}
                        </div>
                        <div className="flex gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                          {(['grid', 'list'] as const).map((vw) => (
                            <button
                              key={vw}
                              type="button"
                              onClick={() => onUpdateDesktopLayout({ iconView: vw })}
                              className={`flex-1 rounded-md py-1 text-[11px] font-semibold capitalize ${
                                desktopLayout.iconView === vw
                                  ? 'bg-white shadow-xs dark:bg-white/20'
                                  : 'text-[var(--win-text-secondary)]'
                              }`}
                            >
                              {vw}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-[11px] font-semibold text-[var(--win-text-secondary)]">
                          {language === 'vi' ? 'Khoảng cách' : 'Icon spacing'}
                        </div>
                        <div className="flex gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                          {(['compact', 'normal', 'relaxed'] as const).map((gp) => (
                            <button
                              key={gp}
                              type="button"
                              onClick={() => onUpdateDesktopLayout({ iconGap: gp })}
                              className={`flex-1 rounded-md py-1 text-[11px] font-semibold capitalize ${
                                desktopLayout.iconGap === gp
                                  ? 'bg-white shadow-xs dark:bg-white/20'
                                  : 'text-[var(--win-text-secondary)]'
                              }`}
                            >
                              {gp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 4: Fonts & Start Menu (Preserved!) */}
                {persSection === 'fonts' && (
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[14px] font-bold text-[var(--win-text-primary)]">
                        <Type size={16} className="text-[var(--win-accent)]" />
                        <span>{language === 'vi' ? 'Phông chữ hệ thống' : 'System font'}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {FONT_OPTIONS.map((f) => {
                          const isSelected = fontId === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => onSetFont(f.id)}
                              style={{ fontFamily: f.fontFamily }}
                              className={`win-card flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left ${
                                isSelected ? 'ring-2 ring-[var(--win-accent)]' : ''
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="truncate text-[13px] font-bold text-[var(--win-text-primary)]">
                                  {f.name}
                                </div>
                                <div className="truncate text-[11px] text-[var(--win-text-secondary)]">
                                  {f.description[language]}
                                </div>
                              </div>
                              {isSelected && (
                                <Check size={15} className="ml-2 shrink-0 text-[var(--win-accent)]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[14px] font-bold text-[var(--win-text-primary)]">
                        <Sparkles size={16} className="text-[var(--win-accent)]" />
                        <span>
                          {language === 'vi'
                            ? 'Mẫu giao diện Menu Start (4 kiểu)'
                            : 'Start Menu layout templates'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {START_MENU_STYLE_OPTIONS.map((opt) => {
                          const isSelected = startMenuStyle === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onSetStartMenuStyle(opt.id)}
                              className={`win-card flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left ${
                                isSelected ? 'ring-2 ring-[var(--win-accent)]' : ''
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="truncate text-xs font-bold text-[var(--win-text-primary)]">
                                  {opt.label[language]}
                                </div>
                                <div className="truncate text-[11px] text-[var(--win-text-secondary)]">
                                  {opt.subtitle[language]}
                                </div>
                              </div>
                              {isSelected && (
                                <Check size={15} className="ml-2 shrink-0 text-[var(--win-accent)]" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="win-card flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span>{language === 'vi' ? 'Số cột Pinned:' : 'Pinned columns:'}</span>
                          {([4, 6, 8] as const).map((cols) => (
                            <button
                              key={cols}
                              type="button"
                              onClick={() => onUpdateStartMenuPrefs({ pinnedColumns: cols })}
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                                startMenuPrefs.pinnedColumns === cols
                                  ? 'bg-[var(--win-accent-bright)] text-white'
                                  : 'bg-black/5 dark:bg-white/10'
                              }`}
                            >
                              {cols}
                            </button>
                          ))}
                        </div>
                        {renderToggleRow(
                          language === 'vi' ? 'Hiển thị Đề xuất (Recommended)' : 'Show Recommended',
                          startMenuPrefs.showRecommended,
                          () =>
                            onUpdateStartMenuPrefs({
                              showRecommended: !startMenuPrefs.showRecommended,
                            })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Original Personalization Options */}
                <div className="space-y-2">
                  {PERSONALIZATION_OPTIONS.map((option) => {
                    const isHighlighted = selectedOption === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handlePersonalizationClick(option.id)}
                        className={`win-card flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left ${
                          isHighlighted ? 'ring-1 ring-[var(--win-accent)]' : ''
                        }`}
                      >
                        <OptionIcon name={option.iconName} />
                        <div>
                          <div className="text-[14px] font-medium text-[var(--win-text-primary)]">
                            {option.title[language]}
                          </div>
                          <div className="text-xs text-[var(--win-text-secondary)]">
                            {option.subtitle[language]}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : activeTab === 'taskbar' ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                      {activeNavObj?.label[language]}
                    </h2>
                    <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                      {activeNavObj?.summary[language]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSetTaskbarStyle('floating');
                      onSetTaskbarPosition('bottom');
                      onUpdateTaskbarConfig(DEFAULT_TASKBAR_CONFIG);
                      onUpdateExtendedTaskbar(DEFAULT_EXTENDED_TASKBAR);
                    }}
                    className="win-card rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--win-text-primary)]"
                  >
                    {language === 'vi' ? 'Khôi phục mặc định' : 'Reset default'}
                  </button>
                </div>

                {/* Live Taskbar Mini Preview */}
                <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-2xl border border-[var(--win-border-subtle)] bg-gradient-to-br from-sky-400/30 via-indigo-400/20 to-slate-900/20 p-3">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 transition-all"
                    style={{
                      backgroundColor: extendedTaskbar.bgColor || 'var(--win-taskbar-bg)',
                      backdropFilter: extendedTaskbar.acrylic ? 'blur(16px)' : 'none',
                      borderRadius:
                        extendedTaskbar.cornerStyle === 'pill' || taskbarStyle === 'pill'
                          ? '9999px'
                          : extendedTaskbar.cornerStyle === 'square'
                          ? '4px'
                          : '12px',
                      border: extendedTaskbar.showBorder ? '1px solid var(--win-border)' : 'none',
                    }}
                  >
                    {extendedTaskbar.showStartButton && <WindowsLogo size={16} color="fluent" />}
                    {taskbarConfig.searchMode !== 'hidden' && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/40 px-2 py-0.5 text-[10px] dark:bg-white/15">
                        <Search size={10} />
                        {taskbarConfig.searchMode === 'pill' && (
                          <span>{UI_TEXT[language].taskbar.searchLabel}</span>
                        )}
                      </span>
                    )}
                    <span className="h-3.5 w-3.5 rounded bg-sky-500/70" />
                    <span className="h-3.5 w-3.5 rounded bg-emerald-500/70" />
                    <span className="h-3.5 w-3.5 rounded bg-amber-500/70" />
                    <span className="ml-2 text-[10px] font-bold capitalize opacity-80">
                      {taskbarPosition} · {taskbarStyle} · {extendedTaskbar.size}
                    </span>
                  </div>
                </div>

                {/* Taskbar Style & Position */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--win-text-primary)]">
                    <LayoutPanelTop size={15} className="text-[var(--win-accent)]" />
                    <span>
                      {language === 'vi' ? 'Kiểu dáng & Vị trí thanh Taskbar' : 'Style & Position'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {TASKBAR_STYLE_OPTIONS.map((styleOpt) => {
                      const isSelected = taskbarStyle === styleOpt.id;
                      return (
                        <button
                          key={styleOpt.id}
                          type="button"
                          onClick={() => onSetTaskbarStyle(styleOpt.id)}
                          className={`win-card flex flex-col gap-2 rounded-xl p-2.5 text-left ${
                            isSelected ? 'ring-2 ring-[var(--win-accent)]' : ''
                          }`}
                        >
                          <TaskbarStyleWireframe styleId={styleOpt.id} />
                          <div>
                            <div className="text-xs font-bold text-[var(--win-text-primary)]">
                              {styleOpt.label[language]}
                            </div>
                            <div className="text-[11px] leading-snug text-[var(--win-text-secondary)]">
                              {styleOpt.subtitle[language]}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TASKBAR_POSITION_OPTIONS.map((posOpt) => {
                      const isSelected = taskbarPosition === posOpt.id;
                      return (
                        <button
                          key={posOpt.id}
                          type="button"
                          onClick={() => onSetTaskbarPosition(posOpt.id)}
                          className={`win-card flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-center ${
                            isSelected ? 'ring-2 ring-[var(--win-accent)]' : ''
                          }`}
                        >
                          <TaskbarPosWireframe pos={posOpt.id} active={isSelected} />
                          <span className="text-xs font-medium text-[var(--win-text-primary)]">
                            {posOpt.label[language]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Extended Taskbar Appearance & Start Button */}
                <div className="win-card space-y-3 rounded-xl p-4">
                  <div className="text-xs font-bold text-[var(--win-text-primary)]">
                    {language === 'vi'
                      ? 'Vật liệu, Kích thước & Nút Start'
                      : 'Taskbar Appearance & Start Button'}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-[var(--win-text-secondary)]">
                        {language === 'vi' ? 'Kích thước Taskbar' : 'Taskbar size'}
                      </div>
                      <div className="flex gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                        {(['small', 'medium', 'large'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => onUpdateExtendedTaskbar({ size: sz })}
                            className={`flex-1 rounded-md py-1 text-[11px] font-semibold capitalize ${
                              extendedTaskbar.size === sz
                                ? 'bg-white shadow-xs dark:bg-white/20'
                                : 'text-[var(--win-text-secondary)]'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-[var(--win-text-secondary)]">
                        {language === 'vi' ? 'Kiểu bo góc' : 'Corner style'}
                      </div>
                      <div className="flex gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                        {(['rounded', 'pill', 'square'] as const).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => onUpdateExtendedTaskbar({ cornerStyle: c })}
                            className={`flex-1 rounded-md py-1 text-[11px] font-semibold capitalize ${
                              extendedTaskbar.cornerStyle === c
                                ? 'bg-white shadow-xs dark:bg-white/20'
                                : 'text-[var(--win-text-secondary)]'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{language === 'vi' ? 'Độ trong suốt' : 'Transparency'}</span>
                        <span className="font-bold tabular-nums">{extendedTaskbar.transparency}%</span>
                      </div>
                      <input
                        type="range"
                        min={45}
                        max={98}
                        value={extendedTaskbar.transparency}
                        onChange={(e) =>
                          onUpdateExtendedTaskbar({ transparency: Number(e.target.value) })
                        }
                        className="w-full accent-[var(--win-accent)]"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[var(--win-border-subtle)] px-3 py-1.5">
                      <span className="text-xs font-medium">
                        {language === 'vi' ? 'Màu nền tùy chỉnh' : 'Custom background'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={extendedTaskbar.bgColor || '#f6f8fd'}
                          onChange={(e) => onUpdateExtendedTaskbar({ bgColor: e.target.value })}
                          className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
                        />
                        {extendedTaskbar.bgColor && (
                          <button
                            type="button"
                            onClick={() => onUpdateExtendedTaskbar({ bgColor: '' })}
                            className="text-[11px] font-semibold text-rose-500"
                          >
                            {language === 'vi' ? 'Xóa' : 'Clear'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                    {renderToggleRow('Acrylic Blur', extendedTaskbar.acrylic, () =>
                      onUpdateExtendedTaskbar({ acrylic: !extendedTaskbar.acrylic })
                    )}
                    {renderToggleRow('Mica Material', extendedTaskbar.mica, () =>
                      onUpdateExtendedTaskbar({ mica: !extendedTaskbar.mica })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Hiển thị viền' : 'Show border',
                      extendedTaskbar.showBorder,
                      () => onUpdateExtendedTaskbar({ showBorder: !extendedTaskbar.showBorder })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Đổ bóng Taskbar' : 'Show shadow',
                      extendedTaskbar.showShadow,
                      () => onUpdateExtendedTaskbar({ showShadow: !extendedTaskbar.showShadow })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Hiển thị nút Start' : 'Show Start button',
                      extendedTaskbar.showStartButton,
                      () =>
                        onUpdateExtendedTaskbar({
                          showStartButton: !extendedTaskbar.showStartButton,
                        })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Nút Task View (Desktop ảo)' : 'Show Task View',
                      extendedTaskbar.showTaskView,
                      () => onUpdateExtendedTaskbar({ showTaskView: !extendedTaskbar.showTaskView })
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--win-border-subtle)] pt-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold">
                        {language === 'vi' ? 'Biểu tượng Start:' : 'Start icon:'}
                      </span>
                      {(['fluent', 'classic', 'minimal'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => onUpdateExtendedTaskbar({ startIconStyle: st })}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold capitalize ${
                            extendedTaskbar.startIconStyle === st
                              ? 'bg-[var(--win-accent-bright)] text-white'
                              : 'bg-black/5 dark:bg-white/10'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-semibold">
                        {language === 'vi' ? 'Cỡ Start:' : 'Start size:'}
                      </span>
                      {(['small', 'medium', 'large'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onUpdateExtendedTaskbar({ startButtonSize: sz })}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold capitalize ${
                            extendedTaskbar.startButtonSize === sz
                              ? 'bg-[var(--win-accent-bright)] text-white'
                              : 'bg-black/5 dark:bg-white/10'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search & Alignment */}
                <div className="win-card space-y-3 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {language === 'vi' ? 'Công cụ Tìm kiếm trên Taskbar' : 'Search on Taskbar'}
                      </div>
                      <div className="text-[11px] text-[var(--win-text-secondary)]">
                        {language === 'vi'
                          ? 'Chọn cách hiển thị hộp tìm kiếm Windows'
                          : 'Choose how Windows Search appears'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                      {(
                        [
                          { id: 'pill', vi: 'Hộp tìm', en: 'Search box' },
                          { id: 'icon', vi: 'Biểu tượng', en: 'Icon only' },
                          { id: 'hidden', vi: 'Ẩn', en: 'Hide' },
                        ] as { id: TaskbarSearchModeId; vi: string; en: string }[]
                      ).map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => onUpdateTaskbarConfig({ searchMode: mode.id })}
                          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                            taskbarConfig.searchMode === mode.id
                              ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                              : 'text-[var(--win-text-secondary)]'
                          }`}
                        >
                          {language === 'vi' ? mode.vi : mode.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-[var(--win-border-subtle)]" />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {language === 'vi' ? 'Căn chỉnh Taskbar (Kiểu Tràn viền)' : 'Taskbar alignment (Full Bar)'}
                      </div>
                      <div className="text-[11px] text-[var(--win-text-secondary)]">
                        {language === 'vi'
                          ? 'Căn giữa kiểu Windows 12 hoặc căn trái cổ điển'
                          : 'Centered Windows 12 or classic Left alignment'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-black/5 p-0.5 dark:bg-white/8">
                      {(
                        [
                          { id: 'center', vi: 'Giữa', en: 'Center' },
                          { id: 'left', vi: 'Trái', en: 'Left' },
                        ] as const
                      ).map((al) => (
                        <button
                          key={al.id}
                          type="button"
                          onClick={() => onUpdateTaskbarConfig({ alignment: al.id })}
                          className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-colors ${
                            taskbarConfig.alignment === al.id
                              ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                              : 'text-[var(--win-text-secondary)]'
                          }`}
                        >
                          {language === 'vi' ? al.vi : al.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System Tray Toggles */}
                <div className="win-card space-y-2 rounded-xl p-4">
                  <div className="text-xs font-bold text-[var(--win-text-primary)]">
                    {language === 'vi' ? 'Khay hệ thống & Biểu tượng trạng thái' : 'System Tray & Status Icons'}
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                    {renderToggleRow(
                      language === 'vi' ? 'Biểu tượng Wi-Fi (Mô phỏng)' : 'Wi-Fi icon (Sim)',
                      extendedTaskbar.showWifi,
                      () => onUpdateExtendedTaskbar({ showWifi: !extendedTaskbar.showWifi })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Biểu tượng Âm lượng' : 'Volume icon',
                      extendedTaskbar.showVolume,
                      () => onUpdateExtendedTaskbar({ showVolume: !extendedTaskbar.showVolume })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Biểu tượng Pin (Mô phỏng)' : 'Battery icon (Sim)',
                      extendedTaskbar.showBattery,
                      () => onUpdateExtendedTaskbar({ showBattery: !extendedTaskbar.showBattery })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Biểu tượng Bluetooth' : 'Bluetooth icon',
                      extendedTaskbar.showBluetooth,
                      () => onUpdateExtendedTaskbar({ showBluetooth: !extendedTaskbar.showBluetooth })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Chuông Thông báo' : 'Notification bell',
                      extendedTaskbar.showNotifications,
                      () =>
                        onUpdateExtendedTaskbar({
                          showNotifications: !extendedTaskbar.showNotifications,
                        })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Tiện ích Thời tiết' : 'Weather widget',
                      taskbarConfig.showWeather,
                      () => onUpdateTaskbarConfig({ showWeather: !taskbarConfig.showWeather })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Nút Ngôn ngữ (Vi / En)' : 'Language switcher',
                      taskbarConfig.showLanguageToggle,
                      () =>
                        onUpdateTaskbarConfig({
                          showLanguageToggle: !taskbarConfig.showLanguageToggle,
                        })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Nút Sáng / Tối' : 'Theme switcher',
                      taskbarConfig.showThemeToggle,
                      () =>
                        onUpdateTaskbarConfig({ showThemeToggle: !taskbarConfig.showThemeToggle })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Đồng hồ & Ngày tháng' : 'Clock & Date',
                      taskbarConfig.showClock,
                      () => onUpdateTaskbarConfig({ showClock: !taskbarConfig.showClock })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Vạch ứng dụng đang mở' : 'Running app indicators',
                      taskbarConfig.showRunningIndicator,
                      () =>
                        onUpdateTaskbarConfig({
                          showRunningIndicator: !taskbarConfig.showRunningIndicator,
                        })
                    )}
                    {renderToggleRow(
                      language === 'vi' ? 'Tự động ẩn Taskbar' : 'Auto-hide taskbar',
                      taskbarConfig.autoHide,
                      () => onUpdateTaskbarConfig({ autoHide: !taskbarConfig.autoHide })
                    )}
                  </div>
                </div>

                {/* Pinned Apps & Reorder */}
                <div className="win-card space-y-2.5 rounded-xl p-4">
                  <div className="text-xs font-bold text-[var(--win-text-primary)]">
                    {language === 'vi'
                      ? 'Ứng dụng ghim & Thứ tự trên Taskbar (Có thể kéo trực tiếp trên Taskbar)'
                      : 'Pinned Apps & Taskbar Order'}
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {TASKBAR_APPS.map((app) => {
                      const isPinned = app.locked || taskbarConfig.pinnedAppIds.includes(app.id);
                      const pinIdx = taskbarConfig.pinnedAppIds.indexOf(app.id);
                      return (
                        <div
                          key={app.id}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-xs ${
                            isPinned
                              ? 'border-[var(--win-accent)]/45 bg-[var(--win-accent)]/8 font-semibold'
                              : 'border-[var(--win-border-subtle)] opacity-65'
                          }`}
                        >
                          <button
                            type="button"
                            disabled={app.locked}
                            onClick={() => {
                              if (app.locked) return;
                              const nextIds = isPinned
                                ? taskbarConfig.pinnedAppIds.filter((x) => x !== app.id)
                                : [...taskbarConfig.pinnedAppIds, app.id];
                              onUpdateTaskbarConfig({ pinnedAppIds: nextIds });
                            }}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            {app.systemIcon === 'start' ? (
                              <WindowsLogo size={16} color="fluent" />
                            ) : app.systemIcon ? (
                              <FluentSystemIcon type={app.systemIcon} size={16} />
                            ) : app.icon ? (
                              <AppBrandIcon icon={app.icon} size={16} />
                            ) : null}
                            <span className="truncate">{app.label[language]}</span>
                          </button>

                          {isPinned && !app.locked && pinIdx !== -1 && (
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleMoveTaskbarApp(app.id, -1)}
                                className="rounded p-1 hover:bg-black/8 dark:hover:bg-white/12"
                                aria-label="Move up"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveTaskbarApp(app.id, 1)}
                                className="rounded p-1 hover:bg-black/8 dark:hover:bg-white/12"
                                aria-label="Move down"
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>
                          )}
                          {app.locked && <Check size={13} className="text-[var(--win-accent)]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : activeTab === 'widgets' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                      {activeNavObj?.label[language]}
                    </h2>
                    <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                      {activeNavObj?.summary[language]}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onOpenWidgetLibrary}
                      className="rounded-xl bg-[var(--win-accent-bright)] px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    >
                      {language === 'vi' ? '+ Mở thư viện 16 Widget' : '+ Open 16-Widget Library'}
                    </button>
                    <button
                      type="button"
                      onClick={onAutoArrangeWidgets}
                      className="win-card rounded-xl px-3 py-1.5 text-xs font-semibold"
                    >
                      {language === 'vi' ? 'Sắp xếp tự động' : 'Auto Arrange'}
                    </button>
                    <button
                      type="button"
                      onClick={onResetWidgets}
                      className="win-card rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-500"
                    >
                      {language === 'vi' ? 'Đặt lại mặc định' : 'Reset'}
                    </button>
                  </div>
                </div>

                <div className="win-card space-y-2.5 rounded-2xl p-4">
                  {renderToggleRow(
                    language === 'vi' ? 'Hiển thị Widget trên Desktop' : 'Show Desktop Widgets',
                    desktopLayout.showWidgets,
                    () => onUpdateDesktopLayout({ showWidgets: !desktopLayout.showWidgets })
                  )}
                  {renderToggleRow(
                    language === 'vi' ? 'Hút lưới khi kéo Widget (Snap to Grid)' : 'Snap Widgets to Grid',
                    desktopLayout.widgetSnapToGrid,
                    () =>
                      onUpdateDesktopLayout({ widgetSnapToGrid: !desktopLayout.widgetSnapToGrid })
                  )}
                </div>

                <div className="win-card space-y-2 rounded-2xl p-4">
                  <div className="text-xs font-bold text-[var(--win-text-primary)]">
                    {language === 'vi'
                      ? `Widget đang có trên ${activeDesktop?.name ?? 'Desktop'} (${widgets.filter((w) => w.desktopId === activeDesktopId).length})`
                      : `Active Widgets on ${activeDesktop?.name ?? 'Desktop'}`}
                  </div>
                  <div className="space-y-1.5">
                    {widgets
                      .filter((w) => w.desktopId === activeDesktopId)
                      .map((w) => {
                        const meta = WIDGET_CATALOG.find((c) => c.type === w.type);
                        return (
                          <div
                            key={w.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-[var(--win-border-subtle)] px-3 py-2 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold">{meta?.title[language] ?? w.type}</div>
                              <div className="text-[10px] text-[var(--win-text-secondary)]">
                                {w.style.visualStyle} · {Math.round(w.width)}×{Math.round(w.height)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onUpdateWidget(w.id, { visible: !w.visible })}
                                className="rounded-lg bg-black/5 px-2.5 py-1 text-[11px] font-semibold dark:bg-white/10"
                              >
                                {w.visible
                                  ? language === 'vi'
                                    ? 'Đang hiện'
                                    : 'Visible'
                                  : language === 'vi'
                                  ? 'Đang ẩn'
                                  : 'Hidden'}
                              </button>
                              <button
                                type="button"
                                onClick={() => onRemoveWidget(w.id)}
                                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-500/10"
                              >
                                {language === 'vi' ? 'Xóa' : 'Remove'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : activeTab === 'system' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                {/* Responsive Display & UI Scale Card */}
                <div className="win-card space-y-3 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--win-text-primary)]">
                        {language === 'vi'
                          ? 'Co giãn giao diện theo kích thước thiết bị'
                          : 'Responsive Display & UI Scaling'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[var(--win-text-secondary)] tabular-nums">
                        {language === 'vi' ? 'Kích thước hiện tại:' : 'Current viewport:'}{' '}
                        <span className="font-semibold text-[var(--win-text-primary)]">
                          {viewport.width} × {viewport.height} px
                        </span>{' '}
                        ·{' '}
                        <span className="font-semibold text-[var(--win-accent)]">
                          {viewport.deviceType === 'mobile'
                            ? language === 'vi'
                              ? 'Điện thoại'
                              : 'Mobile'
                            : viewport.deviceType === 'tablet'
                            ? language === 'vi'
                              ? 'Máy tính bảng'
                              : 'Tablet'
                            : viewport.deviceType === 'wide'
                            ? language === 'vi'
                              ? 'Màn hình rộng'
                              : 'Wide Desktop'
                            : language === 'vi'
                            ? 'Laptop / Desktop'
                            : 'Desktop'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    {(
                      [
                        {
                          id: 'auto' as UiScaleMode,
                          vi: 'Tự động',
                          en: 'Auto',
                        },
                        {
                          id: 'compact' as UiScaleMode,
                          vi: 'Gọn (90%)',
                          en: 'Compact (90%)',
                        },
                        {
                          id: 'default' as UiScaleMode,
                          vi: 'Chuẩn (100%)',
                          en: 'Default (100%)',
                        },
                        {
                          id: 'comfortable' as UiScaleMode,
                          vi: 'Lớn (110%)',
                          en: 'Large (110%)',
                        },
                      ]
                    ).map((opt) => {
                      const active = (appearance.uiScale ?? 'auto') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onUpdateAppearance({ uiScale: opt.id })}
                          className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition-colors ${
                            active
                              ? 'border-[var(--win-accent)] bg-[var(--win-accent-bright)] text-white shadow-xs'
                              : 'border-[var(--win-border-subtle)] bg-white/40 text-[var(--win-text-primary)] hover:bg-white/70 dark:bg-white/6 dark:hover:bg-white/12'
                          }`}
                        >
                          {language === 'vi' ? opt.vi : opt.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="win-card space-y-3 rounded-2xl p-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs font-semibold">
                      <span>{language === 'vi' ? 'Độ sáng màn hình (Mô phỏng)' : 'Display Brightness (Sim)'}</span>
                      <span className="tabular-nums">{quickSettings.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={quickSettings.brightness}
                      onChange={(e) =>
                        onUpdateQuickSettings({ brightness: Number(e.target.value) })
                      }
                      className="w-full accent-[var(--win-accent)]"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs font-semibold">
                      <span>{language === 'vi' ? 'Âm lượng hệ thống (Mô phỏng)' : 'Master Volume (Sim)'}</span>
                      <span className="tabular-nums">{quickSettings.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={quickSettings.volume}
                      onChange={(e) => onUpdateQuickSettings({ volume: Number(e.target.value) })}
                      className="w-full accent-[var(--win-accent)]"
                    />
                  </div>

                  {renderToggleRow(
                    language === 'vi' ? 'Ánh sáng ban đêm (Night Light)' : 'Night Light warm filter',
                    quickSettings.nightLight,
                    () => onUpdateQuickSettings({ nightLight: !quickSettings.nightLight })
                  )}
                  {renderToggleRow(
                    language === 'vi' ? 'Chế độ tiết kiệm pin (Mô phỏng)' : 'Battery Saver (Sim)',
                    quickSettings.batterySaver,
                    () => onUpdateQuickSettings({ batterySaver: !quickSettings.batterySaver })
                  )}
                </div>

                <div className="win-card space-y-2 rounded-2xl p-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{language === 'vi' ? 'Dung lượng lưu trữ (Mô phỏng)' : 'Storage (Simulation)'}</span>
                    <span className="tabular-nums">128 GB / 512 GB</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="flex h-full w-1/4">
                      <div className="h-full w-2/3 bg-[var(--win-accent-bright)]" />
                      <div className="h-full w-1/3 bg-emerald-500" />
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--win-text-secondary)]">
                    {language === 'vi'
                      ? 'Thông số ổ đĩa được mô phỏng trong ứng dụng web.'
                      : 'Storage telemetry is simulated inside the browser app.'}
                  </div>
                </div>
              </div>
            ) : activeTab === 'bluetooth' || activeTab === 'network' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                <div className="win-card space-y-2.5 rounded-2xl p-4">
                  {renderToggleRow(
                    language === 'vi' ? 'Wi-Fi (Mô phỏng kết nối)' : 'Wi-Fi (Simulated)',
                    quickSettings.wifi && !quickSettings.airplaneMode,
                    () =>
                      onUpdateQuickSettings({
                        wifi: !quickSettings.wifi,
                        airplaneMode: false,
                      })
                  )}
                  {renderToggleRow(
                    language === 'vi' ? 'Bluetooth (Mô phỏng thiết bị)' : 'Bluetooth (Simulated)',
                    quickSettings.bluetooth && !quickSettings.airplaneMode,
                    () =>
                      onUpdateQuickSettings({
                        bluetooth: !quickSettings.bluetooth,
                        airplaneMode: false,
                      })
                  )}
                  {renderToggleRow(
                    language === 'vi' ? 'Chế độ máy bay (Mô phỏng)' : 'Airplane Mode (Sim)',
                    quickSettings.airplaneMode,
                    () => onUpdateQuickSettings({ airplaneMode: !quickSettings.airplaneMode })
                  )}
                </div>
              </div>
            ) : activeTab === 'apps' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                <div className="win-card space-y-2 rounded-2xl p-4">
                  <div className="text-xs font-bold">
                    {language === 'vi' ? 'Ứng dụng tích hợp sẵn' : 'Installed Apps'}
                  </div>
                  {(
                    [
                      { id: 'explorer', title: UI_TEXT[language].apps.explorerTitle },
                      { id: 'notes', title: UI_TEXT[language].apps.notesTitle },
                      { id: 'calculator', title: UI_TEXT[language].apps.calculatorTitle },
                      { id: 'paint', title: UI_TEXT[language].apps.paintTitle },
                      { id: 'weather', title: UI_TEXT[language].weather.windowTitle },
                      { id: 'taskManager', title: UI_TEXT[language].apps.taskManagerTitle },
                    ] as { id: WindowId; title: string }[]
                  ).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--win-border-subtle)] px-3 py-2 text-xs"
                    >
                      <span className="font-semibold">{app.title}</span>
                      <div className="flex items-center gap-2">
                        {app.id in startupApps && (
                          <button
                            type="button"
                            onClick={() =>
                              setStartupApps((prev) => ({ ...prev, [app.id]: !prev[app.id] }))
                            }
                            className={`rounded-lg px-2 py-1 text-[11px] font-medium ${
                              startupApps[app.id]
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-black/5 text-[var(--win-text-secondary)] dark:bg-white/10'
                            }`}
                          >
                            {startupApps[app.id]
                              ? language === 'vi'
                                ? 'Khởi động cùng HĐH'
                                : 'Startup On'
                              : language === 'vi'
                              ? 'Tắt khởi động'
                              : 'Startup Off'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenWindow(app.id)}
                          className="rounded-lg bg-[var(--win-accent-bright)] px-3 py-1 font-semibold text-white"
                        >
                          {language === 'vi' ? 'Mở' : 'Open'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'account' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                <div className="win-card space-y-3 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar size={48} initials={USER_PROFILE.initials} />
                    <div>
                      <div className="text-sm font-bold">
                        {displayNameOverride.trim() || USER_PROFILE.name}
                      </div>
                      <div className="text-xs text-[var(--win-text-secondary)]">
                        {USER_PROFILE.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      {language === 'vi'
                        ? 'Tên hiển thị tùy chọn trên Start Menu (để trống để giữ Josh Salazar)'
                        : 'Optional Start Menu display name (leave blank for Josh Salazar)'}
                    </label>
                    <input
                      type="text"
                      value={displayNameOverride}
                      onChange={(e) => onSetDisplayNameOverride(e.target.value)}
                      placeholder={USER_PROFILE.name}
                      className="w-full rounded-xl border border-[var(--win-border-subtle)] bg-white/50 px-3 py-2 text-xs focus:outline-none dark:bg-white/8"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onLock}
                    className="win-card inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold"
                  >
                    <Lock size={14} />
                    <span>{language === 'vi' ? 'Khóa màn hình ngay' : 'Lock screen now'}</span>
                  </button>
                </div>
              </div>
            ) : activeTab === 'time' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                <div className="win-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Languages size={20} className="text-[var(--win-accent)]" />
                    <div>
                      <div className="text-sm font-semibold text-[var(--win-text-primary)]">
                        {copy.languageTitle}
                      </div>
                      <div className="text-xs text-[var(--win-text-secondary)]">
                        {copy.languageSubtitle}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onSetLanguage('vi')}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                        language === 'vi'
                          ? 'bg-[var(--win-accent-bright)] text-white'
                          : 'bg-black/5 text-[var(--win-text-primary)] hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetLanguage('en')}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                        language === 'en'
                          ? 'bg-[var(--win-accent-bright)] text-white'
                          : 'bg-black/5 text-[var(--win-text-primary)] hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'accessibility' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                <div className="win-card space-y-2.5 rounded-2xl p-4">
                  {renderToggleRow(
                    language === 'vi' ? 'Chế độ tương phản cao' : 'High Contrast filter',
                    quickSettings.accessibilityHighContrast,
                    () =>
                      onUpdateQuickSettings({
                        accessibilityHighContrast: !quickSettings.accessibilityHighContrast,
                      })
                  )}
                  {renderToggleRow(
                    language === 'vi' ? 'Giảm chuyển động (Reduce Motion)' : 'Reduce Motion animations',
                    !appearance.motionEnabled,
                    () => onUpdateAppearance({ motionEnabled: !appearance.motionEnabled })
                  )}
                </div>
              </div>
            ) : activeTab === 'update' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                {/* Windows Update Sim */}
                <div className="win-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
                  <div>
                    <div className="text-sm font-bold">Windows 11/12 Fluent Experience</div>
                    <div className="text-xs text-[var(--win-text-secondary)]">
                      {updateCheckMsg ??
                        (language === 'vi'
                          ? 'Phiên bản mới nhất đã được cài đặt'
                          : 'You are up to date')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setUpdateCheckMsg(
                        language === 'vi'
                          ? `Đã kiểm tra lúc ${new Date().toLocaleTimeString()} · Không có bản vá mới`
                          : `Checked at ${new Date().toLocaleTimeString()} · Up to date`
                      )
                    }
                    className="rounded-xl bg-[var(--win-accent-bright)] px-3.5 py-2 text-xs font-semibold text-white"
                  >
                    {language === 'vi' ? 'Kiểm tra cập nhật (Mô phỏng)' : 'Check for updates (Sim)'}
                  </button>
                </div>

                {/* Data Persistence: Export / Import / Reset All */}
                <div className="win-card space-y-3 rounded-2xl p-4">
                  <div className="text-xs font-bold text-[var(--win-text-primary)]">
                    {language === 'vi'
                      ? 'Sao lưu, Khôi phục & Xuất cấu hình JSON'
                      : 'Backup, Restore & JSON Export/Import'}
                  </div>
                  <p className="text-[11px] text-[var(--win-text-secondary)]">
                    {language === 'vi'
                      ? 'Mọi tùy chỉnh (Hình nền, Chủ đề, Taskbar, Widget, Vị trí Icon, Desktop ảo) được lưu tự động.'
                      : 'All preferences (Wallpapers, Themes, Taskbar, Widgets, Shortcuts, Desktops) persist automatically.'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onExportConfig}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--win-accent-bright)] px-3.5 py-2 text-xs font-semibold text-white"
                    >
                      <Download size={13} />
                      <span>{language === 'vi' ? 'Xuất cấu hình JSON' : 'Export JSON'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => importInputRef.current?.click()}
                      className="win-card inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"
                    >
                      <Upload size={13} />
                      <span>{language === 'vi' ? 'Nhập cấu hình JSON' : 'Import JSON'}</span>
                    </button>
                    <input
                      ref={importInputRef}
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const text = typeof reader.result === 'string' ? reader.result : '';
                          const res = onImportConfig(text);
                          setImportStatus(res.message);
                        };
                        reader.readAsText(file);
                        e.target.value = '';
                      }}
                    />

                    {!confirmResetAll ? (
                      <button
                        type="button"
                        onClick={() => setConfirmResetAll(true)}
                        className="rounded-xl border border-rose-500/40 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                      >
                        {language === 'vi' ? 'Khôi phục toàn bộ mặc định' : 'Reset all to default'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/12 px-3 py-1.5 text-xs">
                        <span className="font-semibold text-rose-600 dark:text-rose-300">
                          {language === 'vi' ? 'Xác nhận đặt lại?' : 'Confirm reset?'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onResetAllConfig();
                            setConfirmResetAll(false);
                          }}
                          className="rounded-lg bg-rose-600 px-2.5 py-1 font-bold text-white"
                        >
                          {language === 'vi' ? 'Đồng ý' : 'Yes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmResetAll(false)}
                          className="rounded-lg px-2 py-1 font-semibold"
                        >
                          {language === 'vi' ? 'Hủy' : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </div>

                  {importStatus && (
                    <div className="rounded-xl bg-black/5 px-3 py-2 text-xs font-medium dark:bg-white/10">
                      {importStatus}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--win-text-secondary)]">
                    {activeNavObj?.summary[language]}
                  </p>
                </div>

                {activeTab === 'gaming' && (
                  <div className="win-card rounded-xl p-4">
                    {renderToggleRow(
                      language === 'vi' ? 'Chế độ trò chơi (Game Mode - Mô phỏng)' : 'Game Mode (Sim)',
                      gameModeSim,
                      () => setGameModeSim((p) => !p)
                    )}
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="win-card rounded-xl p-4">
                    {renderToggleRow(
                      language === 'vi' ? 'Lưu lịch sử hoạt động cục bộ' : 'Local activity history',
                      activityHistorySim,
                      () => setActivityHistorySim((p) => !p)
                    )}
                  </div>
                )}

                <div className="win-card rounded-xl p-4">
                  <div className="text-sm font-medium text-[var(--win-text-primary)]">
                    {activeNavObj?.label[language]} · {copy.statusTitle}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--win-text-secondary)]">
                    {copy.statusDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectTab('personalization')}
                    className="mt-3 rounded-lg bg-[var(--win-accent-bright)] px-3.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                  >
                    {copy.openPersonalization}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
