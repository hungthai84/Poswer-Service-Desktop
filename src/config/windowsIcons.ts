import React from 'react';
import {
  Accessibility20Regular,
  Add20Regular,
  Airplane20Regular,
  Alert20Filled,
  Alert20Regular,
  AppGeneric20Regular,
  Apps20Regular,
  ArrowClockwise20Regular,
  ArrowDownload20Regular,
  Battery1020Regular,
  BatteryCharge20Regular,
  BatterySaver20Regular,
  Bluetooth20Filled,
  Bluetooth20Regular,
  BrightnessHigh20Filled,
  BrightnessHigh20Regular,
  Calculator20Filled,
  Calculator20Regular,
  Calendar20Filled,
  Calendar20Regular,
  Camera20Regular,
  ChevronUp20Regular,
  Clock20Filled,
  Clock20Regular,
  Color20Regular,
  DarkTheme20Regular,
  DataTrending20Regular,
  Delete20Regular,
  Desktop20Filled,
  Desktop20Regular,
  Dismiss20Regular,
  Document20Regular,
  Folder20Filled,
  Folder20Regular,
  Gauge20Regular,
  Globe20Filled,
  Globe20Regular,
  Grid20Filled,
  Grid20Regular,
  Home20Regular,
  Image20Filled,
  Image20Regular,
  Laptop20Regular,
  Link20Regular,
  LockClosed20Regular,
  Maximize20Regular,
  MoreHorizontal20Regular,
  MusicNote220Regular,
  Note20Filled,
  Note20Regular,
  PaintBrush20Filled,
  PaintBrush20Regular,
  PanelBottom20Regular,
  Pause20Regular,
  Person20Regular,
  Play20Regular,
  Power20Filled,
  Power20Regular,
  Previous20Regular,
  Next20Regular,
  Resize20Regular,
  Search20Filled,
  Search20Regular,
  Settings20Filled,
  Settings20Regular,
  ShieldCheckmark20Regular,
  Sleep20Regular,
  Sparkle20Regular,
  Speaker220Filled,
  Speaker220Regular,
  SquareMultiple20Regular,
  StoreMicrosoft20Regular,
  Subtract20Regular,
  TaskListSquareLtr20Regular,
  Timer20Regular,
  Video20Regular,
  WeatherMoon20Filled,
  WeatherMoon20Regular,
  WeatherPartlyCloudyDay20Filled,
  WeatherPartlyCloudyDay20Regular,
  WeatherSunny20Regular,
  Wifi120Filled,
  Wifi120Regular,
  WindowMultiple20Filled,
  WindowMultiple20Regular,
} from '@fluentui/react-icons';

export type WindowsIconKey =
  | 'start'
  | 'search'
  | 'settings'
  | 'power'
  | 'sleep'
  | 'restart'
  | 'lock'
  | 'user'
  | 'notification'
  | 'calendar'
  | 'clock'
  | 'explorer'
  | 'edge'
  | 'photos'
  | 'calculator'
  | 'notepad'
  | 'paint'
  | 'camera'
  | 'mediaPlayer'
  | 'store'
  | 'thisPc'
  | 'recycleBin'
  | 'documents'
  | 'downloads'
  | 'network'
  | 'pictures'
  | 'videos'
  | 'applications'
  | 'wifi'
  | 'volume'
  | 'battery'
  | 'batteryCharging'
  | 'batterySaver'
  | 'bluetooth'
  | 'language'
  | 'hiddenIcons'
  | 'weather'
  | 'notes'
  | 'productivity'
  | 'systemMonitor'
  | 'taskView'
  | 'taskbar'
  | 'personalization'
  | 'theme'
  | 'accessibility'
  | 'privacy'
  | 'apps'
  | 'home'
  | 'airplane'
  | 'nightLight'
  | 'brightness'
  | 'sun'
  | 'moon'
  | 'todo'
  | 'timer'
  | 'quickLinks'
  | 'grid'
  | 'add'
  | 'close'
  | 'minimize'
  | 'maximize'
  | 'restore'
  | 'play'
  | 'pause'
  | 'prev'
  | 'next'
  | 'resize'
  | 'more'
  | 'sparkle'
  | 'desktop';

