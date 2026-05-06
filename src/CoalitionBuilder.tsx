import React, { useState, useMemo } from 'react';
import { POLL_DATA, MAJORITY_THRESHOLD, TOTAL_SEATS, Poll } from './polls';
import { motion } from 'framer-motion';
import ParliamentChart from './components/ParliamentChart';

const CoalitionBuilder: React.FC = () => {
  const [selectedPoll, setSelectedPoll] = useState<Poll>(POLL_DATA[0]);
  const [proposedCoalition, setProposedCoalition] = useState<string[]>([]);

  const currentSeats = useMemo(() => {
    return proposedCoalition.reduce((sum, partyName) => {
      return sum + (selectedPoll.data[partyName] || 0);
    }, 0);
  }, [proposedCoalition, selectedPoll]);

  const toggleParty = (partyName: string) => {
    if (proposedCoalition.includes(partyName)) {
      setProposedCoalition(proposedCoalition.filter(p => p !== partyName));
    } else {
      setProposedCoalition([...proposedCoalition, partyName]);
    }
  };

  const isMajority = currentSeats >= MAJORITY_THRESHOLD;

  const chartParties = Object.entries(selectedPoll.data).map(([name, seats]) => ({
    name,
    seats,
    isSelected: proposedCoalition.includes(name)
  }));

  return (
    <div className="min-h-screen bg-[#fbf9f5] px-6 lg:px-12 pt-4 pb-12">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-6 mb-2">
          {/* Page Title (Left) */}
          <div className="shrink-0">
            <h1 className="font-['Newsreader'] text-5xl md:text-7xl font-light tracking-tight text-primary mb-4">
              Coalition <span className="italic font-bold">Simulator</span>
            </h1>
            <div className="h-1 w-24 bg-primary mb-2"></div>
          </div>

          {/* Progress Bar (Right) */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex-grow w-full xl:max-w-3xl mb-2">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
              <div className="flex items-baseline gap-2 shrink-0">
                <motion.span 
                  key={currentSeats}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-['Newsreader'] font-bold text-primary leading-none"
                >
                  {currentSeats}
                </motion.span>
                <span className="text-sm text-slate-300 font-bold">/ 120</span>
              </div>
              
              <div className="flex-grow w-full">
                <div className="flex justify-between items-center mb-1">
                   <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${isMajority ? 'text-green-600' : 'text-secondary'}`}>
                     {isMajority ? 'Majority Formed' : 'Majority Threshold: 61'}
                   </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (currentSeats / TOTAL_SEATS) * 100)}%` }}
                    className={`h-full ${isMajority ? 'bg-green-500' : 'bg-secondary'}`}
                  />
                  <div className="absolute top-0 bottom-0 w-px bg-primary opacity-30" style={{ left: `${(MAJORITY_THRESHOLD / TOTAL_SEATS) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Content Area */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Mini Party Selector (Compact Sidebar) */}
          <section className="col-span-12 lg:col-span-3 space-y-4">
            
            {/* Poll Selection & Date - Moved here above parties */}
            <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase text-slate-400">Poll Source</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{selectedPoll.date}</span>
                </div>
                <select 
                  className="bg-transparent border-none font-bold text-primary focus:ring-0 text-[10px] cursor-pointer p-0"
                  value={selectedPoll.id}
                  onChange={(e) => {
                    const poll = POLL_DATA.find(p => p.id === e.target.value);
                    if (poll) {
                      setSelectedPoll(poll);
                      setProposedCoalition([]);
                    }
                  }}
                >
                  {POLL_DATA.map(poll => (
                    <option key={poll.id} value={poll.id}>{poll.source}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1 border-b border-stone-200 pb-2 mb-2">Assemble Majority</h3>
              {Object.entries(selectedPoll.data)
                .sort((a, b) => b[1] - a[1])
                .map(([name, seats]) => {
                  if (seats === 0) return null;
                  const isSelected = proposedCoalition.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => toggleParty(name)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-all border ${
                        isSelected 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'bg-white text-primary border-stone-100 hover:border-secondary shadow-sm'
                      }`}
                    >
                      <span className="font-bold text-[8px] uppercase tracking-tight text-left truncate pr-2">{name}</span>
                      <span className="font-['Newsreader'] italic font-bold text-sm">{seats}</span>
                    </button>
                  );
                })}
            </div>
          </section>

          {/* RIGHT: Wide Graph Area */}
          <div className="col-span-12 lg:col-span-9 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center min-h-[500px]">
            <ParliamentChart totalSeats={TOTAL_SEATS} coalitionSeats={currentSeats} parties={chartParties} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoalitionBuilder;
