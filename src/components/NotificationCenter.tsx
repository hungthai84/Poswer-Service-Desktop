import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageId } from '../data/desktopData';
import { DesktopNotification } from '../data/osConfig';
import { TaskbarPositionId } from '../data/customization';
import { WindowsSystemIcon } from '../config/windowsIcons';

interface NotificationCenterProps {
  isOpen: boolean;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  notifications: DesktopNotification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onOpenNotificationSettings: () => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  language,
  taskbarPosition,
  notifications,
  onMarkRead,
  onDelete,
  onClearAll,
  onOpenNotificationSettings,
  onClose,
}) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = today.getDate();

  const weekHeaders =
    language === 'vi'
      ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
      : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const posClass =
    taskbarPosition === 'top'
      ? 'top-[60px] right-2 sm:top-[68px] sm:right-3'
      : taskbarPosition === 'left'
      ? 'bottom-2 left-14 sm:bottom-3 sm:left-[72px]'
      : taskbarPosition === 'right'
      ? 'bottom-2 right-14 sm:bottom-3 sm:right-[72px]'
      : 'bottom-[60px] right-2 sm:bottom-[68px] sm:right-3';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Notifications and Calendar"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 18 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`win-acrylic fixed ${posClass} z-[1040] flex max-h-[calc(100dvh-88px)] w-[min(345px,calc(100vw-16px))] flex-col gap-3 overflow-hidden rounded-2xl p-4 select-none`}
        >
          {/* Notifications Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--win-text-primary)]">
              <WindowsSystemIcon name="notification" active size={16} className="text-[var(--win-accent)]" />
              <span>{language === 'vi' ? 'Trung tâm thông báo' : 'Notifications'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="rounded-lg bg-black/5 px-2 py-1 text-[11px] font-semibold hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/16"
                >
                  {language === 'vi' ? 'Xóa hết' : 'Clear all'}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNotificationSettings();
                }}
                title={language === 'vi' ? 'Cài đặt thông báo' : 'Notification settings'}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-black/6 dark:hover:bg-white/10"
              >
                <WindowsSystemIcon name="settings" size={14} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="win-scrollbar max-h-[210px] space-y-2 overflow-y-auto pr-0.5">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--win-border-subtle)] py-6 text-center text-xs text-[var(--win-text-secondary)]">
                {language === 'vi' ? 'Không có thông báo mới' : 'No new notifications'}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onMarkRead(n.id)}
                  className={`win-card cursor-pointer rounded-xl p-3 transition-opacity ${
                    n.read ? 'opacity-70' : 'border-l-[3px] border-l-[var(--win-accent-bright)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <WindowsSystemIcon name={n.iconKey} size={15} className="text-[var(--win-accent)]" />
                      <span className="text-xs font-bold text-[var(--win-text-primary)]">
                        {n.title[language]}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(n.id);
                      }}
                      aria-label="Dismiss"
                      className="rounded p-0.5 text-[var(--win-text-secondary)] hover:bg-black/8 dark:hover:bg-white/10"
                    >
                      <WindowsSystemIcon name="close" size={13} />
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-[var(--win-text-secondary)]">
                    {n.body[language]}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--win-text-secondary)]">
                    <span>{n.timeLabel}</span>
                    {!n.read && (
                      <span className="font-semibold text-[var(--win-accent)]">
                        {language === 'vi' ? 'Mới' : 'Unread'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Interactive Monthly Calendar */}
          <div className="border-t border-[var(--win-border-subtle)] pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold capitalize text-[var(--win-text-primary)]">
                {today.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="text-[11px] text-[var(--win-accent)] tabular-nums">
                {today.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                  weekday: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--win-text-secondary)]">
              {weekHeaders.map((w) => (
                <div key={w} className="py-0.5">
                  {w}
                </div>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[11px] tabular-nums">
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isToday = dayNum === currentDay;
                return (
                  <div
                    key={dayNum}
                    className={`flex h-7 items-center justify-center rounded-lg font-medium ${
                      isToday
                        ? 'bg-[var(--win-accent-bright)] font-bold text-white shadow-xs'
                        : 'text-[var(--win-text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
