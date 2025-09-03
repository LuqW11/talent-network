"use client";

import { useState, useRef, useId, type KeyboardEvent } from "react";
import { normaliseTech } from "~/lib/validation";

interface TagSearchProps {
  suggestions: string[];
  value: string[];
  onAdd: (tag: string) => void;
  disabled?: boolean;
  placeholder?: string;
  synonyms?: Record<string, string>;
}

export default function TagSearch({
  suggestions,
  value,
  onAdd,
  disabled = false,
  placeholder = "Search or type to add...",
  synonyms = {}
}: TagSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Filter suggestions based on query and exclude already selected
  const filteredSuggestions = suggestions
    .filter(s => !value.includes(s))
    .filter(s => 
      query.length === 0 || 
      s.toLowerCase().startsWith(query.toLowerCase()) ||
      s.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8); // Limit results

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(newQuery.length > 0 || filteredSuggestions.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          addTag(filteredSuggestions[selectedIndex]);
        } else if (query.trim().length >= 2) {
          addTag(query.trim());
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
    }
  };

  const addTag = (tag: string) => {
    const normalized = normaliseTech(tag);
    if (normalized.length >= 2 && normalized.length <= 20 && !value.includes(normalized)) {
      onAdd(normalized);
      setQuery("");
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsOpen(query.length > 0 || filteredSuggestions.length > 0);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns={isOpen ? listboxId : undefined}
        aria-autocomplete="list"
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li key={suggestion} role="option" aria-selected={index === selectedIndex}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}