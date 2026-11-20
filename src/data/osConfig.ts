import { LanguageId, WindowId } from './desktopData';
import { WindowsIconKey } from '../config/windowsIcons';

export const OS_CONFIG_SCHEMA_VERSION = 2;
export const OS_CONFIG_STORAGE_KEY = 'win11-os-config-v2';

// ---------------------------------------------------------------------------
// 1. Wallpaper System
// ---------------------------------------------------------------------------
export type WallpaperCategory =
  | 'bloom'
  | 'abstract'
  | 'nature'
  | 'landscape'
  | 'minimal'
  | 'gradient'
  | 'solid'
  | 'personal';

export type WallpaperFitMode = 'fill' | 'fit' | 'stretch' | 'tile' | 'center' | 'span';

export interface WallpaperPreset {
  id: string;
  name: Record<LanguageId, string>;
  category: WallpaperCategory;
  kind: 'bloom' | 'gradient' | 'solid' | 'svg' | 'image';
  value: string;
  previewBg: string;
  isCustom?: boolean;
}

export const WALLPAPER_CATEGORIES: { id: WallpaperCategory | 'all'; label: Record<LanguageId, string> }[] = [
  { id: 'all', label: { vi: 'Tất cả', en: 'All' } },
  { id: 'bloom', label: { vi: 'Windows 11 Bloom', en: 'Windows 11 Bloom' } },
  { id: 'abstract', label: { vi: 'Trừu tượng', en: 'Abstract' } },
  { id: 'nature', label: { vi: 'Thiên nhiên', en: 'Nature' } },
  { id: 'landscape', label: { vi: 'Phong cảnh', en: 'Landscape' } },
  { id: 'minimal', label: { vi: 'Tối giản', en: 'Minimal' } },
  { id: 'gradient', label: { vi: 'Chuyển sắc', en: 'Gradient' } },
  { id: 'solid', label: { vi: 'Màu đơn sắc', en: 'Solid Color' } },
  { id: 'personal', label: { vi: 'Ảnh cá nhân', en: 'Personal Images' } },
];

export const WALLPAPER_FIT_MODES: { id: WallpaperFitMode; label: Record<LanguageId, string> }[] = [
  { id: 'fill', label: { vi: 'Lấp đầy (Fill)', en: 'Fill' } },
  { id: 'fit', label: { vi: 'Vừa khung (Fit)', en: 'Fit' } },
  { id: 'stretch', label: { vi: 'Kéo giãn (Stretch)', en: 'Stretch' } },
  { id: 'tile', label: { vi: 'Lặp ô (Tile)', en: 'Tile' } },
  { id: 'center', label: { vi: 'Căn giữa (Center)', en: 'Center' } },
  { id: 'span', label: { vi: 'Trải rộng (Span)', en: 'Span' } },
];

