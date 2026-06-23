import React, { useState, useEffect, useRef } from 'react';
import { politicians, ISSUE_DEFINITIONS } from './data';
import { useLanguage } from './i18n';

interface HeaderProps {
  currentPath: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{ type: 'politician' | 'issue', id: string, name: string }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  
  const { lang, setLang, t, tPolitician, tIssue } = useLanguage();

  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const matchedPoliticians = politicians
        .filter(p => p.name.toLowerCase().includes(q) || tPolitician(p.name).toLowerCase().includes(q))
        .map(p => ({ type: 'politician' as const, id: p.id, name: tPolitician(p.name) }));
      
      const matchedIssues = Object.keys(ISSUE_DEFINITIONS)
        .filter(i => i.toLowerCase().includes(q) || tIssue(i).toLowerCase().includes(q))
        .map(i => ({ type: 'issue' as const, id: i, name: tIssue(i) }));

      setResults([...matchedPoliticians, ...matchedIssues]);
    } else {
      setResults([]);
    }
  }, [searchQuery, tPolitician, tIssue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: { type: 'politician' | 'issue', id: string, name: string }) => {
    if (result.type === 'politician') {
      window.location.hash = `#/profile/${result.id}`;
    } else {
      window.location.hash = `#/issues?topic=${encodeURIComponent(result.id)}`;
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { name: t('header.nav.home'), path: '#/' },
    { name: t('header.nav.profiles'), path: '#/profiles' },
    { name: t('header.nav.issues'), path: '#/issues' },
    { name: t('header.nav.quiz'), path: '#/quiz' },
    { name: t('header.nav.polls'), path: '#/polls' },
    { name: t('header.nav.coalition'), path: '#/coalition' },
    { name: t('header.nav.map'), path: '#/map' },
  ];


  return (
    <header className="sticky top-0 w-full z-[100] bg-[#fbf9f5]/80 dark:bg-[#162839]/80 backdrop-blur-md border-b border-stone-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4 relative">
        <div className="flex items-center gap-8">
          {/* Desktop logo link */}
          <div className="hidden md:flex items-center gap-2">
            <a className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]" href="#/">PoliDash</a>
            <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded bg-secondary/15 text-secondary border border-secondary/20 leading-none">BETA</span>
          </div>

          {/* Mobile logo dropdown */}
          <div ref={mobileNavRef} className="relative md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5] flex items-center gap-1.5 focus:outline-none"
            >
              <span>PoliDash</span>
              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded bg-secondary/15 text-secondary border border-secondary/20 leading-none">BETA</span>
              <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${isMobileNavOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>
            {isMobileNavOpen && (
              <div className={`absolute top-full ${lang === 'he' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white/95 dark:bg-[#162839]/95 backdrop-blur-md rounded-xl border border-stone-200/50 dark:border-slate-800/50 shadow-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-150`}>
                {navLinks.map(link => {
                  const isActive = currentPath === link.path || (link.path !== '#/' && currentPath.startsWith(link.path));
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      onClick={() => {
                        setIsMobileNavOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`block px-5 py-2.5 text-sm font-['Inter'] transition-colors ${
                        isActive
                          ? 'font-bold text-[#162839] dark:text-[#fbf9f5] bg-stone-100/60 dark:bg-slate-800/60'
                          : 'font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397] hover:bg-stone-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => {
              const isActive = currentPath === link.path || (link.path !== '#/' && currentPath.startsWith(link.path));
              return (
                <a 
                  key={link.path}
                  className={`font-['Inter'] text-sm transition-colors duration-200 ${
                    isActive 
                      ? 'font-bold border-b-2 border-[#162839] dark:border-[#fbf9f5] pb-1 text-[#162839] dark:text-[#fbf9f5]' 
                      : 'font-medium text-[#2c3e50] dark:text-[#f5f3ef] opacity-80 hover:text-[#006397]'
                  }`} 
                  href={link.path}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-stone-100 dark:bg-slate-800 rounded-full px-4 py-1.5 transition-all w-48 md:w-64 border border-secondary/20 shadow-inner">
                <span className="material-symbols-outlined text-sm text-slate-400">search</span>
                <input 
                  autoFocus
                  type="text" 
                  placeholder={t('header.search.placeholder')}
                  className="bg-transparent border-none focus:ring-0 text-sm w-full px-2 text-primary placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]);
                    if (e.key === 'Escape') setIsSearchOpen(false);
                  }}
                />
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
              >
                <span className="material-symbols-outlined text-[#162839] dark:text-[#fbf9f5] group-hover:text-secondary scale-95 transition-all">search</span>
              </button>
            )}

            {isSearchOpen && searchQuery.length > 1 && (
              <div className="absolute top-full right-0 mt-2 w-64 md:w-80 bg-white dark:bg-[#1b2a3a] shadow-2xl rounded-lg border border-stone-200 dark:border-slate-700 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {results.length > 0 ? (
                    results.map((res) => (
                      <button
                        key={`${res.type}-${res.id}`}
                        onClick={() => handleSelect(res)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-slate-800 text-start transition-colors group border-b border-stone-50 dark:border-slate-800 last:border-none"
                      >
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-secondary text-lg">
                          {res.type === 'politician' ? 'person' : 'policy'}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{res.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400">{t(res.type === 'politician' ? 'profiles.title1' : 'header.nav.issues')}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs text-slate-400 italic">{t('header.search.noResults')} "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 border-s border-stone-200 dark:border-slate-800 ps-4 ms-2">
            <button 
              onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
              className="font-['Inter'] text-sm font-medium tracking-tight text-[#162839] dark:text-[#fbf9f5] cursor-pointer hover:text-secondary transition-colors flex items-center gap-1.5"
            >
              <span>{lang === 'en' ? 'עב' : 'EN'}</span>
              <span className="material-symbols-outlined scale-90 opacity-60 hover:opacity-100 transition-all text-base">language</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
