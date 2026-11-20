import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  LanguageId,
  PINNED_APPS,
  RECOMMENDED_ITEMS,
  SETTINGS_NAV_ITEMS,
  UI_TEXT,
  WindowId,
} from '../data/desktopData';
import { TaskbarPositionId } from '../data/customization';
import { AppBrandIcon, FluentSystemIcon } from './FluentIcons';
import { useViewport } from '../hooks/useViewport';

interface SearchPanelProps {
  isOpen: boolean;
  zIndex: number;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
  onOpenSettingsTab: (tabId: string) => void;
  onAppLaunch: (appName: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  zIndex,
  language,
  taskbarPosition,
  onClose,
  onOpenWindow,
  onOpenSettingsTab,
  onAppLaunch,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const viewport = useViewport();
  const isMobile = viewport.isMobile;
  const copy = UI_TEXT[language].search;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
    setQuery('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const systemWindows = useMemo(
    () => [
      {
        id: 'notes' as WindowId,
        title: UI_TEXT[language].apps.notesTitle,
        iconType: 'notes' as const,
        keywords: 'notes ghi chu sticky note viet',
      },
      {
        id: 'calculator' as WindowId,
        title: UI_TEXT[language].apps.calculatorTitle,
        iconType: 'calculator' as const,
        keywords: 'calculator may tinh tinh toan math',
      },
      {
        id: 'paint' as WindowId,
        title: UI_TEXT[language].apps.paintTitle,
        iconType: 'paint' as const,
        keywords: 'paint ve draw sketch canvas',
      },
      {
        id: 'settings' as WindowId,
        title: UI_TEXT[language].settings.windowTitle,
        iconType: 'settings' as const,
        keywords: 'settings cai dat theme font taskbar',
      },
      {
        id: 'weather' as WindowId,
        title: UI_TEXT[language].weather.windowTitle,
        iconType: 'weather' as const,
        keywords: 'weather thoi tiet nhiet do ann arbor',
      },
      {
        id: 'explorer' as WindowId,
        title: UI_TEXT[language].apps.explorerTitle,
        iconType: 'explorer' as const,
        keywords: 'explorer files folders tep thu muc this pc',
      },
      {
        id: 'taskManager' as WindowId,
        title: UI_TEXT[language].apps.taskManagerTitle,
        iconType: 'settings' as const,
        keywords: 'task manager tac vu cpu ram process',
      },
      {
        id: 'welcome' as WindowId,
        title: UI_TEXT[language].welcome.windowTitle,
        iconType: 'welcome' as const,
        keywords: 'welcome chao mung windows 12',
      },
    ],
    [language]
  );

  const normalized = query.trim().toLowerCase();

  const matchedSystem = useMemo(
    () =>
      systemWindows.filter(
        (w) =>
          !normalized ||
          w.title.toLowerCase().includes(normalized) ||
          w.keywords.includes(normalized)
      ),
    [systemWindows, normalized]
  );

  const matchedApps = useMemo(() => {
    const filtered = PINNED_APPS.filter(
      (app) =>
        !app.linkedWindow &&
        (!normalized || app.name.toLowerCase().includes(normalized))
    );
    return normalized ? filtered : filtered.slice(0, 6);
  }, [normalized]);

  const matchedFiles = useMemo(
    () =>
      RECOMMENDED_ITEMS.filter(
        (item) =>
          !normalized ||
          item.title.toLowerCase().includes(normalized) ||
          item.subtitle[language].toLowerCase().includes(normalized)
      ),
    [normalized, language]
  );

  const matchedSettings = useMemo(() => {
    const filtered = SETTINGS_NAV_ITEMS.filter(
      (s) =>
        !normalized ||
        s.label[language].toLowerCase().includes(normalized) ||
        s.summary[language].toLowerCase().includes(normalized)
    );
    return normalized ? filtered : filtered.slice(0, 4);
  }, [normalized, language]);

  const hasResults =
    matchedSystem.length > 0 ||
    matchedApps.length > 0 ||
    matchedFiles.length > 0 ||
    matchedSettings.length > 0;

  const positionClass = isMobile
    ? taskbarPosition === 'top'
      ? 'top-[58px] left-1/2 -translate-x-1/2'
      : 'bottom-[60px] left-1/2 -translate-x-1/2'
    : taskbarPosition === 'top'
    ? 'top-[72px] left-1/2 -translate-x-1/2'
    : taskbarPosition === 'left'
    ? 'left-[74px] top-1/2 -translate-y-1/2'
    : taskbarPosition === 'right'
    ? 'right-[74px] top-1/2 -translate-y-1/2'
    : 'bottom-[74px] left-1/2 -translate-x-1/2';

  const initialOffset =
    taskbarPosition === 'top'
      ? { opacity: 0, y: -18, scale: 0.97 }
      : !isMobile && taskbarPosition === 'left'
      ? { opacity: 0, x: -18, scale: 0.97 }
      : !isMobile && taskbarPosition === 'right'
      ? { opacity: 0, x: 18, scale: 0.97 }
      : { opacity: 0, y: 20, scale: 0.97 };

  const sizeClass = isMobile
    ? 'h-[min(540px,calc(100dvh-76px))] w-[calc(100vw-16px)]'
    : taskbarPosition === 'left' || taskbarPosition === 'right'
    ? 'h-[min(560px,calc(100dvh-32px))] w-[min(540px,calc(100vw-92px))]'
    : 'h-[min(560px,calc(100dvh-92px))] w-[min(560px,95vw)]';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Search"
          initial={initialOffset}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={initialOffset}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex }}
          className={`win-acrylic fixed flex flex-col overflow-hidden rounded-2xl select-none ${positionClass} ${sizeClass}`}
        >
          {/* Search Input Header */}
          <div className="shrink-0 border-b border-[var(--win-border-subtle)] px-5 pt-5 pb-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--win-border-subtle)] bg-white/75 px-3.5 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-[var(--win-accent)] dark:bg-black/30">
              <Search size={17} className="shrink-0 text-[var(--win-accent)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.placeholder}
                className="w-full bg-transparent text-sm text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={copy.clear}
                  className="rounded-md p-1 text-[var(--win-text-secondary)] hover:bg-black/8 hover:text-[var(--win-text-primary)] dark:hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick filter chips */}
            {!normalized && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] font-medium text-[var(--win-text-secondary)]">
                  {copy.quickTips}:
                </span>
                {[
                  UI_TEXT[language].apps.notesTitle,
                  UI_TEXT[language].apps.calculatorTitle,
                  UI_TEXT[language].apps.paintTitle,
                  'Taskbar',
                ].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQuery(chip)}
                      className="win-card rounded-lg px-2.5 py-1 text-[11px] font-medium text-[var(--win-text-primary)]"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Search Results Body */}
          <div className="win-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-4">
            {!hasResults ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Search size={32} className="mb-3 text-[var(--win-text-secondary)] opacity-50" />
                <div className="text-sm font-bold text-[var(--win-text-primary)]">
                  {copy.emptyTitle}
                </div>
                <p className="mt-1 max-w-xs text-xs text-[var(--win-text-secondary)]">
                  {copy.emptySubtitle}
                </p>
              </div>
            ) : (
              <>
                {(matchedSystem.length > 0 || matchedApps.length > 0) && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold text-[var(--win-text-secondary)]">
                      {copy.appsGroup}
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {matchedSystem.map((sys) => (
                        <button
                          key={sys.id}
                          type="button"
                          onClick={() => {
                            onOpenWindow(sys.id);
                            onClose();
                          }}
                          className="win-card flex items-center justify-between rounded-xl px-3 py-2 text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <FluentSystemIcon type={sys.iconType} size={22} />
                            <span className="text-[13px] font-semibold text-[var(--win-text-primary)]">
                              {sys.title}
                            </span>
                          </div>
                          <ArrowRight size={13} className="text-[var(--win-text-secondary)]" />
                        </button>
                      ))}

                      {matchedApps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => {
                            onAppLaunch(app.name);
                            onClose();
                          }}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/55 dark:hover:bg-white/10"
                        >
                          <AppBrandIcon icon={app.icon} size={22} />
                          <span className="truncate text-[13px] font-medium text-[var(--win-text-primary)]">
                            {app.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchedFiles.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold text-[var(--win-text-secondary)]">
                      {copy.recommendedGroup}
                    </h3>
                    <div className="space-y-1">
                      {matchedFiles.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onAppLaunch(item.title);
                            onClose();
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/55 dark:hover:bg-white/10"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <AppBrandIcon icon={item.icon} size={22} />
                            <div className="min-w-0">
                              <div className="truncate text-[13px] font-semibold text-[var(--win-text-primary)]">
                                {item.title}
                              </div>
                              <div className="truncate text-[11px] text-[var(--win-text-secondary)]">
                                {item.subtitle[language]}
                              </div>
                            </div>
                          </div>
                          <ArrowRight size={13} className="shrink-0 text-[var(--win-text-secondary)]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchedSettings.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold text-[var(--win-text-secondary)]">
                      {copy.settingsGroup}
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {matchedSettings.map((setting) => (
                        <button
                          key={setting.id}
                          type="button"
                          onClick={() => {
                            onOpenSettingsTab(setting.id);
                            onClose();
                          }}
                          className="win-card flex items-center gap-2.5 rounded-xl px-3 py-2 text-left"
                        >
                          <SlidersHorizontal
                            size={15}
                            className="shrink-0 text-[var(--win-accent)]"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-[var(--win-text-primary)]">
                              {setting.label[language]}
                            </div>
                            <div className="truncate text-[11px] text-[var(--win-text-secondary)]">
                              {setting.summary[language]}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
