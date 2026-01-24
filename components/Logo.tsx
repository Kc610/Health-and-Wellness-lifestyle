
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "size-10" }) => {
  return (
    <div className={`relative ${className} group cursor-pointer transition-transform duration-500 hover:scale-110`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-none drop-shadow-[0_0_12px_rgba(0,255,127,0.4)]">
        {/* Kinetic Tech Rings */}
        <circle cx="50" cy="50" r="46" className="stroke-primary/10" strokeWidth="0.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" className="stroke-primary/20 animate-pulse-slow" strokeWidth="1" />
        
        {/* Aesthetic Barbell Path - Lifting Vibe */}
        <g className="stroke-white" strokeWidth="3" strokeLinecap="square">
           <path d="M15 50 H85" className="opacity-30" />
           <path d="M12 40 V60" className="stroke-primary" strokeWidth="4" />
           <path d="M6 42 V58" className="stroke-primary/40" strokeWidth="3" />
           <path d="M88 40 V60" className="stroke-primary" strokeWidth="4" />
           <path d="M94 42 V58" className="stroke-primary/40" strokeWidth="3" />
        </g>

        {/* The Biological Core (Heart) */}
        <path 
          d="M50 75 C 22 60, 22 35, 50 35 C 78 35, 78 60, 50 75" 
          className="fill-primary/5 stroke-primary animate-beat"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        
        {/* High-Frequency Pulse */}
        <path 
          d="M38 50 H44 L48 38 L52 62 L56 50 H62" 
          className="stroke-white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Neural Terminals */}
        <circle cx="50" cy="35" r="2.5" className="fill-primary animate-ping" />
      </svg>
      {/* Glow aura */}
      <div className="absolute inset-0 bg-primary/20 blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000 scale-150 rounded-full"></div>
    </div>
  );
};

export default Logo;
