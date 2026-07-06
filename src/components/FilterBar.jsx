import React from 'react';

export default function FilterBar({ 
  selectedProvinsi,
  onProvinsiChange,
  selectedKabupaten,
  onKabupatenChange,
  selectedProvider,
  onProviderChange,
  selectedSpeed,
  onSpeedChange,
  provinces = [],
  cities = [],
  providers = [],
  speeds = []
}) {
  return (
    <div className="filter-bar">
      <div className="filter-select-group">
        {/* Provinsi */}
        <select
          className="filter-select"
          value={selectedProvinsi}
          onChange={(e) => onProvinsiChange(e.target.value)}
        >
          <option value="">Semua Provinsi</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>{prov}</option>
          ))}
        </select>

        {/* Kabupaten/Kota */}
        <select
          className="filter-select"
          value={selectedKabupaten}
          onChange={(e) => onKabupatenChange(e.target.value)}
          disabled={!selectedProvinsi}
        >
          <option value="">Semua Kota/Kab</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Operator / Provider */}
        <select
          className="filter-select"
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
        >
          <option value="">Semua Operator</option>
          {providers.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Kecepatan Charger */}
        <select
          className="filter-select"
          value={selectedSpeed}
          onChange={(e) => onSpeedChange(e.target.value)}
        >
          <option value="">Semua Kecepatan</option>
          {speeds.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
