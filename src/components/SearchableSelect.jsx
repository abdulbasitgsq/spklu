import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export default function SearchableSelect({
  options = [],
  value = '',
  onChange,
  placeholder = 'Pilih opsi...',
  emptyMessage = 'Tidak ada hasil ditemukan',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset local search query when dropdown opens or closes
  useEffect(() => {
    if (!isOpen) {
      setSearchVal('');
    }
  }, [isOpen]);

  // Filter options based on local search query
  const filteredOptions = options.filter(opt => 
    String(opt).toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleSelectOption = (optVal) => {
    onChange(optVal);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className={`searchable-select-container ${disabled ? 'disabled' : ''}`} ref={containerRef}>
      {/* Input / Button Trigger */}
      <div 
        className={`searchable-select-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`trigger-text ${!value ? 'placeholder-text' : ''}`}>
          {value || placeholder}
        </span>
        
        <div className="trigger-icons">
          {value && !disabled && (
            <button className="clear-btn" onClick={handleClear} title="Hapus pilihan">
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
        </div>
      </div>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="searchable-select-dropdown">
          {/* Search Input Box */}
          <div className="dropdown-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Options Scroll Box */}
          <div className="dropdown-options-list">
            {/* Option to clear/reset selection */}
            {placeholder && (
              <div 
                className={`dropdown-option-item ${!value ? 'selected' : ''}`}
                onClick={() => handleSelectOption('')}
              >
                {placeholder}
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="dropdown-empty-message">{emptyMessage}</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  className={`dropdown-option-item ${value === opt ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(opt)}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
