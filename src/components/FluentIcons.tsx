import React, { useId } from 'react';
import { AppIconKey } from '../data/desktopData';

export const WindowsLogo: React.FC<{
  size?: number;
  color?: 'fluent' | string;
  className?: string;
}> = ({ size = 24, color = 'fluent', className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const isFluent = color === 'fluent';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      {isFluent && (
        <defs>
          <linearGradient id={`win12-tl-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60cdff" />
            <stop offset="100%" stopColor="#0091f8" />
          </linearGradient>
          <linearGradient id={`win12-tr-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4cc2ff" />
            <stop offset="100%" stopColor="#0078d4" />
          </linearGradient>
          <linearGradient id={`win12-bl-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#28a8ea" />
            <stop offset="100%" stopColor="#0067c0" />
          </linearGradient>
          <linearGradient id={`win12-br-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078d4" />
            <stop offset="100%" stopColor="#004e98" />
          </linearGradient>
        </defs>
      )}
      <rect
        x="5"
        y="5"
        width="17.5"
        height="17.5"
        rx="3.2"
        fill={isFluent ? `url(#win12-tl-${uid})` : color}
      />
      <rect
        x="25.5"
        y="5"
        width="17.5"
        height="17.5"
        rx="3.2"
        fill={isFluent ? `url(#win12-tr-${uid})` : color}
      />
      <rect
        x="5"
        y="25.5"
        width="17.5"
        height="17.5"
        rx="3.2"
        fill={isFluent ? `url(#win12-bl-${uid})` : color}
      />
      <rect
        x="25.5"
        y="25.5"
        width="17.5"
        height="17.5"
        rx="3.2"
        fill={isFluent ? `url(#win12-br-${uid})` : color}
      />
    </svg>
  );
};

export const FluentSystemIcon: React.FC<{
  type: 'settings' | 'welcome' | 'weather' | 'notes' | 'calculator' | 'paint' | 'explorer';
  size?: number;
}> = ({ type, size = 24 }) => {
  const uid = useId().replace(/:/g, '');

  if (type === 'settings') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`gear-outer-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id={`gear-core-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60cdff" />
            <stop offset="100%" stopColor="#0067c0" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#gear-outer-${uid})`}
          d="M21 5h6l1.3 4.4c1.3.4 2.6.9 3.7 1.6l4.1-2.2 4.2 4.2-2.2 4.1c.7 1.1 1.2 2.4 1.6 3.7L44 21v6l-4.4 1.3c-.4 1.3-.9 2.6-1.6 3.7l2.2 4.1-4.2 4.2-4.1-2.2c-1.1.7-2.4 1.2-3.7 1.6L27 43h-6l-1.3-4.4c-1.3-.4-2.6-.9-3.7-1.6l-4.1 2.2-4.2-4.2 2.2-4.1c-.7-1.1-1.2-2.4-1.6-3.7L4 27v-6l4.4-1.3c.4-1.3.9-2.6 1.6-3.7l-2.2-4.1 4.2-4.2 4.1 2.2c1.1-.7 2.4-1.2 3.7-1.6L21 5z"
        />
        <circle cx="24" cy="24" r="9.5" fill="#e2e8f0" />
        <circle cx="24" cy="24" r="6.5" fill={`url(#gear-core-${uid})`} />
      </svg>
    );
  }

  if (type === 'welcome') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`note-bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60cdff" />
            <stop offset="100%" stopColor="#0067c0" />
          </linearGradient>
          <linearGradient id={`note-fold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#note-bg-${uid})`}
          d="M10 6h28a4 4 0 0 1 4 4v21l-11 11H10a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z"
        />
        <path fill={`url(#note-fold-${uid})`} d="M31 42V33a2 2 0 0 1 2-2h9L31 42z" />
        <rect x="13" y="15" width="22" height="3" rx="1.5" fill="#ffffff" opacity="0.95" />
        <rect x="13" y="22" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.82" />
        <rect x="13" y="29" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.7" />
      </svg>
    );
  }

  if (type === 'notes') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`sticky-bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <rect x="7" y="7" width="34" height="34" rx="7" fill={`url(#sticky-bg-${uid})`} />
        <path d="M7 14a7 7 0 0 1 7-7h20a7 7 0 0 1 7 7v2H7v-2z" fill="#d97706" opacity="0.28" />
        <rect x="13" y="20" width="22" height="2.8" rx="1.4" fill="#78350f" opacity="0.78" />
        <rect x="13" y="26.5" width="18" height="2.8" rx="1.4" fill="#78350f" opacity="0.65" />
        <rect x="13" y="33" width="12" height="2.8" rx="1.4" fill="#78350f" opacity="0.52" />
      </svg>
    );
  }

  if (type === 'calculator') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`calc-bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <rect x="9" y="5" width="30" height="38" rx="6" fill={`url(#calc-bg-${uid})`} />
        <rect x="13" y="9.5" width="22" height="8" rx="2.5" fill="#93c5fd" />
        <rect x="13" y="21" width="5.5" height="4.5" rx="1.2" fill="#e2e8f0" />
        <rect x="21.25" y="21" width="5.5" height="4.5" rx="1.2" fill="#e2e8f0" />
        <rect x="29.5" y="21" width="5.5" height="4.5" rx="1.2" fill="#38bdf8" />
        <rect x="13" y="28" width="5.5" height="4.5" rx="1.2" fill="#e2e8f0" />
        <rect x="21.25" y="28" width="5.5" height="4.5" rx="1.2" fill="#e2e8f0" />
        <rect x="29.5" y="28" width="5.5" height="11.5" rx="1.4" fill="#0078d4" />
        <rect x="13" y="35" width="5.5" height="4.5" rx="1.2" fill="#e2e8f0" />
        <rect x="21.25" y="35" width="5.5" height="4.5" rx="1.2" fill="#e2e8f0" />
      </svg>
    );
  }

  if (type === 'paint') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`paint-pal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <path
          d="M24 6C13.5 6 6 13.4 6 22.8c0 6.5 4.2 10.6 9.5 10.6 2.3 0 3.6 1.2 3.3 3.2-.3 2.5 1.4 5.4 5.2 5.4C34.5 42 42 34 42 23.2 42 13.5 34.2 6 24 6z"
          fill={`url(#paint-pal-${uid})`}
        />
        <circle cx="15" cy="20" r="3.4" fill="#ef4444" />
        <circle cx="22" cy="13.5" r="3.4" fill="#f59e0b" />
        <circle cx="31.5" cy="15.5" r="3.4" fill="#22c55e" />
        <circle cx="34.5" cy="24.5" r="3.4" fill="#3b82f6" />
        <circle cx="26" cy="34.5" r="2.8" fill="#64748b" opacity="0.55" />
      </svg>
    );
  }

  if (type === 'explorer') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`exp-back-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id={`exp-front-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path
          d="M6 12a4 4 0 0 1 4-4h10l3.5 4H38a4 4 0 0 1 4 4v4H6v-8z"
          fill={`url(#exp-back-${uid})`}
        />
        <rect x="6" y="16" width="36" height="24" rx="4.5" fill={`url(#exp-front-${uid})`} />
        <rect x="16" y="31" width="16" height="9" rx="2" fill="#0284c7" />
        <rect x="19" y="34" width="10" height="3" rx="1" fill="#e0f2fe" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`sun-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={`wcloud-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="18" r="9.5" fill={`url(#sun-grad-${uid})`} />
      <path
        fill={`url(#wcloud-grad-${uid})`}
        d="M15 38h19a8 8 0 0 0 1.4-15.9A10 10 0 0 0 16 20a7 7 0 0 0-1 18z"
      />
    </svg>
  );
};

