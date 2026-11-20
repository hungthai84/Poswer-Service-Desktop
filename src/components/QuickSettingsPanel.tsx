import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageId } from '../data/desktopData';
import { QuickSettingsState } from '../data/osConfig';
import { TaskbarPositionId } from '../data/customization';
import { ThemeId } from '../data/themes';
import { WindowsIconKey, WindowsSystemIcon } from '../config/windowsIcons';

interface QuickSettingsPanelProps {
  isOpen: boolean;
  language: LanguageId;
  theme: ThemeId;
  taskbarPosition: TaskbarPositionId;
  state: QuickSettingsState;
  onUpdate: (patch: Partial<QuickSettingsState>) => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
}

export const QuickSettingsPanel: React.FC<QuickSettingsPanelProps> = ({
  isOpen,
  language,
  theme,
  taskbarPosition,
  state,
  onUpdate,
  onToggleTheme,
  onOpenSettings,
  onClose,
}) => {
  const posClass =
    taskbarPosition === 'top'
      ? 'top-[60px] right-2 sm:top-[68px] sm:right-3'
      : taskbarPosition === 'left'
      ? 'bottom-2 left-14 sm:bottom-3 sm:left-[72px]'
      : taskbarPosition === 'right'
      ? 'bottom-2 right-14 sm:bottom-3 sm:right-[72px]'
      : 'bottom-[60px] right-2 sm:bottom-[68px] sm:right-3';

  const tiles: {
    id: string;
    label: Record<LanguageId, string>;
    icon: WindowsIconKey;
    active: boolean;
    onClick: () => void;
  }[] = [
    {
      id: 'wifi',
      label: { vi: 'Wi-Fi (Mô phỏng)', en: 'Wi-Fi (Sim)' },
      icon: 'wifi',
      active: state.wifi && !state.airplaneMode,
      onClick: () => onUpdate({ wifi: !state.wifi, airplaneMode: false }),
    },
    {
      id: 'bluetooth',
      label: { vi: 'Bluetooth (Sim)', en: 'Bluetooth (Sim)' },
      icon: 'bluetooth',
      active: state.bluetooth && !state.airplaneMode,
      onClick: () => onUpdate({ bluetooth: !state.bluetooth, airplaneMode: false }),
    },
    {
      id: 'airplane',
      label: { vi: 'Chế độ máy bay', en: 'Airplane mode' },
      icon: 'airplane',
      active: state.airplaneMode,
      onClick: () => onUpdate({ airplaneMode: !state.airplaneMode }),
    },
    {
      id: 'battery',
      label: { vi: 'Tiết kiệm pin', en: 'Battery saver' },
      icon: 'batterySaver',
      active: state.batterySaver,
      onClick: () => onUpdate({ batterySaver: !state.batterySaver }),
    },
    {
      id: 'nightLight',
      label: { vi: 'Ánh sáng đêm', en: 'Night light' },
      icon: 'nightLight',
      active: state.nightLight,
      onClick: () => onUpdate({ nightLight: !state.nightLight }),
    },
    {
      id: 'accessibility',
      label: { vi: 'Trợ năng', en: 'Accessibility' },
      icon: 'accessibility',
      active: state.accessibilityHighContrast,
      onClick: () =>
        onUpdate({ accessibilityHighContrast: !state.accessibilityHighContrast }),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Quick Settings"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.97 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`win-acrylic win-scrollbar fixed ${posClass} z-[1040] max-h-[calc(100dvh-88px)] w-[min(340px,calc(100vw-16px))] overflow-y-auto rounded-2xl p-4 select-none`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--win-text-primary)]">
              {language === 'vi' ? 'Cài đặt nhanh' : 'Quick Settings'}
            </span>
            <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-medium text-[var(--win-text-secondary)] dark:bg-white/10">
              {language === 'vi' ? 'Mô phỏng phần cứng' : 'In-app simulation'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={tile.onClick}
                className={`flex flex-col items-start gap-2 rounded-xl border p-2.5 text-left transition-all ${
                  tile.active
                    ? 'border-transparent bg-[var(--win-accent-bright)] text-white shadow-xs'
                    : 'border-[var(--win-border-subtle)] bg-white/45 text-[var(--win-text-primary)] hover:bg-white/75 dark:bg-white/6 dark:hover:bg-white/12'
                }`}
              >
                <WindowsSystemIcon name={tile.icon} active={tile.active} size={18} />
                <span className="line-clamp-1 text-[11px] font-semibold">
                  {tile.label[language]}
                </span>
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="mt-4 space-y-3 border-t border-[var(--win-border-subtle)] pt-3.5">
            <label className="flex items-center gap-3">
              <WindowsSystemIcon name="brightness" size={18} className="text-[var(--win-accent)]" />
              <input
                type="range"
                min={40}
                max={100}
                value={state.brightness}
                onChange={(e) => onUpdate({ brightness: Number(e.target.value) })}
                aria-label={language === 'vi' ? 'Độ sáng màn hình' : 'Brightness'}
                className="h-1.5 flex-1 cursor-pointer accent-[var(--win-accent-bright)]"
              />
              <span className="w-8 text-right text-[11px] font-semibold tabular-nums">
                {state.brightness}%
              </span>
            </label>

            <label className="flex items-center gap-3">
              <WindowsSystemIcon name="volume" size={18} className="text-[var(--win-accent)]" />
              <input
                type="range"
                min={0}
                max={100}
                value={state.volume}
                onChange={(e) => onUpdate({ volume: Number(e.target.value) })}
                aria-label={language === 'vi' ? 'Âm lượng' : 'Volume'}
                className="h-1.5 flex-1 cursor-pointer accent-[var(--win-accent-bright)]"
              />
              <span className="w-8 text-right text-[11px] font-semibold tabular-nums">
                {state.volume}%
              </span>
            </label>
          </div>

          {/* Footer Shortcuts */}
          <div className="mt-4 flex items-center justify-between border-t border-[var(--win-border-subtle)] pt-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="win-card inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
            >
              <WindowsSystemIcon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
              <span>
                {theme === 'dark'
                  ? language === 'vi'
                    ? 'Chế độ Sáng'
                    : 'Light mode'
                  : language === 'vi'
                  ? 'Chế độ Tối'
                  : 'Dark mode'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              aria-label="Open Settings"
              className="win-card flex h-8 w-8 items-center justify-center rounded-xl"
            >
              <WindowsSystemIcon name="settings" size={16} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
