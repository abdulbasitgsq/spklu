import React from 'react';
import { ArrowLeft, Award, Zap, Navigation, Building2, LayoutGrid, CheckCircle } from 'lucide-react';

export default function SuitabilityDetail({ whitespace, onClose }) {
  if (!whitespace) return null;

  const { name, city, category, scores } = whitespace;

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'slow': return 'Slow AC (7.4 kW)';
      case 'medium': return 'Medium AC (22 kW)';
      case 'high': return 'Fast DC (50 kW)';
      case 'highspeed': return 'Ultrafast DC (120+ kW)';
      default: return cat;
    }
  };

  const getRecommendationBadgeClass = (rec) => {
    if (rec.includes('SANGAT')) return 'badge-rec-high';
    if (rec.includes('LAYAK')) return 'badge-rec-medium';
    return 'badge-rec-low';
  };

  // 4 metrics array for easy grid mapping
  const metrics = [
    {
      id: 'grid',
      label: 'Kapasitas Jaringan PLN',
      score: scores.plnGrid,
      icon: Zap,
      color: 'var(--accent-blue)',
      description: 'Ketersediaan gardu & tegangan grid sekitar'
    },
    {
      id: 'traffic',
      label: 'Aksesibilitas Jalan & Lalu Lintas',
      score: scores.traffic,
      icon: Navigation,
      color: 'var(--accent-green)',
      description: 'Lalu lintas kendaraan & lebar jalan masuk'
    },
    {
      id: 'poi',
      label: 'Kepadatan POI Komersial',
      score: scores.poiDensity,
      icon: Building2,
      color: 'var(--accent-orange)',
      description: 'Mall, hotel, kafe, & amenitas penarik parkir'
    },
    {
      id: 'competition',
      label: 'Celah Kompetisi (Whitespace)',
      score: scores.competition,
      icon: LayoutGrid,
      color: 'var(--accent-color)',
      description: 'Jarak ke pengisi daya aktif terdekat'
    }
  ];

  return (
    <div className="suitability-detail">
      {/* Back Button */}
      <button className="back-to-list-btn" onClick={onClose}>
        <ArrowLeft size={16} />
        Kembali ke Daftar Stasiun
      </button>

      {/* Main Header */}
      <div className="detail-header-card">
        <div className="category-tag">{getCategoryLabel(category)} Whitespace</div>
        <h2 className="site-name">{name}</h2>
        <div className="site-location">{city}</div>

        <div className="score-summary-box">
          <div className="score-circle-wrapper">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${scores.overall}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{scores.overall}%</text>
            </svg>
          </div>

          <div className="rec-text-wrapper">
            <div className="rec-title">Skor Kelayakan Lokasi</div>
            <span className={`recommendation-badge ${getRecommendationBadgeClass(scores.recommendation)}`}>
              <Award size={12} style={{ marginRight: '4px' }} />
              {scores.recommendation}
            </span>
          </div>
        </div>
      </div>

      {/* 2x2 Scoring Grid */}
      <div className="scoring-grid-container">
        <h3 className="section-subtitle">Matriks Kriteria Kesesuaian</h3>
        <div className="scoring-grid">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="grid-score-card">
                <div className="card-header-row">
                  <div className="icon-wrapper" style={{ backgroundColor: `${metric.color}15`, color: metric.color }}>
                    <Icon size={16} />
                  </div>
                  <div className="score-val">{metric.score} <span className="score-max">/10</span></div>
                </div>
                <h4 className="metric-label">{metric.label}</h4>
                <p className="metric-desc">{metric.description}</p>
                {/* Progress bar */}
                <div className="progress-bg">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${metric.score * 10}%`, backgroundColor: metric.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Analysis Description */}
      <div className="analysis-description-box">
        <h3 className="section-subtitle">Deskripsi Rekomendasi</h3>
        <div className="description-card">
          <CheckCircle size={18} className="desc-check-icon" />
          <p className="description-text">{scores.description}</p>
        </div>
      </div>
    </div>
  );
}
