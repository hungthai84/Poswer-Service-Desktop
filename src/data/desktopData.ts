export type WindowId =
  | 'welcome'
  | 'settings'
  | 'weather'
  | 'startMenu'
  | 'notes'
  | 'calculator'
  | 'paint'
  | 'explorer'
  | 'taskManager';
export type LanguageId = 'vi' | 'en';

export const LANGUAGE_STORAGE_KEY = 'win12-ui-concept-lang';

export type AppIconKey =
  | 'edge'
  | 'word'
  | 'excel'
  | 'powerpoint'
  | 'outlook'
  | 'calendar'
  | 'xbox'
  | 'codepen'
  | 'netflix'
  | 'teams'
  | 'access'
  | 'office'
  | 'onedrive'
  | 'onenote'
  | 'project'
  | 'sharepoint'
  | 'spotify'
  | 'photoshop'
  | 'notes'
  | 'calculator'
  | 'paint'
  | 'explorer';

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
}

export interface PinnedApp {
  id: string;
  name: string;
  icon: AppIconKey;
  linkedWindow?: WindowId;
}

export interface RecommendedItem {
  id: string;
  title: string;
  subtitle: Record<LanguageId, string>;
  icon: AppIconKey;
}

export interface ForecastDay {
  label: Record<LanguageId, string>;
  temp: string;
  condition: 'sunny' | 'rain' | 'fog';
}

export interface WeatherData {
  currentTemp: string;
  taskbarTemp: string;
  condition: Record<LanguageId, string>;
  high: Record<LanguageId, string>;
  low: Record<LanguageId, string>;
  location: string;
  forecast: ForecastDay[];
}

export interface SettingsNavItem {
  id: string;
  label: Record<LanguageId, string>;
  iconName:
    | 'system'
    | 'bluetooth'
    | 'network'
    | 'personalization'
    | 'taskbar'
    | 'widgets'
    | 'apps'
    | 'account'
    | 'time'
    | 'gaming'
    | 'accessibility'
    | 'privacy'
    | 'update';
  summary: Record<LanguageId, string>;
}

export interface PersonalizationOption {
  id: string;
  title: Record<LanguageId, string>;
  subtitle: Record<LanguageId, string>;
  iconName: 'background' | 'colors' | 'lock' | 'themes';
}

export interface TaskbarPinnedApp {
  id: string;
  label: Record<LanguageId, string>;
  icon?: AppIconKey;
  windowId?: WindowId;
  systemIcon?:
    | 'start'
    | 'settings'
    | 'welcome'
    | 'weather'
    | 'notes'
    | 'calculator'
    | 'paint'
    | 'explorer';
  locked?: boolean;
}

export const USER_PROFILE: UserProfile = {
  name: 'Josh Salazar',
  email: 'joshua.a.salazar@gmail.com',
  initials: 'JS',
};

export const LOGIN_ACCOUNT = {
  username: 'Admin',
  password: '',
  initials: 'AD',
} as const;