export const UserAvatar: React.FC<{ size?: number; initials?: string; className?: string }> = ({
  size = 36,
  initials = 'JS',
  className = '',
}) => (
  <div
    className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#38bdf8] via-[#0078d4] to-[#0c4a6e] font-semibold text-white shadow-inner ring-1 ring-white/40 ${className}`}
    style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    aria-hidden="true"
  >
    <span>{initials}</span>
  </div>
);

export const Cloud3DIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 320 220"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cloudMain-${uid}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id={`cloudHighlight-${uid}`} cx="40%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
        </radialGradient>
        <filter id={`cloudDrop-${uid}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="4" dy="14" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter={`url(#cloudDrop-${uid})`}>
        <path
          d="M 76 172 H 236 C 266 172 288 150 288 122 C 288 97 269 76 244 73 C 236 40 206 18 171 18 C 135 18 105 42 97 76 C 92 75 87 74 82 74 C 50 74 26 98 26 126 C 26 152 48 172 76 172 Z"
          fill={`url(#cloudMain-${uid})`}
        />
        <circle cx="168" cy="84" r="64" fill={`url(#cloudHighlight-${uid})`} />
        <circle cx="90" cy="118" r="42" fill={`url(#cloudHighlight-${uid})`} />
        <circle cx="234" cy="118" r="44" fill={`url(#cloudHighlight-${uid})`} />
      </g>
    </svg>
  );
};

