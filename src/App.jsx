import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ChargerList from './components/ChargerList';
import ChargerMap from './components/ChargerMap';
import ChargerDetail from './components/ChargerDetail';
import PlanningPanel from './components/PlanningPanel';
import SuitabilityDetail from './components/SuitabilityDetail';
import { chargersData } from './data/chargers';
import { searchableAddresses } from './data/planningData';

// Pre-compiled list of unique provinces and providers from dataset to avoid TDZ / re-recreating overhead
const PROVINCES = [...new Set(chargersData.map(c => ((c && c.provinsi) || "").trim()))].filter(Boolean).sort();
const PROVIDERS = [...new Set(chargersData.map(c => ((c && c.operator) || "").trim()))].filter(Boolean).sort();
const SPEED_OPTIONS = [
  { value: 'standard', label: 'Standard (AC)' },
  { value: 'medium', label: 'Medium (AC)' },
  { value: 'fast', label: 'Fast (DC)' },
  { value: 'ultrafast', label: 'Ultrafast (DC)' }
];

export default function App() {
  const [searchVal, setSearchVal] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeChargerId, setActiveChargerId] = useState(null);
  const [favorites, setFavorites] = useState(['ch-02']); 
  const [detailCharger, setDetailCharger] = useState(null);

  // Regional/Operational Filter States
  const [selectedProvinsi, setSelectedProvinsi] = useState('');
  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState('');

  // EV Planning & Suitability Analytics States
  const [activeHeatmap, setActiveHeatmap] = useState(null);
  const [visiblePOIs, setVisiblePOIs] = useState(['spklu', 'spbu', 'pln']);
  const [selectedWhitespace, setSelectedWhitespace] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);

  // Handle Province change and reset dependent city filter
  const handleProvinsiChange = (val) => {
    setSelectedProvinsi(val);
    setSelectedKabupaten('');
  };

  // Compile regencies based on selected province
  const kabupatenList = useMemo(() => {
    if (!selectedProvinsi) return [];
    return [...new Set(
      chargersData
        .filter(c => c && c.provinsi && c.provinsi.trim() === selectedProvinsi)
        .map(c => ((c && c.city) || "").trim())
    )].filter(Boolean).sort();
  }, [selectedProvinsi]);

  // Toggle Filters
  const handleToggleFilter = (filterId) => {
    if (filterId === 'all') {
      setActiveFilters([]);
      setSelectedProvinsi('');
      setSelectedKabupaten('');
      setSelectedProvider('');
      setSelectedSpeed('');
      return;
    }

    setActiveFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  // Toggle Favorite
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Filter and Search Logic
  const filteredChargers = useMemo(() => {
    return chargersData.filter((charger) => {
      // 1. Provinsi Filter
      if (selectedProvinsi && ((charger.provinsi || "").trim() !== selectedProvinsi)) {
        return false;
      }

      // 2. Kabupaten/Kota Filter
      if (selectedKabupaten && ((charger.city || "").trim() !== selectedKabupaten)) {
        return false;
      }

      // 3. Provider/Operator Filter
      if (selectedProvider && ((charger.operator || "").trim() !== selectedProvider)) {
        return false;
      }

      // 4. Speed Filter
      if (selectedSpeed && charger.type_charge !== selectedSpeed) {
        return false;
      }

      // 5. Search Query Match
      if (searchVal.trim() !== '') {
        const query = searchVal.toLowerCase();
        const matchCity = charger.city && charger.city.toLowerCase().includes(query);
        const matchName = charger.name && charger.name.toLowerCase().includes(query);
        const matchAddress = charger.address && charger.address.toLowerCase().includes(query);
        if (!matchCity && !matchName && !matchAddress) {
          return false;
        }
      }

      // 6. Filter Pills Match
      for (const filter of activeFilters) {
        if (filter === 'dc_fast') {
          const hasDC = charger.connectors.some(c => c.power.toLowerCase().includes('dc'));
          if (!hasDC) return false;
        }
        if (filter === 'available') {
          const hasAvail = charger.connectors.some(c => c.status === 'Available');
          if (!hasAvail) return false;
        }
      }

      return true;
    });
  }, [searchVal, activeFilters, selectedProvinsi, selectedKabupaten, selectedProvider, selectedSpeed]);

  // Intercept Search Query to match general addresses/SPBUs
  useEffect(() => {
    if (searchVal.trim() === '') {
      setSearchedLocation(null);
      return;
    }

    const query = searchVal.toLowerCase();
    const found = searchableAddresses.find(addr => 
      addr.name.toLowerCase().includes(query)
    );

    if (found) {
      setSearchedLocation(found);
    }
  }, [searchVal]);

  const handleSelectCharger = (charger) => {
    setActiveChargerId(charger.id);
  };

  const handleTogglePOI = (poiId) => {
    setVisiblePOIs((prev) =>
      prev.includes(poiId) ? prev.filter((id) => id !== poiId) : [...prev, poiId]
    );
  };

  return (
    <div className="app-container">
      {/* 1. Top Airbnb Header */}
      <Header 
        searchVal={searchVal} 
        onSearchChange={setSearchVal} 
      />

      {/* 2. Airbnb Filter Category Bar */}
      <FilterBar 
        activeFilters={activeFilters} 
        onToggleFilter={handleToggleFilter} 
        selectedProvinsi={selectedProvinsi}
        onProvinsiChange={handleProvinsiChange}
        selectedKabupaten={selectedKabupaten}
        onKabupatenChange={setSelectedKabupaten}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
        selectedSpeed={selectedSpeed}
        onSpeedChange={setSelectedSpeed}
        provinces={PROVINCES}
        cities={kabupatenList}
        providers={PROVIDERS}
        speeds={SPEED_OPTIONS}
      />

      {/* 3. Main Split View */}
      <main className="main-content">
        
        {/* Left Side: 30% Scrollable List View OR Suitability Detail */}
        <section className="list-panel">
          {selectedWhitespace ? (
            <SuitabilityDetail 
              whitespace={selectedWhitespace} 
              onClose={() => setSelectedWhitespace(null)} 
            />
          ) : (
            <>
              <div className="list-panel-header">
                <div className="results-count">
                  Menampilkan {Math.min(50, filteredChargers.length)} dari {filteredChargers.length} stasiun EV
                </div>
                <h2 className="list-title">Lokasi Charger EV di Indonesia</h2>
              </div>

              <ChargerList 
                chargers={filteredChargers}
                activeChargerId={activeChargerId}
                onSelectCharger={handleSelectCharger}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetail={setDetailCharger}
              />
            </>
          )}
        </section>

        {/* Right Side: 70% Interactive Map */}
        <section className="map-panel" style={{ position: 'relative' }}>
          <ChargerMap 
            chargers={filteredChargers}
            activeChargerId={activeChargerId}
            onSelectCharger={handleSelectCharger}
            onOpenDetail={setDetailCharger}
            activeHeatmap={activeHeatmap}
            visiblePOIs={visiblePOIs}
            onSelectWhitespace={setSelectedWhitespace}
            searchedLocation={searchedLocation}
          />
          <PlanningPanel 
            activeHeatmap={activeHeatmap}
            onHeatmapChange={setActiveHeatmap}
            visiblePOIs={visiblePOIs}
            onTogglePOI={handleTogglePOI}
          />
        </section>

      </main>

      {/* 4. Airbnb-style Detail Drawer / Modal */}
      {detailCharger && (
        <ChargerDetail 
          charger={detailCharger} 
          onClose={() => setDetailCharger(null)} 
        />
      )}
    </div>
  );
}
