import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Politician } from './data';

export interface Criterion {
  topic: string;
  stance: 'SUPPORT' | 'OPPOSE';
}

interface VennEngineProps {
  criteria: Criterion[];
  politicians: Politician[];
}

const VennEngine: React.FC<VennEngineProps> = ({ criteria, politicians }) => {
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
        <h3 className="font-headline text-2xl text-stone-400 font-medium italic">Synthesizing Matrix...</h3>
        <p className="text-stone-400 text-sm max-w-sm mt-2">Configure binary standpoints in the sidebar to generate a live visualization of political alignment.</p>
      </div>
    );
  }

  const numCircles = criteria.length;
  const colors = ['bg-secondary/30', 'bg-error/30', 'bg-amber-400/30'];
  const textColors = ['text-secondary', 'text-error', 'text-amber-700'];
  
  const getCircleStyles = (index: number) => {
    if (numCircles === 1) return { top: '20%', left: '20%', width: '60%', height: '60%' };
    if (numCircles === 2) {
      if (index === 0) return { top: '22%', left: '8%', width: '52%', height: '52%' };
      if (index === 1) return { top: '22%', left: '40%', width: '52%', height: '52%' };
    }
    if (numCircles === 3) {
      const size = '52%';
      if (index === 0) return { top: '8%', left: '24%', width: size, height: size }; // Top
      if (index === 1) return { top: '38%', left: '10%', width: size, height: size };  // Bottom Left
      if (index === 2) return { top: '38%', left: '38%', width: size, height: size }; // Bottom Right
    }
    return {};
  };

  const getNodePosition = (sig: string) => {
    if (numCircles === 1) {
      if (sig === '0') return { top: '50%', left: '50%' };
    }
    if (numCircles === 2) {
      // Centers are at (34, 48) and (66, 48)
      if (sig === '0') return { top: '48%', left: '26%' };    // Left crescent middle
      if (sig === '1') return { top: '48%', left: '74%' };    // Right crescent middle
      if (sig === '0,1') return { top: '48%', left: '50%' };  // Shared lens center
    }
    if (numCircles === 3) {
      /**
       * Geometric centers based on circle centers:
       * C0: (50, 34), C1: (36, 64), C2: (64, 64)
       */
      // Single regions (Outer regions furthest from other circles)
      if (sig === '0') return { top: '26%', left: '50%' };    // Top crescent center
      if (sig === '1') return { top: '72%', left: '25%' };    // Bottom-left crescent center
      if (sig === '2') return { top: '72%', left: '75%' };    // Bottom-right crescent center
      
      // Dual regions (Lens centers between circle pairs)
      if (sig === '0,1') return { top: '48%', left: '34%' };  // A+B intersection center
      if (sig === '0,2') return { top: '48%', left: '66%' };  // A+C intersection center
      if (sig === '1,2') return { top: '72%', left: '50%' };  // B+C intersection center
      
      // Triple region (Absolute center of the Reuleaux triangle)
      if (sig === '0,1,2') return { top: '56%', left: '50%' }; // Center of all three
    }
    return { top: '50%', left: '50%' };
  };

  return (
    <div className="relative w-full h-full min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Render Venn Circles */}
      {criteria.map((crit, index) => {
        const isBottom = numCircles === 3 && (index === 1 || index === 2);
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            key={index}
            className={`absolute rounded-full venn-circle overflow-hidden flex ${isBottom ? 'items-end pb-8' : 'items-start pt-6'} justify-center border-2 border-white/50 shadow-2xl ${colors[index]}`}
            style={{ ...getCircleStyles(index) }}
          >
            <div className={`text-center font-bold px-6 uppercase tracking-widest text-[9px] leading-tight ${textColors[index]}`} style={{textShadow: '0 1px 3px rgba(255,255,255,1)'}}>
              {crit.topic} <br/> ({crit.stance})
            </div>
          </motion.div>
        );
      })}

      {/* Render Nodes */}
      {Object.entries(regions).map(([sig, matchedPols]) => {
        const pos = getNodePosition(sig);
        
        // Map intersection signature to a specific identity color for borders
        const getBorderColor = (signature: string) => {
          if (signature === '0') return 'border-secondary';
          if (signature === '1') return 'border-error';
          if (signature === '2') return 'border-amber-500';
          if (signature === '0,1') return 'border-indigo-500';
          if (signature === '0,2') return 'border-teal-500';
          if (signature === '1,2') return 'border-orange-500';
          if (signature === '0,1,2') return 'border-slate-800';
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
            <a 
              key={pol.id}
              href={`#/profile/${pol.id}`}
              className="absolute z-30 group"
              style={{
                top: `calc(${pos.top} + ${yOffset}px)`,
                left: `calc(${pos.left} + ${xOffset}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                layoutId={`pol-${pol.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 ${borderColor} shadow-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 hover:shadow-xl transition-all`}
              >
                {pol.imageUrl ? (
                  <img src={pol.imageUrl} alt={pol.name} className="w-full h-full object-cover transition-all" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">person</span>
                )}
              </motion.div>
              
              {/* Tooltip on hover */}
              <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#162839] text-white text-[10px] font-black whitespace-nowrap px-3 py-2 rounded shadow-2xl transition-all duration-200 pointer-events-none z-50 uppercase tracking-widest border border-white/10 flex flex-col items-center gap-0.5 min-w-[80px]">
                <span>{pol.name}</span>
                <span className="text-[8px] text-secondary-container font-bold opacity-90">{pol.party}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#162839]"></div>
              </div>
            </a>
          );
        });
      })}
    </div>
  );
};

export default VennEngine;
