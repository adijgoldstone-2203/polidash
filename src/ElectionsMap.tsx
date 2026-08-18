import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useLanguage } from './i18n';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts';

// Party metadata containing names and colors
const PARTY_METADATA: Record<string, { nameEn: string, nameHe: string, color: string }> = {
  "Likud": { nameEn: "Likud", nameHe: "הליכוד", color: "#1C5BAD" },
  "Yesh Atid": { nameEn: "Yesh Atid", nameHe: "יש עתיד", color: "#69D1E5" },
  "Shas": { nameEn: "Shas", nameHe: "ש\"ס", color: "#A88461" },
  "National Unity": { nameEn: "National Unity", nameHe: "המחנה הממלכתי", color: "#49536B" },
  "Blue & White": { nameEn: "Blue & White", nameHe: "כחול לבן", color: "#49536B" },
  "Religious Zionism": { nameEn: "Religious Zionism", nameHe: "הציונות הדתית", color: "#B51D78" },
  "United Torah Judaism": { nameEn: "United Torah Judaism", nameHe: "יהדות התורה", color: "#8E9AAF" },
  "Yisrael Beiteinu": { nameEn: "Yisrael Beiteinu", nameHe: "ישראל ביתנו", color: "#6079FC" },
  "Hadash-Ta'al": { nameEn: "Hadash-Ta'al", nameHe: "חד\"ש תע\"ל", color: "#FF8E3C" },
  "Joint List": { nameEn: "Joint List", nameHe: "הרשימה המשותפת", color: "#FF8E3C" },
  "Ra'am": { nameEn: "Ra'am", nameHe: "רע\"ם", color: "#58C879" },
  "Labor": { nameEn: "Labor", nameHe: "העבודה", color: "#FC6B60" },
  "Labor-Gesher-Meretz": { nameEn: "Labor-Gesher-Meretz", nameHe: "העבודה-גשר-מרצ", color: "#FC6B60" },
  "Labor-Gesher": { nameEn: "Labor-Gesher", nameHe: "העבודה-גשר", color: "#FC6B60" },
  "Meretz": { nameEn: "Meretz", nameHe: "מרצ", color: "#FC60C3" },
  "Democratic Union": { nameEn: "Democratic Union", nameHe: "המחנה הדמוקרטי", color: "#FC60C3" },
  "Balad": { nameEn: "Balad", nameHe: "בל\"ד", color: "#E57373" },
  "Yamina": { nameEn: "Yamina", nameHe: "ימינה", color: "#B24FFC" },
  "Jewish Home": { nameEn: "Jewish Home", nameHe: "הבית היהודי", color: "#B24FFC" },
  "New Hope": { nameEn: "New Hope", nameHe: "תקווה חדשה", color: "#009688" },
  "Other": { nameEn: "Other Parties", nameHe: "מפלגות אחרות", color: "#6C7CA5" }
};

const SOCIO_PARTY_MAP: Record<string, string> = {
  "Likud": "Likud",
  "Yesh Atid": "Yesh Atid",
  "Shas": "Shas",
  "Hatziyonut Hadatit": "Religious Zionism",
  "Hamahane HaMamlachti": "National Unity",
  "Kachol Lavan": "Blue & White",
  "Yehadut Hatora": "United Torah Judaism",
  "Yisrael Beitenu": "Yisrael Beiteinu",
  "Raam": "Ra'am",
  "Hadash Taal": "Hadash-Ta'al",
  "Meshutefet": "Joint List",
  "Tikva": "New Hope",
  "HaAvoda": "Labor",
  "Avoda": "Labor",
  "Meretz": "Meretz",
  "Balad": "Balad",
  "Yamina": "Yamina",
  "Habait Hayehudi": "Jewish Home"
};

