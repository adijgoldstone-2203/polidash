import React from 'react';
import { useLanguage } from './i18n';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 gap-8 py-12 border-t border-stone-200/50 dark:border-slate-800/50 bg-[#fbf9f5] dark:bg-[#162839]">
      <div className="flex flex-col gap-2">
        <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#162839] dark:text-[#fbf9f5] font-bold">
          {t('footer.copyright')}
        </p>
      </div>
      <div className="flex gap-8">
        <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">
          {t('footer.methodology')}
        </a>
        <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1 font-bold text-secondary" href="#/transparency">
          {t('footer.reply')}
        </a>
        <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">
          {t('footer.privacy')}
        </a>
        <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white underline decoration-1" href="#">
          {t('footer.terms')}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
