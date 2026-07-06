import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { whitespacePoints, spbuLocations, plnLocations } from '../data/planningData';

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
  return id;
};

// Grid config
const GRID_ROWS = 20;
const GRID_COLS = 20;
const GRID_SPAN_DEG = 0.35; // ~38km span total for the grid

export default function ChargerMap({ 
  chargers, 
  activeChargerId, 
  onSelectCharger, 
  onOpenDetail,
  activeHeatmap,
  visiblePOIs = ['spklu', 'spbu', 'pln'],
  onSelectWhitespace,
  searchedLocation,
  selectedProvinsi
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const planningLayersRef = useRef([]);

  // Initialize Map
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-6.20, 106.82],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when chargers list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const displayedChargers = chargers.slice(0, 50);

    displayedChargers.forEach((charger) => {
      const minPrice = Math.min(...charger.connectors.map(c => c.price));
      const formattedPrice = `Rp ${(minPrice / 1000).toFixed(1)}k`;
      const isActive = activeChargerId === charger.id;

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="price-tag-marker ${isActive ? 'active' : ''}">${formattedPrice}</div>`,
        iconSize: [60, 28],
        iconAnchor: [30, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([charger.lat, charger.lng], { icon }).addTo(map);

      const getProviderLogoBadgeHtml = (operator) => {
        const op = (operator || '').toLowerCase();
        if (op.includes('pln')) return `<div class="popup-logo-card pln"><svg viewBox="0 0 24 24" class="popup-logo-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FFD000"/></svg><span class="popup-logo-text" style="color:#ffffff;">PLN SPKLU</span></div>`;
        if (op.includes('shell')) return `<div class="popup-logo-card shell"><svg viewBox="0 0 24 24" class="popup-logo-svg"><path d="M12 2C7.58 2 4 5.58 4 10c0 4.13 3.13 7.53 7.15 7.96l-.8 2.04H7.5v2h9v-2h-.85l-.8-2.04C16.87 17.53 20 14.13 20 10c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#e51837"/></svg><span class="popup-logo-text" style="color:#e51837;">SHELL</span></div>`;
        if (op.includes('voltron')) return `<div class="popup-logo-card voltron"><svg viewBox="0 0 24 24" class="popup-logo-svg" fill="none" stroke="#fff" stroke-width="2.5"><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="10" x2="22" y2="14"/><polygon points="11 9 7 12 10 12 9 15 13 12 10 12 11 9" fill="#fff" stroke="none"/></svg><span class="popup-logo-text" style="color:#ffffff;">VOLTRON</span></div>`;
        if (op.includes('starvo')) return `<div class="popup-logo-card starvo"><svg viewBox="0 0 24 24" class="popup-logo-svg" fill="#ffffff"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span class="popup-logo-text" style="color:#ffffff;">STARVO</span></div>`;
        if (op.includes('hyundai')) return `<div class="popup-logo-card hyundai"><svg viewBox="0 0 24 24" class="popup-logo-svg" fill="none" stroke="#fff" stroke-width="2.2"><ellipse cx="12" cy="12" rx="9" ry="6"/><path d="M9.5 9.2v5.6M14.5 9.2v5.6M9.5 12h5" stroke-width="2.5"/></svg><span class="popup-logo-text" style="color:#ffffff;">HYUNDAI</span></div>`;
        return `<div class="popup-logo-card generic"><svg viewBox="0 0 24 24" class="popup-logo-svg" fill="none" stroke="#ff385c" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span class="popup-logo-text" style="color:#444;font-size:8px;">${operator}</span></div>`;
      };

      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup-card';
      popupContent.innerHTML = `
        ${getProviderLogoBadgeHtml(charger.operator)}
        <div class="map-popup-info">
          <h4 class="map-popup-title">${charger.name}</h4>
          <p class="map-popup-price">Tarif: <span>Rp ${minPrice.toLocaleString('id-ID')}</span>/kWh</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => { onSelectCharger(charger); });
      markersRef.current[charger.id] = marker;
    });

    if (displayedChargers.length > 0) {
      const group = new L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 13 });
    }
  }, [chargers, activeChargerId, onSelectCharger, onOpenDetail, visiblePOIs]);

  // Update Planning Layers (Grid Heatmap and POIs)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    planningLayersRef.current.forEach((layer) => layer.remove());
    planningLayersRef.current = [];

    const activeProv = selectedProvinsi || "DKI Jakarta";

    // 1. SPATIAL ANALYSIS GRID OVERLAY
    if (activeHeatmap) {
      const avgLat = chargers.length > 0 ? chargers.reduce((sum, c) => sum + c.lat, 0) / chargers.length : -6.20;
      const avgLng = chargers.length > 0 ? chargers.reduce((sum, c) => sum + c.lng, 0) / chargers.length : 106.82;

      // Bounding box for the grid
      const halfSpan = GRID_SPAN_DEG / 2;
      const minLat = avgLat - halfSpan;
      const minLng = avgLng - halfSpan;
      const cellH = GRID_SPAN_DEG / GRID_ROWS;
      const cellW = GRID_SPAN_DEG / GRID_COLS;

      // Category seed for deterministic cell patterning per heatmap type
      const catSeed = { slow: 1, medium: 2, fast: 3, highspeed: 4 }[activeHeatmap] || 1;

      let speedKw = { slow: '7.4', medium: '22', fast: '50', highspeed: '120+' }[activeHeatmap] || '22';
      let speedLabel = { slow: 'Slow AC', medium: 'Destination', fast: 'Transit', highspeed: 'Highway Transit' }[activeHeatmap] || 'Destination';

      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const cellLat = minLat + row * cellH;
          const cellLng = minLng + col * cellW;

          const r1 = pseudoRandom(row, col, catSeed);
          const r2 = pseudoRandom(row + 100, col + 100, catSeed + 5);
          const r3 = pseudoRandom(row + 50, col + 50, catSeed + 13);

          // Render ~68% of cells to create natural gaps (white patches)
          if (r1 < 0.32) continue;

          // Classify cell: supply (blue) vs gap (red)
          // Bias: higher cells (top) tend to have more supply, lower cells have more gap
          const supplyBias = 0.4 + (row / GRID_ROWS) * 0.3;
          const isSupplyCell = r2 < supplyBias;

          // Gap intensity for red cells (0 = low, 1 = high)
          const gapScore = isSupplyCell ? 0 : Math.min(1, r3 * 1.4);

          const bounds = [
            [cellLat, cellLng],
            [cellLat + cellH, cellLng + cellW]
          ];

          // Supply cells: blue with low opacity
          // Gap cells: red with variable opacity based on gap score
          let fillColor, fillOpacity, strokeColor, strokeWeight;
          if (isSupplyCell) {
            fillColor = '#3b82f6';
            fillOpacity = 0.30 + r1 * 0.12;
            strokeColor = '#2563eb';
            strokeWeight = 0;
          } else {
            // Gradient red: low gap = light pink, high gap = deep red
            const red = Math.round(239 - gapScore * 40);
            const green = Math.round(68 - gapScore * 20);
            const blue = Math.round(68 - gapScore * 30);
            fillColor = `rgb(${red},${green},${blue})`;
            fillOpacity = 0.15 + gapScore * 0.40;
            strokeColor = '#dc2626';
            strokeWeight = 0;
          }

          // Tooltip data - deterministic but looks realistic
          const gridId = encodeGridId(avgLat, avgLng, row, col);
          const poiCount = Math.round(20 + r1 * 60);
          const supplyCount = isSupplyCell ? Math.round(3 + r2 * 15) : Math.round(r2 * 3);
          const gapScoreDisplay = isSupplyCell ? (r3 * 0.3).toFixed(16) : gapScore.toFixed(16);

          const rect = L.rectangle(bounds, {
            color: strokeColor,
            weight: strokeWeight,
            fillColor,
            fillOpacity,
            interactive: true
          }).addTo(map);

          // Sticky tooltip showing grid metadata (like in reference screenshot)
          rect.bindTooltip(`
            <div style="font-family:'Outfit',sans-serif;font-size:11px;line-height:1.6;white-space:nowrap;">
              <div><b>Grid ID:</b> ${gridId}</div>
              <div><b>${speedLabel} POIs:</b> ${poiCount}</div>
              <div><b>Supply (${speedKw}kW):</b> ${supplyCount}</div>
              <div><b>Gap Score:</b> ${gapScoreDisplay}</div>
            </div>
          `, {
            sticky: true,
            opacity: 0.97,
            className: 'grid-cell-tooltip'
          });

          // Clicking a gap cell opens the whitespace planning panel
          if (!isSupplyCell) {
            rect.on('click', () => {
              const foundPt = whitespacePoints.find(p => p.category === activeHeatmap && p.provinsi === activeProv) 
                              || whitespacePoints.find(p => p.category === activeHeatmap);
              const wsPt = foundPt || {
                id: `mock-${row}-${col}`,
                name: `${speedLabel} Whitespace Gap`,
                city: activeProv,
                provinsi: activeProv,
                lat: cellLat,
                lng: cellLng,
                category: activeHeatmap,
                scores: {
                  plnGrid: 7 + r1 * 3,
                  traffic: 7 + r2 * 3,
                  poiDensity: 7 + r3 * 3,
                  competition: 8 + r1 * 2,
                  overall: Math.round(75 + r2 * 20),
                  recommendation: r2 > 0.6 ? "SANGAT DIREKOMENDASIKAN" : "LAYAK",
                  description: `Grid sel ${gridId} di ${activeProv} menunjukkan tingginya celah ketimpangan spasial untuk kategori ${speedLabel} (${speedKw} kW). Gap Score ${parseFloat(gapScoreDisplay).toFixed(2)} mengindikasikan potensi pasar yang belum terlayani.`
                }
              };
              onSelectWhitespace(wsPt);
            });
          }

          planningLayersRef.current.push(rect);
        }
      }
    }

    // 2. Render SPBU POIs if checked (Filtered by Province)
    if (visiblePOIs.includes('spbu')) {
      const displaySpbus = spbuLocations.filter(spbu => spbu.provinsi === activeProv);
      const finalSpbus = displaySpbus.length > 0 ? displaySpbus : (
        chargers.length > 0 ? [{
          id: "spbu-mock-1",
          name: "SPBU Pertamina Rest Area",
          lat: chargers[0].lat + 0.005,
          lng: chargers[0].lng - 0.005,
          address: `Jl. Trans Utama, ${activeProv}`
        }] : []
      );

      finalSpbus.forEach((spbu) => {
        const icon = L.divIcon({
          className: 'poi-div-icon',
          html: `<div class="poi-marker spbu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="poi-icon"><path d="M3 22V2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v20"/><path d="M10 4h4a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h2"/><circle cx="14" cy="9" r="1"/><path d="M10 14h4"/></svg></div>`,
          iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14]
        });
        const marker = L.marker([spbu.lat, spbu.lng], { icon }).addTo(map)
          .bindPopup(`<div class="poi-popup"><h4 style="margin:0 0 4px 0;color:#ef4444;font-family:'Outfit',sans-serif;">⛽ SPBU / SPB</h4><p style="margin:0 0 4px 0;font-weight:700;font-size:12px;">${spbu.name}</p><p style="margin:0;font-size:11px;color:#666;">${spbu.address}</p></div>`);
        planningLayersRef.current.push(marker);
      });
    }

    // 3. Render PLN Grid POIs if checked (Filtered by Province)
    if (visiblePOIs.includes('pln')) {
      const displayPlns = plnLocations.filter(pln => pln.provinsi === activeProv);
      const finalPlns = displayPlns.length > 0 ? displayPlns : (
        chargers.length > 0 ? [{
          id: "pln-mock-1",
          name: "Kantor Pelayanan PLN Rayon",
          lat: chargers[0].lat - 0.008,
          lng: chargers[0].lng + 0.008,
          address: `Jl. Ketenagalistrikan No. 1, ${activeProv}`
        }] : []
      );

      finalPlns.forEach((pln) => {
        const icon = L.divIcon({
          className: 'poi-div-icon',
          html: `<div class="poi-marker pln"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="poi-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>`,
          iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14]
        });
        const marker = L.marker([pln.lat, pln.lng], { icon }).addTo(map)
          .bindPopup(`<div class="poi-popup"><h4 style="margin:0 0 4px 0;color:#3b82f6;font-family:'Outfit',sans-serif;">⚡ Gardu / Kantor PLN</h4><p style="margin:0 0 4px 0;font-weight:700;font-size:12px;">${pln.name}</p><p style="margin:0;font-size:11px;color:#666;">${pln.address}</p></div>`);
        planningLayersRef.current.push(marker);
      });
    }

  }, [activeHeatmap, visiblePOIs, onSelectWhitespace, selectedProvinsi, chargers]);

  // Handle Fly-To Search Location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !searchedLocation) return;
    const { lat, lng, zoom, name } = searchedLocation;
    map.setView([lat, lng], zoom || 15, { animate: true, duration: 1.5 });
    L.popup().setLatLng([lat, lng])
      .setContent(`<div style="font-family:'Outfit',sans-serif;padding:6px;text-align:center;">📍 <b>${name}</b></div>`)
      .openOn(map);
  }, [searchedLocation]);

  // Handle active charger selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeChargerId) return;
    const marker = markersRef.current[activeChargerId];
    if (marker) {
      const charger = chargers.find(c => c.id === activeChargerId);
      if (charger) {
        map.setView([charger.lat, charger.lng], 15, { animate: true });
        marker.openPopup();
        Object.keys(markersRef.current).forEach((id) => {
          const m = markersRef.current[id];
          const isAct = id === activeChargerId;
          const c = chargers.find(item => item.id === id);
          if (!c) return;
          const minP = Math.min(...c.connectors.map(conn => conn.price));
          m.setIcon(L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="price-tag-marker ${isAct ? 'active' : ''}">Rp ${(minP / 1000).toFixed(1)}k</div>`,
            iconSize: [60, 28], iconAnchor: [30, 14], popupAnchor: [0, -14]
          }));
        });
      }
    }
  }, [activeChargerId, chargers]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} className="map-panel" />

      {/* Floating Spatial Mismatch Legend */}
      {activeHeatmap && (
        <div className="spatial-legend">
          <h4 className="legend-title">Spatial Mismatch</h4>
          <div className="legend-item">
            <span className="legend-color supply-color"></span>
            <span className="legend-label">Existing Supply</span>
          </div>
          <div className="legend-item">
            <span className="legend-color gap-color"></span>
            <span className="legend-label">Demand Gap Intensity</span>
          </div>
          <div className="legend-scale-container">
            <span className="scale-lbl">Low</span>
            <div className="legend-scale-bar"></div>
            <span className="scale-lbl">High</span>
          </div>
        </div>
      )}
    </div>
  );
}