interface IconPair {
  regular: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  filled?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const WINDOWS_ICON_MAP: Record<WindowsIconKey, IconPair> = {
  // System
  start: { regular: Grid20Regular, filled: Grid20Filled },
  search: { regular: Search20Regular, filled: Search20Filled },
  settings: { regular: Settings20Regular, filled: Settings20Filled },
  power: { regular: Power20Regular, filled: Power20Filled },
  sleep: { regular: Sleep20Regular },
  restart: { regular: ArrowClockwise20Regular },
  lock: { regular: LockClosed20Regular },
  user: { regular: Person20Regular },
  notification: { regular: Alert20Regular, filled: Alert20Filled },
  calendar: { regular: Calendar20Regular, filled: Calendar20Filled },
  clock: { regular: Clock20Regular, filled: Clock20Filled },

  // Applications
  explorer: { regular: Folder20Regular, filled: Folder20Filled },
  edge: { regular: Globe20Regular, filled: Globe20Filled },
  photos: { regular: Image20Regular, filled: Image20Filled },
  calculator: { regular: Calculator20Regular, filled: Calculator20Filled },
  notepad: { regular: Note20Regular, filled: Note20Filled },
  paint: { regular: PaintBrush20Regular, filled: PaintBrush20Filled },
  camera: { regular: Camera20Regular },
  mediaPlayer: { regular: MusicNote220Regular },
  store: { regular: StoreMicrosoft20Regular },

  // Desktop
  thisPc: { regular: Desktop20Regular, filled: Desktop20Filled },
  recycleBin: { regular: Delete20Regular },
  documents: { regular: Document20Regular },
  downloads: { regular: ArrowDownload20Regular },
  network: { regular: Globe20Regular, filled: Globe20Filled },
  pictures: { regular: Image20Regular, filled: Image20Filled },
  videos: { regular: Video20Regular },
  applications: { regular: Apps20Regular },

  // Taskbar
  wifi: { regular: Wifi120Regular, filled: Wifi120Filled },
  volume: { regular: Speaker220Regular, filled: Speaker220Filled },
  battery: { regular: Battery1020Regular },
  batteryCharging: { regular: BatteryCharge20Regular },
  batterySaver: { regular: BatterySaver20Regular },
  bluetooth: { regular: Bluetooth20Regular, filled: Bluetooth20Filled },
  language: { regular: Globe20Regular, filled: Globe20Filled },
  hiddenIcons: { regular: ChevronUp20Regular },

  // Widgets & Desktop UI
  weather: { regular: WeatherPartlyCloudyDay20Regular, filled: WeatherPartlyCloudyDay20Filled },
  notes: { regular: Note20Regular, filled: Note20Filled },
  productivity: { regular: DataTrending20Regular },
  systemMonitor: { regular: Gauge20Regular },
  taskView: { regular: WindowMultiple20Regular, filled: WindowMultiple20Filled },
  taskbar: { regular: PanelBottom20Regular },
  personalization: { regular: Color20Regular },
  theme: { regular: DarkTheme20Regular },
  accessibility: { regular: Accessibility20Regular },
  privacy: { regular: ShieldCheckmark20Regular },
  apps: { regular: AppGeneric20Regular },
  home: { regular: Home20Regular },
  airplane: { regular: Airplane20Regular },
  nightLight: { regular: WeatherMoon20Regular, filled: WeatherMoon20Filled },
  brightness: { regular: BrightnessHigh20Regular, filled: BrightnessHigh20Filled },
  sun: { regular: WeatherSunny20Regular },
  moon: { regular: WeatherMoon20Regular, filled: WeatherMoon20Filled },
  todo: { regular: TaskListSquareLtr20Regular },
  timer: { regular: Timer20Regular },
  quickLinks: { regular: Link20Regular },
  grid: { regular: Grid20Regular, filled: Grid20Filled },
  add: { regular: Add20Regular },
  close: { regular: Dismiss20Regular },
  minimize: { regular: Subtract20Regular },
  maximize: { regular: Maximize20Regular },
  restore: { regular: SquareMultiple20Regular },
  play: { regular: Play20Regular },
  pause: { regular: Pause20Regular },
  prev: { regular: Previous20Regular },
  next: { regular: Next20Regular },
  resize: { regular: Resize20Regular },
  more: { regular: MoreHorizontal20Regular },
  sparkle: { regular: Sparkle20Regular },
  desktop: { regular: Laptop20Regular },
};

export interface WindowsSystemIconProps {
  name: WindowsIconKey;
  active?: boolean;
  size?: number;
  className?: string;
}

export const WindowsSystemIcon: React.FC<WindowsSystemIconProps> = ({
  name,
  active = false,
  size = 20,
  className = '',
}) => {
  const pair = WINDOWS_ICON_MAP[name] ?? WINDOWS_ICON_MAP.apps;
  const IconComp = active && pair.filled ? pair.filled : pair.regular;
  return React.createElement(IconComp, {
    className: `shrink-0 ${className}`,
    style: { width: size, height: size, fontSize: size },
  });
};
