'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface GlassNavItemProps {
  href: string;
  icon?: ReactNode;
  isActive?: boolean;
  children: ReactNode;
  className?: string;
}

export default function GlassNavItem({ 
  href, 
  icon, 
  isActive = false,
  children, 
  className = '' 
}: GlassNavItemProps) {
  
  const activeClass = isActive 
    ? 'glass-intense bg-blue-600/70 text-white' 
    : 'glass-light hover:glass-intense text-white/80 hover:text-white';
  
  return (
    <Link 
      href={href}
      className={`flex items-center p-3 rounded-lg transition-all glass-interactive ${activeClass} ${className}`}
    >
      {icon && <div className="text-xl mr-3">{icon}</div>}
      <div className="font-medium">{children}</div>
    </Link>
  );
}