// Bechirot.gov.il official data sources
const BECHIROT_SOURCES: Record<string, { labelEn: string, labelHe: string, url: string }> = {
  "25": {
    labelEn: "25th Knesset (Nov 2022) City Results",
    labelHe: "תוצאות הבחירות לכנסת ה-25 לפי יישובים",
    url: "https://votes25.bechirot.gov.il/cityresults"
  },
  "24": {
    labelEn: "24th Knesset (Mar 2021) City Results",
    labelHe: "תוצאות הבחירות לכנסת ה-24 לפי יישובים",
    url: "https://votes24.bechirot.gov.il/cityresults"
  },
  "23": {
    labelEn: "23rd Knesset (Mar 2020) City Results",
    labelHe: "תוצאות הבחירות לכנסת ה-23 לפי יישובים",
    url: "https://votes23.bechirot.gov.il/cityresults"
  },
  "22": {
    labelEn: "22nd Knesset (Sep 2019) Results",
    labelHe: "תוצאות הבחירות לכנסת ה-22",
    url: "https://votes22.bechirot.gov.il/"
  }
};

interface TownData {
  name: string;
  bzb: number;
  voters: number;
  valid: number;
  turnout: number;
  winner: string;
  results: Record<string, number>;
}

interface KnessetData {
  knesset: string;
  bzb: number;
  voters: number;
  valid: number;
  turnout: number;
  results: Record<string, number>;
  towns: Record<string, TownData>;
}

