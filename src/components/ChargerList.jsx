import React from 'react';
import { Star } from 'lucide-react';

export default function ChargerList({ 
  chargers, 
  activeChargerId, 
  onSelectCharger, 
  favorites, 
  onToggleFavorite,
  onOpenDetail
}) {
  
  const renderProviderLogo = (operator) => {
    const op = operator.toLowerCase();
    
    // 1. PLN SPKLU
    if (op.includes('pln')) {
      return (
        <div className="provider-logo-card pln">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" className="logo-svg">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FFD000" />
          </svg>
          <span className="logo-text pln-text">PLN SPKLU</span>
        </div>
      );
    }

    // 2. Shell Recharge
    if (op.includes('shell')) {
      return (
        <div className="provider-logo-card shell">
          <svg viewBox="0 0 24 24" fill="#e51837" className="logo-svg">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 4.13 3.13 7.53 7.15 7.96l-.8 2.04H7.5v2h9v-2h-.85l-.8-2.04C16.87 17.53 20 14.13 20 10c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          </svg>
          <span className="logo-text shell-text">SHELL</span>
        </div>
      );
    }

    // 3. Voltron
    if (op.includes('voltron')) {
      return (
        <div className="provider-logo-card voltron">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" className="logo-svg">
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
            <line x1="22" y1="10" x2="22" y2="14" />
            <line x1="18" y1="12" x2="20" y2="12" />
            <polygon points="11 9 7 12 10 12 9 15 13 12 10 12 11 9" fill="#ffffff" stroke="none" />
          </svg>
          <span className="logo-text voltron-text">VOLTRON</span>
        </div>
      );
    }

    // 4. Starvo
    if (op.includes('starvo')) {
      return (
        <div className="provider-logo-card starvo">
          <svg viewBox="0 0 24 24" fill="#ffffff" className="logo-svg">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            <polygon points="12 5.5 9.5 11 12 11 11 15.5 14.5 10 12 10 12 5.5" fill="#e06000" />
          </svg>
          <span className="logo-text starvo-text">STARVO</span>
        </div>
      );
    }

    // 5. Hyundai Charger
    if (op.includes('hyundai')) {
      return (
        <div className="provider-logo-card hyundai">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" className="logo-svg">
            <ellipse cx="12" cy="12" rx="9" ry="6" />
            <path d="M9.5 9.2v5.6M14.5 9.2v5.6M9.5 12h5" strokeWidth="2.5" />
          </svg>
          <span className="logo-text hyundai-text">HYUNDAI</span>
        </div>
      );
    }

    // 6. Generic Placeholder
    return (
      <div className="generic-logo-wrapper">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="generic-logo-svg"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span className="generic-logo-text">{operator}</span>
      </div>
    );
  };

  const getPowerTypePill = (powerStr, index) => {
    const isDC = powerStr.toLowerCase().includes('dc');
    const kwVal = parseInt(powerStr.replace(/\D/g, '')) || 0;
    
    if (isDC && kwVal >= 100) {
      return <span key={`${powerStr}-${index}`} className="spec-pill ultra-fast">{powerStr} Ultra</span>;
    } else if (isDC) {
      return <span key={`${powerStr}-${index}`} className="spec-pill fast">{powerStr} Fast</span>;
    }
    return <span key={`${powerStr}-${index}`} className="spec-pill">{powerStr}</span>;
  };

  const displayedChargers = chargers.slice(0, 50);

  return (
    <div className="chargers-grid">
      {chargers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          <p>Tidak ada lokasi charger ditemukan.</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>Coba ubah kata pencarian atau hilangkan filter.</p>
        </div>
      ) : (
        displayedChargers.map((charger) => {
          const isFav = favorites.includes(charger.id);
          const isActive = activeChargerId === charger.id;

          // Price display (lowest price connector)
          const minPrice = Math.min(...charger.connectors.map(c => c.price));

          return (
            <div 
              key={charger.id} 
              className={`charger-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCharger(charger)}
            >
              <div className="card-image-wrapper">
                {renderProviderLogo(charger.operator)}

                <div className="card-dots">
                  <span className="card-dot active"></span>
                  <span className="card-dot"></span>
                  <span className="card-dot"></span>
                  <span className="card-dot"></span>
                </div>
              </div>

              <div className="card-details">
                <div className="card-header-row">
                  <h3 className="card-title">{charger.name}</h3>
                  <div className="card-rating-container">
                    <Star size={14} className="star-icon" />
                    <span>{charger.rating}</span>
                  </div>
                </div>

                <div className="card-address">{charger.address}</div>

                <div className="card-specs">
                  {charger.connectors.map((conn, idx) => getPowerTypePill(conn.power, idx))}
                </div>

                <div className="card-footer">
                  <div className="price-container">
                    <span className="price-val">Rp {minPrice.toLocaleString('id-ID')}</span>/kWh
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      {chargers.length > 50 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '16px 8px', 
          color: 'var(--text-secondary)', 
          fontSize: '13px', 
          borderTop: '1px solid var(--border-color)', 
          width: '100%',
          marginTop: '12px',
          boxSizing: 'border-box'
        }}>
          Menampilkan 50 stasiun teratas dari {chargers.length} lokasi.
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cari berdasarkan kota atau aktifkan filter untuk mempersempit hasil.
          </div>
        </div>
      )}
    </div>
  );
}
