import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import MethodologySection from './components/MethodologySection';
import SupplyOverview from './components/SupplyOverview';
import ChargingTypeTabs from './components/ChargingTypeTabs';
import ChargingTypeDetail from './components/ChargingTypeDetail';

const PROVINCE_OPTIONS = ['DKI Jakarta', 'Jawa Barat', 'Bali', 'Jawa Timur'];

export default function App() {
  const [activeChargingType, setActiveChargingType] = useState('slow');
  const [selectedProvinsi, setSelectedProvinsi] = useState('');

  return (
    <div className="app-container">
      {/* Minimal Nav Bar */}
      <nav className="top-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="nav-logo-icon">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
            </svg>
            <span className="nav-brand-text">EV Infrastructure</span>
          </div>
          <div className="nav-links">
            <a href="#methodology" className="nav-link">Methodology</a>
            <a href="#supply" className="nav-link">Supply</a>
            <a href="#whitespace" className="nav-link">Whitespace Analysis</a>
          </div>
        </div>
      </nav>

      {/* Scrollable Content */}
      <main className="main-scroll">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Methodology */}
        <div id="methodology">
          <MethodologySection />
        </div>

        {/* 3. Supply Overview */}
        <div id="supply">
          <SupplyOverview />
        </div>

        {/* 4. Charging Type Showcase */}
        <section id="whitespace" className="whitespace-section">
          <div className="section-container">
            <h2 className="section-heading">Whitespace Analysis by Charging Type</h2>
            <p className="section-body" style={{ marginBottom: '32px' }}>
              Each charging type serves a distinct use case, user profile, and dwell time.
              Select a type below to explore its spatial mismatch analysis, priority grids, 
              and recommended locations.
            </p>

            {/* Province Filter */}
            <div className="province-filter-row">
              <label className="province-label">Region:</label>
              <select
                className="province-select"
                value={selectedProvinsi}
                onChange={(e) => setSelectedProvinsi(e.target.value)}
              >
                <option value="">Semua Provinsi</option>
                {PROVINCE_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <ChargingTypeTabs
              activeType={activeChargingType}
              onChangeType={setActiveChargingType}
            />

            {/* Detail Content */}
            <div className="tab-content-wrapper">
              <ChargingTypeDetail
                type={activeChargingType}
                provinsi={selectedProvinsi}
                onChangeType={setActiveChargingType}
                onChangeProvinsi={setSelectedProvinsi}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="page-footer">
          <div className="section-container">
            <p>© 2026 EV Infrastructure Analysis — Spatial Mismatch Study</p>
            <p className="footer-sub">Data sources: PLN, SPKLU Registry, OpenStreetMap POI, Traffic Data</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
