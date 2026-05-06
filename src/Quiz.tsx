import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { politicians, ISSUE_DEFINITIONS } from './data';

const QUESTIONS = [
  { id: "Free Market Priority", title: "Free Market Priority" },
  { id: "Two-State Separation", title: "Two-State Separation" },
  { id: "Judicial Override", title: "Judicial Reform" },
  { id: "Universal Enlistment", title: "Universal Enlistment" },
  { id: "State Commission (Oct 7)", title: "State Commission of Inquiry" },
  { id: "Shabbat Public Transit", title: "Shabbat Public Transit" },
  { id: "West Bank Annexation", title: "West Bank Annexation" },
  { id: "Rabbinical Court Power", title: "Rabbinical Court Empowerment" },
  { id: "Basic Law: Equality", title: "Basic Law of Equality" }
];

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [criticals, setCriticals] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<any[] | null>(null);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const handleAnswer = (qid: string, stance: string) => {
    setAnswers(prev => ({ ...prev, [qid]: stance }));
  };

  const toggleCritical = (qid: string) => {
    setCriticals(prev => ({ ...prev, [qid]: !prev[qid] }));
  };

  const calculateResults = () => {
    const scoredPoliticians = politicians.map(pol => {
      let totalScore = 0;
      let totalWeight = 0;
      const matches: string[] = [];
      let friction: string | null = null;

      QUESTIONS.forEach(q => {
        const userStance = answers[q.id] || "Neutral";
        const polStance = pol.stances[q.id] || "Ambiguous";
        const weight = criticals[q.id] ? 2 : 1;
        totalWeight += weight;

        let baseScore = 0;
        if (userStance !== "Neutral" && polStance !== "Ambiguous") {
          if (userStance === polStance) {
            baseScore = 2;
            matches.push(q.title);
          } else {
            baseScore = -2;
            if (!friction) friction = q.title;
          }
        } else if (userStance === "Neutral" && polStance === "Ambiguous") {
          baseScore = 1;
        } else {
          baseScore = 1; 
        }
        
        totalScore += (baseScore * weight);
      });

      const percentage = Math.round(((totalScore + totalWeight * 2) / (totalWeight * 4)) * 100);
      return { ...pol, percentage, matches, friction };
    });

    scoredPoliticians.sort((a, b) => b.percentage - a.percentage);
    setResults(scoredPoliticians);
    
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const progressCount = Object.keys(answers).length;

  return (
    <div className="bg-background text-on-background font-body min-h-screen overflow-x-hidden selection:bg-secondary/20">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* TopAppBar */}
      <div className="flex pt-4">
        <main className="flex-1 px-6 md:px-12 lg:px-24 py-12">
          <header className="mb-16 max-w-2xl">
            <h1 className="font-headline text-5xl font-black text-primary leading-tight mb-4 italic">The Alignment Quotient</h1>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed">Find your political match. Take our 9-issue quiz to discover which representatives share your perspective on the decisions shaping our future.</p>
          </header>

          <div className="max-w-7xl mx-auto mb-6 flex items-center gap-2">
            <span className="text-secondary material-symbols-outlined text-sm">stars</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">* Toggle "Critical" to double the scoring weight of specific issues in your alignment synthesis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {QUESTIONS.map(q => (
              <div key={q.id} className="bg-surface-container-low p-8 flex flex-col justify-between min-h-[220px] transition-all hover:bg-surface-container-high relative overflow-hidden group border border-stone-200/50">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2 w-2/3">
                    <h3 className="font-headline text-2xl font-bold text-primary leading-snug">{q.title}</h3>
                    <button 
                      onClick={() => setShowInfo(showInfo === q.id ? null : q.id)}
                      className={`transition-colors self-start flex items-center gap-1.5 ${showInfo === q.id ? 'text-secondary font-bold' : 'text-secondary/70 hover:text-secondary'}`}
                    >
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Details</span>
                    </button>
                  </div>
                  <div 
                    onClick={() => toggleCritical(q.id)}
                    className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all border shrink-0 ${
                      criticals[q.id] ? 'bg-secondary text-white border-secondary' : 'bg-white/50 text-slate-400 border-stone-200 hover:border-secondary'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[14px] ${criticals[q.id] ? 'fill-1' : ''}`} style={{fontVariationSettings: criticals[q.id] ? "'FILL' 1" : "'FILL' 0"}}>priority_high</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Critical</span>
                  </div>
                </div>
                <div className="relative">
                  <AnimatePresence>
                    {showInfo === q.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[11px] text-slate-500 italic mt-2 mb-4 bg-white/40 p-3 rounded border-l-2 border-secondary leading-relaxed">
                          {ISSUE_DEFINITIONS[q.id]}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="mt-4">
                  <div className="flex w-full bg-white/50 rounded-sm overflow-hidden border border-stone-200/50 relative">
                    {['Oppose', 'Neutral', 'Support'].map((stance) => {
                      const isSelected = (answers[q.id] || "Neutral") === stance;
                      return (
                        <button 
                          key={stance}
                          onClick={() => handleAnswer(q.id, stance)}
                          className={`flex-1 py-3 text-[10px] font-bold uppercase transition-all duration-300 relative z-10 ${
                            isSelected ? 'text-white' : 'text-slate-400 hover:bg-secondary/5 hover:text-secondary'
                          }`}
                        >
                          {stance}
                          {isSelected && (
                            <motion.div 
                              layoutId={`active-${q.id}`}
                              className="absolute inset-0 bg-primary -z-10"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="max-w-4xl mx-auto mb-24 bg-primary p-12 text-white relative overflow-hidden rounded-xl shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="font-headline text-4xl font-bold mb-6 italic">Alignment Synthesis</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">Completing these stances allows us to map your political identity against the featured politicians on our site and present the top matches.</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-white/10 relative overflow-hidden rounded-full">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-secondary"
                      animate={{ width: `${(progressCount / 9) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase">{progressCount} / 9 Responses Collected</span>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <button 
                  onClick={calculateResults}
                  disabled={progressCount < 5}
                  className={`px-10 py-5 font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-3 shadow-xl ${
                    progressCount < 5 ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-secondary-container text-on-secondary-container hover:scale-105 active:scale-95'
                  }`}
                >
                  Generate Results
                  <span className="material-symbols-outlined text-base animate-pulse">bolt</span>
                </button>
              </div>
            </div>
          </section>

          <AnimatePresence>
            {results && (
              <motion.section 
                id="results-section" 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto mb-24"
              >
                <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-4">
                  <h2 className="font-headline text-3xl font-bold text-primary italic">Political Convergence</h2>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Ranked Alignment Matrix</span>
                </div>
                <div className="space-y-8">
                  {results.map((pol, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={pol.id} 
                      className={`flex flex-col md:flex-row items-stretch gap-8 p-8 transition-all hover:shadow-lg border-l-4 ${
                        index === 0 ? 'bg-secondary/5 border-secondary' : 'bg-white border-stone-100'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img src={pol.imageUrl} alt={pol.name} className="w-32 h-32 object-cover rounded-sm" />
                        <div className={`absolute -top-3 -left-3 px-3 py-1 text-[11px] font-black uppercase tracking-tighter text-white ${index === 0 ? 'bg-secondary' : 'bg-slate-400'}`}>
                          {pol.percentage}% Match
                        </div>
                        {index === 0 && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest whitespace-nowrap shadow-lg">
                            Best Match
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h4 className="font-headline text-3xl font-bold text-primary">{pol.name}</h4>
                          <span className="bg-[#efeeea] text-[#162839] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">{pol.party}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed italic mb-4">"{pol.quote}"</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
                          <div>
                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">verified</span> Alignment Summary
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {pol.matches.length > 0 ? pol.matches.slice(0, 3).map((m: string) => (
                                <span key={m} className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded-sm font-bold">{m}</span>
                              )) : <span className="text-[10px] text-slate-400 italic">No direct matches</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-error uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">warning</span> Friction Point
                            </p>
                            <p className="text-xs font-bold text-primary">
                              {pol.friction ? pol.friction : "No major conflicts"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center shrink-0">
                        <a href={`#/profile/${pol.id}`} className="px-8 py-3 bg-primary text-white font-bold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all text-center">
                          Analysis
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