export const UI_TEXT = {
  vi: {
    login: {
      title: 'Chào mừng trở lại',
      usernameLabel: 'Tên đăng nhập',
      usernamePlaceholder: 'Nhập tên đăng nhập',
      passwordLabel: 'Mật khẩu',
      passwordPlaceholder: 'Để trống mật khẩu',
      signInButton: 'Đăng nhập',
      signingIn: 'Đang đăng nhập...',
      hint: 'Tài khoản tạm: Admin · Mật khẩu: để trống',
      errorMessage: 'Vui lòng nhập tài khoản Admin và để trống mật khẩu.',
      lockLabel: 'Khóa màn hình',
    },
    welcome: {
      windowTitle: 'Chào mừng',
      bannerTitle: 'Windows 12',
      bannerSubtitle: 'Fluent Design',
      intro:
        'Chào mừng bạn đến với bản dựng giao diện Windows 12 Fluent UI. Giao diện được thiết kế theo ngôn ngữ Fluent mới với hiệu ứng kính mờ Acrylic/Mica, thanh Dock nổi, bộ icon Windows thế hệ mới và hỗ trợ song ngữ.',
      listHeading: 'Một số tính năng bạn có thể trải nghiệm:',
      bullets: [
        {
          id: 'weather',
          text: 'Xem thời tiết bằng cách nhấn vào biểu tượng đám mây hoặc nhiệt độ trên thanh Taskbar.',
          strongTerms: ['Taskbar'],
        },
        {
          id: 'start',
          text: 'Mở Menu Start qua biểu tượng Windows xanh ở giữa thanh Dock nổi.',
          strongTerms: ['Menu Start', 'Dock nổi'],
        },
        {
          id: 'drag',
          text: 'Kéo thả cửa sổ bằng thanh tiêu đề, thu nhỏ, phóng to hoặc đóng. Thứ tự hiển thị z-index tự động cập nhật.',
          strongTerms: ['z-index'],
        },
        {
          id: 'settings',
          text: 'Mở Cài đặt (Settings) để chuyển đổi giao diện Sáng / Tối hoặc đổi ngôn ngữ Tiếng Việt / English!',
          strongTerms: ['Cài đặt (Settings)', 'Sáng', 'Tối', 'Tiếng Việt', 'English'],
        },
        {
          id: 'power',
          text: 'Nhấn nút Nguồn (Power button) trong Menu Start để tắt hoặc khởi động lại hệ thống.',
          strongTerms: ['Nguồn', 'Power button'],
        },
      ],
    },
    weather: {
      windowTitle: 'Thời tiết',
    },
    startMenu: {
      pinned: 'Đã ghim',
      allApps: 'Tất cả ứng dụng',
      back: 'Quay lại',
      recommended: 'Đề xuất',
      more: 'Xem thêm',
      shutdownTooltip: 'Tắt máy',
      lockTooltip: 'Khóa màn hình',
      layoutLabel: 'Mẫu Menu Start',
      quickAccess: 'Truy cập nhanh',
      openSearch: 'Tìm kiếm nhanh',
    },
    search: {
      placeholder: 'Tìm ứng dụng, cài đặt, tài liệu...',
      clear: 'Xóa từ khóa',
      appsGroup: 'Ứng dụng & Hệ thống',
      recommendedGroup: 'Tài liệu đề xuất',
      settingsGroup: 'Cài đặt nhanh',
      emptyTitle: 'Không tìm thấy kết quả',
      emptySubtitle: 'Thử nhập tên ứng dụng (Edge, Word, Photoshop) hoặc mục cài đặt.',
      quickTips: 'Gợi ý nhanh',
    },
    settings: {
      windowTitle: 'Cài đặt',
      selectTheme: 'Chọn giao diện để áp dụng',
      themeNames: {
        light: 'Windows Sáng',
        dark: 'Windows Tối',
      },
      languageTitle: 'Ngôn ngữ hiển thị',
      languageSubtitle: 'Chọn ngôn ngữ cho toàn bộ hệ thống Windows 12 Fluent',
      statusTitle: 'Trạng thái mục',
      statusDescription:
        'Mọi thiết lập được đồng bộ theo tài khoản Josh Salazar (joshua.a.salazar@gmail.com). Bạn có thể chuyển sang Cá nhân hóa để đổi giao diện Sáng/Tối.',
      openPersonalization: 'Mở Cá nhân hóa',
    },
    taskbar: {
      searchLabel: 'Tìm kiếm',
      toggleTheme: 'Chuyển giao diện Sáng/Tối',
      switchLanguage: 'Chuyển ngôn ngữ (Tiếng Việt / English)',
      openingApp: (name: string) => `Đang mở ${name}...`,
      openTaskbarSettings: 'Cài đặt thanh Taskbar',
    },
    apps: {
      notesTitle: 'Ghi chú',
      calculatorTitle: 'Máy tính',
      paintTitle: 'Vẽ (Paint)',
      explorerTitle: 'Trình quản lý tệp',
      taskManagerTitle: 'Trình quản lý tác vụ',
    },
    shutdown: {
      message: 'Đang tắt Windows 12...',
      buttonLabel: 'Bật nguồn lại',
    },
  },
  en: {
    login: {
      title: 'Welcome back',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Enter username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Leave password blank',
      signInButton: 'Sign in',
      signingIn: 'Signing in...',
      hint: 'Temp account: Admin · Password: blank',
      errorMessage: 'Please enter username Admin and leave the password blank.',
      lockLabel: 'Lock screen',
    },
    welcome: {
      windowTitle: 'Welcome',
      bannerTitle: 'Windows 12',
      bannerSubtitle: 'Fluent Design',
      intro:
        'Welcome to my build of the Windows 12 Fluent UI. Recreated based on the next-generation Fluent Design system with layered Acrylic/Mica glass, floating dock taskbar, refreshed Windows icons, and bilingual support. Have fun and play around!',
      listHeading: 'Here are some things you can explore:',
      bullets: [
        {
          id: 'weather',
          text: 'Check the weather by clicking the cloud icon in the taskbar.',
        },
        {
          id: 'start',
          text: 'Open the Windows Start menu via the blue Windows logo.',
        },
        {
          id: 'drag',
          text: 'Drag windows around by their headers, close them, or minimize them. Window states and z-indexes update dynamically.',
        },
        {
          id: 'settings',
          text: 'Open Settings from the taskbar and switch between Light and Dark themes!',
          strongTerms: ['Settings', 'Light', 'Dark'],
        },
        {
          id: 'power',
          text: 'Click the Power button in the Start Menu to shut down the system.',
          strongTerms: ['Power button'],
        },
      ],
    },
    weather: {
      windowTitle: 'Weather',
    },
    startMenu: {
      pinned: 'Pinned',
      allApps: 'All apps',
      back: 'Back',
      recommended: 'Recommended',
      more: 'More',
      shutdownTooltip: 'Shut down',
      lockTooltip: 'Lock screen',
      layoutLabel: 'Start Layout',
      quickAccess: 'Quick access',
      openSearch: 'Quick search',
    },
    search: {
      placeholder: 'Search apps, settings, files...',
      clear: 'Clear query',
      appsGroup: 'Apps & System',
      recommendedGroup: 'Recommended files',
      settingsGroup: 'Settings',
      emptyTitle: 'No results found',
      emptySubtitle: 'Try searching for an app (Edge, Word, Photoshop) or a setting.',
      quickTips: 'Quick suggestions',
    },
    settings: {
      windowTitle: 'Settings',
      selectTheme: 'Select a theme to apply',
      themeNames: {
        light: 'Windows Light',
        dark: 'Windows Dark',
      },
      languageTitle: 'Display language',
      languageSubtitle: 'Choose the display language across Windows 12 Fluent UI',
      statusTitle: 'Section status',
      statusDescription:
        'All settings are managed under your Josh Salazar profile (joshua.a.salazar@gmail.com). Switch to Personalization to change Light and Dark themes.',
      openPersonalization: 'Open Personalization',
    },
    taskbar: {
      searchLabel: 'Search',
      toggleTheme: 'Toggle Light/Dark theme',
      switchLanguage: 'Switch language (Tiếng Việt / English)',
      openingApp: (name: string) => `Opening ${name}...`,
      openTaskbarSettings: 'Taskbar settings',
    },
    apps: {
      notesTitle: 'Notes',
      calculatorTitle: 'Calculator',
      paintTitle: 'Paint',
      explorerTitle: 'File Explorer',
      taskManagerTitle: 'Task Manager',
    },
    shutdown: {
      message: 'Shutting down Windows 12...',
      buttonLabel: 'Turn Power On',
    },
  },
} as const;

