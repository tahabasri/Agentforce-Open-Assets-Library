'use client';

import { ReactNode } from 'react';

interface GlassSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'intense';
}

export default function GlassSection({ 
  children, 
  className = '', 
  variant = 'default'
}: GlassSectionProps) {
  
  const variantClasses = {
    default: 'glass',
    light: 'glass-light',
    intense: 'glass-intense',
  };
  
  const baseClass = variantClasses[variant];
  
  return (
    <section className={`rounded-2xl ${baseClass} ${className}`}>
      {children}
    </section>
  );
}
