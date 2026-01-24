
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "size-10" }) => {
  return (
    <div className={`relative ${className} group cursor-pointer`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-none drop-shadow-[0_0_15px_rgba(0,255,127,0.5)]">
        {/* Outer Kinetic Rings */}
        <circle cx="50" cy="50" r="48" className="stroke-primary/10" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="42" className="stroke-primary/20 animate-pulse-slow" strokeWidth="1" />
        
        {/* Barbell Element - Catchy Vibe Enhancement */}
        <g className="stroke-white/80" strokeWidth="2.5" strokeLinecap="round">
           <path d="M20 50 L80 50" className="opacity-40" />
           <rect x="15" y="40" width="4" height="20" rx="1" fill="currentColor" className="text-white" />
           <rect x="81" y="40" width="4" height="20" rx="1" fill="currentColor" className="text-white" />
           <rect x="10" y="42" width="3" height="16" rx="1" className="fill-primary/40 stroke-none" />
           <rect x="87" y="42" width="3" height="16" rx="1" className="fill-primary/40 stroke-none" />
        </g>

        {/* The Core Heart - Neural/Biological Fusion */}
        <path 
          d="M50 72 C 25 58, 20 35, 50 35 C 80 35, 75 58, 50 72" 
          className="fill-primary/20 stroke-primary animate-beat"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        
        {/* Pulse Synapse Line */}
        <path 
          d="M35 50 H42 L46 40 L50 60 L54 50 H65" 
          className="stroke-white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
        </path>

        {/* Glowing Nodes */}
        <circle cx="50" cy="35" r="2" fill="#00FF7F" className="animate-ping" />
        <circle cx="20" cy="50" r="1.5" fill="white" />
        <circle cx="80" cy="50" r="1.5" fill="white" />
      </svg>
      {/* Dynamic Glow Field */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700 rounded-full scale-150"></div>
    </div>
  );
};

export default Logo;