export const BUILTIN_WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'win11-bloom',
    name: { vi: 'Windows 11 Bloom', en: 'Windows 11 Bloom' },
    category: 'bloom',
    kind: 'bloom',
    value: 'bloom-default',
    previewBg: 'radial-gradient(circle at 50% 45%, #e0f2fe 0%, #60a5fa 50%, #1e3a8a 100%)',
  },
  {
    id: 'abstract-flow',
    name: { vi: 'Dòng chảy Fluent', en: 'Fluent Ribbon Flow' },
    category: 'abstract',
    kind: 'gradient',
    value: 'radial-gradient(circle at 20% 20%, #38bdf8 0%, transparent 45%), radial-gradient(circle at 80% 75%, #818cf8 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 100%)',
    previewBg: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #38bdf8 100%)',
  },
  {
    id: 'abstract-prism',
    name: { vi: 'Lăng kính Pastel', en: 'Pastel Prism' },
    category: 'abstract',
    kind: 'gradient',
    value: 'radial-gradient(circle at 75% 25%, #f472b6 0%, transparent 48%), radial-gradient(circle at 25% 75%, #38bdf8 0%, transparent 50%), linear-gradient(135deg, #e0f2fe 0%, #ede9fe 52%, #fce7f3 100%)',
    previewBg: 'linear-gradient(135deg, #e0f2fe 0%, #ede9fe 52%, #f472b6 100%)',
  },
  {
    id: 'nature-forest',
    name: { vi: 'Rừng thông sương sớm', en: 'Misty Pine Forest' },
    category: 'nature',
    kind: 'gradient',
    value: 'radial-gradient(circle at 50% 15%, rgba(255,255,255,0.45) 0%, transparent 55%), linear-gradient(180deg, #a7f3d0 0%, #10b981 42%, #065f46 82%, #022c22 100%)',
    previewBg: 'linear-gradient(180deg, #a7f3d0 0%, #059669 65%, #022c22 100%)',
  },
  {
    id: 'landscape-alpine',
    name: { vi: 'Hoàng hôn dãy núi', en: 'Alpine Sunset' },
    category: 'landscape',
    kind: 'gradient',
    value: 'radial-gradient(circle at 72% 28%, #fde047 0%, #fb923c 24%, transparent 55%), linear-gradient(180deg, #312e81 0%, #7c3aed 38%, #f97316 74%, #1e1b4b 100%)',
    previewBg: 'linear-gradient(180deg, #312e81 0%, #f97316 72%, #1e1b4b 100%)',
  },
  {
    id: 'minimal-frost',
    name: { vi: 'Sương mờ tối giản', en: 'Minimal Frost' },
    category: 'minimal',
    kind: 'gradient',
    value: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 52%, #cbd5e1 100%)',
    previewBg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
  },
  {
    id: 'gradient-aurora',
    name: { vi: 'Cực quang Bắc Âu', en: 'Nordic Aurora' },
    category: 'gradient',
    kind: 'gradient',
    value: 'radial-gradient(circle at 22% 35%, rgba(45, 212, 191, 0.72) 0%, transparent 50%), radial-gradient(circle at 78% 60%, rgba(56, 189, 248, 0.65) 0%, transparent 52%), linear-gradient(145deg, #020617 0%, #0f172a 60%, #164e63 100%)',
    previewBg: 'linear-gradient(145deg, #020617 0%, #0f766e 60%, #38bdf8 100%)',
  },
  {
    id: 'solid-slate',
    name: { vi: 'Xám Slate Fluent', en: 'Fluent Slate' },
    category: 'solid',
    kind: 'solid',
    value: '#1e293b',
    previewBg: '#1e293b',
  },
  {
    id: 'solid-ocean',
    name: { vi: 'Xanh biển sâu', en: 'Deep Ocean Blue' },
    category: 'solid',
    kind: 'solid',
    value: '#0b4f8a',
    previewBg: '#0b4f8a',
  },
];

// ---------------------------------------------------------------------------
// 2. Theme & Appearance Tokens
// ---------------------------------------------------------------------------
export type ThemeModePreference = 'light' | 'dark' | 'system' | 'custom';
export type ShadowIntensity = 'soft' | 'medium' | 'deep';
export type UiScaleMode = 'auto' | 'compact' | 'default' | 'comfortable';

export interface AccentColorPreset {
  id: string;
  label: Record<LanguageId, string>;
  hex: string;
  darkHex: string;
}

export const ACCENT_PRESETS: AccentColorPreset[] = [
  { id: 'blue', label: { vi: 'Xanh dương', en: 'Blue' }, hex: '#0067c0', darkHex: '#60cdff' },
  { id: 'purple', label: { vi: 'Tím', en: 'Purple' }, hex: '#7c3aed', darkHex: '#a78bfa' },
  { id: 'pink', label: { vi: 'Hồng', en: 'Pink' }, hex: '#db2777', darkHex: '#f472b6' },
  { id: 'orange', label: { vi: 'Cam', en: 'Orange' }, hex: '#ea580c', darkHex: '#fb923c' },
  { id: 'green', label: { vi: 'Xanh lá', en: 'Green' }, hex: '#059669', darkHex: '#34d399' },
  { id: 'cyan', label: { vi: 'Xanh ngọc', en: 'Cyan' }, hex: '#0891b2', darkHex: '#22d3ee' },
  { id: 'red', label: { vi: 'Đỏ', en: 'Red' }, hex: '#dc2626', darkHex: '#f87171' },
];

export interface AppearanceConfig {
  accentColor: string;
  desktopBgColor: string;
  windowSurfaceColor: string;
  taskbarBgColor: string;
  transparency: number; // 40..96
  micaEnabled: boolean;
  acrylicEnabled: boolean;
  borderRadius: number; // 8..24
  shadowIntensity: ShadowIntensity;
  motionEnabled: boolean;
  uiScale?: UiScaleMode;
}

export interface CustomThemePreset {
  id: string;
  name: string;
  baseIsDark: boolean;
  appearance: AppearanceConfig;
}

