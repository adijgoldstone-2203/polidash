import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';

import { PARTY_COLORS } from '../polls';

interface ParliamentChartProps {
  totalSeats: number;
  coalitionSeats: number;
  parties: { name: string; seats: number; isSelected: boolean }[];
}

const ParliamentChart: React.FC<ParliamentChartProps> = ({ totalSeats, parties }) => {
  const { t } = useLanguage();
  const dotsPerRow = 20; 
  const rows = Math.ceil(totalSeats / dotsPerRow); 
  
  const radiusX = 400; 
  const radiusY = 280; 
  const centerX = 450;
  const centerY = 350;
  
  const seatMap: { party: string; isSelected: boolean }[] = [];
  
  const coalitionParties = parties.filter(p => p.isSelected);
  const oppositionParties = parties.filter(p => !p.isSelected);

  coalitionParties.forEach(p => {
    for (let i = 0; i < p.seats; i++) seatMap.push({ party: p.name, isSelected: true });
  });
  
  oppositionParties.forEach(p => {
    for (let i = 0; i < p.seats; i++) seatMap.push({ party: p.name, isSelected: false });
  });

  while(seatMap.length < totalSeats) seatMap.push({ party: "Default", isSelected: false });

  return (
    <div className="relative w-full flex justify-center overflow-visible px-12">
      <svg viewBox="0 0 900 400" className="w-full max-w-[650px] h-auto overflow-visible">
        <g>
          {seatMap.map((seat, i) => {
            const colIndex = Math.floor(i / rows);
            const rowIndex = i % rows;
            
            const rowRadiusX = radiusX - (rowIndex * 22);
            const rowRadiusY = radiusY - (rowIndex * 22);
            
            const angleStep = Math.PI / (dotsPerRow - 1);
            const angle = Math.PI + (colIndex * angleStep);
            
            const x = centerX + rowRadiusX * Math.cos(angle);
            const y = centerY + rowRadiusY * Math.sin(angle);

            return (
              <motion.circle
                key={i}
                initial={false}
                animate={{ 
                  cx: x, 
                  cy: y, 
                  fill: seat.isSelected ? (PARTY_COLORS[seat.party] || PARTY_COLORS.Default) : "#E0E0E0",
                  r: seat.isSelected ? 7 : 4.5,
                  opacity: seat.isSelected ? 1 : 0.4
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            );
          })}
        </g>
        
        <line x1="450" y1="350" x2="450" y2="40" stroke="#162839" strokeWidth="1.5" strokeDasharray="6 6" className="opacity-20" />
        {/* Darker text for the majority threshold */}
        <text x="450" y="30" textAnchor="middle" className="text-[12px] font-bold uppercase fill-primary opacity-80 tracking-widest">{t('shared.majorityThreshold')}</text>
      </svg>
    </div>
  );
};

export default ParliamentChart;
