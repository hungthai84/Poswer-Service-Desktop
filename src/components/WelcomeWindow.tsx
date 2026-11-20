import React from 'react';
import { WindowFrame } from './WindowFrame';
import { FluentSystemIcon, WindowsLogo } from './FluentIcons';
import { Win11Wallpaper } from './Win11Wallpaper';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { ThemeId } from '../data/themes';

import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';

interface WelcomeWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  theme: ThemeId;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
}

export const WelcomeWindow: React.FC<WelcomeWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  theme,
  language,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
}) => {
  const copy = UI_TEXT[language].welcome;

  const renderBulletText = (text: string, strongTerms?: readonly string[]) => {
    if (!strongTerms || strongTerms.length === 0) return text;
    const regex = new RegExp(
      `(${strongTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'g'
    );
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      strongTerms.includes(part) ? (
        <strong key={idx} className="font-semibold text-[var(--win-text-primary)]">
          {part}
        </strong>
      ) : (
        <React.Fragment key={idx}>{part}</React.Fragment>
      )
    );
  };

  return (
    <WindowFrame
      id="welcome"
      title={copy.windowTitle}
      icon={<FluentSystemIcon type="welcome" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={700}
      height={510}
      showMaximize={true}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="win-scrollbar h-full overflow-y-auto">
        {/* Hero Header Banner */}
        <div className="relative mx-3 mt-1 h-[220px] overflow-hidden rounded-xl bg-[#106ebe] select-none sm:h-[235px]">
          <Win11Wallpaper theme={theme} className="absolute inset-0 h-full w-full" />
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#041b68]/20 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-3">
              <WindowsLogo size={42} color="#ffffff" />
              <span className="font-play text-3xl font-bold tracking-tight sm:text-[2.4rem]">
                {copy.bannerTitle}
              </span>
            </div>
            <span className="font-play text-sm font-normal tracking-wide text-white/90">
              {copy.bannerSubtitle}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-6 py-6 text-[15px] leading-relaxed text-[var(--win-text-primary)] sm:px-11 sm:py-7">
          <p className="mb-4">{copy.intro}</p>
          <p className="font-play mb-3 text-base font-bold">{copy.listHeading}</p>
          <ul className="list-disc space-y-2 pl-5">
            {copy.bullets.map((bullet) => (
              <li key={bullet.id}>
                {renderBulletText(
                  bullet.text,
                  'strongTerms' in bullet ? bullet.strongTerms : undefined
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WindowFrame>
  );
};
