import React from 'react';
import { useLanguage } from '../i18n';

interface DisclaimerPopupProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ isOpen, onDismiss }) => {
  const { t, dir } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      dir={dir}
      role="dialog"
      aria-labelledby="legal-disclaimer-title"
      className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 max-w-xl w-auto sm:w-full z-[140] bg-white/95 dark:bg-[#162839]/95 backdrop-blur-md border border-stone-200/90 dark:border-slate-700/90 shadow-2xl rounded-2xl p-4 sm:p-5 text-start transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ring-1 ring-black/5"
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg leading-none">balance</span>
          </span>
          <h3 id="legal-disclaimer-title" className="font-['Newsreader'] italic font-bold text-base text-primary dark:text-[#fbf9f5]">
            {t('home.disclaimer.title')}
          </h3>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20 hidden sm:inline-block">
            {t('home.disclaimer.badge')}
          </span>
        </div>
        <button 
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full focus:outline-none cursor-pointer"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-lg leading-none">close</span>
        </button>
      </div>

      <p className="font-['Inter'] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {t('home.disclaimer.text')}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-slate-800">
        <a 
          href="#/terms" 
          className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 transition-colors"
        >
          <span>{t('home.disclaimer.termsLink')}</span>
          <span className="material-symbols-outlined text-xs">open_in_new</span>
        </a>
        <button
          onClick={onDismiss}
          className="px-5 py-2 bg-primary hover:bg-secondary text-white font-['Inter'] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
        >
          {t('home.disclaimer.understandBtn')}
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
