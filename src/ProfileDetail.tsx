import React, { useState } from 'react';
import { politicians } from './data';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './components/OptimizedImage';
import { useLanguage } from './i18n';

interface Props {
  id: string;
}

const ProfileDetail: React.FC<Props> = ({ id }) => {
  const politician = politicians.find(p => p.id === id) || politicians[0];
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  
  const { t, tPolitician, tParty, tIssue, tIntelligenceTopic, tStance, tIssueDefinition, tBio, tQuote, tFacts, tIntelligence, lang } = useLanguage();

  return (
    <>
      <div className="min-h-screen bg-[#fbf9f5] px-6 lg:px-12 pt-8 pb-20">
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
                      <OptimizedImage alt={`portrait of ${tPolitician(politician.name)}`} className="w-full aspect-square object-cover object-top mb-8" src={politician.imageUrl} />
                    ) : (
                      <div className="w-full aspect-square bg-slate-200 mb-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-7xl text-slate-400">person</span>
                      </div>
                    )}
                    <h2 className="font-['Newsreader'] text-4xl font-bold mb-2 text-primary">{tPolitician(politician.name)}</h2>
                    <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">
                      {tParty(politician.party)} • {politician.seats !== "N/A" ? `${politician.seats} ${t('profileDetail.seats')}` : t('profileDetail.na')}
                    </p>
                    
                    <div className="font-['Inter'] text-slate-600 leading-relaxed border-s-2 border-stone-200 ps-6 mb-8 space-y-6">
                      <p className="italic font-medium text-slate-700 text-lg">"{tQuote(politician.id)}"</p>
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
                      <a href={politician.partyWebsite} target="_blank" rel="noreferrer" className="w-full bg-primary text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                        {t('profileDetail.partyLink')} <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Intelligence Data */}
                <div className="lg:col-span-8 space-y-16">
                  {/* Binary Stance Board */}
                  <div>
                    <h3 className="font-['Newsreader'] text-2xl font-bold mb-8 text-primary">{t('profileDetail.stanceBoard')}</h3>
                    <div className="relative">
                      <div className={`grid grid-cols-1 md:grid-cols-3 gap-1 transition-all duration-500 ${expandedTopic ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                        {Object.entries(politician.stances).map(([topic, status], i) => {
                          let bgClass = "bg-surface-container-highest";
                          let labelColor = "text-slate-500";
                          let valColor = "text-slate-600";
                          let iconName = "question_mark";
                          let iconColor = "text-slate-400";
                          
                          if (status.toUpperCase() === "SUPPORT") {
                            bgClass = "bg-secondary-container";
                            labelColor = "text-on-secondary-container";
                            valColor = "text-on-secondary-container";
                            iconName = "check_circle";
                            iconColor = "text-on-secondary-container";
                          } else if (status.toUpperCase() === "OPPOSE") {
                            bgClass = "bg-primary";
                            labelColor = "text-slate-300";
                            valColor = "text-white";
                            iconName = "cancel";
                            iconColor = "text-white";
                          }

                          return (
                            <div 
                              key={i} 
                              onClick={() => setExpandedTopic(topic)}
                              className={`${bgClass} p-6 flex flex-col justify-between h-32 cursor-pointer hover:scale-[1.03] hover:shadow-xl hover:z-10 transition-all duration-300 group border-2 border-transparent hover:border-black/5 dark:hover:border-white/10`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-[10px] font-bold ${labelColor} uppercase tracking-widest`}>{tIssue(topic)}</p>
                                <span className={`material-symbols-outlined text-sm ${labelColor} opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0`}>open_in_full</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`${valColor} font-black text-xl`}>{tStance(status)}</span>
                                <span className={`material-symbols-outlined ${iconColor} group-hover:scale-110 transition-transform`}>{iconName}</span>
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
                            className={`absolute inset-0 z-20 p-8 shadow-2xl border border-stone-200 dark:border-slate-700 flex flex-col transition-colors duration-500 ${
                              politician.stances[expandedTopic] === 'Support' ? 'bg-[#f4f7f4] dark:bg-[#1b2a1b]' : 
                              politician.stances[expandedTopic] === 'Oppose' ? 'bg-[#f5f6f8] dark:bg-[#1a1f2c]' : 'bg-white dark:bg-[#162839]'
                            }`}
                          >
                            <button 
                              onClick={() => setExpandedTopic(null)}
                              className="absolute top-4 end-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                              <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                            
                            <div className="mb-6">
                              <h4 className="font-bold text-[10px] uppercase tracking-widest text-secondary mb-2">{tIssue(expandedTopic)}</h4>
                              <p className="font-['Newsreader'] text-2xl font-bold text-primary leading-tight mb-4">
                                {tIssueDefinition(expandedTopic)}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('profileDetail.stance')}</span>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${
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
                                        <p className="text-[10px] font-black text-primary truncate">{tPolitician(p.name)}</p>
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
                    <h3 className="font-['Newsreader'] text-2xl font-bold mb-8 text-primary">{t('profileDetail.intelligence')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {Object.keys(politician.intelligence).map((topic, i) => (
                        <div key={i} className="group">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-4">{tIntelligenceTopic(topic)}</h4>
                          <p className="text-sm leading-relaxed text-slate-700">{tIntelligence(politician.id, topic)}</p>
                        </div>
                      ))}
                    </div>
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
