"use client";

import { useState, useRef, useEffect } from "react";
import { worldwideLocations } from "~/lib/locations";

interface LocationSearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationSearch({ 
  value = "", 
  onChange, 
  placeholder = "Search for your location...",
  className = ""
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([...worldwideLocations]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter locations based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations([...worldwideLocations]);
    } else {
      const filtered = worldwideLocations.filter(location =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm]);

  // Update internal search term when value prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleLocationSelect = (location: string) => {
    setSearchTerm(location);
    onChange(location);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} pr-8`}
        autoComplete="off"
      />
      
      {/* Search icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredLocations.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No locations found matching &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            filteredLocations.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => handleLocationSelect(location)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-none bg-transparent"
              >
                {location}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}