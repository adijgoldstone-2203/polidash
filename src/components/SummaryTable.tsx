import React from 'react';
import { Poll, PARTY_COLORS } from '../polls';
import { useLanguage } from '../i18n';

interface SummaryTableProps {
  weightedAvg: Record<string, number>;
  latestPoll: Poll;
  simpleAvg: Record<string, number>;
  currentKnesset: Record<string, number>;
  trends: Record<string, 'up' | 'down' | 'stable'>;
  allParties: string[];
}


const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  if (trend === 'up') return <span className="text-green-500 font-bold text-sm">▲</span>;
  if (trend === 'down') return <span className="text-red-500 font-bold text-sm">▼</span>;
  return <span className="text-slate-400 font-bold text-sm">–</span>;
};

const SummaryTable: React.FC<SummaryTableProps> = ({
  weightedAvg, latestPoll, simpleAvg, currentKnesset, trends, allParties
}) => {
  const { t, tParty } = useLanguage();

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-start py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('polls.table.party')}</th>
              <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('polls.table.knesset')}</th>
              <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('polls.table.latest')}</th>
              <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('polls.table.avgPrediction')}</th>
              <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('polls.table.avg')}</th>
              <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('polls.table.trend')}</th>
            </tr>
          </thead>
          <tbody>
            {allParties
              .filter(party => (weightedAvg[party] || 0) > 0.5)
              .map((party, i) => {
                const knesset = currentKnesset[party] || 0;
                const latest = latestPoll.data[party] || 0;
                const avg = simpleAvg[party] || 0;
                const weighted = weightedAvg[party] || 0;
                const trend = trends[party] || 'stable';
                const partyColor = PARTY_COLORS[party] || '#94a3b8';

                return (
                  <tr key={party} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: partyColor }} />
                        <span className="font-bold text-slate-800 text-sm">{tParty(party)}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">{knesset || '—'}</td>
                    <td className="text-center py-3 px-4 font-medium text-slate-700">{latest || '—'}</td>
                    <td className="text-center py-3 px-4 text-slate-600">{avg || '—'}</td>
                    <td className="text-center py-3 px-4">
                      <span className="font-bold text-slate-800 text-[15px]">
                        {weighted}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <TrendIcon trend={trend} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Trend Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-4 h-4 rounded bg-red-100 border border-red-300 text-center text-red-500 font-bold text-[10px] leading-4">▼</span>
          {t('shared.downTrend')}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-4 h-4 rounded bg-slate-100 border border-slate-300 text-center text-slate-400 font-bold text-[10px] leading-4">–</span>
          {t('shared.noChange')}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-4 h-4 rounded bg-green-100 border border-green-300 text-center text-green-500 font-bold text-[10px] leading-4">▲</span>
          {t('shared.upTrend')}
        </div>
      </div>
    </div>
  );
};

export default SummaryTable;
