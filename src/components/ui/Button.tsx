"use client";

import { forwardRef, useRef, useCallback } from "react";
import Spinner from "./Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'black' | 'white' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  ripple?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'black',
  size = 'md',
  isLoading = false,
  ripple = true,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  onPointerDown,
  ...props
}, ref) => {
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handleRipple = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!ripple || !rippleRef.current) {
      onPointerDown?.(e);
      return;
    }

    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onPointerDown?.(e);
      return;
    }

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // Remove existing ripple
    const existingRipple = rippleRef.current.querySelector('.ripple-circle');
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create new ripple
    const rippleCircle = document.createElement('span');
    rippleCircle.className = 'ripple-circle absolute rounded-full bg-white/30 pointer-events-none animate-ripple';
    rippleCircle.style.width = rippleCircle.style.height = `${size}px`;
    rippleCircle.style.left = `${x}px`;
    rippleCircle.style.top = `${y}px`;

    rippleRef.current.appendChild(rippleCircle);

    // Clean up after animation
    setTimeout(() => {
      if (rippleCircle.parentNode) {
        rippleCircle.remove();
      }
    }, 600);

    onPointerDown?.(e);
  }, [ripple, onPointerDown]);

  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none motion-safe:hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-[-25deg] motion-safe:hover:before:translate-x-[100%] before:transition-transform before:duration-700 before:ease-out";

  const variantClasses = {
    black: "bg-black text-white border border-black/10 motion-safe:hover:shadow-md active:shadow-sm",
    white: "bg-white text-black border border-gray-200 motion-safe:hover:shadow-sm active:shadow-none hover:border-gray-300",
    outline: "bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 motion-safe:hover:shadow-sm",
    ghost: "bg-transparent text-gray-900 border border-transparent hover:bg-gray-50 active:bg-gray-100"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-3 text-base"
  };

  const isDisabled = (disabled ?? false) || isLoading;

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={isLoading}
      onPointerDown={handleRipple}
      {...props}
    >
      {/* Ripple container */}
      <span
        ref={rippleRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
      
      {isLoading && (
        <Spinner 
          className={`${leftIcon || children ? 'mr-2' : ''}`}
        />
      )}
      
      {!isLoading && leftIcon && (
        <span className={`${children ? 'mr-2' : ''}`}>
          {leftIcon}
        </span>
      )}

      {!isLoading && children}
      
      {!isLoading && rightIcon && (
        <span className={`${children ? 'ml-2' : ''}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;