export const WEATHER_DATA: WeatherData = {
  currentTemp: '65° F',
  taskbarTemp: '65°',
  condition: {
    vi: 'Nhiều mây',
    en: 'Cloudy',
  },
  high: {
    vi: 'Cao nhất 74° F',
    en: 'High 74° F',
  },
  low: {
    vi: 'Thấp nhất 57° F',
    en: 'Low 57° F',
  },
  location: 'Ann Arbor, Michigan',
  forecast: [
    {
      label: { vi: 'Ngày mai 74°', en: 'Tomorrow 74°' },
      temp: '74°',
      condition: 'sunny',
    },
    {
      label: { vi: 'Thứ Tư 72°', en: 'Wednesday 72°' },
      temp: '72°',
      condition: 'rain',
    },
    {
      label: { vi: 'Thứ Năm 72°', en: 'Thursday 72°' },
      temp: '72°',
      condition: 'fog',
    },
  ],
};

export const PINNED_APPS: PinnedApp[] = [
  { id: 'edge', name: 'Edge', icon: 'edge' },
  { id: 'word', name: 'Word', icon: 'word' },
  { id: 'excel', name: 'Excel', icon: 'excel' },
  { id: 'powerpoint', name: 'PowerPoint', icon: 'powerpoint' },
  { id: 'outlook', name: 'Outlook', icon: 'outlook' },
  { id: 'calendar', name: 'Calendar', icon: 'calendar' },
  { id: 'xbox', name: 'Xbox', icon: 'xbox' },
  { id: 'codepen', name: 'CodePen', icon: 'codepen' },
  { id: 'netflix', name: 'Netflix', icon: 'netflix' },
  { id: 'teams', name: 'Teams', icon: 'teams' },
  { id: 'access', name: 'Access', icon: 'access' },
  { id: 'office', name: 'Office', icon: 'office' },
  { id: 'onedrive', name: 'OneDrive', icon: 'onedrive' },
  { id: 'onenote', name: 'OneNote', icon: 'onenote' },
  { id: 'project', name: 'Project', icon: 'project' },
  { id: 'sharepoint', name: 'SharePoint', icon: 'sharepoint' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify' },
  { id: 'photoshop', name: 'Photoshop', icon: 'photoshop' },
  { id: 'notes', name: 'Ghi chú', icon: 'notes', linkedWindow: 'notes' },
  { id: 'calculator', name: 'Máy tính', icon: 'calculator', linkedWindow: 'calculator' },
  { id: 'paint', name: 'Paint', icon: 'paint', linkedWindow: 'paint' },
  { id: 'explorer', name: 'File Explorer', icon: 'explorer', linkedWindow: 'explorer' },
];

export const RECOMMENDED_ITEMS: RecommendedItem[] = [
  {
    id: 'rec-photoshop',
    title: 'Adobe Photoshop',
    subtitle: { vi: 'Vừa thêm gần đây', en: 'Recently added' },
    icon: 'photoshop',
  },
  {
    id: 'rec-expenses',
    title: '2021 Monthly Expenses',
    subtitle: { vi: '17 phút trước', en: '17m ago' },
    icon: 'excel',
  },
  {
    id: 'rec-fluent',
    title: 'Windows 12 Fluent Design',
    subtitle: { vi: '2 giờ trước', en: '2h ago' },
    icon: 'codepen',
  },
  {
    id: 'rec-rick',
    title: 'Never Gonna Give You Up',
    subtitle: { vi: '12 giờ trước', en: '12h ago' },
    icon: 'word',
  },
];

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    id: 'system',
    label: { vi: 'Hệ thống', en: 'System' },
    iconName: 'system',
    summary: {
      vi: 'Hiển thị, âm thanh, thông báo, nguồn & pin',
      en: 'Display, sound, notifications, power & battery',
    },
  },
  {
    id: 'bluetooth',
    label: { vi: 'Bluetooth', en: 'Bluetooth' },
    iconName: 'bluetooth',
    summary: {
      vi: 'Bluetooth, máy in, chuột & thiết bị kết nối',
      en: 'Bluetooth, printers, mouse & connected devices',
    },
  },
  {
    id: 'network',
    label: { vi: 'Mạng & internet', en: 'Network & internet' },
    iconName: 'network',
    summary: {
      vi: 'Wi-Fi, chế độ máy bay, VPN & Ethernet',
      en: 'Wi-Fi, airplane mode, VPN & Ethernet',
    },
  },
  {
    id: 'personalization',
    label: { vi: 'Cá nhân hóa', en: 'Personalization' },
    iconName: 'personalization',
    summary: {
      vi: 'Hình nền, màn hình khóa, màu sắc & giao diện',
      en: 'Background, lock screen, colors & themes',
    },
  },
  {
    id: 'taskbar',
    label: { vi: 'Thanh Taskbar', en: 'Taskbar' },
    iconName: 'taskbar',
    summary: {
      vi: 'Tùy chỉnh thanh tác vụ, tìm kiếm, khay hệ thống & ứng dụng ghim',
      en: 'Taskbar layout, search, system tray & pinned apps',
    },
  },
  {
    id: 'widgets',
    label: { vi: 'Widget Desktop', en: 'Desktop Widgets' },
    iconName: 'widgets',
    summary: {
      vi: 'Thư viện 16 widget ngoài Desktop, bố cục & hiển thị',
      en: '16 Desktop widgets library, layout & appearance',
    },
  },
  {
    id: 'apps',
    label: { vi: 'Ứng dụng', en: 'Apps' },
    iconName: 'apps',
    summary: {
      vi: 'Ứng dụng đã cài, ứng dụng mặc định, khởi động',
      en: 'Installed apps, default apps, startup',
    },
  },
  {
    id: 'account',
    label: { vi: 'Tài khoản', en: 'Account' },
    iconName: 'account',
    summary: {
      vi: 'Tài khoản Microsoft, email & tùy chọn đăng nhập',
      en: 'Your Microsoft account, email & sign-in options',
    },
  },
  {
    id: 'time',
    label: { vi: 'Giờ & ngôn ngữ', en: 'Time & language' },
    iconName: 'time',
    summary: {
      vi: 'Ngôn ngữ hiển thị, khu vực, ngày & giờ',
      en: 'Display language, region, date & time',
    },
  },
  {
    id: 'gaming',
    label: { vi: 'Trò chơi', en: 'Gaming' },
    iconName: 'gaming',
    summary: {
      vi: 'Xbox Game Bar, quay màn hình, Chế độ trò chơi',
      en: 'Xbox Game Bar, captures, Game Mode',
    },
  },
  {
    id: 'accessibility',
    label: { vi: 'Trợ năng', en: 'Accessibility' },
    iconName: 'accessibility',
    summary: {
      vi: 'Trình đọc màn hình, kính lúp, tương phản cao',
      en: 'Narrator, magnifier, high contrast',
    },
  },
  {
    id: 'privacy',
    label: { vi: 'Riêng tư, bảo mật', en: 'Privacy & security' },
    iconName: 'privacy',
    summary: {
      vi: 'Bảo mật Windows, quyền ứng dụng & lịch sử hoạt động',
      en: 'Windows Security, permissions & activity history',
    },
  },
  {
    id: 'update',
    label: { vi: 'Windows Update', en: 'Windows update' },
    iconName: 'update',
    summary: {
      vi: 'Kiểm tra cập nhật, lịch sử cập nhật & khôi phục',
      en: 'Check for updates, update history & recovery',
    },
  },
];

