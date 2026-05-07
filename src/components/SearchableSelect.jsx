import React, { useState, useEffect, useRef } from 'react';

const SearchableSelect = ({ label, options, value, onChange, placeholder, error, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filtrar opciones cuando cambia searchTerm
  useEffect(() => {
    const filtered = options.filter(opt =>
      opt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(0);
  }, [searchTerm, options]);

  // Cerrar dropdown si hace click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
      default:
        break;
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium dp-text-secondary mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition flex items-center justify-between cursor-pointer ${
            error ? 'border-red-500' : value ? 'border-green-500' : 'border-gray-300'
          } bg-white`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder || 'Busca o selecciona...'}
            value={isOpen ? searchTerm : value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className="w-full focus:outline-none bg-transparent text-gray-700"
          />
          <svg
            className={`w-5 h-5 dp-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2.5 cursor-pointer transition ${
                  index === highlightedIndex
                    ? 'bg-yellow-100 dp-text-main font-medium'
                    : 'dp-text-main hover:bg-gray-50'
                } ${value === option ? 'bg-yellow-50 border-l-4 border-yellow-400 pl-3' : ''}`}
              >
                {value === option && <span className="text-green-600 mr-2">✓</span>}
                {option}
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {isOpen && filteredOptions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center dp-text-secondary">
            No se encontraron resultados
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
