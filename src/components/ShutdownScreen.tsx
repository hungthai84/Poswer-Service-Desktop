import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power } from 'lucide-react';
import { LanguageId, UI_TEXT } from '../data/desktopData';

interface ShutdownScreenProps {
  isShutDown: boolean;
  language: LanguageId;
  onRestart: () => void;
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({
  isShutDown,
  language,
  onRestart,
}) => {
  const copy = UI_TEXT[language].shutdown;

  return (
    <AnimatePresence>
      {isShutDown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label="System shut down"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-black text-white"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-[#38bdf8]" />
          <p className="font-play text-xl font-normal tracking-wide text-white/90">
            {copy.message}
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0078d4] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#106ebe] focus-visible:ring-2 focus-visible:ring-[#60cdff] focus-visible:outline-none"
          >
            <Power size={16} />
            <span>{copy.buttonLabel}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
