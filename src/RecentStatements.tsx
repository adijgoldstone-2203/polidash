import React, { useState, useEffect } from 'react';
import { useLanguage } from './i18n';
import recentStatementsData from './data/recent_statements.json';

interface Statement {
  id: string;
  politicianId: string;
  nameEn: string;
  nameHe: string;
  partyEn: string;
  partyHe: string;
  partyColor: string;
  quoteEn: string;
  quoteHe: string;
  topicEn: string;
  topicHe: string;
  sourceEn: string;
  sourceHe: string;
  sourceUrl: string;
  timestampEn: string;
  timestampHe: string;
  avatarUrl?: string;
  isNew?: boolean;
}

// Sort statements chronologically by date (newest first)
const sortedData: Statement[] = [...(recentStatementsData as Statement[])].sort((a, b) => {
  return Date.parse(b.timestampEn) - Date.parse(a.timestampEn);
});

// Load the oldest 25 statements initially
const INITIAL_STATEMENTS: Statement[] = sortedData.slice(5);

// Stream the newest 5 statements (oldest first to let the absolute freshest arrive last)
const STREAM_POOL: Statement[] = sortedData.slice(0, 5).reverse();

const RecentStatements: React.FC = () => {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  // Active statements list
  const [statements, setStatements] = useState<Statement[]>(INITIAL_STATEMENTS);
  // Toast notifications for newly received statements
  const [activeToast, setActiveToast] = useState<Statement | null>(null);

  // Filters State
  const [selectedPolitician, setSelectedPolitician] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Stream simulation: Append a new statement from STREAM_POOL every 15 seconds
  useEffect(() => {
    let poolIndex = 0;

    const interval = setInterval(() => {
      if (poolIndex >= STREAM_POOL.length) {
        clearInterval(interval);
        return;
      }

      const nextItem = STREAM_POOL[poolIndex];
      const newStatement: Statement = {
        ...nextItem,
        isNew: true
      };

      // Prepend the new statement to the feed
      setStatements(prev => [newStatement, ...prev]);
      // Pop a toast notification
      setActiveToast(newStatement);

      poolIndex++;
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Dismiss toast after 5 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Extract unique filter lists with both English and Hebrew values
  const politicians = Array.from(
    new Map(
      (recentStatementsData as Statement[]).map(s => [s.nameEn, { en: s.nameEn, he: s.nameHe }])
    ).values()
  );

  const topics = Array.from(
    new Map(
      (recentStatementsData as Statement[]).map(s => [s.topicEn, { en: s.topicEn, he: s.topicHe }])
    ).values()
  );

  const sources = [
    { en: 'Speech', he: 'נאום / כנסת', val: 'Speech' },
    { en: 'Social & Interview', he: 'רשתות וראיונות', val: 'Social' },
    { en: 'Official Statement', he: 'הודעות רשמיות', val: 'Official' }
  ];

  // Filtering Logic
  const filteredStatements = statements.filter(s => {
    const matchesPolitician = selectedPolitician === 'all' || s.nameEn === selectedPolitician || s.nameHe === selectedPolitician;
    const matchesTopic = selectedTopic === 'all' || s.topicEn === selectedTopic || s.topicHe === selectedTopic;
    
    let matchesSource = true;
    if (selectedSource !== 'all') {
      if (selectedSource === 'Speech') matchesSource = s.sourceEn.includes('Speech') || s.sourceHe.includes('נאום') || s.sourceHe.includes('מליאת');
      if (selectedSource === 'X') matchesSource = s.sourceEn.includes('X') || s.sourceHe.includes('רשת X');
      if (selectedSource === 'Press') matchesSource = s.sourceEn.includes('Press') || s.sourceHe.includes('הצהרה רשמית') || s.sourceEn.includes('Briefing') || s.sourceHe.includes('תדרוך');
    }

    return matchesPolitician && matchesTopic && matchesSource;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative">
      
      {/* Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-[200] max-w-sm w-full bg-white dark:bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-4 animate-slide-in flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: activeToast.partyColor }} />
              <span className="font-bold text-xs text-stone-500 uppercase tracking-wider">{isHe ? 'הצהרה חדשה' : 'Live Update'}</span>
            </div>
            <button onClick={() => setActiveToast(null)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-250 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <p className="text-xs font-bold text-primary dark:text-[#fbf9f5]">
            {isHe ? activeToast.nameHe : activeToast.nameEn} ({isHe ? activeToast.partyHe : activeToast.partyEn})
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 italic">
            {isHe ? activeToast.quoteHe : activeToast.quoteEn}
          </p>
        </div>
      )}

      {/* Hero section */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="font-headline font-black text-3xl md:text-5xl text-primary dark:text-[#fbf9f5] tracking-tight leading-tight mb-4">
          {isHe ? 'הצהרות אחרונות בזמן אמת' : 'Recent Statements Feed'}
        </h1>
        <p className="text-base md:text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
          {isHe 
            ? 'מעקב שוטף ומתועד אחר התבטאויות והצהרות של מנהיגי הציבור בכנסת, ברשתות החברתיות ובתקשורת הרשמית.'
            : 'Track live, verified quotes from major political leaders sourced directly from social media, plenum speeches, and official briefings.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0 flex flex-col gap-4 bg-white dark:bg-slate-900 border border-stone-200/50 dark:border-slate-800/80 p-5 rounded-2xl h-fit shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
            {isHe ? 'מסננים' : 'Filter Feed'}
          </h3>

          {/* Politician Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">
              {isHe ? 'פוליטיקאי:' : 'Politician'}
            </label>
            <select
              value={selectedPolitician}
              onChange={(e) => setSelectedPolitician(e.target.value)}
              className="text-xs bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 focus:outline-none font-semibold cursor-pointer text-stone-700 dark:text-stone-200 w-full"
            >
              <option value="all">{isHe ? 'כל הפוליטיקאים' : 'All Politicians'}</option>
              {politicians.map(p => (
                <option key={p.en} value={p.en}>{isHe ? p.he : p.en}</option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">
              {isHe ? 'נושא:' : 'Topic'}
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 focus:outline-none font-semibold cursor-pointer text-stone-700 dark:text-stone-200 w-full"
            >
              <option value="all">{isHe ? 'כל הנושאים' : 'All Topics'}</option>
              {topics.map(t => (
                <option key={t.en} value={t.en}>{isHe ? t.he : t.en}</option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">
              {isHe ? 'מקור:' : 'Source'}
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 focus:outline-none font-semibold cursor-pointer text-stone-700 dark:text-stone-200 w-full"
            >
              <option value="all">{isHe ? 'כל המקורות' : 'All Sources'}</option>
              {sources.map(s => (
                <option key={s.val} value={s.val}>{isHe ? s.he : s.en}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedPolitician !== 'all' || selectedTopic !== 'all' || selectedSource !== 'all') && (
            <button
              onClick={() => {
                setSelectedPolitician('all');
                setSelectedTopic('all');
                setSelectedSource('all');
              }}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 underline decoration-dashed underline-offset-4 mt-2 self-start cursor-pointer"
            >
              {isHe ? 'אפס מסננים' : 'Reset Filters'}
            </button>
          )}
        </div>

        {/* Feed Cards List */}
        <div className="flex-grow flex flex-col gap-4">
          {filteredStatements.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-stone-200/50 dark:border-slate-850 p-8 rounded-2xl text-center shadow-sm">
              <span className="material-symbols-outlined text-stone-300 dark:text-slate-700 text-4xl mb-2">inbox</span>
              <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                {isHe ? 'לא נמצאו הצהרות המתאימות למסננים שנבחרו.' : 'No statements found matching the selected filters.'}
              </p>
            </div>
          ) : (
            filteredStatements.map(s => (
              <div 
                key={s.id} 
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-500 flex flex-col gap-4 relative overflow-hidden ${
                  s.isNew 
                    ? 'border-amber-500/60 dark:border-amber-500/40 animate-pulse-border bg-amber-500/[0.01]' 
                    : 'border-stone-200/60 dark:border-slate-850 hover:border-stone-300'
                }`}
              >
                {/* Party Color strip */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: s.partyColor }} />

                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: s.partyColor }}
                    >
                      {(isHe ? s.nameHe : s.nameEn).charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm md:text-base text-stone-850 dark:text-stone-100">
                        {isHe ? s.nameHe : s.nameEn}
                      </span>
                      <span className="text-[10px] md:text-xs font-semibold text-stone-400 uppercase">
                        {isHe ? s.partyHe : s.partyEn}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] md:text-xs font-mono text-stone-450 dark:text-slate-500">
                    {isHe ? s.timestampHe : s.timestampEn}
                  </span>
                </div>

                {/* Card Quote */}
                <p className="text-xs md:text-sm text-stone-700 dark:text-stone-200 leading-relaxed italic pl-1 border-l-2 border-stone-200/60 dark:border-slate-800">
                  {isHe ? s.quoteHe : s.quoteEn}
                </p>

                {/* Card Footer tags and sources */}
                <div className="flex flex-wrap gap-2 items-center justify-between mt-1 pt-3 border-t border-stone-100 dark:border-slate-800/50">
                  <div className="flex gap-1.5">
                    <span className="text-[9px] md:text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {isHe ? s.topicHe : s.topicEn}
                    </span>
                  </div>

                  <a 
                    href={s.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[10px] md:text-[11px] font-bold text-stone-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px] md:text-[14px]">link</span>
                    <span>{isHe ? s.sourceHe : s.sourceEn}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default RecentStatements;
