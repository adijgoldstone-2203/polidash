import React from 'react';
import { useLanguage } from '../i18n';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  const { t, dir } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-stone-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        dir={dir}
        className="relative bg-[#fbf9f5] dark:bg-[#162839] w-full max-w-3xl rounded-xl border border-stone-200/50 dark:border-slate-800/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col my-8 max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200/50 dark:border-slate-800/50 bg-stone-50 dark:bg-slate-900/40">
          <div>
            <h2 className="font-headline text-xl md:text-2xl font-bold text-primary dark:text-[#fbf9f5]">
              {t('methodology.title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('methodology.subtitle')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6 text-sm leading-relaxed text-on-surface-variant dark:text-slate-300">
          <p className="font-body text-base font-medium text-primary dark:text-[#fbf9f5] border-s-4 border-secondary ps-4">
            {t('methodology.intro')}
          </p>

          <hr className="border-stone-200/50 dark:border-slate-800/50" />

          {/* Steps */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-secondary/15 text-secondary rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">database</span>
              </div>
              <div>
                <h4 className="font-headline text-base font-bold text-primary dark:text-[#fbf9f5] mb-1">
                  {t('methodology.step1.title')}
                </h4>
                <p>{t('methodology.step1.desc')}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-secondary/15 text-secondary rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h4 className="font-headline text-base font-bold text-primary dark:text-[#fbf9f5] mb-1">
                  {t('methodology.step2.title')}
                </h4>
                <p>{t('methodology.step2.desc')}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-secondary/15 text-secondary rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">rule</span>
              </div>
              <div>
                <h4 className="font-headline text-base font-bold text-primary dark:text-[#fbf9f5] mb-1">
                  {t('methodology.step3.title')}
                </h4>
                <p>{t('methodology.step3.desc')}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-secondary/15 text-secondary rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline text-base font-bold text-primary dark:text-[#fbf9f5] mb-1">
                  {t('methodology.step4.title')}
                </h4>
                <p>{t('methodology.step4.desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-stone-200/50 dark:border-slate-800/50 bg-stone-50 dark:bg-slate-900/40">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary dark:bg-slate-800 text-white font-label font-bold text-sm rounded hover:bg-secondary transition-all cursor-pointer"
          >
            {t('methodology.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;
