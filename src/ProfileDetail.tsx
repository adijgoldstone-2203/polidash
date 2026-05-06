import React, { useState } from 'react';
import { politicians, ISSUE_DEFINITIONS } from './data';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  id: string;
}

const ProfileDetail: React.FC<Props> = ({ id }) => {
  const politician = politicians.find(p => p.id === id) || politicians[0];
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#fbf9f5]/80 dark:bg-[#162839]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-8">
            <a className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]" href="#/">PoliDash</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="font-['Inter'] text-sm font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397] transition-colors duration-200" href="#/">Home</a>
              <a className="font-['Inter'] text-sm font-bold border-b-2 border-[#162839] dark:border-[#fbf9f5] pb-1 text-[#162839] dark:text-[#fbf9f5] hover:text-[#006397] transition-colors duration-200" href="#/profiles">Profiles</a>
              <a className="font-['Inter'] text-sm font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397] transition-colors duration-200" href="#/issues">Issues</a>
              <a className="font-['Inter'] text-sm font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397] transition-colors duration-200" href="#/quiz">Quiz</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-['Inter'] text-sm font-medium tracking-tight text-[#162839] dark:text-[#fbf9f5] cursor-pointer hover:text-[#006397] transition-colors duration-200">EN/HE</span>
            <span className="material-symbols-outlined text-[#162839] dark:text-[#fbf9f5] cursor-pointer scale-95 active:scale-90 transition-transform" data-icon="language">language</span>
            <span className="material-symbols-outlined text-[#162839] dark:text-[#fbf9f5] cursor-pointer scale-95 active:scale-90 transition-transform" data-icon="search">search</span>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <main className="flex-1 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <a className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#/profiles">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back to All Profiles
              </a>
            </div>

            <section className="">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Column 1: Identity & Bio */}
                <div className="lg:col-span-4">
                  <div className="sticky top-24">
                    {politician.imageUrl ? (
                      <img alt={`portrait of ${politician.name}`} className="w-full aspect-square object-cover mb-8" src={politician.imageUrl} />
                    ) : (
                      <div className="w-full aspect-square bg-slate-200 mb-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-7xl text-slate-400">person</span>
                      </div>
                    )}
                    <h2 className="font-['Newsreader'] text-4xl font-bold mb-2 text-primary">{politician.name}</h2>
                    <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-6">{politician.party} • {politician.seats !== "N/A" ? `${politician.seats} Seats` : "N/A"}</p>
                    
                    <div className="font-['Inter'] text-slate-600 leading-relaxed border-l-2 border-stone-200 pl-6 mb-8 space-y-6">
                      <p>{politician.biography}</p>
                      {politician.facts && politician.facts.length > 0 && (
                        <ul className="list-disc ml-5 space-y-2 mt-4 text-sm font-medium">
                          {politician.facts.map((fact, i) => (
                            <li key={i}>{fact}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <a href={politician.partyWebsite} target="_blank" rel="noreferrer" className="w-full bg-primary text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                        Link to Party Website <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Intelligence Data */}
                <div className="lg:col-span-8 space-y-16">
                  {/* Binary Stance Board */}
                  <div>
                    <h3 className="font-['Newsreader'] text-2xl font-bold mb-8 text-primary">Stance Board: Core Principles</h3>
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
                            labelColor = "text-on-primary-fixed-variant";
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
                                <p className={`text-[10px] font-bold ${labelColor} uppercase tracking-widest`}>{topic}</p>
                                <span className={`material-symbols-outlined text-sm ${labelColor} opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0`}>open_in_full</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`${valColor} font-black text-xl`}>{status}</span>
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
                              className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                              <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                            
                            <div className="mb-6">
                              <h4 className="font-bold text-[10px] uppercase tracking-widest text-secondary mb-2">{expandedTopic}</h4>
                              <p className="font-['Newsreader'] text-2xl font-bold text-primary leading-tight mb-4">
                                {ISSUE_DEFINITIONS[expandedTopic]}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Politician's Stance:</span>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${
                                  politician.stances[expandedTopic] === 'Support' ? 'bg-secondary-container text-on-secondary-container' : 
                                  politician.stances[expandedTopic] === 'Oppose' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {politician.stances[expandedTopic]}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">groups</span> Shared Stance Alignment
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
                                      <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover transition-all" />
                                      <div className="min-w-0">
                                        <p className="text-[10px] font-black text-primary truncate">{p.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{p.party}</p>
                                      </div>
                                    </a>
                                  ))
                                }
                                {politicians.filter(p => p.id !== politician.id && p.stances[expandedTopic] === politician.stances[expandedTopic]).length === 0 && (
                                  <div className="col-span-full py-8 text-center border-2 border-dashed border-stone-100 rounded">
                                    <p className="text-xs text-slate-400 italic">No other politicians share this specific stance.</p>
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
                    <h3 className="font-['Newsreader'] text-2xl font-bold mb-8 text-primary">Issues Intelligence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {Object.entries(politician.intelligence).map(([topic, description], i) => (
                        <div key={i} className="group">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-4">{topic}</h4>
                          <p className="text-sm leading-relaxed text-slate-700">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 gap-8 py-12 border-t border-stone-200/50 bg-[#fbf9f5]">
        <p className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400">© 2024 PoliDash Intelligence. AI-Generated Synthesis.</p>
        <div className="flex gap-8">
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 transition-all" href="#">AI Methodology</a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 transition-all" href="#">Right of Reply Protocol</a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 transition-all" href="#">Privacy</a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 transition-all" href="#">Terms</a>
        </div>
      </footer>
    </>
  );
};

export default ProfileDetail;
