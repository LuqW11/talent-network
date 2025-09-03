"use client";

import { useEffect, useState } from "react";

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  showUndo?: boolean;
  onUndo?: () => void;
  duration?: number;
}

export default function Snackbar({ 
  message, 
  isVisible, 
  onClose, 
  showUndo, 
  onUndo, 
  duration = 3000 
}: SnackbarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="snackbar-wrap">
      <div 
        className={`
          bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 
          transition-all duration-200 max-w-sm
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        role="status"
        aria-live="polite"
      >
        <span className="text-sm flex-1">{message}</span>
        {showUndo && onUndo && (
          <button
            onClick={onUndo}
            className="text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
          >
            Undo
          </button>
        )}
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded p-0.5"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}