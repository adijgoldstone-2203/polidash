import React from 'react';

import { politicians } from './data';
import OptimizedImage from './components/OptimizedImage';

const Profiles: React.FC = () => {

  return (
    <>
      <div className="flex pt-4">
        <main className="flex-1 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <section className="mb-12">
              <h1 className="font-['Newsreader'] text-5xl md:text-7xl font-light tracking-tight text-primary mb-4" style={{}}>
                Politician <span className="italic font-bold" style={{}}>Profiles</span>
              </h1>
              <div className="h-1 w-24 bg-primary mb-8"></div>
              <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                An objective summary of backgrounds, stances on key issues, and policy priorities within the leading representatives.
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
              {[...politicians].sort((a, b) => a.name.localeCompare(b.name)).map((pol, idx) => (
                <div key={idx} className="bg-surface-container-lowest transition-all hover:bg-white p-6 relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <a href={`#/profile/${pol.id}`} className="shrink-0">
                        {pol.imageUrl ? (
                          <OptimizedImage alt={`portrait of ${pol.name}`} className="w-16 h-16 rounded-full object-cover object-top transition-all duration-500 hover:scale-105" src={pol.imageUrl} />
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
    </>
  );
};

export default Profiles;
