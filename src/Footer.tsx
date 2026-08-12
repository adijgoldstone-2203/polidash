import React from 'react';
import { useLanguage } from './i18n';
import { AI_DISCLAIMER } from './data';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-12 border-t border-stone-200/60 dark:border-slate-800/60 bg-[#fbf9f5] dark:bg-[#162839] transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start px-4 md:px-8 gap-8">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">PoliDash</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20">Israel 2026</span>
          </div>
          <p className="font-['Inter'] text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {AI_DISCLAIMER.full}
          </p>
          <p className="font-['Inter'] text-[11px] text-slate-400 dark:text-slate-500">
            {t('footer.copyright')}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <a className="font-['Inter'] text-xs uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300 hover:text-secondary transition-colors" href="#/polls#methodology">
            Methodology
          </a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300 hover:text-secondary transition-colors" href="#/reply">
            Right of Reply
          </a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300 hover:text-secondary transition-colors" href="#/privacy">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
