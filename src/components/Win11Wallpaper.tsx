import React, { useId } from 'react';
import { ThemeId } from '../data/themes';
import { WallpaperFitMode, WallpaperPreset } from '../data/osConfig';

interface BloomArtProps {
  theme: ThemeId;
  wallpaper?: WallpaperPreset;
  fitMode?: WallpaperFitMode;
  customBgColor?: string;
  className?: string;
}

function getImageStyle(src: string, fitMode: WallpaperFitMode): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundImage: `url("${src}")`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  };
  switch (fitMode) {
    case 'fit':
      return { ...base, backgroundSize: 'contain' };
    case 'stretch':
      return { ...base, backgroundSize: '100% 100%' };
    case 'tile':
      return { ...base, backgroundSize: '260px auto', backgroundRepeat: 'repeat', backgroundPosition: 'top left' };
    case 'center':
      return { ...base, backgroundSize: 'auto' };
    case 'span':
      return { ...base, backgroundSize: '130% auto' };
    case 'fill':
    default:
      return { ...base, backgroundSize: 'cover' };
  }
}

/**
 * Windows 11/12 Fluent Wallpaper renderer supporting Bloom SVG artwork,
 * Gradients, Solid Colors, and Custom Uploaded/URL Images with 6 fit modes.
 */
export const Win11Wallpaper: React.FC<BloomArtProps> = ({
  theme,
  wallpaper,
  fitMode = 'fill',
  customBgColor,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const isDark = theme === 'dark';

  if (wallpaper && wallpaper.kind === 'image') {
    return (
      <div
        className={`pointer-events-none select-none overflow-hidden transition-all duration-300 ${className}`}
        style={{
          backgroundColor: customBgColor || (isDark ? '#030712' : '#0f172a'),
          ...getImageStyle(wallpaper.value, fitMode),
        }}
        aria-hidden="true"
      />
    );
  }

  if (wallpaper && (wallpaper.kind === 'gradient' || wallpaper.kind === 'solid')) {
    return (
      <div
        className={`pointer-events-none select-none overflow-hidden transition-all duration-500 ${className}`}
        style={{
          background: customBgColor || wallpaper.value,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden transition-colors duration-500 ${className}`}
      style={{
        background:
          customBgColor ||
          (isDark
            ? 'radial-gradient(ellipse at 50% 42%, #0f2956 0%, #07132c 52%, #030712 100%)'
            : 'radial-gradient(ellipse at 50% 42%, #eef6ff 0%, #cce3fd 46%, #94c5f8 80%, #60a5fa 100%)'),
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`w12-glow-${theme}-${uid}`} cx="50%" cy="48%" r="52%">
            <stop
              offset="0%"
              stopColor={isDark ? '#38bdf8' : '#ffffff'}
              stopOpacity={isDark ? '0.32' : '0.82'}
            />
            <stop
              offset="55%"
              stopColor={isDark ? '#2563eb' : '#93c5fd'}
              stopOpacity={isDark ? '0.16' : '0.32'}
            />
            <stop offset="100%" stopColor={isDark ? '#020617' : '#60a5fa'} stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`w12-ribbon1-${theme}-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#38bdf8' : '#e0f2fe'} />
            <stop offset="48%" stopColor={isDark ? '#2563eb' : '#3b82f6'} />
            <stop offset="100%" stopColor={isDark ? '#1e1b4b' : '#1d4ed8'} />
          </linearGradient>

          <linearGradient id={`w12-ribbon2-${theme}-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#60a5fa' : '#ffffff'} stopOpacity="0.95" />
            <stop offset="45%" stopColor={isDark ? '#0284c7' : '#60a5fa'} />
            <stop offset="100%" stopColor={isDark ? '#0f172a' : '#2563eb'} />
          </linearGradient>

          <linearGradient id={`w12-ribbon3-${theme}-${uid}`} x1="15%" y1="100%" x2="85%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#0ea5e9' : '#7dd3fc'} />
            <stop offset="50%" stopColor={isDark ? '#3b82f6' : '#2563eb'} />
            <stop offset="100%" stopColor={isDark ? '#312e81' : '#1e40af'} />
          </linearGradient>

          <linearGradient id={`w12-ribbon4-${theme}-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={isDark ? '#1e3a8a' : '#dbeafe'} />
            <stop offset="50%" stopColor={isDark ? '#38bdf8' : '#3b82f6'} />
            <stop offset="100%" stopColor={isDark ? '#0369a1' : '#60a5fa'} />
          </linearGradient>

          <filter id={`w12-shadow-${theme}-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="22"
              stdDeviation="32"
              floodColor={isDark ? '#020617' : '#1e3a8a'}
              floodOpacity={isDark ? '0.65' : '0.26'}
            />
          </filter>
        </defs>

        <circle cx="720" cy="430" r="520" fill={`url(#w12-glow-${theme}-${uid})`} />
        <circle
          cx="720"
          cy="435"
          r="340"
          fill="none"
          stroke={isDark ? '#60a5fa' : '#ffffff'}
          strokeOpacity={isDark ? '0.09' : '0.28'}
          strokeWidth="1.5"
        />

        <g transform="translate(720, 435)" filter={`url(#w12-shadow-${theme}-${uid})`}>
          <path
            d="M -30 -50 C 90 -310, 410 -250, 360 -15 C 315 190, 120 230, -10 115 Z"
            fill={`url(#w12-ribbon3-${theme}-${uid})`}
            opacity="0.92"
          />
          <path
            d="M 25 -35 C -100 -290, -395 -210, -340 25 C -295 225, -90 230, 20 105 Z"
            fill={`url(#w12-ribbon1-${theme}-${uid})`}
            opacity="0.95"
          />
          <path
            d="M -260 65 C -150 285, 210 325, 310 85 C 220 10, 35 -35, -260 65 Z"
            fill={`url(#w12-ribbon4-${theme}-${uid})`}
            opacity="0.88"
          />
          <path
            d="M -8 -255 C 205 -220, 255 15, 45 160 C -125 245, -235 95, -190 -65 C -160 -170, -85 -242, -8 -255 Z"
            fill={`url(#w12-ribbon2-${theme}-${uid})`}
            opacity="0.95"
          />
          <path
            d="M -8 -160 C 130 -138, 168 18, 28 115 C -90 165, -155 50, -110 -58 C -85 -126, -45 -156, -8 -160 Z"
            fill={isDark ? '#7dd3fc' : '#f8fafc'}
            opacity={isDark ? '0.24' : '0.56'}
          />
        </g>
      </svg>
    </div>
  );
};