export const DEFAULT_APPEARANCE: AppearanceConfig = {
  accentColor: '#0067c0',
  desktopBgColor: '',
  windowSurfaceColor: '',
  taskbarBgColor: '',
  transparency: 76,
  micaEnabled: true,
  acrylicEnabled: true,
  borderRadius: 16,
  shadowIntensity: 'medium',
  motionEnabled: true,
  uiScale: 'auto',
};

// ---------------------------------------------------------------------------
// 3. Desktop Icons & Layout
// ---------------------------------------------------------------------------
export type DesktopIconSize = 'small' | 'medium' | 'large';
export type DesktopIconSortBy = 'name' | 'type' | 'dateModified';
export type DesktopIconView = 'grid' | 'list';
export type DesktopIconGap = 'compact' | 'normal' | 'relaxed';

export interface DesktopShortcutItem {
  id: string;
  label: Record<LanguageId, string>;
  iconKey: WindowsIconKey;
  type: 'system' | 'folder' | 'app';
  modifiedAt: number;
  x: number;
  y: number;
  targetWindow?: WindowId;
  explorerPath?: string;
}

export interface DesktopLayoutConfig {
  showIcons: boolean;
  showLabels: boolean;
  iconSize: DesktopIconSize;
  iconView: DesktopIconView;
  iconGap: DesktopIconGap;
  autoArrange: boolean;
  snapToGrid: boolean;
  showWidgets: boolean;
  widgetLayoutMode: 'free' | 'grid';
  widgetSnapToGrid: boolean;
}

export const DEFAULT_DESKTOP_SHORTCUTS: DesktopShortcutItem[] = [
  {
    id: 'this-pc',
    label: { vi: 'This PC', en: 'This PC' },
    iconKey: 'thisPc',
    type: 'system',
    modifiedAt: 1731900000000,
    x: 20,
    y: 20,
    targetWindow: 'explorer',
    explorerPath: 'This PC',
  },
  {
    id: 'recycle-bin',
    label: { vi: 'Thùng rác', en: 'Recycle Bin' },
    iconKey: 'recycleBin',
    type: 'system',
    modifiedAt: 1731800000000,
    x: 20,
    y: 112,
    targetWindow: 'explorer',
    explorerPath: 'Recycle Bin',
  },
  {
    id: 'shortcut-settings',
    label: { vi: 'Cài đặt', en: 'Settings' },
    iconKey: 'settings',
    type: 'system',
    modifiedAt: 1731700000000,
    x: 20,
    y: 204,
    targetWindow: 'settings',
  },
  {
    id: 'documents',
    label: { vi: 'Tài liệu', en: 'Documents' },
    iconKey: 'documents',
    type: 'folder',
    modifiedAt: 1731600000000,
    x: 20,
    y: 296,
    targetWindow: 'explorer',
    explorerPath: 'Documents',
  },
  {
    id: 'downloads',
    label: { vi: 'Tải xuống', en: 'Downloads' },
    iconKey: 'downloads',
    type: 'folder',
    modifiedAt: 1731500000000,
    x: 20,
    y: 388,
    targetWindow: 'explorer',
    explorerPath: 'Downloads',
  },
  {
    id: 'pictures',
    label: { vi: 'Hình ảnh', en: 'Pictures' },
    iconKey: 'pictures',
    type: 'folder',
    modifiedAt: 1731400000000,
    x: 112,
    y: 20,
    targetWindow: 'explorer',
    explorerPath: 'Pictures',
  },
  {
    id: 'browser',
    label: { vi: 'Trình duyệt', en: 'Browser' },
    iconKey: 'edge',
    type: 'app',
    modifiedAt: 1731300000000,
    x: 112,
    y: 112,
  },
  {
    id: 'applications',
    label: { vi: 'Ứng dụng', en: 'Applications' },
    iconKey: 'applications',
    type: 'app',
    modifiedAt: 1731200000000,
    x: 112,
    y: 204,
    targetWindow: 'startMenu',
  },
];

export const DEFAULT_DESKTOP_LAYOUT: DesktopLayoutConfig = {
  showIcons: true,
  showLabels: true,
  iconSize: 'medium',
  iconView: 'grid',
  iconGap: 'normal',
  autoArrange: false,
  snapToGrid: true,
  showWidgets: true,
  widgetLayoutMode: 'free',
  widgetSnapToGrid: true,
};

