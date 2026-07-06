import React, { useState, useEffect } from 'react';
import { X, Star, Wifi, Coffee, MapPin, Compass, Shield, Award, Sparkles, Battery, Zap, CheckCircle2 } from 'lucide-react';

export default function ChargerDetail({ charger, onClose }) {
  const [selectedConnector, setSelectedConnector] = useState(null);
  
  // Calculator States
  const [batteryCapacity, setBatteryCapacity] = useState(50); // kWh
  const [startSoC, setStartSoC] = useState(20); // %
  const [targetSoC, setTargetSoC] = useState(80); // %
  
  // Booking States
  const [isBooked, setIsBooked] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Auto select the first available connector, or just the first connector
  useEffect(() => {
    if (charger && charger.connectors.length > 0) {
      const avail = charger.connectors.find(c => c.status === 'Available');
      setSelectedConnector(avail || charger.connectors[0]);
      
      // Reset booking states
      setIsBooked(false);
    }
  }, [charger]);

  if (!charger || !selectedConnector) return null;

  // Perform realistic charging calculation
  const getPowerKw = (powerStr) => {
    return parseInt(powerStr.replace(/\D/g, '')) || 22; // default 22kW
  };

  const currentPower = getPowerKw(selectedConnector.power);
  const isDC = selectedConnector.power.toLowerCase().includes('dc');

  // Energy needed (kWh)
  const energyNeeded = Math.max(0, (batteryCapacity * (targetSoC - startSoC)) / 100);
  
  // Calculate charging duration
  let chargingTimeHours = 0;
  if (currentPower > 0) {
    chargingTimeHours = energyNeeded / currentPower;
    
    // Realistic DC charging slowdown above 80%
    if (isDC && targetSoC > 80) {
      const baseEnergy = (batteryCapacity * (Math.min(80, targetSoC) - startSoC)) / 100;
      const slowEnergy = (batteryCapacity * (targetSoC - Math.max(80, startSoC))) / 100;
      
      const baseTime = baseEnergy > 0 ? baseEnergy / currentPower : 0;
      // Charger slows down to about 25% speed above 80% SoC
      const slowTime = slowEnergy > 0 ? slowEnergy / (currentPower * 0.25) : 0;
      chargingTimeHours = baseTime + slowTime;
    }
  }

  const durationMin = Math.round(chargingTimeHours * 60);
  const formattedDuration = durationMin >= 60 
    ? `${Math.floor(durationMin / 60)} jam ${durationMin % 60} menit`
    : `${durationMin} menit`;

  // Cost calculation
  const energyCost = energyNeeded * selectedConnector.price;
  const adminFee = 5000;
  const totalCost = energyCost > 0 ? energyCost + adminFee : 0;

  // Handle Booking Simulation
  const handleBooking = () => {
    const code = 'CBNB-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const today = new Date();
    today.setMinutes(today.getMinutes() + 15); // Booked for 15 mins from now
    const timeStr = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' +
                    new Date(today.getTime() + durationMin * 60000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    setBookingCode(code);
    setBookingTime(timeStr);
    setIsBooked(true);
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="amenity-icon" size={16} />;
      case 'cafe': return <Coffee className="amenity-icon" size={16} />;
      case 'toilet': return <Compass className="amenity-icon" size={16} />;
      case 'mall': return <Sparkles className="amenity-icon" size={16} />;
      case 'restoran': return <Coffee className="amenity-icon" size={16} />;
      case 'keamanan 24 jam': return <Shield className="amenity-icon" size={16} />;
      case 'spot foto': return <Award className="amenity-icon" size={16} />;
      default: return <Compass className="amenity-icon" size={16} />;
    }
  };

  const getOperatorBadgeClass = (operator) => {
    switch (operator.toLowerCase()) {
      case 'pln spklu': return 'badge-pln';
      case 'shell recharge': return 'badge-shell';
      case 'voltron': return 'badge-voltron';
      case 'starvo': return 'badge-starvo';
      case 'hyundai charger': return 'badge-hyundai';
      default: return '';
    }
  };

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-scroll-area">
          <div className="modal-hero">
            <img src={charger.image} alt={charger.name} className="modal-hero-img" />
            <div className="modal-hero-overlay"></div>
          </div>

          <div className="modal-body">
            {/* Left Info Panel */}
            <div className="modal-info-section">
              <div className="modal-operator-row">
                <span className={`modal-operator-badge card-badge ${getOperatorBadgeClass(charger.operator)}`}>
                  {charger.operator}
                </span>
                <div className="card-rating-container" style={{ fontSize: '15px' }}>
                  <Star size={16} className="star-icon" />
                  <span style={{ fontWeight: 700 }}>{charger.rating}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>({charger.reviewsCount} review)</span>
                </div>
              </div>

              <h2 className="modal-title">{charger.name}</h2>
              
              <div className="modal-meta-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} className="amenity-icon" />
                  {charger.address}
                </span>
              </div>

              <div className="modal-divider"></div>

              <div>
                <h3 className="modal-section-title">Deskripsi Stasiun</h3>
                <p className="modal-desc">{charger.description}</p>
              </div>

              <div className="modal-divider"></div>

              <div>
                <h3 className="modal-section-title">Fasilitas Terdekat</h3>
                <div className="modal-amenities-grid">
                  {charger.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-item">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-divider"></div>

              <div>
                <h3 className="modal-section-title">Pilih Jenis Konektor</h3>
                <div className="modal-connectors-list">
                  {charger.connectors.map((conn) => {
                    const isSelected = selectedConnector.id === conn.id;
                    const isConnOffline = conn.status === 'Offline';
                    const isConnInUse = conn.status === 'In Use';
                    
                    return (
                      <div 
                        key={conn.id} 
                        className={`connector-row ${isSelected ? 'active' : ''}`}
                        style={{ 
                          cursor: isConnOffline ? 'not-allowed' : 'pointer',
                          borderColor: isSelected ? 'var(--text-primary)' : 'var(--border-color)',
                          boxShadow: isSelected ? 'inset 0 0 0 1px var(--text-primary)' : 'none',
                          opacity: isConnOffline ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!isConnOffline) setSelectedConnector(conn);
                        }}
                      >
                        <div className="connector-left">
                          <div className="plug-icon-container" style={{
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}>
                            <Zap size={20} fill={isSelected ? 'currentColor' : 'none'} />
                          </div>
                          <div>
                            <div className="connector-name">{conn.type} ({conn.power})</div>
                            <div className="connector-power">
                              Status: <span style={{ 
                                color: isConnOffline ? 'var(--text-muted)' : (isConnInUse ? 'var(--accent-orange)' : 'var(--accent-green)') 
                              }}>
                                {conn.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="connector-right">
                          <div className="connector-price">Rp {conn.price.toLocaleString('id-ID')}/kWh</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Widget Panel */}
            <div className="modal-widget-section">
              <div className="booking-widget">
                {!isBooked ? (
                  <>
                    <div className="widget-price-row">
                      <span className="widget-price-label">Tarif Pengisian</span>
                      <span className="widget-price-value">
                        Rp {selectedConnector.price.toLocaleString('id-ID')} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>/kWh</span>
                      </span>
                    </div>

                    <div className="calculator-group">
                      <div className="calc-title">Estimator Pengisian</div>
                      
                      <div className="calc-row">
                        <div className="calc-label">
                          <span>Kapasitas Baterai Mobil</span>
                          <span style={{ fontWeight: 600 }}>{batteryCapacity} kWh</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="100" 
                          step="5"
                          value={batteryCapacity} 
                          onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                          className="calc-slider"
                        />
                      </div>

                      <div className="calc-row">
                        <div className="calc-label">
                          <span>State of Charge (Mulai)</span>
                          <span style={{ fontWeight: 600 }}>{startSoC}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max={Math.min(95, targetSoC - 5)} 
                          step="5"
                          value={startSoC} 
                          onChange={(e) => setStartSoC(Number(e.target.value))}
                          className="calc-slider"
                        />
                      </div>

                      <div className="calc-row">
                        <div className="calc-label">
                          <span>State of Charge (Target)</span>
                          <span style={{ fontWeight: 600 }}>{targetSoC}%</span>
                        </div>
                        <input 
                          type="range" 
                          min={Math.max(5, startSoC + 5)} 
                          max="100" 
                          step="5"
                          value={targetSoC} 
                          onChange={(e) => setTargetSoC(Number(e.target.value))}
                          className="calc-slider"
                        />
                      </div>

                      <div className="calc-results">
                        <div className="calc-result-item">
                          <span style={{ color: 'var(--text-secondary)' }}>Energi Dibutuhkan:</span>
                          <span className="calc-result-val">{energyNeeded.toFixed(1)} kWh</span>
                        </div>
                        <div className="calc-result-item">
                          <span style={{ color: 'var(--text-secondary)' }}>Estimasi Durasi:</span>
                          <span className="calc-result-val">{formattedDuration}</span>
                        </div>
                        <div className="calc-result-item" style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                          <span>Estimasi Tarif:</span>
                          <span className="calc-result-val price">Rp {Math.round(energyCost).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="booking-btn"
                      onClick={handleBooking}
                      disabled={selectedConnector.status === 'Offline'}
                    >
                      Pesan Slot Pengisian
                    </button>
                    <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--text-muted)', marginTop: '10px' }}>
                      Anda belum dikenakan biaya. Pengisian dibayar saat check-in.
                    </p>
                  </>
                ) : (
                  <div className="booking-success-container">
                    <div className="success-icon-wrapper">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="success-title">Reservasi Berhasil!</h3>
                    
                    <div style={{ background: '#f7f7f7', border: '1px solid var(--border-color)', borderRadius: '12px', width: '100%', padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Kode Booking:</span>
                        <strong style={{ marginLeft: 'auto', color: 'var(--accent-green)' }}>{bookingCode}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Konektor:</span>
                        <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{selectedConnector.type} ({selectedConnector.power})</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Jadwal Kedatangan:</span>
                        <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{bookingTime}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Estimasi:</span>
                        <strong style={{ marginLeft: 'auto', color: 'var(--accent-green)' }}>Rp {(Math.round(totalCost)).toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    <div className="success-qr">
                      {/* Generates a stylized mock QR code layout */}
                      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="white"/>
                        {/* Position detection markers */}
                        <rect x="5" y="5" width="20" height="20" fill="black"/>
                        <rect x="9" y="9" width="12" height="12" fill="white"/>
                        <rect x="12" y="12" width="6" height="6" fill="black"/>

                        <rect x="75" y="5" width="20" height="20" fill="black"/>
                        <rect x="79" y="9" width="12" height="12" fill="white"/>
                        <rect x="82" y="12" width="6" height="6" fill="black"/>

                        <rect x="5" y="75" width="20" height="20" fill="black"/>
                        <rect x="9" y="79" width="12" height="12" fill="white"/>
                        <rect x="12" y="82" width="6" height="6" fill="black"/>
                        
                        {/* Simulated QR matrix */}
                        <rect x="35" y="10" width="5" height="5" fill="black"/>
                        <rect x="45" y="5" width="10" height="5" fill="black"/>
                        <rect x="60" y="15" width="5" height="10" fill="black"/>
                        <rect x="30" y="30" width="15" height="5" fill="black"/>
                        <rect x="10" y="35" width="5" height="15" fill="black"/>
                        <rect x="20" y="50" width="10" height="10" fill="black"/>
                        <rect x="40" y="45" width="5" height="5" fill="black"/>
                        <rect x="55" y="35" width="10" height="5" fill="black"/>
                        <rect x="70" y="30" width="5" height="20" fill="black"/>
                        <rect x="85" y="45" width="10" height="5" fill="black"/>
                        <rect x="80" y="60" width="5" height="10" fill="black"/>
                        <rect x="50" y="65" width="15" height="5" fill="black"/>
                        <rect x="35" y="75" width="5" height="15" fill="black"/>
                        <rect x="45" y="85" width="15" height="5" fill="black"/>
                        <rect x="65" y="75" width="5" height="5" fill="black"/>
                        <rect x="75" y="80" width="10" height="5" fill="black"/>
                      </svg>
                    </div>

                    <p className="success-info">
                      Tunjukkan kode QR ini ke mesin charger saat tiba di lokasi untuk memulai pengisian.
                    </p>

                    <button 
                      className="success-reset-btn"
                      onClick={() => setIsBooked(false)}
                    >
                      Pesan Kembali / Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
