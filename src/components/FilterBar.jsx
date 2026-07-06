import React from 'react';
import SearchableSelect from './SearchableSelect';

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
        {/* Provinsi (Searchable Dropdown) */}
        <SearchableSelect
          options={provinces}
          value={selectedProvinsi}
          onChange={onProvinsiChange}
          placeholder="Semua Provinsi"
          emptyMessage="Provinsi tidak ditemukan"
        />

        {/* Kabupaten/Kota (Standard Dropdown, dependent on Provinsi) */}
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

        {/* Operator / Provider (Searchable Dropdown) */}
        <SearchableSelect
          options={providers}
          value={selectedProvider}
          onChange={onProviderChange}
          placeholder="Semua Operator"
          emptyMessage="Operator tidak ditemukan"
        />

        {/* Kecepatan Charger (Standard Dropdown) */}
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
