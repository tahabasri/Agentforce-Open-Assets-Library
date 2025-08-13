'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  shimmer?: boolean;
}

export default function GlassButton({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'medium',
  interactive = true,
  shimmer = false,
  ...props 
}: GlassButtonProps) {
  
  const variantClasses = {
    primary: 'glass-intense text-white bg-blue-600 bg-opacity-80',
    secondary: 'glass bg-opacity-70 border border-white/20',
    outline: 'bg-transparent border border-white/30 hover:bg-white/10',
  };
  
  const sizeClasses = {
    small: 'py-1.5 px-3 text-sm',
    medium: 'py-2.5 px-5',
    large: 'py-3 px-8 text-lg',
  };
  
  const baseClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const interactiveClass = interactive ? 'glass-interactive' : '';
  const shimmerClass = shimmer ? 'animate-shimmer' : '';
  
  return (
    <button 
      className={`rounded-lg font-medium transition-all ${baseClass} ${sizeClass} ${interactiveClass} ${shimmerClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
