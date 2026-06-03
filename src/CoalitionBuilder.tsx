import React, { useState, useMemo } from 'react';
import { POLL_DATA, MAJORITY_THRESHOLD, TOTAL_SEATS, Poll, PARTY_COLORS } from './polls';
import { computeWeightedAverage } from './utils/pollAnalytics';
import { motion } from 'framer-motion';
import ParliamentChart from './components/ParliamentChart';
import { useLanguage } from './i18n';
import { analyzeCoalitionStability } from './utils/coalitionStability';
import { politicians } from './data';

const getPartyLeaderId = (partyName: string): string | null => {
  const normalized = partyName.toLowerCase();
  if (normalized.includes('likud')) return 'benjamin-netanyahu';
  if (normalized.includes('bennett') || normalized.includes('together')) return 'naftali-bennett';
  if (normalized.includes('national unity')) return 'benny-gantz';
  if (normalized.includes('yashar')) return 'gadi-eisenkot';
  if (normalized.includes('democrats') || normalized.includes('labor')) return 'yair-golan';
  if (normalized.includes('shas')) return 'aryeh-deri';
  if (normalized.includes('ra\'am') || normalized.includes('united arab list')) return 'mansour-abbas';
  if (normalized.includes('yesh atid')) return 'yair-lapid';
  if (normalized.includes('miluimnikim')) return 'yoaz-hendel';
  if (normalized.includes('hadash') || normalized.includes('ta\'al')) return 'ayman-odeh';
  if (normalized.includes('torah') || normalized.includes('utj') || normalized.includes('goldknopf')) return 'yitzhak-goldknopf';
  if (normalized.includes('otzma') || normalized.includes('gvir')) return 'itamar-ben-gvir';
  if (normalized.includes('beiteinu') || normalized.includes('lieberman')) return 'avigdor-lieberman';
  if (normalized.includes('balad') || normalized.includes('shehadeh')) return 'sami-abu-shehadeh';
  if (normalized.includes('religious zionist') || normalized.includes('smotrich')) return 'bezalel-smotrich';
  return null;
};

const getPartyRepresentativeUrl = (partyName: string): string => {
  const id = getPartyLeaderId(partyName);
  return id ? `#/profile/${id}` : '#/profiles';
};

