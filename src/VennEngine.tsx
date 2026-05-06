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

  // Define layout logic
  const numCircles = criteria.length;
  const colors = ['bg-secondary/40', 'bg-error/40'];
  const textColors = ['text-secondary', 'text-error'];
  
  const getCircleStyles = (index: number) => {
    if (numCircles === 1) return { top: '20%', left: '20%', width: '60%', height: '60%' };
    if (numCircles === 2) {
      if (index === 0) return { top: '22%', left: '8%', width: '52%', height: '52%' };
      if (index === 1) return { top: '22%', left: '40%', width: '52%', height: '52%' };
    }
  };

  const getNodePosition = (sig: string) => {
    // Return x, y percentages for absolute positioning of nodes within the Venn container
    if (numCircles === 1) {
      if (sig === '0') return { top: '50%', left: '50%' };
    }
    if (numCircles === 2) {
      if (sig === '0') return { top: '48%', left: '28%' };
      if (sig === '1') return { top: '48%', left: '72%' };
      if (sig === '0,1') return { top: '48%', left: '50%' };
    }
    return { top: '50%', left: '50%' };
  };

  return (
    <div className="relative w-full h-full min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Render Venn Circles */}
      {criteria.map((crit, index) => (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          key={index}
          className={`absolute rounded-full venn-circle overflow-hidden flex items-start justify-center pt-8 border-4 border-white shadow-xl ${colors[index]}`}
          style={{ ...getCircleStyles(index) }}
        >
          <div className={`text-center font-bold px-4 pt-12 uppercase tracking-widest text-[11px] ${textColors[index]}`} style={{textShadow: '0 1px 3px rgba(255,255,255,0.8)'}}>
            {crit.topic} <br/> ({crit.stance})
          </div>
        </motion.div>
      ))}

      {/* Render Nodes */}
      {Object.entries(regions).map(([sig, matchedPols]) => {
        const pos = getNodePosition(sig);
        
        // Arrange items dynamically around the central coordinate to avoid overlap
        // Using a hexagonal grid layout for each region
        return matchedPols.map((pol, i) => {
          const spacing = 45; // pixels
          const cols = Math.ceil(Math.sqrt(matchedPols.length));
          const row = Math.floor(i / cols);
          const col = i % cols;
          
          const xOffset = (col - (cols - 1) / 2) * spacing;
          const yOffset = (row - (Math.ceil(matchedPols.length / cols) - 1) / 2) * spacing;
          
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
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-md bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110 hover:shadow-xl transition-all"
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
