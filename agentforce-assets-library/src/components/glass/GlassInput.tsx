'use client';

import { ReactNode, InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function GlassInput({ 
  icon,
  className = '', 
  containerClassName = '',
  ...props 
}: GlassInputProps) {
  return (
    <div className={`relative ${containerClassName}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg py-2.5 ${
          icon ? 'pl-10' : 'pl-4'
        } pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