// ---------------------------------------------------------------------------
// 4. Desktop Widgets (16 Types!)
// ---------------------------------------------------------------------------
export type WidgetType =
  | 'digital-clock'
  | 'analog-clock'
  | 'calendar'
  | 'weather'
  | 'todo'
  | 'notes'
  | 'sticky-note'
  | 'system-monitor'
  | 'battery'
  | 'quick-links'
  | 'recent-apps'
  | 'world-clock'
  | 'photo-gallery'
  | 'music-player'
  | 'focus-timer'
  | 'productivity';

export type WidgetVisualStyle = 'glass' | 'mica' | 'acrylic' | 'flat' | 'transparent' | 'solid';

export interface WidgetStyleSettings {
  visualStyle: WidgetVisualStyle;
  borderRadius: number;
  opacity: number;
  blur: number;
  shadow: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  textColor: string;
  accentColor: string;
  solidBgColor: string;
}

export interface DesktopWidgetInstance {
  id: string;
  type: WidgetType;
  desktopId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zOrder: number;
  collapsed: boolean;
  locked: boolean;
  alwaysOnTop: boolean;
  visible: boolean;
  style: WidgetStyleSettings;
  data?: Record<string, unknown>;
}

export interface WidgetCatalogItem {
  type: WidgetType;
  title: Record<LanguageId, string>;
  description: Record<LanguageId, string>;
  iconKey: WindowsIconKey;
  defaultSize: { width: number; height: number };
}

export const DEFAULT_WIDGET_STYLE: WidgetStyleSettings = {
  visualStyle: 'acrylic',
  borderRadius: 18,
  opacity: 82,
  blur: 24,
  shadow: true,
  fontSize: 'md',
  textColor: '',
  accentColor: '',
  solidBgColor: '#1e293b',
};

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    type: 'digital-clock',
    title: { vi: 'Đồng hồ số', en: 'Digital Clock' },
    description: { vi: 'Hiển thị giờ, giây và thứ ngày trực tiếp', en: 'Live digital time and date' },
    iconKey: 'clock',
    defaultSize: { width: 250, height: 140 },
  },
  {
    type: 'analog-clock',
    title: { vi: 'Đồng hồ kim', en: 'Analog Clock' },
    description: { vi: 'Đồng hồ kim Fluent chuyển động mượt', en: 'Smooth ticking Fluent analog clock' },
    iconKey: 'clock',
    defaultSize: { width: 210, height: 220 },
  },
  {
    type: 'calendar',
    title: { vi: 'Lịch tháng', en: 'Calendar' },
    description: { vi: 'Lịch tháng hiện tại đánh dấu ngày hôm nay', en: 'Interactive monthly calendar' },
    iconKey: 'calendar',
    defaultSize: { width: 270, height: 270 },
  },
  {
    type: 'weather',
    title: { vi: 'Thời tiết', en: 'Weather' },
    description: { vi: 'Nhiệt độ & dự báo tại Ann Arbor, Michigan', en: 'Live temperature & 3-day forecast' },
    iconKey: 'weather',
    defaultSize: { width: 260, height: 180 },
  },
  {
    type: 'todo',
    title: { vi: 'Danh sách công việc', en: 'To-do List' },
    description: { vi: 'Thêm, đánh dấu hoàn thành & xóa việc', en: 'Track and toggle tasks directly' },
    iconKey: 'todo',
    defaultSize: { width: 270, height: 250 },
  },
  {
    type: 'notes',
    title: { vi: 'Ghi chú nhanh', en: 'Quick Notes' },
    description: { vi: 'Soạn nhanh ghi chú ngay trên Desktop', en: 'Quick inline desktop notepad' },
    iconKey: 'notes',
    defaultSize: { width: 250, height: 210 },
  },
  {
    type: 'sticky-note',
    title: { vi: 'Giấy ghi chú', en: 'Sticky Note' },
    description: { vi: 'Tờ giấy nhắc việc màu vàng nổi bật', en: 'Classic warm sticky reminder note' },
    iconKey: 'notepad',
    defaultSize: { width: 230, height: 200 },
  },
  {
    type: 'system-monitor',
    title: { vi: 'Giám sát hệ thống', en: 'System Monitor' },
    description: { vi: 'Thông số CPU / RAM / GPU mô phỏng trong app', en: 'Simulated CPU, RAM & Disk telemetry' },
    iconKey: 'systemMonitor',
    defaultSize: { width: 265, height: 195 },
  },
  {
    type: 'battery',
    title: { vi: 'Trạng thái pin', en: 'Battery Status' },
    description: { vi: 'Mức pin & chế độ tiết kiệm pin mô phỏng', en: 'Simulated battery & power mode' },
    iconKey: 'battery',
    defaultSize: { width: 230, height: 145 },
  },
  {
    type: 'quick-links',
    title: { vi: 'Liên kết nhanh', en: 'Quick Links' },
    description: { vi: 'Mở nhanh Cài đặt, Tệp, Ghi chú, Paint', en: 'One-click launch for core apps' },
    iconKey: 'quickLinks',
    defaultSize: { width: 260, height: 165 },
  },
  {
    type: 'recent-apps',
    title: { vi: 'Ứng dụng gần đây', en: 'Recent Apps' },
    description: { vi: 'Truy cập nhanh các ứng dụng vừa mở', en: 'Recently opened apps & files' },
    iconKey: 'apps',
    defaultSize: { width: 260, height: 185 },
  },
  {
    type: 'world-clock',
    title: { vi: 'Đồng hồ thế giới', en: 'World Clock' },
    description: { vi: 'Giờ quốc tế Hà Nội, Tokyo, London, New York', en: 'Multi-timezone live world clock' },
    iconKey: 'network',
    defaultSize: { width: 270, height: 205 },
  },
  {
    type: 'photo-gallery',
    title: { vi: 'Bộ sưu tập ảnh', en: 'Photo Gallery' },
    description: { vi: 'Trình chiếu bộ hình nền Fluent yêu thích', en: 'Curated Fluent art showcase' },
    iconKey: 'photos',
    defaultSize: { width: 255, height: 190 },
  },
  {
    type: 'music-player',
    title: { vi: 'Trình phát nhạc', en: 'Music Player' },
    description: { vi: 'Điều khiển nhạc & phát giai điệu thư giãn', en: 'Play/pause ambient Fluent audio' },
    iconKey: 'mediaPlayer',
    defaultSize: { width: 275, height: 175 },
  },
  {
    type: 'focus-timer',
    title: { vi: 'Đồng hồ tập trung', en: 'Focus Timer' },
    description: { vi: 'Bộ đếm ngược Pomodoro 25 phút thực tế', en: 'Working 25-min Pomodoro timer' },
    iconKey: 'timer',
    defaultSize: { width: 245, height: 175 },
  },
  {
    type: 'productivity',
    title: { vi: 'Bảng năng suất', en: 'Productivity Hub' },
    description: { vi: 'Tổng hợp tiến độ công việc & tập trung', en: 'Daily focus & task completion summary' },
    iconKey: 'productivity',
    defaultSize: { width: 275, height: 190 },
  },
];

