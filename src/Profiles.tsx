import React from 'react';

import { politicians } from './data';

const Profiles: React.FC = () => {

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
            <section className="mb-12">
              <h1 className="font-['Newsreader'] text-5xl md:text-7xl font-light tracking-tight text-primary mb-4" style={{}}>
                Politician <span className="italic font-bold" style={{}}>Profiles</span>
              </h1>
              <div className="h-1 w-24 bg-primary mb-8"></div>
              <p className="font-['Inter'] text-lg text-[#162839] max-w-2xl leading-relaxed">
                An objective summary of backgrounds, stances on key issues, and policy priorities within the leading representatives.
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
              {politicians.map((pol, idx) => (
                <div key={idx} className="bg-surface-container-lowest transition-all hover:bg-white p-6 relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <a href={`#/profile/${pol.id}`} className="shrink-0">
                        {pol.imageUrl ? (
                          <img alt={`portrait of ${pol.name}`} className="w-16 h-16 rounded-full object-cover transition-all duration-500 hover:scale-105" src={pol.imageUrl} />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-500 text-3xl">person</span>
                          </div>
                        )}
                      </a>
                      
                      <div>
                        <a href={`#/profile/${pol.id}`} className="hover:text-secondary transition-colors">
                          <h2 className="font-['Newsreader'] text-2xl font-bold text-primary leading-none">{pol.name}</h2>
                        </a>
                        <p className="text-xs font-bold uppercase tracking-widest mt-1 text-secondary">{pol.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-['Newsreader'] italic font-bold">{pol.seats}</span>
                      <div className="flex flex-col">
                        <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-400 font-bold">Seats</span>
                        <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-400 font-bold">Held</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-start">
                    <a href={`#/profile/${pol.id}`} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-secondary transition-colors">
                      View Full Profile <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
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

export default Profiles;