export const PERSONALIZATION_OPTIONS: PersonalizationOption[] = [
  {
    id: 'background',
    title: { vi: 'Hình nền', en: 'Background' },
    subtitle: {
      vi: 'Ảnh nền, màu sắc, trình chiếu hình nền',
      en: 'Background image, color, slideshow',
    },
    iconName: 'background',
  },
  {
    id: 'colors',
    title: { vi: 'Màu sắc', en: 'Colors' },
    subtitle: {
      vi: 'Màu nhấn, hiệu ứng trong suốt, chế độ màu',
      en: 'Accent color, transparency effects, color theme',
    },
    iconName: 'colors',
  },
  {
    id: 'lock-screen',
    title: { vi: 'Màn hình khóa', en: 'Lock screen' },
    subtitle: {
      vi: 'Ảnh màn hình khóa, ứng dụng, chuyển động',
      en: 'Lock screen images, apps, animations',
    },
    iconName: 'lock',
  },
  {
    id: 'themes',
    title: { vi: 'Giao diện (Themes)', en: 'Themes' },
    subtitle: {
      vi: 'Cài đặt, tạo mới, quản lý giao diện',
      en: 'Install, create, manage',
    },
    iconName: 'themes',
  },
];

export const TASKBAR_APPS: TaskbarPinnedApp[] = [
  { id: 'start', label: { vi: 'Start', en: 'Start' }, systemIcon: 'start', windowId: 'startMenu', locked: true },
  {
    id: 'settings',
    label: { vi: 'Cài đặt', en: 'Settings' },
    systemIcon: 'settings',
    windowId: 'settings',
    locked: true,
  },
  {
    id: 'explorer',
    label: { vi: 'File Explorer', en: 'File Explorer' },
    systemIcon: 'explorer',
    windowId: 'explorer',
  },
  {
    id: 'notes',
    label: { vi: 'Ghi chú', en: 'Notes' },
    systemIcon: 'notes',
    windowId: 'notes',
  },
  {
    id: 'calculator',
    label: { vi: 'Máy tính', en: 'Calculator' },
    systemIcon: 'calculator',
    windowId: 'calculator',
  },
  {
    id: 'paint',
    label: { vi: 'Vẽ (Paint)', en: 'Paint' },
    systemIcon: 'paint',
    windowId: 'paint',
  },
  { id: 'word', label: { vi: 'Word', en: 'Word' }, icon: 'word' },
  { id: 'powerpoint', label: { vi: 'PowerPoint', en: 'PowerPoint' }, icon: 'powerpoint' },
  { id: 'excel', label: { vi: 'Excel', en: 'Excel' }, icon: 'excel' },
  { id: 'office', label: { vi: 'Office', en: 'Office' }, icon: 'office' },
  { id: 'outlook', label: { vi: 'Outlook', en: 'Outlook' }, icon: 'outlook' },
  { id: 'teams', label: { vi: 'Teams', en: 'Teams' }, icon: 'teams' },
  {
    id: 'welcome',
    label: { vi: 'Chào mừng', en: 'Welcome' },
    systemIcon: 'welcome',
    windowId: 'welcome',
  },
  {
    id: 'weather',
    label: { vi: 'Thời tiết', en: 'Weather' },
    systemIcon: 'weather',
    windowId: 'weather',
  },
];
