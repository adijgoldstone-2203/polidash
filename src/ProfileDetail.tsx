import React, { useState } from 'react';
import { politicians, AI_DISCLAIMER } from './data';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './components/OptimizedImage';
import { useLanguage } from './i18n';
import { IMAGE_CREDITS } from './utils/imageCredits';

interface Props {
  id: string;
}

const ProfileDetail: React.FC<Props> = ({ id }) => {
  const politician = politicians.find(p => p.id === id) || politicians[0];
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  
  const { t, tPolitician, tParty, tIssue, tIntelligenceTopic, tStance, tIssueDefinition, tBio, tQuote, tFacts, tIntelligence, lang } = useLanguage();
  const credit = IMAGE_CREDITS[politician.id];

  return (
    <>
      <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] px-6 lg:px-12 pt-8 pb-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <a className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#/profiles">
                <span className="material-symbols-outlined text-base">{lang === 'he' ? 'arrow_forward' : 'arrow_back'}</span> {t('profileDetail.back')}
              </a>
            </div>

            <section className="">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Column 1: Identity & Bio */}
                <div className="lg:col-span-4">
                  <div className="sticky top-24">
                    {politician.imageUrl ? (
                      <div className="mb-6 lg:mb-8 text-center lg:text-start">
                        <OptimizedImage alt={`portrait of ${tPolitician(politician.name)}`} className="w-40 h-40 lg:w-full lg:h-auto aspect-square object-cover object-top rounded-full lg:rounded-2xl mx-auto lg:mx-0 shadow-md" src={politician.imageUrl} />
                        {credit && (
                          <div className="text-[10px] text-slate-400 mt-2 px-2">
                            {t('profileDetail.photoCredit')}:{' '}
                            <a href={credit.source} target="_blank" rel="noreferrer" className="underline hover:text-primary transition-colors">
                              {credit.attribution}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-40 h-40 lg:w-full lg:h-auto aspect-square bg-slate-200 rounded-full lg:rounded-2xl mx-auto lg:mx-0 mb-6 lg:mb-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl lg:text-7xl text-slate-400">person</span>
                      </div>
                    )}
                    <div className="text-center lg:text-start">
                      <div className="flex items-center justify-center lg:justify-start gap-3 mb-1">
                        <h2 className="font-['Newsreader'] text-3xl md:text-4xl font-bold text-primary dark:text-[#fbf9f5]">{tPolitician(politician.name)}</h2>
                        {politician.ballotLetters && (
                          <span lang="he" dir="rtl" className="font-['Suez_One'] text-2xl font-black text-secondary px-2.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-700/70">
                            {politician.ballotLetters}
                          </span>
                        )}
                      </div>
                      <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">
                        {tParty(politician.party)} • {politician.seats !== "N/A" ? `${politician.seats} ${t('profileDetail.seats')}` : t('profileDetail.na')}
                      </p>
                    </div>
                    
                    <div className="font-['Inter'] text-slate-600 dark:text-slate-300 leading-relaxed border-s-2 border-stone-200 dark:border-slate-700 ps-6 mb-8 space-y-6">
                      <p className="italic font-medium text-slate-700 dark:text-slate-200 text-lg">"{tQuote(politician.id)}"</p>
                      <p>{tBio(politician.id)}</p>
                      {tFacts(politician.id) && tFacts(politician.id).length > 0 && (
                        <ul className="list-disc ms-5 space-y-2 mt-4 text-sm font-medium">
                          {tFacts(politician.id).map((fact, i) => (
                            <li key={i}>{fact}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <a href={politician.partyWebsite} target="_blank" rel="noreferrer" className="w-full bg-primary dark:bg-secondary text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all flex items-center justify-center gap-2 rounded-lg">
                        {t('profileDetail.partyLink')} <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Intelligence Data */}
                <div className="lg:col-span-8 space-y-16">
                  {/* Binary Stance Board */}
                  <div>
                    <h3 className="font-['Newsreader'] text-2xl font-bold mb-8 text-primary dark:text-[#fbf9f5] flex items-center justify-between">
                      <span>{t('profileDetail.stanceBoard')}</span>
                      <span className="text-xs text-slate-400 font-sans font-medium">Click any stance for citations (↗)</span>
                    </h3>
                    <div className="relative">
                      <div className={`grid grid-cols-3 gap-1 md:gap-1.5 transition-all duration-500 ${expandedTopic ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                        {Object.entries(politician.stances).map(([topic, status], i) => {
                          let bgClass = "bg-surface-container-highest dark:bg-[#1a2e40]";
                          let labelColor = "text-slate-500 dark:text-slate-400";
                          let valColor = "text-slate-600 dark:text-slate-200";
                          let iconName = "question_mark";
                          let iconColor = "text-slate-400";
                          
                          if (status.toUpperCase() === "SUPPORT") {
                            bgClass = "bg-secondary-container dark:bg-[#1b382b]";
                            labelColor = "text-on-secondary-container dark:text-emerald-300";
                            valColor = "text-on-secondary-container dark:text-emerald-200";
                            iconName = "check_circle";
                            iconColor = "text-on-secondary-container dark:text-emerald-300";
                          } else if (status.toUpperCase() === "OPPOSE") {
                            bgClass = "bg-primary dark:bg-[#2c1d22]";
                            labelColor = "text-slate-300 dark:text-rose-300";
                            valColor = "text-white dark:text-rose-100";
                            iconName = "cancel";
                            iconColor = "text-white dark:text-rose-300";
                          }

                          const source = politician.stanceSources?.[topic];

                          return (
                            <div 
                              key={i} 
                              onClick={() => setExpandedTopic(topic)}
                              className={`${bgClass} p-2 md:p-6 flex flex-col justify-between h-20 sm:h-24 md:h-32 cursor-pointer hover:scale-[1.03] hover:shadow-xl hover:z-10 transition-all duration-300 group border-2 border-transparent hover:border-black/5 dark:hover:border-white/10 relative`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-[7.5px] sm:text-[9px] md:text-[10px] font-bold ${labelColor} uppercase tracking-wider`}>
                                  {tIssue(topic)}
                                </p>
                                <div className="flex items-center gap-1">
                                  {source && (
                                    <a
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={`Source: ${source.title} (${source.publisher})`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-secondary font-black text-xs hover:scale-125 transition-transform"
                                    >
                                      ↗
                                    </a>
                                  )}
                                  <span className={`material-symbols-outlined text-[10px] md:text-sm ${labelColor} opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0`}>open_in_full</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`${valColor} font-black text-xs sm:text-sm md:text-xl`}>{tStance(status)}</span>
                                <span className={`material-symbols-outlined text-xs sm:text-sm md:text-base ${iconColor} group-hover:scale-110 transition-transform`}>{iconName}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {expandedTopic && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`absolute inset-x-0 top-0 min-h-[380px] md:inset-0 z-20 p-4 sm:p-6 md:p-8 shadow-2xl border border-stone-200 dark:border-slate-700 rounded-lg flex flex-col transition-colors duration-500 ${
                              politician.stances[expandedTopic] === 'Support' ? 'bg-[#f4f7f4] dark:bg-[#1b2a1b]' : 
                              politician.stances[expandedTopic] === 'Oppose' ? 'bg-[#f5f6f8] dark:bg-[#1a1f2c]' : 'bg-white dark:bg-[#162839]'
                            }`}
                          >
                            <button 
                              onClick={() => setExpandedTopic(null)}
                              className="absolute top-2 end-2 md:top-4 md:end-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                              <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                            
                            <div className="mb-4 md:mb-6">
                              <h4 className="font-bold text-[10px] uppercase tracking-widest text-secondary mb-1 md:mb-2">{tIssue(expandedTopic)}</h4>
                              <p className="font-['Newsreader'] text-sm sm:text-base md:text-2xl font-bold text-primary dark:text-[#fbf9f5] leading-tight mb-2 md:mb-4">
                                {tIssueDefinition(expandedTopic)}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">{t('profileDetail.stance')}</span>
                                <span className={`px-2.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm ${
                                  politician.stances[expandedTopic] === 'Support' ? 'bg-secondary-container text-on-secondary-container' : 
                                  politician.stances[expandedTopic] === 'Oppose' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {tStance(politician.stances[expandedTopic])}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pe-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">groups</span> {t('profileDetail.sharedAlignment')}
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {politicians
                                  .filter(p => p.id !== politician.id && p.stances[expandedTopic] === politician.stances[expandedTopic])
                                  .map(p => (
                                    <a 
                                      key={p.id} 
                                      href={`#/profile/${p.id}`} 
                                      onClick={() => setExpandedTopic(null)}
                                      className={`flex items-center gap-3 p-3 border border-transparent rounded transition-all group ${
                                        politician.stances[expandedTopic] === 'Support' ? 'bg-secondary/10 hover:border-secondary' : 
                                        politician.stances[expandedTopic] === 'Oppose' ? 'bg-primary/10 hover:border-primary' : 'bg-stone-50 hover:border-slate-300'
                                      }`}
                                    >
                                      <img src={p.imageUrl} alt={tPolitician(p.name)} className="w-8 h-8 rounded-full object-cover object-top transition-all" />
                                      <div className="min-w-0">
                                        <p className="text-[10px] font-black text-primary dark:text-[#fbf9f5] truncate">{tPolitician(p.name)}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{tParty(p.party)}</p>
                                      </div>
                                    </a>
                                  ))
                                }
                                {politicians.filter(p => p.id !== politician.id && p.stances[expandedTopic] === politician.stances[expandedTopic]).length === 0 && (
                                  <div className="col-span-full py-8 text-center border-2 border-dashed border-stone-100 rounded">
                                    <p className="text-xs text-slate-400 italic">{t('profileDetail.noShared')}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 10 Detailed Issues Section */}
                  <div className="space-y-12">
                    <h3 className="font-['Newsreader'] text-2xl font-bold mb-8 text-primary dark:text-[#fbf9f5]">{t('profileDetail.intelligence')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {Object.keys(politician.intelligence).map((topic, i) => (
                        <div key={i} className="group">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-4">{tIntelligenceTopic(topic)}</h4>
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{tIntelligence(politician.id, topic)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Disclosure Footer */}
                  <div className="border-t border-stone-200 dark:border-slate-800 pt-6 text-xs text-slate-500 space-y-2">
                    <p className="font-medium text-slate-600 dark:text-slate-400">
                      {AI_DISCLAIMER.full}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  };

export default ProfileDetail;