export const DEFAULT_DESKTOP_WIDGETS: DesktopWidgetInstance[] = [
  {
    id: 'w-clock-1',
    type: 'digital-clock',
    desktopId: 'desktop-1',
    x: 260,
    y: 28,
    width: 250,
    height: 140,
    zOrder: 1,
    collapsed: false,
    locked: false,
    alwaysOnTop: false,
    visible: true,
    style: { ...DEFAULT_WIDGET_STYLE },
  },
  {
    id: 'w-weather-1',
    type: 'weather',
    desktopId: 'desktop-1',
    x: 260,
    y: 184,
    width: 260,
    height: 176,
    zOrder: 2,
    collapsed: false,
    locked: false,
    alwaysOnTop: false,
    visible: true,
    style: { ...DEFAULT_WIDGET_STYLE },
  },
  {
    id: 'w-todo-1',
    type: 'todo',
    desktopId: 'desktop-1',
    x: 536,
    y: 28,
    width: 265,
    height: 245,
    zOrder: 3,
    collapsed: false,
    locked: false,
    alwaysOnTop: false,
    visible: true,
    style: { ...DEFAULT_WIDGET_STYLE },
  },
];

// ---------------------------------------------------------------------------
// 5. Virtual Desktops
// ---------------------------------------------------------------------------
export interface VirtualDesktop {
  id: string;
  name: string;
  wallpaperId?: string;
}

export const DEFAULT_VIRTUAL_DESKTOPS: VirtualDesktop[] = [
  { id: 'desktop-1', name: 'Work' },
  { id: 'desktop-2', name: 'Personal', wallpaperId: 'abstract-flow' },
  { id: 'desktop-3', name: 'Productivity', wallpaperId: 'gradient-aurora' },
];

