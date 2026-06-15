import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Politician } from './data';
import OptimizedImage from './components/OptimizedImage';
import { useLanguage } from './i18n';

export interface Criterion {
  topic: string;
  stance: 'SUPPORT' | 'OPPOSE';
}

interface VennEngineProps {
  criteria: Criterion[];
  politicians: Politician[];
}

const VennEngine: React.FC<VennEngineProps> = ({ criteria, politicians }) => {
  const { t, tParty, tPolitician, tIssue, tStance, tIssueDefinition, lang } = useLanguage();
  const [activePoliticianId, setActivePoliticianId] = useState<string | null>(null);

  // Close active tooltip when tapping outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.politician-face-btn')) {
        setActivePoliticianId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Compute intersection regions
  const regions = useMemo(() => {
    const map: Record<string, Politician[]> = {};
    
    politicians.forEach((pol) => {
      const matchedIndices: number[] = [];
      
      criteria.forEach((crit, index) => {
        const actualStance = pol.stances[crit.topic]?.toUpperCase();
        if (actualStance === crit.stance.toUpperCase()) {
          matchedIndices.push(index);
        }
      });

      if (matchedIndices.length > 0) {
        const sig = matchedIndices.sort().join(',');
        if (!map[sig]) map[sig] = [];
        map[sig].push(pol);
      }
    });
    
    return map;
  }, [criteria, politicians]);

  // If no criteria, render default placeholder
  if (criteria.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
        <span className="material-symbols-outlined text-6xl text-stone-300 mb-4">insights</span>
        <h3 className="font-headline text-2xl text-stone-400 font-medium italic">{t('issues.venn.placeholder.title')}</h3>
        <p className="text-stone-400 text-sm max-w-sm mt-2">{t('issues.venn.placeholder.desc')}</p>
      </div>
    );
  }

  const numCircles = criteria.length;
  const colors = ['bg-[#006397]/30', 'bg-[#ba1a1a]/30', 'bg-[#facc15]/30'];
  const textColors = ['text-[#006397]', 'text-[#ba1a1a]', 'text-[#a16207]'];
  
  const getCircleStyles = (index: number) => {
    let styles: any = {};
    if (numCircles === 1) styles = { top: '20%', left: '20%', width: '60%', height: '60%' };
    else if (numCircles === 2) {
      if (index === 0) styles = { top: '22%', left: '8%', width: '52%', height: '52%' };
      if (index === 1) styles = { top: '22%', left: '40%', width: '52%', height: '52%' };
    } else if (numCircles === 3) {
      const size = '52%';
      if (index === 0) styles = { top: '8%', left: '24%', width: size, height: size }; // Blue
      if (index === 1) styles = { top: '38%', left: '10%', width: size, height: size };  // Red
      if (index === 2) styles = { top: '38%', left: '38%', width: size, height: size }; // Yellow
    }

    if (lang === 'he' && styles.left && styles.width) {
      const leftVal = parseFloat(styles.left);
      const widthVal = parseFloat(styles.width);
      styles.left = `${100 - leftVal - widthVal}%`;
    }
    return styles;
  };

  const getNodePosition = (sig: string) => {
    let pos = { top: '50%', left: '50%' };
    if (numCircles === 1) {
      if (sig === '0') pos = { top: '50%', left: '50%' };
    } else if (numCircles === 2) {
      if (sig === '0') pos = { top: '48%', left: '26%' };    
      if (sig === '1') pos = { top: '48%', left: '74%' };    
      if (sig === '0,1') pos = { top: '48%', left: '50%' };  
    } else if (numCircles === 3) {
      if (sig === '0') pos = { top: '26%', left: '50%' };    
      if (sig === '1') pos = { top: '72%', left: '25%' };    
      if (sig === '2') pos = { top: '72%', left: '75%' };    
      if (sig === '0,1') pos = { top: '48%', left: '34%' };  
      if (sig === '0,2') pos = { top: '48%', left: '66%' };  
      if (sig === '1,2') pos = { top: '72%', left: '50%' };  
      if (sig === '0,1,2') pos = { top: '53%', left: '50%' }; 
    }

    if (lang === 'he' && pos.left) {
      const leftVal = parseFloat(pos.left);
      pos.left = `${100 - leftVal}%`;
    }
    return pos;
  };

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Render Venn Circles */}
      {criteria.map((crit, index) => {
        const getAlignmentClasses = () => {
          if (numCircles === 3) {
            if (index === 0) return 'items-start justify-center pt-3 md:pt-8';
            if (index === 1) return 'items-end justify-start pb-3 ps-3 md:pb-10 md:ps-10';
            if (index === 2) return 'items-end justify-end pb-3 pe-3 md:pb-10 md:pe-10';
          }
          if (numCircles === 2) {
            if (index === 0) return 'items-start justify-start pt-3 ps-4 md:pt-10 md:ps-14';
            if (index === 1) return 'items-start justify-end pt-3 pe-4 md:pt-10 md:pe-14';
          }
          return 'items-start justify-center pt-3 md:pt-6';
        };

        const isHeaderBottom = numCircles === 3 && (index === 1 || index === 2);

        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            key={index}
            className={`absolute rounded-full venn-circle flex ${getAlignmentClasses()} border-2 border-white/50 shadow-2xl ${colors[index]}`}
            style={{ ...getCircleStyles(index) }}
          >
            <div className={`relative group/venntooltip text-center font-bold px-2 md:px-6 uppercase tracking-widest text-[8px] md:text-[9px] leading-tight ${textColors[index]} cursor-help`} style={{textShadow: '0 1px 3px rgba(255,255,255,1)'}}>
              {tIssue(crit.topic)} <br/> ({tStance(crit.stance)})
              <div className={`absolute left-1/2 -translate-x-1/2 w-56 p-3 bg-slate-900 text-white text-[11px] normal-case tracking-normal font-normal leading-relaxed rounded-md shadow-2xl opacity-0 invisible group-hover/venntooltip:opacity-100 group-hover/venntooltip:visible transition-all z-[100] pointer-events-none ${isHeaderBottom ? 'top-full mt-4' : 'bottom-full mb-4'}`} style={{textShadow: 'none'}}>
                {tIssueDefinition(crit.topic)}
                <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 transform rotate-45 ${isHeaderBottom ? '-top-1.5' : '-bottom-1.5'}`}></div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Render Nodes */}
      {Object.entries(regions).map(([sig, matchedPols]) => {
        const pos = getNodePosition(sig);
        
        // Map intersection signature to Primary/Secondary colors
        const getBorderColor = (signature: string) => {
          let checkSig = signature;
          if (lang === 'he' && numCircles === 3) {
            // Mirror signatures since indices 1 and 2 are swapped in Hebrew mode circles
            if (signature === '1') checkSig = '2';
            else if (signature === '2') checkSig = '1';
            else if (signature === '0,1') checkSig = '0,2';
            else if (signature === '0,2') checkSig = '0,1';
          } else if (lang === 'he' && numCircles === 2) {
            // Mirror signatures since indices 0 and 1 are swapped in Hebrew mode circles
            if (signature === '0') checkSig = '1';
            else if (signature === '1') checkSig = '0';
          }

          if (checkSig === '0') return 'border-[#006397]'; // Primary Blue
          if (checkSig === '1') return 'border-[#ba1a1a]'; // Primary Red
          if (checkSig === '2') return 'border-[#facc15]'; // Primary Yellow
          if (checkSig === '0,1') return 'border-[#6b21a8]'; // Secondary Purple (Blue+Red)
          if (checkSig === '0,2') return 'border-[#15803d]'; // Secondary Green (Blue+Yellow)
          if (checkSig === '1,2') return 'border-[#c2410c]'; // Secondary Orange (Red+Yellow)
          if (checkSig === '0,1,2') return 'border-white';   // White Center
          return 'border-white';
        };

        const borderColor = getBorderColor(sig);
        
        return matchedPols.map((pol, i) => {
          const isTriple = sig === '0,1,2';
          // Tighter spacing for the central intersection to prevent "bleeding" into bottom regions
          const spacingX = isTriple ? 32 : 42; 
          const spacingY = isTriple ? 32 : 48;
          
          // Force 2-columns for the triple intersection if there's more than 1 person
          // This keeps the cluster "square" rather than a tall line
          const cols = isTriple ? (matchedPols.length > 1 ? 2 : 1) : (matchedPols.length > 3 ? 2 : 1);
          const row = Math.floor(i / cols);
          const col = i % cols;
          
          const xOffset = (col - (cols - 1) / 2) * spacingX;
          const yOffset = (row - (Math.ceil(matchedPols.length / cols) - 1) / 2) * spacingY;
          
          return (
            <div 
              key={pol.id}
              className={`absolute group politician-face-btn transition-all ${
                activePoliticianId === pol.id ? 'z-50' : 'z-30 hover:z-50'
              }`}
              style={{
                top: `calc(${pos.top} + ${yOffset}px)`,
                left: `calc(${pos.left} + ${xOffset}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.button
                layoutId={`pol-${pol.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  const isMobile = window.innerWidth < 768;
                  if (isMobile) {
                    if (activePoliticianId === pol.id) {
                      window.location.hash = `#/profile/${pol.id}`;
                    } else {
                      setActivePoliticianId(pol.id);
                    }
                  } else {
                    window.location.hash = `#/profile/${pol.id}`;
                  }
                }}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 ${borderColor} shadow-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 hover:shadow-xl transition-all outline-none focus:outline-none`}
              >
                {pol.imageUrl ? (
                  <OptimizedImage 
                    src={pol.imageUrl} 
                    alt={tPolitician(pol.name)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">person</span>
                )}
              </motion.button>
              
              {/* Tooltip on hover/active */}
              <div 
                className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#162839] text-white text-[10px] font-black whitespace-nowrap px-3 py-2 rounded shadow-2xl transition-all duration-200 pointer-events-none z-50 uppercase tracking-widest border border-white/10 flex flex-col items-center gap-0.5 min-w-[80px] ${
                  activePoliticianId === pol.id 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95 md:group-hover:opacity-100 md:group-hover:scale-100'
                }`}
                dir={lang === 'he' ? 'rtl' : 'ltr'}
              >
                <span>{tPolitician(pol.name)}</span>
                <span className="text-[8px] text-secondary-container font-bold opacity-90">{tParty(pol.party)}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#162839]"></div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default VennEngine;
