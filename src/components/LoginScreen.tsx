import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, Globe, Lock, Moon, Power, Sun } from 'lucide-react';
import { LOGIN_ACCOUNT, LanguageId, UI_TEXT } from '../data/desktopData';
import { ThemeId } from '../data/themes';
import { UserAvatar, WindowsLogo } from './FluentIcons';

interface LoginScreenProps {
  theme: ThemeId;
  language: LanguageId;
  onLoginSuccess: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onShutdown: () => void;
}

function formatClock(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatFullDate(date: Date, language: LanguageId): string {
  return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  theme,
  language,
  onLoginSuccess,
  onToggleTheme,
  onToggleLanguage,
  onShutdown,
}) => {
  const [username, setUsername] = useState<string>(LOGIN_ACCOUNT.username);
  const [password, setPassword] = useState<string>(LOGIN_ACCOUNT.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  const copy = UI_TEXT[language].login;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidUser = username.trim().toLowerCase() === LOGIN_ACCOUNT.username.toLowerCase();
    const isValidPass = password === LOGIN_ACCOUNT.password;

    if (!isValidUser || !isValidPass) {
      setError(copy.errorMessage);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 280);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[900] flex flex-col items-center justify-between bg-slate-900/25 px-4 py-6 backdrop-blur-2xl select-none dark:bg-black/45"
    >
      {/* Top Bar: Windows 12 Brand & Quick Controls */}
      <div className="flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2 text-white drop-shadow-sm">
          <WindowsLogo size={20} color="#ffffff" />
          <span className="text-sm font-bold tracking-tight">Windows 12</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="win-dock flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold"
          >
            <Globe size={14} className="text-[var(--win-accent)]" />
            <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={UI_TEXT[language].taskbar.toggleTheme}
            className="win-dock flex h-9 w-9 items-center justify-center rounded-xl"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            onClick={onShutdown}
            aria-label={UI_TEXT[language].startMenu.shutdownTooltip}
            className="win-dock flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <Power size={15} />
          </button>
        </div>
      </div>

      {/* Center Lock Clock + Login Card */}
      <div className="flex w-full max-w-[380px] flex-col items-center">
        <div className="mb-7 text-center text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
          <div className="text-6xl font-bold tracking-tight tabular-nums sm:text-7xl">
            {formatClock(now)}
          </div>
          <div className="mt-1.5 text-sm font-medium capitalize opacity-95">
            {formatFullDate(now, language)}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="win-acrylic flex w-full flex-col items-center rounded-3xl px-7 py-8"
        >
          <UserAvatar size={76} initials={LOGIN_ACCOUNT.initials} className="mb-3 shadow-md" />

          <h1 className="text-xl font-bold text-[var(--win-text-primary)]">
            {LOGIN_ACCOUNT.username}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--win-text-secondary)]">{copy.title}</p>

          <div className="mt-5 w-full space-y-3">
            <div>
              <label
                htmlFor="login-username"
                className="mb-1 block text-xs font-medium text-[var(--win-text-secondary)]"
              >
                {copy.usernameLabel}
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={copy.usernamePlaceholder}
                autoComplete="username"
                className="w-full rounded-xl border border-[var(--win-border-subtle)] bg-white/75 px-3.5 py-2.5 text-sm font-medium text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:ring-2 focus:ring-[var(--win-accent)] focus:outline-none dark:bg-black/35"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1 block text-xs font-medium text-[var(--win-text-secondary)]"
              >
                {copy.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={copy.passwordPlaceholder}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[var(--win-border-subtle)] bg-white/75 py-2.5 pr-10 pl-3.5 text-sm text-[var(--win-text-primary)] placeholder:text-[var(--win-text-secondary)] focus:ring-2 focus:ring-[var(--win-accent)] focus:outline-none dark:bg-black/35"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-[var(--win-text-secondary)] hover:text-[var(--win-text-primary)]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-3 w-full rounded-xl bg-rose-500/15 px-3 py-2 text-center text-xs font-medium text-rose-700 dark:text-rose-300"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--win-accent-bright)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-70"
          >
            {isSubmitting ? (
              <span>{copy.signingIn}</span>
            ) : (
              <>
                <span>{copy.signInButton}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="mt-3.5 text-center text-[11px] text-[var(--win-text-secondary)]">
            {copy.hint}
          </p>
        </form>
      </div>

      {/* Bottom Subtle Lock Badge */}
      <div className="flex items-center gap-1.5 text-xs text-white/80">
        <Lock size={13} />
        <span>Windows 12 Fluent</span>
      </div>
    </motion.div>
  );
};
