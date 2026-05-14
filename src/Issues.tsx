import React, { useState } from 'react';
import VennEngine, { Criterion } from './VennEngine';
import { politicians, ISSUE_DEFINITIONS } from './data';

const ISSUES_LIST = [
  "Free Market Priority",
  "Two-State Separation",
  "Judicial Override",
  "Universal Enlistment",
  "State Commission (Oct 7)",
  "Shabbat Public Transit",
  "West Bank Annexation",
  "Rabbinical Court Power",
  "Basic Law: Equality"
];


const Issues: React.FC = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<Criterion[]>([]);
  const [activeCriteria, setActiveCriteria] = useState<Criterion[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const topic = params.get('topic');
    if (topic && ISSUE_DEFINITIONS[topic]) {
      const newCrit: Criterion = { topic, stance: 'SUPPORT' };
      setSelectedCriteria([newCrit]);
      setActiveCriteria([newCrit]);
      setHasCalculated(true);
      
      // Clean up the URL to prevent re-triggering on every mount if not intended
      // window.location.hash = '#/issues'; 
    }
  }, [window.location.hash]);

  const handleToggle = (topic: string, stance: 'SUPPORT' | 'OPPOSE') => {
    const existingIndex = selectedCriteria.findIndex(c => c.topic === topic);
    if (existingIndex > -1) {
      if (selectedCriteria[existingIndex].stance === stance) {
        // Remove if unchecking
        setSelectedCriteria(selectedCriteria.filter((_, i) => i !== existingIndex));
      } else {
        // Change stance
        const newArr = [...selectedCriteria];
        newArr[existingIndex].stance = stance;
        setSelectedCriteria(newArr);
      }
    } else {
      if (selectedCriteria.length < 3) {
        setSelectedCriteria([...selectedCriteria, { topic, stance }]);
      } else {
        alert("You can only select up to 3 criteria.");
      }
    }
  };

  const handleCalculate = () => {
    setActiveCriteria(selectedCriteria);
    setHasCalculated(true);
  };

  const isChecked = (topic: string, stance: 'SUPPORT' | 'OPPOSE') => {
    return selectedCriteria.some(c => c.topic === topic && c.stance === stance);
  };

  return (
    <>
      <style>{`
        .venn-circle {
            mix-blend-mode: multiply;
        }
        .editorial-shadow {
            box-shadow: 0 32px 64px -12px rgba(22, 40, 57, 0.04);
        }
      `}</style>
      <div className="flex min-h-screen">
        <main className="flex-1 p-8 bg-surface">
          <div className="max-w-6xl mx-auto mb-12">
            <section className="mb-12">
              <h1 className="font-['Newsreader'] text-5xl md:text-7xl font-light tracking-tight text-primary mb-4">
                Venn Intelligence <span className="italic font-bold">Engine</span>
              </h1>
              <div className="h-1 w-24 bg-primary mb-8"></div>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">Select up to three strategic frameworks to identify the convergence points of political leadership and ideological alignment.</p>
            </section>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 md:col-span-4 space-y-6 z-20">
              
              <div className="bg-white border border-stone-200 p-6 rounded-lg text-slate-800 shadow-xl">
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Live Synthesis</p>
                {selectedCriteria.length === 0 ? (
                  <p className="text-sm leading-relaxed mb-4 text-slate-500 italic">Waiting for Criteria Selection...</p>
                ) : (
                  <div className="mb-6 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Finding politicians aligned with:</p>
                    <div className="space-y-2">
                      {selectedCriteria.map((c) => (
                        <div key={c.topic} className="flex items-center gap-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest ${c.stance === 'SUPPORT' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary text-white'}`}>
                            {c.stance}
                          </span>
                          <span className="text-sm font-medium text-slate-800 truncate">{c.topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleCalculate}
                  className="w-full py-3 bg-secondary hover:bg-secondary-container transition-colors text-white hover:text-on-secondary-container text-sm font-bold rounded flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-base">{hasCalculated ? 'refresh' : 'play_arrow'}</span>
                  {hasCalculated ? 'Recalculate' : 'Calculate'}
                </button>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-label font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wide">
                    <span className="material-symbols-outlined text-sm">tune</span> BINARY STANDPOINTS
                  </h3>
                  {selectedCriteria.length > 0 && (
                    <button 
                      onClick={() => {
                        setSelectedCriteria([]);
                        setActiveCriteria([]);
                        setHasCalculated(false);
                      }}
                      className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex justify-end gap-11 mb-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oppose</span>
                </div>
                <div className="space-y-2">
                  {ISSUES_LIST.map((topic) => (
                    <div key={topic} className="bg-white rounded border border-transparent shadow-sm overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                        <div 
                          className="flex items-center gap-2 w-2/3 cursor-pointer select-none group"
                          onClick={() => setExpandedIssue(expandedIssue === topic ? null : topic)}
                        >
                          <span className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors truncate">
                            {topic}
                          </span>
                          <span className={`material-symbols-outlined text-[16px] text-slate-400 shrink-0 transition-transform duration-300 ${expandedIssue === topic ? 'rotate-180 text-primary' : ''}`}>
                            expand_more
                          </span>
                        </div>
                        <div className="flex gap-14 px-1 pr-3 w-1/3 justify-end">
                          <input 
                            type="checkbox"
                            className="rounded-sm border-slate-300 text-secondary-container focus:ring-secondary-container h-4 w-4 cursor-pointer"
                            checked={isChecked(topic, 'SUPPORT')}
                            onChange={() => handleToggle(topic, 'SUPPORT')}
                          />
                          <input 
                            type="checkbox"
                            className="rounded-sm border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                            checked={isChecked(topic, 'OPPOSE')}
                            onChange={() => handleToggle(topic, 'OPPOSE')}
                          />
                        </div>
                      </div>
                      
                      {/* Accordion Expansion Content */}
                      <div className={`grid transition-all duration-300 ease-in-out ${expandedIssue === topic ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="p-4 text-xs leading-relaxed text-slate-600 bg-slate-50/50">
                            {ISSUE_DEFINITIONS[topic as keyof typeof ISSUE_DEFINITIONS]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-4 italic">*Select 1-3 criteria for synthesis.</p>
              </div>
            </div>
            {/* Main Venn Container */}
            <div className={`col-span-12 md:col-span-8 ${isFullscreen ? 'relative z-[400]' : ''}`}>
              <div className={`relative transition-all duration-500 ${
                isFullscreen 
                  ? 'fixed inset-0 z-[300] bg-[#fbf9f5] dark:bg-[#162839] border-none rounded-none shadow-none' 
                  : 'bg-surface-container-low/30 border-2 border-dashed border-stone-200 rounded-xl editorial-shadow h-[860px] overflow-hidden'
              }`}>
                {/* Full Screen Toggle Button */}
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute top-4 right-4 z-40 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full shadow-lg hover:scale-105 hover:bg-white dark:hover:bg-slate-700 transition-all group"
                  title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
                >
                  <span className="material-symbols-outlined text-primary dark:text-white">
                    {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                  </span>
                </button>

                <VennEngine criteria={activeCriteria} politicians={politicians} />
              </div>
            </div>
          </div>
          <section className="max-w-6xl mx-auto mt-20 pt-12 border-t border-stone-200/50">
            <h2 className="font-headline text-3xl font-bold mb-10">Ideological Matrix Definitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {activeCriteria.length > 0 ? (
                // Only render Definitions for active selected topics (unique)
                Array.from(new Set(activeCriteria.map(c => c.topic))).map(topic => (
                  <div key={topic} className="space-y-4">
                    <h4 className="font-label font-bold text-secondary text-sm tracking-widest uppercase">{topic}</h4>
                    <p className="font-headline text-lg leading-relaxed text-primary">{ISSUE_DEFINITIONS[topic]}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-stone-400 italic">Select criteria to view definitions.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Issues;
