import React, { useState, useEffect, useRef } from 'react';
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
  "United Torah Judaism": { nameEn: "United Torah Judaism", nameHe: "יהדות התורה", color: "#BBBBBB" },
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

interface KnessetData {
  knesset: string;
  bzb: number;
  voters: number;
  valid: number;
  turnout: number;
  results: Record<string, number>;
  towns: Record<string, TownData>;
}

interface TownData {
  name: string;
  bzb: number;
  voters: number;
  valid: number;
  turnout: number;
  winner: string;
  results: Record<string, number>;
}

const ElectionsMap: React.FC = () => {
  const { t, dir, lang } = useLanguage();
  const isHe = lang === 'he';

  const [electionsData, setElectionsData] = useState<Record<string, KnessetData> | null>(null);
  const [geojson, setGeojson] = useState<any>(null);
  const [townTranslations, setTownTranslations] = useState<Record<string, { he: string, en: string }> | null>(null);
  const [socioData, setSocioData] = useState<Record<string, any[]> | null>(null);
  const [socioKnesset, setSocioKnesset] = useState<string>("25");
  const [socioMode, setSocioMode] = useState<"coalition" | "parties">("coalition");
  const [selectedKnesset, setSelectedKnesset] = useState<string>("25");
  const [selectedTownId, setSelectedTownId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSocioParties, setSelectedSocioParties] = useState<Set<string>>(new Set());
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string, name: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Helper for English Title Case
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => {
        return word.split('-').map(part => {
          return part.charAt(0).toUpperCase() + part.slice(1);
        }).join('-');
      })
      .join(' ');
  };

  // Helper to get translated town name
  const getTownName = (semel: string, fallbackHe: string) => {
    if (!townTranslations || !semel) return fallbackHe;
    const trans = townTranslations[semel];
    if (!trans) return fallbackHe;
    if (lang === 'he') {
      return trans.he || fallbackHe;
    } else {
      return trans.en ? toTitleCase(trans.en) : fallbackHe;
    }
  };

  const getPartyColorByName = (name: string) => {
    const found = Object.values(PARTY_METADATA).find(meta => 
      meta.nameEn === name || meta.nameHe === name
    );
    return found ? found.color : "#6C7CA5";
  };

  const getSocioChartData = () => {
    if (!socioData || !socioData[socioKnesset]) return [];
    const rawList = socioData[socioKnesset];

    if (socioMode === 'coalition') {
      const coalitionKeys25 = ["Likud", "Hatziyonut Hadatit", "Shas", "Yehadut Hatora"];
      const coalitionKeys24 = ["Yesh Atid", "Kachol Lavan", "Yamina", "Avoda", "Yisrael Beitenu", "Tikva", "Meretz", "Raam"];

      const coalitionKeys = socioKnesset === '25' ? coalitionKeys25 : coalitionKeys24;

      return rawList.map(item => {
        let coalitionSum = 0;
        let oppositionSum = 0;

        Object.entries(item).forEach(([key, val]) => {
          if (key !== 'cluster') {
            const num = val as number;
            if (coalitionKeys.includes(key)) {
              coalitionSum += num;
            } else {
              oppositionSum += num;
            }
          }
        });

        return {
          cluster: item.cluster,
          [t('map.coalitionBlock')]: parseFloat(coalitionSum.toFixed(2)),
          [t('map.oppositionBlock')]: parseFloat(oppositionSum.toFixed(2))
        };
      });
    } else {
      return rawList.map(item => {
        const row: any = { cluster: item.cluster };
        Object.entries(item).forEach(([key, val]) => {
          if (key !== 'cluster') {
            const mappedKey = SOCIO_PARTY_MAP[key];
            if (mappedKey) {
              const meta = PARTY_METADATA[mappedKey];
              const displayName = isHe ? meta.nameHe : meta.nameEn;
              row[displayName] = val;
            }
          }
        });
        return row;
      });
    }
  };

  // Reset selected socioeconomic party filters when year or mode changes
  useEffect(() => {
    setSelectedSocioParties(new Set());
  }, [socioKnesset, socioMode]);

  const getSocioPartiesList = () => {
    if (!socioData || !socioData[socioKnesset]) return [];
    const firstItem = socioData[socioKnesset][0];
    if (!firstItem) return [];
    
    const rawKeys = Object.keys(firstItem).filter(k => k !== 'cluster');
    const partyKeysSet = new Set<string>();
    rawKeys.forEach(k => {
      const mappedKey = SOCIO_PARTY_MAP[k];
      if (mappedKey && PARTY_METADATA[mappedKey]) {
        partyKeysSet.add(mappedKey);
      }
    });
    
    return Array.from(partyKeysSet);
  };

  // 1. Fetch JSON data on mount
  useEffect(() => {
    Promise.all([
      fetch('/elections_summary.json').then(res => res.json()),
      fetch('/israel_towns.geojson').then(res => res.json()),
      fetch('/town_translations.json').then(res => res.json()),
      fetch('/socioeconomic_data.json').then(res => res.json())
    ])
      .then(([summary, geo, translations, socio]) => {
        setElectionsData(summary);
        setGeojson(geo);
        setTownTranslations(translations);
        setSocioData(socio);
      })
      .catch(err => {
        console.error("Error loading election map data files:", err);
      });
  }, []);

  // Track dark mode class on html element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  // 2. Initialize map once div and geojson are loaded
  useEffect(() => {
    if (!mapRef.current || !geojson || mapInstanceRef.current) return;

    // Load Mapbox RTL Text plugin dynamically for proper Hebrew layout
    if (maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      try {
        (maplibregl as any).setRTLTextPlugin(
          'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.js',
          (err: any) => { if (err) console.error('RTL text plugin error:', err); },
          true // lazy load
        );
      } catch (e) {
        console.error('Failed to set RTL text plugin:', e);
      }
    }

    const baseStyle: maplibregl.StyleSpecification = {
      version: 8,
      name: "Bare_v2",
      glyphs: `${window.location.origin}/tiles/fonts/{fontstack}/{range}.pbf`,
      sources: {
        yishuvim_vector_source: {
          type: "vector",
          tiles: [
            `${window.location.origin}/2022/tiles/v2/{z}/{y}/{x}.pbf`
          ]
        }
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": "hsla(187, 9%, 90%, 1)"
          }
        },
        {
          id: "countries-near",
          type: "fill",
          source: "yishuvim_vector_source",
          "source-layer": "countries",
          paint: {
            "fill-color": "hsl(60, 10%, 96%)",
            "fill-outline-color": "#cbd5e1"
          }
        },
        {
          id: "countries-borders",
          type: "line",
          source: "yishuvim_vector_source",
          "source-layer": "countries",
          paint: {
            "line-color": "#94a3b8",
            "line-width": 0.8
          }
        },
        {
          id: "lakes",
          type: "fill",
          source: "yishuvim_vector_source",
          "source-layer": "lakes",
          paint: {
            "fill-color": "hsla(187, 9%, 81%, 1)"
          }
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: baseStyle,
      center: [34.90, 31.30],
      zoom: 7.4,
      minZoom: 6.5,
      maxZoom: 13,
      dragRotate: false,
      touchZoomRotate: true,
      cooperativeGestures: true
    });

    mapInstanceRef.current = map;

    // Create a hover popup (not added to map yet)
    hoverPopupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15
    });

    map.on('load', () => {
      // Fit to Israel bounds to show the whole map on both mobile and desktop
      map.fitBounds([[34.15, 29.45], [35.9, 33.35]], {
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
        animate: false
      });
      // Add fill layer for municipalities
      map.addLayer({
        id: 'yishuvim-layer',
        type: 'fill',
        source: 'yishuvim_vector_source',
        'source-layer': 'yishuv_2022',
        paint: {
          'fill-color': '#CCCCCC',
          'fill-opacity': 0.65
        }
      });

      // Add borders layer
      map.addLayer({
        id: 'yishuvim-borders',
        type: 'line',
        source: 'yishuvim_vector_source',
        'source-layer': 'yishuv_2022',
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.4
        }
      });

      // Add high visibility hover outline layer
      map.addLayer({
        id: 'yishuvim-hover',
        type: 'line',
        source: 'yishuvim_vector_source',
        'source-layer': 'yishuv_2022',
        paint: {
          'line-color': '#000000',
          'line-width': 1.5
        },
        filter: ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']
      });

      // Add highlighted selected boundary layer
      map.addLayer({
        id: 'yishuvim-selected',
        type: 'line',
        source: 'yishuvim_vector_source',
        'source-layer': 'yishuv_2022',
        paint: {
          'line-color': '#e11d48',
          'line-width': 2.5
        },
        filter: ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']
      });

      // Add symbol layer for town names
      map.addLayer({
        id: 'yishuvim-labels',
        type: 'symbol',
        source: 'yishuvim_vector_source',
        'source-layer': 'Centroids',
        minzoom: 9.5,
        layout: {
          'text-field': ['coalesce', ['get', 'SHEM_YISHUV'], ['get', 'shem_yishuv']],
          'text-size': 11,
          'text-padding': 8,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular']
        },
        paint: {
          'text-color': '#1e293b',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      });

      // Map Events
      map.on('mousemove', 'yishuvim-layer', handleMouseMove);
      map.on('mouseleave', 'yishuvim-layer', handleMouseLeave);
      map.on('click', 'yishuvim-layer', handleMapClick);

      // Deselect municipality when clicking on an empty area of the map
      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['yishuvim-layer']
        });
        if (features.length === 0) {
          handleReset();
        }
      });

      // Color the map initially
      colorMapPolygons(selectedKnesset);
    });

    // Handle map style hot-reloading for dark/light mode
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geojson]);

  // 3. Update map labels when language or translations load
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const updateLabels = () => {
      if (!map.getLayer('yishuvim-labels')) return;

      if (lang === 'he') {
        map.setLayoutProperty('yishuvim-labels', 'text-field', ['coalesce', ['get', 'SHEM_YISHUV'], ['get', 'shem_yishuv']]);
      } else if (townTranslations) {
        const expr: any[] = ['match', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv'], 0]];
        Object.entries(townTranslations).forEach(([code, trans]) => {
          if (trans.en) {
            expr.push(parseInt(code), toTitleCase(trans.en));
          }
        });
        expr.push(['coalesce', ['get', 'SHEM_YISHUV'], ['get', 'shem_yishuv'], '']);
        map.setLayoutProperty('yishuvim-labels', 'text-field', expr);
      }
    };

    if (map.isStyleLoaded()) {
      updateLabels();
    } else {
      map.on('style.load', updateLabels);
    }
  }, [lang, townTranslations]);

  // 3.5. Recolour map when selected Knesset changes
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.isStyleLoaded()) {
      colorMapPolygons(selectedKnesset);
      // Reset selected town details if it doesn't exist in the new Knesset year
      if (selectedTownId && electionsData) {
        const townExists = !!electionsData[selectedKnesset]?.towns[selectedTownId];
        if (!townExists) {
          setSelectedTownId(null);
          if (mapInstanceRef.current.getLayer('yishuvim-selected')) {
            mapInstanceRef.current.setFilter('yishuvim-selected', ['==', 'SEMEL_YISHUV', '']);
          }
        }
      }
    }
  }, [selectedKnesset, electionsData]);

  // Handle click outside autocomplete search results
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Map colouring helper using match expression
  const colorMapPolygons = (knesset: string) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    const knessetSummary = electionsData[knesset];
    if (!knessetSummary) return;

    const expression: any[] = ['match', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']]];

    Object.entries(knessetSummary.towns).forEach(([code, town]) => {
      const winner = town.winner;
      const color = PARTY_METADATA[winner]?.color || PARTY_METADATA["Other"].color;
      expression.push(parseInt(code), color);
    });

    expression.push('#CCCCCC'); // fallback default color

    if (map.getLayer('yishuvim-layer')) {
      map.setPaintProperty('yishuvim-layer', 'fill-color', expression);
    }
  };

  // Hover Tooltip Callback
  const handleMouseMove = (e: any) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    map.getCanvas().style.cursor = 'pointer';

    if (e.features.length > 0) {
      const feature = e.features[0];
      const semel = (feature.properties.SEMEL_YISHUV ?? feature.properties.semel_yishuv)?.toString();
      const townInfo = electionsData[selectedKnesset]?.towns[semel];
      const fallbackName = townInfo ? townInfo.name : (feature.properties.SHEM_YISHUV ?? feature.properties.shem_yishuv ?? "Unknown");
      const townName = getTownName(semel, fallbackName);

      // Draw hover boundary
      if (map.getLayer('yishuvim-hover')) {
        map.setFilter('yishuvim-hover', ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], parseInt(semel)]);
      }

      // Fetch town summary stats
      const turnoutText = townInfo 
        ? `${townInfo.turnout}%` 
        : t('map.noData');

      const winningPartyName = townInfo 
        ? (isHe ? PARTY_METADATA[townInfo.winner]?.nameHe : PARTY_METADATA[townInfo.winner]?.nameEn)
        : null;

      // Build popup HTML
      let html = `
        <div style="direction: ${dir}; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-family: sans-serif;">
          <h4 style="margin: 0 0 6px 0; font-weight: 800; font-size: 14px;">${townName}</h4>
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
    }
  };

  const handleMouseLeave = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.getCanvas().style.cursor = '';
    
    // Clear hover boundary
    if (map.getLayer('yishuvim-hover')) {
      map.setFilter('yishuvim-hover', ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']);
    }

    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
    }
  };

  // Click handler on town
  const handleMapClick = (e: any) => {
    if (e.features.length > 0) {
      const feature = e.features[0];
      const semel = (feature.properties.SEMEL_YISHUV ?? feature.properties.semel_yishuv).toString();
      selectAndFocusTown(semel, e.lngLat);
    }
  };

  const selectAndFocusTown = (semel: string, lngLat?: maplibregl.LngLatLike) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    setSelectedTownId(semel);

    // Apply selected filter boundary
    if (map.getLayer('yishuvim-selected')) {
      map.setFilter('yishuvim-selected', ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], parseInt(semel)]);
    }

    // Zoom and pan
    if (lngLat) {
      map.easeTo({
        center: lngLat,
        zoom: Math.max(map.getZoom(), 9.2)
      });
    } else if (geojson) {
      // Find feature in geojson to get centroid
      const feat = geojson.features.find((f: any) => f.properties.SEMEL_YISHUV.toString() === semel);
      if (feat) {
        const centroid = getCentroid(feat.geometry);
        map.easeTo({
          center: centroid as maplibregl.LngLatLike,
          zoom: 10
        });
      }
    }
  };

  // Centroid calculator helper
  const getCentroid = (geometry: any) => {
    let coords: number[][] = [];
    if (geometry.type === 'Polygon') {
      coords = geometry.coordinates[0];
    } else if (geometry.type === 'MultiPolygon') {
      coords = geometry.coordinates[0][0];
    }
    
    if (coords.length === 0) return [34.799722, 31.258889];
    
    let sumLng = 0;
    let sumLat = 0;
    coords.forEach(coord => {
      sumLng += coord[0];
      sumLat += coord[1];
    });
    
    return [sumLng / coords.length, sumLat / coords.length];
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

  // Handle Search Input Change
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
      .slice(0, 10); // cap to 10 results

    setSearchResults(matches);
    setShowResults(matches.length > 0);
  };

  const selectSearchResult = (item: { id: string, name: string }) => {
    setSearchQuery(item.name);
    setShowResults(false);
    selectAndFocusTown(item.id);
  };

  // Get active statistics
  const hasSelectedTown = selectedTownId && electionsData && electionsData[selectedKnesset]?.towns[selectedTownId];
  const activeTownData = hasSelectedTown ? electionsData![selectedKnesset].towns[selectedTownId!] : null;
  const activeKnessetData = electionsData ? electionsData[selectedKnesset] : null;

  // Chart values
  const rawResults = activeTownData 
    ? activeTownData.results 
    : (activeKnessetData ? activeKnessetData.results : {});

  // Sort results by percentage desc
  const sortedResults = Object.entries(rawResults)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, pct]) => pct > 0);

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] px-6 lg:px-12 pt-8 pb-20" dir={dir}>
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="font-['Newsreader'] text-3xl sm:text-4xl md:text-7xl tracking-tight text-primary dark:text-[#fbf9f5] mb-4">
            {t('map.title1')} <span className="italic font-bold">{t('map.title2')}</span>
          </h1>
          <div className="h-1 w-24 bg-primary dark:bg-amber-500 mb-6" />
          <p className="font-body text-lg text-on-surface-variant dark:text-slate-300 max-w-2xl leading-relaxed">
            {t('map.desc')}
          </p>
        </section>

        {/* Map UI Wrapper */}
        <div className="flex flex-col relative h-[650px] md:h-[750px] rounded-2xl overflow-hidden border border-stone-200/60 dark:border-slate-800 shadow-xl bg-white dark:bg-[#1e293b] w-full">
          
          {/* Search and Year selector Bar */}
          <div className="bg-white dark:bg-[#1e293b] border-b border-stone-200/50 dark:border-slate-800/50 px-4 md:px-8 py-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 z-10 shadow-sm">
        
        {/* Page Title */}
        <h1 className="font-headline font-bold text-lg md:text-xl text-primary dark:text-[#fbf9f5] flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-primary dark:text-amber-500">map</span>
          {t('map.title')}
        </h1>

        {/* Filters */}
        <div className="flex flex-row items-center gap-3">
          
          {/* Autocomplete Search input */}
          <div ref={searchRef} className="relative flex-grow sm:w-60">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('map.searchPlaceholder')}
                className={`w-full text-base py-2.5 rounded-lg bg-stone-100 dark:bg-slate-900 border-none text-[#162839] dark:text-[#fbf9f5] focus:ring-2 focus:ring-amber-500 focus:outline-none ${isHe ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
              <span 
                className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-stone-400 text-lg pointer-events-none ${isHe ? 'right-3' : 'left-3'}`}
              >
                search
              </span>
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange("")}
                  className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer focus:outline-none flex items-center justify-center ${isHe ? 'left-3' : 'right-3'}`}
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Results popup */}
            {showResults && (
              <div className="search-results-list border border-stone-200 dark:border-slate-850">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectSearchResult(item)}
                    className="search-result-item text-[#162839] dark:text-[#fbf9f5]"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Knesset selector */}
          <div className="relative">
            <select
              value={selectedKnesset}
              onChange={(e) => setSelectedKnesset(e.target.value)}
              className={`text-base border-none bg-stone-100 dark:bg-slate-900 text-[#162839] dark:text-[#fbf9f5] rounded-lg py-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold appearance-none cursor-pointer ${isHe ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', backgroundImage: 'none' }}
            >
              <option value="25">{t('map.knesset25')}</option>
              <option value="24">{t('map.knesset24')}</option>
              <option value="23">{t('map.knesset23')}</option>
              <option value="22">{t('map.knesset22')}</option>
            </select>
            <span 
              className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none ${isHe ? 'left-3' : 'right-3'}`}
            >
              expand_more
            </span>
          </div>

        </div>
      </div>

      {/* Main layout */}
      <div className="map-container-wrapper flex-grow overflow-hidden" style={{ height: '100%', minHeight: '0' }}>
        
        {/* Map Canvas */}
        <div className="map-canvas-container flex-grow">
          {(!geojson || !electionsData) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-100/80 dark:bg-slate-950/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
                <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">Loading map geometries...</span>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Sidebar Info Panel */}
        <div className="map-sidebar flex flex-col bg-white dark:bg-[#1a293a]">
          
          {/* Header section in sidebar */}
          <div className="p-5 border-b border-stone-200/50 dark:border-slate-800/50 flex flex-col gap-2 bg-stone-50/50 dark:bg-slate-900/30">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline font-extrabold text-lg md:text-xl text-primary dark:text-[#fbf9f5]">
                  {activeTownData ? getTownName(selectedTownId!, activeTownData.name) : t('map.nationalAverage')}
                </h2>
                <p className="text-xs text-stone-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-0.5">
                  {t('map.title')} - {t(`map.knesset${selectedKnesset}`)}
                </p>
              </div>
              
              {/* Reset view / back button */}
              {selectedTownId && (
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 hover:underline cursor-pointer focus:outline-none flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">replay</span>
                  {t('map.resetView')}
                </button>
              )}
            </div>

            {/* Quick general stats grid */}
            {activeKnessetData && (
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-stone-200/30 dark:bg-slate-900/40 p-2 rounded-lg">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    {t('map.voterTurnout')}
                  </span>
                  <span className="text-base font-extrabold text-primary dark:text-amber-500">
                    {activeTownData ? activeTownData.turnout : activeKnessetData.turnout}%
                  </span>
                </div>
                
                <div className="bg-stone-200/30 dark:bg-slate-900/40 p-2 rounded-lg">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    {t('map.eligibleVoters')}
                  </span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    {Number(activeTownData ? activeTownData.bzb : activeKnessetData.bzb).toLocaleString()}
                  </span>
                </div>
                
                <div className="bg-stone-200/30 dark:bg-slate-900/40 p-2 rounded-lg">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    {t('map.votesCast')}
                  </span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    {Number(activeTownData ? activeTownData.voters : activeKnessetData.voters).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Results list chart */}
          <div className="flex-grow p-5 space-y-4 overflow-y-auto custom-scrollbar">
            
            {sortedResults.length > 0 ? (
              <div className="space-y-3">
                {sortedResults.map(([partyKey, pct]) => {
                  const meta = PARTY_METADATA[partyKey] || PARTY_METADATA["Other"];
                  const partyName = isHe ? meta.nameHe : meta.nameEn;
                  
                  return (
                    <div key={partyKey} className="space-y-1.5">
                      {/* Party Info label */}
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span 
                            className="inline-block w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: meta.color }} 
                          />
                          {partyName}
                        </span>
                        <span className="text-primary dark:text-[#fbf9f5] font-extrabold">{pct}%</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${pct}%`, 
                            backgroundColor: meta.color 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-sm text-stone-400 py-12">
                <div className="flex flex-col items-center gap-2 max-w-[200px]">
                  <span className="material-symbols-outlined text-4xl text-stone-300 dark:text-slate-700">touch_app</span>
                  {t('map.selectTown')}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Footer/Legend */}
          <div className="p-4 border-t border-stone-200/50 dark:border-slate-800/50 bg-stone-50 dark:bg-slate-900/40 text-center">
            <span className="text-[10px] text-stone-400 dark:text-slate-500 uppercase tracking-widest font-bold">
              Data source: Central Elections Committee
            </span>
          </div>

        </div>
      </div>
    </div>

        {/* Socioeconomic Section */}
        {socioData && (
          <section className="mt-12 bg-white dark:bg-[#1e293b] rounded-2xl border border-stone-200/60 dark:border-slate-800 shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="font-headline font-bold text-lg md:text-xl text-primary dark:text-[#fbf9f5]">
                  {t('map.socioeconomicTitle')}
                </h2>
                <p className="text-sm text-stone-500 dark:text-slate-400 mt-1 max-w-2xl">
                  {t('map.socioeconomicDesc')}
                </p>
              </div>
              
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Knesset Select */}
                <div className="relative">
                  <select
                    value={socioKnesset}
                    onChange={(e) => setSocioKnesset(e.target.value)}
                    className={`text-sm border-none bg-stone-100 dark:bg-slate-900 text-[#162839] dark:text-[#fbf9f5] rounded-lg py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold appearance-none cursor-pointer ${isHe ? 'pr-3 pl-8' : 'pl-3 pr-8'}`}
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none', backgroundImage: 'none' }}
                  >
                    <option value="25">{t('map.socioeconomicKnesset25')}</option>
                    <option value="24">{t('map.socioeconomicKnesset24')}</option>
                  </select>
                  <span 
                    className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none ${isHe ? 'left-3' : 'right-3'}`}
                  >
                    expand_more
                  </span>
                </div>

                {/* Mode Select Buttons */}
                <div className="flex bg-stone-100 dark:bg-slate-900 rounded-lg p-1">
                  <button
                    onClick={() => setSocioMode('coalition')}
                    className={`text-xs font-bold py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                      socioMode === 'coalition'
                        ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#fbf9f5] shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                  >
                    {t('map.socioeconomicModeCoalition')}
                  </button>
                  <button
                    onClick={() => setSocioMode('parties')}
                    className={`text-xs font-bold py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                      socioMode === 'parties'
                        ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#fbf9f5] shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                  >
                    {t('map.socioeconomicModeParties')}
                  </button>
                </div>
              </div>
            </div>

            {socioMode === 'parties' && (
              <div className="flex flex-wrap gap-2 items-center mb-6 bg-stone-50 dark:bg-slate-900/40 p-4 rounded-xl border border-stone-200/50 dark:border-slate-800/50">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block me-2">
                  {isHe ? 'סנן לפי מפלגה:' : 'Filter by Party:'}
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {getSocioPartiesList().map(partyKey => {
                    const isActive = selectedSocioParties.has(partyKey);
                    const isColored = isActive;
                    const meta = PARTY_METADATA[partyKey];
                    const displayName = isHe ? meta.nameHe : meta.nameEn;
                    const color = meta.color;
                    return (
                      <button
                        key={partyKey}
                        onClick={() => {
                          setSelectedSocioParties(prev => {
                            const next = new Set(prev);
                            if (next.has(partyKey)) {
                              next.delete(partyKey);
                            } else {
                              next.add(partyKey);
                            }
                            return next;
                          });
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-200 cursor-pointer ${
                          isColored
                            ? 'text-white border-transparent'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-stone-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                        style={isColored ? { backgroundColor: color, borderColor: color } : {}}
                      >
                        {displayName}
                      </button>
                    );
                  })}
                  
                  {/* Select All / Reset action buttons */}
                  <div className="flex items-center gap-1 ms-1">
                    <button
                      onClick={() => setSelectedSocioParties(new Set(getSocioPartiesList()))}
                      disabled={selectedSocioParties.size === getSocioPartiesList().length}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                        selectedSocioParties.size === getSocioPartiesList().length
                          ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline decoration-dashed underline-offset-4'
                      }`}
                    >
                      {isHe ? 'בחר הכל' : 'Select All'}
                    </button>
                    <button
                      onClick={() => setSelectedSocioParties(new Set())}
                      disabled={selectedSocioParties.size === 0}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                        selectedSocioParties.size === 0
                          ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline decoration-dashed underline-offset-4'
                      }`}
                    >
                      {isHe ? 'איפוס' : 'Reset'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Coalition / Opposition Legend */}
            {socioMode === 'coalition' && (() => {
              const coalitionKeys25 = ["Likud", "Hatziyonut Hadatit", "Shas", "Yehadut Hatora"];
              const coalitionKeys24 = ["Yesh Atid", "Kachol Lavan", "Yamina", "Avoda", "Yisrael Beitenu", "Tikva", "Meretz", "Raam"];
              const coalitionKeys = socioKnesset === '25' ? coalitionKeys25 : coalitionKeys24;
              const allDataKeys = socioData && socioData[socioKnesset] && socioData[socioKnesset][0]
                ? Object.keys(socioData[socioKnesset][0]).filter(k => k !== 'cluster')
                : [];
              const oppositionKeys = allDataKeys.filter(k => !coalitionKeys.includes(k));

              const getDisplayName = (socioKey: string) => {
                const metaKey = SOCIO_PARTY_MAP[socioKey];
                if (metaKey && PARTY_METADATA[metaKey]) {
                  return isHe ? PARTY_METADATA[metaKey].nameHe : PARTY_METADATA[metaKey].nameEn;
                }
                return socioKey;
              };

              return (
                <div className="flex flex-wrap gap-6 items-center mt-4 mb-2 px-1">
                  {[
                    { label: t('map.coalitionBlock'), color: '#1C5BAD', parties: coalitionKeys },
                    { label: t('map.oppositionBlock'), color: '#FC6B60', parties: oppositionKeys },
                  ].map(bloc => (
                    <div key={bloc.label} className="relative group">
                      <div className="flex items-center gap-2 cursor-default">
                        <span
                          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: bloc.color }}
                        />
                        <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                          {bloc.label}
                        </span>
                        <span className="material-symbols-outlined text-stone-400 dark:text-stone-500 text-sm" style={{ fontSize: '16px' }}>
                          info
                        </span>
                      </div>
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full mb-2 left-0 z-50 hidden group-hover:block min-w-[200px]">
                        <div className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-lg p-3">
                          <p className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                            {bloc.label} — {isHe ? `כנסת ה-${socioKnesset}` : `Knesset ${socioKnesset}`}
                          </p>
                          <div className="flex flex-col gap-1">
                            {bloc.parties.map(pKey => {
                              const metaKey = SOCIO_PARTY_MAP[pKey];
                              const pColor = metaKey && PARTY_METADATA[metaKey] ? PARTY_METADATA[metaKey].color : '#999';
                              return (
                                <div key={pKey} className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pColor }} />
                                  <span className="text-xs text-stone-600 dark:text-stone-400">
                                    {getDisplayName(pKey)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Chart Wrapper */}
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getSocioChartData()}
                  margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} className="dark:stroke-slate-800/40" />
                  <XAxis 
                    dataKey="cluster" 
                    stroke={isDarkMode ? '#94a3b8' : '#64748b'} 
                    fontSize={12} 
                    tickLine={false}
                    label={{ 
                      value: isHe ? 'אשכול חברתי-כלכלי (1 הכי נמוך - 10 הכי גבוה)' : 'Socio-economic Cluster (1 Lowest - 10 Highest)', 
                      position: 'insideBottom', 
                      offset: -10, 
                      fill: isDarkMode ? '#94a3b8' : '#64748b', 
                      fontSize: 12 
                    }}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#94a3b8' : '#64748b'} 
                    fontSize={12} 
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <ChartTooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                    itemStyle={{ padding: '2px 0', color: isDarkMode ? '#fbf9f5' : '#1e293b' }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: isDarkMode ? '#fbf9f5' : '#1e293b' }}
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    labelFormatter={(label) => `${isHe ? 'אשכול' : 'Cluster'} ${label}`}
                    itemSorter={(item: any) => -(item.value as number)}
                  />
                  {Object.keys(getSocioChartData()[0] || {})
                    .filter(k => k !== 'cluster')
                    .filter(key => {
                      if (socioMode === 'coalition') return true;
                      
                      const matchedKey = Object.keys(PARTY_METADATA).find(metaKey => {
                        const meta = PARTY_METADATA[metaKey];
                        return meta.nameEn === key || meta.nameHe === key;
                      });

                      if (!matchedKey) return true;
                      return selectedSocioParties.has(matchedKey);
                    })
                    .map(key => {
                      const strokeColor = socioMode === 'coalition'
                        ? (key === t('map.coalitionBlock') ? '#1C5BAD' : '#FC6B60')
                        : getPartyColorByName(key);
                      return (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={strokeColor}
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 1 }}
                          activeDot={{ r: 7 }}
                        />
                      );
                    })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ElectionsMap;
