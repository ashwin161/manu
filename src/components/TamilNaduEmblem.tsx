import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'gold' | 'monochrome';
}

/**
 * Official Tamil Nadu State Crest / Gopuram Vector Insignia
 * Represents the iconic Srivilliputhur Andal Temple Gopuram with the National Emblem Ashoka Chakra.
 */
export const TamilNaduEmblem: React.FC<EmblemProps> = ({ 
  className = '', 
  size = 32, 
  variant = 'light' 
}) => {
  const isLight = variant === 'light';
  const isGold = variant === 'gold';

  const strokeColor = isGold ? '#f59e0b' : isLight ? '#ffffff' : '#047857';
  const fillColor = isGold ? '#d97706' : isLight ? '#ffffff' : '#047857';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Tamil Nadu Government Official Emblem"
    >
      {/* Outer Emblem Ring */}
      <circle cx="50" cy="50" r="46" stroke={strokeColor} strokeWidth="2.5" opacity={isLight ? 0.35 : 0.25} />
      <circle cx="50" cy="50" r="43" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="2 3" opacity={0.6} />

      {/* Outer Sun Rays / Radiance Ring */}
      <g opacity="0.35" stroke={strokeColor} strokeWidth="1.2">
        <line x1="50" y1="5" x2="50" y2="8" />
        <line x1="50" y1="92" x2="50" y2="95" />
        <line x1="5" y1="50" x2="8" y2="50" />
        <line x1="92" y1="50" x2="95" y2="50" />
        <line x1="18" y1="18" x2="20" y2="20" />
        <line x1="80" y1="80" x2="82" y2="82" />
        <line x1="18" y1="82" x2="20" y2="80" />
        <line x1="80" y1="20" x2="82" y2="18" />
      </g>

      {/* Base Arch Gateway and Tiered Gopuram */}
      {/* Kalasams (Finials at top) */}
      <g fill={fillColor}>
        <circle cx="50" cy="15" r="2.2" />
        <circle cx="43" cy="16.5" r="1.6" />
        <circle cx="57" cy="16.5" r="1.6" />
        <circle cx="37" cy="18" r="1.2" />
        <circle cx="63" cy="18" r="1.2" />
      </g>

      {/* Tier 1 - Top Pinnacle */}
      <path
        d="M45 19 H55 L57 23 H43 Z"
        fill={fillColor}
        opacity="0.95"
      />

      {/* Tier 2 */}
      <path
        d="M41 24 H59 L61 30 H39 Z"
        fill={fillColor}
        opacity="0.9"
      />

      {/* Tier 3 */}
      <path
        d="M37 31 H63 L65 38 H35 Z"
        fill={fillColor}
        opacity="0.85"
      />

      {/* Tier 4 */}
      <path
        d="M33 39 H67 L70 48 H30 Z"
        fill={fillColor}
        opacity="0.9"
      />

      {/* Tier 5 */}
      <path
        d="M28 49 H72 L75 60 H25 Z"
        fill={fillColor}
        opacity="0.95"
      />

      {/* Main Base Portal / Arched Gateway */}
      <path
        d="M23 61 H77 L79 78 H21 Z"
        fill={fillColor}
        opacity="0.95"
      />

      {/* Central Sanctum Entrance Arch Cutout */}
      <path
        d="M42 78 V66 C42 61.5 58 61.5 58 66 V78 Z"
        fill={isLight ? '#065f46' : '#ffffff'}
      />

      {/* Ashoka Chakra in Center Base */}
      <circle cx="50" cy="71" r="5" stroke={strokeColor} strokeWidth="1.2" />
      <circle cx="50" cy="71" r="1.2" fill={strokeColor} />
      <g stroke={strokeColor} strokeWidth="0.8" opacity="0.8">
        <line x1="50" y1="66" x2="50" y2="76" />
        <line x1="45" y1="71" x2="55" y2="71" />
        <line x1="46.5" y1="67.5" x2="53.5" y2="74.5" />
        <line x1="46.5" y1="74.5" x2="53.5" y2="67.5" />
      </g>

      {/* Decorative Horizontal Moldings on Gopuram */}
      <g stroke={isLight ? '#065f46' : '#ffffff'} strokeWidth="0.8" opacity="0.6">
        <line x1="44" y1="21" x2="56" y2="21" />
        <line x1="40" y1="27" x2="60" y2="27" />
        <line x1="36" y1="34.5" x2="64" y2="34.5" />
        <line x1="32" y1="43.5" x2="68" y2="43.5" />
        <line x1="27" y1="54.5" x2="73" y2="54.5" />
      </g>

      {/* Plinth Base Line */}
      <rect x="18" y="78" width="64" height="4" rx="1" fill={fillColor} />
      <rect x="14" y="82" width="72" height="3" rx="1.5" fill={fillColor} opacity="0.8" />
    </svg>
  );
};
