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
      if (selectedCriteria.length < 2) {
        setSelectedCriteria([...selectedCriteria, { topic, stance }]);
      } else {
        alert("You can only select up to 2 criteria.");
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
      <header className="sticky top-0 w-full z-50 bg-[#fbf9f5]/80 dark:bg-[#162839]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-8">
            <a className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]" href="#/">PoliDash</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="font-['Inter'] text-sm font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397] transition-colors duration-200" href="#/">Home</a>
              <a className="font-['Inter'] text-sm font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397] transition-colors duration-200" href="#/profiles">Profiles</a>
              <a className="font-['Inter'] text-sm font-bold border-b-2 border-[#162839] dark:border-[#fbf9f5] pb-1 text-[#162839] dark:text-[#fbf9f5] hover:text-[#006397] transition-colors duration-200" href="#/issues">Issues</a>
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
      <div className="flex min-h-screen pt-16">
        <main className="flex-1 p-8 bg-surface">
          <div className="max-w-6xl mx-auto mb-12">
            <h1 className="font-headline text-5xl font-bold text-primary mb-4 leading-tight">Venn Intelligence Engine</h1>
            <p className="font-headline text-xl text-on-surface-variant max-w-2xl italic">Select two strategic frameworks to identify the convergence points of political leadership and ideological alignment.</p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 md:col-span-4 space-y-6 z-20">
              <div className="bg-surface-container-low p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-label font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wide">
                    <span className="material-symbols-outlined text-sm">tune</span> BINARY STANDPOINTS
                  </h3>
                </div>
                <div className="flex justify-end gap-11 mb-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oppose</span>
                </div>
                <div className="space-y-2">
                  {ISSUES_LIST.map((topic) => (
                    <div key={topic} className="flex items-center justify-between p-3 bg-white rounded border border-transparent hover:border-secondary transition-all shadow-sm">
                      <span className="text-sm font-medium text-slate-700 w-2/3">{topic}</span>
                      <div className="flex gap-14 px-1 pr-3 w-1/3 justify-end">
                        <input 
                          type="checkbox"
                          className="rounded-sm border-slate-300 text-secondary focus:ring-secondary h-4 w-4 cursor-pointer"
                          checked={isChecked(topic, 'SUPPORT')}
                          onChange={() => handleToggle(topic, 'SUPPORT')}
                        />
                        <input 
                          type="checkbox"
                          className="rounded-sm border-slate-300 text-error focus:ring-error h-4 w-4 cursor-pointer"
                          checked={isChecked(topic, 'OPPOSE')}
                          onChange={() => handleToggle(topic, 'OPPOSE')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-4 italic">*Select 1-2 criteria for synthesis.</p>
              </div>
              <div className="bg-primary p-6 rounded-lg text-white">
                <p className="text-xs text-on-primary-container font-bold uppercase tracking-widest mb-2">Live Synthesis</p>
                {selectedCriteria.length === 0 ? (
                  <p className="text-sm leading-relaxed mb-4 text-slate-400 italic">Waiting for Criteria Selection...</p>
                ) : (
                  <p className="text-sm leading-relaxed mb-4">
                    Finding politicians aligned with <br/>
                    {selectedCriteria.map((c, i) => (
                      <React.Fragment key={c.topic}>
                        <span className={c.stance === 'SUPPORT' ? 'text-secondary-container font-bold' : 'text-error-container font-bold'}>
                          {c.stance} {c.topic}
                        </span>
                        {i < selectedCriteria.length - 1 && " and "}
                      </React.Fragment>
                    ))}
                  </p>
                )}
                <button 
                  onClick={handleCalculate}
                  className="w-full py-3 bg-secondary hover:bg-secondary-container transition-colors text-white hover:text-on-secondary-container text-sm font-bold rounded flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-base">{hasCalculated ? 'refresh' : 'play_arrow'}</span>
                  {hasCalculated ? 'Recalculate' : 'Calculate'}
                </button>
              </div>
            </div>
            {/* Main Venn Container */}
            <div className="col-span-12 md:col-span-8">
              <div className="relative bg-surface-container-low/30 border-2 border-dashed border-stone-200 rounded-xl h-[860px] editorial-shadow overflow-hidden">
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
      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 gap-8 py-12 border-t border-stone-200/50 bg-[#fbf9f5]">
        <div className="flex flex-col gap-2">
          <span className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400">© 2024 PoliDash Intelligence. AI-Generated Synthesis.</span>
        </div>
        <div className="flex gap-8">
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 smooth transition-colors duration-300" href="#">AI Methodology</a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 smooth transition-colors duration-300" href="#">Right of Reply Protocol</a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 smooth transition-colors duration-300" href="#">Privacy</a>
          <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 underline decoration-1 smooth transition-colors duration-300" href="#">Terms</a>
        </div>
      </footer>
    </>
  );
};

export default Issues;
