import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageId } from '../data/desktopData';
import { DesktopLayoutConfig, WIDGET_CATALOG, WidgetType } from '../data/osConfig';
import { WindowsSystemIcon } from '../config/windowsIcons';

interface WidgetLibraryDrawerProps {
  isOpen: boolean;
  language: LanguageId;
  layout: DesktopLayoutConfig;
  onAddWidget: (type: WidgetType) => void;
  onAutoArrangeWidgets: () => void;
  onUpdateLayout: (patch: Partial<DesktopLayoutConfig>) => void;
  onClose: () => void;
}

export const WidgetLibraryDrawer: React.FC<WidgetLibraryDrawerProps> = ({
  isOpen,
  language,
  layout,
  onAddWidget,
  onAutoArrangeWidgets,
  onUpdateLayout,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const filtered = WIDGET_CATALOG.filter(
    (w) =>
      !q ||
      w.title[language].toLowerCase().includes(q) ||
      w.description[language].toLowerCase().includes(q)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Desktop Widget Library"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={(e) => e.stopPropagation()}
          className="win-acrylic fixed top-3 right-3 bottom-16 left-3 z-[1045] flex flex-col overflow-hidden rounded-2xl p-4 select-none sm:top-4 sm:right-auto sm:bottom-20 sm:left-4 sm:w-[min(410px,92vw)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold">
              <WindowsSystemIcon name="sparkle" size={18} className="text-[var(--win-accent)]" />
              <span>
                {language === 'vi'
                  ? 'Thư viện Widget Desktop (16 mẫu)'
                  : 'Desktop Widget Library (16)'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1 hover:bg-black/8 dark:hover:bg-white/10"
            >
              <WindowsSystemIcon name="close" size={16} />
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm widget...' : 'Search widgets...'}
            className="mt-3 rounded-xl border border-[var(--win-border-subtle)] bg-white/65 px-3 py-2 text-xs text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none dark:bg-black/25"
          />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => onUpdateLayout({ showWidgets: !layout.showWidgets })}
              className={`rounded-lg px-2.5 py-1 font-semibold ${
                layout.showWidgets ? 'bg-[var(--win-accent-bright)] text-white' : 'win-card'
              }`}
            >
              {layout.showWidgets
                ? language === 'vi'
                  ? 'Đang hiện Widget'
                  : 'Widgets On'
                : language === 'vi'
                ? 'Đang ẩn Widget'
                : 'Widgets Off'}
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayout({ widgetSnapToGrid: !layout.widgetSnapToGrid })}
              className={`rounded-lg px-2.5 py-1 font-semibold ${
                layout.widgetSnapToGrid ? 'bg-[var(--win-accent)]/20 text-[var(--win-accent)]' : 'win-card'
              }`}
            >
              Snap to Grid
            </button>
            <button
              type="button"
              onClick={onAutoArrangeWidgets}
              className="win-card rounded-lg px-2.5 py-1 font-semibold"
            >
              {language === 'vi' ? 'Sắp xếp tự động' : 'Auto Arrange'}
            </button>
          </div>

          <div className="win-scrollbar mt-3 grid flex-1 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {filtered.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => onAddWidget(item.type)}
                className="win-card flex flex-col justify-between rounded-xl p-3 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <WindowsSystemIcon name={item.iconKey} size={17} className="text-[var(--win-accent)]" />
                    <span className="text-xs font-bold">{item.title[language]}</span>
                  </div>
                  <WindowsSystemIcon name="add" size={14} className="opacity-70" />
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-[var(--win-text-secondary)]">
                  {item.description[language]}
                </p>
              </button>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
