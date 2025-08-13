'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'intense';
  interactive?: boolean;
  floating?: boolean;
  shimmer?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '', 
  variant = 'default',
  interactive = false,
  floating = false,
  shimmer = false,
}: GlassCardProps) {
  
  const variantClasses = {
    default: 'glass',
    light: 'glass-light',
    intense: 'glass-intense',
  };
  
  const baseClass = variantClasses[variant];
  const interactiveClass = interactive ? 'glass-interactive' : '';
  const floatingClass = floating ? 'animate-float' : '';
  const shimmerClass = shimmer ? 'animate-shimmer' : '';
  
  return (
    <div className={`rounded-xl ${baseClass} ${interactiveClass} ${floatingClass} ${shimmerClass} ${className}`}>
      {children}
    </div>
  );
}