export const AppBrandIcon: React.FC<{ icon: AppIconKey; size?: number }> = ({ icon, size = 32 }) => {
  const uid = useId().replace(/:/g, '');

  switch (icon) {
    case 'edge':
      return (
        <svg width={size} height={size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={`edge-a-${uid}`} x1="63.33" y1="84.03" x2="241.67" y2="84.03" gradientTransform="matrix(1 0 0 -1 0 266)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0c59a4" />
              <stop offset="1" stopColor="#114a8b" />
            </linearGradient>
            <linearGradient id={`edge-c-${uid}`} x1="157.35" y1="161.39" x2="45.96" y2="40.06" gradientTransform="matrix(1 0 0 -1 0 266)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1b9de2" />
              <stop offset=".67" stopColor="#0680d7" />
              <stop offset="1" stopColor="#0078d4" />
            </linearGradient>
            <radialGradient id={`edge-e-${uid}`} cx="113.37" cy="570.21" r="202.43" gradientTransform="matrix(-.04 1 2.13 .08 -1179.54 -106.69)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#35c1f1" />
              <stop offset=".31" stopColor="#2bc3d2" />
              <stop offset=".67" stopColor="#36c752" />
            </radialGradient>
          </defs>
          <path d="M235.68 195.46a93.73 93.73 0 01-10.54 4.71 101.87 101.87 0 01-35.9 6.46c-47.32 0-88.54-32.55-88.54-74.32A31.48 31.48 0 01117.13 105c-42.8 1.8-53.8 46.4-53.8 72.53 0 73.88 68.09 81.37 82.76 81.37 7.91 0 19.84-2.3 27-4.56l1.31-.44a128.34 128.34 0 0066.6-52.8 4 4 0 00-5.32-5.64z" transform="translate(-4.63 -4.92)" fill={`url(#edge-a-${uid})`} />
          <path d="M110.34 246.34A79.2 79.2 0 0187.6 225a80.72 80.72 0 0129.53-120c3.12-1.47 8.45-4.13 15.54-4a32.35 32.35 0 0125.69 13 31.88 31.88 0 016.36 18.66c0-.21 24.46-79.6-80-79.6-43.9 0-80 41.66-80 78.21a130.15 130.15 0 0012.11 56 128 128 0 00156.38 67.11 75.55 75.55 0 01-62.78-8z" transform="translate(-4.63 -4.92)" fill={`url(#edge-c-${uid})`} />
          <path d="M156.94 153.78c-.81 1.05-3.3 2.5-3.3 5.66 0 2.61 1.7 5.12 4.72 7.23 14.38 10 41.49 8.68 41.56 8.68a59.56 59.56 0 0030.27-8.35 61.38 61.38 0 0030.43-52.88c.26-22.41-8-37.31-11.34-43.91-21.19-41.45-66.93-65.29-116.67-65.29a128 128 0 00-128 126.2c.48-36.54 36.8-66.05 80-66.05 3.5 0 23.46.34 42 10.07 16.34 8.58 24.9 18.94 30.85 29.21 6.18 10.67 7.28 24.15 7.28 29.52s-2.74 13.33-7.8 19.91z" transform="translate(-4.63 -4.92)" fill={`url(#edge-e-${uid})`} />
        </svg>
      );

    case 'word':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={`word-bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <rect x="14" y="6" width="28" height="36" rx="5" fill={`url(#word-bg-${uid})`} />
          <rect x="14" y="15" width="28" height="9" fill="#2563eb" opacity="0.55" />
          <rect x="14" y="24" width="28" height="9" fill="#1e40af" opacity="0.65" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#185abd" />
          <path d="M9.5 18.5h2.2l1.6 7.5 1.9-7.5h2l1.8 7.5 1.7-7.5h2.1l-2.7 11h-2.1l-1.8-7.3-1.8 7.3h-2.1z" fill="#fff" />
        </svg>
      );

    case 'excel':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={`excel-bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          <rect x="14" y="6" width="28" height="36" rx="5" fill={`url(#excel-bg-${uid})`} />
          <rect x="14" y="24" width="28" height="9" fill="#166534" opacity="0.55" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#107c41" />
          <path d="M10 18.5h2.5l2.5 4.1 2.5-4.1H20l-3.6 5.5 3.7 5.5h-2.5L15 25.3l-2.6 4.2H9.9l3.7-5.5z" fill="#fff" />
        </svg>
      );

    case 'powerpoint':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="28" cy="24" r="16" fill="#ff8f6b" />
          <path d="M28 8a16 16 0 0 1 16 16H28z" fill="#ed6c47" />
          <path d="M28 24h16a16 16 0 0 1-16 16z" fill="#d35230" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#c43e1c" />
          <path d="M11 18.5h4.4c2.4 0 3.9 1.3 3.9 3.5s-1.5 3.6-3.9 3.6h-2.1v3.9H11zm2.3 5.2h1.9c1.1 0 1.8-.6 1.8-1.7s-.7-1.6-1.8-1.6h-1.9z" fill="#fff" />
        </svg>
      );

    case 'outlook':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="16" y="7" width="26" height="26" rx="4" fill="#38bdf8" />
          <path d="M14 19l15 10 15-10v19a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#0284c7" />
          <path d="M14 19l15 10 15-10-15 8z" fill="#7dd3fc" opacity="0.6" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#0369a1" />
          <circle cx="15" cy="24" r="5" fill="none" stroke="#fff" strokeWidth="2.4" />
        </svg>
      );

    case 'calendar':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="8" width="36" height="34" rx="6" fill="#e0f2fe" />
          <path d="M6 14a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v6H6v-6z" fill="#0284c7" />
          <rect x="13" y="25" width="6" height="5" rx="1.2" fill="#0284c7" />
          <rect x="21" y="25" width="6" height="5" rx="1.2" fill="#38bdf8" />
          <rect x="29" y="25" width="6" height="5" rx="1.2" fill="#0284c7" />
          <rect x="13" y="32" width="6" height="5" rx="1.2" fill="#38bdf8" />
          <rect x="21" y="32" width="6" height="5" rx="1.2" fill="#0284c7" />
        </svg>
      );

    case 'xbox':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#e2e8f0" />
          <path fill="#16a34a" d="M40.21,35.7c-0.66,0.93-1.41,1.8-2.23,2.59c-0.07-0.61-0.31-2.47-0.98-3.79 c-1.5-3-8-11-13-14.5c-5,3.5-11.5,11.5-13,14.5c-0.67,1.32-0.91,3.18-0.98,3.79C9.2,37.5,8.45,36.63,7.79,35.7 C7.76,35.08,7.8,34.2,8,33c0.74-4.47,8.5-16,11-18c-3.4-3.4-6.8-4.91-8.82-5.45c1-0.96,2.1-1.81,3.28-2.54 C19.15,7.1,22.05,9.03,24,10c1.95-0.97,4.85-2.9,10.54-2.99c1.18,0.73,2.28,1.58,3.28,2.54C35.8,10.09,32.4,11.6,29,15 c2.5,2,10.26,13.53,11,18C40.2,34.2,40.24,35.08,40.21,35.7z" />
        </svg>
      );

    case 'codepen':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M 25 4 L 4 17.34375 L 4 32.652344 L 25 46 L 46 32.65625 L 46 17.34375 Z M 25 29.183594 L 19.066406 25.070313 L 25 21.023438 L 30.933594 25.070313 Z M 27 17.605469 L 27 9.949219 L 40.429688 18.484375 L 34.410156 22.65625 Z M 23 17.605469 L 15.589844 22.65625 L 9.570313 18.484375 L 23 9.949219 Z M 12.09375 25.042969 L 8 27.832031 L 8 22.203125 Z M 15.570313 27.453125 L 23 32.605469 L 23 40.050781 L 9.589844 31.527344 Z M 27 32.605469 L 34.429688 27.453125 L 40.410156 31.527344 L 27 40.050781 Z M 37.90625 25.042969 L 42 22.203125 L 42 27.832031 Z" />
        </svg>
      );

    case 'netflix':
      return (
        <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="4" y="4" width="34" height="34" rx="8" fill="#18181b" />
          <path fill="#b71c1c" d="M29,10h-4.5v22c2.2,0,4.5,0.4,4.5,0.4V10z" />
          <path fill="#b71c1c" d="M13,10h4.5v22c-2.2,0-4.5,0.4-4.5,0.4V10z" />
          <path fill="#e53935" d="M17.5,10H13l11.5,22c2.2,0,4.5,0.4,4.5,0.4L17.5,10z" />
        </svg>
      );

    case 'teams':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="35" cy="14" r="4" fill="#4f46e5" />
          <rect x="27" y="20" width="14" height="14" rx="4" fill="#4f46e5" />
          <circle cx="24" cy="12" r="5.5" fill="#818cf8" />
          <rect x="14" y="19" width="20" height="20" rx="6" fill="#6366f1" />
          <rect x="4" y="13" width="20" height="20" rx="5" fill="#4338ca" />
          <path d="M9.5 18.5h9v2.1h-3.4V29h-2.2v-8.4H9.5z" fill="#fff" />
        </svg>
      );

    case 'access':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="28" cy="13" rx="14" ry="5" fill="#fb7185" />
          <path d="M14 13v22c0 2.8 6.3 5 14 5s14-2.2 14-5V13c0 2.8-6.3 5-14 5s-14-2.2-14-5z" fill="#be123c" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#9f1239" />
          <path d="M13.6 18.5h2.7l3.9 11h-2.4l-.8-2.4h-4.1l-.8 2.4H9.7zm.2 6.6h2.7l-1.3-4.2z" fill="#fff" />
        </svg>
      );

    case 'office':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={`office-bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <path fill={`url(#office-bg-${uid})`} d="M8 35l19 7 13-4V10L27 6 8 13v22l7-2.5V16l12-3.5V35l-19-5z" />
        </svg>
      );

    case 'onedrive':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M18 16a11 11 0 0 1 20.6 4.8A8 8 0 0 1 36 36H13a9 9 0 0 1-1.2-17.9A11 11 0 0 1 18 16z" fill="#0369a1" />
          <path d="M29 22a9 9 0 0 1 14 7.5A6.5 6.5 0 0 1 36.5 36H19a8 8 0 0 1 10-14z" fill="#38bdf8" />
        </svg>
      );

    case 'onenote':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="14" y="6" width="28" height="36" rx="5" fill="#d946ef" />
          <rect x="14" y="24" width="28" height="18" rx="4" fill="#a21caf" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#7e22ce" />
          <path d="M10.5 29.5v-11h2.2l4.4 7v-7h2.1v11H17l-4.4-7v7z" fill="#fff" />
        </svg>
      );

    case 'project':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="14" y="8" width="28" height="32" rx="5" fill="#34d399" />
          <rect x="20" y="15" width="14" height="5" rx="1.5" fill="#fff" opacity="0.88" />
          <rect x="24" y="23" width="13" height="5" rx="1.5" fill="#fff" opacity="0.88" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#047857" />
          <path d="M11 18.5h4.3c2.4 0 3.8 1.3 3.8 3.5s-1.4 3.5-3.8 3.5h-2v4H11zm2.3 5.1h1.8c1.1 0 1.8-.6 1.8-1.6s-.7-1.6-1.8-1.6h-1.8z" fill="#fff" />
        </svg>
      );

    case 'sharepoint':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="24" cy="17" r="11" fill="#0e7490" />
          <circle cx="34" cy="27" r="9" fill="#06b6d4" />
          <circle cx="22" cy="34" r="7" fill="#67e8f9" />
          <rect x="4" y="13" width="22" height="22" rx="5" fill="#0f766e" />
          <path d="M15.2 29.7c-2.2 0-3.7-.9-4-2.5h2.2c.2.7.9 1 1.8 1 1 0 1.6-.4 1.6-1.1 0-.6-.4-.9-1.5-1.2l-1.2-.3c-1.7-.4-2.6-1.3-2.6-2.8 0-1.7 1.4-2.9 3.6-2.9 2.1 0 3.5 1 3.7 2.5h-2.1c-.2-.6-.8-1-1.6-1s-1.4.4-1.4 1 .4.9 1.4 1.1l1.2.3c1.8.4 2.8 1.3 2.8 2.9 0 1.8-1.5 3-3.9 3z" fill="#fff" />
        </svg>
      );

    case 'spotify':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#1db954" />
          <path d="M14 18.5c6.5-1.8 14.2-1.4 20 1.8" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M15.8 24.3c5.4-1.4 11.7-1 16.5 1.6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M17.5 29.8c4.3-1 9.2-.7 13 1.3" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'photoshop':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="6" width="36" height="36" rx="9" fill="#31a8ff" />
          <rect x="9" y="9" width="30" height="30" rx="7" fill="#001e36" />
          <path d="M15 30.5V16.8h4.8c2.9 0 4.8 1.6 4.8 4.4s-1.9 4.5-4.8 4.5h-2.2v4.8zm2.6-7.1h2c1.4 0 2.3-.8 2.3-2.2s-.9-2.1-2.3-2.1h-2zM29.7 30.7c-2.2 0-3.7-.9-4-2.5h2.2c.2.7.9 1 1.8 1 .9 0 1.4-.4 1.4-.9s-.4-.9-1.5-1.3c-2-.7-3.4-1.5-3.4-3.3 0-1.9 1.5-3.2 3.7-3.2 2.1 0 3.5 1 3.7 2.6h-2.2c-.1-.7-.7-1-1.5-1s-1.3.4-1.3.9.4.8 1.6 1.3c2 .7 3.3 1.5 3.3 3.3 0 2-1.5 3.1-3.8 3.1z" fill="#31a8ff" />
        </svg>
      );

    case 'notes':
      return <FluentSystemIcon type="notes" size={size} />;

    case 'calculator':
      return <FluentSystemIcon type="calculator" size={size} />;

    case 'paint':
      return <FluentSystemIcon type="paint" size={size} />;

    case 'explorer':
      return <FluentSystemIcon type="explorer" size={size} />;
  }
};
