'use client';

import React from 'react';
import { IconAction, IconTopic, IconAgent } from '@/utils/iconUtils';

interface AssetIconProps {
  assetType: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AssetIcon({ assetType, width = 80, height = 80, className = "" }: AssetIconProps) {
  const iconClasses = `text-white ${className}`;
  const containerStyle = { width: `${width}px`, height: `${height}px` };
  
  switch (assetType.toLowerCase()) {
    case 'action':
    case 'actions':
      return (
        <div style={containerStyle} className={iconClasses}>
          <IconAction />
        </div>
      );
    case 'topic':
    case 'topics':
      return (
        <div style={containerStyle} className={iconClasses}>
          <IconTopic />
        </div>
      );
    case 'agent':
    case 'agents':
      return (
        <div style={containerStyle} className={iconClasses}>
          <IconAgent />
        </div>
      );
    default:
      return (
        <div style={containerStyle} className={iconClasses}>
          <IconAction />
        </div>
      );
  }
}
