import React, { useEffect, useRef, useMemo, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Award, Zap, Navigation, Building2, LayoutGrid, MapPin, Clock, User, Search } from 'lucide-react';
import { chargingTypeInfo, gapDistributions, priorityGrids, categoryKeyMap } from '../data/showcaseData';
import { whitespacePoints, spatialMismatchData, spbuLocations, searchableAddresses } from '../data/planningData';
import { chargersData } from '../data/chargers';
import { gridCells, CELL_SIZE_DEG, realPriorityGrids } from '../data/realGridData';

// Province centers for map view
const PROVINCE_CENTERS = {
  '': { lat: -7.5, lng: 110.5, zoom: 7 }, // Semua Provinsi (Java & Bali)
  'DKI Jakarta': { lat: -6.22, lng: 106.83, zoom: 12 },
  'Jawa Barat': { lat: -6.90, lng: 107.60, zoom: 13 },
  'Bali': { lat: -8.70, lng: 115.17, zoom: 13 },
  'Jawa Timur': { lat: -7.25, lng: 112.75, zoom: 12 },
};

// Deterministic pseudo-random based on grid position (no randomness on re-renders)
const pseudoRandom = (row, col, seed = 0) => {
  const x = Math.sin(row * 127.1 + col * 311.7 + seed * 74.3) * 43758.5453;
  return x - Math.floor(x);
};

// Encode grid cell ID (similar to H3 hex format look)
const encodeGridId = (lat, lng, row, col) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let hash = Math.abs(Math.round(lat * 1000 + lng * 1000 + row * 31 + col * 17));
  let id = '';
  for (let i = 0; i < 12; i++) {
    id = chars[hash % chars.length] + id;
    hash = Math.floor(hash / chars.length) + (i * 7919);
  }
  return id.substring(0, 12);
};

// Grid configuration
const GRID_ROWS = 15;
const GRID_COLS = 15;
const GRID_SPAN_DEG = 0.22; // ~24km span total for the grid

