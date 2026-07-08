import React, { useMemo } from 'react';
import { BatteryCharging, Plug, MapPin, BarChart3 } from 'lucide-react';
import { chargersData } from '../data/chargers';

export default function SupplyOverview() {
  // Aggregate data from chargers
  const stats = useMemo(() => {
    const totalStations = chargersData.length;
    const totalConnectors = chargersData.reduce((acc, c) => acc + (c.connectors ? c.connectors.length : 0), 0);
    const uniqueCities = new Set(chargersData.map(c => (c.city || '').trim()).filter(Boolean)).size;

    // Group by speed type
    const speedGroups = {};
    chargersData.forEach(c => {
      const type = c.type_charge || 'unknown';
      speedGroups[type] = (speedGroups[type] || 0) + 1;
    });

    // Group by operator (top 10)
    const operatorGroups = {};
    chargersData.forEach(c => {
      const op = (c.operator || 'Unknown').trim();
      operatorGroups[op] = (operatorGroups[op] || 0) + 1;
    });
    const topOperators = Object.entries(operatorGroups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const maxOperatorCount = topOperators.length > 0 ? topOperators[0][1] : 1;

    // Speed labels mapping
    const speedLabels = {
      standard: { label: 'Standard AC', sublabel: '7.4 kW', color: '#3b82f6' },
      medium: { label: 'Medium AC', sublabel: '22 kW', color: '#10b981' },
      fast: { label: 'Fast DC', sublabel: '50 kW', color: '#f59e0b' },
      ultrafast: { label: 'Ultrafast DC', sublabel: '120+ kW', color: '#ef4444' },
    };

    const speedData = Object.entries(speedGroups)
      .filter(([key]) => key !== 'unknown')
      .map(([key, count]) => ({
        key,
        count,
        ...(speedLabels[key] || { label: key, sublabel: '', color: '#888' }),
      }))
      .sort((a, b) => b.count - a.count);

    const maxSpeedCount = speedData.length > 0 ? speedData[0].count : 1;

    return { totalStations, totalConnectors, uniqueCities, speedData, maxSpeedCount, topOperators, maxOperatorCount };
  }, []);

  return (
    <section className="supply-section">
      <div className="section-container">
        <h2 className="section-heading">National SPKLU Supply Landscape</h2>
        <p className="section-body" style={{ marginBottom: '32px' }}>
          A snapshot of Indonesia's current public EV charging infrastructure — where it is, 
          who operates it, and what speed tiers are available.
        </p>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
              <BatteryCharging size={20} />
            </div>
            <div className="kpi-value">{stats.totalStations.toLocaleString()}</div>
            <div className="kpi-label">Total Stasiun SPKLU</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
              <Plug size={20} />
            </div>
            <div className="kpi-value">{stats.totalConnectors.toLocaleString()}</div>
            <div className="kpi-label">Total Konektor</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
              <MapPin size={20} />
            </div>
            <div className="kpi-value">{stats.uniqueCities}</div>
            <div className="kpi-label">Kota Tercakup</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              <BarChart3 size={20} />
            </div>
            <div className="kpi-value">4</div>
            <div className="kpi-label">Tipe Kecepatan</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-grid">
          {/* Speed Distribution Chart */}
          <div className="chart-card">
            <h3 className="chart-title">National SPKLU Supply by Speed</h3>
            <div className="bar-chart-vertical">
              {stats.speedData.map((item) => (
                <div key={item.key} className="bar-col">
                  <div className="bar-value">{item.count}</div>
                  <div className="bar-fill-wrapper">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(item.count / stats.maxSpeedCount) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-sublabel">{item.sublabel}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Operators Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Top 10 EV Charging Providers</h3>
            <div className="bar-chart-horizontal">
              {stats.topOperators.map(([name, count], idx) => (
                <div key={name} className="hbar-row">
                  <div className="hbar-rank">{idx + 1}</div>
                  <div className="hbar-name">{name}</div>
                  <div className="hbar-track">
                    <div
                      className="hbar-fill"
                      style={{
                        width: `${(count / stats.maxOperatorCount) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="hbar-value">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
