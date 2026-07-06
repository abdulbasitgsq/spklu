import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { whitespacePoints, spbuLocations, plnLocations, spatialMismatchData } from '../data/planningData';

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
    if (mapInstanceRef.current) return; // Only init once

    // Default coordinates center at Jakarta
    const map = L.map(mapRef.current, {
      center: [-6.20, 106.82],
      zoom: 12,
      zoomControl: false // Disable zoom control to position custom layout
    });

    // Add standard zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Apply premium custom dark/light tiles
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

    // Force Leaflet to recalculate container boundaries when component re-renders
    map.invalidateSize();

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // 100% Client-Side Render for SPKLU Markers
    const displayedChargers = chargers.slice(0, 50);

    displayedChargers.forEach((charger) => {
      const minPrice = Math.min(...charger.connectors.map(c => c.price));
      const formattedPrice = `Rp ${(minPrice / 1000).toFixed(1)}k`;
      const isActive = activeChargerId === charger.id;

      // Custom pricing divIcon mimicking Airbnb tag
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="price-tag-marker ${isActive ? 'active' : ''}">
            ${formattedPrice}
          </div>
        `,
        iconSize: [60, 28],
        iconAnchor: [30, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([charger.lat, charger.lng], { icon }).addTo(map);

      // Helper: generate branded provider logo card as HTML string (for Leaflet popup innerHTML)
      const getProviderLogoBadgeHtml = (operator) => {
        const op = (operator || '').toLowerCase();
        if (op.includes('pln')) {
          return `<div class="popup-logo-card pln">
            <svg viewBox="0 0 24 24" class="popup-logo-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FFD000"/></svg>
            <span class="popup-logo-text" style="color:#ffffff;">PLN SPKLU</span>
          </div>`;
        }
        if (op.includes('shell')) {
          return `<div class="popup-logo-card shell">
            <svg viewBox="0 0 24 24" class="popup-logo-svg"><path d="M12 2C7.58 2 4 5.58 4 10c0 4.13 3.13 7.53 7.15 7.96l-.8 2.04H7.5v2h9v-2h-.85l-.8-2.04C16.87 17.53 20 14.13 20 10c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#e51837"/></svg>
            <span class="popup-logo-text" style="color:#e51837;">SHELL</span>
          </div>`;
        }
        if (op.includes('voltron')) {
          return `<div class="popup-logo-card voltron">
            <svg viewBox="0 0 24 24" class="popup-logo-svg" fill="none" stroke="#fff" stroke-width="2.5"><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="10" x2="22" y2="14"/><polygon points="11 9 7 12 10 12 9 15 13 12 10 12 11 9" fill="#fff" stroke="none"/></svg>
            <span class="popup-logo-text" style="color:#ffffff;">VOLTRON</span>
          </div>`;
        }
        if (op.includes('starvo')) {
          return `<div class="popup-logo-card starvo">
            <svg viewBox="0 0 24 24" class="popup-logo-svg" fill="#ffffff"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span class="popup-logo-text" style="color:#ffffff;">STARVO</span>
          </div>`;
        }
        if (op.includes('hyundai')) {
          return `<div class="popup-logo-card hyundai">
            <svg viewBox="0 0 24 24" class="popup-logo-svg" fill="none" stroke="#fff" stroke-width="2.2"><ellipse cx="12" cy="12" rx="9" ry="6"/><path d="M9.5 9.2v5.6M14.5 9.2v5.6M9.5 12h5" stroke-width="2.5"/></svg>
            <span class="popup-logo-text" style="color:#ffffff;">HYUNDAI</span>
          </div>`;
        }
        return `<div class="popup-logo-card generic">
          <svg viewBox="0 0 24 24" class="popup-logo-svg" fill="none" stroke="#ff385c" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span class="popup-logo-text" style="color:#444;font-size:8px;">${operator}</span>
        </div>`;
      };

      // Create Custom Popup HTML content
      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup-card';
      popupContent.innerHTML = `
        ${getProviderLogoBadgeHtml(charger.operator)}
        <div class="map-popup-info">
          <h4 class="map-popup-title">${charger.name}</h4>
          <p class="map-popup-price">Tarif: <span>Rp ${minPrice.toLocaleString('id-ID')}</span>/kWh</p>
          <button class="map-popup-btn" id="popup-btn-${charger.id}">Lihat Detail & Booking</button>
        </div>
      `;

      // Wait until popup opens to bind button click handler
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectCharger(charger);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${charger.id}`);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onOpenDetail(charger);
          });
        }
      });

      markersRef.current[charger.id] = marker;
    });

    // Auto fit bounds if there are chargers on the map, otherwise reset to center
    if (displayedChargers.length > 0) {
      const group = new L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 13 });
    }
  }, [chargers, activeChargerId, onSelectCharger, onOpenDetail, visiblePOIs]);

  // Update Planning Layers (Heatmap and POIs)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing planning layers
    planningLayersRef.current.forEach((layer) => layer.remove());
    planningLayersRef.current = [];

    // Filter planning points by active province
    const activeProv = selectedProvinsi || "DKI Jakarta";

    // 1. Render Polygons for Spatial Mismatch (Supply & Gaps)
    if (activeHeatmap) {
      const provData = spatialMismatchData[activeProv];
      if (provData && provData[activeHeatmap]) {
        const mismatch = provData[activeHeatmap];

        // A. Existing Supply Polygon (Blue)
        const supplyPoly = L.polygon(mismatch.supply, {
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '4, 6'
        })
        .addTo(map)
        .bindPopup(`
          <div class="whitespace-popup" style="font-family:'Outfit',sans-serif;">
            <h4 style="margin: 0 0 4px 0; color: #2563eb; font-weight: 700; font-size:13px;">🔵 Existing Supply Area</h4>
            <p style="margin: 0; font-size:11px; color:#555;">Kawasan dengan ketersediaan jaringan suplai pengisian daya EV aktif.</p>
          </div>
        `);
        planningLayersRef.current.push(supplyPoly);

        // B. Demand Gap Area Polygon (Red)
        const gapPoly = L.polygon(mismatch.gap, {
          color: '#dc2626',
          fillColor: '#ef4444',
          fillOpacity: 0.35,
          weight: 2
        })
        .addTo(map)
        .bindPopup(`
          <div class="whitespace-popup" style="font-family:'Outfit',sans-serif; width:200px;">
            <h4 style="margin: 0 0 4px 0; color: #dc2626; font-weight: 700; font-size:13px;">🔴 Demand Gap Area</h4>
            <p style="margin: 0 0 4px 0; font-weight:700; font-size:11px; color:#333;">${mismatch.desc.split(':')[0]}</p>
            <p style="margin: 0; font-size:11px; color:#555;">${mismatch.desc.split(':')[1] || mismatch.desc}</p>
            <p style="font-size:9px;color:#888;margin:6px 0 0 0;border-top:1px solid #eee;padding-top:4px;text-align:center;">Klik area untuk analisis kesesuaian.</p>
          </div>
        `);

        // Hook up scoring sidebar on click
        gapPoly.on('click', () => {
          const foundPt = whitespacePoints.find(p => p.category === activeHeatmap && p.provinsi === activeProv) 
                          || whitespacePoints.find(p => p.category === activeHeatmap);
          if (foundPt) {
            onSelectWhitespace(foundPt);
          }
        });

        planningLayersRef.current.push(gapPoly);
      }
    }

    // 2. Render SPBU POIs if checked (Filtered by Province)
    if (visiblePOIs.includes('spbu')) {
      const displaySpbus = spbuLocations.filter(spbu => spbu.provinsi === activeProv);
      displaySpbus.forEach((spbu) => {
        const icon = L.divIcon({
          className: 'poi-div-icon',
          html: `
            <div class="poi-marker spbu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="poi-icon"><path d="M3 22V2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v20"/><path d="M10 4h4a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h2"/><circle cx="14" cy="9" r="1"/><path d="M10 14h4"/></svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([spbu.lat, spbu.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="poi-popup">
              <h4 style="margin:0 0 4px 0;color:#ef4444;font-family:'Outfit',sans-serif;">⛽ SPBU / SPB</h4>
              <p style="margin:0 0 4px 0;font-weight:700;font-size:12px;">${spbu.name}</p>
              <p style="margin:0;font-size:11px;color:#666;">${spbu.address}</p>
            </div>
          `);

        planningLayersRef.current.push(marker);
      });
    }

    // 3. Render PLN Grid POIs if checked (Filtered by Province)
    if (visiblePOIs.includes('pln')) {
      const displayPlns = plnLocations.filter(pln => pln.provinsi === activeProv);
      displayPlns.forEach((pln) => {
        const icon = L.divIcon({
          className: 'poi-div-icon',
          html: `
            <div class="poi-marker pln">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="poi-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([pln.lat, pln.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="poi-popup">
              <h4 style="margin:0 0 4px 0;color:#3b82f6;font-family:'Outfit',sans-serif;">⚡ Gardu / Kantor PLN</h4>
              <p style="margin:0 0 4px 0;font-weight:700;font-size:12px;">${pln.name}</p>
              <p style="margin:0;font-size:11px;color:#666;">${pln.address}</p>
            </div>
          `);

        planningLayersRef.current.push(marker);
      });
    }

  }, [activeHeatmap, visiblePOIs, onSelectWhitespace, selectedProvinsi]);

  // Handle Fly-To Search Location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !searchedLocation) return;

    const { lat, lng, zoom, name } = searchedLocation;
    map.setView([lat, lng], zoom || 15, { animate: true, duration: 1.5 });

    // Open a temporary popup at searched point
    L.popup()
      .setLatLng([lat, lng])
      .setContent(`
        <div style="font-family:'Outfit',sans-serif;padding:6px;text-align:center;">
          📍 <b>${name}</b>
        </div>
      `)
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
        // Center view on coordinate
        map.setView([charger.lat, charger.lng], 15, { animate: true });
        
        // Open popup
        marker.openPopup();

        // Refresh icons to ensure active pin is highlighted
        Object.keys(markersRef.current).forEach((id) => {
          const m = markersRef.current[id];
          const isAct = id === activeChargerId;
          const c = chargers.find(item => item.id === id);
          if (!c) return;

          const minP = Math.min(...c.connectors.map(conn => conn.price));
          const formattedP = `Rp ${(minP / 1000).toFixed(1)}k`;

          m.setIcon(
            L.divIcon({
              className: 'custom-div-icon',
              html: `
                <div class="price-tag-marker ${isAct ? 'active' : ''}">
                  ${formattedP}
                </div>
              `,
              iconSize: [60, 28],
              iconAnchor: [30, 14],
              popupAnchor: [0, -14]
            })
          );
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