export default function ChargingTypeDetail({ type, provinsi, onChangeType, onChangeProvinsi }) {
  const info = chargingTypeInfo[type];
  const distribution = gapDistributions[type];

  // Dynamic Site Selection weights state (0-10, default 5)
  const [weights, setWeights] = useState({
    accessibility: 5,
    demand: 5,
    competition: 5
  });

  // Unique provinces list extracted dynamically from chargers data
  const uniqueProvinces = useMemo(() => {
    return Array.from(
      new Set(chargersData.map(c => (c.provinsi || '').trim()))
    ).filter(Boolean).sort();
  }, []);

  // Get all unique operators for the selected province to display in the sidebar checklist
  const availableOperators = useMemo(() => {
    const ops = new Set();
    chargersData.forEach(c => {
      if (!provinsi || (c.provinsi || '').trim() === provinsi) {
        if (c.operator) {
          ops.add(c.operator.trim());
        }
      }
    });
    return Array.from(ops).sort();
  }, [provinsi]);

  const [selectedOperators, setSelectedOperators] = useState([]);

  // Auto-select all available operators when the province changes or on initial mount
  useEffect(() => {
    setSelectedOperators(availableOperators);
  }, [availableOperators]);

  const [layerToggles, setLayerToggles] = useState({
    whitespace: true,       // grid sel merah/biru = analisis whitespace utama
    spkluMarkers: true,
    spbuMarkers: true,
    opportunityMarkers: true, // lingkaran + titik whitespace opportunity
  });
  const toggleLayer = (key) => setLayerToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const [activeListTab, setActiveListTab] = useState('whitespace');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);

  // Close suggestions and provider dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.map-search-wrapper')) {
        setShowSuggestions(false);
      }
      if (!e.target.closest('.map-provider-dropdown-wrapper')) {
        setShowProviderDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Dynamic ranking for SPBU Pertamina based on weights
  const rankedSpbus = useMemo(() => {
    return spbuLocations
      .filter(s => !provinsi || s.provinsi === provinsi)
      .map(s => {
        // Deterministic but realistic scores based on ID/name
        const seed = s.name.charCodeAt(0) + s.name.charCodeAt(s.name.length - 1);
        const accessibility = 7 + (seed % 4); // 7-10
        const demand = 5 + ((seed * 3) % 6); // 5-10
        const competition = 4 + ((seed * 7) % 7); // 4-10

        const wSum = weights.accessibility + weights.demand + weights.competition;
        const overall = wSum > 0 ? Math.round((
          weights.accessibility * accessibility +
          weights.demand * demand +
          weights.competition * competition
        ) / wSum * 10) : 70; // 0-100 score

        return {
          ...s,
          scores: { accessibility, demand, competition, overall }
        };
      })
      .sort((a, b) => b.scores.overall - a.scores.overall);
  }, [provinsi, weights]);

  // Get filtered SPKLU chargers for the selected province & selected operators as helper markers
  const helperChargers = useMemo(() => {
    let filtered = provinsi
      ? chargersData.filter(c => (c.provinsi || '').trim() === provinsi)
      : chargersData;

    filtered = filtered.filter(c => c.operator && selectedOperators.includes(c.operator.trim()));

    // Slice to prevent map lag under high marker count (e.g. Semua Provinsi)
    return filtered.slice(0, 250);
  }, [provinsi, selectedOperators]);

  // Pertamina/SPBU markers filtered by province
  const filteredSpbu = useMemo(() => {
    if (!provinsi) return spbuLocations;
    return spbuLocations.filter(s => (s.provinsi || '').trim() === provinsi);
  }, [provinsi]);

  // Combine SPKLU, SPBU, and searchable addresses into searchable list
  const allSearchableItems = useMemo(() => {
    const items = [];

    // 1. SPBU Locations
    spbuLocations
      .filter(s => !provinsi || s.provinsi === provinsi)
      .forEach(s => {
        items.push({
          id: s.id,
          name: s.name,
          address: s.address,
          lat: s.lat,
          lng: s.lng,
          type: 'SPBU',
          badgeColor: '#22c55e'
        });
      });

    // 2. SPKLU Locations
    helperChargers.forEach(c => {
      items.push({
        id: c.id || Math.random().toString(),
        name: c.name,
        address: c.location_description || c.address || 'Lokasi SPKLU',
        lat: c.lat,
        lng: c.lng,
        type: 'SPKLU',
        badgeColor: '#fbbf24'
      });
    });

    // 3. General Addresses / Landmarks
    searchableAddresses.forEach(a => {
      const provMatch = !provinsi ||
        (provinsi === 'DKI Jakarta' && a.name.toLowerCase().includes('jakarta')) ||
        (provinsi === 'Jawa Barat' && a.name.toLowerCase().includes('bandung')) ||
        (provinsi === 'Bali' && a.name.toLowerCase().includes('bali')) ||
        (provinsi === 'Jawa Timur' && (a.name.toLowerCase().includes('surabaya') || a.name.toLowerCase().includes('timur')));

      if (provMatch) {
        items.push({
          id: a.name,
          name: a.name,
          address: `${a.type === 'spbu' ? 'Stasiun Pengisian Bahan Bakar' : 'Landmark/Wilayah'}, ${a.name}`,
          lat: a.lat,
          lng: a.lng,
          type: a.type === 'spbu' ? 'SPBU' : 'Wilayah',
          badgeColor: a.type === 'spbu' ? '#22c55e' : '#3b82f6'
        });
      }
    });

    return items;
  }, [provinsi, helperChargers]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allSearchableItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, allSearchableItems]);

  // Calculate dynamic overall score for whitespaces and sort by overall score descending
  const calculatedWhitespaces = useMemo(() => {
    const catKey = categoryKeyMap[type];
    let filtered = whitespacePoints.filter(wp => wp.category === catKey);
    if (provinsi) {
      filtered = filtered.filter(wp => wp.provinsi === provinsi);
    }

    return filtered.map(ws => {
      const wSum = weights.accessibility + weights.demand + weights.competition;
      let overall = 0;
      if (wSum > 0) {
        overall = Math.round(
          (weights.accessibility * ws.scores.traffic +
            weights.demand * ws.scores.poiDensity +
            weights.competition * ws.scores.competition) / wSum * 10
        );
      }

      // Determine recommendation label based on dynamic score
      let recommendation = "KURANG LAYAK";
      if (overall >= 85) recommendation = "SANGAT DIREKOMENDASIKAN";
      else if (overall >= 70) recommendation = "LAYAK";
      else if (overall >= 50) recommendation = "CUKUP LAYAK";

      return {
        ...ws,
        scores: {
          ...ws.scores,
          overall,
          recommendation
        }
      };
    }).sort((a, b) => b.scores.overall - a.scores.overall);
  }, [type, weights, provinsi]);

  // Alias for ease of integration
  const relevantWhitespaces = calculatedWhitespaces;

  // Use dynamically calculated top 10 priority grids based on current criteria weights
  const grids = useMemo(() => {
    const usesFastFields = type === 'fast' || type === 'highspeed';
    const poiKey = usesFastFields ? 'poi_fast' : 'poi_medium';
    const supplyKey = usesFastFields ? 'supply_fast' : 'supply_medium';

    // Find max POI to normalize
    let maxP = 1;
    gridCells.forEach(cell => {
      const p = cell[poiKey] || 0;
      if (p > maxP) maxP = p;
    });

    const scoredCells = gridCells.map(cell => {
      const poiCount = cell[poiKey] || 0;
      const supplyCount = cell[supplyKey] || 0;

      const poiDensityScore = (poiCount / maxP) * 10;
      const competitionScore = Math.max(0, 10 - supplyCount * 2);

      // Deterministic but realistic traffic score based on cell location
      const cellLat = cell.lat || -6.2;
      const cellLng = cell.lng || 106.8;
      const cellSeed = Math.round(Math.abs(cellLat * 1000 + cellLng * 1000));
      const trafficScore = 4 + (pseudoRandom(cellSeed + 2, cellSeed + 3, 20) * 6);

      const wSum = weights.accessibility + weights.demand + weights.competition;
      const dGapScore = wSum > 0 ? (
        weights.accessibility * trafficScore +
        weights.demand * poiDensityScore +
        weights.competition * competitionScore
      ) / wSum : 0;

      // Scale to 0-200 to match the original gap score styling
      const gapScore = dGapScore * 20;

      return {
        gridId: cell.gid,
        poiCount,
        gapScore
      };
    });

    // Sort and take top 10
    return scoredCells.sort((a, b) => b.gapScore - a.gapScore).slice(0, 10);
  }, [type, weights]);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const lastViewRef = useRef({ type: null, provinsi: null });

  // Max histogram count for scaling
  const maxCount = Math.max(...distribution.counts);



  const prevProvinsiRef = useRef(provinsi);

  // Hook 1: Initialize Leaflet map instance once on mount, clean up on unmount
  useEffect(() => {
    if (!mapRef.current) return;

    const center = PROVINCE_CENTERS[provinsi || ''] || PROVINCE_CENTERS[''];

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: center.zoom,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      lastViewRef.current = { type: null, provinsi: null };
    };
  }, []); // Only run once on mount

  // Sync map center only when selected province changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (prevProvinsiRef.current !== provinsi) {
      prevProvinsiRef.current = provinsi;

      // 1. Check if we have customized center coordinates
      if (provinsi && PROVINCE_CENTERS[provinsi]) {
        const center = PROVINCE_CENTERS[provinsi];
        map.setView([center.lat, center.lng], center.zoom);
        return;
      }

      // 2. If Semual Provinsi, use national zoom
      if (!provinsi) {
        const center = PROVINCE_CENTERS[''];
        map.setView([center.lat, center.lng], center.zoom);
        return;
      }

      // 3. Dynamic fitBounds to all chargers in the selected province
      const provinceChargers = chargersData.filter(
        c => (c.provinsi || '').trim() === provinsi && c.lat && c.lng
      );

      if (provinceChargers.length > 0) {
        const bounds = L.latLngBounds(provinceChargers.map(c => [c.lat, c.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      } else {
        // Fallback to national zoom if no markers exist in province
        const center = PROVINCE_CENTERS[''];
        map.setView([center.lat, center.lng], center.zoom);
      }
    }
  }, [provinsi]);

  // Hook 2: Dynamic layers updates (runs when filters, weights, type, or helpers change)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous layers
    layersRef.current.forEach((layer) => layer.remove());
    layersRef.current = [];

    const speedKw = info.power;
    const speedLabel = info.label;

    const usesFastFields = type === 'fast' || type === 'highspeed';
    const poiKey = usesFastFields ? 'poi_fast' : 'poi_medium';
    const supplyKey = usesFastFields ? 'supply_fast' : 'supply_medium';

    // Find max POI to normalize
    let maxP = 1;
    gridCells.forEach(cell => {
      const p = cell[poiKey] || 0;
      if (p > maxP) maxP = p;
    });

    const shouldRenderGrid = !provinsi || provinsi === 'DKI Jakarta';

    if (shouldRenderGrid && layerToggles.whitespace) {
      gridCells.forEach(cell => {
        const poiCount = cell[poiKey] || 0;
        const supplyCount = cell[supplyKey] || 0;

        // Skip cells with zero activity (nothing to show)
        if (poiCount === 0 && supplyCount === 0) return;

        const halfCell = CELL_SIZE_DEG / 2;
        const bounds = [
          [cell.lat - halfCell, cell.lng - halfCell],
          [cell.lat + halfCell, cell.lng + halfCell]
        ];

        // Sub-scores calculation for dynamic selection
        const poiDensityScore = (poiCount / maxP) * 10;
        const competitionScore = Math.max(0, 10 - supplyCount * 2);

        // Deterministic but realistic traffic and PLN scores based on cell location
        const cellLat = cell.lat || -6.2;
        const cellLng = cell.lng || 106.8;
        const cellSeed = Math.round(Math.abs(cellLat * 1000 + cellLng * 1000));
        const trafficScore = 4 + (pseudoRandom(cellSeed + 2, cellSeed + 3, 20) * 6);
        const plnGridScore = 5 + (pseudoRandom(cellSeed, cellSeed + 1, 10) * 5);

        const wSum = weights.accessibility + weights.demand + weights.competition;
        const dGapScore = wSum > 0 ? (
          weights.accessibility * trafficScore +
          weights.demand * poiDensityScore +
          weights.competition * competitionScore
        ) / wSum : 0;

        // Scale to 0-200 to match the original gap score styling
        const dynamicGapScore = dGapScore * 20;

        const isSupplyCell = supplyCount > 0 && dynamicGapScore <= 0;

        let fillColor, fillOpacity, strokeColor, strokeWeight;
        if (isSupplyCell) {
          fillColor = '#4c72b0';
          fillOpacity = 0.2 + Math.min(supplyCount / 15, 0.4);
          strokeColor = '#4c72b0';
          strokeWeight = 0.3;
        } else if (dynamicGapScore > 0) {
          const [r, g, b, a] = cell.fill_color || [239, 68, 68, 60];
          fillColor = `rgb(${r},${g},${b})`;
          const scaleFactor = dGapScore / 5;
          fillOpacity = Math.max(0.04, Math.min(0.85, (a / 255) * scaleFactor));
          strokeColor = `rgb(${r},${g},${b})`;
          strokeWeight = 0.3;
        } else {
          fillColor = '#c44e52';
          fillOpacity = 0.04;
          strokeColor = '#c44e52';
          strokeWeight = 0;
        }

        const rect = L.rectangle(bounds, {
          color: strokeColor,
          weight: strokeWeight,
          fillColor,
          fillOpacity,
          interactive: true
        }).addTo(map);

        // BUG FIX: sticky:false prevents multiple ghost tooltips from showing simultaneously
        rect.bindTooltip(`
          <div style="font-family:'Inter',sans-serif;font-size:11px;line-height:1.6;white-space:nowrap;">
            <div><b>Grid ID:</b> ${cell.gid}</div>
            <div><b>Aksesibilitas:</b> ${trafficScore.toFixed(1)}/10</div>
            <div><b>Demand (POI):</b> ${poiCount} (Skor: ${poiDensityScore.toFixed(1)}/10)</div>
            <div><b>Supply (Kompetisi):</b> ${supplyCount} (Skor: ${competitionScore.toFixed(1)}/10)</div>
            <div><b>Kapasitas Grid PLN:</b> ${plnGridScore.toFixed(1)}/10</div>
            <div style="border-top:1px solid #ebebeb;margin-top:4px;padding-top:4px;"><b>Dynamic Gap Score:</b> ${dynamicGapScore.toFixed(1)}</div>
          </div>
        `, {
          sticky: false,
          direction: 'top',
          opacity: 0.97,
          className: 'grid-cell-tooltip'
        });

        // Click handler on gap cells with distance threshold
        if (dynamicGapScore > 0) {
          rect.on('click', () => {
            let closest = null;
            let minDist = Infinity;
            relevantWhitespaces.forEach(ws => {
              const d = Math.pow(ws.lat - cell.lat, 2) + Math.pow(ws.lng - cell.lng, 2);
              if (d < minDist) {
                minDist = d;
                closest = ws;
              }
            });

            const DISTANCE_THRESHOLD = 0.025;
            const actualDist = Math.sqrt(minDist);

            if (closest && actualDist <= DISTANCE_THRESHOLD) {
              const cards = document.querySelectorAll('.rec-card');
              cards.forEach(card => {
                const nameEl = card.querySelector('.rec-card-name');
                if (nameEl && nameEl.textContent === closest.name) {
                  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  card.style.borderColor = '#ff385c';
                  card.style.boxShadow = '0 0 0 3px rgba(255, 56, 92, 0.2)';
                  setTimeout(() => {
                    card.style.borderColor = '';
                    card.style.boxShadow = '';
                  }, 2000);
                }
              });
            } else {
              L.popup()
                .setLatLng([cell.lat, cell.lng])
                .setContent(`
                  <div style="font-family:'Inter',sans-serif;font-size:12px;line-height:1.5;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:4px;color:${info.color}">Grid Cell Info</div>
                    <div><b>Grid ID:</b> ${cell.gid}</div>
                    <div><b>${speedLabel} POIs:</b> ${poiCount}</div>
                    <div><b>Supply:</b> ${supplyCount}</div>
                    <div><b>Dynamic Gap Score:</b> ${dynamicGapScore.toFixed(1)}</div>
                    <div style="margin-top:6px;font-size:10px;color:#717171;border-top:1px solid #ebebeb;padding-top:4px;">
                      Tidak ada rekomendasi prioritas utama dalam radius 2.5 km dari titik ini.
                    </div>
                  </div>
                `)
                .openOn(map);
            }
          });
        }

        layersRef.current.push(rect);
      });
    }

    // Add SPKLU helper markers (small orange dots) — guarded by layer toggle
    if (layerToggles.spkluMarkers) {
      helperChargers.forEach(charger => {
        if (!charger.lat || !charger.lng) return;
        const marker = L.circleMarker([charger.lat, charger.lng], {
          radius: 3,
          fillColor: '#fbbf24',
          color: '#b45309',
          weight: 1,
          fillOpacity: 0.7,
        }).addTo(map);
        marker.bindTooltip(charger.name || 'SPKLU', { direction: 'top', sticky: false });
        layersRef.current.push(marker);
      });
    }

    // Add Pertamina/SPBU markers (green diamonds) — guarded by layer toggle
    if (layerToggles.spbuMarkers) {
      filteredSpbu.forEach(spbu => {
        if (!spbu.lat || !spbu.lng) return;
        const marker = L.circleMarker([spbu.lat, spbu.lng], {
          radius: 5,
          fillColor: '#22c55e',
          color: '#15803d',
          weight: 1.5,
          fillOpacity: 0.85,
        }).addTo(map);
        marker.bindTooltip(`<b>${spbu.name}</b>`, { direction: 'top', sticky: false });
        layersRef.current.push(marker);
      });
    }

    // Add whitespace opportunity circles — guarded by layer toggle
    if (layerToggles.opportunityMarkers) {
      relevantWhitespaces.forEach(ws => {
        const circle = L.circle([ws.lat, ws.lng], {
          radius: ws.radius,
          fillColor: info.color,
          color: info.color,
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '6 3',
        }).addTo(map);

        const centerMarker = L.circleMarker([ws.lat, ws.lng], {
          radius: 6,
          fillColor: info.color,
          color: '#fff',
          weight: 2,
          fillOpacity: 1,
        }).addTo(map);

        const popupContent = `
          <div style="font-family:Inter,sans-serif;min-width:200px">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px">${ws.name}</div>
            <div style="font-size:12px;color:#666;margin-bottom:8px">${ws.city}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f9f9f9;border-radius:8px">
              <div>
                <div style="font-size:11px;color:#888">Skor Kelayakan</div>
                <div style="font-size:20px;font-weight:700;color:${info.color}">${ws.scores.overall}%</div>
              </div>
              <div style="padding:4px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${ws.scores.recommendation.includes('SANGAT') ? '#dcfce7' : '#fef3c7'};color:${ws.scores.recommendation.includes('SANGAT') ? '#166534' : '#92400e'}">${ws.scores.recommendation}</div>
            </div>
          </div>
        `;
        centerMarker.bindPopup(popupContent, { maxWidth: 280 });

        layersRef.current.push(circle, centerMarker);
      });
    }

  }, [type, provinsi, helperChargers, filteredSpbu, relevantWhitespaces, info.color, weights, layerToggles]);

  const getRecommendationBadgeClass = (rec) => {
    if (rec.includes('SANGAT')) return 'badge-rec-high';
    if (rec.includes('LAYAK')) return 'badge-rec-medium';
    return 'badge-rec-low';
  };

  return (
    <div className="charging-detail" style={{ '--type-color': info.color, '--type-color-light': info.colorLight }}>
      {/* A. Use Case Description */}
      <div className="detail-usecase">
        <div className="usecase-header">
          <h3 className="usecase-title">{info.subtitle} ({info.power})</h3>
          <span className="usecase-tagline">{info.tagline}</span>
        </div>
        <p className="usecase-description">{info.description}</p>
        <p className="usecase-insight">{info.insight}</p>

        <div className="usecase-meta-grid">
          <div className="meta-item">
            <Clock size={14} />
            <div>
              <div className="meta-label">Dwell Time</div>
              <div className="meta-value">{info.dwellTime}</div>
            </div>
          </div>
          <div className="meta-item">
            <User size={14} />
            <div>
              <div className="meta-label">Target User</div>
              <div className="meta-value">{info.userProfile}</div>
            </div>
          </div>
          <div className="meta-item">
            <MapPin size={14} />
            <div>
              <div className="meta-label">Lokasi Ideal</div>
              <div className="meta-value">{info.idealLocations.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* B. Statistics & Distribution */}
      <div className="detail-stats">
        <div className="stats-grid-2col">
          {/* Histogram */}
          <div className="chart-card">
            <h3 className="chart-title">The Opportunity Tail</h3>
            <p className="chart-subtitle">
              The vast majority of the city has low demand. We target the extreme right tail:
              the highly underserved micro-economies.
            </p>
            <div className="histogram">
              <div className="histogram-bars">
                {distribution.counts.map((count, i) => (
                  <div key={i} className="hist-bar-col">
                    <div
                      className="hist-bar"
                      style={{
                        height: `${(count / maxCount) * 100}%`,
                        backgroundColor: count > maxCount * 0.6 ? `${info.color}30` : info.color,
                        opacity: count > maxCount * 0.3 ? 0.5 : 1,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="histogram-axis">
                <span>0</span>
                <span className="histogram-axis-label">Gap Score (Demand / Supply)</span>
                <span>200</span>
              </div>
            </div>
          </div>

          {/* Priority Grid Table */}
          <div className="chart-card">
            <h3 className="chart-title">Top 10 Priority Grids</h3>
            <table className="priority-table">
              <thead>
                <tr>
                  <th>Grid ID</th>
                  <th>POI Count</th>
                  <th>Gap Score</th>
                </tr>
              </thead>
              <tbody>
                {grids.map((row, i) => (
                  <tr key={row.gridId}>
                    <td className="grid-id-cell">
                      <code>{row.gridId}</code>
                    </td>
                    <td>{row.poiCount}</td>
                    <td>
                      <span className="gap-score-badge" style={{ backgroundColor: info.colorLight, color: info.color }}>
                        {row.gapScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* C. Whitespace Map (Main Feature) */}
      <div className="detail-map-section" style={{ '--type-color': info.color, '--type-color-light': info.colorLight }}>
        <div className="map-header-row">
          <div className="map-header-info">
            <h3 className="chart-title">{info.subtitle} ({info.power})</h3>
            <p className="chart-subtitle">
              {type === 'slow' && 'Residential zones with high EV density but no overnight charging options.'}
              {type === 'medium' && 'Commercial areas with high foot traffic but insufficient destination chargers.'}
              {type === 'fast' && 'Transit corridors where drivers need rapid top-ups between trips.'}
              {type === 'highspeed' && 'Highway segments and premium zones lacking ultrafast charging infrastructure.'}
            </p>
          </div>
        </div>

        {/* Dual-column Wrapper: Sidebar controls + Map */}
        <div className="map-and-sidebar-wrapper">
          {/* Sidebar Kontrol Kriteria */}
          <div className="map-sidebar">
            {/* Region & Speed Selector Group */}
            <div className="sidebar-group-card" style={{ marginBottom: '10px' }}>
              <div className="sidebar-control-group">
                <span className="control-label" style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#717171', marginBottom: '6px', display: 'block' }}>Region</span>
                <select
                  className="map-select"
                  value={provinsi || ''}
                  onChange={(e) => onChangeProvinsi && onChangeProvinsi(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ebebeb', fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#222', background: '#fff' }}
                >
                  <option value="">Semua Provinsi</option>
                  {uniqueProvinces.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div className="sidebar-control-group" style={{ marginTop: '10px' }}>
                <span className="control-label" style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#717171', marginBottom: '6px', display: 'block' }}>Speed Tier</span>
                <div className="map-speed-pills" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'slow', label: 'Slow' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'fast', label: 'Fast' },
                    { id: 'highspeed', label: 'Ultrafast' }
                  ].map(speed => (
                    <button
                      key={speed.id}
                      className={`speed-pill ${type === speed.id ? 'active' : ''}`}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ebebeb',
                        background: type === speed.id ? info.color : '#fff',
                        color: type === speed.id ? '#fff' : '#484848',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'center'
                      }}
                      onClick={() => onChangeType && onChangeType(speed.id)}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h4 className="map-sidebar-title">Kriteria Pemilihan Lokasi</h4>
            <p className="map-sidebar-desc">
              Atur bobot kriteria di bawah ini untuk mensimulasikan kelayakan area secara dinamis.
            </p>

            <div className="criteria-group">
              {/* 1. Aksesibilitas */}
              <div className="criteria-item">
                <div className="criteria-header">
                  <span className="criteria-label-with-icon">
                    <Navigation className="criteria-icon" size={16} style={{ color: '#10b981' }} />
                    Aksesibilitas
                  </span>
                  <span className="criteria-value">{weights.accessibility}.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.accessibility}
                  onChange={(e) => setWeights(prev => ({ ...prev, accessibility: parseInt(e.target.value, 10) }))}
                  className="criteria-slider"
                  style={{ '--type-color': info.color }}
                />
                <p className="criteria-desc">Jangkauan isochrone (waktu tempuh nyata) & friksi akses lokal (arah jalan, putar balik, barrier fisik).</p>
              </div>

              {/* 2. Demand */}
              <div className="criteria-item">
                <div className="criteria-header">
                  <span className="criteria-label-with-icon">
                    <Building2 className="criteria-icon" size={16} style={{ color: '#f59e0b' }} />
                    Demand (Kebutuhan)
                  </span>
                  <span className="criteria-value">{weights.demand}.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.demand}
                  onChange={(e) => setWeights(prev => ({ ...prev, demand: parseInt(e.target.value, 10) }))}
                  className="criteria-slider"
                  style={{ '--type-color': info.color }}
                />
                <p className="criteria-desc">Demografi, daya beli, POI & dealer EV (BYD, Wuling), dwelling time, & sinyal aplikasi charging.</p>
              </div>

              {/* 3. Kompetisi */}
              <div className="criteria-item">
                <div className="criteria-header">
                  <span className="criteria-label-with-icon">
                    <LayoutGrid className="criteria-icon" size={16} style={{ color: '#ef4444' }} />
                    Kompetisi
                  </span>
                  <span className="criteria-value">{weights.competition}.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.competition}
                  onChange={(e) => setWeights(prev => ({ ...prev, competition: parseInt(e.target.value, 10) }))}
                  className="criteria-slider"
                  style={{ '--type-color': info.color }}
                />
                <p className="criteria-desc">Peta SPKLU eksisting (Pertamina + brand lain) untuk gap & white-space analysis (menghindari kanibalisasi).</p>
              </div>
            </div>

            {/* Presets Panel */}
            <div className="presets-container">
              <h5 className="presets-title">Presets Cepat</h5>
              <div className="presets-grid">
                {[
                  { id: 'equal', label: 'Bobot Seimbang', w: { accessibility: 5, demand: 5, competition: 5 } },
                  { id: 'transit', label: 'Fokus Transit (Tol/Raya)', w: { accessibility: 10, demand: 4, competition: 5 } },
                  { id: 'retail', label: 'Fokus Ritel (Destinasi)', w: { accessibility: 4, demand: 10, competition: 5 } },
                  { id: 'avoid-comp', label: 'Fokus Celah Pasar', w: { accessibility: 5, demand: 5, competition: 10 } }
                ].map(preset => {
                  const isActive = weights.accessibility === preset.w.accessibility &&
                    weights.demand === preset.w.demand &&
                    weights.competition === preset.w.competition;
                  return (
                    <button
                      key={preset.id}
                      className={`preset-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setWeights(preset.w)}
                      style={isActive ? { '--type-color': info.color, '--type-color-light': info.colorLight } : {}}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Map Container — inner wrapper menjadi relative anchor untuk floating panel */}
          <div className="map-content-wrapper">
            <div className="map-inner-wrap">
              <div className="map-container" ref={mapRef} />

              {/* Floating Controls — pojok kiri atas peta */}
              <div className="map-top-left-controls">
                {/* Search Bar */}
                <div className="map-search-wrapper" style={{ position: 'relative' }}>
                  <div className="map-search-bar">
                    <Search size={14} className="map-search-icon" />
                    <input
                      type="text"
                      placeholder="Cari SPBU / SPKLU..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="map-search-input"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="map-search-clear"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Suggestions list */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="map-search-dropdown">
                      {filteredSuggestions.map((item) => (
                        <div
                          key={item.id + '-' + item.type}
                          className="map-search-suggestion-item"
                          onClick={() => {
                            setSearchQuery(item.name);
                            setShowSuggestions(false);
                            const map = mapInstanceRef.current;
                            if (map) {
                              map.flyTo([item.lat, item.lng], 16, { duration: 1.5 });
                              L.popup()
                                .setLatLng([item.lat, item.lng])
                                .setContent(`
                                  <div style="font-family:'Inter',sans-serif;font-size:12px;line-height:1.4;min-width:140px;">
                                    <div style="font-weight:700;color:${item.badgeColor}">${item.type}</div>
                                    <div style="font-weight:600;margin-top:2px;">${item.name}</div>
                                    <div style="font-size:11px;color:#666;margin-top:2px;">${item.address}</div>
                                  </div>
                                `)
                                .openOn(map);
                            }
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="suggestion-name" style={{ fontWeight: 600, fontSize: '12px' }}>{item.name}</span>
                            <span className="suggestion-type-badge" style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '3px', backgroundColor: item.badgeColor + '20', color: item.badgeColor, fontWeight: 700 }}>
                              {item.type}
                            </span>
                          </div>
                          <div className="suggestion-address" style={{ fontSize: '10px', color: '#666', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.address}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Provider Checkbox Dropdown */}
                <div className="map-provider-dropdown-wrapper" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className={`map-provider-btn ${showProviderDropdown ? 'active' : ''}`}
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#222',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.15s ease',
                      height: '34px'
                    }}
                  >
                    Provider ({selectedOperators.length})
                    <span style={{ fontSize: '8px', opacity: 0.7 }}>▼</span>
                  </button>

                  {showProviderDropdown && (
                    <div className="map-provider-dropdown-card" style={{
                      position: 'absolute',
                      top: '40px',
                      left: 0,
                      background: '#fff',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      zIndex: 1000,
                      minWidth: '220px',
                      maxWidth: '280px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.04em' }}>Provider SPKLU</span>
                        <span style={{ fontSize: '10px', color: '#717171', fontWeight: 500 }}>{selectedOperators.length}/{availableOperators.length}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOperators(availableOperators)}
                          style={{ background: 'none', border: 'none', padding: 0, color: info.color, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                          Semua
                        </button>
                        <span style={{ color: '#ebebeb' }}>|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedOperators([])}
                          style={{ background: 'none', border: 'none', padding: 0, color: '#717171', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="map-provider-checkbox-list" style={{
                        maxHeight: '160px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '4px 0'
                      }}>
                        {availableOperators.length === 0 ? (
                          <span style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>Tidak ada provider</span>
                        ) : (
                          availableOperators.map(op => {
                            const isChecked = selectedOperators.includes(op);
                            return (
                              <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#222', cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedOperators(prev => [...prev, op]);
                                    } else {
                                      setSelectedOperators(prev => prev.filter(x => x !== op));
                                    }
                                  }}
                                  style={{ accentColor: info.color, cursor: 'pointer' }}
                                />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op}</span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Layer Toggle — benar-benar di atas peta, pojok kanan bawah */}
              <div className="map-layer-toggle-panel">
                <div className="map-layer-toggle-title">Layer</div>
                {[
                  { key: 'whitespace', label: 'Whitespace', color: '#ef4444' },
                  { key: 'spkluMarkers', label: 'SPKLU', color: '#fbbf24' },
                  { key: 'spbuMarkers', label: 'SPBU / Pertamina', color: '#22c55e' },
                  { key: 'opportunityMarkers', label: 'Opportunity Markers', color: info.color },
                ].map(({ key, label, color }) => (
                  <label key={key} className="map-layer-toggle-row">
                    <input
                      type="checkbox"
                      checked={layerToggles[key]}
                      onChange={() => toggleLayer(key)}
                      style={{ accentColor: color, cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span className="map-layer-toggle-dot" style={{ background: color }} />
                    <span className="map-layer-toggle-label">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-swatch" style={{ background: '#3b82f6', opacity: 0.4 }} />
            <span>Existing Supply</span>
          </div>
          <div className="legend-item">
            <span className="legend-gradient" />
            <span>Demand Gap Intensity</span>
          </div>
          <div className="legend-label-row">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#fbbf24', border: '1px solid #b45309' }} />
            <span>Existing SPKLU</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#22c55e', border: '1px solid #15803d' }} />
            <span>SPBU / Pertamina</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: info.color, border: '2px solid #fff', boxShadow: '0 0 0 1px ' + info.color }} />
            <span>Whitespace Opportunity</span>
          </div>
        </div>
      </div>

      {/* D. Recommendations & SPBU Ranking Tabs */}
      <div className="detail-recommendations" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #ebebeb', marginBottom: '16px', gap: '16px' }}>
          <button
            onClick={() => setActiveListTab('whitespace')}
            className={`list-tab-btn ${activeListTab === 'whitespace' ? 'active' : ''}`}
            style={{
              padding: '10px 4px',
              fontWeight: 600,
              fontSize: '15px',
              background: 'none',
              border: 'none',
              borderBottom: activeListTab === 'whitespace' ? `2px solid ${info.color}` : '2px solid transparent',
              color: activeListTab === 'whitespace' ? '#222' : '#717171',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Rekomendasi Whitespace ({relevantWhitespaces.length})
          </button>
          <button
            onClick={() => setActiveListTab('spbu')}
            className={`list-tab-btn ${activeListTab === 'spbu' ? 'active' : ''}`}
            style={{
              padding: '10px 4px',
              fontWeight: 600,
              fontSize: '15px',
              background: 'none',
              border: 'none',
              borderBottom: activeListTab === 'spbu' ? `2px solid ${info.color}` : '2px solid transparent',
              color: activeListTab === 'spbu' ? '#222' : '#717171',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Ranking Kemitraan SPBU ({rankedSpbus.length})
          </button>
        </div>

        {/* Tab 1: Whitespace Opportunities */}
        {activeListTab === 'whitespace' && (
          <div className="rec-cards-grid">
            {relevantWhitespaces.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: '#888', fontStyle: 'italic' }}>
                Tidak ada peluang whitespace di wilayah ini.
              </div>
            ) : (
              relevantWhitespaces.map((ws) => (
                <div key={ws.id} className="rec-card" style={{ borderTopColor: info.color }}>
                  <div className="rec-card-header">
                    <div>
                      <h4 className="rec-card-name">{ws.name}</h4>
                      <div className="rec-card-city">{ws.city}</div>
                    </div>
                    <div className="rec-score-circle">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="circle" stroke={info.color} strokeDasharray={`${ws.scores.overall}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <text x="18" y="20.35" className="percentage">{ws.scores.overall}%</text>
                      </svg>
                    </div>
                  </div>

                  <span className={`recommendation-badge ${getRecommendationBadgeClass(ws.scores.recommendation)}`}>
                    <Award size={11} style={{ marginRight: '3px' }} />
                    {ws.scores.recommendation}
                  </span>

                  <div className="rec-metrics">
                    <div className="rec-metric">
                      <Navigation size={12} style={{ color: '#10b981' }} />
                      <span className="rec-metric-label">Aksesibilitas</span>
                      <span className="rec-metric-score">{ws.scores.traffic}/10</span>
                    </div>
                    <div className="rec-metric">
                      <Building2 size={12} style={{ color: '#f59e0b' }} />
                      <span className="rec-metric-label">Demand</span>
                      <span className="rec-metric-score">{ws.scores.poiDensity}/10</span>
                    </div>
                    <div className="rec-metric">
                      <LayoutGrid size={12} style={{ color: '#ef4444' }} />
                      <span className="rec-metric-label">Kompetisi</span>
                      <span className="rec-metric-score">{ws.scores.competition}/10</span>
                    </div>
                  </div>

                  <p className="rec-description">{ws.scores.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: SPBU Partnership Ranking */}
        {activeListTab === 'spbu' && (
          <div className="rec-cards-grid">
            {rankedSpbus.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: '#888', fontStyle: 'italic' }}>
                Tidak ada SPBU Pertamina terdaftar di wilayah ini.
              </div>
            ) : (
              rankedSpbus.map((spbu, idx) => (
                <div key={spbu.id} className="rec-card" style={{ borderTopColor: '#22c55e' }}>
                  <div className="rec-card-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e2fbeb', color: '#15803d' }}>
                          Peringkat #{idx + 1}
                        </span>
                      </div>
                      <h4 className="rec-card-name" style={{ marginTop: '6px' }}>{spbu.name}</h4>
                      <div className="rec-card-city">{spbu.address}</div>
                    </div>
                    <div className="rec-score-circle">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="circle" stroke="#22c55e" strokeDasharray={`${spbu.scores.overall}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <text x="18" y="20.35" className="percentage">{spbu.scores.overall}%</text>
                      </svg>
                    </div>
                  </div>

                  <span className={`recommendation-badge badge-rec-high`} style={{ backgroundColor: '#e2fbeb', color: '#15803d' }}>
                    <MapPin size={11} style={{ marginRight: '3px' }} />
                    Skor Kemitraan SPBU
                  </span>

                  <div className="rec-metrics">
                    <div className="rec-metric">
                      <Navigation size={12} style={{ color: '#10b981' }} />
                      <span className="rec-metric-label">Aksesibilitas</span>
                      <span className="rec-metric-score">{spbu.scores.accessibility}/10</span>
                    </div>
                    <div className="rec-metric">
                      <Building2 size={12} style={{ color: '#f59e0b' }} />
                      <span className="rec-metric-label">Demand</span>
                      <span className="rec-metric-score">{spbu.scores.demand}/10</span>
                    </div>
                    <div className="rec-metric">
                      <LayoutGrid size={12} style={{ color: '#ef4444' }} />
                      <span className="rec-metric-label">Celah Pasar</span>
                      <span className="rec-metric-score">{spbu.scores.competition}/10</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        const map = mapInstanceRef.current;
                        if (map) {
                          map.flyTo([spbu.lat, spbu.lng], 16, { duration: 1.5 });
                          L.popup()
                            .setLatLng([spbu.lat, spbu.lng])
                            .setContent(`
                              <div style="font-family:'Inter',sans-serif;font-size:12px;line-height:1.4;min-width:160px;">
                                <div style="font-weight:700;color:#22c55e">SPBU Pertamina (Mitra)</div>
                                <div style="font-weight:600;margin-top:2px;">${spbu.name}</div>
                                <div style="font-size:11px;color:#666;margin-top:2px;">${spbu.address}</div>
                                <div style="margin-top:6px;border-top:1px solid #ebebeb;padding-top:4px;font-weight:700;">Skor Kelayakan: ${spbu.scores.overall}%</div>
                              </div>
                            `)
                            .openOn(map);

                          // Smooth scroll up to the map
                          const mapContainer = document.querySelector('.map-content-wrapper');
                          if (mapContainer) {
                            mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#22c55e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
                    >
                      Fokus Peta
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
