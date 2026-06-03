import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, ReferenceArea } from 'recharts';
import { PARTY_COLORS } from '../polls';
import { useLanguage } from '../i18n';
import { politicians } from '../data';

interface TrendChartProps {
  data: Record<string, string | number>[];
  visibleParties: Set<string>;
  onToggleParty: (party: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
  allParties: string[];
  animationKey?: string;
}

const CustomDot = (props: any) => {
  const { cx, cy, payload, value, r, fill, stroke, strokeWidth, dataKey, onMouseEnter, onMouseLeave, partyColor } = props;
  if (!cx || !cy || value == null) return null;

  const match = dataKey.match(/raw_(\d+)_(.*)/);
  if (!match) return null;
  const pollIndex = parseInt(match[1]);
  const partyName = match[2];
  const pollObj = payload.pollsOnDate?.[pollIndex];
  if (!pollObj) return null;

  return (
    <g 
      className="cursor-pointer group"
      onMouseEnter={() => onMouseEnter({ poll: pollObj, party: partyName })}
      onMouseLeave={() => onMouseLeave()}
    >
      <circle 
        cx={cx} 
        cy={cy} 
        r={r || 3.5} 
        fill={partyColor || fill || '#94a3b8'} 
        stroke={stroke || 'white'} 
        strokeWidth={strokeWidth || 1}
        fillOpacity={0.65}
        className="transition-all group-hover:opacity-100"
      />
      {/* Invisible larger circle for capturing hover events more easily */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={10} 
        fill="transparent" 
        stroke="transparent"
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label, hoveredPoint, visibleParties, isDragging, showTooltip }: any) => {
  const { t, tParty, tPollSource, lang } = useLanguage();

  if (isDragging || (showTooltip !== undefined && !showTooltip) || !active || !payload?.length) return null;

  if (hoveredPoint) {
    const { poll, party } = hoveredPoint;
    
    // Get all visible parties sorted by their seats in this specific poll
    const targetParties = Array.from(visibleParties as Set<string>)
      .sort((a, b) => (poll.data[b] || 0) - (poll.data[a] || 0));

    // Fallback/Ensure hovered party itself is in the list
    if (!targetParties.includes(party)) {
      targetParties.push(party);
    }

    return (
      <div className="bg-[#162839] text-white px-4 py-3 rounded-lg shadow-2xl text-xs min-w-[200px] z-[200]" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <p className="font-bold text-[11px] uppercase tracking-widest text-slate-400 mb-3">{poll.date || label}</p>
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-300 border-b border-slate-600 pb-1 mb-2">{tPollSource(poll.source)}</p>
          <div className="space-y-1.5">
            {targetParties.map(p => (
              <div key={p} className="flex justify-between items-center gap-6">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full border border-white/20" style={{ backgroundColor: PARTY_COLORS[p] || '#94a3b8' }} />
                   <span className="font-medium text-white">{tParty(p)}</span>
                 </div>
                 <span className="font-bold font-mono text-white">{poll.data[p] !== undefined ? poll.data[p] : 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pData = payload[0]?.payload;
  const source = pData?.source || '';
  const rawSource = pData?.rawSource || source;
  const displayDate = pData?.displayDate || label;
  
  const isRunningAvg = source.startsWith('Running Avg') || source === 'PoliDash Average';

  // Get all visible parties sorted by their seats on this date
  const visiblePartyItems = Array.from(visibleParties as Set<string>)
    .map(partyName => {
      const val = pData?.[partyName];
      return {
        name: partyName,
        value: (val === null || val === undefined) ? 0 : val,
        color: PARTY_COLORS[partyName] || '#94a3b8'
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-[#162839] text-white px-4 py-3 rounded-lg shadow-2xl text-xs min-w-[200px]" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <p className="font-bold text-[11px] uppercase tracking-widest text-slate-400 mb-3">{displayDate}</p>

      {isRunningAvg ? (
        <>
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-300 border-b border-slate-600 pb-1 mb-2">{t('shared.weightedAvg')}</p>
            <div className="space-y-1.5">
              {visiblePartyItems.map((p: any) => (
                <div key={`avg-${p.name}`} className="flex justify-between items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full border border-white/20" style={{ backgroundColor: p.color }} />
                    <span className="font-medium text-white drop-shadow-sm">{tParty(p.name)}</span>
                  </div>
                  <span className="font-bold font-mono text-white">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <p className="text-[10px] font-bold text-slate-300 border-b border-slate-600 pb-1 mb-2">{tPollSource(rawSource)}</p>
          <div className="space-y-1.5">
            {visiblePartyItems.map((p: any) => (
              <div key={p.name} className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full border border-white/20" style={{ backgroundColor: p.color }} />
                  <span className="font-medium text-white">{tParty(p.name)}</span>
                </div>
                <span className="font-bold font-mono">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

const TrendChart: React.FC<TrendChartProps> = ({ data, visibleParties, onToggleParty, onClearAll, onSelectAll, allParties, animationKey }) => {
  const { t, tParty, tPolitician, dateLocale, lang } = useLanguage();
  const [showPoints, setShowPoints] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);
  const [hoveredPoint, setHoveredPoint] = React.useState<{ poll: any, party: string } | null>(null);

  // Calculate the maximum number of polls on a single date dynamically
  const maxPollsPerDate = React.useMemo(() => {
    let max = 0;
    data.forEach((d: any) => {
      if (d.pollsOnDate && d.pollsOnDate.length > max) {
        max = d.pollsOnDate.length;
      }
    });
    return max;
  }, [data]);

  // States for Click-and-Drag 2D Zoom
  const [refAreaLeft, setRefAreaLeft] = React.useState<any>(null);
  const [refAreaRight, setRefAreaRight] = React.useState<any>(null);
  const [refAreaTop, setRefAreaTop] = React.useState<number | null>(null);
  const [refAreaBottom, setRefAreaBottom] = React.useState<number | null>(null);
  const [left, setLeft] = React.useState<any>('dataMin');
  const [right, setRight] = React.useState<any>('dataMax');
  const [top, setTop] = React.useState<any>(40);
  const [bottom, setBottom] = React.useState<any>(0);

  const getXValue = (e: any) => {
    if (!e) return null;
    if (e.activeLabel) return e.activeLabel;
    if (e.activePayload && e.activePayload.length > 0) {
      return e.activePayload[0].payload?.timestamp;
    }
    return null;
  };

  const getYValue = (chartY: number) => {
    // Chart total height is 450px.
    // Margin top is 20px. Margin bottom is 10px. XAxis height is 60px.
    // Chart area Y range: from 20px to 380px.
    const topLimit = 20;
    const bottomLimit = 380;
    const height = bottomLimit - topLimit; // 360
    
    // Clamp chartY between topLimit and bottomLimit
    const clampedY = Math.max(topLimit, Math.min(bottomLimit, chartY));
    
    const currentBottom = typeof bottom === 'number' ? bottom : 0;
    const currentTop = typeof top === 'number' ? top : 40;
    
    const fraction = (clampedY - topLimit) / height; // 0 at top, 1 at bottom
    const yVal = currentTop - fraction * (currentTop - currentBottom);
    return Math.round(yVal * 10) / 10;
  };

  const zoom = () => {
    let [refLeft, refRight] = [refAreaLeft, refAreaRight];
    let [refTop, refBottom] = [refAreaTop, refAreaBottom];

    if (!refLeft || !refRight || refLeft === refRight) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      setRefAreaTop(null);
      setRefAreaBottom(null);
      return;
    }

    // xAxis zoom bounds
    if (refLeft > refRight) [refLeft, refRight] = [refRight, refLeft];

    // yAxis zoom bounds
    if (refTop !== null && refBottom !== null) {
      if (refBottom > refTop) [refBottom, refTop] = [refTop, refBottom];
      // Set domain with some minimum range to prevent collapsing
      if (refTop - refBottom < 1) {
        refTop = refBottom + 1;
      }
      setTop(Math.min(120, refTop));
      setBottom(Math.max(0, refBottom));
    }

    setLeft(refLeft);
    setRight(refRight);
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setRefAreaTop(null);
    setRefAreaBottom(null);
  };

  const zoomOut = React.useCallback(() => {
    setLeft('dataMin');
    setRight('dataMax');
    setTop(40);
    setBottom(0);
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setRefAreaTop(null);
    setRefAreaBottom(null);
  }, []);

  React.useEffect(() => {
    zoomOut();
  }, [data, animationKey, zoomOut]);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
  };

  const isZoomed = left !== 'dataMin' || right !== 'dataMax' || top !== 40 || bottom !== 0;

  return (
    <div className="w-full h-full flex flex-col" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap justify-end items-center gap-4 md:gap-6 mb-4">
        {isZoomed && (
          <button
            onClick={zoomOut}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary bg-primary text-white hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔍</span> {t('polls.trend.zoomOut')}
          </button>
        )}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <input 
            type="checkbox" 
            checked={showPoints} 
            onChange={(e) => setShowPoints(e.target.checked)}
            className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
          />
          {t('polls.trend.showPoints')}
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <input 
            type="checkbox" 
            checked={showTooltip} 
            onChange={(e) => setShowTooltip(e.target.checked)}
            className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
          />
          {t('polls.trend.enableTooltips')}
        </label>
        {visibleParties.size > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-transparent text-slate-400 hover:text-slate-700 transition-colors underline decoration-dashed underline-offset-4"
          >
            {t('polls.trend.reset')}
          </button>
        )}
      </div>
      <div 
        className="w-full h-[450px] select-none" 
        onMouseUp={zoom}
        onDragStart={(e) => e.preventDefault()}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            key={animationKey} 
            data={data} 
            margin={{ top: 20, right: 40, left: 0, bottom: 10 }}
            onMouseDown={(e: any) => {
              const x = getXValue(e);
              const y = e ? (e.chartY !== undefined ? e.chartY : (e.activeCoordinate ? e.activeCoordinate.y : undefined)) : undefined;
              if (x && y !== undefined) {
                setRefAreaLeft(x);
                setRefAreaTop(getYValue(y));
              }
            }}
            onMouseMove={(e: any) => {
              if (refAreaLeft) {
                const x = getXValue(e);
                const y = e ? (e.chartY !== undefined ? e.chartY : (e.activeCoordinate ? e.activeCoordinate.y : undefined)) : undefined;
                if (x && y !== undefined) {
                  setRefAreaRight(x);
                  setRefAreaBottom(getYValue(y));
                }
              }
            }}
            onMouseUp={zoom}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={[left, right]}
              padding={{ left: 20, right: 20 }}
              allowDataOverflow={true}
              tickFormatter={formatDate} 
              tick={{ fontSize: 10, fill: '#94a3b8', angle: -45, textAnchor: 'end', dy: 10 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              minTickGap={60}
              height={60}
            />
            <YAxis 
              domain={[bottom, top]} 
              allowDataOverflow={isZoomed}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip showPoints={showPoints} hoveredPoint={hoveredPoint} visibleParties={visibleParties} isDragging={!!refAreaLeft} showTooltip={showTooltip} />} cursor={refAreaLeft || !showTooltip ? false : { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1} label={{ value: `${t('shared.threshold')} (4)`, position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }} />
            
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea 
                x1={refAreaLeft} 
                x2={refAreaRight} 
                y1={refAreaTop !== null ? refAreaTop : undefined} 
                y2={refAreaBottom !== null ? refAreaBottom : undefined} 
                strokeOpacity={0.3} 
                fill="#94a3b8" 
                fillOpacity={0.3} 
              />
            ) : null}
            {allParties.flatMap(party => {
              if (!visibleParties.has(party)) return [];
              const partyColor = PARTY_COLORS[party] || '#94a3b8';
              
              const lines = [
                <Line
                  key={`avg_${party}`}
                  type="monotone"
                  dataKey={party}
                  stroke={partyColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              ];

              if (showPoints) {
                Array.from({ length: maxPollsPerDate }).forEach((_, i) => {
                  lines.push(
                    <Line
                      key={`raw_${i}_${party}`}
                      type="monotone"
                      dataKey={`raw_${i}_${party}`}
                      stroke="none"
                      dot={<CustomDot 
                        partyColor={partyColor}
                        onMouseEnter={(point: any) => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                  );
                });
              }
              
              return lines;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Party Toggle Pills */}
      <div className="flex flex-wrap gap-2 mt-6 justify-center items-center">
        {allParties.map(party => {
          const isVisible = visibleParties.has(party);
          const color = PARTY_COLORS[party] || '#94a3b8';
          return (
            <button
              key={party}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('.leader-tooltip')) {
                  return;
                }
                onToggleParty(party);
              }}
              className={`group relative px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 transition-all duration-200 ${
                isVisible
                  ? 'text-white shadow-sm'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
              }`}
              style={isVisible ? { backgroundColor: color, borderColor: color } : {}}
            >
              {tParty(party)}

              {/* Hover Tooltip Card */}
              {(() => {
                const leaderId = getPartyLeaderId(party);
                const leader = leaderId ? politicians.find(p => p.id === leaderId) : null;
                if (!leader) return null;

                return (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.hash = `#/profile/${leader.id}`;
                    }}
                    className="leader-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white/95 backdrop-blur-sm border border-stone-200 shadow-xl rounded-xl p-3 flex items-center gap-3 text-start pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 scale-95 opacity-0 transition-all duration-200 delay-0 group-hover:delay-[1000ms] z-50 normal-case cursor-pointer hover:border-secondary text-slate-800 before:absolute before:content-[''] before:w-full before:h-3 before:top-full before:left-0"
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
        <button
          onClick={onSelectAll}
          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-transparent text-slate-400 hover:text-slate-700 transition-colors underline decoration-dashed underline-offset-4 ml-2 cursor-pointer"
        >
          {t('polls.trend.selectAll')}
        </button>
        {visibleParties.size > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-transparent text-slate-400 hover:text-slate-700 transition-colors underline decoration-dashed underline-offset-4 ml-2 cursor-pointer"
          >
            {t('polls.trend.reset')}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrendChart;
