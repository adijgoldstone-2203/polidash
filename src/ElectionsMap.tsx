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

// Bechirot.gov.il official links per Knesset
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
  const [selectedSocioParties, setSelectedSocioParties] = useState<Set<string>>(new Set());

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string, name: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasFittedBoundsRef = useRef(false);

  // Helper for Title Case
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-'))
      .join(' ');
  };

  // Get translated town name
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

  // Get party color by name
  const getPartyColorByName = (name: string) => {
    const found = Object.values(PARTY_METADATA).find(meta => 
      meta.nameEn === name || meta.nameHe === name
    );
    return found ? found.color : "#6C7CA5";
  };

  // Socioeconomic chart data calculation
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

  // 1. Fetch election summary, polygon GeoJSON, translations, and socioeconomic datasets
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

  // 2. Initialize MapLibre GL map
  useEffect(() => {
    if (!mapRef.current || !geojson || mapInstanceRef.current) return;

    hasFittedBoundsRef.current = false;

    if (maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      try {
        (maplibregl as any).setRTLTextPlugin(
          'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.js',
          (err: any) => { if (err) console.error('RTL text plugin error:', err); },
          true
        );
      } catch (e) {
        console.error('Failed to set RTL text plugin:', e);
      }
    }

    const baseStyle: maplibregl.StyleSpecification = {
      version: 8,
      name: "PoliDash_ElectionsMap",
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        yishuvim_geojson_source: {
          type: "geojson",
          data: geojson
        }
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": "#f8fafc"
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

    hoverPopupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15
    });

    map.on('load', () => {
      const container = mapRef.current;
      if (container && container.clientWidth > 0 && container.clientHeight > 0) {
        map.fitBounds([[34.15, 29.45], [35.9, 33.35]], {
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
          animate: false
        });
        hasFittedBoundsRef.current = true;
      }

      // Fill layer painted by winning party color (excluding country outline feature)
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

      // Polygon borders layer
      map.addLayer({
        id: 'yishuvim-borders',
        type: 'line',
        source: 'yishuvim_geojson_source',
        filter: ['!=', ['get', 'is_country_outline'], true],
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.6
        }
      });

      // National perimeter outline border layer (clean dark outline around Israel, Golan, West Bank & Gaza)
      map.addLayer({
        id: 'israel-country-border',
        type: 'line',
        source: 'yishuvim_geojson_source',
        filter: ['==', ['get', 'is_country_outline'], true],
        paint: {
          'line-color': '#0f172a',
          'line-width': 1.5,
          'line-opacity': 0.95
        }
      });

      // Hover outline layer
      map.addLayer({
        id: 'yishuvim-hover',
        type: 'line',
        source: 'yishuvim_geojson_source',
        paint: {
          'line-color': '#0f172a',
          'line-width': 2.0
        },
        filter: ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']
      });

      // Selected boundary highlight layer
      map.addLayer({
        id: 'yishuvim-selected',
        type: 'line',
        source: 'yishuvim_geojson_source',
        paint: {
          'line-color': '#e11d48',
          'line-width': 3.0
        },
        filter: ['==', ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'semel_yishuv']], '']
      });

      // Label symbol layer for locality names
      map.addLayer({
        id: 'yishuvim-labels',
        type: 'symbol',
        source: 'yishuvim_geojson_source',
        minzoom: 9.2,
        layout: {
          'text-field': ['coalesce', ['get', 'SHEM_YISHUV'], ['get', 'shem_yishuv']],
          'text-size': 11,
          'text-padding': 6,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular']
        },
        paint: {
          'text-color': '#0f172a',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.8
        }
      });

      colorMapPolygons(selectedKnesset);

      map.on('mousemove', 'yishuvim-layer', handleMouseMove);
      map.on('mouseleave', 'yishuvim-layer', handleMouseLeave);
      map.on('click', 'yishuvim-layer', handleMapClick);

      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['yishuvim-layer']
        });
        if (features.length === 0) {
          handleReset();
        }
      });
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0 && mapInstanceRef.current) {
          mapInstanceRef.current.resize();
        }
      }
    });

    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geojson]);

  // 3. Update map labels when language changes
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

  // Recolour polygons when selected Knesset changes
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.isStyleLoaded()) {
      colorMapPolygons(selectedKnesset);
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

  // Close search dropdown on click outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Map polygon fill expression builder
  const colorMapPolygons = (knesset: string) => {
    const map = mapInstanceRef.current;
    if (!map || !electionsData) return;

    const knessetSummary = electionsData[knesset];
    if (!knessetSummary) return;

    const expression: any[] = [
      'match',
      ['coalesce', ['get', 'SEMEL_YISHUV'], ['get', 'SEMEL_MUN'], ['get', 'semel_yishuv'], ['get', 'semel_mun'], 0]
    ];

    // Judea & Samaria region background fill color (#CCCCCC)
    expression.push(99999, '#CCCCCC');
    // Country outline feature 88888 (transparent fill)
    expression.push(88888, 'rgba(0,0,0,0)');

    Object.entries(knessetSummary.towns).forEach(([code, town]) => {
      const winner = town.winner;
      const color = PARTY_METADATA[winner]?.color || PARTY_METADATA["Other"].color;
      if (parseInt(code)) {
        expression.push(parseInt(code), color);
      }
    });

    expression.push('#CCCCCC');

    if (map.getLayer('yishuvim-layer')) {
      map.setPaintProperty('yishuvim-layer', 'fill-color', expression);
    }
  };

  // Priority Feature Selection (prioritizes items with election data and smaller polygon area)
  const getPriorityFeature = (features: any[]) => {
    const valid = (features || []).filter((f: any) => {
      const code = (f.properties.SEMEL_YISHUV ?? f.properties.SEMEL_MUN ?? f.properties.semel_yishuv ?? f.properties.semel_mun);
      return code !== 99999 && code !== '99999' && code !== 88888 && code !== '88888' && !f.properties.is_region_bg && !f.properties.is_country_outline;
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

  // Hover Tooltip Callback
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

    // Draw hover boundary
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
    } else if (geojson) {
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
              <select
                id="knesset-select"
                value={selectedKnesset}
                onChange={(e) => setSelectedKnesset(e.target.value)}
                className="font-['Inter'] text-sm font-bold bg-white dark:bg-slate-800 text-[#162839] dark:text-[#fbf9f5] border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-secondary focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="25">{t('map.knesset25')}</option>
                <option value="24">{t('map.knesset24')}</option>
                <option value="23">{t('map.knesset23')}</option>
                <option value="22">{t('map.knesset22')}</option>
              </select>
            </div>

            {/* Search Input */}
            <div ref={searchRef} className="relative flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('map.searchPlaceholder')}
                  className={`w-full font-['Inter'] text-sm py-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-[#162839] dark:text-[#fbf9f5] focus:ring-2 focus:ring-secondary focus:outline-none shadow-sm ${isHe ? 'pr-10 pl-8' : 'pl-10 pr-8'}`}
                />
                <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none ${isHe ? 'right-3' : 'left-3'}`}>
                  search
                </span>
                {searchQuery && (
                  <button 
                    onClick={() => handleSearchChange("")}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none ${isHe ? 'left-3' : 'right-3'}`}
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              {/* Autocomplete Results Dropdown */}
              {showResults && (
                <div className={`absolute top-full ${isHe ? 'right-0' : 'left-0'} mt-1 w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1 z-[120] max-h-60 overflow-y-auto`}>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectSearchResult(item)}
                      className="w-full text-start px-4 py-2 text-sm font-['Inter'] font-medium text-[#162839] dark:text-[#fbf9f5] hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
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
            <div className="lg:col-span-8 relative h-[450px] lg:h-full bg-stone-100 dark:bg-slate-900 border-b lg:border-b-0 lg:border-e border-stone-200/60 dark:border-slate-800">
              <div ref={mapRef} className="w-full h-full" />
              
              {/* Floating Map Reset Button */}
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

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-stone-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-stone-200/40 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{t('map.voterTurnout')}</span>
                  <span className="font-['Newsreader'] text-xl font-bold text-secondary dark:text-amber-400">
                    {activeTurnout}%
                  </span>
                </div>
                <div className="bg-stone-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-stone-200/40 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{t('map.eligibleVoters')}</span>
                  <span className="font-['Inter'] text-xs font-bold text-[#162839] dark:text-[#fbf9f5]">
                    {activeBzb.toLocaleString()}
                  </span>
                </div>
                <div className="bg-stone-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-stone-200/40 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{t('map.validVotes')}</span>
                  <span className="font-['Inter'] text-xs font-bold text-[#162839] dark:text-[#fbf9f5]">
                    {activeVoters.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Party Results List */}
              <div className="flex-grow">
                <h4 className="font-['Inter'] text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">
                  {t('map.votesPercent')}
                </h4>
                
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pe-1 custom-scrollbar">
                  {sortedResults.map(([partyName, pct]) => {
                    const partyMeta = PARTY_METADATA[partyName] || PARTY_METADATA["Other"];
                    const displayName = isHe ? partyMeta.nameHe : partyMeta.nameEn;
                    const color = partyMeta.color;

                    return (
                      <div key={partyName} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs font-['Inter']">
                          <span className="font-bold text-[#162839] dark:text-[#fbf9f5] flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                            {displayName}
                          </span>
                          <span className="font-bold text-slate-600 dark:text-slate-300">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(pct * 2.5, 100)}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Prominent Data Source Credits Section */}
        <section className="bg-white dark:bg-[#1e293b] rounded-2xl border border-stone-200/80 dark:border-slate-800 p-5 md:p-6 shadow-md mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-secondary dark:text-amber-400">verified</span>
              <div>
                <h3 className="font-['Inter'] text-sm font-bold text-[#162839] dark:text-[#fbf9f5]">
                  {t('map.credits.title')}
                </h3>
                <p className="font-['Inter'] text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('map.credits.desc')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(BECHIROT_SOURCES).map(([knessetKey, source]) => (
                <a
                  key={knessetKey}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-['Inter'] text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    selectedKnesset === knessetKey
                      ? 'bg-secondary/15 text-secondary border-secondary/30 dark:bg-amber-400/15 dark:text-amber-400 dark:border-amber-400/30 shadow-sm'
                      : 'bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-secondary/40'
                  }`}
                >
                  <span>{isHe ? source.labelHe : source.labelEn}</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Preserved Socioeconomic Cluster Analysis Section */}
        <section className="bg-white dark:bg-[#1e293b] rounded-2xl border border-stone-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="font-['Newsreader'] italic text-2xl md:text-3xl font-bold text-[#162839] dark:text-[#fbf9f5]">
                {t('map.socioeconomicTitle')}
              </h2>
              <p className="font-['Inter'] text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {t('map.socioeconomicDesc')}
              </p>
            </div>

            {/* Socioeconomic Mode Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl border border-stone-200 dark:border-slate-700">
                <button
                  onClick={() => setSocioKnesset("25")}
                  className={`px-3 py-1.5 text-xs font-['Inter'] font-bold rounded-lg transition-all ${
                    socioKnesset === "25"
                      ? 'bg-white dark:bg-[#162839] text-[#162839] dark:text-[#fbf9f5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t('map.socioeconomicKnesset25')}
                </button>
                <button
                  onClick={() => setSocioKnesset("24")}
                  className={`px-3 py-1.5 text-xs font-['Inter'] font-bold rounded-lg transition-all ${
                    socioKnesset === "24"
                      ? 'bg-white dark:bg-[#162839] text-[#162839] dark:text-[#fbf9f5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t('map.socioeconomicKnesset24')}
                </button>
              </div>

              <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl border border-stone-200 dark:border-slate-700">
                <button
                  onClick={() => setSocioMode("coalition")}
                  className={`px-3 py-1.5 text-xs font-['Inter'] font-bold rounded-lg transition-all ${
                    socioMode === "coalition"
                      ? 'bg-white dark:bg-[#162839] text-[#162839] dark:text-[#fbf9f5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t('map.socioeconomicModeCoalition')}
                </button>
                <button
                  onClick={() => setSocioMode("parties")}
                  className={`px-3 py-1.5 text-xs font-['Inter'] font-bold rounded-lg transition-all ${
                    socioMode === "parties"
                      ? 'bg-white dark:bg-[#162839] text-[#162839] dark:text-[#fbf9f5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t('map.socioeconomicModeParties')}
                </button>
              </div>
            </div>
          </div>

          {/* Party Filter Chips for Individual Parties Mode */}
          {socioMode === 'parties' && (
            <div className="flex flex-wrap gap-2 mb-6">
              {getSocioPartiesList().map(partyName => {
                const isSelected = selectedSocioParties.has(partyName);
                const color = getPartyColorByName(partyName);
                const displayName = isHe ? PARTY_METADATA[partyName]?.nameHe : PARTY_METADATA[partyName]?.nameEn;

                return (
                  <button
                    key={partyName}
                    onClick={() => {
                      const next = new Set(selectedSocioParties);
                      if (next.has(partyName)) {
                        next.delete(partyName);
                      } else {
                        next.add(partyName);
                      }
                      setSelectedSocioParties(next);
                    }}
                    className={`font-['Inter'] text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                      isSelected || selectedSocioParties.size === 0
                        ? 'bg-stone-100 dark:bg-slate-800 text-[#162839] dark:text-[#fbf9f5] border-stone-300 dark:border-slate-600 shadow-sm'
                        : 'opacity-40 border-stone-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {displayName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Recharts Socioeconomic Line Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getSocioChartData()} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="cluster" label={{ value: 'Socioeconomic Cluster (1-10)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Vote Share (%)', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                />
                {socioMode === 'coalition' ? (
                  <>
                    <Line type="monotone" dataKey={t('map.coalitionBlock')} stroke="#1C5BAD" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey={t('map.oppositionBlock')} stroke="#FF8E3C" strokeWidth={3} dot={{ r: 4 }} />
                  </>
                ) : (
                  getSocioPartiesList().map(partyName => {
                    const displayName = isHe ? PARTY_METADATA[partyName]?.nameHe : PARTY_METADATA[partyName]?.nameEn;
                    if (selectedSocioParties.size > 0 && !selectedSocioParties.has(partyName)) {
                      return null;
                    }
                    return (
                      <Line
                        key={partyName}
                        type="monotone"
                        dataKey={displayName}
                        stroke={getPartyColorByName(partyName)}
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    );
                  })
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

        </section>

      </div>
    </div>
  );
};

export default ElectionsMap;