// ---------------------------------------------------------------------------
// 6. Quick Settings & Notifications
// ---------------------------------------------------------------------------
export interface QuickSettingsState {
  wifi: boolean;
  bluetooth: boolean;
  airplaneMode: boolean;
  batterySaver: boolean;
  nightLight: boolean;
  accessibilityHighContrast: boolean;
  volume: number; // 0..100
  brightness: number; // 35..100
}

export const DEFAULT_QUICK_SETTINGS: QuickSettingsState = {
  wifi: true,
  bluetooth: true,
  airplaneMode: false,
  batterySaver: false,
  nightLight: false,
  accessibilityHighContrast: false,
  volume: 72,
  brightness: 100,
};

export interface DesktopNotification {
  id: string;
  title: Record<LanguageId, string>;
  body: Record<LanguageId, string>;
  timeLabel: string;
  read: boolean;
  iconKey: WindowsIconKey;
}

export const DEFAULT_NOTIFICATIONS: DesktopNotification[] = [
  {
    id: 'notif-welcome',
    title: { vi: 'Windows 11 Desktop đã sẵn sàng', en: 'Windows 11 Desktop ready' },
    body: {
      vi: 'Nhấn chuột phải vào Desktop hoặc Taskbar để tùy chỉnh giao diện, Widget và Virtual Desktop.',
      en: 'Right-click the Desktop or Taskbar to customize themes, Widgets, and Virtual Desktops.',
    },
    timeLabel: 'Vừa xong',
    read: false,
    iconKey: 'sparkle',
  },
  {
    id: 'notif-weather',
    title: { vi: 'Thời tiết Ann Arbor, Michigan', en: 'Weather · Ann Arbor, Michigan' },
    body: {
      vi: 'Hiện tại 65° F · Nhiều mây. Cao nhất 74° F.',
      en: 'Currently 65° F · Cloudy. High 74° F.',
    },
    timeLabel: '10 phút trước',
    read: false,
    iconKey: 'weather',
  },
];

// ---------------------------------------------------------------------------
// 7. Extended Taskbar & Start Menu Preferences
// ---------------------------------------------------------------------------
export type TaskbarSizeId = 'small' | 'medium' | 'large';
export type TaskbarCornerId = 'rounded' | 'pill' | 'square';
export type StartButtonIconId = 'fluent' | 'classic' | 'minimal';

export interface ExtendedTaskbarPrefs {
  size: TaskbarSizeId;
  transparency: number; // 45..98
  bgColor: string;
  acrylic: boolean;
  mica: boolean;
  showBorder: boolean;
  showShadow: boolean;
  cornerStyle: TaskbarCornerId;
  showStartButton: boolean;
  startButtonSize: TaskbarSizeId;
  startIconStyle: StartButtonIconId;
  showWifi: boolean;
  showVolume: boolean;
  showBattery: boolean;
  showBluetooth: boolean;
  showNotifications: boolean;
  showTaskView: boolean;
}

export const DEFAULT_EXTENDED_TASKBAR: ExtendedTaskbarPrefs = {
  size: 'medium',
  transparency: 76,
  bgColor: '',
  acrylic: true,
  mica: true,
  showBorder: true,
  showShadow: true,
  cornerStyle: 'rounded',
  showStartButton: true,
  startButtonSize: 'medium',
  startIconStyle: 'fluent',
  showWifi: true,
  showVolume: true,
  showBattery: true,
  showBluetooth: true,
  showNotifications: true,
  showTaskView: true,
};

export interface StartMenuPrefs {
  pinnedColumns: 4 | 6 | 8;
  showRecommended: boolean;
  pinnedOrder: string[];
}

export const DEFAULT_START_MENU_PREFS: StartMenuPrefs = {
  pinnedColumns: 6,
  showRecommended: true,
  pinnedOrder: [],
};

// ---------------------------------------------------------------------------
// 8. Window Geometry & Snap Zones
// ---------------------------------------------------------------------------
export type SnapZoneId =
  | 'left-half'
  | 'right-half'
  | 'top-half'
  | 'bottom-half'
  | 'left-70'
  | 'right-30'
  | 'col-3-left'
  | 'col-3-center'
  | 'col-3-right'
  | 'quad-tl'
  | 'quad-tr'
  | 'quad-bl'
  | 'quad-br';

export interface SavedWindowBounds {
  x: number;
  y: number;
  width?: number;
  height?: number;
  snapZone?: SnapZoneId | null;
}

export type WindowBoundsMap = Partial<Record<WindowId, SavedWindowBounds>>;
export type WindowDesktopMap = Partial<Record<WindowId, string>>;
