import React from 'react';
import { motion } from 'framer-motion';
import { MAJORITY_THRESHOLD, TOTAL_SEATS } from '../polls';

interface BlocMeterProps {
  blocData: Record<string, number>; // { "Netanyahu Bloc": 52, "Opposition Bloc": 68 }
}

const BLOC_COLORS: Record<string, string> = {
  "Netanyahu Bloc": "#2B4C7E",
  "Opposition Bloc": "#0d9488",
};

const BlocMeter: React.FC<BlocMeterProps> = ({ blocData }) => {
  return (
    <div className="space-y-8">
      {Object.entries(blocData).map(([blocName, seats]) => {
        const pct = (seats / TOTAL_SEATS) * 100;
        const majorityPct = (MAJORITY_THRESHOLD / TOTAL_SEATS) * 100;
        const hasMajority = seats >= MAJORITY_THRESHOLD;
        const color = BLOC_COLORS[blocName] || '#64748b';

        return (
          <div key={blocName}>
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="font-bold text-sm text-slate-700">{blocName}</h4>
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Newsreader'] text-3xl font-bold" style={{ color }}>{Math.round(seats * 10) / 10}</span>
                <span className="text-slate-400 text-xs font-bold">/ 120 seats</span>
              </div>
            </div>
            <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, pct)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
              {/* 61-seat majority marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${majorityPct}%` }}
              />
              <span 
                className="absolute top-full mt-1 text-[9px] text-red-500 font-bold -translate-x-1/2"
                style={{ left: `${majorityPct}%` }}
              >
                61
              </span>
            </div>
            {hasMajority && (
              <p className="text-xs text-green-600 font-bold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Majority achieved
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BlocMeter;
