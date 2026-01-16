
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "size-10" }) => {
  return (
    <div className={`relative ${className} group`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current">
        {/* Hexagonal Outer Frame */}
        <path 
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
          className="stroke-primary/20"
          strokeWidth="2"
        />
        {/* Animated Inner Hexagon */}
        <path 
          d="M50 12 L83 31 L83 69 L50 88 L17 69 L17 31 Z" 
          className="stroke-primary group-hover:stroke-white transition-colors duration-500"
          strokeWidth="4"
          strokeDasharray="200"
          strokeDashoffset="0"
        >
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" fill="freeze" />
        </path>
        {/* Styled 'H' Glyph */}
        <path 
          d="M35 35 L35 65 M65 35 L65 65 M35 50 L65 50" 
          className="stroke-primary group-hover:stroke-white transition-colors duration-500"
          strokeWidth="6"
          strokeLinecap="square"
        />
      </svg>
      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
    </div>
  );
};

export default Logo;
