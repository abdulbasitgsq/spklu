import React, { useState } from 'react';
import { Layers, Activity, MapPin, BatteryCharging, Power, Map, ChevronDown, ChevronUp } from 'lucide-react';

export default function PlanningPanel({
  activeHeatmap,
  onHeatmapChange,
  visiblePOIs,
  onTogglePOI
}) {
  const [isOpen, setIsOpen] = useState(false);

  const heatmapCategories = [
    { id: 'none', label: 'Matikan Heatmap', color: '#666' },
    { id: 'slow', label: 'Slow AC Gap (7.4 kW)', color: '#3b82f6' },
    { id: 'medium', label: 'Medium AC Gap (22 kW)', color: '#10b981' },
    { id: 'high', label: 'Fast DC Gap (50 kW)', color: '#f59e0b' },
    { id: 'highspeed', label: 'Ultrafast DC Gap (120+ kW)', color: '#ef4444' }
  ];

  const poiTypes = [
    { id: 'spklu', label: 'Existing SPKLU (Kuning)', color: '#fbbf24' },
    { id: 'spbu', label: 'SPBU / SPB (Merah)', color: '#ef4444' },
    { id: 'pln', label: 'Kantor / Gardu PLN (Biru)', color: '#3b82f6' }
  ];

  return (
    <div className={`planning-panel ${isOpen ? 'open' : ''}`}>
      {/* Panel Toggle Button */}
      <button 
        className="panel-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Menu Perencanaan Lokasi"
      >
        <Layers size={18} />
        <span className="btn-text">Analisis Perencanaan</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Panel Content Card */}
      {isOpen && (
        <div className="panel-content-card">
          {/* Section: Heatmap */}
          <div className="panel-section">
            <h4 className="section-title">
              <Activity size={14} className="section-icon text-accent" />
              Whitespace Heatmap (Celah Pasar)
            </h4>
            <div className="radio-group">
              {heatmapCategories.map((cat) => (
                <label key={cat.id} className="radio-label">
                  <input
                    type="radio"
                    name="heatmap-cat"
                    value={cat.id}
                    checked={(activeHeatmap || 'none') === cat.id}
                    onChange={() => onHeatmapChange(cat.id === 'none' ? null : cat.id)}
                    className="custom-radio"
                  />
                  <span className="radio-custom-dot" style={{ borderColor: cat.color }}></span>
                  <span className="label-text">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="panel-divider"></div>

          {/* Section: POI Overlay */}
          <div className="panel-section">
            <h4 className="section-title">
              <MapPin size={14} className="section-icon text-blue" />
              Overlay Titik Penting (POI)
            </h4>
            <div className="checkbox-group">
              {poiTypes.map((poi) => {
                const isChecked = visiblePOIs.includes(poi.id);
                return (
                  <label key={poi.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onTogglePOI(poi.id)}
                      className="custom-checkbox"
                    />
                    <span 
                      className={`checkbox-custom-box ${isChecked ? 'checked' : ''}`}
                      style={{ backgroundColor: isChecked ? poi.color : 'transparent', borderColor: poi.color }}
                    ></span>
                    <span className="label-text">{poi.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Help Info */}
          <div className="panel-footer-info">
            <p>💡 Klik pada area lingkar gradasi heatmap di peta untuk membuka detail analitik **Skor Kesesuaian Pemasangan** SPKLU baru.</p>
          </div>
        </div>
      )}
    </div>
  );
}
