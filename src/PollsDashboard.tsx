import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactSlider from 'react-slider';
import { POLL_DATA, CURRENT_KNESSET, PARTY_COLORS } from './polls';
import { computeWeightedAverage, getRunningWeightedAverageData, getAllParties, getSinglePollTimeSeriesData } from './utils/pollAnalytics';
import TrendChart from './components/TrendChart';
import { useLanguage } from './i18n';
import { politicians, AI_DISCLAIMER } from './data';

const getPartyLeaderId = (partyName: string): string | null => {
  const normalized = partyName.toLowerCase();
  if (normalized.includes('likud')) return 'benjamin-netanyahu';
  if (normalized.includes('bennett') || normalized.includes('together')) return 'naftali-bennett';
  if (normalized.includes('national unity')) return 'benny-gantz';
  if (normalized.includes('yashar')) return 'gadi-eisenkot';
  if (normalized.includes('democrats') || normalized.includes('labor')) return 'yair-golan';
  if (normalized.includes('shas')) return 'aryeh-deri';
  if (normalized.includes('ra\'am') || normalized.includes('united arab list') || normalized.includes('united arab party')) return 'mansour-abbas';
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


interface DateRangeSliderProps {
  months: string[];
  initialRange: [number, number];
  onChange: (val: [number, number]) => void;
  formatMonthLabel: (monthStr: string) => string;
}

const DateRangeSlider: React.FC<DateRangeSliderProps> = ({ months, initialRange, onChange, formatMonthLabel }) => {
  const [localRange, setLocalRange] = useState<[number, number]>(initialRange);

  useEffect(() => {
    setLocalRange(initialRange);
  }, [initialRange]);

  return (
    <ReactSlider
      className="w-full h-2 bg-slate-200 rounded-full relative"
      thumbClassName="h-5 w-5 bg-primary rounded-full shadow cursor-grab outline-none flex justify-center items-center top-1/2 -translate-y-1/2 focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
      min={0}
      max={months.length - 1}
      value={localRange}
      onChange={(val) => setLocalRange(val as [number, number])}
      onAfterChange={(val) => onChange(val as [number, number])}
      pearling
      minDistance={0}
      renderTrack={(props, state) => {
        const { key, className, ...restProps } = props;
        return (
          <div 
            key={key} 
            {...restProps} 
            className={`${className || ''} h-2 rounded-full ${state.index === 1 ? 'bg-primary' : 'bg-slate-200'}`} 
          />
        );
      }}
      renderThumb={(props, state) => {
        const { key, ...restProps } = props;
        return (
          <div key={key} {...restProps}>
            <div className={`absolute ${state.index === 0 ? '-top-6' : '-bottom-6'} whitespace-nowrap text-xs font-medium text-gray-600`}>
              {formatMonthLabel(months[state.valueNow])}
            </div>
          </div>
        );
      }}
    />
  );
};

const PollsDashboard: React.FC = () => {
  const { t, tParty, tPollSource, tPolitician, dateLocale, lang } = useLanguage();
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());
  const [monthRange, setMonthRange] = useState<[number, number]>([0, 100]); // will sync dynamically
  const [sortColumn, setSortColumn] = useState<string>('weighted');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [visibleParties, setVisibleParties] = useState<Set<string>>(new Set());
  
  const chartRef = useRef<HTMLDivElement>(null);

  const allParties = useMemo(() => {
    const rawParties = getAllParties(POLL_DATA);
    if (POLL_DATA.length === 0) return rawParties;
    
    const sorted = [...POLL_DATA].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    
    // Check the 20 most recent polls to see which parties are still actively running
    const recentPolls = sorted.slice(0, 20);
    const activeParties = new Set<string>();
    
    recentPolls.forEach(poll => {
      Object.entries(poll.data).forEach(([party, seats]) => {
        if (seats > 0) activeParties.add(party);
      });
    });
    
    return rawParties.filter(party => activeParties.has(party));
  }, []);

  const handleRowClick = (e: React.MouseEvent, party: string) => {
    if ((e.target as HTMLElement).closest('.leader-tooltip')) {
      return;
    }

    setVisibleParties(prev => {
      const next = new Set(prev);
      const isAllSelected = prev.size === allParties.length;
      
      if (isAllSelected) {
        // If all are selected, deselect all others and keep only the clicked one
        next.clear();
        next.add(party);
      } else {
        // Toggle the clicked one
        if (next.has(party)) {
          next.delete(party);
        } else {
          next.add(party);
        }
      }
      return next;
    });

    // Small delay to ensure the chart renders the new line before scrolling
    setTimeout(() => {
      chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };


  // Analytics
  const weightedAvg = useMemo(() => computeWeightedAverage(POLL_DATA), []);
  // Unique poll sources (including pollster) for the footer
  const fullSources = useMemo(() => {
    const s = new Set<string>();
    POLL_DATA.forEach(p => s.add(p.source.split(' (')[0]));
    return Array.from(s);
  }, []);

  // Unique channels (excluding pollster) for the filter dropdown
  const channels = useMemo(() => {
    const s = new Set<string>();
    POLL_DATA.forEach(p => s.add(p.source.split(' (')[0]));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, []);

  // Unique months for the date filter dropdown (chronological)
  const months = useMemo(() => {
    const m = new Set<string>();
    POLL_DATA.forEach(p => {
      if (!p.dateISO) return;
      const d = new Date(p.dateISO);
      m.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(m).sort();
  }, []);

  // Sync range when months load
  useEffect(() => {
    if (months.length > 0) {
      // Default to the most recent 2 months
      setMonthRange([Math.max(0, months.length - 2), months.length - 1]);
    }
  }, [months]);

  // Filter polls based on selected channels only (so all historical data is included in average calculations)
  const channelFilteredPolls = useMemo(() => {
    return POLL_DATA.filter(p => {
      const channelName = p.source.split(' (')[0];
      return selectedChannels.size === 0 || selectedChannels.has(channelName);
    });
  }, [selectedChannels]);

  // Filter polls based on selected channels and month range (for latest polls list/table)
  const filteredPolls = useMemo(() => {
    return channelFilteredPolls.filter(p => {
      let matchDate = true;
      if (months.length > 0 && p.dateISO) {
        const d = new Date(p.dateISO);
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const pollMonthIdx = months.indexOf(monthStr);
        if (pollMonthIdx !== -1) {
          matchDate = pollMonthIdx >= monthRange[0] && pollMonthIdx <= monthRange[1];
        }
      }
      return matchDate;
    });
  }, [channelFilteredPolls, monthRange, months]);

  // Extract most recent unique poll from each source up to 6 (or just the most recent 6 overall if channel filters are selected)
  const latestUniquePolls = useMemo(() => {
    if (selectedChannels.size > 0) {
      return filteredPolls.slice(0, 6);
    }

    const seen = new Set<string>();
    const result = [];
    for (const p of filteredPolls) {
      const channel = p.source.split(' (')[0];
      if (!seen.has(channel)) {
        seen.add(channel);
        result.push(p);
      }
      if (result.length === 6) break;
    }
    return result;
  }, [filteredPolls, selectedChannels]);

  // Data for the trend chart
  const chartData = useMemo(() => {
    const fullSeries = selectedChannels.size === 1
      ? getSinglePollTimeSeriesData(channelFilteredPolls)
      : getRunningWeightedAverageData(channelFilteredPolls);

    return fullSeries.filter(entry => {
      if (months.length > 0 && entry.date) {
        const d = new Date(entry.date as string);
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const pollMonthIdx = months.indexOf(monthStr);
        if (pollMonthIdx !== -1) {
          return pollMonthIdx >= monthRange[0] && pollMonthIdx <= monthRange[1];
        }
      }
      return true;
    });
  }, [channelFilteredPolls, selectedChannels, monthRange, months]);

  // Sortable parties for the comparison table
  const sortedPartiesForTable = useMemo(() => {
    const parties = allParties.filter(p => {
      const hasAvg = (weightedAvg[p] || 0) > 0.5;
      const hasRecentSeats = latestUniquePolls.some(poll => (poll.data[p] || 0) > 0);
      const isCurrentKnesset = (CURRENT_KNESSET[p] || 0) > 0;
      return hasAvg || hasRecentSeats || isCurrentKnesset;
    });
    return parties.sort((a, b) => {
      let valA = 0, valB = 0;
      if (sortColumn === 'weighted') { valA = weightedAvg[a] || 0; valB = weightedAvg[b] || 0; }
      else if (sortColumn === 'knesset') { valA = CURRENT_KNESSET[a] || 0; valB = CURRENT_KNESSET[b] || 0; }
      else { valA = 0; valB = 0; }
      return sortDir === 'desc' ? valB - valA : valA - valB;
    });
  }, [sortColumn, sortDir, allParties, weightedAvg, latestUniquePolls]);

  const toggleSort = (col: string) => {
    if (sortColumn === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortColumn(col); setSortDir('desc'); }
  };

  const toggleParty = (party: string) => {
    setVisibleParties(prev => {
      const next = new Set(prev);
      if (next.has(party)) next.delete(party);
      else next.add(party);
      return next;
    });
  };

  const formatMonthLabel = (monthStr: string) => {
    const [y, m] = monthStr.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' });
  };

  const handleReset = () => {
    setSelectedChannels(new Set());
    if (months.length > 0) {
      setMonthRange([Math.max(0, months.length - 2), months.length - 1]);
    }
    setVisibleParties(new Set());
    setSortColumn('weighted');
    setSortDir('desc');
  };

  const isDefaultRange = months.length > 0 && monthRange[0] === Math.max(0, months.length - 2) && monthRange[1] === months.length - 1;
  const isDefaultState = selectedChannels.size === 0 && isDefaultRange && visibleParties.size === 0 && sortColumn === 'weighted';

  const SortArrow = ({ col }: { col: string }) => (
    <span className="text-[8px] ms-0.5 opacity-50">
      {sortColumn === col ? (sortDir === 'desc' ? '▼' : '▲') : '⬍'}
    </span>
  );

  const ChannelSelector = () => (
    <div className="flex flex-col gap-2 w-full lg:w-[480px] lg:max-w-[480px] lg:flex-shrink-0 lg:flex-grow-0 mt-2 lg:mt-0" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('polls.trend.channels')}</label>
      <div className="flex flex-wrap gap-1.5">
        <button 
          onClick={() => setSelectedChannels(new Set())}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition-colors ${selectedChannels.size === 0 ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
        >
          {t('polls.trend.all')}
        </button>
        {channels.map(c => (
          <button
            key={c}
            onClick={() => {
              const next = new Set(selectedChannels);
              if (next.has(c)) {
                next.delete(c);
              } else {
                next.add(c);
              }
              setSelectedChannels(next);
            }}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition-colors ${selectedChannels.has(c) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
          >
            {tPollSource(c)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] px-6 lg:px-12 pt-8 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <section className="mb-12">
          <h1 className="font-['Newsreader'] text-3xl sm:text-4xl md:text-7xl tracking-tight text-primary mb-4">
            {t('polls.title1')} <span className="italic font-bold">{t('polls.title2')}</span>
          </h1>
          <div className="h-1 w-24 bg-primary mb-6" />
          <p className="font-body text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            {t('polls.desc')
              .replace('{count}', String(POLL_DATA.length))
              .replace('{channels}', String(channels.length))
              .replace('{from}', POLL_DATA[POLL_DATA.length - 1]?.date || '')
              .replace('{to}', POLL_DATA[0]?.date || '')}
          </p>
        </section>
        {/* ===================== SECTION 1: Trend Chart ===================== */}
        <section className="mb-8" ref={chartRef}>
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 bg-white/50 p-4 rounded-xl border border-slate-100 w-full mb-6">
              <div className="flex flex-col flex-grow min-w-[280px] lg:min-w-[400px]">
                <label className="text-sm font-medium text-gray-500 mb-2">{t('polls.trend.dateRange')}</label>
                {months.length > 0 ? (
                  <div className="px-3 pt-6 pb-6">
                    <DateRangeSlider
                      months={months}
                      initialRange={monthRange}
                      onChange={setMonthRange}
                      formatMonthLabel={formatMonthLabel}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 py-2">{t('polls.trend.noDates')}</div>
                )}
              </div>
              <ChannelSelector />
              <button
                onClick={handleReset}
                disabled={isDefaultState}
                className={`px-4 py-2 ms-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border-2 border-transparent transition-all underline decoration-dashed underline-offset-4 ${
                  !isDefaultState
                    ? "text-slate-400 hover:text-slate-700 cursor-pointer"
                    : "text-slate-200 cursor-not-allowed opacity-50 decoration-slate-200"
                }`}
              >
                {t('polls.trend.reset')}
              </button>
            </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <TrendChart 
              data={chartData}
              visibleParties={visibleParties}
              onToggleParty={toggleParty}
              onClearAll={() => setVisibleParties(new Set())}
              onSelectAll={() => setVisibleParties(new Set(allParties))}
              allParties={allParties}
              animationKey={`${Array.from(selectedChannels).join(',')}-${monthRange[0]}-${monthRange[1]}`}
            />
          </div>
        </section>

        {/* ===================== SECTION 2: Poll Comparison Table ===================== */}
        <section className="mb-12 hidden md:block">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-6 w-full">
            <div className="flex-shrink-0">
              <h2 className="font-['Newsreader'] text-2xl font-bold text-primary">{t('polls.table.title')}</h2>
            </div>
            <div className="flex-grow flex items-center justify-end gap-3" dir={lang === 'he' ? 'rtl' : 'ltr'}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex-shrink-0">{t('polls.trend.channels')}:</label>
              <div className="flex flex-wrap lg:flex-nowrap justify-end gap-1">
                <button 
                  onClick={() => setSelectedChannels(new Set())}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition-colors whitespace-nowrap ${selectedChannels.size === 0 ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                >
                  {t('polls.trend.all')}
                </button>
                {channels.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      const next = new Set(selectedChannels);
                      if (next.has(c)) {
                        next.delete(c);
                      } else {
                        next.add(c);
                      }
                      setSelectedChannels(next);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition-colors whitespace-nowrap ${selectedChannels.has(c) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                  >
                    {tPollSource(c)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden md:overflow-visible">
            <div className="overflow-x-auto md:overflow-x-visible">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="text-start py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 sticky start-0 bg-slate-50/80 z-30 min-w-[160px]">
                      {t('polls.table.party')}
                    </th>
                    {latestUniquePolls.map(poll => (
                      <th key={poll.id} className="text-center py-3 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 min-w-[80px]">
                        <div>{tPollSource(poll.source.split(' (')[0])}</div>
                        <div className="font-normal text-[8px] text-slate-400 mt-0.5">{poll.date}</div>
                      </th>
                    ))}
                    <th 
                      className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer hover:text-secondary transition-colors min-w-[100px]"
                      onClick={() => toggleSort('weighted')}
                    >
                      {t('polls.table.avg')} <SortArrow col="weighted" />
                    </th>
                    <th 
                      className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 cursor-pointer hover:text-primary transition-colors min-w-[100px]"
                      onClick={() => toggleSort('knesset')}
                    >
                      {t('polls.table.knesset')} <SortArrow col="knesset" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPartiesForTable.map((party, i) => {
                    const weighted = weightedAvg[party] || 0;
                    const knesset = CURRENT_KNESSET[party] || 0;
                    const partyColor = PARTY_COLORS[party] || '#94a3b8';
                    
                    return (
                      <tr 
                        key={party} 
                        onClick={(e) => handleRowClick(e, party)}
                        className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-slate-50/20'}`}
                      >
                        <td className="py-2.5 px-4 sticky start-0 bg-inherit z-20 hover:z-40 group relative">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: partyColor }} />
                            <span className="font-bold text-slate-800 text-xs group-hover:text-primary transition-colors">{tParty(party)}</span>
                          </div>

                           {/* Hover Tooltip Card */}
                           {(() => {
                             const leaderId = getPartyLeaderId(party);
                             const leader = leaderId ? politicians.find(p => p.id === leaderId) : null;
                             if (!leader) return null;
 
                             return (
                               <div 
                                 className="leader-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-white/95 backdrop-blur-sm border border-stone-200 shadow-xl rounded-xl p-2.5 hidden md:flex items-center gap-2.5 text-start pointer-events-none group-hover:opacity-100 group-hover:scale-100 scale-95 opacity-0 transition-all duration-200 delay-0 group-hover:delay-[1000ms] z-50 normal-case text-slate-800"
                               >
                                 <img 
                                   src={leader.imageUrl} 
                                   alt={leader.name} 
                                   className="w-8 h-8 rounded-full object-cover object-top border border-stone-200 flex-shrink-0"
                                 />
                                 <div className="flex flex-col min-w-0">
                                   <span className="font-bold text-[9px] text-slate-800 uppercase tracking-tight truncate">
                                     {tPolitician(leader.name)}
                                   </span>
                                   <span className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 truncate">
                                     {lang === 'he' ? 'יו"ר מפלגה' : 'Party Leader'}
                                   </span>
                                 </div>
                               </div>
                             );
                           })()}
                        </td>
                        {latestUniquePolls.map(poll => (
                          <td key={poll.id} className="text-center py-2.5 px-3 text-slate-600 text-sm">
                            {poll.data[party] || '—'}
                          </td>
                        ))}
                        <td className="text-center py-2.5 px-4">
                          <span className="font-bold text-slate-800 text-sm">
                            {weighted}
                          </span>
                        </td>
                        <td className="text-center py-2.5 px-4 text-slate-500 font-medium">
                          {knesset || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center border-t border-slate-200 pt-8 pb-4">
          <p className="text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            {t('polls.footer.note')}
          </p>
          <div className="bg-white/50 dark:bg-[#1f3448] rounded-lg p-4 inline-block text-start border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{t('polls.footer.sources')}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {fullSources.map(s => tPollSource(s)).join(', ')}
            </p>
          </div>
        </section>

        {/* Embedded Methodology Section */}
        <section id="methodology" className="mt-16 pt-12 border-t-2 border-[#162839] dark:border-slate-700 space-y-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>PoliDash Data Integrity & Methodology</span>
            </div>
            <h2 className="font-['Newsreader'] text-3xl md:text-4xl font-bold text-[#162839] dark:text-[#fbf9f5]">
              How PoliDash Calculates the Polling Weighted Average
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              PoliDash conducts no polls of its own. We aggregate all published polls from primary Israeli sources and compute our custom weighted average using our proprietary mathematical weighting formula.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#162839] text-white font-bold text-sm">1</span>
              <h3 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5]">Multi-Source Polling Collection</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We take all published polls directly from their original sources (Channel 12, Kan 11, Channel 14, i24 News, Maariv/Lazar, Direct Polls) as soon as fieldwork and seat data are released.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#162839] text-white font-bold text-sm">2</span>
              <h3 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5]">Our Weighted Recency Calculation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We calculate a weighted average prioritizing recency. For each polling source, the latest survey carries 100% weight (1.0) and the previous survey carries 5% weight (0.05), ensuring no single channel skews the average.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1f3448] p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#162839] text-white font-bold text-sm">3</span>
              <h3 className="font-bold text-base text-[#162839] dark:text-[#fbf9f5]">Time Decay & Threshold Baseline</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Polls published over 14 days ago receive a 50% decay adjustment, and surveys over 30 days old are excluded. If an active list is unmentioned in a specific poll, a 2.5 seat threshold baseline is assigned.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1f3448] p-6 rounded-2xl border border-stone-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-[#162839] dark:text-[#fbf9f5] flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span>
              Platform Data & AI Summarization Disclaimer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {AI_DISCLAIMER.full}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PollsDashboard;
