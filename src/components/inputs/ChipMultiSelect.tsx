"use client";

import { useId } from "react";

interface ChipMultiSelectProps {
  label?: string;
  options: readonly string[];
  value: string[];
  max?: number;
  onChange: (next: string[]) => void;
  className?: string;
}

export default function ChipMultiSelect({ 
  label, 
  options, 
  value, 
  max, 
  onChange, 
  className = "" 
}: ChipMultiSelectProps) {
  const id = useId();
  
  const handleToggle = (option: string) => {
    const isSelected = value.includes(option);
    
    if (isSelected) {
      onChange(value.filter(v => v !== option));
    } else {
      if (max && value.length >= max) {
        return; // Don't add if at max limit
      }
      onChange([...value, option]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, option: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle(option);
    }
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-900">
            {label}
          </label>
          {max && (
            <span className="text-xs text-gray-500">
              {value.length}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option);
          const isDisabled = !isSelected && max && value.length >= max;
          
          return (
            <button
              key={option}
              type="button"
              role="switch"
              aria-pressed={isSelected}
              aria-describedby={max ? `${id}-counter` : undefined}
              disabled={!!isDisabled}
              onClick={() => handleToggle(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              className={`
                chip transition-all                 ${isSelected ? 'chip--on' : 'chip--off'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              `}
            >
              {isSelected && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {option}
            </button>
          );
        })}
      </div>
      
      {max && (
        <span id={`${id}-counter`} className="sr-only">
          {value.length} of {max} selected
        </span>
      )}
    </div>
  );
}