export default function ElectionsMap() {
  const { lang, t } = useLanguage();
  const isHe = lang === 'he';
  const dir = isHe ? 'rtl' : 'ltr';

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);
  const hasFittedBoundsRef = useRef<boolean>(false);

  const [electionsData, setElectionsData] = useState<Record<string, KnessetData> | null>(null);
  const [selectedKnesset, setSelectedKnesset] = useState<string>("25");
  const [selectedTownId, setSelectedTownId] = useState<string | null>(null);
  const [geojson, setGeojson] = useState<any | null>(null);
  const [townTranslations, setTownTranslations] = useState<Record<string, { en: string, he: string }> | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string, name: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Socioeconomic chart data
  const [socioData, setSocioData] = useState<any[]>([]);
  const [socioKnesset, setSocioKnesset] = useState<string>("k25");
  const [selectedSocioParty, setSelectedSocioParty] = useState<string>("Turnout");

  // Load datasets
  useEffect(() => {
    fetch('/elections_summary.json')
      .then(res => res.json())
      .then(data => setElectionsData(data))
      .catch(err => console.error("Failed to load elections summary data:", err));

    fetch('/israel_towns.geojson')
      .then(res => res.json())
      .then(data => setGeojson(data))
      .catch(err => console.error("Failed to load GeoJSON map data:", err));

    fetch('/town_translations.json')
      .then(res => res.json())
      .then(data => setTownTranslations(data))
      .catch(err => console.error("Failed to load town translations:", err));

    fetch('/socioeconomic_data.json')
      .then(res => res.json())
      .then(data => setSocioData(data))
      .catch(err => console.error("Failed to load socioeconomic data:", err));
  }, []);

  const getTownName = (semel: string, fallbackName: string) => {
    if (townTranslations && townTranslations[semel]) {
      return isHe ? townTranslations[semel].he : townTranslations[semel].en;
    }
    return fallbackName;
  };

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapRef.current || !geojson || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#f8fafc'
            }
          }
        ]
      },
      center: [35.0, 31.5],
      zoom: 7.2,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    hoverPopupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12
    });

    map.on('load', () => {
      // Add GeoJSON data source
      map.addSource('yishuvim_geojson_source', {
        type: 'geojson',
        data: geojson
      });

      // Layer 1: Country territory background shape (neutral fill behind all towns)
      map.addLayer({
        id: 'israel-country-bg',
        type: 'fill',
        source: 'yishuvim_geojson_source',
        filter: ['==', ['get', 'is_country_outline'], true],
        paint: {
          'fill-color': '#E2E8F0',
          'fill-opacity': 0.6
        }
      });

      // Layer 2: Town winning party fill layer
      map.addLayer({
        id: 'yishuvim-layer',
        type: 'fill',
        source: 'yishuvim_geojson_source',
        filter: ['!=', ['get', 'is_country_outline'], true],
        paint: {
          'fill-color': '#CCCCCC',
          'fill-opacity': 0.95
        }
      });

      // Layer 3: Town boundary line layer (subtle white borders separating towns)
      map.addLayer({
        id: 'yishuvim-borders',
        type: 'line',
        source: 'yishuvim_geojson_source',
        filter: ['!=', ['get', 'is_country_outline'], true],
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.5,
          'line-opacity': 0.7
        }
      });

      // Layer 4: Country outer perimeter border layer (single bold line around the outside of the map)
      map.addLayer({
        id: 'israel-country-border',
        type: 'line',
        source: 'yishuvim_geojson_source',
        filter: ['==', ['get', 'is_country_outline'], true],
        paint: {
          'line-color': '#0f172a',
          'line-width': 2.2,
          'line-opacity': 0.95
        }
      });

      // Layer 5: Hover highlight border
      map.addLayer({
        id: 'yishuvim-hover',
        type: 'line',
        source: 'yishuvim_geojson_source',
        paint: {
          'line-color': '#000000',
          'line-width': 2.5
        },
        filter: ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']
      });

      // Layer 6: Selected town highlight border
      map.addLayer({
        id: 'yishuvim-selected',
        type: 'line',
        source: 'yishuvim_geojson_source',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 3.2
        },
        filter: ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']
      });

      // Mouse events
      map.on('mousemove', 'yishuvim-layer', handleMouseMove);
      map.on('mouseleave', 'yishuvim-layer', handleMouseLeave);
      map.on('click', 'yishuvim-layer', handleMapClick);

      // Fit bounds to country view
      if (!hasFittedBoundsRef.current) {
        map.fitBounds([[34.15, 29.45], [35.9, 33.35]], {
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
          animate: false
        });
        hasFittedBoundsRef.current = true;
      }

      // Initial color painting
      if (electionsData) {
        colorMapPolygons(selectedKnesset);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [geojson]);

  // Update map colors when selected Knesset round changes
  useEffect(() => {
    if (mapInstanceRef.current && electionsData) {
      colorMapPolygons(selectedKnesset);
    }
  }, [selectedKnesset, electionsData]);

  const colorMapPolygons = (knesset: string) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    const knessetSummary = electionsData[knesset];
    if (!knessetSummary) return;

    const expression: any[] = [
      'match',
      ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'SEMEL_MUN'], ['get', 'semel_yishuv'], ['get', 'semel_mun'], 0]
    ];

    // Judea & Samaria regional background fill (#E2E8F0)
    expression.push(99999, '#E2E8F0');
    // Country outline feature 88888 (transparent fill)
    expression.push(88888, 'rgba(0,0,0,0)');

    Object.entries(knessetSummary.towns).forEach(([code, town]) => {
      const winner = town.winner;
      const color = PARTY_METADATA[winner]?.color || PARTY_METADATA["Other"].color;
      if (parseInt(code)) {
        expression.push(parseInt(code), color);
      }
    });

    expression.push('#CBD5E1');

    if (map.getLayer('yishuvim-layer')) {
      map.setPaintProperty('yishuvim-layer', 'fill-color', expression);
    }
  };

  // Feature selection helper (prioritizes town features with election results)
  const getPriorityFeature = (features: any[]) => {
    const valid = (features || []).filter((f: any) => {
      const code = (f.properties.SEMEL_YISHUV ?? f.properties.SEMEL_MUN ?? f.properties.semel_yishuv ?? f.properties.semel_mun);
      return code !== 88888 && code !== '88888' && !f.properties.is_country_outline;
    });

    if (valid.length === 0) return null;

    const getBboxArea = (feat: any) => {
      try {
        const coords = feat.geometry.coordinates.flat(3);
        let minX = 180, maxX = -180, minY = 90, maxY = -90;
        for (let i = 0; i < coords.length; i += 2) {
          const x = coords[i];
          const y = coords[i + 1];
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
        return (maxX - minX) * (maxY - minY);
      } catch (e) {
        return 999;
      }
    };

    valid.sort((a: any, b: any) => {
      const codeA = (a.properties.SEMEL_YISHUV ?? a.properties.SEMEL_MUN ?? a.properties.semel_yishuv ?? a.properties.semel_mun)?.toString();
      const codeB = (b.properties.SEMEL_YISHUV ?? b.properties.SEMEL_MUN ?? b.properties.semel_yishuv ?? b.properties.semel_mun)?.toString();

      const hasDataA = codeA && electionsData && electionsData[selectedKnesset]?.towns[codeA] ? 1 : 0;
      const hasDataB = codeB && electionsData && electionsData[selectedKnesset]?.towns[codeB] ? 1 : 0;

      if (hasDataA !== hasDataB) {
        return hasDataB - hasDataA;
      }

      return getBboxArea(a) - getBboxArea(b);
    });

    return valid[0];
  };

  const handleMouseMove = (e: any) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    const feature = getPriorityFeature(e.features);

    if (!feature) {
      handleMouseLeave();
      return;
    }

    map.getCanvas().style.cursor = 'pointer';

    const semel = (
      feature.properties.SEMEL_YISHUV ?? 
      feature.properties.SEMEL_MUN ?? 
      feature.properties.semel_yishuv ?? 
      feature.properties.semel_mun
    )?.toString();

    if (!semel) return;

    const townInfo = electionsData[selectedKnesset]?.towns[semel];
    const fallbackName = townInfo ? townInfo.name : (feature.properties.SHEM_YISHUV ?? feature.properties.shem_yishuv ?? "Unknown");
    const townName = getTownName(semel, fallbackName);

    if (map.getLayer('yishuvim-hover')) {
      map.setFilter('yishuvim-hover', [
        '==', 
        ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'SEMEL_MUN'], ['get', 'semel_yishuv'], ['get', 'semel_mun']], 
        parseInt(semel) || 0
      ]);
    }

    const turnoutText = townInfo ? `${townInfo.turnout}%` : t('map.noData');
    const winningPartyName = townInfo 
      ? (isHe ? PARTY_METADATA[townInfo.winner]?.nameHe : PARTY_METADATA[townInfo.winner]?.nameEn)
      : null;

    let html = `
      <div style="direction: ${dir}; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-family: sans-serif; padding: 2px;">
        <h4 style="margin: 0 0 6px 0; font-weight: 800; font-size: 14px; color: #0f172a;">${townName}</h4>
        <p style="margin: 0 0 4px 0; font-size: 12px; opacity: 0.85;">
          <strong>${t('map.voterTurnout')}:</strong> ${turnoutText}
        </p>
    `;
    if (winningPartyName) {
      html += `
        <p style="margin: 0; font-size: 12px; opacity: 0.85;">
          <strong>${t('map.winningParty')}:</strong> 
          <span style="color: ${PARTY_METADATA[townInfo!.winner]?.color}; font-weight: bold;">
            ${winningPartyName}
          </span>
        </p>
      `;
    }
    html += `</div>`;

    if (hoverPopupRef.current) {
      hoverPopupRef.current
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
    }
  };

  const handleMouseLeave = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.getCanvas().style.cursor = '';
    
    if (map.getLayer('yishuvim-hover')) {
      map.setFilter('yishuvim-hover', [
        '==', 
        ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'SEMEL_MUN'], ['get', 'semel_yishuv'], ['get', 'semel_mun']], 
        0
      ]);
    }

    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
    }
  };

  const handleMapClick = (e: any) => {
    const feature = getPriorityFeature(e.features);

    if (feature) {
      const semel = (
        feature.properties.SEMEL_YISHUV ?? 
        feature.properties.SEMEL_MUN ?? 
        feature.properties.semel_yishuv ?? 
        feature.properties.semel_mun
      )?.toString();

      if (semel) {
        selectAndFocusTown(semel, e.lngLat);
      }
    }
  };

  const selectAndFocusTown = (semel: string, lngLat?: maplibregl.LngLatLike) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    setSelectedTownId(semel);

    if (map.getLayer('yishuvim-selected')) {
      map.setFilter('yishuvim-selected', [
        '==', 
        ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'SEMEL_MUN'], ['get', 'semel_yishuv'], ['get', 'semel_mun']], 
        parseInt(semel) || 0
      ]);
    }

    if (lngLat) {
      map.easeTo({
        center: lngLat,
        zoom: Math.max(map.getZoom(), 9.5)
      });
    }
  };

  const handleReset = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setSelectedTownId(null);
    setSearchQuery("");
    
    if (map.getLayer('yishuvim-selected')) {
      map.setFilter('yishuvim-selected', ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']);
    }

    map.fitBounds([[34.15, 29.45], [35.9, 33.35]], {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      animate: true
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!electionsData || val.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const knessetTowns = electionsData[selectedKnesset]?.towns || {};
    const matches = Object.entries(knessetTowns)
      .map(([code, tInfo]) => {
        const resolvedName = getTownName(code, tInfo.name);
        return { id: code, name: resolvedName };
      })
      .filter((item) => item.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 10);

    setSearchResults(matches);
    setShowResults(matches.length > 0);
  };

  const selectSearchResult = (item: { id: string, name: string }) => {
    setSearchQuery(item.name);
    setShowResults(false);
    selectAndFocusTown(item.id);
  };

  // Active statistics data
  const hasSelectedTown = selectedTownId && electionsData && electionsData[selectedKnesset]?.towns[selectedTownId];
  const activeTownData = hasSelectedTown ? electionsData![selectedKnesset].towns[selectedTownId!] : null;
  const activeKnessetData = electionsData ? electionsData[selectedKnesset] : null;

  const activeTitle = activeTownData
    ? getTownName(selectedTownId!, activeTownData.name)
    : (t('map.nationalAverage') + ` (${selectedKnesset === "25" ? "2022" : selectedKnesset === "24" ? "2021" : selectedKnesset === "23" ? "2020" : "2019"})`);

  const activeBzb = activeTownData ? activeTownData.bzb : (activeKnessetData ? activeKnessetData.bzb : 0);
  const activeVoters = activeTownData ? activeTownData.voters : (activeKnessetData ? activeKnessetData.voters : 0);
  const activeTurnout = activeTownData ? activeTownData.turnout : (activeKnessetData ? activeKnessetData.turnout : 0);

  const rawResults = activeTownData 
    ? activeTownData.results 
    : (activeKnessetData ? activeKnessetData.results : {});

  const sortedResults = Object.entries(rawResults)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, pct]) => pct > 0);

  const activeBechirotSource = BECHIROT_SOURCES[selectedKnesset];

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] px-4 md:px-8 lg:px-12 pt-8 pb-20 transition-colors duration-300" dir={dir}>
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-secondary dark:text-amber-400">map</span>
            <h1 className="font-['Newsreader'] text-3xl sm:text-4xl md:text-6xl tracking-tight text-[#162839] dark:text-[#fbf9f5]">
              {t('map.title1')} <span className="italic font-bold">{t('map.title2')}</span>
            </h1>
          </div>
          <div className="h-1 w-20 bg-secondary dark:bg-amber-400 mb-4" />
          <p className="font-['Inter'] text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {t('map.desc')}
          </p>
        </section>

        {/* Map Container & Control Bar */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-stone-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-[#1e293b] w-full mb-6">
          
          {/* Controls Bar: Election Selector & Search */}
          <div className="bg-stone-50 dark:bg-[#192635] border-b border-stone-200/60 dark:border-slate-800 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 z-10">
            
            {/* Knesset Selector */}
            <div className="flex items-center gap-3">
              <label htmlFor="knesset-select" className="font-['Inter'] text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">how_to_vote</span>
                {t('map.selectKnesset')}:
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 dark:bg-slate-800 rounded-xl">
                {[
                  { id: "25", label: isHe ? 'כנסת 25 (2022)' : '25th (2022)' },
                  { id: "24", label: isHe ? 'כנסת 24 (2021)' : '24th (2021)' },
                  { id: "23", label: isHe ? 'כנסת 23 (2020)' : '23rd (2020)' },
                  { id: "22", label: isHe ? 'כנסת 22 (2019)' : '22nd (2019)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedKnesset(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-bold transition-all ${
                      selectedKnesset === item.id
                        ? 'bg-white dark:bg-[#162839] text-secondary dark:text-amber-400 shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Autocomplete */}
            <div className="relative w-full md:w-72">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('map.searchPlaceholder')}
                  className="w-full pl-9 pr-8 py-2 text-xs font-['Inter'] font-medium bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 dark:focus:ring-amber-400/50 text-[#162839] dark:text-[#fbf9f5]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">search</span>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false); }}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Dropdown Results */}
              {showResults && (
                <div className={`absolute top-full ${isHe ? 'right-0' : 'left-0'} mt-1 w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1 z-[120] max-h-60 overflow-y-auto`}>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectSearchResult(item)}
                      className="w-full text-start px-4 py-2 text-xs font-['Inter'] font-medium text-[#162839] dark:text-[#fbf9f5] hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Main Map & Side Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px] relative">
            
            {/* Map Canvas */}
            <div className="lg:col-span-8 relative h-[480px] lg:h-full bg-stone-100 dark:bg-slate-900 border-b lg:border-b-0 lg:border-e border-stone-200/60 dark:border-slate-800">
              <div ref={mapRef} className="w-full h-full" />
              
              {/* Reset View Floating Button */}
              {selectedTownId && (
                <button
                  onClick={handleReset}
                  className={`absolute top-4 ${isHe ? 'left-4' : 'right-4'} bg-white/95 dark:bg-[#162839]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200/80 dark:border-slate-700 text-xs font-['Inter'] font-bold text-[#162839] dark:text-[#fbf9f5] shadow-lg hover:bg-stone-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 z-10`}
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  {t('map.resetView')}
                </button>
              )}
            </div>

            {/* Side Results Panel */}
            <div className="lg:col-span-4 p-5 md:p-6 flex flex-col bg-white dark:bg-[#1e293b] overflow-y-auto max-h-[600px]">
              
              {/* Selected Town Header */}
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-stone-200/60 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                    {selectedTownId ? t('map.town') : t('map.nationalAverage')}
                  </span>
                  <h3 className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
                    {activeTitle}
                  </h3>
                </div>
                {selectedTownId && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-secondary dark:text-amber-400 font-bold hover:underline"
                  >
                    {t('map.resetView')}
                  </button>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="p-2.5 bg-stone-50 dark:bg-slate-800/60 rounded-xl border border-stone-100 dark:border-slate-700/50 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{t('map.voterTurnout')}</span>
                  <span className="text-base font-bold text-secondary dark:text-amber-400">{activeTurnout.toFixed(1)}%</span>
                </div>
                <div className="p-2.5 bg-stone-50 dark:bg-slate-800/60 rounded-xl border border-stone-100 dark:border-slate-700/50 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{isHe ? 'בעלי זכות' : 'Eligible'}</span>
                  <span className="text-base font-bold text-[#162839] dark:text-[#fbf9f5]">
                    {activeBzb ? activeBzb.toLocaleString() : '-'}
                  </span>
                </div>
                <div className="p-2.5 bg-stone-50 dark:bg-slate-800/60 rounded-xl border border-stone-100 dark:border-slate-700/50 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{t('map.actualVoters')}</span>
                  <span className="text-base font-bold text-[#162839] dark:text-[#fbf9f5]">
                    {activeVoters ? activeVoters.toLocaleString() : '-'}
                  </span>
                </div>
              </div>

              {/* Turnout Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-300">
                  <span>{t('map.turnoutProgress')}</span>
                  <span>{activeTurnout.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-secondary dark:bg-amber-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, activeTurnout))}%` }}
                  />
                </div>
              </div>

              {/* Party Results Breakdown */}
              <div className="flex-grow">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {t('map.partyBreakdown')}
                </h4>
                <div className="space-y-2.5">
                  {sortedResults.map(([partyKey, pct]) => {
                    const partyMeta = PARTY_METADATA[partyKey] || PARTY_METADATA["Other"];
                    const partyName = isHe ? partyMeta.nameHe : partyMeta.nameEn;
                    return (
                      <div key={partyKey} className="group">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block" 
                              style={{ backgroundColor: partyMeta.color }}
                            />
                            {partyName}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{pct.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, pct)}%`,
                              backgroundColor: partyMeta.color 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Official Bechirot Credits Footer Banner */}
          {activeBechirotSource && (
            <div className="bg-stone-50 dark:bg-[#192635] border-t border-stone-200/60 dark:border-slate-800 px-4 md:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary dark:text-amber-400">verified</span>
                <span>
                  <strong>{t('map.dataSource')}:</strong> Central Elections Committee (ועדת הבחירות המרכזית)
                </span>
              </div>
              <a
                href={activeBechirotSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-secondary dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                {isHe ? activeBechirotSource.labelHe : activeBechirotSource.labelEn}
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          )}

        </div>

        {/* Socioeconomic Cluster Analysis Chart */}
        <section className="bg-white dark:bg-[#1e293b] rounded-2xl border border-stone-200/80 dark:border-slate-800 p-6 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="font-['Newsreader'] italic text-2xl font-bold text-[#162839] dark:text-[#fbf9f5]">
                {t('map.socioTitle')}
              </h3>
              <p className="font-['Inter'] text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('map.socioDesc')}
              </p>
            </div>

            {/* Socioeconomic Chart Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={socioKnesset}
                onChange={(e) => setSocioKnesset(e.target.value)}
                className="px-3 py-1.5 text-xs font-['Inter'] font-bold bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl text-[#162839] dark:text-[#fbf9f5]"
              >
                <option value="k25">{isHe ? 'בחירות 2022' : '2022 Elections'}</option>
                <option value="k24">{isHe ? 'בחירות 2021' : '2021 Elections'}</option>
                <option value="k23">{isHe ? 'בחירות 2020' : '2020 Elections'}</option>
              </select>

              <select
                value={selectedSocioParty}
                onChange={(e) => setSelectedSocioParty(e.target.value)}
                className="px-3 py-1.5 text-xs font-['Inter'] font-bold bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl text-[#162839] dark:text-[#fbf9f5]"
              >
                <option value="Turnout">{t('map.voterTurnout')}</option>
                {Object.keys(PARTY_METADATA).map(p => (
                  <option key={p} value={p}>
                    {isHe ? PARTY_METADATA[p].nameHe : PARTY_METADATA[p].nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recharts Component */}
          <div className="h-72 w-full">
            {socioData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={socioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="cluster" 
                    label={{ value: t('map.socioClusterLabel'), position: 'insideBottom', offset: -5 }} 
                    stroke="#94a3b8"
                  />
                  <YAxis stroke="#94a3b8" unit="%" />
                  <ChartTooltip 
                    formatter={(val: any) => [`${val}%`, selectedSocioParty]}
                    labelFormatter={(cluster: any) => `${t('map.socioCluster')} ${cluster}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={`${socioKnesset}.${selectedSocioParty === 'Turnout' ? 'Turnout' : Object.keys(SOCIO_PARTY_MAP).find(k => SOCIO_PARTY_MAP[k] === selectedSocioParty) || selectedSocioParty}`} 
                    stroke={selectedSocioParty === 'Turnout' ? '#1C5BAD' : PARTY_METADATA[selectedSocioParty]?.color || '#1C5BAD'} 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                Loading socioeconomic analysis...
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
