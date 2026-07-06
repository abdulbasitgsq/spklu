import React from 'react';
import { Zap, Search, Menu, User, Globe } from 'lucide-react';

export default function Header({ searchVal, onSearchChange }) {
  return (
    <header className="main-header">
      <div className="logo-container" onClick={() => onSearchChange('')}>
        <Zap className="logo-icon" size={28} fill="currentColor" />
        <span className="logo-text">ChargeBnb</span>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Cari nama SPKLU..." 
          value={searchVal}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="search-button">
          <Search size={18} />
        </button>
      </div>

      <div className="user-menu">
        <Globe size={18} style={{ color: 'var(--text-primary)', cursor: 'pointer' }} />
        
        <div className="profile-trigger">
          <Menu size={18} style={{ color: 'var(--text-primary)' }} />
          <div className="avatar">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