const CoalitionBuilder: React.FC = () => {
  const { t, tParty, tPolitician, tPollSource, tIssue, tIssueDefinition, tStance, lang } = useLanguage();

  const latestUniquePolls = useMemo(() => {
    const seen = new Set<string>();
    const result: Poll[] = [];
    
    for (const p of POLL_DATA) {
      const channel = p.source.split(' (')[0];
      if (!seen.has(channel)) {
        seen.add(channel);
        result.push(p);
      }
    }
    
    // Sort channels alphabetically
    result.sort((a, b) => a.source.split(' (')[0].localeCompare(b.source.split(' (')[0]));
    
    // Compute PoliDash Average and add it to the front
    const poliDashData = computeWeightedAverage(POLL_DATA);
    // Remove any parties with 0 seats to keep the chart clean
    Object.keys(poliDashData).forEach(key => {
      if (poliDashData[key] === 0) delete poliDashData[key];
    });

    const poliDashPoll: Poll = {
      id: 'polidash_avg',
      date: 'Current',
      dateISO: new Date().toISOString().split('T')[0],
      source: 'PoliDash Average',
      link: '#',
      data: poliDashData
    };
    
    result.unshift(poliDashPoll);
    
    return result;
  }, []);

  const [selectedPoll, setSelectedPoll] = useState<Poll>(latestUniquePolls[0] || POLL_DATA[0]);
  const [proposedCoalition, setProposedCoalition] = useState<string[]>([]);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const currentSeats = useMemo(() => {
    return proposedCoalition.reduce((sum, partyName) => {
      return sum + (selectedPoll.data[partyName] || 0);
    }, 0);
  }, [proposedCoalition, selectedPoll]);

  const stability = useMemo(() => {
    return analyzeCoalitionStability(proposedCoalition, currentSeats);
  }, [proposedCoalition, currentSeats]);

  const toggleParty = (partyName: string) => {
    if (proposedCoalition.includes(partyName)) {
      setProposedCoalition(proposedCoalition.filter(p => p !== partyName));
    } else {
      setProposedCoalition([...proposedCoalition, partyName]);
    }
  };

  const isMajority = currentSeats >= MAJORITY_THRESHOLD;

  const chartParties = [
    // Selected parties in the exact order they were added
    ...proposedCoalition.map(name => ({
      name,
      seats: selectedPoll.data[name] || 0,
      isSelected: true
    })),
    // Unselected parties
    ...Object.entries(selectedPoll.data)
      .filter(([name]) => !proposedCoalition.includes(name))
      .map(([name, seats]) => ({
        name,
        seats,
        isSelected: false
      }))
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5] px-6 lg:px-12 pt-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-4">
          {/* Page Title (Left) */}
          <div className="max-w-3xl">
            <h1 className="font-['Newsreader'] text-5xl md:text-7xl tracking-tight text-primary mb-4">
              {t('coalition.title1')} <span className="italic font-bold">{t('coalition.title2')}</span>
            </h1>
            <div className="h-1 w-24 bg-primary mb-4"></div>
            <p className="font-body text-base text-on-surface-variant leading-relaxed">
              {t('coalition.desc')}
            </p>
          </div>

          {/* Progress Bar (Right) */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex-grow w-full xl:max-w-2xl mb-2">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
              <div className="flex items-baseline gap-2 shrink-0">
                <motion.span 
                  key={currentSeats.toFixed(1)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-['Newsreader'] font-bold text-primary leading-none"
                >
                  {currentSeats.toFixed(1)}
                </motion.span>
                <span className="text-sm text-slate-300 font-bold">{t('coalition.seatsOf')}</span>
              </div>
              
              <div className="flex-grow w-full">
                <div className="flex justify-between items-center mb-1">
                   <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${isMajority ? 'text-green-600' : 'text-secondary'}`}>
                     {isMajority ? t('coalition.majorityFormed') : t('coalition.majorityThreshold')}
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
          
          {/* LEFT: Party Selector (Compact Sidebar) */}
          <section className="col-span-12 lg:col-span-3 space-y-4">
            
            {/* Poll Selection Card */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:border-stone-300 transition-all duration-200">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{t('coalition.pollSource')}</span>
                  <span className="px-2 py-0.5 text-[8px] font-bold rounded-full bg-slate-100 text-primary uppercase tracking-wider">
                    {selectedPoll.id === 'polidash_avg' 
                      ? (lang === 'he' ? 'עדכני' : 'Current') 
                      : selectedPoll.date}
                  </span>
                </div>
                <div className="relative mt-1">
                  <select 
                    className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2 text-[11px] font-bold text-primary focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer transition-all duration-150 appearance-none bg-none ${
                      lang === 'he' ? 'pl-8 pr-3' : 'pr-8 pl-3'
                    }`}
                    value={selectedPoll.id}
                    onChange={(e) => {
                      const poll = latestUniquePolls.find(p => p.id === e.target.value);
                      if (poll) {
                        setSelectedPoll(poll);
                      }
                    }}
                  >
                    {latestUniquePolls.map(poll => (
                      <option key={poll.id} value={poll.id}>
                        {poll.id === 'polidash_avg' 
                          ? t('polls.table.avg') 
                          : `${tPollSource(poll.source.split(' (')[0])} - ${poll.date}`}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${
                    lang === 'he' ? 'left-0 pl-2' : 'right-0 pr-2'
                  }`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 leading-normal mt-1">
                  {lang === 'he' 
                    ? 'ניתן לבחור סקרים שונים מתוך מגוון ערוצי החדשות או להשתמש בממוצע PoliDash.' 
                    : 'Compare seat projections across news channels or use the PoliDash Average.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-2 px-1">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{t('coalition.assemble')}</h3>
                {proposedCoalition.length > 0 && (
                  <button 
                    onClick={() => setProposedCoalition([])}
                    className="text-[9px] font-bold text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-wider"
                  >
                    {lang === 'he' ? 'הסר הכל' : 'Clear All'}
                  </button>
                )}
              </div>
              {Object.entries(selectedPoll.data)
                .sort((a, b) => b[1] - a[1])
                .map(([name, seats]) => {
                  if (seats === 0) return null;
                  const isSelected = proposedCoalition.includes(name);
                  const color = PARTY_COLORS[name] || '#2B4C7E';
                  return (
                    <button
                      key={name}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('.leader-tooltip')) {
                          return;
                        }
                        toggleParty(name);
                      }}
                      className={`group relative flex items-center justify-between px-3 py-1.5 rounded-lg transition-all border shadow-sm ${
                        !isSelected ? 'bg-white text-primary border-stone-100 hover:border-secondary' : 'text-white'
                      }`}
                      style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
                    >
                      <span className="font-bold text-[8px] uppercase tracking-tight text-start truncate pe-2">{tParty(name)}</span>
                      <span className="font-['Newsreader'] italic font-bold text-sm">{seats}</span>
                      
                      {/* Hover Tooltip Card */}
                      {(() => {
                        const leaderId = getPartyLeaderId(name);
                        const leader = leaderId ? politicians.find(p => p.id === leaderId) : null;
                        if (!leader) return null;
                        
                        return (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.hash = `#/profile/${leader.id}`;
                            }}
                            className="leader-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white/95 backdrop-blur-sm border border-stone-200 shadow-xl rounded-xl p-3 flex items-center gap-3 text-start pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 scale-95 opacity-0 transition-all duration-200 delay-0 group-hover:delay-[1000ms] z-50 normal-case cursor-pointer hover:border-secondary before:absolute before:content-[''] before:w-full before:h-3 before:top-full before:left-0"
                          >
                            <img 
                              src={leader.imageUrl} 
                              alt={leader.name} 
                              className="w-9 h-9 rounded-full object-cover object-top border border-stone-200 flex-shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-[10px] text-slate-800 uppercase tracking-tight truncate">
                                {tPolitician(leader.name)}
                              </span>
                              <span className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 truncate">
                                {lang === 'he' ? 'יו"ר מפלגה' : 'Party Leader'}
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-[12px] text-slate-400 ms-auto flex-shrink-0 hover:text-secondary">
                              open_in_new
                            </span>
                          </div>
                        );
                      })()}
                    </button>
                  );
                })}
            </div>
          </section>

          {/* RIGHT: Wide Graph Area & Stability Index */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center min-h-[280px] md:min-h-[320px]">
              <ParliamentChart totalSeats={TOTAL_SEATS} coalitionSeats={currentSeats} parties={chartParties} />
            </div>

            {/* Ideological Conflict Analysis Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm" dir={lang === 'he' ? 'rtl' : 'ltr'}>
              <div className="border-b border-stone-100 pb-5 mb-6">
                <h3 className="font-['Newsreader'] text-2xl font-bold text-primary flex items-center gap-2">
                  {t('coalition.stability.title')}
                </h3>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mt-1">
                  {t('coalition.stability.desc')}
                </p>
              </div>

              {proposedCoalition.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-medium italic">
                  {t('coalition.stability.empty')}
                </div>
              ) : (
                <div>
                  {stability.conflicts.length === 0 ? (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-2xl font-bold">verified</span>
                      </div>
                      <h4 className="font-headline text-lg font-bold text-emerald-800 mb-2">
                        {t('coalition.stability.noConflictsTitle')}
                      </h4>
                      <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                        {t('coalition.stability.noConflictsDesc')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stability.conflicts.map(conf => (
                        <div key={conf.issue} className="flex flex-col justify-between bg-stone-50/50 p-5 rounded-xl border border-stone-100 transition-all hover:bg-stone-50">
                          <div className="border-b border-stone-200 pb-2.5 mb-3">
                            <button
                              onClick={() => setExpandedIssue(expandedIssue === conf.issue ? null : conf.issue)}
                              className="text-xs font-bold text-slate-800 hover:text-secondary transition-colors inline-flex items-center gap-1.5 group text-start focus:outline-none w-full justify-between"
                            >
                              <span className="truncate">{tIssue(conf.issue)}</span>
                              <span className={`material-symbols-outlined text-[14px] text-slate-400 group-hover:text-secondary transition-transform duration-200 shrink-0 ${expandedIssue === conf.issue ? 'rotate-180 text-secondary' : ''}`}>
                                expand_more
                              </span>
                            </button>
                            {expandedIssue === conf.issue && (
                              <div className="mt-2 text-[11px] text-slate-500 bg-stone-100/60 p-2.5 rounded border border-stone-200/50 leading-relaxed font-normal normal-case">
                                {tIssueDefinition(conf.issue)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-3 text-xs">
                            <div className="flex flex-wrap items-center gap-3 py-1">
                              <a
                                href={`#/issues?topic=${encodeURIComponent(conf.issue)}&stance=SUPPORT`}
                                className="text-secondary-container font-extrabold text-[13px] uppercase tracking-wider shrink-0 ps-1 hover:underline hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-0.5 group"
                              >
                                <span>{tStance('Support')}:</span>
                                <span className="material-symbols-outlined text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                              </a>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {conf.parties.filter(p => p.stance === 'Support').map((p) => {
                                  const partyColor = PARTY_COLORS[p.name] || '#64748B';
                                  return (
                                    <a
                                      key={p.name}
                                      href={getPartyRepresentativeUrl(p.name)}
                                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-200/80 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.03] active:scale-95"
                                    >
                                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: partyColor }} />
                                      <span className="text-slate-800">{tParty(p.name)}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div className="border-t border-stone-200/60 my-1 w-full" />
                            
                            <div className="flex flex-wrap items-center gap-3 py-1">
                              <a
                                href={`#/issues?topic=${encodeURIComponent(conf.issue)}&stance=OPPOSE`}
                                className="text-primary font-extrabold text-[13px] uppercase tracking-wider shrink-0 ps-1 hover:underline hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-0.5 group"
                              >
                                <span>{tStance('Oppose')}:</span>
                                <span className="material-symbols-outlined text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                              </a>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {conf.parties.filter(p => p.stance === 'Oppose').map((p) => {
                                  const partyColor = PARTY_COLORS[p.name] || '#64748B';
                                  return (
                                    <a
                                      key={p.name}
                                      href={getPartyRepresentativeUrl(p.name)}
                                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-200/80 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.03] active:scale-95"
                                    >
                                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: partyColor }} />
                                      <span className="text-slate-800">{tParty(p.name)}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Poll Source Label */}
        <div className="flex justify-end pt-2 pe-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
            {t('coalition.dataSource')} {selectedPoll.id === 'polidash_avg' ? t('polls.table.avg') : tPollSource(selectedPoll.source)}
          </span>
        </div>

      </div>
    </div>
  );
};

export default CoalitionBuilder;
