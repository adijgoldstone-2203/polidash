import React from 'react';

import { politicians } from './data';
import OptimizedImage from './components/OptimizedImage';
import { useLanguage } from './i18n';

const Profiles: React.FC = () => {
  const { t, tPolitician, tParty, lang } = useLanguage();

  return (
    <>
      <div className="min-h-screen bg-[#fbf9f5] px-6 lg:px-12 pt-8 pb-20">
        <main className="max-w-7xl mx-auto">
          <section className="mb-12">
              <h1 className="font-['Newsreader'] text-3xl sm:text-4xl md:text-7xl tracking-tight text-primary mb-4" style={{}}>
                {t('profiles.title1')} <span className="italic font-bold" style={{}}>{t('profiles.title2')}</span>
              </h1>
              <div className="h-1 w-24 bg-primary mb-6"></div>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                {t('profiles.desc')}
              </p>
            </section>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-24">
              {[...politicians].sort((a, b) => tPolitician(a.name).localeCompare(tPolitician(b.name))).map((pol, idx) => (
                <div key={idx} className="bg-surface-container-lowest transition-all hover:bg-white p-4 md:p-6 relative overflow-hidden group flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-4 sm:mb-8 text-center sm:text-start">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                      <a href={`#/profile/${pol.id}`} className="shrink-0">
                        {pol.imageUrl ? (
                          <OptimizedImage alt={`portrait of ${tPolitician(pol.name)}`} className="w-12 h-12 sm:w-16 sm:h-16 object-cover object-top rounded-full shadow-md sm:shadow-lg hover:scale-105 transition-all duration-300" src={pol.imageUrl} />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-500 text-xl sm:text-3xl">person</span>
                          </div>
                        )}
                      </a>
                      
                      <div>
                        <a href={`#/profile/${pol.id}`} className="hover:text-secondary transition-colors">
                          <h2 className="font-['Newsreader'] text-base sm:text-2xl font-bold text-primary leading-tight sm:leading-none">{tPolitician(pol.name)}</h2>
                        </a>
                        <p className="text-[9px] sm:text-xs font-bold uppercase tracking-widest mt-1 text-secondary">{tParty(pol.party)}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col flex-row items-baseline gap-1 justify-center sm:text-end">
                      <span className="block text-lg sm:text-2xl font-['Newsreader'] italic font-bold leading-none">{pol.seats}</span>
                      <div className="flex sm:flex-col flex-row gap-1 sm:gap-0">
                        <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-400 font-bold">{t('profiles.seats')}</span>
                        <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-400 font-bold sm:block hidden">{t('profiles.held')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4 flex justify-center sm:justify-start">
                    <a href={`#/profile/${pol.id}`} className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 group-hover:text-secondary transition-colors">
                      {t('profiles.viewFull')} <span className="material-symbols-outlined text-xs sm:text-base">{lang === 'he' ? 'arrow_back' : 'arrow_forward'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
        </main>
      </div>
    </>
  );
};

export default Profiles;
