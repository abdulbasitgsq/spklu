import React from 'react';
import { Zap, TrendingUp, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <Zap size={14} />
          <span>EV Infrastructure Analysis</span>
        </div>
        <h1 className="hero-title">
          Spatial Mismatch<span className="hero-dot">.</span>
        </h1>
        <p className="hero-subtitle">
          Indonesia's EV charging network is growing — but in the wrong places. 
          We map where demand exists but supply doesn't, revealing the exact whitespace 
          opportunities for each charging type.
        </p>
        <div className="hero-stats-row">
          <div className="hero-stat">
            <TrendingUp size={16} />
            <span className="hero-stat-val">4 Tipe</span>
            <span className="hero-stat-label">Charging Analyzed</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <MapPin size={16} />
            <span className="hero-stat-val">3 Provinsi</span>
            <span className="hero-stat-label">Coverage Area</span>
          </div>
        </div>
      </div>
    </section>
  );
}
