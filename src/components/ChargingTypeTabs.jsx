import React from 'react';
import { chargingTypeInfo } from '../data/showcaseData';

const TAB_ORDER = ['slow', 'medium', 'fast', 'highspeed'];

export default function ChargingTypeTabs({ activeType, onChangeType }) {
  return (
    <div className="charging-tabs">
      {TAB_ORDER.map((typeKey) => {
        const info = chargingTypeInfo[typeKey];
        const isActive = activeType === typeKey;
        return (
          <button
            key={typeKey}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChangeType(typeKey)}
            style={{
              '--tab-color': info.color,
              '--tab-color-light': info.colorLight,
            }}
          >
            <span className="tab-dot" style={{ backgroundColor: info.color }} />
            <span className="tab-label">{info.label}</span>
            <span className="tab-power">{info.power}</span>
          </button>
        );
      })}
    </div>
  );
}
