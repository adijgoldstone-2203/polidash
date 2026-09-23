import React, { useEffect } from 'react';
import { useLanguage } from '../i18n';

interface DisclaimerPopupProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ isOpen, onDismiss }) => {
  const { t, dir } = useLanguage();

  // Lock body scroll while fullscreen disclaimer modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-disclaimer-title"
    >
      {/* Fullscreen Backdrop Blur */}
      <div 
        className="fixed inset-0 bg-stone-900/65 dark:bg-slate-950/85 backdrop-blur-md transition-opacity cursor-pointer animate-in fade-in duration-200" 
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Fullscreen Modal Card */}
      <div 
        dir={dir}
        className="relative bg-[#fbf9f5] dark:bg-[#162839] w-full max-w-2xl lg:max-w-3xl rounded-2xl border border-stone-200/80 dark:border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col my-auto max-h-[90vh] z-10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/60 dark:border-slate-800/60 bg-stone-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl leading-none">balance</span>
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 id="legal-disclaimer-title" className="font-['Newsreader'] italic font-bold text-xl md:text-2xl text-primary dark:text-[#fbf9f5]">
                  {t('home.disclaimer.title')}
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20 hidden sm:inline-block">
                  {t('home.disclaimer.badge')}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block sm:hidden mt-0.5 font-medium">
                {t('home.disclaimer.badge')}
              </span>
            </div>
          </div>
          <button 
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-stone-200/60 dark:hover:bg-slate-800/60 focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl leading-none">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-start">
          {/* Main Statement Box */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-stone-200/70 dark:border-slate-700/60 shadow-sm">
            <p className="font-['Inter'] text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('home.disclaimer.text')}
            </p>
          </div>

          {/* 3 Informational Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/30 border border-stone-200/50 dark:border-slate-800/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">school</span>
                <span>{t('home.disclaimer.pillar1.title')}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {t('home.disclaimer.pillar1.desc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/30 border border-stone-200/50 dark:border-slate-800/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">how_to_vote</span>
                <span>{t('home.disclaimer.pillar2.title')}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {t('home.disclaimer.pillar2.desc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/30 border border-stone-200/50 dark:border-slate-800/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span>{t('home.disclaimer.pillar3.title')}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {t('home.disclaimer.pillar3.desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200/60 dark:border-slate-800/60 bg-stone-50/80 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <a 
            href="#/terms" 
            onClick={onDismiss}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>{t('home.disclaimer.termsLink')}</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>

          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-8 py-2.5 bg-primary hover:bg-secondary text-white font-['Inter'] font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{t('home.disclaimer.understandBtn')}</span>
            <span className="material-symbols-outlined text-base">check</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
