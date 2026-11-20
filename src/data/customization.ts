import { LanguageId } from './desktopData';

export type FontId = 'play' | 'jakarta' | 'outfit' | 'manrope' | 'jetbrains';
export type TaskbarStyleId = 'floating' | 'full' | 'pill' | 'compact';
export type TaskbarPositionId = 'bottom' | 'top' | 'left' | 'right';
export type StartMenuStyleId = 'classic' | 'compact' | 'tiles' | 'sidebar';
export type TaskbarAlignmentId = 'center' | 'left';
export type TaskbarSearchModeId = 'pill' | 'icon' | 'hidden';

export interface TaskbarConfig {
  alignment: TaskbarAlignmentId;
  searchMode: TaskbarSearchModeId;
  showWeather: boolean;
  showLanguageToggle: boolean;
  showThemeToggle: boolean;
  showClock: boolean;
  autoHide: boolean;
  showRunningIndicator: boolean;
  pinnedAppIds: string[];
}

export const DEFAULT_TASKBAR_PINNED_IDS: string[] = [
  'start',
  'settings',
  'notes',
  'calculator',
  'paint',
  'word',
  'excel',
  'outlook',
  'welcome',
  'weather',
];

export const DEFAULT_TASKBAR_CONFIG: TaskbarConfig = {
  alignment: 'center',
  searchMode: 'pill',
  showWeather: true,
  showLanguageToggle: true,
  showThemeToggle: true,
  showClock: true,
  autoHide: false,
  showRunningIndicator: true,
  pinnedAppIds: DEFAULT_TASKBAR_PINNED_IDS,
};

export const FONT_STORAGE_KEY = 'win12-ui-font';
export const TASKBAR_STYLE_STORAGE_KEY = 'win12-ui-taskbar-style';
export const TASKBAR_POS_STORAGE_KEY = 'win12-ui-taskbar-pos';
export const TASKBAR_CONFIG_STORAGE_KEY = 'win12-ui-taskbar-config';
export const START_MENU_STYLE_STORAGE_KEY = 'win12-ui-startmenu-style';

export interface FontOption {
  id: FontId;
  name: string;
  fontFamily: string;
  description: Record<LanguageId, string>;
  isDefault?: boolean;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'play',
    name: 'Play',
    fontFamily: "'Play', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    description: {
      vi: 'Hiện đại, sắc nét (Mặc định)',
      en: 'Geometric, crisp (Default)',
    },
    isDefault: true,
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    description: {
      vi: 'Mềm mại, tối ưu đọc nội dung dài',
      en: 'Balanced geometric sans for reading',
    },
  },
  {
    id: 'outfit',
    name: 'Outfit',
    fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
    description: {
      vi: 'Tròn trịa, tối giản kiểu Fluent',
      en: 'Clean modern geometric display',
    },
  },
  {
    id: 'manrope',
    name: 'Manrope',
    fontFamily: "'Manrope', 'Plus Jakarta Sans', sans-serif",
    description: {
      vi: 'Gọn gàng, chuyên nghiệp cho bảng số liệu',
      en: 'Crisp humanist neo-grotesque',
    },
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', monospace",
    description: {
      vi: 'Đơn cách, phong cách kỹ thuật',
      en: 'Technical monospace precision',
    },
  },
];

export interface TaskbarStyleOption {
  id: TaskbarStyleId;
  label: Record<LanguageId, string>;
  subtitle: Record<LanguageId, string>;
}

export const TASKBAR_STYLE_OPTIONS: TaskbarStyleOption[] = [
  {
    id: 'floating',
    label: { vi: 'Dock nổi (Win 12)', en: 'Floating Dock' },
    subtitle: { vi: 'Tách viền bo góc + khay hệ thống riêng', en: 'Detached dock + separate tray pill' },
  },
  {
    id: 'full',
    label: { vi: 'Tràn viền (Full Bar)', en: 'Full Edge Bar' },
    subtitle: { vi: 'Thanh kính mờ liền mạch toàn cạnh màn hình', en: 'Edge-to-edge unified acrylic bar' },
  },
  {
    id: 'pill',
    label: { vi: 'Viên nang (Unified Pill)', en: 'Unified Capsule' },
    subtitle: { vi: 'Gộp ứng dụng và đồng hồ trong một dải bo tròn', en: 'Single rounded pill with apps & tray' },
  },
  {
    id: 'compact',
    label: { vi: 'Tối giản (Compact)', en: 'Compact Minimal' },
    subtitle: { vi: 'Thanh gọn nhẹ, tiết kiệm không gian hiển thị', en: 'Slimmer dock with tighter icon spacing' },
  },
];

export interface TaskbarPositionOption {
  id: TaskbarPositionId;
  label: Record<LanguageId, string>;
}

export const TASKBAR_POSITION_OPTIONS: TaskbarPositionOption[] = [
  { id: 'bottom', label: { vi: 'Dưới (Bottom)', en: 'Bottom' } },
  { id: 'top', label: { vi: 'Trên (Top)', en: 'Top' } },
  { id: 'left', label: { vi: 'Trái (Left)', en: 'Left' } },
  { id: 'right', label: { vi: 'Phải (Right)', en: 'Right' } },
];

export interface StartMenuStyleOption {
  id: StartMenuStyleId;
  shortLabel: Record<LanguageId, string>;
  label: Record<LanguageId, string>;
  subtitle: Record<LanguageId, string>;
}

export const START_MENU_STYLE_OPTIONS: StartMenuStyleOption[] = [
  {
    id: 'classic',
    shortLabel: { vi: 'Chuẩn Win 12', en: 'Classic' },
    label: { vi: 'Chuẩn Windows 12', en: 'Classic Windows 12' },
    subtitle: { vi: 'Lưới ứng dụng đã ghim + mục đề xuất', en: 'Pinned grid + recommended feed' },
  },
  {
    id: 'compact',
    shortLabel: { vi: 'Danh sách gọn', en: 'Compact' },
    label: { vi: 'Danh sách tối giản', en: 'Compact List' },
    subtitle: { vi: 'Danh sách 2 cột gọn nhẹ, tìm nhanh', en: 'Clean two-column quick launcher' },
  },
  {
    id: 'tiles',
    shortLabel: { vi: 'Ô thẻ Fluent', en: 'Tiles' },
    label: { vi: 'Ô thẻ Bento Fluent', en: 'Fluent Bento Tiles' },
    subtitle: { vi: 'Thẻ kính mờ kết hợp widget thời tiết', en: 'Glass tiles with live weather card' },
  },
  {
    id: 'sidebar',
    shortLabel: { vi: 'Chia 2 cột', en: 'Split' },
    label: { vi: 'Chia cột hiện đại', en: 'Modern Split Sidebar' },
    subtitle: { vi: 'Thanh lối tắt bên trái + ứng dụng bên phải', en: 'Left quick rail + right app canvas' },
  },
];
