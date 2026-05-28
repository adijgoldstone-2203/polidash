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
              <h1 className="font-['Newsreader'] text-5xl md:text-7xl tracking-tight text-primary mb-4" style={{}}>
                {t('profiles.title1')} <span className="italic font-bold" style={{}}>{t('profiles.title2')}</span>
              </h1>
              <div className="h-1 w-24 bg-primary mb-6"></div>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                {t('profiles.desc')}
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
              {[...politicians].sort((a, b) => tPolitician(a.name).localeCompare(tPolitician(b.name))).map((pol, idx) => (
                <div key={idx} className="bg-surface-container-lowest transition-all hover:bg-white p-6 relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <a href={`#/profile/${pol.id}`} className="shrink-0">
                        {pol.imageUrl ? (
                          <OptimizedImage alt={`portrait of ${tPolitician(pol.name)}`} className="w-16 h-16 object-cover object-top rounded-full shadow-lg hover:scale-105 transition-all duration-300" src={pol.imageUrl} />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-500 text-3xl">person</span>
                          </div>
                        )}
                      </a>
                      
                      <div>
                        <a href={`#/profile/${pol.id}`} className="hover:text-secondary transition-colors">
                          <h2 className="font-['Newsreader'] text-2xl font-bold text-primary leading-none">{tPolitician(pol.name)}</h2>
                        </a>
                        <p className="text-xs font-bold uppercase tracking-widest mt-1 text-secondary">{tParty(pol.party)}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="block text-2xl font-['Newsreader'] italic font-bold">{pol.seats}</span>
                      <div className="flex flex-col">
                        <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-400 font-bold">{t('profiles.seats')}</span>
                        <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-400 font-bold">{t('profiles.held')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-start">
                    <a href={`#/profile/${pol.id}`} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-secondary transition-colors">
                      {t('profiles.viewFull')} <span className="material-symbols-outlined text-base">{lang === 'he' ? 'arrow_back' : 'arrow_forward'}</span>
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
