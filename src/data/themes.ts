export type ThemeId = 'light' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  isDark: boolean;
  desktopBgFallback: string;
  accentColor: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  light: {
    id: 'light',
    label: 'Windows Light',
    isDark: false,
    desktopBgFallback: '#0b4f8a',
    accentColor: '#226cb1',
  },
  dark: {
    id: 'dark',
    label: 'Windows Dark',
    isDark: true,
    desktopBgFallback: '#081226',
    accentColor: '#4cc2ff',
  },
};

export const THEME_LIST: ThemeConfig[] = Object.values(THEMES);
export const THEME_STORAGE_KEY = 'win11-ui-concept-theme';
